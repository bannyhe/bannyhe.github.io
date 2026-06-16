import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef, useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";
import { Button } from "../components/ui/button";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import exampleImage from "../src/assets/fe729219d29d839dd92bebb77136917a9758ee64.png";
import problemStatementImage from "../src/assets/4c363dcb43f0e7c6be107c686156e073a21d5514.png";
import timelineImage from "../src/assets/5c1628d4ffa9dbf8fe1a8f68c61eca3fd976654f.png";
import backgroundImage from "../src/assets/d85ab9598c3ab3cafa67f3961f8c0e861d53685d.png";
import courseProductionImage from "../src/assets/871261f8ad838b2296913736ed2a89844e33f7e4.png";
import revenueAllocationImage from "../src/assets/b97b1f3b7950c7c27b28b4fc6e10710061fed389.png";
import interview1 from "../src/assets/cce10093561868bd5cca8bc98ab88b88e4c3cc89.png";
import interview2 from "../src/assets/9d900acc369155c3ae8ad16f6c6d2d2d657d368b.png";
import interview3 from "../src/assets/5780980b68bbde21ea5edf94a6f9b61079a672ce.png";
import interview4 from "../src/assets/48726dfb0f130d2fdb6c9d808c77c338832a6941.png";
import interview5 from "../src/assets/27ceaec53f0e599e7cb7b0a9887b4b367099482c.png";
import interview6 from "../src/assets/d76d5b9a9a62754fe1fb1bb71c425bb89ebe9841.png";
import affinityWallImage from "../src/assets/f604c973f9187ae00b372c4c08c779c0972e05d4.png";
import findingsImage from "../src/assets/9707d37a55c3743a82d982df6159b6de8c80da51.png";
import finalPresentationImage from "../src/assets/bffc0b6fb29cc57be0888edca1ac527b92be886c.png";
import groupPhotoImage from "../src/assets/d421591420764496f29a9a1fcff7047629d501b4.png";
import swimLaneImage from "../src/assets/8b15e3be810b3e17aa5e5eb1b741c08c149d5f71.png";
import interviewClientImage from "../src/assets/6265cd4b161340c0c9cf1fbac81ce7b82cb207ac.png";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from "../components/ui/dialog";

export function ContextualInquiryPage() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");

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
        "introduction",
        "problem-statement",
        "timeline",
        "background",
        "contextual-inquiry",
        "qualitative-analysis",
        "findings",
        "recommendations",
        "reflections"
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
    { id: "introduction", label: "Introduction" },
    { id: "problem-statement", label: "Problem Statement" },
    { id: "timeline", label: "Timeline" },
    { id: "background", label: "Background Research" },
    { id: "contextual-inquiry", label: "Contextual Inquiry" },
    { id: "qualitative-analysis", label: "Qualitative Analysis" },
    { id: "findings", label: "Findings" },
    { id: "recommendations", label: "Recommendations" },
    { id: "reflections", label: "Reflections" }
  ];

  return (
    <main className="pt-20 pb-24">
      {/* Full-width hero image */}
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto py-12">
          <ImageWithFallback
            src={exampleImage}
            alt="Contextual Inquiry - MOOC Financial Tracking"
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
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Team</p>
                <p className="text-lg text-gray-900 dark:text-gray-100">Stephanie Afshar, Alicia Ge, Mu He, Siyu Jia</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Project type</p>
                <p className="text-lg text-gray-900 dark:text-gray-100">Group Project, User Research</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">My Role</p>
                <p className="text-lg text-gray-900 dark:text-gray-100">UX Researcher, Consultant, Visual Designer</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Duration</p>
                <p className="text-lg text-gray-900 dark:text-gray-100">Sept - Dec 2017</p>
              </div>
            </div>
          </div>

          {/* Introduction */}
          <div className="mb-16" id="introduction">
            <h2 className="text-3xl md:text-4xl leading-tight mb-10 bg-gradient-to-r from-[#102F56] to-[#1a4d7a] dark:from-blue-300 dark:to-blue-400 bg-clip-text text-transparent">
              Introduction
            </h2>
            <div className="space-y-8 text-lg text-gray-700 dark:text-gray-200 leading-relaxed">
              <p>
                Our client, University of Michigan’s Office of Academic Innovation (AI) is still using the <strong>same system</strong> that was implemented since their first MOOC project. At present, they are dealing with <strong>over 100 active projects</strong>, the current process is <strong>hard to manage</strong> because it is a manual process, and therefore <strong>prone to human error</strong>. AI knows the need to improve its current system in order to <strong>achieve its goal for U-M to become the leader in online education</strong>, so they reached out to our team to delve into how to improve their current MOOC financial management system.
              </p>
              
              <div className="flex justify-center pt-4">
                <Button 
                  asChild
                  size="lg"
                  className="px-8 h-14 text-lg font-medium bg-gradient-to-r from-[#102F56] to-[#1a4d7a] hover:from-[#0d2545] hover:to-[#153e62] dark:from-[#6DB2FF] dark:to-[#5a9ae6] dark:hover:from-[#5a9ae6] dark:hover:to-[#4882cc] text-white dark:text-gray-900 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  style={{ borderRadius: '10px' }}
                >
                  <a href="https://mu-he-32jp.squarespace.com/s/AMS2-Final-Presentation.pdf" target="_blank" rel="noopener noreferrer">
                    View Final PPT
                  </a>
                </Button>
              </div>
            </div>
          </div>

          {/* Problem Statement */}
          <div className="mb-16" id="problem-statement">
            <h2 className="text-3xl md:text-4xl leading-tight mb-10 bg-gradient-to-r from-[#102F56] to-[#1a4d7a] dark:from-blue-300 dark:to-blue-400 bg-clip-text text-transparent">
              Problem Statement
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="order-2 md:order-1">
                <ImageWithFallback
                  src={problemStatementImage}
                  alt="Academic Innovation Logo"
                  className="w-full h-auto object-contain max-h-[400px]"
                  style={{ borderRadius: '10px' }}
                />
              </div>
              <div className="space-y-6 text-lg text-gray-700 dark:text-gray-200 leading-relaxed order-1 md:order-2">
                <p>
                  The University of Michigan’s Office of Academic Innovation (AI) is the leader at the university in enhancing all of U-M 19 schools and programs’ approaches to learning and education in <strong>innovative, progressive</strong> ways by means of the <strong>latest advanced technology</strong>.
                </p>
                <p>
                  They aim to redefine the educational field through a technologically-focused lens to promote a new era of higher education that is more <strong>personalized, engaging</strong>, and <strong>accessible</strong> both at the University of Michigan and beyond.
                </p>
                <p>
                  AI has seen tremendous growth since its inception in 2014 and are interested in how to <strong>improve their current MOOC (Massive Open Online Course) financial report process</strong>.
                </p>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="mb-16" id="timeline">
            <h2 className="text-3xl md:text-4xl leading-tight mb-10 bg-gradient-to-r from-[#102F56] to-[#1a4d7a] dark:from-blue-300 dark:to-blue-400 bg-clip-text text-transparent">
              Timeline
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6 text-lg text-gray-700 dark:text-gray-200 leading-relaxed order-1">
                <p>
                  The span of the project's timeline was from September to December in 2017, during which our work can be divided into four major steps.
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                  <li>Research (Mid September—Mid October)</li>
                  <li>Interview (Mid October—Early November)</li>
                  <li>Interpretation & Analysis (Early November—Mid November)</li>
                  <li>Design & Solution (Mid November—Mid December)</li>
                </ul>
              </div>
              <div className="w-full order-2">
                <ImageWithFallback
                  src={timelineImage}
                  alt="Project Timeline"
                  className="w-full h-auto object-contain"
                  style={{ borderRadius: '10px' }}
                />
              </div>
            </div>
          </div>

          {/* Background Research */}
          <div className="mb-16" id="background">
            <h2 className="text-3xl md:text-4xl leading-tight mb-10 bg-gradient-to-r from-[#102F56] to-[#1a4d7a] dark:from-blue-300 dark:to-blue-400 bg-clip-text text-transparent">
              Background Research
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-16">
              <div className="flex flex-col items-center order-2 md:order-1">
                <ImageWithFallback
                  src={backgroundImage}
                  alt="Overview of Communication Flow of MOOC Financial Tracking"
                  className="w-full h-auto object-contain rounded-lg shadow-lg"
                  style={{ borderRadius: '10px' }}
                />
                <p className="mt-3 text-sm text-gray-500 dark:text-white italic text-center">
                  Overview of Communication Flow of MOOC Financial Tracking
                </p>
              </div>
              <div className="space-y-6 text-lg text-gray-700 dark:text-gray-200 leading-relaxed order-1 md:order-2">
                <p>
                  The purpose of background research was to understand AI's general workflow, problem scope, in order to come up with possible solutions. The research was conducted by researching the client organization and the problem domain via contextual inquiry. Also, we synthesized scholar literatures based on keywords like <strong>online education</strong> and <strong>case/data management</strong>.
                </p>
              </div>
            </div>

            <div className="space-y-6 text-lg text-gray-700 dark:text-gray-200 leading-relaxed mb-12">
              <p>
                Some of the complications occur during the information transfer between the Financial Management (FM) team and MOOC platforms (such as <strong>Coursera</strong> and <strong>edX</strong>). The FM team needs to receive information from multiple sources in order to track the money flow, which happens not only between teams within AI, but also extended to departments outside AI or even outside the U-M. Each thunderbolt in the chart resembles information was not communicated effectively between two sides.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col items-center">
                <ImageWithFallback
                  src={courseProductionImage}
                  alt="Mythologies and Timeline of Course Production"
                  className="w-full h-auto object-contain"
                  style={{ borderRadius: '10px' }}
                />
                <p className="mt-3 text-sm text-gray-500 dark:text-white italic text-center font-medium">
                  Mythologies and Timeline of Course Production
                </p>
              </div>
              <div className="flex flex-col items-center">
                <ImageWithFallback
                  src={revenueAllocationImage}
                  alt="Sequential Model of MOOC Revenue Allocation"
                  className="w-full h-auto object-contain"
                  style={{ borderRadius: '10px' }}
                />
                <p className="mt-3 text-sm text-gray-500 dark:text-white italic text-center font-medium">
                  Sequential Model of MOOC Revenue Allocation
                </p>
              </div>
            </div>
          </div>

          {/* Contextual Inquiry */}
          <div className="mb-16" id="contextual-inquiry">
            <h2 className="text-3xl md:text-4xl leading-tight mb-10 bg-gradient-to-r from-[#102F56] to-[#1a4d7a] dark:from-blue-300 dark:to-blue-400 bg-clip-text text-transparent">
              Contextual Inquiry
            </h2>
            <div className="space-y-6 text-lg text-gray-700 dark:text-gray-200 leading-relaxed">
              <p>
                During this process, each member in our group interviewed and observed at least 1 initial contact, and we interviewed <strong>6 employees</strong> across different positions within the AI team. After knowing the problem scope of our client, we conducted interviews with all six team members at their workspace. My interviewing process mainly focused on observing their workflows, inquiring about specific working procedures and challenges they faced in the financial management. Each interview lasts no more than <strong>90 minutes</strong>, and our team conducted approximately <strong>500 minutes</strong> of raw qualitative data, which would be applied in future process of analysis and synthesis. After the interview, I annotated my interview protocol along with the interviewee's key responses, and reflected the whole process of interview.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mt-10">
              {[interview1, interview2, interview3, interview4, interview5, interview6].map((img, index) => (
                <Dialog key={index}>
                  <DialogTrigger asChild>
                    <div className="cursor-pointer overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100 dark:border-gray-800">
                      <ImageWithFallback
                        src={img}
                        alt={`Contextual Inquiry Interview ${index + 1}`}
                        className="w-full h-auto object-cover"
                        style={{ borderRadius: '10px' }}
                      />
                    </div>
                  </DialogTrigger>
                  <DialogContent className="max-w-[95vw] w-auto p-2 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-none">
                     <DialogTitle className="sr-only">Contextual Inquiry Interview {index + 1}</DialogTitle>
                     <DialogDescription className="sr-only">
                        Detailed view of the interview notes and observations for participant {index + 1}
                     </DialogDescription>
                     <div className="relative flex items-center justify-center">
                        <ImageWithFallback
                          src={img}
                          alt={`Contextual Inquiry Interview ${index + 1}`}
                          className="max-w-full max-h-[90vh] w-auto h-auto object-contain rounded-md"
                        />
                     </div>
                  </DialogContent>
                </Dialog>
              ))}
            </div>
          </div>

          {/* Qualitative Analysis & Synthesis */}
          <div className="mb-16" id="qualitative-analysis">
            <h2 className="text-3xl md:text-4xl leading-tight mb-10 bg-gradient-to-r from-[#102F56] to-[#1a4d7a] dark:from-blue-300 dark:to-blue-400 bg-clip-text text-transparent">
              Qualitative Analysis & Synthesis
            </h2>
            <div className="space-y-6 text-lg text-gray-700 dark:text-gray-200 leading-relaxed">
              <p>
                Building affinity diagram really helped us have a panoramic view of the problem that really affects work efficiency within the organization, rather than solely focusing on partial information. Thus, we integrated details from interviews into individual affinity notes, each includes only one <strong>key fact, statistic, or quote</strong>. Then we grouped notes according to their correlations, and synthesized upon each level, with an overarching note at the top of each category. Finally, we clustered <strong>over 300 notes</strong> into different categories, and identified overarching issues into the three following categories:
              </p>
              <ol className="list-decimal pl-6 space-y-3">
                <li>
                  Financial Management Team expects an integrated system that can help with financial data & HR management
                </li>
                <li>
                  There are internal misconceptions between departments in terms of job role, process, tool used, involvement in current system
                </li>
                <li>
                  There are many moving parts in regards to AI's financial flow, which has directly contributed to its current financial management challenge
                </li>
              </ol>

              <div className="mt-10 flex flex-col items-center">
                <div className="w-full overflow-hidden rounded-[10px] shadow-lg">
                  <ImageWithFallback
                    src={affinityWallImage}
                    alt="Affinity Wall Overview"
                    className="w-full object-cover object-center"
                    style={{ aspectRatio: '3.2/1' }}
                  />
                </div>
                <p className="mt-3 text-sm text-gray-500 dark:text-white italic text-center">
                  Affinity Wall Overview
                </p>
              </div>
            </div>
          </div>

          {/* Findings */}
          <div className="mb-16" id="findings">
            <h2 className="text-3xl md:text-4xl leading-tight mb-10 bg-gradient-to-r from-[#102F56] to-[#1a4d7a] dark:from-blue-300 dark:to-blue-400 bg-clip-text text-transparent">
              Findings
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="order-1 md:order-1">
                <ImageWithFallback
                  src={findingsImage}
                  alt="Break-downs of Current MOOC Financial Tracking System"
                  className="w-full h-auto object-contain"
                  style={{ borderRadius: '10px' }}
                />
                <p className="mt-3 text-sm text-gray-500 dark:text-white italic text-center font-medium">
                  Break-downs of Current MOOC Financial Tracking System
                </p>
              </div>
              <div className="space-y-6 text-lg text-gray-700 dark:text-gray-200 leading-relaxed order-2 md:order-2">
                <p>
                  The current MOOC financial tracking system consists of three main parts, which are cost, revenue, and payment. We firstly identified AI’s current situation, demands, and challenges during financial management process.
                </p>
                <p>
                  Next, we generalized findings from our background research at the early stages, and interviews at mid-stage, to discuss through trends presented in most of the concerns in the interviews, which are also backed up by additional evidence from our background research. The findings can be synthesized into the following aspects:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li className="font-bold">Workflow complications</li>
                  <li className="font-bold">Job role misconceptions</li>
                  <li className="font-bold">System deficiencies</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="mb-16" id="recommendations">
            <h2 className="text-3xl md:text-4xl leading-tight mb-10 bg-gradient-to-r from-[#102F56] to-[#1a4d7a] dark:from-blue-300 dark:to-blue-400 bg-clip-text text-transparent">
              Recommendations
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6 text-lg text-gray-700 dark:text-gray-200 leading-relaxed order-1">
                <p>
                  Our recommendation to create standardized written procedures for all departments involved in the financial management process is a solution that is low cost, can be easily implemented, and can produce high impact for the organization. These solutions accompanied by scheduled weekly meetings among all involved departments can allow for a more streamlined, transparent process. Looking towards the future in the context of the continued quick growth for AI, a technological solution may potentially be needed to be adopted, but by scaling to improve workflow and communication procedures among departments, the AI Office can create a high impact on the current financial management process within a short period of time.
                </p>
                
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Cultural Recommendations</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Create written procedures for all departments involved in supplying or interacting with the system.</li>
                    <li>Create detailed documentation that outlines how each department and person is involved in the system.</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Technological Recommendations</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Implement tools that support automatic data storage, retrieval, sorting, aggregation, and visualization.</li>
                    <li>Apply to platforms that are available in both access control and backup mechanism to ensure data's accuracy and safety.</li>
                    <li>Use tools that are able to auto-generate tailored reports, even when data input and update varies in periodicity.</li>
                  </ul>
                </div>
              </div>
              
              <div className="order-2">
                <ImageWithFallback
                  src={finalPresentationImage}
                  alt="Final Presentation"
                  className="w-full h-auto object-cover"
                  style={{ borderRadius: '10px' }}
                />
                <p className="mt-3 text-sm text-gray-500 dark:text-white italic text-center font-medium">
                  Final Presentation
                </p>
              </div>
            </div>
          </div>

          {/* Reflections */}
          <div className="mb-16" id="reflections">
            <h2 className="text-3xl md:text-4xl leading-tight mb-10 bg-gradient-to-r from-[#102F56] to-[#1a4d7a] dark:from-blue-300 dark:to-blue-400 bg-clip-text text-transparent">
              Reflections
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="order-1 md:order-1">
                <ImageWithFallback
                  src={groupPhotoImage}
                  alt="Group photo after affinity wall walkthrough"
                  className="w-full h-auto object-cover"
                  style={{ borderRadius: '10px' }}
                />
                <p className="mt-3 text-sm text-gray-500 dark:text-white italic text-center font-medium">
                  Group photo after affinity wall walkthrough
                </p>
              </div>
              <div className="space-y-6 text-lg text-gray-700 dark:text-gray-200 leading-relaxed order-2 md:order-2">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Team building</h3>
                <p>
                  Team collaboration is essential for this project, and I am deeply grateful to my teammates who share their ideas. Even though we may disagree and sometimes argue with each other, but as a team, we always spent time anticipating what could lead to next phases and designed collaboration plan. I especially appreciate the collaboration plan for it helped to keep everyone in the same track and rhythm at the very beginning, and can easily reflect whenever problems arise.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mt-12">
              <div className="space-y-6 text-lg text-gray-700 dark:text-gray-200 leading-relaxed order-2 md:order-1">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Coping with your client</h3>
                <p>
                  Our client wanted us to help them figure out whether or not a certain system is right for them. However, it turns out what they really need is a more scientific way to trial the system. Don’t follow client’s instruction 100%. Instead, do observe and investigate, and trust the facts.
                </p>
                <p>
                  These solutions accompanied by scheduled weekly meetings among all involved departments can allow for a more streamlined, transparent process. Looking towards the future in the context of the continued quick growth for AI, a technological solution may potentially be needed to be adopted, but by scaling to improve workflow and communication procedures among departments, the AI Office can create a high impact on the current financial management process in a short period of time.
                </p>
              </div>
              <div className="order-1 md:order-2">
                <ImageWithFallback
                  src={interviewClientImage}
                  alt="During interview with my initial client"
                  className="w-full h-auto object-cover"
                  style={{ borderRadius: '10px' }}
                />
                <p className="mt-3 text-sm text-gray-500 dark:text-white italic text-center font-medium">
                  During interview with my initial client
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mt-12">
              <div className="order-1 md:order-1">
                <ImageWithFallback
                  src={swimLaneImage}
                  alt="Swim lane board of DEIL lab"
                  className="w-full h-auto object-cover"
                  style={{ borderRadius: '10px' }}
                />
                <p className="mt-3 text-sm text-gray-500 dark:text-white italic text-center font-medium">
                  Swim lane board of DEIL lab
                </p>
              </div>
              <div className="space-y-6 text-lg text-gray-700 dark:text-gray-200 leading-relaxed order-2 md:order-2">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">How to get a panoramic scope</h3>
                <p>
                  During the project the most extensive skill we practiced was building the affinity wall. By clustering and synthesizing ideas and facts in structural and hierarchical way, we were capable to get a broader view of the interrelations between the notes, and kept popping out new ideas. By using the method of mapping affinity diagram, we successfully combined each member's effort into effective and reasonable solutions.
                </p>
              </div>
            </div>

            <div className="flex justify-center mt-20 mb-8">
              <Button 
                asChild
                size="lg"
                className="px-8 h-14 text-lg font-medium bg-gradient-to-r from-[#102F56] to-[#1a4d7a] hover:from-[#0d2545] hover:to-[#153e62] dark:from-[#6DB2FF] dark:to-[#5a9ae6] dark:hover:from-[#5a9ae6] dark:hover:to-[#4882cc] text-white dark:text-gray-900 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                style={{ borderRadius: '10px' }}
              >
                <a href="https://mu-he-32jp.squarespace.com/s/For_AIAMS2_Final_Report.pdf" target="_blank" rel="noopener noreferrer">
                  Read Full Report
                </a>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>

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
