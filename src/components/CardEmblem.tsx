import { Circle, Ellipse, Line, Path, Polygon, Rect, Svg } from "@hyper-elements/react";

export interface CardEmblemProps {
  emblem: string;
  accent: string;
  ink: string;
  size: number;
}

/**
 * Pure Hyper Elements <Svg> vector emblem for each card, using only
 * Rect, Circle, Ellipse, Line, Polygon, and Path so it renders identically
 * across Document (PDF), Canvas (PNG/SVG), and Page (Web HTML).
 */
export function CardEmblem({ emblem, accent, ink, size }: CardEmblemProps) {
  const s = (stroke: string, width = 2.5) => ({ fill: "transparent", stroke, strokeWidth: width });
  const f = (fill: string) => ({ fill, stroke: "transparent", strokeWidth: 0 });

  let shapes;
  switch (emblem) {
    case "operator":
      shapes = (
        <>
          <Circle cx={32} cy={32} r={22} style={s(ink, 2.2)} />
          <Circle cx={32} cy={32} r={12} style={s(accent, 2.4)} />
          <Circle cx={32} cy={32} r={4} style={f(accent)} />
          <Line x1={32} y1={4} x2={32} y2={14} style={s(ink, 2.2)} />
          <Line x1={32} y1={50} x2={32} y2={60} style={s(ink, 2.2)} />
          <Line x1={4} y1={32} x2={14} y2={32} style={s(ink, 2.2)} />
          <Line x1={50} y1={32} x2={60} y2={32} style={s(ink, 2.2)} />
        </>
      );
      break;
    case "analyst":
      shapes = (
        <>
          <Ellipse cx={32} cy={32} rx={24} ry={13} style={s(ink, 2.2)} />
          <Circle cx={32} cy={32} r={8} style={s(accent, 2.5)} />
          <Circle cx={32} cy={32} r={3} style={f(ink)} />
          <Line x1={12} y1={14} x2={52} y2={14} style={s(accent, 2)} />
          <Line x1={12} y1={50} x2={52} y2={50} style={s(accent, 2)} />
        </>
      );
      break;
    case "saboteur":
      shapes = (
        <>
          <Polygon points="32,8 56,52 8,52" style={s(ink, 2.4)} />
          <Line x1={18} y1={42} x2={46} y2={20} style={s(accent, 3)} />
          <Circle cx={32} cy={36} r={5} style={f(accent)} />
        </>
      );
      break;
    case "broker":
      shapes = (
        <>
          <Circle cx={22} cy={32} r={14} style={s(ink, 2.2)} />
          <Circle cx={42} cy={32} r={14} style={s(accent, 2.2)} />
          <Rect x={29} y={24} width={6} height={16} rx={2} style={f(ink)} />
        </>
      );
      break;
    case "courier":
      shapes = (
        <>
          <Polygon points="32,6 56,32 32,58 8,32" style={s(ink, 2.2)} />
          <Polygon points="32,16 46,32 32,48 18,32" style={s(accent, 2.2)} />
          <Circle cx={32} cy={32} r={4} style={f(ink)} />
        </>
      );
      break;
    case "beacon":
      shapes = (
        <>
          <Line x1={32} y1={56} x2={32} y2={24} style={s(ink, 2.8)} />
          <Polygon points="22,56 42,56 36,42 28,42" style={f(ink)} />
          <Circle cx={32} cy={22} r={5} style={f(accent)} />
          <Path d="M18 14 A18 18 0 0 0 18 32" style={s(accent, 2.2)} />
          <Path d="M46 14 A18 18 0 0 1 46 32" style={s(accent, 2.2)} />
          <Path d="M11 8 A26 26 0 0 0 11 38" style={s(ink, 1.8)} />
          <Path d="M53 8 A26 26 0 0 1 53 38" style={s(ink, 1.8)} />
        </>
      );
      break;
    case "wave":
      shapes = (
        <>
          <Line x1={6} y1={32} x2={58} y2={32} style={s(ink, 1.4)} />
          <Path d="M6 32 Q14 10 22 32 T38 32 T54 32" style={s(accent, 3)} />
          <Path d="M6 32 Q14 54 22 32 T38 32 T54 32" style={s(ink, 2)} />
        </>
      );
      break;
    case "gate":
      shapes = (
        <>
          <Rect x={10} y={14} width={44} height={36} rx={4} style={s(ink, 2.2)} />
          <Line x1={24} y1={14} x2={24} y2={50} style={s(ink, 2)} />
          <Line x1={40} y1={14} x2={40} y2={50} style={s(ink, 2)} />
          <Circle cx={32} cy={32} r={6} style={f(accent)} />
        </>
      );
      break;
    case "filter":
      shapes = (
        <>
          <Polygon points="10,12 54,12 38,34 38,54 26,50 26,34" style={s(ink, 2.2)} />
          <Line x1={16} y1={20} x2={48} y2={20} style={s(accent, 2.6)} />
          <Circle cx={32} cy={27} r={3} style={f(accent)} />
        </>
      );
      break;
    case "repeater":
      shapes = (
        <>
          <Rect x={10} y={34} width={10} height={20} rx={2} style={s(ink, 2)} />
          <Rect x={27} y={22} width={10} height={32} rx={2} style={s(accent, 2.2)} />
          <Rect x={44} y={10} width={10} height={44} rx={2} style={s(ink, 2)} />
          <Circle cx={32} cy={14} r={3.5} style={f(accent)} />
        </>
      );
      break;
    case "bridge":
      shapes = (
        <>
          <Rect x={8} y={24} width={12} height={26} rx={2} style={f(ink)} />
          <Rect x={44} y={24} width={12} height={26} rx={2} style={f(ink)} />
          <Path d="M14 24 Q32 8 50 24" style={s(accent, 3)} />
          <Line x1={14} y1={34} x2={50} y2={34} style={s(accent, 2.4)} />
        </>
      );
      break;
    case "static":
      shapes = (
        <>
          <Path d="M6 34 L16 14 L24 48 L34 12 L42 50 L50 20 L58 34" style={s(accent, 2.8)} />
          <Line x1={8} y1={54} x2={56} y2={54} style={s(ink, 2)} />
          <Line x1={8} y1={10} x2={56} y2={10} style={s(ink, 2)} />
        </>
      );
      break;
    case "spoof":
      shapes = (
        <>
          <Rect x={12} y={12} width={28} height={28} rx={3} style={s(ink, 2.2)} />
          <Rect x={24} y={24} width={28} height={28} rx={3} style={s(accent, 2.4)} />
          <Line x1={28} y1={28} x2={48} y2={48} style={s(accent, 2)} />
        </>
      );
      break;
    case "drift":
      shapes = (
        <>
          <Circle cx={32} cy={32} r={22} style={s(ink, 2.2)} />
          <Line x1={32} y1={32} x2={32} y2={15} style={s(ink, 2.5)} />
          <Line x1={32} y1={32} x2={47} y2={39} style={s(accent, 2.8)} />
          <Circle cx={32} cy={32} r={3.5} style={f(accent)} />
        </>
      );
      break;
    case "blackout":
      shapes = (
        <>
          <Rect x={10} y={10} width={44} height={44} rx={6} style={f(ink)} />
          <Line x1={18} y1={18} x2={46} y2={46} style={s(accent, 3.5)} />
          <Line x1={46} y1={18} x2={18} y2={46} style={s(accent, 3.5)} />
        </>
      );
      break;
    case "reboot":
      shapes = (
        <>
          <Path d="M48 22 A18 18 0 1 0 50 38" style={s(ink, 2.6)} />
          <Polygon points="48,12 56,24 42,24" style={f(accent)} />
          <Circle cx={32} cy={32} r={5} style={f(accent)} />
        </>
      );
      break;
    case "audit":
      shapes = (
        <>
          <Rect x={12} y={10} width={40} height={44} rx={4} style={s(ink, 2.2)} />
          <Line x1={20} y1={22} x2={44} y2={22} style={s(ink, 2.2)} />
          <Line x1={20} y1={31} x2={44} y2={31} style={s(accent, 2.4)} />
          <Line x1={20} y1={40} x2={34} y2={40} style={s(ink, 2.2)} />
        </>
      );
      break;
    case "patch":
    default:
      shapes = (
        <>
          <Rect x={26} y={10} width={12} height={44} rx={2} style={s(ink, 2.2)} />
          <Rect x={10} y={26} width={44} height={12} rx={2} style={s(accent, 2.4)} />
          <Circle cx={32} cy={32} r={4} style={f(ink)} />
        </>
      );
      break;
  }

  return (
    <Svg width={size} height={size} viewBox="0 0 64 64" title={`${emblem} emblem`}>
      {shapes}
    </Svg>
  );
}

/** Geometric vector mark for the card back. */
export function CardBackEmblem({ size, accent, line }: { size: number; accent: string; line: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100" title="SIGNAL // NOISE emblem">
      <Rect x={6} y={6} width={88} height={88} rx={8} style={{ fill: "transparent", stroke: line, strokeWidth: 1.5 }} />
      <Circle cx={50} cy={50} r={30} style={{ fill: "transparent", stroke: line, strokeWidth: 1.5 }} />
      <Circle cx={50} cy={50} r={18} style={{ fill: "transparent", stroke: accent, strokeWidth: 2.2 }} />
      <Polygon points="50,22 72,50 50,78 28,50" style={{ fill: "transparent", stroke: line, strokeWidth: 1.5 }} />
      <Circle cx={50} cy={50} r={5} style={{ fill: accent, stroke: "transparent", strokeWidth: 0 }} />
      <Line x1={12} y1={50} x2={28} y2={50} style={{ fill: "transparent", stroke: accent, strokeWidth: 2 }} />
      <Line x1={72} y1={50} x2={88} y2={50} style={{ fill: "transparent", stroke: accent, strokeWidth: 2 }} />
    </Svg>
  );
}
