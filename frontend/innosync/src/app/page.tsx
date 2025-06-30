"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleClick = async () => {
    const res = await fetch("/api/hello");
    const data = await res.json();
    setMessage(data.message);
  };

  const handleLogout = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      router.push("/authentication/login");
      return;
    }
    try {
      const res = await fetch("http://localhost:8080/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });
      if (res.ok) {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        router.push("/authentication/login");
      } else {
        // Optionally handle error
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        router.push("/authentication/login");
      }
    } catch (err) {
      console.log("Error logging out:", err);
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      router.push("/authentication/login");
    }
  };

  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
      }}
    >
      <div style={{ display: "flex", gap: "1rem" }}>
        <button
          onClick={handleClick}
          style={{
            padding: "1rem 2rem",
            fontSize: "1.2rem",
            cursor: "pointer",
          }}
        >
          Say Hello
        </button>
        <button
          onClick={handleLogout}
          style={{
            padding: "1rem 2rem",
            fontSize: "1.2rem",
            cursor: "pointer",
            background: "#e74c3c",
            color: "white",
            border: "none",
            borderRadius: "4px",
          }}
        >
          Log out
        </button>
      </div>
      {message && (
        <p style={{ marginTop: "1rem", fontSize: "1.1rem" }}>{message}</p>
      )}
    </main>
  );
}
