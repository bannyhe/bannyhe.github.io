import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef } from "react";

export function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section id="about" className="py-24 relative">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="backdrop-blur-2xl bg-white/40 border border-white/20 rounded-3xl p-12 shadow-2xl">
            <h2 className="text-4xl md:text-5xl mb-8 text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              About Me
            </h2>
            
            <div className="space-y-6 text-lg text-gray-700">
              <p>
                Hello! I'm a passionate developer and designer with a love for
                creating beautiful, functional web experiences. With several years
                of experience in the industry, I've worked on projects ranging
                from small business websites to large-scale web applications.
              </p>
              
              <p>
                My approach combines technical expertise with creative thinking.
                I believe that great design is not just about aesthetics—it's
                about solving problems and creating intuitive experiences that
                users love.
              </p>
              
              <p>
                When I'm not coding, you can find me exploring new technologies,
                contributing to open-source projects, or sharing my knowledge
                with the developer community.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { value: "5+", label: "Years Experience", gradient: "from-blue-500 to-cyan-500" },
                { value: "50+", label: "Projects Completed", gradient: "from-purple-500 to-pink-500" },
                { value: "30+", label: "Happy Clients", gradient: "from-pink-500 to-orange-500" },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center p-6 backdrop-blur-xl bg-white/60 border border-white/30 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  <div className={`text-4xl mb-2 bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300`}>
                    {stat.value}
                  </div>
                  <div className="text-gray-600">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}