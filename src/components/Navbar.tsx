import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import DarkModeToggle from "./DarkModeToggle";

interface NavbarProps {
  showBackButton?: boolean;
  backPath?: string;
  hideCreateButtons?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({
  showBackButton = false,
  backPath = "/explain",
  hideCreateButtons = false,
}) => {
  const router = useRouter();

  return (
    <nav className="px-8 py-6">
      <div className="w-full flex justify-center">
        <div className="flex justify-between items-center h-16 w-full">
          {showBackButton && (
            <button
              onClick={() => router.push(backPath)}
              className="w-8 h-8 bg-black dark:bg-purple-800 text-white rounded-full flex items-center justify-center transition-colors hover:bg-gray-800 dark:hover:bg-purple-700 cursor-pointer"
              aria-label="Go back"
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
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
          )}
          {!showBackButton && <div className="w-8"></div>}

          <div className="flex items-center">
            <h1 className="text-2xl md:text-3xl font-serif font-medium text-gray-900 dark:text-white tracking-tight">
              <span className="inline-flex items-center gap-2">
                Mona
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-5 h-5 text-pink-500 dark:text-purple-400 inline-block align-middle"
                  aria-label="heart"
                >
                  <path
                    fillRule="evenodd"
                    d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <DarkModeToggle />
            {!hideCreateButtons && (
              <>
                <Link
                  href="/explain"
                  className="w-8 h-8 bg-black dark:bg-purple-800 text-white rounded-full flex items-center justify-center transition-colors hover:bg-gray-800 dark:hover:bg-purple-700 cursor-pointer shadow-lg"
                  title="Create Video"
                  aria-label="Create video explanation"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </Link>
                <Link
                  href="/article"
                  className="w-8 h-8 bg-white/60 dark:bg-purple-900/50 backdrop-blur-sm text-gray-700 dark:text-purple-200 rounded-full flex items-center justify-center transition-colors hover:bg-white/80 dark:hover:bg-purple-800/50 cursor-pointer shadow-lg border border-white/50 dark:border-purple-600/30"
                  title="Create Article"
                  aria-label="Create article explanation"
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
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14,2 14,8 20,8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10,9 9,9 8,9" />
                  </svg>
                </Link>
              </>
            )}
            <Link
              href="/library"
              className="w-8 h-8 bg-black dark:bg-purple-800 text-white rounded-full flex items-center justify-center transition-colors hover:bg-gray-800 dark:hover:bg-purple-700 cursor-pointer shadow-lg"
              title="View Library"
              aria-label="Go to library"
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
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
