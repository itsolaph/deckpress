import {
  Button,
  Column,
  Divider,
  Email,
  Grid,
  Heading,
  Link,
  List,
  ListItem,
  MergeTag,
  Row,
  Section,
  Span,
  Table,
  TableCell,
  TableRow,
  Text,
} from "@hyper-elements/react";
import { CardEmailTile } from "../components/CardFace";
import { FONT_STACK, PALETTE, deckTheme } from "../theme";
import type { DeckData } from "../types";

export function PlaytestEmail({ deck }: { deck: DeckData }) {
  const featured = deck.cards.filter((c) => c.featured).slice(0, 4);

  return (
    <Email
      width={600}
      theme={deckTheme}
      title={`${deck.game.title} — ${deck.game.edition} Ready to Print`}
      previewText="Your 18-card print-and-play PDF (A4 & Letter), VTT card PNGs, and updated rules are ready."
      lang="en"
      style={{ gap: 16 }}
    >
      <Section style={{ padding: [24, 0], gap: 16 }}>
        {/* Masthead */}
      <Column style={{ backgroundColor: PALETTE.darkSurface, color: "#F6F3EC", padding: 28, borderRadius: 8, gap: 12 }}>
        <Row stackOnMobile={false} style={{ alignItems: "center", gap: 8 }}>
          <Column>
            <Text style={{ fontFamily: FONT_STACK.mono, fontSize: 11, fontWeight: 600, letterSpacing: 1.4, color: PALETTE.noise }}>
              DECKPRESS PLAYTEST DISPATCH
            </Text>
          </Column>
          <Column style={{ width: 150, flex: "none" }}>
            <Text style={{ fontFamily: FONT_STACK.mono, fontSize: 11, color: "#9AA3B0", textAlign: "right" }}>
              {deck.game.edition}
            </Text>
          </Column>
        </Row>
        <Heading level={1} style={{ fontSize: 30, color: "#F6F3EC", mobile: { fontSize: 25 } }}>
          {deck.game.title} is ready for table testing
        </Heading>
        <Text style={{ fontSize: 15, color: "#CBD1DA", lineHeight: 1.55 }}>
          Hey <MergeTag name="first_name" />, the latest 18-card print-and-play build is compiled. Print pages 1–4 double-sided on A4 or Letter stock, or drop the individual PNGs straight into your virtual tabletop.
        </Text>
        <Row stackOnMobile style={{ gap: 12, padding: [4, 0, 0] }}>
          <Button href={deck.game.downloadUrl} style={{ backgroundColor: PALETTE.noise, color: "#FFFFFF" }}>
            Download A4 Print PDF
          </Button>
          <Button
            href={deck.game.rulesUrl}
            style={{
              backgroundColor: PALETTE.darkCard,
              color: "#F6F3EC",
              border: `1px solid ${PALETTE.darkBorder}`,
            }}
          >
            Read Rules &amp; Gallery
          </Button>
        </Row>
      </Column>

      {/* Packet summary */}
      <Column style={{ apply: ["panel"] }}>
        <Text style={{ apply: ["monoLabel"] }}>Packet Contents</Text>
        <Heading level={2}>What changed in {deck.game.edition}</Heading>
        <Table style={{ fontSize: 14, cellPadding: [9, 10], rowBorder: { width: 1, style: "solid", color: PALETTE.rule } }}>
          <TableRow header style={{ backgroundColor: PALETTE.paper }}>
            <TableCell style={{ width: 170 }}>Artifact</TableCell>
            <TableCell>Details</TableCell>
          </TableRow>
          <TableRow>
            <TableCell style={{ fontWeight: 600 }}>Print PDF (A4 &amp; Letter)</TableCell>
            <TableCell>9-up 3x3 sheets, 4 px bleed, precision crop marks, 3-2-1 mirrored backs.</TableCell>
          </TableRow>
          <TableRow>
            <TableCell style={{ fontWeight: 600 }}>VTT Card PNGs</TableCell>
            <TableCell>18 crisp 1000x1400 px card fronts + shared geometric card back.</TableCell>
          </TableRow>
          <TableRow>
            <TableCell style={{ fontWeight: 600 }}>Rules Reference</TableCell>
            <TableCell>Single-page quick-start sheet on Page 5 + full visual gallery online.</TableCell>
          </TableRow>
        </Table>
      </Column>

      {/* Featured Cards */}
      <Column style={{ apply: ["panel"] }}>
        <Text style={{ apply: ["monoLabel"] }}>Deck Spotlight</Text>
        <Heading level={2}>Four cards to watch this week</Heading>
        <Text style={{ color: PALETTE.inkSoft, fontSize: 14 }}>
          Pulled directly from <Span style={{ fontFamily: FONT_STACK.mono }}>data/deck.json</Span> so stats and ability wording always match your printed sheets.
        </Text>
        <Grid columns={2} style={{ gap: 12, rowGap: 12 }}>
          {featured.map((card) => (
            <CardEmailTile key={`mail-${card.id}`} card={card} />
          ))}
        </Grid>
      </Column>

      {/* Duplex Print Instructions + Playtest Focus */}
      <Column style={{ apply: ["panel"] }}>
        <Text style={{ apply: ["monoLabel"] }}>Before You Cut</Text>
        <Heading level={2}>3-step duplex print checklist</Heading>
        <List type="number" style={{ fontSize: 14, gap: 8 }}>
          {deck.game.printNotes.map((note, idx) => (
            <ListItem key={`mail-print-${idx}`}>{note}</ListItem>
          ))}
        </List>
        <Divider style={{ borderTop: `1px solid ${PALETTE.rule}` }} />
        <Text style={{ fontWeight: 700, fontSize: 14 }}>Questions for your playtest log:</Text>
        <List type="bullet" style={{ fontSize: 14, gap: 6 }}>
          {deck.game.playtestFocus.map((q, idx) => (
            <ListItem key={`mail-focus-${idx}`}>{q}</ListItem>
          ))}
        </List>
        <Button href={deck.game.feedbackUrl} style={{ alignSelf: "start" }}>
          Submit Playtest Notes
        </Button>
      </Column>

      {/* Footer */}
      <Column style={{ padding: [6, 16, 12], gap: 6, alignItems: "center" }}>
        <Text style={{ fontSize: 12, color: PALETTE.muted, textAlign: "center" }}>
          DeckPress Playtest Dispatch · <Link href={deck.game.rulesUrl}>View Rules in Browser</Link> ·{" "}
          <Link href={deck.game.feedbackUrl}>Manage Preferences</Link>
        </Text>
      </Column>
      </Section>
    </Email>
  );
}
