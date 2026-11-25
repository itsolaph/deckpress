import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import type { DeckData } from "./types";

export async function loadDeckData(path = resolve(process.cwd(), "data/deck.json")): Promise<DeckData> {
  const raw = await readFile(path, "utf8");
  return JSON.parse(raw) as DeckData;
}
