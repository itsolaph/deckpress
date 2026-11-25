import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { render, validate } from "@hyper-elements/react";
import { renderImage } from "@hyper-elements/react/image";
import { renderPdf } from "@hyper-elements/react/pdf";
import { loadDeckData } from "./data";
import { loadDeckFonts } from "./fonts";
import { chunkSheets, mirrorSheetRows, toRows } from "./layout-math";
import { CardBackCanvas, CardFrontCanvas } from "./templates/CardCanvas";
import { DeckDocument } from "./templates/DeckDocument";
import { PlaytestEmail } from "./templates/PlaytestEmail";
import { RulesPage } from "./templates/RulesPage";

test("deck.json defines 18 unique cards with valid fields", async () => {
  const deck = await loadDeckData();
  assert.equal(deck.cards.length, 18);
  const ids = new Set(deck.cards.map((c) => c.id));
  assert.equal(ids.size, 18);
  for (const c of deck.cards) {
    assert.ok(c.name.length > 0);
    assert.ok(c.ability.length > 0);
    assert.ok(c.emblem.length > 0);
  }
});

test("duplex mirroring flips each 3-card row horizontally (3-2-1)", async () => {
  const deck = await loadDeckData();
  const sheets = chunkSheets(deck.cards);
  assert.equal(sheets.length, 2);
  const frontRows = toRows(sheets[0]);
  const backRows = mirrorSheetRows(sheets[0]);
  assert.equal(frontRows[0][0]?.id, backRows[0][2]?.id);
  assert.equal(frontRows[0][1]?.id, backRows[0][1]?.id);
  assert.equal(frontRows[0][2]?.id, backRows[0][0]?.id);
  assert.equal(frontRows[2][0]?.id, backRows[2][2]?.id);
});

test("all four Hyper Elements roots pass validate() and render cleanly", async () => {
  const [deck, fonts] = await Promise.all([loadDeckData(), loadDeckFonts()]);

  const docA4 = createElement(DeckDocument, { deck, paper: "A4" });
  const docLetter = createElement(DeckDocument, { deck, paper: "Letter" });
  const cardCanvas = createElement(CardFrontCanvas, { card: deck.cards[0] });
  const backCanvas = createElement(CardBackCanvas);
  const rulesPage = createElement(RulesPage, { deck });
  const email = createElement(PlaytestEmail, { deck });

  for (const el of [docA4, docLetter, cardCanvas, backCanvas, rulesPage, email]) {
    const res = validate(el);
    assert.equal(res.valid, true, JSON.stringify(res.diagnostics));
  }

  const pdfRes = await renderPdf(docA4, { fonts });
  assert.equal(Buffer.from(pdfRes.pdf.subarray(0, 5)).toString("ascii"), "%PDF-");

  const imgRes = await renderImage(cardCanvas, { fonts, scale: 2, strict: true });
  assert.equal(imgRes.width, 1000);
  assert.equal(imgRes.height, 1400);
  assert.equal(imgRes.image[0], 0x89);
  assert.equal(imgRes.image[1], 0x50);

  const pageRes = await render(rulesPage);
  assert.ok(pageRes.html.includes("SIGNAL // NOISE"));
  assert.ok(pageRes.html.includes("Coldline Bridge"));

  const emailRes = await render(email);
  assert.ok(emailRes.html.toLowerCase().includes("<!doctype html"));
  assert.ok(emailRes.text.includes("SIGNAL // NOISE"));
});
