const isIterable = (obj) => obj && obj[Symbol.iterator];

const curry =
  (f) =>
  (a, ..._) =>
    _.length ? f(a, ..._) : (..._) => f(a, ..._);

module.exports = {
  curry,
  isIterable,
};
