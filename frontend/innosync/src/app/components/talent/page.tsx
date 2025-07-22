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
      if (!token) {
        console.error('❌ FETCH PROJECTS: No authentication token found');
        toast.error('You are not logged in');
        setProjects([]);
        setLoadingProjects(false);
        return;
      }

      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/me`, {
        headers: { "Authorization": `Bearer ${token}` }
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
      if (!token) {
        console.error('❌ FETCH ROLES: No authentication token found');
        toast.error('You are not logged in');
        setRoles([]);
        setLoadingRoles(false);
        return;
      }

      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/${selectedProject}/roles`, {
        headers: { "Authorization": `Bearer ${token}` }
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

    const token = getToken();
    if (!token) {
      console.error('❌ SEND INVITATION: No authentication token found');
      toast.error('You are not logged in');
      return;
    }

    setSending(true);
    const payload = { projectRoleId: Number(selectedRole), recipientId };
    console.log("Sending invitation:", payload);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/invitations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
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
      display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Montserrat, sans-serif'
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 16,
        padding: 32,
        minWidth: 340,
        maxWidth: 420,
        boxShadow: '0 4px 32px rgba(0,0,0,0.12)',
        fontFamily: 'Montserrat, sans-serif',
        color: '#171717',
        border: '1.5px solid #e4e5e8',
        display: 'flex',
        flexDirection: 'column',
        gap: 18
      }}>
        <h2 style={{ marginBottom: 18, fontWeight: 600, fontSize: 24, color: '#171717', fontFamily: 'Montserrat, sans-serif' }}>Invite {recipientName || "Talent"}</h2>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 6, fontWeight: 500, fontSize: 15 }}>Select Project</label>
          {loadingProjects ? <div style={{ color: '#636a80', fontSize: 15 }}>Loading projects...</div> : (
            <select
              value={selectedProject}
              onChange={e => setSelectedProject(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1.5px solid #e4e5e8', fontFamily: 'Montserrat, sans-serif', fontSize: 15, color: '#171717', background: '#f2f4f8' }}
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
          <label style={{ display: 'block', marginBottom: 6, fontWeight: 500, fontSize: 15 }}>Select Role</label>
          {loadingRoles ? <div style={{ color: '#636a80', fontSize: 15 }}>Loading roles...</div> : (
            <select
              value={selectedRole}
              onChange={e => setSelectedRole(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1.5px solid #e4e5e8', fontFamily: 'Montserrat, sans-serif', fontSize: 15, color: '#171717', background: '#f2f4f8' }}
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
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <button onClick={onClose} style={{ padding: '9px 20px', background: '#e4e5e8', color: '#171717', border: 'none', borderRadius: 6, fontFamily: 'Montserrat, sans-serif', fontWeight: 500, fontSize: 15, cursor: 'pointer' }}>Cancel</button>
          <button
            onClick={handleSend}
            style={{ padding: '9px 20px', background: '#298217', color: '#fff', border: 'none', borderRadius: 6, fontFamily: 'Montserrat, sans-serif', fontWeight: 600, fontSize: 15, cursor: !selectedRole || sending ? 'not-allowed' : 'pointer', opacity: !selectedRole || sending ? 0.7 : 1 }}
            disabled={!selectedRole || sending}
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
        <div className={styles.detailBadgesFigma}>
          <span className={styles.detailBadge} style={{display: 'flex', alignItems: 'center', gap: 8}}>
            <Image src="/verified.svg" alt="verified icon" width={24} height={24} style={{marginRight: 4}} />
            {talent.expertiseLevel}
          </span>
          <span className={styles.detailBadge} style={{display: 'flex', alignItems: 'center', gap: 8}}>
            <Image src="/education.svg" alt="education icon" width={20} height={20} style={{marginRight: 4}} />
            {talent.education}
          </span>
          <span className={styles.detailBadge} style={{display: 'flex', alignItems: 'center', gap: 8}}>
            <Image src="/stars.svg" alt="experience icon" width={24} height={24} style={{marginRight: 4}} />
            {talent.experience} experience
          </span>
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

const TalentList: React.FC<TalentListProps & { allTalents: Talent[] }> = ({ talents, onSelect, selectedId, onContact, allTalents }) => {
  if (talents.length === 0) {
    // Check if this is a "no talents at all" situation or "no talents match filters"
    const isNoTalentsPosted = allTalents.length === 0;

    return (
      <div className={styles.projectList}>
        <div className={styles.emptyState}>
          <div className={styles.emptyStateIcon}>
            {isNoTalentsPosted ? (
              // Icon for no talents posted
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="#9CA3AF"/>
              </svg>
            ) : (
              // Icon for filtered results
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 16V8C21 6.89543 20.1046 6 19 6H5C3.89543 6 3 6.89543 3 8V16C3 17.1046 3.89543 18 5 18H19C20.1046 18 21 17.1046 21 16Z" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7 12H17" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7 9H12" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </div>
          <h3 className={styles.emptyStateTitle}>
            {isNoTalentsPosted ? 'No Talents Available' : 'No Talents Found'}
          </h3>
          <p className={styles.emptyStateDescription}>
            {isNoTalentsPosted
              ? 'There are currently no talents available for you on the platform.'
              : 'We couldn\'t find any talents matching your current filters. Try adjusting your search criteria or clearing filters to see more talent profiles.'
            }
          </p>
          <div className={styles.emptyStateSuggestions}>
            <p className={styles.suggestionText}>
              {isNoTalentsPosted ? 'What you can do:' : 'Try:'}
            </p>
            <ul className={styles.suggestionList}>
              {isNoTalentsPosted ? (
                <>
                  <li>Make sure that you are logged in</li>
                  <li>Check back later for new talent profiles</li>
                  <li>Post your project to attract talent</li>
                </>
              ) : (
                <>
                  <li>Removing some skill requirements</li>
                  <li>Expanding experience level criteria</li>
                  <li>Clearing all filters</li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
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
};

const TalentDescription: React.FC<TalentDescriptionProps & { onContact: (talent: Talent) => void }> = ({ talent, onContact }) => {
  if (!talent) return null;
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
        <div className={styles.profileBadges} style={{ display: 'flex', flexDirection: 'row', gap: 16, justifyContent: 'center', margin: '16px 0' }}>
          <span className={styles.detailBadge} style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f5f5f5', color: '#6C7278', borderRadius: 20, padding: '4px 16px', fontWeight: 500, fontSize: 15 }}>
            <Image src="/verified.svg" alt="verified icon" width={24} height={24} style={{ marginRight: 4 }} />
            {talent.expertiseLevel}
          </span>
          <span className={styles.detailBadge} style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f5f5f5', color: '#6C7278', borderRadius: 20, padding: '4px 16px', fontWeight: 500, fontSize: 15 }}>
            <Image src="/education.svg" alt="education icon" width={20} height={20} style={{ marginRight: 4 }} />
            {talent.education}
          </span>
          <span className={styles.detailBadge} style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f5f5f5', color: '#6C7278', borderRadius: 20, padding: '4px 16px', fontWeight: 500, fontSize: 15 }}>
            <Image src="/stars.svg" alt="experience icon" width={24} height={24} style={{ marginRight: 4 }} />
            {talent.experience} experience
          </span>
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
          <p className={styles.projectDescText} style={{ wordWrap: 'break-word', overflowWrap: 'break-word', whiteSpace: 'pre-wrap' }}>{talent.bio}</p>
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
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedTalent, setSelectedTalent] = useState<Talent | null>(null);
  const [requiredSkills, setRequiredSkills] = useState<string[]>([]);
  const [selectedExperience, setSelectedExperience] = useState<string[]>([]);
  const [selectedEducation, setSelectedEducation] = useState<string[]>([]);
  const [selectedExpertise, setSelectedExpertise] = useState<string[]>([]);
  const [talents, setTalents] = useState<Talent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviteRecipientId, setInviteRecipientId] = useState<number | null>(null);
  const [inviteRecipientName, setInviteRecipientName] = useState<string | null>(null);

  // Function to fetch talents from API
  const fetchTalents = async (): Promise<Talent[]> => {
    console.log('🔄 FETCH TALENTS: Starting to fetch talents from API...');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profile/all`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error(`❌ FETCH TALENTS: API request failed with status ${response.status}: ${response.statusText}`);
        throw new Error(`Failed to fetch talents: ${response.status} ${response.statusText}`);
      }

      const data: BackendProfile[] = await response.json();
      console.log('✅ FETCH TALENTS: Successfully fetched talents data:', data);

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

      console.log('✅ FETCH TALENTS: Successfully transformed talents:', mapped);
      toast.success(`Successfully loaded ${mapped.length} talents`);
      return mapped;
    } catch (error) {
      console.error('❌ FETCH TALENTS: Error occurred:', error);
      toast.error('Failed to load talents');
      console.log('🔄 FETCH TALENTS: Returning example data');

      // Return example data when API fails or returns empty
      return [
        {
          id: 1,
          name: "Ahmed Baha Eddine Alimi",
          avatar: "https://i.pravatar.cc/150?img=1",
          positions: ["ML Engineer", "Data Scientist"],
          expertiseLevel: "Expert",
          education: "Bachelor",
          skills: ["Python", "TensorFlow", "Docker", "React", "Machine Learning"],
          experience: "3-5 y.",
          bio: "Passionate ML engineer with expertise in deep learning and computer vision. Experienced in building scalable machine learning systems and deploying models to production. Strong background in Python, TensorFlow, and cloud technologies.",
          resume: null
        },
        {
          id: 2,
          name: "Rick Sanchez",
          avatar: "https://i.pravatar.cc/150?img=2",
          positions: ["Frontend Developer", "UI/UX Designer"],
          expertiseLevel: "Senior",
          education: "Master",
          skills: ["React", "TypeScript", "Vue.js", "CSS", "Figma"],
          experience: "5> y.",
          bio: "Senior frontend developer with extensive experience in modern web technologies. Specialized in creating responsive and user-friendly interfaces. Expert in React ecosystem and design systems.",
          resume: null
        },
        {
          id: 3,
          name: "Maria Volkov",
          avatar: "https://i.pravatar.cc/150?img=3",
          positions: ["Backend Developer", "DevOps Engineer"],
          expertiseLevel: "Mid",
          education: "Bachelor",
          skills: ["Node.js", "PostgreSQL", "AWS", "Docker", "Kubernetes"],
          experience: "1-2 y.",
          bio: "Backend developer with strong focus on scalable architecture and cloud deployment. Experienced in building RESTful APIs and microservices. Passionate about DevOps practices and automation.",
          resume: null
        },
        {
          id: 4,
          name: "Alex Petrov",
          avatar: "https://i.pravatar.cc/150?img=4",
          positions: ["Full Stack Developer", "System Architect"],
          expertiseLevel: "Expert",
          education: "PhD",
          skills: ["Java", "Spring Boot", "React", "MongoDB", "Kafka"],
          experience: "5> y.",
          bio: "Full stack developer and system architect with PhD in Computer Science. Expert in building complex distributed systems and microservices architecture. Strong background in Java ecosystem and modern frontend technologies.",
          resume: null
        },
        {
          id: 5,
          name: "Sofia Chen",
          avatar: "https://i.pravatar.cc/150?img=5",
          positions: ["Data Scientist", "ML Engineer"],
          expertiseLevel: "Senior",
          education: "Master",
          skills: ["Python", "PyTorch", "SQL", "Pandas", "Scikit-learn"],
          experience: "3-5 y.",
          bio: "Data scientist specializing in machine learning and statistical analysis. Experienced in developing predictive models and data pipelines. Strong background in Python data science ecosystem and big data technologies.",
          resume: null
        },
        {
          id: 6,
          name: "David Kim",
          avatar: "https://i.pravatar.cc/150?img=6",
          positions: ["Mobile Developer", "iOS Developer"],
          expertiseLevel: "Mid",
          education: "Bachelor",
          skills: ["Swift", "iOS", "React Native", "Firebase", "Git"],
          experience: "1-2 y.",
          bio: "Mobile developer focused on iOS development with React Native experience. Passionate about creating smooth user experiences and native mobile applications. Strong understanding of mobile app architecture and performance optimization.",
          resume: null
        },
        {
          id: 7,
          name: "Elena Rodriguez",
          avatar: "https://i.pravatar.cc/150?img=7",
          positions: ["QA Engineer", "Test Automation Engineer"],
          expertiseLevel: "Junior",
          education: "Bachelor",
          skills: ["Selenium", "JUnit", "Cypress", "Postman", "Jenkins"],
          experience: "<1 y.",
          bio: "QA engineer with focus on test automation and quality assurance. Experienced in setting up CI/CD pipelines and implementing comprehensive testing strategies. Passionate about ensuring software quality and reliability.",
          resume: null
        },
        {
          id: 8,
          name: "Michael Johnson",
          avatar: "https://i.pravatar.cc/150?img=8",
          positions: ["DevOps Engineer", "Cloud Architect"],
          expertiseLevel: "Expert",
          education: "Master",
          skills: ["AWS", "Terraform", "Kubernetes", "Jenkins", "Linux"],
          experience: "5> y.",
          bio: "DevOps engineer and cloud architect with extensive experience in infrastructure automation and cloud technologies. Expert in designing scalable cloud solutions and implementing CI/CD pipelines. Strong background in AWS and containerization technologies.",
          resume: null
        }
      ];
    }
  };

  useEffect(() => {
    const loadTalents = async () => {
      setLoading(true);
      const fetchedTalents = await fetchTalents();
      setTalents(fetchedTalents);
      if (fetchedTalents.length > 0) {
        setSelectedTalent(fetchedTalents[0]);
      }
      setLoading(false);
    };

    loadTalents();
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
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      console.log('❌ OPEN INVITE MODAL: No authentication token found');
      toast.error('Please log in to contact talents');
      // Optionally redirect to login page
      // window.location.href = '/authentication/login';
      return;
    }

    setInviteRecipientId(talent.id);
    setInviteRecipientName(talent.name);
    setInviteModalOpen(true);
  };

  const handleCloseInviteModal = () => setInviteModalOpen(false);

  if (loading) return <div className={styles.pageContainer}><div>Loading...</div></div>;

  return (
    <div className={styles.pageContainer}>
      <SearchBar tags={selectedTags} onRemoveTag={handleRemoveTag} onAddTag={handleAddTag} />
      <div className={filteredTalents.length === 0 ? styles.mainContainerNoProjects : styles.mainContainer}>
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
          <TalentList talents={filteredTalents} onSelect={setSelectedTalent} selectedId={selectedTalent?.id || null} onContact={handleOpenInviteModal} allTalents={talents} />
        </main>
        {filteredTalents.length > 0 && (
          <TalentDescription talent={selectedTalent} onContact={handleOpenInviteModal} />
        )}
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
