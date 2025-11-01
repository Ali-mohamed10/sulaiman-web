import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

const Toast = ({ message, type = "success", isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, x: "-50%" }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.3 }}
          className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-6 py-4 rounded-lg shadow-xl backdrop-blur-sm ${
            type === "success"
              ? "bg-green-500/95 text-white border border-green-400"
              : type === "error"
              ? "bg-red-500/95 text-white border border-red-400"
              : "bg-blue-500/95 text-white border border-blue-400"
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">
              {type === "success" ? "✅" : type === "error" ? "❌" : "ℹ️"}
            </span>
            <span className="font-semibold">{message}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;

