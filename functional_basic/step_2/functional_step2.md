# 함수형 자바스크립트의 실용성

### **함수합성**

oop와 마찬가지로 한 가지 일만하는 함수는 합성하기도 쉽다.  
**합성을 위해서는 <span style="color:#ffcc00">arguments, call, apply</span>** 의 성격을 잘 이해해야 된다.

```javascript
function compose() {
  let args = arguments;
  console.log("arguments", arguments);
  let start = args.length - 1;
  return function () {
    let i = start;
    let result = args[start].apply(this, arguments);
    while (i--) result = args[i].call(this, result);
    return result;
  };
}

let greet = function (name) {
  return "hi : " + name;
};
let upperCase = function (statement) {
  return statement.toUpperCase() + "!";
};
let welcome = compose(greet, upperCase);
var str = "front";
welcome(str);
// hi : FRONT!
```

welcome을 실행하면 upperCase를 실행결과를 greet함수에 넘겨주고 결국 hi : Front!가 나오게 된다.

### **compose를 이용한 some과 every**

```javascript
// 이전 코드
// function some(list) {
//   return not(not(positive(list)));
// }

// function every(list) {
//   return beq(-1)(negativeIndex(list));
// }
let some = compose(not, not, positive);
let every = compose(beq(-1), negativeIndex);
```

### **정리해보는 함수형 프로그래밍의 장점**

**일반적 장점**

> 값 대신 함수로, for와 if대신 고차 함수와 보조 함수로, 연산자 대신 함수로, 함수 합성 등 함수적 기법들을 사용하면 코드가 간결해지고 함수명을 통해 로직을 더 명확히 전달 할 수 있어 읽기 좋은 코드가 된다.

**좀 더 깊이 들어간 장점**

- 인자나, 변수 선언이 적어진다.
- 함수의 내부가 보이지 않음.
- 새로운 상황도 생기지 않음.
- 에러 없는 함수들이 인자와 결과에 맞게 조합되어 있다면 전체역시 에러가 날 수 없다.
- 상태를 공유하지 않는 작은 단위의 함수는 테스트도 쉽고 테스트케이스를 작성하기 쉽다.
