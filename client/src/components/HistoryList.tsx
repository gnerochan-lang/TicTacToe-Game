import { useGames } from "@/hooks/use-games";
import { formatDistanceToNow } from "date-fns";
import { History, Trophy, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n";

export function HistoryList() {
  const { data: games, isLoading } = useGames();
  const { t } = useLanguage();

  if (isLoading) {
    return (
      <div className="w-full h-48 flex items-center justify-center bg-white/50 rounded-2xl border border-dashed border-border">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const recentGames = games ? [...games].sort((a, b) => 
    new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
  ).slice(0, 10) : [];

  return (
    <div className="bg-white rounded-2xl shadow-lg shadow-black/5 border border-border/50 overflow-hidden flex flex-col h-full max-h-[500px]">
      <div className="p-4 border-b border-border/50 bg-muted/30 flex items-center gap-2">
        <div className="p-2 bg-primary/10 rounded-lg">
          <History className="w-5 h-5 text-primary" />
        </div>
        <h3 className="font-bold text-lg font-display text-foreground">{t("matchHistory")}</h3>
      </div>
      
      <div className="overflow-y-auto p-2 space-y-2 flex-1 custom-scrollbar">
        {recentGames.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-muted-foreground gap-2">
            <Minus className="w-8 h-8 opacity-20" />
            <p className="text-sm">{t("noMatches")}</p>
          </div>
        ) : (
          recentGames.map((game) => (
            <div 
              key={game.id} 
              className="group flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors border border-transparent hover:border-border/50"
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center font-black font-display text-lg shadow-sm border",
                  game.winner === 'X' ? "bg-accent/10 text-accent border-accent/20" : 
                  game.winner === 'O' ? "bg-secondary/10 text-secondary border-secondary/20" :
                  "bg-muted text-muted-foreground border-border"
                )}>
                  {game.winner === 'draw' ? '=' : game.winner}
                </div>
                <div>
                  <p className="font-bold text-sm text-foreground">
                    {game.winner === 'draw' ? t("drawHistory") : `${game.winner} ${t("won")}`}
                  </p>
                  <p className="text-xs text-muted-foreground font-medium">
                    {game.createdAt ? formatDistanceToNow(new Date(game.createdAt), { addSuffix: true }) : 'Just now'}
                  </p>
                </div>
              </div>
              
              {game.winner !== 'draw' && (
                <Trophy className={cn(
                  "w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity",
                  game.winner === 'X' ? "text-accent" : "text-secondary"
                )} />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
