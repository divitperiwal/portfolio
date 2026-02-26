import HeroSection from "./components/HeroSection";
import ProjectSection from "./components/ProjectSection";
import ExperienceSection from "./components/ExperienceSection";
import ContactSection from "./components/ContactSection";
import PageWrapper from "./components/PageWrapper";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Divit Periwal",
  url: "https://divitperiwal.dev",
  image: "https://divitperiwal.dev/avatar.jpeg",
  jobTitle: "Software Developer",
  description:
    "Backend-focused software developer building systems that last. Experienced with TypeScript, Node.js, PostgreSQL, Redis, and Docker.",
  knowsAbout: [
    "TypeScript",
    "Node.js",
    "Next.js",
    "PostgreSQL",
    "Redis",
    "Docker",
    "System Design",
    "Backend Engineering",
  ],
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "SRM University",
  },
  sameAs: [
    "https://github.com/divitperiwal",
    "https://linkedin.com/in/divitperiwal",
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageWrapper>
        <HeroSection />
        <ProjectSection />
        <ExperienceSection />
        <ContactSection />
      </PageWrapper>
    </>
  );
}
