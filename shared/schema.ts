import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===
export const games = pgTable("games", {
  id: serial("id").primaryKey(),
  winner: text("winner"), // 'X', 'O', or 'draw'
  createdAt: timestamp("created_at").defaultNow(),
});

// === BASE SCHEMAS ===
export const insertGameSchema = createInsertSchema(games).omit({ id: true, createdAt: true });

// === EXPLICIT API CONTRACT TYPES ===
export type Game = typeof games.$inferSelect;
export type InsertGame = z.infer<typeof insertGameSchema>;

export type CreateGameRequest = InsertGame;
export type GameResponse = Game;
export type GamesListResponse = Game[];
