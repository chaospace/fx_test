# 메모화

반복적인 계산을 피하는 것도 애플리케이션의 속도향상에 도움을 주는 방법으로 캐시나 프록시 계층을 두는 방법을 쓰는데, 함수에 캐시 계층을 이용할 수도 있다.

```javascript
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
```

함수에 파마미터를 이용해 키를 만들고 계산결과를 키로 캐시객체에 저장을 해서 반복적인 계산에 활용하는 방식( **함수의 참조투명성** )
