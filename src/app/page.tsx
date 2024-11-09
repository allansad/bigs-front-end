import styles from "../styles/home.module.scss";

export default function Home() {
  return (
    <div className={styles.loginContainer}>
      <h2>로그인</h2>
      <form>
        <div className={styles.formGroup}>
          <label htmlFor="email">이메일</label>
          <input
            type="email"
            id="email"
            placeholder="이메일을 입력하세요"
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="password">비밀번호</label>
          <input
            type="password"
            id="password"
            placeholder="비밀번호를 입력하세요"
            required
          />
        </div>
        <button type="submit" className={styles.loginBtn}>
          로그인
        </button>
      </form>
      <p>
        계정이 없으신가요? <a href="/signup">회원가입</a>
      </p>
    </div>
  );
}
