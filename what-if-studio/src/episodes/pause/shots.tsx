import React from 'react';
import {
  LightVeil, DrawOn,
  Hero, Pose, basePose, poseAt, faceAt, kf, clamp, easeOut, easeIn, rnd, camT, LOOKS, LEG_LEN,
  Kitchen, KitchenIsland, KITCHEN, islandTop, stand, Tabletop, Stairwell, Rooftop, Schematic, SCH, Arrow, SchLabel, CountUp,
  PlateTop, CookieTop, TitleCard, Glow, ShotProps,
} from '../../engine';

const PIP = LOOKS.pipHood;
const MO = LOOKS.mo;
const CYAN = '#38BDF8';
const FROST = '#BAE6FD';

// Freeze badge icon (two vertical bars)
const PauseIcon: React.FC<{ x: number; y: number; s?: number; opacity?: number }> = ({ x, y, s = 1, opacity = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={opacity}>
    <circle cx={0} cy={0} r={28} fill="#0284C7" opacity={0.6} filter="drop-shadow(0 0 12px #38BDF8)" />
    <circle cx={0} cy={0} r={24} fill="#0F172A" stroke={CYAN} strokeWidth={3} />
    <rect x={-9} y={-11} width={6} height={22} rx={3} fill="#FFFFFF" />
    <rect x={3} y={-11} width={6} height={22} rx={3} fill="#FFFFFF" />
  </g>
);

// S1: Kitchen, Pip watching mug tip over
export const S1: React.FC<ShotProps> = ({ t, len }) => {
  const p = stand(KITCHEN, 0.42, 0.4);
  const mugX = 980 + Math.min(60, t * 2);
  const mugY = 560 + Math.max(0, (t - 15) * 12);
  const mugRot = Math.min(45, t * 2.2);
  const pose = poseAt(t, [
    { f: 0, p: { x: p.x, y: p.y, scale: p.scale, yaw: 0.5, look: 0.9, armL: { a: 15, b: -5 }, armR: { a: 25, b: -10 } } },
    { f: 20, p: { armR: { a: 75, b: -10 }, look: 1, headTilt: 6 }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 980]]), 580, kf(t, [[0, 1.8], [len, 1.88]]))}>
      <Kitchen t={t} id="k_s1" />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'shock']]) }} rimId="rimR" shadow={0} />
      <KitchenIsland />
      {/* Coffee mug slipping */}
      <g transform={`translate(${mugX} ${mugY}) rotate(${mugRot})`}>
        <rect x={-20} y={-35} width={40} height={50} rx={6} fill="#F8FAFC" stroke="#0F172A" strokeWidth={5} />
        <path d="M 20 -20 Q 38 -10 20 0" fill="none" stroke="#0F172A" strokeWidth={5} />
        <ellipse cx={0} cy={-30} rx={16} ry={6} fill="#6F4E37" />
      </g>
    </g>
  );
};

// S2: Macro insert: Mug suspended mid-air in cyan frost glow
export const S2: React.FC<ShotProps> = ({ t, len }) => {
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.3], [len, 1.38]]))}>
      <Tabletop edge={900} wood="#94A3B8" grain="#64748B" lip="#475569" kind="stone" floor="#0F172A" floorLines="#1E293B" />
      <LightVeil id="s2veil" lights={[[960, 500, 700]]} o={0.6} />
      <Glow x={960} y={480} r={400} o={0.7} />
      {/* Frozen mug hovering */}
      <g transform="translate(960 480) rotate(32)">
        <rect x={-45} y={-70} width={90} height={110} rx={14} fill="#F8FAFC" stroke="#0F172A" strokeWidth={8} />
        <path d="M 45 -40 Q 80 -15 45 10" fill="none" stroke="#0F172A" strokeWidth={8} />
        <ellipse cx={0} cy={-60} rx={36} ry={14} fill="#6F4E37" />
        {/* Frozen coffee droplets */}
        <circle cx={-15} cy={-90} r={12} fill="#6F4E37" stroke={CYAN} strokeWidth={4} />
        <circle cx={10} cy={-115} r={8} fill="#6F4E37" stroke={CYAN} strokeWidth={3} />
        {/* Cyan frost aura */}
        <rect x={-52} y={-76} width={104} height={122} rx={18} fill="none" stroke={CYAN} strokeWidth={5} strokeDasharray="16 8" opacity={0.8} />
      </g>
      <PauseIcon x={1120} y={380} s={1.3} />
    </g>
  );
};

// S3: Close up: Pip slides coaster under it
export const S3: React.FC<ShotProps> = ({ t, len }) => {
  const p = stand(KITCHEN, 0.44, 0.4);
  const pose = poseAt(t, [
    { f: 0, p: { x: p.x, y: p.y, scale: p.scale, yaw: 0.4, look: 0.7, armL: { a: 15, b: -5 }, armR: { a: 45, b: 0 } } },
    { f: 25, p: { armR: { a: 30, b: -10 }, look: 0.8 }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 980]]), 560, kf(t, [[0, 2.0], [len, 2.1]]))}>
      <Kitchen t={t} id="k_s3" />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'smug']]) }} rimId="rimR" shadow={0} />
      <KitchenIsland />
      {/* Coaster placed calmly */}
      <rect x={940} y={640} width={80} height={12} rx={4} fill="#0284C7" stroke="#0F172A" strokeWidth={4} />
      {/* Mug floating safely */}
      <rect x={960} y={590} width={40} height={50} rx={6} fill="#F8FAFC" stroke="#0F172A" strokeWidth={5} />
    </g>
  );
};

// S4: Stairwell, Mo falling
export const S4: React.FC<ShotProps> = ({ t, len }) => {
  const moTilt = Math.min(48, t * 2.5);
  const moPose: Partial<Pose> = {
    x: 920,
    y: 540 + t * 4,
    scale: 0.88,
    yaw: -0.4,
    look: -0.9,
    armL: { a: -80, b: 30 },
    armR: { a: 85, b: 40 },
    tilt: moTilt,
  };
  return (
    <g transform={camT(960, 520, kf(t, [[0, 1.25], [len, 1.35]]))}>
      <Stairwell t={t} id="sw_s4" />
      <Hero look={MO} pose={{ ...basePose, ...moPose, ...faceAt(t, [[0, 'shock']]) }} rimId="rimR" shadow={0} />
    </g>
  );
};

// S5: Freeze activated: Mo locked in mid-air tilt
export const S5: React.FC<ShotProps> = ({ t, len }) => {
  const moPose: Partial<Pose> = {
    x: 920,
    y: 580,
    scale: 0.9,
    yaw: -0.4,
    look: -0.9,
    armL: { a: -80, b: 30 },
    armR: { a: 85, b: 40 },
    tilt: 42,
  };
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.35], [len, 1.4]]))}>
      <Stairwell t={t} id="sw_s5" />
      <Glow x={920} y={540} r={350} o={0.7} />
      <g filter="drop-shadow(0 0 16px #38BDF8)">
        <Hero look={MO} pose={{ ...basePose, ...moPose, ...faceAt(t, [[0, 'shock']]) }} rimId="rimR" shadow={0} />
      </g>
      <PauseIcon x={1080} y={420} s={1.5} />
    </g>
  );
};

// S6: Pip pulls Mo safely back
export const S6: React.FC<ShotProps> = ({ t, len }) => {
  const pipPose = poseAt(t, [
    { f: 0, p: { x: 740, y: 520, scale: 0.88, yaw: 0.6, look: 0.8, armR: { a: 70, b: 0 } } },
    { f: 25, p: { armR: { a: 20, b: -20 }, look: 0.6 }, ease: easeOut },
  ]);
  const moY = 560 - Math.min(40, t * 1.5);
  return (
    <g transform={camT(880, 520, kf(t, [[0, 1.3], [len, 1.35]]))}>
      <Stairwell t={t} id="sw_s6" />
      <Hero look={PIP} pose={{ ...basePose, ...pipPose, ...faceAt(t, [[0, 'neutral']]) }} rimId="rimR" shadow={0} />
      <Hero look={MO} pose={{ ...basePose, x: 980, y: moY, scale: 0.88, yaw: -0.6, look: -0.6, armL: { a: -20, b: 10 }, armR: { a: 20, b: 10 }, ...faceAt(t, [[0, 'shock']]) }} rimId="rimR" shadow={0} />
    </g>
  );
};

// S7: Car rushing towards crosswalk
export const S7: React.FC<ShotProps> = ({ t, len }) => {
  const carX = 1400 - t * 25;
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.08]]))}>
      <Rooftop t={t} sunX={960} sunY={500} cityLit={1.2} />
      {/* Street ground */}
      <rect x={0} y={720} width={1920} height={360} fill="#1E293B" />
      <line x1={0} y1={880} x2={1920} y2={880} stroke="#E2E8F0" strokeWidth={10} strokeDasharray="60 40" />
      {/* Approaching Car */}
      <g transform={`translate(${carX} 760)`}>
        <rect x={-140} y={-80} width={280} height={90} rx={18} fill="#DC2626" stroke="#0F172A" strokeWidth={8} />
        <circle cx={-80} cy={15} r={32} fill="#0F172A" />
        <circle cx={80} cy={15} r={32} fill="#0F172A" />
        {/* Headlight beams */}
        <polygon points="-140,-50 -600,-90 -600,60 -140,-10" fill="#FEF08A" opacity={0.4} />
      </g>
    </g>
  );
};

// S8: Car frozen in tracks, Pip steps aside
export const S8: React.FC<ShotProps> = ({ t, len }) => {
  const pipX = 720 - Math.min(80, t * 1.5);
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.25], [len, 1.35]]))}>
      <Rooftop t={t} sunX={960} sunY={500} cityLit={1.0} />
      <rect x={0} y={720} width={1920} height={360} fill="#1E293B" />
      {/* Frozen Car with cyan frost rim */}
      <g transform="translate(1180 760)" filter="drop-shadow(0 0 18px #38BDF8)">
        <rect x={-160} y={-90} width={320} height={100} rx={20} fill="#DC2626" stroke="#0F172A" strokeWidth={8} />
        <circle cx={-90} cy={18} r={34} fill="#0F172A" />
        <circle cx={90} cy={18} r={34} fill="#0F172A" />
        <polygon points="-160,-50 -700,-100 -700,80 -160,-10" fill="#BAE6FD" opacity={0.3} />
        <rect x={-166} y={-96} width={332} height={112} rx={24} fill="none" stroke={CYAN} strokeWidth={6} strokeDasharray="20 10" />
      </g>
      <PauseIcon x={1180} y={640} s={1.6} />
      <Hero look={PIP} pose={{ ...basePose, x: pipX, y: 720, scale: 0.95, yaw: 0.5, look: 0.5, ...faceAt(t, [[0, 'cool']]) }} rimId="rimR" shadow={0} />
    </g>
  );
};

// S9: Title Card
export const S9: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.06]]))}>
    <Rooftop t={t} sunX={960} sunY={520} cityLit={1.3} />
    <Hero look={PIP} pose={{ ...basePose, x: 960, y: 760, scale: 0.7, yaw: 0, look: 0, armL: { a: 16, b: -8 }, armR: { a: 16, b: -8 } }} rimId="rimR" shadow={0.6} />
    <TitleCard t={t} lines={['WHAT IF YOU COULD', 'PAUSE EVERYONE BUT YOU?']} accent="PAUSE" accentT={30} size={88} y={160} />
  </g>
);

// S10: Wide street: Pip walking freely while world is frozen
export const S10: React.FC<ShotProps> = ({ t, len }) => {
  const walkX = 400 + t * 4.5;
  return (
    <g transform={camT(kf(t, [[0, 850], [len, 1100]]), 540, kf(t, [[0, 1.1], [len, 1.15]]))}>
      <Rooftop t={t} sunX={960} sunY={540} cityLit={1.1} />
      <rect x={0} y={720} width={1920} height={360} fill="#1E293B" />
      {/* Frozen pedestrians in greyscale / statue stillness */}
      <g filter="grayscale(90%) drop-shadow(0 0 10px #7DD3FC)" opacity={0.85}>
        <Hero look={MO} pose={{ ...basePose, x: 1350, y: 720, scale: 0.85, yaw: -0.6, look: -0.5, ...faceAt(0, [[0, 'neutral']]) }} rimId="rimR" shadow={0} />
      </g>
      {/* Moving Pip */}
      <Hero look={PIP} pose={{ ...basePose, x: walkX, y: 720, scale: 0.95, yaw: 0.7, look: 0.7, armL: { a: 25 * Math.sin(t / 4), b: 0 }, armR: { a: -25 * Math.sin(t / 4), b: 0 }, ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={0} />
    </g>
  );
};

// S11: Science breakdown: Photons stop (300,000 km/s -> 0 km/s)
export const S11: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={`translate(960 540) scale(${kf(t, [[0, 1.0], [len, 1.05]])}) translate(-960 -540)`}>
    <Schematic t={t} id="sch_s11" />
    <SchLabel x={960} y={130} t={t - 2} text="IF TIME STOPS, LIGHT CANNOT TRAVEL" size={50} />
    {/* Photon stream from lamp/sun */}
    <circle cx={340} cy={480} r={60} fill="#FACC15" filter="drop-shadow(0 0 20px #FACC15)" />
    <SchLabel x={340} y={580} t={t - 5} text="LIGHT SOURCE" size={32} />
    <Arrow x0={430} y0={480} x1={1200} y1={480} t={t - 10} dur={12} />
    {/* Velocity display dropping to 0 */}
    <g transform="translate(800 420)">
      <rect x={-180} y={-60} width={360} height={90} rx={12} fill="#0F172A" stroke="#38BDF8" strokeWidth={4} />
      <text x={0} y={-8} fill="#F8FAFC" fontSize={42} fontFamily="monospace" fontWeight="bold" textAnchor="middle">
        {t < 40 ? '300,000 km/s' : '0 km/s (FROZEN)'}
      </text>
      <text x={0} y={20} fill="#94A3B8" fontSize={22} fontFamily="sans-serif" textAnchor="middle">
        PHOTON SPEED
      </text>
    </g>
    {/* Your Eye receiving 0 flux */}
    <g transform="translate(1400 480)">
      <ellipse cx={0} cy={0} rx={80} ry={50} fill="#1E293B" stroke="#F8FAFC" strokeWidth={6} />
      <circle cx={-10} cy={0} r={28} fill="#0284C7" />
      <circle cx={-10} cy={0} r={14} fill="#0F172A" />
      <SchLabel x={0} y={90} t={t - 15} text="RETINA: 0 PHOTONS" size={30} color="#EF4444" />
    </g>
  </g>
);

// S12: Close-up: Pitch blackness swallowing Pip
export const S12: React.FC<ShotProps> = ({ t, len }) => {
  const darkOpacity = Math.min(0.98, t * 0.035);
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.8], [len, 2.1]]))}>
      <Rooftop t={t} sunX={960} sunY={540} cityLit={0.5} />
      <Hero look={PIP} pose={{ ...basePose, x: 960, y: 760, scale: 1.4, yaw: 0, look: 0, ...faceAt(t, [[0, 'shock']]) }} rimId="rimR" shadow={0} />
      {/* Darkness vignette closing in */}
      <rect x={0} y={0} width={1920} height={1080} fill="#000000" opacity={darkOpacity} />
    </g>
  );
};

// S13: Medium: Frozen air molecules like glass walls
export const S13: React.FC<ShotProps> = ({ t, len }) => {
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.2], [len, 1.25]]))}>
      <rect x={0} y={0} width={1920} height={1080} fill="#090D16" />
      {/* Grid of frozen crystalline gas molecules */}
      <g stroke={CYAN} strokeWidth={2} opacity={0.65}>
        {[300, 500, 700, 900, 1100, 1300, 1500].map((x) =>
          [200, 360, 520, 680, 840].map((y) => (
            <g key={`${x}-${y}`} transform={`translate(${x} ${y})`}>
              <polygon points="0,-25 22,-12 22,12 0,25 -22,12 -22,-12" fill="none" stroke="#38BDF8" strokeWidth={2} />
              <circle cx={0} cy={0} r={6} fill="#BAE6FD" />
            </g>
          ))
        )}
      </g>
      {/* Pip pushing against the barrier */}
      <Hero look={PIP} pose={{ ...basePose, x: 820, y: 740, scale: 1.0, yaw: 0.7, look: 0.8, armL: { a: 80, b: 0 }, armR: { a: 85, b: 0 }, ...faceAt(t, [[0, 'shock']]) }} rimId="rimR" shadow={0} />
      <SchLabel x={960} y={160} t={t - 4} text="AIR CANNOT BE INHALED OR MOVED" size={44} color="#EF4444" />
    </g>
  );
};

// S14: Wide cliffhanger: Dusk city skyline, Pip trapped in darkness
export const S14: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.05]]))}>
    <rect x={0} y={0} width={1920} height={1080} fill="#020617" />
    <Rooftop t={t} sunX={960} sunY={680} cityLit={0.3} />
    <Hero look={PIP} pose={{ ...basePose, x: 960, y: 760, scale: 0.75, yaw: 0, look: 0, armL: { a: 15, b: -5 }, armR: { a: 15, b: -5 }, ...faceAt(t, [[0, 'worried']]) }} rimId="rimR" shadow={0} />
    <SchLabel x={960} y={280} t={t - 10} text="WHO UNFREEZES YOU?" size={68} color="#38BDF8" />
  </g>
);

