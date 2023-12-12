const { curry, isIterable } = require("./common.js");

const L = {};
//제너레이터를 이용해 동작 시점에 값을 반환하도록 처리

L.range = function* (l) {
  let i = -1;
  console.log("range");
  while (++i < l) {
    yield i;
  }
};

L.map = curry(function* (f, iter) {
  console.log("map");
  iter = iter[Symbol.iterator]();
  let cur;
  while (!(cur = iter.next()).done) {
    yield f(cur.value);
  }
  // for (let value of iter) {
  //   yield f(value);
  // }
});

L.filter = curry(function* (predicate, iter) {
  console.log("filter");
  iter = iter[Symbol.iterator]();
  let cur;
  while (!(cur = iter.next()).done) {
    const v = cur.value;
    if (predicate(v)) {
      yield v;
    }
  }
});

L.take = curry(function (l, iter) {
  console.log("take", iter);
  const res = [];
  iter = iter[Symbol.iterator]();
  let cur;
  while (!(cur = iter.next()).done) {
    res.push(cur.value);
    if (res.length === l) return res;
  }
  return res;
});

L.entries = function* (obj) {
  console.log("entries-");
  for (let key in obj) {
    yield [key, obj[key]];
  }
};

module.exports = L;
