"use client";
import React, { useState } from "react";
import styles from "./insideOfProjPage.module.css";
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  level: "Expert" | "Intermediate" | "Beginner";
  education: "Bachelor" | "Master" | "PhD";
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
  complexity: "Low" | "Medium" | "High";
  expertiseLevel: "Entry" | "Junior" | "Mid" | "Senior" | "Expert";
}

const ProjectDetails = () => {
  const router = useRouter();
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [showKickModal, setShowKickModal] = useState(false);
  const [memberToKick, setMemberToKick] = useState<TeamMember | null>(null);

  // Project roles configuration
  const projectRoles: ProjectRole[] = [
    {
      id: "frontend",
      roleName: "Frontend Developer",
      requiredTechnologies: ["React.js", "TypeScript", "Next.js", "CSS", "JavaScript"],
      complexity: "Medium",
      expertiseLevel: "Mid"
    },
    {
      id: "backend",
      roleName: "Backend Developer",
      requiredTechnologies: ["Java", "Spring Boot", "PostgreSQL", "Docker", "AWS"],
      complexity: "High",
      expertiseLevel: "Senior"
    },
    {
      id: "ml",
      roleName: "ML Engineer",
      requiredTechnologies: ["Python", "TensorFlow", "Docker", "Scikit-learn", "Pandas"],
      complexity: "High",
      expertiseLevel: "Expert"
    }
  ];

  const teamMembers: TeamMember[] = [
    {
      id: "1",
      name: "Ahmed Baha Eddine Alimi",
      role: "Frontend Developer",
      level: "Expert",
      education: "Bachelor",
      experience: "2 years",
      email: "ahmed.alimi@innopolis.ru",
      bio: "Passionate frontend developer with expertise in modern web technologies. Experienced in building responsive and user-friendly interfaces using React and Next.js. Strong background in UX/UI design principles and modern development practices.",
      skills: ["React.js", "TypeScript", "Next.js", "CSS", "JavaScript"],
      avatar: "https://i.pravatar.cc/150?img=1",
    },
    {
      id: "2",
      name: "Maria Volkov",
      role: "Backend Developer",
      level: "Intermediate",
      education: "Master",
      experience: "3 years",
      email: "maria.volkov@innopolis.ru",
      bio: "Backend developer with strong experience in Java and Spring Boot. Specializes in building scalable APIs and microservices architecture. Proficient in database design and cloud technologies.",
      skills: ["Java", "Spring Boot", "PostgreSQL", "Docker", "AWS"],
      avatar: "https://i.pravatar.cc/150?img=3",
    },
    {
      id: "3",
      name: "Alex Petrov",
      role: "ML Engineer",
      level: "Expert",
      education: "Master",
      experience: "4 years",
      email: "alex.petrov@innopolis.ru",
      bio: "Machine learning engineer with expertise in Python and TensorFlow. Focuses on developing intelligent solutions and data analysis. Experienced in deep learning and natural language processing.",
      skills: ["Python", "TensorFlow", "Docker", "Scikit-learn", "Pandas"],
      avatar: "https://i.pravatar.cc/150?img=4",
    },
  ];

  const [currentTeamMembers, setCurrentTeamMembers] = useState<TeamMember[]>(teamMembers);
  const [removedRoles, setRemovedRoles] = useState<string[]>([]);

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
  };

  const confirmKick = () => {
    if (memberToKick) {
      setCurrentTeamMembers(prev => prev.filter(member => member.id !== memberToKick.id));
      if (selectedMember?.id === memberToKick.id) {
        setSelectedMember(null);
      }
      // Add the role to removed roles
      setRemovedRoles(prev => [...prev, memberToKick.role]);
      setShowKickModal(false);
      setMemberToKick(null);
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

  // Get available roles (roles that have been removed)
  const availableRoles = projectRoles.filter(role =>
    removedRoles.includes(role.roleName)
  );

  return (
    <div className={styles.projectDetails}>
      {/* Project Header */}
      <div className={styles.projectHeader}>
        <div className={styles.headerTop}>
          <button className={styles.backButton} onClick={handleBackToProjects}>
            <Image src="/next_arrow.svg" alt="back arrow" width={20} height={20} />
            Back to Projects
          </button>
          <h1 className={styles.projectTitle}>InnoSync - Project Management Platform</h1>
        </div>
        <div className={styles.projectMeta}>
          <div className={styles.projectDate}>
            <Image src="/calendar.svg" alt="calendar icon" width={20} height={20} />
            <span>Started: June 1st, 2024</span>
          </div>
        </div>
      </div>

      {/* Project Description */}
        <div className={styles.projectDescriptionCard}>
          <div className={styles.cardHeader}>
          <h2>Project Description</h2>
          </div>
          <div className={styles.descriptionContent}>
            <p>
            InnoSync is an innovative project management platform designed to solve critical
            development challenges for the 21st century. Our platform aims to revolutionize
            how teams collaborate, manage projects, and achieve their goals in the IT world.
            With advanced features and intuitive design, InnoSync helps developers and teams
            accomplish more in their careers while fostering better collaboration and productivity.
          </p>
          </div>
        </div>

      {/* Team Section - Full Width when no description */}
      {!selectedMember ? (
        <div className={styles.teamSectionFull}>
          <div className={styles.teamHeader}>
            <h2>Team Members</h2>
            <span className={styles.teamCount}>{currentTeamMembers.length} members</span>
          </div>

          <div className={styles.teamGrid}>
            {currentTeamMembers.map((member) => (
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
              <span className={styles.teamCount}>{currentTeamMembers.length} members</span>
            </div>

            <div className={styles.teamList}>
              {currentTeamMembers.map((member) => (
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
                      {selectedMember.skills.map((skill, index) => (
                        <span key={index} className={styles.skillTag}>
                          {skill}
                        </span>
          ))}
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