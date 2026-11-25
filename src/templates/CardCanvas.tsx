import { Canvas } from "@hyper-elements/react";
import { CardBack, CardFront } from "../components/CardFace";
import { FONT_STACK, PALETTE, deckTheme } from "../theme";
import type { CardSpec } from "../types";

export function CardFrontCanvas({ card }: { card: CardSpec }) {
  return (
    <Canvas
      width={500}
      height={700}
      theme={deckTheme}
      title={`${card.id} — ${card.name}`}
      lang="en"
      style={{
        backgroundColor: card.category === "Role" ? PALETTE.darkSurface : PALETTE.paper,
        fontFamily: FONT_STACK.body,
        padding: 0,
      }}
    >
      <CardFront card={card} scale="canvas" />
    </Canvas>
  );
}

export function CardBackCanvas() {
  return (
    <Canvas
      width={500}
      height={700}
      theme={deckTheme}
      title="SIGNAL // NOISE — Card Back"
      lang="en"
      style={{
        backgroundColor: PALETTE.darkSurface,
        fontFamily: FONT_STACK.body,
        padding: 0,
      }}
    >
      <CardBack scale="canvas" />
    </Canvas>
  );
}
