import { createContext, useEffect, useState, ReactNode } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(
    (localStorage.getItem("theme") as Theme) || "dark"
  );

  useEffect(() => {
    localStorage.setItem("theme", theme);

    // Apply dark class to <html> for portal components like Dialog
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div
        className={`${
          theme === "dark" ? "bg-black text-white" : "bg-white text-black"
        } min-h-screen`}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
};
