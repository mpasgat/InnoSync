"use client";
import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProfilePanel from "../components/dashboard/profile-panel/ProfilePanel";
import styles from "./layout.module.css";

const tabs = [
  { id: "overview", label: "Overview", href: "/dashboard/overview" },
  { id: "projects", label: "Projects", href: "/dashboard/projects" },
  { id: "invitations", label: "Invitations", href: "/dashboard/invitations" },
  { id: "proposals", label: "Proposals", href: "/dashboard/proposals" },
  { id: "chats", label: "Chats", href: "/dashboard/chats" },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const getActiveTab = () => {
    const path = pathname.split('/')[2] || 'overview';
    return path;
  };

  const activeTab = getActiveTab();

  return (
    <div className={styles.container}>
      <div className={styles.mainContent}>
        <h1 className={styles.pageTitle}>Dashboard</h1>
        <div className={styles.tabsContainer}>
          <div className={styles.tabs}>
            {tabs.map((tab) => (
              <Link
                key={tab.id}
                href={tab.href}
                className={`${styles.tab} ${activeTab === tab.id ? styles.activeTab : ""}`}
              >
                {tab.label}
                {activeTab === tab.id && <div className={styles.activeIndicator} />}
              </Link>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className={styles.tabContent}>
          {children}
        </div>
      </div>

      {/* Profile Panel */}
      <ProfilePanel />

    </div>
  );
}