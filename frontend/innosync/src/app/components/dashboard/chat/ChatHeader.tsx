import React from "react";
import Image from "next/image";
import styles from "./ChatPage.module.css";

interface ChatHeaderProps {
  avatarUrl?: string;
  name: string;
  status?: string;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ avatarUrl, name, status }) => {
  return (
    <div className={styles.header}>
      <div className={styles.avatar}>
        <Image
          src={avatarUrl || "/profile_image.png"}
          alt="avatar"
          width={40}
          height={40}
          style={{ borderRadius: "50%" }}
        />
        {/* Online status dot */}
        <span className={styles.statusDot} />
      </div>
      <div className={styles.headerText}>
        <span className={styles.name}>{name}</span>
        {status && <span className={styles.status}>{status}</span>}
      </div>
    </div>
  );
};

export default ChatHeader;