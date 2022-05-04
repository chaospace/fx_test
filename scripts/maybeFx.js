// 기초 요소
const isNullOrUndef = value => value === null || typeof value === "undefined";
const maybe = value => ({
  isNothing: () => isNullOrUndef(value),
  extract: () => value,
  map: transformer =>
    !isNullOrUndef(value) ? Maybe.just(transformer(value)) : Maybe.nothing()
});

// 생성자 함수( factory )
const Maybe = {
  just: maybe,
  nothing: () => maybe(null),
  chain:
    (...fns) =>
    input =>
      fns.reduce((current, fn) => current.map(fn), input)
};

const maybeNumberOne = Maybe.just("a value");
const maybeNumberTwo = Maybe.nothing();
console.log("Maybe.just is nothing?", maybeNumberOne.isNothing());
console.log("Maybe.nothing is nothing?", maybeNumberTwo.isNothing());

const maybeOne = Maybe.just(5);
const mappedJust = maybeOne.map(x => x + 1);
console.log("mappedJust", mappedJust.extract());

const maybeTwo = Maybe.nothing();
const mappedNothing = maybeTwo.map(x => x + 1);
console.log("mappedNothing", mappedNothing.extract());

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
console.log(maybeA.extract());

const appendToC = Maybe.chain(
  props => props.b,
  props => props.c,
  props => `${props} is smart!`
);

console.log("appendToC(a)", appendToC(Maybe.just(a)).extract());
console.log("appendToC(Maybe.just({}))", appendToC(Maybe.just({})).extract());
