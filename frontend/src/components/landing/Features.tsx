import { useRef } from "react";
import { useInView, motion } from "framer-motion";

// Icons
import { CreditCard, MapPin, Clock, BarChart3, Search } from "lucide-react";

const Features = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const features = [
    {
      icon: <Search className="h-6 w-6 text-blue-500 dark:text-blue-400" />,
      title: "Find Parking Easily",
      description:
        "Quickly locate available parking spots near your destination with our intuitive search system.",
      color:
        "bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800/30",
    },
    {
      icon: (
        <Calendar className="h-6 w-6 text-emerald-500 dark:text-emerald-400" />
      ),
      title: "Advance Booking",
      description:
        "Reserve your parking spot ahead of time to ensure availability when you arrive.",
      color:
        "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800/30",
    },
    {
      icon: <MapPin className="h-6 w-6 text-red-500 dark:text-red-400" />,
      title: "Multiple Locations",
      description:
        "Access parking spaces across different locations with a single account.",
      color:
        "bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800/30",
    },
    {
      icon: <Clock className="h-6 w-6 text-amber-500 dark:text-amber-400" />,
      title: "Real-time Updates",
      description:
        "Get instant updates on parking availability and receive timely notifications.",
      color:
        "bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800/30",
    },
    {
      icon: (
        <CreditCard className="h-6 w-6 text-purple-500 dark:text-purple-400" />
      ),
      title: "Secure Payments",
      description:
        "Make hassle-free payments with our secure online payment gateway.",
      color:
        "bg-purple-50 dark:bg-purple-900/20 border-purple-100 dark:border-purple-800/30",
    },
    {
      icon: (
        <BarChart3 className="h-6 w-6 text-indigo-500 dark:text-indigo-400" />
      ),
      title: "Analytics Dashboard",
      description:
        "Track your parking history and expenses with our comprehensive analytics.",
      color:
        "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-100 dark:border-indigo-800/30",
    },
  ];

  return (
    <section id="features" className="py-20 relative" ref={ref}>
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-0 w-72 h-72 bg-blue-100/50 dark:bg-blue-900/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-0 w-72 h-72 bg-indigo-100/50 dark:bg-indigo-900/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center justify-center px-4 py-1 mb-4 rounded-full bg-gradient-to-r from-blue-500/10 to-indigo-500/10 dark:from-blue-500/20 dark:to-indigo-500/20 border border-blue-100 dark:border-blue-800/30">
              <span className="text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                Why Choose ParkNGo?
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-zinc-900 dark:text-zinc-100">
              Packed with Powerful Features
            </h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-300">
              Our platform offers everything you need to make parking effortless
              and stress-free.
            </p>
          </motion.div>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className={`group rounded-2xl p-6 border ${feature.color} hover:shadow-lg transition-all duration-300 relative overflow-hidden`}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              {/* Hover backdrop effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/20 dark:from-white/0 dark:to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              {/* Icon container */}
              <div className="relative mb-5">
                
                <div className="relative w-14 h-14 rounded-full bg-white dark:bg-zinc-800 shadow-md flex items-center justify-center">
                  {feature.icon}
                </div>
              </div>

              <h3 className="text-xl font-semibold mb-3 text-zinc-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                {feature.title}
              </h3>

              <p className="text-zinc-600 dark:text-zinc-300">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Helper component for animated icons
const Calendar = ({ className }: { className?: string }) => (
  <div className={className}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
      <path d="M8 14h.01"></path>
      <path d="M12 14h.01"></path>
      <path d="M16 14h.01"></path>
      <path d="M8 18h.01"></path>
      <path d="M12 18h.01"></path>
      <path d="M16 18h.01"></path>
    </svg>
  </div>
);

export default Features;
