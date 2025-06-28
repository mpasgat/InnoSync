import Image from "next/image";
import styles from "./page.module.css"

const HomePage = () => {
  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <main className={styles.hero}>
        <div className={styles.heroContentFigma}>
          {/* Left: Headline and Subtitle */}
          <div className={styles.heroLeftFigma}>
            <h1 className={styles.heroTitleFigma}>
              One Platform<br />
              to <span className={styles.titleAccent}>Work</span> and<br />
              <span className={styles.titleAccent}>Sync</span> It All.
            </h1>
            <p className={styles.heroSubtitleFigma}>
              Forget endless searching. The perfect match is one sync away.
            </p>

            {/* CTA Buttons */}
            <div className={styles.ctaButtonsFigma}>
              <button className={styles.primaryCtaFigma}>Get Started</button>
              <button className={styles.secondaryCtaFigma}>Learn more</button>
            </div>

            {/* Trusted By Section */}
            <div className={styles.trustedBySection}>
              <span className={styles.trustedByText}>Trusted by</span>
              <Image
                src="/innopolis_logo_vector.svg"
                alt="Innopolis University Logo"
                className={styles.innopolisLogo}
                width={150}
                height={41}
              />
            </div>
          </div>

          {/* Right: Illustration */}
          <div className={styles.heroRightFigma}>
            <Image
              src="/landing_page.svg"
              alt="Teamwork illustration"
              className={styles.heroIllustrationFigma}
              width={768}
              height={768}
              priority
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
