"use client";

import { useState, useEffect } from "react";
import Header from "../components/landing/Header";
import Hero from "../components/landing/Hero";
import Features from "../components/landing/Features";
import UserActions from "../components/landing/UserActions";
import AdminPreview from "../components/landing/AdminPreview";
import Locations from "../components/landing/Locations";
import Testimonials from "../components/landing/Testimonials";
import CTA from "../components/landing/CTA";
import Footer from "../components/landing/Footer";
import { motion } from "framer-motion";

export default function Home() {
  const [currentCityIndex, setCurrentCityIndex] = useState<number>(0);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [scrollY, setScrollY] = useState<number>(0);

  // Check if mobile and track scroll position for parallax effects
  useEffect(() => {
    const checkIfMobile = (): void => setIsMobile(window.innerWidth < 768);
    const handleScroll = () => setScrollY(window.scrollY);
    
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    window.addEventListener("scroll", handleScroll);
    
    return () => {
      window.removeEventListener("resize", checkIfMobile);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-white via-blue-50/30 to-white dark:from-black dark:via-blue-950/10 dark:to-black text-zinc-900 dark:text-zinc-100">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 right-0 h-[800px] overflow-hidden -z-10">
        <div className="absolute top-[-350px] left-[-300px] w-[900px] h-[900px] bg-blue-100/40 dark:bg-blue-900/10 rounded-full blur-3xl"></div>
        <div className="absolute top-[-250px] right-[-300px] w-[800px] h-[800px] bg-indigo-100/30 dark:bg-indigo-900/10 rounded-full blur-3xl"></div>
      </div>
      
      <div 
        className="absolute inset-0 opacity-20 dark:opacity-30 -z-10"
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        }}
      ></div>

      <div className="relative max-w-[84rem] mx-auto px-4 sm:px-6 lg:px-8">
        <Header isMobile={isMobile} />
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Hero scrollY={scrollY} />
          <Features />
          <UserActions />
          <AdminPreview />
          <Locations 
            currentCityIndex={currentCityIndex} 
            setCurrentCityIndex={setCurrentCityIndex} 
          />
          <Testimonials />
          <CTA />
          <Footer />
        </motion.div>
      </div>
    </div>
  );
}