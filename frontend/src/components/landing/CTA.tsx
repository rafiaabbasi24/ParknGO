import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { useRef } from "react";
import { useInView } from "framer-motion";

// Icons
import { ArrowRight, CheckCircle, Star, Shield } from "lucide-react";

export default function CTA() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section
      id="contact"
      ref={ref}
      className="py-24 relative overflow-hidden bg-gradient-to-b from-white to-blue-50/30 dark:from-black dark:to-blue-950/10"
    >
      {/* Enhanced background elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Subtle pattern */}
        <div
          className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'60\' height=\'60\' viewBox=\'0 0 60 60\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%239C92AC\' fill-opacity=\'0.2\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            backgroundSize: "40px 40px",
          }}
        ></div>

        {/* Gradient blobs with better positioning */}
        <div className="absolute right-0 top-0 w-2/3 h-2/3 bg-blue-200/20 dark:bg-blue-900/10 rounded-full -mr-32 -mt-32 filter blur-3xl"></div>
        <div className="absolute left-0 bottom-0 w-2/3 h-2/3 bg-indigo-200/20 dark:bg-indigo-900/10 rounded-full -ml-32 -mb-32 filter blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-32 bg-gradient-to-r from-blue-200/30 to-indigo-200/30 dark:from-blue-800/10 dark:to-indigo-800/10 blur-3xl opacity-50"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 max-w-7xl relative z-10">
        {/* Premium card design with glass effect */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl mx-auto rounded-3xl overflow-hidden shadow-2xl bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md border border-blue-100 dark:border-blue-900/30"
        >
          <div className="px-8 py-12 md:px-12 md:py-16">
            <motion.div className="text-center space-y-8">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium border border-blue-100 dark:border-blue-800/30"
              >
                <Star className="h-3.5 w-3.5 fill-blue-500" />
                <span>Start Your Journey Today</span>
              </motion.div>

              {/* Heading with modern gradient text */}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 leading-tight"
              >
                Transform Your Parking Experience
              </motion.h2>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-xl text-zinc-600 dark:text-zinc-300 max-w-2xl mx-auto"
              >
                Join thousands of users who have simplified their parking with our
                intelligent platform. Say goodbye to parking stress forever.
              </motion.p>

              {/* CTA buttons with improved styling */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-5 justify-center mt-8"
              >
                <Button
                  asChild
                  size="lg"
                  className="group h-14 px-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-500 dark:to-indigo-500 dark:hover:from-blue-400 dark:hover:to-indigo-400 text-white dark:text-zinc-900 font-medium rounded-full shadow-lg shadow-blue-500/20 dark:shadow-blue-400/5 border border-blue-700/10 dark:border-blue-300/20 transition-all duration-300"
                >
                  <Link to="/register" className="flex items-center gap-2">
                    <span>Create Free Account</span>
                    <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </Button>

                {/* <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="h-14 px-8 border-blue-200 dark:border-blue-800/30 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full transition-all duration-300"
                >
                  <Link to="/contact" className="flex items-center gap-2">
                    <span>Contact Sales</span>
                  </Link>
                </Button> */}
              </motion.div>

              {/* Trust indicators */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="pt-8 pb-2"
              >
                <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
                  <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                    <CheckCircle className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
                    <span>No credit card required</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                    <CheckCircle className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
                    <span>Free plan available</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                    <Shield className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
                    <span>Secure & reliable</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Customer logos or additional trust indicators could go here */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <p className="text-sm text-blue-600/60 dark:text-blue-400/60 font-medium uppercase tracking-wider mb-4">
            Trusted by leading companies
          </p>
          <div className="flex justify-center items-center gap-8 flex-wrap opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
            {/* Example company logos - replace with actual logos */}
            {["Adobe", "SAP", "Jio", "TATA"].map(
              (company, index) => (
                <div key={index} className="py-2">
                  <div className="h-8 bg-blue-100 dark:bg-blue-900/20 px-5 rounded-md flex items-center justify-center text-blue-800 dark:text-blue-200 font-semibold">
                    {company}
                  </div>
                </div>
              )
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}