import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/button";

/**
 * Catch-all route. Without this, a mistyped or stale URL rendered the nav and
 * footer around an empty middle — the page looked broken rather than missing,
 * with no way onward.
 */
export function NotFoundPage() {
  return (
    <main className="pt-32 pb-24 page-min-height">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-xl mx-auto text-center"
        >
          <p
            className="text-sm uppercase text-gray-500 dark:text-gray-400 mb-4"
            style={{ letterSpacing: "0.15em" }}
          >
            404
          </p>

          <h1
            className="text-4xl md:text-5xl mb-6 bg-gradient-to-r from-[#102F56] to-[#1a4d7a] dark:from-blue-300 dark:to-blue-400 bg-clip-text text-transparent"
            style={{ lineHeight: "1.3" }}
          >
            This page doesn't exist
          </h1>

          <p className="text-lg text-gray-700 dark:text-gray-200 mb-10">
            The link may be out of date, or the page may have moved. The work is
            all on the home page.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/">
              <Button
                size="lg"
                className="gap-2 bg-gradient-to-r from-[#102F56] to-[#1a4d7a] hover:from-[#0d2543] hover:to-[#153d63] dark:from-[#6DB2FF] dark:to-[#5a9ae6] dark:hover:from-[#5a9ae6] dark:hover:to-[#4882cc] text-white dark:text-gray-900 shadow-lg cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" /> Back to home
              </Button>
            </Link>
            <Link
              to="/about"
              className="text-indigo-600 dark:text-indigo-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors underline"
            >
              Or read about Mu
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
