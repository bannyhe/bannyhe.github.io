import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef, useEffect, useState } from "react";
import { ExternalLink, ChevronUp, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import zovaHeroImg from "../src/assets/76c2215cc22524093e41421390d997280877e1bc.png";
import Slider from "react-slick";
import personaCatherine from "../src/assets/d02bc23caefbe6e953630d8517693be2fd4a353b.png";
import personaTim from "../src/assets/036a2eb9ea15559f4a6a01cf483ffa5e98b52e85.png";
import personaEmma from "../src/assets/3bfed5ee3e9e6a89b96748844eabd099c434ba9c.png";
import conceptImg1 from "../src/assets/a3b9ae3f923b1d63e661f254ec0b288718280e6e.png";
import conceptImg2 from "../src/assets/83058dee26a49e42a17ea43ebbbd4868d7faeddf.png";
import conceptImg3 from "../src/assets/510bae6349bfc630f13e31e5fdb1af792fcdf0a5.png";
import conceptImg4 from "../src/assets/615dd90b70f865604a2f959c5e7a609ef2df4761.png";
import conceptCard1 from "../src/assets/7509086ad035063f971c0624e0104a915083d28e.png";
import conceptCard2 from "../src/assets/5a2b3d1ff83ecaed22a5eb199418e338857f3b6d.png";
import conceptCard3 from "../src/assets/a6baf56103e9ef068975fd98deb94c644f260937.png";
import conceptCard4 from "../src/assets/26909363b43ca217d7f2a5cae888406a8d7cb2f7.png";
import conceptCard5 from "../src/assets/1f9919b56bab4568f944fcbc8f9e2c0287df45c7.png";
import conceptCard6 from "../src/assets/66822a108b887a97350e018ca372d8c1d4b178e3.png";
import conceptCard7 from "../src/assets/7a6116ca4af2cdcea544bc6d40cd71c3b51c6ec6.png";
import riskReturnPlot from "../src/assets/1b37496f99f00c651d0b26aeff0af6b0f1556ef4.png";
import engineeringDrawing from "../src/assets/ed40d34476edf2a33319deef26dabbde45cbd362.png";
import paperPrototype from "../src/assets/abe09fb1c585223ddf18db5dc3070f80af2be4c8.png";
import physicalPrototype from "../src/assets/1e2cd0e3bf77e20593267324f6824fbeb0832e82.png";
import renderingOverview from "../src/assets/bfa01417785fc6933b6af36f23c100ef58f3f0a3.png";
import renderingDetail from "../src/assets/da79cfe6de5675ddf75c14e256f9aaa165d05b60.png";
import websiteHomepage from "../src/assets/edc0d98bfd64246aa7bf6df0898a2ca01b1c443b.png";
import tradeShowVisitors from "../src/assets/048f317b66b1b7ef4b038e9675ed5852b6b09051.png";
import teamPhoto from "../src/assets/14a063b74560efe501f0721d14202ddf4e5013ad.png";

export function ZovaPage() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [expandedImage, setExpandedImage] = useState<{ src: string; alt: string } | null>(null);
  const [activeSection, setActiveSection] = useState<string>("");
  const [showBackToTop, setShowBackToTop] = useState(false);

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
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  const tableOfContents = [
    { id: "brief", label: "Problem Statement" },
    { id: "problem", label: "Design Challenge" },
    { id: "solution-overview", label: "Ethnographic Research" },
    { id: "design-challenge", label: "Concept Generation" },
    { id: "redefine-onboarding", label: "Concept Selection" },
    { id: "approach-strategy", label: "Technical Development" },
    { id: "success-metrics", label: "Product Launch" },
    { id: "key-takeaways", label: "Key Takeaways" }
  ];

  return (
    <main className="pt-20 pb-24">
      {/* Full-width hero image */}
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto py-12">
          <ImageWithFallback
            src={zovaHeroImg}
            alt="Zova - One-Handed Product Design"
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
                <p className="text-lg text-gray-900 dark:text-gray-100">Eddy Cohen, Evie Yang, Mu He, View Jelatianranat, Viswa Raghu</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Methods/Tools</p>
                <p className="text-lg text-gray-900 dark:text-gray-100">Physical Prototyping, 3D Rendering, Conjoint Analysis, Product Thinking, UI design</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">My Role</p>
                <p className="text-lg text-gray-900 dark:text-gray-100">Product Designer</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Duration</p>
                <p className="text-lg text-gray-900 dark:text-gray-100">Sept - Dec 2018</p>
              </div>
            </div>
          </div>

          {/* Video Section */}
          <div className="mb-16">
            <div className="relative w-full" style={{ paddingTop: '56.25%', borderRadius: '10px', overflow: 'hidden' }}>
              <iframe
                src="https://player.vimeo.com/video/302925206"
                className="absolute top-0 left-0 w-full h-full"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                title="Zova Product Design Video"
              ></iframe>
            </div>
          </div>

          {/* Brief */}
          <div className="mb-16" id="brief">
            <h2 className="text-3xl md:text-4xl leading-tight mb-10 bg-gradient-to-r from-[#102F56] to-[#1a4d7a] dark:from-blue-300 dark:to-blue-400 bg-clip-text text-transparent">
              Problem Statement
            </h2>
            <div className="space-y-6 text-lg text-gray-700 dark:text-gray-200 leading-relaxed">
              <p>
                The making and use of tools is a defining cultural feature of the human race. Survival, safety and convenience needs drive design and use of tools in all aspects of life. Quality of life improvements throughout history have come through improvements in tools and devices. A desirable feature in product and tool design is ease of use by people who have only one hand available to perform the desired task. Reasons for having "one hand available" could include temporary or long-term disability, or simply that the other hand is otherwise occupied (i.e. holding a baby).
              </p>
            </div>
          </div>

          {/* Problem */}
          <div className="mb-16" id="problem">
            <h2 className="text-3xl md:text-4xl leading-tight mb-10 bg-gradient-to-r from-[#102F56] to-[#1a4d7a] dark:from-blue-300 dark:to-blue-400 bg-clip-text text-transparent">
              Design Challenge
            </h2>
            <div className="space-y-6 text-lg text-gray-700 dark:text-gray-200 leading-relaxed mb-10">
              <p>
                The given challenge is to design and produce a product or tool to be used with <strong>one hand</strong>, that enables people to <strong>perform routine daily tasks</strong> that otherwise would require two hands. More specifically, the product should satisfy the following characteristics:
              </p>
              <ul className="list-disc pl-6 space-y-3">
                <li>
                  <strong>Performance:</strong> Match the quality, speed and ease of task performance using a standard two-handed method.
                </li>
                <li>
                  <strong>Target demographic:</strong> People for whom some routine bi-lateral task (requiring two hands) is inconvenient, irritating, difficult or impossible.
                </li>
                <li>
                  <strong>Target retail price:</strong> No more than $200.
                </li>
                <li>
                  <strong>Manufacturability:</strong> Major touch surfaces fabricated by the team + Purchased components
                </li>
              </ul>
            </div>
          </div>

          {/* Solution Overview */}
          <div className="mb-16" id="solution-overview">
            <h2 className="text-3xl md:text-4xl leading-tight mb-10 bg-gradient-to-r from-[#102F56] to-[#1a4d7a] dark:from-blue-300 dark:to-blue-400 bg-clip-text text-transparent">
              Ethnographic Research
            </h2>
            <div className="space-y-6 text-lg text-gray-700 dark:text-gray-200 leading-relaxed mb-10">
              <p>
                According to Scientific America, roughly <strong>70-95%</strong> of the US population is <strong>right-handed</strong>, since skills differ greatly between the right and left hand, injury to dominant hand may vastly affect the quality of daily task performance. Moreover, switching to use of non-dominant hand can take a few months to become skilled enough to perform daily tasks.
              </p>
              <p>
                Moreover, apart from making phone calls or texting messages, nearly <strong>half</strong> of users have <strong>one free hand</strong> while using their smartphones.
              </p>
              <p>
                After that, we chose 5 target audiences to conduct user interviews, which include people who are injured, disabled, babysitters, and housewives. We synthesized all interview transcript into findings, then transformed into three relevant <strong>personas</strong>:
              </p>
            </div>

            {/* Persona Carousel */}
            <div className="mt-10 persona-carousel">
              <Slider
                dots={true}
                infinite={true}
                speed={500}
                slidesToShow={1}
                slidesToScroll={1}
                arrows={true}
                adaptiveHeight={true}
              >
                <div>
                  <img
                    src={personaCatherine}
                    alt="Catherine Persona"
                    className="w-full h-auto"
                    style={{ borderRadius: '10px' }}
                  />
                </div>
                <div>
                  <img
                    src={personaTim}
                    alt="Tim Persona"
                    className="w-full h-auto"
                    style={{ borderRadius: '10px' }}
                  />
                </div>
                <div>
                  <img
                    src={personaEmma}
                    alt="Emma Persona"
                    className="w-full h-auto"
                    style={{ borderRadius: '10px' }}
                  />
                </div>
              </Slider>
            </div>
          </div>

          {/* Design Challenge */}
          <div className="mb-16" id="design-challenge">
            <h2 className="text-3xl md:text-4xl leading-tight mb-10 bg-gradient-to-r from-[#102F56] to-[#1a4d7a] dark:from-blue-300 dark:to-blue-400 bg-clip-text text-transparent">
              Concept Generation
            </h2>
            <div className="space-y-6 text-lg text-gray-700 dark:text-gray-200 leading-relaxed mb-10">
              <p>
                In order to simulate one hand, we performed <strong>empathy testing</strong>, our team came up with over 20 ideas, and categorized them into 4 key design concepts. We then sketch out those 5 different product ideas with basic features and benefits that spanned across the 3 essential needs we identified during previous research.
              </p>
            </div>
            
            {/* Concept Images in 2x2 Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <img
                  src={conceptImg1}
                  alt="Concept 1: Keep objects where we want them"
                  className="w-full h-auto"
                  style={{ borderRadius: '10px' }}
                />
              </div>
              <div>
                <img
                  src={conceptImg2}
                  alt="Concept 2: Allow hand to do more"
                  className="w-full h-auto"
                  style={{ borderRadius: '10px' }}
                />
              </div>
              <div>
                <img
                  src={conceptImg3}
                  alt="Concept 3: Keep our hand safe"
                  className="w-full h-auto"
                  style={{ borderRadius: '10px' }}
                />
              </div>
              <div>
                <img
                  src={conceptImg4}
                  alt="Concept 4"
                  className="w-full h-auto"
                  style={{ borderRadius: '10px' }}
                />
              </div>
            </div>
          </div>

          {/* Design Approach */}
          <div className="mb-16" id="redefine-onboarding">
            <h2 className="text-3xl md:text-4xl leading-tight mb-10 bg-gradient-to-r from-[#102F56] to-[#1a4d7a] dark:from-blue-300 dark:to-blue-400 bg-clip-text text-transparent">
              Concept Selection
            </h2>
            <div className="space-y-6 text-lg text-gray-700 dark:text-gray-200 leading-relaxed mb-8">
              <p>
                In order to test our ideas with customers, we sent out surveys with seven concept cards to 50 target users, which includes five original concepts and two competitor products in the market. Each concept card introduced basic features, functions, and how it works along with concept sketches. Users were asked to rate their willingness and likelihood to buy the product, and provide the reason behind their decisions.
              </p>
            </div>
            
            {/* Concept Cards Carousel */}
            <div className="mt-10 concept-cards-carousel">
              <Slider
                dots={true}
                infinite={true}
                speed={500}
                slidesToShow={1}
                slidesToScroll={1}
                arrows={true}
                adaptiveHeight={true}
              >
                <div>
                  <img
                    src={conceptCard1}
                    alt="Concept Card 1"
                    className="w-full h-auto"
                    style={{ borderRadius: '10px' }}
                  />
                </div>
                <div>
                  <img
                    src={conceptCard2}
                    alt="Concept Card 2"
                    className="w-full h-auto"
                    style={{ borderRadius: '10px' }}
                  />
                </div>
                <div>
                  <img
                    src={conceptCard3}
                    alt="Concept Card 3"
                    className="w-full h-auto"
                    style={{ borderRadius: '10px' }}
                  />
                </div>
                <div>
                  <img
                    src={conceptCard4}
                    alt="Concept Card 4"
                    className="w-full h-auto"
                    style={{ borderRadius: '10px' }}
                  />
                </div>
                <div>
                  <img
                    src={conceptCard5}
                    alt="Concept Card 5"
                    className="w-full h-auto"
                    style={{ borderRadius: '10px' }}
                  />
                </div>
                <div>
                  <img
                    src={conceptCard6}
                    alt="Concept Card 6"
                    className="w-full h-auto"
                    style={{ borderRadius: '10px' }}
                  />
                </div>
                <div>
                  <img
                    src={conceptCard7}
                    alt="Concept Card 7"
                    className="w-full h-auto"
                    style={{ borderRadius: '10px' }}
                  />
                </div>
              </Slider>
            </div>
            
            {/* Concept Selection Results */}
            <div className="space-y-6 text-lg text-gray-700 dark:text-gray-200 leading-relaxed mt-10">
              <p>
                Based on results we received from the 50 surveys, the <strong>Bed Hook/Sheet</strong> and <strong>2-in-1 Package Opener</strong> were the top two concepts that were most widely preferred among all participants.
              </p>
              <p>
                A scoring model of risk-return plot was created to estimate the expected value of our product concepts. The five original concepts were rated by our team base on their probability of technical/marketing success. Hence, a risk-return plot was generated to provide an alternative reference for concept selection.
              </p>
            </div>
            <div className="mt-8">
              <ImageWithFallback
                src={riskReturnPlot}
                alt="Risk-Return Plot"
                className="w-full h-auto"
                style={{ borderRadius: '10px' }}
              />
              <p className="text-gray-700 dark:text-gray-200 mt-4">*Bubble size indicates likeliness to buy, rating out of 5</p>
            </div>
            
            {/* Final Concept Decision */}
            <div className="space-y-6 text-lg text-gray-700 dark:text-gray-200 leading-relaxed mt-10">
              <p>
                Although the 2-in-1 package opener is a popular idea to work through, due to the limitation of technology and material, we turned into the other idea, which is a more realistic choice. Above all, results of research and analysis showed that the <strong>Bed Hook/Sheet</strong> was a valuable idea to explore upon. Thus, we decided to face the challenge and moved on to the product prototyping stage.
              </p>
            </div>
          </div>

          {/* Design Principles */}
          <div className="mb-16" id="approach-strategy">
            <h2 className="text-3xl md:text-4xl leading-tight mb-10 bg-gradient-to-r from-[#102F56] to-[#1a4d7a] dark:from-blue-300 dark:to-blue-400 bg-clip-text text-transparent">
              Technical Development
            </h2>
            
            {/* Engineering Drawing Subsection */}
            <div className="mb-10">
              <h3 className="text-2xl leading-tight mb-6 text-gray-900 dark:text-gray-100">
                /Engineering Drawing
              </h3>
              <div className="space-y-6 text-lg text-gray-700 dark:text-gray-200 leading-relaxed">
                <p>
                  Since the full-size bed is the most popular among university students, we decide to build a bedsheet that can fit mattress in all thickness. In order to provide a fully detailed requirements of the product's size and shape, we created the engineering drawing in CAD, which marked out each part of product in the expanded view.
                </p>
              </div>
            </div>
            
            <div className="mt-8">
              <div className="bg-white dark:bg-white p-6 md:p-8" style={{ borderRadius: '10px' }}>
                <ImageWithFallback
                  src={engineeringDrawing}
                  alt="Engineering Drawing"
                  className="w-full h-auto"
                  style={{ borderRadius: '10px' }}
                />
              </div>
            </div>
            
            {/* Prototype Iterations Subsection */}
            <div className="mt-16">
              <h3 className="text-2xl leading-tight mb-6 text-gray-900 dark:text-gray-100">
                /Prototype Iterations
              </h3>
              <div className="space-y-6 text-lg text-gray-700 dark:text-gray-200 leading-relaxed">
                <p>
                  As the traditional ways of bed making has lots of pain points, such as trouble-making tight fitted sheets. Inspired by the traditional origami art, we applied the same method to fold and fix the sheet to the bed. During experiments in design studio, we suddenly came out an idea of adding both velcro and sewing technology to fix the bedsheet with one hand in three simple steps.
                </p>
              </div>
              
              {/* Prototype Images */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <ImageWithFallback
                    src={paperPrototype}
                    alt="Paper prototype in design studio"
                    className="w-full h-auto"
                    style={{ borderRadius: '10px' }}
                  />
                  <p className="text-gray-700 dark:text-gray-200 mt-4">Paper prototype in design studio</p>
                </div>
                
                <div>
                  <ImageWithFallback
                    src={physicalPrototype}
                    alt="Physical prototype with velcro and sewing stitches"
                    className="w-full h-auto"
                    style={{ borderRadius: '10px' }}
                  />
                  <p className="text-gray-700 dark:text-gray-200 mt-4">Physical prototype with velcro and sewing stitches</p>
                </div>
              </div>
            </div>
            
            {/* 3D Renderings Subsection */}
            <div className="mt-16">
              <h3 className="text-2xl leading-tight mb-6 text-gray-900 dark:text-gray-100">
                /3D Renderings
              </h3>
              <div className="space-y-6 text-lg text-gray-700 dark:text-gray-200 leading-relaxed">
                <p>
                  In order to provide a more intuitive view on the product, we created 3D renderings in Rhino, showing possible color and texture of the bedsheet, and highlight the key part of velcro and stitches to audiences.
                </p>
              </div>
              
              {/* 3D Rendering Images */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <ImageWithFallback
                    src={renderingOverview}
                    alt="Rendering Overview"
                    className="w-full h-auto"
                    style={{ borderRadius: '10px' }}
                  />
                  <p className="text-gray-700 dark:text-gray-200 mt-4">Rendering Overview</p>
                </div>
                
                <div>
                  <ImageWithFallback
                    src={renderingDetail}
                    alt="Detailed scope of velcro"
                    className="w-full h-auto"
                    style={{ borderRadius: '10px' }}
                  />
                  <p className="text-gray-700 dark:text-gray-200 mt-4">Detailed scope of velcro</p>
                </div>
              </div>
            </div>
            
            {/* Conjoint Analysis Subsection */}
            <div className="mt-16">
              <h3 className="text-2xl leading-tight mb-6 text-gray-900 dark:text-gray-100">
                /Conjoint Analysis
              </h3>
              <div className="space-y-6 text-lg text-gray-700 dark:text-gray-200 leading-relaxed">
                <p>
                  In order to better understand how people value different attributes that make up our product, we created survey testing preferences from the customers. In the survey, we presented a brief overview of our product, the Weight Balance Bar, and presented four key attributes, including <strong>price</strong> ($50, $100, and $150), <strong>technology</strong> (low-tech and high-tech), <strong>material</strong> (plastic, aluminum, and carbon fiber) and <strong>weight</strong> (light-weight, medium-weight). A total of 30 respondents were asked to rank 14 combinations with mixed attributes from most preferred (#1) to least preferred (#14).
                </p>
              </div>
            </div>
          </div>

          {/* Success Metrics */}
          <div className="mb-16" id="success-metrics">
            <h2 className="text-3xl md:text-4xl leading-tight mb-10 bg-gradient-to-r from-[#102F56] to-[#1a4d7a] dark:from-blue-300 dark:to-blue-400 bg-clip-text text-transparent">
              Product Launch
            </h2>
            
            {/* Costing and Pricing Subsection */}
            <div className="mb-10">
              <h3 className="text-2xl leading-tight mb-6 text-gray-900 dark:text-gray-100">
                /Costing and Pricing
              </h3>
              <div className="space-y-6 text-lg text-gray-700 dark:text-gray-200 leading-relaxed">
                <p>
                  Based on the pricing model we built and previous marketing research, we merged the raw material costs, assembling costs, and processing costs, then generated the final product cost. By implementing profit model, we were able to acquire optimal price at $28.4, and we finally set the sale price at $29 per unit.
                </p>
              </div>
            </div>
            
            {/* Marketing and Branding Subsection */}
            <div className="mt-16">
              <h3 className="text-2xl leading-tight mb-6 text-gray-900 dark:text-gray-100">
                /Marketing and Branding
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <div className="space-y-6 text-lg text-gray-700 dark:text-gray-200 leading-relaxed">
                  <p>
                    To set the stage for our Trade Show, we reached out to professionals in senior health and to those who took part in our prior research studies, introducing Zova to them. In order to promote our brand and product to a wider range of online customers, we designed our product logo, promotion video, and{' '}
                    <a
                      href="https://bannyhe.wixsite.com/zova"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-[#6DB2FF] hover:underline"
                    >
                      product website
                    </a>.
                  </p>
                </div>
                
                <div>
                  <ImageWithFallback
                    src={websiteHomepage}
                    alt="Homepage of product website"
                    className="w-full h-auto"
                    style={{ borderRadius: '10px' }}
                  />
                  <p className="text-gray-700 dark:text-gray-200 mt-4">Homepage of product website</p>
                </div>
              </div>
            </div>
            
            {/* Online & Physical Trade Show Subsection */}
            <div className="mt-16">
              <h3 className="text-2xl leading-tight mb-6 text-gray-900 dark:text-gray-100">
                /Online & Physical Trade Show
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <div className="space-y-6 text-lg text-gray-700 dark:text-gray-200 leading-relaxed">
                  <p>
                    The Trade Show were consisted of two parts, where all seven teams get to test our products with real-world customers. Each customer/voter had up to $120 to spend on all products. With all of our effort, the Trade Show was a blast! Although we underestimated the number of voters coming in and we sold out pretty quickly, Zova has earned the best reputations among all products trade shows, with <strong>No.1</strong> in both <strong>net profit</strong> and <strong>overall net profit</strong>!
                  </p>
                </div>
                
                <div>
                  <ImageWithFallback
                    src={tradeShowVisitors}
                    alt="Introducing product to visitors"
                    className="w-full h-auto"
                    style={{ borderRadius: '10px' }}
                  />
                  <p className="text-gray-700 dark:text-gray-200 mt-4">Introducing product to visitors</p>
                </div>
              </div>
            </div>
          </div>

          {/* Key Takeaways */}
          <div className="mb-16" id="key-takeaways">
            <h2 className="text-3xl md:text-4xl leading-tight mb-10 bg-gradient-to-r from-[#102F56] to-[#1a4d7a] dark:from-blue-300 dark:to-blue-400 bg-clip-text text-transparent">
              Key Takeaways
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <div className="space-y-6 text-lg text-gray-700 dark:text-gray-200 leading-relaxed">
                <p>
                  This project fully simulated the real environment of market and industry, which allows us to collaborate <strong>cross-functionally</strong>, and elevated my design thinking <strong>from UX to product design</strong>, which requires multiple areas of design, marketing, engineering, and product. The process of developing Zova not only brings good memory of working with people in different academic background, but also teaches me how to deal with disagreements effectively. Besides, knowing ways of making useful <strong>trade-offs</strong>, and tell stories from users' perspective is a great lesson learned.
                </p>
              </div>
              
              <div>
                <ImageWithFallback
                  src={teamPhoto}
                  alt="Zova Team"
                  className="w-full h-auto"
                  style={{ borderRadius: '10px' }}
                />
              </div>
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