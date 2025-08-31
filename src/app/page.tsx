import React from "react";
import Link from "next/link";
import ShaderBackground from "../components/ShaderBackground";
import Footer from "../components/Footer";

const page = () => {
  return (
    <ShaderBackground>
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="px-8 py-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-medium text-gray-800">Mona</h2>
            <Link
              href="/explain"
              className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center transition-colors hover:bg-gray-800 cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
            </Link>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex flex-col justify-center px-8 md:px-16 lg:px-24 max-w-7xl mx-auto w-full">
          {/* Hero Section */}
          <div className="mt-6 p-4 bg-yellow-50/50 border border-yellow-200 rounded-lg max-w-2xl">
              <div className="flex items-start gap-2">
                <svg
                  className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <div className="text-sm text-yellow-800">
                  <strong className="font-medium">Notice:</strong> OpenRouter credit depletion has forced us to use cheaper models for Manim generation, significantly reducing animation quality below our standards.
                </div>
              </div>
            </div>
          <div className="py-16 md:py-24">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-medium text-gray-900 tracking-tight max-w-4xl">
              <span className="inline-flex items-center gap-2">
                Mona
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-6 h-6 text-pink-500 inline-block align-middle"
                  aria-label="heart"
                >
                  <path
                    fillRule="evenodd"
                    d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              <span>
                {" "}
                is a <span className="text-gray-600">manim</span> video
              </span>
              <br className="hidden md:block" /> generator & explainer:
            </h1>

            {/* Service Cards */}
            <div className="flex flex-wrap gap-4 mt-10">
              <div className="bg-blue-100/40 px-4 py-2 rounded-full">
                <span className="text-sm md:text-base text-gray-800">
                  Concept Explanation
                </span>
              </div>
              <div className="bg-yellow-50/40 px-4 py-2 rounded-full">
                <span className="text-sm md:text-base text-gray-800">
                  Animated Visualizations
                </span>
              </div>
              <div className="bg-green-100/40 px-4 py-2 rounded-full">
                <span className="text-sm md:text-base text-gray-800">
                  Written Articles
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 mt-8">
              <Link
                href="/explain"
                className="bg-black text-white px-6 py-3 rounded-full flex items-center gap-2 hover:bg-gray-800 transition-colors cursor-pointer"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
                Create Video
              </Link>
              <Link
                href="/article"
                className="bg-white/60 backdrop-blur-sm text-gray-800 px-6 py-3 rounded-full flex items-center gap-2 hover:bg-white/80 transition-colors cursor-pointer border border-white/50"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14,2 14,8 20,8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10,9 9,9 8,9" />
                </svg>
                Create Article
              </Link>
            </div>
          </div>

          {/*Works Section */}
          <div className="pb-12 md:pb-24">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl md:text-3xl font-medium text-gray-800">
                Featured Work
              </h2>
              <Link
                href="/library"
                className="bg-black text-white px-5 py-3 rounded-full flex items-center gap-2 hover:bg-gray-800 transition-colors cursor-pointer"
              >
                View All
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14m-7-7l7 7-7 7" />
                </svg>
              </Link>
            </div>
            {/* Portfolio grid would go here */}
          </div>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </ShaderBackground>
  );
};

export default page;
