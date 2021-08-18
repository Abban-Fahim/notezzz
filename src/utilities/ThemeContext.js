import { createContext } from "react";
import { useEffect, useState } from "react";

const ThemeContext = createContext();

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    let storedTheme = window.localStorage.getItem("theme");
    storedTheme ? setTheme(storedTheme) : setTheme("light");
  });

  return (
    <ThemeContext.Provider
      value={{
        theme: theme,
        toggleTheme: () => {
          if (theme === "light") {
            setTheme("dark");
            window.localStorage.setItem("theme", "dark");
          } else {
            setTheme("light");
            window.localStorage.setItem("theme", "light");
          }
        },
        setTheme: setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export { ThemeProvider, ThemeContext };
