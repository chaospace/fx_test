# Maybe 함수버전

함수를 이용한 Maybe정리 [클래스 방식 Maybe](./monad.md)와 비교해 보는 재미가 있을 듯.

```javascript
// 기초요소 구성
const isNullOrUndef = value => value === null || typeof value === "undefined";
const maybe = value => ({
  isNothing: () => isNullOrUndef(value),
  extract: () => value
});

// 생성자 함수( factory )
const Maybe = {
  just: maybe,
  nothing: () => maybe(null)
};

const maybeNumberOne = Maybe.just("a value");
const maybeNumberTwo = Maybe.nothing();
console.log("Maybe.just is nothing?", maybeNumberOne.isNothing()); // false
console.log("Maybe.nothing is nothing?", maybeNumberTwo.isNothing()); // true
```

데이터 변경을 위한 <code>map</code>함수 추가
데이터 변경을 담당하는 <code>transformer(함수)</code>를 인자로 받는다.

```javascript
const maybe = value => ({
  isNothing: () => isNullOrUndef(value),
  extract: () => value,
  map:(transformer) => !isNullOrUndef(value) ? Maybe.just(trasnformer(value)) : Maybe.nothing();
});

const maybeOne = Maybe.just(5);
const mappedJust = maybeOne.map(x => x + 1);
console.log("mappedJust", mappedJust.extract()); // 6

const maybeTwo = Maybe.nothing();
const mappedNothing = maybeTwo.map(x => x + 1);
console.log("mappedNothing", mappedNothing.extract()); // null
```

<code>map</code>은 새로운 **maybe**객체를 리턴해서 체인을 이용한 변형을 이어갈 수 있음

```javascript
// map은 새로운 maybe를 리턴하므로 체인을 이용한 연속변형을 할 수 있음.
const a = {
  b: {
    c: "fb"
  }
};

const maybeA = Maybe.just(a)
  .map(a => a.b)
  .map(b => b.c)
  .map(c => `${c} is smart!`);
console.log(maybeA.extract()); // fb is smart!
```

연속된 map 체이닝을 위한 헬퍼<code>chain</code>함수를 Maybe팩토리에 추가

```javascript
// 생성자 함수( factory )
const Maybe = {
  just: maybe,
  nothing: () => maybe(null),
  chain:
    (...fns) =>
    input =>
      fns.reduce((current, fn) => current.map(fn), input)
};

const appendToC = Maybe.chain(
  props => props.b,
  props => props.c,
  props => `${props} is smart!`
);

console.log("appendToC(a)", appendToC(Maybe.just(a)).extract()); // fb is smart!
console.log("appendToC(Maybe.just({}))", appendToC(Maybe.just({})).extract()); // null
```
