import {
  Button,
  Column,
  Divider,
  Grid,
  Heading,
  List,
  ListItem,
  Page,
  Row,
  Section,
  Span,
  Table,
  TableCell,
  TableRow,
  Text,
} from "@hyper-elements/react";
import { CardBack, CardFront } from "../components/CardFace";
import { WEB_FONTS } from "../fonts";
import { FACTION_STYLE, FONT_STACK, PALETTE, deckTheme } from "../theme";
import type { DeckData } from "../types";

export function RulesPage({ deck }: { deck: DeckData }) {
  const roles = deck.cards.filter((c) => c.category === "Role");
  const actions = deck.cards.filter((c) => c.category !== "Role");

  return (
    <Page
      width={960}
      theme={deckTheme}
      fonts={WEB_FONTS}
      title={`${deck.game.title} — Rules & Card Gallery`}
      description={deck.game.summary}
      lang="en"
      style={{ backgroundColor: PALETTE.paper, color: PALETTE.ink }}
    >
      {/* Hero Banner */}
      <Section tokens={{ colors: { background: PALETTE.darkSurface, foreground: "#F6F3EC" } }} style={{ padding: [44, 32], gap: 18 }}>
        <Row stackOnMobile style={{ alignItems: "center", justifyContent: "space-between", gap: 24 }}>
          <Column style={{ gap: 10 }}>
            <Text style={{ fontFamily: FONT_STACK.mono, fontSize: 12, fontWeight: 600, letterSpacing: 1.5, color: PALETTE.noise }}>
              DECKPRESS PRINT-AND-PLAY · {deck.game.edition.toUpperCase()}
            </Text>
            <Heading level={1} style={{ fontSize: 44, color: "#F6F3EC", mobile: { fontSize: 32 } }}>
              {deck.game.title}
            </Heading>
            <Text style={{ fontSize: 17, color: "#CBD1DA", maxWidth: 560 }}>
              {deck.game.summary}
            </Text>
            <Row stackOnMobile={false} style={{ gap: 12, padding: [6, 0, 0] }}>
              <Button href="./deck-a4.pdf" style={{ backgroundColor: PALETTE.noise, color: "#FFFFFF" }}>
                Download A4 Print PDF
              </Button>
              <Button
                href="./deck-letter.pdf"
                style={{
                  backgroundColor: PALETTE.darkCard,
                  color: "#F6F3EC",
                  border: `1px solid ${PALETTE.darkBorder}`,
                }}
              >
                Download Letter PDF
              </Button>
            </Row>
          </Column>

          <Column style={{ width: 268, flex: "none", alignItems: "center" }}>
            <CardBack scale="gallery" />
          </Column>
        </Row>

        <Divider style={{ borderTop: `1px solid ${PALETTE.darkBorder}` }} />

        <Grid columns={4} style={{ gap: 16 }}>
          {[
            ["Players", deck.game.players],
            ["Duration", deck.game.duration],
            ["Deck Size", `${deck.game.cardCount} cards`],
            ["Trim Size", "2.25 x 3.125 in"],
          ].map(([k, v]) => (
            <Column key={k} style={{ backgroundColor: PALETTE.darkCard, padding: [12, 16], borderRadius: 6, gap: 2 }}>
              <Text style={{ fontFamily: FONT_STACK.mono, fontSize: 10.5, letterSpacing: 1, textTransform: "uppercase", color: "#9AA3B0" }}>
                {k}
              </Text>
              <Text style={{ fontFamily: FONT_STACK.heading, fontSize: 18, fontWeight: 700, color: "#F6F3EC" }}>
                {v}
              </Text>
            </Column>
          ))}
        </Grid>
      </Section>

      {/* Rules & Turn Structure */}
      <Section style={{ padding: [40, 32], gap: 28 }}>
        <Row stackOnMobile style={{ gap: 24, alignItems: "start" }}>
          <Column style={{ apply: ["panel"] }}>
            <Text style={{ apply: ["monoLabel"] }}>01 · Preparation</Text>
            <Heading level={2}>Setup &amp; Deal</Heading>
            <List type="number" style={{ gap: 10 }}>
              {deck.game.setup.map((item, idx) => (
                <ListItem key={`web-setup-${idx}`}>{item}</ListItem>
              ))}
            </List>
          </Column>

          <Column style={{ apply: ["panel"] }}>
            <Text style={{ apply: ["monoLabel"] }}>02 · Printing</Text>
            <Heading level={2}>Duplex Cut Guide</Heading>
            <List type="bullet" style={{ gap: 10 }}>
              {deck.game.printNotes.map((item, idx) => (
                <ListItem key={`web-print-${idx}`}>{item}</ListItem>
              ))}
            </List>
          </Column>
        </Row>

        <Column style={{ apply: ["panel"] }}>
          <Text style={{ apply: ["monoLabel"] }}>03 · Round Flow</Text>
          <Heading level={2}>Turn Structure</Heading>
          <Table style={{ cellPadding: [12, 14], rowBorder: { width: 1, style: "solid", color: PALETTE.rule } }}>
            <TableRow header style={{ backgroundColor: PALETTE.paper }}>
              <TableCell style={{ width: 160 }}>Step</TableCell>
              <TableCell>Resolution</TableCell>
            </TableRow>
            {deck.game.turnSteps.map((step) => (
              <TableRow key={`web-${step.step}`}>
                <TableCell style={{ fontFamily: FONT_STACK.heading, fontWeight: 700 }}>{step.step}</TableCell>
                <TableCell>{step.detail}</TableCell>
              </TableRow>
            ))}
          </Table>
        </Column>

        <Column style={{ gap: 12 }}>
          <Text style={{ apply: ["monoLabel"] }}>04 · Victory Conditions</Text>
          <Heading level={2}>Who Wins at Dawn</Heading>
          <Grid columns={3} style={{ gap: 16 }}>
            {deck.game.winConditions.map((wc) => {
              const f = FACTION_STYLE[wc.faction as keyof typeof FACTION_STYLE];
              return (
                <Column key={`wc-${wc.faction}`} style={{ apply: ["panel"], gap: 8, height: 156 }}>
                  <Text style={{ fontFamily: FONT_STACK.mono, fontSize: 12, fontWeight: 600, color: f.accent }}>
                    {wc.faction} VICTORY
                  </Text>
                  <Text style={{ fontSize: 14 }}>{wc.condition}</Text>
                </Column>
              );
            })}
          </Grid>
        </Column>
      </Section>

      {/* Full Visual Card Gallery */}
      <Section style={{ padding: [16, 32, 48], gap: 28 }}>
        <Divider style={{ borderTop: `1px solid ${PALETTE.rule}` }} />

        <Column style={{ gap: 6 }}>
          <Text style={{ apply: ["monoLabel"] }}>05 · Hidden Roles ({roles.length} cards)</Text>
          <Heading level={2}>Secret Identity Deck</Heading>
          <Text style={{ color: PALETTE.inkSoft }}>
            Dealt face-down at the start of the shift. Each role holds one once-per-round or once-per-game trigger.
          </Text>
        </Column>

        <Grid columns={3} style={{ gap: 24, rowGap: 24 }}>
          {roles.map((card) => (
            <Column key={`gal-${card.id}`} style={{ alignItems: "center" }}>
              <CardFront card={card} scale="gallery" />
            </Column>
          ))}
        </Grid>

        <Column style={{ gap: 6, padding: [16, 0, 0] }}>
          <Text style={{ apply: ["monoLabel"] }}>06 · Transmission Stack ({actions.length} cards)</Text>
          <Heading level={2}>Relays, Interference &amp; Overrides</Heading>
          <Text style={{ color: PALETTE.inkSoft }}>
            Cards rendered directly from <Span style={{ fontFamily: FONT_STACK.mono }}>data/deck.json</Span> using the shared Hyper Elements card component.
          </Text>
        </Column>

        <Grid columns={3} style={{ gap: 24, rowGap: 24 }}>
          {actions.map((card) => (
            <Column key={`gal-${card.id}`} style={{ alignItems: "center" }}>
              <CardFront card={card} scale="gallery" />
            </Column>
          ))}
        </Grid>
      </Section>

      <Section style={{ padding: [20, 32, 36] }}>
        <Divider style={{ borderTop: `1px solid ${PALETTE.rule}` }} />
        <Text style={{ fontFamily: FONT_STACK.mono, fontSize: 11.5, color: PALETTE.muted, textAlign: "center", padding: [12, 0, 0] }}>
          Built with DeckPress + Hyper Elements · One JSON deck rendered to PDF, PNG, Web Page, and Email
        </Text>
      </Section>
    </Page>
  );
}
