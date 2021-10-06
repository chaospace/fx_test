# 함수형 자바스크립트의 실용성

### **정말 쓸모없는 함수**

```javascript
function identity(v) {
  return v;
}
let a = 10;
console.log(a);
// 10
```

위에서 함수 identity는 받은 인자를 그대로 리턴하는 함수인데 이 쓸모없어 보이는 함수의 용도가 있을까?

### **predicate와 identity의 조합**

```javascript
console.log(_.filter([true, 0, 10, "a", false, null, undefined], identity));
//[true, 10, "a"]
```

predicate로 사용된 identity함수는 Truthy Values(Boolean으로 평가했을 때 true일 값)만 넘겨준다.

### **identity 활용**

```javascript
function falsy(v) {
  return !v;
} // false값을 판단
function truthy(v) {
  return !!v;
} // true값을 판단
```

identity를 이용해 flase, true값을 구분할 수 있는 함수를 만들었고 좀더 활용하면 평소 자주 사용했던 다른 함수를 만들 수 있다.

### **some, every(identity 활용2)**

```javascript
// 목록 중 하나라도 ture가 있는지 판단
function some(list) {
  return !!_.find(list, identity);
}
// 목록에 모든 값이 true인지 판단
function every(list) {
  return _.filter(list, identity).length == list.length;
}

some([0, null, 1]); // true
some([0, null, undefined]); // false

every([0, null, 1]); // false
every([1, true, { age: 10 }]); // true
```

> every와 some함수는 원하는 동작을 잘 하지만 every에 <span style="color:#ffcc00">**아쉬운 점**</span>은 <span style="color:#00CCEE">**filter를 이용하기 때문에 목록을 모두 순회**</span>한다는 점이다. 이 부분을 두 가지 함수를 추가해 개선해 보자

### **아주 작은 함수 not, beq(연산자 대신 함수로)**

```javascript
function not(v) {
  return !v;
}
function beq(a) {
  return function (b) {
    return a === b;
  };
}
```

not, beq은 굳이 필요할까? 생각이 들 수 있지만 코드를 조합하며 이런 궁금증을 해결해 보자

### **some, every 개선**

```javascript
// 목록 중 하나라도 ture가 있는지 판단
function some(list) {
  return !!_.find(list, identity);
}
//findIndex를 통해 false인 값의 index가 -1과 같은지 체크
function every(list) {
  return beq(-1)(_.findIndex(list, not));
}
```

> not은 연산자 !가 아닌 함수이기에 \_.findIndex와 함께 사용이 가능.

- list에 값중 하나라도 부정적인 값이 있으면 predicate가 true를 리턴하며 해당 index를 반환
- 루프가 중단
- beq(-1)을 이용해 반환된 index를 비교
- 반환된 index가 -1이라면 동일하다 판단하고 true를 반환
- 모든 요소가 true라는 것이 증명

### **함수 쪼개기**

함수형 프로그래밍을 위해 조금 더 함수를 나누어 함수하나가 하나의 동작만 하도록 만들기

```javascript
function positive(list) {
  return _.find(list, identity);
}

function negativeIndex(list) {
  return _.findIndex(list, not);
}

function some(list) {
  return not(not(positive(list)));
}

function every(list) {
  return beq(-1)(negativeIndex(list));
}

some([false, undefined, null]); // false
some([false, 1, null]); // true

every([false, undefined, null]); // false
every([10, 1, true]); // true
```

> OOP에 이런 말이 있다 상속보단 합성을! 그렇다면 함수형 프로그래밍에서 합성은 어떻게 할까?
