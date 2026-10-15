import { useEffect, useState, type FormEvent } from "react";
import { motion } from "motion/react";
import { ArrowLeft, ChevronUp, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import aiAssistantOverview from "../assets/ai-assistant/ai-assistant-overview.svg";

const sections = [
  { id: "brief", label: "Brief" },
  { id: "problem", label: "Problem" },
  { id: "my-role", label: "My Role" },
  { id: "process", label: "Process" },
  { id: "target-users", label: "Target Users" },
  { id: "research-synthesis", label: "Research & Synthesis" },
  { id: "solution-overview", label: "Solution Overview" },
  { id: "design-challenges", label: "Design Challenges" },
  { id: "approach-strategy", label: "Approach & Strategy" },
  { id: "early-explorations", label: "Early Explorations" },
  { id: "final-implementation", label: "Final Implementation" },
  { id: "validation", label: "Validation" },
  { id: "impact", label: "Impact" },
  { id: "learnings-reflections", label: "Learnings & Reflections" },
];

const designChallenges = [
  "Session Management",
  "Object Search",
  "Building Trust in AI-Generated Remediation Plans",
];

// Matches the existing case-study courtesy gate. The build supplies the code;
// this client-side check is not a substitute for server-side authentication.
const PROJECT_PASSWORD = import.meta.env.VITE_AI_ASSISTANT_PASSWORD ?? "";

export function AiAssistantPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [error, setError] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [contentsOpen, setContentsOpen] = useState(false);
  const isAccessConfigured = PROJECT_PASSWORD.length > 0;

  useEffect(() => {
    if (!isAuthenticated) return;

    function handleScroll() {
      setShowBackToTop(window.scrollY > 300);
      let current = "";
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element && element.getBoundingClientRect().top <= 160) {
          current = section.id;
        }
      }
      setActiveSection(current);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isAuthenticated]);

  function scrollToSection(id: string) {
    const element = document.getElementById(id);
    if (!element) return;
    window.scrollTo({
      top: element.getBoundingClientRect().top + window.scrollY - 120,
      behavior: "smooth",
    });
  }

  function handlePasswordSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isAccessConfigured && passwordInput === PROJECT_PASSWORD) {
      setIsAuthenticated(true);
      setPasswordInput("");
      setError(false);
    } else {
      setError(true);
    }
  }

  if (!isAuthenticated) {
    return (
      <main className="pt-20 pb-24">
        <div className="fixed inset-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg z-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-md w-full mx-4"
          >
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-gray-200 dark:border-gray-700 shadow-2xl p-8 sm:p-12" style={{ borderRadius: "20px" }}>
              <div className="flex flex-col items-center mb-8">
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-4 mb-6 shadow-lg" style={{ borderRadius: "16px" }}>
                  <Lock className="w-10 h-10 text-white" aria-hidden="true" />
                </div>
                <h1 className="text-2xl sm:text-3xl text-center mb-2 bg-gradient-to-r from-[#102F56] to-[#1a4d7a] dark:from-blue-300 dark:to-blue-400 bg-clip-text text-transparent">
                  Password Protected
                </h1>
                <p className="text-center text-gray-700 dark:text-gray-200">AI Assistant</p>
              </div>

              {isAccessConfigured ? (
                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="ai-assistant-password" className="sr-only">Project password</label>
                    <input
                      id="ai-assistant-password"
                      type="password"
                      autoComplete="current-password"
                      value={passwordInput}
                      onChange={(event) => {
                        setPasswordInput(event.target.value);
                        setError(false);
                      }}
                      placeholder="Enter password"
                      aria-invalid={error}
                      aria-describedby={error ? "ai-assistant-password-error" : undefined}
                      className={`w-full px-4 py-3 bg-white dark:bg-gray-700 border ${error ? "border-red-500" : "border-gray-300 dark:border-gray-600"} focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
                      style={{ borderRadius: "10px" }}
                      autoFocus
                      required
                    />
                    {error && (
                      <p id="ai-assistant-password-error" role="alert" className="text-red-500 text-sm mt-2">
                        Incorrect password. Please try again.
                      </p>
                    )}
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#102F56] to-[#1a4d7a] hover:from-[#0d2545] hover:to-[#153e62] dark:from-[#6DB2FF] dark:to-[#5a9ae6] text-white dark:text-gray-900 shadow-lg"
                    size="lg"
                    style={{ borderRadius: "10px" }}
                  >
                    Unlock Project
                  </Button>
                </form>
              ) : (
                <p className="text-center text-gray-700 dark:text-gray-200">
                  Access for this project isn't set up right now. Please get in touch and I'll share it with you directly.
                </p>
              )}

              <div className="mt-6 text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Don't have access? Please email:{" "}
                  <a href="mailto:bannyhe@umich.edu" className="text-blue-600 dark:text-blue-400 underline">bannyhe@umich.edu</a>
                </p>
                <Link to="/" className="inline-flex items-center gap-2 mt-6 text-gray-700 dark:text-gray-200">
                  <ArrowLeft className="w-4 h-4" aria-hidden="true" /> Back to projects
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-20 pb-24 vcf-body">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto py-12">
          <img
            src={aiAssistantOverview}
            alt="VCF AI Assistant concept in the VCF Operations console, illustrating object search, conversational issue summaries, and reviewable remediation recommendations."
            className="w-full h-auto"
            style={{ borderRadius: "10px" }}
            width={1867}
            height={905}
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
          <div className="mb-16">
            <h1 className="sr-only">AI Assistant</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {["Project Type", "My Role", "Team", "Timeline"].map((label) => (
                <div key={label}>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {sections.map((section) => (
            <section key={section.id} id={section.id} aria-labelledby={`${section.id}-heading`} className="mb-16">
              <h2 id={`${section.id}-heading`} className="text-3xl md:text-4xl leading-tight mb-10 bg-gradient-to-r from-[#102F56] to-[#1a4d7a] dark:from-blue-300 dark:to-blue-400 bg-clip-text text-transparent">
                {section.label}
              </h2>
              {section.id === "design-challenges" && designChallenges.map((challenge) => (
                <h3 key={challenge} className="text-xl text-gray-900 dark:text-gray-100 mb-8">
                  {challenge}
                </h3>
              ))}
            </section>
          ))}
        </motion.div>
      </div>

      <nav
        aria-label="Project contents"
        className="hidden xl:block fixed top-32 right-8 w-64 z-40"
        onMouseEnter={() => setContentsOpen(true)}
        onMouseLeave={() => setContentsOpen(false)}
        onFocus={() => setContentsOpen(true)}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setContentsOpen(false);
        }}
      >
        <button
          type="button"
          aria-expanded={contentsOpen}
          aria-controls="ai-assistant-contents"
          onClick={() => setContentsOpen(true)}
          className="backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 border border-white/30 dark:border-gray-600/30 rounded-2xl px-4 py-3 shadow-lg text-sm text-gray-500 dark:text-gray-400"
          style={{ display: "block", marginLeft: "auto" }}
        >
          Contents →
        </button>
        <div
          id="ai-assistant-contents"
          hidden={!contentsOpen}
          className="backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 border border-white/30 dark:border-gray-600/30 rounded-2xl p-6 shadow-lg"
          style={{ maxHeight: "calc(100vh - 220px)", overflowY: "auto" }}
        >
          <p className="text-xs mb-4 text-gray-400 dark:text-gray-500 tracking-wide uppercase">On this page</p>
          <ul className="space-y-2">
            {sections.map((section) => (
              <li key={section.id} className="relative pl-3">
                {activeSection === section.id && (
                  <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gray-400 dark:bg-gray-600" />
                )}
                <button
                  type="button"
                  aria-current={activeSection === section.id ? "location" : undefined}
                  className={`text-left text-sm transition-colors ${activeSection === section.id ? "text-gray-700 dark:text-gray-100" : "text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-gray-200"}`}
                  onClick={() => scrollToSection(section.id)}
                >
                  {section.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {showBackToTop && (
        <motion.button
          type="button"
          aria-label="Back to top"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed bottom-8 right-8 bg-gradient-to-r from-[#102F56] to-[#1a4d7a] dark:from-[#6DB2FF] dark:to-[#5a9ae6] text-white dark:text-gray-900 p-4 shadow-xl hover:shadow-2xl transition-all z-50 cursor-pointer"
          style={{ borderRadius: "10px" }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <ChevronUp className="w-6 h-6" aria-hidden="true" />
        </motion.button>
      )}
    </main>
  );
}
