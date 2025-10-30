import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useState } from "react";

export default function LandingPage() {
  const [isLoggedIn] = useState(localStorage.getItem("isLogin") === "true");
  return (
    <section>
      {/* Hero Section */}
      <div className="relative overflow-hidden h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-2xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Discover Free AI Tools That Make Your Work Easier
            </h1>
            <p className="mt-6 text-base md:text-lg text-gray-600 dark:text-gray-300">
              Boost your productivity with our collection of powerful AI tools.
              From audio transcription to content creation, we've got you
              covered.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to={isLoggedIn ? "/tools" : "/signup"}
                className="px-8 py-4 rounded-xl bg-linear-to-r from-[--color-primary] to-[--color-secondary] font-medium hover:opacity-90 transition-opacity duration-200 inline-flex items-center justify-center"
              >
                Get Started
                <ArrowForwardIcon className="ml-2" />
              </Link>
              <Link
                to="/#tools"
                className="px-8 py-4 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 inline-flex items-center justify-center border border-gray-200 dark:border-gray-700"
              >
                Explore Tools
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
