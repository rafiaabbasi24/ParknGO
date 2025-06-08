"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Logo from "@/components/logo";
// ShadCN UI components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Icons
import {
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  MapPin,
  Mail,
  Phone,
  Send,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // Here you would typically call an API to handle the subscription
      console.log(`Subscribing email: ${email}`);
      setIsSubscribed(true);
      setEmail("");

      // Reset the subscription success message after 5 seconds
      setTimeout(() => {
        setIsSubscribed(false);
      }, 5000);
    }
  };

  // --- FIX: Smooth scroll handler for navigation links ---
  const handleNavClick = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer
      id="contact"
      className="relative pt-20 pb-10 overflow-hidden bg-gradient-to-b from-white to-blue-50/30 dark:from-black dark:to-blue-950/10"
    >
      {/* Decorative elements */}
      <div
        className="absolute inset-0 -z-10 opacity-[0.015] dark:opacity-[0.03]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          backgroundSize: "40px 40px",
        }}
      ></div>

      {/* Gradient blobs */}
      <div className="absolute top-10 left-0 w-96 h-96 bg-blue-200/20 dark:bg-blue-900/10 rounded-full filter blur-[100px] -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-indigo-200/20 dark:bg-indigo-900/10 rounded-full filter blur-[100px] translate-x-1/2 translate-y-1/2"></div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 max-w-7xl">
        {/* Top section with logo, desc and newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pb-16 border-b border-blue-100 dark:border-blue-900/30">
          {/* Logo and description */}
          <div className="space-y-6">
            <Link to="/" className="inline-flex items-center gap-2 group text-2xl">
              <Logo />
            </Link>

            <p className="text-zinc-600 dark:text-zinc-300 max-w-lg">
              The modern solution to find and book parking spaces in real-time.
              ParkNGo simplifies your parking experience with smart
              technology and seamless reservations.
            </p>

            <div className="flex flex-wrap gap-4">
              {[
                { icon: <Facebook size={18} />, name: "Facebook", href: "https://facebook.com" },
                { icon: <Twitter size={18} />, name: "Twitter", href: "https://twitter.com" },
                { icon: <Linkedin size={18} />, name: "LinkedIn", href: "https://linkedin.com" },
                { icon: <Instagram size={18} />, name: "Instagram", href: "https://instagram.com" },
              ].map((social, i) => (
                <motion.a
                  key={i}
                  href={social.href}
                  target="_blank" // Open social media in a new tab
                  rel="noopener noreferrer"
                  aria-label={`Follow us on ${social.name}`}
                  className="w-10 h-10 rounded-full bg-white dark:bg-zinc-800 border border-blue-100 dark:border-blue-900/30 flex items-center justify-center text-blue-500 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:border-blue-200 dark:hover:border-blue-700/50 hover:scale-110 transition-all duration-200"
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Newsletter subscription */}
          <div className="lg:ml-auto lg:max-w-md">
            <h3 className="text-lg font-bold mb-3 text-zinc-800 dark:text-zinc-100">
              Subscribe to our Newsletter
            </h3>
            <p className="text-zinc-600 dark:text-zinc-300 mb-5">
              Stay updated with the latest features, tips, and parking
              availability in your area.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-4">
              <div className="relative">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="pr-10 h-12 bg-white/80 dark:bg-zinc-900/80 border-blue-100 dark:border-blue-900/30 rounded-lg focus-visible:ring-2 focus-visible:ring-blue-500/30 focus-visible:ring-offset-0"
                  required
                />
                <Mail className="absolute right-3 top-3 h-5 w-5 text-blue-400/70 dark:text-blue-500/70" />
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/10 border border-blue-700/10"
              >
                <span>Subscribe</span>
                <Send className="ml-2 h-4 w-4" />
              </Button>

              {isSubscribed && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Thank you for subscribing!</span>
                </motion.div>
              )}

              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </form>
          </div>
        </div>

        {/* Links and Contact Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 py-12">
          {/* Quick Links */}
          <div className="md:col-span-3">
            <h3 className="text-lg font-semibold mb-5 text-zinc-900 dark:text-zinc-100">
              Company
            </h3>
            <ul className="space-y-3">
              {[
                { name: "Features", href: "#features" },
                { name: "Locations", href: "#locations" },
                { name: "Testimonials", href: "#testimonials" },
                { name: "Contact", href: "#contact" },
              ].map((item, i) => (
                <li key={i}>
                  <a
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(item.href);
                    }}
                    className="cursor-pointer text-zinc-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2 group"
                  >
                    <span className="h-1 w-0 rounded-full bg-blue-500 dark:bg-blue-400 group-hover:w-3 transition-all duration-300"></span>
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <h3 className="text-lg font-semibold mb-5 text-zinc-900 dark:text-zinc-100">
              Services
            </h3>
            <ul className="space-y-3">
              {[
                { name: "Hourly Parking", href: "#features" },
                { name: "Monthly Passes", href: "#features" },
                { name: "Reserved Spots", href: "#features" },
                { name: "EV Charging", href: "#features" },
              ].map((item, i) => (
                <li key={i}>
                  <a
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(item.href);
                    }}
                    className="cursor-pointer text-zinc-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2 group"
                  >
                    <span className="h-1 w-0 rounded-full bg-blue-500 dark:bg-blue-400 group-hover:w-3 transition-all duration-300"></span>
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <h3 className="text-lg font-semibold mb-5 text-zinc-900 dark:text-zinc-100">
              Resources
            </h3>
            <ul className="space-y-3">
              {[
                { name: "Help Center", href: "/login" },
                { name: "Blog", href: "/" },
                { name: "Partners", href: "/" },
              ].map((item, i) => (
                <li key={i}>
                  <Link
                    to={item.href}
                    className="text-zinc-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2 group"
                  >
                    <span className="h-1 w-0 rounded-full bg-blue-500 dark:bg-blue-400 group-hover:w-3 transition-all duration-300"></span>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-3">
            <h3 className="text-lg font-semibold mb-5 text-zinc-900 dark:text-zinc-100">
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 group">
                <div className="mt-1 p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-500 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300">
                  <MapPin className="h-4 w-4" />
                </div>
                <span className="text-zinc-600 dark:text-zinc-400">
                  Suite 720, Connaught Business Centre
                  <br />
                  Outer Circle, New Delhi, 110001
                </span>
              </li>
              <li className="flex items-center gap-3 group">
                <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-500 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300">
                  <Mail className="h-4 w-4" />
                </div>
                <a
                  href="mailto:support@parkngo.com"
                  className="text-zinc-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  support@parkngo.com
                </a>
              </li>
              <li className="flex items-center gap-3 group">
                <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-500 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300">
                  <Phone className="h-4 w-4" />
                </div>
                <a
                  href="tel:+911145678901"
                  className="text-zinc-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  +91 (11) 4567-8901
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="pt-8 border-t border-blue-100 dark:border-blue-900/30">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              © {currentYear} ParkNGo. All rights reserved.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-6">
              {[
                { name: "Terms", href: "/" },
                { name: "Privacy", href: "/" },
                { name: "Cookies", href: "/" },
              ].map((item, i) => (
                <Link
                  key={i}
                  to={item.href}
                  className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Made with love note */}
          <div className="flex items-center justify-center mt-6">
            <p className="text-xs text-zinc-400 dark:text-zinc-500">
              Engineering a smarter way to park !
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
