function test() {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject({ message: "error" });
    }, 1000);
  });
}

async function call() {
  let res = await test().catch(e => {
    console.log("error", e);
  });
  console.log("res", res);
}

call();

/**
  promise 에러처리
  resolve, reject가 아닌 throw Error를 이용해도 
  호출하는 곳에서 catch로 잡을 수 있음.
*/
function errorCall() {
  return new Promise((_, reject) => {
    setTimeout(() => {
      const errorObj = {
        response: {
          data: {
            message: "ddd"
          }
        }
      };
      reject(new Error(JSON.stringify(errorObj)));
    }, 1000);
  });
}

async function errorFire() {
  let res = await errorCall().catch(e => e);
  console.log("res", res instanceof Error);
  console.log("response", res.message);
}

errorFire();

Function.prototype.memoize = function () {
  let fn = this;
  // Function에 prototype을 이용하므로 fn.length를 이용해 인수를 체크할 수 있음.
  // this와 arguments는 서로 다름
  console.log("memoized-fn", fn, fn.length);
  console.log("arguments", arguments.length, arguments);
  if (fn.length == 0 || fn.length > 1) {
    return fn;
  }
  return function () {
    return "ok";
  };
};

function momoizeTest(a, b) {
  console.log("test-func", a, b);
}

momoizeTest.memoize();
