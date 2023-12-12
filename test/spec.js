const { curry, isIterable } = require("./common.js");
const { range, filter, reduce, map, pipe, go, take } = require("./base.js");
const { cFilter, cReduce, cMap, cTake, join } = require("./currying.js");
const L = require("./lazy.js");

const add = (a, b) => a + b;

function* gen() {
  yield 2;
  if (false) yield 3;
  yield 4;
}

const products = [
  { name: "반팔티", price: 15000 },
  { name: "긴팔티", price: 20000 },
  { name: "핸드폰케이스", price: 15000 },
  { name: "후드티", price: 30000 },
  { name: "바지", price: 25000 },
];

function testMap() {
  console.log(map((a) => a * a, gen()));
}

function testReduce() {
  console.log(
    reduce(
      add,
      map(
        (p) => p.price,
        filter((p) => p.price < 20000, products)
      )
    )
  );
}

function testPipe() {
  const f = pipe(
    add,
    (a) => a + 10,
    (a) => a + 100
  );
  console.log(f(0, 1));
}

//
function testGo() {
  go(
    add(0, 1),
    (a) => a + 10,
    (a) => a + 100,
    console.log
  );
}

function testCurryGo() {
  go(
    products,
    cFilter((p) => p.price > 10000),
    cMap((p) => p.price),
    cReduce(add),
    console.log
  );
}

function testRange() {
  const list = range(4);
  const lazyList = L.range(4);
  console.log(list);
  console.log(reduce(add, lazyList));
}

function testTake() {
  console.log("take");
  console.time("");
  go(range(1000), (iter) => take(5, iter), cReduce(add), console.log);
  console.timeEnd("");
}

function testTakeIter() {
  console.log("iter-take");
  console.time("");
  go(L.range(1000), cTake(5), cReduce(add), console.log);
  console.timeEnd("");
}

// testTake();
// testTakeIter();

// currying에서 제너레이터를 리턴하는 함수를 통해서
// reduce시 실제 함수에 리턴값이 아닌 제너레이터가 반환되고
// 제너레이터가 함수 체이닝을 통해 전달되고
// 실제 동작은 마지막 take에서 iter.next를 통해 역으로 올라가 연산이 필요한 순간에만
// 동작한다.
/* go(
  L.range(10),
  L.map((n) => n + 10),
  L.filter((n) => n % 2),
  L.take(2),
  console.log
); */

// console.log(Object.entries({ info: "a", name: "chaospace", age: 40 }));

const queryString = pipe(
  Object.entries,
  L.filter(([key, _]) => key !== "name"),
  L.map(([key, value]) => `${key}=${value}`),
  join("&"),
  console.log
);

// queryString({
//   name: "chaospace",
//   age: 30,
//   job: "front-developer",
// });

// 결과를 가져오는 함수종류를 이용한 지연함수를 즉시 호출방식으로 변경가능
//const fmap = curry(pipe(L.map, cTake(Infinity)))((a) => a + 10);
//console.log(fmap([1, 2, 3, 4]));

const flatten = function* (iter) {
  console.log("flatten");
  for (const a of iter) {
    if (isIterable(a)) {
      for (const b of a) yield b;
    } else {
      yield a;
    }
  }
};

const customFlatten = pipe(flatten, L.take(Infinity));

console.log(
  customFlatten(
    [
      [2, 3],
      [4, 5],
    ].map((a) => a.map((a) => a * a))
  )
);
