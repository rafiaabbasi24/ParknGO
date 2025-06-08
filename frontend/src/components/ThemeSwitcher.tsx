import { ThemeContext } from "@/context/ThemeContext";
import { Moon, Sun } from "lucide-react";
import { useContext } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
const ThemeSwitcher = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: 0.3,
      }}
    >
      <Button
        onClick={toggleTheme}
        size="icon"
        variant="outline"
        className="h-12 w-12 rounded-full shadow-lg bg-white dark:bg-zinc-900 border border-blue-100 dark:border-blue-900/30 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/30"
        aria-label="Toggle theme"
      >
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: theme === "dark" ? 360 : 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="text-blue-600 dark:text-blue-400"
        >
          {theme === "dark" ? (
            <Moon className="h-5 w-5" />
          ) : (
            <Sun className="h-5 w-5" />
          )}
        </motion.div>
      </Button>
    </motion.div>
  );
};

export default ThemeSwitcher;
