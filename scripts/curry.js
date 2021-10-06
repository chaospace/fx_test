// function curry(f) {
//   return (a, ..._) => {
//     return _.length ? f(a, ..._) : (..._) => f(a, ..._);
//   };
//}

const curry =
  f =>
  (a, ..._) =>
    _.length ? f(a, ..._) : (..._) => f(a, ..._);

function curry2(f) {
  return (a, ..._) => {
    return _.length > 1
      ? f(a, ..._)
      : _.length === 1
      ? (...__) => f(a, _[0], ...__)
      : (b, ..._) => (_.length ? f(a, b, ..._) : (..._) => f(a, b, ..._));
  };
}

function curryN(n, f) {
  return function _recur(a, ..._) {
    return _.length >= n ? f(a, ..._) : (...__) => _recur(a, ..._, ...__);
  };
}

function add(a, b) {
  return a + b;
}

const curryAdd = curry(add);
const curry2Add = curry2(add);

const curryReduceAdd = curry((...args) => args.reduce(add));
const curryReduce2Add = curry2((...args) => args.reduce(add));

const reduceNCurryed = curryN(3, (...args) => args.reduce(add));

//console.log(curryReduceAdd(1, 4, 5, 6));

console.log("curryAdd(1)(2, 4)", curryAdd(1)(2, 4));
console.log("curry2Add(2)(3,20)", curry2Add(2)(3, 20));

function* keysLazy(obj) {
  for (const k in obj) yield k;
}

// let obj = {};
// const objGenerator = keysLazy(obj);
// console.log("done", objGenerator[Symbol.iterator]().next().done);
// console.log("iterator", !!objGenerator[Symbol.iterator]);
// console.log("curryReduce2Add(1)(2)", curryReduce2Add(1)(2, 22)(5));
// console.log("reduceNCurryed(1)(2)(6)(2)", reduceNCurryed(1)(2)(6)(2));

const emptyIterator = (function* () {})();
function emptyL() {
  return emptyIterator;
}

function toIter(iterable) {
  return iterable && iterable[Symbol.iterator]
    ? iterable[Symbol.iterator]()
    : emptyL();
}

const take = curry(function _take(l, iter) {
  if (l < 1) return [];
  let res = [];
  iter = toIter(iter);
  return (function recur() {
    let cur;
    while (!(cur = iter.next()).done) {
      const a = cur.value;
      if (a instanceof Promise) {
        return a
          .then(a => ((res.push(a), res).length == l ? res : recur()))
          .catch(e => (e == nop ? recur() : Promise.reject(e)));
      }
      res.push(a);
      if (res.length == l) return res;
    }
    return res;
  })();
});

const nop = Symbol.for("nop");
const go1 = (a, f) => (a instanceof Promise ? a.then(f) : f(a));
function go2(acc, a, f) {
  return a instanceof Promise
    ? a.then(
        a => f(acc, a),
        e => (e == nop ? acc : Promise.reject(e))
      )
    : f(acc, a);
}

function head(iter) {
  return go1(take(1, iter), ([h]) => h);
}

const go1Sync = (a, f) => f(a);

function reduce(f, acc, iter) {
  if (arguments.length == 1) return (..._) => reduce(f, ..._); // 함수만 오면 curry를 이용한 함수 리턴
  if (arguments.length == 2) return reduce(f, head((iter = toIter(acc))), iter); // 파라미터가 같이 오면 arguments에서 reduce의 시작값을 찾기위한 head요청 후 재귀시작
  iter = toIter(iter);
  return go1(acc, function recur(acc) {
    let cur;
    while (!(cur = iter.next()).done) {
      acc = go2(acc, cur.value, f);
      if (acc instanceof Promise) return acc.then(recur);
    }
    return acc;
  });
}

function go(..._) {
  return reduce(go1Sync, _);
}

function asyncInitValue() {
  return new Promise(resolve => {
    setTimeout(() => resolve(30), 100);
  });
}

function asyncCal(a) {
  const v = new Promise(resolve => {
    setTimeout(() => {
      resolve(a + 10);
    }, 1000);
  });
  return v;
}

// await 동작 테스트
function fire1() {
  return new Promise(resolve => setTimeout(() => resolve(30), 2000));
}

function fire2() {
  return new Promise(resolve => setTimeout(() => resolve(100), 2000));
}

// await을 내부에서 사용하지 않으면 promise를 반환하는 함수도 async를 넣어줄 필요가 없음
async function awaitThenTest() {
  mode = true;

  let res = await fire1()
    .then(() => mode || fire2())
    .catch(e => e);
  console.log("res", res);
}

//awaitThenTest();
go(asyncInitValue(), asyncCal, a => a + 3).then(a => console.log(a));

// async함수를 체인으로 실행하는 원리
/**
 reduce를 이용해서 시작값을 전달
 sync함수를 통해 반환되는 값이 promise라면 then이후 호출을 이어감.
*/
