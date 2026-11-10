import React from 'react';
import {
  LightVeil,
  Hero, Pose, basePose, poseAt, faceAt, kf, clamp, easeOut, easeIn, camT, LOOKS,
  Kitchen, KitchenIsland, KITCHEN, islandTop, stand, Tabletop, Stairwell, Rooftop, Schematic, SCH, Arrow, SchLabel, CountUp,
  TitleCard, Glow,
} from '../../engine';

const PIP = LOOKS.pipHood;
const MO = LOOKS.mo;
const SIS = LOOKS.sis;
const CYAN = '#38BDF8';
const GOLD = '#FBBF24';

// Top Chapter HUD
export const GravityHeader: React.FC<{ num: number; title: string; subtitle?: string; f: number }> = ({ num, title, subtitle, f }) => (
  <g transform="translate(60 50)" opacity={clamp(f / 20)}>
    <rect x={0} y={0} width={640} height={70} rx={10} fill="#0F172A" opacity={0.88} stroke={CYAN} strokeWidth={2} />
    <circle cx={35} cy={35} r={18} fill="#0284C7" />
    <text x={35} y={42} fill="#FFFFFF" fontSize={20} fontWeight="bold" fontFamily="monospace" textAnchor="middle">
      {num}
    </text>
    <text x={70} y={34} fill="#F8FAFC" fontSize={22} fontWeight="bold" fontFamily="sans-serif">
      {title.toUpperCase()}
    </text>
    {subtitle && (
      <text x={70} y={55} fill="#94A3B8" fontSize={15} fontFamily="sans-serif">
        {subtitle}
      </text>
    )}
  </g>
);

// Gravity Telemetry Badge
export const GravityMeter: React.FC<{ gValue: string; status: string; alert?: boolean }> = ({ gValue, status, alert = false }) => (
  <g transform="translate(1400 50)">
    <rect x={0} y={0} width={460} height={70} rx={10} fill="#0F172A" opacity={0.9} stroke={alert ? '#EF4444' : CYAN} strokeWidth={2} filter="drop-shadow(0 0 12px rgba(56,189,248,0.3))" />
    <circle cx={30} cy={35} r={10} fill={alert ? '#EF4444' : '#22C55E'} />
    <text x={55} y={32} fill="#F8FAFC" fontSize={20} fontWeight="bold" fontFamily="monospace">
      {`GRAVITY: ${gValue}`}
    </text>
    <text x={55} y={54} fill={alert ? '#F87171' : '#38BDF8'} fontSize={15} fontFamily="sans-serif">
      {status}
    </text>
  </g>
);

// ========================================================
// CHAPTER 1: THE WEIGHTLESS MORNING (Kitchen, 54.7s = 1641 frames)
// ========================================================
export const Chapter1: React.FC<{ f: number }> = ({ f }) => {
  const p = stand(KITCHEN, 0.42, 0.4);
  const floatY = p.y - Math.min(220, f * 0.22);
  const floatRot = Math.sin(f / 25) * 8;
  return (
    <g transform={camT(kf(f, [[0, 960], [1600, 1000]]), 540, kf(f, [[0, 1.2], [1600, 1.35]]))}>
      <Kitchen t={f} id="g_ch1" />
      {/* Floating Pip */}
      <g transform={`rotate(${floatRot} ${p.x} ${floatY})`}>
        <Hero look={PIP} pose={{ ...basePose, x: p.x, y: floatY, scale: p.scale, yaw: 0.4, look: 0.8, armL: { a: -30, b: 20 }, armR: { a: 45, b: 20 }, legL: { a: 20, b: 20 }, legR: { a: -15, b: 15 }, ...faceAt(f, [[0, 'shock'], [300, 'happy']]) }} rimId="rimR" shadow={0} />
      </g>
      <KitchenIsland />
      {/* Shimmering spheres of floating milk */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const my = 580 - ((f * 1.5 + i * 40) % 350);
        const mx = 920 + Math.sin(i * 1.2 + f / 20) * 80;
        return (
          <circle key={i} cx={mx} cy={my} r={14 - i * 1.5} fill="#FFFFFF" opacity={0.85} filter="drop-shadow(0 0 10px #BAE6FD)" />
        );
      })}
      {/* Neighbor's Cat Floating Outside Window */}
      {f > 500 && (
        <g transform={`translate(${1450 - f * 0.15} ${320 + Math.sin(f / 30) * 30}) rotate(${f * 0.2})`} opacity={0.9}>
          <ellipse cx={0} cy={0} rx={35} ry={22} fill="#F97316" />
          <circle cx={-25} cy={-10} r={16} fill="#F97316" />
          <polygon points="-35,-25 -25,-12 -20,-24" fill="#EA580C" />
          <polygon points="-22,-25 -15,-12 -10,-24" fill="#EA580C" />
          <path d="M 30 -5 Q 55 -25 50 10" fill="none" stroke="#F97316" strokeWidth={6} strokeLinecap="round" />
        </g>
      )}
      <GravityHeader num={1} title="The Weightless Morning" subtitle="Milk drops float like liquid pearls" f={f} />
      <GravityMeter gValue="0.00 m/s²" status="ANOMALY: OBJECTS LEVITATING" alert={true} />
    </g>
  );
};

// ========================================================
// CHAPTER 2: PLAYGROUND OF GODS (Zero-G Flight, 49.7s = 1490 frames)
// ========================================================
export const Chapter2: React.FC<{ f: number }> = ({ f }) => {
  const pipSkyY = 580 - Math.min(300, f * 0.25);
  const moFlipRot = f * 3.5;
  return (
    <g transform={camT(kf(f, [[0, 960], [1500, 1020]]), 540, kf(f, [[0, 1.1], [1500, 1.25]]))}>
      <Rooftop t={f} sunX={960} sunY={480} cityLit={1.2} />
      {/* Street & Rooftops below */}
      <rect x={0} y={780} width={1920} height={300} fill="#1E293B" />
      {/* Mo doing backflips in sky */}
      <g transform={`translate(1320 420) rotate(${moFlipRot})`}>
        <Hero look={MO} pose={{ ...basePose, scale: 0.9, yaw: 0, look: 0, armL: { a: 80, b: 30 }, armR: { a: -80, b: -30 }, legL: { a: 45, b: 45 }, legR: { a: -45, b: 45 }, ...faceAt(f, [[0, 'happy']]) }} rimId="rimR" shadow={0} />
      </g>
      {/* Floating Basketball sailing in infinite line */}
      <g transform={`translate(${kf(f, [[0, 300], [1500, 1800]])} 340)`}>
        <circle cx={0} cy={0} r={28} fill="#EA580C" stroke="#000000" strokeWidth={4} />
        <line x1={-26} y1={0} x2={26} y2={0} stroke="#000000" strokeWidth={3} />
        <path d="M 0 -26 A 26 26 0 0 1 0 26" fill="none" stroke="#000000" strokeWidth={3} />
      </g>
      {/* Flying Pip */}
      <Hero look={PIP} pose={{ ...basePose, x: 680, y: pipSkyY, scale: 0.95, yaw: 0.6, look: 0.8, armL: { a: 30, b: -30 }, armR: { a: -40, b: 20 }, legL: { a: 20, b: 10 }, legR: { a: -10, b: 20 }, ...faceAt(f, [[0, 'cool']]) }} rimId="rimR" shadow={0} />
      <GravityHeader num={2} title="Playground of Gods" subtitle="Human flight without wings or engines" f={f} />
      <GravityMeter gValue="0.00 m/s²" status="ALTITUDE: +65 FT (ASCENDING)" />
    </g>
  );
};

// ========================================================
// CHAPTER 3: TANGENTIAL LAUNCH (Real Science 1, 56.4s = 1691 frames)
// ========================================================
export const Chapter3: React.FC<{ f: number }> = ({ f }) => {
  return (
    <g transform={`translate(960 540) scale(${kf(f, [[0, 1.0], [1700, 1.06]])}) translate(-960 -540)`}>
      <Schematic t={f} id="g_ch3" />
      <SchLabel x={960} y={120} t={f} text="NEWTON'S 1ST LAW: TANGENTIAL SURFACE VELOCITY" size={44} />
      {/* Spinning Earth */}
      <circle cx={540} cy={540} r={240} fill="#0284C7" stroke="#38BDF8" strokeWidth={8} />
      {/* Continents outline */}
      <path d="M 440 420 Q 560 380 620 450 Q 580 540 500 580 Z" fill="#15803D" opacity={0.7} />
      <path d="M 420 540 Q 480 620 560 680 Q 480 720 440 640 Z" fill="#15803D" opacity={0.7} />
      {/* Rotation Arrow */}
      <path d="M 320 540 A 220 220 0 0 1 760 540" fill="none" stroke="#FBBF24" strokeWidth={10} strokeDasharray="30 15" />
      {/* Tangent Line Launch into Space */}
      <line x1={540} y1={300} x2={1350} y2={300} stroke="#EF4444" strokeWidth={10} strokeDasharray="20 10" />
      <Arrow x0={540} y0={300} x1={1350} y1={300} t={f} dur={14} color="#EF4444" />
      {/* Velocity Readout */}
      <g transform="translate(1380 480)">
        <rect x={-180} y={-100} width={360} height={200} rx={14} fill="#0F172A" stroke="#EF4444" strokeWidth={5} />
        <text x={0} y={-45} fill="#94A3B8" fontSize={22} fontFamily="sans-serif" textAnchor="middle">
          EQUATORIAL SPEED
        </text>
        <text x={0} y={15} fill="#FBBF24" fontSize={48} fontFamily="monospace" fontWeight="bold" textAnchor="middle">
          1,037 MPH
        </text>
        <text x={0} y={55} fill="#EF4444" fontSize={26} fontFamily="monospace" textAnchor="middle">
          (1,670 KM/H)
        </text>
      </g>
      <GravityHeader num={3} title="The Tangential Launch" subtitle="Earth curves away; you travel in a straight line" f={f} />
      <GravityMeter gValue="0.00 m/s²" status="SURFACE DRIFT: +15 FT/SEC" alert={true} />
    </g>
  );
};

// ========================================================
// CHAPTER 4: ATMOSPHERIC BLOWOUT (Decompression, 52.9s = 1588 frames)
// ========================================================
export const Chapter4: React.FC<{ f: number }> = ({ f }) => {
  return (
    <g transform={camT(960, 540, kf(f, [[0, 1.1], [1600, 1.2]]))}>
      <rect x={0} y={0} width={1920} height={1080} fill="#020617" />
      {/* Expanding air particle field into void */}
      <g stroke="#38BDF8" strokeWidth={2} opacity={0.6}>
        {[180, 420, 680, 940, 1200, 1460, 1720].map((x) =>
          [140, 320, 500, 680, 860].map((y) => (
            <circle key={`${x}-${y}`} cx={x} cy={y - ((f * 2) % 180)} r={10} fill="#BAE6FD" opacity={0.6} />
          ))
        )}
      </g>
      {/* 3-Mile High Airborne Tsunami Wall */}
      <g transform="translate(1350 560)">
        <path d="M -200 400 Q 0 100 250 250 Q 150 400 400 500 Z" fill="#0284C7" opacity={0.8} filter="drop-shadow(0 0 25px #0284C7)" />
        <text x={50} y={200} fill="#BAE6FD" fontSize={32} fontWeight="bold" fontFamily="sans-serif">
          AIRBORNE TSUNAMI
        </text>
      </g>
      {/* Pip floating, clutching throat in decompression shock */}
      <Hero look={PIP} pose={{ ...basePose, x: 620, y: 520, scale: 1.05, yaw: 0.5, look: 0.8, armL: { a: 70, b: 30 }, armR: { a: 75, b: 30 }, ...faceAt(f, [[0, 'shock']]) }} rimId="rimR" shadow={0} />
      <GravityHeader num={4} title="The Atmospheric Blowout" subtitle="5 quadrillion tons of air escaping into space" f={f} />
      <GravityMeter gValue="0.00 m/s²" status="PRESSURE: 101 kPa -> 0 kPa" alert={true} />
    </g>
  );
};

// ========================================================
// CHAPTER 5: THE 60TH SECOND: THE FALL (Freefall, 48.2s = 1446 frames)
// ========================================================
export const Chapter5: React.FC<{ f: number }> = ({ f }) => {
  const shakeX = f > 600 ? (Math.random() - 0.5) * 16 : 0;
  const shakeY = f > 600 ? (Math.random() - 0.5) * 16 : 0;
  const countdownSec = Math.max(0, 60 - Math.floor(f / 25));
  return (
    <g transform={`translate(${shakeX} ${shakeY})`}>
      <rect x={0} y={0} width={1920} height={1080} fill="#090D16" />
      {/* Speed lines for terminal velocity freefall */}
      {f > 600 && (
        <g stroke="#F8FAFC" strokeWidth={3} opacity={0.65}>
          {[200, 450, 700, 950, 1200, 1450, 1700].map((x, i) => (
            <line key={i} x1={x} y1={0} x2={x} y2={1080} strokeDasharray="120 80" strokeDashoffset={-f * 30} />
          ))}
        </g>
      )}
      {/* Giant Countdown / Freefall HUD */}
      <g transform="translate(960 260)">
        <rect x={-260} y={-70} width={520} height={140} rx={18} fill="#0F172A" stroke="#EF4444" strokeWidth={6} />
        <text x={0} y={-10} fill="#94A3B8" fontSize={26} fontFamily="sans-serif" textAnchor="middle">
          {f < 600 ? 'ZERO-G DURATION' : 'GRAVITY RESTORED!'}
        </text>
        <text x={0} y={48} fill={f < 600 ? GOLD : '#EF4444'} fontSize={60} fontFamily="monospace" fontWeight="bold" textAnchor="middle">
          {f < 600 ? `SECOND: ${60 - countdownSec} / 60` : 'FREEFALL: 120 MPH'}
        </text>
      </g>
      {/* Pip falling upside down / flailing */}
      <g transform={`translate(960 ${f < 600 ? 560 : 660}) ${f > 600 ? 'rotate(170)' : ''}`}>
        <Hero look={PIP} pose={{ ...basePose, scale: 1.1, yaw: 0, look: 0, armL: { a: 90, b: 40 }, armR: { a: -90, b: -40 }, legL: { a: 30, b: 30 }, legR: { a: -30, b: 30 }, ...faceAt(f, [[0, 'shock']]) }} rimId="rimR" shadow={0} />
      </g>
      <GravityHeader num={5} title="The 60th Second: The Fall" subtitle="Gravity snaps back on at 9.8 m/s²" f={f} />
      <GravityMeter gValue={f < 600 ? '0.00 m/s²' : '9.80 m/s²'} status={f < 600 ? 'TIME REMAINING: 3s' : 'TERMINAL VELOCITY IMPACT'} alert={true} />
    </g>
  );
};

// ========================================================
// CHAPTER 6: AFTERMATH & SUBSCRIBE OUTRO (57.1s = 1714 frames)
// ========================================================
export const Chapter6: React.FC<{ f: number }> = ({ f }) => {
  return (
    <g transform={camT(960, 540, kf(f, [[0, 1.1], [1700, 1.05]]))}>
      <rect x={0} y={0} width={1920} height={1080} fill="#0F172A" />
      <rect x={0} y={720} width={1920} height={360} fill="#14532D" />
      {/* Smashed pool water splash */}
      <ellipse cx={960} cy={760} rx={320} ry={70} fill="#0284C7" opacity={0.6} />
      {/* Pip safe on grass, smiling */}
      <Hero look={PIP} pose={{ ...basePose, x: 620, y: 740, scale: 1.05, yaw: 0.6, look: 0.8, armL: { a: 20, b: -10 }, armR: { a: 60, b: -20 }, ...faceAt(f, [[0, 'tired'], [400, 'happy']]) }} rimId="rimR" shadow={0} />
      {/* DEDICATED ANIMATED SUBSCRIBE OUTRO (at f > 600) */}
      {f > 500 && (
        <g transform="translate(1320 540)" opacity={clamp((f - 500) / 40)}>
          {/* Card Container */}
          <rect x={-260} y={-180} width={520} height={360} rx={22} fill="#020617" stroke={CYAN} strokeWidth={4} filter="drop-shadow(0 0 25px rgba(56,189,248,0.4))" />
          {/* YouTube Channel Avatar */}
          <circle cx={0} cy={-100} r={42} fill="#EF4444" />
          <polygon points="-12,-114 16,-100 -12,-86" fill="#FFFFFF" />
          {/* Channel Name */}
          <text x={0} y={-35} fill="#F8FAFC" fontSize={30} fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">
            WHAT IF THEORY
          </text>
          {/* Animated Subscribe Button */}
          <g transform={`scale(${f % 30 < 15 ? 1.04 : 1.0})`}>
            <rect x={-160} y={0} width={320} height={65} rx={32} fill="#DC2626" filter="drop-shadow(0 0 14px #EF4444)" />
            <text x={-20} y={42} fill="#FFFFFF" fontSize={26} fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">
              SUBSCRIBE
            </text>
            {/* Golden Bell Icon */}
            <g transform="translate(100 32)">
              <circle cx={0} cy={0} r={18} fill={GOLD} />
              <path d="M -6 4 Q 0 -10 6 4 Z" fill="#000000" />
            </g>
          </g>
          <text x={0} y={115} fill="#94A3B8" fontSize={18} fontFamily="sans-serif" textAnchor="middle">
            Turn on notifications for weekly videos!
          </text>
        </g>
      )}
      <GravityHeader num={6} title="The Aftermath" subtitle="Gravity is the only thing keeping us alive" f={f} />
      <GravityMeter gValue="9.80 m/s²" status="NORMAL: GROUND FIRM" />
    </g>
  );
};

