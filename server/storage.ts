import { db } from "./db";
import { games, type InsertGame, type Game } from "@shared/schema";
import { desc, eq } from "drizzle-orm";

export interface IStorage {
  getGames(): Promise<Game[]>;
  createGame(game: InsertGame): Promise<Game>;
  deleteGame(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getGames(): Promise<Game[]> {
    return await db.select().from(games).orderBy(desc(games.createdAt)).limit(10);
  }

  async createGame(insertGame: InsertGame): Promise<Game> {
    const [game] = await db.insert(games).values(insertGame).returning();
    return game;
  }

  async deleteGame(id: number): Promise<void> {
    await db.delete(games).where(eq(games.id, id));
  }
}

export const storage = new DatabaseStorage();
