import React from "react";
import styles from "./ChatPage.module.css";

export interface GroupMember {
  id: string;
  name: string;
  avatarUrl: string;
  timestamp: string;
}

interface GroupInfoPanelProps {
  groupName: string;
  groupAvatarUrls: string[];
  members: GroupMember[];
}

const GroupInfoPanel: React.FC<GroupInfoPanelProps> = ({ groupName, groupAvatarUrls, members }) => (
  <div className={styles.groupInfoPanel}>
    <div className={styles.groupAvatarWrapper}>
      {groupAvatarUrls.map((url, i) => (
        <img key={i} src={url} alt="member" className={styles.groupAvatarImg} style={{ left: i * 24 }} />
      ))}
    </div>
    <div className={styles.groupName}>{groupName}</div>
    <div className={styles.groupMembersCount}>{members.length} Members</div>
    <div className={styles.groupMembersList}>
      {members.map(m => (
        <div key={m.id} className={styles.groupMemberRow}>
          <img src={m.avatarUrl} alt={m.name} className={styles.groupMemberAvatar} />
          <div className={styles.groupMemberName}>{m.name}</div>
          <div className={styles.groupMemberTimestamp}>{m.timestamp}</div>
        </div>
      ))}
    </div>
  </div>
);

export default GroupInfoPanel;