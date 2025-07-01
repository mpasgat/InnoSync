"use client";
import { usePathname } from "next/navigation";
import Navbar from "./page";
import NavbarUser from "./page_logged_in";
import { useEffect, useState } from "react";

export default function NavbarWrapper() {
  const pathname = usePathname();
  const hideNavbar = pathname.startsWith("/authentication/login") || pathname.startsWith("/authentication/signup");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    }
  }, []);

  const handleMockLogin = () => {
    localStorage.setItem("token", "mocktoken");
    setIsLoggedIn(true);
  };

  if (hideNavbar) return null;
  if (isLoggedIn) return <NavbarUser onLogout={() => setIsLoggedIn(false)} />;
  return (
    <>
      <Navbar />
      <div style={{ position: 'fixed', top: 0, right: 0, zIndex: 9999 }}>
        <button onClick={handleMockLogin} style={{ padding: '8px 16px', margin: '8px', background: '#0070f3', color: 'white', border: 'none', borderRadius: '4px' }}>
          Mock Login
        </button>
      </div>
    </>
  );
}