import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef, useEffect, useState } from "react";
import { ExternalLink, ChevronUp, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import bianzhongHeroImg from "../src/assets/289adad162b4e9b52a8e69cba03ecf1fd54415c3.png";
import bianzhongBellsImg from "../src/assets/940628ad8fd16611451df4bdfd2002d78ffc09f7.png";
import hubeiMuseumImg from "../src/assets/821599e4b66a35b3ff4427c0c2fd65ccce835588.png";
import storyboardImg from "../src/assets/fd323ac7f911d18fe2ae365eed00a0c2f01985d8.png";
import arduinoImg from "../src/assets/8a7002f2893fab6d5ae92531a718bed4ae76e43d.png";
import brochureImg from "../src/assets/6169263a4c63400d034c7cfcbe6c3eeb2fbede47.png";
import prototypeBeforeImg from "../src/assets/2232bdd32a92d50eba1224d9e17794174161ec63.png";
import prototypeAfterImg from "../src/assets/543ba511edfb2be5e0a689395962df315fc68efc.png";
import finalDemoImg from "../src/assets/4cf1d33cbc564601b76889e885e172a783dc462a.png";

export function BianzhongPage() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [expandedImage, setExpandedImage] = useState<{ src: string; alt: string } | null>(null);
  const [activeSection, setActiveSection] = useState<string>("");
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const carouselSlides = [
    { src: "https://via.placeholder.com/1200x800/6B7280/FFFFFF?text=Slide+1", label: "Placeholder Slide 1" },
    { src: "https://via.placeholder.com/1200x800/6B7280/FFFFFF?text=Slide+2", label: "Placeholder Slide 2" },
    { src: "https://via.placeholder.com/1200x800/6B7280/FFFFFF?text=Slide+3", label: "Placeholder Slide 3" },
    { src: "https://via.placeholder.com/1200x800/6B7280/FFFFFF?text=Slide+4", label: "Placeholder Slide 4" },
    { src: "https://via.placeholder.com/1200x800/6B7280/FFFFFF?text=Slide+5", label: "Placeholder Slide 5" }
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
    { id: "brief", label: "Project Brief" },
    { id: "problem", label: "The Challenge" },
    { id: "solution-overview", label: "Solution Highlight" },
    { id: "design-challenge", label: "Target User & Pain Point" },
    { id: "redefine-onboarding", label: "Design Approach" },
    { id: "approach-strategy", label: "Design Principles" },
    { id: "success-metrics", label: "Success Metrics" },
    { id: "optimizing-workflow", label: "Design Process" },
    { id: "transitional-pages", label: "Key Features" },
    { id: "impact", label: "Impact" },
    { id: "learnings-reflections", label: "Learnings & Reflections" }
  ];

  return (
    <main className="pt-20 pb-24">
      {/* Full-width hero image */}
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto py-12">
          <ImageWithFallback
            src={bianzhongHeroImg}
            alt="Bianzhong - Future Museum Experience"
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
                <p className="text-lg text-gray-900 dark:text-gray-100">Meng Yuan, Mu He</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Methods/Tools</p>
                <p className="text-lg text-gray-900 dark:text-gray-100">Arduino, Visual Design</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">My Role</p>
                <p className="text-lg text-gray-900 dark:text-gray-100">Experience Designer, User Researcher</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Duration</p>
                <p className="text-lg text-gray-900 dark:text-gray-100">Sept - Dec 2018</p>
              </div>
            </div>
          </div>

          {/* Brief */}
          <div className="mb-16" id="brief">
            <h2 className="text-3xl md:text-4xl leading-tight mb-10 bg-gradient-to-r from-[#102F56] to-[#1a4d7a] dark:from-blue-300 dark:to-blue-400 bg-clip-text text-transparent">
              Problem Statement
            </h2>
            <div className="space-y-6 text-lg text-gray-700 dark:text-gray-200 leading-relaxed">
              <p>
                For the museum exhibit project this semester, we decided to design an exhibition that display an ancient Chinese musical instrument. In many cultures around the world, music and instrument plays an essential role in societal, political and economic development, they symbolize historical progress and human wisdom during a particular period of time. However, most museum exhibition only displays artifacts <strong>behind the showcase</strong>, with <strong>lengthy contextual description</strong>, which is not only <strong>lack of interaction</strong>, but also <strong>difficult for visitors to draw connection</strong> between the artifact and the corresponding historical event. Thus, we decide to design an interactive user experience in the museum exhibition, combining the artifact with video, visual elements, which provides visitors with an unique experience to interact with the virtual instrument, be immersed into the exhibition, and take away personalized souvenirs.
              </p>
            </div>
          </div>

          {/* Problem */}
          <div className="mb-16" id="problem">
            <h2 className="text-3xl md:text-4xl leading-tight mb-10 bg-gradient-to-r from-[#102F56] to-[#1a4d7a] dark:from-blue-300 dark:to-blue-400 bg-clip-text text-transparent">
              About Bianzhong
            </h2>
            <div className="space-y-6 text-lg text-gray-700 dark:text-gray-200 leading-relaxed mb-10">
              <p>
                Though there are lots of great traditional Chinese instrument to be introduced to the world, we decide to choose Bianzhong (ancient Chinese chime bell) as our major exhibit, because it is a well-known envoy of Chinese culture, with a perfect combination of technology, science and music.
              </p>
              <p>
                Since its excavation in 1978, Bianzhong is under prior protection and currently on-display in Hubei Provincial Museum in Wuhan, China. As a national treasure, it has only been played 3 times since it was unearthed, the last time it was played is on the ceremony of Hong Kong Reunification in 1997. Thus, a great majority of visitors don't get a chance to play the instrument or learn about the history behind it effectively through interaction.
              </p>
            </div>
            <div className="mt-8">
              <ImageWithFallback
                src={bianzhongBellsImg}
                alt="Bianzhong of Marquis Yi of Zeng"
                className="w-full h-auto"
                style={{ borderRadius: '10px' }}
              />
              <p className="text-center text-gray-700 dark:text-gray-200 mt-4">Bianzhong of Marquis Yi of Zeng (a set of 65 bronze bells)</p>
            </div>
          </div>

          {/* Solution Overview */}
          <div className="mb-16" id="solution-overview">
            <h2 className="text-3xl md:text-4xl leading-tight mb-10 bg-gradient-to-r from-[#102F56] to-[#1a4d7a] dark:from-blue-300 dark:to-blue-400 bg-clip-text text-transparent">
              Why Bianzhong
            </h2>
            <div className="space-y-6 text-lg text-gray-700 dark:text-gray-200 leading-relaxed">
              <p>
                The Bianzhong a perfect exhibit because it is relatively <strong>easy to learn</strong> how to play (strike with hammer), and the sound lasts long enough so that visitors have adequate time to <strong>adapt</strong> and find the right position to strike. Hence, we have got an inspiration from GarageBand in App Store China, which supports many traditional Chinese instruments like Erhu, Pipa, Guzheng, and we would like to build a similar interaction tool for worldwide visitors and music lovers, to play with the Bianzhong virtually.
              </p>
            </div>
          </div>

          {/* Design Challenge */}
          <div className="mb-16" id="design-challenge">
            <h2 className="text-3xl md:text-4xl leading-tight mb-10 bg-gradient-to-r from-[#102F56] to-[#1a4d7a] dark:from-blue-300 dark:to-blue-400 bg-clip-text text-transparent">
              Museum & Audience
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <div className="space-y-6 text-lg text-gray-700 dark:text-gray-200 leading-relaxed">
                <p>
                  We plan to held the exhibition at Hubei Provincial Museum, where exhibits and artifacts is the largest in both quantity and category in China.
                </p>
                <p>
                  The exhibition opens to all people who are interested in ancient Chinese culture and musical instrument. It doesn't require visitors to have any prior background knowledge about this topic. The interaction methods will help each visitor to learn about different aspect of the Bianzhong, as well as the history and culture it resembles.
                </p>
              </div>
              <div>
                <ImageWithFallback
                  src={hubeiMuseumImg}
                  alt="Hubei Provincial Museum"
                  className="w-full h-auto"
                  style={{ borderRadius: '10px' }}
                />
                <p className="text-center text-gray-700 dark:text-gray-200 mt-4">Hubei Provincial Museum (Wuhan, China)</p>
              </div>
            </div>
          </div>

          {/* Redefine Onboarding */}
          <div className="mb-16" id="redefine-onboarding">
            <h2 className="text-3xl md:text-4xl leading-tight mb-10 bg-gradient-to-r from-[#102F56] to-[#1a4d7a] dark:from-blue-300 dark:to-blue-400 bg-clip-text text-transparent">
              User Interview
            </h2>
            <div className="space-y-6 text-lg text-gray-700 dark:text-gray-200 leading-relaxed mb-8">
              <p>
                In order to understand our audiences and find out the current pain points in the museum experience, we interviewed 4 people who have been to the Hubei Provincial Museum. The interviewees are our relatives or friends who we know have such experience. The key findings are summarized below:
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6">
              <div className="flex gap-3">
                <div className="text-2xl text-blue-600">|</div>
                <p className="text-lg text-gray-700 dark:text-gray-200 italic leading-relaxed">
                  "The atmosphere is solemn which is appropriate for the history exhibition, but it is also a little bit too serious."
                </p>
              </div>
              <div className="flex gap-3">
                <div className="text-2xl text-blue-600">|</div>
                <p className="text-lg text-gray-700 dark:text-gray-200 italic leading-relaxed">
                  "There is almost no participation of visitors in the exhibitions. Visitor can only look at the exhibits or take photos."
                </p>
              </div>
              <div className="flex gap-3">
                <div className="text-2xl text-blue-600">|</div>
                <p className="text-lg text-gray-700 dark:text-gray-200 italic leading-relaxed">
                  "There are too many exhibits displayed for visitors to remember the artifacts as well as their stories after the exhibition."
                </p>
              </div>
            </div>
          </div>

          {/* Design Principles */}
          <div className="mb-16" id="approach-strategy">
            <h2 className="text-3xl md:text-4xl leading-tight mb-10 bg-gradient-to-r from-[#102F56] to-[#1a4d7a] dark:from-blue-300 dark:to-blue-400 bg-clip-text text-transparent">
              Storyboard
            </h2>
            <div className="space-y-6 text-lg text-gray-700 dark:text-gray-200 leading-relaxed mb-10">
              <p>
                The installation shown in the image below enables visitors to simulate playing the Bianzhong and create their own songs with its original sound. And they will receive QR codes which recorded their songs and take home the printed QR codes with brochures. The exhibition installation will be consist of three parts: an instrument model that visitors can play, a computer which processes the inputs, plays the sound, generates QR code and a brochure visitors can take away.
              </p>
            </div>
            <div className="mt-8">
              <ImageWithFallback
                src={storyboardImg}
                alt="Bianzhong Exhibition Storyboard"
                className="w-full h-auto"
                style={{ borderRadius: '10px' }}
              />
            </div>
          </div>

          {/* Success Metrics */}
          <div className="mb-16" id="success-metrics">
            <h2 className="text-3xl md:text-4xl leading-tight mb-10 bg-gradient-to-r from-[#102F56] to-[#1a4d7a] dark:from-blue-300 dark:to-blue-400 bg-clip-text text-transparent">
              Arduino+Processing
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <div className="space-y-6 text-lg text-gray-700 dark:text-gray-200 leading-relaxed">
                <p>
                  The computer will run a code snippet in Arduino, and handle the input and play the matching sound of Bianzhong with Processing. For each visitor, the computer will record the audio and store the audio in a new generated QR code.
                </p>
                <p>
                  The interactive exhibition we planned to create was actually a system consisting of inputs and outputs. In our research, we found that the combination of Arduino+Processing is widely used in interactive installations. It is one way that we can prototype our exhibition project.
                </p>
              </div>
              <div>
                <ImageWithFallback
                  src={arduinoImg}
                  alt="Arduino+Processing Prototype Setup"
                  className="w-full h-auto"
                  style={{ borderRadius: '10px' }}
                />
              </div>
            </div>
          </div>

          {/* Optimizing Workflow */}
          <div className="mb-16" id="optimizing-workflow">
            <h2 className="text-3xl md:text-4xl leading-tight mb-10 bg-gradient-to-r from-[#102F56] to-[#1a4d7a] dark:from-blue-300 dark:to-blue-400 bg-clip-text text-transparent">
              Final Video
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <div className="space-y-6 text-lg text-gray-700 dark:text-gray-200 leading-relaxed">
                <p>
                  Base on the video script we drafted, our final video includes three main parts. The first part is about Bianzhong's manufacturing process, basic specs, musical features. Then, a natural transition will be made between introductions and its performance scene in both ancient and modern time, as well as its important role played in national events and culture exchanges. Last but not the least, a short demo will be shown of how our prototype will work in the exhibition.
                </p>
              </div>
              <div>
                <div className="relative w-full" style={{ paddingTop: '56.25%', borderRadius: '10px', overflow: 'hidden' }}>
                  <iframe
                    src="https://player.vimeo.com/video/304284532"
                    className="absolute top-0 left-0 w-full h-full"
                    frameBorder="0"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                    title="Bianzhong Final Video"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>

          {/* Transitional Pages */}
          <div className="mb-16" id="transitional-pages">
            <h2 className="text-3xl md:text-4xl leading-tight mb-10 bg-gradient-to-r from-[#102F56] to-[#1a4d7a] dark:from-blue-300 dark:to-blue-400 bg-clip-text text-transparent">
              Brochure
            </h2>
            <div className="space-y-6 text-lg text-gray-700 dark:text-gray-200 leading-relaxed mb-10">
              <p>
                On the brochure, introductions are provided about the Bianzhong as well as Chinese ancient musical history and culture. There is also a blank space left for the QR code which records the audio a visitor has created. Once the visitor just played a part of music, it will be automatically be saved and printed out, leaving out a blank space at the top of the middle page. In this way, the brochure becomes unique for each visitor, which can be taken home as a souvenir, and play back the sound track of Bianzhong by extracting the QR code at anytime, in anywhere.
              </p>
            </div>
            <div className="mt-8">
              <ImageWithFallback
                src={brochureImg}
                alt="Tri-fold Brochure Designed for Bianzhong Exhibition"
                className="w-full h-auto"
                style={{ borderRadius: '10px' }}
              />
              <p className="text-center text-gray-700 dark:text-gray-200 mt-4">Tri-fold Brochure Designed for Bianzhong Exhibition</p>
            </div>
          </div>

          {/* Impact */}
          <div className="mb-16" id="impact">
            <h2 className="text-3xl md:text-4xl leading-tight mb-10 bg-gradient-to-r from-[#102F56] to-[#1a4d7a] dark:from-blue-300 dark:to-blue-400 bg-clip-text text-transparent">
              Final Prototype
            </h2>
            <div className="space-y-6 text-lg text-gray-700 dark:text-gray-200 leading-relaxed mb-10">
              <p>
                As for the model, we decide to make a paper cardboard Bianzhong(shown in image at the bottom left). We select an image of partial Bianzhong, which is shown on paper and screen. We connected force sensor with wires connecting to the Arduino Uno Controller Board at one end, and sticked to the back of corresponding bell. In this way, once user presses a particular bell to play a tone, the position being pressed will be highlighted on the screen, and the sound will played(shown in image at the bottom right).
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <div>
                <ImageWithFallback
                  src={prototypeBeforeImg}
                  alt="Prototype Before"
                  className="w-full h-auto"
                  style={{ borderRadius: '10px' }}
                />
                <p className="text-center text-gray-700 dark:text-gray-200 mt-4">Before tapping on the virtual Bianzhong</p>
              </div>
              <div>
                <ImageWithFallback
                  src={prototypeAfterImg}
                  alt="Prototype After"
                  className="w-full h-auto"
                  style={{ borderRadius: '10px' }}
                />
                <p className="text-center text-gray-700 dark:text-gray-200 mt-4">After tapping on the virtual Bianzhong</p>
              </div>
            </div>
          </div>

          {/* Final Demo Image */}
          <div className="mb-16">
            <div className="mt-8">
              <ImageWithFallback
                src={finalDemoImg}
                alt="Demo of Final Interaction in Bianzhong Museum Exhibition"
                className="w-full h-auto"
                style={{ borderRadius: '10px' }}
              />
              <p className="text-center text-gray-700 dark:text-gray-200 mt-4">Demo of Final Interaction in Bianzhong Museum Exhibition</p>
            </div>
          </div>

          {/* Learnings & Reflections */}
          <div className="mb-16" id="learnings-reflections">
            <h2 className="text-3xl md:text-4xl leading-tight mb-10 bg-gradient-to-r from-[#102F56] to-[#1a4d7a] dark:from-blue-300 dark:to-blue-400 bg-clip-text text-transparent">
              Reflection & Takeaways
            </h2>
            <div className="text-lg text-gray-700 dark:text-gray-200 leading-relaxed">
              <p>
                The final design workbook can be accessed at{' '}
                <a
                  href="https://docs.google.com/document/d/1RsPg5Ny6LsJanAyJXeiuomC5uXrJqqM9Q-Iw95Og0iw/edit?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-[#6DB2FF] hover:underline"
                >
                  this link
                </a>
                .
              </p>
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