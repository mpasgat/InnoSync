"use client";
import React, { useState, useEffect } from "react";
import styles from "../projects/page.module.css";
import Image from "next/image";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Talent {
  id: number;
  name: string;
  avatar: string;
  positions: string[];
  expertiseLevel: string;
  education: string;
  skills: string[];
  experience: string;
  bio: string;
  resume?: string | null;
}

interface SearchBarProps {
  tags: string[];
  onRemoveTag: (tag: string) => void;
  onAddTag: (tag: string) => void;
}

interface TalentCardProps {
  talent: Talent;
  onSelect: (talent: Talent) => void;
  selected: boolean;
  onContact: (talent: Talent) => void;
}

interface TalentListProps {
  talents: Talent[];
  onSelect: (talent: Talent) => void;
  selectedId: number | null;
  onContact: (talent: Talent) => void;
}

interface TalentDescriptionProps {
  talent: Talent | null;
  onContact: (talent: Talent) => void;
}

interface FilterSidebarProps {
  skills: string[];
  onAddSkill: (skill: string) => void;
  onRemoveSkill: (skill: string) => void;
}

type BackendProfile = {
  id: number;
  email: string;
  fullName: string;
  telegram: string;
  github: string;
  bio: string;
  position: string;
  education: string;
  expertise: string;
  resume: string | null;
  profilePicture: string | null;
  technologies: string[];
  expertise_level: string;
  experience_years: string;
  work_experience: {
    startDate: string;
    endDate: string;
    position: string;
    company: string;
    description: string;
  }[];
};

type Project = { id: number; title: string };
type Role = { id: number; roleName: string };

const experienceOptions = ["< 1", "1-2", "3-5", "5+"];
const educationOptions = ["No Degree", "Bachelor", "Master", "PhD"];
const expertiseOptions = ["Entry", "Junior", "Mid", "Senior", "Expert"];

const FilterSidebar: React.FC<FilterSidebarProps & {
  selectedExperience: string[];
  setSelectedExperience: (exp: string[]) => void;
  selectedEducation: string[];
  setSelectedEducation: (edu: string[]) => void;
  selectedExpertise: string[];
  setSelectedExpertise: (exp: string[]) => void;
  onClearFilters: () => void;
}> = ({
  skills, onAddSkill, onRemoveSkill,
  selectedExperience, setSelectedExperience,
  selectedEducation, setSelectedEducation,
  selectedExpertise, setSelectedExpertise,
  onClearFilters
}) => {
  const [input, setInput] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const value = input.trim();
      if (value) {
        onAddSkill(value);
        setInput("");
      }
    }
  };

  const handleCheckbox = (value: string, selected: string[], setSelected: (v: string[]) => void) => {
    if (selected.includes(value)) {
      setSelected(selected.filter(v => v !== value));
    } else {
      setSelected([...selected, value]);
    }
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.filterSection}>
        <h3>Experience (Years)</h3>
        <div className={styles.checkboxGroup}>
          {experienceOptions.map(level => (
            <label className={styles.checkboxLabel} key={level}>
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={selectedExperience.includes(level)}
                onChange={() => handleCheckbox(level, selectedExperience, setSelectedExperience)}
              />
              <span className={styles.customCheckbox}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 8.5L7 11.5L12 5.5" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              {level}
            </label>
          ))}
        </div>
      </div>
      <div className={styles.filterSection}>
        <h3>Education</h3>
        <div className={styles.checkboxGroup}>
          {educationOptions.map(edu => (
            <label className={styles.checkboxLabel} key={edu}>
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={selectedEducation.includes(edu)}
                onChange={() => handleCheckbox(edu, selectedEducation, setSelectedEducation)}
              />
              <span className={styles.customCheckbox}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 8.5L7 11.5L12 5.5" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              {edu}
            </label>
          ))}
        </div>
      </div>
      <div className={styles.filterSection}>
        <h3>Expertise Level</h3>
        <div className={styles.checkboxGroup}>
          {expertiseOptions.map(level => (
            <label className={styles.checkboxLabel} key={level}>
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={selectedExpertise.includes(level)}
                onChange={() => handleCheckbox(level, selectedExpertise, setSelectedExpertise)}
              />
              <span className={styles.customCheckbox}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 8.5L7 11.5L12 5.5" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              {level}
            </label>
          ))}
        </div>
      </div>
      <div className={styles.filterSection}>
        <h3>Required Skills</h3>
        <div className={styles.searchInputWrapper}>
          <svg className={styles.searchIcon} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <input
            className={styles.searchInput}
            placeholder="Search"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        <div className={styles.tagList}>
          {skills.map((skill) => (
            <span key={skill} className={`${styles.skillTag} ${styles.selected}`}>
              {skill}
              <button className={styles.removeSkillBtn} onClick={() => onRemoveSkill(skill)}>
                <Image src="/close_icon.svg" alt="Remove" width={15} height={15} />
              </button>
            </span>
          ))}
          <div style={{ width: '100%', height: 30 }} />
        </div>
      </div>
      <button
        onClick={onClearFilters}
        className={styles.clearFiltersBtn}
      >
        Clear Filters
      </button>
    </aside>
  );
};

const SearchBar: React.FC<SearchBarProps> = ({ tags, onRemoveTag, onAddTag }) => {
  const [input, setInput] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const value = input.trim();
      if (value) {
        onAddTag(value);
        setInput("");
      }
    }
  };

  return (
    <div className={styles.searchBarContainer}>
      <div className={styles.searchBar}>
        <div className={styles.mainSearchWrapper}>
          <svg className={styles.searchIcon} width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <input
            className={styles.mainSearchInput}
            placeholder="Search"
            style={{ height: '100%' }}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
      </div>
      <div className={styles.selectedTags}>
        {tags.map(tag => (
          <span key={tag} className={styles.selectedTag}>
            {tag}
            <button onClick={() => onRemoveTag(tag)} className={styles.removeTagBtn} aria-label={`Remove ${tag}`} tabIndex={0}>
              <Image src="/close_icon.svg" alt="Remove" width={15} height={15} />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
};

const InviteModal = ({
  open,
  onClose,
  recipientId,
  recipientName,
  onSuccess
}: {
  open: boolean;
  onClose: () => void;
  recipientId: number | null;
  recipientName: string | null;
  onSuccess: () => void;
}) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [sending, setSending] = useState(false);

  // Helper to get token
  const getToken = () => (typeof window !== 'undefined' ? localStorage.getItem('token') : null);

  useEffect(() => {
    if (open) {
      setLoadingProjects(true);
      const token = getToken();
      fetch("http://localhost:8080/api/projects/me", {
        headers: token ? { "Authorization": `Bearer ${token}` } : {}
      })
        .then(res => res.ok ? res.json() : Promise.resolve([]))
        .then(data => {
          if (Array.isArray(data)) {
            setProjects(data);
          } else {
            setProjects([]);
          }
          setLoadingProjects(false);
        })
        .catch(() => {
          toast.error("Failed to fetch projects");
          setProjects([]);
          setLoadingProjects(false);
        });
      setSelectedProject("");
      setSelectedRole("");
      setRoles([]);
    }
  }, [open]);

  useEffect(() => {
    if (selectedProject) {
      setLoadingRoles(true);
      const token = getToken();
      fetch(`http://localhost:8080/api/projects/${selectedProject}/roles`, {
        headers: token ? { "Authorization": `Bearer ${token}` } : {}
      })
        .then(res => res.ok ? res.json() : Promise.resolve([]))
        .then(data => {
          if (Array.isArray(data)) {
            setRoles(data);
          } else {
            setRoles([]);
          }
          setLoadingRoles(false);
        })
        .catch(() => {
          toast.error("Failed to fetch roles");
          setRoles([]);
          setLoadingRoles(false);
        });
    } else {
      setRoles([]);
      setSelectedRole("");
    }
  }, [selectedProject]);

  const handleSend = async () => {
    // Validate selectedRole and recipientId
    if (!selectedRole || isNaN(Number(selectedRole)) || Number(selectedRole) <= 0) {
      toast.error("Please select a valid role.");
      return;
    }
    if (!recipientId || isNaN(Number(recipientId)) || Number(recipientId) <= 0) {
      toast.error("Invalid recipient.");
      return;
    }
    setSending(true);
    const payload = { projectRoleId: Number(selectedRole), recipientId };
    console.log("Sending invitation:", payload);
    try {
      const token = getToken();
      const response = await fetch("http://localhost:8080/api/invitations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
        body: JSON.stringify(payload),
      });
      if (response.status === 409) {
        toast.error("An invitation for this user and role already exists.");
        setSending(false);
        return;
      }
      if (!response.ok) throw new Error("Failed to send invitation");
      toast.success("Invitation sent!");
      onSuccess();
      onClose();
    } catch (err) {
      toast.error((err as Error).message || "Failed to send invitation");
    } finally {
      setSending(false);
    }
  };

  if (!open) return null;
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{ background: '#fff', borderRadius: 8, padding: 32, minWidth: 320, maxWidth: 400, boxShadow: '0 2px 16px rgba(0,0,0,0.15)' }}>
        <h2 style={{ marginBottom: 16 }}>Invite {recipientName || "Talent"}</h2>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 4 }}>Select Project</label>
          {loadingProjects ? <div>Loading projects...</div> : (
            <select
              value={selectedProject}
              onChange={e => setSelectedProject(e.target.value)}
              style={{ width: '100%', padding: 8 }}
            >
              <option value="">-- Select Project --</option>
              {Array.isArray(projects) && projects.length > 0 ? (
                projects.map((p) => (
                  <option key={p.id} value={p.id}>{p.title}</option>
                ))
              ) : (
                <option disabled>No projects available</option>
              )}
            </select>
          )}
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 4 }}>Select Role</label>
          {loadingRoles ? <div>Loading roles...</div> : (
            <select
              value={selectedRole}
              onChange={e => setSelectedRole(e.target.value)}
              style={{ width: '100%', padding: 8 }}
              disabled={!selectedProject}
            >
              <option value="">-- Select Role --</option>
              {Array.isArray(roles) && roles.length > 0 ? (
                roles.map((r) => (
                  <option key={r.id} value={r.id}>{r.roleName}</option>
                ))
              ) : (
                <option disabled>No roles available</option>
              )}
            </select>
          )}
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <button onClick={onClose} style={{ padding: '8px 16px', background: '#eee', border: 'none', borderRadius: 4 }}>Cancel</button>
          <button
            onClick={handleSend}
            style={{ padding: '8px 16px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: 4 }}
            disabled={!selectedProject || !selectedRole || sending || !recipientId || isNaN(Number(selectedRole)) || Number(selectedRole) <= 0 || isNaN(Number(recipientId)) || Number(recipientId) <= 0}
          >
            {sending ? 'Sending...' : 'Send Invitation'}
          </button>
        </div>
      </div>
    </div>
  );
};

const TalentCard: React.FC<TalentCardProps & { onContact: (talent: Talent) => void }> = ({ talent, onSelect, selected, onContact }) => (
  <div className={`${styles.projectCard} ${selected ? styles.selected : ""}`}
    onClick={() => onSelect(talent)}
    style={{ borderColor: selected ? "#16a34a" : undefined }}
  >
    <div className={styles.projectInfo}>
      <div className={styles.companyLogoWrapper}>
        <Image
          src={talent.avatar || "/profile_image.png"}
          alt={talent.name}
          width={60}
          height={60}
          style={{ borderRadius: 50 }}
          onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/profile_image.png"; }}
        />
      </div>
      <div className={styles.projectDetails}>
        <div className={styles.projectHeader}>
          <h3 className={styles.projectTitle}>{talent.name}</h3>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {talent.positions.map((pos) => (
              <span key={pos} className={styles.badge}>{pos}</span>
            ))}
          </div>
        </div>
        <div className={styles.projectMeta}>
          <div className={styles.metaItem}>
            <Image src="/calendar.svg" alt="Experience" width={16} height={16} />
            <span>{talent.experience} experience</span>
          </div>
          <div className={styles.metaItem}>
            <Image src="/education.svg" alt="Education" width={16} height={16} />
            <span>{talent.education}</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.badge} style={{ background: '#e4e5e8', color: '#18191c', fontWeight: 600 }}>{talent.expertiseLevel}</span>
          </div>
        </div>
        <div className={styles.tagList} style={{ marginTop: 8 }}>
          {talent.skills.map((skill) => (
            <span
              key={skill}
              className={styles.skillTag}
              style={selected ? { background: '#16a34a', color: '#fff', border: 'none' } : {}}
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
    <div className={styles.projectActions}>
      <button className={styles.detailsBtn}>→</button>
      <button
        className={styles.applyBtn + (selected ? ' ' + styles.selected : '')}
        onClick={e => {
          e.stopPropagation();
          onContact(talent);
        }}
      >
        Contact
      </button>
    </div>
  </div>
);

const TalentList: React.FC<TalentListProps> = ({ talents, onSelect, selectedId, onContact }) => (
  <div className={styles.projectList}>
    {talents.map((talent, index) => (
      <React.Fragment key={talent.id}>
        <TalentCard
          talent={talent}
          onSelect={onSelect}
          selected={selectedId === talent.id}
          onContact={onContact}
        />
        {index < talents.length - 1 && <div className={styles.projectDivider} />}
      </React.Fragment>
    ))}
  </div>
);

const TalentDescription: React.FC<TalentDescriptionProps & { onContact: (talent: Talent) => void }> = ({ talent, onContact }) => {
  if (!talent) return <aside className={styles.projectDescription} style={{ padding: 32, color: '#64748b' }}>Select a talent to see details</aside>;
  return (
    <aside className={styles.projectDescription}>
      <div className={styles.projectDescHeader}>
        <div className={styles.projectDescLogoWrapper} style={{ minWidth: 120, minHeight: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Image
            src={talent.avatar || "/profile_image.png"}
            alt={talent.name}
            width={120}
            height={120}
            className={styles.projectDescLogo}
            style={{ borderRadius: 50 }}
            onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/profile_image.png"; }}
          />
        </div>
        <div className={styles.projectDescTitleBlock}>
          <h2 className={styles.projectDescCompany}>{talent.name}</h2>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', margin: '8px 0' }}>
            {talent.positions.map((pos) => (
              <span key={pos} className={styles.badge}>{pos}</span>
            ))}
          </div>
        </div>
        <div className={styles.projectDescMetaRow}>
          <div className={styles.projectDescMetaItem}>
            <Image src="/calendar.svg" alt="Experience" width={18} height={18} />
            <span>{talent.experience} experience</span>
          </div>
          <div className={styles.projectDescMetaItem}>
            <Image src="/education.svg" alt="Education" width={18} height={18} />
            <span>{talent.education}</span>
          </div>
          <div className={styles.projectDescMetaItem}>
            <span className={styles.badge} style={{ background: '#e4e5e8', color: '#18191c', fontWeight: 600 }}>{talent.expertiseLevel}</span>
          </div>
        </div>
      </div>
      <div className={styles.projectDescBody}>
        <div className={styles.projectDescSection}>
          <h4 className={styles.projectDescSectionTitle}>Skills</h4>
          <div className={styles.tagList}>
            {talent.skills.map((skill) => (
              <span key={skill} className={styles.tag}>{skill}</span>
            ))}
          </div>
        </div>
        <div className={styles.projectDescSection}>
          <h4 className={styles.projectDescSectionTitle}>Bio</h4>
          <p className={styles.projectDescText}>{talent.bio}</p>
        </div>
        {talent.resume && (
          <div className={styles.projectDescSection}>
            <h4 className={styles.projectDescSectionTitle}>Resume</h4>
            <a href={talent.resume} target="_blank" rel="noopener noreferrer">Download Resume</a>
          </div>
        )}
      </div>
      <button
        className={styles.mainApplyBtn}
        onClick={() => onContact(talent)}
      >
        Contact
      </button>
    </aside>
  );
};

function filterTalents(
  talents: Talent[],
  selectedExperience: string[],
  selectedEducation: string[],
  selectedExpertise: string[],
  requiredSkills: string[]
) {
  return talents.filter(talent => {
    // Experience (years)
    const expMatch = selectedExperience.length === 0 || selectedExperience.includes(
      (() => {
        const years = parseInt(talent.experience);
        if (years < 1) return '< 1';
        if (years >= 1 && years <= 2) return '1-2';
        if (years >= 3 && years <= 5) return '3-5';
        if (years > 5) return '5+';
        return '';
      })()
    );
    // Education
    const eduMatch = selectedEducation.length === 0 || selectedEducation.includes(talent.education);
    // Expertise
    const expLevelMatch = selectedExpertise.length === 0 || selectedExpertise.includes(talent.expertiseLevel);
    // Required Skills (all must be present, case-insensitive)
    const skillsMatch = requiredSkills.length === 0 || requiredSkills.every(skill =>
      talent.skills.some(tskill => tskill.toLowerCase() === skill.toLowerCase())
    );
    return expMatch && eduMatch && expLevelMatch && skillsMatch;
  });
}

const FindTalentPage = () => {
  const [selectedTags, setSelectedTags] = useState<string[]>(["React", "Figma"]);
  const [selectedTalent, setSelectedTalent] = useState<Talent | null>(null);
  const [requiredSkills, setRequiredSkills] = useState<string[]>(["React", "Next.js", "Node.js", "Figma", "Docker"]);
  const [selectedExperience, setSelectedExperience] = useState<string[]>([...experienceOptions]);
  const [selectedEducation, setSelectedEducation] = useState<string[]>([...educationOptions]);
  const [selectedExpertise, setSelectedExpertise] = useState<string[]>([...expertiseOptions]);
  const [talents, setTalents] = useState<Talent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviteRecipientId, setInviteRecipientId] = useState<number | null>(null);
  const [inviteRecipientName, setInviteRecipientName] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:8080/api/profile/all")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch profiles");
        return res.json();
      })
      .then((data: BackendProfile[]) => {
        // Map backend profile to Talent interface
        const mapped: Talent[] = data.map((profile) => ({
          id: profile.id,
          name: profile.fullName || profile.email || "No Name",
          avatar: profile.profilePicture || "/profile_image.png",
          positions: profile.position ? [profile.position] : [],
          expertiseLevel: profile.expertise_level || profile.expertise || "",
          education: profile.education || "",
          skills: profile.technologies || [],
          experience: profile.experience_years === "ZERO_TO_ONE" ? "<1 y." :
            profile.experience_years === "ONE_TO_TWO" ? "1-2 y." :
            profile.experience_years === "THREE_TO_FIVE" ? "3-5 y." :
            profile.experience_years === "FIVE_PLUS" ? "5> y." : "",
          bio: profile.bio || "",
          resume: profile.resume,
        }));
        setTalents(mapped);
        setSelectedTalent(mapped[0] || null);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleRemoveTag = (tag: string) => {
    setSelectedTags((tags) => tags.filter((t) => t !== tag));
  };

  const handleAddTag = (tag: string) => {
    if (selectedTags.length >= 10) {
      toast.error("You can only add up to 10 tags.");
      return;
    }
    if (selectedTags.includes(tag)) {
      toast.error("This tag is already added.");
      return;
    }
    setSelectedTags((tags) => [...tags, tag]);
  };

  const handleRemoveSkill = (skill: string) => {
    setRequiredSkills((skills) => skills.filter((s) => s !== skill));
  };

  const handleAddSkill = (skill: string) => {
    if (requiredSkills.length >= 10) {
      toast.error("You can only add up to 10 skills.");
      return;
    }
    if (requiredSkills.includes(skill)) {
      toast.error("This skill is already added.");
      return;
    }
    setRequiredSkills((skills) => [...skills, skill]);
  };

  const handleClearFilters = () => {
    setSelectedExperience([]);
    setSelectedEducation([]);
    setSelectedExpertise([]);
    setRequiredSkills([]);
  };

  const filteredTalents = filterTalents(
    talents,
    selectedExperience,
    selectedEducation,
    selectedExpertise,
    requiredSkills
  );

  const handleOpenInviteModal = (talent: Talent) => {
    setInviteRecipientId(talent.id);
    setInviteRecipientName(talent.name);
    setInviteModalOpen(true);
  };

  const handleCloseInviteModal = () => setInviteModalOpen(false);

  if (loading) return <div className={styles.pageContainer}><div>Loading...</div></div>;
  if (error) return <div className={styles.pageContainer}><div>Error: {error}</div></div>;

  return (
    <div className={styles.pageContainer}>
      <SearchBar tags={selectedTags} onRemoveTag={handleRemoveTag} onAddTag={handleAddTag} />
      <div className={styles.mainContainer}>
        <FilterSidebar
          skills={requiredSkills}
          onAddSkill={handleAddSkill}
          onRemoveSkill={handleRemoveSkill}
          selectedExperience={selectedExperience}
          setSelectedExperience={setSelectedExperience}
          selectedEducation={selectedEducation}
          setSelectedEducation={setSelectedEducation}
          selectedExpertise={selectedExpertise}
          setSelectedExpertise={setSelectedExpertise}
          onClearFilters={handleClearFilters}
        />
        <main className={styles.mainContent}>
          <TalentList talents={filteredTalents} onSelect={setSelectedTalent} selectedId={selectedTalent?.id || null} onContact={handleOpenInviteModal} />
        </main>
        <TalentDescription talent={selectedTalent} onContact={handleOpenInviteModal} />
      </div>
      <InviteModal
        open={inviteModalOpen}
        onClose={handleCloseInviteModal}
        recipientId={inviteRecipientId}
        recipientName={inviteRecipientName}
        onSuccess={() => {}}
      />
      <ToastContainer aria-label="Notification messages" />
    </div>
  );
};

export default FindTalentPage;
