"use client";
import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './ApplicationsPage.module.css';

interface Application {
  id: number;
  userId: number;
  userFullName: string;
  projectRoleId: number;
  roleName: string;
  projectId: number;
  projectTitle: string;
  projectType: string;
  status: string;
  appliedAt: string;
  updatedAt: string;
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [processingApplication, setProcessingApplication] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch all applications for user's projects
  const fetchAllApplications = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please log in to view applications');
      return;
    }

    try {
      // First get user's projects
      const projectsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!projectsResponse.ok) {
        throw new Error(`Failed to fetch projects: ${projectsResponse.status}`);
      }

      const projects = await projectsResponse.json();

      // Then fetch applications for each project
      const allApplications: Application[] = [];
      for (const project of projects) {
        const projectApplications = await fetchApplicationsForProject(project.id);
        allApplications.push(...projectApplications);
      }

      setApplications(allApplications);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to load applications');
    }
  };

  // Fetch applications for a specific project
  const fetchApplicationsForProject = async (projectId: number): Promise<Application[]> => {
    const token = localStorage.getItem('token');
    if (!token) return [];

    try {
      // First get the project roles
      const rolesResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/${projectId}/roles`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!rolesResponse.ok) {
        console.error(`Failed to fetch roles for project ${projectId}: ${rolesResponse.status}`);
        return [];
      }

      const roles = await rolesResponse.json();

      // Then fetch applications for each role
      const allApplications: Application[] = [];
      for (const role of roles) {
        const roleApplications = await fetchApplicationsForRole(role.id);
        allApplications.push(...roleApplications);
      }

      return allApplications;
    } catch (error) {
      console.error(`Error fetching applications for project ${projectId}:`, error);
      return [];
    }
  };

  // Fetch applications for a specific project role
  const fetchApplicationsForRole = async (roleId: number): Promise<Application[]> => {
    const token = localStorage.getItem('token');
    if (!token) return [];

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/applications/project-roles/${roleId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error(`Failed to fetch applications for role ${roleId}: ${response.status}`);
        return [];
      }

      const applications = await response.json();
      return applications;
    } catch (error) {
      console.error(`Error fetching applications for role ${roleId}:`, error);
      return [];
    }
  };

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
    switch (status.toLowerCase()) {
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
    switch (status.toLowerCase()) {
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

  const handleMenuToggle = (applicationId: string) => {
    setActiveMenu(activeMenu === applicationId ? null : applicationId);
  };

  const handleStatusChange = (applicationId: string, newStatus: "accepted" | "rejected") => {
    setApplications(prevApplications =>
      prevApplications.map(app =>
        app.id.toString() === applicationId
          ? { ...app, status: newStatus.toUpperCase() }
          : app
      )
    );
  };

  const updateApplicationStatus = async (applicationId: number, status: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please log in to update application status');
      return;
    }

    try {
      setProcessingApplication(applicationId.toString());
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/applications/${applicationId}/status?status=${status}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to update application: ${response.status}`);
      }

                  handleStatusChange(applicationId.toString(), status.toLowerCase() as "accepted" | "rejected");

      const application = applications.find(app => app.id === applicationId);
      const message = status.toLowerCase() === 'accepted'
        ? `Application accepted! ${application?.userFullName} has joined your project team.`
        : `Application ${status.toLowerCase()} successfully`;

      toast.success(message, {
        position: 'bottom-right',
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });
    } catch (error) {
      console.error('Error updating application status:', error);
      toast.error('Failed to update application status', {
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
      setProcessingApplication(null);
    }
  };

  const handleAccept = async (applicationId: string) => {
    const application = applications.find(app => app.id.toString() === applicationId);
    if (!application) return;

    try {
      await updateApplicationStatus(application.id, 'ACCEPTED');
      setActiveMenu(null);
    } catch (err) {
      toast.error((err as Error).message || "Failed to accept application", {
        position: 'bottom-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });
    }
  };

  const handleReject = async (applicationId: string) => {
    const application = applications.find(app => app.id.toString() === applicationId);
    if (!application) return;

    try {
      await updateApplicationStatus(application.id, 'REJECTED');
      setActiveMenu(null);
    } catch (err) {
      toast.error((err as Error).message || "Failed to reject application", {
        position: 'bottom-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });
    }
  };

  const handleDelete = (applicationId: string) => {
    const application = applications.find(app => app.id.toString() === applicationId);
    setApplications(prevApplications =>
      prevApplications.filter(app => app.id.toString() !== applicationId)
    );
    setActiveMenu(null);

    toast.success(`The ${application?.roleName} application from ${application?.userFullName} has been deleted.`, {
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

  const handleViewDetails = (applicationId: string) => {
    const application = applications.find(app => app.id.toString() === applicationId);
    setActiveMenu(null);

    toast.info(`Viewing details for ${application?.roleName} application from ${application?.userFullName}`, {
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

  useEffect(() => {
    fetchAllApplications().finally(() => setLoading(false));
  }, []);

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
            Loading applications...
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (applications.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.tableContainer}>
          <div style={{
            padding: '2rem',
            textAlign: 'center',
            color: '#697077',
            fontSize: '16px'
          }}>
            No applications found. You&apos;ll see applications here when candidates apply to your projects!
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
                  <span>Applicant</span>
                  <svg className={styles.sortIcon} viewBox="0 0 16 16" fill="none">
                    <path d="M4.17 6.33L8 10.17L11.83 6.33" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </th>
              <th className={styles.headerCell}>
                <div className={styles.headerContent}>
                  <span>Project</span>
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
            {applications.map((application) => (
              <tr key={application.id} className={styles.dataRow}>
                {/* Applicant Column */}
                <td className={styles.dataCell}>
                  <div className={styles.userCard}>
                    <div className={styles.avatar}>
                      <div className={styles.avatarPlaceholder}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                          <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="#C1C7CD"/>
                        </svg>
                      </div>
                    </div>
                    <div className={styles.userInfo}>
                      <div className={styles.userName}>{application.userFullName}</div>
                      <div className={styles.userRole}>Applicant</div>
                    </div>
                  </div>
                </td>

                {/* Project Column */}
                <td className={styles.dataCell}>
                  <div className={styles.projectText}>{application.projectTitle}</div>
                </td>

                {/* Position Column */}
                <td className={styles.dataCell}>
                  <div className={styles.positionText}>{application.roleName}</div>
                </td>

                {/* Date Column */}
                <td className={styles.dataCell}>
                  <div className={styles.dateText}>{new Date(application.appliedAt).toLocaleDateString()}</div>
                </td>

                {/* Status Column */}
                <td className={styles.dataCell}>
                  <div className={styles.statusContainer}>
                    <span className={`${styles.statusBadge} ${getStatusBadgeClass(application.status)}`}>
                      {getStatusLabel(application.status)}
                    </span>
                  </div>
                </td>

                {/* Action Menu Column */}
                <td className={styles.dataCell}>
                  <div className={styles.actionContainer}>
                    <button
                      className={styles.menuButton}
                      onClick={() => handleMenuToggle(application.id.toString())}
                      disabled={processingApplication === application.id.toString()}
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M1.33 8C1.33 8.74 1.93 9.33 2.67 9.33C3.4 9.33 4 8.74 4 8C4 7.26 3.4 6.67 2.67 6.67C1.93 6.67 1.33 7.26 1.33 8ZM6.67 8C6.67 8.74 7.26 9.33 8 9.33C8.74 9.33 9.33 8.74 9.33 8C9.33 7.26 8.74 6.67 8 6.67C7.26 6.67 6.67 7.26 6.67 8ZM12 8C12 8.74 12.59 9.33 13.33 9.33C14.07 9.33 14.67 8.74 14.67 8C14.67 7.26 14.07 6.67 13.33 6.67C12.59 6.67 12 7.26 12 8Z" fill="#697077"/>
                      </svg>
                    </button>
                    {activeMenu === application.id.toString() && (
                      <div ref={dropdownRef} className={styles.dropdown}>
                        <button
                          className={styles.dropdownItem}
                          onClick={() => handleViewDetails(application.id.toString())}
                          disabled={processingApplication === application.id.toString()}
                        >
                          View Details
                        </button>
                        {application.status === 'PENDING' && (
                          <>
                            <button
                              className={styles.dropdownItem}
                              onClick={() => handleAccept(application.id.toString())}
                              disabled={processingApplication === application.id.toString()}
                            >
                              {processingApplication === application.id.toString() ? 'Processing...' : 'Accept'}
                            </button>
                            <button
                              className={styles.dropdownItem}
                              onClick={() => handleReject(application.id.toString())}
                              disabled={processingApplication === application.id.toString()}
                            >
                              {processingApplication === application.id.toString() ? 'Processing...' : 'Reject'}
                            </button>
                          </>
                        )}
                        <button
                          className={styles.dropdownItem}
                          onClick={() => handleDelete(application.id.toString())}
                          disabled={processingApplication === application.id.toString()}
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