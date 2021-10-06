# 함수형 자바스크립트 기초

**1. 목록 중 조건에 해당하는 값 찾기**

```javascript
let users = [
  { id: 1, name: "JavaScript", age: 10 },
  { id: 2, name: "JAVA", age: 20 },
  { id: 3, name: "C++", age: 30 },
  { id: 4, name: "Python", age: 40 },
  { id: 5, name: "Swift", age: 50 }
];

// 나이가 30이하인 유저 찾기
var temp_user = [];
for (let i = 0; i < users.length; i++) {
  if (users[i].age <= 30) temp_user.push(users[i]);
}
console.log(temp_user.length);

// 유저 나이 찾기
var temp_age = [];
for (let i = 0; i < users.length; i++) {
  temp_age.push(users[i].age);
}
console.log(temp_age);

// 나이가 30이상인 유저 찾기
var temp_oldUser = [];
for (let i = 0; i < users.length; i++) {
  if (users[i].age > 30) temp_oldUser.push(users[i]);
}
console.log(temp_oldUser.length);

// 유저 이름 찾기
var temp_name = [];
for (let i = 0; i < users.length; i++) {
  temp_name.push(users[i].name);
}
console.log(temp_name);
```

**1.2 for에서 filter로, if에서 predicate로**

```javascript
function filter(list, predicate) {
  let new_list = [];
  const max = list.length;
  for (let i = 0; i < max; i++) {
    if (predicate(list[i])) new_list.push(list[i]);
  }
  return new_list;
}
```

> filter함수는 조건에 해당하는 것을 **predicate함수에 위임**하며 predicate의 **결과에만 의존**하며 마지막에 <span style="color:#ffCC00">**new_list**</span><sup>[ 1 ](#desc)</sup>를 리턴

filter적용 코드

```javascript
let user_under_30 = filter(users, user => user.age <= 30);
console.log(user_under_30);

let user_over_30 = filter(users, user => user.age > 30);
console.log(user_over_30);
```

**1.3 map함수 만들기**

users목록에서 나이와 이름을 추출하는 부분은 for루프를 이용하는데 이곳을 리팩토링

```javascript
function map(list, iteratee) {
  let new_list = [];
  const max = list.length;
  for (let i = 0; i < max; i++) {
    new_list.push(iteratee(list[i]));
  }
  return new_list;
}
```

map적용코드

```javascript
let user_age = map(user_under_30, user => user.age);
console.log(user_age);

let user_name = map(user_over_30, user => user.name);
console.log(user_name);
```

**1.4 최종 코드**

```javascript
let user_under_30 = filter(users, user => user.age <= 30);
console.log(user_under_30);

let user_over_30 = filter(users, user => user.age > 30);
console.log(user_over_30);

let user_age = map(user_under_30, user => user.age);
console.log(user_age);

let user_name = map(user_over_30, user => user.name);
console.log(user_name);
```

코드가 배우 단순해 졌다. for도 없고 if도 없다.

- 회원 중 나이가 30이하인 사람을 뽑아 user_under_30에 담는다.
- user_under_30에 담긴 회원의 나이만 출력한다.
- 회원 중 나이가 31이상인 사람을 뽑아 user_over_30에 담는다.
- user_over_30에 담긴 회원의 이름만 출력한다.

코드와 내용이 거의 일치하고 읽기 쉽다.

<a name="desc"> 1 </a> : 이전 값의 상태를 변경하지 않고 새로운 값으로 만드는 접근 **( 함수형 프로그래밍의 특징 )**
