# 커링

> 커링은 함수와 함께 사용할 수 있는 고급기술로 다른언어에도 존재.
> 커링은 <code>f(a, b, c)</code>처럼 단일 호출로 처리하는 함수를 <code>f(a)(b)(c)</code>와 같이 각각의 인수가 호출 가능한 프로세스로 호출된 후 병합되도록 변환하는 것.( 클로저에 대한 이해필요. )

**커링은 함수를 호출하지 않습니다. 단지 변환할 뿐**

```javascript
// 두 개의 파라미터를 사용하는 함수를 커링
function curry(f) {
  return function (a) {
    return function (b) {
      return f(a, b);
    };
  };
}

// 사용
function sum(a, b) {
  return a + b;
}

// 커리적용
const curriedSum = curry(sum);
const fiveAdd = curriedSum(5);
console.log(fiveAdd(10)); // 15;
```

# 커링의 장점?

- **함수의 재활용**( 고정된 인자를 설정해 두고 변경하는 값만을 이용해 함수를 실행할 수 있게해줌.)
- **가독성**

```javascript
// 5를 기억한 함수fiveAdd(가독성)
const fiveAdd = curriedSum(5);

// fiedAdd를 활용해 다양한 결과를 확인
console.log(fiveAdd(10)); // 15;
console.log(fiveAdd(20)); // 25;
console.log(fiveAdd(30)); // 25;
```
