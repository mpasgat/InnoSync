"use client";
import React from "react";
import styles from "./OverviewPage.module.css";
import { useRouter } from "next/navigation";

const SimpleDashboard = () => {
  const router = useRouter();
  const stats = [
    { label: "Active projects:", value: "2", route: "/dashboard/projects" },
    { label: "Pending Invitations:", value: "3", route: "/dashboard/invitations" },
    { label: "Open proposals:", value: "1", route: "/dashboard/proposals" },
    { label: "Unread messages:", value: "5", route: "/dashboard/chats" },
  ];

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.dashboardHeader}>
        <h1 className={styles.dashboardTitle}>Welcome to your Dashboard</h1>
        <p className={styles.dashboardSubtitle}>
          Here you can manage your projects, invitations, and more.
        </p>
      </div>

      <div className={styles.statsContainer}>
        {stats.map((stat, index) => (
          <div
            key={index}
            className={styles.statCardNew}
            onClick={() => router.push(stat.route)}
            style={{ cursor: "pointer" }}
          >
            <span className={styles.statLabel}>{stat.label}</span>
            <span className={styles.statValue}>{stat.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SimpleDashboard;