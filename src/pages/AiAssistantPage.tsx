import { useState, type FormEvent } from "react";
import { motion } from "motion/react";
import { ArrowLeft, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";

// Matches the existing case-study courtesy gate. The build supplies the code;
// this client-side check is not a substitute for server-side authentication.
const PROJECT_PASSWORD = import.meta.env.VITE_AI_ASSISTANT_PASSWORD ?? "";

export function AiAssistantPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [error, setError] = useState(false);
  const isAccessConfigured = PROJECT_PASSWORD.length > 0;

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
    <main className="pt-20 pb-24">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto py-12">
          <Link to="/" className="inline-flex items-center gap-2 mb-8 text-gray-700 dark:text-gray-200">
            <ArrowLeft className="w-4 h-4" aria-hidden="true" /> Back to projects
          </Link>
          <h1 className="text-4xl md:text-5xl mb-4 bg-gradient-to-r from-[#102F56] to-[#1a4d7a] dark:from-blue-300 dark:to-blue-400 bg-clip-text text-transparent" style={{ lineHeight: "1.4" }}>
            AI Assistant
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-200 mb-8">
            Case study in progress. More details coming soon.
          </p>
          <img
            src="/images/ai-assistant-placeholder.svg"
            alt="AI Assistant concept with a conversation interface on a blue background"
            className="w-full h-auto rounded-2xl"
            width={800}
            height={600}
          />
        </div>
      </div>
    </main>
  );
}
