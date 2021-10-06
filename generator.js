function* gen() {
  let result = yield "2+2 = ?";
  console.log("result", result);
}

let generator = gen();
let question = generator.next().value;
console.log("question", question);
// 제네레이터가 기다려주기 때문에 비동기적인 호출을 해도 결과는 동일
//generator.next(4);
setTimeout(() => generator.next(4), 2000);

function* generatorSequence() {
  yield 1;
  yield 2;
  return 3;
}

// generator객체 생성
generator = generatorSequence();
let one = generator.next();
console.log(one);

let two = generator.next();
console.log(two);

let three = generator.next();
console.log(three);

let four = generator.next();
console.log(four);

for (let value of generatorSequence()) {
  console.log(value); // 1, 2
}

function* generatorSequence2() {
  yield 1;
  yield 2;
  yield 3;
}
for (let value of generatorSequence2()) {
  console.log(value); // 1, 2, 3
}

// 이터러블은 객체이므로 전개문법도 사용가능
console.log([0, ...generatorSequence2()]);

let range = {
  from: 1,
  to: 5,
  [Symbol.iterator]() {
    return {
      current: this.from,
      last: this.to,
      next() {
        if (this.current <= this.last) {
          return { done: false, value: this.current++ };
        } else {
          return { done: true };
        }
      }
    };
  }
};

console.log(...range);

let range2 = {
  from: 1,
  to: 5,
  *[Symbol.iterator]() {
    for (let value = this.from; value <= this.to; value++) {
      yield value;
    }
  }
};
console.log([...range2]);

function* generateLoop(start, end) {
  for (let i = start; i <= end; i++) yield i;
}

function* generatePasswordCode() {
  // 0..9
  yield* generateLoop(48, 57);

  // A..Z
  yield* generateLoop(65, 90);

  // a..z
  yield* generateLoop(97, 122);
}

let str = "";
for (let code of generatePasswordCode()) {
  str += String.fromCharCode(code);
}
console.log(str);

function* genwithError() {
  try {
    let result = yield "2+2=?";
    console.log("result", result);
  } catch (e) {
    console.log("error", e);
  }
}
let errorGen = genwithError();
let errorQuestion = errorGen.next().value;
errorGen.throw(new Error("에러 발생"));
