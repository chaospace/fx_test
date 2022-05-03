# 제너레이터

일반함수는 하나의 값(혹은 0개의 값)만을 반환.
제너레이터(generator)를 이용하면 여러 개의 값을 필요에 따라 하나씩 반환(yield)가능.
제너레이터와 이터러블 객체를 함께 사용하면 손쉽게 데이터 스트림을 만들 수 있음.

## 제너레이터 함수

제너레이터 함수를 위해서는 특별한 문법구조, <code>function\*</code>이 필요.

```javascript
function* generatorSequence() {
  yield 1;
  yield 2;
  return 3;
}

// generator객체 생성
let generator = generatorSequence();
console.log(generator); // [object Generator]
```

위 코드는 제너레이터 객체를 생성할 뿐 함수 본문코드는 실행되지 않는다.

## generator.next

<code>next()</code>는 제너레이터의 주요 메서드로 <code>next()</code>를 호출하면 가장 가까운 <code>yield (value)</code>문을 만날 때까지 실행이 지속됩니다.( value 생략 시 <code>undefined</code>가 리턴 )이후, <code>yield (value)</code>문을 만나면 실행이 멈추고 산출하고자 하는 값인 <code>value</code>가 바깥 코드에 반환됩니다.

```javascript
 /**
 next는 vlaue, done속성을 가진 객체를 반환.
 @param value:any 산출값
 @param done:Boolean 함수 코드 실행이 끝나면 true, 아니면 false
 */
 next():{value:any, done:Boolean}
```

> **yield** '생산하다', '산출하다'의 뜻을 가짐

제너레이터를 만들고 산출값을 받는 예시

```javascript
function* generatorSequence() {
  yield 1;
  yield 2;
  return 3;
}

// generator객체 생성
let generator = generatorSequence();
let one = generator.next();

// yield 1에서 코드가 멈추고 value:1을 반환
console.log(one); //{ value: 1, done: false }

// yield 2에서 코드가 멈추고 value:2을 반환
let two = generator.next();
console.log(two); //{ value: 2, done: false }

// return문에 이르고 함수가 종료 value:3, done:true
let three = generator.next();
console.log(three); //{ value: 3, done: true }

// 종료 이후 next를 호출해도 done true만 반환
let four = generator.next();
console.log(four); // { value: undefined, done: true }
```

## 제너레이터와 이터러블

<code>next()</code>메서드를 보면 짐작할 수 있지만, 제너레이터는 **이터러블**<sup>[ 1 ](#iterable)</sup>객체로 <code>for..of</code>반복문을 사용해 값을 얻을 수 있습니다.

```javascript
function* generatorSequence() {
  yield 1;
  yield 2;
  return 3;
}
for (let value of generatorSequence()) {
  console.log(value); // 1, 2
}
```

코드를 실행하면 1, 2만 출력되는데 이유는 <code>for..of</code>이터레이션이 <code>done:true</code>일 경우 마지막 <code>value</code>를 무시하기 때문입니다. 출력을 원한다면 <code>yield</code>로 값을 반환해야 한다.

```javascript
function* generatorSequence2() {
  yield 1;
  yield 2;
  yield 3;
}
for (let value of generatorSequence2()) {
  console.log(value); // 1, 2, 3
}
```

제너레이터는 이터러블 객체이므로 제너레이터에도 전개문법(...)같은 관련 기능을 사용할 수 있다.

```javascript
// 이터러블은 객체이므로 전개문법도 사용가능
console.log([0, ...generatorSequence2()]);
```

## 이터러블 대신 제너레이터 사용하기

**제너레이터**를 이용해 <code>from..to</code>사이에 값을 반복하는 range객체를 아래와 같이 만들 수 있음

```javascript
let range = {
  from: 1,
  to: 5,
  // [Symbol.iterator]() 는 제너레이터를 반환하고 for..of를 위한
  // next(): {value:..., done:true/false}
  // 형식을 충족시키므로 잘 동작한다.
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

console.log([...range]);
```

제너레이터 함수를 이용하면 좀 더 압축된 range객체를 만들 수 있음.

```javascript
let range2 = {
  from: 1,
  to: 5,
  // [Symbol.iterator]:function *()을 표현
  *[Symbol.iterator]() {
    for (let value = this.from; value <= this.to; value++) {
      yield value;
    }
  }
};
console.log([...range2]);
```

## 제너레이터 컴포지션

제너레이터 안에 제너레이터를 '임베딩(embedding, composing)'할 수 있게 해주는 제너레이터의 특별 기능.

```javascript
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
```

제너레이터 컴포지션을 사용하면 한 제너레이터의 흐름을 자연스럽게 다른 제너레이터에 삽입할 수 있습니다. 제너레이터 컴포지션을 사용하면 중간 결과 저장 용도의 추가 메모리가 필요하지 않습니다.

## yield를 사용해 제너레이터 안•밖으로 정보 교환하기

<code>yield</code>는 결과를 바깥으로 전달할 뿐만 아니라 값을 제너레이터 안으로 전달할 수도 있음.

```javascript
function* gen() {
  let result = yield "2+2=?";
  console.log(result); // 4
}

let g = gen();
let question = g.next().value;
console.log(question); // "2+2=?";
g.next(4); // 결과를 제너레이터 안으로 전달.
```

- yeild는 "2+2=?"를 return하고 question은 g.next().value로 값을 받음.
- g.next(4)를 통해 <code>result</code>에 4를 전달

코드에 마지막 **g.next(4)는 제너레이터가 기다려주기 때문에 바로 호출하지 않아도 문제가 없음.**

```javascript
// 3초 후 제너레이터가 다시 시작
setTimeout(() => g.next(4), 3000);
```

## generator.throw

에러를 <code>yield</code>안으로 전달하려면 <code>generator.throw(err)</code>를 호출하면 됩니다.

```javascript
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
console.log("errorQuestion", errorQuestion);
errorGen.throw(new Error("에러 발생"));
```

에러는 함수 안이 아닌 밖에서 잡아도 된다.

```javascript
function* genwithError() {
  let result = yield "2+2=?";
  console.log("result", result);
}
let errorGen = genwithError();
let errorQuestion = errorGen.next().value;
try {
  errorGen.throw(new Error("에러 발생"));
} catch (e) {
  console.log("error", e);
}
```

## 요약

- 제너레이터는 제너레이터 함수 <code>function\* f(...) {...}</code>을 사용해 만듬.
- <code>yield</code> 연산자는 제너레이터 안에 있어야 한다.
- <code>next/yield</code> 호출을 사용하면 외부 코드와 제너레이터 간에 결과를 교환할 수 있다.

<a name="iterable"> 1 </a> : 반복 가능한(iterable)객체로 배열을 일반화한 객체. 이터러블 개념을 사용하면 어떤 객체든 for..of 반복문을 적용할 수 있다.
