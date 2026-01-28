import { GameBoard } from "@/components/GameBoard";
import { HistoryList } from "@/components/HistoryList";
import { useCreateGame } from "@/hooks/use-games";
import { useLanguage } from "@/lib/i18n";
import { motion } from "framer-motion";
import { Gamepad2, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { mutate: saveGame } = useCreateGame();
  const { t, language, setLanguage } = useLanguage();

  const handleGameEnd = (winner: "X" | "O" | "draw") => {
    saveGame({ winner });
  };

  return (
    <div className="min-h-screen relative overflow-hidden font-body">
      {/* Abstract Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl mix-blend-screen filter animate-pulse" />
        <div className="absolute top-0 -right-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl mix-blend-screen filter animate-pulse delay-700" />
        <div className="absolute -bottom-40 left-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl mix-blend-screen filter animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 lg:py-12 max-w-6xl">
        <div className="absolute top-4 right-4 flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLanguage(language === "en" ? "zh" : "en")}
            className="flex items-center gap-2 text-white/60 hover:text-white hover:bg-white/10"
          >
            <Languages className="w-4 h-4" />
            {language === "en" ? "中文" : "English"}
          </Button>
        </div>

        <header className="mb-12 text-center">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="inline-flex items-center justify-center p-4 bg-black/40 backdrop-blur-xl rounded-[2rem] shadow-[0_0_30px_rgba(0,0,0,0.5)] mb-6 border border-white/10">
              <Gamepad2 className="w-10 h-10 text-primary mr-4 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white font-display">
                {language === "zh" ? (
                  <span className="drop-shadow-[0_0_10px_rgba(251,191,36,0.4)]">
                    {t("title")}
                  </span>
                ) : (
                  <>
                    <span className="text-accent drop-shadow-[0_0_10px_rgba(236,72,153,0.6)]">Tic</span>
                    <span className="text-white/20 mx-1">/</span>
                    <span className="text-primary drop-shadow-[0_0_10px_rgba(251,191,36,0.6)]">Tac</span>
                    <span className="text-white/20 mx-1">/</span>
                    <span className="text-secondary drop-shadow-[0_0_10px_rgba(6,182,212,0.6)]">Toe</span>
                  </>
                )}
              </h1>
            </div>
            <p className="text-white/60 font-medium text-lg max-w-md mx-auto drop-shadow-sm">
              {t("subtitle")}
            </p>
          </motion.div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Game Board */}
          <div className="lg:col-span-7 xl:col-span-8 order-2 lg:order-1">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <GameBoard onGameEnd={handleGameEnd} />
            </motion.div>
          </div>

          {/* Right Column: History Sidebar */}
          <div className="lg:col-span-5 xl:col-span-4 order-1 lg:order-2 h-full">
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="h-full"
            >
              <HistoryList />
            </motion.div>
          </div>
        </main>
        
        <footer className="mt-16 text-center text-sm text-white/30 font-medium">
          <p>{t("footer")}</p>
        </footer>
      </div>
    </div>
  );
}
