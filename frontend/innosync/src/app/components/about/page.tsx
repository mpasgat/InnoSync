"use client";
import React from "react";
import styles from "./AboutPage.module.css";

export default function AboutPage() {
  return (
    <div className={styles.aboutContainer}>
      <div className={styles.aboutContent}>
        {/* Header */}
        <div className={styles.aboutHeader}>
          <h1 className={styles.aboutTitle}>
            About <span className={styles.brandName}>InnoSync</span>
          </h1>
          <p className={styles.aboutSubtitle}>
            Connecting brilliant minds to build the future through seamless collaboration
          </p>
        </div>

        {/* Stats */}
        <div className={styles.statsRow}>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>500+</div>
            <div className={styles.statLabel}>Developers</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>150+</div>
            <div className={styles.statLabel}>Projects</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>98%</div>
            <div className={styles.statLabel}>Success Rate</div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className={styles.contentGrid}>
          {/* Mission */}
          <div className={styles.contentCard}>
            <h3 className={styles.cardTitle}>Our Mission</h3>
            <p className={styles.cardText}>
              Bridge the gap between exceptional talent and groundbreaking projects. 
              Empower developers to showcase skills and collaborate on future-shaping technology.
            </p>
          </div>

          {/* Features */}
          <div className={styles.contentCard}>
            <h3 className={styles.cardTitle}>Key Features</h3>
            <div className={styles.featureList}>
              <div className={styles.featureItem}>🎯 Smart AI Matching</div>
              <div className={styles.featureItem}>🚀 Project Management</div>
              <div className={styles.featureItem}>💡 Innovation Hub</div>
              <div className={styles.featureItem}>🌐 Global Community</div>
            </div>
          </div>

          {/* How it Works */}
          <div className={styles.contentCard}>
            <h3 className={styles.cardTitle}>How It Works</h3>
            <div className={styles.stepsList}>
              <div className={styles.stepItem}>1. Create Profile</div>
              <div className={styles.stepItem}>2. Discover Projects</div>
              <div className={styles.stepItem}>3. Collaborate & Build</div>
              <div className={styles.stepItem}>4. Achieve Success</div>
            </div>
          </div>

          {/* Vision */}
          <div className={styles.contentCard}>
            <h3 className={styles.cardTitle}>Our Vision</h3>
            <p className={styles.cardText}>
              A world where geographical boundaries do not limit collaboration, 
              where every developer has access to meaningful projects, and innovation 
              thrives through diverse, passionate communities.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
