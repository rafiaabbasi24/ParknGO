"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  Quote, 
  MessageCircle, 
  Users,
  CheckCircle,
  MapPin
} from "lucide-react";

// --- Data for the main featured carousel ---
const friendTestimonials = [
  {
    quote:
      "Finding a parking spot after a long day at the office in Bangalore was always a challenge. ParkNGo has been a game-changer; I can now book a spot in minutes and head home without any hassle.",
    name: "Anurag Pipriya",
    title: "IT Professional, Bangalore",
    image: "https://res.cloudinary.com/dtqi9ael6/image/upload/v1754681089/ANNNJU_qoxyhf.jpg",
  },
  {
    quote:
      "Weekend trips to places like Connaught Place used to be a nightmare because of parking. With ParkNGo, that's a thing of the past. It's incredibly convenient and a must-have for any student in Delhi.",
    name: "Madrid Mandal",
    title: "Student, Delhi",
    image: "https://res.cloudinary.com/dtqi9ael6/image/upload/v1754681090/bullu_hh3abf.jpg",
  },
  {
    quote:
      "As a startup founder in Mumbai, managing logistics like employee parking was a constant challenge. ParkNGo provided a seamless, automated solution that saved us time and effort. The reporting features are a fantastic bonus for managing expenses.",
    name: "Sahil Saroj",
    title: "Startup Founder, Mumbai",
    image: "https://res.cloudinary.com/dtqi9ael6/image/upload/v1754681088/SAAHIL_qp39ug.jpg",
  },
];

// --- Data for the smaller review cards below ---
const genericTestimonials = [
  {
    quote:
      "The real-time availability is surprisingly accurate. I used to waste so much time searching for a spot in Chennai's T. Nagar, but now I book in advance and it's completely hassle-free.",
    name: "Priya Krishnan",
    title: "Marketing Executive, Chennai",
    gender: "women",
  },
  {
    quote:
      "A very well-designed app. The interface is clean, payments are quick, and it has never failed me. It's a must-have for anyone driving in a metro city like Kolkata.",
    name: "Arjun Bannerjee",
    title: "Architect, Kolkata",
    gender: "men",
  },
  {
    quote:
      "I was skeptical at first, but ParkNGo has genuinely made my daily commute to the office in Hyderabad much less stressful. The pre-booking feature is a lifesaver.",
    name: "Sneha Reddy",
    title: "Software Engineer, Hyderabad",
    gender: "women",
  },
];


export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const [autoplay, setAutoplay] = useState(true);
  const navigate = useNavigate(); // Initialize navigate hook
  
  // Autoplay functionality for the main carousel
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (autoplay) {
      interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % friendTestimonials.length);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [autoplay]);
  
  // Navigation functions for the main carousel
  const next = () => {
    setAutoplay(false);
    setCurrentIndex((prev) => (prev + 1) % friendTestimonials.length);
  };
  
  const prev = () => {
    setAutoplay(false);
    setCurrentIndex((prev) => (prev - 1 + friendTestimonials.length) % friendTestimonials.length);
  };
  
  const goToTestimonial = (index: number) => {
    setAutoplay(false);
    setCurrentIndex(index);
  };

  return (
    <section
      id="testimonials"
      ref={containerRef}
      className="py-24 bg-gradient-to-b from-white to-blue-50/30 dark:from-black dark:to-blue-950/10 relative overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]"
             style={{
               backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'60\' height=\'60\' viewBox=\'0 0 60 60\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%239C92AC\' fill-opacity=\'0.2\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
               backgroundSize: '40px 40px'
             }}
        ></div>
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-blue-200/20 dark:bg-blue-900/10 rounded-full filter blur-[100px]"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-200/20 dark:bg-indigo-900/10 rounded-full filter blur-[100px]"></div>
      </div>
      
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Section header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-4 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium border border-blue-100 dark:border-blue-800/30">
            <MessageCircle className="h-3.5 w-3.5" />
            <span>Customer Stories</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 pb-1 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
            What Our Users Say
          </h2>
          <p className="text-lg text-zinc-600 dark:text-zinc-300 max-w-2xl mx-auto">
            Discover how ParkNGo has transformed the parking experience for thousands of satisfied customers
          </p>
        </motion.div>
        
        {/* Featured testimonial carousel */}
        <div className="mb-20 overflow-hidden">
          <div className="max-w-6xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.2, type: "tween",ease: "backInOut" }}
                className="relative"
              >
                <div className="absolute -left-4 -top-4 md:-left-8 md:-top-8 text-blue-100 dark:text-blue-900/50">
                  <Quote className="w-16 h-16 md:w-24 md:h-24" strokeWidth={1} />
                </div>
                <div className="bg-white dark:bg-zinc-900 rounded-2xl p-8 md:p-10 shadow-xl border border-blue-100 dark:border-blue-900/30 relative z-10">
                  <div className="flex flex-col md:flex-row gap-8 items-start">
                    <div className="relative">
                      <div className="absolute -inset-1 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full opacity-70 blur-sm"></div>
                      <div className="relative flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-white dark:border-zinc-800">
                        <img 
                          src={friendTestimonials[currentIndex].image} 
                          alt={friendTestimonials[currentIndex].name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="mb-4 flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={18} className="fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <blockquote className="mb-6">
                        <p className="text-lg md:text-xl text-zinc-700 dark:text-zinc-200 italic leading-relaxed">
                          "{friendTestimonials[currentIndex].quote}"
                        </p>
                      </blockquote>
                      <div className="flex justify-between items-end">
                        <div>
                          <h4 className="text-xl font-bold text-zinc-900 dark:text-white">
                            {friendTestimonials[currentIndex].name}
                          </h4>
                          <p className="text-blue-600 dark:text-blue-400">
                            {friendTestimonials[currentIndex].title}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full text-xs text-blue-700 dark:text-blue-300 font-medium border border-blue-100 dark:border-blue-800/30">
                          <CheckCircle className="h-3 w-3" />
                          <span>Verified User</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
            
            <div className="flex justify-between mt-8">
              <div className="flex gap-2">
                {friendTestimonials.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => goToTestimonial(idx)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      currentIndex === idx 
                        ? "bg-blue-600 dark:bg-blue-400 w-8" 
                        : "bg-blue-200 dark:bg-blue-800 hover:bg-blue-300 dark:hover:bg-blue-700"
                    }`}
                    aria-label={`Go to testimonial ${idx + 1}`}
                  />
                ))}
              </div>
              <div className="flex gap-3">
                <motion.button 
                  onClick={prev}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-full bg-white dark:bg-zinc-800 border border-blue-100 dark:border-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors shadow-sm"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft size={20} />
                </motion.button>
                <motion.button 
                  onClick={next}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-full bg-white dark:bg-zinc-800 border border-blue-100 dark:border-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors shadow-sm"
                  aria-label="Next testimonial"
                >
                  <ChevronRight size={20} />
                </motion.button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Stats and trust indicators */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-5xl mx-auto mb-16"
        >
          {[
            { number: "15K+", label: "Active Users", icon: <Users className="h-4 w-4" /> },
            { number: "50+", label: "Locations", icon: <MapPin className="h-4 w-4" /> },
            { number: "4.9", label: "Average Rating", icon: <Star className="h-4 w-4" /> },
            { number: "99%", label: "Satisfaction Rate", icon: <CheckCircle className="h-4 w-4" /> }
          ].map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm rounded-xl p-4 border border-blue-100 dark:border-blue-900/30 shadow-sm text-center"
            >
              <div className="flex justify-center mb-2">
                <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800/30">
                  {stat.icon}
                </div>
              </div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stat.number}</div>
              <div className="text-sm text-zinc-600 dark:text-zinc-400">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Multiple testimonials grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {genericTestimonials.map((testimonial, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.4, delay: 0.1 + idx * 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm rounded-xl p-6 border border-blue-100 dark:border-blue-900/30 shadow-md"
            >
              <div className="mb-4 flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                ))}
              </div>
              <blockquote className="mb-6">
                <p className="text-zinc-700 dark:text-zinc-300 text-sm leading-relaxed line-clamp-4">
                  "{testimonial.quote}"
                </p>
              </blockquote>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full overflow-hidden">
                  <img 
                    src={`https://randomuser.me/api/portraits/${testimonial.gender}/${40 + idx}.jpg`}
                    alt={testimonial.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h5 className="font-medium text-zinc-900 dark:text-zinc-100 text-sm">{testimonial.name}</h5>
                  <p className="text-xs text-blue-600 dark:text-blue-400">{testimonial.title}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Final CTA */}
        <div className="mt-16 text-center">
          <motion.button
            onClick={() => navigate('/register')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-full shadow-lg shadow-blue-500/20 transition-all duration-200 border border-blue-700/10"
          >
            <Users className="h-4 w-4" />
            <span>Join Thousands of Happy Customers</span>
          </motion.button>
        </div>
      </div>
    </section>
  );
}
