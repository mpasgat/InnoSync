import React, { useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import styles from "./ProjectCreationPanel.module.css";
import closeIcon from "/public/close_icon.svg";

interface TeamMember {
  id: string;
  position: string;
  requiredSkills: string[];
  expertiseLevel: string;
}

interface ProjectCreationPanelProps {
  open: boolean;
  onClose: () => void;
}

export default function ProjectCreationPanel({ open, onClose }: ProjectCreationPanelProps) {
  const router = useRouter();
  // Step management
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1 fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [projectType, setProjectType] = useState("");
  const [teamSize, setTeamSize] = useState("");
  const [positions, setPositions] = useState<string[]>([]);
  const [positionInput, setPositionInput] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [commitment, setCommitment] = useState("");

  // Step 2 fields
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [quickSync, setQuickSync] = useState(false);
  const [newSkillInputs, setNewSkillInputs] = useState<{[key: string]: string}>({});

  if (!open) return null;

  // Step 1 handlers
  const handleAddPosition = () => {
    if (positionInput.trim() && !positions.includes(positionInput.trim())) {
      setPositions([...positions, positionInput.trim()]);
      setPositionInput("");
    }
  };

  const handleRemovePosition = (pos: string) => {
    setPositions(positions.filter((p) => p !== pos));
  };

  // Step 2 handlers
  const handleAddSkill = (memberId: string, skill: string) => {
    if (!skill.trim()) return;

    setTeamMembers(members =>
      members.map(member =>
        member.id === memberId
          ? { ...member, requiredSkills: [...member.requiredSkills, skill.trim()] }
          : member
      )
    );

    setNewSkillInputs(prev => ({ ...prev, [memberId]: '' }));
  };

  const handleRemoveSkill = (memberId: string, skillToRemove: string) => {
    setTeamMembers(members =>
      members.map(member =>
        member.id === memberId
          ? { ...member, requiredSkills: member.requiredSkills.filter(skill => skill !== skillToRemove) }
          : member
      )
    );
  };

  const handleExpertiseLevelChange = (memberId: string, expertiseLevel: string) => {
    setTeamMembers(members =>
      members.map(member =>
        member.id === memberId
          ? { ...member, expertiseLevel }
          : member
      )
    );
  };

  const handleSkillInputChange = (memberId: string, value: string) => {
    setNewSkillInputs(prev => ({ ...prev, [memberId]: value }));
  };

  const handleSkillInputKeyDown = (e: React.KeyboardEvent, memberId: string) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const skill = newSkillInputs[memberId];
      if (skill && skill.trim()) {
        handleAddSkill(memberId, skill);
      }
    }
  };

    const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate positions count matches team size
    if (teamSize) {
      const getTeamSizeRange = (size: string) => {
        switch (size) {
          case "1-3":
            return { min: 1, max: 3 };
          case "4-6":
            return { min: 4, max: 6 };
          case "7+":
            return { min: 7, max: Infinity };
          default:
            return { min: 0, max: 0 };
        }
      };

      const { min, max } = getTeamSizeRange(teamSize);
      const positionCount = positions.length;

      if (positionCount < min || positionCount > max) {
        if (max === Infinity) {
          toast.error(`Please add at least ${min} required positions for team size ${teamSize}.`);
        } else {
          toast.error(`Please add ${min}-${max} required positions for team size ${teamSize}.`);
        }
        return;
      }
    }

    // Convert positions to team members for step 2
    const members: TeamMember[] = positions.map((position, index) => ({
      id: (index + 1).toString(),
      position,
      requiredSkills: [],
      expertiseLevel: 'MID' // Default to MID for new positions
    }));

    setTeamMembers(members);
    setCurrentStep(2);
  };

  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate that each team member has at least one skill
    const membersWithoutSkills = teamMembers.filter(member => member.requiredSkills.length === 0);
    if (membersWithoutSkills.length > 0) {
      toast.error(`Please add required skills for all team members.`);
      return;
    }

    // Validate that each team member has an expertise level selected
    const membersWithoutExpertiseLevel = teamMembers.filter(member => !member.expertiseLevel);
    if (membersWithoutExpertiseLevel.length > 0) {
      toast.error(`Please select expertise level for all team members.`);
      return;
    }

    try {
      // Get auth token from localStorage (assuming it's stored there)
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication required. Please log in.');
        return;
      }

      // Step 1: Create the project
      const getTeamSizeEnum = (size: string) => {
        switch (size) {
          case "1-3": return "OneThree";
          case "4-6": return "FourSix";
          case "7+": return "SevenPlus";
          default: return "OneThree";
        }
      };

      const projectData = {
        title,
        description,
        projectType: projectType.toUpperCase(), // FREELANCE, RESEARCH, ACADEMIC, HACKATHON
        teamSize: getTeamSizeEnum(teamSize), // OneThree, FourSix, SevenPlus
        experienceLevel,
        commitment
      };

      const projectResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(projectData)
      });

      if (!projectResponse.ok) {
        const errorData = await projectResponse.json();
        toast.error(`Failed to create project: ${errorData.message || 'Unknown error'}`);
        return;
      }

      const createdProject = await projectResponse.json();
      const projectId = createdProject.id;

      // Step 2: Add roles for each team member
      const rolePromises = teamMembers.map(async (member) => {
        const roleData = {
          roleName: member.position,
          expertiseLevel: member.expertiseLevel, // Use the individual expertise level
          technologies: member.requiredSkills
        };

        const roleResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/${projectId}/roles`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(roleData)
        });

        if (!roleResponse.ok) {
          throw new Error(`Failed to create role for ${member.position}`);
        }

        return roleResponse.json();
      });

      // Wait for all roles to be created
      await Promise.all(rolePromises);

      toast.success('Project and team roles created successfully!', {
        position: 'top-center',
        autoClose: 3000,
      });

      // Check if QuickSync is enabled
      if (quickSync) {
        // Navigate to QuickSync page
        router.push('/dashboard/projects/quicksync');
      } else {
        // Reset form and close panel
        setCurrentStep(1);
        setTitle('');
        setDescription('');
        setProjectType('');
        setTeamSize('');
        setPositions([]);
        setTeamMembers([]);
        setQuickSync(false);
        setExperienceLevel("");
        setCommitment("");
        onClose();
      }

    } catch (error) {
      console.error('Error creating project:', error);
      toast.error(`Error: ${error instanceof Error ? error.message : 'Failed to create project'}`);
    }
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.panel}>
        <button className={styles.closeButton} onClick={onClose}>&times;</button>
        <h2 className={styles.title}>
          {currentStep === 1 ? "Create a Project" : "Team Members"}
        </h2>

        {currentStep === 1 ? (
          <form className={styles.form} onSubmit={handleStep1Submit}>
            {/* Project Title */}
            <div className={styles.fieldGroup}>
              <label htmlFor="project-title">Project Title:</label>
              <input
                id="project-title"
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Title"
                required
              />
            </div>

            {/* Project Description */}
            <div className={styles.fieldGroup}>
              <label htmlFor="project-description">Project Description:</label>
              <textarea
                id="project-description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Description"
                rows={4}
                required
              />
            </div>

            {/* Project Type and Team Size Row */}
            <div className={styles.rowGroup}>
              <div className={styles.fieldGroup}>
                <label htmlFor="project-type">Project Type:</label>
                <select
                  id="project-type"
                  value={projectType}
                  onChange={e => setProjectType(e.target.value)}
                  className={projectType ? styles.hasValue : ''}
                  required
                >
                  <option value="" disabled>Project Type</option>
                  <option value="Freelance">Freelance</option>
                  <option value="Research">Research</option>
                  <option value="Academic">Academic</option>
                  <option value="Hackathon">Hackathon</option>
                </select>
              </div>

              <div className={styles.fieldGroup}>
                <label htmlFor="team-size">Team Size:</label>
                <select
                  id="team-size"
                  value={teamSize}
                  onChange={e => setTeamSize(e.target.value)}
                  className={teamSize ? styles.hasValue : ''}
                  required
                >
                  <option value="" disabled>Team Size</option>
                  <option value="1-3">1-3</option>
                  <option value="4-6">4-6</option>
                  <option value="7+">7+</option>
                </select>
              </div>
            </div>

            {/* Experience Level and Commitment Row */}
            <div className={styles.rowGroup}>
              <div className={styles.fieldGroup}>
                <label htmlFor="experience-level">Experience Level:</label>
                <select
                  id="experience-level"
                  value={experienceLevel}
                  onChange={e => setExperienceLevel(e.target.value)}
                  className={experienceLevel ? styles.hasValue : ''}
                  required
                >
                  <option value="" disabled>Experience Level</option>
                  <option value="ENTRY">Entry</option>
                  <option value="JUNIOR">Junior</option>
                  <option value="MID">Mid</option>
                  <option value="SENIOR">Senior</option>
                  <option value="RESEARCHER">Researcher</option>
                </select>
              </div>
              <div className={styles.fieldGroup}>
                <label htmlFor="commitment">Commitment:</label>
                <select
                  id="commitment"
                  value={commitment}
                  onChange={e => setCommitment(e.target.value)}
                  className={commitment ? styles.hasValue : ''}
                  required
                >
                  <option value="" disabled>Commitment</option>
                  <option value="Full Time">Full Time</option>
                  <option value="Part Time">Part Time</option>
                  <option value="Internship">Internship</option>
                  <option value="Contract">Contract</option>
                  <option value="Research">Research</option>
                </select>
              </div>
            </div>

            {/* Required Positions */}
            <div className={styles.fieldGroup}>
              <label>Required Positions:</label>
              <input
                type="text"
                value={positionInput}
                onChange={e => setPositionInput(e.target.value)}
                placeholder="Type position and press Enter"
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddPosition();
                  }
                }}
                className={styles.positionInput}
              />
              <div className={styles.positionsChips}>
                {positions.map(pos => (
                  <span key={pos} className={styles.chip}>
                    {pos}
                    <button
                      type="button"
                      onClick={() => handleRemovePosition(pos)}
                      className={styles.chipRemove}
                      aria-label={`Remove ${pos}`}
                    >
                      <Image
                        src={closeIcon}
                        alt="Remove"
                        width={12}
                        height={12}
                        className={styles.chipRemoveIcon}
                      />
                    </button>
                  </span>
                ))}
              </div>
            </div>

                         {/* Submit Button */}
             <button className={styles.submitButton} type="submit">
               Next
             </button>
          </form>
        ) : (
          <form className={styles.form} onSubmit={handleStep2Submit}>

          {/* Team Members */}
          <div className={styles.fieldGroup}>
            <label>Team Members:</label>
            <div className={styles.teamMembersContainer}>
              {teamMembers.map(member => (
                <div key={member.id} className={styles.memberSection}>
                  <div className={styles.memberHeader}>
                    <label>Position:</label>
                    <span className={styles.positionTag}>{member.position}</span>
                  </div>

                  <div className={styles.skillsSection}>
                    <label>Required Skills:</label>
                    <input
                      type="text"
                      value={newSkillInputs[member.id] || ''}
                      onChange={e => handleSkillInputChange(member.id, e.target.value)}
                      onKeyDown={e => handleSkillInputKeyDown(e, member.id)}
                      placeholder="Add skill and press Enter"
                      className={styles.skillInput}
                    />
                    <div className={styles.skillTags}>
                      {member.requiredSkills.map(skill => (
                        <span key={skill} className={styles.skillTag}>
                          {skill}
                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(member.id, skill)}
                            className={styles.skillRemove}
                            aria-label={`Remove ${skill}`}
                          >
                            <Image
                              src={closeIcon}
                              alt="Remove"
                              width={12}
                              height={12}
                              className={styles.skillRemoveIcon}
                            />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Expertise Level for each member */}
                  <div className={styles.fieldGroup}>
                    <label>Expertise Level:</label>
                    <select
                      value={member.expertiseLevel}
                      onChange={e => handleExpertiseLevelChange(member.id, e.target.value)}
                      className={member.expertiseLevel ? styles.hasValue : ''}
                      required
                    >
                      <option value="" disabled>Expertise Level</option>
                      <option value="ENTRY">Entry</option>
                      <option value="JUNIOR">Junior</option>
                      <option value="MID">Mid</option>
                      <option value="SENIOR">Senior</option>
                      <option value="RESEARCHER">Researcher</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Enable QuickSync Toggle */}
          <div className={styles.toggleGroup}>
            <label htmlFor="quicksync-toggle">Enable QuickSync</label>
            <div
              className={`${styles.toggleSwitch} ${quickSync ? styles.checked : ''}`}
              onClick={() => setQuickSync(!quickSync)}
            >
              <div className={styles.toggleHandle}></div>
            </div>
            <input
              id="quicksync-toggle"
              type="checkbox"
              checked={quickSync}
              onChange={e => setQuickSync(e.target.checked)}
              style={{ display: 'none' }}
            />
          </div>

                      {/* Submit Button */}
            <div className={styles.buttonRow}>
              <button
                type="button"
                className={styles.backButton}
                onClick={handleBack}
              >
                Back
              </button>
              <button className={styles.submitButton} type="submit">
                Submit
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}