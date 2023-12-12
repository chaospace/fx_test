const reduce = (f, acc, iter) => {
  if (!iter) {
    iter = acc[Symbol.iterator]();
    acc = iter.next().value;
  }

  for (const i of iter) {
    acc = f(acc, i);
  }
  return acc;
};

const filter = (predicate, iter) => {
  const res = [];
  for (let value of iter) {
    if (predicate(value)) {
      res.push(value);
    }
  }
  return res;
};

const map = (f, iter) => {
  const res = [];

  for (let value of iter) {
    res.push(f(value));
  }

  return res;
};

//시작값과 적용할 함수 목록을 받아 결과를 산출하는 함수.
const go = (...args) => reduce((a, f) => f(a), args);

// go 함수를 한번 더 감싸 원하는 시점에 시작값과 같이 호출하게 하는 pipe
const pipe =
  (f, ...fs) =>
  (...as) =>
    go(f(...as), ...fs);

const take = (l, iter) => {
  const res = [];
  for (let value of iter) {
    res.push(value);
    if (res.length === l) return res;
  }
  return res;
};

const range = (l) => {
  let i = -1;
  const res = [];
  while (++i < l) {
    res.push(i);
    if (res.length === l) return res;
  }
  return res;
};

module.exports = { range, filter, map, reduce, pipe, go, take };
