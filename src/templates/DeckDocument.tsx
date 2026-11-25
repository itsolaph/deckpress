import {
  Column,
  Document,
  Heading,
  Line,
  List,
  ListItem,
  PageFooter,
  PageHeader,
  PageNumber,
  Row,
  Svg,
  Table,
  TableCell,
  TableRow,
  Text,
} from "@hyper-elements/react";
import { CardBack, CardFront } from "../components/CardFace";
import {
  GRID_HEIGHT,
  GRID_WIDTH,
  PAPER_CONFIG,
  PRINT_CARD,
  SHEET_WIDTH,
  chunkSheets,
  horizontalTrimOffsets,
  mirrorSheetRows,
  toRows,
  verticalTrimOffsets,
} from "../layout-math";
import { FACTION_STYLE, FONT_STACK, PALETTE, deckTheme } from "../theme";
import type { CardSpec, DeckData, PaperSize } from "../types";

const CROP_STROKE = "#6E737B";

function HorizontalCropStrip({ position }: { position: "top" | "bottom" }) {
  const xs = horizontalTrimOffsets();
  const y1 = position === "top" ? 2 : 1;
  const y2 = position === "top" ? PRINT_CARD.cropArm - 1 : PRINT_CARD.cropArm - 2;
  return (
    <Svg width={SHEET_WIDTH} height={PRINT_CARD.cropArm} viewBox={`0 0 ${SHEET_WIDTH} ${PRINT_CARD.cropArm}`} title="Horizontal crop marks">
      {xs.map((x, idx) => (
        <Line
          key={`${position}-${idx}`}
          x1={PRINT_CARD.cropArm + x}
          y1={y1}
          x2={PRINT_CARD.cropArm + x}
          y2={y2}
          style={{ fill: "transparent", stroke: CROP_STROKE, strokeWidth: 0.75 }}
        />
      ))}
    </Svg>
  );
}

function VerticalCropStrip({ side }: { side: "left" | "right" }) {
  const ys = verticalTrimOffsets();
  const x1 = side === "left" ? 2 : 1;
  const x2 = side === "left" ? PRINT_CARD.cropArm - 1 : PRINT_CARD.cropArm - 2;
  return (
    <Svg width={PRINT_CARD.cropArm} height={GRID_HEIGHT} viewBox={`0 0 ${PRINT_CARD.cropArm} ${GRID_HEIGHT}`} title="Vertical crop marks">
      {ys.map((y, idx) => (
        <Line
          key={`${side}-${idx}`}
          x1={x1}
          y1={y}
          x2={x2}
          y2={y}
          style={{ fill: "transparent", stroke: CROP_STROKE, strokeWidth: 0.75 }}
        />
      ))}
    </Svg>
  );
}

function PrintSheetGrid({
  rows,
  side,
}: {
  rows: Array<Array<CardSpec | null>>;
  side: "front" | "back";
}) {
  return (
    <Column style={{ width: SHEET_WIDTH, alignItems: "center", gap: 0 }}>
      <HorizontalCropStrip position="top" />
      <Row stackOnMobile={false} style={{ width: SHEET_WIDTH, gap: 0, alignItems: "start" }}>
        <Column style={{ width: PRINT_CARD.cropArm, flex: "none" }}>
          <VerticalCropStrip side="left" />
        </Column>
        <Column style={{ width: GRID_WIDTH, gap: 0, flex: "none" }}>
          {rows.map((row, rIdx) => (
            <Row key={`${side}-r-${rIdx}`} stackOnMobile={false} style={{ width: GRID_WIDTH, gap: 0 }}>
              {row.map((card, cIdx) => {
                if (!card) {
                  return (
                    <Column
                      key={`${side}-empty-${rIdx}-${cIdx}`}
                      style={{
                        width: PRINT_CARD.cellWidth,
                        height: PRINT_CARD.cellHeight,
                        backgroundColor: PALETTE.paper,
                      }}
                    />
                  );
                }
                return side === "front" ? (
                  <CardFront key={card.id} card={card} scale="print" bleed={PRINT_CARD.bleed} />
                ) : (
                  <CardBack key={`${card.id}-back`} scale="print" bleed={PRINT_CARD.bleed} />
                );
              })}
            </Row>
          ))}
        </Column>
        <Column style={{ width: PRINT_CARD.cropArm, flex: "none" }}>
          <VerticalCropStrip side="right" />
        </Column>
      </Row>
      <HorizontalCropStrip position="bottom" />
    </Column>
  );
}

export interface DeckDocumentProps {
  deck: DeckData;
  paper: PaperSize;
}

/**
 * Print-and-Play PDF Document:
 * - Pages 1..4: Alternating 3x3 card fronts and duplex-mirrored card backs (cols 3-2-1)
 *   with exact 4 px bleed and hairline crop marks aligned to 2.25 x 3.125 in trim lines.
 * - Page 5: Single-page Tabletop Quick-Start Rules & Print Alignment Sheet.
 */
export function DeckDocument({ deck, paper }: DeckDocumentProps) {
  const cfg = PAPER_CONFIG[paper];
  const sheets = chunkSheets(deck.cards);

  return (
    <Document
      size={cfg.size}
      orientation="portrait"
      margin={cfg.margin}
      theme={deckTheme}
      title={`${deck.game.title} — Print & Play (${cfg.label})`}
      lang="en"
      style={{ backgroundColor: "#FFFFFF" }}
    >
      <PageHeader style={{ padding: [0, 0, 6] }}>
        <Row stackOnMobile={false} style={{ alignItems: "center", gap: 12 }}>
          <Column>
            <Text style={{ fontFamily: FONT_STACK.mono, fontSize: 8.5, fontWeight: 600, color: PALETTE.inkSoft }}>
              {deck.game.title} · {deck.game.edition}
            </Text>
          </Column>
          <Column style={{ width: 320, flex: "none" }}>
            <Text style={{ fontFamily: FONT_STACK.mono, fontSize: 8.5, color: PALETTE.muted, textAlign: "right" }}>
              {cfg.label} ({cfg.dimensionsLabel}) · Trim 2.25 x 3.125 in · 4px Bleed
            </Text>
          </Column>
        </Row>
      </PageHeader>

      <PageFooter style={{ padding: [4, 0, 0] }}>
        <Row stackOnMobile={false} style={{ alignItems: "center", gap: 12 }}>
          <Column>
            <Text style={{ fontFamily: FONT_STACK.mono, fontSize: 8.5, color: PALETTE.muted }}>
              Print 100% actual size · Duplex: flip on long edge (backs mirrored 3-2-1)
            </Text>
          </Column>
          <Column style={{ width: 96, flex: "none" }}>
            <Text style={{ fontFamily: FONT_STACK.mono, fontSize: 8.5, fontWeight: 600, color: PALETTE.inkSoft, textAlign: "right" }}>
              Page <PageNumber /> of <PageNumber total />
            </Text>
          </Column>
        </Row>
      </PageFooter>

      {sheets.flatMap((sheet, sIdx) => {
        const frontRows = toRows(sheet);
        const backRows = mirrorSheetRows(sheet);
        const sheetLabel = `Sheet ${sIdx + 1} of ${sheets.length}`;
        return [
          <Document.Page key={`sheet-${sIdx}-front`} style={{ backgroundColor: "#FFFFFF", alignItems: "center", gap: 0 }}>
            <PrintSheetGrid rows={frontRows} side="front" />
          </Document.Page>,
          <Document.Page key={`sheet-${sIdx}-back`} style={{ backgroundColor: "#FFFFFF", alignItems: "center", gap: 0 }}>
            <PrintSheetGrid rows={backRows} side="back" />
            <Text style={{ fontFamily: FONT_STACK.mono, fontSize: 7.5, color: PALETTE.muted, textAlign: "center" }}>
              {sheetLabel} — Duplex Back (columns mirrored 3-2-1 to match Fronts)
            </Text>
          </Document.Page>,
        ];
      })}

      {/* Page 5: Tabletop Quick-Start Rules & Component Summary */}
      <Document.Page style={{ backgroundColor: "#FFFFFF", gap: 16 }}>
        <Column style={{ backgroundColor: PALETTE.darkSurface, color: "#F6F3EC", padding: 20, borderRadius: 6, gap: 6 }}>
          <Text style={{ fontFamily: FONT_STACK.mono, fontSize: 9.5, letterSpacing: 1.4, color: PALETTE.noise }}>
            DECKPRESS TABLETOP REFERENCE · {deck.game.edition.toUpperCase()}
          </Text>
          <Heading level={1} style={{ fontSize: 28, color: "#F6F3EC" }}>
            {deck.game.title}
          </Heading>
          <Text style={{ fontSize: 12, color: "#CBD1DA" }}>
            {deck.game.subtitle} · {deck.game.players} · {deck.game.duration} · {deck.game.cardCount} cards
          </Text>
        </Column>

        <Column style={{ gap: 6 }}>
          <Heading level={2} style={{ fontSize: 15 }}>
            1. Setup
          </Heading>
          <List type="number" style={{ fontSize: 11.5, lineHeight: 1.45, gap: 5 }}>
            {deck.game.setup.map((item, idx) => (
              <ListItem key={`setup-${idx}`}>{item}</ListItem>
            ))}
          </List>
        </Column>

        <Column style={{ gap: 6 }}>
          <Heading level={2} style={{ fontSize: 15 }}>
            2. Turn Sequence
          </Heading>
          <Table style={{ fontSize: 11, cellPadding: [7, 10], rowBorder: { width: 1, style: "solid", color: PALETTE.rule }, border: `1px solid ${PALETTE.rule}` }}>
            <TableRow header style={{ backgroundColor: PALETTE.paper }}>
              <TableCell style={{ width: 140 }}>Phase</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
            {deck.game.turnSteps.map((ts) => (
              <TableRow key={ts.step}>
                <TableCell style={{ fontWeight: 600 }}>{ts.step}</TableCell>
                <TableCell>{ts.detail}</TableCell>
              </TableRow>
            ))}
          </Table>
        </Column>

        <Column style={{ gap: 6 }}>
          <Heading level={2} style={{ fontSize: 15 }}>
            3. Win Conditions at Dawn (Tick 6)
          </Heading>
          <Column style={{ gap: 6 }}>
            {deck.game.winConditions.map((wc) => {
              const accent = FACTION_STYLE[wc.faction as keyof typeof FACTION_STYLE]?.accent ?? PALETTE.ink;
              return (
                <Row key={wc.faction} stackOnMobile={false} style={{ backgroundColor: PALETTE.paper, padding: [8, 12], borderRadius: 4, gap: 12, alignItems: "center" }}>
                  <Text style={{ fontFamily: FONT_STACK.mono, fontSize: 10, fontWeight: 600, color: accent, width: 76, flex: "none" }}>
                    {wc.faction}
                  </Text>
                  <Text style={{ fontSize: 11, lineHeight: 1.4 }}>{wc.condition}</Text>
                </Row>
              );
            })}
          </Column>
        </Column>

        <Column style={{ gap: 6 }}>
          <Heading level={2} style={{ fontSize: 15 }}>
            4. Print &amp; Cut Checklist
          </Heading>
          <List type="bullet" style={{ fontSize: 11, lineHeight: 1.45, gap: 4 }}>
            {deck.game.printNotes.map((note, idx) => (
              <ListItem key={`pnote-${idx}`}>{note}</ListItem>
            ))}
          </List>
        </Column>
      </Document.Page>
    </Document>
  );
}
