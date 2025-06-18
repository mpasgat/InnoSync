// import React from "react";

// export default function NavbarPage() {
//   return <div>Dashboard → Navbar Page</div>;
// }

// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { ChevronDown } from "lucide-react";
// import styles from "./page.module.css";

// const HomePage = () => {
//   return (
//     <div className={styles.container}>
//       {/* Navigation */}
//       <nav className={styles.navbar}>
//         <div className={styles.navContent}>
//           {/* Logo */}
//           <div className={styles.logo}>
//             <span className={styles.logoText}>
//               Inno<span className={styles.logoAccent}>Sync</span>
//             </span>
//           </div>

//           {/* Navigation Links */}
//           <div className={styles.navLinks}>
//             <DropdownMenu>
//               <DropdownMenuTrigger className={styles.navLink}>
//                 <span>Find Project</span>
//                 <ChevronDown className={styles.chevron} />
//               </DropdownMenuTrigger>
//               <DropdownMenuContent>
//                 <DropdownMenuItem>Browse Projects</DropdownMenuItem>
//                 <DropdownMenuItem>Post a Project</DropdownMenuItem>
//                 <DropdownMenuItem>Project Categories</DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu>

//             <DropdownMenu>
//               <DropdownMenuTrigger className={styles.navLink}>
//                 <span>Find Talent</span>
//                 <ChevronDown className={styles.chevron} />
//               </DropdownMenuTrigger>
//               <DropdownMenuContent>
//                 <DropdownMenuItem>Browse Talent</DropdownMenuItem>
//                 <DropdownMenuItem>Hire Freelancers</DropdownMenuItem>
//                 <DropdownMenuItem>Talent Categories</DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu>

//             <DropdownMenu>
//               <DropdownMenuTrigger className={styles.navLink}>
//                 <span>About Us</span>
//                 <ChevronDown className={styles.chevron} />
//               </DropdownMenuTrigger>
//               <DropdownMenuContent>
//                 <DropdownMenuItem>Our Story</DropdownMenuItem>
//                 <DropdownMenuItem>Team</DropdownMenuItem>
//                 <DropdownMenuItem>Contact</DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu>
//           </div>

//           {/* Auth Buttons */}
//           <div className={styles.authButtons}>
//             <Button variant="ghost" className={styles.loginButton}>
//               Login
//             </Button>
//             <Button className={styles.signupButton}>Sign Up</Button>
//           </div>
//         </div>
//       </nav>

//       {/* Hero Section */}
//       <main className={styles.hero}>
//         <div className={styles.heroContent}>
//           {/* Left Content */}
//           <div className={styles.heroLeft}>
//             <h1 className={styles.heroTitle}>
//               One Platform
//               <br />
//               to <span className={styles.titleAccent}>Work</span> and
//               <br />
//               <span className={styles.titleAccent}>Sync</span> It All.
//             </h1>

//             <p className={styles.heroSubtitle}>
//               Forget endless searching. The perfect match is one sync away.
//             </p>

//             <div className={styles.ctaButtons}>
//               <Button size="lg" className={styles.primaryCta}>
//                 Get Started
//               </Button>
//               <Button
//                 variant="outline"
//                 size="lg"
//                 className={styles.secondaryCta}
//               >
//                 Learn more
//               </Button>
//             </div>

//             {/* University Logo */}
//             <div className={styles.universityLogo}>
//               <div className={styles.logoContainer}>
//                 <div className={styles.logoIcon}>
//                   <span className={styles.logoIconText}>IU</span>
//                 </div>
//                 <div className={styles.logoInfo}>
//                   <div className={styles.logoTitle}>INNOPOLIS</div>
//                   <div className={styles.logoSubtitle}>UNIVERSITY</div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Right Illustration */}
//           <div className={styles.heroRight}>
//             <div className={styles.illustrationContainer}>
//               <img
//                 src="https://cdn.builder.io/api/v1/assets/f424ef677bf243258e91aa9336898422/image-1a07d6?format=webp&width=800"
//                 alt="Collaborative work illustration with people working together"
//                 className={styles.heroIllustration}
//               />
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default HomePage;

import styles from "./page.module.css";

const HomePage = () => {
  return (
    <div className={styles.container}>
      {/* Navigation */}
      <nav className={styles.navbar}>
        <div className={styles.navContent}>
          {/* Logo */}
          <div className={styles.logo}>
            <span className={styles.logoText}>
              Inno<span className={styles.logoAccent}>Sync</span>
            </span>
          </div>

          {/* Navigation Links */}
          <div className={styles.navLinks}>
            <button className={styles.navLink}>
              <span>Find Project</span>
              <svg className={styles.chevron} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>

            <button className={styles.navLink}>
              <span>Find Talent</span>
              <svg className={styles.chevron} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>

            <button className={styles.navLink}>
              <span>About Us</span>
              <svg className={styles.chevron} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
          </div>

          {/* Auth Buttons */}
          <div className={styles.authButtons}>
            <button className={styles.loginButton}>
              Login
            </button>
            <button className={styles.signupButton}>
              Sign Up
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className={styles.hero}>
        <div className={styles.heroContent}>
          {/* Left Content */}
          <div className={styles.heroLeft}>
            <h1 className={styles.heroTitle}>
              One Platform
              <br />
              to <span className={styles.titleAccent}>Work</span> and
              <br />
              <span className={styles.titleAccent}>Sync</span> It All.
            </h1>

            <p className={styles.heroSubtitle}>
              Forget endless searching. The perfect match is one sync away.
            </p>

            <div className={styles.ctaButtons}>
              <button className={styles.primaryCta}>
                Get Started
              </button>
              <button className={styles.secondaryCta}>
                Learn more
              </button>
            </div>

            {/* University Logo */}
            <div className={styles.universityLogo}>
              <div className={styles.logoContainer}>
                <div className={styles.logoIcon}>
                  <span className={styles.logoIconText}>IU</span>
                </div>
                <div className={styles.logoInfo}>
                  <div className={styles.logoTitle}>INNOPOLIS</div>
                  <div className={styles.logoSubtitle}>UNIVERSITY</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Illustration */}
          <div className={styles.heroRight}>
            <div className={styles.illustrationContainer}>
              <img
                src="/landing_page.png"
                alt="Collaborative work illustration with people working together"
                className={styles.heroIllustration}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};




export default HomePage;

