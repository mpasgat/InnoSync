"use client";
import React, { useState } from 'react';
import styles from './page.module.css';
import Image from 'next/image';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface ProjectPosition {
  name: string;
  skills: string[];
  roleId?: number;
  expertiseLevel?: string; // e.g. ENTRY, MID, SENIOR etc.
}

// API Response interface
interface ApiProjectRole {
  roleId: number;
  roleName: string;
  projectId: number;
  projectTitle: string;
  projectDescription: string;
  expertiseLevel?: string;
}

interface UserApplication {
  id: number;
  projectRoleId: number;
  status: string;
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
  // Add new fields for API integration
  roleId?: number;
  originalTitle?: string;
  roleIdMap?: Record<string, number>;
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
  allProjects: Project[];
}

interface ProjectDescriptionProps {
  project: Project | null;
  /**
   * Set of roleIds that the current user has already applied to. Used to disable the Apply button
   * when the chosen position was already applied for.
   */
  appliedRoleIds: Set<number>;
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
      { name: 'Support Engineer', skills: ['Customer Service', 'Troubleshooting'], expertiseLevel: 'Entry Level', roleId: 1 },
      { name: 'QA Tester', skills: ['Communication'], expertiseLevel: 'Junior', roleId: 2 },
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
      { name: 'UI Designer', skills: ['Figma', 'Prototyping'], expertiseLevel: 'Junior', roleId: 3 },
      { name: 'UX Researcher', skills: ['UX Research'], expertiseLevel: 'Mid', roleId: 4 },
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
      { name: 'Frontend Dev', skills: ['React', 'TypeScript', 'CSS'], expertiseLevel: 'Entry Level', roleId: 5 },
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
      { name: 'Marketing Lead', skills: ['SEO', 'Analytics'], expertiseLevel: 'Mid', roleId: 6 },
      { name: 'Content Writer', skills: ['Content Creation'], expertiseLevel: 'Entry Level', roleId: 7 },
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
      { name: 'Network Engineer', skills: ['Networking', 'Python', 'Linux'], expertiseLevel: 'Senior', roleId: 8 },
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
      { name: 'UX Designer', skills: ['UX', 'User Testing'], expertiseLevel: 'Mid', roleId: 9 },
      { name: 'Product Owner', skills: ['Wireframing'], expertiseLevel: 'Senior', roleId: 10 },
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
      { name: 'Graphic Designer', skills: ['Photoshop', 'Illustrator', 'Creativity'], expertiseLevel: 'Entry Level', roleId: 11 },
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
      { name: 'Product Designer', skills: ['Product Design', 'Collaboration'], expertiseLevel: 'Senior', roleId: 12 },
      { name: 'UI Designer', skills: ['Sketch'], expertiseLevel: 'Mid', roleId: 13 },
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
      { name: 'Project Manager', skills: ['Project Management', 'Agile', 'Scrum'], expertiseLevel: 'Mid', roleId: 14 },
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
      { name: 'Marketing Manager', skills: ['Marketing', 'Strategy', 'Leadership'], expertiseLevel: 'Senior', roleId: 15 },
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
      { name: 'Visual Designer', skills: ['Design', 'Branding', 'Creativity'], expertiseLevel: 'Junior', roleId: 16 },
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
      { name: 'Interaction Designer', skills: ['Prototyping', 'Figma', 'UX'], expertiseLevel: 'Entry Level', roleId: 17 },
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
      { name: 'UX Designer', skills: ['UX', 'Research'], expertiseLevel: 'Mid', roleId: 18 },
      { name: 'Team Lead', skills: ['Leadership'], expertiseLevel: 'Senior', roleId: 19 },
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
        </div>
        <div className={styles.projectMeta}>
          <div className={styles.metaItem}>
            <Image src="/complexity-icon.svg" alt="Complexity" width={16} height={16} className={styles.metaIcon} />
            <span>Complexity: {project.complexity}</span>
          </div>
          <div className={styles.metaItem}>
            <Image src="/team-size-icon.svg" alt="Team Size" width={16} height={16} className={styles.metaIcon} />
            <span>Team Size: {project.teamSize}</span>
          </div>
          <div className={styles.metaItem}>
            <Image src="/project-type-icon.svg" alt="Project Type" width={16} height={16} className={styles.metaIcon} />
            <span>Type: {project.projectType}</span>
          </div>
        </div>
        <div className={styles.tagList} style={{ marginTop: 8 }}>
          {project.positions.map(pos => (
            <span
              key={pos.name}
              className={selected ? `${styles.skillTag} ${styles.selected}` : styles.skillTag}
            >
              {pos.name}
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

const ProjectList: React.FC<ProjectListProps> = ({ projects, onSelect, selectedId, allProjects }) => {
  if (projects.length === 0) {
    // Check if this is a "no projects at all" situation or "no projects match filters"
    const isNoProjectsPosted = allProjects.length === 0;

    return (
      <div className={styles.projectList}>
        <div className={styles.emptyState}>
          <div className={styles.emptyStateIcon}>
            {isNoProjectsPosted ? (
              // Icon for no projects posted
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
            {isNoProjectsPosted ? 'No Projects Available' : 'No Projects Found'}
          </h3>
          <p className={styles.emptyStateDescription}>
            {isNoProjectsPosted
              ? 'There are currently no projects for you on the platform.'
              : 'We couldn&apos;t find any projects matching your current filters. Try adjusting your search criteria or clearing filters to see more opportunities.'
            }
          </p>
          <div className={styles.emptyStateSuggestions}>
            <p className={styles.suggestionText}>
              {isNoProjectsPosted ? 'What you can do:' : 'Try:'}
            </p>
            <ul className={styles.suggestionList}>
              {isNoProjectsPosted ? (
                <>
                  <li>Make sure that you are logged in</li>
                  <li>Check back later for new project postings</li>
                  <li>Complete your profile to be ready when projects are available</li>
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
};

const ProjectDescription: React.FC<ProjectDescriptionProps & {
  onApply?: (projectRoleId: number, positionName: string) => Promise<void>;
}> = ({ project, onApply, appliedRoleIds }) => {
  // Track the currently chosen role by its unique id (null means no selection)
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
  const [isApplying, setIsApplying] = useState(false);

  // When the project changes, clear selection
  React.useEffect(() => {
    setSelectedRoleId(null);
  }, [project]);

  if (!project) return null;

  // Find the selected position object via roleId
  const selectedPositionObj = project.positions.find(pos => pos.roleId === selectedRoleId);

  // If a position is selected, use its info; otherwise, use project info
  const experienceLevel = selectedPositionObj?.expertiseLevel || project.complexity;
  const requiredSkills = selectedPositionObj
    ? selectedPositionObj.skills
    : Array.from(new Set(project.positions.flatMap(pos => pos.skills)));

  // For Apply button
  const selectedPositionName = selectedPositionObj?.name ?? 'Role';
  const currentRoleId = selectedPositionObj?.roleId ?? project.roleId;
  const alreadyApplied = currentRoleId ? appliedRoleIds.has(currentRoleId) : false;

  const handleApply = async () => {
    if (!selectedPositionObj) {
      toast.error('Please select a position to apply.');
      return;
    }
    if (!currentRoleId || !onApply) return;

    // Check if already applied
    if (alreadyApplied) {
      toast.info('You have already applied to this project.');
      return;
    }

    setIsApplying(true);
    try {
      await onApply(currentRoleId, selectedPositionName);
    } finally {
      setIsApplying(false);
    }
  };

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
        </div>
        <div className={styles.projectDescMetaRow}>
          <div className={styles.projectDescMetaItem}>
            <Image src="/complexity-icon.svg" alt="Complexity" width={16} height={16} className={styles.metaIcon} />
            <span>Complexity: {project.complexity}</span>
          </div>
          <div className={styles.projectDescMetaItem}>
            <Image src="/team-size-icon.svg" alt="Team Size" width={16} height={16} className={styles.metaIcon} />
            <span>Team Size: {project.teamSize}</span>
          </div>
          <div className={styles.projectDescMetaItem}>
            <Image src="/project-type-icon.svg" alt="Project Type" width={16} height={16} className={styles.metaIcon} />
            <span>Type: {project.projectType}</span>
          </div>
        </div>
      </div>
      <div className={styles.projectDescBody}>
        <p className={styles.projectDescText}>{project.description} </p>
        <div className={styles.projectDescSection}>
          <h4 className={styles.projectDescSectionTitle}>Project Complexity</h4>
          <div className={styles.tagList}>
            <span className={styles.tag}>{project.complexity}</span>
          </div>
        </div>
        <div className={styles.projectDescSection}>
          <h4 className={styles.projectDescSectionTitle}>Experience Level Required</h4>
          <div className={styles.tagList}>
            <span className={styles.tag}>{experienceLevel}</span>
          </div>
        </div>
        <div className={styles.projectDescSection}>
          <h4 className={styles.projectDescSectionTitle}>Required Skills</h4>
          <div className={styles.tagList}>
            {requiredSkills.map(tech => (
              <span key={tech} className={styles.tag}>{tech}</span>
            ))}
          </div>
        </div>
        <div className={styles.projectDescSection}>
          <h4 className={styles.projectDescSectionTitle}>Available Positions</h4>
          <div className={styles.tagList}>
            {project.positions.map(role => {
              const isSelected = role.roleId === selectedRoleId;
              return (
                <span
                  key={role.roleId ?? role.name}
                  className={isSelected ? styles.tag : styles.positionTag}
                  onClick={() => setSelectedRoleId(isSelected ? null : role.roleId ?? null)}
                  style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                >
                  {role.name}
                  {role.expertiseLevel && (
                    <span style={{ marginLeft: '6px', fontSize: '11px', opacity: 0.8, fontWeight: 'normal' }}>
                      ({role.expertiseLevel})
                    </span>
                  )}
                </span>
              );
            })}
          </div>
        </div>
      </div>
      <button
        className={styles.mainApplyBtn}
        onClick={handleApply}
        disabled={isApplying || !selectedPositionObj}
      >
        {alreadyApplied
          ? 'Applied'
          : isApplying
            ? 'Applying...'
            : selectedPositionObj
              ? 'Apply Now'
              : 'Select a Position to Apply'}
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

// Function to transform API data to Project interface
const transformApiDataToProjects = (apiData: ApiProjectRole[]): Project[] => {
  // Group roles by project
  const projectGroups = apiData.reduce((acc, role) => {
    if (!acc[role.projectId]) {
      acc[role.projectId] = [];
    }
    acc[role.projectId].push(role);
    return acc;
  }, {} as Record<number, ApiProjectRole[]>);

  // Transform each project group to Project interface
  return Object.values(projectGroups).map((roles) => {
    const firstRole = roles[0];

    // Create a map of role names to role IDs for easy lookup
    const roleIdMap = roles.reduce((acc, role) => {
      acc[role.roleName] = role.roleId;
      return acc;
    }, {} as Record<string, number>);

    return {
      id: firstRole.projectId,
      company: firstRole.projectTitle,
      logo: '/company_logo.svg', // Default logo
      description: firstRole.projectDescription,
      requiredSkills: ['React', 'TypeScript'], // Default skills - you might want to enhance API to include these
      teamSize: '4-6', // Default - you might want to enhance API
      projectType: 'Paid', // Default - you might want to enhance API
      positions: roles.map(role => ({
        name: role.roleName,
        skills: ['React', 'TypeScript'], // Default skills for role
        roleId: role.roleId, // Store roleId for each position
      })),
      badge: 'Full Time',
      badgeType: 'fullTime' as const,
      complexity: 'Mid', // Default - you might want to enhance API
      originalTitle: firstRole.projectTitle,
      roleId: firstRole.roleId, // Store the first role ID as default
      roleIdMap, // Store the mapping for easy lookup
    };
  });
};

// Function to fetch projects from API
const fetchProjects = async (): Promise<Project[]> => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('❌ FETCH PROJECTS: No authentication token found');
    toast.error('You are not logged in');
    return [];
  }

  console.log('🔄 FETCH PROJECTS: Starting to fetch projects from API...');

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/roles`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`❌ FETCH PROJECTS: API request failed with status ${response.status}: ${response.statusText}`);
      throw new Error(`Failed to fetch projects: ${response.status} ${response.statusText}`);
    }

    const apiData: ApiProjectRole[] = await response.json();
    console.log('✅ FETCH PROJECTS: Successfully fetched projects data:', apiData);

    const transformedProjects = transformApiDataToProjects(apiData);
    console.log('✅ FETCH PROJECTS: Successfully transformed projects:', transformedProjects);

    toast.success(`Successfully loaded ${transformedProjects.length} projects`);
    return transformedProjects;
  } catch (error) {
    console.error('❌ FETCH PROJECTS: Error occurred:', error);
    toast.error('Failed to load projects');
    console.log('🔄 FETCH PROJECTS: Falling back to mock data');
    return mockProjects; // Fallback to mock data
  }
};

// Function to apply for a project role
const applyForProjectRole = async (projectRoleId: number): Promise<boolean> => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('❌ APPLY PROJECT: No authentication token found');
    toast.error('Please log in to apply for projects');
    return false;
  }

  console.log(`🔄 APPLY PROJECT: Starting application for project role ID: ${projectRoleId}`);

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/applications/project-roles/${projectRoleId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ APPLY PROJECT: API request failed with status ${response.status}: ${response.statusText}`);
      console.error(`❌ APPLY PROJECT: Error response body:`, errorText);
      throw new Error(`Failed to submit application: ${response.status} ${response.statusText}`);
    }

    const responseData = await response.json().catch(() => null); // In case response is not JSON
    console.log('✅ APPLY PROJECT: Successfully submitted application for role ID:', projectRoleId);
    console.log('✅ APPLY PROJECT: Response data:', responseData);

    return true;
  } catch (error) {
    console.error(`❌ APPLY PROJECT: Error occurred while applying for role ID ${projectRoleId}:`, error);
    toast.error('Failed to submit application');
    return false;
  }
};

// ---------------- API TYPES ----------------
interface ApiProjectDetails {
  id: number;
  title: string;
  description: string;
  requiredSkills: string[];
  teamSize: 'OneThree' | 'FourSix' | 'SevenPlus';
  projectType: string;
  logoUrl?: string;
  complexity?: string;
}

// Map backend enum to human-readable string
const mapTeamSize = (value: ApiProjectDetails['teamSize']): string => {
  switch (value) {
    case 'OneThree':
      return '1-3';
    case 'FourSix':
      return '4-6';
    case 'SevenPlus':
      return '7+';
    default:
      return value;
  }
};

// Fetch detailed project info
const fetchProjectDetails = async (projectId: number): Promise<ApiProjectDetails | null> => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/${projectId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      console.error(`Failed to fetch project details: ${res.status} ${res.statusText}`);
      return null;
    }

    const data: ApiProjectDetails = await res.json();
    return data;
  } catch (err) {
    console.error('Error fetching project details', err);
    return null;
  }
};

// ---- API Role list ----
interface ApiProjectRoleDetails {
  id: number;
  roleName: string;
  expertiseLevel: string; // ENTRY, JUNIOR, etc.
  technologies: string[];
}

// Fetch roles for a specific project
const fetchProjectRoles = async (projectId: number): Promise<ProjectPosition[]> => {
  const token = localStorage.getItem('token');
  if (!token) return [];

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/${projectId}/roles`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      console.error(`Failed to fetch project roles: ${res.status} ${res.statusText}`);
      return [];
    }

    const data: ApiProjectRoleDetails[] = await res.json();

    return data.map(r => ({
      name: r.roleName,
      skills: r.technologies,
      roleId: r.id,
      expertiseLevel: r.expertiseLevel,
    }));
  } catch (err) {
    console.error('Error fetching project roles', err);
    return [];
  }
};

const FindProjectPage = () => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [requiredSkills, setRequiredSkills] = useState<string[]>([]);
  const [selectedExperience, setSelectedExperience] = useState<string[]>([]);
  const [selectedProjectType, setSelectedProjectType] = useState<string[]>([]);
  const [selectedTeamSize, setSelectedTeamSize] = useState<string[]>([]);
  const [selectedEmploymentType, setSelectedEmploymentType] = useState<string[]>([]);
  const [appliedRoleIds, setAppliedRoleIds] = useState<Set<number>>(new Set());

  // Fetch projects on component mount
  React.useEffect(() => {
    const loadProjects = async () => {
      setLoading(true);
      const fetchedProjects = await fetchProjects();
      setProjects(fetchedProjects);
      if (fetchedProjects.length > 0) {
        setSelectedProject(fetchedProjects[0]);
      }
      setLoading(false);
    };

    loadProjects();

    // Fetch applications that the user has already submitted so we can disable duplicates
    const loadUserApplications = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/applications`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) {
          console.error(`Failed to fetch user applications: ${res.status} ${res.statusText}`);
          return;
        }

        const data: UserApplication[] = await res.json();
        const ids = new Set<number>(data.map(app => app.projectRoleId));
        setAppliedRoleIds(ids);
      } catch (err) {
        console.error('Error while fetching user applications', err);
      }
    };

    loadUserApplications();
  }, []);

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

  const handleApplyForProject = async (projectRoleId: number, positionName: string) => {
    const success = await applyForProjectRole(projectRoleId);
    if (success) {
      toast.success(`Application was successfully sent for ${positionName} position`);
      setAppliedRoleIds(prev => new Set(prev).add(projectRoleId));
    }
  };

  const handleSelectProject = async (project: Project) => {
    // Immediately show base info so UI feels responsive
    setSelectedProject(project);

    // Fetch detailed info and merge
    const details = await fetchProjectDetails(project.id);
    if (details) {
      setSelectedProject(prev => prev ? {
        ...prev,
        description: details.description || prev.description,
        requiredSkills: details.requiredSkills?.length ? details.requiredSkills : prev.requiredSkills,
        teamSize: mapTeamSize(details.teamSize),
        projectType: details.projectType || prev.projectType,
        company: details.title || prev.company,
        logo: details.logoUrl || prev.logo,
        complexity: details.complexity || prev.complexity,
      } : prev);
    }

    // Fetch roles for this project (technologies & expertise level)
    const roles = await fetchProjectRoles(project.id);
    if (roles.length) {
      const roleIdMap = roles.reduce((acc, r) => {
        acc[r.name] = r.roleId as number;
        return acc;
      }, {} as Record<string, number>);

      setSelectedProject(prev => prev ? {
        ...prev,
        positions: roles,
        roleId: roles[0]?.roleId ?? prev.roleId,
        roleIdMap,
      } : prev);
    }
  };

  const filteredProjects = filterProjects(
    projects,
    selectedExperience,
    selectedProjectType,
    selectedTeamSize,
    requiredSkills,
    selectedEmploymentType
  );

  if (loading) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.loadingContainer}>
          <p>Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <SearchBar tags={selectedTags} onRemoveTag={handleRemoveTag} onAddTag={handleAddTag} />
      <div className={filteredProjects.length === 0 ? styles.mainContainerNoProjects : styles.mainContainer}>
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
            onSelect={handleSelectProject}
            selectedId={selectedProject?.id || null}
            allProjects={projects}
          />
        </main>
        {filteredProjects.length > 0 && (
          <ProjectDescription
            project={selectedProject}
            onApply={handleApplyForProject}
            appliedRoleIds={appliedRoleIds}
          />
        )}
      </div>
      <ToastContainer aria-label="Notification messages" />
    </div>
  );
};

export default FindProjectPage;
