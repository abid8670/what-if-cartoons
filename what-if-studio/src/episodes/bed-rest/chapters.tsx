import React from 'react';
import {
  Hero, basePose, faceAt, kf, clamp, camT, LOOKS,
  Schematic, Arrow, SchLabel,
} from '../../engine';

const PIP = LOOKS.pipHood;
const MO = LOOKS.mo;
const GOLD = '#FBBF24';
const CYAN = '#38BDF8';
const CRIMSON = '#EF4444';

// Top Bed-Rest HUD
export const BedHeader: React.FC<{ day: string; title: string; subtitle: string; f: number }> = ({ day, title, subtitle, f }) => (
  <g transform="translate(60 45)" opacity={clamp(f / 15)}>
    <rect x={0} y={0} width={680} height={75} rx={12} fill="#0F172A" opacity={0.92} stroke={GOLD} strokeWidth={2.5} />
    <circle cx={40} cy={37} r={22} fill="#EA580C" />
    <text x={40} y={45} fill="#FFFFFF" fontSize={18} fontWeight="bold" fontFamily="monospace" textAnchor="middle">
      {day}
    </text>
    <text x={80} y={35} fill="#F8FAFC" fontSize={22} fontWeight="bold" fontFamily="sans-serif">
      {title.toUpperCase()}
    </text>
    <text x={80} y={58} fill="#94A3B8" fontSize={15} fontFamily="sans-serif">
      {subtitle}
    </text>
  </g>
);

export const BodyMeter: React.FC<{ muscle: string; bone: string; heart: string; alert?: boolean }> = ({ muscle, bone, heart, alert = false }) => (
  <g transform="translate(1360 45)">
    <rect x={0} y={0} width={500} height={75} rx={12} fill="#0F172A" opacity={0.92} stroke={alert ? CRIMSON : CYAN} strokeWidth={2.5} />
    <circle cx={30} cy={37} r={10} fill={alert ? CRIMSON : '#22C55E'} />
    <text x={55} y={33} fill="#F8FAFC" fontSize={18} fontWeight="bold" fontFamily="monospace">
      {`MUSCLE: ${muscle}  |  BONE: ${bone}`}
    </text>
    <text x={55} y={57} fill={alert ? '#F87171' : CYAN} fontSize={15} fontFamily="sans-serif">
      {`HEART SIZE: ${heart}`}
    </text>
  </g>
);

// Hospital Bed Base graphic
const BedGraphics: React.FC<{ tilt?: number; sheetsColor?: string }> = ({ tilt = 0, sheetsColor = '#38BDF8' }) => (
  <g transform={`rotate(${tilt} 960 720)`}>
    {/* Metal Frame */}
    <rect x={560} y={720} width={800} height={30} rx={6} fill="#64748B" />
    <rect x={580} y={750} width={20} height={130} fill="#475569" />
    <rect x={1320} y={750} width={20} height={130} fill="#475569" />
    {/* Mattress */}
    <rect x={570} y={670} width={780} height={50} rx={10} fill="#E2E8F0" />
    {/* Pillow */}
    <rect x={600} y={635} width={160} height={40} rx={12} fill="#FFFFFF" stroke="#CBD5E1" strokeWidth={2} />
    {/* Cozy Blanket */}
    <rect x={740} y={660} width={610} height={60} rx={14} fill={sheetsColor} opacity={0.95} />
  </g>
);

// ========================================================
// CHAPTER 1: THE DREAM JOB (0 - 46.6s = 1398 frames)
// Shots: 1A (0-240), 1B (240-510), 1C (510-780), 1D (780-1080), 1E (1080-1398)
// ========================================================
export const Chapter1: React.FC<{ f: number }> = ({ f }) => {
  // Shot 1A (0 - 8s): Pip lounging in bed with money ($19k offer)
  if (f < 240) {
    return (
      <g>
        <rect x={0} y={0} width={1920} height={1080} fill="#0F172A" />
        <BedGraphics />
        {/* Pip in bed smiling */}
        <Hero look={PIP} pose={{ ...basePose, x: 740, y: 640, scale: 0.95, yaw: 0.4, look: 0, armL: { a: 20, b: 30 }, armR: { a: -30, b: 20 }, ...faceAt(f, [[0, 'happy']]) }} rimId="rimR" shadow={0} />
        {/* Floating Money Badges */}
        {[0, 1, 2, 3, 4].map((i) => (
          <g key={i} transform={`translate(${600 + i * 180} ${280 + Math.sin(f / 15 + i) * 30})`}>
            <rect x={-50} y={-25} width={100} height={50} rx={8} fill="#15803D" stroke="#86EFAC" strokeWidth={3} />
            <text x={0} y={8} fill="#FFFFFF" fontSize={22} fontWeight="bold" fontFamily="monospace" textAnchor="middle">$19,000</text>
          </g>
        ))}
        <BedHeader day="DAY 1" title="The Dream Job" subtitle="Paid $19,000 just to stay in bed" f={f} />
        <BodyMeter muscle="100%" bone="100%" heart="100% (NORMAL)" />
      </g>
    );
  }

  // Shot 1B (8 - 17s = 240 - 510): NASA Contract signing
  if (f < 510) {
    const sf = f - 240;
    return (
      <g>
        <rect x={0} y={0} width={1920} height={1080} fill="#1E293B" />
        {/* NASA Official Seal */}
        <circle cx={960} cy={340} r={110} fill="#0284C7" stroke="#38BDF8" strokeWidth={6} />
        <text x={960} y={355} fill="#FFFFFF" fontSize={38} fontWeight="bold" fontFamily="monospace" textAnchor="middle">NASA STUDY</text>
        {/* Contract Sheet */}
        <rect x={760} y={500} width={400} height={320} rx={10} fill="#FFFFFF" stroke="#94A3B8" strokeWidth={3} />
        <text x={960} y={550} fill="#0F172A" fontSize={24} fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">OFFICIAL BED REST STUDY</text>
        <line x1={800} y1={600} x2={1120} y2={600} stroke="#CBD5E1" strokeWidth={4} />
        <line x1={800} y1={640} x2={1120} y2={640} stroke="#CBD5E1" strokeWidth={4} />
        <text x={800} y={720} fill="#15803D" fontSize={28} fontWeight="bold" fontFamily="cursive">Signed: Pip ✍️</text>
        {/* Pip smiling thumbs up */}
        <Hero look={PIP} pose={{ ...basePose, x: 540, y: 700, scale: 1.0, yaw: 0.5, look: 0.8, armL: { a: -20, b: 20 }, armR: { a: 80, b: 30 }, ...faceAt(sf, [[0, 'cool']]) }} rimId="rimR" shadow={0} />
        <BedHeader day="DAY 1" title="NASA Contract Signed" subtitle="Testing human body in zero-G simulation" f={sf} />
        <BodyMeter muscle="100%" bone="100%" heart="100%" />
      </g>
    );
  }

  // Shot 1C (17 - 26s = 510 - 780): Paradise Pizza & Movies
  if (f < 780) {
    const sf = f - 510;
    return (
      <g>
        <rect x={0} y={0} width={1920} height={1080} fill="#090D16" />
        <BedGraphics sheetsColor="#EA580C" />
        <Hero look={PIP} pose={{ ...basePose, x: 740, y: 640, scale: 0.95, yaw: 0.3, look: 0, armL: { a: 40, b: 40 }, armR: { a: -40, b: 40 }, ...faceAt(sf, [[0, 'happy']]) }} rimId="rimR" shadow={0} />
        {/* Pizza Slice */}
        <polygon points="850,620 910,580 910,660" fill="#FBBF24" stroke="#D97706" strokeWidth={3} />
        <circle cx={885} cy={615} r={6} fill="#DC2626" />
        {/* Ceiling Projector Screen */}
        <rect x={680} y={160} width={560} height={260} rx={14} fill="#0F172A" stroke="#38BDF8" strokeWidth={4} />
        <text x={960} y={300} fill="#38BDF8" fontSize={32} fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">MOVIE MARATHON 🎬</text>
        <BedHeader day="DAY 1 - 2" title="The Paradise Phase" subtitle="Endless gaming, movies, and hot pizza" f={sf} />
        <BodyMeter muscle="99%" bone="100%" heart="99%" />
      </g>
    );
  }

  // Shot 1D (26 - 36s = 780 - 1080): The -6 Degree Tilt Rule
  if (f < 1080) {
    const sf = f - 780;
    return (
      <g>
        <rect x={0} y={0} width={1920} height={1080} fill="#1E1B4B" />
        {/* Tilted Bed */}
        <BedGraphics tilt={-6} sheetsColor="#6366F1" />
        <Hero look={PIP} pose={{ ...basePose, x: 740, y: 620, scale: 0.95, yaw: 0.2, look: 0, armL: { a: 10, b: 20 }, armR: { a: -10, b: 20 }, ...faceAt(sf, [[0, 'shock']]) }} rimId="rimR" shadow={0} />
        {/* Angle Indicator */}
        <g transform="translate(1380 480)">
          <rect x={-160} y={-50} width={320} height={100} rx={12} fill="#0F172A" stroke="#EF4444" strokeWidth={3} />
          <text x={0} y={-8} fill="#94A3B8" fontSize={18} fontFamily="sans-serif" textAnchor="middle">NASA STRICT RULE</text>
          <text x={0} y={32} fill="#EF4444" fontSize={36} fontWeight="bold" fontFamily="monospace" textAnchor="middle">-6° HEAD DOWN</text>
        </g>
        <BedHeader day="DAY 2" title="The -6 Degree Tilt" subtitle="Simulates space fluid shift towards brain" f={sf} />
        <BodyMeter muscle="98%" bone="99%" heart="98%" alert={true} />
      </g>
    );
  }

  // Shot 1E (36 - 46.6s = 1080 - 1398): Biology Strikes Back Warning
  const sf = f - 1080;
  return (
    <g>
      <rect x={0} y={0} width={1920} height={1080} fill="#450A0A" />
      <g transform="translate(960 480)">
        <circle cx={0} cy={0} r={180} fill="#7F1D1D" stroke="#EF4444" strokeWidth={6} />
        <text x={0} y={20} fill="#FEF08A" fontSize={80} textAnchor="middle">⚠️</text>
        <text x={0} y={90} fill="#FFFFFF" fontSize={32} fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">BIOLOGY STRIKES BACK</text>
      </g>
      <BedHeader day="DAY 2" title="Countdown to Decay" subtitle="Your body begins eating itself" f={sf} />
      <BodyMeter muscle="97%" bone="98%" heart="96%" alert={true} />
    </g>
  );
};

// ========================================================
// CHAPTER 2: THE SILENT MELT (Day 3 - 7, 42.0s = 1258 frames)
// Shots: 2A (0-270), 2B (270-570), 2C (570-870), 2D (870-1258)
// ========================================================
export const Chapter2: React.FC<{ f: number }> = ({ f }) => {
  // Shot 2A (0 - 9s): Muscle Atrophy
  if (f < 270) {
    return (
      <g>
        <rect x={0} y={0} width={1920} height={1080} fill="#0F172A" />
        <Schematic t={f} id="ch2_muscle" />
        <SchLabel x={960} y={120} t={f} text="MUSCLE ATROPHY: -1% MASS LOST PER DAY" size={42} />
        {/* Muscle Fibers Dissolving */}
        <g transform="translate(960 520)">
          <rect x={-300} y={-100} width={600} height={200} rx={20} fill="#991B1B" stroke="#EF4444" strokeWidth={4} />
          {[ -200, -100, 0, 100, 200 ].map((x, i) => (
            <line key={i} x1={x} y1={-70} x2={x} y2={70} stroke="#FCA5A5" strokeWidth={12} strokeDasharray={f > 100 ? "15 15" : "0"} />
          ))}
          <text x={0} y={150} fill="#EF4444" fontSize={30} fontWeight="bold" fontFamily="monospace" textAnchor="middle">MUSCLE FIBERS DISSOLVING</text>
        </g>
        <BedHeader day="DAY 3 - 4" title="Muscle Atrophy" subtitle="Body consumes useless muscle mass" f={f} />
        <BodyMeter muscle="93% (FALLING)" bone="97%" heart="95%" alert={true} />
      </g>
    );
  }

  // Shot 2B (9 - 19s = 270 - 570): Bone Calcium Leaching
  if (f < 570) {
    const sf = f - 270;
    return (
      <g>
        <rect x={0} y={0} width={1920} height={1080} fill="#1E293B" />
        {/* Bone Skeleton X-Ray */}
        <g transform="translate(960 480)">
          <rect x={-60} y={-180} width={120} height={360} rx={40} fill="#F8FAFC" stroke="#94A3B8" strokeWidth={5} />
          {/* Calcium sparking away */}
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <circle key={i} cx={Math.cos(i + sf / 10) * 160} cy={Math.sin(i + sf / 10) * 160} r={14} fill="#FEF08A" />
          ))}
          <text x={0} y={240} fill="#FEF08A" fontSize={32} fontWeight="bold" fontFamily="monospace" textAnchor="middle">CALCIUM LEACHING INTO BLOOD</text>
        </g>
        <BedHeader day="DAY 5" title="Skeleton Breakdown" subtitle="Zero gravity prevents bone regeneration" f={sf} />
        <BodyMeter muscle="90%" bone="92% (LEACHING)" heart="94%" alert={true} />
      </g>
    );
  }

  // Shot 2C (19 - 29s = 570 - 870): Kidney Stones Agony
  if (f < 870) {
    const sf = f - 570;
    return (
      <g>
        <rect x={0} y={0} width={1920} height={1080} fill="#312E81" />
        {/* Kidney Graphic with Sharp Crystals */}
        <g transform="translate(680 500)">
          <path d="M 0 -120 C 140 -120 140 120 0 120 C -70 60 -70 -60 0 -120 Z" fill="#991B1B" stroke="#EF4444" strokeWidth={5} />
          {/* Sharp Stone Crystals */}
          <polygon points="10,-20 30,-5 20,20 -5,10" fill="#FEF08A" stroke="#B45309" strokeWidth={3} />
          <text x={20} y={180} fill="#FEF08A" fontSize={28} fontWeight="bold" fontFamily="monospace" textAnchor="middle">RAZOR-SHARP KIDNEY STONES</text>
        </g>
        {/* Pip Groaning in Pain */}
        <Hero look={PIP} pose={{ ...basePose, x: 1240, y: 680, scale: 0.95, yaw: -0.4, look: 0, armL: { a: 70, b: 50 }, armR: { a: -60, b: -40 }, ...faceAt(sf, [[0, 'shock']]) }} rimId="rimR" shadow={0} />
        <BedHeader day="DAY 6" title="Kidney Stone Crisis" subtitle="Excess calcium turns into agonizing crystals" f={sf} />
        <BodyMeter muscle="88%" bone="89%" heart="93%" alert={true} />
      </g>
    );
  }

  // Shot 2D (29 - 42s = 870 - 1258): Bloated Puffy Face & Cardboard Food
  const sf = f - 870;
  return (
    <g>
      <rect x={0} y={0} width={1920} height={1080} fill="#18181B" />
      {/* Puffy Face Pip */}
      <g transform="translate(960 480) scale(1.3)">
        <Hero look={PIP} pose={{ ...basePose, scale: 1.1, yaw: 0, look: 0, armL: { a: 40, b: 20 }, armR: { a: -40, b: -20 }, ...faceAt(sf, [[0, 'shock']]) }} rimId="rimR" shadow={0} />
        {/* Swollen red cheeks */}
        <circle cx={-45} cy={-120} r={28} fill="#EF4444" opacity={0.6} />
        <circle cx={45} cy={-120} r={28} fill="#EF4444" opacity={0.6} />
      </g>
      <g transform="translate(960 840)">
        <rect x={-240} y={-40} width={480} height={80} rx={12} fill="#0F172A" stroke="#EF4444" strokeWidth={3} />
        <text x={0} y={10} fill="#F87171" fontSize={26} fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">TASTE BUDS LOST: PIZZA TASTES LIKE CARDBOARD</text>
      </g>
      <BedHeader day="DAY 7" title="The Pufferfish Syndrome" subtitle="Fluid pools in head, clogging nasal airways" f={sf} />
      <BodyMeter muscle="85%" bone="88%" heart="92%" alert={true} />
    </g>
  );
};

// ========================================================
// CHAPTER 3: THE BRAIN GLITCH (Day 8 - 15, 34.8s = 1042 frames)
// Shots: 3A (0-240), 3B (240-510), 3C (510-780), 3D (780-1042)
// ========================================================
export const Chapter3: React.FC<{ f: number }> = ({ f }) => {
  // Shot 3A (0 - 8s): 3:00 AM Insomnia
  if (f < 240) {
    return (
      <g>
        <rect x={0} y={0} width={1920} height={1080} fill="#020617" />
        <BedGraphics />
        <Hero look={PIP} pose={{ ...basePose, x: 740, y: 640, scale: 0.95, yaw: 0.3, look: 0, armL: { a: 10, b: 10 }, armR: { a: -10, b: 10 }, ...faceAt(f, [[0, 'shock']]) }} rimId="rimR" shadow={0} />
        {/* 3:00 AM Digital Clock */}
        <g transform="translate(1350 420)">
          <rect x={-150} y={-50} width={300} height={100} rx={14} fill="#0F172A" stroke="#EF4444" strokeWidth={4} />
          <text x={0} y={15} fill="#EF4444" fontSize={50} fontWeight="bold" fontFamily="monospace" textAnchor="middle">03:00 AM</text>
        </g>
        {/* Spinning ceiling fan */}
        <g transform={`translate(960 140) rotate(${f * 12})`}>
          <line x1={-180} y1={0} x2={180} y2={0} stroke="#64748B" strokeWidth={16} />
          <line x1={0} y1={-180} x2={0} y2={180} stroke="#64748B" strokeWidth={16} />
        </g>
        <BedHeader day="DAY 10" title="Total Insomnia" subtitle="Circadian rhythm collapses without exercise" f={f} />
        <BodyMeter muscle="82%" bone="85%" heart="90%" alert={true} />
      </g>
    );
  }

  // Shot 3B (8 - 17s = 240 - 510): The Shrinking Heart (-8%)
  if (f < 510) {
    const sf = f - 240;
    const heartScale = 1.0 - (sf / 270) * 0.25;
    return (
      <g>
        <rect x={0} y={0} width={1920} height={1080} fill="#1E1B4B" />
        <g transform={`translate(960 480) scale(${heartScale})`}>
          <path d="M 0 -80 C -120 -200 -240 0 0 200 C 240 0 120 -200 0 -80 Z" fill="#DC2626" stroke="#EF4444" strokeWidth={6} />
          <text x={0} y={20} fill="#FFFFFF" fontSize={36} fontWeight="bold" fontFamily="monospace" textAnchor="middle">-8% SHRINKAGE</text>
        </g>
        <g transform="translate(960 820)">
          <rect x={-260} y={-35} width={520} height={70} rx={12} fill="#0F172A" stroke="#38BDF8" strokeWidth={3} />
          <text x={0} y={10} fill="#38BDF8" fontSize={24} fontWeight="bold" fontFamily="monospace" textAnchor="middle">BLOOD VOLUME DROPS BY 20%</text>
        </g>
        <BedHeader day="DAY 12" title="Heart Muscle Shrinks" subtitle="Heart gets lazy without gravity resistance" f={sf} />
        <BodyMeter muscle="80%" bone="83%" heart="92% (SHRINKING)" alert={true} />
      </g>
    );
  }

  // Shot 3C (17 - 26s = 510 - 780): Digestion Freeze
  if (f < 780) {
    const sf = f - 510;
    return (
      <g>
        <rect x={0} y={0} width={1920} height={1080} fill="#1C1917" />
        {/* Stomach with gurgling bubbles */}
        <g transform="translate(960 480)">
          <path d="M -80 -120 C 140 -120 120 140 -40 120 C -160 80 -160 -40 -80 -120 Z" fill="#D97706" stroke="#FBBF24" strokeWidth={5} />
          <circle cx={-20} cy={0} r={18} fill="#22C55E" opacity={0.7} />
          <circle cx={30} cy={30} r={24} fill="#22C55E" opacity={0.7} />
          <text x={0} y={180} fill="#FBBF24" fontSize={30} fontWeight="bold" fontFamily="monospace" textAnchor="middle">DIGESTIVE SYSTEM FROZEN</text>
        </g>
        <BedHeader day="DAY 14" title="Metabolic Freeze" subtitle="Gastrointestinal motility drops to near zero" f={sf} />
        <BodyMeter muscle="77%" bone="81%" heart="91%" alert={true} />
      </g>
    );
  }

  // Shot 3D (26 - 34.8s = 780 - 1042): Trapped in 80-Year-Old Body
  const sf = f - 780;
  return (
    <g>
      <rect x={0} y={0} width={1920} height={1080} fill="#0F172A" />
      <g transform="translate(960 480)">
        <Hero look={PIP} pose={{ ...basePose, scale: 1.1, yaw: 0.2, look: 0, armL: { a: 40, b: 30 }, armR: { a: -40, b: 30 }, ...faceAt(sf, [[0, 'shock']]) }} rimId="rimR" shadow={0} />
      </g>
      <g transform="translate(960 820)">
        <rect x={-280} y={-40} width={560} height={80} rx={14} fill="#0F172A" stroke="#EF4444" strokeWidth={3} />
        <text x={0} y={12} fill="#EF4444" fontSize={26} fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">BIOLOGICAL AGE ACCELERATION: +60 YEARS</text>
      </g>
      <BedHeader day="DAY 15" title="The 80-Year-Old Body" subtitle="A 20-year-old body feels geriatric" f={sf} />
      <BodyMeter muscle="75%" bone="80%" heart="90%" alert={true} />
    </g>
  );
};

// ========================================================
// CHAPTER 4: THE PRESSURE PRISON (Day 16 - 29, 33.0s = 992 frames)
// Shots: 4A (0-240), 4B (240-510), 4C (510-750), 4D (750-992)
// ========================================================
export const Chapter4: React.FC<{ f: number }> = ({ f }) => {
  // Shot 4A (0 - 8s): Day 20 Cobwebs & Isolation
  if (f < 240) {
    return (
      <g>
        <rect x={0} y={0} width={1920} height={1080} fill="#020617" />
        <BedGraphics />
        <Hero look={PIP} pose={{ ...basePose, x: 740, y: 640, scale: 0.95, yaw: 0.2, look: 0, armL: { a: 0, b: 10 }, armR: { a: 0, b: 10 }, ...faceAt(f, [[0, 'shock']]) }} rimId="rimR" shadow={0} />
        {/* Cobwebs in top corners */}
        <path d="M 0 0 L 180 0 L 0 180 Z" fill="#94A3B8" opacity={0.3} />
        <path d="M 1920 0 L 1740 0 L 1920 180 Z" fill="#94A3B8" opacity={0.3} />
        <BedHeader day="DAY 20" title="The Pressure Prison" subtitle="Sensory isolation turns bed into a cell" f={f} />
        <BodyMeter muscle="72%" bone="78%" heart="88%" alert={true} />
      </g>
    );
  }

  // Shot 4B (8 - 17s = 240 - 510): Painful Bedsores
  if (f < 510) {
    const sf = f - 240;
    return (
      <g>
        <rect x={0} y={0} width={1920} height={1080} fill="#450A0A" />
        {/* Pressure Map Graphic */}
        <g transform="translate(960 480)">
          <ellipse cx={0} cy={0} rx={220} ry={320} fill="#1E293B" stroke="#94A3B8" strokeWidth={4} />
          {/* Red Glowing Bedsores Points */}
          <circle cx={0} cy={-160} r={35} fill="#EF4444" opacity={0.85} />
          <circle cx={0} cy={60} r={45} fill="#EF4444" opacity={0.9} />
          <circle cx={-90} cy={180} r={30} fill="#EF4444" opacity={0.8} />
          <circle cx={90} cy={180} r={30} fill="#EF4444" opacity={0.8} />
          <text x={0} y={260} fill="#FEF08A" fontSize={32} fontWeight="bold" fontFamily="monospace" textAnchor="middle">CRITICAL BEDSORE ZONES</text>
        </g>
        <BedHeader day="DAY 22" title="Severe Bedsores" subtitle="Blood flow cut off from constant weight pressure" f={sf} />
        <BodyMeter muscle="70%" bone="76%" heart="87%" alert={true} />
      </g>
    );
  }

  // Shot 4C (17 - 25s = 510 - 750): Begging Scientist Mo
  if (f < 750) {
    const sf = f - 510;
    return (
      <g>
        <rect x={0} y={0} width={1920} height={1080} fill="#0F172A" />
        <BedGraphics />
        <Hero look={PIP} pose={{ ...basePose, x: 740, y: 640, scale: 0.95, yaw: 0.5, look: 0.8, armL: { a: 70, b: 40 }, armR: { a: -30, b: 20 }, ...faceAt(sf, [[0, 'shock']]) }} rimId="rimR" shadow={0} />
        {/* Scientist Mo with clipboard */}
        <Hero look={MO} pose={{ ...basePose, x: 1380, y: 680, scale: 1.0, yaw: -0.4, look: -0.8, armL: { a: -20, b: 30 }, armR: { a: 40, b: 20 }, ...faceAt(sf, [[0, 'cool']]) }} rimId="rimL" shadow={0} />
        {/* Speech Bubble from Mo */}
        <g transform="translate(1320 380)">
          <rect x={-140} y={-45} width={280} height={90} rx={14} fill="#DC2626" />
          <text x={0} y={12} fill="#FFFFFF" fontSize={24} fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">STAY DOWN, PIP! 🛑</text>
        </g>
        <BedHeader day="DAY 25" title="No Escape Allowed" subtitle="Strict NASA rules forbid even one foot on floor" f={sf} />
        <BodyMeter muscle="68%" bone="74%" heart="86%" alert={true} />
      </g>
    );
  }

  // Shot 4D (25 - 33.0s = 750 - 992): Spaghetti Legs
  const sf = f - 750;
  return (
    <g>
      <rect x={0} y={0} width={1920} height={1080} fill="#18181B" />
      {/* Pip looking at noodle legs */}
      <g transform="translate(960 480)">
        <Hero look={PIP} pose={{ ...basePose, scale: 1.0, yaw: 0, look: 0, armL: { a: 50, b: 20 }, armR: { a: -50, b: -20 }, ...faceAt(sf, [[0, 'shock']]) }} rimId="rimR" shadow={0} />
        {/* Wobbly yellow noodle legs */}
        <path d="M -40 180 Q -80 250 -40 320 Q 0 380 -30 440" fill="none" stroke="#FDE047" strokeWidth={24} strokeLinecap="round" />
        <path d="M 40 180 Q 80 250 40 320 Q 0 380 30 440" fill="none" stroke="#FDE047" strokeWidth={24} strokeLinecap="round" />
      </g>
      <BedHeader day="DAY 29" title="Noodle Legs" subtitle="Leg muscles completely atrophied into jelly" f={sf} />
      <BodyMeter muscle="65% (CRITICAL)" bone="72%" heart="85%" alert={true} />
    </g>
  );
};

// ========================================================
// CHAPTER 5: DAY 30: THE FIRST STEP (39.4s = 1183 frames)
// Shots: 5A (0-240), 5B (240-510), 5C (510-840), 5D (840-1183)
// ========================================================
export const Chapter5: React.FC<{ f: number }> = ({ f }) => {
  // Shot 5A (0 - 8s): Day 30 Celebration & Confetti
  if (f < 240) {
    return (
      <g>
        <rect x={0} y={0} width={1920} height={1080} fill="#0F172A" />
        <BedGraphics />
        <Hero look={PIP} pose={{ ...basePose, x: 740, y: 640, scale: 0.95, yaw: 0.4, look: 0, armL: { a: 70, b: 20 }, armR: { a: -70, b: -20 }, ...faceAt(f, [[0, 'happy']]) }} rimId="rimR" shadow={0} />
        {/* Confetti Explosion */}
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <circle key={i} cx={400 + i * 150} cy={200 + ((f * 5 + i * 40) % 600)} r={12} fill={i % 2 === 0 ? GOLD : CYAN} />
        ))}
        <BedHeader day="DAY 30" title="Day 30: Freedom!" subtitle="The 30-day trial is officially complete" f={f} />
        <BodyMeter muscle="65%" bone="72%" heart="85%" />
      </g>
    );
  }

  // Shot 5B (8 - 17s = 240 - 510): Bare feet touch cold floor
  if (f < 510) {
    const sf = f - 240;
    return (
      <g>
        <rect x={0} y={0} width={1920} height={1080} fill="#1E293B" />
        {/* Close up of hospital floor and feet */}
        <rect x={0} y={700} width={1920} height={380} fill="#0F172A" stroke="#38BDF8" strokeWidth={3} />
        {/* Pip sitting on bed edge, bare feet hovering */}
        <g transform="translate(960 520)">
          <ellipse cx={-60} cy={180} rx={35} ry={18} fill="#FDBA74" />
          <ellipse cx={60} cy={180} rx={35} ry={18} fill="#FDBA74" />
        </g>
        <g transform="translate(960 380)">
          <rect x={-200} y={-40} width={400} height={80} rx={12} fill="#0F172A" stroke={GOLD} strokeWidth={3} />
          <text x={0} y={12} fill={GOLD} fontSize={28} fontWeight="bold" fontFamily="monospace" textAnchor="middle">FIRST CONTACT WITH FLOOR</text>
        </g>
        <BedHeader day="DAY 30" title="The First Step" subtitle="After 720 hours of horizontal life" f={sf} />
        <BodyMeter muscle="65%" bone="72%" heart="85%" />
      </g>
    );
  }

  // Shot 5C (17 - 28s = 510 - 840): Blood Rush & Blackout
  if (f < 840) {
    const sf = f - 510;
    return (
      <g>
        <rect x={0} y={0} width={1920} height={1080} fill="#450A0A" />
        <Schematic t={sf} id="blackout_ch5" />
        <SchLabel x={960} y={110} t={sf} text="ORTHOSTATIC HYPOTENSION: INSTANT BLOOD DRAIN" size={40} />
        {/* Body diagram with downward blood arrows */}
        <g transform="translate(960 520)">
          <Hero look={PIP} pose={{ ...basePose, scale: 1.05, yaw: 0, look: 0, armL: { a: 40, b: 20 }, armR: { a: -40, b: -20 }, ...faceAt(sf, [[0, 'shock']]) }} rimId="rimR" shadow={0} />
          {/* Downward Blood Arrows */}
          <Arrow x0={-120} y0={-100} x1={-120} y1={250} t={sf} dur={10} color="#EF4444" />
          <Arrow x0={120} y0={-100} x1={120} y1={250} t={sf} dur={10} color="#EF4444" />
        </g>
        <BedHeader day="DAY 30" title="The Instant Blackout" subtitle="Gravity pulls blood straight from brain to feet" f={sf} />
        <BodyMeter muscle="65%" bone="72%" heart="75% (CRITICAL DROP)" alert={true} />
      </g>
    );
  }

  // Shot 5D (28 - 39.4s = 840 - 1183): Comic Floor Collapse
  const sf = f - 840;
  return (
    <g>
      <rect x={0} y={0} width={1920} height={1080} fill="#0F172A" />
      {/* Floor */}
      <rect x={0} y={800} width={1920} height={280} fill="#1E293B" />
      {/* Pip collapsed on floor */}
      <g transform="translate(860 840) rotate(85)">
        <Hero look={PIP} pose={{ ...basePose, scale: 1.0, yaw: 0, look: 0, armL: { a: 80, b: 40 }, armR: { a: -80, b: 40 }, ...faceAt(sf, [[0, 'shock']]) }} rimId="rimR" shadow={0} />
      </g>
      {/* Flying stars around head */}
      {[0, 1, 2, 3].map((i) => (
        <text key={i} x={660 + Math.cos(sf / 8 + i * 1.5) * 60} y={800 + Math.sin(sf / 8 + i * 1.5) * 40} fill="#FDE047" fontSize={28}>⭐</text>
      ))}
      {/* Speech bubble */}
      <g transform="translate(1200 680)">
        <rect x={-180} y={-45} width={360} height={90} rx={16} fill="#EF4444" />
        <text x={0} y={12} fill="#FFFFFF" fontSize={24} fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">MY LEGS ARE JELLY! 😱</text>
      </g>
      <BedHeader day="DAY 30" title="Total Collapse" subtitle="Knees buckle instantly under 1G gravity" f={sf} />
      <BodyMeter muscle="65%" bone="72%" heart="80%" alert={true} />
    </g>
  );
};

// ========================================================
// CHAPTER 6: RECOVERY & OUTRO (26.0s = 781 frames)
// Shots: 6A (0-270), 6B (270-540), 6C (540-781)
// ========================================================
export const Chapter6: React.FC<{ f: number }> = ({ f }) => {
  // Shot 6A (0 - 9s): Physical Therapy
  if (f < 270) {
    return (
      <g>
        <rect x={0} y={0} width={1920} height={1080} fill="#1E293B" />
        <g transform="translate(720 700)">
          <Hero look={PIP} pose={{ ...basePose, scale: 0.95, yaw: 0.3, look: 0.5, armL: { a: 40, b: 30 }, armR: { a: -20, b: 20 }, ...faceAt(f, [[0, 'happy']]) }} rimId="rimR" shadow={0} />
        </g>
        <g transform="translate(1220 700)">
          <Hero look={MO} pose={{ ...basePose, scale: 1.0, yaw: -0.3, look: -0.5, armL: { a: -30, b: 20 }, armR: { a: 30, b: 30 }, ...faceAt(f, [[0, 'cool']]) }} rimId="rimL" shadow={0} />
        </g>
        <g transform="translate(960 420)">
          <rect x={-220} y={-40} width={440} height={80} rx={14} fill="#0F172A" stroke={GOLD} strokeWidth={3} />
          <text x={0} y={12} fill={GOLD} fontSize={28} fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">60 DAYS PHYSICAL THERAPY</text>
        </g>
        <BedHeader day="RECOVERY" title="The Long Walk Back" subtitle="60 days required to rebuild lost muscle & bone" f={f} />
        <BodyMeter muscle="85% (RECOVERING)" bone="88%" heart="95%" />
      </g>
    );
  }

  // Shot 6B (9 - 18s = 270 - 540): Jogging in Park
  if (f < 540) {
    const sf = f - 270;
    return (
      <g>
        <rect x={0} y={0} width={1920} height={1080} fill="#0284C7" />
        <rect x={0} y={720} width={1920} height={360} fill="#15803D" />
        {/* Jogging Pip */}
        <g transform={`translate(${kf(sf, [[0, 600], [270, 1300]])} 660)`}>
          <Hero look={PIP} pose={{ ...basePose, scale: 1.05, yaw: 0.6, look: 0.8, armL: { a: 60, b: 30 }, armR: { a: -60, b: -30 }, legL: { a: 30, b: 20 }, legR: { a: -30, b: 20 }, ...faceAt(sf, [[0, 'happy']]) }} rimId="rimR" shadow={0} />
        </g>
        <g transform="translate(960 320)">
          <rect x={-260} y={-40} width={520} height={80} rx={14} fill="#0F172A" stroke="#FFFFFF" strokeWidth={3} />
          <text x={0} y={12} fill="#FFFFFF" fontSize={28} fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">GRAVITY IS OUR INVISIBLE GYM! 🏃‍♂️</text>
        </g>
        <BedHeader day="RECOVERY" title="Appreciate Every Step" subtitle="Movement is the secret to human life" f={sf} />
        <BodyMeter muscle="100%" bone="100%" heart="100%" />
      </g>
    );
  }

  // Shot 6C (18 - 26.0s = 540 - 781): Animated Subscribe & Bell Outro
  const sf = f - 540;
  const isSubscribed = sf > 100;
  return (
    <g>
      <rect x={0} y={0} width={1920} height={1080} fill="#090D16" />
      <text x={960} y={240} fill="#F8FAFC" fontSize={46} fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">
        SUBSCRIBE FOR WEEKLY ANIMATIONS!
      </text>

      {/* Subscribe & Bell Card */}
      <g transform="translate(960 540)">
        <rect x={-420} y={-85} width={840} height={170} rx={22} fill="#0F172A" stroke={isSubscribed ? '#22C55E' : '#EF4444'} strokeWidth={4} />
        
        {/* Button */}
        <g transform="translate(-140 0)">
          <rect x={-180} y={-45} width={360} height={90} rx={18} fill={isSubscribed ? '#15803D' : '#DC2626'} />
          <text x={0} y={14} fill="#FFFFFF" fontSize={32} fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">
            {isSubscribed ? 'SUBSCRIBED ✅' : 'SUBSCRIBE'}
          </text>
        </g>

        {/* Bell Icon with ring animation */}
        <g transform={`translate(260 0) scale(${1 + Math.sin(sf / 6) * 0.15})`}>
          <circle cx={0} cy={0} r={44} fill="#FBBF24" />
          <text x={0} y={15} fill="#000000" fontSize={38} textAnchor="middle">🔔</text>
        </g>
      </g>

      {/* Characters waving */}
      <Hero look={PIP} pose={{ ...basePose, x: 380, y: 780, scale: 1.0, yaw: 0.3, look: 0.5, armL: { a: 70, b: 30 }, armR: { a: -20, b: 20 }, ...faceAt(sf, [[0, 'happy']]) }} rimId="rimR" shadow={0} />
      <Hero look={MO} pose={{ ...basePose, x: 1540, y: 780, scale: 1.0, yaw: -0.3, look: -0.5, armL: { a: -20, b: 20 }, armR: { a: 70, b: 30 }, ...faceAt(sf, [[0, 'happy']]) }} rimId="rimL" shadow={0} />

      <BedHeader day="OUTRO" title="What If Theory" subtitle="See you next week!" f={sf} />
      <BodyMeter muscle="100%" bone="100%" heart="100%" />
    </g>
  );
};

