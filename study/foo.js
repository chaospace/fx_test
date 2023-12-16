/**
 * 함수형에 기본은 함수 체이닝
 *  -> 이 체이닝이 리턴값이 아닌 콜백으로 이뤄진다는 점.
 *  -> 비동기를 사용하기 때문에 리턴값은 promise가 되기 쉽고
 *  -> go, pipe, reduce를 이용한 콜백체인을 통해 이어간다.
 */

const nop = Symbol.for("nop");
const emptyIter = (function* () {})();
const Symbolstop = Symbol.for("stop");

const emptyIterator = () => emptyIter;

const callSync = (params, fn) => fn(params);
const isPromise = (o) => o && o instanceof Promise;
const isIterable = (o) => o && o[Symbol.iterator];
const toIter = (o) => (isIterable(o) ? o[Symbol.iterator]() : emptyIterator());
const isStop = (o) => !!(o && o[Symbolstop]);
const isArray = (o) => o && Array.isArray(o);
const isString = (o) => typeof o === "string";
const nopCatchHandler = (e) => (e === nop ? nop : Promise.reject(e));
const noop = () => {};
const { log } = console;
//진행을 멈추기 위한 stop객체 반환 함수.
const stop = (value) => ({ [Symbolstop]: true, value });
const curry =
  (fn) =>
  (a, ..._) =>
    _.length ? fn(a, ..._) : (..._) => fn(a, ..._);

// 이터러블 값을 지정한 만큼 추출 후 반환
const take = curry((l, iter) => {
  const res = [];
  if (l < 1) return res;
  iter = toIter(iter);
  return (function recur() {
    let cur;
    while (!(cur = iter.next()).done) {
      const v = cur.value;
      if (isPromise(v)) {
        return v
          .then((r) => ((res.push(r), res).length >= l ? res : recur()))
          .catch((e) => (e === nop ? recur() : Promise.reject(e)));
      }
      res.push(v);
      if (res.length >= l) return res;
    }
    return res;
  })();
});

const takeAll = take(Infinity);

const last = (iter) => {
  if (isArray(iter) || isString(iter)) {
    return iter[iter.length - 1];
  }
  // 현재값은 무시하고 다음값만 리턴하는 처리로 마지막값을 추출.
  return reduce((_, a) => a, iter);
};

// 앞뒤 인자를 연결해 호출(promise객체 연결 가능)
const go1 = (a, fn) => (isPromise(a) ? a.then(fn) : fn(a));
const head = (iter) => go1(take(1, iter), ([h]) => h);
const reduceF = (fn, acc, next) =>
  isPromise(next)
    ? next.then(
        (r) => fn(acc, r),
        (e) => (e === nop ? acc : Promise.reject(e))
      )
    : fn(acc, next);

const reduce = (fn, acc, iter) => {
  if (acc === undefined) return (...args) => reduce(fn, ...args);
  if (!iter) return reduce(fn, head((iter = toIter(acc))), iter);
  iter = toIter(iter);

  //promise리턴 값은 재귀를 돌며 벗겨낸다.
  return go1(acc, function recur(acc) {
    let cur;

    //제공된 iterable객체가 완료될때 까지 반복
    while (!(cur = iter.next()).done) {
      acc = reduceF(fn, acc, cur.value);
      // 체이닝함수에 리턴값이 promise라면 재귀호출
      if (isPromise(acc)) return acc.then(recur);
    }

    return acc;
  });
};

const reduceS = (fn, acc, iter) => {
  if (acc === undefined) return (...args) => reduceS(fn, ...args);
  if (!iter) return reduceS(fn, head((iter = toIter(acc))), iter);
  iter = toIter(iter);

  return go1(acc, function recur(acc) {
    let cur;
    while (!isStop(acc) && !(cur = iter.next()).done) {
      acc = reduceF(fn, acc, cur.value);
      if (isPromise(acc)) return acc.then(recur);
    }
    return isStop(acc) ? acc.value : acc;
  });
};

const go = (...args) => reduce(callSync, args);
const goS = (...args) => reduceS(callSync, args);

/**
 * 체이닝 구성 시 promise처리
 * 한 곳에서 promise를 리턴하면 이후 연결된 모든 함수에 리턴 타입은 promise가 되며 이를 위해 promise에서 값을 가져오기 위한 처리가 필요하다.
 */

//함수 체이닝을 위한 제공
const pipe =
  (fn, ...fns) =>
  (...args) =>
    go(fn(...args), ...fns);

const map = curry(function* (fn, iter) {
  for (const o of toIter(iter)) {
    yield go1(o, fn);
    // yield isPromise(cur.value) ? cur.value.then(fn) : fn(cur.value);
  }
});

const filter = curry(function* (fn, iter) {
  iter = toIter(iter);
  let cur;
  while (!(cur = iter.next()).done) {
    //현재 값이 promise라면 필터적용 결과 역시 promise로 리턴
    const r = go1(cur.value, fn);
    if (isPromise(r)) {
      // 필터결과가 promise라면 기다려서 확인하고 값에 해당하는 primse를 전달한다.
      // filter결과가 false일 경우 nop을 전달해 reduce에서 이전 값을 사용하게 함
      yield r.then((valid) => (valid ? cur.value : Promise.reject(nop)));
    } else if (r) {
      yield cur.value;
    }
  }
});

const range = function* (start = 0, stop = start, step = 1) {
  if (stop === start) start = 0;
  if (step === 1 && start > stop) {
    step *= -1;
  }

  if (start < stop) {
    while (start < stop) {
      yield start;
      start += step;
    }
  } else {
    while (start > stop) {
      yield start;
      start += step;
    }
  }
};

const find = curry((fn, iter) => head(filter(fn, iter)));

const add = (a, b) => {
  return a + b;
};

// go([1, 2, 3, 4, 5], reduce(add), log);

// const pipeF = pipe(add, log);
// pipeF(10, 29);

/* go(
  [1, 2, 3, 4, 5, 6],
  map((v) => v * v),
  filter((v) => v % 2 > 0),
  takeAll,
  log
); */

// promise가 전달되면 어떻게 할까..

/* go(
  [1, 2, 3],
  map((v) => Promise.resolve(v + v)),
  filter((v) => v > 2),
  take(2),
  (r) => {
    log("최종", r);
  }
); */

const revealPromise = (acc) => {
  acc = isPromise(acc) ? acc.then(toIter) : toIter(acc);
  if (isPromise(acc)) return acc.then(revealPromise);
  return acc;
};

go([1, 2, 3], (a) => Promise.resolve(a), revealPromise, log);

// pipe
// Promise.resolve([1,2,3])
// 시작부터 async값을 사용할 수 있을까?
// log("last", last("aaa"));
// log("last", last([1, 2, 3, 4]));
/* 
async function foo() {
  log("last", await last([1, 2, 3, 4, Promise.resolve(5)]));
}
foo();
*/

/* 
reduce((_, a) => {
  log("a", a);
}, range(10, 0));
*/

/* log(
  "reduceS",
  reduceS(
    (a, b) => {
      const res = a + b;
      return res > 9 ? stop(res) : res;
    },
    [1, 2, 3, 4, 5]
  )
);

log(
  "goS",
  goS(
    1,
    (a) => (a % 2 ? stop(a) : a),
    (a) => a + 10
  )
);

const nameSearch = find((a) => a.name === "chaospace");

log(
  nameSearch([
    {
      name: "nick",
      age: 30,
    },
    {
      name: "chaospace",
      age: 10,
    },
  ])
);
 */
const takeL = curry(function* (l, iter) {
  if (l < 1) return;
  for (const a of toIter(iter)) {
    if (isPromise(a)) {
      yield a.then((a) => (--l > -1 ? a : Promise.reject(nop)));
    } else {
      yield (--l, a);
    }
    if (l < 0) break;
  }
});

//체이닝 중간에 별도 행동을 연산을 확인하고
//이전 값으로 체이닝을 이어갈 수 있음.
const tap = (fn, ...fs) => {
  return (a, ...as) => go1(reduce(callSync, fn(a, ...as), fs), (_) => a);
};

const evenFilter = (a) => {
  return a % 2 === 0 ? Promise.reject(nop) : Promise.resolve(a);
};

//모든 함수는 체이닝이라
//최종 리턴값이 promise라면 catch로 예외처리 가능.
(async function () {
  const res = await go(range(10), map(evenFilter), takeL(5), reduce(add)).catch(
    (e) => e
  );
  log("res", res);
})();

go(
  1,
  (a) => a + 5,
  tap(
    (a) => Promise.resolve(10 + a),
    (a) => log("tap", a)
  ),
  (a) => a + 1,
  (a) => log("tap-end", a)
);

const slice = (fn, ...fns) => {
  return (a, ...as) => go1(reduce(callSync, fn(a, ...as), fns), () => a);
};

//each는 나쁘지 않은데 리턴값이 있는게 애매모호 할 듯.
//함수 체이닝을 생각하면 리턴이 없어도 문제가 될듯.
const each = curry((fn, iter) => {
  return takeAll(map((a) => go1(fn(a), () => a), iter));
});
const eachL = curry((fn, iter) => {
  return map(tap(fn), iter);
});

// console.log(
//   "each---",
//   each((a) => {
//     log("each", a + 1);
//     return a + 1;
//   }, toIter([1, 2, 3, 4]))
// );

/* const eachTest = async () => {
  const res = await go(
    [1, 2, 3, 4],
    eachL((a) => log(a)),
    take(2)
  );
  console.log("each-test", res);
};
eachTest(); */

/**
 * 오브젝트 속성 설정 함수
 */

const object = (iter) => {
  return reduce((obj, [key, value]) => ((obj[key] = value), obj), {}, iter);
};

const entriesL = function* (obj) {
  for (const key in obj) yield [key, obj[key]];
};

const entries = (obj) => takeAll(entriesL(obj));

const mapEntriesL = curry(function* (fn, iter) {
  for (const [key, value] of toIter(iter)) {
    yield go1(go1(value, fn), (nValue) => [key, nValue]);
  }
});

const mapEntries = curry((fn, iter) => takeAll(mapEntriesL(fn, iter)));

/* go(
  { name: "chaos", age: 20 },
  entriesL,
  mapEntries((a) => Promise.resolve(`${a}_a`)),
  object
).then(log); */

//unique처리
const uniqueByL = curry((fn, iter) => {
  const s = new Set();
  return go1(iter, filter(pipe(fn, (b) => (s.has(b) ? false : s.add(b)))));
});

const uniqueBy = curry((fn, iter) => {
  return isIterable(iter)
    ? takeAll(uniqueByL(fn, iter))
    : object(uniqueByL((e) => fn(last(e)), entriesL(iter)));
});

const identity = (a) => a;
const unique = (a) => uniqueBy(identity, a);
const uniqueL = (a) => uniqueByL(identity, a);

/**
 * 원소추가
 * 가져올 때는 take를 이용해 가져오는 수를 지정한다.
 */
const appendL = curry(function* (a, iter) {
  yield* iter;
  yield a;
});
const append = curry((a, iter) => {
  return takeAll(appendL(a, iter));
});

log("unique", unique([1, 2, 3, 4, 1, 2, 3, 4, 5]));
// log("entries", entries({ a: 1, b: 2, c: 3, d: 1, e: 2 }));
log("append", append("c", ["a", "d", "e"]));
