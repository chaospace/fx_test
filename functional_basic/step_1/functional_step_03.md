# 함수형 자바스크립트 기초

**1.5 함수 중첩**

함수의 리턴값을 바로 다른 함수의 리턴값으로 이용하면 변수 할당을 줄일 수 있다.  
filter의 결과가 배열이고 map의 첫 인자는 배열이므로 바로 사용 가능하다.

```javascript
let user_age = map(
  filter(users, user => user.age <= 30),
  user => user.age
);
console.log(user_age);

let user_name = map(
  filter(users, user => user.age > 30),
  user => user.name
);
console.log(user_name);
```

**1.6 함수 중첩2**  
작은 함수를 하나 더 만드면 변수 할당 모두를 제거 할 수 있다.

```javascript
function log_length(value) {
  console.log(value.length);
  return value;
}

console.log(
  log_length(
    map(
      filter(users, user => user.age <= 30),
      user => user.age
    )
  )
);

console.log(
  log_length(
    map(
      filter(users, user => user.age > 30),
      user => user.name
    )
  )
);
```

**1.7 클로저 활용**  
클로저 예제를 다룰때 많이 나오는 curry함수

```javascript
function bValue(key) {
  return function (obj) {
    return obj[key];
  };
}

console.log(bValue("name")({ name: "나야나", age: 30 }));
```

bValue함수를 map에 iteratee에 적용

```javascript
console.log(
  log_length(
    map(
      filter(users, user => user.age <= 30),
      bValue("age")
    )
  )
);

console.log(
  log_length(
    map(
      filter(users, user => user.age > 30),
      bValue("name")
    )
  )
);
```

**1.8 모든 것은 함수로**

기존 익명함수를 별도 함수로 만들어 코드를 더 읽기 쉽게

```javascript
const under_30 = user => user.age <= 30;
console.log(log_length(map(filter(users, under_30), bValue("age"))));

const over_30 = user => user.age > 30;
console.log(log_length(map(filter(users, over_30), bValue("name"))));

// map 부분 함수 변형
const ages = list => map(list, bValue("age"));
console.log(log_length(ages(filter(users, under_30))));

const names = list => map(list, bValue("name"));
console.log(log_length(names(filter(users, over_30))));
```
