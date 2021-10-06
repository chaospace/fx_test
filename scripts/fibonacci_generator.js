function* fibonacci() {
  var fn1 = 1;
  var fn2 = 1;
  while (true) {
    var current = fn2;
    fn2 = fn1;
    fn1 = fn1 + current;
    console.log("-------------");
    // yield문을 만나면 실행이 멈추고 value에는 current값이 들어감
    // next를 호출하며 넘긴 파라미터는 reset에 할당됨.
    var reset = yield current;
    console.log("----> reset", reset);
    if (reset) {
      fn1 = 1;
      fn2 = 1;
    }
  }
}

const gen = fibonacci();
console.log(gen.next().value);
console.log(gen.next().value);
// next호출 시 파라미터를 넘기면 yield에 return값으로 넘겨지게 됨.
console.log(gen.next(true).value);
