"use client";

import { useState } from "react";

import styles from "../../styles/signUp.module.scss";

export default function SignUp() {
  return (
    <div className={styles.signUpContainer}>
      <h2>회원가입</h2>
      <form>
        <div className={styles.formGroup}>
          <label htmlFor="email">이메일</label>
          <input type="email" placeholder="이메일을 입력하세요" required />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="text">이름</label>
          <input type="text" placeholder="이름을 입력하세요" required />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="password">비밀번호</label>
          <input type="password" placeholder="비밀번호를 입력하세요" required />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="password">비밀번호 확인</label>
          <input type="password" placeholder="비밀번호를 입력하세요" required />
        </div>
        <button type="submit" className={styles.signUpBtn}>
          회원가입
        </button>
      </form>
    </div>
  );
}
