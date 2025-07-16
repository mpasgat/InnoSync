"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from "./ProfilePanel.module.css";

interface ProfileData {
  id: number;
  email: string;
  fullName: string;
  telegram: string;
  github: string;
  bio: string;
  position: string;
  education: string;
  expertise: string;
  expertiseLevel: string;
  resume: string;
  profilePicture: string;
  workExperience: Array<{
    startDate: string;
    endDate: string;
    position: string;
    company: string;
    description: string;
  }>;
  technologies: string[];
}

export default function ProfilePanel() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [profilePicUrl, setProfilePicUrl] = useState<string>("");
  const [resumeUrl, setResumeUrl] = useState<string>("");
  const [positions, setPositions] = useState<string[]>([]);
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [quickSyncEnabled, setQuickSyncEnabled] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profile/me`, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
          setPositions(data.position ? [data.position] : []);
          setTechnologies(data.technologies || []);

          // Fetch profile picture
          if (data.id) {
            const picRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profile/${data.id}/picture`, {
              headers: { "Authorization": `Bearer ${token}` }
            });
            if (picRes.ok) {
              // If backend returns a URL, use it directly. If it returns a blob, create an object URL.
              const blob = await picRes.blob();
              setProfilePicUrl(URL.createObjectURL(blob));
            }

            // Fetch resume
            const resumeRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profile/${data.id}/resume`, {
              headers: { "Authorization": `Bearer ${token}` }
            });
            if (resumeRes.ok) {
              const blob = await resumeRes.blob();
              setResumeUrl(URL.createObjectURL(blob));
            }
          }
        } else {
          toast.error("Failed to load profile.");
        }
      } catch (err) {
        console.log("Error loading profile:", err);
        toast.error("Error loading profile.");
      }
    }
    loadProfile();
  }, []);

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
            src={profilePicUrl || "/profile_image.png"}
            alt={profile ? profile.fullName : "Profile"}
            width={150}
            height={150}
            className={styles.profileImg}
          />
        </div>
        <div className={styles.profileInfo}>
          <h3 className={styles.profileName}>
            {profile ? profile.fullName : "Loading..."}
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
            <span className={styles.emailText}>{profile ? profile.email : ""}</span>
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
              <span>{profile ? profile.telegram : ""}</span>
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
              <span>{profile ? profile.github : ""}</span>
            </div>
          </div>
          {/* Resume download link */}
          {resumeUrl && (
            <div style={{ marginTop: "10px" }}>
              <a href={resumeUrl} download="resume.pdf" target="_blank" rel="noopener noreferrer">
                Download Resume
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Profile Details */}
      <div className={styles.profileDetails}>
        {/* Bio Section */}
        <div className={styles.bioSection}>
          <p className={styles.bioText}>
            <strong>Bio:</strong><br />
            {profile ? profile.bio : ""}
          </p>
        </div>

        {/* Skills Section */}
        <div className={styles.skillsContainer}>
          {/* Positions Section */}
          <div className={styles.skillsSection}>
            <h4 className={styles.sectionTitle}>Positions:</h4>
            <div className={styles.skillTags}>
              <div className={styles.tagRow}>
                {positions.map((pos, idx) => (
                  <span key={pos} className={styles.skillTag}>
                    <div className={styles.tagContent}>
                      <span className={styles.tagText}>{pos}</span>
                      <button
                        className={styles.removeTag}
                        onClick={() => removePosition(idx)}
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
                ))}
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
                {technologies.map((tech, idx) => (
                  <span key={tech} className={styles.skillTag}>
                    <div className={styles.tagContent}>
                      <span className={styles.tagText}>{tech}</span>
                      <button
                        className={styles.removeTag}
                        onClick={() => removeTechnology(idx)}
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
                ))}
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