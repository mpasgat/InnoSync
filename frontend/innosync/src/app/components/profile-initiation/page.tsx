"use client";
import React, { useState } from "react";
import styles from "./page.module.css";

// Step components (to be implemented in separate files)
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";

export default function ProfileInitiationPage() {
  const [step, setStep] = useState(1);
  // Form data state (to be expanded)
  const [formData, setFormData] = useState({});

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
