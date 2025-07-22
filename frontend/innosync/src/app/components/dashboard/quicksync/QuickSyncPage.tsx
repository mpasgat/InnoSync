'use client';
import { useState } from "react";
//import { useRouter } from "next/navigation";
import styles from "./QuickSyncPage.module.css";
import Image from 'next/image';

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
  const candidatesPool: Candidate[] = [
    {
      id: "1",
      name: "Ahmed Baha Eddine Alimi",
      role: "ML Engineer",
      level: "Expert",
      education: "Bachelor",
      experience: "2 years",
      email: "ahmed.alimi@innopolis.ru",
      bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      skills: ["React.js", "Docker", "React"],
      positions: ["Frontend Dev", "DevOps", "Backend Dev"],
      avatar: "https://i.pravatar.cc/150?img=1",
    },
    {
      id: "2",
      name: "Rick Sanchez",
      role: "ML Engineer",
      level: "Expert",
      education: "Bachelor",
      experience: "3 years",
      email: "rick.sanchez@innopolis.ru",
      bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      skills: ["Python", "Docker", "React"],
      positions: ["Frontend Dev", "DevOps", "Backend Dev"],
      avatar: "https://i.pravatar.cc/150?img=2",
    },
    {
      id: "3",
      name: "Maria Volkov",
      role: "Frontend Developer",
      level: "Intermediate",
      education: "Master",
      experience: "3 years",
      email: "maria.volkov@innopolis.ru",
      bio: "Passionate frontend developer with expertise in modern web technologies. Experienced in building responsive and user-friendly interfaces using React and Vue.js. Strong background in UX/UI design principles.",
      skills: ["Vue.js", "TypeScript", "CSS"],
      positions: ["Frontend Dev", "UI Designer", "React Dev"],
      avatar: "https://i.pravatar.cc/150?img=3",
    },
    {
      id: "4",
      name: "Alex Petrov",
      role: "Backend Developer",
      level: "Expert",
      education: "Master",
      experience: "5 years",
      email: "alex.petrov@innopolis.ru",
      bio: "Senior backend developer with extensive experience in building scalable web applications. Proficient in multiple programming languages and cloud technologies.",
      skills: ["Node.js", "PostgreSQL", "AWS"],
      positions: ["Backend Dev", "DevOps", "System Architect"],
      avatar: "https://i.pravatar.cc/150?img=4",
    },
    {
      id: "5",
      name: "Sofia Chen",
      role: "Data Scientist",
      level: "Expert",
      education: "PhD",
      experience: "4 years",
      email: "sofia.chen@innopolis.ru",
      bio: "Experienced data scientist specializing in machine learning and statistical analysis. Strong background in deep learning and natural language processing.",
      skills: ["Python", "TensorFlow", "Analytics"],
      positions: ["Data Scientist", "ML Engineer", "Research Analyst"],
      avatar: "https://i.pravatar.cc/150?img=5",
    },
  ];

  const [currentCandidates, setCurrentCandidates] = useState<Candidate[]>(
    candidatesPool.slice(0, 3)
  );
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate>(
    candidatesPool[1] // Rick Sanchez as default
  );

  const getRandomCandidate = (excludeIds: string[] = []): Candidate => {
    const filtered = candidatesPool.filter(c => !excludeIds.includes(c.id));
    if (filtered.length === 0) return candidatesPool[0];
    return filtered[Math.floor(Math.random() * filtered.length)];
  };

  const rerollAllCandidates = () => {
    const newCandidates: Candidate[] = [];
    for (let i = 0; i < 3; i++) {
      const candidate = getRandomCandidate(newCandidates.map(c => c.id));
      newCandidates.push(candidate);
    }
    setCurrentCandidates(newCandidates);
    // Optionally, update selectedCandidate if it's not in the new set
    if (!newCandidates.some(c => c.id === selectedCandidate.id)) {
      setSelectedCandidate(newCandidates[0]);
    }
  };

  const rerollSingleCandidate = (index: number) => {
    const otherIds = currentCandidates.filter((_, i) => i !== index).map(c => c.id);
    const newCandidate = getRandomCandidate(otherIds);
    const newCandidates = [...currentCandidates];
    newCandidates[index] = newCandidate;
    setCurrentCandidates(newCandidates);
    // Optionally, update selectedCandidate if it was replaced
    if (selectedCandidate.id === currentCandidates[index].id) {
      setSelectedCandidate(newCandidate);
    }
  };

  const selectCandidate = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
  };

  // const handleSendInvitations = () => {
  //   // Navigate back to projects page after sending invitations
  //   router.push('/dashboard/projects');
  // };

  // const handleSkip = () => {
  //   router.push('/dashboard/projects');
  // };

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
                  className={`${styles.candidateCard} ${selectedCandidate.id === candidate.id ? styles.selected : ""}`}
                  onClick={() => selectCandidate(candidate)}
                >
                  {/* Avatar */}
                  <div className={styles.candidateAvatarFigma}>
                    <img src={candidate.avatar} alt={candidate.name} />
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
                      onClick={selectedCandidate.id === candidate.id ? (e => {
                        e.stopPropagation();
                        rerollSingleCandidate(index);
                      }) : (e => e.preventDefault())}
                      tabIndex={selectedCandidate.id === candidate.id ? 0 : -1}
                      aria-disabled={selectedCandidate.id !== candidate.id}
                    >
                      <Image src="/refresh.svg" alt="refresh icon" width={24} height={24} style={{marginRight: 8}} />
                      REROLL
                    </button>
                    <button
                      className={styles.contactBtnFigma}
                      onClick={selectedCandidate.id === candidate.id ? undefined : (e => e.preventDefault())}
                      tabIndex={selectedCandidate.id === candidate.id ? 0 : -1}
                      aria-disabled={selectedCandidate.id !== candidate.id}
                    >
                      CONTACT
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
          <div className={styles.profileSection}>
            <div className={styles.profileCard}>
              {/* Avatar */}
              <div className={styles.profileHeader}>
                <div className={styles.profileAvatar}>
                  <img src={selectedCandidate.avatar} alt={selectedCandidate.name} />
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
