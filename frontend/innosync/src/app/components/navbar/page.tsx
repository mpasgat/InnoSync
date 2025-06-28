import Link from "next/link";
import styles from "./page.module.css";

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.navContent}>
        {/* Logo */}
        <div className={styles.logo}>
          <Link href="/" className={styles.logoLink}>
            <span className={styles.logoText}>Inno</span>Sync
          </Link>
        </div>

        {/* Navigation Links */}
        <div className={styles.navLinks}>
          <div className={styles.navItem}>
            <Link href="/components/projects" className={styles.navLink}>
              Find Project
            </Link>
            <svg className={styles.chevronIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className={styles.navItem}>
            <Link href="/components/talent" className={styles.navLink}>
              Find Talent
            </Link>
            <svg className={styles.chevronIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className={styles.navItem}>
            <Link href="/components/about" className={styles.navLink}>
              About Us
            </Link>
            <svg className={styles.chevronIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* Auth Buttons */}
        <div className={styles.authButtons}>
          <Link href="/authentication/login" className={styles.loginButton}>
            Login
          </Link>
          <Link href="/authentication/signup" className={styles.signupButton}>
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
