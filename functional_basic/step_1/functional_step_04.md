# 함수형 자바스크립트 기초2

**1. 목록 중 한 명 찾기**

기존 filter를 이용해 목록 중 조건에 해당하는 회원 한 명을 찾는 코드

```javascript
let users = [
  { id: 1, name: "JavaScript", age: 10 },
  { id: 2, name: "JAVA", age: 20 },
  { id: 3, name: "C++", age: 30 },
  { id: 4, name: "Python", age: 40 },
  { id: 5, name: "Swift", age: 50 }
];

console.log(filter(users, user => user.id === 3)[0]);
// {id: 3, name: "C++", age: 30}
```

filter를 통해 값을 찾을 수 있지만 목록에 length만큼 predicate가 실행되어 효율적이지 못함.  
한 명만 찾고 싶은데 동일 조건이 2가지 이상일 경우 모두 찾음.

**1-2 break**

```javascript
let user;
for (let i = 0, len = users.length; i < len; i++) {
  if (users[i].id == 3) {
    user = users[i];
    break;
  }
}
console.log(user);
// {id: 3, name: "C++", age: 30}
```

조건에 해당하는 유저를 찾으면 break를 통해 for문을 빠져나와 효율적이지만 재사용이 힘듬.

**1-3 findById**

```javascript
function findById(list, id) {
  for (let i = 0, len = list.length; i < len; i++) {
    if (list[i].id == id) return list[i];
  }
}

console.log(findById(users, 2));
//{id: 2, name: "JAVA", age: 20}

console.log(findById(users, 5));
//{id: 5, name: "Swift", age: 50}
```

유저 목록 중에 id가 아닌 name으로 찾고 싶다면?

**1-4 findByName**

```javascript
function findByName(list, name) {
  for (let i = 0, len = list.length; i < len; i++) {
    if (list[i].name == name) return list[i];
  }
}

console.log(findByName(users, "JAVA"));
//{id: 2, name: "JAVA", age: 20}

console.log(findByName(users, "Swift"));
//{id: 5, name: "Swift", age: 50}
```

findById와 findByName 비슷한 것이 반복되는 느낌이 든다면 공통요소를 뽑아 함수로.

**1-5 findBy**

```javascript
function findBy(list, key, val) {
  for (let i = 0, len = list.length; i < len; i++) {
    if (list[i][key] == val) return list[i];
  }
}

console.log(findBy(users, "id", "2"));
//{id: 2, name: "JAVA", age: 20}
console.log(findBy(users, "name", "Swift"));
//{id: 5, name: "Swift", age: 50}

// age정보로 찾고 싶을 경우도 대응 가능
console.log(findBy(users, "age", 50));
//{id: 5, name: "Swift", age: 50}
```

findBy함수를 통해 목록에 관계없이 key, value로 원하는 객체를 찾을 수 있게됨.

    Todo( 좋아지긴 했지만 아쉬운점 )
        - key가 아닌 메서드를 통해 값을 얻어야 할 때
        - 두 가지 이상의 조건이 필요할 때
        - ===이 아닌 다른 조건을 찾고자 할 때

**1-6 findBy로 안 되는 경우**

```javascript
// User객체가 메서드로 값을 얻어와야 함.
function User(id, name, age) {
  this.getId = () => id;
  this.getName = () => name;
  this.getAge = () => age;
}

let users2 = [
  new User(1, "JavaScript", 10),
  new User(1, "JAVA", 20),
  new User(1, "C++", 30),
  new User(1, "Python", 40),
  new User(1, "Swift", 50)
];

console.log(findBy(users2, "age", 10));
// undefined
```

유저의 age정보를 getAge()로 가져와야 되서 undefined를 출력

**1-7 값에서 함수로**  
앞서 만들었던 filter, map처럼 인자로 key, value가 아닌 함수를 사용하게 변경

```javascript
function find(list, predicate) {
  for (let i = 0, len = list.length; i < len; i++) {
    if (predicate(list[i])) return list[i];
  }
}

console.log(find(users2, user => user.getAge() == 20).getName());
//JAVA
console.log(find(users2, user => user.getName() == "C++").getName());
//C++

console.log(find(users, user => user.name.indexOf("J") == -1));
//{id: 3, name: "C++", age: 30}
console.log(find(users, user => user.name == "Swift" && user.age == 50));
//{id: 5, name: "Swift", age: 50}
```

find함수는 predicate함수를 통해 findBy에서 아쉬웠던 점을 개선

- ~~key가 아닌 메서드를 통해 값을 얻어야 할 때~~
- ~~두 가지 이상의 조건이 필요할 때~~
- ~~===이 아닌 다른 조건을 찾고자 할 때~~

## 함수형 프로그래밍 중간 정리

함수에 인자를 String, Number대신 Function으로 변경하는 작은 차이는 매우 큰 변화를 만들며 이처럼 함수를 통해 다형성을 만들어 나가는 것이 함수형 (자바스크립트) 프로그래밍.

    지금까지 만든 **find, map. filter**함수는 데이터가 무엇이든지 루프를 돌거나 분기를 만들거나 push 혹은 predicate를 실행하며 자기 할 일을 한다.

filter, find는 list 내부에 무엇이 들어 있는지 관심이 없다. 배열 내부의 값을 변경하거나 들여다 보지도 않음. <span style="color:#00FFAA">**객체지향 프로그래밍이 _약속된 이름의 메서드를 통해 외부 객체에 위임한다면_**</span>, <span style="color:#ffcc00">함수형 프로그래밍은 보조 함수를 통해 위임을 한다</span>.

**1-7 고차함수**

앞서 구현한 map, filter, find등은 모두 고차함수<sup>[ 1 ](#high-oreder)</sup>다. 보통 고차함수는 함수를 인자로 받아 필요할 때에 실행하거나 클로저를 만들어 리턴한다.

이제 map, find, filter에 인자를 추가해 사용하던 Array.filter혹은 라이브러리 처럼 비슷하게 만들어 보자.

```javascript
const _ = {};
_.map = (list, iteratee) => {
  let new_list = [];
  for (let i = 0, len = list.length; i < len; i++) {
    new_list.push(iteratee(list[i], i, list));
  }
  return new_list;
};

_.filter = (list, predicate) => {
  let new_list = [];
  for (let i = 0, len = list.length; i < len; i++) {
    if (predicate(list[i], i, list)) new_list.push(list[i]);
  }
  return new_list;
};

_.find = (list, predicate) => {
  let new_list = [];
  for (let i = 0, len = list.length; i < len; i++) {
    if (predicate(list[i], i, list)) return list[i];
  }
};
```

이제 iteratee, predicate에서 전달하는 인자가

- target( 대상객체 )
- i (인덱스)
- list (원본배열)

로 많아져 보조 함수에서 좀 더 다양한 일을 할 수 있게 됐다.

**1-8 predicate의 인자활용**

```javascript
console.log(_.filter([1, 2, 4, 5], (val, idx) => idx > 1));
//(2) [4, 5]

console.log(_.filter([1, 2, 4, 5], (val, idx) => idx % 2 == 0));
//(2) [1, 4]
```

<a name="high-oreder">1</a> : 함수를 인자로 받거나 함수를 리턴하는 함수.
