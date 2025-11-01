import { motion } from "framer-motion";
import MicIcon from "@mui/icons-material/Mic";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import ShareIcon from "@mui/icons-material/Share";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useState, useEffect } from "react";
import ToolCard from "../Components/ToolCard";

export default function OurTools() {
  const [mounted, setMounted] = useState(false);
  const [isLoggedIn] = useState(localStorage.getItem("isLogin") === "true");

  useEffect(() => {
    setMounted(true);
  }, []);

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const tools = [
    {
      icon: MicIcon,
      title: "Audio to Text",
      description:
        "Convert your audio files to text with high accuracy using AI.",
      to: isLoggedIn ? "/transcribe" : "/signup",
    },
    {
      icon: FavoriteIcon,
      title: "Love Calculator",
      description:
        "Create beautiful relationship cards showing how long you've been together",
      to: isLoggedIn ? "/love-calculator" : "/signup",
    },
    {
      icon: SearchIcon,
      title: "SEO Keyword Generator",
      description:
        "Generate high-ranking SEO keywords for your content strategy.",
      to: isLoggedIn ? "/keyword-tool" : "/signup",
    },
    {
      icon: EditIcon,
      title: "Content Rewriter",
      description:
        "Rephrase and enhance your content while keeping the original meaning.",
      to: isLoggedIn ? "/rewrite" : "/signup",
    },
    {
      icon: ShareIcon,
      title: "Social Media Post Creator",
      description:
        "Create engaging social media posts in seconds with AI assistance.",
      to: isLoggedIn ? "/social-post" : "/signup",
    },
  ];

  return (
    <section>
      {/* Tools Preview Section */}
      <div id="tools" className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-gray-900 dark:text-white">
              Our Powerful AI Tools
            </h1>
            <p className="mt-4 text-base md:text-xl text-gray-600 dark:text-gray-300">
              Everything you need to enhance your productivity
            </p>
          </div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={container}
            initial="hidden"
            animate={mounted ? "show" : "hidden"}
          >
            {tools.map((tool, index) => (
              <motion.div key={tool.title} variants={item}>
                <ToolCard
                  icon={tool.icon}
                  title={tool.title}
                  description={tool.description}
                  to={isLoggedIn ? tool.to : "/signup"}
                  delay={index}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
