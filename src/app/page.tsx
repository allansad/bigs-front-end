"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { validateEmail, validatePassword } from "@/utils/\bformValidation";
import login from "@/api/auth/login";
import styles from "../styles/home.module.scss";

export default function Home() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [serverError, setServerError] = useState<string>();

  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    let formIsValid = true;
    const newErrors = {
      email: "",
      password: "",
    };

    if (!validateEmail(form.email)) {
      newErrors.email = "유효한 이메일을 입력해주세요.";
      formIsValid = false;
    }

    if (!validatePassword(form.password)) {
      newErrors.password = "비밀번호는 8자 이상이어야 합니다.";
      formIsValid = false;
    }

    setErrors(newErrors);

    if (formIsValid) {
      try {
        await login(form.email, form.password);
        router.push("/board");
      } catch (error) {
        if (error instanceof Error) {
          setServerError(error.message);
        } else {
          setServerError("로그인 중 문제가 발생했습니다. 다시 시도해주세요.");
        }
      }
    }
  }

  return (
    <div className={styles.loginContainer}>
      <h2>로그인</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="email">이메일</label>
          <input
            type="email"
            placeholder="이메일을 입력하세요"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          {errors.email && <p className={styles.error}>{errors.email}</p>}
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="password">비밀번호</label>
          <input
            type="password"
            placeholder="비밀번호를 입력하세요"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          {errors.password && <p className={styles.error}>{errors.password}</p>}
        </div>
        <button type="submit" className={styles.loginBtn}>
          로그인
        </button>
      </form>
      <p>
        계정이 없으신가요? <a href="/signup">회원가입</a>
      </p>
      {serverError && <p className={styles.error}>{serverError}</p>}
    </div>
  );
}
