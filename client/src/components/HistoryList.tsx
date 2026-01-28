import { useGames } from "@/hooks/use-games";
import { formatDistanceToNow } from "date-fns";
import { History, Trophy, Minus, Trash2, CheckSquare, Square as SquareIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function HistoryList() {
  const { data: games, isLoading } = useGames();
  const { t } = useLanguage();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isBatchDeleting, setIsBatchDeleting] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/games/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/games"] });
      setSelectedIds(prev => prev.filter(id => id !== deleteId));
      setDeleteId(null);
    },
  });

  const batchDeleteMutation = useMutation({
    mutationFn: async (ids: number[]) => {
      await apiRequest("POST", "/api/games/batch-delete", { ids });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/games"] });
      setSelectedIds([]);
      setIsBatchDeleting(false);
    },
  });

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

  const toggleSelect = (id: number) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === recentGames.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(recentGames.map(g => g.id));
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-lg shadow-black/5 border border-border/50 overflow-hidden flex flex-col h-full max-h-[500px]">
        <div className="p-4 border-b border-border/50 bg-muted/30 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <History className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-bold text-lg font-display text-foreground">{t("matchHistory")}</h3>
          </div>
          
          {recentGames.length > 0 && (
            <div className="flex items-center gap-2">
              {selectedIds.length > 0 && (
                <Button
                  variant="destructive"
                  size="sm"
                  className="h-8 px-3 gap-2"
                  onClick={() => setIsBatchDeleting(true)}
                  disabled={batchDeleteMutation.isPending}
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="text-xs">{t("deleteSelected")} ({selectedIds.length})</span>
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={toggleSelectAll}
                title={selectedIds.length === recentGames.length ? "Deselect All" : "Select All"}
              >
                {selectedIds.length === recentGames.length ? <CheckSquare className="w-4 h-4" /> : <SquareIcon className="w-4 h-4" />}
              </Button>
            </div>
          )}
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
                className={cn(
                  "group flex items-center justify-between p-3 rounded-xl transition-colors border",
                  selectedIds.includes(game.id) ? "bg-primary/5 border-primary/20" : "hover:bg-muted/50 border-transparent hover:border-border/50"
                )}
              >
                <div className="flex items-center gap-3">
                  <Checkbox 
                    checked={selectedIds.includes(game.id)}
                    onCheckedChange={() => toggleSelect(game.id)}
                    className="w-4 h-4"
                  />
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
                
                <div className="flex items-center gap-2">
                  {game.winner !== 'draw' && (
                    <Trophy className={cn(
                      "w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity",
                      game.winner === 'X' ? "text-accent" : "text-secondary"
                    )} />
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => setDeleteId(game.id)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("deleteConfirmTitle")}</AlertDialogTitle>
            <AlertDialogDescription>{t("deleteConfirmDesc")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                if (deleteId) deleteMutation.mutate(deleteId);
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? t("confirming") : t("confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isBatchDeleting} onOpenChange={setIsBatchDeleting}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("deleteConfirmTitle")}</AlertDialogTitle>
            <AlertDialogDescription>{t("deleteConfirmDesc")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={batchDeleteMutation.isPending}>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                batchDeleteMutation.mutate(selectedIds);
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={batchDeleteMutation.isPending}
            >
              {batchDeleteMutation.isPending ? t("confirming") : t("confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
