import React, { useState, useRef } from "react";
import styles from "./page.module.css";
import Image from "next/image";

interface FormData {
  fullName?: string;
  email?: string;
  avatar?: File;
  position?: string;
  technologies?: string[];
  expertise?: string;
  experience?: string;
  education?: string;
  resume?: File;
}

type Step2Props = {
  formData: FormData;
  setFormData: (data: FormData) => void;
  onNext: () => void;
  onBack: () => void;
};

const EXPERTISE_LEVELS = ["ENTRY", "JUNIOR", "MID", "SENIOR", "RESEARCHER"];
const EXPERIENCE_YEARS = ["< 1 year", "1-3 years", "3-5 years", "5-7 years", "7-10 years", "10+ years"];
const EDUCATION_DEGREES = ["NO_DEGREE", "BACHELOR", "MASTER", "PHD"];

export default function Step2({ formData, setFormData, onNext, onBack }: Step2Props) {
  const [showExpertiseDropdown, setShowExpertiseDropdown] = useState(false);
  const [showExperienceDropdown, setShowExperienceDropdown] = useState(false);
  const [showEducationDropdown, setShowEducationDropdown] = useState(false);
  const [currentTech, setCurrentTech] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvatarClick = () => {
    avatarInputRef.current?.click();
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, avatar: file });
    }
  };

    const handleRemoveTech = (techToRemove: string) => {
    setFormData({
      ...formData,
      technologies: (formData.technologies || []).filter((tech) => tech !== techToRemove),
    });
  };

  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleAddTech = () => {
    if (currentTech.trim() && !formData.technologies?.includes(currentTech.trim())) {
      const currentTechs = formData.technologies || [];

      if (currentTechs.length >= 8) {
        showToastMessage("You can only add up to 8 technologies");
        return;
      }

      setFormData({
        ...formData,
        technologies: [...currentTechs, currentTech.trim()]
      });
      setCurrentTech("");
    }
  };

  const handleTechKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTech();
    }
  };

  const validateForm = () => {
    if (!formData.position?.trim()) {
      showToastMessage("Please enter your position");
      return false;
    }
    if (!formData.technologies || formData.technologies.length === 0) {
      showToastMessage("Please add at least one technology");
      return false;
    }
    if (!formData.expertise) {
      showToastMessage("Please select your expertise level");
      return false;
    }
    if (!formData.experience) {
      showToastMessage("Please select your experience level");
      return false;
    }
    if (!formData.education) {
      showToastMessage("Please select your education level");
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (validateForm()) {
      onNext();
    }
  };

  const handleDropdownSelect = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    setShowExpertiseDropdown(false);
    setShowExperienceDropdown(false);
    setShowEducationDropdown(false);
  };

  // const fileToBase64 = (file: File): Promise<string> => {
  //   return new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.onload = () => resolve(reader.result as string);
  //     reader.onerror = reject;
  //     reader.readAsDataURL(file);
  //   });
  // };

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, resume: file });
    }
  };

  return (
    <div className={styles.outerCard}>
      {showToast && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            backgroundColor: '#ff4444',
            color: 'white',
            padding: '12px 20px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            zIndex: 1000,
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          {toastMessage}
        </div>
      )}
      <div className={styles.leftPanel}>
        <div className={styles.avatarContainer}>
          <div className={styles.avatarBox} onClick={handleAvatarClick}>
            {formData.avatar ? (
              <Image
                src={
                  typeof formData.avatar === "string"
                    ? formData.avatar
                    : formData.avatar
                    ? URL.createObjectURL(formData.avatar)
                    : ""
                }
                alt="avatar"
                className={styles.avatarImg}
                width={80}
                height={80}
                style={{ objectFit: 'cover', borderRadius: '50%' }}
              />
            ) : (
              <span className={styles.avatarPlus}>+</span>
            )}
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              ref={avatarInputRef}
              onChange={handleAvatarChange}
            />
          </div>
          <div className={styles.userInfo}>
            <div className={styles.leftName}>{formData.fullName || "A.Baha Alimi"}</div>
            <div className={styles.leftEmail}>{formData.email || "3llimi69@gmail.com"}</div>
          </div>
        </div>
      </div>

      <div className={styles.rightPanel}>
        <div className={styles.formContainer}>
          <div className={styles.formGroup}>
            <div className={styles.label}>Position:</div>
            <div className={styles.inputContainer}>
              <input
                className={styles.input}
                name="position"
                value={formData.position || ""}
                onChange={handleChange}
                placeholder="e.g., Junior GUI Developer"
              />
            </div>
          </div>
          <div className={styles.formGroup}>
            <div className={styles.label}>Technologies:</div>
            <div className={styles.inputContainer}>
              <div className={styles.techContainer}>
                <div className={styles.techTags}>
                  {(formData.technologies || []).map((tech) => (
                    <div key={tech} className={styles.techTag}>
                      <span className={styles.techText}>{tech}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTech(tech)}
                        className={styles.removeBtn}
                      >
                        <Image
                          src="/close_icon.svg"
                          alt="Remove"
                          width={15}
                          height={15}
                          className={styles.closeIcon}
                        />
                      </button>
                    </div>
                  ))}
                  <input
                    style={{
                      border: 'none',
                      outline: 'none',
                      background: 'transparent',
                      fontSize: 'inherit',
                      fontFamily: 'inherit',
                      color: 'inherit',
                      minWidth: '120px',
                      flex: 1
                    }}
                    value={currentTech}
                    onChange={(e) => setCurrentTech(e.target.value)}
                    onKeyPress={handleTechKeyPress}
                    placeholder={(!formData.technologies || formData.technologies.length === 0) ? "Type technology and press Enter" : ""}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className={styles.formGroupRow}>
            <div className={styles.formGroupHalf}>
              <div className={styles.label}>Expertise:</div>
              <div className={styles.inputContainer}>
                <div className={styles.dropdownContainer}>
                  <button
                    type="button"
                    className={styles.dropdown}
                    onClick={() => setShowExpertiseDropdown(!showExpertiseDropdown)}
                  >
                    <span className={styles.dropdownText}>
                      {formData.expertise || "Expertise"}
                    </span>
                    <Image
                      src="/next_arrow.svg"
                      alt="Dropdown"
                      width={12}
                      height={12}
                      className={`${styles.dropdownArrow} ${showExpertiseDropdown ? styles.rotated : ''}`}
                    />
                  </button>
                  {showExpertiseDropdown && (
                    <div className={styles.dropdownMenu}>
                      {EXPERTISE_LEVELS.map((level) => (
                        <button
                          key={level}
                          type="button"
                          className={styles.dropdownItem}
                          onClick={() => handleDropdownSelect("expertise", level)}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className={styles.formGroupHalf}>
              <div className={styles.label}>Experience:</div>
              <div className={styles.inputContainer}>
                <div className={styles.dropdownContainer}>
                  <button
                    type="button"
                    className={styles.dropdown}
                    onClick={() => setShowExperienceDropdown(!showExperienceDropdown)}
                  >
                    <span className={styles.dropdownText}>
                      {formData.experience || "Years"}
                    </span>
                    <Image
                      src="/next_arrow.svg"
                      alt="Dropdown"
                      width={12}
                      height={12}
                      className={`${styles.dropdownArrow} ${showExperienceDropdown ? styles.rotated : ''}`}
                    />
                  </button>
                  {showExperienceDropdown && (
                    <div className={styles.dropdownMenu}>
                      {EXPERIENCE_YEARS.map((years) => (
                        <button
                          key={years}
                          type="button"
                          className={styles.dropdownItem}
                          onClick={() => handleDropdownSelect("experience", years)}
                        >
                          {years}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className={styles.formGroup}>
            <div className={styles.label}>Education:</div>
            <div className={styles.inputContainer}>
              <div className={styles.dropdownContainer}>
                <button
                  type="button"
                  className={`${styles.dropdown} ${styles.fullWidth}`}
                  onClick={() => setShowEducationDropdown(!showEducationDropdown)}
                >
                  <span className={styles.dropdownText}>
                    {formData.education || "Degree"}
                  </span>
                  <Image
                    src="/next_arrow.svg"
                    alt="Dropdown"
                    width={12}
                    height={12}
                    className={`${styles.dropdownArrow} ${showEducationDropdown ? styles.rotated : ''}`}
                  />
                </button>
                {showEducationDropdown && (
                  <div className={`${styles.dropdownMenu} ${styles.fullWidth}`}>
                    {EDUCATION_DEGREES.map((degree) => (
                      <button
                        key={degree}
                        type="button"
                        className={styles.dropdownItem}
                        onClick={() => handleDropdownSelect("education", degree)}
                      >
                        {degree}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className={styles.formGroup}>
            <input
              type="file"
              accept="application/pdf,.doc,.docx"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleResumeChange}
            />
            <button
              className={styles.resumeUploadBtn}
              type="button"
              onClick={() => fileInputRef.current?.click()}
            >
              Upload resume
            </button>
          </div>
        </div>
        <div className={styles.buttonContainer}>
          <button className={styles.backButton} onClick={onBack} type="button">
            <Image
              src="/next_arrow.svg"
              alt="Back"
              width={20}
              height={20}
              className={styles.backIcon}
            />
            Back
          </button>
          <button className={styles.nextButton} onClick={handleNext} type="button">
            Next
            <Image
              src="/next_arrow.svg"
              alt="Next"
              width={20}
              height={20}
              className={styles.nextIcon}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
