let value = { key: "vvv" };
try {
  value = JSON.parse(value);
} catch (e) {}
console.log("v", value);

function restParams(a, ..._) {
  console.log(a, _);
}

restParams("c", { name: "a" });
restParams("c", 2, 3, 4);
restParams("c");

//함수 파라미터 재정의 테스트
function argmerge(arg1, arg2) {
  arg1 = arg1.concat(arg2);
  console.log("arg1", arg1);
}

argmerge([1, 2], [3, 4, 5]);

function go() {
  return ":P";
}

// 함수 정의가 간단해짐
function withDefaults(
  a,
  b = 5,
  c = b,
  d = go(),
  e = this,
  f = arguments,
  g = this.value
) {
  return [a, b, c, d, e, f, g];
}

// 함수 정의가 길고 장황함
function withoutDefaults(a, b, c, d, e, f, g) {
  switch (arguments.length) {
    case 0:
      a;
    case 1:
      b = 5;
    case 2:
      c = b;
    case 3:
      d = go();
    case 4:
      e = this;
    case 5:
      f = arguments;
    case 6:
      g = this.value;
    default:
  }
  return [a, b, c, d, e, f, g];
}

// 아래와 같이 함수 호출하면 동일한 결과를 보임

withDefaults.call({ value: "=^_^=" });
// [undefined, 5, 5, ":P", {value:"=^_^="}, arguments, "=^_^="]

withoutDefaults.call({ value: "=^_^=" });
// [undefined, 5, 5, ":P", {value:"=^_^="}, arguments, "=^_^="]
