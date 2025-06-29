import React from "react";
import Image from "next/image";
import styles from "./ChatPage.module.css";

export interface Message {
  id: string;
  sender: string;
  text?: string;
  imageUrl?: string;
  linkUrl?: string;
  timestamp: string;
  isOwn?: boolean;
  avatarUrl?: string;
}

interface MessageListProps {
  messages: Message[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  return (
    <div className={styles.messageList}>
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={
            msg.isOwn
              ? `${styles.messageRow} ${styles.messageRowOwn}`
              : styles.messageRow
          }
        >
          {!msg.isOwn && (
            <Image
              src={msg.avatarUrl || "/profile_image.png"}
              alt="avatar"
              className={styles.avatar}
              width={36}
              height={36}
              style={{ borderRadius: "50%" }}
            />
          )}
          <div
            className={
              msg.isOwn
                ? `${styles.bubble} ${styles.bubbleOwn}`
                : styles.bubble
            }
          >
            {msg.text && <div>{msg.text}</div>}
            {msg.imageUrl && (
              <Image src={msg.imageUrl} alt="attachment" width={200} height={200} style={{ maxWidth: 200, borderRadius: 8, marginTop: 8, objectFit: 'cover' }} />
            )}
            {msg.linkUrl && (
              <a href={msg.linkUrl} target="_blank" rel="noopener noreferrer" style={{ color: msg.isOwn ? '#fff' : '#1976d2', marginTop: 8 }}>
                {msg.linkUrl}
              </a>
            )}
          </div>
          <span className={styles.timestamp}>{msg.timestamp}</span>
        </div>
      ))}
    </div>
  );
};

export default MessageList;