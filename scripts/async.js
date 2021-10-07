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
