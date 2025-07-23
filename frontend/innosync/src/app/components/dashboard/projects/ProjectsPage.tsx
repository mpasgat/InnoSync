"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import styles from "./ProjectsPage.module.css";
import ProjectCreationPanel from "../project-creation/ProjectCreationPanel";

interface Project {
  id: number;
  title: string;
  description: string;
  projectType: string;
  teamSize: string;
  createdAt: string;
  updatedAt: string;
  status?: "active" | "completed" | "pending" | "archived";
  messages?: number;
  attachments?: number;
  progress?: string;
}

export default function ProjectsPage() {
  const router = useRouter();
  const [showCreationPanel, setShowCreationPanel] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch projects from API
  const fetchProjects = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Authentication required. Please log in.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch projects: ${response.status} ${response.statusText}`);
      }

      const data: Project[] = await response.json();

      // Transform the data to include UI-specific fields
      const transformedProjects = data.map(project => ({
        ...project,
        status: "active" as const, // Default status since backend doesn't have this field
        messages: 0, // Default values since backend doesn't have these fields
        attachments: 0,
        progress: "0/0" // Default progress
      }));

      setProjects(transformedProjects);
      toast.success(`Successfully loaded ${transformedProjects.length} projects`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch projects';
      setError(errorMessage);
      toast.error(`Error loading projects: ${errorMessage}`);
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load projects on component mount
  useEffect(() => {
    fetchProjects();
  }, []);

  const handleNewProject = () => {
    setShowCreationPanel(true);
  };

  const handleArchiveProject = async (projectId: number) => {
    // For now, we'll just update the local state
    // In the future, you might want to add an API endpoint to update project status
    setProjects(prevProjects =>
      prevProjects.map(project =>
        project.id === projectId
          ? { ...project, status: "archived" as const }
          : project
      )
    );
    toast.success('Project archived successfully');
  };

  const handleDeleteProject = async (projectId: number) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Authentication required');
      return;
    }

    try {
      // Note: You'll need to add a DELETE endpoint to your backend
      // For now, we'll just update the local state
      setProjects(prevProjects =>
        prevProjects.filter(project => project.id !== projectId)
      );
      toast.success('Project deleted successfully');
    } catch (err) {
      toast.error('Failed to delete project');
      console.error('Error deleting project:', err);
    }
  };

  const handleProjectCreated = () => {
    // Refresh the projects list when a new project is created
    fetchProjects();
    setShowCreationPanel(false);
  };

  if (loading) {
    return (
      <div className={styles.projectsContent}>
        <div className={styles.loadingContainer}>
          <p>Loading your projects...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.projectsContent}>
        <div className={styles.errorContainer}>
          <p>Error: {error}</p>
          <button onClick={fetchProjects} className={styles.retryButton}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.projectsContent}>
      <div className={styles.projectsGrid}>
        <div className={styles.projectCardsColumn + (showCreationPanel ? ' ' + styles.panelOpen : '')}>
          {projects.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyStateIcon}>
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24 4L44 24L24 44L4 24L24 4Z" stroke="#9EA3A9" strokeWidth="2"/>
                  <path d="M24 12L36 24L24 36L12 24L24 12Z" fill="#9EA3A9"/>
                </svg>
              </div>
              <h3 className={styles.emptyStateTitle}>No projects yet</h3>
              <p className={styles.emptyStateDescription}>
                Create your first project to get started with team collaboration.
              </p>
            </div>
          ) : (
            projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                router={router}
                onArchive={() => handleArchiveProject(project.id)}
                onDelete={() => handleDeleteProject(project.id)}
              />
            ))
          )}
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
          <ProjectCreationPanel
            open={showCreationPanel}
            onClose={() => setShowCreationPanel(false)}
            onProjectCreated={handleProjectCreated}
          />
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div
      className={styles.projectCard}
      style={{
        borderBottomColor: getStatusColor(project.status || "active")
      }}
      onClick={handleCardClick}
    >
      <div className={styles.projectImage}>
        <img
          src="/project-innosync-image.png" // Default image
          alt={project.title}
          className={styles.projectImageElement}
        />
      </div>

            <div className={styles.projectContent}>
        <div className={styles.projectHeader}>
          <h3 className={styles.projectTitle}>{project.title}</h3>
        </div>

        <div className={styles.projectMeta}>
          <div className={styles.projectTypeBadge}>
            <img src="/project-type-icon.svg" alt="Project Type" className={styles.metaIcon} />
            <span>{project.projectType}</span>
          </div>
          <div className={styles.projectTeamBadge}>
            <img src="/team-size-icon.svg" alt="Team Size" className={styles.metaIcon} />
            <span>{project.teamSize}</span>
          </div>
          <div className={styles.projectDate}>
            <img src="/calendar.svg" alt="Date" className={styles.metaIcon} />
            <span>{formatDate(project.createdAt)}</span>
          </div>
        </div>

        <div className={styles.projectTag}>
          <span
            className={styles.statusTag}
            style={{ backgroundColor: getStatusColor(project.status || "active") }}
          >
            {getStatusText(project.status || "active")}
          </span>
        </div>
      </div>

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
  );
}