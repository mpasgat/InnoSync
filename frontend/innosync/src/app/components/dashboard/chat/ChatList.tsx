import React from "react";
import styles from "./ChatPage.module.css";

export interface ChatItem {
  id: string;
  avatarUrl: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unread?: boolean;
  active?: boolean;
}

interface ChatListProps {
  chats: ChatItem[];
  selectedId: string;
  onSelect: (id: string) => void;
}

const ChatList: React.FC<ChatListProps> = ({ chats, selectedId, onSelect }) => (
  <div className={styles.chatListSidebar}>
    <div className={styles.searchBarWrapper}>
      <div className={styles.searchInputWrapper}>
        <span className={styles.searchIcon}>
          {/* Inline SVG for search icon */}
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="10" cy="10" r="8" stroke="#727272" strokeWidth="2" />
            <path d="M16 16L20 20" stroke="#727272" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </span>
        <input
          className={styles.searchBar}
          placeholder="Search"
          style={{ fontFamily: 'Roboto, Arial, sans-serif', fontSize: 16, color: '#727272' }}
        />
      </div>
    </div>
    <div className={styles.chatList}>
      {chats.map(chat => (
        <div
          key={chat.id}
          className={
            chat.id === selectedId
              ? `${styles.chatListItem} ${styles.activeChat}`
              : styles.chatListItem
          }
          onClick={() => onSelect(chat.id)}
        >
          <img src={chat.avatarUrl} alt={chat.name} className={styles.chatListAvatar} />
          <div className={styles.chatListText}>
            <div className={styles.chatListName}>{chat.name}</div>
            <div className={styles.chatListLastMsg}>{chat.lastMessage}</div>
          </div>
          <div className={styles.chatListTimestamp}>{chat.timestamp}</div>
        </div>
      ))}
    </div>
  </div>
);

export default ChatList;