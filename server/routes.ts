import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.get(api.games.list.path, async (req, res) => {
    const games = await storage.getGames();
    res.json(games);
  });

  app.post(api.games.create.path, async (req, res) => {
    try {
      const input = api.games.create.input.parse(req.body);
      const game = await storage.createGame(input);
      res.status(201).json(game);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.delete("/api/games/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }
    await storage.deleteGame(id);
    res.sendStatus(204);
  });

  app.post("/api/games/batch-delete", async (req, res) => {
    const { ids } = req.body;
    if (!Array.isArray(ids)) {
      return res.status(400).json({ message: "Invalid IDs" });
    }
    await storage.deleteGames(ids);
    res.sendStatus(204);
  });

  return httpServer;
}

async function seedDatabase() {
  const existingGames = await storage.getGames();
  if (existingGames.length === 0) {
    await storage.createGame({ winner: 'X' });
    await storage.createGame({ winner: 'O' });
    await storage.createGame({ winner: 'draw' });
  }
}

// Call seed on startup (optional, or can be triggered manually if preferred)
seedDatabase().catch(console.error);
