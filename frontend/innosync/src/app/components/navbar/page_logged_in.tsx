import Link from "next/link";
import Image from "next/image";
import styles from "./page.module.css";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

const ANIMATION_DURATION = 180; // ms

interface NavbarUserProps {
  onLogout?: () => void;
}

interface UserProfile {
  id: number;
  email: string;
  fullName: string;
  telegram: string;
  github: string;
  bio: string;
  position: string;
  education: string;
  expertise: string;
  expertiseLevel: string;
  resume: string;
  profilePicture: string;
  workExperience: Array<{
    startDate: string;
    endDate: string;
    position: string;
    company: string;
    description: string;
  }>;
  technologies: string[];
}

const NavbarUser: React.FC<NavbarUserProps> = ({ onLogout }) => {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const menuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profile/me`, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserProfile(data);
        } else {
          console.error("Failed to fetch user profile:", response.status, response.statusText);
          // For newly signed up users, we'll create a minimal profile from token
          // This handles cases where user exists but profile doesn't
          setUserProfile({
            id: 0,
            email: localStorage.getItem('userEmail') || '',
            fullName: localStorage.getItem('userFullName') || 'User',
            telegram: '',
            github: '',
            bio: '',
            position: '',
            education: '',
            expertise: '',
            expertiseLevel: '',
            resume: '',
            profilePicture: '',
            workExperience: [],
            technologies: []
          });
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  // Listen for profile updates and refetch data
  useEffect(() => {
    const handleProfileUpdate = () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profile/me`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            console.error("Failed to refetch user profile:", response.status, response.statusText);
            // Return fallback profile for new users
            return {
              id: 0,
              email: localStorage.getItem('userEmail') || '',
              fullName: localStorage.getItem('userFullName') || 'User',
              telegram: '',
              github: '',
              bio: '',
              position: '',
              education: '',
              expertise: '',
              expertiseLevel: '',
              resume: '',
              profilePicture: '',
              workExperience: [],
              technologies: []
            };
          }
        })
        .then(data => {
          if (data) {
            setUserProfile(data);
            setLoading(false);
          }
        })
        .catch(error => console.error("Error refetching user profile:", error));
    };

    window.addEventListener('profileUpdated', handleProfileUpdate);
    window.addEventListener('authStateChanged', handleProfileUpdate);
    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdate);
      window.removeEventListener('authStateChanged', handleProfileUpdate);
    };
  }, []);

  // Generate display name (first letter + surname)
  const getDisplayName = (fullName: string) => {
    if (!fullName) return "User";
    const nameParts = fullName.trim().split(" ");
    if (nameParts.length === 1) return nameParts[0];
    const firstName = nameParts[0];
    const lastName = nameParts[nameParts.length - 1];
    return `${firstName.charAt(0)}.${lastName}`;
  };

  useEffect(() => {
    if (menuOpen) {
      setShowDropdown(true);
    } else if (showDropdown) {
      // Wait for animation to finish before removing from DOM
      const timeout = setTimeout(() => setShowDropdown(false), ANIMATION_DURATION);
      return () => clearTimeout(timeout);
    }
  }, [menuOpen, showDropdown]);

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

    // Always clear local storage and trigger UI updates, even if API call fails
    const clearAuthAndUpdateUI = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userFullName");
      window.dispatchEvent(new CustomEvent('authStateChanged'));
      if (onLogout) onLogout();
      // Redirect to home page after logout
      router.push("/");
    };

    if (!refreshToken) {
      clearAuthAndUpdateUI();
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ refreshToken })
      });

      if (!response.ok) {
        console.error("Logout failed:", await response.text());
      }
    } catch (err) {
      console.error("Error during logout:", err);
    } finally {
      // Always clear auth state, regardless of API response
      clearAuthAndUpdateUI();
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
                {loading ? "Loading..." : getDisplayName(userProfile?.fullName || "")}
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
                  <div className={styles.userDropdownName}>
                    {loading ? "Loading..." : userProfile?.fullName || "User"}
                  </div>
                  <div className={styles.userDropdownEmail}>
                    {loading ? "Loading..." : userProfile?.email || ""}
                  </div>
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
