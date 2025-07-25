'use client'
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSpring, animated, useTrail, config } from "@react-spring/web";
import {
  Heart,
  Instagram,
  Linkedin,
  Github,
  Sparkles,
  Rocket,
  BookOpen,
  User,
  Star,
  Coffee,
  GraduationCap,
  ArrowUp,
} from "lucide-react";

// ...ClientOnly, FloatingHearts, MagneticSocialButton, GlitchText, ScrollToTop remain as in your code above...

const Footer = () => {
  const [isInView, setIsInView] = useState(false);
  const [currentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { setIsInView(entry.isIntersecting); },
      { threshold: 0.1 }
    );
    const footerElement = document.getElementById('footer');
    if (footerElement) { observer.observe(footerElement); }
    return () => {
      if (footerElement) { observer.unobserve(footerElement); }
    };
  }, []);

  // Social links for the portal demo
  const socialLinks = [
    {
      href: "https://www.instagram.com/nittish_baboria",
      icon: Instagram,
      color: "bg-gradient-to-br from-pink-500 to-orange-500 hover:shadow-pink-500/50",
      name: "Instagram"
    },
    {
      href: "https://www.linkedin.com/in/nittish-baboria/",
      icon: Linkedin,
      color: "bg-gradient-to-br from-blue-600 to-blue-400 hover:shadow-blue-500/50",
      name: "LinkedIn"
    },
    {
      href: "https://github.com/nittish03",
      icon: Github,
      color: "bg-gradient-to-br from-gray-700 to-gray-500 hover:shadow-gray-500/50",
      name: "GitHub"
    }
  ];

  // Stats about the portal - adjust values to whatever you like!
  const stats = [
    { icon: GraduationCap, label: "Students Registered", value: "120+", color: "text-blue-400" },
    { icon: BookOpen, label: "Courses Published", value: "18", color: "text-purple-400" },
    { icon: Star, label: "Skills Catalogued", value: "40+", color: "text-yellow-400" },
    // { icon: Rocket, label: "Certificates Issued", value: "60+", color: "text-green-400" },
  ];

  const trail = useTrail(stats.length, {
    from: { opacity: 0, transform: 'translateY(50px)' },
    to: { opacity: isInView ? 1 : 0, transform: isInView ? 'translateY(0px)' : 'translateY(50px)' },
    config: config.wobbly,
  });

  const contentSpring = useSpring({
    from: { opacity: 0, transform: 'translateY(100px)' },
    to: { opacity: isInView ? 1 : 0, transform: isInView ? 'translateY(0px)' : 'translateY(100px)' },
    config: config.gentle,
    delay: 200,
  });

  return (
    <>
      <footer
        id="footer"
        className="relative bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white py-16 overflow-hidden"
      >
        {/* Background Effects */}
        {/* <ClientOnly>
          <FloatingHearts />
        </ClientOnly> */}

        {/* Animated gradient */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10"
          animate={{
            background: [
              "linear-gradient(45deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1), rgba(236, 72, 153, 0.1))",
              "linear-gradient(135deg, rgba(147, 51, 234, 0.1), rgba(236, 72, 153, 0.1), rgba(59, 130, 246, 0.1))",
              "linear-gradient(225deg, rgba(236, 72, 153, 0.1), rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1))",
              "linear-gradient(315deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1), rgba(236, 72, 153, 0.1))"
            ]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:50px_50px] opacity-20" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          {/* Fun Stats Section */}
          <animated.div style={contentSpring}>
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : -50 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <motion.h2
                className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <div>Student Skill Portal</div>
                <motion.span
                  className="inline-block mx-2"
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Heart className="text-red-500 fill-red-500" size={32} />
                </motion.span>
              </motion.h2>
              <motion.p
                className="text-gray-300 text-lg max-w-2xl mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: isInView ? 1 : 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                Empowering students to <b className="text-blue-400">build, learn</b>, & <b className="text-purple-400">prove their skills</b>. Fast, modern and <Star size={14} className="inline -mt-1 text-yellow-400" /> fun!
              </motion.p>
            </motion.div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              {trail.map((style, index) => {
                const stat = stats[index];
                const StatIcon = stat.icon;
                return (
                  <animated.div key={index} style={style} className="relative group">
                    <motion.div
                      className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-white/30 transition-all duration-300"
                      whileHover={{ scale: 1.05, rotateY: 6 }}
                    >
                      <motion.div
                        className={stat.color + " mb-3"}
                        whileHover={{ rotate: 360, scale: 1.2 }}
                        transition={{ duration: 0.6 }}
                      >
                        <StatIcon size={32} />
                      </motion.div>
                      <div className="text-2xl font-bold text-white mb-1">
                        {stat.value}
                      </div>
                      <div className="text-gray-400 text-sm">{stat.label}</div>
                    </motion.div>
                  </animated.div>
                );
              })}
            </div>
          </animated.div>

          {/* Enhanced Social Section */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 50 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <motion.h3
              className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500"
              whileHover={{ scale: 1.05 }}
            >
              Connect with the creator
            </motion.h3>
            <div className="flex justify-center items-center gap-6 flex-wrap">
              {socialLinks.map((social, index) => (
                <motion.div
                  key={social.href}
                  initial={{ opacity: 0, y: 30, rotate: -180 }}
                  animate={{
                    opacity: isInView ? 1 : 0,
                    y: isInView ? 0 : 30,
                    rotate: isInView ? 0 : -180
                  }}
                  transition={{ delay: 1 + index * 0.2, duration: 0.6 }}
                >

                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Animated Divider */}
          <motion.div
            className="relative my-12"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: isInView ? 1 : 0 }}
            transition={{ delay: 1.5, duration: 1 }}
          >
            <div className="h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent" />
            <motion.div
              className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="text-purple-400" size={20} />
            </motion.div>
          </motion.div>

          {/* Enhanced Footer Bottom */}
          <motion.div
            className="flex flex-col md:flex-row md:justify-between items-center text-gray-400 space-y-4 md:space-y-0"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 30 }}
            transition={{ delay: 2, duration: 0.8 }}
          >
            <motion.div
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
            >
              <span className="text-sm">
                © {currentYear}
              </span>
              <motion.span
                className="font-bold text-white"
                animate={{
                  color: ["#ffffff", "#3b82f6", "#8b5cf6", "#ec4899", "#ffffff"]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                Skill Portal
              </motion.span>
              <span className="text-sm">by Nittish</span>
            </motion.div>

            <motion.div
              className="flex items-center space-x-2 text-sm"
              whileHover={{ scale: 1.05 }}
            >
              <span>Made with</span>
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <Heart className="text-red-500 fill-red-500" size={16} />
              </motion.div>
              <span>and plenty of</span>
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Coffee className="text-orange-400" size={16} />
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Easter egg - hidden message */}
          <motion.div
            className="text-center mt-8 opacity-0 hover:opacity-100 transition-opacity duration-1000"
            whileHover={{ scale: 1.1 }}
          >
            <p className="text-xs text-gray-600 font-mono">
              🚀 Thanks for exploring the Student Skill Development Portal! 🚀
            </p>
          </motion.div>
        </div>
      </footer>

    </>
  );
};

export default Footer;
