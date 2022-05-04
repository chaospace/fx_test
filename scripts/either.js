// if else 및 try catch처리를 위한 Either

class Either {
  constructor(value) {
    this._value = value;
  }

  static right(value) {
    return new Right(value);
  }

  static left(value) {
    return new Left(value);
  }

  get isRight() {
    return false;
  }

  get isLeft() {
    return false;
  }

  toString() {
    return this._value;
  }
}

class Right extends Either {
  get isRight() {
    return true;
  }

  map(fn) {
    return Either.right(fn(this._value));
  }

  toString() {
    return `Right(${super.toString()})`;
  }
}

// Else처리를 담당하는 객체로 map에서 다른 가공없이 자신을 리턴
class Left extends Either {
  get isLeft() {
    return true;
  }

  map(fn) {
    return this;
  }

  toString() {
    return `Left(${super.toString()})`;
  }
}

console.log(
  Either.right("Star")
    .map(props => "Super" + props)
    .toString()
);
console.log(
  Either.left("Star")
    .map(props => "Super" + props)
    .toString()
);
