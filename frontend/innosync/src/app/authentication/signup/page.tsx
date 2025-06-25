// src/app/authentication/signup/page.tsx

<<<<<<< Updated upstream
import React from "react";

export default function SignupPage() {
  return (
    <div>
      <h1>Signup Page</h1>
      {/* Add your signup form here */}
=======
import Image from "next/image";
import styles from "../page.module.css";
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';





export default function SignUp() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    
    name: '',
    surname: '',
    middleName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({
    name: false,
    surname: false,
    email: false,
    password: false,
    confirmPassword: false,
    passwordMatch: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: false,
        passwordMatch: name === 'password' || name === 'confirmPassword' ? false : prev.passwordMatch
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const newErrors = {
    name: formData.name.trim() === '',
    surname: formData.surname.trim() === '',
    email: formData.email.trim() === '',
    password: formData.password.trim() === '',
    confirmPassword: formData.confirmPassword.trim() === '',
    passwordMatch: formData.password !== formData.confirmPassword
  };

  setErrors(newErrors);

  if (!Object.values(newErrors).some(Boolean)) {
    // ✅ Combine name + surname + middlename into fullName
    const fullName = `${formData.name} ${formData.surname} ${formData.middleName}`.trim();

    try {
      const res = await fetch('http://localhost:8080/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          fullName: fullName
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error('Signup failed:', errorData);
        alert(`Signup failed: ${errorData.error || 'Unknown error'}`);
        return;
      }

      const data = await res.json();
      console.log('Signup successful:', data);
      alert('Signup successful!');
      router.push('/components/home');

      // You can redirect to login page here
    } catch (err) {
      console.error('Network error during signup:', err);
      alert('Signup failed due to network error');
    }
  }

  };

  return (
    <div className={styles.parentContainer}>
      <div className={styles.signup}>
        <p className={styles.page__title}>Create your account</p>
        <p className={styles.link__title}>Already have an account ? <span className={styles.link}> <Link href="/authentication/login">Log in</Link></span></p>
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
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputs}>
            <div className={styles.name__inputs}>
              <div className={styles.name}>
                <p className={styles.label}>Name</p>
                <input type="text" name="name" placeholder="Name" className={`${styles.name__input} ${errors.name ? styles.error : ''}`} value={formData.name} onChange={handleChange} />
                {errors.name && <p className={styles.errorMessage}>Name is required</p>}
              </div>
              <div className={styles.surname}>
                <p className={styles.label}>Surname</p>
                <input type="text" name="surname" placeholder="Surname" className={`${styles.name__input} ${errors.surname ? styles.error : ''}`} value={formData.surname} onChange={handleChange} />
                {errors.surname && <p className={styles.errorMessage}>Surname is required</p>}
              </div>
              <div className={styles.middlename}>
                <p className={styles.label}>Middle Name</p>
                <input type="text" name="middleName" placeholder="Middle Name" className={styles.name__input} value={formData.middleName} onChange={handleChange} />
              </div>
            </div>
            <div className={styles.email}>
              <p className={styles.label}>Email</p>
              <input type="text" name="email" placeholder="Email" className={`${styles.input} ${errors.email ? styles.error : ''}`} value={formData.email} onChange={handleChange} />
              {errors.email && <p className={styles.errorMessage}>Email is required</p>}
            </div>
            <div className={styles.password}>
              <p className={styles.label}>Password</p>
              <input type="password" name="password" placeholder="Password" className={`${styles.input} ${errors.password ? styles.error : ''}`} value={formData.password} onChange={handleChange} />
              {errors.password && <p className={styles.errorMessage}>Password is required</p>}
            </div>
            <div className={styles.confirm_password}>
              <p className={styles.label}>Confirm Password</p>
              <input type="Password" name="confirmPassword" placeholder="Password" className={`${styles.input} ${errors.confirmPassword || errors.passwordMatch ? styles.error : ''}`} value={formData.confirmPassword} onChange={handleChange} />
              {errors.confirmPassword && <p className={styles.errorMessage}>Please confirm your password</p>}
              {errors.passwordMatch && <p className={styles.errorMessage}>Passwords don&apos;t match</p>}
            </div>
          </div>
          <button type="submit" className={styles.submit__btn}>Continue</button>
        </form>
      </div>
      <div className={styles.terms__container}>
        <p className={styles.terms}>By logging in with an account, you agree to Shorter.url&apos;s <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" className={styles.important}>Terms of service</a>, <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" className={styles.important}>Privacy Policy</a> and <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" className={styles.important}>Acceptable Use Policy</a></p>
      </div>
>>>>>>> Stashed changes
    </div>
  );
}
