import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef } from "react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
const profileImage = "https://drive.google.com/thumbnail?id=1WezjaXsNQviYAOYTLuDC9S_Ydp35tlsV&sz=w1920";

export function AboutPage() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <main className="pt-32 pb-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto"
        >
          {/* Hero Section */}
          <div className="mb-12">
            <h1 className="text-5xl md:text-6xl mb-6 bg-gradient-to-r from-[#102F56] to-[#1a4d7a] dark:from-blue-300 dark:to-blue-400 bg-clip-text text-transparent text-center">
              About Me
            </h1>
          </div>

          {/* Profile Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
            <img
              src={profileImage}
              alt="Mu He - Product Designer"
              className="w-full h-auto object-cover rounded-[10px]"
              style={{ aspectRatio: '24/9', objectPosition: 'center 15%' }}
            />
          </motion.div>

          {/* Content Section */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.6 }}
          >
            <div className="space-y-6 text-lg text-gray-700 dark:text-gray-200">
              <p>
                Mu is an aspiring product designer with 6+ years of experience, shaping the cutting-edge experience for B2B SaaS Networking & Security solutions at VMware LLC by Broadcom. Mu's design solutions have earned Gold Prize in the{" "}
                <a 
                  href="https://cybersecurity-excellence-awards.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-indigo-600 dark:text-indigo-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors underline"
                >
                  Cybersecurity Excellence Awards
                </a>.
              </p>
              
              <p>
                As a creative and rigorous designer with a diverse background in both enterprise and customer-facing products, Mu's design philosophy emphasizes thinking outside the box and crafting user experiences from a panoramic view, while exploring potential consumer needs through iterative research and simulation, shaping user-centered experiences with empathy and innovation.
              </p>
              
              <p>
                Beyond his professional work, Mu is passionate about cooking, traveling, and photography. As the record-holder of 100-meter dash, and the starting power-forward of the men's basketball team back in college, Mu is passionate about pushing the boundaries through workout and challenges.
              </p>

              <p>
                For collaboration opportunities in design or inquiries, feel free to reach out to Mu at{" "}
                <a 
                  href="mailto:bannyhe@umich.edu"
                  className="text-indigo-600 dark:text-indigo-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors underline"
                >
                  bannyhe@umich.edu
                </a>!
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}