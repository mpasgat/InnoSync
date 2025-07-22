"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import 'react-toastify/dist/ReactToastify.css';
import styles from "./ProjectsPage.module.css";
import ProjectCreationPanel from "../project-creation/ProjectCreationPanel";

interface Project {
  id: number;
  title: string;
  image: string;
  status: "active" | "completed" | "pending" | "archived";
  messages: number;
  attachments: number;
  progress: string;
}

export default function ProjectsPage() {
  const router = useRouter();
  const [showCreationPanel, setShowCreationPanel] = useState(false);
  const [projects, setProjects] = useState<Project[]>([
    {
      id: 1,
      title: "Project InnoSync",
      image: "/project-innosync-image.png",
      status: "active",
      messages: 7,
      attachments: 2,
      progress: "1/3"
    },
    {
      id: 2,
      title: "Project AiHub",
      image: "/project-aihub-image.png",
      status: "active",
      messages: 7,
      attachments: 2,
      progress: "1/3"
    }
  ]);

  const handleNewProject = () => {
    setShowCreationPanel(true);
  };

  const handleArchiveProject = (projectId: number) => {
    setProjects(prevProjects =>
      prevProjects.map(project =>
        project.id === projectId
          ? { ...project, status: "archived" as const }
          : project
      )
    );
  };

  const handleDeleteProject = (projectId: number) => {
    setProjects(prevProjects =>
      prevProjects.filter(project => project.id !== projectId)
    );
  };

  return (
    <div className={styles.projectsContent}>
      <div className={styles.projectsGrid}>
        <div className={styles.projectCardsColumn + (showCreationPanel ? ' ' + styles.panelOpen : '')}>
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              router={router}
              onArchive={() => handleArchiveProject(project.id)}
              onDelete={() => handleDeleteProject(project.id)}
            />
          ))}
          {/* Add Project Button */}
          <button type="button" className={styles.addProjectCard} onClick={handleNewProject}>
            <div className={styles.addIcon}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 10H15" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10 5V15" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className={styles.addText}>New Project</span>
          </button>
        </div>
        <div className={styles.panelColumn + (showCreationPanel ? ' ' + styles.open : '')}>
          <ProjectCreationPanel open={showCreationPanel} onClose={() => setShowCreationPanel(false)} />
        </div>
      </div>
    </div>
  );
}

interface ProjectCardProps {
  project: Project;
  router: ReturnType<typeof useRouter>;
  onArchive: () => void;
  onDelete: () => void;
}

function ProjectCard({ project, router, onArchive, onDelete }: ProjectCardProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  const handleCardClick = () => {
    router.push(`/dashboard/projects/${project.id}`);
  };

  const handleMoreOptionsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDropdown(!showDropdown);
  };

  const handleOptionClick = (action: () => void) => {
    action();
    setShowDropdown(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "#34A853";
      case "archived":
        return "#9EA3A9";
      case "completed":
        return "#4285F4";
      case "pending":
        return "#FBBC04";
      default:
        return "#34A853";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Active";
      case "archived":
        return "Archived";
      case "completed":
        return "Completed";
      case "pending":
        return "Pending";
      default:
        return "Active";
    }
  };

  return (
    <div
      className={styles.projectCard}
      style={{
        borderBottomColor: getStatusColor(project.status)
      }}
      onClick={handleCardClick}
    >
      <div className={styles.projectImage}>
        <img
          src={project.image}
          alt={project.title}
          className={styles.projectImageElement}
        />
      </div>

      <div className={styles.projectContent}>
        <div className={styles.projectHeader}>
          <h3 className={styles.projectTitle}>{project.title}</h3>
          <div className={styles.moreOptions} onClick={handleMoreOptionsClick} ref={dropdownRef}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="4" cy="10" r="1" fill="#9EA3A9"/>
              <circle cx="10" cy="10" r="1" fill="#9EA3A9"/>
              <circle cx="16" cy="10" r="1" fill="#9EA3A9"/>
            </svg>
            {showDropdown && (
              <div className={styles.dropdownMenu}>
                <button
                  className={styles.dropdownItem}
                  onClick={() => handleOptionClick(() => window.open(`/dashboard/projects/${project.id}`, '_blank'))}
                >
                  View Details
                </button>
                <button
                  className={styles.dropdownItem}
                  onClick={() => handleOptionClick(onArchive)}
                >
                  Archive
                </button>
                <button
                  className={styles.dropdownItem}
                  onClick={() => handleOptionClick(onDelete)}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        <div className={styles.projectTag}>
          <span
            className={styles.statusTag}
            style={{ backgroundColor: getStatusColor(project.status) }}
          >
            {getStatusText(project.status)}
          </span>
        </div>
      </div>
    </div>
  );
}