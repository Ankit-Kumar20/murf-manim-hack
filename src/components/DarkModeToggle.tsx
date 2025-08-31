"use client";

import React from "react";
import { useDarkMode } from "../contexts/DarkModeContext";
import { motion } from "motion/react";

interface DarkModeToggleProps {
  className?: string;
}

const DarkModeToggle: React.FC<DarkModeToggleProps> = ({ className = "" }) => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <motion.button
      onClick={toggleDarkMode}
      className={`relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ${
        isDarkMode
          ? "bg-purple-800/50 hover:bg-purple-700/50 border border-purple-600/30"
          : "bg-white/80 hover:bg-white/90 border border-gray-200/50 backdrop-blur-sm"
      } ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {/* Sun Icon */}
      <motion.svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        className={`absolute transition-all duration-300 ${
          isDarkMode ? "opacity-0 rotate-90 scale-0" : "opacity-100 rotate-0 scale-100"
        }`}
      >
        <circle
          cx="12"
          cy="12"
          r="5"
          stroke={isDarkMode ? "#a855f7" : "#7c3aed"}
          strokeWidth="2"
          fill={isDarkMode ? "#a855f7" : "#7c3aed"}
        />
        <path
          d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
          stroke={isDarkMode ? "#a855f7" : "#7c3aed"}
          strokeWidth="2"
        />
      </motion.svg>

      {/* Moon Icon */}
      <motion.svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        className={`absolute transition-all duration-300 ${
          isDarkMode ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-0"
        }`}
      >
        <path
          d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
          stroke="#e879f9"
          strokeWidth="2"
          fill="#e879f9"
        />
      </motion.svg>

      {/* Animated stars for dark mode */}
      {isDarkMode && (
        <>
          <motion.div
            className="absolute w-1 h-1 bg-purple-300 rounded-full"
            style={{ top: "4px", right: "6px" }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: 0,
            }}
          />
          <motion.div
            className="absolute w-0.5 h-0.5 bg-purple-200 rounded-full"
            style={{ top: "6px", left: "5px" }}
            animate={{
              opacity: [0.5, 1, 0.5],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: 0.5,
            }}
          />
          <motion.div
            className="absolute w-0.5 h-0.5 bg-purple-400 rounded-full"
            style={{ bottom: "5px", right: "4px" }}
            animate={{
              opacity: [0.4, 1, 0.4],
              scale: [0.9, 1.1, 0.9],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              delay: 1,
            }}
          />
        </>
      )}
    </motion.button>
  );
};

export default DarkModeToggle;
