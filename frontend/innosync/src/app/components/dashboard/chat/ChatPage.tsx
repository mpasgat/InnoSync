"use client";
import React, { useState } from "react";
import ChatHeader from "./ChatHeader";
import MessageList, { Message } from "./MessageList";
import MessageComposer from "./MessageComposer";
import ChatList, { ChatItem } from "./ChatList";
import GroupInfoPanel, { GroupMember } from "./GroupInfoPanel";
import styles from "./ChatPage.module.css";

const chatListMock: ChatItem[] = [
  {
    id: "1",
    avatarUrl: "/profile_image.png",
    name: "Bill Kuphal",
    lastMessage: "The weather will be perfect for th...",
    timestamp: "9:41 AM",
    active: true,
  },
  {
    id: "2",
    avatarUrl: "/profile_image.png",
    name: "InnoSync",
    lastMessage: "Here're my latest drone shots",
    timestamp: "9:16 AM",
  },
  // ... more mock chats ...
];

const groupMembersMock: GroupMember[] = [
  {
    id: "1",
    name: "Jessica",
    avatarUrl: "/profile_image.png",
    timestamp: "24/7/2024, 5:04 pm",
  },
  {
    id: "2",
    name: "George Allen",
    avatarUrl: "/profile_image.png",
    timestamp: "24/7/2024, 4:57 pm",
  },
  {
    id: "3",
    name: "Cameron Lee",
    avatarUrl: "/profile_image.png",
    timestamp: "24/7/2024, 5:06 pm",
  },
];

const groupAvatarUrls = [
  "/profile_image.png",
  "/profile_image.png",
];

const mockUser = {
  avatarUrl: "/profile_image.png",
  name: "Bill Kuphal",
  status: "Online for 10 mins",
};

const initialMessages: Message[] = [
  {
    id: "1",
    sender: "Bill Kuphal",
    text: "Who was that philosopher you shared with me recently?",
    timestamp: "2:14 PM",
    isOwn: false,
    avatarUrl: "/profile_image.png",
  },
  {
    id: "2",
    sender: "You",
    text: "Roland Barthes",
    timestamp: "2:16 PM",
    isOwn: true,
    avatarUrl: "/profile_image.png",
  },
];

export default function ChatPage() {
  const [selectedChat, setSelectedChat] = useState<string>(chatListMock[0].id);
  const [messages, setMessages] = useState<Message[]>(initialMessages);

  // TODO: Fetch messages for selected chat from backend

  const handleSend = (text: string) => {
    // TODO: Send message to backend here
    const newMessage: Message = {
      id: (messages.length + 1).toString(),
      sender: "You",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isOwn: true,
      avatarUrl: "/profile_image.png",
    };
    setMessages([...messages, newMessage]);
  };

  return (
    <div className={styles.layout}>
      <ChatList chats={chatListMock} selectedId={selectedChat} onSelect={setSelectedChat} />
      <div className={styles.centerColumn}>
        <ChatHeader avatarUrl={mockUser.avatarUrl} name={mockUser.name} status={mockUser.status} />
        <MessageList messages={messages} />
        <MessageComposer onSend={handleSend} />
      </div>
      <GroupInfoPanel groupName="InnoSync" groupAvatarUrls={groupAvatarUrls} members={groupMembersMock} />
    </div>
  );
}