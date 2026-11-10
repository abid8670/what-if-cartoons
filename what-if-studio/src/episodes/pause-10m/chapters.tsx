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
const SUIT = LOOKS.suit;
const CYAN = '#38BDF8';

// Reusable Chapter Header HUD
export const ChapterHeader: React.FC<{ num: number; title: string; subtitle?: string; f: number }> = ({ num, title, subtitle, f }) => (
  <g transform="translate(60 60)" opacity={clamp(f / 20)}>
    <rect x={0} y={0} width={620} height={70} rx={10} fill="#0F172A" opacity={0.85} stroke={CYAN} strokeWidth={2} />
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

// Freeze Status Badge
export const FreezeBadge: React.FC<{ f: number; text?: string }> = ({ f, text = 'TIME FROZEN (dt = 0)' }) => (
  <g transform="translate(1420 60)">
    <rect x={0} y={0} width={440} height={60} rx={8} fill="#0284C7" opacity={0.8} filter="drop-shadow(0 0 14px #38BDF8)" />
    <rect x={2} y={2} width={436} height={56} rx={6} fill="#0F172A" />
    <circle cx={35} cy={30} r={12} fill="#EF4444" opacity={f % 30 > 15 ? 1 : 0.4} />
    <text x={65} y={37} fill="#BAE6FD" fontSize={20} fontWeight="bold" fontFamily="monospace">
      {text}
    </text>
  </g>
);

// ==========================================
// CHAPTER 1: THE AWAKENING (Kitchen, 77s)
// ==========================================
export const Chapter1: React.FC<{ f: number }> = ({ f }) => {
  const p = stand(KITCHEN, 0.42, 0.4);
  const mugHoverY = 620 + Math.sin(f / 20) * 3;
  return (
    <g transform={camT(kf(f, [[0, 960], [2300, 1000]]), 540, kf(f, [[0, 1.2], [2300, 1.35]]))}>
      <Kitchen t={f} id="ch1_k" />
      <Hero look={PIP} pose={{ ...basePose, x: p.x, y: p.y, scale: p.scale, yaw: 0.5, look: 0.8, armL: { a: 15, b: -5 }, armR: { a: 45, b: 0 }, ...faceAt(f, [[0, 'shock'], [300, 'cool']]) }} rimId="rimR" shadow={0} />
      <KitchenIsland />
      {/* Suspended Mug & Amber Droplets */}
      <g transform={`translate(960 ${mugHoverY}) rotate(30)`} filter="drop-shadow(0 0 16px #38BDF8)">
        <rect x={-25} y={-40} width={50} height={60} rx={8} fill="#F8FAFC" stroke="#0F172A" strokeWidth={6} />
        <ellipse cx={0} cy={-36} rx={20} ry={8} fill="#6F4E37" />
        <circle cx={-15} cy={-65} r={8} fill="#6F4E37" stroke={CYAN} strokeWidth={2} />
        <circle cx={10} cy={-85} r={6} fill="#6F4E37" stroke={CYAN} strokeWidth={2} />
        <circle cx={-5} cy={-105} r={4} fill="#6F4E37" stroke={CYAN} strokeWidth={2} />
      </g>
      {/* Frozen Microwave Clock */}
      <g transform="translate(1350 280)">
        <rect x={0} y={0} width={180} height={70} rx={6} fill="#000000" stroke="#334155" strokeWidth={4} />
        <text x={90} y={48} fill="#22C55E" fontSize={36} fontFamily="monospace" fontWeight="bold" textAnchor="middle">
          07:15:42
        </text>
      </g>
      <ChapterHeader num={1} title="The Awakening" subtitle="A Tuesday morning that stopped forever" f={f} />
      <FreezeBadge f={f} />
    </g>
  );
};

// ==========================================
// CHAPTER 2: CHEATING LIFE (Classroom, 91s)
// ==========================================
export const Chapter2: React.FC<{ f: number }> = ({ f }) => {
  const pipWalkX = kf(f, [[0, 500], [600, 960], [1800, 1300], [2700, 500]]);
  return (
    <g transform={camT(kf(f, [[0, 850], [2700, 1050]]), 540, kf(f, [[0, 1.15], [2700, 1.25]]))}>
      <rect x={0} y={0} width={1920} height={1080} fill="#1E293B" />
      {/* Chalkboard with calculus formulas */}
      <rect x={400} y={150} width={1120} height={320} rx={10} fill="#0F3824" stroke="#78350F" strokeWidth={12} />
      <text x={960} y={230} fill="#FEF08A" fontSize={32} fontFamily="monospace" textAnchor="middle">
        FINAL EXAM: INTEGRAL CALCULUS
      </text>
      <text x={960} y={310} fill="#FFFFFF" fontSize={26} fontFamily="monospace" textAnchor="middle" opacity={0.8}>
        {"∫ f(x)dx = F(b) - F(a) | dt -> 0 ?"}
      </text>
      {/* Teacher frozen mid-stride */}
      <g transform="translate(1450 720)">
        <Hero look={SUIT} pose={{ ...basePose, scale: 0.95, yaw: -0.6, look: -0.8, armL: { a: -30, b: 10 }, armR: { a: 30, b: -10 }, legL: { a: 45, b: 20 }, legR: { a: -20, b: 0 } }} rimId="rimR" shadow={0} />
      </g>
      {/* Mo frozen sweating over test */}
      <g transform="translate(850 740)">
        <Hero look={MO} pose={{ ...basePose, scale: 0.9, yaw: 0.2, look: 0.8, armL: { a: 20, b: 40 }, armR: { a: 40, b: 40 }, ...faceAt(0, [[0, 'shock']]) }} rimId="rimR" shadow={0} />
        {/* Exam paper */}
        <rect x={-40} y={-80} width={80} height={100} fill="#FFFFFF" stroke="#0F172A" strokeWidth={3} />
        <line x1={-30} y1={-60} x2={20} y2={-60} stroke="#EF4444" strokeWidth={4} />
      </g>
      {/* Walking Pip */}
      <Hero look={PIP} pose={{ ...basePose, x: pipWalkX, y: 740, scale: 0.95, yaw: 0.7, look: 0.7, ...faceAt(f, [[0, 'smug']]) }} rimId="rimR" shadow={0} />
      <ChapterHeader num={2} title="The First Cheats" subtitle="Room 402: The Ultimate Exam Hack" f={f} />
      <FreezeBadge f={f} text="TEACHER FROZEN: SCORE = 100%" />
    </g>
  );
};

// ==========================================
// CHAPTER 3: INFINITE WEALTH (Store / Bank, 85s)
// ==========================================
export const Chapter3: React.FC<{ f: number }> = ({ f }) => {
  return (
    <g transform={camT(kf(f, [[0, 960], [2500, 1020]]), 540, kf(f, [[0, 1.1], [2500, 1.2]]))}>
      <Rooftop t={f} sunX={960} sunY={500} cityLit={1.2} />
      <rect x={0} y={720} width={1920} height={360} fill="#0F172A" />
      {/* Luxury Electronics & Cash Vault Display */}
      <g transform="translate(1200 700)">
        {/* Bank Safe Door */}
        <circle cx={0} cy={-40} r={160} fill="#334155" stroke="#94A3B8" strokeWidth={16} />
        <circle cx={0} cy={-40} r={80} fill="#1E293B" stroke="#64748B" strokeWidth={8} />
        {/* Stacks of $100 Cash Bills */}
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={-120 + i * 65} y={80} width={55} height={35} rx={4} fill="#22C55E" stroke="#14532D" strokeWidth={3} />
        ))}
      </g>
      {/* Frozen Guard */}
      <g transform="translate(1550 720)">
        <Hero look={SUIT} pose={{ ...basePose, scale: 0.95, yaw: -0.5, look: -0.6, armR: { a: 75, b: 0 } }} rimId="rimR" shadow={0} />
      </g>
      {/* Pip with headphones and laptop */}
      <Hero look={PIP} pose={{ ...basePose, x: 650, y: 720, scale: 1.0, yaw: 0.6, look: 0.8, armR: { a: 30, b: -20 }, ...faceAt(f, [[0, 'cool']]) }} rimId="rimR" shadow={0} />
      <ChapterHeader num={3} title="Infinite Luxury & Wealth" subtitle="When every vault on Earth is unlocked" f={f} />
      <FreezeBadge f={f} text="BALANCE: INFINITE (ALL FREE)" />
    </g>
  );
};

// ==========================================
// CHAPTER 4: THE HERO COMPLEX (Truck Rescue, 100s)
// ==========================================
export const Chapter4: React.FC<{ f: number }> = ({ f }) => {
  return (
    <g transform={camT(kf(f, [[0, 960], [3000, 980]]), 540, kf(f, [[0, 1.15], [3000, 1.3]]))}>
      <rect x={0} y={0} width={1920} height={1080} fill="#0F172A" />
      <rect x={0} y={700} width={1920} height={380} fill="#1E293B" />
      {/* Massive Cement Truck Frozen in Skid */}
      <g transform="translate(1380 680)" filter="drop-shadow(0 0 20px #38BDF8)">
        <rect x={-220} y={-140} width={440} height={160} rx={20} fill="#DC2626" stroke="#0F172A" strokeWidth={10} />
        {/* Cement Drum */}
        <ellipse cx={-40} cy={-90} rx={140} ry={70} fill="#94A3B8" stroke="#475569" strokeWidth={8} />
        <circle cx={-130} cy={35} r={45} fill="#0F172A" />
        <circle cx={130} cy={35} r={45} fill="#0F172A" />
        {/* Smoke clouds frozen */}
        <circle cx={130} cy={50} r={35} fill="#E2E8F0" opacity={0.6} />
      </g>
      {/* Mother and Child safe behind barrier */}
      <g transform="translate(480 720)">
        <rect x={-80} y={-60} width={160} height={80} rx={12} fill="#64748B" stroke="#0F172A" strokeWidth={6} />
        <Hero look={LOOKS.mom} pose={{ ...basePose, scale: 0.9, yaw: 0.5, look: 0.7, armL: { a: 20, b: 30 } }} rimId="rimR" shadow={0} />
        <Hero look={SIS} pose={{ ...basePose, x: 40, scale: 0.65, yaw: 0.3, look: 0.5 }} rimId="rimR" shadow={0} />
      </g>
      {/* Pip standing proud */}
      <Hero look={PIP} pose={{ ...basePose, x: 820, y: 720, scale: 1.0, yaw: 0.3, look: -0.5, armL: { a: 20, b: -10 }, armR: { a: 20, b: -10 }, ...faceAt(f, [[0, 'smug']]) }} rimId="rimR" shadow={0} />
      <ChapterHeader num={4} title="The Hero Complex" subtitle="A 12-ton truck stopped an inch away" f={f} />
      <FreezeBadge f={f} text="TIME TO IMPACT: 0.00s" />
    </g>
  );
};

// ==========================================
// CHAPTER 5: THE DARKNESS TRAP (Light/Blindness, 82s)
// ==========================================
export const Chapter5: React.FC<{ f: number }> = ({ f }) => {
  const darkVignette = Math.min(0.96, f / 1800);
  return (
    <g transform={`translate(960 540) scale(${kf(f, [[0, 1.0], [2400, 1.06]])}) translate(-960 -540)`}>
      <Schematic t={f} id="ch5_sch" />
      <SchLabel x={960} y={130} t={f} text="THE LIGHT PARADOX: ZERO PHOTON PROPAGATION" size={46} />
      {/* Light Source */}
      <circle cx={340} cy={500} r={70} fill="#FACC15" filter="drop-shadow(0 0 24px #FACC15)" />
      <SchLabel x={340} y={610} t={f} text="EMITTER (SUN/LAMP)" size={30} />
      <Arrow x0={430} y0={500} x1={1200} y1={500} t={f} dur={10} />
      {/* Speed gauge */}
      <g transform="translate(800 440)">
        <rect x={-180} y={-50} width={360} height={80} rx={10} fill="#0F172A" stroke="#EF4444" strokeWidth={4} />
        <text x={0} y={-4} fill="#EF4444" fontSize={38} fontFamily="monospace" fontWeight="bold" textAnchor="middle">
          {f < 800 ? '299,792 km/s' : '0.00 km/s'}
        </text>
        <text x={0} y={22} fill="#94A3B8" fontSize={20} fontFamily="sans-serif" textAnchor="middle">
          PHOTON VELOCITY (FROZEN)
        </text>
      </g>
      {/* Retinal detection */}
      <g transform="translate(1420 500)">
        <ellipse cx={0} cy={0} rx={80} ry={50} fill="#1E293B" stroke="#F8FAFC" strokeWidth={6} />
        <circle cx={-10} cy={0} r={28} fill="#0284C7" />
        <circle cx={-10} cy={0} r={14} fill="#0F172A" />
        <SchLabel x={0} y={90} t={f} text="RETINA: 0 PHOTONS RECEIVED" size={28} color="#EF4444" />
      </g>
      {/* Darkness vignette swallowing view */}
      <rect x={0} y={0} width={1920} height={1080} fill="#000000" opacity={darkVignette} />
      <ChapterHeader num={5} title="The Darkness Trap" subtitle="Why stopping time makes you completely blind" f={f} />
      <FreezeBadge f={f} text="LIGHT EMISSION = 0 (BLACKOUT)" />
    </g>
  );
};

// ==========================================
// CHAPTER 6: CONCRETE ATMOSPHERE (Air & Cold, 88s)
// ==========================================
export const Chapter6: React.FC<{ f: number }> = ({ f }) => {
  return (
    <g transform={camT(960, 540, kf(f, [[0, 1.1], [2600, 1.25]]))}>
      <rect x={0} y={0} width={1920} height={1080} fill="#020617" />
      {/* Rigid Molecular Lattice of Frozen Gas */}
      <g stroke={CYAN} strokeWidth={2} opacity={0.7}>
        {[200, 420, 640, 860, 1080, 1300, 1520, 1740].map((x) =>
          [160, 320, 480, 640, 800, 960].map((y) => (
            <g key={`${x}-${y}`} transform={`translate(${x} ${y})`}>
              <polygon points="0,-25 22,-12 22,12 0,25 -22,12 -22,-12" fill="none" stroke="#38BDF8" strokeWidth={2} />
              <circle cx={0} cy={0} r={5} fill="#BAE6FD" />
            </g>
          ))
        )}
      </g>
      {/* Temperature Gauge: dropping to -273.15C */}
      <g transform="translate(1500 480)">
        <rect x={-140} y={-160} width={280} height={320} rx={16} fill="#0F172A" stroke="#38BDF8" strokeWidth={6} />
        <text x={0} y={-100} fill="#94A3B8" fontSize={24} fontFamily="sans-serif" textAnchor="middle">
          TEMPERATURE
        </text>
        <text x={0} y={-20} fill="#38BDF8" fontSize={52} fontFamily="monospace" fontWeight="bold" textAnchor="middle">
          -273.15°C
        </text>
        <text x={0} y={40} fill="#EF4444" fontSize={26} fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">
          ABSOLUTE ZERO
        </text>
        <text x={0} y={90} fill="#94A3B8" fontSize={18} fontFamily="sans-serif" textAnchor="middle">
          MOLECULAR MOTION = 0
        </text>
      </g>
      {/* Pip clutching chest suffocating */}
      <Hero look={PIP} pose={{ ...basePose, x: 740, y: 740, scale: 1.1, yaw: 0.4, look: 0.5, armL: { a: 60, b: 20 }, armR: { a: 65, b: 20 }, ...faceAt(f, [[0, 'shock']]) }} rimId="rimR" shadow={0} />
      <ChapterHeader num={6} title="The Concrete Atmosphere" subtitle="Frozen N2 & O2: Inhalation impossible" f={f} />
      <FreezeBadge f={f} text="AIR STATUS: SOLID GLASS" />
    </g>
  );
};

// ==========================================
// CHAPTER 7: THE WATCHERS (Satellites & Suits, 76s)
// ==========================================
export const Chapter7: React.FC<{ f: number }> = ({ f }) => {
  return (
    <g transform={camT(kf(f, [[0, 960], [2200, 1000]]), 540, kf(f, [[0, 1.15], [2200, 1.25]]))}>
      <Rooftop t={f} sunX={960} sunY={620} cityLit={0.8} />
      <rect x={0} y={720} width={1920} height={360} fill="#0F172A" />
      {/* Tactical Surveillance Van */}
      <g transform="translate(1320 720)">
        <rect x={-180} y={-110} width={360} height={120} rx={14} fill="#18181B" stroke="#000000" strokeWidth={8} />
        <circle cx={-100} cy={15} r={35} fill="#09090B" />
        <circle cx={100} cy={15} r={35} fill="#09090B" />
        {/* Directional Dish Antenna on roof */}
        <path d="M 0 -110 Q 50 -180 80 -140" fill="none" stroke="#22C55E" strokeWidth={6} />
      </g>
      {/* Agents in Suits with Scanners */}
      <g transform="translate(1000 720)">
        <Hero look={SUIT} pose={{ ...basePose, scale: 0.95, yaw: -0.6, look: -0.7, armR: { a: 45, b: 0 } }} rimId="rimR" shadow={0} />
      </g>
      <g transform="translate(860 720)">
        <Hero look={SUIT} pose={{ ...basePose, scale: 0.95, yaw: -0.6, look: -0.7, armL: { a: 20, b: 10 } }} rimId="rimR" shadow={0} />
      </g>
      {/* Pip watching from balcony */}
      <Hero look={PIP} pose={{ ...basePose, x: 420, y: 720, scale: 1.0, yaw: 0.7, look: 0.9, ...faceAt(f, [[0, 'worried']]) }} rimId="rimR" shadow={0} />
      <ChapterHeader num={7} title="The Watchers" subtitle="Atomic clocks & GPS satellites tracked the missing time" f={f} />
      <FreezeBadge f={f} text="ANOMALY EPICENTER: LOCATED" />
    </g>
  );
};

// ==========================================
// CHAPTER 8: THE ETERNAL VOID (Sister & Void, 92s)
// ==========================================
export const Chapter8: React.FC<{ f: number }> = ({ f }) => {
  const voidFade = Math.min(0.92, f / 1800);
  return (
    <g transform={camT(960, 540, kf(f, [[0, 1.1], [2700, 1.2]]))}>
      <Stairwell t={f} id="ch8_sw" />
      {/* Broken Door */}
      <rect x={1250} y={320} width={120} height={420} fill="#78350F" transform="rotate(18 1250 320)" />
      {/* Little Sister frozen in terror */}
      <g transform="translate(820 620)">
        <Hero look={SIS} pose={{ ...basePose, scale: 0.8, yaw: 0.4, look: 0.6, armL: { a: 30, b: 20 }, armR: { a: 30, b: 20 }, ...faceAt(0, [[0, 'shock']]) }} rimId="rimR" shadow={0} />
      </g>
      {/* Armed Agent frozen at door */}
      <g transform="translate(1420 580)">
        <Hero look={SUIT} pose={{ ...basePose, scale: 1.0, yaw: -0.8, look: -0.8, armR: { a: 80, b: 0 } }} rimId="rimR" shadow={0} />
        {/* Frozen muzzle flash */}
        <polygon points="120,-80 180,-100 210,-80 180,-60" fill="#F97316" filter="drop-shadow(0 0 16px #EA580C)" />
      </g>
      {/* Pip clutching broken trigger */}
      <Hero look={PIP} pose={{ ...basePose, x: 550, y: 640, scale: 1.0, yaw: 0.5, look: 0.7, armR: { a: 45, b: 30 }, ...faceAt(f, [[0, 'shock']]) }} rimId="rimR" shadow={0} />
      {/* Darkness and silence void */}
      <rect x={0} y={0} width={1920} height={1080} fill="#020617" opacity={voidFade} />
      {f > 1200 && (
        <g transform="translate(960 480)" opacity={clamp((f - 1200) / 60)}>
          <text x={0} y={0} fill="#38BDF8" fontSize={58} fontWeight="bold" fontFamily="monospace" textAnchor="middle" filter="drop-shadow(0 0 20px #38BDF8)">
            WHO UNFREEZES YOU?
          </text>
        </g>
      )}
      <ChapterHeader num={8} title="The Eternal Void" subtitle="The trigger breaks. Trapped forever." f={f} />
      <FreezeBadge f={f} text="UNFREEZE CIRCUIT: DESTROYED" />
    </g>
  );
};

