Function.prototype.memoized = function () {
  // arguments를 이용한 key생성
  let key = JSON.stringify(arguments);
  // key를 이용해 객체에 저장된 결과를 찾아보고 없으면 함수를 호출
  this._cache = this._cache || {};
  this._cache[key] = this._cache[key] || this.apply(this, arguments);
  return this._cache[key];
};

Function.prototype.memoize = function () {
  let fn = this;
  // Function에 prototype을 이용하므로 fn.length를 이용해 인수를 체크할 수 있음.
  // this와 arguments는 서로 다름
  console.log("memoized-fn", fn, fn.length);
  console.log("arguments", arguments.length, arguments);
  return function () {
    return fn.memoized.apply(fn, arguments);
  };
};

function momoizeTest(a, b) {
  console.log("old-func", a, b);
  return a + b;
}

const memoizeFunc = momoizeTest.memoize();
console.log(memoizeFunc(1, 10));
console.log(memoizeFunc(1, 10));
console.log(memoizeFunc(2, 10));
console.log(memoizeFunc(2, 10));

const sum = (a, b) => {
  console.log("arrow-func");
  return a + b;
};
const memoizeSum = sum.memoize();
console.log(memoizeSum(4, 4));
console.log(memoizeSum(4, 4));
