"use client";
import React, { useState, useEffect } from "react";
import styles from "./page.module.css";

// Step components (to be implemented in separate files)
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";

export default function ProfileInitiationPage() {
  const [step, setStep] = useState(1);
  // Form data state initialized with user's signup information
  const [formData, setFormData] = useState({});

  useEffect(() => {
    // Get user data from localStorage (stored during signup)
    const userEmail = localStorage.getItem('userEmail');
    const userFullName = localStorage.getItem('userFullName');

    if (userEmail || userFullName) {
      setFormData(prev => ({
        ...prev,
        email: userEmail || "",
        fullName: userFullName || ""
      }));
    }
  }, []);

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  return (
    <div className={styles.container}>
      {step === 1 && <Step1 formData={formData} setFormData={setFormData} onNext={nextStep} />}
      {step === 2 && <Step2 formData={formData} setFormData={setFormData} onNext={nextStep} onBack={prevStep} />}
      {step === 3 && <Step3 formData={formData} setFormData={setFormData} onBack={prevStep} />}
    </div>
  );
}
