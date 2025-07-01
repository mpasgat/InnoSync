"use client";
import React, { useState } from "react";
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
}

interface TalentListProps {
  talents: Talent[];
  onSelect: (talent: Talent) => void;
  selectedId: number | null;
}

interface TalentDescriptionProps {
  talent: Talent | null;
}

interface FilterSidebarProps {
  skills: string[];
  onAddSkill: (skill: string) => void;
  onRemoveSkill: (skill: string) => void;
}

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

const mockTalents: Talent[] = [
  {
    id: 1,
    name: "Ahmed Baha Eddine Alimi",
    avatar: "/profile_image.png",
    positions: ["Frontend Dev", "UI/UX Designer", "Full Stack Dev"],
    expertiseLevel: "Senior",
    education: "Bachelor",
    skills: ["React", "Next.js", "TypeScript", "Figma"],
    experience: "2 years",
    bio: "Computer Science student at Innopolis University. Passionate about web and mobile development, hackathons, and learning new technologies.",
  },
  {
    id: 2,
    name: "Jane Doe",
    avatar: "/profile_image.png",
    positions: ["Backend Dev"],
    expertiseLevel: "Mid",
    education: "Master",
    skills: ["Node.js", "Express", "MongoDB", "Docker"],
    experience: "3 years",
    bio: "Backend developer with a strong background in scalable server-side applications and cloud infrastructure.",
  },
  {
    id: 3,
    name: "John Smith",
    avatar: "/profile_image.png",
    positions: ["Designer"],
    expertiseLevel: "Senior",
    education: "PhD",
    skills: ["Figma", "Sketch", "Adobe XD", "UI/UX"],
    experience: "4 years",
    bio: "UI/UX designer with a keen eye for detail and a passion for creating intuitive user experiences.",
  },
  {
    id: 4,
    name: "Maria Ivanova",
    avatar: "/profile_image.png",
    positions: ["Sys Admin"],
    expertiseLevel: "Expert",
    education: "No Degree",
    skills: ["Linux", "AWS", "Docker", "Networking"],
    experience: "5 years",
    bio: "Experienced system administrator specializing in cloud infrastructure and network security.",
  },
  {
    id: 5,
    name: "Alex Lee",
    avatar: "/profile_image.png",
    positions: ["DB Admin", "Backend Dev"],
    expertiseLevel: "Junior",
    education: "Bachelor",
    skills: ["PostgreSQL", "MySQL", "Database Design", "Python"],
    experience: "3 years",
    bio: "Database administrator with expertise in relational databases and data modeling.",
  },
];

const TalentCard: React.FC<TalentCardProps> = ({ talent, onSelect, selected }) => (
  <div className={`${styles.projectCard} ${selected ? styles.selected : ""}`}
    onClick={() => onSelect(talent)}
    style={{ borderColor: selected ? "#16a34a" : undefined }}
  >
    <div className={styles.projectInfo}>
      <div className={styles.companyLogoWrapper}>
        <Image src={talent.avatar} alt={talent.name} width={60} height={60} style={{ borderRadius: 50 }} />
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
      <button className={styles.applyBtn + (selected ? ' ' + styles.selected : '')}>
        Contact
      </button>
    </div>
  </div>
);

const TalentList: React.FC<TalentListProps> = ({ talents, onSelect, selectedId }) => (
  <div className={styles.projectList}>
    {talents.map((talent, index) => (
      <React.Fragment key={talent.id}>
        <TalentCard
          talent={talent}
          onSelect={onSelect}
          selected={selectedId === talent.id}
        />
        {index < talents.length - 1 && <div className={styles.projectDivider} />}
      </React.Fragment>
    ))}
  </div>
);

const TalentDescription: React.FC<TalentDescriptionProps> = ({ talent }) => {
  if (!talent) return <aside className={styles.projectDescription} style={{ padding: 32, color: '#64748b' }}>Select a talent to see details</aside>;
  return (
    <aside className={styles.projectDescription}>
      <div className={styles.projectDescHeader}>
        <div className={styles.projectDescLogoWrapper} style={{ minWidth: 120, minHeight: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Image src={talent.avatar} alt={talent.name} width={120} height={120} className={styles.projectDescLogo} style={{ borderRadius: 50 }} />
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
      </div>
      <button className={styles.mainApplyBtn} onClick={() => toast.success(`Contact request sent to ${talent.name}`)}>
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
  const [selectedTalent, setSelectedTalent] = useState<Talent | null>(mockTalents[0]);
  const [requiredSkills, setRequiredSkills] = useState<string[]>(["React", "Next.js", "Node.js", "Figma", "Docker"]);
  const [selectedExperience, setSelectedExperience] = useState<string[]>([...experienceOptions]);
  const [selectedEducation, setSelectedEducation] = useState<string[]>([...educationOptions]);
  const [selectedExpertise, setSelectedExpertise] = useState<string[]>([...expertiseOptions]);

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
    mockTalents,
    selectedExperience,
    selectedEducation,
    selectedExpertise,
    requiredSkills
  );

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
          <TalentList talents={filteredTalents} onSelect={setSelectedTalent} selectedId={selectedTalent?.id || null} />
        </main>
        <TalentDescription talent={selectedTalent} />
      </div>
      <ToastContainer aria-label="Notification messages" />
    </div>
  );
};

export default FindTalentPage;
