"use client";
import React, { useState } from 'react';
import styles from './page.module.css';
import Image from 'next/image';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface ProjectPosition {
  name: string;
  skills: string[];
}

interface Project {
  id: number;
  company: string;
  logo: string;
  description: string;
  requiredSkills: string[]; // for all positions
  teamSize: string;
  projectType: string;
  positions: ProjectPosition[];
  badge: string;
  badgeType: 'fullTime' | 'internship' | 'partTime' | 'remote' | 'contract' | 'temporary' | 'research';
  featured?: boolean;
  complexity: string;
}

interface SearchBarProps {
  tags: string[];
  onRemoveTag: (tag: string) => void;
  onAddTag: (tag: string) => void;
}

interface ProjectCardProps {
  project: Project;
  onSelect: (project: Project) => void;
  selected: boolean;
}

interface ProjectListProps {
  projects: Project[];
  onSelect: (project: Project) => void;
  selectedId: number | null;
}

interface ProjectDescriptionProps {
  project: Project | null;
}

interface FilterSidebarProps {
  skills: string[];
  onAddSkill: (skill: string) => void;
  onRemoveSkill: (skill: string) => void;
}

// Add filter options
const experienceOptions = ['Entry Level', 'Junior', 'Mid', 'Senior'];
const projectTypeOptions = ['Paid', 'Academic', 'Volunteer'];
const teamSizeOptions = ['1-3', '4-6', '7+'];
const employmentTypeOptions = [
  { label: 'Contract', value: 'contract' },
  { label: 'Full Time', value: 'fullTime' },
  { label: 'Part Time', value: 'partTime' },
  { label: 'Internship', value: 'internship' },
  { label: 'Research', value: 'research' },
];

const FilterSidebar: React.FC<FilterSidebarProps & {
  selectedExperience: string[];
  setSelectedExperience: (exp: string[]) => void;
  selectedProjectType: string[];
  setSelectedProjectType: (type: string[]) => void;
  selectedTeamSize: string[];
  setSelectedTeamSize: (size: string[]) => void;
  selectedEmploymentType: string[];
  setSelectedEmploymentType: (type: string[]) => void;
  onClearFilters: () => void;
}> = ({
  skills, onAddSkill, onRemoveSkill,
  selectedExperience, setSelectedExperience,
  selectedProjectType, setSelectedProjectType,
  selectedTeamSize, setSelectedTeamSize,
  selectedEmploymentType, setSelectedEmploymentType,
  onClearFilters
}) => {
  const [input, setInput] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const value = input.trim();
      if (value) {
        onAddSkill(value);
        setInput('');
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
        <h3>Experience Level</h3>
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
        <h3>Project Type</h3>
        <div className={styles.checkboxGroup}>
          {projectTypeOptions.map(type => (
            <label className={styles.checkboxLabel} key={type}>
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={selectedProjectType.includes(type)}
                onChange={() => handleCheckbox(type, selectedProjectType, setSelectedProjectType)}
              />
              <span className={styles.customCheckbox}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 8.5L7 11.5L12 5.5" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              {type}
            </label>
          ))}
        </div>
      </div>
      <div className={styles.filterSection}>
        <h3>Team Size</h3>
        <div className={styles.checkboxGroup}>
          {teamSizeOptions.map(size => (
            <label className={styles.checkboxLabel} key={size}>
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={selectedTeamSize.includes(size)}
                onChange={() => handleCheckbox(size, selectedTeamSize, setSelectedTeamSize)}
              />
              <span className={styles.customCheckbox}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 8.5L7 11.5L12 5.5" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              {size}
            </label>
          ))}
        </div>
      </div>
      <div className={styles.filterSection}>
        <h3>Employment Type</h3>
        <div className={styles.checkboxGroup}>
          {employmentTypeOptions.map(opt => (
            <label className={styles.checkboxLabel} key={opt.value}>
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={selectedEmploymentType.includes(opt.value)}
                onChange={() => handleCheckbox(opt.value, selectedEmploymentType, setSelectedEmploymentType)}
              />
              <span className={styles.customCheckbox}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 8.5L7 11.5L12 5.5" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              {opt.label}
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
  const [input, setInput] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const value = input.trim();
      if (value) {
        onAddTag(value);
        setInput('');
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

const mockProjects: Project[] = [
  {
    id: 1,
    company: 'Google',
    logo: '/company_logo.svg',
    description: 'Support Google products and help users solve technical issues.',
    requiredSkills: ['Customer Service', 'Troubleshooting', 'Communication'],
    teamSize: '4-6',
    projectType: 'Paid',
    positions: [
      { name: 'Support Engineer', skills: ['Customer Service', 'Troubleshooting'] },
      { name: 'QA Tester', skills: ['Communication'] },
    ],
    badge: 'Full Time',
    badgeType: 'fullTime',
    complexity: 'Entry Level',
  },
  {
    id: 2,
    company: 'Youtube',
    logo: '/company_logo.svg',
    description: 'Design user interfaces and experiences for Youtube apps.',
    requiredSkills: ['Figma', 'UX Research', 'Prototyping'],
    teamSize: '7+',
    projectType: 'Academic',
    positions: [
      { name: 'UI Designer', skills: ['Figma', 'Prototyping'] },
      { name: 'UX Researcher', skills: ['UX Research'] },
    ],
    badge: 'Full Time',
    badgeType: 'fullTime',
    complexity: 'Junior',
  },
  {
    id: 3,
    company: 'Reddit',
    logo: '/company_logo.svg',
    description: 'Develop and maintain Reddit front-end features.',
    requiredSkills: ['React', 'TypeScript', 'CSS'],
    teamSize: '1-3',
    projectType: 'Volunteer',
    positions: [
      { name: 'Frontend Dev', skills: ['React', 'TypeScript', 'CSS'] },
    ],
    badge: 'Internship',
    badgeType: 'internship',
    complexity: 'Entry Level',
  },
  {
    id: 4,
    company: 'Freepik',
    logo: '/company_logo.svg',
    description: 'Lead marketing campaigns for Freepik.',
    requiredSkills: ['SEO', 'Content Creation', 'Analytics'],
    teamSize: '4-6',
    projectType: 'Paid',
    positions: [
      { name: 'Marketing Lead', skills: ['SEO', 'Analytics'] },
      { name: 'Content Writer', skills: ['Content Creation'] },
    ],
    badge: 'Full Time',
    badgeType: 'fullTime',
    complexity: 'Mid',
  },
  {
    id: 5,
    company: 'Instagram',
    logo: '/company_logo.svg',
    description: 'Maintain and optimize Instagram network infrastructure.',
    requiredSkills: ['Networking', 'Python', 'Linux'],
    teamSize: '7+',
    projectType: 'Paid',
    positions: [
      { name: 'Network Engineer', skills: ['Networking', 'Python', 'Linux'] },
    ],
    badge: 'Full Time',
    badgeType: 'fullTime',
    complexity: 'Senior',
  },
  {
    id: 6,
    company: 'Slack',
    logo: '/company_logo.svg',
    description: 'Design advanced user experiences for Slack.',
    requiredSkills: ['UX', 'Wireframing', 'User Testing'],
    teamSize: '4-6',
    projectType: 'Academic',
    positions: [
      { name: 'UX Designer', skills: ['UX', 'User Testing'] },
      { name: 'Product Owner', skills: ['Wireframing'] },
    ],
    badge: 'Full Time',
    badgeType: 'fullTime',
    featured: true,
    complexity: 'Mid',
  },
  {
    id: 7,
    company: 'Facebook',
    logo: '/company_logo.svg',
    description: 'Create graphics for Facebook marketing.',
    requiredSkills: ['Photoshop', 'Illustrator', 'Creativity'],
    teamSize: '1-3',
    projectType: 'Volunteer',
    positions: [
      { name: 'Graphic Designer', skills: ['Photoshop', 'Illustrator', 'Creativity'] },
    ],
    badge: 'Full Time',
    badgeType: 'fullTime',
    complexity: 'Entry Level',
  },
  {
    id: 8,
    company: 'Twitter',
    logo: '/company_logo.svg',
    description: 'Design new product features for Twitter.',
    requiredSkills: ['Product Design', 'Sketch', 'Collaboration'],
    teamSize: '7+',
    projectType: 'Paid',
    positions: [
      { name: 'Product Designer', skills: ['Product Design', 'Collaboration'] },
      { name: 'UI Designer', skills: ['Sketch'] },
    ],
    badge: 'Full Time',
    badgeType: 'fullTime',
    complexity: 'Senior',
  },
  {
    id: 9,
    company: 'Udemy',
    logo: '/company_logo.svg',
    description: 'Manage Udemy course development projects.',
    requiredSkills: ['Project Management', 'Agile', 'Scrum'],
    teamSize: '4-6',
    projectType: 'Paid',
    positions: [
      { name: 'Project Manager', skills: ['Project Management', 'Agile', 'Scrum'] },
    ],
    badge: 'Full Time',
    badgeType: 'fullTime',
    complexity: 'Mid',
  },
  {
    id: 10,
    company: 'Microsoft',
    logo: '/company_logo.svg',
    description: 'Lead marketing for Microsoft products.',
    requiredSkills: ['Marketing', 'Strategy', 'Leadership'],
    teamSize: '7+',
    projectType: 'Paid',
    positions: [
      { name: 'Marketing Manager', skills: ['Marketing', 'Strategy', 'Leadership'] },
    ],
    badge: 'Temporary',
    badgeType: 'temporary',
    complexity: 'Senior',
  },
  {
    id: 11,
    company: 'Apple',
    logo: '/company_logo.svg',
    description: 'Design visuals for Apple campaigns.',
    requiredSkills: ['Design', 'Branding', 'Creativity'],
    teamSize: '1-3',
    projectType: 'Academic',
    positions: [
      { name: 'Visual Designer', skills: ['Design', 'Branding', 'Creativity'] },
    ],
    badge: 'Part Time',
    badgeType: 'partTime',
    complexity: 'Junior',
  },
  {
    id: 12,
    company: 'Figma',
    logo: '/company_logo.svg',
    description: 'Create interactive prototypes for Figma.',
    requiredSkills: ['Prototyping', 'Figma', 'UX'],
    teamSize: '4-6',
    projectType: 'Volunteer',
    positions: [
      { name: 'Interaction Designer', skills: ['Prototyping', 'Figma', 'UX'] },
    ],
    badge: 'Remote',
    badgeType: 'remote',
    complexity: 'Entry Level',
  },
  {
    id: 13,
    company: 'Upwork',
    logo: '/company_logo.svg',
    description: 'Lead UX for Upwork platform.',
    requiredSkills: ['UX', 'Leadership', 'Research'],
    teamSize: '7+',
    projectType: 'Paid',
    positions: [
      { name: 'UX Designer', skills: ['UX', 'Research'] },
      { name: 'Team Lead', skills: ['Leadership'] },
    ],
    badge: 'Contract Base',
    badgeType: 'contract',
    complexity: 'Senior',
  },
];

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onSelect, selected }) => (
  <div className={`${styles.projectCard} ${selected ? styles.selected : ''} ${project.featured ? styles.featured : ''}`}
       onClick={() => onSelect(project)}>
    <div className={styles.projectInfo}>
      <div className={styles.companyLogoWrapper}>
        <Image src={project.logo} alt={project.company + ' logo'} width={40} height={40} />
      </div>
      <div className={styles.projectDetails}>
        <div className={styles.projectHeader}>
          <h3 className={styles.projectTitle}>{project.company}</h3>
          <span className={`${styles.badge} ${styles[project.badgeType]}`}>{project.badge}</span>
          <span className={styles.badge} style={{ background: '#e4e5e8', color: '#18191c', fontWeight: 600, marginLeft: 8, marginTop: 6 }}>{project.complexity}</span>
        </div>
        <div className={styles.projectMeta}>
          <div className={styles.metaItem}>
            <span>Type: {project.projectType}</span>
          </div>
          <div className={styles.metaItem}>
            <span>Team Size: {project.teamSize}</span>
          </div>
        </div>
        <div className={styles.tagList} style={{ marginTop: 8 }}>
          {project.requiredSkills.map(skill => (
            <span
              key={skill}
              className={selected ? `${styles.skillTag} ${styles.selected}` : styles.skillTag}
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
        Apply Now
      </button>
    </div>
  </div>
);

const ProjectList: React.FC<ProjectListProps> = ({ projects, onSelect, selectedId }) => (
  <div className={styles.projectList}>
    {projects.map((project, index) => (
      <React.Fragment key={project.id}>
        <ProjectCard
          project={project}
          onSelect={onSelect}
          selected={selectedId === project.id}
        />
        {index < projects.length - 1 && <div className={styles.projectDivider} />}
      </React.Fragment>
    ))}
  </div>
);

const ProjectDescription: React.FC<ProjectDescriptionProps> = ({ project }) => {
  const [selectedPosition, setSelectedPosition] = useState<string | null>(project?.positions[0]?.name || null);

  if (!project) return null;

  // Find the selected position object
  const selectedPositionObj = project.positions.find(pos => pos.name === selectedPosition);

  return (
    <aside className={styles.projectDescription}>
      <div className={styles.projectDescHeader}>
        <div className={styles.projectDescLogoWrapper}>
          {project.logo && (
            <Image src={project.logo} alt={project.company + ' logo'} width={80} height={80} className={styles.projectDescLogo} />
          )}
        </div>
        <div className={styles.projectDescTitleBlock}>
          <h2 className={styles.projectDescCompany}>{project.company}</h2>
          <span className={styles.badge} style={{ background: '#e4e5e8', color: '#18191c', fontWeight: 600, marginLeft: 8, marginTop: 6 }}>{project.complexity}</span>
        </div>
        <div className={styles.projectDescMetaRow}>
          <div className={styles.projectDescMetaItem}>
            <span>Type: {project.projectType}</span>
          </div>
          <div className={styles.projectDescMetaItem}>
            <span>Team Size: {project.teamSize}</span>
          </div>
        </div>
      </div>
      <div className={styles.projectDescBody}>
        <p className={styles.projectDescText}>{project.description} This project offers a unique opportunity to work with a dynamic team, tackle real-world challenges, and develop your skills in a collaborative environment. You will gain hands-on experience, contribute to impactful solutions, and expand your professional network. Join us to make a difference and accelerate your career growth!</p>
        <div className={styles.projectDescSection}>
          <h4 className={styles.projectDescSectionTitle}>Required Skills</h4>
          <div className={styles.tagList}>
            {selectedPositionObj
              ? selectedPositionObj.skills.map(tech => (
                  <span key={tech} className={styles.tag}>{tech}</span>
                ))
              : project.requiredSkills.map(tech => (
                  <span key={tech} className={styles.tag}>{tech}</span>
                ))}
          </div>
        </div>
        <div className={styles.projectDescSection}>
          <h4 className={styles.projectDescSectionTitle}>Available Positions</h4>
          <div className={styles.tagList}>
            {project.positions.map(role => (
              <span
                key={role.name}
                className={selectedPosition === role.name ? styles.tag : styles.positionTag}
                onClick={() => setSelectedPosition(role.name)}
                style={{ cursor: 'pointer', transition: 'all 0.2s' }}
              >
                {role.name}
              </span>
            ))}
          </div>
        </div>
      </div>
      <button className={styles.mainApplyBtn} onClick={() => {
        toast.success(`Application was successfully sent for ${selectedPosition} position`);
      }}>
        Apply Now
      </button>
    </aside>
  );
};

// Filtering function for projects
function filterProjects(
  projects: Project[],
  selectedExperience: string[],
  selectedProjectType: string[],
  selectedTeamSize: string[],
  requiredSkills: string[],
  selectedEmploymentType: string[]
) {
  return projects.filter(project => {
    // Experience Level
    const expMatch = selectedExperience.length === 0 || selectedExperience.includes(project.complexity);
    // Project Type
    const typeMatch = selectedProjectType.length === 0 || selectedProjectType.includes(project.projectType);
    // Team Size
    const teamMatch = selectedTeamSize.length === 0 || selectedTeamSize.includes(project.teamSize);
    // Required Skills (all must be present, case-insensitive)
    const skillsMatch = requiredSkills.length === 0 || requiredSkills.every(skill =>
      project.requiredSkills.some(pskill => pskill.toLowerCase() === skill.toLowerCase())
    );
    // Employment Type
    const employmentMatch = selectedEmploymentType.length === 0 || selectedEmploymentType.includes(project.badgeType);
    return expMatch && typeMatch && teamMatch && skillsMatch && employmentMatch;
  });
}

const FindProjectPage = () => {
  const [selectedTags, setSelectedTags] = useState(['Frontend Dev', 'Sys Admin', 'Backend Dev', 'DB Admin']);
  const [selectedProject, setSelectedProject] = useState<Project | null>(mockProjects[5]);
  const [requiredSkills, setRequiredSkills] = useState([
    'Angular', 'React', 'Vue', 'PostgreSQL', 'Docker', 'Figma', 'Git', 'Svelte', 'Python',
  ]);
  const [selectedExperience, setSelectedExperience] = useState<string[]>([...experienceOptions]);
  const [selectedProjectType, setSelectedProjectType] = useState<string[]>([...projectTypeOptions]);
  const [selectedTeamSize, setSelectedTeamSize] = useState<string[]>([...teamSizeOptions]);
  const [selectedEmploymentType, setSelectedEmploymentType] = useState<string[]>([]);

  const handleRemoveTag = (tag: string) => {
    setSelectedTags(tags => tags.filter(t => t !== tag));
  };

  const handleAddTag = (tag: string) => {
    if (selectedTags.length >= 10) {
      toast.error('You can only add up to 10 tags.');
      return;
    }
    if (selectedTags.includes(tag)) {
      toast.error('This tag is already added.');
      return;
    }
    setSelectedTags(tags => [...tags, tag]);
  };

  const handleRemoveSkill = (skill: string) => {
    setRequiredSkills(skills => skills.filter(s => s !== skill));
  };

  const handleAddSkill = (skill: string) => {
    if (requiredSkills.length >= 10) {
      toast.error('You can only add up to 10 skills.');
      return;
    }
    if (requiredSkills.includes(skill)) {
      toast.error('This skill is already added.');
      return;
    }
    setRequiredSkills(skills => [...skills, skill]);
  };

  const handleClearFilters = () => {
    setSelectedExperience([]);
    setSelectedProjectType([]);
    setSelectedTeamSize([]);
    setRequiredSkills([]);
    setSelectedEmploymentType([]);
  };

  const filteredProjects = filterProjects(
    mockProjects,
    selectedExperience,
    selectedProjectType,
    selectedTeamSize,
    requiredSkills,
    selectedEmploymentType
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
          selectedProjectType={selectedProjectType}
          setSelectedProjectType={setSelectedProjectType}
          selectedTeamSize={selectedTeamSize}
          setSelectedTeamSize={setSelectedTeamSize}
          selectedEmploymentType={selectedEmploymentType}
          setSelectedEmploymentType={setSelectedEmploymentType}
          onClearFilters={handleClearFilters}
        />
        <main className={styles.mainContent}>
          <ProjectList
            projects={filteredProjects}
            onSelect={setSelectedProject}
            selectedId={selectedProject?.id || null}
          />
        </main>
        <ProjectDescription project={selectedProject} />
      </div>
      <ToastContainer />
    </div>
  );
};

export default FindProjectPage;
