// src/app/authentication/login/page.tsx

"use client";
import Image from "next/image";
import styles from "../page.module.css";
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import React from "react";

export default function LoginPage() {

  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({
    email: false,
    password: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = {
      email: email.trim() === '',
      password: password.trim() === ''
    };
    setErrors(newErrors);

    if (newErrors.email || newErrors.password) {
      if (newErrors.email) {
        toast.error('Email is required', {
          position: 'top-center',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: 'colored',
        });
      }
      if (newErrors.password) {
        toast.error('Password is required', {
          position: 'top-center',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: 'colored',
        });
      }
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
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
        toast.error(errorMsg, {
          position: 'top-center',
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: 'colored',
        });
        return;
      }

      const data = await res.json();
      console.log("Login success:", data);
      if (data.accessToken) {
        localStorage.setItem('token', data.accessToken);
      }
      if (data.refreshToken) {
        localStorage.setItem('refreshToken', data.refreshToken);
      }

      toast.success('Login successful!', {
        position: 'top-center',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'colored',
      });

      // Trigger navbar refresh and auth state change
      window.dispatchEvent(new CustomEvent('profileUpdated'));
      window.dispatchEvent(new CustomEvent('authStateChanged'));

      router.push('/components/home');
    } catch (err) {
      toast.error("Network error. Please try again later.", {
        position: 'top-center',
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'colored',
      });
      console.error("Fetch error:", err);
    }
  };

  return (
    <div className={styles.parentContainer}>
      <div className={styles.login}>
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
          </div>
          <button type="submit" className={styles.submit__btn}>Log in</button>
        </form>
      </div>
      <ToastContainer aria-label="Notification messages" />
    </div>
  );
}
