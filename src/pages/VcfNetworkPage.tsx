import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef, useEffect, useState } from "react";
import { ExternalLink, ChevronUp, X, Lock } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
// Case study assets, exported from the NetOps deck.
// The previous hero import pointed at src/assets/501379d3….png, which is not a
// PNG at all — it is an ASCII file containing base64 — so it could never render.
import netopsOverviewImg from "../assets/netops/netops-overview.png";
import netopsContextImg from "../assets/netops/netops-context.png";
import netopsIaImg from "../assets/netops/netops-ia.png";
import netopsFirstVersionImg from "../assets/netops/netops-first-version.png";
import netopsFinalImg from "../assets/netops/netops-final.png";

export function VcfNetworkPage() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [expandedImage, setExpandedImage] = useState<{ src: string; alt: string } | null>(null);
  const [activeSection, setActiveSection] = useState<string>("");
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [error, setError] = useState(false);

  // Access code for this case study, supplied at build time (see .env.example
  // and the VITE_VCF_PROJECT_PASSWORD secret in the deploy workflow).
  //
  // Be clear about what this is and is not. Any check that runs in the browser
  // ships its comparison value in the bundle, so this is a courtesy gate — it
  // keeps the work off search results and away from casual browsing, and it is
  // not a security control. Anything genuinely covered by an NDA should not be
  // published here at all. Moving the value out of source keeps it from sitting
  // in a public repository; it does not make the gate unbreakable.
  //
  // The page content itself is not rendered until this passes, so it is not
  // sitting in the DOM behind the overlay.
  const PROJECT_PASSWORD = import.meta.env.VITE_VCF_PROJECT_PASSWORD ?? "";
  const isAccessConfigured = PROJECT_PASSWORD.length > 0;

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
        // "impact",  // IMPACT: re-enable together with the section markup
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
    // { id: "impact", label: "Impact" },  // IMPACT: re-enable with the section
    { id: "learnings-reflections", label: "Learnings & Reflections" }
  ];

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAccessConfigured && passwordInput === PROJECT_PASSWORD) {
      setIsAuthenticated(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  return (
    <main className="pt-20 pb-24 vcf-body">
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

              {/* If the build had no access code, say so plainly rather than
                  showing a field that can never succeed. Missing the secret in
                  CI would otherwise look like the visitor's password is wrong. */}
              {!isAccessConfigured ? (
                <p className="text-center text-gray-700 dark:text-gray-200">
                  Access for this case study isn't set up right now. Please get
                  in touch and I'll share it with you directly.
                </p>
              ) : (
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
              )}

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
                src={netopsOverviewImg}
                alt="VCF Network Operations title card, showing the Network Operations dashboard with network inventory, alert trends and traffic summary widgets."
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
                {/* Page title. Added for heading structure: these pages had no h1 —
                    and in fact no visible project name at all, only the hero image. */}
                <h1
                  className="text-4xl md:text-5xl mb-8 bg-gradient-to-r from-[#102F56] to-[#1a4d7a] dark:from-blue-300 dark:to-blue-400 bg-clip-text text-transparent"
                  style={{ lineHeight: "1.3" }}
                >
                  VCF Network Operations
                </h1>

                <p className="text-xl text-gray-700 dark:text-gray-200 mb-10">
                  Integrating advanced network capabilities into cloud-infra
                  monitoring, addressing uncertainties in a real business
                  environment.
                </p>

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
                    <p className="text-lg text-gray-900 dark:text-gray-100">March 2024 - March 2025</p>
                  </div>
                </div>
              </div>

              {/* Brief */}
              <div className="mb-16" id="brief">
                <h2 className="text-3xl md:text-4xl leading-tight mb-10 bg-gradient-to-r from-[#102F56] to-[#1a4d7a] dark:from-blue-300 dark:to-blue-400 bg-clip-text text-transparent">
                  Brief
                </h2>
                <div className="space-y-6 text-lg text-gray-700 dark:text-gray-200 leading-relaxed">
                  <p>
                    VCF Network Insights (vRNI) provides real-time visibility and
                    analytics of network traffic, performance, and security,
                    enabling proactive issue detection, efficient management, and
                    enhanced network optimization.
                  </p>
                  <p>
                    VCF Operations simplifies IT operations management by providing
                    comprehensive monitoring, analytics, and optimization for
                    applications, infrastructure, and cloud environments. With vRNI
                    integrated, VI admins will experience a next level VCF
                    Operations which is enhanced with network optimization.
                  </p>
                </div>
              </div>

              {/* Problem */}
              <div className="mb-16" id="problem">
                <h2 className="text-3xl md:text-4xl leading-tight mb-10 bg-gradient-to-r from-[#102F56] to-[#1a4d7a] dark:from-blue-300 dark:to-blue-400 bg-clip-text text-transparent">
                  Problem
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div className="space-y-6 text-lg text-gray-700 dark:text-gray-200 leading-relaxed">
                    <p>
                      <span className="text-gray-900 dark:text-gray-100">
                        VI Admin
                      </span>{" "}
                      — monitor infrastructure on VCF Operations.
                    </p>
                    <p>
                      Integrating Network Insights (vRNI) into VCF Operations as
                      the core Network capability, along with Compute and Storage.
                    </p>
                  </div>
                  <div>
                    <img
                      src={netopsContextImg}
                      alt="Anita, a VI Admin, looking at VCF Operations. Compute, Storage and Network are listed as capabilities, with Network highlighted and mapped to Network Insights (vRNI) Operations for Network."
                      className="w-full h-auto cursor-pointer hover:opacity-90 transition-opacity"
                      style={{ borderRadius: '10px' }}
                      onClick={() =>
                        setExpandedImage({
                          src: netopsContextImg,
                          alt: "Anita, a VI Admin, and the VCF Operations capability map",
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Solution Overview */}
              <div className="mb-16" id="solution-overview">
                <h2 className="text-3xl md:text-4xl leading-tight mb-10 bg-gradient-to-r from-[#102F56] to-[#1a4d7a] dark:from-blue-300 dark:to-blue-400 bg-clip-text text-transparent">
                  Solution Overview
                </h2>
                <p className="text-lg text-gray-700 dark:text-gray-200 leading-relaxed mb-10">
                  Integration of Information Architecture by grouping vRNI
                  features and integrating them into Ops navigation, with a
                  customizable dashboard and quick-link navigation to pages.
                </p>
                {/* One wide diagram rather than the template's 2x2 grid: this is
                    a single two-stage flow and splitting it would break it. */}
                <figure>
                  <img
                    src={netopsIaImg}
                    alt="Information architecture diagram. Stage 1 groups vRNI features such as Flow Analysis, Network Path, Network Map, Applications and Security Planning. Stage 2 maps each group into VCF Ops navigation under Infrastructure Operations, Security and Administration."
                    className="w-full h-auto cursor-pointer hover:opacity-90 transition-opacity"
                    style={{ borderRadius: '10px' }}
                    onClick={() =>
                      setExpandedImage({
                        src: netopsIaImg,
                        alt: "Information architecture: grouping vRNI features and mapping them into Ops navigation",
                      })
                    }
                  />
                  <figcaption className="text-center text-gray-700 dark:text-gray-200 mt-4">
                    Stage 1 groups the vRNI features; stage 2 maps each group into
                    the existing Ops navigation.
                  </figcaption>
                </figure>
              </div>

              {/* Design Challenge */}
              <div className="mb-16" id="design-challenge">
                <h2 className="text-3xl md:text-4xl leading-tight mb-10 bg-gradient-to-r from-[#102F56] to-[#1a4d7a] dark:from-blue-300 dark:to-blue-400 bg-clip-text text-transparent">
                  Design Challenge
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                  <div className="space-y-8 text-lg text-gray-700 dark:text-gray-200 leading-relaxed">
                    <div className="space-y-4">
                      <h3 className="text-xl text-gray-900 dark:text-gray-100">
                        1st Version
                      </h3>
                      <p>
                        For the first vRNI integration proposal, Network
                        Operations only includes and shows vRNI data:
                      </p>
                      <ul className="list-disc pl-6 space-y-3">
                        <li>All vRNI features are available on VCF Ops;</li>
                        <li>Most of the vRNI features are quick links;</li>
                        <li>
                          Those features are not embedded with VCF Ops navigation,
                          and one of the reasons is because the search
                          technologies between vRNI and Ops are different, which
                          will not happen for 9.0.
                        </li>
                      </ul>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-xl text-gray-900 dark:text-gray-100">
                        Scope Change
                      </h3>
                      <p>
                        The direction of vRNI integration changed, so the scope
                        and requirements changed accordingly:
                      </p>
                      <ul className="list-disc pl-6 space-y-3">
                        <li>
                          Network Operations is a home for both NSX and vRNI;
                        </li>
                        <li>
                          Instead of bringing all features to Ops without mapping
                          them to Ops navigation properly, only focus on the top
                          2–3 features;
                        </li>
                        <li>
                          There is no quick link, and all the features are
                          integrated with Ops.
                        </li>
                      </ul>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-xl text-gray-900 dark:text-gray-100">
                        Key Constraints
                      </h3>
                      <ul className="list-disc pl-6 space-y-3">
                        <li>
                          The timeline for UX and engineering is restricted;
                        </li>
                        <li>
                          It was unclear what data would be shown on NetOps.
                        </li>
                      </ul>
                    </div>
                  </div>
                  <figure className="md:sticky md:top-28">
                    <img
                      src={netopsFirstVersionImg}
                      alt="The first Network Operations proposal inside VCF Ops: an Overview tab alongside three custom boards, with Network Alerts, Top Network Insights, NSX Enabled, Traffic Summary and Top Anomalies widgets."
                      className="w-full h-auto cursor-pointer hover:opacity-90 transition-opacity"
                      style={{ borderRadius: '10px' }}
                      onClick={() =>
                        setExpandedImage({
                          src: netopsFirstVersionImg,
                          alt: "First version of the Network Operations page",
                        })
                      }
                    />
                    <figcaption className="text-gray-700 dark:text-gray-200 mt-4">
                      The first proposal: all vRNI features surfaced on VCF Ops,
                      mostly as quick links.
                    </figcaption>
                  </figure>
                </div>
              </div>

              {/* Approach & Strategy */}
              <div className="mb-16" id="approach-strategy">
                <h2 className="text-3xl md:text-4xl leading-tight mb-10 bg-gradient-to-r from-[#102F56] to-[#1a4d7a] dark:from-blue-300 dark:to-blue-400 bg-clip-text text-transparent">
                  Approach & Strategy
                </h2>
                <div className="space-y-8 text-lg text-gray-700 dark:text-gray-200 leading-relaxed">
                  <div className="space-y-4">
                    <h3 className="text-xl text-gray-900 dark:text-gray-100">
                      Research Insights
                    </h3>
                    <ul className="list-disc pl-6 space-y-3">
                      <li>
                        Refer to the product managers' guideline between VCF and
                        NSX to determine what data should be included in NetOps;
                      </li>
                      <li>
                        Research sessions are planned as the reference for 9.1.
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xl text-gray-900 dark:text-gray-100">
                      Convert Customized Patterns to Design Library
                    </h3>
                    <p>
                      As a major step of the integration process, I broke the
                      pattern conversion down into three phases, based on the time
                      and effort each takes.
                    </p>
                    <ul className="list-disc pl-6 space-y-3">
                      <li>
                        <span className="text-gray-900 dark:text-gray-100">
                          Phase 1:
                        </span>{" "}
                        Documented vRNI customized patterns and looked for the
                        equivalent Clarity Design patterns;
                      </li>
                      <li>
                        <span className="text-gray-900 dark:text-gray-100">
                          Phase 2:
                        </span>{" "}
                        Started from simple components like fonts, links and
                        buttons;
                      </li>
                      <li>
                        <span className="text-gray-900 dark:text-gray-100">
                          Phase 3:
                        </span>{" "}
                        Continued to align on complex patterns like widgets and
                        list views.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Final Implementation */}
              <div className="mb-16" id="final-implementation">
                <h2 className="text-3xl md:text-4xl leading-tight mb-10 bg-gradient-to-r from-[#102F56] to-[#1a4d7a] dark:from-blue-300 dark:to-blue-400 bg-clip-text text-transparent">
                  Final Implementation
                </h2>
                <figure>
                  <img
                    src={netopsFinalImg}
                    alt="The revised Network Operations page: a single Network Inventory summary across NSX instances, transport nodes, edge clusters, logical routers and switches, above Network Alerts Trend, VPC Enabled NSX Managers, Diagnostics Findings, NSX Health, Traffic Summary and Business Applications with Flows."
                    className="w-full h-auto cursor-pointer hover:opacity-90 transition-opacity"
                    style={{ borderRadius: '10px' }}
                    onClick={() =>
                      setExpandedImage({
                        src: netopsFinalImg,
                        alt: "The revised Network Operations page after the scope change",
                      })
                    }
                  />
                  <figcaption className="text-gray-700 dark:text-gray-200 mt-4">
                    After the scope change: the custom boards and quick links are
                    gone, and what remains is integrated into Ops navigation and
                    focused on a small number of high-value views.
                  </figcaption>
                </figure>
              </div>

              {/*
                IMPACT — not rendered yet, on purpose.

                The metrics and visuals are coming separately. Rendering the
                template's "[Impact Item 1] - [Description]" bullets and grey
                "Placeholder Image" boxes would put visible filler on a live
                page, so the whole section is omitted until there is something
                real to show.

                To restore, do all three:
                  1. Re-add the section markup here, between Final
                     Implementation and Learnings & Reflections. The original
                     is in git history — `git show <this commit>^:src/pages/VcfNetworkPage.tsx`.
                  2. Uncomment "impact" in the `sections` array used by the
                     scroll-spy (search: IMPACT).
                  3. Uncomment the Impact entry in `tableOfContents`.
              */}

              {/* Learnings & Reflections */}
              <div className="mb-16" id="learnings-reflections">
                <h2 className="text-3xl md:text-4xl leading-tight mb-10 bg-gradient-to-r from-[#102F56] to-[#1a4d7a] dark:from-blue-300 dark:to-blue-400 bg-clip-text text-transparent">
                  Learnings & Reflections
                </h2>
                <div className="text-lg text-gray-700 dark:text-gray-200 leading-relaxed">
                  <ul className="list-disc pl-6 space-y-4">
                    <li>
                      <span className="text-gray-900 dark:text-gray-100">
                        Break down large projects into manageable steps
                      </span>
                      : It's common to feel overwhelmed by the scope while working
                      on a complex project. By dividing the overall objective into
                      small, digestible tasks.
                    </li>
                    <li>
                      <span className="text-gray-900 dark:text-gray-100">
                        Ambiguity is opportunity, not barrier
                      </span>
                      : As a designer, while dealing with user scenarios with no
                      clarity or prior experience, I view it as a time for
                      innovation rather than a roadblock, and find aspects to
                      explore and break through with creativity.
                    </li>
                    <li>
                      <span className="text-gray-900 dark:text-gray-100">
                        Strategic thinking is embedded in design decisions
                      </span>
                      : A product designer should not only create beautiful
                      interfaces, but also think holistically and strategically
                      about every design decision before implementing.
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