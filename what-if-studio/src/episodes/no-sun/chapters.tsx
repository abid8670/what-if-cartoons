import React from 'react';
import {
  LightVeil,
  Hero, Pose, basePose, poseAt, faceAt, kf, clamp, easeOut, easeIn, camT, LOOKS,
  Rooftop, Kitchen, Schematic, Arrow, SchLabel, CountUp, TitleCard, Glow,
} from '../../engine';

const PIP = LOOKS.pipHood;
const MO = LOOKS.mo;
const GOLD = '#FBBF24';
const CYAN = '#38BDF8';
const ICE_BLUE = '#A5F3FC';

// Top HUD Telemetry
export const SunHeader: React.FC<{ num: number; title: string; subtitle?: string; f: number }> = ({ num, title, subtitle, f }) => (
  <g transform="translate(60 50)" opacity={clamp(f / 20)}>
    <rect x={0} y={0} width={640} height={70} rx={10} fill="#0F172A" opacity={0.9} stroke={GOLD} strokeWidth={2} />
    <circle cx={35} cy={35} r={18} fill="#EA580C" />
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

export const SunMeter: React.FC<{ temp: string; status: string; alert?: boolean }> = ({ temp, status, alert = false }) => (
  <g transform="translate(1380 50)">
    <rect x={0} y={0} width={480} height={70} rx={10} fill="#0F172A" opacity={0.92} stroke={alert ? '#EF4444' : GOLD} strokeWidth={2} />
    <circle cx={30} cy={35} r={10} fill={alert ? '#EF4444' : '#FBBF24'} />
    <text x={55} y={32} fill="#F8FAFC" fontSize={20} fontWeight="bold" fontFamily="monospace">
      {`TEMP: ${temp}`}
    </text>
    <text x={55} y={54} fill={alert ? '#F87171' : '#FBBF24'} fontSize={15} fontFamily="sans-serif">
      {status}
    </text>
  </g>
);

// ========================================================
// CHAPTER 1: THE 8-MINUTE ILLUSION (Park / Rooftop, 52.4s = 1572 frames)
// ========================================================
export const Chapter1: React.FC<{ f: number }> = ({ f }) => {
  return (
    <g transform={camT(kf(f, [[0, 960], [1500, 1000]]), 540, kf(f, [[0, 1.15], [1500, 1.25]]))}>
      {/* Bright sunny park & rooftop */}
      <Rooftop t={f} sunX={960} sunY={220} cityLit={1.3} />
      {/* Radiant Sun in sky (active) */}
      <circle cx={960} cy={220} r={75} fill="#FBBF24" opacity={0.95} />
      <circle cx={960} cy={220} r={110} fill="#FDE047" opacity={0.25} />
      
      {/* Pip and Mo enjoying lunch on bench */}
      <g transform="translate(680 750)">
        <rect x={-80} y={0} width={420} height={30} rx={6} fill="#78350F" />
        <rect x={-60} y={30} width={20} height={90} fill="#451A03" />
        <rect x={300} y={30} width={20} height={90} fill="#451A03" />
      </g>
      {/* Pip eating sandwich */}
      <Hero look={PIP} pose={{ ...basePose, x: 740, y: 730, scale: 0.95, yaw: 0.2, look: 0, armL: { a: 40, b: 30 }, armR: { a: -30, b: 40 }, ...faceAt(f, [[0, 'happy']]) }} rimId="rimR" shadow={0} />
      {/* Mo enjoying the sun */}
      <Hero look={MO} pose={{ ...basePose, x: 920, y: 730, scale: 0.95, yaw: -0.2, look: 0, armL: { a: -20, b: 10 }, armR: { a: 30, b: 20 }, ...faceAt(f, [[0, 'happy']]) }} rimId="rimL" shadow={0} />

      {/* Floating 8:20 Countdown Graphic */}
      <g transform="translate(960 440)">
        <rect x={-200} y={-45} width={400} height={90} rx={14} fill="#0F172A" opacity={0.92} stroke={GOLD} strokeWidth={3} />
        <text x={0} y={-8} fill="#94A3B8" fontSize={18} fontFamily="sans-serif" textAnchor="middle">
          LIGHT IN TRANSIT (93M MILES)
        </text>
        <text x={0} y={30} fill="#FDE047" fontSize={34} fontWeight="bold" fontFamily="monospace" textAnchor="middle">
          08:20.00
        </text>
      </g>

      <SunHeader num={1} title="The 8-Minute Illusion" subtitle="Light travels at 186,000 miles/second" f={f} />
      <SunMeter temp="+24°C" status="SUN: ACTIVE (GHOST LIGHT)" alert={false} />
    </g>
  );
};

// ========================================================
// CHAPTER 2: THE COSMIC SLINGSHOT (Sky turns black & slingshot, 47.9s = 1437 frames)
// ========================================================
export const Chapter2: React.FC<{ f: number }> = ({ f }) => {
  return (
    <g transform={`translate(960 540) scale(${kf(f, [[0, 1.0], [1400, 1.08]])}) translate(-960 -540)`}>
      <Schematic t={f} id="sun_ch2" />
      <SchLabel x={960} y={110} t={f} text="GRAVITY SNAPS: NEWTON'S 1ST LAW TAKES OVER" size={42} />

      {/* Vanished Sun (Ghost dashed circle) */}
      <g transform="translate(420 540)">
        <circle cx={0} cy={0} r={120} fill="#0F172A" stroke="#EF4444" strokeWidth={5} strokeDasharray="15 10" />
        <text x={0} y={8} fill="#EF4444" fontSize={26} fontWeight="bold" fontFamily="monospace" textAnchor="middle">
          VANISHED!
        </text>
        <text x={0} y={36} fill="#94A3B8" fontSize={16} fontFamily="sans-serif" textAnchor="middle">
          0.00 GRAVITY
        </text>
      </g>

      {/* Earth Orbit Broken Arrow */}
      <path d="M 420 300 A 240 240 0 0 1 850 540" fill="none" stroke="#FBBF24" strokeWidth={6} strokeDasharray="20 15" opacity={0.5} />
      
      {/* Tangent Slingshot Line into Deep Space */}
      <line x1={850} y1={540} x2={1650} y2={540} stroke="#38BDF8" strokeWidth={10} strokeDasharray="30 15" />
      <Arrow x0={850} y0={540} x1={1650} y1={540} t={f} dur={12} color="#38BDF8" />

      {/* Earth flying into space */}
      <g transform={`translate(${kf(f, [[0, 850], [1400, 1350]])} 540)`}>
        <circle cx={0} cy={0} r={65} fill="#0284C7" stroke="#38BDF8" strokeWidth={4} />
        {/* Continents */}
        <path d="M -30 -30 Q 10 -40 30 -10 Q 10 30 -20 20 Z" fill="#15803D" opacity={0.8} />
      </g>

      {/* Velocity Readout */}
      <g transform="translate(1420 740)">
        <rect x={-190} y={-60} width={380} height={130} rx={14} fill="#0F172A" stroke="#38BDF8" strokeWidth={4} />
        <text x={0} y={-18} fill="#94A3B8" fontSize={20} fontFamily="sans-serif" textAnchor="middle">
          INTERSTELLAR SPEED
        </text>
        <text x={0} y={32} fill="#FBBF24" fontSize={42} fontFamily="monospace" fontWeight="bold" textAnchor="middle">
          67,000 MPH
        </text>
      </g>

      <SunHeader num={2} title="The Cosmic Slingshot" subtitle="Earth hurled into interstellar void" f={f} />
      <SunMeter temp="+12°C (FALLING)" status="ALERT: ORBIT DETACHED" alert={true} />
    </g>
  );
};

// ========================================================
// CHAPTER 3: THE BIG FREEZE (Frozen City & Ice Blanket, 51.6s = 1548 frames)
// ========================================================
export const Chapter3: React.FC<{ f: number }> = ({ f }) => {
  return (
    <g transform={camT(kf(f, [[0, 960], [1500, 980]]), 540, kf(f, [[0, 1.1], [1500, 1.25]]))}>
      {/* Dark frozen sky with stars */}
      <rect x={0} y={0} width={1920} height={1080} fill="#030712" />
      {[120, 320, 560, 780, 1100, 1350, 1600, 1800].map((x, i) => (
        <circle key={i} cx={x} cy={80 + (i * 37) % 250} r={2.5} fill="#FFFFFF" opacity={0.8} />
      ))}

      {/* Frozen city skyline */}
      <rect x={200} y={480} width={180} height={400} fill="#1E293B" stroke={ICE_BLUE} strokeWidth={2} />
      <rect x={420} y={380} width={220} height={500} fill="#0F172A" stroke={ICE_BLUE} strokeWidth={2} />
      <rect x={1200} y={420} width={260} height={460} fill="#1E293B" stroke={ICE_BLUE} strokeWidth={2} />

      {/* Frozen Ocean Cross-Section */}
      <g transform="translate(0 750)">
        {/* Top Ice Crust */}
        <rect x={0} y={0} width={1920} height={70} fill="#E0F2FE" opacity={0.9} stroke="#BAE6FD" strokeWidth={3} />
        <text x={960} y={45} fill="#0369A1" fontSize={26} fontWeight="bold" fontFamily="monospace" textAnchor="middle">
          SURFACE ICE CRUST: 10 FT BLANKET
        </text>
        {/* Liquid Water Below */}
        <rect x={0} y={70} width={1920} height={260} fill="#0369A1" opacity={0.8} />
        <text x={960} y={170} fill="#BAE6FD" fontSize={28} fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">
          LIQUID OCEAN WATER (WARMED BY GEOTHERMAL VENTS)
        </text>
      </g>

      {/* Pip Shivering in Winter Coat */}
      <Hero look={PIP} pose={{ ...basePose, x: 740, y: 680, scale: 0.95, yaw: 0.3, look: 0, armL: { a: 50, b: 60 }, armR: { a: -50, b: -60 }, ...faceAt(f, [[0, 'shock']]) }} rimId="rimR" shadow={0} />

      <SunHeader num={3} title="The Big Freeze" subtitle="Surface ice traps life-saving ocean heat" f={f} />
      <SunMeter temp="-20°C" status="DAY 3: PHOTOSYNTHESIS HALTED" alert={true} />
    </g>
  );
};

// ========================================================
// CHAPTER 4: THE UNDERGROUND SANCTUARY (Geothermal City, 51.9s = 1557 frames)
// ========================================================
export const Chapter4: React.FC<{ f: number }> = ({ f }) => {
  return (
    <g transform={`translate(960 540) scale(${kf(f, [[0, 1.0], [1500, 1.06]])}) translate(-960 -540)`}>
      {/* Underground Cave & Bunker Walls */}
      <rect x={0} y={0} width={1920} height={1080} fill="#111827" />
      
      {/* Glowing Geothermal Core at Bottom */}
      <rect x={0} y={850} width={1920} height={230} fill="#EA580C" opacity={0.9} />
      <path d="M 0 850 Q 480 820 960 850 Q 1440 880 1920 850 L 1920 1080 L 0 1080 Z" fill="#DC2626" />
      <text x={960} y={970} fill="#FEF08A" fontSize={36} fontWeight="bold" fontFamily="monospace" textAnchor="middle">
        EARTH'S CORE: 6,000°C (HOTTER THAN SUN'S SURFACE)
      </text>

      {/* Subterranean Bunker City */}
      <rect x={260} y={320} width={1400} height={480} rx={24} fill="#0F172A" stroke={CYAN} strokeWidth={4} />
      
      {/* Hydroponic Garden Section (Purple UV lights) */}
      <g transform="translate(320 400)">
        <rect x={0} y={0} width={420} height={340} rx={14} fill="#2E1065" stroke="#C084FC" strokeWidth={3} />
        <text x={210} y={45} fill="#E9D5FF" fontSize={22} fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">
          HYDROPO-LED FARM
        </text>
        {/* Glowing crops */}
        {[80, 150, 220, 290].map((y, i) => (
          <line key={i} x1={40} y1={y} x2={380} y2={y} stroke="#22C55E" strokeWidth={8} strokeLinecap="round" />
        ))}
      </g>

      {/* Pip & Mo Working at Geothermal Controls */}
      <Hero look={PIP} pose={{ ...basePose, x: 1050, y: 640, scale: 0.95, yaw: -0.4, look: -0.5, armL: { a: -20, b: 30 }, armR: { a: 40, b: 20 }, ...faceAt(f, [[0, 'happy']]) }} rimId="rimR" shadow={0} />
      <Hero look={MO} pose={{ ...basePose, x: 1280, y: 640, scale: 0.95, yaw: -0.2, look: 0, armL: { a: 10, b: 20 }, armR: { a: -20, b: 30 }, ...faceAt(f, [[0, 'cool']]) }} rimId="rimL" shadow={0} />

      <SunHeader num={4} title="The Underground Sanctuary" subtitle="Geothermal energy powers human survival" f={f} />
      <SunMeter temp="+22°C (BUNKER)" status="GEOTHERMAL REACTOR: 100%" alert={false} />
    </g>
  );
};

// ========================================================
// CHAPTER 5: DAY SEVEN: THE GOLDEN RETURN (Day 7 Sunrise, 43.5s = 1305 frames)
// ========================================================
export const Chapter5: React.FC<{ f: number }> = ({ f }) => {
  const sunY = kf(f, [[0, 680], [1300, 320]]);
  const skyGold = kf(f, [[0, 0.2], [1300, 0.95]]);
  return (
    <g transform={camT(kf(f, [[0, 960], [1300, 1000]]), 540, kf(f, [[0, 1.1], [1300, 1.25]]))}>
      {/* Sky transitioning to brilliant sunrise */}
      <rect x={0} y={0} width={1920} height={1080} fill="#0F172A" />
      <rect x={0} y={200} width={1920} height={880} fill="#EA580C" opacity={skyGold * 0.6} />
      <rect x={0} y={400} width={1920} height={680} fill="#FBBF24" opacity={skyGold * 0.7} />

      {/* Rising Golden Sun */}
      <circle cx={960} cy={sunY} r={110} fill="#FDE047" />
      <circle cx={960} cy={sunY} r={180} fill="#F59E0B" opacity={0.35} />

      {/* Ice Cracking Roar Graphic */}
      <path d="M 400 820 L 750 780 L 1100 840 L 1550 790" fill="none" stroke="#FFFFFF" strokeWidth={6} strokeDasharray="25 15" />

      {/* Pip Celebrating on Rooftop */}
      <g transform="translate(960 760)">
        <Hero look={PIP} pose={{ ...basePose, scale: 1.05, yaw: 0, look: 0, armL: { a: 80, b: 20 }, armR: { a: -80, b: -20 }, ...faceAt(f, [[0, 'happy']]) }} rimId="rimR" shadow={0} />
      </g>

      <SunHeader num={5} title="Day Seven: The Golden Return" subtitle="The first sunrise in 168 hours" f={f} />
      <SunMeter temp="+5°C (WARMING)" status="SOLAR RECONNECTION SUCCESS!" alert={false} />
    </g>
  );
};

// ========================================================
// CHAPTER 6: THE MIRACLE ENGINE & OUTRO (Subscribe & Bell, 38.9s = 1167 frames)
// ========================================================
export const Chapter6: React.FC<{ f: number }> = ({ f }) => {
  const isSubscribed = f > 280;
  return (
    <g transform={`translate(960 540) scale(${kf(f, [[0, 1.0], [1100, 1.05]])}) translate(-960 -540)`}>
      <rect x={0} y={0} width={1920} height={1080} fill="#090D16" />

      {/* Golden Glowing Sun & Earth side-by-side */}
      <circle cx={540} cy={380} r={120} fill="#FBBF24" opacity={0.9} />
      <circle cx={1380} cy={380} r={80} fill="#0284C7" stroke="#38BDF8" strokeWidth={4} />

      <text x={960} y={150} fill="#F8FAFC" fontSize={44} fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">
        THE SUN: ENGINE OF ALL LIFE ON EARTH
      </text>

      {/* Animated Subscribe Call-to-Action Card */}
      <g transform="translate(960 680)">
        <rect x={-420} y={-90} width={840} height={180} rx={22} fill="#0F172A" stroke={isSubscribed ? '#22C55E' : '#EF4444'} strokeWidth={4} />
        
        {/* Subscribe Pill Button */}
        <g transform="translate(-140 0)">
          <rect x={-180} y={-45} width={360} height={90} rx={18} fill={isSubscribed ? '#15803D' : '#DC2626'} />
          <text x={0} y={14} fill="#FFFFFF" fontSize={32} fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">
            {isSubscribed ? 'SUBSCRIBED ✅' : 'SUBSCRIBE'}
          </text>
        </g>

        {/* Bell Icon */}
        <g transform={`translate(260 0) scale(${1 + Math.sin(f / 8) * 0.12})`}>
          <circle cx={0} cy={0} r={44} fill="#FBBF24" />
          <text x={0} y={15} fill="#000000" fontSize={36} textAnchor="middle">
            🔔
          </text>
        </g>
      </g>

      {/* Characters Waving */}
      <Hero look={PIP} pose={{ ...basePose, x: 280, y: 820, scale: 0.95, yaw: 0.3, look: 0.5, armL: { a: 70, b: 30 }, armR: { a: -20, b: 20 }, ...faceAt(f, [[0, 'happy']]) }} rimId="rimR" shadow={0} />
      <Hero look={MO} pose={{ ...basePose, x: 1640, y: 820, scale: 0.95, yaw: -0.3, look: -0.5, armL: { a: -20, b: 20 }, armR: { a: 70, b: 30 }, ...faceAt(f, [[0, 'happy']]) }} rimId="rimL" shadow={0} />

      <SunHeader num={6} title="The Final Verdict" subtitle="Subscribe & Ring the Bell for weekly cartoons" f={f} />
      <SunMeter temp="+18°C" status="THANK YOU FOR WATCHING!" alert={false} />
    </g>
  );
};

