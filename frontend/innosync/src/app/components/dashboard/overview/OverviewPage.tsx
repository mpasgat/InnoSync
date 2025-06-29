"use client";
import React from "react";
import styles from "./OverviewPage.module.css";

export default function OverviewPage() {
  return (
    <div className={styles.overviewContent}>
      <h2>Welcome to your Dashboard</h2>
      <p>Here you can manage your projects, invitations, and more.</p>

      {/* Add more overview-specific content here */}
      <div className={styles.overviewStats}>
        <div className={styles.statCard}>
          <h3>Active Projects</h3>
          <p className={styles.statNumber}>2</p>
        </div>
        <div className={styles.statCard}>
          <h3>Pending Invitations</h3>
          <p className={styles.statNumber}>3</p>
        </div>
        <div className={styles.statCard}>
          <h3>Open Proposals</h3>
          <p className={styles.statNumber}>1</p>
        </div>
        <div className={styles.statCard}>
          <h3>Unread Messages</h3>
          <p className={styles.statNumber}>5</p>
        </div>
      </div>
    </div>
  );
}