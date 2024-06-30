import { useState, useEffect } from "react";
import { ThemeContext } from "../contexts";

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
   const [darkTheme, setDarkTheme] = useState<boolean>(false);

   const toggleTheme = () => {
      setDarkTheme((curr) => !curr);
   };

   useEffect(() => {
      const currentTheme = localStorage.getItem("theme");
      if (!currentTheme) {
         if (
            window.matchMedia &&
            window.matchMedia("(prefers-color-scheme: dark)").matches
         ) {
            setDarkTheme(true);
         }
      } else {
         setDarkTheme(currentTheme === "dark");
      }
   }, []);

   useEffect(() => {
      localStorage.setItem("theme", darkTheme ? "dark" : "light");
      document.body.className = darkTheme ? "theme-dark" : "theme-light";
   }, [darkTheme]);

   return (
      <ThemeContext.Provider value={{ darkTheme, toggleTheme }}>
         {children}
      </ThemeContext.Provider>
   );
};
