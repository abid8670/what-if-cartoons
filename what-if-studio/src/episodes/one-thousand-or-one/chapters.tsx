import React from 'react';
import { interpolate, spring, staticFile } from 'remotion';
import { Hero, LOOKS, Pose, Look, C } from '../../engine';

const GROUND_Y = 820;
const HIPS_Y = 687; // 820 - 140 * 0.95 (feet grounded at 820)

// Custom Look for the Loyal Girl: Dark bob hair, green coat, mustard scarf, blushing face
const GIRL_LOOK: Look = {
  skin: C.skin,
  skinShade: C.skinShade,
  hand: C.skin,
  jacket: '#2A433A',      // Dark pine green coat
  jacketShade: '#1C2F28',
  accent: '#F59E0B',      // Warm mustard yellow scarf
  limb: '#1E293B',
  line: '#0F172A',
  shoe: '#D97706',
  face: '#0F172A',
  hair: '#1E1B2E',
  extra: 'bob',
};

// Reusable Falling Rain Effect
const RainOverlay: React.FC<{ f: number; intensity?: number }> = ({ f, intensity = 60 }) => {
  return (
    <g opacity={0.65}>
      {Array.from({ length: intensity }).map((_, i) => {
        const x = (i * 37 + (f * 18)) % 1920;
        const y = ((i * 53 + (f * 32)) % 1080) - 80;
        return (
          <line
            key={i}
            x1={x}
            y1={y}
            x2={x - 14}
            y2={y + 45}
            stroke="#93C5FD"
            strokeWidth={1.8}
            strokeOpacity={0.55}
            strokeLinecap="round"
          />
        );
      })}
    </g>
  );
};

// Reusable Puddle Ripples
const Puddles: React.FC<{ f: number }> = ({ f }) => {
  return (
    <g opacity={0.4}>
      {[350, 720, 1100, 1500].map((px, i) => {
        const r = (f * 0.8 + i * 20) % 45;
        const op = Math.max(0, 1 - r / 45);
        return <ellipse key={i} cx={px} cy={GROUND_Y + 14} rx={r * 1.8} ry={r * 0.5} fill="none" stroke="#93C5FD" strokeWidth={1.5} opacity={op} />;
      })}
    </g>
  );
};

// ========================================================
// 1. CHAPTER 1: THE DILEMMA OF MODERN LOVE (920 frames)
// ========================================================
export const Chapter1: React.FC<{ f: number }> = ({ f }) => {
  // Pip standing center-stage, conflicted looking left and right
  const lookDir = Math.sin(f * 0.1);
  const sweatDrop = (f % 45) / 45;

  const pipPose: Pose = {
    x: 960,
    y: HIPS_Y,
    scale: 0.95,
    facing: 1,
    tilt: lookDir * 4,
    spin: 0,
    headTilt: lookDir * 6,
    armL: { a: 15 + lookDir * 10, b: 20 },
    armR: { a: -15 - lookDir * 10, b: 20 },
    legL: { a: 5, b: 0 },
    legR: { a: -5, b: 0 },
    expr: 'worried',
    blink: Math.sin(f * 0.12) > 0.94 ? 1 : 0,
    look: lookDir,
    glasses: 0,
    yaw: lookDir * 0.3,
    squash: 0,
    handL: 'open',
    handR: 'open',
    sway: 0,
  };

  return (
    <g>
      {/* Background Street */}
      <image href={staticFile('one-thousand-or-one/bg_dilemma_street.jpg')} x={0} y={0} width={1920} height={1080} preserveAspectRatio="xMidYMid slice" />
      <rect x={0} y={0} width={1920} height={1080} fill="#050814" opacity={0.3} />

      {/* Puddles & Rain */}
      <Puddles f={f} />
      <RainOverlay f={f} intensity={65} />

      {/* LEFT SIDE: 1,000 NEON GLOW (Seductive silhouettes) */}
      <g transform="translate(380 440)">
        <ellipse cx={0} cy={200} rx={180} ry={40} fill="#EC4899" opacity={0.15} />
        {/* Neon Silhouette outlines */}
        {[-80, 0, 80].map((dx, i) => (
          <g key={i} transform={`translate(${dx} ${Math.sin(f * 0.08 + i) * 6})`} opacity={0.75}>
            <circle cx={0} cy={-90} r={28} fill="#EC4899" />
            <path d="M -22 -60 Q -35 0 0 120 Q 35 0 22 -60 Z" fill="#F43F5E" />
            <ellipse cx={0} cy={120} rx={32} ry={10} fill="#000" opacity={0.3} />
          </g>
        ))}
        {/* Glow badge */}
        <g transform="translate(0 250)">
          <rect x={-160} y={-30} width={320} height={60} rx={18} fill="#0F172A" opacity={0.92} stroke="#EC4899" strokeWidth={3} />
          <text x={0} y={8} textAnchor="middle" fill="#F43F5E" fontSize="26" fontWeight="900" letterSpacing="3px" fontFamily="Montserrat, sans-serif">
            1,000 OPTIONS
          </text>
        </g>
      </g>

      {/* RIGHT SIDE: THE 1 (Warm gentle streetlamp & umbrella) */}
      <g transform="translate(1540 440)">
        <circle cx={0} cy={-40} r={140} fill="#FACC15" opacity={0.14} />
        {/* Yellow Umbrella silhouette */}
        <path d="M -90 -30 Q 0 -130 90 -30 Z" fill="#FACC15" stroke="#EAB308" strokeWidth={3} />
        <line x1={0} y1={-130} x2={0} y2={70} stroke="#78350F" strokeWidth={5} />
        <path d="M 0 70 Q 0 95 -16 95" fill="none" stroke="#78350F" strokeWidth={5} />
        {/* Girl silhouette */}
        <circle cx={0} cy={-10} r={24} fill="#1E293B" />
        <path d="M -20 14 L 20 14 L 30 140 L -30 140 Z" fill="#2A433A" />

        {/* Glow badge */}
        <g transform="translate(0 250)">
          <rect x={-160} y={-30} width={320} height={60} rx={18} fill="#0F172A" opacity={0.92} stroke="#FACC15" strokeWidth={3} />
          <text x={0} y={8} textAnchor="middle" fill="#FACC15" fontSize="26" fontWeight="900" letterSpacing="3px" fontFamily="Montserrat, sans-serif">
            OR JUST 1?
          </text>
        </g>
      </g>

      {/* Pip Center Stage */}
      <ellipse cx={960} cy={GROUND_Y} rx={60} ry={14} fill="#000000" opacity={0.5} />
      <Hero pose={pipPose} look={LOOKS.pipHood} shadow={1.0} />

      {/* Sweat drop on Pip */}
      <ellipse cx={960 + 35} cy={HIPS_Y - 180 + sweatDrop * 25} rx={3} ry={5} fill="#38BDF8" opacity={1 - sweatDrop} />

      {/* Top Dilemma Badge */}
      <g transform="translate(960 90)">
        <rect x={-260} y={-35} width={520} height={70} rx={22} fill="#0F172A" opacity={0.95} stroke="#FFFFFF" strokeWidth={3} />
        <text x={0} y={10} textAnchor="middle" fill="#FFFFFF" fontSize="34" fontWeight="900" letterSpacing="4px" fontFamily="Montserrat, sans-serif">
          1,000 OR 1?
        </text>
      </g>
    </g>
  );
};

// ========================================================
// 2. CHAPTER 2: THE NEON ILLUSION (906 frames)
// ========================================================
export const Chapter2: React.FC<{ f: number }> = ({ f }) => {
  // Symmetrical neon corridor with floating flattery notifications
  const pulse = Math.sin(f * 0.15) * 0.15 + 0.85;

  const pipPose: Pose = {
    x: 960,
    y: HIPS_Y,
    scale: 0.95,
    facing: 1,
    tilt: 0,
    spin: 0,
    headTilt: 0,
    armL: { a: 30, b: 35 }, // holding buzzing phone
    armR: { a: -20, b: 20 },
    legL: { a: 6, b: 0 },
    legR: { a: -6, b: 0 },
    expr: 'shock',
    blink: Math.sin(f * 0.1) > 0.94 ? 1 : 0,
    look: 0,
    glasses: 0,
    yaw: 0,
    squash: 0,
    handL: 'open',
    handR: 'open',
    sway: 0,
  };

  return (
    <g>
      {/* Corridor Background */}
      <image href={staticFile('one-thousand-or-one/bg_neon_crowd_alley.jpg')} x={0} y={0} width={1920} height={1080} preserveAspectRatio="xMidYMid slice" />
      <rect x={0} y={0} width={1920} height={1080} fill="#0A0518" opacity={0.35} />

      {/* Floating Notification Hearts & Matches */}
      {[-350, -180, 180, 350].map((dx, i) => {
        const floatY = ((f * 2.5 + i * 90) % 500) - 250;
        return (
          <g key={i} transform={`translate(${960 + dx} ${500 - floatY}) scale(${pulse})`} opacity={Math.max(0, 1 - Math.abs(floatY) / 250)}>
            <rect x={-75} y={-24} width={150} height={48} rx={14} fill="#EC4899" stroke="#F43F5E" strokeWidth={2} />
            <text x={0} y={6} textAnchor="middle" fill="#FFFFFF" fontSize="16" fontWeight="900" fontFamily="Montserrat, sans-serif">
              {i % 2 === 0 ? '❤️ MATCH!' : '🔥 +100 LIKES'}
            </text>
          </g>
        );
      })}

      {/* Glowing Neon Silhouettes lining the corridor */}
      {[-550, -420, -290, 290, 420, 550].map((dx, i) => (
        <g key={i} transform={`translate(${960 + dx} ${GROUND_Y}) scale(0.9)`} opacity={0.65}>
          <ellipse cx={0} cy={10} rx={45} ry={12} fill="#EC4899" opacity={0.3} />
          <circle cx={0} cy={-220} r={28} fill="#EC4899" />
          <path d="M -25 -190 Q -40 -120 -15 0 L 15 0 Q 40 -120 25 -190 Z" fill="#F43F5E" />
        </g>
      ))}

      {/* Pip in Center */}
      <ellipse cx={960} cy={GROUND_Y} rx={60} ry={14} fill="#000000" opacity={0.5} />
      <Hero pose={pipPose} look={LOOKS.pipHood} shadow={1.0} />

      {/* Phone in Pip's Hand */}
      <g transform={`translate(${960 - 55} ${HIPS_Y - 45})`}>
        <rect x={-10} y={-18} width={20} height={36} rx={4} fill="#0F172A" stroke="#38BDF8" strokeWidth={2} />
        <circle cx={0} cy={0} r={22 * pulse} fill="#38BDF8" opacity={0.25} />
      </g>

      {/* Quote Banner */}
      <g transform="translate(960 110)">
        <rect x={-420} y={-32} width={840} height={64} rx={18} fill="#0F172A" opacity={0.92} stroke="#EC4899" strokeWidth={2.5} />
        <text x={0} y={8} textAnchor="middle" fill="#F8FAFC" fontSize="22" fontWeight="800" fontFamily="Montserrat, sans-serif">
          A CROWD DOES NOT COMFORT YOU. A CROWD ONLY WATCHES.
        </text>
      </g>
    </g>
  );
};

// ========================================================
// 3. CHAPTER 3: THE EMPTY CROWD & THE STORM (1067 frames)
// ========================================================
export const Chapter3: React.FC<{ f: number }> = ({ f }) => {
  // Heavy rain & lightning flashes
  const isLightning = (f > 60 && f < 66) || (f > 420 && f < 426) || (f > 750 && f < 756);
  const dissolve = interpolate(f, [200, 500], [1, 0], { extrapolateRight: 'clamp' });

  // Pip freezing, shivering, head down
  const shiver = Math.sin(f * 0.8) * 2;
  const pipPose: Pose = {
    x: 960,
    y: HIPS_Y + 12,
    scale: 0.95,
    facing: 1,
    tilt: 14 + shiver,
    spin: 0,
    headTilt: 18,
    armL: { a: -35, b: 70 }, // shivering hands tucked into hoodie
    armR: { a: 35, b: 70 },
    legL: { a: 8, b: 10 },
    legR: { a: -8, b: 10 },
    expr: 'tired',
    blink: Math.sin(f * 0.08) > 0.92 ? 1 : 0,
    look: 0,
    glasses: 0,
    yaw: 0,
    squash: 0.06,
    handL: 'open',
    handR: 'open',
    sway: 0,
  };

  return (
    <g>
      {/* Background Street */}
      <image href={staticFile('one-thousand-or-one/bg_dilemma_street.jpg')} x={0} y={0} width={1920} height={1080} preserveAspectRatio="xMidYMid slice" />
      <rect x={0} y={0} width={1920} height={1080} fill="#02040B" opacity={0.65} />

      {/* Lightning Flash Overlay */}
      {isLightning && <rect x={0} y={0} width={1920} height={1080} fill="#FFFFFF" opacity={0.7} />}

      {/* Heavy Rain & Puddles */}
      <Puddles f={f} />
      <RainOverlay f={f} intensity={120} />

      {/* Dissolving Silhouettes turning into mist/smoke */}
      {[-550, -380, 380, 550].map((dx, i) => (
        <g key={i} transform={`translate(${960 + dx} ${GROUND_Y}) scale(0.9)`} opacity={dissolve * 0.5}>
          <ellipse cx={0} cy={10} rx={45} ry={12} fill="#EC4899" opacity={0.2} />
          <circle cx={0} cy={-220} r={28} fill="#334155" />
          <path d="M -25 -190 Q -40 -120 -15 0 L 15 0 Q 40 -120 25 -190 Z" fill="#1E293B" />
        </g>
      ))}

      {/* Cold Shivering Pip */}
      <ellipse cx={960} cy={GROUND_Y} rx={60} ry={14} fill="#000000" opacity={0.6} />
      <Hero pose={pipPose} look={LOOKS.pipHood} shadow={1.0} />

      {/* Somber HUD */}
      <g transform="translate(960 110)">
        <rect x={-450} y={-32} width={900} height={64} rx={18} fill="#020617" opacity={0.92} stroke="#38BDF8" strokeWidth={2} />
        <text x={0} y={8} textAnchor="middle" fill="#94A3B8" fontSize="22" fontWeight="800" fontFamily="Montserrat, sans-serif">
          WHEN THE STORM HITS... THE 1,000 DISSOLVE LIKE SMOKE.
        </text>
      </g>
    </g>
  );
};

// ========================================================
// 4. CHAPTER 4: THE YELLOW UMBRELLA (915 frames)
// ========================================================
export const Chapter4: React.FC<{ f: number }> = ({ f }) => {
  // Girl walks in from right (x=1380 -> x=1070)
  const girlProg = interpolate(f, [0, 90], [0, 1], { extrapolateRight: 'clamp' });
  const girlX = interpolate(girlProg, [0, 1], [1380, 1070]);
  const isWalking = f < 90;
  const legCycle = Math.sin(f * 0.45);

  // Umbrella opening / tilting over Pip
  const umbTilt = interpolate(f, [90, 180], [0, -18], { extrapolateRight: 'clamp' });
  const warmGlow = interpolate(f, [100, 240], [0, 1], { extrapolateRight: 'clamp' });

  // Pip looks up, relieved, warming up
  const pipPose: Pose = {
    x: 930,
    y: HIPS_Y,
    scale: 0.95,
    facing: 1,
    tilt: -4,
    spin: 0,
    headTilt: -8,
    armL: { a: 15, b: 10 },
    armR: { a: 20, b: 25 },
    legL: { a: 5, b: 0 },
    legR: { a: -5, b: 0 },
    expr: f > 120 ? 'happy' : 'worried',
    blink: Math.sin(f * 0.1) > 0.94 ? 1 : 0,
    look: 0.8, // looking at the girl
    glasses: 0,
    yaw: 0.2,
    squash: 0,
    handL: 'open',
    handR: 'open',
    sway: 0,
  };

  const girlPose: Pose = {
    x: girlX,
    y: HIPS_Y,
    scale: 0.92,
    facing: -1, // facing Pip
    tilt: isWalking ? -4 : 0,
    spin: 0,
    headTilt: -6,
    armL: { a: -40, b: -30 }, // holding umbrella handle high
    armR: isWalking ? { a: -legCycle * 20, b: 10 } : { a: 15, b: 10 },
    legL: isWalking ? { a: legCycle * 28, b: Math.max(0, -legCycle * 18) } : { a: 5, b: 0 },
    legR: isWalking ? { a: -legCycle * 28, b: Math.max(0, legCycle * 18) } : { a: -5, b: 0 },
    expr: 'happy',
    blink: Math.sin(f * 0.12) > 0.94 ? 1 : 0,
    look: -0.7,
    glasses: 0,
    yaw: -0.2,
    squash: 0,
    handL: 'open',
    handR: 'open',
    sway: 0,
  };

  return (
    <g>
      {/* Background with warm street lamp */}
      <image href={staticFile('one-thousand-or-one/bg_umbrella_warmth.jpg')} x={0} y={0} width={1920} height={1080} preserveAspectRatio="xMidYMid slice" />
      <rect x={0} y={0} width={1920} height={1080} fill="#030712" opacity={0.35} />

      {/* Rain & Puddles */}
      <Puddles f={f} />
      <RainOverlay f={f} intensity={70} />

      {/* Pip grounded */}
      <ellipse cx={930} cy={GROUND_Y} rx={60} ry={14} fill="#000000" opacity={0.5} />
      <Hero pose={pipPose} look={LOOKS.pipHood} shadow={1.0} />

      {/* Girl grounded */}
      <ellipse cx={girlX} cy={GROUND_Y} rx={55} ry={13} fill="#000000" opacity={0.5} />
      <Hero pose={girlPose} look={GIRL_LOOK} shadow={1.0} />

      {/* THE BRIGHT YELLOW UMBRELLA (Held by Girl, tilted over Pip) */}
      <g transform={`translate(${girlX - 55} ${HIPS_Y - 140}) rotate(${umbTilt})`}>
        {/* Warm Golden Light Cone Deflecting Rain */}
        {warmGlow > 0 && (
          <polygon
            points="-180,0 180,0 280,500 -280,500"
            fill="url(#yellow-cone-grad)"
            opacity={0.28 * warmGlow}
          />
        )}
        {/* Umbrella Canopy */}
        <path
          d="M -160 0 Q 0 -130 160 0 Q 120 -15 80 0 Q 40 -15 0 0 Q -40 -15 -80 0 Q -120 -15 -160 0 Z"
          fill="#FACC15"
          stroke="#EAB308"
          strokeWidth={4}
        />
        {/* Canopy highlights */}
        <path d="M -110 -20 Q 0 -115 110 -20" fill="none" stroke="#FEF08A" strokeWidth={3} opacity={0.7} />
        {/* Umbrella Handle */}
        <line x1={0} y1={-130} x2={0} y2={110} stroke="#78350F" strokeWidth={6} strokeLinecap="round" />
        <path d="M 0 110 Q 0 135 -20 135" fill="none" stroke="#78350F" strokeWidth={6} strokeLinecap="round" />
      </g>

      {/* Emotional Floating Title */}
      <g transform="translate(960 110)">
        <rect x={-460} y={-32} width={920} height={64} rx={18} fill="#0F172A" opacity={0.92} stroke="#FACC15" strokeWidth={2.5} />
        <text x={0} y={8} textAnchor="middle" fill="#FEF08A" fontSize="22" fontWeight="800" fontFamily="Montserrat, sans-serif">
          GETTING HER OWN SHOULDER SOAKED... JUST TO KEEP YOU DRY. 💛☔
        </text>
      </g>

      {/* Gradient Defs for light cone */}
      <defs>
        <linearGradient id="yellow-cone-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FACC15" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#FACC15" stopOpacity="0.0" />
        </linearGradient>
      </defs>
    </g>
  );
};

// ========================================================
// 5. CHAPTER 5: DEPTH OVER NUMBERS & THE CHOICE (1055 frames)
// ========================================================
export const Chapter5: React.FC<{ f: number }> = ({ f }) => {
  // Comment Box pop in (frame 250+)
  const commentScale = spring({ frame: Math.max(0, f - 250), fps: 30, config: { damping: 12, stiffness: 160 } });

  // Subscribe Button click (frame 650+)
  const isClicked = f >= 650;
  const btnScale = spring({ frame: Math.max(0, f - 650), fps: 30, config: { damping: 10, stiffness: 190 } });

  const pipPose: Pose = {
    x: 820,
    y: HIPS_Y,
    scale: 0.95,
    facing: 1,
    tilt: 0,
    spin: 0,
    headTilt: 4,
    armL: { a: 15, b: 15 },
    armR: { a: 30, b: 40 }, // gesturing to comment/subscribe
    legL: { a: 5, b: 0 },
    legR: { a: -5, b: 0 },
    expr: 'happy',
    blink: Math.sin(f * 0.1) > 0.94 ? 1 : 0,
    look: 0.7,
    glasses: 0,
    yaw: 0.1,
    squash: 0,
    handL: 'open',
    handR: 'point',
    sway: 0,
  };

  const girlPose: Pose = {
    x: 980,
    y: HIPS_Y,
    scale: 0.92,
    facing: -1,
    tilt: 0,
    spin: 0,
    headTilt: -4,
    armL: { a: -35, b: -25 }, // holding umbrella
    armR: { a: 15, b: 10 },
    legL: { a: 5, b: 0 },
    legR: { a: -5, b: 0 },
    expr: 'happy',
    blink: Math.sin(f * 0.12) > 0.94 ? 1 : 0,
    look: -0.6,
    glasses: 0,
    yaw: -0.15,
    squash: 0,
    handL: 'open',
    handR: 'open',
    sway: 0,
  };

  return (
    <g>
      {/* Background with warm lamp */}
      <image href={staticFile('one-thousand-or-one/bg_umbrella_warmth.jpg')} x={0} y={0} width={1920} height={1080} preserveAspectRatio="xMidYMid slice" />
      <rect x={0} y={0} width={1920} height={1080} fill="#030712" opacity={0.35} />

      {/* Puddles & Rain */}
      <Puddles f={f} />
      <RainOverlay f={f} intensity={60} />

      {/* Characters grounded together */}
      <ellipse cx={820} cy={GROUND_Y} rx={60} ry={14} fill="#000" opacity={0.5} />
      <Hero pose={pipPose} look={LOOKS.pipHood} shadow={1.0} />

      <ellipse cx={980} cy={GROUND_Y} rx={55} ry={13} fill="#000" opacity={0.5} />
      <Hero pose={girlPose} look={GIRL_LOOK} shadow={1.0} />

      {/* Yellow Umbrella over both */}
      <g transform={`translate(920 ${HIPS_Y - 145}) rotate(-8)`}>
        <polygon points="-190,0 190,0 290,520 -290,520" fill="url(#yellow-cone-grad2)" opacity={0.25} />
        <path
          d="M -170 0 Q 0 -135 170 0 Q 125 -15 85 0 Q 45 -15 0 0 Q -45 -15 -85 0 Q -125 -15 -170 0 Z"
          fill="#FACC15"
          stroke="#EAB308"
          strokeWidth={4}
        />
        <line x1={0} y1={-135} x2={0} y2={120} stroke="#78350F" strokeWidth={6} strokeLinecap="round" />
        <path d="M 0 120 Q 0 145 -20 145" fill="none" stroke="#78350F" strokeWidth={6} strokeLinecap="round" />
      </g>

      {/* Philosophical Wisdom Card */}
      <g transform="translate(960 110)">
        <rect x={-520} y={-38} width={1040} height={76} rx={22} fill="#0F172A" opacity={0.94} stroke="#FACC15" strokeWidth={3} />
        <text x={0} y={-2} textAnchor="middle" fill="#FEF08A" fontSize="22" fontWeight="900" fontFamily="Montserrat, sans-serif">
          "A THOUSAND SHALLOW PUDDLES NEVER QUENCH A THIRSTY SOUL."
        </text>
        <text x={0} y={26} textAnchor="middle" fill="#38BDF8" fontSize="16" fontWeight="700" fontFamily="Plus Jakarta Sans, sans-serif">
          ONLY ONE DEEP WELL GIVES LIFE.
        </text>
      </g>

      {/* Floating Interactive Comment Challenge Box */}
      {f > 250 && (
        <g transform={`translate(1420 520) scale(${commentScale})`}>
          <rect x={-260} y={-140} width={520} height={280} rx={22} fill="#0F172A" opacity={0.96} stroke="#38BDF8" strokeWidth={3} />
          {/* Header */}
          <text x={0} y={-85} textAnchor="middle" fill="#FFFFFF" fontSize="24" fontWeight="900" fontFamily="Montserrat, sans-serif">
            💬 WHAT WOULD YOU CHOOSE?
          </text>
          {/* Choices */}
          <rect x={-220} y={-50} width={440} height={50} rx={12} fill="#1E293B" stroke="#EC4899" strokeWidth={2} />
          <text x={0} y={-18} textAnchor="middle" fill="#F43F5E" fontSize="18" fontWeight="800">
            A) 1,000 Temporary Admirers
          </text>

          <rect x={-220} y={15} width={440} height={50} rx={12} fill="#1E293B" stroke="#FACC15" strokeWidth={2} />
          <text x={0} y={47} textAnchor="middle" fill="#FEF08A" fontSize="18" fontWeight="800">
            B) 1 Loyal Person in the Rain
          </text>

          <text x={0} y={105} textAnchor="middle" fill="#94A3B8" fontSize="14" fontWeight="600">
            Type 'STAY' below if you have your '1' 💛
          </text>
        </g>
      )}

      {/* Subscribe Button & Bell in Bottom Center */}
      <g transform={`translate(960 740) scale(${isClicked ? 0.95 + btnScale * 0.05 : 1})`}>
        <rect
          x={-180}
          y={-32}
          width={360}
          height={64}
          rx={32}
          fill={isClicked ? '#1E293B' : '#EF4444'}
          stroke={isClicked ? '#38BDF8' : '#FCA5A5'}
          strokeWidth={3}
        />
        <text x={-20} y={10} textAnchor="middle" fill="#FFFFFF" fontSize="22" fontWeight="900" fontFamily="Montserrat, sans-serif">
          {isClicked ? 'SUBSCRIBED!' : 'SUBSCRIBE FOR MORE'}
        </text>
        {/* Golden Bell */}
        <circle cx={125} cy={0} r={18} fill="#F59E0B" />
        <path d="M 117 6 Q 114 10 119 10 L 131 10 Q 136 10 133 6 L 130 -4 Q 128 -9 125 -9 Q 122 -9 120 -4 Z" fill="#FFFFFF" />
      </g>

      <defs>
        <linearGradient id="yellow-cone-grad2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FACC15" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#FACC15" stopOpacity="0.0" />
        </linearGradient>
      </defs>
    </g>
  );
};

// ========================================================
// 6. SHORT FILM VERTICAL / HIGHLIGHT VERSION (1553 frames)
// ========================================================
export const ThousandShort: React.FC<{ f: number }> = ({ f }) => {
  // 1553 frames (~51.8s):
  // 0 - 320: Chapter 1 The Dilemma
  // 320 - 640: Chapter 2 The Neon Illusion
  // 640 - 960: Chapter 3 The Storm Hits
  // 960 - 1280: Chapter 4 The Yellow Umbrella
  // 1280 - 1553: Chapter 5 The Choice & Subscribe
  if (f < 320) {
    return <Chapter1 f={f * 2.8} />;
  } else if (f < 640) {
    return <Chapter2 f={(f - 320) * 2.8} />;
  } else if (f < 960) {
    return <Chapter3 f={(f - 640) * 3.3} />;
  } else if (f < 1280) {
    return <Chapter4 f={(f - 960) * 2.8} />;
  } else {
    return <Chapter5 f={(f - 1280) * 3.8} />;
  }
};

