"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { toast } from 'react-toastify';
import styles from "./ProposalsPage.module.css";

// API Response Types
interface ApiApplication {
  id: number;
  userId: number;
  userFullName: string;
  projectRoleId: number;
  roleName: string;
  projectId: number;
  projectTitle: string;
  projectType: "FREELANCE" | "STARTUP" | "RESEARCH";
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  appliedAt: string;
  updatedAt: string;
}

// UI Types (for display)
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

// Transform API data to UI format
const transformApiDataToProposals = (apiData: ApiApplication[]): Proposal[] => {
  return apiData.map(app => ({
    id: app.id.toString(),
    project: {
      name: app.projectTitle,
      type: app.projectType.charAt(0).toUpperCase() + app.projectType.slice(1).toLowerCase(),
      avatar: getProjectAvatar(app.projectTitle, app.projectType)
    },
    position: app.roleName,
    date: formatDate(app.appliedAt),
    status: app.status.toLowerCase() as "pending" | "accepted" | "rejected"
  }));
};

// Helper function to get project avatar based on project name/type
const getProjectAvatar = (projectTitle: string, projectType: string): string => {
  // You can implement logic to map project names to specific avatars
  if (projectTitle.toLowerCase().includes('innosync')) {
    return '/project-innosync-image.png';
  } else if (projectTitle.toLowerCase().includes('data analytics') || projectTitle.toLowerCase().includes('ai')) {
    return '/project-aihub-image.png';
  } else if (projectType === 'RESEARCH') {
    return '/project-aihub-image.png';
  } else if (projectType === 'STARTUP') {
    return '/project-innosync-image.png';
  }
  return '/profile_image.png'; // Default avatar
};

// Helper function to format date
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

// API function to fetch proposals
const fetchProposals = async (): Promise<Proposal[]> => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }

  try {
    const response = await fetch('http://localhost:8080/api/applications', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch proposals: ${response.status} ${response.statusText}`);
    }

    const data: ApiApplication[] = await response.json();
    return transformApiDataToProposals(data);
  } catch (error) {
    console.error('Error fetching proposals:', error);
    throw error;
  }
};

export default function ProposalsPage() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch proposals on component mount
  useEffect(() => {
    const loadProposals = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedProposals = await fetchProposals();
        setProposals(fetchedProposals);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch proposals';
        setError(errorMessage);
        toast.error(`Error loading proposals: ${errorMessage}`, {
          position: 'bottom-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        });
      } finally {
        setLoading(false);
      }
    };

    loadProposals();
  }, []);

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

  // Loading state
  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.tableContainer}>
          <div style={{ 
            padding: '2rem', 
            textAlign: 'center', 
            color: '#697077',
            fontSize: '16px'
          }}>
            Loading your proposals...
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.tableContainer}>
          <div style={{ 
            padding: '2rem', 
            textAlign: 'center', 
            color: '#e74c3c',
            fontSize: '16px'
          }}>
            Error: {error}
            <br />
            <button 
              onClick={() => window.location.reload()} 
              style={{
                marginTop: '1rem',
                padding: '0.5rem 1rem',
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (proposals.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.tableContainer}>
          <div style={{ 
            padding: '2rem', 
            textAlign: 'center', 
            color: '#697077',
            fontSize: '16px'
          }}>
            No proposals found. Start applying to projects to see your proposals here!
          </div>
        </div>
      </div>
    );
  }

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