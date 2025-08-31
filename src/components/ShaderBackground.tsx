"use client";

import type React from "react";

import { useEffect, useRef, useState } from "react";
import { MeshGradient } from "@paper-design/shaders-react";
import { useDarkMode } from "../contexts/DarkModeContext";

interface ShaderBackgroundProps {
  children?: React.ReactNode;
}

export default function ShaderBackground({ children }: ShaderBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [grainSeed, setGrainSeed] = useState<number>(0);
  const { isDarkMode } = useDarkMode();

  useEffect(() => {
    // Generate random seed for grain effect on client side only
    setGrainSeed(Math.random() * 1000);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`min-h-screen relative overflow-hidden ${
        isDarkMode
          ? "bg-gradient-to-br from-purple-900 via-gray-900 to-black"
          : "bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50"
      }`}
    >
      {/* SVG Filters */}
      <svg className="absolute inset-0 w-0 h-0">
        <defs>
          <filter
            id="glass-effect"
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
          >
            <feTurbulence baseFrequency="0.005" numOctaves="1" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="0.3" />
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 0.02
                      0 1 0 0 0.02
                      0 0 1 0 0.05
                      0 0 0 0.9 0"
              result="tint"
            />
          </filter>
          <filter
            id="gooey-filter"
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
          >
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
              result="gooey"
            />
            <feComposite in="SourceGraphic" in2="gooey" operator="atop" />
          </filter>
          <filter
            id="grain-filter"
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
          >
            <feTurbulence
              baseFrequency="0.8 0.8"
              numOctaves="4"
              result="noise"
              seed={grainSeed}
            />
            <feColorMatrix
              in="noise"
              type="matrix"
              values="0.5 0 0 0 0.5
                      0.5 0 0 0 0.5
                      0.5 0 0 0 0.5
                      0 0 0 1 0"
              result="grain"
            />
            <feBlend mode="multiply" in="SourceGraphic" in2="grain" />
          </filter>
        </defs>
      </svg>

      {/* Background Shader - Maeve-inspired gradient */}
      <MeshGradient
        className="absolute inset-0 w-full h-full"
        style={{ filter: "url(#grain-filter)" }}
        colors={
          isDarkMode
            ? [
                "#581c87", // dark purple
                "#7c3aed", // purple
                "#9333ea", // violet
                "#a855f7", // light purple
                "#c084fc", // lavender
                "#e879f9", // magenta
              ]
            : [
                "#f9a8d4", // pink
                "#f0abfc", // fuchsia
                "#d8b4fe", // purple
                "#c4b5fd", // violet
                "#fde68a", // amber
                "#fef3c7", // light amber
              ]
        }
        speed={0.15}
      />

      {/* Overlay for depth */}
      <div
        className={`absolute inset-0 ${
          isDarkMode
            ? "bg-gradient-to-t from-purple-900/30 via-transparent to-gray-900/20"
            : "bg-gradient-to-t from-pink-100/20 via-transparent to-purple-50/10"
        }`}
      />

      {children}
    </div>
  );
}
