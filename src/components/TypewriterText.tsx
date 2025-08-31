"use client";

import React, { useEffect, useState, useMemo } from "react";
import { motion } from "motion/react";
const TypewriterText: React.FC = () => {
  const topics = useMemo(() => [
    "quantum physics",
    "machine learning",
    "neural networks",
    "thermodynamics",
    "organic chemistry",
    "linear algebra",
    "electromagnetism",
  ], []);

  const [currentText, setCurrentText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const typeSpeed = isDeleting ? 50 : 100;
    const pauseTime = 2000;

    const timeout = setTimeout(() => {
      const currentTopic = topics[currentIndex];

      if (!isDeleting) {
        if (currentText.length < currentTopic.length) {
          setCurrentText(currentTopic.slice(0, currentText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), pauseTime);
        }
      } else {
        if (currentText.length > 0) {
          setCurrentText(currentText.slice(0, -1));
        } else {
          setIsDeleting(false);
          setCurrentIndex((prev) => (prev + 1) % topics.length);
        }
      }
    }, typeSpeed);

    return () => clearTimeout(timeout);
  }, [currentText, currentIndex, isDeleting, topics]);

  return (
    <motion.span
      className="text-3xl md:text-5xl lg:text-6xl font-serif font-medium text-gray-400 dark:text-purple-400 tracking-tight text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {currentText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
        className="text-gray-400 dark:text-purple-400"
      >
        |
      </motion.span>
    </motion.span>
  );
};

export default TypewriterText;
