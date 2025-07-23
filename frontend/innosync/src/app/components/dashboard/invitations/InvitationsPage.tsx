"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { toast } from 'react-toastify';
import styles from "./InvitationsPage.module.css";

// Types for invitation data
interface Invitation {
  id: string;
  author: {
    name: string;
    role: string;
    avatar?: string;
  };
  position: string;
  date: string;
  status: "pending" | "accepted" | "rejected";
}

// Backend invitation type
interface BackendInvitation {
  id: number;
  projectRoleId: number;
  roleName: string;
  projectId: number;
  projectTitle: string;
  recipientId: number;
  recipientName: string;
  senderId: number;
  senderName: string;
  senderEmail: string;
  status: "INVITED" | "ACCEPTED" | "DECLINED" | "REVOKED" | "PENDING" | "EXPIRED";
  sentAt: string;
  respondedAt: string | null;
}

export default function InvitationsPage() {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [processingInvitation, setProcessingInvitation] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Function to fetch invitations
    const fetchInvitations = async () => {
      try {
      setLoading(true);
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/invitations/received`, {
          headers: token ? { "Authorization": `Bearer ${token}` } : {}
        });
        if (!res.ok) throw new Error("Failed to fetch invitations");
        const data = await res.json();
        // Map backend data to UI Invitation type
        const mapped: Invitation[] = (data as BackendInvitation[]).map((inv) => ({
          id: String(inv.id),
          author: {
            name: inv.senderName || inv.senderEmail || "Unknown",
            role: inv.roleName || "",
            avatar: "/profile_image.png", // No avatar in backend
          },
          position: inv.roleName || "",
          date: inv.sentAt ? new Date(inv.sentAt).toLocaleDateString() : "",
        status: inv.status === "INVITED" ? "pending" : inv.status === "ACCEPTED" ? "accepted" : inv.status === "DECLINED" ? "rejected" : "pending",
        }));
        setInvitations(mapped);
      } catch (err) {
        toast.error((err as Error).message || "Failed to fetch invitations");
    } finally {
      setLoading(false);
      }
    };

  // Fetch real invitations on mount
  useEffect(() => {
    fetchInvitations();
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

  const handleMenuToggle = (invitationId: string) => {
    setActiveMenu(activeMenu === invitationId ? null : invitationId);
  };

  const handleStatusChange = (invitationId: string, newStatus: "accepted" | "rejected") => {
    setInvitations(prevInvitations =>
      prevInvitations.map(invitation =>
        invitation.id === invitationId
          ? { ...invitation, status: newStatus }
          : invitation
      )
    );
    setActiveMenu(null); // Close dropdown after action
  };

  const handleAccept = async (invitationId: string) => {
    const invitation = invitations.find(inv => inv.id === invitationId);
    if (!invitation) return;

    setProcessingInvitation(invitationId);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!token) {
        toast.error('You are not logged in');
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/invitations/${invitationId}/respond?response=ACCEPTED`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to accept invitation: ${response.status}`);
      }

      // Update local state after successful API call
    handleStatusChange(invitationId, "accepted");
      await fetchInvitations(); // Refresh invitations

      toast.success(`You have accepted the ${invitation?.position} invitation from ${invitation?.author.name}. You have joined the project team!`, {
      position: 'bottom-right',
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'colored',
    });
    } catch (err) {
      toast.error((err as Error).message || "Failed to accept invitation", {
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
      setProcessingInvitation(null);
    }
  };

  const handleReject = async (invitationId: string) => {
    const invitation = invitations.find(inv => inv.id === invitationId);
    if (!invitation) return;

    setProcessingInvitation(invitationId);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!token) {
        toast.error('You are not logged in');
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/invitations/${invitationId}/respond?response=DECLINED`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to reject invitation: ${response.status}`);
      }

      // Update local state after successful API call
    handleStatusChange(invitationId, "rejected");
      await fetchInvitations(); // Refresh invitations

    toast.error(`You have rejected the ${invitation?.position} invitation from ${invitation?.author.name}.`, {
      position: 'bottom-right',
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'colored',
    });
    } catch (err) {
      toast.error((err as Error).message || "Failed to reject invitation", {
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
      setProcessingInvitation(null);
    }
  };

  const handleDelete = (invitationId: string) => {
    const invitation = invitations.find(inv => inv.id === invitationId);
    setInvitations(prevInvitations =>
      prevInvitations.filter(inv => inv.id !== invitationId)
    );
    setActiveMenu(null);

    toast.success(`The ${invitation?.position} invitation from ${invitation?.author.name} has been deleted.`, {
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

  const handleViewDetails = (invitationId: string) => {
    const invitation = invitations.find(inv => inv.id === invitationId);
    setActiveMenu(null);

    toast.info(`Viewing details for ${invitation?.position} invitation from ${invitation?.author.name}`, {
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
            Loading invitations...
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (invitations.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.tableContainer}>
          <div style={{
            padding: '2rem',
            textAlign: 'center',
            color: '#697077',
            fontSize: '16px'
          }}>
            No invitations found. You&apos;ll see invitations here when recruiters invite you to join their projects!
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
                  <span>Author</span>
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
            {invitations.map((invitation) => (
              <tr key={invitation.id} className={styles.dataRow}>
                {/* Author Column */}
                <td className={styles.dataCell}>
                  <div className={styles.userCard}>
                    <div className={styles.avatar}>
                      {invitation.author.avatar ? (
                        <Image
                          src={invitation.author.avatar}
                          alt={invitation.author.name}
                          width={40}
                          height={40}
                          className={styles.avatarImage}
                        />
                      ) : (
                        <div className={styles.avatarPlaceholder}>
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="#C1C7CD"/>
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className={styles.userInfo}>
                      <div className={styles.userName}>{invitation.author.name}</div>
                      <div className={styles.userRole}>{invitation.author.role}</div>
                    </div>
                  </div>
                </td>

                {/* Position Column */}
                <td className={styles.dataCell}>
                  <div className={styles.positionText}>{invitation.position}</div>
                </td>

                {/* Date Column */}
                <td className={styles.dataCell}>
                  <div className={styles.dateText}>{invitation.date}</div>
                </td>

                {/* Status Column */}
                <td className={styles.dataCell}>
                  <div className={styles.statusContainer}>
                    <span className={`${styles.statusBadge} ${getStatusBadgeClass(invitation.status)}`}>
                      {getStatusLabel(invitation.status)}
                    </span>
                  </div>
                </td>

                {/* Action Menu Column */}
                <td className={styles.dataCell}>
                  <div className={styles.actionContainer}>
                    <button
                      className={styles.menuButton}
                      onClick={() => handleMenuToggle(invitation.id)}
                      disabled={processingInvitation === invitation.id}
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M1.33 8C1.33 8.74 1.93 9.33 2.67 9.33C3.4 9.33 4 8.74 4 8C4 7.26 3.4 6.67 2.67 6.67C1.93 6.67 1.33 7.26 1.33 8ZM6.67 8C6.67 8.74 7.26 9.33 8 9.33C8.74 9.33 9.33 8.74 9.33 8C9.33 7.26 8.74 6.67 8 6.67C7.26 6.67 6.67 7.26 6.67 8ZM12 8C12 8.74 12.59 9.33 13.33 9.33C14.07 9.33 14.67 8.74 14.67 8C14.67 7.26 14.07 6.67 13.33 6.67C12.59 6.67 12 7.26 12 8Z" fill="#697077"/>
                      </svg>
                    </button>
                    {activeMenu === invitation.id && (
                      <div ref={dropdownRef} className={styles.dropdown}>
                        <button
                          className={styles.dropdownItem}
                          onClick={() => handleViewDetails(invitation.id)}
                          disabled={processingInvitation === invitation.id}
                        >
                          View Details
                        </button>
                        <button
                          className={styles.dropdownItem}
                          onClick={() => handleAccept(invitation.id)}
                          disabled={processingInvitation === invitation.id}
                        >
                          {processingInvitation === invitation.id ? 'Processing...' : 'Accept'}
                        </button>
                        <button
                          className={styles.dropdownItem}
                          onClick={() => handleReject(invitation.id)}
                          disabled={processingInvitation === invitation.id}
                        >
                          {processingInvitation === invitation.id ? 'Processing...' : 'Reject'}
                        </button>
                        <button
                          className={styles.dropdownItem}
                          onClick={() => handleDelete(invitation.id)}
                          disabled={processingInvitation === invitation.id}
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