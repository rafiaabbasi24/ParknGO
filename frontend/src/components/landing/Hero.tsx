import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ThemeContext } from "@/context/ThemeContext";
import { useContext } from "react";
// Icons
import { MapPin, Clock, Shield, ChevronRight } from "lucide-react";

interface HeroProps {
  scrollY: number;
}

const Hero = ({ scrollY }: HeroProps) => {
  const { theme } = useContext(ThemeContext);

  return (
    <section
      id="hero"
      className="relative pt-28 pb-20 md:pt-36 md:pb-24 overflow-hidden"
    >
      {/* Animated gradient circles */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-100 dark:bg-blue-900/20 rounded-full mix-blend-multiply dark:mix-blend-soft-light blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-100 dark:bg-purple-900/20 rounded-full mix-blend-multiply dark:mix-blend-soft-light blur-3xl opacity-70 animate-blob animation-delay-4000"></div>

      <div className="mx-auto px-4 sm:px-6 relative">
        {/* HERO CONTENT */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left column - text content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2 mb-6">
              <div className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium border border-blue-100 dark:border-blue-800/30">
                Reimagining Urban Parking
              </div>
            </div>

            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-700 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-500"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              style={{
                transform: `translateY(${scrollY * 0.1}px)`,
              }}
            >
              <div className="">Book Your Spot</div>
              <div className="text-black dark:text-white mt-2">
                Park with Ease.
              </div>
              <div className="mt-2 h-1 w-24 bg-gradient-to-r from-blue-500 to-violet-500 dark:from-blue-400 dark:to-violet-400 rounded-full" />
            </motion.h1>

            <motion.p
              className="text-lg text-zinc-600 dark:text-zinc-300 mb-8 max-w-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Find and reserve parking spots in advance with our intuitive
              platform. Save time, reduce stress, and never worry about parking
              again.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Link to="/register">
                <Button className="w-full sm:w-auto h-12 px-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-500 dark:to-indigo-500 text-white shadow-lg shadow-blue-600/20 dark:shadow-blue-500/20 group">
                  Get Started
                  <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <a href="#features">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto h-12 border-blue-200 dark:border-blue-800/30 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-700 dark:text-blue-400"
                >
                  Learn More
                </Button>
              </a>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              className="mt-8 flex items-center gap-6 text-zinc-500 dark:text-zinc-400 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
                <span>50+ Locations</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-amber-500 dark:text-amber-400" />
                <span>24/7 Service</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Shield className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                <span>Secure Booking</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right column - image/illustration */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            style={{
              transform: `translateY(${-scrollY * 0.05}px)`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 dark:from-blue-500/10 dark:to-purple-500/10 rounded-3xl blur-xl transform -rotate-2"></div>

            <div className="relative bg-white dark:bg-zinc-800 rounded-3xl p-3 shadow-xl border border-zinc-200 dark:border-zinc-700 transform rotate-1 hover:rotate-0 transition-transform duration-500">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                <img
                  src={
                    theme === "dark"
                      ? "https://img.freepik.com/premium-photo/car-parked-designated-spot_1375194-69289.jpg?w=2000"
                      : "https://img.freepik.com/premium-photo/car-parked-designated-spot_1375194-69289.jpg?w=2000"
                  }
                  alt="Smart parking illustration"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Floating badge */}
              <div className="absolute -bottom-5 -right-5 bg-white dark:bg-zinc-800 rounded-xl p-3 shadow-lg border border-zinc-200 dark:border-zinc-700 flex items-center gap-2 animate-bounce-slow">
                <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    Book in Seconds
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Hassle-free parking
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
