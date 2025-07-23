'use client';
import { useState, useEffect } from "react";
//import { useRouter } from "next/navigation";
import styles from "./QuickSyncPage.module.css";
import Image from 'next/image';
import { toast } from 'react-toastify';

// API Response Interfaces
interface WorkExperience {
  startDate: string;
  endDate: string;
  position: string;
  company: string;
  description: string;
}

interface ApiMember {
  id: number;
  bio: string;
  position: string;
  education: string;
  expertise: string;
  technologies: string[];
  expertise_level: string;
  experience_years: string;
  work_experience: WorkExperience[];
  role_match_score: number;
}

interface SynergyMetrics {
  avg_synergy: number;
  shared_skills: number;
  experience_variance: number;
}

interface TeamRecommendationResponse {
  project_id: string;
  team_score: number;
  synergy_score: number;
  combined_score: number;
  members: ApiMember[];
  synergy_metrics: SynergyMetrics;
  recommendation_notes: string[];
}

// Project interface for GET /api/projects/me
interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  // Add other project fields as needed
}

// Profile interface for GET /api/profile/all
interface Profile {
  id: number;
  email: string;
  fullName: string;
  telegram: string;
  github: string;
  bio: string;
  position: string;
  education: string;
  expertise: string;
  resume: string;
  profilePicture: string;
  technologies: string[];
  expertise_level: string;
  experience_years: string;
  work_experience: WorkExperience[];
}

// Project Role interface for GET /api/projects/{projectId}/roles
interface ProjectRole {
  id: number;
  roleName: string;
  expertiseLevel: string;
  technologies: string[];
}

// UI Interface (keeping existing structure)
interface Candidate {
  id: string;
  name: string;
  role: string;
  level: "Expert" | "Intermediate" | "Beginner";
  education: "Bachelor" | "Master" | "PhD";
  experience: string;
  email: string;
  bio: string;
  skills: string[];
  positions: string[];
  avatar: string;
}

const QuickSyncPage = () => {
  //const router = useRouter();
  
  // State for API data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for UI candidates (transformed from API data)
  const [currentCandidates, setCurrentCandidates] = useState<Candidate[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [contactingCandidate, setContactingCandidate] = useState<string | null>(null);
  const [noTalentMatch, setNoTalentMatch] = useState(false);

  // Helper function to map API education to UI format
  const mapEducation = (education: string): "Bachelor" | "Master" | "PhD" => {
    switch (education) {
      case "BACHELOR":
        return "Bachelor";
      case "MASTER":
        return "Master";
      case "PHD":
        return "PhD";
      default:
        return "Bachelor";
    }
  };

  // Helper function to map API expertise level to UI format
  const mapExpertiseLevel = (level: string): "Expert" | "Intermediate" | "Beginner" => {
    switch (level) {
      case "SENIOR":
        return "Expert";
      case "MIDDLE":
        return "Intermediate";
      case "JUNIOR":
      case "ENTRY":
        return "Beginner";
      default:
        return "Intermediate";
    }
  };

  // Helper function to map experience years to readable format
  const mapExperienceYears = (years: string): string => {
    switch (years) {
      case "ZERO_TO_ONE":
        return "0-1 years";
      case "ONE_TO_THREE":
        return "1-3 years";
      case "THREE_TO_FIVE":
        return "3-5 years";
      case "FIVE_TO_TEN":
        return "5-10 years";
      case "MORE_THAN_TEN":
        return "10+ years";
      default:
        return "0-1 years";
    }
  };

  // Transform API member to UI candidate
  const transformApiMemberToCandidate = (member: ApiMember, profiles: Profile[]): Candidate => {
    // Find the corresponding profile for this member
    const profile = profiles.find(p => p.id === member.id);
    const fullName = profile?.fullName || `User ${member.id}`;
    const email = profile?.email || `user${member.id}@example.com`;
    
    const avatarUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/profile/${member.id}/picture`;
    console.log(`Generated avatar URL for member ${member.id}:`, avatarUrl);
    
    return {
      id: member.id.toString(),
      name: fullName, // Use real name from profile
      role: member.position,
      level: mapExpertiseLevel(member.expertise_level),
      education: mapEducation(member.education),
      experience: mapExperienceYears(member.experience_years),
      email: email, // Use real email from profile
      bio: member.bio,
      skills: member.technologies,
      positions: [member.position], // Using position as the main position
      avatar: avatarUrl, // Use real profile picture
    };
  };

  // Fetch all profiles from API
  const fetchProfiles = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found. Please log in.');
      }

      const profilesResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profile/all`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!profilesResponse.ok) {
        throw new Error(`Failed to fetch profiles: ${profilesResponse.status}`);
      }

      const profilesData: Profile[] = await profilesResponse.json();
      return profilesData;
    } catch (err) {
      console.error('Error fetching profiles:', err);
      // Don't throw error here, just return empty array
      return [];
    }
  };

  // Fetch team recommendations from API
  const fetchTeamRecommendations = async () => {
    try {
      setLoading(true);
      setError(null);
      setNoTalentMatch(false);
      
      // First, fetch all profiles to get real names
      const profilesData = await fetchProfiles();
      
      // Then, get the user's projects to find the last created project
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found. Please log in.');
      }

      const projectsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!projectsResponse.ok) {
        throw new Error(`Failed to fetch projects: ${projectsResponse.status}`);
      }

      const projects: Project[] = await projectsResponse.json();
      
      if (projects.length === 0) {
        throw new Error('No projects found. Please create a project first.');
      }

      // Get the last created project (assuming projects are sorted by creation date)
      const lastProject = projects[projects.length - 1];
      
      // Now fetch team recommendations using the last project ID
      const requestBody: { project_id: string } = {
        project_id: lastProject.id
      };
      
      const teamResponse = await fetch('http://localhost:8000/recommend-team', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!teamResponse.ok) {
        if (teamResponse.status === 400) {
          setNoTalentMatch(true);
          setCurrentCandidates([]);
          return;
        }
        throw new Error(`Failed to fetch team recommendations: ${teamResponse.status}`);
      }

      const data: TeamRecommendationResponse = await teamResponse.json();
      
      // Transform API members to candidates
      const candidates = data.members.map(member => transformApiMemberToCandidate(member, profilesData));
      setCurrentCandidates(candidates);
      
      // Set the first candidate as selected
      if (candidates.length > 0) {
        setSelectedCandidate(candidates[0]);
      }
      
    } catch (err) {
      console.error('Error fetching team recommendations:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch recommendations');
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchTeamRecommendations();
  }, []);

  const rerollAllCandidates = () => {
    fetchTeamRecommendations();
  };

  const rerollSingleCandidate = () => {
    // For now, just refetch all candidates
    // In a more sophisticated implementation, you might want to call a different endpoint
    fetchTeamRecommendations();
  };

  const selectCandidate = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
  };

  const handleContact = async (candidate: Candidate) => {
    setContactingCandidate(candidate.id);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found. Please log in.');
      }

      // Get the user's projects (should be only their own)
      const projectsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!projectsResponse.ok) {
        throw new Error(`Failed to fetch projects: ${projectsResponse.status}`);
      }

      const projects: Project[] = await projectsResponse.json();
      if (projects.length === 0) {
        throw new Error('No projects found. Please create a project first.');
      }

      const lastProject = projects[projects.length - 1];

      // Get roles for the last project
      const rolesResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/${lastProject.id}/roles`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!rolesResponse.ok) {
        throw new Error(`Failed to fetch project roles: ${rolesResponse.status}`);
      }

      const roles: ProjectRole[] = await rolesResponse.json();
      if (!roles.length) {
        toast.error("No roles found for your project.");
        return;
      }

      // Find the role that matches both position and at least one technology
      const matchingRole = roles.find((role: ProjectRole) => {
        const roleNameMatch = role.roleName.toLowerCase() === candidate.role.toLowerCase();
        const techMatch = role.technologies.some(
          tech => candidate.skills.map(s => s.toLowerCase()).includes(tech.toLowerCase())
        );
        return roleNameMatch && techMatch;
      });
      if (!matchingRole) {
        toast.error("No matching role found for this candidate's position and skills.");
        return;
      }

      // Send invitation
      const payload = {
        projectRoleId: Number(matchingRole.id),
        recipientId: Number(candidate.id)
      };

      const invitationResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/invitations`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (invitationResponse.status === 409) {
        toast.error("An invitation for this user and role already exists.");
        return;
      }
      if (!invitationResponse.ok) throw new Error("Failed to send invitation");

      toast.success(`Invitation sent successfully to ${candidate.name}!`, {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'colored',
      });
    } catch (err) {
      toast.error((err as Error).message || "Failed to send invitation", {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'colored',
      });
    } finally {
      setContactingCandidate(null);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.browserContent}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
            <div>Loading team recommendations...</div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.browserContent}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px', flexDirection: 'column', gap: '16px' }}>
            <div style={{ color: 'red' }}>Error: {error}</div>
            <button 
              onClick={() => fetchTeamRecommendations()}
              style={{ 
                padding: '8px 16px', 
                backgroundColor: '#007bff', 
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

  // No talent match state
  if (noTalentMatch) {
    return (
      <div className={styles.container}>
        <div className={styles.browserContent}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px', flexDirection: 'column', gap: '16px' }}>
            <div style={{ color: '#64748b', fontSize: 20 }}>No talent match for desired roles.</div>
            <button 
              onClick={() => fetchTeamRecommendations()}
              style={{ 
                padding: '8px 16px', 
                backgroundColor: '#007bff', 
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

  // No candidates state
  if (currentCandidates.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.browserContent}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
            <div>No team members found.</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* <div className={styles.content}> */}
        <div className={styles.browserContent}>
          {/* Candidates List */}
          <div className={styles.candidatesSection}>
            <div className={styles.candidatesList}>
              {currentCandidates.map((candidate, index) => (
                <div
                  key={`${candidate.id}-${index}`}
                  className={`${styles.candidateCard} ${selectedCandidate?.id === candidate.id ? styles.selected : ""}`}
                  onClick={() => selectCandidate(candidate)}
                >
                  {/* Avatar */}
                  <div className={styles.candidateAvatarFigma}>
                    <img 
                      src={candidate.avatar} 
                      alt={candidate.name}
                      onError={(e) => {
                        // Fallback to local placeholder if profile picture fails to load
                        console.log(`Failed to load profile picture for candidate ${candidate.id}:`, e.currentTarget.src);
                        e.currentTarget.src = "/profile_image.png";
                      }}
                    />
                  </div>
                  {/* Info */}
                  <div className={styles.candidateInfoFigma}>
                    <div className={styles.candidateHeadingRow}>
                      <span className={styles.candidateNameFigma}>{candidate.name}</span>
                      <span className={styles.roleBadge}>{candidate.role}</span>
                    </div>
                    <div className={styles.detailBadgesFigma}>
                      {/* Level */}
                      <span className={styles.detailBadge} style={{display: 'flex', alignItems: 'center', gap: 8}}>
                        <Image src="/verified.svg" alt="verified icon" width={24} height={24} style={{marginRight: 4}} />
                        {candidate.level}
                      </span>
                      {/* Education */}
                      <span className={styles.detailBadge} style={{display: 'flex', alignItems: 'center', gap: 8}}>
                        <Image src="/education.svg" alt="education icon" width={20} height={20} style={{marginRight: 4}} />
                        {candidate.education}
                      </span>
                      {/* Experience */}
                      <span className={styles.detailBadge} style={{display: 'flex', alignItems: 'center', gap: 8}}>
                        <Image src="/stars.svg" alt="experience icon" width={24} height={24} style={{marginRight: 4}} />
                        {candidate.experience}
                      </span>
                    </div>
                  </div>
                  {/* Actions */}
                  <div className={styles.candidateActionsFigma}>
                    <button
                      className={styles.rerollBtnFigma}
                      onClick={selectedCandidate?.id === candidate.id ? (e => {
                        e.stopPropagation();
                        rerollSingleCandidate();
                      }) : (e => e.preventDefault())}
                      tabIndex={selectedCandidate?.id === candidate.id ? 0 : -1}
                      aria-disabled={selectedCandidate?.id !== candidate.id}
                    >
                      <Image src="/refresh.svg" alt="refresh icon" width={24} height={24} style={{marginRight: 8}} />
                      REROLL
                    </button>
                    <button
                      className={styles.contactBtnFigma}
                      onClick={selectedCandidate?.id === candidate.id ? (e => {
                        e.stopPropagation();
                        handleContact(candidate);
                      }) : (e => e.preventDefault())}
                      tabIndex={selectedCandidate?.id === candidate.id ? 0 : -1}
                      aria-disabled={selectedCandidate?.id !== candidate.id || contactingCandidate === candidate.id}
                      disabled={contactingCandidate === candidate.id}
                    >
                      {contactingCandidate === candidate.id ? 'SENDING...' : 'CONTACT'}
                      <Image src="/sync_arrow.svg" alt="arrow right icon" width={24} height={24} style={{marginLeft: 8}} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button className={styles.rerollAllBtn} onClick={rerollAllCandidates}>
              <span className={styles.rerollAllBtnIcon}>
                <Image src="/reroll.svg" alt="reroll icon" width={24} height={24} />
              </span>
              <span className={styles.rerollAllBtnText}>Reroll All</span>
            </button>
          </div>

          {/* Selected Candidate Profile */}
          {selectedCandidate && (
            <div className={styles.profileSection}>
              <div className={styles.profileCard}>
                {/* Avatar */}
                <div className={styles.profileHeader}>
                                  <div className={styles.profileAvatar}>
                  <img 
                    src={selectedCandidate.avatar} 
                    alt={selectedCandidate.name}
                    onError={(e) => {
                      // Fallback to local placeholder if profile picture fails to load
                      console.log(`Failed to load profile picture for selected candidate ${selectedCandidate.id}:`, e.currentTarget.src);
                      e.currentTarget.src = "/profile_image.png";
                    }}
                  />
                </div>
                  {/* Name */}
                  <h2 className={styles.profileName}>{selectedCandidate.name}</h2>
                  {/* Badges Row (Figma style) */}
                  <div className={styles.profileBadges} style={{ display: 'flex', flexDirection: 'row', gap: 16, justifyContent: 'center', margin: '16px 0' }}>
                    {/* Level */}
                    <span className={styles.detailBadge} style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f5f5f5', color: '#6C7278', borderRadius: 20, padding: '4px 16px', fontWeight: 500, fontSize: 15 }}>
                      <Image src="/verified.svg" alt="verified icon" width={24} height={24} style={{ marginRight: 4 }} />
                      {selectedCandidate.level}
                    </span>
                    {/* Education */}
                    <span className={styles.detailBadge} style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f5f5f5', color: '#6C7278', borderRadius: 20, padding: '4px 16px', fontWeight: 500, fontSize: 15 }}>
                      <Image src="/education.svg" alt="education icon" width={20} height={20} style={{ marginRight: 4 }} />
                      {selectedCandidate.education}
                    </span>
                    {/* Experience */}
                    <span className={styles.detailBadge} style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f5f5f5', color: '#6C7278', borderRadius: 20, padding: '4px 16px', fontWeight: 500, fontSize: 15 }}>
                      <Image src="/stars.svg" alt="experience icon" width={24} height={24} style={{ marginRight: 4 }} />
                      {selectedCandidate.experience}
                    </span>
                  </div>
                </div>

                {/* Bio */}
                <div className={styles.profileInfo}>
                  <p className={styles.profileBio} style={{ textAlign: 'left', color: '#64748b', fontSize: 14, lineHeight: 1.6, margin: '0 0 24px 0' }}>{selectedCandidate.bio}</p>

                  <div className={styles.profileSections}>
                    {/* Skills Section */}
                    <div className={styles.skillsSection}>
                      <h4 className={styles.sectionTitle}>Skills</h4>
                      <div className={styles.tagsList}>
                        {selectedCandidate.skills.map((skill, index) => (
                          <span key={index} className={styles.skillTag}>
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Positions Section */}
                    <div className={styles.positionsSection}>
                      <h4 className={styles.sectionTitle}>Positions</h4>
                      <div className={styles.tagsList}>
                        {selectedCandidate.positions.map((position, index) => (
                          <span key={index} className={styles.positionTag}>
                            {position}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* <div className={styles.actions}>
          <button
            className={styles.skipButton}
            onClick={handleSkip}
          >
            Skip for Now
          </button>
          <button
            className={styles.inviteButton}
            onClick={handleSendInvitations}
          >
            Send Invitations
          </button>
        </div> */}
      {/* </div> */}
    </div>
  );
};

export default QuickSyncPage;
