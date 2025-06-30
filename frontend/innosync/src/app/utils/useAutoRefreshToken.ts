"use client";
import { useEffect } from "react";

export default function useAutoRefreshToken() {
  useEffect(() => {
    const interval = setInterval(async () => {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) return;

      try {
        const res = await fetch("http://localhost:8080/api/auth/refresh", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.accessToken) {
            localStorage.setItem('token', data.accessToken);
          }
          if (data.refreshToken) {
            localStorage.setItem('refreshToken', data.refreshToken);
          }
        } else {
          // Refresh failed, log out user
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          window.location.href = '/authentication/login';
        }
      } catch (err) {
        console.error("Token refresh failed:", err);
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, []);
} 