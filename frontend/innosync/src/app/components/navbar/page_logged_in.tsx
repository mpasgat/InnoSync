import Link from "next/link";
import Image from "next/image";
import styles from "./page.module.css";
import React, { useState, useRef, useEffect } from "react";

const ANIMATION_DURATION = 180; // ms

interface NavbarUserProps {
  onLogout?: () => void;
}

const NavbarUser: React.FC<NavbarUserProps> = ({ onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (menuOpen) {
      setShowDropdown(true);
    } else if (showDropdown) {
      // Wait for animation to finish before removing from DOM
      const timeout = setTimeout(() => setShowDropdown(false), ANIMATION_DURATION);
      return () => clearTimeout(timeout);
    }
  }, [menuOpen]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  const handleLogout = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      if (onLogout) onLogout();
      return;
    }
    try {
      await fetch("http://localhost:8080/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      if (onLogout) onLogout();
    } catch (err) {
      console.log("Error logging out:", err);
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      if (onLogout) onLogout();
    }
  };

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

        {/* User Info (Bell + Username) */}
        <div className={styles.authButtons}>
          <span className={styles.userInfo}>
            <Image src="/bell.svg" alt="Notifications" width={28} height={28} className={styles.userIcon} />
            <div
              className={styles.userMenu}
              ref={userMenuRef}
              onClick={() => setMenuOpen((open) => !open)}
              style={{ cursor: "pointer" }}
            >
              A.Alimi
              <Image src="/user_chevron.svg" alt="User Menu" width={24} height={24} className={styles.userIcon} />
            </div>
            {showDropdown && (
              <div
                className={
                  styles.userDropdown +
                  ' ' +
                  (menuOpen ? styles.userDropdownOpen : styles.userDropdownClose)
                }
                ref={menuRef}
                style={{ transitionDuration: ANIMATION_DURATION + 'ms' }}
              >
                <div className={styles.userDropdownHeader}>
                  <div className={styles.userDropdownName}>Ahmed Baha Eddine Alimi</div>
                  <div className={styles.userDropdownEmail}>3llimi69@gmail.com</div>
                </div>
                <hr className={styles.userDropdownDivider} />
                <div className={styles.userDropdownItem}>
                  <Image src="/settings.svg" alt="Settings" width={20} height={20} className={styles.userDropdownIcon} />
                  <span><Link href="/dashboard/overview">Dashboard</Link></span>
                </div>
                <div className={styles.userDropdownItem}>
                  <Image src="/help.svg" alt="Help Center" width={20} height={20} className={styles.userDropdownIcon} />
                  <span>Help Center</span>
                </div>
                <hr className={styles.userDropdownDivider} />
                <div className={styles.userDropdownItem} onClick={handleLogout} style={{ cursor: "pointer" }}>
                  <Image src="/logout.svg" alt="Sign Out" width={20} height={20} className={styles.userDropdownIcon} />
                  <span>Sign Out</span>
                </div>
              </div>
            )}
          </span>
        </div>
      </div>
    </nav>
  );
};

export default NavbarUser;
