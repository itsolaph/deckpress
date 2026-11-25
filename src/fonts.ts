import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

export interface LoadedFont {
  family: string;
  src: Uint8Array;
  weight: number;
  style: "normal" | "italic";
}

function nm(relPath: string): string {
  return resolve(process.cwd(), "node_modules", relPath);
}

/**
 * Loads TTF/WOFF font files from @fontsource packages for offline PDF and PNG rendering.
 * Note: Hyper Elements' PDF and Image renderers accept TTF, OTF, or WOFF (not WOFF2).
 */
export async function loadDeckFonts(): Promise<LoadedFont[]> {
  const specs: Array<{ family: string; file: string; weight: number }> = [
    {
      family: "Space Grotesk",
      file: "@fontsource/space-grotesk/files/space-grotesk-latin-500-normal.woff",
      weight: 500,
    },
    {
      family: "Space Grotesk",
      file: "@fontsource/space-grotesk/files/space-grotesk-latin-700-normal.woff",
      weight: 700,
    },
    {
      family: "Inter",
      file: "@fontsource/inter/files/inter-latin-400-normal.woff",
      weight: 400,
    },
    {
      family: "Inter",
      file: "@fontsource/inter/files/inter-latin-600-normal.woff",
      weight: 600,
    },
    {
      family: "Inter",
      file: "@fontsource/inter/files/inter-latin-700-normal.woff",
      weight: 700,
    },
    {
      family: "IBM Plex Mono",
      file: "@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-400-normal.woff",
      weight: 400,
    },
    {
      family: "IBM Plex Mono",
      file: "@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-600-normal.woff",
      weight: 600,
    },
  ];

  return Promise.all(
    specs.map(async (s) => ({
      family: s.family,
      src: new Uint8Array(await readFile(nm(s.file))),
      weight: s.weight,
      style: "normal" as const,
    }))
  );
}

export const WEB_FONTS = [
  {
    family: "Space Grotesk",
    src: "https://fonts.gstatic.com/s/spacegrotesk/v16/V8mDoQDjQSkFtoMM3T6r8E7mPbF4Cw.woff2",
    format: "woff2" as const,
    weight: "500 700" as const,
  },
  {
    family: "Inter",
    src: "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfAZ9hiA.woff2",
    format: "woff2" as const,
    weight: "400 700" as const,
  },
  {
    family: "IBM Plex Mono",
    src: "https://fonts.gstatic.com/s/ibmplexmono/v19/-F63fjptAgt5VM-kVkqdyU8n1i8q1w.woff2",
    format: "woff2" as const,
    weight: "400 600" as const,
  },
];
