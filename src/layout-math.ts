import type { CardSpec, PaperSize } from "./types";

export const PRINT_CARD = {
  trimWidth: 216,   // 2.25 in at 96 dpi
  trimHeight: 300,  // 3.125 in at 96 dpi
  bleed: 4,         // 4 px (~1 mm) full-bleed apron per edge
  cellWidth: 224,   // 216 + 2 * 4
  cellHeight: 308,  // 300 + 2 * 4
  cropArm: 14,      // crop-mark strip thickness
  cols: 3,
  rows: 3,
} as const;

export const PAPER_CONFIG: Record<
  PaperSize,
  {
    size: PaperSize;
    label: string;
    dimensionsLabel: string;
    margin: [number, number];
  }
> = {
  A4: {
    size: "A4",
    label: "A4",
    dimensionsLabel: "210 x 297 mm",
    margin: [28, 36],
  },
  Letter: {
    size: "Letter",
    label: "US Letter",
    dimensionsLabel: "8.5 x 11 in",
    margin: [22, 36],
  },
};

export const GRID_WIDTH = PRINT_CARD.cols * PRINT_CARD.cellWidth;   // 672
export const GRID_HEIGHT = PRINT_CARD.rows * PRINT_CARD.cellHeight; // 924
export const SHEET_WIDTH = GRID_WIDTH + PRINT_CARD.cropArm * 2;     // 700

/** Trim line offsets along the horizontal axis (relative to the 672 px grid). */
export function horizontalTrimOffsets(): number[] {
  const xs: number[] = [];
  for (let c = 0; c < PRINT_CARD.cols; c++) {
    const start = c * PRINT_CARD.cellWidth;
    xs.push(start + PRINT_CARD.bleed);
    xs.push(start + PRINT_CARD.cellWidth - PRINT_CARD.bleed);
  }
  return xs;
}

/** Trim line offsets along the vertical axis (relative to the 924 px grid). */
export function verticalTrimOffsets(): number[] {
  const ys: number[] = [];
  for (let r = 0; r < PRINT_CARD.rows; r++) {
    const start = r * PRINT_CARD.cellHeight;
    ys.push(start + PRINT_CARD.bleed);
    ys.push(start + PRINT_CARD.cellHeight - PRINT_CARD.bleed);
  }
  return ys;
}

/** Splits a deck into 3x3 sheets (9 cards per sheet). */
export function chunkSheets(cards: CardSpec[]): Array<Array<CardSpec | null>> {
  const perSheet = PRINT_CARD.cols * PRINT_CARD.rows;
  const sheets: Array<Array<CardSpec | null>> = [];
  for (let i = 0; i < cards.length; i += perSheet) {
    const slice: Array<CardSpec | null> = cards.slice(i, i + perSheet);
    while (slice.length < perSheet) slice.push(null);
    sheets.push(slice);
  }
  return sheets;
}

/** Arranges a 9-slot sheet into 3 rows of 3 slots. */
export function toRows(sheet: Array<CardSpec | null>): Array<Array<CardSpec | null>> {
  const rows: Array<Array<CardSpec | null>> = [];
  for (let r = 0; r < PRINT_CARD.rows; r++) {
    rows.push(sheet.slice(r * PRINT_CARD.cols, (r + 1) * PRINT_CARD.cols));
  }
  return rows;
}

/**
 * Mirrors each row (columns 0-1-2 -> 2-1-0) for long-edge duplex printing
 * so card backs align cleanly behind their corresponding card fronts.
 */
export function mirrorSheetRows(sheet: Array<CardSpec | null>): Array<Array<CardSpec | null>> {
  return toRows(sheet).map((row) => [...row].reverse());
}
