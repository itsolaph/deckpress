import { mkdir, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { ElementsError, formatDiagnostics, render, validate, type Diagnostic } from "@hyper-elements/react";
import { renderImage } from "@hyper-elements/react/image";
import { renderPdf } from "@hyper-elements/react/pdf";
import { createElement, type ReactElement } from "react";
import { loadDeckData } from "./data";
import { loadDeckFonts } from "./fonts";
import { CardBackCanvas, CardFrontCanvas } from "./templates/CardCanvas";
import { DeckDocument } from "./templates/DeckDocument";
import { PlaytestEmail } from "./templates/PlaytestEmail";
import { RulesPage } from "./templates/RulesPage";
import type { PaperSize } from "./types";

function parsePapers(argv: string[]): PaperSize[] {
  const idx = argv.indexOf("--paper");
  if (idx === -1) return ["A4", "Letter"];
  const val = (argv[idx + 1] ?? "").toLowerCase();
  if (val === "a4") return ["A4"];
  if (val === "letter") return ["Letter"];
  throw new Error(`Unknown --paper value "${argv[idx + 1]}". Expected "a4" or "letter".`);
}

function logDiagnostics(label: string, diagnostics: Diagnostic[]): void {
  const important = diagnostics.filter((d) => d.severity !== "info");
  if (important.length > 0) {
    console.log(`[${label}] diagnostics:\n${formatDiagnostics(important)}`);
  }
}

function assertValid(label: string, element: ReactElement): void {
  const report = validate(element);
  if (!report.valid) {
    throw new ElementsError(report.diagnostics);
  }
  logDiagnostics(label, report.diagnostics);
}

async function main(): Promise<void> {
  const papers = parsePapers(process.argv.slice(2));
  const outDir = resolve(process.cwd(), "out");
  const cardsDir = join(outDir, "cards");
  await mkdir(cardsDir, { recursive: true });

  const [deck, fonts] = await Promise.all([loadDeckData(), loadDeckFonts()]);

  // 1. Print-and-Play PDFs (A4 & Letter)
  for (const paper of papers) {
    const doc = createElement(DeckDocument, { deck, paper });
    assertValid(`PDF:${paper}`, doc);
    const { pdf, diagnostics } = await renderPdf(doc, { fonts });
    logDiagnostics(`renderPdf:${paper}`, diagnostics);
    const filename = paper === "A4" ? "deck-a4.pdf" : "deck-letter.pdf";
    await writeFile(join(outDir, filename), pdf);
    console.log(`Wrote out/${filename} (${(pdf.byteLength / 1024).toFixed(1)} KB)`);
  }

  // 2. Individual Card PNGs via <Canvas> + renderImage (scale: 2 -> 1000x1400 px, strict: true)
  for (const card of deck.cards) {
    const canvas = createElement(CardFrontCanvas, { card });
    assertValid(`Canvas:${card.id}`, canvas);
    const { image, width, height, diagnostics } = await renderImage(canvas, {
      fonts,
      scale: 2,
      strict: true,
    });
    logDiagnostics(`renderImage:${card.id}`, diagnostics);
    const slug = `${card.id.toLowerCase()}-${card.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.png`;
    await writeFile(join(cardsDir, slug), image);
    console.log(`Wrote out/cards/${slug} (${width}x${height})`);
  }

  const backCanvas = createElement(CardBackCanvas);
  assertValid("Canvas:card-back", backCanvas);
  const backRes = await renderImage(backCanvas, { fonts, scale: 2, strict: true });
  logDiagnostics("renderImage:card-back", backRes.diagnostics);
  await writeFile(join(cardsDir, "card-back.png"), backRes.image);
  console.log(`Wrote out/cards/card-back.png (${backRes.width}x${backRes.height})`);

  // 3. Rules & Card Gallery Web Page (<Page>)
  const rulesPage = createElement(RulesPage, { deck });
  assertValid("Page:rules", rulesPage);
  const pageResult = await render(rulesPage);
  logDiagnostics("render:rules", pageResult.diagnostics);
  await writeFile(join(outDir, "rules.html"), pageResult.html, "utf8");
  console.log(`Wrote out/rules.html (${(Buffer.byteLength(pageResult.html) / 1024).toFixed(1)} KB)`);

  // 4. Playtester Dispatch Email (<Email>)
  const email = createElement(PlaytestEmail, { deck });
  assertValid("Email:playtest", email);
  const emailResult = await render(email);
  logDiagnostics("render:email", emailResult.diagnostics);
  await writeFile(join(outDir, "playtest-email.html"), emailResult.html, "utf8");
  await writeFile(join(outDir, "playtest-email.txt"), emailResult.text, "utf8");
  console.log(
    `Wrote out/playtest-email.html (${(Buffer.byteLength(emailResult.html) / 1024).toFixed(1)} KB) and out/playtest-email.txt`
  );
}

main().catch((err) => {
  if (err instanceof ElementsError) {
    console.error(formatDiagnostics(err.diagnostics));
  } else {
    console.error(err);
  }
  process.exitCode = 1;
});
