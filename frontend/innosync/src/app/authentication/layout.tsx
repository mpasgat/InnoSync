import { ReactNode } from 'react';
import Image from "next/image";
import styles from "./page.module.css";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className={styles.parentContainer}>
        <div className={styles.authContent}>
          {children}
          <div className={styles.terms__container}>
            <p className={styles.terms}>By logging in with an account, you agree to Shorter.url&apos;s <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" className={styles.important}>Terms of service</a>, <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" className={styles.important}>Privacy Policy</a> and <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" className={styles.important}>Acceptable Use Policy</a></p>
          </div>
        </div>
        <div className={styles.backgroundContainer}>
          <Image
            src="/auth.svg"
            width={899}
            height={1080}
            className={styles.auth_logo}
            alt="auth decoration"
          />
        </div>
      </div>
    </>
  );
}
