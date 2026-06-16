import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef, useEffect, useState } from "react";
import { ExternalLink, ChevronUp, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
const northstarOnboardingImg = "https://drive.google.com/thumbnail?id=1HqhvHG_GfB_Uwr1V3lqtvbIfcpf18_lJ&sz=w1920";
const traditionalDataCenterImg = "https://drive.google.com/thumbnail?id=1teQvlYsa8TiX7flMZPTPS0ua-x99LHSh&sz=w1920";
const challengeImg = "https://drive.google.com/thumbnail?id=1yUjPT_pIef4nT_4WrXhObMpX9A8AtcTZ&sz=w1920";
const systemDashboardImg = "https://drive.google.com/thumbnail?id=1dxRjdLi29Fnsb2KctjMUUzlnVKOXGd6R&sz=w1920";
const userGuideImg = "https://drive.google.com/thumbnail?id=1D0289nY6WZHVC2CmO9Ru1DLbEjHoa13D&sz=w1920";
const onboardingStepsImg = "https://drive.google.com/thumbnail?id=1NA8P9-tUQPoHH7xOUia1oq8xELl9qtAE&sz=w1920";
const transitionalPageImg = "https://drive.google.com/thumbnail?id=10cOai88O3tVO5-C07Lh-ScBP7f6jMCb5&sz=w1920";
const globalHomepageImg = "https://drive.google.com/thumbnail?id=1PIhrBC0UWrQmDIrp9jbUdbz9puqqMKqt&sz=w1920";
const targetUserImg = "https://drive.google.com/thumbnail?id=1FmLV3EaJwRUPtTH5bTfTAxtZ0Md1fCUB&sz=w1920";
const redefineOnboardingImg = "https://drive.google.com/thumbnail?id=1Sh572_jnGLglbZ_W9-yN9YiWfcQ7eb-r&sz=w1920";
const designPrinciplesImg = "https://drive.google.com/thumbnail?id=1UGnTL2KGJjzEvUPGh3knv4t-hMkzmkHY&sz=w1920";
const successMetricsImg = "https://drive.google.com/thumbnail?id=1NzgpPkpyDBGpGHkDP10UZF90MNNOcpTR&sz=w1920";
const optimizingWorkflowImg = "https://drive.google.com/thumbnail?id=1MkCcv8p_RYwtxQFb_Dzg26WNisSU1PCd&sz=w1920";
const workflowDiagramImg = "https://drive.google.com/thumbnail?id=1_oTRu66FRNoc5G8qoSNBNdJA6K0K6sDl&sz=w1920";
const oldTransitionalPatternImg = "https://drive.google.com/thumbnail?id=1IEeRgHKtDN8M4jmuBsqn4oineXxoA3k1&sz=w1920";
const proposedOnboardingGuideImg = "https://drive.google.com/thumbnail?id=1FrPS9qyElKePt8Pon5NII1nunM37tkUl&sz=w1920";

export function NorthstarOnboardingPage() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [expandedImage, setExpandedImage] = useState<{ src: string; alt: string } | null>(null);
  const [activeSection, setActiveSection] = useState<string>("");
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const carouselSlides = [
    { src: systemDashboardImg, label: "System Dashboard" },
    { src: userGuideImg, label: "User Guide" },
    { src: onboardingStepsImg, label: "Onboarding Steps" },
    { src: transitionalPageImg, label: "Transitional Page During Deployment" },
    { src: globalHomepageImg, label: "Global Homepage" }
  ];

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
        "redefine-onboarding",
        "approach-strategy",
        "success-metrics",
        "optimizing-workflow",
        "transitional-pages",
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
    { id: "brief", label: "What is NSX+?" },
    { id: "problem", label: "The Challenge" },
    { id: "solution-overview", label: "Solution Highlight" },
    { id: "design-challenge", label: "Target User & Pain Point" },
    { id: "redefine-onboarding", label: "Redefine Onboarding" },
    { id: "approach-strategy", label: "Design Principles" },
    { id: "success-metrics", label: "Success Metrics" },
    { id: "optimizing-workflow", label: "Optimizing Workflow" },
    { id: "transitional-pages", label: "Transitional Pages" },
    { id: "impact", label: "Impact" },
    { id: "learnings-reflections", label: "Learnings & Reflections" }
  ];

  return (
    <main className="pt-20 pb-24">
      {/* Full-width hero image */}
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto py-12">
          <img
            src={northstarOnboardingImg}
            alt="Northstar Onboarding"
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
                <p className="text-lg text-gray-900 dark:text-gray-100">UI/UX Design</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">My Role</p>
                <p className="text-lg text-gray-900 dark:text-gray-100">Lead UX designer</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Team</p>
                <p className="text-lg text-gray-900 dark:text-gray-100">2 Product Managers, 8 Engineers</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Timeline</p>
                <p className="text-lg text-gray-900 dark:text-gray-100">March 2022 - March 2023</p>
              </div>
            </div>
          </div>

          {/* Brief */}
          <div className="mb-16" id="brief">
            <h2 className="text-3xl md:text-4xl leading-tight mb-10 bg-gradient-to-r from-[#102F56] to-[#1a4d7a] dark:from-blue-300 dark:to-blue-400 bg-clip-text text-transparent">
              What is NSX+?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <div className="space-y-6 text-lg text-gray-700 dark:text-gray-200 leading-relaxed">
                <p>
                  NSX+ is a B2B SaaS cloud-native networking and security platform, designed to provide advanced networking capabilities and security services for traditional data centers.
                </p>
                <p>
                  It extends the capabilities of VMware NSX, emphasizing integration with cloud environments, and simplify networking and security operations in complex environments, enhancing agility and security for businesses adopting cloud technologies.
                </p>
              </div>
              <div>
                <img
                  src={traditionalDataCenterImg}
                  alt="Traditional Data Center"
                  className="w-full h-auto"
                  style={{ borderRadius: '10px' }}
                />
                <p className="text-center text-gray-700 dark:text-gray-200 mt-4">Traditional Data Center</p>
              </div>
            </div>
          </div>

          {/* Problem */}
          <div className="mb-16" id="problem">
            <h2 className="text-3xl md:text-4xl leading-tight mb-10 bg-gradient-to-r from-[#102F56] to-[#1a4d7a] dark:from-blue-300 dark:to-blue-400 bg-clip-text text-transparent">
              The Challenge
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <div>
                <img
                  src={challengeImg}
                  alt="Private Cloud to Public Cloud Transition"
                  className="w-full h-auto"
                  style={{ borderRadius: '10px' }}
                />
                <p className="text-center text-gray-700 dark:text-gray-200 mt-4">SaaS Transformation</p>
              </div>
              <div className="space-y-6 text-lg text-gray-700 dark:text-gray-200 leading-relaxed">
                <p>
                  VMware NSX is facing the challenge of transforming from private cloud solutions to seamlessly integrate public cloud services.
                </p>
                <p>
                  This transition highlights the necessity for a holistic approach to selecting bundles and onboarding processes, which is essential for providing users with a smooth and engaging start.
                </p>
                <p>
                  The Northstar onboarding experience serves as the critical initial touchpoint, making it imperative to design an intuitive interface that empowers users to thrive and effectively meet their needs.
                </p>
              </div>
            </div>
          </div>

          {/* Solution Overview */}
          <div className="mb-16" id="solution-overview">
            <h2 className="text-3xl md:text-4xl leading-tight mb-10 bg-gradient-to-r from-[#102F56] to-[#1a4d7a] dark:from-blue-300 dark:to-blue-400 bg-clip-text text-transparent">
              Solution Highlight
            </h2>
            <div className="space-y-6 text-lg text-gray-700 dark:text-gray-200 leading-relaxed mb-10">
              <p>
                The Northstar project aims to simplify free trial and onboarding process for users, optimizing workflow in complex environments. By integrating and adopting cloud technologies, businesses can enhance agility and security when managing their data centers.
              </p>
            </div>
            
            {/* Carousel */}
            <div className="relative">
              <div className="overflow-hidden relative" style={{ borderRadius: '10px' }}>
                <motion.div
                  className="flex"
                  animate={{ x: `-${currentSlide * 100}%` }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  {carouselSlides.map((slide, index) => (
                    <div key={index} className="min-w-full relative">
                      <img
                        src={slide.src}
                        alt={slide.label}
                        className="w-full h-auto"
                        style={{ borderRadius: '10px' }}
                      />
                      {/* Overlay Label */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                        <p className="text-white text-lg">
                          {slide.label}
                        </p>
                      </div>
                    </div>
                  ))}
                </motion.div>
              </div>
              
              {/* Navigation Buttons */}
              <button
                onClick={() => setCurrentSlide((prev) => (prev > 0 ? prev - 1 : carouselSlides.length - 1))}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm hover:bg-white p-3 shadow-lg transition-all"
                style={{ borderRadius: '10px' }}
              >
                <ChevronLeft className="w-6 h-6 text-gray-800" />
              </button>
              <button
                onClick={() => setCurrentSlide((prev) => (prev < carouselSlides.length - 1 ? prev + 1 : 0))}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm hover:bg-white p-3 shadow-lg transition-all"
                style={{ borderRadius: '10px' }}
              >
                <ChevronRight className="w-6 h-6 text-gray-800" />
              </button>
              
              {/* Dots Indicator */}
              <div className="flex justify-center gap-2 mt-6">
                {carouselSlides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentSlide ? 'bg-blue-600 w-8' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Design Challenge */}
          <div className="mb-16" id="design-challenge">
            <h2 className="text-3xl md:text-4xl leading-tight mb-10 bg-gradient-to-r from-[#102F56] to-[#1a4d7a] dark:from-blue-300 dark:to-blue-400 bg-clip-text text-transparent">
              Target User & Pain Point
            </h2>
            <div className="space-y-6 text-lg text-gray-700 dark:text-gray-200 leading-relaxed">
              <p>
                The main target user is IT Administrator, who's responsible for managing the organization's virtual network infrastructure, maintaining system performance in IT department. Their main duties include configuring network settings, monitoring network health, and troubleshooting issues.
              </p>
              <p>
                The key pain point for these administrators is the desire to self-onboard NSX+ using their actual data center rather than relying on sales personnel. They seek a streamlined, intuitive onboarding process that allows them to efficiently integrate NSX+ into their existing environment, enabling them to securely leverage real data and configurations under cloud environment.
              </p>
            </div>
            <div className="mt-8">
              <img
                src={targetUserImg}
                alt="IT Administrator Target User"
                className="w-full h-auto"
                style={{ borderRadius: '10px' }}
              />
            </div>
          </div>

          {/* Redefine Onboarding */}
          <div className="mb-16" id="redefine-onboarding">
            <h2 className="text-3xl md:text-4xl leading-tight mb-10 bg-gradient-to-r from-[#102F56] to-[#1a4d7a] dark:from-blue-300 dark:to-blue-400 bg-clip-text text-transparent">
              Redefine Onboarding Experience
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <div className="space-y-6 text-lg text-gray-700 dark:text-gray-200 leading-relaxed">
                <p>
                  Previously, the onboarding process for user is to directly talk to sales when they encounter any issues for key features and relevant subscriptions.
                </p>
                <p>
                  The goal is to make the onboarding process more intuitive and self-explanatory, user can explore it with customized recommendation base on their actual environment. To summarize, that is to switch the onboarding experience from <span className="text-gray-900 dark:text-gray-100">Sales Led → Product Led</span>.
                </p>
              </div>
              <div>
                <img
                  src={redefineOnboardingImg}
                  alt="Redefine Onboarding Experience - Sales Led to Product Led"
                  className="w-full h-auto"
                  style={{ borderRadius: '10px' }}
                />
              </div>
            </div>
          </div>

          {/* Design Principles */}
          <div className="mb-16" id="approach-strategy">
            <h2 className="text-3xl md:text-4xl leading-tight mb-10 bg-gradient-to-r from-[#102F56] to-[#1a4d7a] dark:from-blue-300 dark:to-blue-400 bg-clip-text text-transparent">
              Design Principles
            </h2>
            <div className="space-y-6 text-lg text-gray-700 dark:text-gray-200 leading-relaxed mb-10">
              <p>
                To address these challenges and pain points, I collaborated with key stakeholders to empower security IT Administrators to onboard NSX+ with confidence. I led the design strategy with a focus on three core principles:
              </p>
              <ul className="list-disc pl-6 space-y-4">
                <li>
                  <span className="text-gray-900 dark:text-gray-100">Efficiency:</span> The onboarding process should be streamlined, ensuring users are not overwhelmed by excessive steps or time commitments.
                </li>
                <li>
                  <span className="text-gray-900 dark:text-gray-100">Intuitive:</span> Each step must be clear and instructional, providing guidance that eliminates the need for documentation or technical support.
                </li>
                <li>
                  <span className="text-gray-900 dark:text-gray-100">Trustworthy:</span> Users should feel secure and confident when connecting to their own data centers, fostering a sense of safety throughout the onboarding experience.
                </li>
              </ul>
            </div>
            <div className="mt-8">
              <img
                src={designPrinciplesImg}
                alt="Design Principles - Efficient, Intuitive, Trustworthy"
                className="w-full h-auto"
                style={{ borderRadius: '10px' }}
              />
            </div>
          </div>

          {/* Success Metrics */}
          <div className="mb-16" id="success-metrics">
            <h2 className="text-3xl md:text-4xl leading-tight mb-10 bg-gradient-to-r from-[#102F56] to-[#1a4d7a] dark:from-blue-300 dark:to-blue-400 bg-clip-text text-transparent">
              Success Metrics
            </h2>
            <div className="space-y-6 text-lg text-gray-700 dark:text-gray-200 leading-relaxed mb-10">
              <p>
                The goal of this project is promote usage of key networking and security features, and increase the financial outcome of the product revenue when users are satisfied with the onboarding experience. Thus, I initiated a discussion with PM and engineers to track the following metrics:
              </p>
            </div>
            <div className="mt-8 overflow-hidden rounded-[10px]">
              <img
                src={successMetricsImg}
                alt="Success Metrics - Adoption, Revenue, Satisfaction"
                className="w-full h-auto -my-[9%]"
              />
            </div>
          </div>

          {/* Optimizing Workflow */}
          <div className="mb-16" id="optimizing-workflow">
            <h2 className="text-3xl md:text-4xl leading-tight mb-10 bg-gradient-to-r from-[#102F56] to-[#1a4d7a] dark:from-blue-300 dark:to-blue-400 bg-clip-text text-transparent">
              Optimizing Workflow
            </h2>
            <div className="space-y-6 text-lg text-gray-700 dark:text-gray-200 leading-relaxed mb-10">
              <p>
                With the goals and metrics in mind, I collaborated with key stakeholders on project requirements, and visualize the major steps a clear understanding on the representation of connections between cloud and on-premises environment. In this way, it would be more straightforward to illustrate the key areas that needs intuitive, instructional design for users.
              </p>
            </div>
            <div className="mt-8 mb-10">
              <img
                src={optimizingWorkflowImg}
                alt="Optimizing Workflow - Major Steps Overview"
                className="w-full h-auto"
                style={{ borderRadius: '10px' }}
              />
            </div>
            <div className="space-y-6 text-lg text-gray-700 dark:text-gray-200 leading-relaxed mb-10">
              <p>
                I try to align the gap by bring customer's voice to the table, the optimized workflow address key user concerns by:
              </p>
              <ul className="list-disc pl-6 space-y-4">
                <li>
                  Protect credential by introducing cloud gateway, which bridge the gap between cloud and on-premises data centers, with more user-trust on the safety of connection.
                </li>
                <li>
                  Encourage user to explore features by making it intuitive, clear and simple.
                </li>
                <li>
                  Provide onboarding guide to make users feel more confident with purchasing subscription.
                </li>
              </ul>
            </div>
            <div className="mt-8">
              <img
                src={workflowDiagramImg}
                alt="Optimized Workflow Diagram - Cloud and On-Premises Environment"
                className="w-full h-auto"
                style={{ borderRadius: '10px' }}
              />
            </div>
          </div>

          {/* Transitional Pages */}
          <div className="mb-16" id="transitional-pages">
            <h2 className="text-3xl md:text-4xl leading-tight mb-10 bg-gradient-to-r from-[#102F56] to-[#1a4d7a] dark:from-blue-300 dark:to-blue-400 bg-clip-text text-transparent">
              Transitional Pages
            </h2>
            <div className="space-y-6 text-lg text-gray-700 dark:text-gray-200 leading-relaxed mb-10">
              <p>
                The old transitional page provides limited capabilities to access to the home page, showing progress bar in a full page.
              </p>
              <p>
                In the proposed pattern, it solves the pain point by showing progress bar and visualized instructions in a pop-up modal, with slideshow format in carousal. The experience provides IT admin and tenant with quick tutorials to learn more about their permissions to the system.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <img
                  src={oldTransitionalPatternImg}
                  alt="Old Transitional Pattern"
                  className="w-full h-auto"
                  style={{ borderRadius: '10px' }}
                />
                <p className="text-center text-gray-700 dark:text-gray-200 mt-4">Old Transitional Pattern</p>
              </div>
              <div>
                <img
                  src={proposedOnboardingGuideImg}
                  alt="Proposed Onboarding Guide"
                  className="w-full h-auto"
                  style={{ borderRadius: '10px' }}
                />
                <p className="text-center text-gray-700 dark:text-gray-200 mt-4">Proposed Onboarding Guide</p>
              </div>
            </div>
          </div>

          {/* Impact */}
          <div className="mb-16" id="impact">
            <h2 className="text-3xl md:text-4xl leading-tight mb-10 bg-gradient-to-r from-[#102F56] to-[#1a4d7a] dark:from-blue-300 dark:to-blue-400 bg-clip-text text-transparent">
              Impact
            </h2>
            <div className="space-y-6 text-lg text-gray-700 dark:text-gray-200 leading-relaxed">
              <ul className="list-disc pl-6 space-y-4">
                <li>
                  <span className="text-gray-900 dark:text-gray-100">80%+ adoption rate</span> from onboarding experience to subscribing to key networking and security features.
                </li>
                <li>
                  <span className="text-gray-900 dark:text-gray-100">30% increase</span> in total revenue of NSX+ subscription.
                </li>
                <li>
                  <span className="text-gray-900 dark:text-gray-100">9 out of 10</span> in customer satisfaction rate.
                </li>
              </ul>
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
                  Take the ownership on as a design lead for guiding the project from concept to completion.
                </li>
                <li>
                  Clarify the vagueness together with stakeholders by sharing objectives and requirements.
                </li>
                <li>
                  Proactive communication with cross-functional teams to align design decisions with user needs and business goals.
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
    </main>
  );
}