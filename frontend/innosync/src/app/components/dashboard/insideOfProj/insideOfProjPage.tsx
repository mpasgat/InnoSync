"use client";
import React, { useState, useEffect } from "react";
import styles from "./insideOfProjPage.module.css";
import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'react-toastify';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  level: string;
  education: string;
  experience: string;
  email: string;
  bio: string;
  skills: string[];
  avatar: string;
}

interface ProjectRole {
  id: string;
  roleName: string;
  requiredTechnologies: string[];
  complexity: string;
  expertiseLevel: string;
}

interface ProjectDetails {
  id: number;
  title: string;
  description: string;
  projectType: string;
  teamSize: string;
  createdAt: string;
  updatedAt: string;
}

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
  status: "INVITED" | "ACCEPTED" | "REJECTED";
  sentAt: string;
  respondedAt: string | null;
}

interface BackendProjectRole {
  id: number;
  roleName: string;
  expertiseLevel: string;
  technologies: string[];
}

const ProjectDetails = () => {
  const router = useRouter();
  const params = useParams();
  const projectId = params?.projectId as string;

  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [showKickModal, setShowKickModal] = useState(false);
  const [memberToKick, setMemberToKick] = useState<TeamMember | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Real data states
  const [projectDetails, setProjectDetails] = useState<ProjectDetails | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [projectRoles, setProjectRoles] = useState<ProjectRole[]>([]);
  const [availableRoles, setAvailableRoles] = useState<ProjectRole[]>([]);

  // Helper to get token
  const getToken = () => (typeof window !== 'undefined' ? localStorage.getItem('token') : null);

  // Fetch project details
  const fetchProjectDetails = async () => {
    if (!projectId) return;

    const token = getToken();
    if (!token) {
      setError('Authentication required');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/${projectId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch project details: ${response.status}`);
      }

      const data: ProjectDetails = await response.json();
      setProjectDetails(data);
    } catch (err) {
      console.error('Error fetching project details:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch project details');
    }
  };

  // Fetch project roles
  const fetchProjectRoles = async () => {
    if (!projectId) return;

    const token = getToken();
    if (!token) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/${projectId}/roles`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch project roles: ${response.status}`);
      }

      const data: BackendProjectRole[] = await response.json();
      const transformedRoles: ProjectRole[] = data.map(role => ({
        id: role.id.toString(),
        roleName: role.roleName,
        requiredTechnologies: role.technologies,
        complexity: getComplexityFromExpertiseLevel(role.expertiseLevel),
        expertiseLevel: role.expertiseLevel
      }));

      setProjectRoles(transformedRoles);
    } catch (err) {
      console.error('Error fetching project roles:', err);
    }
  };

  // Fetch team members (accepted invitations)
  const fetchTeamMembers = async () => {
    if (!projectId) return;

    const token = getToken();
    if (!token) return;

    try {
      // Get all invitations for this project
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/invitations/sent`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch invitations: ${response.status}`);
      }

      const allInvitations: BackendInvitation[] = await response.json();

      // Filter for this project and accepted invitations
      const projectInvitations = allInvitations.filter(inv =>
        inv.projectId.toString() === projectId && inv.status === "ACCEPTED"
      );

      // Transform to team members
      const members: TeamMember[] = projectInvitations.map(inv => ({
        id: inv.recipientId.toString(),
        name: inv.recipientName,
        role: inv.roleName,
        level: getLevelFromExpertiseLevel(inv.roleName), // This would need to be fetched from user profile
        education: "Bachelor", // This would need to be fetched from user profile
        experience: "2 years", // This would need to be fetched from user profile
        email: inv.recipientName, // Using name as email for now
        bio: `Team member working on ${inv.roleName} role.`, // This would need to be fetched from user profile
        skills: [], // This would need to be fetched from user profile
        avatar: "/profile_image.png", // Default avatar
      }));

      setTeamMembers(members);
    } catch (err) {
      console.error('Error fetching team members:', err);
    }
  };

  // Helper functions
  const getComplexityFromExpertiseLevel = (level: string): string => {
    switch (level.toUpperCase()) {
      case 'ENTRY':
      case 'JUNIOR':
        return 'Low';
      case 'MID':
        return 'Medium';
      case 'SENIOR':
      case 'EXPERT':
        return 'High';
      default:
        return 'Medium';
    }
  };

  const getLevelFromExpertiseLevel = (roleName: string): string => {
    // This is a simplified mapping - in a real app, you'd fetch user profile data
    const roleLower = roleName.toLowerCase();
    if (roleLower.includes('senior') || roleLower.includes('lead')) return 'Expert';
    if (roleLower.includes('junior')) return 'Beginner';
    return 'Intermediate';
  };

  // Load all data on component mount
  useEffect(() => {
    const loadProjectData = async () => {
      setLoading(true);
      setError(null);

      try {
        await Promise.all([
          fetchProjectDetails(),
          fetchProjectRoles(),
          fetchTeamMembers()
        ]);
      } catch (err) {
        console.error('Error loading project data:', err);
        setError('Failed to load project data');
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      loadProjectData();
    }
  }, [projectId]);

  // Update available roles when team members or project roles change
  useEffect(() => {
    const filledRoles = teamMembers.map(member => member.role);
    const available = projectRoles.filter(role => !filledRoles.includes(role.roleName));
    setAvailableRoles(available);
  }, [teamMembers, projectRoles]);

  const selectMember = (member: TeamMember) => {
    setSelectedMember(member);
  };

  const closeProfile = () => {
    setSelectedMember(null);
  };

  const handleKickClick = (member: TeamMember, e: React.MouseEvent) => {
    e.stopPropagation();
    setMemberToKick(member);
    setShowKickModal(true);
  };

  const handleChatClick = (member: TeamMember, e: React.MouseEvent) => {
    e.stopPropagation();
    // Handle chat functionality here
    console.log(`Opening chat with ${member.name}`);
    toast.info(`Chat functionality coming soon!`);
  };

  const confirmKick = () => {
    if (memberToKick) {
      setTeamMembers(prev => prev.filter(member => member.id !== memberToKick.id));
      if (selectedMember?.id === memberToKick.id) {
        setSelectedMember(null);
      }
      setShowKickModal(false);
      setMemberToKick(null);
      toast.success(`${memberToKick.name} has been removed from the project`);
    }
  };

  const cancelKick = () => {
    setShowKickModal(false);
    setMemberToKick(null);
  };

  const handleFindTalent = (role: ProjectRole) => {
    // Navigate to talent finder with pre-filled filters
    const searchParams = new URLSearchParams({
      role: role.roleName,
      skills: role.requiredTechnologies.join(','),
      level: role.expertiseLevel,
      complexity: role.complexity
    });
    router.push(`/components/talent?${searchParams.toString()}`);
  };

  const handleBackToProjects = () => {
    router.push('/dashboard/projects');
  };

  if (loading) {
    return (
      <div className={styles.projectDetails}>
        <div className={styles.loadingContainer}>
          <p>Loading project details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.projectDetails}>
        <div className={styles.errorContainer}>
          <p>Error: {error}</p>
          <button onClick={handleBackToProjects} className={styles.backButton}>
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  if (!projectDetails) {
    return (
      <div className={styles.projectDetails}>
        <div className={styles.errorContainer}>
          <p>Project not found</p>
          <button onClick={handleBackToProjects} className={styles.backButton}>
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.projectDetails}>
      {/* Project Header */}
      <div className={styles.projectHeader}>
        <div className={styles.headerTop}>
          <button className={styles.backButton} onClick={handleBackToProjects}>
            <Image src="/next_arrow.svg" alt="back arrow" width={20} height={20} />
            Back to Projects
          </button>
          <h1 className={styles.projectTitle}>{projectDetails.title}</h1>
        </div>
        <div className={styles.projectMeta}>
          <div className={styles.projectDate}>
            <Image src="/calendar.svg" alt="calendar icon" width={20} height={20} />
            <span>Started: {new Date(projectDetails.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Project Description */}
      <div className={styles.projectDescriptionCard}>
        <div className={styles.cardHeader}>
          <h2>Project Description</h2>
        </div>
        <div className={styles.descriptionContent}>
          <p>{projectDetails.description}</p>
        </div>
      </div>

      {/* Team Section - Full Width when no description */}
      {!selectedMember ? (
        <div className={styles.teamSectionFull}>
          <div className={styles.teamHeader}>
            <h2>Team Members</h2>
            <span className={styles.teamCount}>{teamMembers.length} members</span>
          </div>

          <div className={styles.teamGrid}>
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className={styles.teamMemberCardGrid}
                onClick={() => selectMember(member)}
              >
                {/* Avatar */}
                <div className={styles.memberAvatarGrid}>
                  <img src={member.avatar} alt={member.name} />
                </div>

                {/* Member Info */}
                <div className={styles.memberInfoGrid}>
                  <div className={styles.memberHeadingRowGrid}>
                    <span className={styles.memberNameGrid}>{member.name}</span>
                    <span className={styles.roleBadgeGrid}>{member.role}</span>
                  </div>

                  <div className={styles.memberDetailsGrid}>
                    {/* Level */}
                    <span className={styles.detailBadgeGrid}>
                      <Image src="/verified.svg" alt="verified icon" width={16} height={16} />
                      {member.level}
                    </span>
                    {/* Education */}
                    <span className={styles.detailBadgeGrid}>
                      <Image src="/education.svg" alt="education icon" width={14} height={14} />
                      {member.education}
                    </span>
                    {/* Experience */}
                    <span className={styles.detailBadgeGrid}>
                      <Image src="/stars.svg" alt="experience icon" width={16} height={16} />
                      {member.experience}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Available Roles Section */}
          {availableRoles.length > 0 && (
            <div className={styles.availableRolesSection}>
              <div className={styles.rolesHeader}>
                <h2>Available Roles</h2>
                <span className={styles.rolesCount}>{availableRoles.length} positions open</span>
              </div>

              <div className={styles.rolesList}>
                {availableRoles.map((role) => (
                  <div
                    key={role.id}
                    className={styles.roleCard}
                    onClick={() => handleFindTalent(role)}
                  >
                    {/* Role Icon */}
                    <div className={styles.roleAvatar}>
                      <Image src="/help.svg" alt="role icon" width={24} height={24} />
                    </div>

                    {/* Role Info */}
                    <div className={styles.roleInfo}>
                      <div className={styles.roleHeadingRow}>
                        <span className={styles.roleName}>{role.roleName}</span>
                        <span className={styles.roleBadge}>{role.complexity}</span>
                      </div>

                      <div className={styles.roleDetails}>
                        {/* Expertise Level */}
                        <span className={styles.detailBadge}>
                          <Image src="/verified.svg" alt="expertise icon" width={16} height={16} />
                          {role.expertiseLevel}
                        </span>
                        {/* Required Technologies */}
                        <div className={styles.technologiesList}>
                          {role.requiredTechnologies.map((tech, index) => (
                            <span key={index} className={styles.techTag}>
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Find Talent Button */}
                    <div className={styles.roleActions}>
                      <button className={styles.findTalentButton}>
                        <Image src="/sync_arrow.svg" alt="find talent" width={16} height={16} />
                        Find Talent
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className={styles.browserContent}>
          {/* Team Section */}
          <div className={styles.teamSection}>
            <div className={styles.teamHeader}>
              <h2>Team Members</h2>
              <span className={styles.teamCount}>{teamMembers.length} members</span>
            </div>

            <div className={styles.teamList}>
              {teamMembers.map((member) => (
                <div
                  key={member.id}
                  className={`${styles.teamMemberCard} ${selectedMember?.id === member.id ? styles.selected : ""}`}
                  onClick={() => selectMember(member)}
                >
                  {/* Avatar */}
                  <div className={styles.memberAvatar}>
                    <img src={member.avatar} alt={member.name} />
                  </div>

                  {/* Member Info */}
                  <div className={styles.memberInfo}>
                    <div className={styles.memberHeadingRow}>
                      <span className={styles.memberName}>{member.name}</span>
                      <span className={styles.roleBadge}>{member.role}</span>
                    </div>

                    <div className={styles.memberDetails}>
                      {/* Level */}
                      <span className={styles.detailBadge}>
                        <Image src="/verified.svg" alt="verified icon" width={16} height={16} />
                        {member.level}
                      </span>
                      {/* Education */}
                      <span className={styles.detailBadge}>
                        <Image src="/education.svg" alt="education icon" width={14} height={14} />
                        {member.education}
                      </span>
                      {/* Experience */}
                      <span className={styles.detailBadge}>
                        <Image src="/stars.svg" alt="experience icon" width={16} height={16} />
                        {member.experience}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className={styles.memberActions}>
                    <button
                      className={styles.chatButton}
                      onClick={(e) => handleChatClick(member, e)}
                      title="Chat with member"
                    >
                      <Image src="/send.svg" alt="chat icon" width={16} height={16} />
                      Chat
                    </button>
                    <button
                      className={styles.kickButton}
                      onClick={(e) => handleKickClick(member, e)}
                      title="Remove member from project"
                    >
                      <Image src="/close_icon.svg" alt="kick icon" width={16} height={16} />
                      Kick
                    </button>
                  </div>
                </div>
              ))}

              {/* Available Roles Section - In side-by-side layout */}
              {availableRoles.length > 0 && (
                <div className={styles.availableRolesInline}>
                  <div className={styles.rolesHeaderInline}>
                    <h3>Available Roles</h3>
                    <span className={styles.rolesCountInline}>{availableRoles.length} positions open</span>
                  </div>

                  <div className={styles.rolesListInline}>
                    {availableRoles.map((role) => (
                      <div
                        key={role.id}
                        className={styles.roleCardInline}
                        onClick={() => handleFindTalent(role)}
                      >
                        {/* Role Icon */}
                        <div className={styles.roleAvatarInline}>
                          <Image src="/help.svg" alt="role icon" width={20} height={20} />
                        </div>

                        {/* Role Info */}
                        <div className={styles.roleInfoInline}>
                          <div className={styles.roleHeadingRowInline}>
                            <span className={styles.roleNameInline}>{role.roleName}</span>
                            <span className={styles.roleBadgeInline}>{role.complexity}</span>
                          </div>

                          <div className={styles.roleDetailsInline}>
                            {/* Expertise Level */}
                            <span className={styles.detailBadgeInline}>
                              <Image src="/verified.svg" alt="expertise icon" width={14} height={14} />
                              {role.expertiseLevel}
                            </span>
                            {/* Required Technologies */}
                            <div className={styles.technologiesListInline}>
                              {role.requiredTechnologies.map((tech, index) => (
                                <span key={index} className={styles.techTagInline}>
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Find Talent Button */}
                        <div className={styles.roleActionsInline}>
                          <button className={styles.findTalentButtonInline}>
                            <Image src="/sync_arrow.svg" alt="find talent" width={16} height={16} />
                            Find Talent
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Selected Member Profile */}
          <div className={styles.profileSection}>
            <div className={styles.profileCard}>
              {/* Close Button */}
              <button className={styles.closeButton} onClick={closeProfile}>
                <Image src="/close_icon.svg" alt="close icon" width={16} height={16} />
              </button>

              {/* Avatar */}
              <div className={styles.profileHeader}>
                <div className={styles.profileAvatar}>
                  <img src={selectedMember.avatar} alt={selectedMember.name} />
                </div>
                {/* Name */}
                <h2 className={styles.profileName}>{selectedMember.name}</h2>
                {/* Badges Row */}
                <div className={styles.profileBadges}>
                  {/* Level */}
                  <span className={styles.detailBadge}>
                    <Image src="/verified.svg" alt="verified icon" width={20} height={20} />
                    {selectedMember.level}
                  </span>
                  {/* Education */}
                  <span className={styles.detailBadge}>
                    <Image src="/education.svg" alt="education icon" width={18} height={18} />
                    {selectedMember.education}
                  </span>
                  {/* Experience */}
                  <span className={styles.detailBadge}>
                    <Image src="/stars.svg" alt="experience icon" width={20} height={20} />
                    {selectedMember.experience}
                  </span>
                </div>
              </div>

              {/* Bio */}
              <div className={styles.profileInfo}>
                <p className={styles.profileBio}>{selectedMember.bio}</p>

                <div className={styles.profileSections}>
                  {/* Skills Section */}
                  <div className={styles.skillsSection}>
                    <h4 className={styles.sectionTitle}>Skills</h4>
                    <div className={styles.tagsList}>
                      {selectedMember.skills.length > 0 ? (
                        selectedMember.skills.map((skill, index) => (
                          <span key={index} className={styles.skillTag}>
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className={styles.noSkills}>No skills listed</span>
                      )}
                    </div>
                  </div>

                  {/* Contact Section */}
                  <div className={styles.contactSection}>
                    <h4 className={styles.sectionTitle}>Contact</h4>
                    <div className={styles.contactInfo}>
                      <div className={styles.contactItem}>
                        <Image src="/mail_icon.svg" alt="email icon" width={16} height={16} />
                        <span>{selectedMember.email}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Kick Confirmation Modal */}
      {showKickModal && memberToKick && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>Remove Team Member</h3>
            </div>
            <div className={styles.modalContent}>
              <p>
                Are you sure you want to remove <strong>{memberToKick.name}</strong> from the project?
              </p>
              <p className={styles.modalWarning}>
                This action cannot be undone. The member will lose access to the project.
              </p>
            </div>
            <div className={styles.modalActions}>
              <button className={styles.cancelButton} onClick={cancelKick}>
                Cancel
              </button>
              <button className={styles.confirmButton} onClick={confirmKick}>
                Remove Member
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;