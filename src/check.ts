import { mkdir, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { createElement } from "react";
import { formatDiagnostics, outline, validate } from "@hyper-elements/react";
import { emailClients, renderInEmailClients } from "@hyper-elements/email-clients";
import { loadDeckData } from "./data";
import { CardFrontCanvas } from "./templates/CardCanvas";
import { DeckDocument } from "./templates/DeckDocument";
import { PlaytestEmail } from "./templates/PlaytestEmail";
import { RulesPage } from "./templates/RulesPage";

async function main(): Promise<void> {
  const deck = await loadDeckData();
  const plugin = await emailClients();

  const targets = [
    { name: "Document (A4)", element: createElement(DeckDocument, { deck, paper: "A4" }) },
    { name: "Document (Letter)", element: createElement(DeckDocument, { deck, paper: "Letter" }) },
    { name: "Canvas (SYS-01)", element: createElement(CardFrontCanvas, { card: deck.cards[0] }) },
    { name: "Page (Rules & Gallery)", element: createElement(RulesPage, { deck }) },
    { name: "Email (Playtest Dispatch)", element: createElement(PlaytestEmail, { deck }), plugins: [plugin] },
  ];

  let hasErrors = false;
  for (const t of targets) {
    const report = validate(t.element, t.plugins ? { plugins: t.plugins } : undefined);
    console.log(`\n=== ${t.name} (${report.valid ? "VALID" : "INVALID"}) ===`);
    if (report.diagnostics.length > 0) {
      console.log(formatDiagnostics(report.diagnostics));
    } else {
      console.log("No diagnostics.");
    }
    if (!report.valid) hasErrors = true;
  }

  console.log("\n=== Email Outline ===");
  console.log(outline(createElement(PlaytestEmail, { deck })));

  // Generate email client emulator previews (Outlook, Gmail, Apple Mail, Gmail App)
  const clientsDir = resolve(process.cwd(), "out/clients/playtest-email");
  await mkdir(clientsDir, { recursive: true });
  const { previews, diagnostics } = await renderInEmailClients(createElement(PlaytestEmail, { deck }), {
    emailClients: ["outlook", "gmail", "apple-mail", "gmail-app"],
  });
  for (const preview of previews) {
    await writeFile(join(clientsDir, preview.filename), preview.html, "utf8");
  }
  console.log(`\nWrote ${previews.length} email client emulator previews to out/clients/playtest-email/`);
  if (diagnostics.length > 0) {
    console.log(formatDiagnostics(diagnostics));
  }

  if (hasErrors) {
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
