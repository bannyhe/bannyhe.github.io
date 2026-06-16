import {
  HashRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { useEffect } from "react";
import { Navigation } from "./components/Navigation";

// External logo/favicon link
const logoImage = "https://drive.google.com/thumbnail?id=18egiYJluCTnTQoA7fkoeIw69C5HCD9jP&sz=w200";

import { HomePage } from "./pages/HomePage";
import { AboutPage } from "./pages/AboutPage";
import { ResumePage } from "./pages/ResumePage";
import { MalwarePreventionPage } from "./pages/MalwarePreventionPage";
import { NorthstarOnboardingPage } from "./pages/NorthstarOnboardingPage";
import { VcfNetworkPage } from "./pages/VcfNetworkPage";
import { XenithWebsitePage } from "./pages/XenithWebsitePage";
import { Toaster } from "./components/ui/sonner";
import {
  Github,
  Linkedin,
  Mail,
  Instagram,
} from "lucide-react";
import { motion } from "motion/react";
import { ThemeProvider } from "./contexts/ThemeContext";

export default function App() {
  useEffect(() => {
    document.title = "MU HE";

    // Update favicon
    const link = document.querySelector(
      "link[rel~='icon']",
    ) as HTMLLinkElement;
    if (link) {
      link.href = logoImage;
    } else {
      const newLink = document.createElement("link");
      newLink.rel = "icon";
      newLink.href = logoImage;
      document.head.appendChild(newLink);
    }
  }, []);

  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
          <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100 via-transparent to-transparent dark:from-blue-900/20 opacity-60 pointer-events-none" />
          <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-purple-100 via-transparent to-transparent dark:from-purple-900/20 opacity-60 pointer-events-none" />

          <div className="relative z-10">
            <Navigation />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/resume" element={<ResumePage />} />
              <Route
                path="/project/malware-prevention"
                element={<MalwarePreventionPage />}
              />
              <Route
                path="/project/northstar-onboarding"
                element={<NorthstarOnboardingPage />}
              />
              <Route
                path="/project/vcf-network"
                element={<VcfNetworkPage />}
              />
              <Route
                path="/project/xenith-website"
                element={<XenithWebsitePage />}
              />
            </Routes>
            <footer className="relative text-gray-600 dark:text-gray-300 py-8 mt-24">
              <div className="container mx-auto px-4 text-center">
                {/* Social Media Icons */}
                <div className="flex items-center justify-center gap-4 mb-6">
                  {[
                    {
                      icon: Github,
                      href: "https://github.com/bannyhe",
                    },
                    {
                      icon: Linkedin,
                      href: "https://www.linkedin.com/in/banny-mu-he-352820a3/",
                    },
                    {
                      icon: Mail,
                      href: "mailto:bannyhe@umich.edu",
                    },
                    {
                      icon: Instagram,
                      href: "http://instagram.com/bannyhe_001",
                    },
                  ].map(({ icon: Icon, href }) => (
                    <motion.a
                      key={href}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-12 h-12 rounded-full backdrop-blur-xl bg-white/20 dark:bg-gray-800/40 border border-white/30 dark:border-gray-600/30 flex items-center justify-center text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer"
                    >
                      <Icon className="w-5 h-5" />
                    </motion.a>
                  ))}
                </div>
                <p className="text-gray-500 dark:text-gray-400">
                  © 2026 Designed by MU HE. All rights
                  reserved.
                </p>
              </div>
            </footer>
          </div>
          <Toaster />
        </div>
      </Router>
    </ThemeProvider>
  );
}