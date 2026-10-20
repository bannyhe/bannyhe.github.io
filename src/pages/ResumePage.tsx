import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Briefcase, GraduationCap, Download, Award, Cpu } from "lucide-react";
import { Button } from "../components/ui/button";
import { useAnalytics } from "../hooks/useAnalytics";
import "../styles/resume.css";

export function ResumePage() {
  const ref = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  const hasEnteredView = useInView(ref, { once: true, amount: 0.05 });
  const isInView = prefersReducedMotion || hasEnteredView;
  const { trackEvent } = useAnalytics();

  const experience = [
    {
      title: "Senior Product Designer",
      company: "Broadcom",
      location: "Palo Alto, CA",
      period: "Nov 2023 – Present",
      achievements: [
        "Lead Network Operations UX and dashboard design within VCF Operations, unifying networking capabilities and contextual workflows for complex cloud infrastructure.",
        "Led UX vision and concept design for Network AI Assistant, prototyping conversational AI and agentic UX that connect object context, diagnostic evidence, and recommended actions.",
        "Designed AI-driven troubleshooting and remediation workflows with human-in-the-loop approval, clear action scope, and partial-success states; defined LLM model selection, administrator setup, and session continuity.",
        "Partner with product and engineering to align design with strategy and technical constraints; lead cross-functional design reviews and mentor junior designers."
      ]
    },
    {
      title: "Product Designer III",
      company: "VMware",
      location: "Palo Alto, CA",
      period: "Feb 2023 – Nov 2023",
      achievements: [
        "Led end-to-end NSX+ onboarding, subscription bundle, and deployment experience design, simplifying complex enterprise workflows into clear user journeys.",
        "Developed high-fidelity prototypes and conducted usability testing with cross-functional teams, aligning user needs and business objectives to improve adoption and operational efficiency."
      ]
    },
    {
      title: "Product Designer II",
      company: "VMware",
      location: "Palo Alto, CA",
      period: "Nov 2019 – Feb 2023",
      achievements: [
        "Delivered 0-to-1 Malware Prevention design for NSX-T Security Advanced Threat Prevention (ATP), translating complex security concepts into clear, usable experiences.",
        "Clarified security data through progressive disclosure and advanced timestamp filtering; established a reusable security-widget pattern library for cohesive system interactions.",
        "Contributed design to the ATP solution recognized with a Gold Prize in the Cybersecurity Excellence Awards."
      ]
    },
    {
      title: "User Experience Intern",
      company: "Quicken Loans",
      location: "Detroit, MI",
      period: "Jun 2018 – Aug 2018",
      achievements: [
        "Conducted user research, interaction mapping, heuristic evaluation, and usability testing to improve purchase journeys and information architecture, contributing to a 20% increase in website traffic and sales.",
        "Designed mobile app mockups for purchasing and customer service; built the Serial User Flow front-end interface for Production Facility Lab."
      ]
    }
  ];

  const education = [
    {
      degree: "Master of Science in Information",
      institution: "University of Michigan School of Information",
      location: "Ann Arbor, MI",
      period: "May 2019",
      description: "Human-Computer Interaction specialization"
    },
    {
      degree: "Bachelor of Science in Information Management",
      institution: "Wuhan University School of Information Management",
      location: "Wuhan, China",
      period: "Jun 2017",
      description: "E-Commerce specialization"
    }
  ];

  const skills = {
    "UX Design": [
      "Conversational AI & Agentic UX",
      "Human-in-the-Loop Design",
      "AI-Driven Workflow Design",
      "Interaction & Visual Design",
      "Design Systems & Patterns",
      "Data Visualization"
    ],
    "User Research": [
      "User Interviews",
      "Usability Testing",
      "Journey Mapping",
      "Heuristic Evaluation",
      "Competitive Analysis"
    ],
    "Design & AI Tools": [
      "Figma & Figma Make",
      "Claude Code & Codex (MCP)",
      "Daily AI-Assisted Design",
      "Miro & Framer",
      "Photoshop & Illustrator",
      "Hotjar"
    ],
    "Programming": [
      "HTML & CSS",
      "JavaScript / jQuery",
      "Python & SQL",
      "PHP"
    ]
  };

  const certifications = [
    "Shift Nudge Certificate of UI Design",
    "LUMA Design Thinking Certificate"
  ];

  return (
    <main className="pt-32 pb-24 resume-page">
      <div className="container mx-auto px-4">
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.8 }}
          className="max-w-5xl mx-auto"
        >
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-5xl md:text-6xl mb-6 bg-gradient-to-r from-[#102F56] to-[#1a4d7a] dark:from-blue-300 dark:to-blue-400 bg-clip-text text-transparent text-center">
              Resume
            </h1>
          </div>

          {/* Download Button */}
          <div className="flex justify-end mb-8">
            <Button asChild className="resume-download cursor-pointer backdrop-blur-xl bg-white/30 dark:bg-gray-800/70 border border-white/20 dark:border-gray-700/50 text-gray-700 dark:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-700/80 hover:border-white/30 dark:hover:border-gray-600/60 transition-all duration-300 shadow-sm hover:shadow-md text-sm">
              <a
                href="/resume/Mu-He-Resume.pdf"
                download="Mu-He-Resume.pdf"
                onClick={() => trackEvent('resume_download', 'pdf')}
              >
                <Download className="w-4 h-4" aria-hidden="true" />
                Download PDF
              </a>
            </Button>
          </div>

          {/* Experience Section */}
          <motion.div
            ref={ref}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.6 }}
            className="backdrop-blur-2xl bg-white/40 dark:bg-gray-800/70 border border-white/20 dark:border-gray-700/40 rounded-3xl p-12 shadow-2xl resume-section mb-12"
          >
            <div className="resume-section-heading flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#102F56] to-[#1a4d7a] dark:from-blue-600 dark:to-blue-700 flex items-center justify-center shadow-lg">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl bg-gradient-to-r from-[#102F56] to-[#1a4d7a] dark:from-blue-300 dark:to-blue-400 bg-clip-text text-transparent">
                Work experience
              </h2>
            </div>

            <div className="space-y-8">
              {experience.map((job, index) => (
                <motion.div
                  key={`${job.company}-${job.period}-${index}`}
                  initial={prefersReducedMotion ? false : { opacity: 0, x: -30 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.5, delay: index * 0.1 }}
                  className="resume-entry p-6 backdrop-blur-xl bg-white/60 dark:bg-gray-700/80 border border-white/30 dark:border-gray-600/50 rounded-2xl hover:shadow-xl transition-all duration-300"
                >
                  <div className="resume-entry-heading flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                    <div>
                      <h3 className="text-xl mb-1 bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
                        {job.title}
                      </h3>
                      <p className="resume-accent">{job.company}</p>
                    </div>
                    <div className="mt-2 md:mt-0 md:text-right">
                      <p className="text-gray-600 dark:text-gray-300">{job.period}</p>
                      {job.location && <p className="text-gray-500 dark:text-gray-400">{job.location}</p>}
                    </div>
                  </div>
                  <ul className="resume-achievements space-y-2">
                    {job.achievements.map((achievement, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-700 dark:text-gray-200">
                        <span className="resume-accent" aria-hidden="true">•</span>
                        <span>{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Education Section */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.6, delay: 0.2 }}
            className="backdrop-blur-2xl bg-white/40 dark:bg-gray-800/70 border border-white/20 dark:border-gray-700/40 rounded-3xl p-12 shadow-2xl resume-section mb-12"
          >
            <div className="resume-section-heading flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#102F56] to-[#1a4d7a] dark:from-blue-600 dark:to-blue-700 flex items-center justify-center shadow-lg">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl bg-gradient-to-r from-[#102F56] to-[#1a4d7a] dark:from-blue-300 dark:to-blue-400 bg-clip-text text-transparent">
                Education
              </h2>
            </div>

            <div className="space-y-6">
              {education.map((edu, index) => (
                <motion.div
                  key={edu.institution}
                  initial={prefersReducedMotion ? false : { opacity: 0, x: -30 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.5, delay: 0.2 + index * 0.1 }}
                  className="resume-entry p-6 backdrop-blur-xl bg-white/60 dark:bg-gray-700/80 border border-white/30 dark:border-gray-600/50 rounded-2xl hover:shadow-xl transition-all duration-300"
                >
                  <div className="resume-entry-heading flex flex-col md:flex-row md:justify-between md:items-start mb-3">
                    <div>
                      <h3 className="text-xl mb-1 bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
                        {edu.degree}
                      </h3>
                      <p className="resume-accent">{edu.institution}</p>
                    </div>
                    <div className="mt-2 md:mt-0 md:text-right">
                      <p className="text-gray-600 dark:text-gray-300">{edu.period}</p>
                      {edu.location && <p className="text-gray-500 dark:text-gray-400">{edu.location}</p>}
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-200">{edu.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Skills & Certifications */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Skills */}
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.6, delay: 0.3 }}
              className="backdrop-blur-2xl bg-white/40 dark:bg-gray-800/70 border border-white/20 dark:border-gray-700/40 rounded-3xl p-8 shadow-2xl resume-section lg:col-span-3"
            >
              <div className="resume-section-heading flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#102F56] to-[#1a4d7a] dark:from-blue-600 dark:to-blue-700 flex items-center justify-center shadow-lg">
                  <Cpu className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl bg-gradient-to-r from-[#102F56] to-[#1a4d7a] dark:from-blue-300 dark:to-blue-400 bg-clip-text text-transparent">
                  Skills &amp; tools
                </h2>
              </div>
              <div className="space-y-6">
                {Object.entries(skills).map(([category, items]) => (
                  <div key={category}>
                    <h3 className="text-lg mb-3 text-gray-800 dark:text-gray-200">{category}</h3>
                    <div className="flex flex-wrap gap-2">
                      {items.map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1 backdrop-blur-xl bg-white/60 dark:bg-gray-700/60 border border-white/30 dark:border-gray-600/30 rounded-full text-sm text-gray-700 dark:text-gray-200 break-words"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Certifications */}
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.6, delay: 0.4 }}
              className="backdrop-blur-2xl bg-white/40 dark:bg-gray-800/70 border border-white/20 dark:border-gray-700/40 rounded-3xl p-8 shadow-2xl resume-section lg:col-span-2"
            >
              <div className="resume-section-heading flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#102F56] to-[#1a4d7a] dark:from-blue-600 dark:to-blue-700 flex items-center justify-center shadow-lg">
                  <Award className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl bg-gradient-to-r from-[#102F56] to-[#1a4d7a] dark:from-blue-300 dark:to-blue-400 bg-clip-text text-transparent">
                  Certifications
                </h2>
              </div>
              <div className="space-y-4">
                {certifications.map((cert, index) => (
                  <motion.div
                    key={cert}
                    initial={prefersReducedMotion ? false : { opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                    transition={{ duration: prefersReducedMotion ? 0 : 0.5, delay: 0.4 + index * 0.1 }}
                    className="flex items-center gap-3 p-4 backdrop-blur-xl bg-white/60 dark:bg-gray-700/80 border border-white/30 dark:border-gray-600/50 rounded-xl hover:shadow-lg transition-all duration-300"
                  >
                    <span className="resume-accent flex-shrink-0">✓</span>
                    <span className="text-gray-700 dark:text-gray-200 text-sm break-words">{cert}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}