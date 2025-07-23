import React, { useState } from "react";
import Image from "next/image";
import styles from "./ChatPage.module.css";

interface MessageComposerProps {
  onSend: (text: string) => void | Promise<void>;
  disabled?: boolean;
}

const MessageComposer: React.FC<MessageComposerProps> = ({ onSend, disabled = false }) => {
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (input.trim() && !disabled) {
      await onSend(input);
      setInput("");
    }
  };

  return (
    <div className={styles.composer}>
      <button className={styles.iconBtn} title="Attach" type="button" disabled={disabled}>
        <Image src="/attach.svg" alt="Attach" width={24} height={24} />
      </button>
      <input
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
        placeholder="Type your message"
        className={styles.input}
        disabled={disabled}
      />
      <button onClick={handleSend} className={styles.sendBtn} title="Send" type="button" disabled={disabled}>
        <Image src="/send.svg" alt="Send" width={24} height={24} />
      </button>
    </div>
  );
};

export default MessageComposer;