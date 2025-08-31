"use client";

import React from "react";
import { motion } from "motion/react";
import TypewriterText from "./TypewriterText";

type ConceptInputFormProps = {
  inputValue: string;
  isFocused: boolean;
  onChange: (value: string) => void;
  onFocus: (focused: boolean) => void;
  onSubmit: () => void;
  mode?: "single" | "lessons";
  placeholder?: string;
};

const ConceptInputForm: React.FC<ConceptInputFormProps> = ({
  inputValue,
  isFocused,
  onChange,
  onFocus,
  onSubmit,
  mode = "single",
  placeholder,
}) => {
  const isValid = inputValue.trim().length > 0;

  return (
    <motion.div
      className="py-16 md:py-24 w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <motion.div
        className="text-3xl md:text-5xl lg:text-6xl font-serif font-medium text-gray-900 dark:text-white tracking-tight text-center w-full mb-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
      >
        {mode === "lessons"
          ? "Write the concept for lesson breakdown"
          : "Write the concept you want to understand"
        }
      </motion.div>

      {mode === "lessons" && (
        <motion.div
          className="text-lg md:text-xl text-gray-600 dark:text-purple-200 text-center w-full mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
        >
          Get 3-4 mini-lessons, each with ≤45 words narration & 15-20 sec animations
        </motion.div>
      )}
      <div className="relative w-full min-h-[1em]">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => onFocus(true)}
          onBlur={() => onFocus(false)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && isValid) {
              onSubmit();
            }
          }}
          className="text-3xl md:text-5xl lg:text-6xl font-serif font-medium text-gray-900 dark:text-white tracking-tight bg-transparent border-none outline-none text-center w-full relative z-10"
          style={{ caretColor: "rgb(17 24 39) var(--tw-dark-caret, rgb(229 231 235))" }}
          placeholder={placeholder}
        />
        {inputValue === "" && !isFocused && (
          <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
            <TypewriterText />
          </div>
        )}
      </div>
      <div className="flex justify-center mt-8">
        <motion.button
          onClick={() => isValid && onSubmit()}
          className={`w-14 h-14 backdrop-blur-sm text-gray-700 dark:text-purple-200 rounded-full flex items-center justify-center transition-all duration-300 disabled:cursor-not-allowed ${
            isFocused ? "bg-gray-500/30 dark:bg-purple-500/30" : "bg-gray-500/10 dark:bg-purple-500/20"
          } ${isValid ? "hover:bg-gray-500/40 dark:hover:bg-purple-500/40" : ""}`}
          disabled={!isValid}
          whileHover={{ scale: isValid ? 1.05 : 1 }}
          whileTap={{ scale: isValid ? 0.95 : 1 }}
          initial={{ opacity: 0.3 }}
          animate={{ opacity: isFocused ? 1 : 0.3 }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14m-7-7l7 7-7 7" />
          </svg>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ConceptInputForm;
