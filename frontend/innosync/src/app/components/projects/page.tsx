"use client";
import React, { useState } from 'react';
import styles from './page.module.css';
import Image from 'next/image';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Project {
  id: number;
  company: string;
  logo: string;
  title: string;
  badge: string;
  badgeType: 'fullTime' | 'internship' | 'partTime' | 'remote' | 'contract' | 'temporary';
  location: string;
  salary: string;
  timeLeft: string;
  featured?: boolean;
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

const FilterCheckbox: React.FC<{ label: string; defaultChecked?: boolean }> = ({ label, defaultChecked }) => (
  <label className={styles.checkboxLabel}>
    <input type="checkbox" className={styles.checkbox} defaultChecked={defaultChecked} />
    <span className={styles.customCheckbox}>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 8.5L7 11.5L12 5.5" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
    {label}
  </label>
);

const FilterSidebar: React.FC<FilterSidebarProps> = ({ skills, onAddSkill, onRemoveSkill }) => {
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

  return (
    <aside className={styles.sidebar}>
      <div className={styles.filterSection}>
        <h3>Experience Level</h3>
        <div className={styles.checkboxGroup}>
          {['Entry Level', 'Junior', 'Mid', 'Senior'].map(level => (
            <FilterCheckbox key={level} label={level} defaultChecked />
          ))}
        </div>
      </div>

      <div className={styles.filterSection}>
        <h3>Project Type</h3>
        <div className={styles.checkboxGroup}>
          {['Paid', 'Academic', 'Volunteer'].map(type => (
            <FilterCheckbox key={type} label={type} defaultChecked />
          ))}
        </div>
      </div>

      <div className={styles.filterSection}>
        <h3>Team Size</h3>
        <select className={styles.dropdown}>
          <option>Team Size</option>
          <option>1-3</option>
          <option>4-6</option>
          <option>7+</option>
        </select>
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
    title: 'Technical Support Specialist',
    badge: 'Full Time',
    badgeType: 'fullTime',
    location: 'Idaho, USA',
    salary: '$15K-$20K',
    timeLeft: '4 Days Remaining',
  },
  {
    id: 2,
    company: 'Youtube',
    logo: '/company_logo.svg',
    title: 'UI/UX Designer',
    badge: 'Full Time',
    badgeType: 'fullTime',
    location: 'Minnesota, USA',
    salary: '$10K-$15K',
    timeLeft: '4 Days Remaining',
  },
  {
    id: 3,
    company: 'Reddit',
    logo: '/company_logo.svg',
    title: 'Front End Developer',
    badge: 'Internship',
    badgeType: 'internship',
    location: 'Mymensingh, Bangladesh',
    salary: '$10K-$15K',
    timeLeft: '4 Days Remaining',
  },
  {
    id: 4,
    company: 'Freepik',
    logo: '/company_logo.svg',
    title: 'Marketing Officer',
    badge: 'Full Time',
    badgeType: 'fullTime',
    location: 'Montana, USA',
    salary: '$50K-$60K',
    timeLeft: '4 Days Remaining',
  },
  {
    id: 5,
    company: 'Instagram',
    logo: '/company_logo.svg',
    title: 'Networking Engineer',
    badge: 'Full Time',
    badgeType: 'fullTime',
    location: 'Michigan, USA',
    salary: '$5K-$10K',
    timeLeft: '4 Days Remaining',
  },
  {
    id: 6,
    company: 'Slack',
    logo: '/company_logo.svg',
    title: 'Senior UX Designer',
    badge: 'Full Time',
    badgeType: 'fullTime',
    location: 'Entry Level',
    salary: '2-3 Team Members',
    timeLeft: 'Academic',
    featured: true,
  },
  {
    id: 7,
    company: 'Facebook',
    logo: '/company_logo.svg',
    title: 'Junior Graphic Designer',
    badge: 'Full Time',
    badgeType: 'fullTime',
    location: 'Mymensingh, Bangladesh',
    salary: '$40K-$50K',
    timeLeft: '4 Days Remaining',
  },
  {
    id: 8,
    company: 'Twitter',
    logo: '/company_logo.svg',
    title: 'Product Designer',
    badge: 'Full Time',
    badgeType: 'fullTime',
    location: 'Sivas, Turkey',
    salary: '$50K-$70K',
    timeLeft: '4 Days Remaining',
  },
  {
    id: 9,
    company: 'Udemy',
    logo: '/company_logo.svg',
    title: 'Project Manager',
    badge: 'Full Time',
    badgeType: 'fullTime',
    location: 'Ohio, USA',
    salary: '$50K-$80K',
    timeLeft: '4 Days Remaining',
  },
  {
    id: 10,
    company: 'Microsoft',
    logo: '/company_logo.svg',
    title: 'Marketing Manager',
    badge: 'Temporary',
    badgeType: 'temporary',
    location: 'Konya, Turkey',
    salary: '$20K-$25K',
    timeLeft: '4 Days Remaining',
  },
  {
    id: 11,
    company: 'Apple',
    logo: '/company_logo.svg',
    title: 'Visual Designer',
    badge: 'Part Time',
    badgeType: 'partTime',
    location: 'Washington, USA',
    salary: '$10K-$15K',
    timeLeft: '4 Days Remaining',
  },
  {
    id: 12,
    company: 'Figma',
    logo: '/company_logo.svg',
    title: 'Interaction Designer',
    badge: 'Remote',
    badgeType: 'remote',
    location: 'Penn, USA',
    salary: '$35K-$40K',
    timeLeft: '4 Days Remaining',
  },
  {
    id: 13,
    company: 'Upwork',
    logo: '/company_logo.svg',
    title: 'Senior UX Designer',
    badge: 'Contract Base',
    badgeType: 'contract',
    location: 'Sylhet, Bangladesh',
    salary: '$30K-$35K',
    timeLeft: '4 Days Remaining',
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
          <h3 className={styles.projectTitle}>{project.title}</h3>
          <span className={`${styles.badge} ${styles[project.badgeType]}`}>{project.badge}</span>
        </div>
        <div className={styles.projectMeta}>
          <div className={styles.metaItem}>
            <Image src="/location.svg" alt="Location" width={16} height={16} />
            <span>{project.location}</span>
          </div>
          <div className={styles.metaItem}>
            <Image src="/salary.svg" alt="Salary" width={16} height={16} />
            <span>{project.salary}</span>
          </div>
          <div className={styles.metaItem}>
            <Image src="/calendar.svg" alt="Time Left" width={16} height={16} />
            <span>{project.timeLeft}</span>
          </div>
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
  const availablePositions = ['Frontend Dev', 'Sys Admin', 'Backend Dev', 'DB Admin'];
  const [selectedPosition, setSelectedPosition] = useState<string | null>(availablePositions[0]);

  return (
    <aside className={styles.projectDescription}>
      <div className={styles.projectDescHeader}>
        <div className={styles.projectDescLogoWrapper}>
          {project?.logo && (
            <Image src={project.logo} alt={project.company + ' logo'} width={80} height={80} className={styles.projectDescLogo} />
          )}
        </div>
        <div className={styles.projectDescTitleBlock}>
          <h2 className={styles.projectDescCompany}>{project?.company || 'InnoSync'}</h2>
          <h3 className={styles.projectDescTitle}>{project?.title || ''}</h3>
        </div>
        <div className={styles.projectDescMetaRow}>
          <div className={styles.projectDescMetaItem}>
            <Image src="/location.svg" alt="Location" width={18} height={18} />
            <span>{project?.location}</span>
          </div>
          <div className={styles.projectDescMetaItem}>
            <Image src="/salary.svg" alt="Salary" width={18} height={18} />
            <span>{project?.salary}</span>
          </div>
          <div className={styles.projectDescMetaItem}>
            <Image src="/calendar.svg" alt="Time Left" width={18} height={18} />
            <span>{project?.timeLeft}</span>
          </div>
        </div>
      </div>
      <div className={styles.projectDescBody}>
        <p className={styles.projectDescText}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </p>
        <div className={styles.projectDescSection}>
          <h4 className={styles.projectDescSectionTitle}>Tech Stack</h4>
          <div className={styles.tagList}>
            {['PostgreSQL', 'Docker', 'React'].map(tech => (
              <span key={tech} className={styles.tag}>{tech}</span>
            ))}
          </div>
        </div>
        <div className={styles.projectDescSection}>
          <h4 className={styles.projectDescSectionTitle}>Available Positions</h4>
          <div className={styles.tagList}>
            {availablePositions.map(role => (
              <span
                key={role}
                className={
                  selectedPosition === role
                    ? styles.tag
                    : styles.positionTag
                }
                onClick={() => setSelectedPosition(role)}
                style={{ cursor: 'pointer', transition: 'all 0.2s' }}
              >
                {role}
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

const FindProjectPage = () => {
  const [selectedTags, setSelectedTags] = useState(['Frontend Dev', 'Sys Admin', 'Backend Dev', 'DB Admin']);
  const [selectedProject, setSelectedProject] = useState<Project | null>(mockProjects[5]);
  const [requiredSkills, setRequiredSkills] = useState([
    'Angular', 'React', 'Vue', 'PostgreSQL', 'Docker', 'Figma', 'Git', 'Svelte', 'Python',
  ]);

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

  return (
    <div className={styles.pageContainer}>
      <SearchBar tags={selectedTags} onRemoveTag={handleRemoveTag} onAddTag={handleAddTag} />
      <div className={styles.mainContainer}>
        <FilterSidebar skills={requiredSkills} onAddSkill={handleAddSkill} onRemoveSkill={handleRemoveSkill} />
        <main className={styles.mainContent}>
          <ProjectList
            projects={mockProjects}
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
