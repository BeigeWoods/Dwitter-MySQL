# Validator Test

express-validator를 통해 설정한 유효성 검사 중 몇 가지에 대한 사용 정의와 테스트 성공 및 실패 사례를 정리했다.  
**falsy**는 `undefined`, `null`, `0`, `""`, `false`를 의미한다.  
**null**은 `undefined`, `null`을 의미한다.
**_공백_**은 문자열 양쪽 끝 공백을 의미한다. 검증 시 문자열의 *공백*을 허용한다.

1. **`tweetId`**  
   값이 양수인지 검증한다.
   #### Success
   - type of Number : 양수
   - type of String : *공백*을 제외한 내용이 양수일 경우
   #### Fail
   - type of Number : 0, 음수, 소수
   - type of Boolean
   - type of Sting : "1&nbsp;&nbsp;2", "-&nbsp;&nbsp;3"
   - falsy
2. **`content.username`**  
   `req.query`에 `username`이 있는지 확인한 후, 값의 유효성을 검증한다.
   #### Success
   - `query` 생략
   - type of String  
      *공백*을 제외한 문자열 길이가 조건에 부합할 경우
     "&nbsp;&nbsp;&nbsp;"처럼 공백을 가진 따옴표, 단 따옴표를 포함한 문자열 길이가 조건에 부합할 경우
   #### Fail
   - `query.username`이 있지만 값이 falsy일 경우
   - type of Number
   - type of Boolean
   - 조건에 부합하지 않는 문자열 길이
   - falsy
3. **`content.aboutGood`**
   - `clicked` : 해당 컨텐츠에 대한 사용자의 좋아요 클릭 유무를 의미하며, 사용자 id로 확인한다.
   - `good` : 해당 컨텐츠의 좋아요 수를 의미한다.
     두 가지 모두 값이 0 이상 정수인지 검증한다.
     #### Success
     - type of Number : 0 이상 정수
     - type of String : *공백*을 제외한 내용이 0 이상 정수일 경우
     #### Fail
     - type of Number : 음수, 소수
     - type of Boolean
     - type of Sting : "1&nbsp;&nbsp;2", "-&nbsp;&nbsp;3"
     - null
4. **`tweetValidator.creation`**
   text와 video에 대해 값이 falsy라면 검사는 넘어가고 아니라면 조건에 맞는지 검사한다.  
   이때, 마지막으로 진행하는 검사에서 text, video, image 모두 값이 falsy일 경우 통과하지 못한다.
