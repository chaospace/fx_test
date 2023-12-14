const nop = Symbol.for("nop");
const emptyIter = (function* () {})();

const emptyIterator = () => emptyIter;

const callSync = (params, fn) => fn(params);
const isPromise = (o) => o && o instanceof Promise;
const isIterator = (o) => o && o[Symbol.iterator];
const toIter = (o) => (isIterator(o) ? o[Symbol.iterator]() : emptyIterator());
const nopCatchHandler = (e) => (e === nop ? nop : Promise.reject(e));

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

const head = (iter) => callSync(take(1, iter), ([h]) => h);
const reduceF = (fn, acc, next) =>
  isPromise(next)
    ? next.then((r) => fn(acc, r)).catch(nopCatchHandler)
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
      // 체이닝함수에 리턴값이 promise라면 완료를 기다림.
      if (isPromise(acc)) return acc.then(recur);
    }

    return acc;
  });
};

const go = (...args) => reduce((a, fn) => fn(a), args);
const go1 = (a, fn) => (isPromise(a) ? a.then(fn) : fn(a));

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
  iter = toIter(iter);
  let cur;
  while (!(cur = iter.next()).done) {
    yield go1(cur.value, fn);
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
      // filter결과가 false일 경우 어떤 값을 리턴해야 할까..
      yield r.then((valid) => (valid ? cur.value : Promise.reject(nop)));
    } else if (r) {
      yield cur.value;
    }
  }
});

const add = (a, b) => a + b;

// go([1, 2, 3, 4, 5], reduce(add), console.log);

const pipeF = pipe(add, console.log);
pipeF(10, 29);

go(
  [1, 2, 3, 4, 5, 6],
  map((v) => v * v),
  filter((v) => v > 4),
  take(Infinity),
  console.log
);

// promise가 전달되면 어떻게 할까..

go(
  [1, 2, 3],
  map((v) => Promise.resolve(v + v)),
  filter((v) => v > 2),
  take(2),
  (r) => {
    console.log("최종", r);
  }
);

const revealPromise = (acc) => {
  acc = isPromise(acc) ? acc.then(toIter) : toIter(acc);
  if (isPromise(acc)) return acc.then(revealPromise);
  return acc;
};

go([1, 2, 3], (a) => Promise.resolve(a), revealPromise, console.log);

// pipe
// Promise.resolve([1,2,3])
// 시작부터 async값을 사용할 수 있을까?
