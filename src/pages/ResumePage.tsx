import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Briefcase, GraduationCap, Download, Award, Cpu } from "lucide-react";
import { Button } from "../components/ui/button";

export function ResumePage() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const experience = [
    {
      title: "Senior Product Designer",
      company: "Broadcom",
      location: "Palo Alto, CA",
      period: "Nov 2023 - Present",
      description: "",
      achievements: [
        "Lead the design for Network Operations solutions enhancing product integration for VCF Operations and cultivating intuitive user experiences for complex cloud infrastructure",
        "Conduct design reviews with cross-functional teams ensuring alignment with engineering capability and product strategy while mentoring junior designers in best practices",
        "Drive improvements in operational insights and network performance facilitating user-centric design methodologies to optimize user workflows"
      ]
    },
    {
      title: "Product Designer III",
      company: "VMware",
      location: "Palo Alto, CA",
      period: "Feb 2023 - Nov 2023",
      description: "",
      achievements: [
        "Led the design for NSX+ focusing on user onboarding workflows, subscription bundles and deployment experience that prioritize user needs",
        "Collaborated with cross-functional teams to integrate user-centered design principles, created intuitive interfaces that simplify complex systems",
        "Oversaw the development of high-fidelity prototypes and usability testing, ensuring designs effectively met both user needs and business objectives, significantly improved user adoption and operational efficiency"
      ]
    },
    {
      title: "Product Designer II",
      company: "VMware",
      location: "Palo Alto, CA",
      period: "Nov 2019 - Feb 2023",
      description: "",
      achievements: [
        "Delivered 0-1 design: Malware Prevention for Advanced Threat Prevention (ATP) solution for NSX-T Security portfolio, emphasizing data visualization through progressive disclosure and timestamp advanced filter",
        "Established a comprehensive design pattern library for security widgets, fostering a cohesive user experience across complex system interactions",
        "The ATP solution received a Gold Prize in Cybersecurity Excellence Awards, showcasing my ability to translate intricate domain concepts into elegant and user-friendly designs"
      ]
    },
    {
      title: "User Experience Intern",
      company: "Quicken Loans",
      location: "Detroit, MI",
      period: "Jun 2018 - Aug 2018",
      description: "",
      achievements: [
        "Conducted user research to identify pain points on official website, collaborated with branding agencies to enhance UX through critique and redesign, helped to optimize path of purchase, product customizer and information architecture",
        "Developed interaction map to pinpoint bottlenecks redesigned the user experience through heuristic evaluation and usability testing, which led to a 20% increase in website traffic and sales",
        "Created front-end interface of Serial User Flow project for Production Facility Lab. Designed mockups for an upcoming mobile app that streamlined purchase processes and improved customer service interactions"
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
    "UX Design": ["User Personas", "Storyboarding", "Wireframing", "Prototyping", "User Journey", "Figma & Plug-ins", "Miro", "Lucidchart"],
    "User Research": ["User Interview", "Comparative Analysis", "Affinity Diagram", "Heuristic Evaluation", "Usability Testing", "A/B Testing", "Hotjar"],
    "Coding": ["HTML & CSS", "Javascript", "Python", "PHP", "SQL"]
  };

  const certifications = [
    "Shift Nudge Certificate of UI Design",
    "LUMA Design Thinking Certificate"
  ];

  return (
    <main className="pt-32 pb-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
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
            <a
              href="https://drive.google.com/file/d/1eZm1HnJsfHarTDDubacR5mcdiTiKNc76/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="cursor-pointer backdrop-blur-xl bg-white/30 dark:bg-gray-800/70 border border-white/20 dark:border-gray-700/50 text-gray-700 dark:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-700/80 hover:border-white/30 dark:hover:border-gray-600/60 transition-all duration-300 shadow-sm hover:shadow-md text-sm">
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
            </a>
          </div>

          {/* Experience Section */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.6 }}
            className="backdrop-blur-2xl bg-white/40 dark:bg-gray-800/70 border border-white/20 dark:border-gray-700/40 rounded-3xl p-12 shadow-2xl mb-12"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#102F56] to-[#1a4d7a] dark:from-blue-600 dark:to-blue-700 flex items-center justify-center shadow-lg">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl bg-gradient-to-r from-[#102F56] to-[#1a4d7a] dark:from-blue-300 dark:to-blue-400 bg-clip-text text-transparent">
                Work Experience
              </h2>
            </div>

            <div className="space-y-8">
              {experience.map((job, index) => (
                <motion.div
                  key={`${job.company}-${job.period}-${index}`}
                  initial={{ opacity: 0, x: -30 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="p-6 backdrop-blur-xl bg-white/60 dark:bg-gray-700/80 border border-white/30 dark:border-gray-600/50 rounded-2xl hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                    <div>
                      <h3 className="text-xl mb-1 bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
                        {job.title}
                      </h3>
                      <p className="text-indigo-600 dark:text-[#6DB2FF]">{job.company}</p>
                    </div>
                    <div className="mt-2 md:mt-0 md:text-right">
                      <p className="text-gray-600 dark:text-gray-300">{job.period}</p>
                      {job.location && <p className="text-gray-500 dark:text-gray-400">{job.location}</p>}
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-200 mb-4">{job.description}</p>
                  <ul className="space-y-2">
                    {job.achievements.map((achievement, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-700 dark:text-gray-200">
                        <span className="text-purple-600 dark:text-purple-400 mt-1">•</span>
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
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="backdrop-blur-2xl bg-white/40 dark:bg-gray-800/70 border border-white/20 dark:border-gray-700/40 rounded-3xl p-12 shadow-2xl mb-12"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
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
                  initial={{ opacity: 0, x: -30 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  className="p-6 backdrop-blur-xl bg-white/60 dark:bg-gray-700/80 border border-white/30 dark:border-gray-600/50 rounded-2xl hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-3">
                    <div>
                      <h3 className="text-xl mb-1 bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
                        {edu.degree}
                      </h3>
                      <p className="text-indigo-600 dark:text-[#6DB2FF]">{edu.institution}</p>
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
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="backdrop-blur-2xl bg-white/40 dark:bg-gray-800/70 border border-white/20 dark:border-gray-700/40 rounded-3xl p-8 shadow-2xl lg:col-span-3"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#102F56] to-[#1a4d7a] dark:from-blue-600 dark:to-blue-700 flex items-center justify-center shadow-lg">
                  <Cpu className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-2xl bg-gradient-to-r from-[#102F56] to-[#1a4d7a] dark:from-blue-300 dark:to-blue-400 bg-clip-text text-transparent">
                  Technical Skills
                </h3>
              </div>
              <div className="space-y-6">
                {Object.entries(skills).map(([category, items], index) => (
                  <div key={category}>
                    <h4 className="text-lg mb-3 text-gray-800 dark:text-gray-200">{category}</h4>
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
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="backdrop-blur-2xl bg-white/40 dark:bg-gray-800/70 border border-white/20 dark:border-gray-700/40 rounded-3xl p-8 shadow-2xl lg:col-span-2"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg">
                  <Award className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-2xl bg-gradient-to-r from-[#102F56] to-[#1a4d7a] dark:from-blue-300 dark:to-blue-400 bg-clip-text text-transparent">
                  Certifications
                </h3>
              </div>
              <div className="space-y-4">
                {certifications.map((cert, index) => (
                  <motion.div
                    key={cert}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                    transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                    className="flex items-center gap-3 p-4 backdrop-blur-xl bg-white/60 dark:bg-gray-700/80 border border-white/30 dark:border-gray-600/50 rounded-xl hover:shadow-lg transition-all duration-300"
                  >
                    <span className="text-purple-600 dark:text-purple-400 flex-shrink-0">✓</span>
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