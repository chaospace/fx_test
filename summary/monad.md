# 모나드

기본적인 객체개념이 있는게 도움이 될듯.

모나드는 함수형 프로그래밍에서 가장 난해한 개념중 하나로, 범주론이란 수학 분야에서 비롯된 결과물입니다.

책에서는 뭔가 심오한 내용을 말하는 거 같은데 책을 본 개인적은 느낌은
<code>**함수에 결과값을 원하는 형태로 다루기 위해 한번 더 감싸주는 래퍼함수**</code> 정도로 이해했다.

## 모나드의 조건

함수형 프로그래밍에 쓰이는 함수답게 당연히 순수함수와 같은 특성을 만족해야 한다.

- 부수효과가 없어야 한다.
- 합성이 가능해야 한다.

## 모나드의 활용

### 전통적인 예외(에러) 처리의 문제점

> **값에 대한 유효성** 및 **try ... catch** 를 이용해 예외를 붙잡아 처리하는데 신경을 써줘야 함.

```javascript
function getCountry(student) {
  let school = student.getSchool();
  if (school !== null) {
    let addr = school.getAddress();
    if (addr !== null) {
      return addr.getCountry();
    }
    return null;
  }
  throw new Error("국가 조회 중 에러");
}
```

### Maybe모나드를 이용한 null예외처리

**Maybe** 모나드는 <code>Just, Nothing</code>두 하위형으로 구성된 빈 형식(표식형)으로, null체크 로직을 효과적으로 통합하는 것이다.

- Just(value) : 존재하는 값을 감싼 컨테이너
- Nothing() : 값이 없는 컨테이너, 또는 추가 정보 없이 실패한 컨테이너

```javascript
// Maybe객체 선언
class Maybe {
  static just(a) {
    return new Just(a);
  }

  static nothing() {
    return new Nothing();
  }

  static fromNullable(a) {
    return a !== null ? Maybe.just(a) : Maybe.nothing();
  }

  static of(a) {
    return Maybe.just(a);
  }

  get isNothing() {
    return false;
  }

  get isJust() {
    return false;
  }
}

// Maybe를 상속한 Just객체 선언
class Just extends Maybe {
  constructor(value) {
    super();
    this._value = value;
  }
  get value() {
    return this._value;
  }

  map(f) {
    return Maybe.fromNullable(f(this._value));
  }

  // 값을 추출
  getOrElse() {
    return this._value;
  }

  filter(f) {
    return Maybe.fromNullable(f(this._value) ? this._value : null);
  }

  chain(f) {
    return f(this._value);
  }

  toString() {
    return `Maybe.Just(${this._value})`;
  }
}

// Nothing객체 선언
class Nothing extends Maybe {
  map(f) {
    return this;
  }

  // Nothing에서 값을 얻으면 예외를 발생해서 모나드를 오용한 사실을 알림
  get value() {
    throw new TypeError("Nothing 값을 가져올 수 없습니다.");
  }
  // 자료구조를 무시하고 무조건 other를 반환
  getOrElse(other) {
    return other;
  }

  filter(f) {
    return this._value;
  }

  chain(f) {
    return this;
  }

  toString() {
    return "Maybe.Nothing";
  }
}
```

Maybe를 이용해 변경한 <code>getCountry</code>함수

```javascript
// student에 특정값이 하나라도 null을 반환하면 getOrElse에서 존재하지 않는 국가입니다를 반환.
const getCountry = student =>
  Maybe.fromNullable(student)
    .map(student => student.school)
    .map(school => school.address)
    .map(address => address.country)
    .getOrElse("존재하지 않는 국가입니다.");

const myStudent = {
  school: {
    address: {
      country: "중랑구"
    }
  }
};

const myStudentB = {
  school: {
    address: null
  }
};

console.log(getCountry(myStudent));
console.log(getCountry(myStudentB));
```
