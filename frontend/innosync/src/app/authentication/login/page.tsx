<<<<<<< Updated upstream
// src/app/authentication/login/page.tsx
=======
"use client";
import Image from "next/image";
import styles from "../page.module.css";
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';



>>>>>>> Stashed changes

import React from "react";

export default function LoginPage() {
<<<<<<< Updated upstream
=======
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors] = useState({
    email: false,
    password: false
  });

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();

  //   const newErrors = {
  //     email: email.trim() === '',
  //     password: password.trim() === ''
  //   };

  //   setErrors(newErrors);

  //   if (!newErrors.email && !newErrors.password) {
  //     console.log('Logging in with:', email, password);
  //   }
  // };
 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

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
      const text = await res.text();
      console.error("Login failed:", text);
      alert("Login failed: " + text);
      return;
    }

    const data = await res.json();
    console.log("Login success:", data);
    alert("Login success!");
    router.push('/components/home');

  } catch (err) {
    console.error("Fetch error:", err);
    alert("Fetch failed");
  }
};




>>>>>>> Stashed changes
  return (
    <div>
      <h1>Login Page</h1>
      {/* Add your login form or component here */}
    </div>
  );
}
