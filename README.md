# (주)빅스홀딩스 프론트엔드 기업과제

## 실행 가이드

1. 프로젝트의 루트 디렉토리에 `.env` 파일을 생성하고, 아래 내용을 추가해 주세요:

   ```env
   NEXT_PUBLIC_SIGN_UP_URL="https://front-mission.bigs.or.kr/auth/signup"
   NEXT_PUBLIC_SIGN_IN_URL="https://front-mission.bigs.or.kr/auth/signin"
   NEXT_PUBLIC_REFRESH_TOKEN_URL="https://front-mission.bigs.or.kr/auth/refresh"
   NEXT_PUBLIC_BOARDS_URL="https://front-mission.bigs.or.kr/boards"
   ```

2. 필요한 패키지를 설치합니다.

   ```bash
   npm install
   ```

3. 서버를 실행합니다.

   ```bash
   npm run dev
   ```

## 기술 스택

- React
- Scss
- Mobx
- Javascript
- Typescript
- Next.js

## 구현사항

- [x] 사용자 회원가입
- [x] 로그인
- [x] 로그인한 사용자 정보 표시
- [x] 글 등록, 조회(페이지네이션), 수정, 삭제

## 폴더 구조

📦src
┣ 📂api
┃ ┣ 📂auth
┃ ┃ ┣ 📜login.ts
┃ ┃ ┣ 📜refreshAccessToken.ts
┃ ┃ ┗ 📜register.ts
┃ ┗ 📂board
┃ ┃ ┗ 📜boardCRUD.ts
┣ 📂app
┃ ┣ 📂board
┃ ┃ ┣ 📜BoardForm.tsx
┃ ┃ ┣ 📜Header.tsx
┃ ┃ ┣ 📜layout.tsx
┃ ┃ ┗ 📜page.tsx
┃ ┣ 📂signup
┃ ┃ ┗ 📜page.tsx
┃ ┣ 📜layout.tsx
┃ ┗ 📜page.tsx
┣ 📂stores
┃ ┗ 📜userStore.ts
┣ 📂styles
┃ ┣ 📜board.module.scss
┃ ┣ 📜globals.scss
┃ ┣ 📜header.module.scss
┃ ┣ 📜home.module.scss
┃ ┗ 📜signUp.module.scss
┗ 📂utils
┃ ┗ 📜formValidation.ts

## 고민한 점

### Access Token과 Refresh Token

#### 저장 위치

로그인 상태 유지를 위해 액세스 토큰과 리프레시 토큰을 저장하는 방법을 결정할 때, 로컬스토리지와 전역 상태를 비교하며 고민했습니다.

- 로컬스토리지는 페이지 새로 고침 후에도 데이터가 유지되는 특징이 있어, 로그인 상태를 유지하는 데 유용합니다. 그러나 보안상 취약점이 존재할 수 있기 때문에, 중요한 정보는 저장할 때 주의가 필요합니다.

- 전역 상태(Mobx)는 상태를 관리하기 용이하고, 컴포넌트 간 데이터 전달이 빠르다는 장점이 있지만, 페이지 새로 고침 시 상태가 초기화된다는 단점이 있습니다.

이러한 점을 고려하여, 로컬스토리지에 액세스 토큰과 리프레시 토큰을 저장하기로 결정했습니다. 이렇게 구현함으로써 사용자가 페이지를 새로 고침하거나 브라우저를 종료한 후에도 로그인 상태를 유지할 수 있게 되었습니다.

#### 토큰 갱신 및 요청 흐름

과제를 진행하면서 액세스 토큰이 만료되는 상황에서 사용자가 불편함을 느끼지 않도록 어떻게 처리할지를 고민했습니다. 다음은 제가 구현한 토큰 갱신 및 요청 흐름입니다.

![토큰 도식화](https://github.com/user-attachments/assets/2b432df6-2944-494e-873e-03b98986596b)

1. **요청 시 토큰 만료 확인**: 사용자가 요청을 할 때, 서버로부터 받은 응답에 따라 액세스 토큰이 만료되었는지 확인합니다.

2. **리프레시 토큰으로 새 액세스 토큰 요청**: 액세스 토큰이 만료되었을 경우, 로컬스토리지에 저장된 리프레시 토큰을 사용하여 새로운 액세스 토큰을 요청합니다.

3. **새 액세스 토큰 저장**: 새로 발급된 액세스 토큰을 로컬스토리지에 저장하고, 기존 요청을 새로운 토큰으로 다시 처리합니다.

4. **리프레시 토큰 만료 시 로그인 페이지로 이동**: 만약 리프레시 토큰마저 만료되면, 사용자는 자동으로 로그인 페이지로 리디렉션됩니다. 이후 사용자는 다시 로그인을 통해 새로운 토큰을 발급받을 수 있습니다.
