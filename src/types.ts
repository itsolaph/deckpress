export type Faction = "SIGNAL" | "NOISE" | "NEUTRAL" | "OVERRIDE";
export type CardCategory = "Role" | "Relay" | "Interference" | "Override";
export type PaperSize = "A4" | "Letter";

export interface CardSpec {
  id: string;
  name: string;
  category: CardCategory;
  faction: Faction;
  cost: number;
  power: number;
  powerLabel: "SIG" | "NOI" | "PWR";
  ability: string;
  flavor: string;
  emblem: string;
  featured: boolean;
}

export interface TurnStep {
  step: string;
  detail: string;
}

export interface WinCondition {
  faction: string;
  condition: string;
}

export interface GameSpec {
  title: string;
  subtitle: string;
  edition: string;
  players: string;
  duration: string;
  ages: string;
  cardCount: number;
  rulesUrl: string;
  feedbackUrl: string;
  downloadUrl: string;
  summary: string;
  setup: string[];
  turnSteps: TurnStep[];
  winConditions: WinCondition[];
  printNotes: string[];
  playtestFocus: string[];
}

export interface DeckData {
  game: GameSpec;
  cards: CardSpec[];
}
