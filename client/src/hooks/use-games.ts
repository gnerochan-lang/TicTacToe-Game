import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type CreateGameInput } from "@shared/routes";

// GET /api/games - List recent games
export function useGames() {
  return useQuery({
    queryKey: [api.games.list.path],
    queryFn: async () => {
      const res = await fetch(api.games.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch games history");
      return api.games.list.responses[200].parse(await res.json());
    },
  });
}

// POST /api/games - Save a finished game
export function useCreateGame() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateGameInput) => {
      const validated = api.games.create.input.parse(data);
      const res = await fetch(api.games.create.path, {
        method: api.games.create.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      
      if (!res.ok) {
        if (res.status === 400) {
          const error = api.games.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error('Failed to save game result');
      }
      
      return api.games.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      // Refresh the history list immediately after saving
      queryClient.invalidateQueries({ queryKey: [api.games.list.path] });
    },
  });
}
