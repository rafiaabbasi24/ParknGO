import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";

// UI Components
import { Button } from "@/components/ui/button";

// Icons
import { Search, Car, Clock, CheckCircle, ArrowRight } from "lucide-react";

const UserActions = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const steps = [
    {
      icon: <Search className="h-6 w-6 text-white" />,
      color: "bg-blue-500 dark:bg-blue-600",
      title: "Find a Space",
      description:
        "Search for parking locations near your destination and check real-time availability.",
    },
    {
      icon: <Car className="h-6 w-6 text-white" />,
      color: "bg-purple-500 dark:bg-purple-600",
      title: "Book Your Spot",
      description:
        "Reserve your spot in advance with just a few clicks. Choose your arrival time and duration.",
    },
    {
      icon: <Clock className="h-6 w-6 text-white" />,
      color: "bg-emerald-500 dark:bg-emerald-600",
      title: "Park with Ease",
      description:
        "Arrive at the location, park your vehicle, and enjoy stress-free parking experience.",
    },
  ];

  return (
    <section className="py-20 relative" ref={ref}>
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-50/50 to-white dark:from-zinc-900/50 dark:to-black -z-10"></div>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-300 dark:via-zinc-700 to-transparent"></div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-300 dark:via-zinc-700 to-transparent"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800/30 mb-6">
              <span className="flex h-2 w-2 rounded-full bg-blue-500"></span>
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                How It Works
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-zinc-900 dark:text-zinc-100">
              Simple Process, <br />
              <span className="text-blue-600 dark:text-blue-400">
                Exceptional Results
              </span>
            </h2>

            <p className="text-lg text-zinc-600 dark:text-zinc-300 mb-8">
              Our straightforward booking process ensures you can find and
              secure parking in just minutes, saving you time and eliminating
              parking-related stress.
            </p>

            <div className="space-y-8">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  className="flex gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={
                    isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                  }
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                >
                  <div
                    className={`${step.color} h-12 w-12 rounded-lg flex items-center justify-center shrink-0 shadow-lg`}
                  >
                    {step.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-zinc-900 dark:text-zinc-100">
                      {step.title}
                    </h3>
                    <p className="text-zinc-600 dark:text-zinc-300">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-10">
              <Link to="/login">
                <Button className="h-12 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-600/20 group">
                  Find Parking Now
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Image */}
          <motion.div
            className="relative rounded-2xl overflow-hidden order-first lg:order-last"
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="aspect-[4/3] w-full">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-purple-600/20 dark:from-blue-600/10 dark:to-purple-600/10 rounded-2xl"></div>
              <img
                src="https://img.freepik.com/free-vector/parking-lot-isometric-composition_1284-20056.jpg"
                alt="ParkNGo mobile app demonstration"
                className="w-full h-full object-cover rounded-2xl"
              />

              {/* Overlays */}
              <div className="absolute top-4 right-4 bg-white/90 dark:bg-zinc-800/90 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-zinc-200 dark:border-zinc-700">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
                  <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    Spot Reserved
                  </span>
                </div>
              </div>

              <div className="absolute bottom-4 left-4 max-w-xs bg-white/90 dark:bg-zinc-800/90 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-zinc-200 dark:border-zinc-700">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                    <Car className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      Central Parking Garage
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      Spot B12 • Available for 2 hours
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default UserActions;
