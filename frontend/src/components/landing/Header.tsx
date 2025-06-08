import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Logo from "@/components/logo";
// Icons
import { MenuIcon, X } from "lucide-react";

interface HeaderProps {
  isMobile: boolean;
}

const Header = ({ isMobile }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Track scroll to change header appearance
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Smooth scroll handler for navigation links
  const handleNavClick = (href: string) => {
    setIsMenuOpen(false);
    setTimeout(() => {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 100); // Small delay to allow menu to close first
  };

  const navItems = [
    { name: "Home", href: "#hero" },
    { name: "Features", href: "#features" },
    { name: "Locations", href: "#locations" },
    { name: "Testimonials", href: "#testimonials" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 px-6 py-3 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md shadow-md"
          : "bg-transparent"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
    >
      <nav className="max-w-screen-xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group text-xl">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500 rounded-lg blur-sm group-hover:blur-md transition-all duration-300"></div>
          </div>
          <Logo />
        </Link>

        {/* Desktop Navigation Links */}
        {!isMobile && (
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-zinc-600 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors duration-200"
              >
                {item.name}
              </a>
            ))}
          </div>
        )}

        {/* Theme Toggle & Login Buttons */}
        <div className="flex items-center gap-3">
          {isMobile ? (
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
              className="p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5 text-zinc-600 dark:text-zinc-300" />
              ) : (
                <MenuIcon className="h-5 w-5 text-zinc-600 dark:text-zinc-300" />
              )}
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button
                  variant="outline"
                  className="border-blue-200 dark:border-blue-800/30 hover:border-blue-300 dark:hover:border-blue-700"
                >
                  Login
                </Button>
              </Link>
              <Link to="/admin/login">
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md shadow-blue-500/10 border border-blue-700/10">
                  Admin
                </Button>
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobile && isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mt-4 bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-zinc-100 dark:border-zinc-800 overflow-hidden"
          >
            <div className="flex flex-col py-2">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item.href)}
                  className="py-3 px-6 text-zinc-600 dark:text-zinc-300 hover:bg-blue-50 dark:hover:bg-blue-900/10 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-left"
                >
                  {item.name}
                </button>
              ))}
              <div className="border-t border-zinc-100 dark:border-zinc-800 my-2"></div>
              <div className="flex flex-col gap-2 px-4 py-2">
                <Link
                  to="/login"
                  className="w-full"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Button
                    variant="outline"
                    className="w-full border-blue-200 dark:border-blue-800/30"
                  >
                    Login
                  </Button>
                </Link>
                <Link
                  to="/admin/login"
                  className="w-full"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md shadow-blue-500/10">
                    Admin
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
