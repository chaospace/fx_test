# 자바스크립트 함수형 프로그래밍 스터디

함수형프로그래밍 책을 보며 정리한 내용요약

## 함수형 프로그래밍기초 정리

- [함수형프로그래밍의 이해](./functional_basic/step_1/functional_step_01.md)
- [함수형프로그래밍 기초](./functional_basic/step_1/functional_step_02.md)
- [함수형프로그래밍 기초2](./functional_basic/step_1/functional_step_03.md)
- [함수형프로그래밍 기초3](./functional_basic/step_1/functional_step_04.md)
- [함수형프로그래밍의 실용성1](./functional_basic/step_2/functional_step1.md)
- [함수형프로그래밍의 실용성2](./functional_basic/step_2/functional_step2.md)
- [클로저와 스코프](./functional_basic/step_2/functional_step3.md)

## 함수형 주요용어 정리

- [커링](./summary/curry.md)
- [메모화](./summary/memoize.md)
- [꼬리호출](./summary/tco.md)
- [제너레이터](./summary/generator.md)
- [모나드](./summary/monad.md)
- [Maybe함수버전](./summary/maybe_fx.md)

## 유형별 특성정리 

- map, filter 계열은 (보조 함수를 이용한 )결합법칙을 이용한다.
  - (iterable타입 데이터를 보조함수 체이닝을 이용해 다양하게 가공 )
  - <mark>generator</mark>를 이용해 지연처리 가능.
- reduce, take 계열은 데이터의 결과를 만든다.
  - <mark>map</mark>,<mark>filter</mark>를 통해 가공한 데이터를 꺼내서 결과를 제공
- 체이닝을 통해 결과를 꺼내거나 다음 연결을 위한 역할 
  
- take 함수에서 특정 수의 yield를 이용한 제한적인 지연처리 보다 가공역할을 하는 map, filter계열에 지연을 사용하고 take에서 필요할 때 연산을 요청하는 방식이 좋다.