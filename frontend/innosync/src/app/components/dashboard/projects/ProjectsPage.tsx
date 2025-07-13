"use client";
import React, { useState } from "react";
import Link from "next/link";

import 'react-toastify/dist/ReactToastify.css';
import styles from "./ProjectsPage.module.css";
import ProjectCreationPanel from "../project-creation/ProjectCreationPanel";

interface Project {
  id: number;
  title: string;
  image: string;
  status: "active" | "completed" | "pending";
  messages: number;
  attachments: number;
  progress: string;
}

export default function ProjectsPage() {
  const [showCreationPanel, setShowCreationPanel] = useState(false);
  const projects: Project[] = [
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
  ];

  const handleNewProject = () => {
    setShowCreationPanel(true);
  };

  return (
    <div className={styles.projectsContent}>
      <div className={styles.projectsGrid}>
        <div className={styles.projectCardsColumn + (showCreationPanel ? ' ' + styles.panelOpen : '')}>
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
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
}

function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link href={`/dashboard/projects/${project.id}`} className={styles.projectCard} style={{ textDecoration: 'none', color: 'inherit' }}>
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
          <div className={styles.moreOptions}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="4" cy="10" r="1" fill="#9EA3A9"/>
              <circle cx="10" cy="10" r="1" fill="#9EA3A9"/>
              <circle cx="16" cy="10" r="1" fill="#9EA3A9"/>
            </svg>
          </div>
        </div>

        <div className={styles.projectTag}>
          <span className={styles.statusTag}>Active</span>
        </div>

        <div className={styles.projectStats}>
          <div className={styles.statItem}>
            <div className={styles.statIcon}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M1.33 1.33H14.67V14.67H1.33V1.33Z" stroke="#9EA3A9" strokeWidth="1.5"/>
                <path d="M10.33 7H11" stroke="#9EA3A9" strokeWidth="2"/>
                <path d="M7.67 7H8.33" stroke="#9EA3A9" strokeWidth="2"/>
                <path d="M5 7H5.67" stroke="#9EA3A9" strokeWidth="2"/>
              </svg>
            </div>
            <span className={styles.statNumber}>{project.messages.toString().padStart(2, '0')}</span>
          </div>

          <div className={styles.statItem}>
            <div className={styles.statIcon}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M1.33 0.93L12.96 13.74" stroke="#9EA3A9" strokeWidth="1.5"/>
              </svg>
            </div>
            <span className={styles.statNumber}>{project.attachments.toString().padStart(2, '0')}</span>
          </div>

          <div className={styles.statItem}>
            <div className={styles.statIcon}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="6.67" stroke="#9EA3A9" strokeWidth="1.5"/>
                <path d="M6 2.67L8.67 6L14 8.67" stroke="#9EA3A9" strokeWidth="1.5"/>
              </svg>
            </div>
            <span className={styles.statNumber}>{project.progress}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}