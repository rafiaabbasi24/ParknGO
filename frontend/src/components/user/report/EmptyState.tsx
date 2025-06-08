import { motion } from "framer-motion";
import { Calendar, Clock, History, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface EmptyStateProps {
  type: 'ongoing' | 'upcoming' | 'past';
}

export const EmptyState: React.FC<EmptyStateProps> = ({ type }) => {
  const emptyStateConfig = {
    ongoing: {
      icon: <Clock className="h-10 w-10 text-blue-500" />,
      title: "No Ongoing Bookings",
      description: "You don't have any active parking sessions right now.",
      ctaLabel: "Make a booking",
      ctaHref: "/bookings",
      ctaIcon: <Car className="h-4 w-4 mr-2" />,
      animation: "parking",
    },
    upcoming: {
      icon: <Calendar className="h-10 w-10 text-blue-500" />,
      title: "No Upcoming Bookings",
      description: "You don't have any scheduled parking reservations.",
      ctaLabel: "Reserve a spot",
      ctaHref: "/booking", 
      ctaIcon: <Car className="h-4 w-4 mr-2" />,
      animation: "calendar",
    },
    past: {
      icon: <History className="h-10 w-10 text-blue-500" />,
      title: "No Booking History",
      description: "Your completed bookings will appear here after use.",
      ctaLabel: "Learn how it works", 
      ctaHref: "/how-it-works",
      ctaIcon: <Car className="h-4 w-4 mr-2" />,
      animation: "history",
    },
  };

  const { icon, title, description, ctaLabel, ctaHref, ctaIcon } = emptyStateConfig[type];

  return (
    <div className="rounded-lg border border-blue-100 dark:border-blue-900/30 bg-gradient-to-b from-blue-50/50 to-white dark:from-blue-950/20 dark:to-zinc-900 overflow-hidden">
      <div className="p-8 sm:p-12 flex flex-col items-center text-center">
        <motion.div 
          className="w-20 h-20 rounded-full bg-blue-100/80 dark:bg-blue-900/30 flex items-center justify-center mb-5 relative"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Decorative rings */}
          <motion.div 
            className="absolute inset-0 rounded-full border-2 border-blue-200/50 dark:border-blue-800/30"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1.05 }}
            transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
          />
          <motion.div 
            className="absolute inset-0 rounded-full border border-blue-300/30 dark:border-blue-700/20"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1.15 }}
            transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse", delay: 0.2 }}
          />
          {icon}
        </motion.div>

        <motion.h2 
          className="text-xl font-semibold mb-2 text-blue-900 dark:text-blue-300"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {title}
        </motion.h2>
        
        <motion.p 
          className="text-blue-700/70 dark:text-blue-400/70 mb-8 max-w-md"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Button asChild className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700">
            <Link to={ctaHref}>
              {ctaIcon}
              {ctaLabel}
            </Link>
          </Button>
        </motion.div>
      </div>
    </div>
  );
};
