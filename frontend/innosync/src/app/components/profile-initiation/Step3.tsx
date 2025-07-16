"use client";
import React, { useState } from "react";
import styles from "./page.module.css";
import Image from "next/image";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from "next/navigation";

interface WorkExperience {
  position: string;
  company: string;
  startMonth: string;
  startYear: string;
  endMonth: string;
  endYear: string;
  description: string;
}

interface FormData {
  fullName?: string;
  email?: string;
  avatar?: File;
  position?: string;
  technologies?: string[];
  expertise?: string;
  bio?: string;
  education?: string;
  resume?: File;
  workExperiences?: WorkExperience[];
  telegram?: string;
  github?: string;
  expertiseLevel?: string;
  experience?: string;
}

type Step3Props = {
  formData: FormData;
  setFormData: (data: FormData) => void;
  onBack: () => void;
};

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const YEARS = Array.from({ length: 30 }, (_, i) => (new Date().getFullYear() - i).toString());

const initialWorkExp: WorkExperience = {
  position: "",
  company: "",
  startMonth: "",
  startYear: "",
  endMonth: "",
  endYear: "",
  description: ""
};

function mapExperienceToEnum(experience?: string): string {
  switch (experience) {
    case "< 1 year": return "ZERO_TO_ONE";
    case "1-2 years": return "ONE_TO_THREE";
    case "3-5 years": return "THREE_TO_FIVE";
    case "5+ years": return "MORE_THAN_TEN";
    default: return "ZERO_TO_ONE";
  }
}

export default function Step3({ formData, setFormData, onBack }: Step3Props) {
  const token = localStorage.getItem("token");
  const router = useRouter();
  const [currentExp, setCurrentExp] = useState<WorkExperience>(initialWorkExp);
  const [showStartMonthDropdown, setShowStartMonthDropdown] = useState(false);
  const [showStartYearDropdown, setShowStartYearDropdown] = useState(false);
  const [showEndMonthDropdown, setShowEndMonthDropdown] = useState(false);
  const [showEndYearDropdown, setShowEndYearDropdown] = useState(false);
  const [error, setError] = useState("");
  const avatarInputRef = React.useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCurrentExp({ ...currentExp, [e.target.name]: e.target.value });
    if (error) setError("");
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

  // const fileToBase64 = (file: File): Promise<string> => {
  //   return new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.onload = () => resolve(reader.result as string);
  //     reader.onerror = reject;
  //     reader.readAsDataURL(file);
  //   });
  // };


  const handleDropdownSelect = (field: keyof WorkExperience, value: string) => {
    setCurrentExp({ ...currentExp, [field]: value });
    setShowStartMonthDropdown(false);
    setShowStartYearDropdown(false);
    setShowEndMonthDropdown(false);
    setShowEndYearDropdown(false);
    if (error) setError("");
  };



  const handleFinish = async () => {
    //let profilePictureRef = "";
    //let resumeRef = "";

    const hasPartialData = Object.values(currentExp).some(value => value.trim() !== "");

    if (hasPartialData) {
      if (!currentExp.position || !currentExp.company || !currentExp.startMonth ||
          !currentExp.startYear || !currentExp.endMonth || !currentExp.endYear) {
        setError("Please complete the current work experience or clear it before finishing.");
        return;
      }
    }
    const workExperiences = [
      ...(formData.workExperiences || []),
      ...(hasPartialData ? [currentExp] : [])
    ];

    // Hardcode startDate and endDate as '2025-06-30' for each work experience
    const transformedWorkExperience = workExperiences.map(exp => ({
      startDate: "2025-06-30",
      endDate: "2025-06-30",
      position: exp.position,
      company: exp.company,
      description: exp.description,
    }));

    // Build the profile payload (no resume/profilePicture fields)
    const payload = {
      telegram: formData.telegram || "",
      github: formData.github || "",
      bio: formData.bio || "",
      position: formData.position || "",
      education: formData.education || "NO_DEGREE",
      expertise: formData.expertise || "",
      expertise_level: formData.expertiseLevel || "ENTRY",
      experience_years: mapExperienceToEnum(formData.experience),
      work_experience: transformedWorkExperience,
      technologies: formData.technologies || [],
    };

    // 1. Submit the profile JSON
    //let profileId = null;
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(`Error: ${errorData.message || "Failed to create user."}`);
        return;
      }

      //const data = await response.json();
      //profileId = data.id;

      toast.success("Profile successfully created!", {
        position: 'top-center',
        autoClose: 2500,
      });
    } catch (err) {
      console.error("Submission error:", err);
      toast.error("Something went wrong. Please try again later.");
      return;
    }

    // 2. Upload avatar if present and is a File
    if (formData.avatar && formData.avatar instanceof File) {
      const formDataObj = new FormData();
      formDataObj.append("file", formData.avatar);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profile/upload-profile-picture`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: formDataObj,
      });
      if (res.ok) {
        //profilePictureRef = await res.json();
        toast.success("Profile picture uploaded successfully!");
      } else {
        toast.error("Failed to upload profile picture.");
        return;
      }
    }

    // 3. Upload resume if present and is a File
    if (formData.resume && formData.resume instanceof File) {
      const formDataObj = new FormData();
      formDataObj.append("file", formData.resume);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profile/upload-resume`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: formDataObj,
      });
      if (res.ok) {
        //resumeRef = await res.json();
        toast.success("Resume uploaded successfully!");
      } else {
        toast.error("Failed to upload resume.");
        return;
      }
    }

    // 4. Navigate to dashboard/overview if all succeeded
    // Trigger navbar refresh by dispatching a custom event
    window.dispatchEvent(new CustomEvent('profileUpdated'));

    setTimeout(() => {
      router.push("/dashboard/overview");
    }, 1000);
  };

  const handleAddAnother = () => {
    if (!currentExp.position || !currentExp.company || !currentExp.startMonth ||
        !currentExp.startYear || !currentExp.endMonth || !currentExp.endYear) {
      toast.error('Please fill all required fields before adding.', {
        position: 'top-center',
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });
      return;
    }
    setFormData({
      ...formData,
      workExperiences: [...(formData.workExperiences || []), currentExp],
    });
    setCurrentExp(initialWorkExp);
    setError("");
  };

  const closeAllDropdowns = () => {
    setShowStartMonthDropdown(false);
    setShowStartYearDropdown(false);
    setShowEndMonthDropdown(false);
    setShowEndYearDropdown(false);
  };

  return (
    <div className={styles.outerCard}>
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
            <div className={styles.label}>Work Experience:</div>
            <div className={styles.inputContainer}>
              <input
                className={styles.input}
                name="position"
                value={currentExp.position}
                onChange={handleChange}
                placeholder="Position"
              />
            </div>
          </div>
          <div className={styles.formGroup}>
            <div className={styles.label}>Company:</div>
            <div className={styles.inputContainer}>
              <input
                className={styles.input}
                name="company"
                value={currentExp.company}
                onChange={handleChange}
                placeholder="Company Name"
              />
            </div>
          </div>
          <div className={styles.formGroupRow}>
            <div className={styles.formGroupHalf}>
              <div className={styles.label}>Start Date:</div>
              <div className={styles.inputContainer}>
                <div className={styles.dateRow}>
                  <div className={styles.dropdownContainer}>
                    <button
                      type="button"
                      className={styles.dateDropdown}
                      onClick={() => {
                        closeAllDropdowns();
                        setShowStartMonthDropdown(!showStartMonthDropdown);
                      }}
                    >
                      <span className={styles.dropdownText}>
                        {currentExp.startMonth || "Start"}
                      </span>
                      <Image
                        src="/next_arrow.svg"
                        alt="Dropdown"
                        width={12}
                        height={12}
                        className={`${styles.dropdownArrow} ${showStartMonthDropdown ? styles.rotated : ''}`}
                      />
                    </button>
                    {showStartMonthDropdown && (
                      <div className={styles.dropdownMenu}>
                        {MONTHS.map((month) => (
                          <button
                            key={month}
                            type="button"
                            className={styles.dropdownItem}
                            onClick={() => handleDropdownSelect("startMonth", month)}
                          >
                            {month}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className={styles.dropdownContainer}>
                    <button
                      type="button"
                      className={styles.dateDropdown}
                      onClick={() => {
                        closeAllDropdowns();
                        setShowStartYearDropdown(!showStartYearDropdown);
                      }}
                    >
                      <span className={styles.dropdownText}>
                        {currentExp.startYear || "Year"}
                      </span>
                      <Image
                        src="/next_arrow.svg"
                        alt="Dropdown"
                        width={12}
                        height={12}
                        className={`${styles.dropdownArrow} ${showStartYearDropdown ? styles.rotated : ''}`}
                      />
                    </button>
                    {showStartYearDropdown && (
                      <div className={styles.dropdownMenu}>
                        {YEARS.map((year) => (
                          <button
                            key={year}
                            type="button"
                            className={styles.dropdownItem}
                            onClick={() => handleDropdownSelect("startYear", year)}
                          >
                            {year}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.formGroupHalf}>
              <div className={styles.label}>End Date:</div>
              <div className={styles.inputContainer}>
                <div className={styles.dateRow}>
                  <div className={styles.dropdownContainer}>
                    <button
                      type="button"
                      className={styles.dateDropdown}
                      onClick={() => {
                        closeAllDropdowns();
                        setShowEndMonthDropdown(!showEndMonthDropdown);
                      }}
                    >
                      <span className={styles.dropdownText}>
                        {currentExp.endMonth || "End"}
                      </span>
                      <Image
                        src="/next_arrow.svg"
                        alt="Dropdown"
                        width={12}
                        height={12}
                        className={`${styles.dropdownArrow} ${showEndMonthDropdown ? styles.rotated : ''}`}
                      />
                    </button>
                    {showEndMonthDropdown && (
                      <div className={styles.dropdownMenu}>
                        {MONTHS.map((month) => (
                          <button
                            key={month}
                            type="button"
                            className={styles.dropdownItem}
                            onClick={() => handleDropdownSelect("endMonth", month)}
                          >
                            {month}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className={styles.dropdownContainer}>
                    <button
                      type="button"
                      className={styles.dateDropdown}
                      onClick={() => {
                        closeAllDropdowns();
                        setShowEndYearDropdown(!showEndYearDropdown);
                      }}
                    >
                      <span className={styles.dropdownText}>
                        {currentExp.endYear || "Year"}
                      </span>
                      <Image
                        src="/next_arrow.svg"
                        alt="Dropdown"
                        width={12}
                        height={12}
                        className={`${styles.dropdownArrow} ${showEndYearDropdown ? styles.rotated : ''}`}
                      />
                    </button>
                    {showEndYearDropdown && (
                      <div className={styles.dropdownMenu}>
                        {YEARS.map((year) => (
                          <button
                            key={year}
                            type="button"
                            className={styles.dropdownItem}
                            onClick={() => handleDropdownSelect("endYear", year)}
                          >
                            {year}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.formGroup}>
            <div className={styles.label}>Work Description:</div>
            <div className={styles.textareaContainer}>
              <textarea
                className={styles.textarea}
                name="description"
                value={currentExp.description}
                onChange={handleChange}
                placeholder="Work Description"
                maxLength={300}
              />
            </div>
          </div>
          {error && (
            <div className={styles.errorMessage}>{error}</div>
          )}
        </div>
        <div className={styles.buttonContainer}>
          <button className={styles.addAnotherButton} onClick={handleAddAnother} type="button">
            <span className={styles.addAnotherText}>
              ADD<br />ANOTHER
            </span>
            <Image
              src="/add_circle.svg"
              alt="Add"
              width={35}
              height={35}
              className={styles.addIcon}
            />
          </button>
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
          <button className={styles.finishButton} onClick={handleFinish} type="button">
            Finish
            <Image
              src="/next_arrow.svg"
              alt="Finish"
              width={20}
              height={20}
              className={styles.nextIcon}
            />
          </button>
        </div>
      </div>
      <ToastContainer aria-label="Error notification" />
    </div>
  );
}
