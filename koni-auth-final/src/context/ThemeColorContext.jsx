import { createContext, useContext, useState, useEffect } from "react";

export const THEMES = {
  merahKlasik: {
    label: "Merah Klasik",
    emoji: "🔴",
    primary: "#CC0000",
    gold: "#B8960C",
    navy: "#0A1628",
    navyMid: "#132040",
  },
  navyGold: {
    label: "Navy Gold",
    emoji: "🟡",
    primary: "#1E3A5F",
    gold: "#D4AF37",
    navy: "#060D1A",
    navyMid: "#0A1628",
  },
  hijauNasional: {
    label: "Hijau Nasional",
    emoji: "🟢",
    primary: "#065F46",
    gold: "#34D399",
    navy: "#022C22",
    navyMid: "#064E3B",
  },
  ungguPrestasi: {
    label: "Ungu Prestasi",
    emoji: "🟣",
    primary: "#6D28D9",
    gold: "#A78BFA",
    navy: "#1E1B4B",
    navyMid: "#2D2867",
  },
};

const ThemeColorContext = createContext(null);

export function ThemeColorProvider({ children }) {
  const [themeKey, setThemeKey] = useState(() =>
    localStorage.getItem("koni-color-theme") || "merahKlasik"
  );

  useEffect(() => {
    localStorage.setItem("koni-color-theme", themeKey);
    const t = THEMES[themeKey];
    const root = document.documentElement;
    root.style.setProperty("--koni-primary", t.primary);
    root.style.setProperty("--koni-gold", t.gold);
    root.style.setProperty("--koni-navy", t.navy);
    root.style.setProperty("--koni-navy-mid", t.navyMid);
  }, [themeKey]);

  return (
    <ThemeColorContext.Provider value={{ themeKey, setThemeKey, themes: THEMES, current: THEMES[themeKey] }}>
      {children}
    </ThemeColorContext.Provider>
  );
}

export const useThemeColor = () => useContext(ThemeColorContext);
