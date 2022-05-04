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

  get isJust() {
    return true;
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

  get isNothing() {
    return true;
  }

  toString() {
    return "Maybe.Nothing";
  }
}

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
