import { useEffect, useRef, useState, type FormEvent } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ChevronDown, ChevronUp, Lock, Sparkles, X } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { AiAssistantCaseStudyContent, aiAssistantSections as sections } from "../components/ai-assistant/AiAssistantCaseStudyContent";
import assistantConsoleImg from "../assets/ai-assistant/assistant-console.svg";

// Matches the existing case-study courtesy gate. The build supplies the code;
// this client-side check is not a substitute for server-side authentication.
const PROJECT_PASSWORD = import.meta.env.VITE_AI_ASSISTANT_PASSWORD ?? "";

export function AiAssistantPage() {
  const reduceMotion = useReducedMotion();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [error, setError] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [contentsOpen, setContentsOpen] = useState(false);
  const contentsToggle = useRef<HTMLButtonElement>(null);
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
    setContentsOpen(false);
    // On small screens the menu occupies document space. Measure after it closes.
    requestAnimationFrame(() => {
      element.focus({ preventScroll: true });
      window.scrollTo({
        top: element.getBoundingClientRect().top + window.scrollY - 120,
        behavior: reduceMotion ? "auto" : "smooth",
      });
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
            initial={reduceMotion ? false : { opacity: 0, y: 30 }}
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
                <p className="text-center text-gray-700 dark:text-gray-200">Network AI Assistant</p>
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
    <main className="pt-20 pb-24 vcf-body ai-case-study">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto py-12">
          <header className="ai-hero">
            <div className="ai-hero-copy">
              <h1><Sparkles aria-hidden="true" />Network AI Assistant</h1>
              <p className="ai-hero-description">Simplifying Network Operations with conversational AI, clear issue summaries, and actionable guidance.</p>
              <p className="ai-hero-tags"><span>/ UX Strategy</span><span>/ UX Design</span></p>
            </div>
            <img src={assistantConsoleImg} alt="Network AI Assistant concept showing conversation history, object search, an issue summary, and recommended next steps." width={740} height={625} fetchPriority="high" />
          </header>
        </div>
      </div>

      <nav
        aria-label="Project contents"
        className="ai-contents"
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            setContentsOpen(false);
            contentsToggle.current?.focus();
          }
        }}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setContentsOpen(false);
        }}
      >
        <button
          type="button"
          ref={contentsToggle}
          aria-expanded={contentsOpen}
          aria-controls="ai-assistant-contents"
          onClick={() => setContentsOpen(!contentsOpen)}
          className="ai-contents-toggle backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 border border-white/30 dark:border-gray-600/30 rounded-2xl px-4 py-3 shadow-lg text-sm text-gray-700 dark:text-gray-200"
        >
          Contents <ChevronDown size={16} aria-hidden="true" style={{ display: "inline", marginLeft: 6 }} />
        </button>
        <div
          id="ai-assistant-contents"
          hidden={!contentsOpen}
          className="ai-contents-panel backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 border border-white/30 dark:border-gray-600/30 rounded-2xl p-6 shadow-lg"
        >
          <div className="ai-contents-close"><span>On this page</span><button type="button" aria-label="Close contents" onClick={() => { setContentsOpen(false); contentsToggle.current?.focus(); }}><X size={20} aria-hidden="true" /></button></div>
          <ul className="space-y-2">
            {sections.map((section) => (
              <li key={section.id} className="relative pl-3">
                {activeSection === section.id && (
                  <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gray-400 dark:bg-gray-600" />
                )}
                <button
                  type="button"
                  aria-current={activeSection === section.id ? "location" : undefined}
                  className={`text-left text-sm transition-colors ${activeSection === section.id ? "text-gray-900 dark:text-gray-100" : "text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200"}`}
                  onClick={() => scrollToSection(section.id)}
                >
                  {section.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <div className="container mx-auto px-4">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.8 }}
          className="max-w-6xl mx-auto"
        >
          <AiAssistantCaseStudyContent />
        </motion.div>
      </div>

      {showBackToTop && (
        <motion.button
          type="button"
          aria-label="Back to top"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed bottom-8 right-8 bg-gradient-to-r from-[#102F56] to-[#1a4d7a] dark:from-[#6DB2FF] dark:to-[#5a9ae6] text-white dark:text-gray-900 p-4 shadow-xl hover:shadow-2xl transition-all z-50 cursor-pointer"
          style={{ borderRadius: "10px" }}
          onClick={() => window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" })}
        >
          <ChevronUp className="w-6 h-6" aria-hidden="true" />
        </motion.button>
      )}
    </main>
  );
}
