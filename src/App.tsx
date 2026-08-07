import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { useEffect, lazy, Suspense } from "react";
import { metaForPath } from "./lib/routeMeta";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    // Disable browser scroll restoration so it doesn't fight us on hash navigation
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    // requestAnimationFrame defers until after the new page has painted
    requestAnimationFrame(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    });
  }, [pathname]);
  return null;
}

/**
 * Keeps the tab title and meta description in step with the current route.
 * First paint already carries the right values — the build writes a static HTML
 * file per route — so this only has to cover client-side navigation after that.
 */
function DocumentTitle() {
  const { pathname } = useLocation();

  useEffect(() => {
    const { title, description } = metaForPath(pathname);
    document.title = title;

    const descriptionTag = document.querySelector(
      'meta[name="description"]',
    );
    if (descriptionTag) {
      descriptionTag.setAttribute("content", description);
    }
  }, [pathname]);

  return null;
}
import { Navigation } from "./components/Navigation";
import { useAnalytics } from "./hooks/useAnalytics";

// The home page is what almost every visit starts on, so it stays in the main
// bundle. Everything else is split out: the four case studies carry most of the
// imagery and copy, and the admin dashboard pulls in the charting and world-map
// code that no ordinary visitor ever needs. Before this, all of it shipped in
// one ~1.19 MB chunk that had to parse before anything appeared on screen.
import { HomePage } from "./pages/HomePage";

const AboutPage = lazy(() =>
  import("./pages/AboutPage").then((m) => ({ default: m.AboutPage })),
);
const ResumePage = lazy(() =>
  import("./pages/ResumePage").then((m) => ({ default: m.ResumePage })),
);
const MalwarePreventionPage = lazy(() =>
  import("./pages/MalwarePreventionPage").then((m) => ({
    default: m.MalwarePreventionPage,
  })),
);
const NorthstarOnboardingPage = lazy(() =>
  import("./pages/NorthstarOnboardingPage").then((m) => ({
    default: m.NorthstarOnboardingPage,
  })),
);
const VcfNetworkPage = lazy(() =>
  import("./pages/VcfNetworkPage").then((m) => ({ default: m.VcfNetworkPage })),
);
const XenithWebsitePage = lazy(() =>
  import("./pages/XenithWebsitePage").then((m) => ({
    default: m.XenithWebsitePage,
  })),
);
const AdminPage = lazy(() =>
  import("./pages/AdminPage").then((m) => ({ default: m.AdminPage })),
);
const NotFoundPage = lazy(() =>
  import("./pages/NotFoundPage").then((m) => ({ default: m.NotFoundPage })),
);
import { Toaster } from "./components/ui/sonner";
import {
  Github,
  Linkedin,
  Mail,
  Instagram,
} from "lucide-react";
import { motion } from "motion/react";
import { ThemeProvider } from "./contexts/ThemeContext";

/**
 * Shown while a split route chunk loads. Deliberately quiet — it reserves the
 * vertical space a page occupies so the footer does not jump up and back, and
 * announces itself to assistive tech without stealing focus. On a warm cache
 * this is typically never seen.
 */
function RouteFallback() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="page-min-height flex items-center justify-center"
    >
      <span className="sr-only">Loading page…</span>
      <span aria-hidden="true" className="route-spinner" />
    </div>
  );
}

// Inner component — rendered inside <Router> so useLocation() works.
function AppContent() {
  const { trackEvent } = useAnalytics();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100 via-transparent to-transparent dark:from-blue-900/20 opacity-60 pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-purple-100 via-transparent to-transparent dark:from-purple-900/20 opacity-60 pointer-events-none" />

      <div className="relative z-10">
        <ScrollToTop />
        <DocumentTitle />
        <Navigation />
        <Suspense fallback={<RouteFallback />}>
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
            <Route path="/admin" element={<AdminPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
        <footer className="relative text-gray-600 dark:text-gray-300 py-8 mt-24">
          <div className="container mx-auto px-4 text-center">
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
                  onClick={() => trackEvent('contact_click', href)}
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
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}
