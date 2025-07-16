"use client";
import React, { useState } from "react";
import styles from "./insideOfProjPage.module.css";

const ProjectDetails = () => {
  const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);
  const [activities, setActivities] = useState([
    "UI&UI for pages ready and implemented by member 1",
    "Backend API are ready for main pages by member 2",
    "API fetch and deploy ready by member 1 and 2",
  ]);
  const [showInput, setShowInput] = useState(false);
  const [newActivity, setNewActivity] = useState("");

  const teamMembers = [
    { name: "Member 1 full name:", role: "his or her role" },
    { name: "Member 2 full name:", role: "his or her role" },
  ];

  const handleMenuClick = (idx: number) => {
    setOpenMenuIndex(openMenuIndex === idx ? null : idx);
  };

  const handleAddClick = () => {
    setShowInput((prev) => !prev);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewActivity(e.target.value);
  };

  const handleAddActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (newActivity.trim()) {
      setActivities([newActivity, ...activities]);
      setNewActivity("");
      setShowInput(false);
    }
  };

  return (
    <div className={styles.projectDetails}>
      <h1 className={styles.projectTitle}>Project name</h1>

      <div className={styles.projectLayout}>
        {/* Project Description Section */}
        <div className={styles.projectDescriptionCard}>
          <div className={styles.cardHeader}>
            <h2>Project description</h2>
          </div>

          <div className={styles.descriptionContent}>
            <p>
              Project aims to solve problems in development that are essential
              for our generation and for 21st centuary. It will have huge impact
              in the IT world and will help developers to archive more things in
              their career.
            </p>

            <div className={styles.projectDetailsList}>
              <div className={styles.detailItem}>Project start: 1st June</div>
              <div className={styles.detailItem}>Project deadline: 26th July</div>
              <div className={styles.detailItem}>Project budget: 1$</div>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className={styles.teamCard}>
          <div className={styles.cardHeader}>
            <h2>Team</h2>
          </div>

          <div className={styles.teamContent}>
            {teamMembers.map((member, idx) => (
              <div className={styles.memberItem} key={idx} style={{ position: "relative" }}>
                <div className={styles.memberInfo}>
                  <div className={styles.memberName}>{member.name}</div>
                  <div className={styles.memberRole}>{member.role}</div>
                </div>
                <button
                  className={styles.memberMenu}
                  onClick={() => handleMenuClick(idx)}
                  aria-label="Open member menu"
                >
                  ⋯
                </button>
                {openMenuIndex === idx && (
                  <div className={`${styles.todoDropdown} ${styles.todoDropdownShow}`}>
                    <div className={styles.todoActions}>
                      <span className={styles.todoAction}>to do list</span>
                      <span className={styles.todoAction}>assign task</span>
                      <span className={styles.todoAction}>kick out</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activities Section */}
      <div className={styles.activitiesCard}>
        <div className={styles.activitiesHeader}>
          <h2>Recent activities(progress):</h2>
          <button className={styles.addButton} onClick={handleAddClick}>+</button>
        </div>
        {showInput && (
          <form className={styles.addActivityForm} onSubmit={handleAddActivity}>
            <input
              className={styles.addActivityInput}
              type="text"
              value={newActivity}
              onChange={handleInputChange}
              placeholder="Enter new activity..."
              autoFocus
            />
            <button className={styles.addActivitySubmit} type="submit">Add</button>
          </form>
        )}
        <div className={styles.activitiesList}>
          {activities.map((activity, idx) => (
            <div className={styles.activityItem} key={idx}>
              {activity}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;