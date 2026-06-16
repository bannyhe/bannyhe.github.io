import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef } from "react";
import { Code2, Palette, Database, Smartphone, Globe, Zap } from "lucide-react";

const skills = [
  {
    icon: Code2,
    title: "Frontend Development",
    description: "React, TypeScript, Next.js, Tailwind CSS",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Database,
    title: "Backend Development",
    description: "Node.js, Express, PostgreSQL, MongoDB",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    icon: Palette,
    title: "UI/UX Design",
    description: "Figma, Adobe XD, User Research, Prototyping",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: Smartphone,
    title: "Mobile Development",
    description: "React Native, iOS, Android, Cross-platform",
    gradient: "from-pink-500 to-rose-500",
  },
  {
    icon: Globe,
    title: "Web Technologies",
    description: "HTML5, CSS3, JavaScript, REST APIs",
    gradient: "from-orange-500 to-amber-500",
  },
  {
    icon: Zap,
    title: "Performance",
    description: "Optimization, SEO, Accessibility, Best Practices",
    gradient: "from-yellow-500 to-orange-500",
  },
];

export function Skills() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section id="skills" className="py-24 relative">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Skills & Expertise
            </h2>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto">
              A comprehensive skill set built through years of continuous learning
              and real-world project experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {skills.map((skill, index) => {
              const Icon = skill.icon;
              return (
                <motion.div
                  key={skill.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={
                    isInView
                      ? { opacity: 1, scale: 1 }
                      : { opacity: 0, scale: 0.9 }
                  }
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="p-6 backdrop-blur-2xl bg-white/40 border border-white/20 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 group"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${skill.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl mb-2 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                    {skill.title}
                  </h3>
                  <p className="text-gray-600">{skill.description}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}