// src/app/authentication/login/page.tsx

"use client";
import Image from "next/image";
import styles from "../page.module.css";
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ErrorBanner from "../../components/common/error_banner";

import React from "react";

export default function LoginPage() {

  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({
    email: false,
    password: false
  });
  const [generalError, setGeneralError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);
    const newErrors = {
      email: email.trim() === '',
      password: password.trim() === ''
    };
    setErrors(newErrors);
    if (newErrors.email || newErrors.password) {
      return;
    }
    try {
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!res.ok) {
        let errorMsg = "Login failed. Please check your credentials.";
        try {
          const text = await res.text();
          errorMsg = text || errorMsg;
        } catch {}
        setGeneralError(errorMsg);
        return;
      }

      const data = await res.json();
      console.log("Login success:", data);
      if (data.accessToken) {
        localStorage.setItem('token', data.accessToken);
      }
      router.push('/components/home');
    } catch (err) {
      setGeneralError("Network error. Please try again later.");
      console.error("Fetch error:", err);
    }
  };

  return (
    <div className={styles.parentContainer}>
      <div className={styles.login}>
        {generalError && <ErrorBanner message={generalError} />}
        <p className={styles.page__title}>Log in with you company account</p>
        <p className={styles.link__title}>Don&apos;t have an account ? <span className={styles.link}><Link href="/authentication/signup">Sign up</Link></span></p>
        <div className={styles.ssoButtons}>
          <Image
            src="/yandex.svg"
            alt="Yandex Login"
            width={600}
            height={54}
            className={styles.ssoButton}
          />
          <Image
            src="/google.svg"
            alt="google Login"
            width={600}
            height={54}
            className={styles.ssoButton}
          />
        </div>
        <p className={styles.or}>OR</p>
        <form onSubmit={handleSubmit} className={styles.inputs}>
          <div className={styles.inputs}>
            <div className={styles.inputWrapper}>
              <p className={styles.label}>Email</p>
              <input
                className={`${styles.input} ${errors.email ? styles.error : ''}`}
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors(prev => ({ ...prev, email: false }));
                }}
                autoComplete="email"
              />
              {errors.email && (
                <span className={styles.inputErrorIcon}>
                  <Image src="/error_icon.svg" alt="error" width={18} height={18} />
                </span>
              )}
            </div>
            {errors.email && (
              <div className={styles.errorMessage}>Email is required</div>
            )}
            <div className={styles.inputWrapper}>
              <p className={styles.label}>Password</p>
              <input
                className={`${styles.input} ${errors.password ? styles.error : ''}`}
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors(prev => ({ ...prev, password: false }));
                }}
                autoComplete="current-password"
              />
              {errors.password && (
                <span className={styles.inputErrorIcon}>
                  <Image src="/error_icon.svg" alt="error" width={18} height={18} />
                </span>
              )}
            </div>
            {errors.password && (
              <div className={styles.errorMessage}>Password is required</div>
            )}
          </div>
          <button type="submit" className={styles.submit__btn}>Log in</button>
        </form>
      </div>
    </div>
  );
}
