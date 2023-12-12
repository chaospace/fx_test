// 최종값은 익명함수에 리턴값으로 값이 된다.
const reduce = (fn, acc, iter) => {
  if (!iter) {
    //이터레이터 정보가 없으면
    //현재 값에서 이터레이터를 생성
    iter = acc[Symbol.iterator]();
    acc = iter.next().value;
  }
  return (function recur(cur) {
    // iter는 함수 호출 시 전달된 파라미터 목록
    for (let o of iter) {
      //함수 호출 시 현재 값과 다음 인자를 같이 전달
      cur = fn(cur, o);
      if (cur instanceof Promise) return cur.then(recur);
    }
    return cur;
  })(acc);
};

function add10(a, callack) {
  setTimeout(() => callack(a + 10), 100);
}

function promiseDelay100(a) {
  return new Promise((resolve) =>
    setTimeout(() => {
      return resolve(a + 20);
    }, 100)
  );
}

// promise객체를 리턴하는 함수로 원하는 리턴값을 주지 않는다.
const p = promiseDelay100(5).then(promiseDelay100);
const cb = add10(5, (res) => {
  add10(res, (res) => {
    add10(res, (res) => {
      console.log(res);
    });
  });
});

//promise객체를 판단해 fn처리
const go1 = (a, fn) => {
  return a instanceof Promise ? a.then(fn) : fn(a);
};

const go2 = (...args) => reduce((a, f) => f(a), args);

const add5 = (a) => {
  console.log("add5", a);
  return a + 5;
};

// const promiseResult = go1(p, add5);
// promiseResult.then((res) => console.log("finish", res));

//내장함수 map에 모나드 기능
const f = (a) => a + 1;
const g = (a) => a * a;
[]
  .map(f)
  .map(g)
  .forEach((r) => console.log("r", r));

//함수 합성을 안전하게 하는 것을 모나드리 한다.( 대표적인 예는 비동기를 안전하게 함성할 수 있도록 하는 Promise )
console.log(
  "go2",
  go2(
    1,
    (a) => a + 10,
    (a) => a + 20,
    promiseDelay100,
    console.log
  )
);
