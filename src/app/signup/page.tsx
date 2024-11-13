"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { validateEmail, validatePassword } from "@/utils/formValidation";
import register from "@/api/auth/register";

import styles from "@/styles/signUp.module.scss";

export default function SignUp() {
  const [form, setForm] = useState({
    email: "",
    name: "",
    password: "",
    passwordConfirm: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    name: "",
    password: "",
    passwordConfirm: "",
  });

  const [serverError, setServerError] = useState<string>();

  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    let formIsValid = true;
    const newErrors = {
      email: "",
      name: "",
      password: "",
      passwordConfirm: "",
    };

    if (!validateEmail(form.email)) {
      newErrors.email = "유효한 이메일을 입력해주세요.";
      formIsValid = false;
    }

    if (!form.name.trim()) {
      newErrors.name = "이름을 입력해주세요.";
      formIsValid = false;
    }

    if (!validatePassword(form.password)) {
      newErrors.password =
        "비밀번호는 8자 이상, 숫자, 영문자, 특수문자(!%*#?&)를 포함해야 합니다.";
      formIsValid = false;
    }

    if (form.password !== form.passwordConfirm) {
      newErrors.passwordConfirm = "비밀번호가 일치하지 않습니다.";
      formIsValid = false;
    }

    setErrors(newErrors);

    if (formIsValid) {
      try {
        await register(
          form.email,
          form.name,
          form.password,
          form.passwordConfirm
        );
        router.push("/");
      } catch (error) {
        if (error instanceof Error) {
          setServerError(error.message);
        } else {
          setServerError(
            "회원 가입중 문제가 발생했습니다. 다시 시도해 주세요."
          );
        }
      }
    }
  }

  return (
    <div className={styles.signUpContainer}>
      <button className={styles.backBtn} onClick={() => router.back()}>
        뒤로가기
      </button>
      <h2>회원가입</h2>
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
          <label htmlFor="name">이름</label>
          <input
            type="text"
            placeholder="이름을 입력하세요"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          {errors.name && <p className={styles.error}>{errors.name}</p>}
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
        <div className={styles.formGroup}>
          <label htmlFor="passwordConfirm">비밀번호 확인</label>
          <input
            type="password"
            placeholder="비밀번호를 입력하세요"
            value={form.passwordConfirm}
            onChange={(e) =>
              setForm({ ...form, passwordConfirm: e.target.value })
            }
            required
          />
          {errors.passwordConfirm && (
            <p className={styles.error}>{errors.passwordConfirm}</p>
          )}
        </div>
        <button type="submit" className={styles.signUpBtn}>
          회원가입
        </button>
      </form>
      {serverError && <p className={styles.error}>{serverError}</p>}
    </div>
  );
}
