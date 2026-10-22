import { localize } from "../i18n/locale";
import { ProjectImageLightbox, activateImageOnKey } from "../components/case-study/ProjectImageLightbox";
import { ProjectHero } from "../components/case-study/ProjectHero";
import { ProjectNavigation } from "../components/case-study/ProjectNavigation";
import { Cloud } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
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

import northstarPlacementImg from "../assets/northstar/northstar-placement.svg";

export function NorthstarOnboardingPage() {
  const reduceMotion = useReducedMotion();
  const [expandedImage, setExpandedImage] = useState<{ src: string; alt: string; clipPath?: string } | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const carouselSlides = [
    { src: systemDashboardImg, label: "System Dashboard", aspect: 992 / 692 },
    { src: userGuideImg, label: "User Guide", aspect: 893 / 702 },
    { src: onboardingStepsImg, label: "Onboarding Steps", aspect: 905 / 786 },
    { src: transitionalPageImg, label: "Transitional Page During Deployment", aspect: 902 / 702 },
    { src: globalHomepageImg, label: "Global Homepage", aspect: 902 / 696 }
  ];

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
    { id: "placement-study", label: "Where Should the Guide Live?" },
    { id: "impact", label: "Impact" },
    { id: "learnings-reflections", label: "Learnings & Reflections" }
  ];

  return (
    <main className="case-study pt-20 pb-24 northstar-body">
      <ProjectHero
        title={localize("Northstar Onboarding")}
        description={localize("Streamlines B2B SaaS multi-cloud networking through centralized automation and enhanced visibility.")}
        icon={Cloud}
        image={{ src: "/media/project-covers/northstar.png", alt: "Northstar Onboarding welcome screen with setup prerequisites and cloud gateway guidance.", width: 1815, height: 906, crop: { x: 1002, y: 178, width: 702, height: 550 } }}
      />
      <ProjectNavigation sections={tableOfContents} />

      <div className="container mx-auto px-4">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.6 }}
          className="max-w-6xl mx-auto"
        >
          {/* Header */}
          <div className="mb-16">

            {/* Project Metadata in 2x2 Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{localize("Project Type")}</p>
                <p className="text-lg text-gray-900 dark:text-gray-100">{localize("UI/UX Design")}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{localize("My Role")}</p>
                <p className="text-lg text-gray-900 dark:text-gray-100">{localize("Lead UX designer")}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{localize("Team")}</p>
                <p className="text-lg text-gray-900 dark:text-gray-100">{localize("2 Product Managers, 8 Engineers")}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{localize("Timeline")}</p>
                <p className="text-lg text-gray-900 dark:text-gray-100">{localize("March 2022 - March 2023")}</p>
              </div>
            </div>
          </div>

          {/* Brief */}
          <div className="mb-16" id="brief">
            <h2 className="text-3xl md:text-4xl leading-tight mb-10 bg-gradient-to-r from-[#102F56] to-[#1a4d7a] dark:from-blue-300 dark:to-blue-400 bg-clip-text text-transparent">{localize("What is NSX+?")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <div className="space-y-6 text-lg text-gray-700 dark:text-gray-200 leading-relaxed">
                <p>{localize("NSX+ is a B2B SaaS cloud-native networking and security platform, designed to provide advanced networking capabilities and security services for traditional data centers.")}</p>
                <p>{localize("It extends the capabilities of VMware NSX, emphasizing integration with cloud environments and simplifying networking and security operations in complex deployments, enhancing agility and security for businesses adopting cloud technologies.")}</p>
              </div>
              <div>
                <div className="flex items-center justify-center overflow-hidden" style={{ borderRadius: '10px' }}>
                  <img
                    src={traditionalDataCenterImg}
                    alt={localize("Traditional Data Center")}
                    className="w-full h-auto cursor-pointer hover:opacity-90 transition-opacity"
                    style={{ transform: 'scale(1.05)', transformOrigin: 'center center' }}
                    role="button" tabIndex={0} aria-haspopup="dialog" onKeyDown={activateImageOnKey} onClick={() => setExpandedImage({ src: traditionalDataCenterImg, alt: "Traditional Data Center" })}
                  />
                </div>
                <p className="text-center text-gray-700 dark:text-gray-200 mt-4">{localize("Traditional Data Center")}</p>
              </div>
            </div>
          </div>

          {/* Problem */}
          <div className="mb-16" id="problem">
            <h2 className="text-3xl md:text-4xl leading-tight mb-10 bg-gradient-to-r from-[#102F56] to-[#1a4d7a] dark:from-blue-300 dark:to-blue-400 bg-clip-text text-transparent">{localize("The Challenge")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <div>
                <div className="flex items-center justify-center overflow-hidden" style={{ borderRadius: '10px' }}>
                  <img
                    src={challengeImg}
                    alt={localize("Private Cloud to Public Cloud Transition")}
                    className="w-full h-auto cursor-pointer hover:opacity-90 transition-opacity"
                    style={{ transform: 'scale(1.1)', transformOrigin: 'center center' }}
                    role="button" tabIndex={0} aria-haspopup="dialog" onKeyDown={activateImageOnKey} onClick={() => setExpandedImage({ src: challengeImg, alt: "Private Cloud to Public Cloud Transition" })}
                  />
                </div>
                <p className="text-center text-gray-700 dark:text-gray-200 mt-4">{localize("SaaS Transformation")}</p>
              </div>
              <div className="space-y-6 text-lg text-gray-700 dark:text-gray-200 leading-relaxed">
                <p>{localize("VMware NSX is facing the challenge of transforming from private cloud solutions to seamlessly integrating public cloud services.")}</p>
                <p>{localize("This transition highlights the necessity for a holistic approach to selecting bundles and onboarding processes, which is essential for providing users with a smooth and engaging start.")}</p>
                <p>{localize("The Northstar onboarding experience serves as the critical initial touchpoint, making it imperative to design an intuitive interface that empowers users to thrive and effectively meet their needs.")}</p>
              </div>
            </div>
          </div>

          {/* Solution Overview */}
          <div className="mb-16" id="solution-overview">
            <h2 className="text-3xl md:text-4xl leading-tight mb-10 bg-gradient-to-r from-[#102F56] to-[#1a4d7a] dark:from-blue-300 dark:to-blue-400 bg-clip-text text-transparent">{localize("Solution Highlight")}</h2>
            <div className="space-y-6 text-lg text-gray-700 dark:text-gray-200 leading-relaxed mb-10">
              <p>{localize("The Northstar project aims to simplify the free trial and onboarding process for users, optimizing workflow in complex environments. By integrating and adopting cloud technologies, businesses can enhance agility and security when managing their data centers.")}</p>
            </div>

            {/* Carousel */}
            <div className="relative">
              <motion.div
                className="overflow-hidden relative w-full"
                style={{ borderRadius: '10px' }}
                initial={false}
                animate={{ paddingBottom: `${100 / carouselSlides[currentSlide].aspect}%` }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <motion.div
                  className="flex absolute inset-0"
                  animate={{ x: `-${currentSlide * 100}%` }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  {localize(carouselSlides.map((slide, index) => (
                    <div key={index} className="min-w-full h-full relative bg-[#1c2a35]">
                      <img
                        src={slide.src}
                        alt={localize(slide.label)}
                        className="w-full h-full object-cover"
                      />
                      {/* Overlay Label */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                        <p className="text-white text-lg">
                          {localize(slide.label)}
                        </p>
                      </div>
                    </div>
                  )))}
                </motion.div>
              </motion.div>

              {/* Navigation Buttons */}
              <button
                onClick={() => setCurrentSlide((prev) => (prev > 0 ? prev - 1 : carouselSlides.length - 1))}
                aria-label={localize("Previous slide")}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm hover:bg-white p-3 shadow-lg transition-all"
                style={{ borderRadius: '10px' }}
              >
                <ChevronLeft className="w-6 h-6 text-gray-800" />
              </button>
              <button
                onClick={() => setCurrentSlide((prev) => (prev < carouselSlides.length - 1 ? prev + 1 : 0))}
                aria-label={localize("Next slide")}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm hover:bg-white p-3 shadow-lg transition-all"
                style={{ borderRadius: '10px' }}
              >
                <ChevronRight className="w-6 h-6 text-gray-800" />
              </button>

              {/* Dots Indicator */}
              <div className="flex justify-center gap-2 mt-6">
                {localize(carouselSlides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentSlide ? 'bg-blue-600 w-8' : 'bg-gray-300'
                    }`}
                  />
                )))}
              </div>
            </div>
          </div>

          {/* Design Challenge */}
          <div className="mb-16" id="design-challenge">
            <h2 className="text-3xl md:text-4xl leading-tight mb-10 bg-gradient-to-r from-[#102F56] to-[#1a4d7a] dark:from-blue-300 dark:to-blue-400 bg-clip-text text-transparent">{localize("Target User & Pain Point")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <div className="space-y-6 text-lg text-gray-700 dark:text-gray-200 leading-relaxed">
                <p>{localize("The main target user is the IT Administrator, who is responsible for managing the organization's virtual network infrastructure and maintaining system performance in the IT department. Their main duties include configuring network settings, monitoring network health, and troubleshooting issues.")}</p>
                <p>{localize("The key pain point for these administrators is the desire to self-onboard NSX+ using their actual data center rather than relying on sales personnel. They seek a streamlined, intuitive onboarding process that allows them to efficiently integrate NSX+ into their existing environment, enabling them to securely leverage real data and configurations in a cloud environment.")}</p>
              </div>
              <div>
                <img
                  src={targetUserImg}
                  alt={localize("IT Administrator Target User")}
                  className="w-full h-auto cursor-pointer hover:opacity-90 transition-opacity"
                  style={{ borderRadius: '10px' }}
                  role="button" tabIndex={0} aria-haspopup="dialog" onKeyDown={activateImageOnKey} onClick={() => setExpandedImage({ src: targetUserImg, alt: "IT Administrator Target User" })}
                />
                <p className="text-center text-gray-700 dark:text-gray-200 mt-4">{localize("Persona")}</p>
              </div>
            </div>
          </div>

          {/* Redefine Onboarding */}
          <div className="mb-16" id="redefine-onboarding">
            <h2 className="text-3xl md:text-4xl leading-tight mb-10 bg-gradient-to-r from-[#102F56] to-[#1a4d7a] dark:from-blue-300 dark:to-blue-400 bg-clip-text text-transparent">{localize("Redefine Onboarding Experience")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <div className="space-y-6 text-lg text-gray-700 dark:text-gray-200 leading-relaxed">
                <p>{localize("Previously, the onboarding process required users to talk directly to sales whenever they ran into issues with key features or related subscriptions.")}</p>
                <p>{localize("The goal is to make the onboarding process more intuitive and self-explanatory, so users can explore it with customized recommendations based on their actual environment. In short, this switches the onboarding experience from ")}<span className="text-gray-900 dark:text-gray-100">{localize("Sales Led → Product Led")}</span>.
                </p>
              </div>
              <div>
                <img
                  src={redefineOnboardingImg}
                  alt={localize("Redefine Onboarding Experience - Sales Led to Product Led")}
                  className="w-full h-auto cursor-pointer hover:opacity-90 transition-opacity"
                  style={{ borderRadius: '10px' }}
                  role="button" tabIndex={0} aria-haspopup="dialog" onKeyDown={activateImageOnKey} onClick={() => setExpandedImage({ src: redefineOnboardingImg, alt: "Redefine Onboarding Experience - Sales Led to Product Led" })}
                />
                <p className="text-center text-gray-700 dark:text-gray-200 mt-4">{localize("End-to-End Experience")}</p>
              </div>
            </div>
          </div>

          {/* Design Principles */}
          <div className="mb-16" id="approach-strategy">
            <h2 className="text-3xl md:text-4xl leading-tight mb-10 bg-gradient-to-r from-[#102F56] to-[#1a4d7a] dark:from-blue-300 dark:to-blue-400 bg-clip-text text-transparent">{localize("Design Principles")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <div className="space-y-6 text-lg text-gray-700 dark:text-gray-200 leading-relaxed">
                <p>{localize("To address these challenges and pain points, I collaborated with key stakeholders to empower IT Administrators to onboard NSX+ with confidence. I led the design strategy with a focus on three core principles:")}</p>
                <div className="flex items-center justify-center overflow-hidden" style={{ borderRadius: '10px' }}>
                  <img
                    src={designPrinciplesImg}
                    alt={localize("Design Principles - Efficient, Intuitive, Trustworthy")}
                    className="w-full h-auto cursor-pointer hover:opacity-90 transition-opacity"
                    style={{ transform: 'scale(1.25)', transformOrigin: 'center center' }}
                    role="button" tabIndex={0} aria-haspopup="dialog" onKeyDown={activateImageOnKey} onClick={() => setExpandedImage({ src: designPrinciplesImg, alt: "Design Principles - Efficient, Intuitive, Trustworthy" })}
                  />
                </div>
              </div>
              <div className="space-y-6 text-lg text-gray-700 dark:text-gray-200 leading-relaxed">
                <ul className="list-disc pl-6 space-y-4">
                  <li>
                    <span className="font-bold text-gray-900 dark:text-gray-100">{localize("Efficient:")}</span>{localize(" The onboarding process should be streamlined, ensuring users are not overwhelmed by excessive steps or time commitments.")}</li>
                  <li>
                    <span className="font-bold text-gray-900 dark:text-gray-100">{localize("Intuitive:")}</span>{localize(" Each step must be clear and instructional, providing guidance that eliminates the need for documentation or technical support.")}</li>
                  <li>
                    <span className="font-bold text-gray-900 dark:text-gray-100">{localize("Trustworthy:")}</span>{localize(" Users should feel secure and confident when connecting to their own data centers, fostering a sense of safety throughout the onboarding experience.")}</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Success Metrics */}
          <div className="mb-16" id="success-metrics">
            <h2 className="text-3xl md:text-4xl leading-tight mb-10 bg-gradient-to-r from-[#102F56] to-[#1a4d7a] dark:from-blue-300 dark:to-blue-400 bg-clip-text text-transparent">{localize("Success Metrics")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6 text-lg text-gray-700 dark:text-gray-200 leading-relaxed">
                <p>{localize("The goal of this project is to promote usage of key networking and security features and to increase product revenue as users grow satisfied with the onboarding experience. Thus, I initiated a discussion with PMs and engineers to track the following metrics:")}</p>
              </div>
              <div className="overflow-hidden rounded-[10px]" style={{ aspectRatio: '1140 / 320' }}>
                <img
                  src={successMetricsImg}
                  alt={localize("Success Metrics - Adoption, Revenue, Satisfaction")}
                  className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity" style={{ objectPosition: '50% 43%' }}
                  role="button" tabIndex={0} aria-haspopup="dialog" onKeyDown={activateImageOnKey} onClick={() => setExpandedImage({ src: successMetricsImg, alt: "Success Metrics - Adoption, Revenue, Satisfaction" })}
                />
              </div>
            </div>
          </div>

          {/* Optimizing Workflow */}
          <div className="mb-16" id="optimizing-workflow">
            <h2 className="text-3xl md:text-4xl leading-tight mb-10 bg-gradient-to-r from-[#102F56] to-[#1a4d7a] dark:from-blue-300 dark:to-blue-400 bg-clip-text text-transparent">{localize("Optimizing Workflow")}</h2>
            <div className="space-y-6 text-lg text-gray-700 dark:text-gray-200 leading-relaxed mb-10">
              <p>{localize("With the goals and metrics in mind, I collaborated with key stakeholders on project requirements and visualized the major steps to build a clear, shared understanding of how cloud and on-premises environments connect. This made it more straightforward to identify the key areas that need intuitive, instructional design.")}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start mb-10">
              <div>
                <img
                  src={optimizingWorkflowImg}
                  alt={localize("Optimizing Workflow - Major Steps Overview")}
                  className="w-full h-auto cursor-pointer hover:opacity-90 transition-opacity"
                  style={{ borderRadius: '10px' }}
                  role="button" tabIndex={0} aria-haspopup="dialog" onKeyDown={activateImageOnKey} onClick={() => setExpandedImage({ src: optimizingWorkflowImg, alt: "Optimizing Workflow - Major Steps Overview" })}
                />
                <p className="text-center text-gray-700 dark:text-gray-200 mt-4">{localize("Before")}</p>
              </div>
              <div>
                <img
                  src={workflowDiagramImg}
                  alt={localize("Optimized Workflow Diagram - Cloud and On-Premises Environment")}
                  className="w-full h-auto cursor-pointer hover:opacity-90 transition-opacity"
                  style={{ borderRadius: '10px' }}
                  role="button" tabIndex={0} aria-haspopup="dialog" onKeyDown={activateImageOnKey} onClick={() => setExpandedImage({ src: workflowDiagramImg, alt: "Optimized Workflow Diagram - Cloud and On-Premises Environment" })}
                />
                <p className="text-center text-gray-700 dark:text-gray-200 mt-4">{localize("After")}</p>
              </div>
            </div>
            <div className="space-y-6 text-lg text-gray-700 dark:text-gray-200 leading-relaxed mb-10">
              <p>{localize("I closed the gap by bringing the customer's voice to the table. The optimized workflow addresses key user concerns by:")}</p>
              <ul className="list-disc pl-6 space-y-4">
                <li>
                  <span className="font-bold text-gray-900 dark:text-gray-100">{localize("Protecting credentials")}</span>{localize(" by introducing a cloud gateway, which bridges the gap between cloud and on-premises data centers and builds user trust in the safety of the connection.")}</li>
                <li>{localize("Encouraging users to ")}<span className="font-bold text-gray-900 dark:text-gray-100">{localize("explore features")}</span>{localize(" by making the process intuitive, clear, and simple.")}</li>
                <li>{localize("Providing an ")}<span className="font-bold text-gray-900 dark:text-gray-100">{localize("onboarding guide")}</span>{localize(" to make users feel more confident about purchasing a subscription.")}</li>
              </ul>
            </div>
          </div>

          {/* Transitional Pages */}
          <div className="mb-16" id="transitional-pages">
            <h2 className="text-3xl md:text-4xl leading-tight mb-10 bg-gradient-to-r from-[#102F56] to-[#1a4d7a] dark:from-blue-300 dark:to-blue-400 bg-clip-text text-transparent">{localize("Transitional Pages")}</h2>
            <div className="space-y-6 text-lg text-gray-700 dark:text-gray-200 leading-relaxed mb-10">
              <p>{localize("The old transitional page provided limited access to the home page, showing only a progress bar on a full page.")}</p>
              <p>{localize("The proposed pattern solves this pain point by showing a progress bar and visual instructions in a pop-up modal, presented as a slideshow carousel. The experience gives IT admins and tenants quick tutorials to learn more about their permissions to the system.")}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div
                  className="overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                  style={{ borderRadius: '10px' }}
                  role="button" tabIndex={0} aria-haspopup="dialog" onKeyDown={activateImageOnKey} onClick={() => setExpandedImage({ src: oldTransitionalPatternImg, alt: "Old Transitional Pattern", clipPath: "inset(1% 0 0 1%)" })}
                >
                  <img
                    src={oldTransitionalPatternImg}
                    alt={localize("Old Transitional Pattern")}
                    className="w-full h-auto block"
                    style={{ transform: 'scale(1.0101)', transformOrigin: 'bottom right' }}
                  />
                </div>
                <p className="text-center text-gray-700 dark:text-gray-200 mt-4">{localize("Old Transitional Pattern")}</p>
              </div>
              <div>
                <div
                  className="overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                  style={{ borderRadius: '10px' }}
                  role="button" tabIndex={0} aria-haspopup="dialog" onKeyDown={activateImageOnKey} onClick={() => setExpandedImage({ src: proposedOnboardingGuideImg, alt: "Proposed Onboarding Guide", clipPath: "inset(1% 0 0 1%)" })}
                >
                  <img
                    src={proposedOnboardingGuideImg}
                    alt={localize("Proposed Onboarding Guide")}
                    className="w-full h-auto block"
                    style={{ transform: 'scale(1.0101)', transformOrigin: 'bottom right' }}
                  />
                </div>
                <p className="text-center text-gray-700 dark:text-gray-200 mt-4">{localize("Proposed Onboarding Guide")}</p>
              </div>
            </div>
          </div>

          {/* Impact */}
          {/* Placement study. The three options and the reason the third won
              are the ones already recorded against this project. */}
          <div className="mb-16" id="placement-study">
            <h2 className="text-3xl md:text-4xl leading-tight mb-10 bg-gradient-to-r from-[#102F56] to-[#1a4d7a] dark:from-blue-300 dark:to-blue-400 bg-clip-text text-transparent">{localize("Where Should the Guide Live?")}</h2>
            <div className="space-y-6 text-lg text-gray-700 dark:text-gray-200 leading-relaxed">
              <p>{localize("Deciding what the guide said was the easy half. The harder question was where it sat, and I sketched three placements against a single test: ")}<span className="text-gray-900 dark:text-gray-100 font-bold">{localize("can a user leave it and come back?")}</span>
              </p>
              <img
                src={northstarPlacementImg}
                alt={localize("Three sketched placements for the onboarding tutorial: a full-screen modal, a docked side panel, and a minimized non-modal dialog that tracks progress.")}
                className="w-full h-auto mt-2 cursor-pointer hover:opacity-90 transition-opacity bg-white"
                style={{ borderRadius: '10px' }}
                onClick={() =>
                  setExpandedImage({
                    src: northstarPlacementImg,
                    alt: "Three sketched placements for the onboarding tutorial",
                  })
                }
              />
              <p>{localize("The modal failed that test outright — engineering flagged that users would lose access to the tutorial the moment they closed it, which made an unmissable dialog an unacceptable one. The docked panel passed, but charged for it by narrowing the deployment view that users had come to look at.")}</p>
              <p>{localize("The ")}<span className="text-gray-900 dark:text-gray-100 font-bold">{localize("minimized non-modal dialog")}</span>{localize(" was the only option that let the guide be dismissed without being lost. It keeps progress visible, stays out of the way of the console, and can be reopened at any point — which is what turned a one-shot tutorial into something users could actually return to mid-deployment.")}</p>
            </div>
          </div>

          <div className="mb-16" id="impact">
            <h2 className="text-3xl md:text-4xl leading-tight mb-10 bg-gradient-to-r from-[#102F56] to-[#1a4d7a] dark:from-blue-300 dark:to-blue-400 bg-clip-text text-transparent">{localize("Impact")}</h2>
            <div className="space-y-6 text-lg text-gray-700 dark:text-gray-200 leading-relaxed">
              <ul className="list-disc pl-6 space-y-4">
                <li>
                  <span className="text-gray-900 dark:text-gray-100"><span className="font-bold">80%+</span>{localize(" adoption rate")}</span>{localize(" from onboarding experience to subscribing to key networking and security features.")}</li>
                <li>
                  <span className="text-gray-900 dark:text-gray-100"><span className="font-bold">30%</span>{localize(" increase")}</span>{localize(" in total revenue of NSX+ subscription.")}</li>
                <li>
                  <span className="text-gray-900 dark:text-gray-100 font-bold">9/10</span>{localize(" in customer satisfaction rate.")}</li>
              </ul>
            </div>
          </div>

          {/* Learnings & Reflections */}
          <div className="mb-16" id="learnings-reflections">
            <h2 className="text-3xl md:text-4xl leading-tight mb-10 bg-gradient-to-r from-[#102F56] to-[#1a4d7a] dark:from-blue-300 dark:to-blue-400 bg-clip-text text-transparent">{localize("Learnings & Reflections")}</h2>
            <div className="text-lg text-gray-700 dark:text-gray-200 leading-relaxed">
              <ul className="list-disc pl-6 space-y-4">
                <li>
                  <span className="font-bold text-gray-900 dark:text-gray-100">{localize("Take ownership")}</span>{localize(" as the design lead, guiding the project from concept to completion.")}</li>
                <li>
                  <span className="font-bold text-gray-900 dark:text-gray-100">{localize("Embrace the uncertainty")}</span>{localize(" by sharing objectives with stakeholders and clarifying ambiguity together.")}</li>
                <li>
                  <span className="font-bold text-gray-900 dark:text-gray-100">{localize("Proactive communication")}</span>{localize(" with cross-functional teams to align design decisions with user needs and business goals.")}</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>

      <ProjectImageLightbox image={expandedImage} onClose={() => setExpandedImage(null)} />

    </main>
  );
}