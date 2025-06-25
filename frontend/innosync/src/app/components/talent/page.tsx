"use client";

import { useState } from "react";
import styles from "./page.module.css";
import Navbar from "../navbar/page_logged_in";

interface Candidate {
  id: string;
  name: string;
  location: string;
  experienceLevel: string;
  about: string;
  skills: string[];
}

const candidates: Candidate[] = [
  {
    id: "1",
    name: "Alice Johnson",
    location: "New York, USA",
    experienceLevel: "Entry Level",
    about: "Aspiring frontend developer with React focus.",
    skills: ["React", "JavaScript", "HTML", "CSS"],
  },
  {
    id: "2",
    name: "Bob Smith",
    location: "Berlin, Germany",
    experienceLevel: "Mid",
    about: "Full-stack developer and DevOps enthusiast.",
    skills: ["Node.js", "Docker", "AWS", "React"],
  },
  {
    id: "3",
    name: "Charlie Rose",
    location: "Istanbul, Turkey",
    experienceLevel: "Senior",
    about: "UX designer with a passion for clean interfaces.",
    skills: ["UI/UX", "Figma", "Sketch"],
  },
  {
    id: "4",
    name: "Denise Miller",
    location: "Toronto, Canada",
    experienceLevel: "Junior",
    about: "Backend engineer focused on scalable APIs.",
    skills: ["Python", "Django", "PostgreSQL"],
  },
];

const availableSkills = [
  "React",
  "JavaScript",
  "TypeScript",
  "HTML",
  "CSS",
  "Node.js",
  "Docker",
  "AWS",
  "Figma",
  "Sketch",
  "UI/UX",
  "Python",
  "Django",
  "PostgreSQL",
  "MongoDB",
];

export default function CandidateListing() {
  const [searchSkill, setSearchSkill] = useState("");
  const [filterSkills, setFilterSkills] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const addSkill = (skill: string) => {
    const clean = skill.trim();
    if (clean && !filterSkills.includes(clean)) {
      setFilterSkills([...filterSkills, clean]);
      setSearchSkill("");
      setShowDropdown(false);
    }
  };

  const removeSkill = (skill: string) => {
    setFilterSkills((prev) => prev.filter((s) => s !== skill));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill(searchSkill);
    }
  };

  const filteredSkills = availableSkills.filter(
    (s) =>
      !filterSkills.includes(s) &&
      s.toLowerCase().includes(searchSkill.toLowerCase())
  );

  const filteredCandidates = candidates.filter((candidate) => {
    const lowerSkills = candidate.skills.map((s) => s.toLowerCase());
    return filterSkills.every((skill) =>
      lowerSkills.includes(skill.toLowerCase())
    );
  });

  return (
    <div className={styles.container}>
      <Navbar />
      <div className={styles.projectListing}>
        {/* Sidebar */}
        <div className={styles.sidebar}>
          <div className={styles.filterSection}>
            <h3 className={styles.filterTitle}>Filter by Skills</h3>
            <div className={styles.skillsInputContainer} style={{ position: "relative" }}>
              <input
                type="text"
                value={searchSkill}
                onChange={(e) => setSearchSkill(e.target.value)}
                onFocus={() => setShowDropdown(true)}
                onKeyDown={handleKeyPress}
                placeholder="Type a skill"
                className={styles.skillInput}
              />
              <button
                onClick={() => addSkill(searchSkill)}
                className={styles.addSkillBtn}
              >
                +
              </button>

              {/* Dropdown */}
              {showDropdown && filteredSkills.length > 0 && (
                <div className={styles.dropdown}>
                  {filteredSkills.map((skill) => (
                    <div
                      key={skill}
                      className={styles.dropdownItem}
                      onClick={() => addSkill(skill)}
                    >
                      {skill}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className={styles.skillsContainer}>
              {filterSkills.map((skill) => (
                <div key={skill} className={styles.skillTag}>
                  <span>{skill}</span>
                  <button
                    onClick={() => removeSkill(skill)}
                    className={styles.removeSkillBtn}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className={styles.mainContent}>
          <div className={styles.projectsGrid}>
            {filteredCandidates.length === 0 ? (
              <p>No matching candidates.</p>
            ) : (
              filteredCandidates.map((person) => (
                <div key={person.id} className={styles.projectCard}>
                  <div className={styles.projectHeader}>
                    <div className={styles.companyLogo}>👤</div>
                    <div className={styles.projectInfo}>
                      <h4 className={styles.projectTitle}>{person.name}</h4>
                      <div className={styles.projectDetails}>
                        <span className={styles.location}>
                          📍 {person.location}
                        </span>
                        <span className={styles.experience}>
                          🎓 {person.experienceLevel}
                        </span>
                      </div>
                      <p style={{ marginTop: "8px" }}>{person.about}</p>
                      <div style={{ marginTop: "8px" }}>
                        {person.skills.map((s) => (
                          <span key={s} className={styles.skillTag}>
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                    <button className={styles.applyBtn}>Contact</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
