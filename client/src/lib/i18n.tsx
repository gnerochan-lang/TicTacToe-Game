import { createContext, useContext, useState, ReactNode, useEffect } from "react";

type Language = "en" | "zh";

interface Translations {
  [key: string]: {
    [key in Language]: string;
  };
}

const translations: Translations = {
  title: {
    en: "Tic-Tac-Toe",
    zh: "井字過三關",
  },
  subtitle: {
    en: "A classic game for two players. Get three in a row to win!",
    zh: "經典雙人對戰遊戲，連成三線即獲勝！",
  },
  playerX: {
    en: "Player X",
    zh: "玩家 X",
  },
  playerO: {
    en: "Player O",
    zh: "玩家 O",
  },
  vs: {
    en: "VS",
    zh: "對戰",
  },
  wins: {
    en: "Wins!",
    zh: "獲勝！",
  },
  draw: {
    en: "It's a Draw!",
    zh: "平手！",
  },
  playAgain: {
    en: "Play Again",
    zh: "再玩一次",
  },
  restart: {
    en: "Restart Game",
    zh: "重啟遊戲",
  },
  matchHistory: {
    en: "Match History",
    zh: "對戰紀錄",
  },
  noMatches: {
    en: "No matches played yet.",
    zh: "尚無對戰紀錄",
  },
  won: {
    en: "Won",
    zh: "獲勝",
  },
  drawHistory: {
    en: "Draw",
    zh: "平手",
  },
  footer: {
    en: "© 2024 Arcade Classics. Built with React & Tailwind.",
    zh: "© 2024 街機經典。使用 React & Tailwind 構建。",
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem("app-language");
    return (saved as Language) || "zh";
  });

  useEffect(() => {
    localStorage.setItem("app-language", language);
  }, [language]);

  const t = (key: string) => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
