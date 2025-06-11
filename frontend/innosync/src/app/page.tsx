"use client";

import { useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");

  const handleClick = async () => {
    const res = await fetch("/api/hello");
    const data = await res.json();
    setMessage(data.message);
  };

  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
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
      {message && (
        <p style={{ marginTop: "1rem", fontSize: "1.1rem" }}>{message}</p>
      )}
    </main>
  );
}
