import React from 'react';
import {
  LightVeil, Glow, Dust, Foreground,
  Hero, Pose, basePose, poseAt, faceAt, kf, clamp, easeOut, rnd, camT, LOOKS, LEG_LEN,
  Kitchen, KitchenIsland, KITCHEN, KITCHEN_TOP, stand, Tabletop, Study, Desk, Stairwell, Rooftop, Schematic, SCH, SchLabel, CountUp, Dial, DrawOn,
  PlateTop, Paper, Tag, TitleCard, FONT, ShotProps,
} from '../../engine';

// "What if your shadow could move on its own?" Ten shots. The power: say Wake and the ink shadow does the work
// while Pip doesn't. Every shot is a pure function of its own clock t.

const PIP = LOOKS.pipHood;
const MO = LOOKS.mo;
const EDGE = '#8FD8FF'; // the free shadow's cyan rim
const INK = '#08080F';

type Arm = { a: number; b: number };
type InkPose = { armL?: Arm; armR?: Arm; lean?: number; headTilt?: number; breathe?: number };

// The free shadow: a flat ink figure that has stepped off the wall and does the job. Arm angles follow the rig's
// convention (a from straight down, b the elbow bend, about 150 for an overhead wave); lean tilts the upper body.
const inkDir = (a: number) => ({ x: Math.sin((a * Math.PI) / 180), y: Math.cos((a * Math.PI) / 180) });

const inkArm = (sx: number, sy: number, s: number, arm: Arm): React.ReactNode => {
  const d1 = inkDir(arm.a);
  const el = { x: sx + d1.x * 62 * s, y: sy + d1.y * 62 * s };
  const d2 = inkDir(arm.a + arm.b);
  const hd = { x: el.x + d2.x * 56 * s, y: el.y + d2.y * 56 * s };
  return (
    <g key={`a${sx.toFixed(0)}-${sy.toFixed(0)}`}>
      <path d={`M ${sx} ${sy} L ${el.x} ${el.y} L ${hd.x} ${hd.y}`} stroke={EDGE} strokeWidth={25 * s} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d={`M ${sx} ${sy} L ${el.x} ${el.y} L ${hd.x} ${hd.y}`} stroke={INK} strokeWidth={18 * s} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <ellipse cx={hd.x} cy={hd.y} rx={22 * s} ry={17 * s} fill={EDGE} />
      <ellipse cx={hd.x} cy={hd.y} rx={18 * s} ry={14 * s} fill={INK} />
    </g>
  );
};

export const InkFigure: React.FC<{ x: number; ground: number; s?: number; pose?: InkPose; edge?: number }> = ({ x, ground, s = 1, pose = {}, edge = 1 }) => {
  const hipY = ground - 140 * s;
  const lean = pose.lean ?? 0;
  const headTilt = pose.headTilt ?? 0;
  const liftX = Math.sin((lean * Math.PI) / 180) * 150 * s;
  const liftY = -Math.cos((lean * Math.PI) / 180) * 150 * s;
  const shY = hipY - 138 * s + liftY;
  const torso = `M ${x - 24 * s} ${hipY + 4} Q ${x - 38 * s + liftX * 0.4} ${hipY - 80 * s} ${x - 30 * s + liftX} ${shY} L ${x + 30 * s + liftX} ${shY} Q ${x + 38 * s + liftX * 0.4} ${hipY - 80 * s} ${x + 24 * s} ${hipY + 4} Z`;
  const body = (pad: number): React.ReactNode => (
    <g>
      <path d={torso} fill={INK} stroke={pad > 0 ? EDGE : INK} strokeWidth={pad * 2} strokeLinejoin="round" />
      <circle cx={x + liftX + headTilt * 0.6} cy={hipY - 188 * s + liftY + headTilt} r={30 * s + pad} fill={pad > 0 ? EDGE : INK} />
    </g>
  );
  const legs = (stroke: string, w: number): React.ReactNode => (
    <g stroke={stroke} strokeWidth={w} strokeLinecap="round" fill="none">
      <path d={`M ${x - 12 * s} ${hipY} L ${x - 24 * s} ${ground}`} />
      <path d={`M ${x + 12 * s} ${hipY} L ${x + 24 * s} ${ground}`} />
    </g>
  );
  return (
    <g>
      {edge > 0 ? (
        <g opacity={edge}>
          {legs(EDGE, 29 * s)}
          {body(8 * s)}
        </g>
      ) : null}
      {legs(INK, 22 * s)}
      {body(0)}
      {pose.armL ? inkArm(x + liftX - 30 * s, shY, s, pose.armL) : null}
      {pose.armR ? inkArm(x + liftX + 30 * s, shY, s, pose.armR) : null}
    </g>
  );
};

/** a small cyan ring that opens and fades: the Wake landing on the picture */
const wakePop = (x: number, y: number, t: number, at: number) =>
  t >= at ? (
    <g opacity={clamp(1 - (t - at) / 14)}>
      <circle cx={x} cy={y} r={20 + (t - at) * 6} fill="none" stroke={EDGE} strokeWidth={6} />
      <circle cx={x} cy={y} r={60 + (t - at) * 6} fill="none" stroke={EDGE} strokeWidth={3} opacity={0.5} />
    </g>
  ) : null;

// ---------- S1: wide, the kitchen at first light: Pip asleep on his feet; the shadow scrubs the dishes ----------
const S1_STAND = stand(KITCHEN, 0.5, 0.4);
const S1_INK = KITCHEN.P(0.089, 1, 0.14);
const S1_TAP = KITCHEN.P(0.275, KITCHEN_TOP - 0.02, 0.03);
export const S1: React.FC<ShotProps> = ({ t, len }) => {
  const nod = Math.sin(t / 4) * 3;
  const pose = poseAt(t, [
    { f: 0, p: { x: S1_STAND.x, y: S1_STAND.y, scale: S1_STAND.scale, yaw: -0.15, tilt: 5, headTilt: 8 + nod, armL: { a: 16, b: -12 }, armR: { a: 10, b: -8 }, blink: 1 } },
    { f: 20, p: { tilt: 7 } },
    { f: 34, p: { headTilt: 11 + nod }, ease: easeOut },
  ]);
  const scrub = { x: Math.sin(t / 3) * 12, y: Math.cos(t / 4.2) * 6 };
  return (
    <g transform={camT(kf(t, [[0, 940], [len, 950]]), 560, kf(t, [[0, 0.92], [len, 0.96]]))}>
      <Kitchen t={t + 60} id="k1" veil={0.38} />
      <InkFigure x={S1_INK.x} ground={S1_INK.y} s={0.82} edge={1} pose={{ lean: 10, armL: { a: 45, b: 10 }, armR: { a: 39, b: 0 } }} />
      {/* the tap is running: a water arc into the basin, the sponge in the ink's hands, suds in the basin below */}
      <path d={`M ${S1_TAP.x + 22} ${S1_TAP.y - 52} Q ${S1_TAP.x + 26 + scrub.x * 0.3} ${S1_TAP.y - 10} ${S1_TAP.x + 22 + scrub.x * 0.5} ${S1_TAP.y + 42}`} stroke="#BFE3EE" strokeWidth={6} fill="none" strokeLinecap="round" opacity={0.85} />
      <g transform={`translate(${S1_TAP.x - 120 + scrub.x} ${S1_TAP.y - 130 + scrub.y}) rotate(${Math.sin(t / 3) * 14})`}>
        <rect x={-26} y={-14} width={52} height={26} rx={8} fill="#E9C84A" stroke="#C7A83C" strokeWidth={3} />
      </g>
      <circle cx={S1_TAP.x - 112} cy={S1_TAP.y - 74} r={5} fill="#EAF6FA" opacity={0.8} />
      <circle cx={S1_TAP.x - 104} cy={S1_TAP.y - 46} r={4} fill="#EAF6FA" opacity={0.6} />
      {[-30, -16, -2, 12, 26].map((dx, i) => (
        <circle key={i} cx={S1_TAP.x - 110 + dx + scrub.x * 0.5} cy={S1_TAP.y + 14 + (i % 2) * 16 - Math.sin((t + i * 20) / 5) * 4} r={6 + (i % 3) * 3} fill="#EAF6FA" opacity={0.7} />
      ))}
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'tired']]) }} rimId="rimR" shadow={0.5} />
      <KitchenIsland />
      <Dust t={t + 30} seed={61} x0={700} y0={380} w={460} h={420} n={30} />
      <Foreground blur={10}>
        <path d="M 1410 1080 Q 1480 780 1620 720 Q 1560 880 1580 1080 Z" fill="#0E1610" />
      </Foreground>
    </g>
  );
};

// ---------- S2: macro, top-down over the sink: the ink mitten scrubs a plate through the suds ----------
const suds = (cx: number, cy: number, r: number, t: number): React.ReactNode => (
  <g>
    {Array.from({ length: 26 }).map((_, i) => {
      const a = rnd(7, i) * Math.PI * 2;
      const rr = rnd(8, i) * r;
      return <circle key={i} cx={cx + Math.cos(a) * rr} cy={cy + Math.sin(a) * rr * 0.92} r={10 + rnd(9, i) * 26} fill="#F6FBFD" opacity={0.24 + rnd(5, i) * 0.3} />;
    })}
    {[-140, -60, 40, 130].map((dx, i) => (
      <circle key={`b${i}`} cx={cx + dx + Math.sin((t + i * 30) / 6) * 10} cy={cy + (i % 2 ? 120 : -110)} r={16 + (i % 3) * 8} fill="#FFFFFF" opacity={0.7} />
    ))}
  </g>
);

export const S2: React.FC<ShotProps> = ({ t, len }) => {
  const armX = kf(t, [[0, 1060], [12, 1040], [30, 1072], [52, 1044], [65, 1056]]);
  const armY = kf(t, [[0, 250], [14, 286], [32, 262], [50, 292], [65, 276]]);
  return (
    <g transform={camT(960, 540, kf(t, [[0, 0.98], [len, 1.06]]))}>
      <Tabletop edge={980} kind="stone" floor="#20232C" floorLines="#191C24" />
      <LightVeil id="s2veil" lights={[[930, 430, 720]]} o={0.52} />
      <Glow x={930} y={400} r={640} o={0.34} />
      {/* the sink basin set in the stone: a steel lip, deep water full of suds */}
      <ellipse cx={940} cy={540} rx={430} ry={380} fill="#23262C" />
      <ellipse cx={940} cy={540} rx={430} ry={380} fill="none" stroke="#6A7078" strokeWidth={26} />
      {suds(940, 540, 330, t)}
      <PlateTop x={880} y={520} r={195} />
      {/* a fork resting in the suds at the basin's edge */}
      <g transform="rotate(18 1240 690)">
        <rect x={1150} y={684} width={170} height={14} rx={7} fill="#B9BEC6" />
        {[0, 1, 2].map((i) => <rect key={i} x={1322} y={674 + i * 11} width={26} height={8} rx={4} fill="#B9BEC6" />)}
      </g>
      {/* the ink arm from the top of frame, working a yellow sponge over the plate */}
      <g>
        <path d={`M ${armX + 150} -420 Q ${armX - 60} ${armY - 190} ${armX - 20} ${armY - 40} Q ${armX - 30} ${armY + 10} ${armX - 70} ${armY + 24}`} stroke={EDGE} strokeWidth={96} fill="none" strokeLinecap="round" />
        <path d={`M ${armX + 150} -420 Q ${armX - 60} ${armY - 190} ${armX - 20} ${armY - 40} Q ${armX - 30} ${armY + 10} ${armX - 70} ${armY + 24}`} stroke={INK} strokeWidth={78} fill="none" strokeLinecap="round" />
        <g transform={`translate(${armX - 78} ${armY + 26}) rotate(${24 + Math.sin(t / 3) * 16})`}>
          <ellipse cx={0} cy={0} rx={52} ry={38} fill={EDGE} />
          <ellipse cx={0} cy={0} rx={42} ry={30} fill={INK} />
          <rect x={-58} y={-20} width={110} height={46} rx={12} fill="#E9C84A" stroke={EDGE} strokeWidth={4} />
          <rect x={-44} y={-2} width={80} height={26} rx={10} fill="#C7A83C" />
        </g>
      </g>
      {wakePop(810, 330, t, 44)}
    </g>
  );
};

// ---------- S3: medium, the study at night: Pip yawns while the shadow's ink arm writes his homework ----------
export const S3: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 920, y: 716, scale: 1.05, yaw: 0.35, look: 0.85, tilt: 2, armL: { a: 26, b: -40 }, armR: { a: 55, b: 60 } } },
    { f: 8, p: { headTilt: -6, armR: { a: 66, b: 74 } }, ease: easeOut },
    { f: 16, p: { headTilt: -7 } },
  ]);
  const write = Math.sin(t / 2.4) * 9;
  return (
    <g transform={camT(kf(t, [[0, 1010], [len, 1000]]), 520, kf(t, [[0, 1.42], [len, 1.5]]))}>
      <Study t={t + 130} id="st3" night />
      <Desk x0={560} x1={1360} y={700} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'tired'], [14, 'neutral']]) }} rimId="rimR" shadow={0} />
      {/* the homework sheet lies flat on the desk, its lines filling as the pen moves */}
      <g transform="rotate(-3 1180 668)">
        <rect x={1040} y={632} width={280} height={72} rx={4} fill="#F3EDDC" stroke="#D8D0B8" strokeWidth={2} />
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={1056} y={644 + i * 15} width={clamp((t - 2 - i * 5) / 6) * 240} height={4} rx={2} fill="#8A94A8" />
        ))}
      </g>
      {/* the shadow leans in from the wall on the right, its arm reaching down to the sheet */}
      <g transform={`translate(0 ${Math.sin(t / 5) * 2})`}>
        <path d={`M 1900 470 Q 1660 470 1470 570 Q 1370 622 ${1316 + write * 0.3} 646`} stroke={EDGE} strokeWidth={78} fill="none" strokeLinecap="round" />
        <path d={`M 1900 470 Q 1660 470 1470 570 Q 1370 622 ${1316 + write * 0.3} 646`} stroke={INK} strokeWidth={62} fill="none" strokeLinecap="round" />
        <path d={`M ${1296 + write * 0.4} ${640} L ${1240 + write} ${666}`} stroke="#E9C84A" strokeWidth={12} strokeLinecap="round" />
        <circle cx={1240 + write} cy={666} r={4.5} fill="#3A3A44" />
        <ellipse cx={1302 + write * 0.4} cy={634} rx={30} ry={20} fill={EDGE} transform={`rotate(${-24 + write * 0.5} ${1302 + write * 0.4} ${634})`} />
        <ellipse cx={1302 + write * 0.4} cy={634} rx={23} ry={15} fill={INK} transform={`rotate(${-24 + write * 0.5} ${1302 + write * 0.4} ${634})`} />
      </g>
      <Foreground blur={10}>
        <path d="M 60 1080 Q 40 760 180 700 Q 260 860 280 1080 Z" fill="#0C1210" />
      </Foreground>
    </g>
  );
};

// ---------- S4: macro, top-down: the ink mitten finishes the last line; a DONE tick pops ----------
export const S4: React.FC<ShotProps> = ({ t }) => {
  const write = Math.sin(t / 2) * 10;
  return (
    <g transform={`translate(960 540) rotate(${-1.5 + t * 0.03}) scale(${1 + t * 0.002}) translate(-960 -540)`}>
      <Tabletop edge={1240} />
      <Glow x={1000} y={430} r={700} o={0.3} />
      <Paper x={760} y={560} w={360} rot={-6} done={false} fill={1} />
      <rect x={150} y={860} width={210} height={200} rx={12} fill="#1C1A26" transform="rotate(-6 250 960)" />
      {/* the ink mitten, holding the pencil, finishes the last line on the sheet */}
      <g transform={`translate(0 ${Math.sin(t / 4) * 2})`}>
        <path d={`M 1750 -300 Q 1400 20 ${1030 + write * 0.4} ${320}`} stroke={EDGE} strokeWidth={82} fill="none" strokeLinecap="round" />
        <path d={`M 1750 -300 Q 1400 20 ${1030 + write * 0.4} ${320}`} stroke={INK} strokeWidth={64} fill="none" strokeLinecap="round" />
        <path d={`M ${1010 + write * 0.4} ${330} L ${930 + write} ${392}`} stroke="#E9C84A" strokeWidth={13} strokeLinecap="round" />
        <circle cx={930 + write} cy={392} r={5} fill="#3A3A44" />
        <ellipse cx={1022 + write * 0.4} cy={322} rx={42} ry={30} fill={EDGE} transform={`rotate(${-40 + write * 0.4} ${1022 + write * 0.4} ${322})`} />
        <ellipse cx={1022 + write * 0.4} cy={322} rx={34} ry={23} fill={INK} transform={`rotate(${-40 + write * 0.4} ${1022 + write * 0.4} ${322})`} />
      </g>
      {t > 6 ? <Tag x={660} y={250} t={t - 6} text="DONE" mark="check" w={230} /> : null}
    </g>
  );
};

// ---------- S5: medium wide, low angle on the stairs: Pip waves at Mo; the shadow waves first ----------
const noseY = (x: number) => (x < 420 ? 420 : 420 + ((x - 420) * 70) / 150);
const s5hips = (x: number, extra: Partial<Pose> = {}): Pose => ({
  ...basePose,
  x,
  y: noseY(x) - LEG_LEN * 0.9,
  scale: 0.9,
  ...extra,
});
export const S5: React.FC<ShotProps> = ({ t, len }) => {
  const inkPose = poseAt(t, [
    { f: 0, p: { armR: { a: 20, b: 8 }, armL: { a: -10, b: -8 } } },
    { f: 10, p: { armR: { a: 104, b: -40 } }, ease: easeOut },
    { f: 20, p: { armR: { a: 148, b: 14 } }, ease: easeOut },
  ]);
  const pipPose = poseAt(t, [
    { f: 0, p: { ...s5hips(340), yaw: 0.45, look: 0.9, armL: { a: 14, b: -10 }, armR: { a: 16, b: -8 } } },
    { f: 6, p: { armR: { a: 52, b: -26 } }, ease: easeOut },
    { f: 26, p: { armR: { a: 150, b: 14 } }, ease: easeOut },
  ]);
  const moPose = poseAt(t, [
    { f: 0, p: { ...s5hips(1240), yaw: -0.5, look: -0.9, armL: { a: 18, b: -10 }, armR: { a: 12, b: -6 } } },
    { f: 30, p: {}, ease: easeOut },
    { f: 38, p: { armL: { a: 120, b: 26 }, headTilt: -4 }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 700], [len, 710]]), 420, kf(t, [[0, 0.98], [len, 1.04]]))}>
      <Stairwell t={t + 210} id="sw5" />
      {/* the shadow, a step to Pip's right on the wall behind him: it waves first */}
      <InkFigure x={560} ground={noseY(545)} s={0.88} edge={1} pose={{ ...inkPose, lean: 4 }} />
      <Hero look={PIP} pose={{ ...pipPose, ...faceAt(t, [[0, 'happy'], [26, 'smug']]) }} rimId="rimL" shadow={0.5} />
      <Hero look={MO} pose={{ ...moPose, ...faceAt(t, [[0, 'happy'], [34, 'shock']]) }} rimId="rimR" shadow={0.5} />
      {wakePop(570, noseY(545) - 330, t, 20)}
      <Foreground blur={10}>
        <path d="M 100 1080 Q 220 800 340 780 Q 380 940 400 1080 Z" fill="#0C1210" />
      </Foreground>
    </g>
  );
};

// ---------- S6: the title, wide on the roof at dusk: Pip small, his shadow waving beside him ----------
export const S6: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 900, y: 840 - LEG_LEN * 0.62, scale: 0.62, yaw: 0.1, armL: { a: 18, b: -6 }, armR: { a: 14, b: -6 } } },
    { f: 30, p: { headTilt: 3 }, ease: easeOut },
  ]);
  return (
    <g transform={camT(960, kf(t, [[0, 520], [len, 545]]), kf(t, [[0, 1.0], [len, 1.08]]))}>
      <Rooftop t={t} sunX={960} sunY={690 - 40 * easeOut(clamp(t / 40))} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [20, 'happy']]) }} rimId="rimR" shadow={0.6} />
      <InkFigure x={1130} ground={840} s={0.6} edge={1} pose={{ armR: { a: 148 + Math.sin(t / 3.4) * 14, b: 12 }, lean: 3 }} />
      <TitleCard t={t} lines={['WHAT IF YOUR SHADOW', 'MOVED ON ITS OWN?']} accent="MOVED" accentT={30} size={88} y={170} />
    </g>
  );
};

// ---------- S7: macro: Pip's mitten hangs still; beside it the ink hand rises and waves on its own ----------
const edgeOn = (t: number) => clamp((t - 14) / 6) * 0.85 + 0.15;
const inkWave = (t: number) => {
  const up = clamp((t - 18) / 22);
  const y = 900 - up * 330;
  const waveA = Math.sin((t - 20) / 2.4) * 26 * clamp((t - 24) / 10);
  return (
    <g opacity={up}>
      <path d={`M 850 ${y + 150} L 850 ${y + 30}`} stroke={EDGE} strokeWidth={88} strokeLinecap="round" fill="none" opacity={0.4} />
      <path d={`M 850 ${y + 150} L 850 ${y + 30}`} stroke={INK} strokeWidth={70} strokeLinecap="round" fill="none" />
      <g transform={`translate(850 ${y + 20}) rotate(${waveA})`}>
        <ellipse cx={0} cy={-26} rx={46} ry={36} fill={EDGE} opacity={0.5} />
        <ellipse cx={0} cy={-26} rx={38} ry={28} fill={INK} />
        {[-24, 0, 24].map((dx) => (
          <rect key={dx} x={dx - 7} y={-80} width={14} height={32} rx={7} fill={INK} stroke={EDGE} strokeWidth={3} />
        ))}
      </g>
    </g>
  );
};
export const S7: React.FC<ShotProps> = ({ t, len }) => {
  const jx = Math.sin(t / 1.7) * 3;
  return (
    <g transform={camT(960, kf(t, [[0, 560], [len, 540]]), kf(t, [[0, 1.0], [len, 1.1]]))}>
      <g filter="url(#blur16)">
        <g transform="translate(-430 -300) scale(1.35)">
          <Rooftop t={t + 80} sunX={1240} sunY={640} low={300} cityLit={2.2} />
        </g>
      </g>
      <rect x={-400} y={-400} width={2720} height={1880} fill="#07040C" opacity={0.18} />
      {/* Pip's dark sleeve and mitten, from the bottom of frame, hanging loose */}
      <g filter="url(#rimR)">
        <path d="M 330 1220 Q 390 950 440 790" stroke={PIP.line} strokeWidth={170} fill="none" strokeLinecap="round" />
        <path d="M 330 1220 Q 390 950 440 790" stroke={PIP.limb} strokeWidth={144} fill="none" strokeLinecap="round" />
        <ellipse cx={478} cy={712} rx={86} ry={58} fill={PIP.hand} stroke={PIP.line} strokeWidth={10} transform="rotate(56 478 712)" />
        <path d="M 424 756 Q 456 776 496 764" stroke={PIP.line} strokeWidth={8} fill="none" opacity={0.7} />
      </g>
      {/* the shadow's ink hand, rising beside it */}
      <g transform={`translate(${Math.sin(t / 2.1) * 7} ${Math.cos(t / 2.7) * 5})`} opacity={edgeOn(t)}>
        <path d="M 880 1160 Q 870 960 852 780" stroke={EDGE} strokeWidth={104} fill="none" strokeLinecap="round" />
        <path d="M 880 1160 Q 870 960 852 780" stroke={INK} strokeWidth={86} fill="none" strokeLinecap="round" />
        {inkWave(t)}
      </g>
      <Foreground blur={6}>
        <path d="M 1500 1080 Q 1460 900 1520 820 Q 1580 940 1560 1080 Z" fill="#0A0E14" />
      </Foreground>
    </g>
  );
};

// ---------- S8: schematic: the Moon's shadow sweeps a coastline; 4,000 km and a dial to 90:00 ----------
const SWEEP = { x0: 240, x1: 940, y: 420, r: 86 };
export const S8: React.FC<ShotProps> = ({ t }) => {
  const sweep = easeOut(clamp((t - 6) / 56));
  const mins = 90 * easeOut(clamp((t - 16) / 44));
  const read = `${String(Math.floor(mins)).padStart(2, '0')}:${String(Math.floor((mins % 1) * 60)).padStart(2, '0')}`;
  const sx = SWEEP.x0 + (SWEEP.x1 - SWEEP.x0) * sweep;
  return (
    <g>
      <Schematic t={t} id="sch8" />
      <SchLabel x={960} y={140} t={t - 2} text="THE MOON'S SHADOW · 21 AUG 2017" size={44} />
      <DrawOn d="M 160 940 L 300 760 Q 360 680 520 700 L 700 740 Q 830 750 900 840 L 920 940" t={t - 4} dur={26} width={7} />
      {/* the umbra sweeping: a dark disc with a soft ring and a fading trail */}
      <g>
        {Array.from({ length: 5 }).map((_, i) => {
          const q = sweep - (i + 1) * 0.06;
          if (q <= 0) return null;
          return <circle key={i} cx={SWEEP.x0 + (SWEEP.x1 - SWEEP.x0) * q} cy={SWEEP.y} r={SWEEP.r * 0.9} fill="#050B14" opacity={0.36 - i * 0.06} />;
        })}
        <circle cx={sx} cy={SWEEP.y} r={SWEEP.r} fill="#050B14" />
        <circle cx={sx} cy={SWEEP.y} r={SWEEP.r + 8} fill="none" stroke="#3A5A80" strokeWidth={4} opacity={0.5} />
      </g>
      <CountUp x={480} y={920} t={t - 10} to={4000} dur={40} size={64} />
      <SchLabel x={480} y={972} t={t - 14} text="KM, COAST TO COAST" size={30} color={SCH.dim} />
      <Dial x={1465} y={520} r={210} p={mins / 90} readout={read} size={92} />
      <SchLabel x={1465} y={830} t={t - 12} text="MINUTES, END TO END" size={34} color={SCH.dim} />
    </g>
  );
};

// ---------- S9: schematic: the shadow's ground speed outpacing the Concorde; THAT'S REAL ----------
const Lane: React.FC<{ y: number; label: string; live: boolean; w: number; kmH: number }> = ({ y, label, live, w, kmH }) => (
  <g>
    <rect x={260} y={y - 26} width={940} height={52} rx={26} fill="none" stroke={live ? SCH.live : SCH.dim} strokeWidth={3} opacity={0.45} />
    <rect x={268} y={y - 18} width={(w / 2700) * 924} height={36} rx={18} fill={live ? '#5E2606' : '#26303E'} />
    <g transform={`translate(${268 + (w / 2700) * 924} ${y}) rotate(-28)`}>
      <rect x={-26} y={-26} width={52} height={52} rx={10} fill={live ? SCH.live : '#8A98AC'} />
    </g>
    <text x={260} y={y - 52} fontFamily={FONT.ui} fontSize={34} fill={live ? SCH.live : SCH.dim} letterSpacing={2} textAnchor="start">{label}</text>
    <text x={1660} y={y + 11} fontFamily={FONT.ui} fontSize={46} fill={live ? SCH.live : SCH.dim} letterSpacing={1} textAnchor="end">{kmH.toLocaleString('en-US')} KM/H</text>
  </g>
);
export const S9: React.FC<ShotProps> = ({ t }) => {
  const wShadow = 2700 * easeOut(clamp((t - 8) / 46));
  const wConc = 2180 * easeOut(clamp((t - 26) / 44));
  return (
    <g>
      <Schematic t={t + 40} id="sch9" />
      <SchLabel x={960} y={150} t={t - 2} text="GROUND SPEED" size={42} />
      <Lane y={380} label="THE SHADOW'S TRACK" live w={wShadow} kmH={2700} />
      <Lane y={640} label="CONCORDE, CRUISING" live={false} w={wConc} kmH={2180} />
      <SchLabel x={260} y={860} t={t - 50} text="FASTER THAN ANY JET EVER FLEW" size={36} color={SCH.live} anchor="start" />
      {t > 42 ? <SchLabel x={1660} y={860} t={t - 44} text="THAT'S REAL." size={44} color={SCH.live} /> : null}
    </g>
  );
};

// ---------- S10: extreme close-up: Pip, worried, as the light reddens; behind him the ink hand waves ----------
export const S10: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 6.6 * (1 + 0.04 * clamp(t / len));
  const head = { x: 900, y: 720 };
  const red = 0.35 + 0.3 * clamp(t / len);
  const pose: Pose = { ...basePose, x: head.x, y: head.y + 176 * sc, scale: sc, yaw: -0.12, look: -0.25, armL: { a: 14, b: -6 }, armR: { a: 14, b: -6 }, headTilt: clamp((t - 6) / 10) * -5, ...faceAt(t, [[0, 'worried'], [26, 'shock']]) };
  const waveA = Math.sin((t - 14) / 2.6) * 20 * clamp((t - 16) / 8);
  return (
    <g>
      <g filter="url(#blur16)">
        <g transform="translate(-620 -520) scale(2)">
          <Rooftop t={t + 300} sunX={1180} sunY={600} red={red} low={180} cityLit={2.2} />
        </g>
      </g>
      <rect x={0} y={0} width={1920} height={1080} fill="#07040C" opacity={0.22} />
      {/* the ink hand waves, out of focus, behind his shoulder */}
      <g filter="url(#blur6)" opacity={0.92}>
        <g transform="translate(1470 300) rotate(8)">
          <path d={`M 0 240 L ${waveA * 0.2} 120 Q ${waveA * 0.4} 10 ${waveA} -30`} stroke={INK} strokeWidth={64} strokeLinecap="round" fill="none" opacity={0.75 + clamp((t - 12) / 10) * 0.2} />
          <ellipse cx={waveA} cy={-30} rx={36} ry={26} fill={INK} />
          <path d={`M 0 240 L ${waveA * 0.2} 120`} stroke={EDGE} strokeWidth={70} strokeLinecap="round" fill="none" opacity={0.16} />
        </g>
      </g>
      <Hero look={PIP} pose={pose} rimId={t > len * 0.55 ? 'rimRed' : 'rimL'} shadow={0} />
    </g>
  );
};
