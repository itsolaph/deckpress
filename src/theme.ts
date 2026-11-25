import { defineTheme } from "@hyper-elements/react";
import type { Faction } from "./types";

export const PALETTE = {
  paper: "#F6F3EC",
  card: "#FFFDF8",
  ink: "#141619",
  inkSoft: "#4B5058",
  muted: "#6E737B",
  rule: "#D9D2C5",
  darkSurface: "#14171C",
  darkCard: "#1D222A",
  darkBorder: "#313844",
  signal: "#0F6E7A",
  signalSoft: "#E4F2F4",
  noise: "#C8432B",
  noiseSoft: "#FCEAE6",
  neutral: "#58524A",
  neutralSoft: "#EFECE6",
  override: "#B87A14",
  overrideSoft: "#FDF3DF",
} as const;

export const FACTION_STYLE: Record<
  Faction,
  { accent: string; tint: string; badgeBg: string; badgeText: string; label: string }
> = {
  SIGNAL: {
    accent: PALETTE.signal,
    tint: PALETTE.signalSoft,
    badgeBg: PALETTE.signal,
    badgeText: "#FFFFFF",
    label: "SIGNAL",
  },
  NOISE: {
    accent: PALETTE.noise,
    tint: PALETTE.noiseSoft,
    badgeBg: PALETTE.noise,
    badgeText: "#FFFFFF",
    label: "NOISE",
  },
  NEUTRAL: {
    accent: PALETTE.neutral,
    tint: PALETTE.neutralSoft,
    badgeBg: PALETTE.neutral,
    badgeText: "#FFFFFF",
    label: "COURIER",
  },
  OVERRIDE: {
    accent: PALETTE.override,
    tint: PALETTE.overrideSoft,
    badgeBg: PALETTE.override,
    badgeText: "#FFFFFF",
    label: "OVERRIDE",
  },
};

export const FONT_STACK = {
  heading: "'Space Grotesk', 'Helvetica Neue', Helvetica, Arial, sans-serif",
  body: "Inter, 'Helvetica Neue', Helvetica, Arial, sans-serif",
  mono: "'IBM Plex Mono', Menlo, Consolas, monospace",
} as const;

export const deckTheme = defineTheme({
  colors: {
    background: PALETTE.paper,
    foreground: PALETTE.ink,
    primary: PALETTE.noise,
    primaryForeground: "#FFFFFF",
    secondary: PALETTE.signal,
    muted: PALETTE.muted,
    border: PALETTE.rule,
    surface: PALETTE.card,
  },
  fonts: {
    heading: FONT_STACK.heading,
    body: FONT_STACK.body,
  },
  fontSizes: {
    body: 15,
  },
  lineHeights: {
    body: 1.5,
  },
  elements: {
    Heading: {
      fontFamily: FONT_STACK.heading,
      fontWeight: 700,
      color: "{colors.foreground}",
      by: {
        level: {
          1: { fontSize: 34, lineHeight: 1.1, letterSpacing: -0.6, mobile: { fontSize: 28 } },
          2: { fontSize: 22, lineHeight: 1.2, letterSpacing: -0.3, mobile: { fontSize: 19 } },
          3: { fontSize: 16, lineHeight: 1.3 },
        },
      },
    },
    Button: {
      backgroundColor: "{colors.primary}",
      color: "{colors.primaryForeground}",
      fontFamily: FONT_STACK.heading,
      fontSize: 14,
      fontWeight: 700,
      padding: [12, 22],
      borderRadius: 4,
      hover: {
        backgroundColor: "#A63420",
      },
    },
  },
  styles: {
    panel: {
      backgroundColor: PALETTE.card,
      border: `1px solid ${PALETTE.rule}`,
      borderRadius: 8,
      padding: 24,
      gap: 14,
    },
    monoLabel: {
      fontFamily: FONT_STACK.mono,
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: 1.1,
      textTransform: "uppercase",
      color: PALETTE.muted,
    },
  },
  formats: {
    email: {
      colors: {
        background: "#ECE8DF",
      },
    },
  },
});

declare module "@hyper-elements/react" {
  interface Register {
    theme: typeof deckTheme;
  }
}
