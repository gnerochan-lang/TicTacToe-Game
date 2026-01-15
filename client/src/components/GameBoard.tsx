import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";
import { X, Circle, RefreshCw, Trophy } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

export type Player = "X" | "O" | null;
export type GameStatus = "playing" | "won" | "draw";

interface GameBoardProps {
  onGameEnd: (winner: "X" | "O" | "draw") => void;
}

export function GameBoard({ onGameEnd }: GameBoardProps) {
  const { t } = useLanguage();
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [status, setStatus] = useState<GameStatus>("playing");
  const [winningLine, setWinningLine] = useState<number[] | null>(null);

  const currentPlayer = isXNext ? "X" : "O";
// ... (calculateWinner, handleClick, resetGame, triggerConfetti remains the same)
  const calculateWinner = (squares: Player[]) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
      [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner: squares[a], line: lines[i] };
      }
    }
    return null;
  };

  const handleClick = (index: number) => {
    if (board[index] || status !== "playing") return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const result = calculateWinner(newBoard);
    
    if (result) {
      setStatus("won");
      setWinningLine(result.line);
      // winner should be based on result.winner, which is the player who just moved
      onGameEnd(result.winner as "X" | "O");
      triggerConfetti(result.winner === "X");
    } else if (!newBoard.includes(null)) {
      setStatus("draw");
      onGameEnd("draw");
    } else {
      setIsXNext(!isXNext);
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setStatus("playing");
    setWinningLine(null);
  };

  const triggerConfetti = (isXWinner: boolean) => {
    const end = Date.now() + 1000;
    const colors = isXWinner ? ['#ec4899', '#db2777'] : ['#06b6d4', '#0891b2'];

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-md mx-auto">
      {/* Status Header */}
      <div className="flex items-center justify-between w-full px-4 py-3 bg-white rounded-2xl shadow-sm border border-border/50">
        <div className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all duration-300",
          status === 'playing' && isXNext ? "bg-accent/10 ring-2 ring-accent/20" : "opacity-50 grayscale"
        )}>
          <X className="w-5 h-5 text-accent" strokeWidth={3} />
          <span className="font-bold text-accent font-display">{t("playerX")}</span>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-xs uppercase tracking-wider font-bold text-muted-foreground/60">{t("vs")}</span>
        </div>

        <div className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all duration-300",
          status === 'playing' && !isXNext ? "bg-secondary/10 ring-2 ring-secondary/20" : "opacity-50 grayscale"
        )}>
          <Circle className="w-5 h-5 text-secondary" strokeWidth={3} />
          <span className="font-bold text-secondary font-display">{t("playerO")}</span>
        </div>
      </div>

      {/* Game Grid */}
      <div className="relative p-4 bg-white rounded-[2rem] shadow-xl shadow-primary/5 border border-border/60">
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          {board.map((cell, index) => (
            <Square 
              key={index}
              value={cell}
              onClick={() => handleClick(index)}
              isWinning={winningLine?.includes(index)}
              disabled={status !== 'playing'}
              turn={isXNext ? "X" : "O"}
            />
          ))}
        </div>
        
        {/* Victory/Draw Overlay */}
        <AnimatePresence>
          {status !== 'playing' && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/60 backdrop-blur-sm rounded-[2rem]"
            >
              <motion.div 
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                className="bg-white p-6 rounded-2xl shadow-2xl border border-border text-center transform hover:scale-105 transition-transform"
              >
                {status === 'won' ? (
                  <>
                    <div className="flex justify-center mb-3">
                      <Trophy className={cn(
                        "w-12 h-12",
                        isXNext ? "text-secondary fill-secondary/20" : "text-accent fill-accent/20"
                      )} />
                    </div>
                    <h3 className="text-2xl font-black font-display text-foreground">
                      {isXNext ? t("playerO") : t("playerX")} {t("wins")}
                    </h3>
                  </>
                ) : (
                  <>
                     <div className="flex justify-center mb-3 text-muted-foreground">
                      <div className="flex -space-x-2">
                        <X className="w-10 h-10 opacity-50" />
                        <Circle className="w-10 h-10 opacity-50" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-black font-display text-muted-foreground">{t("draw")}</h3>
                  </>
                )}
                
                <button
                  onClick={resetGame}
                  className="mt-6 w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95 transition-all shadow-lg shadow-primary/25"
                >
                  <RefreshCw className="w-4 h-4" />
                  {t("playAgain")}
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Reset Button (only show if playing) */}
      {status === 'playing' && (
        <button 
          onClick={resetGame}
          className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 px-4 py-2 hover:bg-black/5 rounded-lg"
        >
          <RefreshCw className="w-4 h-4" />
          {t("restart")}
        </button>
      )}
    </div>
  );
}

interface SquareProps {
  value: Player;
  onClick: () => void;
  isWinning?: boolean;
  disabled: boolean;
  turn: "X" | "O";
}

function Square({ value, onClick, isWinning, disabled, turn }: SquareProps) {
  return (
    <motion.button
      whileHover={!value && !disabled ? { scale: 0.98 } : {}}
      whileTap={!value && !disabled ? { scale: 0.95 } : {}}
      onClick={onClick}
      disabled={!!value || disabled}
      className={cn(
        "relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl flex items-center justify-center text-4xl sm:text-5xl outline-none transition-all duration-300",
        // Background styles
        "bg-muted/30 hover:bg-muted/50 border-2 border-transparent",
        // Winning styles
        isWinning && value === "X" && "bg-accent/10 border-accent shadow-[0_0_20px_rgba(236,72,153,0.3)]",
        isWinning && value === "O" && "bg-secondary/10 border-secondary shadow-[0_0_20px_rgba(6,182,212,0.3)]",
        // Empty hover hint
        !value && !disabled && turn === "X" && "hover:border-accent/20 hover:bg-accent/5",
        !value && !disabled && turn === "O" && "hover:border-secondary/20 hover:bg-secondary/5",
      )}
    >
      <AnimatePresence>
        {value === "X" && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0, rotate: -45 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            className="text-accent drop-shadow-sm"
          >
            <X size={48} strokeWidth={3.5} className="sm:w-16 sm:h-16 font-handwriting" />
          </motion.div>
        )}
        {value === "O" && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-secondary drop-shadow-sm"
          >
            <Circle size={44} strokeWidth={3.5} className="sm:w-14 sm:h-14 font-handwriting" />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Ghost/Preview for hover */}
      {!value && !disabled && (
        <div className={cn(
          "absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-20 transition-opacity pointer-events-none",
          turn === "X" ? "text-accent" : "text-secondary"
        )}>
          {turn === "X" ? <X size={40} /> : <Circle size={36} />}
        </div>
      )}
    </motion.button>
  );
}
