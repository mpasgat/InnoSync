import React, { useState } from "react";
import Image from "next/image";
import styles from "./ChatPage.module.css";

interface MessageComposerProps {
  onSend: (text: string) => void;
}

const MessageComposer: React.FC<MessageComposerProps> = ({ onSend }) => {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim()) {
      onSend(input);
      setInput("");
    }
  };

  return (
    <div className={styles.composer}>
      <button className={styles.iconBtn} title="Attach" type="button">
        <Image src="/attach.svg" alt="Attach" width={24} height={24} />
      </button>
      <input
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
        placeholder="Type your message"
        className={styles.input}
      />
      <button onClick={handleSend} className={styles.sendBtn} title="Send" type="button">
        <Image src="/send.svg" alt="Send" width={24} height={24} />
      </button>
    </div>
  );
};

export default MessageComposer;