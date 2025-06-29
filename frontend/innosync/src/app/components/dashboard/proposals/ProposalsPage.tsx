"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { toast } from 'react-toastify';
import styles from "./ProposalsPage.module.css";

// Types for proposal data
interface Proposal {
  id: string;
  project: {
    name: string;
    type: string;
    avatar?: string;
  };
  position: string;
  date: string;
  status: "pending" | "accepted" | "rejected";
}

// Mock data based on the Figma design
const mockProposals: Proposal[] = [
  {
    id: "1",
    project: {
      name: "InnoSync",
      type: "StartUp",
      avatar: "/project-innosync-image.png"
    },
    position: "Frontend Dev",
    date: "01/01/2025",
    status: "pending"
  },
  {
    id: "2",
    project: {
      name: "Data Analytics: Translational Data Analytics and Decision Science",
      type: "Research",
      avatar: "/project-aihub-image.png"
    },
    position: "GUI Dev",
    date: "01/01/2025",
    status: "accepted"
  },
  {
    id: "3",
    project: {
      name: "InnoUniversity",
      type: "Freelance",
      avatar: "/profile_image.png"
    },
    position: "Researcher",
    date: "01/01/2025",
    status: "rejected"
  }
];

export default function ProposalsPage() {
  const [proposals, setProposals] = useState<Proposal[]>(mockProposals);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    };

    if (activeMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeMenu]);

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "pending":
        return styles.statusPending;
      case "accepted":
        return styles.statusAccepted;
      case "rejected":
        return styles.statusRejected;
      default:
        return styles.statusPending;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "Pending";
      case "accepted":
        return "Accepted";
      case "rejected":
        return "Rejected";
      default:
        return "Pending";
    }
  };

  const handleMenuToggle = (proposalId: string) => {
    setActiveMenu(activeMenu === proposalId ? null : proposalId);
  };

  const handleDelete = (proposalId: string) => {
    const proposal = proposals.find(prop => prop.id === proposalId);
    setProposals(prevProposals =>
      prevProposals.filter(proposal => proposal.id !== proposalId)
    );
    setActiveMenu(null);

    toast.success(`Your proposal for ${proposal?.position} at ${proposal?.project.name} has been deleted.`, {
      position: 'bottom-right',
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'colored',
    });
  };

  const handleViewDetails = (proposalId: string) => {
    const proposal = proposals.find(prop => prop.id === proposalId);
    setActiveMenu(null);

    toast.info(`Viewing details for ${proposal?.position} proposal at ${proposal?.project.name}`, {
      position: 'bottom-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'colored',
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr className={styles.headerRow}>
              <th className={styles.headerCell}>
                <div className={styles.headerContent}>
                  <span>Project</span>
                  <svg className={styles.sortIcon} viewBox="0 0 16 16" fill="none">
                    <path d="M4.17 6.33L8 10.17L11.83 6.33" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </th>
              <th className={styles.headerCell}>
                <div className={styles.headerContent}>
                  <span>Position</span>
                </div>
              </th>
              <th className={styles.headerCell}>
                <div className={styles.headerContent}>
                  <span>Date</span>
                </div>
              </th>
              <th className={styles.headerCell}>
                <div className={styles.headerContent}>
                  <span>Status</span>
                </div>
              </th>
              <th className={styles.headerCell}>
                <div className={styles.headerContent}>
                  <span></span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {proposals.map((proposal) => (
              <tr key={proposal.id} className={styles.dataRow}>
                {/* Project Column */}
                <td className={styles.dataCell}>
                  <div className={styles.projectCard}>
                    <div className={styles.avatar}>
                      {proposal.project.avatar ? (
                        <Image
                          src={proposal.project.avatar}
                          alt={proposal.project.name}
                          width={40}
                          height={40}
                          className={styles.avatarImage}
                        />
                      ) : (
                        <div className={styles.avatarPlaceholder}>
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="#C1C7CD"/>
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className={styles.projectInfo}>
                      <div className={styles.projectName}>{proposal.project.name}</div>
                      <div className={styles.projectType}>{proposal.project.type}</div>
                    </div>
                  </div>
                </td>

                {/* Position Column */}
                <td className={styles.dataCell}>
                  <div className={styles.positionText}>{proposal.position}</div>
                </td>

                {/* Date Column */}
                <td className={styles.dataCell}>
                  <div className={styles.dateText}>{proposal.date}</div>
                </td>

                {/* Status Column */}
                <td className={styles.dataCell}>
                  <div className={styles.statusContainer}>
                    <span className={`${styles.statusBadge} ${getStatusBadgeClass(proposal.status)}`}>
                      {getStatusLabel(proposal.status)}
                    </span>
                  </div>
                </td>

                {/* Action Menu Column */}
                <td className={styles.dataCell}>
                  <div className={styles.actionContainer}>
                    <button
                      className={styles.menuButton}
                      onClick={() => handleMenuToggle(proposal.id)}
                      aria-label="More actions"
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M1.33 8C1.33 8.73638 1.93362 9.34 2.67 9.34C3.40638 9.34 4.01 8.73638 4.01 8C4.01 7.26362 3.40638 6.66 2.67 6.66C1.93362 6.66 1.33 7.26362 1.33 8ZM6.66 8C6.66 8.73638 7.26362 9.34 8 9.34C8.73638 9.34 9.34 8.73638 9.34 8C9.34 7.26362 8.73638 6.66 8 6.66C7.26362 6.66 6.66 7.26362 6.66 8ZM12 8C12 8.73638 12.6036 9.34 13.34 9.34C14.0764 9.34 14.68 8.73638 14.68 8C14.68 7.26362 14.0764 6.66 13.34 6.66C12.6036 6.66 12 7.26362 12 8Z" fill="#697077"/>
                      </svg>
                    </button>

                    {activeMenu === proposal.id && (
                      <div ref={dropdownRef} className={styles.dropdown}>
                        <button
                          className={styles.dropdownItem}
                          onClick={() => handleViewDetails(proposal.id)}
                        >
                          View Details
                        </button>
                        <button
                          className={styles.dropdownItem}
                          onClick={() => handleDelete(proposal.id)}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}