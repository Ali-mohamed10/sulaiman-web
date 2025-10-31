import { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import flower1 from "../assets/imgs/flower1.webp";
import flower3 from "../assets/imgs/flower3.webp";

export default function LoveCard({
  durationText,
  ourName,
  startDate,
  showCard,
}) {
  const cardRef = useRef(null);

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: -50,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        mass: 0.5,
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.2 },
    },
  };

  return (
    <AnimatePresence>
      {showCard && (
        <div className="relative">
          <motion.div
            ref={cardRef}
            className="love-card relative w-full max-w-180 bg-white border text-black shadow-lg shadow-shadow rounded-lg mx-auto my-10"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={cardVariants}
          >
            <img
              src={flower3}
              alt="flower3"
              loading="lazy"
              className="w-28 sm:absolute top-0 left-0"
            />
            <div className="content text-center px-5 sm:px-10 py-5">
              <h2 className="text-2xl sm:text-3xl font-bold text-red-600">
                Our Love Journey 💖
              </h2>
              <p className="italic text-gray-500 text-sm sm:text-base md:w-2/3 w-full mx-auto mt-5">
                It's been{" "}
                <span className="font-semibold text-gray-500">
                  {durationText}
                </span>{" "}
                since our first meeting. Every day with you feels like a new
                chapter in our love story — timeless, beautiful, and endless. ❤️
              </p>
              <div className="mt-4">
                <p className="italic text-gray-500 font-bold text-sm sm:text-base">
                  {ourName.myName} & {ourName.herName}
                </p>
                <p className="italic text-gray-500 text-sm sm:text-base">
                  {startDate}
                </p>
              </div>
            </div>
            <div className="flex justify-end">
              <img
                src={flower1}
                alt="flower1"
                loading="lazy"
                className="w-28 sm:absolute bottom-0 right-0"
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
