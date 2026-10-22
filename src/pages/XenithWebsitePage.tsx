import { localize } from "../i18n/locale";
import { ProjectImageLightbox, activateImageOnKey } from "../components/case-study/ProjectImageLightbox";
import { ProjectHero } from "../components/case-study/ProjectHero";
import { ProjectNavigation } from "../components/case-study/ProjectNavigation";
import { ShoppingBag } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
const heatmapImg1 = "https://drive.google.com/thumbnail?id=1jV6VGafZXFfdXrkcMYWhRkcFsEVSb2Tu&sz=w1920";
const heatmapImg2 = "https://drive.google.com/thumbnail?id=1CCyumgW9obd6zoTBmGeQSWTHGqwX89Iu&sz=w1920";
const teamPhoto = "https://drive.google.com/thumbnail?id=1moJecNEo8ecvFF6IYnTqhJNAZ8eBmq6Y&sz=w1920";
const hustlePhoto = "https://drive.google.com/thumbnail?id=1MMQblHOAdDxE1eAQOi_a3kBXlh2pvI-_&sz=w1920";
const pushPullModel = "https://drive.google.com/thumbnail?id=1Z87JnNxeiFsmdRH-ttXSOeq1qpPwc3mf&sz=w1920";
const mobileApp1 = "https://drive.google.com/thumbnail?id=1OykKxp4cQ9PwiiieYoBMcNfiv3l4FOEq&sz=w1920";
const mobileApp2 = "https://drive.google.com/thumbnail?id=15B7nL9jMdrgApCr-oZSw-TJe0lTWEQYc&sz=w1920";
const mobileApp3 = "https://drive.google.com/thumbnail?id=1hmlvmurdJZ-AX1aZSTsHytp9nZFa4nHj&sz=w1920";
const mobileApp4 = "https://drive.google.com/thumbnail?id=1Pf7Cn_mkWtOwiKicSRe6vmgQmowMuUGM&sz=w1920";
const mobileApp5 = "https://drive.google.com/thumbnail?id=1tkyHyql2KpjNrhyofk9vy0FetYAVYPOm&sz=w1920";
const mobileApp6 = "https://drive.google.com/thumbnail?id=1jN7z_iEU2m3ZyQsHT8BNNoGemplV6UE2&sz=w1920";
const mobileApp7 = "https://drive.google.com/thumbnail?id=1x2fEPEfdvqAh92hjvTMevBaURov0rJ0P&sz=w1920";
const mobileApp8 = "https://drive.google.com/thumbnail?id=1cUb6ktJQRMeBQqEfyoqXzXQGyCacCdem&sz=w1920";
const mobileApp9 = "https://drive.google.com/thumbnail?id=1H1TBhkSOOzpHPmM3udhdH3YJNjDkMY8u&sz=w1920";
const serialFlowChart = "https://drive.google.com/thumbnail?id=1Ag3r1VOjYsd2vdaDijIhf6LVJuSVr1SA&sz=w1920";
const wireframeSystem = "https://drive.google.com/thumbnail?id=1DyHNQeixFOBM6dM5ojnWCBiod6Le1Wz2&sz=w1920";
const newOrderPage = "https://drive.google.com/thumbnail?id=1KBMRa8ZIXBUm5Y_9MZmBr95h3pMt0x3Y&sz=w1920";
const orderDetailPage = "https://drive.google.com/thumbnail?id=16Eiwnm5v1VbRFb8qOJztfAqC7ZAkQhmp&sz=w1920";
const compareHelmet1 = "https://drive.google.com/thumbnail?id=1FMtR0lWVr4NucQ-ZwwnmwJdTB_K4QjD7&sz=w1920";
const compareHelmet2 = "https://drive.google.com/thumbnail?id=1ti3QzaDCXeFfPTUbLSbOz2ApqJb4mdqW&sz=w1920";
const compareHelmet3 = "https://drive.google.com/thumbnail?id=1kT63Cqljgivy43TFaasSgZnvjhxNnC_D&sz=w1920";
const heroMobile1 = "https://drive.google.com/thumbnail?id=1Yc1VhEyQPWatPAq-qnDa75M0oXFFfh9c&sz=w1920";
const heroMobile2 = "https://drive.google.com/thumbnail?id=1833ORGFZgdLjJZVad8IuOj3Fmj_tlRL8&sz=w1920";
const heroMobile3 = "https://drive.google.com/thumbnail?id=1kDZmh1VVSw0FIVI64jWLzDvIVwbkqti9&sz=w1920";
const mainMenu1 = "https://drive.google.com/thumbnail?id=1YDtd2q-AzhV6AYigSciCbn3jGT3iF3NS&sz=w1920";
const mainMenu2 = "https://drive.google.com/thumbnail?id=1ErDpi2L1DbVqKtWUq3STm2TtS12Xwi5R&sz=w1920";
const mainMenu3 = "https://drive.google.com/thumbnail?id=1zuOhbB_fVw8niPyRz30Cp7-qa6EYS-Yg&sz=w1920";
const helmetLineup1 = "https://drive.google.com/thumbnail?id=18WzdDhmPSGjbf0_LpqBCcIdg5Dq_-L7T&sz=w1920";
const helmetLineup2 = "https://drive.google.com/thumbnail?id=1sfwFVJhJmIx_fVX8WhxfgVmgms7m_Wlj&sz=w1920";
const helmetLineup3 = "https://drive.google.com/thumbnail?id=1795efa0lADoymc5nOghYGyJ7aKPpuzOU&sz=w1920";
const footer1 = "https://drive.google.com/thumbnail?id=1JqV-Z5_lBu8rTiHIUMH5nMcrw_WYD2MX&sz=w1920";
const footer2 = "https://drive.google.com/thumbnail?id=1pMYJCxgIGAnHbxGBxwYXc9oS9dujqDld&sz=w1920";
const footer3 = "https://drive.google.com/thumbnail?id=11zC8lVpjcVS7zawDuKzKhgLUQbF9-_1G&sz=w1920";
const keyFeaturesImg = "https://drive.google.com/thumbnail?id=1AiDZqnxlIG4nglbnxDC3an5Ll5KJ3XzF&sz=w1920";
const heuristicEvalImg = "https://drive.google.com/thumbnail?id=172i_zPQpdPxZ9lI5y33ZpASokuOHp3WF&sz=w1920";
const previousContentStrategyImg = "https://drive.google.com/thumbnail?id=1OOVEsCVr6ROwxkcFjFqN8NXpMLBt04D1&sz=w1920";
const invertedPyramidImg = "https://drive.google.com/thumbnail?id=1rPgVdUynB_GN-rtosyp0LGSJuJOtSukY&sz=w1920";
const interactionMapImg = "https://drive.google.com/thumbnail?id=1G3fkbwte9OPXPg4mOKuuhJSdUoy2JC1X&sz=w1920";
const processTimelineImg = "https://drive.google.com/thumbnail?id=1mYjjXMjcxg1bOvy_a5c0tFVI_JDCx0xr&sz=w1920";
const personaPlayer = "https://drive.google.com/thumbnail?id=1w0TIGMXhbpswlH6OWQhCbhboE1s37_Cv&sz=w1920";
const personaCoach = "https://drive.google.com/thumbnail?id=1gnG1Q1amJQf5zw_7qVqYh95dofUHP8Yu&sz=w1920";
const personaParent = "https://drive.google.com/thumbnail?id=12JzGgLurkMM201bm6fLky0xOU7xuFY-T&sz=w1920";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import Slider from "react-slick";

function PersonaSliderArrow({ className, style, onClick, direction }: { className?: string; style?: React.CSSProperties; onClick?: React.MouseEventHandler<HTMLButtonElement>; direction: "previous" | "next" }) {
  const label = localize(direction === "previous" ? "Previous" : "Next");
  return <button type="button" className={className} style={style} onClick={onClick} aria-label={label}>{label}</button>;
}

export function XenithWebsitePage() {
  const reduceMotion = useReducedMotion();
  const [expandedImage, setExpandedImage] = useState<{ src: string; alt: string } | null>(null);

  const tableOfContents = [
    { id: "brief", label: "Introduction" },
    { id: "problem", label: "Process" },
    { id: "challenge", label: "Challenge" },
    { id: "solution-overview", label: "Break downs" },
    { id: "design-challenge", label: "The Research" },
    { id: "approach-strategy", label: "1. New Homepage" },
    { id: "mobile-app-mockups", label: "2. Xenith's Mobile APP Mockups (future)" },
    { id: "product-entry-system", label: "3. Product Entry System UI" },
    { id: "final-implementation", label: "Reflections" },
    { id: "impact", label: "Feedback" },
    { id: "learnings-reflections", label: "Key Takeaways" }
  ];

  return (
    <main className="case-study pt-20 pb-24">
      <ProjectHero
        title={localize("Xenith Website Redesign")}
        description={localize("Redesigning online e-commerce website to optimize user’s purchase path and branding communication.")}
        icon={ShoppingBag} tone="xenith"
        image={{ src: "/media/project-covers/xenith.jpg", alt: "Xenith storefront featuring the Shadow helmet and the helmet lineup.", width: 1849, height: 924, crop: { x: 1022, y: 178, width: 714, height: 572 } }}
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
                <p className="text-lg text-gray-900 dark:text-gray-100">{localize("UX/UI Design, UX Research")}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{localize("Roles")}</p>
                <p className="text-lg text-gray-900 dark:text-gray-100">{localize("Product Design Intern")}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{localize("Team")}</p>
                <p className="text-lg text-gray-900 dark:text-gray-100">{localize("Product Manager, Business Strategist, Engineer")}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{localize("Timeline")}</p>
                <p className="text-lg text-gray-900 dark:text-gray-100">{localize("June - August 2018")}</p>
              </div>
            </div>
          </div>

          {/* Brief */}
          <div className="mb-16" id="brief">
            <h2 className="text-3xl md:text-4xl leading-tight mb-10 bg-gradient-to-r from-[#102F56] to-[#1a4d7a] dark:from-blue-300 dark:to-blue-400 bg-clip-text text-transparent">{localize("Introduction")}</h2>
            <p className="text-lg text-gray-700 dark:text-gray-200 leading-relaxed mb-8">{localize("In summer 2018, I interned at Xenith LLC's headquarters in downtown Detroit as a Product Design Intern on the Digital Strategy team. I conducted user research on the previous version of the e-commerce website and participated in its redesign. I also developed a series of UX workflows on the front end, where everyone on the team can access order details, track order status, and manage product specifications.")}</p>
            <p className="text-center text-sm text-gray-600 dark:text-gray-400" style={{ fontFamily: 'monospace' }}>{localize("*** This project is partially subject to non-disclosure agreement (NDA) ***")}</p>
          </div>

          {/* Problem */}
          <div className="mb-16" id="problem">
            <h2 className="text-3xl md:text-4xl leading-tight mb-10 bg-gradient-to-r from-[#102F56] to-[#1a4d7a] dark:from-blue-300 dark:to-blue-400 bg-clip-text text-transparent">{localize("Process")}</h2>
            <p className="text-lg text-gray-700 dark:text-gray-200 leading-relaxed mb-8">{localize("In the 10-week time span, I collaborated with marketing strategists, product managers, software engineers, and my design mentor Charles, to conduct research, design, prototype, iterate, and finally create a seamless and logical user experience, which helped increase page views and online purchases.")}</p>
            <div className="mb-8">
              <div className="bg-white dark:bg-white p-6 md:p-8" style={{ borderRadius: '10px' }}>
                <ImageWithFallback
                  src={processTimelineImg}
                  alt={localize("Design Process Timeline")}
                  className="w-full h-auto"
                  style={{ borderRadius: '10px' }}
                />
              </div>
            </div>
            <div className="text-lg text-gray-700 dark:text-gray-200 leading-relaxed">
              <p className="mb-4">{localize("The main projects I participated include:")}</p>
              <ul className="list-disc pl-6 space-y-3">
                <li>{localize("UI/UX audit of Xenith.com to focus on brand communication")}</li>
                <li>{localize("Design of apparel product website on creating seamless interactions")}</li>
                <li>{localize("Redesign of UI of product entry database system")}</li>
                <li>{localize("Design mobile interfaces for the app (future)")}</li>
              </ul>
            </div>
          </div>

          {/* Challenge */}
          <div className="mb-16" id="challenge">
            <h2 className="text-3xl md:text-4xl leading-tight mb-10 bg-gradient-to-r from-[#102F56] to-[#1a4d7a] dark:from-blue-300 dark:to-blue-400 bg-clip-text text-transparent">{localize("Challenge: \"We don't know what we don't know!\"")}</h2>
            <p className="text-lg text-gray-700 dark:text-gray-200 leading-relaxed mb-6">{localize("The quote above came from one of my team members, who had struggled with the issue for a long time. The previous version was built several years earlier on top of several different third-party applications, and while Xenith had since introduced new product lines, most of the functionality in the old version was limited and outdated. Moreover, the information architecture was somewhat misleading, and the brand communication was not clear enough to attract buyers.")}</p>
            <p className="text-lg text-gray-700 dark:text-gray-200 leading-relaxed">{localize("The overarching goal was to optimize the sales channel with a simple, clear user experience, and to present information more effectively so it told the brand and product story to target users.")}</p>
          </div>

          {/* Solution Overview */}
          <div className="mb-16" id="solution-overview">
            <h2 className="text-3xl md:text-4xl leading-tight mb-10 bg-gradient-to-r from-[#102F56] to-[#1a4d7a] dark:from-blue-300 dark:to-blue-400 bg-clip-text text-transparent">{localize("Break downs")}</h2>
            <p className="text-lg text-gray-700 dark:text-gray-200 leading-relaxed mb-8">{localize("Before getting started with research and design, I decided to break the challenge down into sub-tasks and solve them one by one. Here are the major steps of how I accomplished it:")}</p>

            {/* Subsection: Visualize User Behaviors on Heatmap */}
            <div className="mb-8">
              <h3 className="text-2xl leading-normal mb-6 text-[#102F56] dark:text-gray-100">{localize("/ Visualize User Behaviors on Heatmap")}</h3>
              <p className="text-lg text-gray-700 dark:text-gray-200 leading-relaxed mb-8">{localize("Tracking user behavior is an effective way to learn which content on a site is popular, so I recommended recording user clicks on Xenith's website and generating a heatmap in Hotjar, which helped uncover their potential needs. Combining the heatmap results (left) with usability testing, I carried out the redesign of Xenith's website (right).")}</p>

              {/* Two images side by side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col">
                  <ImageWithFallback 
                    src={heatmapImg1}
                    alt={localize("Heatmap analysis")}
                    className="w-full h-auto"
                    style={{ borderRadius: '10px' }}
                  />
                  <p className="text-left text-gray-700 dark:text-white mt-4">{localize("Heatmap recording user's click on popular content")}</p>
                </div>
                <div className="flex flex-col h-full">
                  <div className="relative w-full aspect-[16/10] md:aspect-auto md:flex-1 rounded-[10px] overflow-hidden">
                    <ImageWithFallback 
                      src={heatmapImg2}
                      alt={localize("Website redesign")}
                      className="absolute inset-0 w-full h-full object-cover object-[center_20%]"
                    />
                  </div>
                  <p className="text-left text-gray-700 dark:text-white mt-4">{localize("Redesigned website base on user research")}</p>
                </div>
              </div>
            </div>

            {/* Subsection: Information Architecture */}
            <div className="mb-8">
              <h3 className="text-2xl leading-normal mb-6 text-[#102F56] dark:text-gray-100">{localize("/ Information Architecture")}</h3>
              <p className="text-lg text-gray-700 dark:text-gray-200 leading-relaxed mb-8">{localize("Since I didn't have prior experience with the user flow or a clear understanding of the information architecture, I decided to construct an interaction map: a static representation of both the lateral and hierarchical relations between webpages, visualizing all the possible interactions. This made it more efficient for me to discover what kind of value the website could provide for users.")}</p>

              {/* Interaction Map Image */}
              <div>
                <div className="bg-white dark:bg-white p-6 md:p-8" style={{ borderRadius: '10px' }}>
                  <ImageWithFallback
                    src={interactionMapImg}
                    alt={localize("Interaction Map of Xenith.com")}
                    className="w-full h-auto"
                    style={{ borderRadius: '10px' }}
                  />
                </div>
                <p className="text-left text-gray-600 dark:text-white mt-4 text-sm">{localize("Interaction Map of Xenith.com")}</p>
              </div>
            </div>

            {/* Subsection: Prioritize key features by using Inverted Pyramid model */}
            <div className="mb-8">
              <h3 className="text-2xl leading-normal mb-6 text-[#102F56] dark:text-gray-100">{localize("/ Prioritize key features by using Inverted Pyramid model")}</h3>
              <p className="text-lg text-gray-700 dark:text-gray-200 leading-relaxed mb-8">{localize("Getting to know the site's information structure, I had a short conversation with both the product manager and the marketing strategist, and ranked the importance of our target users. Based on that, I introduced an inverted pyramid model. As it is displayed in the chart below, the top represents the most substantial, interesting, and important information, whereas both the importance and the quantity of information decrease moving downward. In this way, I was able to prioritize the main features by new product & key value, team sales & innovation, and product customization.")}</p>

              {/* Two images side by side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <div className="bg-white dark:bg-white p-6 md:p-8" style={{ borderRadius: '10px' }}>
                    <ImageWithFallback
                      src={previousContentStrategyImg}
                      alt={localize("Previous Content Strategy")}
                      className="w-full h-auto"
                      style={{ borderRadius: '10px' }}
                    />
                  </div>
                  <p className="text-left text-gray-600 dark:text-white mt-4 text-sm">{localize("Previous Content Strategy")}</p>
                </div>
                <div>
                  <div className="bg-white dark:bg-white p-6 md:p-8" style={{ borderRadius: '10px' }}>
                    <ImageWithFallback
                      src={invertedPyramidImg}
                      alt={localize("Inverted Pyramid Model")}
                      className="w-full h-auto"
                      style={{ borderRadius: '10px' }}
                    />
                  </div>
                  <p className="text-left text-gray-600 dark:text-white mt-4 text-sm">{localize("Inverted Pyramid Model")}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Design Challenge */}
          <div className="mb-16" id="design-challenge">
            <h2 className="text-3xl md:text-4xl leading-tight mb-10 bg-gradient-to-r from-[#102F56] to-[#1a4d7a] dark:from-blue-300 dark:to-blue-400 bg-clip-text text-transparent">{localize("The Research")}</h2>
            <p className="text-lg text-gray-700 dark:text-gray-200 leading-relaxed mb-8">{localize("Over the first 4 weeks of my internship, I worked closely with my team to conduct extensive user research. My primary task was synthesizing the research data and collecting the key insights.")}</p>

            {/* Subsection: Understanding Users */}
            <div className="mb-8">
              <h3 className="text-2xl mb-6 text-[#102F56] dark:text-gray-100">{localize("/ Understanding Users")}</h3>
              <p className="text-lg text-gray-700 dark:text-gray-200 leading-relaxed mb-8">{localize("Based on the information my team provided and user demographics in Google Analytics, the primary buyers of Xenith's products include players, parents, and coaches. To illustrate our users and their goals, I created three primary personas and identified their needs, which helped me find out what was important to them and how to build brand communication that would convince them to buy our products.")}</p>

              {/* Image Carousel/Slideshow Placeholder */}
              <div className="project-carousel w-full relative block">
                <Slider
                  prevArrow={<PersonaSliderArrow direction="previous" />}
                  nextArrow={<PersonaSliderArrow direction="next" />}
                  dots={true}
                  infinite={true}
                  speed={reduceMotion ? 0 : 500}
                  slidesToShow={1}
                  slidesToScroll={1}
                >
                  <div>
                    <ImageWithFallback
                      src={personaPlayer}
                      alt={localize("Persona: Player")}
                      className="w-full h-auto"
                      style={{ borderRadius: '10px' }}
                    />
                    <p className="text-left text-gray-600 dark:text-white mt-4 text-sm">{localize("Persona: Player")}</p>
                  </div>
                  <div>
                    <ImageWithFallback
                      src={personaCoach}
                      alt={localize("Persona: Coach")}
                      className="w-full h-auto"
                      style={{ borderRadius: '10px' }}
                    />
                    <p className="text-left text-gray-600 dark:text-white mt-4 text-sm">{localize("Persona: Coach")}</p>
                  </div>
                  <div>
                    <ImageWithFallback
                      src={personaParent}
                      alt={localize("Persona: Parent")}
                      className="w-full h-auto"
                      style={{ borderRadius: '10px' }}
                    />
                    <p className="text-left text-gray-600 dark:text-white mt-4 text-sm">{localize("Persona: Parent")}</p>
                  </div>
                </Slider>
              </div>
            </div>

            {/* Subsection: Heuristic Evaluation */}
            <div className="mb-8">
              <h3 className="text-2xl mb-6 text-[#102F56] dark:text-gray-100">{localize("/ Heuristic Evaluation")}</h3>
              <p className="text-lg text-gray-700 dark:text-gray-200 leading-relaxed mb-8">{localize("I conducted a heuristic evaluation based on Nielsen's ten key usability heuristics, modifying some of the checklists to make the evaluation applicable to Xenith. I invited four colleagues who had previous experience with user research. The main findings include:")}</p>

              <ul className="list-disc space-y-4 text-lg text-gray-700 dark:text-gray-200 leading-relaxed pl-6 mb-8">
                <li>{localize("The website didn't provide an effective comparison between similar products.")}</li>
                <li>{localize("Product categories were not consistent between the header and footer on some pages.")}</li>
                <li>{localize("The homepage didn't provide adequate feedback for user interactions.")}</li>
              </ul>

              {/* Heuristic Evaluation Image */}
              <div>
                <ImageWithFallback
                  src={heuristicEvalImg}
                  alt={localize("Heuristic Evaluation Group Rating Results")}
                  className="w-full h-auto"
                  style={{ borderRadius: '10px' }}
                />
                <p className="text-left text-gray-700 dark:text-white mt-4">{localize("Heuristic Evaluation Group Rating Results")}</p>
              </div>
            </div>
          </div>

          {/* Approach & Strategy */}
          <div className="mb-16" id="approach-strategy">
            <h2 className="text-3xl md:text-4xl leading-tight mb-10 bg-gradient-to-r from-[#102F56] to-[#1a4d7a] dark:from-blue-300 dark:to-blue-400 bg-clip-text text-transparent">{localize("1. New Homepage")}</h2>

            {/* Subsection: Key Features */}
            <div className="mb-8">
              <h3 className="text-2xl mb-6 text-[#102F56] dark:text-gray-100">{localize("/ Key Features")}</h3>
              <p className="text-lg text-gray-700 dark:text-gray-200 leading-relaxed mb-8">{localize("Based on personas, heuristic evaluations, and usability tests I conducted, my team and I identified the key features that are important to the new webpage.")}</p>

              {/* Key Features Image */}
              <div>
                <div className="bg-white dark:bg-white p-6 md:p-8" style={{ borderRadius: '10px' }}>
                  <ImageWithFallback
                    src={keyFeaturesImg}
                    alt={localize("Key Features")}
                    className="w-full h-auto"
                    style={{ borderRadius: '10px' }}
                  />
                </div>
              </div>
            </div>

            {/* Subsection: Design Iteration */}
            <div className="mb-8">
              <h3 className="text-2xl mb-6 text-[#102F56] dark:text-gray-100">{localize("/ Design Iteration")}</h3>

              {/* Desktop */}
              <div className="mb-6">
                <h4 className="text-xl mb-4 text-[#102F56] dark:text-gray-100">{localize("// Desktop")}</h4>

                {/* Footer */}
                <div className="mb-4">
                  <h5 className="text-lg mb-3 text-[#102F56] dark:text-gray-100">{localize("/// Footer")}</h5>

                  {/* Three iterations side by side */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                    {/* Round 1 */}
                    <div className="flex flex-col">
                      <div className="w-full aspect-[3/1]" style={{ borderRadius: '10px', overflow: 'hidden' }}>
                        <ImageWithFallback
                          src={footer1}
                          alt={localize("Footer - Round 1")}
                          className="w-full h-auto cursor-pointer hover:opacity-90 transition-opacity"
                          role="button" tabIndex={0} aria-haspopup="dialog" onKeyDown={activateImageOnKey} onClick={() => setExpandedImage({ src: footer1, alt: "Footer - Round 1" })}
                        />
                      </div>
                      <div className="mt-2">
                        <p className="text-gray-900 dark:text-gray-100" style={{ fontWeight: 'bold' }}>{localize("Round 1")}</p>
                        <p className="text-gray-700 dark:text-gray-200">{localize("Scroll bar in email lists.")}</p>
                        <p className="text-gray-700 dark:text-gray-200">{localize("Bad UX structure on any screen size.")}</p>
                      </div>
                    </div>

                    {/* Round 2 */}
                    <div className="flex flex-col">
                      <div className="w-full aspect-[3/1]" style={{ borderRadius: '10px', overflow: 'hidden' }}>
                        <ImageWithFallback
                          src={footer2}
                          alt={localize("Footer - Round 2")}
                          className="w-full h-auto cursor-pointer hover:opacity-90 transition-opacity"
                          role="button" tabIndex={0} aria-haspopup="dialog" onKeyDown={activateImageOnKey} onClick={() => setExpandedImage({ src: footer2, alt: "Footer - Round 2" })}
                        />
                      </div>
                      <div className="mt-2">
                        <p className="text-gray-900 dark:text-gray-100" style={{ fontWeight: 'bold' }}>{localize("Round 2")}</p>
                        <p className="text-gray-700 dark:text-gray-200">{localize("Remove scroll bar.")}</p>
                        <p className="text-gray-700 dark:text-gray-200">{localize("Better size alignment.")}</p>
                      </div>
                    </div>

                    {/* Final Design */}
                    <div className="flex flex-col">
                      <div className="w-full aspect-[3/1]" style={{ borderRadius: '10px', overflow: 'hidden' }}>
                        <ImageWithFallback
                          src={footer3}
                          alt={localize("Footer - Final Design")}
                          className="w-full h-auto cursor-pointer hover:opacity-90 transition-opacity"
                          role="button" tabIndex={0} aria-haspopup="dialog" onKeyDown={activateImageOnKey} onClick={() => setExpandedImage({ src: footer3, alt: "Footer - Final Design" })}
                        />
                      </div>
                      <div className="mt-2">
                        <p className="text-gray-900 dark:text-gray-100" style={{ fontWeight: 'bold' }}>{localize("Final Design")}</p>
                        <p className="text-gray-700 dark:text-gray-200">{localize("Provide identity checkbox in email lists.")}</p>
                        <p className="text-gray-700 dark:text-gray-200">{localize("Better UX and hierarchy in footer.")}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Helmet Lineup */}
                <div className="mb-4">
                  <h5 className="text-lg mb-3 text-[#102F56] dark:text-gray-100">{localize("/// Helmet Lineup")}</h5>

                  {/* Three iterations side by side */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                    {/* Round 1 */}
                    <div className="flex flex-col">
                      <div className="w-full h-[160px] overflow-hidden" style={{ borderRadius: '10px' }}>
                        <ImageWithFallback
                          src={helmetLineup1}
                          alt={localize("Helmet Lineup - Round 1")}
                          className="w-full h-auto cursor-pointer hover:opacity-90 transition-opacity"
                          role="button" tabIndex={0} aria-haspopup="dialog" onKeyDown={activateImageOnKey} onClick={() => setExpandedImage({ src: helmetLineup1, alt: "Helmet Lineup - Round 1" })}
                        />
                      </div>
                      <div className="mt-2">
                        <p className="text-gray-900 dark:text-gray-100" style={{ fontWeight: 'bold' }}>{localize("Round 1")}</p>
                        <p className="text-gray-700 dark:text-gray-200">{localize("Too big on tablet screens")}</p>
                      </div>
                    </div>

                    {/* Round 2 */}
                    <div className="flex flex-col">
                      <div className="w-full h-[160px] overflow-hidden" style={{ borderRadius: '10px' }}>
                        <ImageWithFallback
                          src={helmetLineup2}
                          alt={localize("Helmet Lineup - Round 2")}
                          className="w-full h-auto cursor-pointer hover:opacity-90 transition-opacity"
                          role="button" tabIndex={0} aria-haspopup="dialog" onKeyDown={activateImageOnKey} onClick={() => setExpandedImage({ src: helmetLineup2, alt: "Helmet Lineup - Round 2" })}
                        />
                      </div>
                      <div className="mt-2">
                        <p className="text-gray-900 dark:text-gray-100" style={{ fontWeight: 'bold' }}>{localize("Round 2")}</p>
                        <p className="text-gray-700 dark:text-gray-200">{localize("More appropriate size on tablet screens")}</p>
                      </div>
                    </div>

                    {/* Final Design */}
                    <div className="flex flex-col">
                      <div className="w-full h-[160px] overflow-hidden" style={{ borderRadius: '10px' }}>
                        <ImageWithFallback
                          src={helmetLineup3}
                          alt={localize("Helmet Lineup - Final Design")}
                          className="w-full h-auto cursor-pointer hover:opacity-90 transition-opacity"
                          role="button" tabIndex={0} aria-haspopup="dialog" onKeyDown={activateImageOnKey} onClick={() => setExpandedImage({ src: helmetLineup3, alt: "Helmet Lineup - Final Design" })}
                        />
                      </div>
                      <div className="mt-2">
                        <p className="text-gray-900 dark:text-gray-100" style={{ fontWeight: 'bold' }}>{localize("Final Design")}</p>
                        <p className="text-gray-700 dark:text-gray-200">{localize("Hierarchical product info")}</p>
                        <p className="text-gray-700 dark:text-gray-200">{localize("Responsive across all devices")}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Main Menu */}
                <div className="mb-4">
                  <h5 className="text-lg mb-3 text-[#102F56] dark:text-gray-100">{localize("/// Main Menu")}</h5>

                  {/* Three iterations side by side */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Round 1 */}
                    <div className="flex flex-col">
                      <div className="w-full aspect-[4/3] overflow-hidden" style={{ borderRadius: '10px' }}>
                        <ImageWithFallback
                          src={mainMenu1}
                          alt={localize("Main Menu - Round 1")}
                          className="w-full h-full object-cover object-top cursor-pointer hover:opacity-90 transition-opacity"
                          role="button" tabIndex={0} aria-haspopup="dialog" onKeyDown={activateImageOnKey} onClick={() => setExpandedImage({ src: mainMenu1, alt: "Main Menu - Round 1" })}
                        />
                      </div>
                      <div className="mt-2">
                        <p className="text-gray-900 dark:text-gray-100" style={{ fontWeight: 'bold' }}>{localize("Round 1")}</p>
                        <p className="text-gray-700 dark:text-gray-200">{localize("No hover status on menu items")}</p>
                      </div>
                    </div>

                    {/* Round 2 */}
                    <div className="flex flex-col">
                      <div className="w-full aspect-[4/3] overflow-hidden" style={{ borderRadius: '10px' }}>
                        <ImageWithFallback
                          src={mainMenu2}
                          alt={localize("Main Menu - Round 2")}
                          className="w-full h-full object-cover object-top cursor-pointer hover:opacity-90 transition-opacity"
                          role="button" tabIndex={0} aria-haspopup="dialog" onKeyDown={activateImageOnKey} onClick={() => setExpandedImage({ src: mainMenu2, alt: "Main Menu - Round 2" })}
                        />
                      </div>
                      <div className="mt-2">
                        <p className="text-gray-900 dark:text-gray-100" style={{ fontWeight: 'bold' }}>{localize("Round 2")}</p>
                        <p className="text-gray-700 dark:text-gray-200">{localize("Hover status and arrow indicator")}</p>
                      </div>
                    </div>

                    {/* Final Design */}
                    <div className="flex flex-col">
                      <div className="w-full aspect-[4/3] overflow-hidden" style={{ borderRadius: '10px' }}>
                        <ImageWithFallback
                          src={mainMenu3}
                          alt={localize("Main Menu - Final Design")}
                          className="w-full h-full object-cover object-top cursor-pointer hover:opacity-90 transition-opacity"
                          role="button" tabIndex={0} aria-haspopup="dialog" onKeyDown={activateImageOnKey} onClick={() => setExpandedImage({ src: mainMenu3, alt: "Main Menu - Final Design" })}
                        />
                      </div>
                      <div className="mt-2">
                        <p className="text-gray-900 dark:text-gray-100" style={{ fontWeight: 'bold' }}>{localize("Final Design")}</p>
                        <p className="text-gray-700 dark:text-gray-200">{localize("Expandable menu with detailed information")}</p>
                        <p className="text-gray-700 dark:text-gray-200">{localize("Display product categories in images")}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile */}
              <div className="mb-6">
                <h4 className="text-xl mb-4 text-[#102F56] dark:text-gray-100">{localize("// Mobile")}</h4>

                {/* Hero Image UI */}
                <div className="mb-4">
                  <h5 className="text-lg mb-3 text-[#102F56] dark:text-gray-100">{localize("/// Hero Image UI")}</h5>

                  {/* Three iterations side by side */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                    {/* Round 1 */}
                    <div className="flex flex-col">
                      <div className="w-full aspect-[9/16]" style={{ borderRadius: '10px', overflow: 'hidden' }}>
                        <ImageWithFallback
                          src={heroMobile1}
                          alt={localize("Hero Image UI - Round 1")}
                          className="w-full h-full object-cover object-top cursor-pointer hover:opacity-90 transition-opacity"
                          role="button" tabIndex={0} aria-haspopup="dialog" onKeyDown={activateImageOnKey} onClick={() => setExpandedImage({ src: heroMobile1, alt: "Hero Image UI - Round 1" })}
                        />
                      </div>
                      <div className="mt-2">
                        <p className="text-gray-900 dark:text-gray-100" style={{ fontWeight: 'bold' }}>{localize("Round 1")}</p>
                        <p className="text-gray-700 dark:text-gray-200">{localize("Carousel moves all around in responsive")}</p>
                      </div>
                    </div>

                    {/* Round 2 */}
                    <div className="flex flex-col">
                      <div className="w-full aspect-[9/16]" style={{ borderRadius: '10px', overflow: 'hidden' }}>
                        <ImageWithFallback
                          src={heroMobile2}
                          alt={localize("Hero Image UI - Round 2")}
                          className="w-full h-full object-cover object-top cursor-pointer hover:opacity-90 transition-opacity"
                          role="button" tabIndex={0} aria-haspopup="dialog" onKeyDown={activateImageOnKey} onClick={() => setExpandedImage({ src: heroMobile2, alt: "Hero Image UI - Round 2" })}
                        />
                      </div>
                      <div className="mt-2">
                        <p className="text-gray-900 dark:text-gray-100" style={{ fontWeight: 'bold' }}>{localize("Round 2")}</p>
                        <p className="text-gray-700 dark:text-gray-200">{localize("Fixed carousel spot above the button")}</p>
                      </div>
                    </div>

                    {/* Round 3 */}
                    <div className="flex flex-col">
                      <div className="w-full aspect-[9/16]" style={{ borderRadius: '10px', overflow: 'hidden' }}>
                        <ImageWithFallback
                          src={heroMobile3}
                          alt={localize("Hero Image UI - Round 3")}
                          className="w-full h-full object-cover object-top cursor-pointer hover:opacity-90 transition-opacity"
                          role="button" tabIndex={0} aria-haspopup="dialog" onKeyDown={activateImageOnKey} onClick={() => setExpandedImage({ src: heroMobile3, alt: "Hero Image UI - Round 3" })}
                        />
                      </div>
                      <div className="mt-2">
                        <p className="text-gray-900 dark:text-gray-100" style={{ fontWeight: 'bold' }}>{localize("Round 3")}</p>
                        <p className="text-gray-700 dark:text-gray-200">{localize("Replace carousel with the latest tech/product")}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Compare Helmets Chart */}
                <div className="mb-4">
                  <h5 className="text-lg mb-3 text-[#102F56] dark:text-gray-100">{localize("/// Compare Helmets Chart")}</h5>

                  {/* Three iterations side by side */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Round 1 */}
                    <div className="flex flex-col">
                      <div className="w-full aspect-[9/16] relative" style={{ borderRadius: '10px', overflow: 'hidden' }}>
                        <ImageWithFallback
                          src={compareHelmet1}
                          alt={localize("Compare Helmets Chart - Round 1")}
                          className="absolute inset-0 w-full h-full object-cover object-top cursor-pointer hover:opacity-90 transition-opacity"
                          role="button" tabIndex={0} aria-haspopup="dialog" onKeyDown={activateImageOnKey} onClick={() => setExpandedImage({ src: compareHelmet1, alt: "Compare Helmets Chart - Round 1" })}
                        />
                      </div>
                      <div className="mt-2">
                        <p className="text-gray-900 dark:text-gray-100" style={{ fontWeight: 'bold' }}>{localize("Round 1")}</p>
                        <p className="text-gray-700 dark:text-gray-200">{localize("Non-responsive interface")}</p>
                      </div>
                    </div>

                    {/* Round 2 */}
                    <div className="flex flex-col">
                      <div className="w-full aspect-[9/16] relative" style={{ borderRadius: '10px', overflow: 'hidden' }}>
                        <ImageWithFallback
                          src={compareHelmet2}
                          alt={localize("Compare Helmets Chart - Round 2")}
                          className="absolute inset-0 w-full h-full object-cover object-top cursor-pointer hover:opacity-90 transition-opacity"
                          role="button" tabIndex={0} aria-haspopup="dialog" onKeyDown={activateImageOnKey} onClick={() => setExpandedImage({ src: compareHelmet2, alt: "Compare Helmets Chart - Round 2" })}
                        />
                      </div>
                      <div className="mt-2">
                        <p className="text-gray-900 dark:text-gray-100" style={{ fontWeight: 'bold' }}>{localize("Round 2")}</p>
                        <p className="text-gray-700 dark:text-gray-200">{localize("Small font and requires scroll around too much")}</p>
                      </div>
                    </div>

                    {/* Round 3 */}
                    <div className="flex flex-col">
                      <div className="w-full aspect-[9/16] relative" style={{ borderRadius: '10px', overflow: 'hidden' }}>
                        <ImageWithFallback
                          src={compareHelmet3}
                          alt={localize("Compare Helmets Chart - Round 3")}
                          className="absolute inset-0 w-full h-full object-cover object-top cursor-pointer hover:opacity-90 transition-opacity"
                          role="button" tabIndex={0} aria-haspopup="dialog" onKeyDown={activateImageOnKey} onClick={() => setExpandedImage({ src: compareHelmet3, alt: "Compare Helmets Chart - Round 3" })}
                        />
                      </div>
                      <div className="mt-2">
                        <p className="text-gray-900 dark:text-gray-100" style={{ fontWeight: 'bold' }}>{localize("Round 3")}</p>
                        <p className="text-gray-700 dark:text-gray-200">{localize("Compare back and forth with flip-through cards")}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Xenith's Mobile APP Mockups */}
          <div className="mb-16" id="mobile-app-mockups">
            <h2 className="text-3xl md:text-4xl leading-tight mb-10 bg-gradient-to-r from-[#102F56] to-[#1a4d7a] dark:from-blue-300 dark:to-blue-400 bg-clip-text text-transparent">{localize("2. Xenith's Mobile APP Mockups (future)")}</h2>
            <p className="text-lg text-gray-700 dark:text-gray-200 leading-relaxed mb-8">{localize("Before my internship came to an end, I realized that if Xenith were to become a giant brand like Nike, an app would be helpful as more product lines launched. So I started this self-initiated project to create basic mockup screens for future reference for a Xenith mobile app. Below are some samples of the screens I created; the full interactive prototype can be accessed here.")}</p>

            {/* 3x3 Grid of images */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <ImageWithFallback 
                  src={mobileApp1}
                  alt={localize("Mobile App Mockup 1")}
                  className="w-full h-auto cursor-pointer hover:opacity-90 transition-opacity"
                  style={{ borderRadius: '10px' }}
                  role="button" tabIndex={0} aria-haspopup="dialog" onKeyDown={activateImageOnKey} onClick={() => setExpandedImage({ src: mobileApp1, alt: "Mobile App Mockup 1" })}
                />
              </div>
              <div>
                <ImageWithFallback 
                  src={mobileApp2}
                  alt={localize("Mobile App Mockup 2")}
                  className="w-full h-auto cursor-pointer hover:opacity-90 transition-opacity"
                  style={{ borderRadius: '10px' }}
                  role="button" tabIndex={0} aria-haspopup="dialog" onKeyDown={activateImageOnKey} onClick={() => setExpandedImage({ src: mobileApp2, alt: "Mobile App Mockup 2" })}
                />
              </div>
              <div>
                <ImageWithFallback 
                  src={mobileApp3}
                  alt={localize("Mobile App Mockup 3")}
                  className="w-full h-auto cursor-pointer hover:opacity-90 transition-opacity"
                  style={{ borderRadius: '10px' }}
                  role="button" tabIndex={0} aria-haspopup="dialog" onKeyDown={activateImageOnKey} onClick={() => setExpandedImage({ src: mobileApp3, alt: "Mobile App Mockup 3" })}
                />
              </div>
              <div>
                <ImageWithFallback 
                  src={mobileApp4}
                  alt={localize("Mobile App Mockup 4")}
                  className="w-full h-auto cursor-pointer hover:opacity-90 transition-opacity"
                  style={{ borderRadius: '10px' }}
                  role="button" tabIndex={0} aria-haspopup="dialog" onKeyDown={activateImageOnKey} onClick={() => setExpandedImage({ src: mobileApp4, alt: "Mobile App Mockup 4" })}
                />
              </div>
              <div>
                <ImageWithFallback 
                  src={mobileApp5}
                  alt={localize("Mobile App Mockup 5")}
                  className="w-full h-auto cursor-pointer hover:opacity-90 transition-opacity"
                  style={{ borderRadius: '10px' }}
                  role="button" tabIndex={0} aria-haspopup="dialog" onKeyDown={activateImageOnKey} onClick={() => setExpandedImage({ src: mobileApp5, alt: "Mobile App Mockup 5" })}
                />
              </div>
              <div>
                <ImageWithFallback 
                  src={mobileApp6}
                  alt={localize("Mobile App Mockup 6")}
                  className="w-full h-auto cursor-pointer hover:opacity-90 transition-opacity"
                  style={{ borderRadius: '10px' }}
                  role="button" tabIndex={0} aria-haspopup="dialog" onKeyDown={activateImageOnKey} onClick={() => setExpandedImage({ src: mobileApp6, alt: "Mobile App Mockup 6" })}
                />
              </div>
              <div>
                <ImageWithFallback 
                  src={mobileApp7}
                  alt={localize("Mobile App Mockup 7")}
                  className="w-full h-auto cursor-pointer hover:opacity-90 transition-opacity"
                  style={{ borderRadius: '10px' }}
                  role="button" tabIndex={0} aria-haspopup="dialog" onKeyDown={activateImageOnKey} onClick={() => setExpandedImage({ src: mobileApp7, alt: "Mobile App Mockup 7" })}
                />
              </div>
              <div>
                <ImageWithFallback 
                  src={mobileApp8}
                  alt={localize("Mobile App Mockup 8")}
                  className="w-full h-auto cursor-pointer hover:opacity-90 transition-opacity"
                  style={{ borderRadius: '10px' }}
                  role="button" tabIndex={0} aria-haspopup="dialog" onKeyDown={activateImageOnKey} onClick={() => setExpandedImage({ src: mobileApp8, alt: "Mobile App Mockup 8" })}
                />
              </div>
              <div>
                <ImageWithFallback 
                  src={mobileApp9}
                  alt={localize("Mobile App Mockup 9")}
                  className="w-full h-auto cursor-pointer hover:opacity-90 transition-opacity"
                  style={{ borderRadius: '10px' }}
                  role="button" tabIndex={0} aria-haspopup="dialog" onKeyDown={activateImageOnKey} onClick={() => setExpandedImage({ src: mobileApp9, alt: "Mobile App Mockup 9" })}
                />
              </div>
            </div>
          </div>

          {/* 3. Product Entry System UI */}
          <div className="mb-16" id="product-entry-system">
            <h2 className="text-3xl md:text-4xl leading-tight mb-10 bg-gradient-to-r from-[#102F56] to-[#1a4d7a] dark:from-blue-300 dark:to-blue-400 bg-clip-text text-transparent">{localize("3. Product Entry System UI")}</h2>
            <p className="text-lg text-gray-700 dark:text-gray-200 leading-relaxed mb-8">{localize("Besides redesigning Xenith's website, I also participated in creating the user interface for the Product Entry System of Xenith's Production Facility Lab, where thousands of orders need to be processed every day. After conducting a short onsite interview with workers in the lab, I sorted out their requirements and generated a user flow for a typical order processing procedure.")}</p>

            {/* Serial User Flow Chart Image */}
            <div>
              <ImageWithFallback
                src={serialFlowChart}
                alt={localize("Serial User Flow Chart")}
                className="w-full h-auto"
                style={{ borderRadius: '10px' }}
              />
              <p className="text-left text-gray-700 dark:text-white mt-4">{localize("Serial User Flow Chart")}</p>
            </div>

            <p className="text-lg text-gray-700 dark:text-gray-200 leading-relaxed my-8">{localize("Then, I created wireframes of the two main screens in low fidelity, with annotated notes on the side illustrating key functions of each section on the pages.")}</p>

            {/* Wireframe of Product Entry System */}
            <div>
              <ImageWithFallback
                src={wireframeSystem}
                alt={localize("Wireframe of Product Entry System")}
                className="w-full h-auto"
                style={{ borderRadius: '10px' }}
              />
              <p className="text-left text-gray-600 dark:text-white mt-4 text-sm">{localize("Wireframe of Product Entry System")}</p>
            </div>

            <p className="text-lg text-gray-700 dark:text-gray-200 leading-relaxed my-8">{localize("After a few review iterations with my team, I designed and coded the user interface in HTML/CSS/JavaScript, where users can move easily between pages (only two pages are shown, due to confidentiality) by either clicking the 'New Order' button or scanning a barcode.")}</p>

            {/* Two images side by side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <div className="flex flex-col">
                <ImageWithFallback
                  src={newOrderPage}
                  alt={localize("New Order Page (input with barcode scanner)")}
                  className="w-full h-auto"
                  style={{ borderRadius: '10px' }}
                />
                <p className="text-left text-gray-600 dark:text-white mt-4 text-sm">{localize("New Order Page (input with barcode scanner)")}</p>
              </div>
              <div className="flex flex-col">
                <ImageWithFallback
                  src={orderDetailPage}
                  alt={localize("Order Detail Page")}
                  className="w-full h-auto"
                  style={{ borderRadius: '10px' }}
                />
                <p className="text-left text-gray-600 dark:text-white mt-4 text-sm">{localize("Order Detail Page")}</p>
              </div>
            </div>
          </div>

          {/* Final Implementation */}
          <div className="mb-16" id="final-implementation">
            <h2 className="text-3xl md:text-4xl leading-tight mb-10 bg-gradient-to-r from-[#102F56] to-[#1a4d7a] dark:from-blue-300 dark:to-blue-400 bg-clip-text text-transparent">{localize("Reflections")}</h2>

            {/* Subsection: Understand B2C correlation via push & pull model */}
            <div className="mb-8">
              <h3 className="text-2xl mb-6 text-[#102F56] dark:text-gray-100">{localize("/ Understand B2C correlation via push & pull model")}</h3>
              <p className="text-lg text-gray-700 dark:text-gray-200 leading-relaxed mb-8">{localize("The goal was to build a website for EVERYONE, where every type of user could still find the things they want. Based on my prior experience working as a PM, I introduced this model as the overarching guideline throughout my design process, in order to figure out the correlations between:")}</p>

              <div className="space-y-6 text-lg text-gray-700 dark:text-gray-200 leading-relaxed mb-8">
                <p>
                  <span style={{ fontWeight: 'bold' }}>{localize("Visitor:")}</span>{localize(" Who are our new buyers? What makes people visit the site? What do they want to find?")}</p>
                <p>
                  <span style={{ fontWeight: 'bold' }}>{localize("Product:")}</span>{localize(" What are their anxieties about not buying? Why should they buy our product online?")}</p>
                <p>
                  <span style={{ fontWeight: 'bold' }}>{localize("Brand communication:")}</span>{localize(" What are we trying to let buyers know? What are we doing wrong, or not communicating well?")}</p>
              </div>

              {/* Push & Pull Model Image */}
              <div>
                <ImageWithFallback
                  src={pushPullModel}
                  alt={localize("Push & Pull Model")}
                  className="w-full h-auto"
                  style={{ borderRadius: '10px' }}
                />
                <p className="text-left text-gray-700 dark:text-white mt-4">{localize("Push & Pull Model")}</p>
              </div>
            </div>
          </div>

          {/* Impact */}
          <div className="mb-16" id="impact">
            <h2 className="text-3xl md:text-4xl leading-tight mb-10 bg-gradient-to-r from-[#102F56] to-[#1a4d7a] dark:from-blue-300 dark:to-blue-400 bg-clip-text text-transparent">{localize("Feedback")}</h2>

            {/* Testimonial 1 */}
            <div className="mb-10">
              <p className="text-lg text-gray-700 dark:text-gray-200 leading-relaxed mb-4" style={{ fontStyle: 'italic' }}>{localize("\"Mu really did a great job, not just on conducting research and redesign all by himself, but also had a vision to create something new for the future. His work and attitude toward design really impressed me throughout his internship process, we are glad to have him here with us!\"")}</p>
              <p className="text-lg text-gray-700 dark:text-gray-200 text-right">
                — <span style={{ fontWeight: 'bold' }}>{localize("Matt Rea")}</span>{localize(", Head of Digital Strategy Team")}</p>
            </div>

            {/* Testimonial 2 */}
            <div className="mb-10">
              <p className="text-lg text-gray-700 dark:text-gray-200 leading-relaxed mb-4" style={{ fontStyle: 'italic' }}>{localize("\"I really enjoyed working with Mu as his mentor during this summer. His creative talent and keen business insight is always needed in the current job market, let alone his hardworking and positive attitude toward challenges. Good luck!\"")}</p>
              <p className="text-lg text-gray-700 dark:text-gray-200 text-right">
                — <span style={{ fontWeight: 'bold' }}>{localize("Charles Hillard")}</span>{localize(", Design Mentor")}</p>
            </div>
          </div>

          {/* Learnings & Reflections */}
          <div className="mb-16" id="learnings-reflections">
            <h2 className="text-3xl md:text-4xl leading-tight mb-10 bg-gradient-to-r from-[#102F56] to-[#1a4d7a] dark:from-blue-300 dark:to-blue-400 bg-clip-text text-transparent">{localize("Key Takeaways")}</h2>
            <div className="text-lg text-gray-700 dark:text-gray-200 leading-relaxed mb-8">
              <ul className="list-disc pl-6 space-y-4">
                <li>{localize("Discover the real pain points of your clients, and understand users' potential needs through intensive research.")}</li>
                <li>{localize("Beyond design, build strong brand communication and present information clearly within business models.")}</li>
                <li>{localize("Follow design guidelines and utilize styles and patterns that are both hierarchical and consistent.")}</li>
                <li>{localize("Try to think outside the box, focus on the product lifecycle, and create new patterns for future reference!")}</li>
              </ul>
            </div>

            {/* Two images side by side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <ImageWithFallback
                  src={teamPhoto}
                  alt={localize("Photo with my team")}
                  className="w-full h-96 object-cover"
                  style={{ borderRadius: '10px' }}
                />
                <p className="text-left text-gray-600 dark:text-white mt-4 text-sm">{localize("Photo with my team")}</p>
              </div>
              <div>
                <ImageWithFallback
                  src={hustlePhoto}
                  alt={localize("Hustle hard everyday!")}
                  className="w-full h-96 object-cover"
                  style={{ borderRadius: '10px' }}
                />
                <p className="text-left text-gray-600 dark:text-white mt-4 text-sm">{localize("Hustle hard everyday!")}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <ProjectImageLightbox image={expandedImage} onClose={() => setExpandedImage(null)} />

    </main>
  );
}