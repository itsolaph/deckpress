import { Column, Divider, Heading, Row, Span, Text } from "@hyper-elements/react";
import { FACTION_STYLE, FONT_STACK, PALETTE } from "../theme";
import type { CardSpec } from "../types";
import { CardBackEmblem, CardEmblem } from "./CardEmblem";

export type CardScale = "print" | "gallery" | "canvas";

const METRICS: Record<
  CardScale,
  {
    width: number;
    height: number;
    padding: number;
    gap: number;
    radius: number;
    emblemBoxH: number;
    emblemSize: number;
    idSize: number;
    titleSize: number;
    statSize: number;
    bodySize: number;
    flavorSize: number;
    badgeWidth: number;
    statWidth: number;
    tagWidth: number;
  }
> = {
  print: {
    width: 216,
    height: 300,
    padding: 10,
    gap: 7,
    radius: 6,
    emblemBoxH: 76,
    emblemSize: 48,
    idSize: 8.5,
    titleSize: 13.5,
    statSize: 9.5,
    bodySize: 9,
    flavorSize: 8,
    badgeWidth: 58,
    statWidth: 52,
    tagWidth: 26,
  },
  gallery: {
    width: 268,
    height: 372,
    padding: 13,
    gap: 9,
    radius: 8,
    emblemBoxH: 96,
    emblemSize: 60,
    idSize: 10,
    titleSize: 16.5,
    statSize: 11,
    bodySize: 11.5,
    flavorSize: 10,
    badgeWidth: 72,
    statWidth: 64,
    tagWidth: 34,
  },
  canvas: {
    width: 500,
    height: 700,
    padding: 24,
    gap: 16,
    radius: 16,
    emblemBoxH: 190,
    emblemSize: 116,
    idSize: 18,
    titleSize: 31,
    statSize: 20,
    bodySize: 21,
    flavorSize: 17,
    badgeWidth: 132,
    statWidth: 114,
    tagWidth: 56,
  },
};

export interface CardFrontProps {
  card: CardSpec;
  scale: CardScale;
  /** Optional bleed apron in px (used for print PDF cut sheets). */
  bleed?: number;
}

/**
 * Shared card front component used across Document (PDF), Canvas (PNG), and Page (Web).
 */
export function CardFront({ card, scale, bleed = 0 }: CardFrontProps) {
  const m = METRICS[scale];
  const f = FACTION_STYLE[card.faction];
  const isRole = card.category === "Role";
  const surfaceBg = isRole ? PALETTE.darkSurface : PALETTE.card;
  const surfaceText = isRole ? "#F6F3EC" : PALETTE.ink;
  const subtleText = isRole ? "#A9B0BA" : PALETTE.inkSoft;
  const boxBg = isRole ? PALETTE.darkCard : f.tint;
  const borderColor = isRole ? PALETTE.darkBorder : PALETTE.rule;
  const emblemInk = isRole ? "#F6F3EC" : PALETTE.ink;
  const bleedBg = isRole ? PALETTE.darkSurface : f.tint;

  const innerCard = (
    <Column
      style={{
        width: m.width,
        height: m.height,
        backgroundColor: surfaceBg,
        color: surfaceText,
        border: `1px solid ${borderColor}`,
        borderRadius: bleed > 0 ? 0 : m.radius,
        padding: m.padding,
        justifyContent: "space-between",
        overflow: "hidden",
      }}
    >
      <Column style={{ gap: m.gap }}>
        {/* Header strip: ID + Faction/Category badge */}
        <Row stackOnMobile={false} style={{ alignItems: "center", gap: 6 }}>
          <Column>
            <Text
              style={{
                fontFamily: FONT_STACK.mono,
                fontSize: m.idSize,
                fontWeight: 600,
                letterSpacing: 0.8,
                color: subtleText,
              }}
            >
              {card.id} · {card.category.toUpperCase()}
            </Text>
          </Column>
          <Column
            style={{
              width: m.badgeWidth,
              backgroundColor: f.badgeBg,
              padding: scale === "canvas" ? [4, 8] : [2, 4],
              borderRadius: scale === "canvas" ? 6 : 3,
              alignItems: "center",
              flex: "none",
            }}
          >
            <Text
              style={{
                fontFamily: FONT_STACK.mono,
                fontSize: m.idSize,
                fontWeight: 600,
                letterSpacing: 0.9,
                color: f.badgeText,
                textAlign: "center",
              }}
            >
              {f.label}
            </Text>
          </Column>
        </Row>

        {/* Accent stripe */}
        <Column style={{ height: scale === "canvas" ? 6 : 3, backgroundColor: f.accent }} />

        {/* Emblem frame */}
        <Column
          style={{
            height: m.emblemBoxH,
            backgroundColor: boxBg,
            border: `1px solid ${borderColor}`,
            borderRadius: scale === "canvas" ? 10 : 4,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CardEmblem emblem={card.emblem} accent={f.accent} ink={emblemInk} size={m.emblemSize} />
        </Column>

        {/* Card title + cost/power */}
        <Row stackOnMobile={false} style={{ alignItems: "center", gap: 6 }}>
          <Column>
            <Heading
              level={3}
              style={{
                fontFamily: FONT_STACK.heading,
                fontSize: m.titleSize,
                fontWeight: 700,
                lineHeight: 1.15,
                color: surfaceText,
              }}
            >
              {card.name}
            </Heading>
          </Column>
          <Column
            style={{
              width: m.statWidth,
              backgroundColor: isRole ? PALETTE.darkCard : PALETTE.paper,
              border: `1px solid ${borderColor}`,
              borderRadius: scale === "canvas" ? 6 : 3,
              padding: scale === "canvas" ? [5, 8] : [2, 4],
              alignItems: "center",
              flex: "none",
            }}
          >
            <Text
              style={{
                fontFamily: FONT_STACK.mono,
                fontSize: m.statSize,
                fontWeight: 600,
                color: f.accent,
                textAlign: "center",
              }}
            >
              {isRole ? `${card.powerLabel} +${card.power}` : `C${card.cost} · +${card.power}`}
            </Text>
          </Column>
        </Row>

        {/* Ability text */}
        <Text
          style={{
            fontFamily: FONT_STACK.body,
            fontSize: m.bodySize,
            lineHeight: 1.38,
            color: surfaceText,
          }}
        >
          {card.ability}
        </Text>
      </Column>

      {/* Footer flavor line */}
      <Column style={{ gap: scale === "canvas" ? 10 : 4 }}>
        <Divider style={{ borderTop: `1px solid ${borderColor}` }} />
        <Row stackOnMobile={false} style={{ alignItems: "center", gap: 6 }}>
          <Column>
            <Text
              style={{
                fontFamily: FONT_STACK.body,
                fontSize: m.flavorSize,
                lineHeight: 1.3,
                color: subtleText,
              }}
            >
              {card.flavor}
            </Text>
          </Column>
          <Column style={{ width: m.tagWidth, flex: "none" }}>
            <Text
              style={{
                fontFamily: FONT_STACK.mono,
                fontSize: m.flavorSize,
                fontWeight: 600,
                color: f.accent,
                textAlign: "right",
              }}
            >
              {card.powerLabel}
            </Text>
          </Column>
        </Row>
      </Column>
    </Column>
  );

  if (bleed <= 0) return innerCard;

  return (
    <Column
      style={{
        width: m.width + bleed * 2,
        height: m.height + bleed * 2,
        backgroundColor: bleedBg,
        padding: bleed,
        overflow: "hidden",
      }}
    >
      {innerCard}
    </Column>
  );
}

export interface CardBackProps {
  scale: CardScale;
  bleed?: number;
}

/**
 * Shared card back component used across Document (duplex-mirrored sheets),
 * Canvas (card-back.png), and Page (rules gallery).
 */
export function CardBack({ scale, bleed = 0 }: CardBackProps) {
  const m = METRICS[scale];
  const emblemSize = scale === "canvas" ? 210 : scale === "gallery" ? 116 : 92;

  const innerBack = (
    <Column
      style={{
        width: m.width,
        height: m.height,
        backgroundColor: PALETTE.darkSurface,
        color: "#F6F3EC",
        border: `1px solid ${PALETTE.darkBorder}`,
        borderRadius: bleed > 0 ? 0 : m.radius,
        padding: m.padding + (scale === "canvas" ? 8 : 3),
        justifyContent: "space-between",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      <Text
        style={{
          fontFamily: FONT_STACK.mono,
          fontSize: m.idSize,
          fontWeight: 600,
          letterSpacing: 1.6,
          color: "#9AA3B0",
          textAlign: "center",
        }}
      >
        SIGNAL // NOISE
      </Text>

      <CardBackEmblem size={emblemSize} accent={PALETTE.noise} line={PALETTE.darkBorder} />

      <Column style={{ alignItems: "center", gap: 3 }}>
        <Text
          style={{
            fontFamily: FONT_STACK.heading,
            fontSize: scale === "canvas" ? 18 : 9.5,
            fontWeight: 700,
            letterSpacing: 1.2,
            color: "#F6F3EC",
            textAlign: "center",
          }}
        >
          18-CARD RELAY DECK
        </Text>
        <Text
          style={{
            fontFamily: FONT_STACK.mono,
            fontSize: m.flavorSize,
            letterSpacing: 1,
            color: PALETTE.noise,
            textAlign: "center",
          }}
        >
          DECKPRESS EDITION
        </Text>
      </Column>
    </Column>
  );

  if (bleed <= 0) return innerBack;

  return (
    <Column
      style={{
        width: m.width + bleed * 2,
        height: m.height + bleed * 2,
        backgroundColor: PALETTE.darkSurface,
        padding: bleed,
        overflow: "hidden",
      }}
    >
      {innerBack}
    </Column>
  );
}

/**
 * Email-safe featured card preview using pure Column/Row/Text/Span
 * (Hyper Elements <Email> intentionally disallows <Svg> for Outlook/Gmail safety).
 */
export function CardEmailTile({ card }: { card: CardSpec }) {
  const f = FACTION_STYLE[card.faction];
  const isRole = card.category === "Role";
  const bg = isRole ? PALETTE.darkSurface : PALETTE.card;
  const fg = isRole ? "#F6F3EC" : PALETTE.ink;
  const sub = isRole ? "#A9B0BA" : PALETTE.inkSoft;
  const border = isRole ? PALETTE.darkBorder : PALETTE.rule;

  return (
    <Column
      style={{
        backgroundColor: bg,
        color: fg,
        border: `1px solid ${border}`,
        borderRadius: 6,
        padding: 16,
        gap: 8,
      }}
    >
      <Row stackOnMobile={false} style={{ alignItems: "center", gap: 8 }}>
        <Column>
          <Text style={{ fontFamily: FONT_STACK.mono, fontSize: 11, fontWeight: 600, color: sub }}>
            {card.id} · {card.category.toUpperCase()}
          </Text>
        </Column>
        <Column style={{ width: 84, flex: "none" }}>
          <Text style={{ fontFamily: FONT_STACK.mono, fontSize: 11, fontWeight: 600, color: f.accent, textAlign: "right" }}>
            {f.label}
          </Text>
        </Column>
      </Row>
      <Divider style={{ borderTop: `2px solid ${f.accent}` }} />
      <Heading level={3} style={{ fontSize: 17, color: fg }}>
        {card.name}
      </Heading>
      <Text style={{ fontSize: 13, lineHeight: 1.45, color: fg }}>{card.ability}</Text>
      <Text style={{ fontFamily: FONT_STACK.mono, fontSize: 11, color: sub }}>
        Cost {card.cost} · <Span style={{ color: f.accent, fontWeight: 600 }}>{card.powerLabel} +{card.power}</Span>
      </Text>
    </Column>
  );
}
