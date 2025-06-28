import React, { useRef } from "react";
import styles from "./page.module.css";
import Image from "next/image";

interface FormData {
  fullName?: string;
  email?: string;
  telegram?: string;
  github?: string;
  bio?: string;
  avatar?: string;
}

type Step1Props = {
  formData: FormData;
  setFormData: (data: FormData) => void;
  onNext: () => void;
};

export default function Step1({ formData, setFormData, onNext }: Step1Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const result = ev.target?.result;
        if (typeof result === 'string') {
          setFormData({ ...formData, avatar: result });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={styles.outerCard}>
      <div className={styles.leftPanel}>
        <div className={styles.avatarContainer}>
          <div className={styles.avatarBox} onClick={handleAvatarClick}>
            {formData.avatar ? (
              <Image
                src={formData.avatar}
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
              ref={fileInputRef}
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
            <div className={styles.label}>Full Name:</div>
            <div className={styles.inputContainer}>
              <input
                className={styles.input}
                name="fullName"
                value={formData.fullName || ""}
                onChange={handleChange}
                placeholder="Ahmed Baha Eddine Alimi"
                autoComplete="name"
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <div className={styles.label}>Email:</div>
            <div className={styles.inputContainer}>
              <input
                className={styles.input}
                name="email"
                value={formData.email || ""}
                onChange={handleChange}
                placeholder="3llimi69@gmail.com"
                autoComplete="email"
                type="email"
              />
            </div>
          </div>

          <div className={styles.formGroupRow}>
            <div className={styles.formGroupHalf}>
              <div className={styles.label}>Telegram:</div>
              <div className={styles.inputContainer}>
                <input
                  className={styles.input}
                  name="telegram"
                  value={formData.telegram || ""}
                  onChange={handleChange}
                  placeholder="Alias"
                  autoComplete="off"
                />
              </div>
            </div>
            <div className={styles.formGroupHalf}>
              <div className={styles.label}>Github:</div>
              <div className={styles.inputContainer}>
                <input
                  className={styles.input}
                  name="github"
                  value={formData.github || ""}
                  onChange={handleChange}
                  placeholder="Alias"
                  autoComplete="off"
                />
              </div>
            </div>
          </div>

          <div className={styles.formGroup}>
            <div className={styles.label}>Bio:</div>
            <div className={styles.textareaContainer}>
              <textarea
                className={styles.textarea}
                name="bio"
                value={formData.bio || ""}
                onChange={handleChange}
                placeholder="Bio"
                maxLength={300}
              />
            </div>
          </div>
        </div>

        <div className={styles.buttonContainer}>
          <button className={styles.nextButton} onClick={onNext} type="button">
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
