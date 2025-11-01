import { Calendar } from "./calendar";
import LoveCard from "./LoveCard";
import { useState } from "react";
import { motion } from "framer-motion";
export default function LoveCounter() {
  const [date, setDate] = useState(new Date());
  const [ourName, setOurName] = useState({ myName: "", herName: "" });
  const [duration, setDuration] = useState("");
  const [showCard, setShowCard] = useState(false);

  const calculateDuration = (startDate) => {
    const now = new Date();
    const diffTime = Math.abs(now - new Date(startDate));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);
    const days = diffDays % 30;

    let durationText = [];
    if (years > 0)
      durationText.push(`${years} ${years === 1 ? "year" : "years"}`);
    if (months > 0)
      durationText.push(`${months} ${months === 1 ? "month" : "months"}`);
    if (days > 0 || durationText.length === 0)
      durationText.push(`${days} ${days === 1 ? "day" : "days"}`);

    return durationText.join(" and ");
  };

  const handleStart = (e) => {
    e.preventDefault();
    if (ourName.myName.trim() && ourName.herName.trim()) {
      setDuration(calculateDuration(date));
      setShowCard(true);
    } else {
      alert("Please enter both names");
    }
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const containerVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.7,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7 },
    },
  };

  return (
    <div className="min-h-screen py-8 px-4 bg-gradient-to-br from-pink-50 via-red-50 to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <motion.section
        className="container mx-auto max-w-4xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header Section */}
        <motion.div className="text-center mb-12" variants={itemVariants}>
          <h1 className="text-3xl sm:text-6xl font-extrabold mb-4 bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
            Love Counter
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Celebrate your journey together ❤️
          </p>
        </motion.div>

        {/* Form Card */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-8 sm:p-12 mb-8"
          variants={itemVariants}
        >
          <motion.form onSubmit={handleStart} className="space-y-8">
            {/* Name Inputs */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wide">
                  Your Name
                </label>
                <input
                  type="text"
                  value={ourName.myName}
                  onChange={(e) =>
                    setOurName({ ...ourName, myName: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-100 dark:focus:ring-red-900/30 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400"
                  placeholder="Enter your name"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wide">
                  Partner's Name
                </label>
                <input
                  type="text"
                  value={ourName.herName}
                  onChange={(e) =>
                    setOurName({ ...ourName, herName: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-100 dark:focus:ring-red-900/30 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400"
                  placeholder="Enter your partner's name"
                  required
                />
              </div>
            </div>

            {/* Date Picker */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wide text-center">
                First Meeting Date
              </label>
              <div className="max-w-xs sm:max-w-sm mx-auto">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-xl p-2 sm:p-3 bg-white dark:bg-gray-700 text-xs sm:text-sm"
                  captionLayout="dropdown"
                />
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto sm:text-base mx-auto block bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold py-2 px-4 sm:py-4 sm:px-8 rounded-xl shadow-lg shadow-red-200 dark:shadow-red-900/50 transition-all duration-300 text-lg"
            >
              Show Our Love Story 💕
            </motion.button>
          </motion.form>
        </motion.div>

        {/* Love Card Display */}
        {showCard && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <LoveCard
              durationText={duration}
              ourName={ourName}
              startDate={formatDate(date)}
              showCard={showCard}
            />
          </motion.div>
        )}
      </motion.section>
    </div>
  );
}
