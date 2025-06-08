import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";

// ShadCN UI Components
import { Skeleton } from "@/components/ui/skeleton";

// Components
import VehicleForm from "@/components/user/VehicleForm";

const Book = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);

  // Simulate loading state for smoother transitions
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: { duration: 0.5 },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.3 },
    },
  };

  if (loading) {
    return (
      <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        className="p-6 min-h-screen bg-gradient-to-br from-white to-blue-50/30 dark:from-black dark:to-blue-950/10"
      >
        {/* Skeleton loading state */}
        <div className="max-w-2xl mx-auto space-y-6">
          <Skeleton className="h-8 w-32 bg-blue-100/50 dark:bg-blue-900/20" />

          {/* Location card skeleton */}
          <Skeleton className="h-56 w-full rounded-xl bg-blue-100/50 dark:bg-blue-900/20" />

          {/* Form skeleton */}
          <div className="space-y-4">
            <Skeleton className="h-12 w-full rounded-xl bg-blue-100/50 dark:bg-blue-900/20" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-12 w-full rounded-xl bg-blue-100/50 dark:bg-blue-900/20" />
              <Skeleton className="h-12 w-full rounded-xl bg-blue-100/50 dark:bg-blue-900/20" />
            </div>
            <Skeleton className="h-12 w-full rounded-xl bg-blue-100/50 dark:bg-blue-900/20" />
            <Skeleton className="h-12 w-full rounded-xl bg-blue-100/50 dark:bg-blue-900/20" />
          </div>
        </div>
      </motion.div>
    );
  }

  if (!id) {
    return (
      <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        className="flex items-center justify-center min-h-screen bg-gradient-to-br from-white to-blue-50/30 dark:from-black dark:to-blue-950/10"
      >
        <div className="text-center p-8 max-w-md bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-blue-100 dark:border-blue-900/30">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="h-8 w-8 text-blue-500 dark:text-blue-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h1 className="text-xl font-bold mb-3 text-blue-700 dark:text-blue-300">
            Invalid Parking Location
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            No parking location was specified. Please select a parking location to
            proceed with booking.
          </p>
          <a
            href="/locations"
            className="inline-flex items-center justify-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            View Parking Locations
          </a>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
    >
      <VehicleForm parkingLotId={id} />
    </motion.div>
  );
};

export default Book;
