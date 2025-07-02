"use client";
import { usePathname } from "next/navigation";
import Navbar from "./page";
import NavbarUser from "./page_logged_in";
import { useEffect, useState } from "react";

export default function NavbarWrapper() {
  const pathname = usePathname();
  const hideNavbar = pathname.startsWith("/authentication/login") || pathname.startsWith("/authentication/signup");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check authentication status on mount and when storage changes
  const checkAuthStatus = () => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    }
  };

  useEffect(() => {
    checkAuthStatus();

    // Listen for storage changes (when tokens are added/removed)
    const handleStorageChange = () => {
      checkAuthStatus();
    };

    // Listen for custom events from login/signup
    const handleProfileUpdate = () => {
      checkAuthStatus();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('profileUpdated', handleProfileUpdate);
    window.addEventListener('authStateChanged', handleProfileUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('profileUpdated', handleProfileUpdate);
      window.removeEventListener('authStateChanged', handleProfileUpdate);
    };
  }, []);

  // Force navbar refresh when navigating to dashboard
  useEffect(() => {
    if (pathname.startsWith("/dashboard") && isLoggedIn) {
      // Small delay to ensure navigation is complete
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('profileUpdated'));
      }, 100);
    }
  }, [pathname, isLoggedIn]);

  if (hideNavbar) return null;
  if (isLoggedIn) return <NavbarUser onLogout={() => setIsLoggedIn(false)} />;
  return <Navbar />;
}