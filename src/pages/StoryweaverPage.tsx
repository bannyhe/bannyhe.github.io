import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef, useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";
import { Button } from "../components/ui/button";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import Slider from "react-slick";
import storyweaverHeroImg from "../src/assets/97aed2aec75db82e05a134b3b6931277818f74c9.png";
import projectMeetingImg from "../src/assets/70b5fb950a6bd53600600fe9b7e10f76612a3f83.png";
import researchProcessImg from "../src/assets/dbace8ced6646abf34739de6b54089118753b5c7.png";
import interactionMapImg from "../src/assets/96ca005d5a05adcf085a0a1285daf86edb7741c9.png";
import persona1Img from "../src/assets/4564955edbfd95348f47d3d5d8fc162af5109003.png";
import persona2Img from "../src/assets/f9453eeb7d8e1ed3c28f94145aae31f2e4e8bdfc.png";
import persona3Img from "../src/assets/3351b089cf0437a2f45b1070943ccd7eefb871e8.png";
import comparativeTableImg from "../src/assets/3ebc3828509e59b18e1b0f654f288ed1d840cb29.png";
import surveyChartImg from "../src/assets/9b99888d696b8034b14a56695792ab1f76223b63.png";
import heuristicsTableImg from "../src/assets/7cc12cacabb8648a4b0c266ba15d4b7fe7846d34.png";
import teamPhotoImg from "../src/assets/26e8169a9445335a165962082adfafa7862b9689.png";

export function StoryweaverPage() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Track show/hide back to top button and active section
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);

      // Track active section
      const sections = [
        "project-overview",
        "research-goals",
        "research-process",
        "interaction-map",
        "interview",
        "comparative-evaluation",
        "survey",
        "heuristic-evaluation",
        "usability-test",
        "final-video",
        "key-takeaways"
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
      const yOffset = -100;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const tableOfContents = [
    { id: "project-overview", label: "Project Overview" },
    { id: "research-goals", label: "Research Goals" },
    { id: "research-process", label: "Research Process" },
    { id: "interaction-map", label: "Interaction Map" },
    { id: "interview", label: "Interview" },
    { id: "comparative-evaluation", label: "Comparative Evaluation" },
    { id: "survey", label: "Survey" },
    { id: "heuristic-evaluation", label: "Heuristic Evaluation" },
    { id: "usability-test", label: "Usability Test" },
    { id: "final-video", label: "Final Video" },
    { id: "key-takeaways", label: "Key Takeaways" }
  ];

  // Carousel settings
  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    arrows: true,
  };

  return (
    <main className="pt-20 pb-24">
      {/* Full-width hero image */}
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto py-12">
          <ImageWithFallback
            src={storyweaverHeroImg}
            alt="Storyweaver - UX Research"
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
                <p className="text-lg text-gray-900 dark:text-gray-100">Sainy Alafaireet, Larissa Stenzil, Andy Engel, Mu He, Anndo Ko</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Skills</p>
                <p className="text-lg text-gray-900 dark:text-gray-100">Interaction Map, Interview, Contextual Inquiry, Affinity Diagram</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">My Role</p>
                <p className="text-lg text-gray-900 dark:text-gray-100">UX Researcher, Visual Designer, Consultant</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Duration</p>
                <p className="text-lg text-gray-900 dark:text-gray-100">Jan - Apr 2018</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Instructor</p>
                <p className="text-lg text-gray-900 dark:text-gray-100">Joyojeet Pal</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Project Type</p>
                <p className="text-lg text-gray-900 dark:text-gray-100">Group Project, User Research</p>
              </div>
            </div>
          </div>

          {/* Project Overview */}
          <div className="mb-16" id="project-overview">
            <h2 className="text-3xl md:text-4xl leading-tight mb-10 bg-gradient-to-r from-[#102F56] to-[#1a4d7a] dark:from-blue-300 dark:to-blue-400 bg-clip-text text-transparent">
              Project Overview
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              {/* Text Content */}
              <div className="space-y-6 text-lg text-gray-700 dark:text-gray-200 leading-relaxed">
                <p>
                  In our initial meeting with stakeholder, our client wanted us to focus on educators as the target audiences for these questions. At a high-level, our client was interested in:
                </p>
                <ul className="list-disc pl-6 space-y-3">
                  <li>
                    Knowing how educators find stories on the Storyweaver website.
                  </li>
                  <li>
                    Understanding how educators were using content discovery tools, as well as their usability.
                  </li>
                  <li>
                    Understanding how well the mobile version of the StoryWeaver website worked from the usability perspective.
                  </li>
                </ul>
              </div>
              
              {/* Image with Caption */}
              <div>
                <ImageWithFallback
                  src={projectMeetingImg}
                  alt="Team meeting with whiteboard showing project outline"
                  className="w-full h-auto"
                  style={{ borderRadius: '10px' }}
                />
                <p className="text-sm text-gray-600 dark:text-white mt-3 italic">
                  Streamlining the project outline during our initial group meeting
                </p>
              </div>
            </div>
          </div>

          {/* Research Goals */}
          <div className="mb-16" id="research-goals">
            <h2 className="text-3xl md:text-4xl leading-tight mb-10 bg-gradient-to-r from-[#102F56] to-[#1a4d7a] dark:from-blue-300 dark:to-blue-400 bg-clip-text text-transparent">
              Research Goals
            </h2>
            <div className="space-y-6 text-lg text-gray-700 dark:text-gray-200 leading-relaxed">
              <p>
                Our research aimed to answer the following key questions:
              </p>
              <ul className="list-disc pl-6 space-y-3">
                <li>
                  <strong>User Motivations:</strong> What drives users to create and share stories on digital platforms?
                </li>
                <li>
                  <strong>User Journey:</strong> What does the typical user journey look like from story conception to publication?
                </li>
                <li>
                  <strong>Pain Points:</strong> What are the major obstacles users face when using storytelling platforms?
                </li>
                <li>
                  <strong>Feature Priorities:</strong> Which features are most valuable to users and why?
                </li>
              </ul>
            </div>
          </div>

          {/* Research Process */}
          <div className="mb-16" id="research-process">
            <h2 className="text-3xl md:text-4xl leading-tight mb-10 bg-gradient-to-r from-[#102F56] to-[#1a4d7a] dark:from-blue-300 dark:to-blue-400 bg-clip-text text-transparent">
              Research Process
            </h2>
            <div className="space-y-6 text-lg text-gray-700 dark:text-gray-200 leading-relaxed">
              <p>
                During the three-month project timeline, we, a team of 5 students, made interaction map, conducted user interviews, comparative evaluation, surveys, heuristics evaluation, and usability test to help Storyweaver gain deeper understanding toward users' behaviors on the newly launched content discovery tools.
              </p>
            </div>
            <div className="mt-8">
              <ImageWithFallback
                src={researchProcessImg}
                alt="Research process timeline showing interaction map, interview, comparative analysis, survey, heuristic evaluation, and usability test"
                className="w-full h-auto"
                style={{ borderRadius: '10px' }}
              />
            </div>
          </div>

          {/* Interaction Map */}
          <div className="mb-16" id="interaction-map">
            <h2 className="text-3xl md:text-4xl leading-tight mb-10 bg-gradient-to-r from-[#102F56] to-[#1a4d7a] dark:from-blue-300 dark:to-blue-400 bg-clip-text text-transparent">
              Interaction Map
            </h2>
            <div className="space-y-6 text-lg text-gray-700 dark:text-gray-200 leading-relaxed">
              <p>
                The purpose of creating an interaction map is to generate a static representation of the hierarchy relationship between webpages of Storyweaver. This representation visualizes all the possible interactions, as well as predicting possible errors that those actions might generate.
              </p>
              <p>
                Below is the aggregation of screenshots for every interaction that users can make on Storyweaver webpage, which leads to other categories that shows what will happen in next steps.
              </p>
            </div>
            <div className="mt-8">
              <ImageWithFallback
                src={interactionMapImg}
                alt="Interaction map showing webpage hierarchy and user flows on Storyweaver"
                className="w-full h-auto"
                style={{ borderRadius: '10px' }}
              />
            </div>
          </div>

          {/* Interview */}
          <div className="mb-16" id="interview">
            <h2 className="text-3xl md:text-4xl leading-tight mb-10 bg-gradient-to-r from-[#102F56] to-[#1a4d7a] dark:from-blue-300 dark:to-blue-400 bg-clip-text text-transparent">
              Interview
            </h2>
            <div className="space-y-6 text-lg text-gray-700 dark:text-gray-200 leading-relaxed">
              <p>
                In order to gain a deeper understanding on the target audience of Storyweaver, we conducted <strong>one stakeholder interview</strong> and <strong>five interviews with the current or potential users</strong> from ages of 22-40. After that, our team interpreted and sorted out key observations during the interview process. Following this, we built three different personas that represent certain aspects of the interviewers. Our main findings include:​
              </p>
              <ul className="list-disc pl-6 space-y-3">
                <li>
                  Inaccurate use of terminologies.
                </li>
                <li>
                  Lack of feedback information in storybook detail pages.
                </li>
                <li>
                  Difficult to find the right information in Help page.
                </li>
              </ul>
            </div>
            
            {/* Persona Carousel */}
            <div className="mt-8">
              <Slider {...carouselSettings}>
                <div>
                  <ImageWithFallback
                    src={persona1Img}
                    alt="Persona 1 - Joseph Thomas"
                    className="w-full h-auto"
                    style={{ borderRadius: '10px' }}
                  />
                </div>
                <div>
                  <ImageWithFallback
                    src={persona2Img}
                    alt="Persona 2 - Mary Buckner"
                    className="w-full h-auto"
                    style={{ borderRadius: '10px' }}
                  />
                </div>
                <div>
                  <ImageWithFallback
                    src={persona3Img}
                    alt="Persona 3 - Celia Hernandez"
                    className="w-full h-auto"
                    style={{ borderRadius: '10px' }}
                  />
                </div>
              </Slider>
            </div>
          </div>

          {/* Comparative Evaluation */}
          <div className="mb-16" id="comparative-evaluation">
            <h2 className="text-3xl md:text-4xl leading-tight mb-10 bg-gradient-to-r from-[#102F56] to-[#1a4d7a] dark:from-blue-300 dark:to-blue-400 bg-clip-text text-transparent">
              Comparative Evaluation
            </h2>
            <div className="space-y-6 text-lg text-gray-700 dark:text-gray-200 leading-relaxed">
              <p>
                We delivered an analysis of 8 direct, indirect, partial, analogous and parallel comparators, with 14 different dimensions, interaction patterns, categories, and useful features. Our main findings include:
              </p>
              <ul className="list-disc pl-6 space-y-3">
                <li>
                  StoryWeaver has a significantly <strong>larger collection of books</strong> than the others.
                </li>
                <li>
                  StoryWeaver by far had the <strong>most languages represented</strong> (109 languages).
                </li>
                <li>
                  <strong>Highlighted</strong> features: similar stories, content labelled by target age range.
                </li>
                <li>
                  <strong>Lack</strong> of a form of reward system.
                </li>
              </ul>
            </div>
            
            {/* View Full Report Button */}
            <div className="flex justify-center mt-8">
              <Button 
                asChild
                size="lg"
                className="px-8 h-14 text-lg font-medium bg-gradient-to-r from-[#102F56] to-[#1a4d7a] hover:from-[#0d2545] hover:to-[#153e62] dark:from-[#6DB2FF] dark:to-[#5a9ae6] dark:hover:from-[#5a9ae6] dark:hover:to-[#4882cc] text-white dark:text-gray-900 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                style={{ borderRadius: '10px' }}
              >
                <a
                  href="https://www.muheportfolio.com/s/Design-MASALa_Comparative-Evaluation-Report.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Full Report
                </a>
              </Button>
            </div>
            
            {/* Comparative Table Image */}
            <div className="mt-8">
              <ImageWithFallback
                src={comparativeTableImg}
                alt="Comparative evaluation table showing StoryWeaver vs competitors across multiple dimensions"
                className="w-full h-auto"
                style={{ borderRadius: '10px' }}
              />
            </div>
          </div>

          {/* Survey */}
          <div className="mb-16" id="survey">
            <h2 className="text-3xl md:text-4xl leading-tight mb-10 bg-gradient-to-r from-[#102F56] to-[#1a4d7a] dark:from-blue-300 dark:to-blue-400 bg-clip-text text-transparent">
              Survey
            </h2>
            <div className="space-y-6 text-lg text-gray-700 dark:text-gray-200 leading-relaxed">
              <p>
                The goal of conducting the survey was to generate a quantitative view of several aspects of the educator audience for Storyweaver, including general demographic information (age, location, languages used at home, etc.), most common languages searched for, the extent to which various content discovery tools were used, the features educators considered key to an online library experience, and the breakdown of how various options to save stories for later use were used. Hence, we developed a 15 question survey in Google Forms, and analyzed the results via the built-in Google Forms graphs, as well as a set of secondary cross-tabulations we created ourselves. Our main findings include:
              </p>
              <ul className="list-disc pl-6 space-y-3">
                <li>
                  The <strong>List</strong> feature is least used in comparison with the search bar and <strong>Recommended</strong> feature.
                </li>
                <li>
                  The <strong>Similar stories</strong> section is the most commonly used feature for users to find their next story.
                </li>
                <li>
                  About 67% of the respondents use a "Save For Later" feature from StoryWeaver.
                </li>
                <li>
                  Primary comparators have the following <strong>differentiators</strong>: Languages, Genre, Searches, and Classroom Use.
                </li>
              </ul>
            </div>
            
            {/* View Full Report Button */}
            <div className="flex justify-center mt-8">
              <Button 
                asChild
                size="lg"
                className="px-8 h-14 text-lg font-medium bg-gradient-to-r from-[#102F56] to-[#1a4d7a] hover:from-[#0d2545] hover:to-[#153e62] dark:from-[#6DB2FF] dark:to-[#5a9ae6] dark:hover:from-[#5a9ae6] dark:hover:to-[#4882cc] text-white dark:text-gray-900 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                style={{ borderRadius: '10px' }}
              >
                <a
                  href="https://www.muheportfolio.com/s/Design-MASALa_Survey-Report.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Full Report
                </a>
              </Button>
            </div>
            
            {/* Survey Chart Image */}
            <div className="mt-8">
              <ImageWithFallback
                src={surveyChartImg}
                alt="Survey chart showing usage of different features by educators"
                className="w-full h-auto"
                style={{ borderRadius: '10px' }}
              />
            </div>
          </div>

          {/* Heuristic Evaluation */}
          <div className="mb-16" id="heuristic-evaluation">
            <h2 className="text-3xl md:text-4xl leading-tight mb-10 bg-gradient-to-r from-[#102F56] to-[#1a4d7a] dark:from-blue-300 dark:to-blue-400 bg-clip-text text-transparent">
              Heuristic Evaluation
            </h2>
            <div className="space-y-6 text-lg text-gray-700 dark:text-gray-200 leading-relaxed">
              <p>
                We conducted heuristics evaluation based on Nielsen's ten key usability heuristics and modified some of the checklists to make applicable evaluations for Storyweaver. Our main findings include:
              </p>
              <ul className="list-disc pl-6 space-y-3">
                <li>
                  The Help and Documentation Section are difficult to navigate on mobile.
                </li>
                <li>
                  Process of downloading high-resolution books requires an onerous form each time.
                </li>
                <li>
                  The story reading experience has a small feature set that limits the user's options for engaging content and should be made more robust.
                </li>
              </ul>
            </div>
            
            {/* View Full Report Button */}
            <div className="flex justify-center mt-8">
              <Button 
                asChild
                size="lg"
                className="px-8 h-14 text-lg font-medium bg-gradient-to-r from-[#102F56] to-[#1a4d7a] hover:from-[#0d2545] hover:to-[#153e62] dark:from-[#6DB2FF] dark:to-[#5a9ae6] dark:hover:from-[#5a9ae6] dark:hover:to-[#4882cc] text-white dark:text-gray-900 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                style={{ borderRadius: '10px' }}
              >
                <a
                  href="https://www.muheportfolio.com/s/Design-MASALa_Heuristic-Evaluation-Report.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Full Report
                </a>
              </Button>
            </div>
            
            {/* Heuristics Table Image */}
            <div className="mt-8">
              <ImageWithFallback
                src={heuristicsTableImg}
                alt="Heuristic evaluation table showing StoryWeaver vs competitors across multiple dimensions"
                className="w-full h-auto"
                style={{ borderRadius: '10px' }}
              />
            </div>
          </div>

          {/* Usability Test */}
          <div className="mb-16" id="usability-test">
            <h2 className="text-3xl md:text-4xl leading-tight mb-10 bg-gradient-to-r from-[#102F56] to-[#1a4d7a] dark:from-blue-300 dark:to-blue-400 bg-clip-text text-transparent">
              Usability Test
            </h2>
            <div className="space-y-6 text-lg text-gray-700 dark:text-gray-200 leading-relaxed">
              <p>
                After preparing our test plan by writing the pre-test questions, preamble, task instructions, and post-questionnaire, we conducted 5 tests in total, with each test taking approximately 30 to 35 minutes. Our main findings include:
              </p>
              <ul className="list-disc pl-6 space-y-3">
                <li>
                  Content discovery in Storyweaver remains a challenge for educators.
                </li>
                <li>
                  Interface elements displayed in only one mode (text or icon) are not clear to users, limiting the navigation and usability of the site.
                </li>
                <li>
                  There is a disconnect between educators' expectations and how the site presents educational content.
                </li>
                <li>
                  The Help section is easy to find; however, the content is not organized for user needs.
                </li>
              </ul>
            </div>
            
            {/* View Full Report Button */}
            <div className="flex justify-center mt-8">
              <Button 
                asChild
                size="lg"
                className="px-8 h-14 text-lg font-medium bg-gradient-to-r from-[#102F56] to-[#1a4d7a] hover:from-[#0d2545] hover:to-[#153e62] dark:from-[#6DB2FF] dark:to-[#5a9ae6] dark:hover:from-[#5a9ae6] dark:hover:to-[#4882cc] text-white dark:text-gray-900 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                style={{ borderRadius: '10px' }}
              >
                <a
                  href="https://www.muheportfolio.com/s/Design-MASALa_Usability-Testing-Report.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Full Report
                </a>
              </Button>
            </div>
          </div>

          {/* Final Video */}
          <div className="mb-16" id="final-video">
            <h2 className="text-3xl md:text-4xl leading-tight mb-10 bg-gradient-to-r from-[#102F56] to-[#1a4d7a] dark:from-blue-300 dark:to-blue-400 bg-clip-text text-transparent">
              Final Video
            </h2>
            <div className="mt-8">
              <div className="relative w-full" style={{ paddingBottom: '56.25%', borderRadius: '10px', overflow: 'hidden' }}>
                <iframe
                  src="https://player.vimeo.com/video/310067767"
                  className="absolute top-0 left-0 w-full h-full"
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  title="Storyweaver Final Video"
                ></iframe>
              </div>
            </div>
          </div>

          {/* Key Takeaways */}
          <div className="mb-16" id="key-takeaways">
            <h2 className="text-3xl md:text-4xl leading-tight mb-10 bg-gradient-to-r from-[#102F56] to-[#1a4d7a] dark:from-blue-300 dark:to-blue-400 bg-clip-text text-transparent">
              Key Takeaways
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              {/* Text Content */}
              <div className="space-y-6 text-lg text-gray-700 dark:text-gray-200 leading-relaxed">
                <ul className="list-disc pl-6 space-y-4">
                  <li>
                    Similar to design, research also requires an iterative and self-reflective process.
                  </li>
                  <li>
                    Discover the sparkling point and potential of each teammate, and make the best use of it.
                  </li>
                  <li>
                    Good and practical design often comes from systematic, comprehensive, and logical research.
                  </li>
                  <li>
                    For websites, always keep an eye on how mobile and desktop version worked, even though one of those are not so prevalent than the other.
                  </li>
                </ul>
              </div>
              
              {/* Team Photo with Caption */}
              <div>
                <ImageWithFallback
                  src={teamPhotoImg}
                  alt="Group photo with my teammates"
                  className="w-full h-auto"
                  style={{ borderRadius: '10px' }}
                />
                <p className="text-sm text-gray-600 dark:text-white mt-3 italic">
                  Group photo with my teammates
                </p>
              </div>
            </div>
          </div>
        </motion.div>
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

      {/* Table of Contents - Right Sidebar */}
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
    </main>
  );
}