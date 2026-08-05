import { useState, useEffect } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";
import { Button } from "./ui/button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logoImage from "../assets/mh_logo.png";
import { useTheme } from "../contexts/ThemeContext";

/**
 * Light/dark toggle switch. The knob sits on — and shows the icon of — the
 * theme you are currently in; the opposite end stays visible as a faint hint.
 * With no saved choice the theme follows the device (see ThemeContext).
 */
function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const [showFocusRing, setShowFocusRing] = useState(false);
  const isDark = theme === "dark";

  // NOTE: this project ships a pre-built Tailwind stylesheet (src/index.css)
  // rather than running Tailwind at build time, so arbitrary-value utilities
  // (w-[60px], translate-x-[28px], dark:bg-[#…]/10) do not exist and silently
  // do nothing. All geometry and colour therefore live in inline styles.
  const track = isDark
    ? {
        background: isHovered ? "rgba(255,255,255,0.16)" : "rgba(255,255,255,0.10)",
        borderColor: "rgba(109,178,255,0.35)",
      }
    : {
        background: isHovered ? "rgba(16,47,86,0.16)" : "rgba(16,47,86,0.10)",
        borderColor: "rgba(16,47,86,0.20)",
      };

  const focusRing = isDark
    ? "0 0 0 2px rgba(109,178,255,0.85)"
    : "0 0 0 2px rgba(26,77,122,0.85)";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      onClick={toggleTheme}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={(e) => setShowFocusRing(e.currentTarget.matches(":focus-visible"))}
      onBlur={() => setShowFocusRing(false)}
      title={isDark ? "Dark mode — switch to light" : "Light mode — switch to dark"}
      aria-label={isDark ? "Dark mode. Switch to light mode." : "Light mode. Switch to dark mode."}
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        flexShrink: 0,
        width: 64,
        height: 34,
        padding: 0,
        border: "1px solid",
        borderRadius: 9999,
        cursor: "pointer",
        WebkitBackdropFilter: "blur(4px)",
        backdropFilter: "blur(4px)",
        transition: "background-color 300ms, border-color 300ms, box-shadow 200ms",
        outline: "none",
        boxShadow: showFocusRing ? focusRing : "none",
        ...track,
      }}
    >
      {/* Faint end hints so both states read at a glance */}
      <Sun
        aria-hidden="true"
        style={{
          position: "absolute",
          left: 10,
          width: 14,
          height: 14,
          color: isDark ? "rgba(253,230,138,0.45)" : "rgba(16,47,86,0.35)",
          pointerEvents: "none",
        }}
      />
      <Moon
        aria-hidden="true"
        style={{
          position: "absolute",
          right: 10,
          width: 14,
          height: 14,
          color: isDark ? "rgba(109,178,255,0.55)" : "rgba(16,47,86,0.35)",
          pointerEvents: "none",
        }}
      />

      {/* Sliding knob carrying the active icon */}
      <span
        style={{
          position: "absolute",
          left: 4,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 24,
          height: 24,
          borderRadius: 9999,
          pointerEvents: "none",
          transform: isDark ? "translateX(30px)" : "translateX(0)",
          transition: "transform 300ms cubic-bezier(0.4, 0, 0.2, 1), background 300ms",
          background: isDark
            ? "linear-gradient(135deg, #6DB2FF, #5a9ae6)"
            : "#ffffff",
          boxShadow: isDark
            ? "0 1px 4px rgba(0,0,0,0.45)"
            : "0 1px 4px rgba(16,47,86,0.35)",
        }}
      >
        {isDark ? (
          <Moon aria-hidden="true" style={{ width: 14, height: 14, color: "#102F56" }} />
        ) : (
          <Sun aria-hidden="true" style={{ width: 14, height: 14, color: "#f59e0b" }} />
        )}
      </span>
    </button>
  );
}

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { theme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "About", path: "/about" },
    { label: "Resume", path: "/resume" },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (location.pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNavLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    if (location.pathname === path) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? "backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 shadow-lg border-b border-white/20 dark:border-gray-700/20 py-4" 
          : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center"
            onClick={handleLogoClick}
          >
            <img
              src={logoImage}
              alt="Mu He — Home"
              className="h-14 w-auto transition-all duration-300"
              style={{
                filter: theme === 'dark'
                  ? 'brightness(0) saturate(100%) invert(64%) sepia(85%) saturate(1535%) hue-rotate(188deg) brightness(103%) contrast(101%)'
                  : 'none'
              }}
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={(e) => handleNavLinkClick(e, link.path)}
                className={`px-4 py-2 rounded-full transition-all duration-300 ${
                  isActive(link.path)
                    ? "bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm shadow-md text-[#102F56] dark:text-blue-300"
                    : "text-gray-700 dark:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-800/50 backdrop-blur-sm hover:shadow-md"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              className="backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-200"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div id="mobile-menu" className="md:hidden mt-4 py-4 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700/20">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={(e) => handleNavLinkClick(e, link.path)}
                className={`block w-full text-left px-4 py-3 transition-colors rounded-lg mx-2 ${
                  isActive(link.path)
                    ? "bg-white/70 dark:bg-gray-800/70 text-[#102F56] dark:text-blue-300"
                    : "text-gray-700 dark:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-800/50"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}