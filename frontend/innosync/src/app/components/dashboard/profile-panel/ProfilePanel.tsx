"use client";
import React, { useState } from "react";
import Image from "next/image";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from "./ProfilePanel.module.css";

export default function ProfilePanel() {
  const [positions, setPositions] = useState([
    "Frontend Dev",
    "Sys Admin",
    "DB Admin"
  ]);

  const [technologies, setTechnologies] = useState([
    "Angular", "React", "Vue", "PostgreSQL",
    "Docker", "Figma", "Git", "Svelte", "Python"
  ]);

  const [quickSyncEnabled, setQuickSyncEnabled] = useState(false);

  const removePosition = (index: number) => {
    setPositions(positions.filter((_, i) => i !== index));
  };

  const removeTechnology = (index: number) => {
    setTechnologies(technologies.filter((_, i) => i !== index));
  };

    const handleQuickSyncToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isEnabled = e.target.checked;
    setQuickSyncEnabled(isEnabled);

    if (isEnabled) {
      toast.success('QuickSync has been enabled! You will receive instant notifications for relevant opportunities.', {
        position: 'bottom-left',
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });
    } else {
      toast.info('QuickSync has been disabled. You will no longer receive instant notifications.', {
        position: 'bottom-left',
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });
    }
  };

  return (
    <div className={styles.profilePanel}>
      {/* Profile Header */}
      <div className={styles.profileHeader}>
        <div className={styles.profileImage}>
          <Image
            src="/profile_image.png"
            alt="Ahmed Baha Eddine Alimi"
            width={150}
            height={150}
            className={styles.profileImg}
          />
        </div>
        <div className={styles.profileInfo}>
          <h3 className={styles.profileName}>
            Ahmed Baha Eddine<br />Alimi
          </h3>
          <div className={styles.profileEmail}>
            <div className={styles.emailIcon}>
              <Image
                src="/mail_icon.svg"
                alt="Email"
                width={24}
                height={24}
              />
            </div>
            <span className={styles.emailText}>3llimi69@gmail.com</span>
          </div>
          <div className={styles.socialLinks}>
            <div className={styles.socialLink}>
              <div className={styles.socialIcon}>
                <Image
                  src="/telegram_icon.svg"
                  alt="Telegram"
                  width={15}
                  height={15}
                />
              </div>
              <span>@Allimi3</span>
            </div>
            <div className={styles.socialLink}>
              <div className={styles.socialIcon}>
                <Image
                  src="/github_icon.svg"
                  alt="GitHub"
                  width={15}
                  height={15}
                />
              </div>
              <span>3llimi</span>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Details */}
      <div className={styles.profileDetails}>
        {/* Bio Section */}
        <div className={styles.bioSection}>
          <p className={styles.bioText}>
            <strong>Bio:</strong><br />
            I am a Computer Science student at Innopolis University, studying on a full scholarship from the Russian Government. With a solid foundation in web and mobile development, coupled with experience in competitive programming, I have cultivated a diverse skill set through active participation in numerous hackathons and competitions. Always eager to learn and grow, I am constantly seeking new challenges and opportunities to apply my knowledge to real-world projects.
          </p>
        </div>

        {/* Skills Section */}
        <div className={styles.skillsContainer}>
          {/* Positions Section */}
          <div className={styles.skillsSection}>
            <h4 className={styles.sectionTitle}>Positions:</h4>
            <div className={styles.skillTags}>
              <div className={styles.tagRow}>
                <span className={`${styles.skillTag} ${styles.frontendDev}`}>
                  <div className={styles.tagContent}>
                    <span className={styles.tagText}>Frontend Dev</span>
                    <button
                      className={styles.removeTag}
                      onClick={() => removePosition(0)}
                    >
                      <Image
                        src="/close_icon.svg"
                        alt="Remove"
                        width={15}
                        height={15}
                      />
                    </button>
                  </div>
                </span>
                <span className={`${styles.skillTag} ${styles.sysAdmin}`}>
                  <div className={styles.tagContent}>
                    <span className={styles.tagText}>Sys Admin</span>
                    <button
                      className={styles.removeTag}
                      onClick={() => removePosition(1)}
                    >
                      <Image
                        src="/close_icon.svg"
                        alt="Remove"
                        width={15}
                        height={15}
                      />
                    </button>
                  </div>
                </span>
              </div>
              <div className={styles.tagRow}>
                <span className={`${styles.skillTag} ${styles.dbAdmin}`}>
                  <div className={styles.tagContent}>
                    <span className={styles.tagText}>DB Admin</span>
                    <button
                      className={styles.removeTag}
                      onClick={() => removePosition(2)}
                    >
                      <Image
                        src="/close_icon.svg"
                        alt="Remove"
                        width={15}
                        height={15}
                      />
                    </button>
                  </div>
                </span>
                <button className={styles.addTag}>
                  <Image
                    src="/add_circle.svg"
                    alt="Add"
                    width={20}
                    height={20}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Technologies Section */}
          <div className={styles.skillsSection}>
            <h4 className={styles.sectionTitle}>Technologies:</h4>
            <div className={styles.skillTags}>
              <div className={styles.tagRow}>
                <span className={`${styles.skillTag} ${styles.angular}`}>
                  <div className={styles.tagContent}>
                    <span className={styles.tagText}>Angular</span>
                    <button
                      className={styles.removeTag}
                      onClick={() => removeTechnology(0)}
                    >
                      <Image
                        src="/close_icon.svg"
                        alt="Remove"
                        width={15}
                        height={15}
                      />
                    </button>
                  </div>
                </span>
                <span className={`${styles.skillTag} ${styles.react}`}>
                  <div className={styles.tagContent}>
                    <span className={styles.tagText}>React</span>
                    <button
                      className={styles.removeTag}
                      onClick={() => removeTechnology(1)}
                    >
                      <Image
                        src="/close_icon.svg"
                        alt="Remove"
                        width={15}
                        height={15}
                      />
                    </button>
                  </div>
                </span>
                <span className={`${styles.skillTag} ${styles.vue}`}>
                  <div className={styles.tagContent}>
                    <span className={styles.tagText}>Vue</span>
                    <button
                      className={styles.removeTag}
                      onClick={() => removeTechnology(2)}
                    >
                      <Image
                        src="/close_icon.svg"
                        alt="Remove"
                        width={15}
                        height={15}
                      />
                    </button>
                  </div>
                </span>
              </div>
              <div className={styles.tagRow}>
                <span className={`${styles.skillTag} ${styles.postgresql}`}>
                  <div className={styles.tagContent}>
                    <span className={styles.tagText}>PostgreSQL</span>
                    <button
                      className={styles.removeTag}
                      onClick={() => removeTechnology(3)}
                    >
                      <Image
                        src="/close_icon.svg"
                        alt="Remove"
                        width={15}
                        height={15}
                      />
                    </button>
                  </div>
                </span>
                <span className={`${styles.skillTag} ${styles.docker}`}>
                  <div className={styles.tagContent}>
                    <span className={styles.tagText}>Docker</span>
                    <button
                      className={styles.removeTag}
                      onClick={() => removeTechnology(4)}
                    >
                      <Image
                        src="/close_icon.svg"
                        alt="Remove"
                        width={15}
                        height={15}
                      />
                    </button>
                  </div>
                </span>
                <span className={`${styles.skillTag} ${styles.figma}`}>
                  <div className={styles.tagContent}>
                    <span className={styles.tagText}>Figma</span>
                    <button
                      className={styles.removeTag}
                      onClick={() => removeTechnology(5)}
                    >
                      <Image
                        src="/close_icon.svg"
                        alt="Remove"
                        width={15}
                        height={15}
                      />
                    </button>
                  </div>
                </span>
              </div>
              <div className={styles.tagRow}>
                <span className={`${styles.skillTag} ${styles.git}`}>
                  <div className={styles.tagContent}>
                    <span className={styles.tagText}>Git</span>
                    <button
                      className={styles.removeTag}
                      onClick={() => removeTechnology(6)}
                    >
                      <Image
                        src="/close_icon.svg"
                        alt="Remove"
                        width={15}
                        height={15}
                      />
                    </button>
                  </div>
                </span>
                <span className={`${styles.skillTag} ${styles.svelte}`}>
                  <div className={styles.tagContent}>
                    <span className={styles.tagText}>Svelte</span>
                    <button
                      className={styles.removeTag}
                      onClick={() => removeTechnology(7)}
                    >
                      <Image
                        src="/close_icon.svg"
                        alt="Remove"
                        width={15}
                        height={15}
                      />
                    </button>
                  </div>
                </span>
                <span className={`${styles.skillTag} ${styles.python}`}>
                  <div className={styles.tagContent}>
                    <span className={styles.tagText}>Python</span>
                    <button
                      className={styles.removeTag}
                      onClick={() => removeTechnology(8)}
                    >
                      <Image
                        src="/close_icon.svg"
                        alt="Remove"
                        width={15}
                        height={15}
                      />
                    </button>
                  </div>
                </span>
                <button className={styles.addTag}>
                  <Image
                    src="/add_circle.svg"
                    alt="Add"
                    width={20}
                    height={20}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* QuickSync Toggle */}
        <div className={styles.settingsSection}>
          <div className={styles.settingItem}>
            <span className={styles.settingLabel}>Enable QuickSync</span>
            <div className={styles.toggleSwitch}>
              <input
                type="checkbox"
                id="quicksync"
                checked={quickSyncEnabled}
                onChange={handleQuickSyncToggle}
              />
              <label htmlFor="quicksync" className={styles.toggleLabel}></label>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notifications */}
      <ToastContainer aria-label="Notification" />
    </div>
  );
}