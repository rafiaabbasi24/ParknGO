import { motion } from "framer-motion";
import { Clock, Calendar, History } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface StatsDisplayProps {
  ongoing: number;
  upcoming: number;
  past: number;
  loading: boolean;
}

export const StatsDisplay: React.FC<StatsDisplayProps> = ({
  ongoing,
  upcoming,
  past,
  loading
}) => {
  const stats = [
    {
      label: "Ongoing",
      value: ongoing,
      icon: <Clock className="h-5 w-5" />,
      color: "blue",
      animate: true
    },
    {
      label: "Upcoming",
      value: upcoming,
      icon: <Calendar className="h-5 w-5" />,
      color: "indigo",
      animate: upcoming > 0
    },
    {
      label: "Completed",
      value: past,
      icon: <History className="h-5 w-5" />,
      color: "violet",
      animate: false
    }
  ];

  const gradients = {
    blue: "bg-gradient-to-r from-blue-50 to-blue-100/60 dark:from-blue-950/30 dark:to-blue-900/20 border-blue-100 dark:border-blue-800/30",
    indigo: "bg-gradient-to-r from-indigo-50 to-indigo-100/60 dark:from-indigo-950/30 dark:to-indigo-900/20 border-indigo-100 dark:border-indigo-800/30",
    violet: "bg-gradient-to-r from-violet-50 to-violet-100/60 dark:from-violet-950/30 dark:to-violet-900/20 border-violet-100 dark:border-violet-800/30"
  };

  const iconBgs = {
    blue: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800/20",
    indigo: "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800/20",
    violet: "bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 border-violet-200 dark:border-violet-800/20"
  };

  const valueBgs = {
    blue: "text-blue-900 dark:text-blue-300",
    indigo: "text-indigo-900 dark:text-indigo-300",
    violet: "text-violet-900 dark:text-violet-300"
  };

  const labelColors = {
    blue: "text-blue-700/80 dark:text-blue-400/80",
    indigo: "text-indigo-700/80 dark:text-indigo-400/80",
    violet: "text-violet-700/80 dark:text-violet-400/80"
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {[1, 2, 3].map((i) => (
          <Skeleton 
            key={i}
            className="h-24 rounded-xl bg-blue-100/50 dark:bg-blue-900/20" 
          />
        ))}
      </div>
    );
  }

  if (ongoing === 0 && upcoming === 0 && past === 0) {
    return (
      <div className="px-0.5 py-1">
        <p className="text-sm text-blue-700/60 dark:text-blue-400/60">
          You don't have any bookings yet. Make a reservation to view your booking statistics here.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          className={`relative rounded-xl px-5 py-4 border shadow-sm backdrop-blur-sm ${gradients[stat.color as keyof typeof gradients]}`}
          whileHover={{ y: -2, transition: { duration: 0.2 } }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          {/* Pulsing animation for active booking */}
          {stat.animate && (
            <motion.div 
              className="absolute inset-0 rounded-xl border border-blue-300 dark:border-blue-700 opacity-0"
              animate={{
                opacity: [0, 0.2, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{
                duration: 2,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "loop"
              }}
            />
          )}
          
          <div className="flex items-center justify-between">
            <div className={`p-2 rounded-lg border ${iconBgs[stat.color as keyof typeof iconBgs]}`}>
              {stat.icon}
            </div>
            <div className={`text-2xl font-bold ${valueBgs[stat.color as keyof typeof valueBgs]}`}>
              {stat.value}
            </div>
          </div>
          <div className={`mt-1.5 text-sm font-medium ${labelColors[stat.color as keyof typeof labelColors]}`}>
            {stat.label} Bookings
          </div>
        </motion.div>
      ))}
    </div>
  );
};
