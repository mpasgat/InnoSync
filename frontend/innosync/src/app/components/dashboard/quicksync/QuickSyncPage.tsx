'use client';
import { useState } from "react";
//import { useRouter } from "next/navigation";
import styles from "./QuickSyncPage.module.css";

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

  const getRandomCandidate = (): Candidate => {
    return candidatesPool[Math.floor(Math.random() * candidatesPool.length)];
  };

  const rerollAllCandidates = () => {
    const newCandidates = Array.from({ length: 3 }, () => getRandomCandidate());
    setCurrentCandidates(newCandidates);
  };

  const rerollSingleCandidate = (index: number) => {
    const newCandidates = [...currentCandidates];
    newCandidates[index] = getRandomCandidate();
    setCurrentCandidates(newCandidates);
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
      <div className={styles.header}>
        <h1>QuickSync - Team Matching</h1>
        <p>We have found some great candidates for your project!</p>
      </div>

      {/* <div className={styles.content}> */}
        <div className={styles.browserContent}>
          {/* Candidates List */}
          <div className={styles.candidatesSection}>
            <div className={styles.candidatesList}>
              {currentCandidates.map((candidate, index) => (
                <div
                  key={`${candidate.id}-${index}`}
                  className={`${styles.candidateCard} ${
                    selectedCandidate.id === candidate.id ? styles.selected : ""
                  }`}
                  onClick={() => selectCandidate(candidate)}
                >
                  <div className={styles.candidateAvatar}>
                    <img src={candidate.avatar} alt={candidate.name} />
                  </div>

                  <div className={styles.candidateInfo}>
                    <h3 className={styles.candidateName}>{candidate.name}</h3>
                    <p className={styles.candidateRole}>{candidate.role}</p>

                    <div className={styles.candidateDetails}>
                      <div className={styles.detailBadges}>
                        <span className={`${styles.badge} ${styles.expert}`}>{candidate.level}</span>
                        <span className={`${styles.badge} ${styles.education}`}>{candidate.education}</span>
                        <span className={`${styles.badge} ${styles.experience}`}>{candidate.experience}</span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.candidateActions}>
                    <button
                      className={styles.rerollBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        rerollSingleCandidate(index);
                      }}
                    >
                      🔄 REROLL
                    </button>
                    <button className={styles.contactBtn}>
                      ✉️ CONTACT →
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button className={styles.rerollAllBtn} onClick={rerollAllCandidates}>
              🔄 Reroll All
            </button>
          </div>

          {/* Selected Candidate Profile */}
          <div className={styles.profileSection}>
            <div className={styles.profileCard}>
              <div className={styles.profileHeader}>
                <div className={styles.profileAvatar}>
                  <img src={selectedCandidate.avatar} alt={selectedCandidate.name} />
                </div>
                <div className={styles.profileBadges}>
                  <span className={`${styles.badge} ${styles.expert}`}>{selectedCandidate.level}</span>
                  <span className={`${styles.badge} ${styles.education}`}>{selectedCandidate.education}</span>
                  <span className={`${styles.badge} ${styles.experience}`}>{selectedCandidate.experience}</span>
                </div>
              </div>

              <div className={styles.profileInfo}>
                <h2 className={styles.profileName}>{selectedCandidate.name}</h2>
                <p className={styles.profileBio}>{selectedCandidate.bio}</p>

                <div className={styles.profileSections}>
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
