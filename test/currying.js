const { reduce, filter, map, take } = require("./base.js");
const { curry } = require("./common.js");

const cReduce = curry(reduce);
const cFilter = curry(filter);
const cMap = curry(map);
const cTake = curry(take);

const join = curry((seperator, iter) =>
  reduce((a, b) => `${a}${seperator}${b}`, iter)
);

module.exports = { curry, cMap, cTake, cFilter, cReduce, join };
