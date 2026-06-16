import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef, useEffect, useState } from "react";
import { ExternalLink, ChevronUp, X, Lock } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import vcfNetworkImg from "../src/assets/501379d39119b51053303c522aca3c66a3cc264a.png";

export function VcfNetworkPage() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [expandedImage, setExpandedImage] = useState<{ src: string; alt: string } | null>(null);
  const [activeSection, setActiveSection] = useState<string>("");
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [error, setError] = useState(false);

  // Password for this project (in a real app, this should be handled server-side)
  const PROJECT_PASSWORD = "vcf2024";

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Track active section and show/hide back to top button
  useEffect(() => {
    const handleScroll = () => {
      // Show back to top button when scrolled down
      setShowBackToTop(window.scrollY > 300);

      // Track active section
      const sections = [
        "brief",
        "problem",
        "solution-overview",
        "design-challenge",
        "approach-strategy",
        "final-implementation",
        "impact",
        "learnings-reflections"
      ];

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  const tableOfContents = [
    { id: "brief", label: "Brief" },
    { id: "problem", label: "Problem" },
    { id: "solution-overview", label: "Solution Overview" },
    { id: "design-challenge", label: "Design Challenge" },
    { id: "approach-strategy", label: "Approach & Strategy" },
    { id: "final-implementation", label: "Final Implementation" },
    { id: "impact", label: "Impact" },
    { id: "learnings-reflections", label: "Learnings & Reflections" }
  ];

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === PROJECT_PASSWORD) {
      setIsAuthenticated(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  return (
    <main className="pt-20 pb-24">
      {/* Password Protection Overlay */}
      {!isAuthenticated && (
        <div className="fixed inset-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg z-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-md w-full mx-4"
          >
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-gray-200 dark:border-gray-700 shadow-2xl p-8 sm:p-12" style={{ borderRadius: '20px' }}>
              <div className="flex flex-col items-center mb-8">
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-4 mb-6 shadow-lg" style={{ borderRadius: '16px' }}>
                  <Lock className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl sm:text-3xl text-center mb-2 bg-gradient-to-r from-[#102F56] to-[#1a4d7a] dark:from-blue-300 dark:to-blue-400 bg-clip-text text-transparent">
                  Password Protected
                </h2>
              </div>

              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                <div>
                  <input
                    type="password"
                    value={passwordInput}
                    onChange={(e) => {
                      setPasswordInput(e.target.value);
                      setError(false);
                    }}
                    placeholder="Enter password"
                    className={`w-full px-4 py-3 bg-white dark:bg-gray-700 border ${
                      error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
                    style={{ borderRadius: '10px' }}
                    autoFocus
                  />
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm mt-2"
                    >
                      Incorrect password. Please try again.
                    </motion.p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#102F56] to-[#1a4d7a] hover:from-[#0d2545] hover:to-[#153e62] dark:from-[#6DB2FF] dark:to-[#5a9ae6] dark:hover:from-[#5a9ae6] dark:hover:to-[#4882cc] text-white dark:text-gray-900 shadow-lg"
                  size="lg"
                  style={{ borderRadius: '10px' }}
                >
                  Unlock Project
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Don't have access? Please email:{" "}
                  <a 
                    href="mailto:bannyhe@umich.edu" 
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline transition-colors"
                  >
                    bannyhe@umich.edu
                  </a>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Original Content - Only visible when authenticated */}
      {isAuthenticated && (
        <>
          {/* Full-width hero image */}
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto py-12">
              <img
                src={vcfNetworkImg}
                alt="VCF Network Operations"
                className="w-full h-auto"
                style={{ borderRadius: '10px' }}
              />
            </div>
          </div>

          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-6xl mx-auto"
            >
              {/* Header */}
              <div className="mb-16">
                {/* Project Metadata in 2x2 Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Project Type</p>
                    <p className="text-lg text-gray-900 dark:text-gray-100">UX/UI Design, UX Research</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">My Role</p>
                    <p className="text-lg text-gray-900 dark:text-gray-100">Lead UX Designer</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Team</p>
                    <p className="text-lg text-gray-900 dark:text-gray-100">2 Product Managers, 8 Engineers</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Timeline</p>
                    <p className="text-lg text-gray-900 dark:text-gray-100">[Timeline Placeholder]</p>
                  </div>
                </div>
              </div>

              {/* Brief */}
              <div className="mb-16" id="brief">
                <h2 className="text-3xl md:text-4xl leading-tight mb-10 bg-gradient-to-r from-[#102F56] to-[#1a4d7a] dark:from-blue-300 dark:to-blue-400 bg-clip-text text-transparent">
                  Brief
                </h2>
                <p className="text-lg text-gray-700 dark:text-gray-200 leading-relaxed">
                  [Brief description placeholder - Add project overview and context here]
                </p>
              </div>

              {/* Problem */}
              <div className="mb-16" id="problem">
                <h2 className="text-3xl md:text-4xl leading-tight mb-10 bg-gradient-to-r from-[#102F56] to-[#1a4d7a] dark:from-blue-300 dark:to-blue-400 bg-clip-text text-transparent">
                  Problem
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div className="space-y-6 text-lg text-gray-700 dark:text-gray-200 leading-relaxed">
                    <p>
                      [Problem statement placeholder - Describe the main challenges and pain points]
                    </p>
                  </div>
                  <div>
                    <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 flex items-center justify-center" style={{ borderRadius: '10px' }}>
                      <span className="text-gray-500 dark:text-gray-400">Placeholder Image</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Solution Overview */}
              <div className="mb-16" id="solution-overview">
                <h2 className="text-3xl md:text-4xl leading-tight mb-10 bg-gradient-to-r from-[#102F56] to-[#1a4d7a] dark:from-blue-300 dark:to-blue-400 bg-clip-text text-transparent">
                  Solution Overview
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {[1, 2, 3, 4].map((index) => (
                    <div key={index}>
                      <div 
                        className="w-full h-auto mb-4 bg-gray-200 dark:bg-gray-700 flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity"
                        style={{ borderRadius: '10px', height: '400px' }}
                      >
                        <span className="text-gray-500 dark:text-gray-400">Placeholder Image {index}</span>
                      </div>
                      <p className="text-center text-gray-700 dark:text-gray-200">[Description {index}]</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Design Challenge */}
              <div className="mb-16" id="design-challenge">
                <h2 className="text-3xl md:text-4xl leading-tight mb-10 bg-gradient-to-r from-[#102F56] to-[#1a4d7a] dark:from-blue-300 dark:to-blue-400 bg-clip-text text-transparent">
                  Design Challenge
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div className="space-y-6 text-lg text-gray-700 dark:text-gray-200 leading-relaxed">
                    <p>
                      [Design challenge placeholder - Describe the key design challenges faced]
                    </p>
                  </div>
                  <div>
                    <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 flex items-center justify-center" style={{ borderRadius: '10px' }}>
                      <span className="text-gray-500 dark:text-gray-400">Placeholder Image</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Approach & Strategy */}
              <div className="mb-16" id="approach-strategy">
                <h2 className="text-3xl md:text-4xl leading-tight mb-10 bg-gradient-to-r from-[#102F56] to-[#1a4d7a] dark:from-blue-300 dark:to-blue-400 bg-clip-text text-transparent">
                  Approach & Strategy
                </h2>
                <div className="space-y-6 text-lg text-gray-700 dark:text-gray-200 leading-relaxed">
                  <p>
                    [Approach & Strategy placeholder - Describe the methodology and strategic approach]
                  </p>
                  <ul className="list-disc pl-6 space-y-3">
                    <li>
                      <span className="text-gray-900 dark:text-gray-100">Phase 1:</span> [Description]
                    </li>
                    <li>
                      <span className="text-gray-900 dark:text-gray-100">Phase 2:</span> [Description]
                    </li>
                    <li>
                      <span className="text-gray-900 dark:text-gray-100">Phase 3:</span> [Description]
                    </li>
                  </ul>
                </div>
              </div>

              {/* Final Implementation */}
              <div className="mb-16" id="final-implementation">
                <h2 className="text-3xl md:text-4xl leading-tight mb-10 bg-gradient-to-r from-[#102F56] to-[#1a4d7a] dark:from-blue-300 dark:to-blue-400 bg-clip-text text-transparent">
                  Final Implementation
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {[1, 2, 3, 4].map((index) => (
                    <div key={index}>
                      <div 
                        className="w-full h-auto bg-gray-200 dark:bg-gray-700 flex items-center justify-center"
                        style={{ borderRadius: '10px', height: '300px' }}
                      >
                        <span className="text-gray-500 dark:text-gray-400">Placeholder Image/Video {index}</span>
                      </div>
                      <p className="text-left text-gray-700 dark:text-gray-200 mt-4">
                        {String.fromCharCode(96 + index)}. [Description of implementation {index}]
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Impact */}
              <div className="mb-16" id="impact">
                <h2 className="text-3xl md:text-4xl leading-tight mb-10 bg-gradient-to-r from-[#102F56] to-[#1a4d7a] dark:from-blue-300 dark:to-blue-400 bg-clip-text text-transparent">
                  Impact
                </h2>
                <div className="space-y-3 text-lg text-gray-700 dark:text-gray-200 leading-relaxed mb-8">
                  <ul className="list-disc pl-6 space-y-3">
                    <li>
                      <span className="text-gray-900 dark:text-gray-100">Impact Item 1</span> – [Description]
                    </li>
                    <li>
                      <span className="text-gray-900 dark:text-gray-100">Impact Item 2</span> – [Description]
                    </li>
                    <li>
                      <span className="text-gray-900 dark:text-gray-100">Impact Item 3</span> – [Description]
                    </li>
                  </ul>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 flex items-center justify-center" style={{ borderRadius: '10px' }}>
                      <span className="text-gray-500 dark:text-gray-400">Placeholder Image</span>
                    </div>
                    <p className="text-left text-gray-700 dark:text-gray-200 mt-4">[Impact visualization 1]</p>
                  </div>
                  <div>
                    <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 flex items-center justify-center" style={{ borderRadius: '10px' }}>
                      <span className="text-gray-500 dark:text-gray-400">Placeholder Image</span>
                    </div>
                    <p className="text-left text-gray-700 dark:text-gray-200 mt-4">[Impact visualization 2]</p>
                  </div>
                </div>
              </div>

              {/* Learnings & Reflections */}
              <div className="mb-16" id="learnings-reflections">
                <h2 className="text-3xl md:text-4xl leading-tight mb-10 bg-gradient-to-r from-[#102F56] to-[#1a4d7a] dark:from-blue-300 dark:to-blue-400 bg-clip-text text-transparent">
                  Learnings & Reflections
                </h2>
                <div className="text-lg text-gray-700 dark:text-gray-200 leading-relaxed">
                  <ul className="list-disc pl-6 space-y-4">
                    <li>
                      <span className="text-gray-900 dark:text-gray-100">Learning 1</span>: [Description]
                    </li>
                    <li>
                      <span className="text-gray-900 dark:text-gray-100">Learning 2</span>: [Description]
                    </li>
                    <li>
                      <span className="text-gray-900 dark:text-gray-100">Learning 3</span>: [Description]
                    </li>
                    <li>
                      <span className="text-gray-900 dark:text-gray-100">Learning 4</span>: [Description]
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Image Expanded View Modal */}
          {expandedImage && (
            <div
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setExpandedImage(null)}
            >
              <button
                className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
                onClick={() => setExpandedImage(null)}
              >
                <X className="w-8 h-8" />
              </button>
              <div className="max-w-7xl max-h-[90vh] relative">
                <img
                  src={expandedImage.src}
                  alt={expandedImage.alt}
                  className="max-w-full max-h-[90vh] object-contain"
                  style={{ borderRadius: '10px' }}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
          )}

          {/* Table of Contents - Subtle */}
          <div className="hidden xl:block fixed top-32 right-8 w-64 p-6 z-40 group">
            {/* Collapsed state - shows icon/text */}
            <div className="absolute top-0 right-0 opacity-100 group-hover:opacity-0 transition-opacity duration-300 pointer-events-none">
              <div className="backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 border border-white/30 dark:border-gray-600/30 rounded-2xl px-4 py-3 shadow-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Contents →</p>
              </div>
            </div>
            
            {/* Expanded state - shows full catalog */}
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 border border-white/30 dark:border-gray-600/30 rounded-2xl p-6 shadow-lg">
              <h3 className="text-xs mb-4 text-gray-400 dark:text-gray-500 tracking-wide uppercase">On this page</h3>
              <ul className="space-y-2">
                {tableOfContents.map((item) => (
                  <li key={item.id} className="relative pl-3">
                    {activeSection === item.id && (
                      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gray-400 dark:bg-gray-600" />
                    )}
                    <button
                      className={`text-left text-sm transition-colors ${
                        activeSection === item.id ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400'
                      }`}
                      onClick={() => scrollToSection(item.id)}
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Back to Top Button */}
          {showBackToTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="fixed bottom-8 right-8 bg-gradient-to-r from-[#102F56] to-[#1a4d7a] dark:from-[#6DB2FF] dark:to-[#5a9ae6] text-white dark:text-gray-900 p-4 shadow-xl hover:shadow-2xl transition-all z-50 cursor-pointer"
              style={{ borderRadius: '10px' }}
              onClick={scrollToTop}
            >
              <ChevronUp className="w-6 h-6" />
            </motion.button>
          )}
        </>
      )}
    </main>
  );
}