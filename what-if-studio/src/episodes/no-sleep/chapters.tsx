import React from 'react';
import { interpolate, spring, staticFile } from 'remotion';
import { Hero, LOOKS, basePose, Pose, Expr } from '../../engine';

const HIPS_Y = 700;

// =========================================================================
// PIP V2 DYNAMIC LIFE RIG
// =========================================================================
export const makePipPose = (frame: number, base: Partial<Pose> = {}): Pose => {
  const breathY = Math.sin(frame * 0.12) * 3;
  const blinkCycle = frame % 95;
  const naturalBlink = blinkCycle >= 90 && blinkCycle <= 94 ? 1 : 0;
  const swayVal = Math.sin(frame * 0.15) * 4;
  const naturalHeadTilt = Math.sin(frame * 0.08) * 2;

  return {
    ...basePose,
    y: (base.y ?? HIPS_Y) + breathY,
    blink: base.blink !== undefined ? base.blink : naturalBlink,
    sway: (base.sway ?? 0) + swayVal,
    headTilt: (base.headTilt ?? 0) + naturalHeadTilt,
    ...base,
  };
};

export const POSE_EXPLAIN = { armL: { a: 45, b: 35 }, armR: { a: 15, b: -10 } };
export const POSE_CONFUSED = { armL: { a: 15, b: -10 }, armR: { a: 135, b: 85 }, headTilt: 10 };
export const POSE_SHOCKED = { armL: { a: 125, b: 35 }, armR: { a: 125, b: 35 }, squash: -0.12 };
export const POSE_PILL = { armL: { a: 35, b: 25 }, armR: { a: 80, b: 70 } };
export const POSE_POCKETS = { armL: { a: 18, b: -25 }, armR: { a: 18, b: -25 } };

// =========================================================================
// GLOWING BIOLUMINESCENT PILL COMPONENT (SOMNEX-9)
// =========================================================================
export const GlowingPill: React.FC<{ x: number; y: number; frame: number; scale?: number }> = ({
  x,
  y,
  frame,
  scale = 1,
}) => {
  const pulse = Math.sin(frame * 0.2) * 0.2 + 0.8;
  const floatY = Math.sin(frame * 0.1) * 6;

  return (
    <g transform={`translate(${x}, ${y + floatY}) scale(${scale})`}>
      {/* Cyan/Blue Aura */}
      <circle cx={0} cy={0} r={55} fill="#0284C7" opacity={0.35 * pulse} filter="blur(8px)" />
      <circle cx={0} cy={0} r={32} fill="#38BDF8" opacity={0.5 * pulse} />

      {/* Pill Body: Half Blue, Half White */}
      <g transform="rotate(-30)">
        <rect x={-28} y={-14} width={28} height={28} rx={14} fill="#0284C7" stroke="#38BDF8" strokeWidth={2} />
        <rect x={0} y={-14} width={28} height={28} rx={14} fill="#F8FAFC" stroke="#38BDF8" strokeWidth={2} />
        {/* Core glow dot */}
        <circle cx={0} cy={0} r={4} fill="#FFFFFF" opacity={pulse} />
      </g>
    </g>
  );
};

// =========================================================================
// NEON DIGITAL WALL CLOCK (03:47 AM)
// =========================================================================
export const WallClock: React.FC<{ x: number; y: number; frame: number; time?: string }> = ({
  x,
  y,
  frame,
  time = '03:47 AM',
}) => {
  const blinkColon = (frame % 30) < 15;
  const displayTime = blinkColon ? time : time.replace(':', ' ');

  return (
    <g transform={`translate(${x}, ${y})`}>
      <rect x={-140} y={-35} width={280} height={70} rx={14} fill="rgba(20, 8, 12, 0.95)" stroke="#EF4444" strokeWidth={3} />
      <text
        x={0}
        y={8}
        fill="#EF4444"
        fontSize={30}
        fontWeight="900"
        fontFamily="Courier, monospace, sans-serif"
        textAnchor="middle"
        letterSpacing="3px"
      >
        {displayTime}
      </text>
      <text
        x={0}
        y={24}
        fill="#FCA5A5"
        fontSize={10}
        fontWeight="bold"
        fontFamily="system-ui, sans-serif"
        textAnchor="middle"
        letterSpacing="1px"
      >
        AWAKE TIME: 365 DAYS
      </text>
    </g>
  );
};

// =========================================================================
// SHADOW STICKMAN HALLUCINATION CREATURE
// =========================================================================
export const ShadowStickman: React.FC<{ x: number; y: number; frame: number; opacity?: number }> = ({
  x,
  y,
  frame,
  opacity = 0.5,
}) => {
  const creepY = Math.sin(frame * 0.08) * 8;
  return (
    <g transform={`translate(${x}, ${y + creepY})`} opacity={opacity}>
      {/* Shadow aura */}
      <ellipse cx={0} cy={-160} rx={42} ry={52} fill="#000000" filter="blur(4px)" />
      {/* Glowing red slit eyes */}
      <ellipse cx={-12} cy={-160} rx={6} ry={2} fill="#EF4444" />
      <ellipse cx={12} cy={-160} rx={6} ry={2} fill="#EF4444" />
      {/* Torso & arms */}
      <line x1={0} y1={-110} x2={0} y2={40} stroke="#05050A" strokeWidth={16} strokeLinecap="round" />
      <line x1={0} y1={-80} x2={-45} y2={-20} stroke="#05050A" strokeWidth={12} strokeLinecap="round" />
      <line x1={0} y1={-80} x2={45} y2={-20} stroke="#05050A" strokeWidth={12} strokeLinecap="round" />
      <line x1={0} y1={40} x2={-25} y2={140} stroke="#05050A" strokeWidth={12} strokeLinecap="round" />
      <line x1={0} y1={40} x2={25} y2={140} stroke="#05050A" strokeWidth={12} strokeLinecap="round" />
    </g>
  );
};

// =========================================================================
// 1. CHAPTER 1: THE MIRACLE MOLECULE (916 frames)
// =========================================================================
export const NoSleepCh1: React.FC<{ f?: number; frame?: number }> = ({ f, frame }) => {
  const currentF = f ?? frame ?? 0;
  const zoom = interpolate(currentF, [0, 916], [1.0, 1.05], { extrapolateRight: 'clamp' });

  const isSwallowed = currentF >= 420;

  const pipPose = makePipPose(currentF, {
    x: 620,
    y: HIPS_Y,
    scale: 1.15,
    facing: 1,
    expr: isSwallowed ? 'smug' : 'neutral',
    ...(isSwallowed ? POSE_EXPLAIN : POSE_PILL),
  });

  // Doctor Stickman presenting the pill
  const doctorPose = makePipPose(currentF, {
    x: 1320,
    y: HIPS_Y,
    scale: 1.15,
    facing: -1,
    expr: 'happy',
    ...POSE_EXPLAIN,
  });

  return (
    <g transform={`scale(${zoom}) translate(${-(zoom - 1) * 960} ${-(zoom - 1) * 540})`}>
      {/* Background: Biotech Simulation Vault */}
      <image
        href={staticFile('no-sleep/bg_biotech_vault.jpg')}
        width={1920}
        height={1080}
        preserveAspectRatio="xMidYMid slice"
        opacity={0.92}
      />
      <rect width={1920} height={1080} fill="#050814" opacity={0.35} />

      {/* Header HUD */}
      <g transform="translate(960, 110)">
        <rect x={-280} y={-35} width={560} height={70} rx={16} fill="rgba(10, 20, 38, 0.95)" stroke="#38BDF8" strokeWidth={2} />
        <text x={0} y={0} fill="#38BDF8" fontSize={22} fontWeight="900" fontFamily="system-ui, sans-serif" textAnchor="middle" letterSpacing="2px">
          SOMNEX-9: MEDICAL BREAKTHROUGH
        </text>
        <text x={0} y={24} fill="#FDE047" fontSize={16} fontWeight="bold" fontFamily="system-ui, sans-serif" textAnchor="middle">
          PERMANENT SLEEP ELIMINATION
        </text>
      </g>

      {/* Floating Glowing Capsule between them before swallowed */}
      {!isSwallowed && <GlowingPill x={770} y={640} frame={currentF} scale={1.2} />}

      {/* Doctor Stickman in White Lab Coat */}
      <Hero pose={doctorPose} look={LOOKS.sis} />

      {/* Main Stickman: Pip */}
      <Hero pose={pipPose} look={LOOKS.pip} />
    </g>
  );
};

// =========================================================================
// 2. CHAPTER 2: THE 20-HOUR WORKDAY (841 frames)
// =========================================================================
export const NoSleepCh2: React.FC<{ f?: number; frame?: number }> = ({ f, frame }) => {
  const currentF = f ?? frame ?? 0;
  const zoom = interpolate(currentF, [0, 841], [1.0, 1.05], { extrapolateRight: 'clamp' });

  const shiftHours = Math.min(20, Math.floor(interpolate(currentF, [60, 750], [8, 20])));

  const pipPose = makePipPose(currentF, {
    x: 680,
    y: HIPS_Y,
    scale: 1.18,
    facing: 1,
    expr: 'tired',
    ...POSE_EXPLAIN,
  });

  // Boss Stickman in Suit enforcing contracts
  const bossPose = makePipPose(currentF, {
    x: 1340,
    y: HIPS_Y,
    scale: 1.2,
    facing: -1,
    expr: 'smug',
    ...POSE_POCKETS,
  });

  return (
    <g transform={`scale(${zoom}) translate(${-(zoom - 1) * 960} ${-(zoom - 1) * 540})`}>
      {/* Background: 24/7 Corporate Street */}
      <image
        href={staticFile('no-sleep/bg_city_street.jpg')}
        width={1920}
        height={1080}
        preserveAspectRatio="xMidYMid slice"
        opacity={0.9}
      />
      <rect width={1920} height={1080} fill="#050814" opacity={0.35} />

      {/* 20-Hour Shift HUD */}
      <g transform="translate(960, 120)">
        <rect x={-300} y={-40} width={600} height={80} rx={18} fill="rgba(30, 15, 20, 0.95)" stroke="#EF4444" strokeWidth={3} />
        <text x={0} y={-5} fill="#EF4444" fontSize={26} fontWeight="900" fontFamily="system-ui, sans-serif" textAnchor="middle" letterSpacing="2px">
          MANDATORY WORK SHIFT: {shiftHours} HOURS
        </text>
        <text x={0} y={26} fill="#FCA5A5" fontSize={16} fontWeight="bold" fontFamily="system-ui, sans-serif" textAnchor="middle">
          BEDROOMS DEMOLISHED • REST IS ILLEGAL
        </text>
      </g>

      {/* Stickman Boss */}
      <Hero pose={bossPose} look={LOOKS.suit} />

      {/* Pip Stickman in Mustard Hoodie */}
      <Hero pose={pipPose} look={LOOKS.pip} />

      {/* Wall Clock at 02:30 AM */}
      <WallClock x={960} y={320} frame={currentF} time="02:30 AM" />
    </g>
  );
};

// =========================================================================
// 3. CHAPTER 3: THE DAYTIME DREAM BLEED (844 frames)
// =========================================================================
export const NoSleepCh3: React.FC<{ f?: number; frame?: number }> = ({ f, frame }) => {
  const currentF = f ?? frame ?? 0;
  const zoom = interpolate(currentF, [0, 844], [1.0, 1.06], { extrapolateRight: 'clamp' });

  const isDistorted = currentF >= 180;
  const warpPulse = Math.sin(currentF * 0.15) * 6;

  const pipPose = makePipPose(currentF, {
    x: 960,
    y: HIPS_Y + 10,
    scale: 1.25,
    facing: 1,
    expr: 'shock',
    ...POSE_SHOCKED,
  });

  return (
    <g transform={`scale(${zoom}) translate(${-(zoom - 1) * 960 + warpPulse} ${-(zoom - 1) * 540})`}>
      {/* Background: Empty Bedroom Hallway */}
      <image
        href={staticFile('no-sleep/bg_empty_bedroom.jpg')}
        width={1920}
        height={1080}
        preserveAspectRatio="xMidYMid slice"
        opacity={0.92}
      />
      <rect width={1920} height={1080} fill="#050814" opacity={0.4} />

      {/* Warning HUD */}
      <g transform="translate(960, 120)">
        <rect x={-320} y={-40} width={640} height={80} rx={18} fill="rgba(30, 10, 20, 0.95)" stroke="#A855F7" strokeWidth={3} />
        <text x={0} y={-5} fill="#A855F7" fontSize={26} fontWeight="900" fontFamily="system-ui, sans-serif" textAnchor="middle" letterSpacing="2px">
          DAY 180: DAYTIME DREAM BLEED
        </text>
        <text x={0} y={26} fill="#E9D5FF" fontSize={16} fontWeight="bold" fontFamily="system-ui, sans-serif" textAnchor="middle">
          UN-DREAMT NIGHTMARES MANIFESTING
        </text>
      </g>

      {/* Shadow Hallucination Stickmen creeping from left and right */}
      {isDistorted && (
        <>
          <ShadowStickman x={420} y={HIPS_Y - 40} frame={currentF} opacity={0.65} />
          <ShadowStickman x={1520} y={HIPS_Y - 30} frame={currentF + 30} opacity={0.65} />
        </>
      )}

      {/* Pip Stickman in Mustard Hoodie */}
      <Hero pose={pipPose} look={LOOKS.pip} />

      {/* Red Wall Clock */}
      <WallClock x={960} y={320} frame={currentF} time="03:47 AM" />
    </g>
  );
};

// =========================================================================
// 4. CHAPTER 4: THE UNDERGROUND SLEEP DEN (778 frames)
// =========================================================================
export const NoSleepCh4: React.FC<{ f?: number; frame?: number }> = ({ f, frame }) => {
  const currentF = f ?? frame ?? 0;
  const zoom = interpolate(currentF, [0, 778], [1.0, 1.05], { extrapolateRight: 'clamp' });

  const pipPose = makePipPose(currentF, {
    x: 520,
    y: HIPS_Y,
    scale: 1.15,
    facing: 1,
    expr: 'worried',
    ...POSE_CONFUSED,
  });

  // Sleeping citizen stickman strapped into booth
  const sleeperPose = makePipPose(currentF, {
    x: 1360,
    y: HIPS_Y + 20,
    scale: 1.1,
    facing: -1,
    expr: 'tired',
    blink: 1, // Eyes closed sleeping!
    ...POSE_POCKETS,
  });

  return (
    <g transform={`scale(${zoom}) translate(${-(zoom - 1) * 960} ${-(zoom - 1) * 540})`}>
      {/* Background: Subway / Underground Lounge */}
      <image
        href={staticFile('no-sleep/bg_subway_platform.jpg')}
        width={1920}
        height={1080}
        preserveAspectRatio="xMidYMid slice"
        opacity={0.92}
      />
      <rect width={1920} height={1080} fill="#050814" opacity={0.4} />

      {/* Underground Speakeasy HUD */}
      <g transform="translate(960, 110)">
        <rect x={-320} y={-35} width={640} height={70} rx={16} fill="rgba(10, 20, 38, 0.95)" stroke="#F59E0B" strokeWidth={3} />
        <text x={0} y={0} fill="#F59E0B" fontSize={22} fontWeight="900" fontFamily="system-ui, sans-serif" textAnchor="middle" letterSpacing="2px">
          UNDERGROUND SLEEP SPEAKEASY
        </text>
        <text x={0} y={24} fill="#FDE047" fontSize={16} fontWeight="bold" fontFamily="system-ui, sans-serif" textAnchor="middle">
          COST: $5,000 FOR 2 HOURS OF ANESTHESIA
        </text>
      </g>

      {/* Sleeping Stickman with Sleep Gas Mask */}
      <g>
        <rect x={1260} y={540} width={200} height={320} rx={16} fill="#0F172A" stroke="#0284C7" strokeWidth={3} />
        <Hero pose={sleeperPose} look={LOOKS.mo} />
        {/* Cyan oxygen tube to face */}
        <path d="M 1360 580 Q 1420 540 1440 600" fill="none" stroke="#38BDF8" strokeWidth={4} strokeDasharray="6 4" />
      </g>

      {/* Pip Stickman in Mustard Hoodie */}
      <Hero pose={pipPose} look={LOOKS.pip} />
    </g>
  );
};

// =========================================================================
// 5. CHAPTER 5: THE FINAL DILEMMA (OPTION A VS OPTION B) (878 frames)
// =========================================================================
export const NoSleepCh5: React.FC<{ f?: number; frame?: number }> = ({ f, frame }) => {
  const currentF = f ?? frame ?? 0;
  const zoom = interpolate(currentF, [0, 878], [1.0, 1.04], { extrapolateRight: 'clamp' });

  const cardProgress = interpolate(currentF, [120, 240], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const pulseA = Math.sin(currentF * 0.15) * 0.05 + 1.0;
  const pulseB = Math.cos(currentF * 0.15) * 0.05 + 1.0;

  const pipPose = makePipPose(currentF, {
    x: 960,
    y: 820,
    scale: 0.95,
    facing: 1,
    expr: 'smug',
    ...POSE_EXPLAIN,
  });

  return (
    <g transform={`scale(${zoom}) translate(${-(zoom - 1) * 960} ${-(zoom - 1) * 540})`}>
      {/* Background: Warm Room */}
      <image
        href={staticFile('no-sleep/bg_warm_room.jpg')}
        width={1920}
        height={1080}
        preserveAspectRatio="xMidYMid slice"
        opacity={0.9}
      />
      <rect width={1920} height={1080} fill="#050814" opacity={0.65} />

      {/* Dilemma Title */}
      <g transform="translate(960, 120)">
        <rect x={-380} y={-50} width={760} height={100} rx={22} fill="rgba(10, 20, 38, 0.95)" stroke="#38BDF8" strokeWidth={3} />
        <text x={0} y={-8} fill="#38BDF8" fontSize={30} fontWeight="900" fontFamily="system-ui, sans-serif" textAnchor="middle" letterSpacing="2px">
          WHAT WOULD YOU CHOOSE?
        </text>
        <text x={0} y={30} fill="#FDE047" fontSize={18} fontWeight="bold" fontFamily="system-ui, sans-serif" textAnchor="middle">
          VOTE OPTION A OR OPTION B IN THE COMMENTS
        </text>
      </g>

      {/* Choice Cards Container */}
      <g opacity={cardProgress} transform={`translate(0, ${(1 - cardProgress) * 40})`}>
        {/* OPTION A: Take The Pill */}
        <g transform={`translate(480, 420) scale(${pulseA})`}>
          <rect x={-280} y={-160} width={560} height={320} rx={24} fill="rgba(10, 20, 38, 0.95)" stroke="#38BDF8" strokeWidth={4} />
          <rect x={-260} y={-140} width={120} height={44} rx={10} fill="#38BDF8" />
          <text x={-200} y={-112} fill="#0B132B" fontSize={22} fontWeight="900" fontFamily="system-ui, sans-serif" textAnchor="middle">
            OPTION A
          </text>
          <text x={0} y={-40} fill="#FFFFFF" fontSize={26} fontWeight="bold" fontFamily="system-ui, sans-serif" textAnchor="middle">
            TAKE THE SOMNEX PILL
          </text>
          <text x={0} y={15} fill="#94A3B8" fontSize={18} fontFamily="system-ui, sans-serif" textAnchor="middle">
            Gain 8 extra hours every day of your life.
          </text>
          <text x={0} y={45} fill="#94A3B8" fontSize={18} fontFamily="system-ui, sans-serif" textAnchor="middle">
            COST: Never sleep, rest, or dream again!
          </text>
          {/* Badge */}
          <rect x={-140} y={80} width={280} height={42} rx={12} fill="rgba(56, 189, 248, 0.2)" stroke="#38BDF8" strokeWidth={1} />
          <text x={0} y={107} fill="#38BDF8" fontSize={16} fontWeight="bold" fontFamily="system-ui, sans-serif" textAnchor="middle">
            💊 24/7 AWAKE SUPERPOWER
          </text>
        </g>

        {/* OPTION B: Keep Normal Sleep */}
        <g transform={`translate(1440, 420) scale(${pulseB})`}>
          <rect x={-280} y={-160} width={560} height={320} rx={24} fill="rgba(10, 20, 38, 0.95)" stroke="#F59E0B" strokeWidth={4} />
          <rect x={-260} y={-140} width={120} height={44} rx={10} fill="#F59E0B" />
          <text x={-200} y={-112} fill="#0B132B" fontSize={22} fontWeight="900" fontFamily="system-ui, sans-serif" textAnchor="middle">
            OPTION B
          </text>
          <text x={0} y={-40} fill="#FFFFFF" fontSize={26} fontWeight="bold" fontFamily="system-ui, sans-serif" textAnchor="middle">
            KEEP NORMAL SLEEP
          </text>
          <text x={0} y={15} fill="#94A3B8" fontSize={18} fontFamily="system-ui, sans-serif" textAnchor="middle">
            Sleep 8 hours, dream, and protect your mind.
          </text>
          <text x={0} y={45} fill="#94A3B8" fontSize={18} fontFamily="system-ui, sans-serif" textAnchor="middle">
            COST: Society runs 2x faster, you fall behind!
          </text>
          {/* Badge */}
          <rect x={-140} y={80} width={280} height={42} rx={12} fill="rgba(245, 158, 11, 0.2)" stroke="#F59E0B" strokeWidth={1} />
          <text x={0} y={107} fill="#F59E0B" fontSize={16} fontWeight="bold" fontFamily="system-ui, sans-serif" textAnchor="middle">
            💤 NATURAL DREAMS & SANITY
          </text>
        </g>
      </g>

      {/* Pip Stickman in Mustard Hoodie at bottom */}
      <Hero pose={pipPose} look={LOOKS.pip} />
    </g>
  );
};

// =========================================================================
// 6. SHORT (9:16 VERTICAL - 934 frames - 100% SEAMLESS LOOP!)
// =========================================================================
export const NoSleepShort: React.FC<{ f?: number; frame?: number }> = ({ f, frame }) => {
  const currentF = f ?? frame ?? 0;
  // Frame 0 matches Frame 933 perfectly for infinite loop!
  const isPill = currentF <= 320;
  const isWork = currentF > 320 && currentF <= 640;
  const isNightmare = currentF > 640;

  const pipPose = makePipPose(currentF, {
    x: 540,
    y: 1280,
    scale: 1.45,
    facing: 1,
    expr: isNightmare ? 'shock' : (isWork ? 'tired' : 'neutral'),
    ...(isNightmare ? POSE_SHOCKED : (isWork ? POSE_EXPLAIN : POSE_PILL)),
  });

  return (
    <g>
      {/* Background */}
      <image
        href={staticFile(isWork ? 'no-sleep/bg_city_street.jpg' : 'no-sleep/bg_empty_bedroom.jpg')}
        width={1080}
        height={1920}
        preserveAspectRatio="xMidYMid slice"
        opacity={0.9}
      />
      <rect width={1080} height={1920} fill="#050814" opacity={0.45} />

      {/* Top Header Card */}
      <g transform="translate(540, 220)">
        <rect x={-460} y={-80} width={920} height={160} rx={24} fill="rgba(10, 20, 38, 0.95)" stroke="#38BDF8" strokeWidth={4} />
        <text x={0} y={-15} fill="#38BDF8" fontSize={42} fontWeight="900" fontFamily="system-ui, sans-serif" textAnchor="middle">
          I HAVEN'T SLEPT IN 365 DAYS
        </text>
        <text x={0} y={45} fill="#FDE047" fontSize={26} fontWeight="bold" fontFamily="system-ui, sans-serif" textAnchor="middle">
          {isNightmare ? 'NIGHTMARES BLEEDING INTO DAYLIGHT' : (isWork ? 'MANDATORY 20-HOUR WORKDAYS' : 'THE SOMNEX PILL BANNED SLEEP')}
        </text>
      </g>

      {/* Giant Glowing Pill in Center */}
      <g transform="translate(540, 680) scale(1.6)">
        <GlowingPill x={0} y={0} frame={currentF} />
      </g>

      {/* Hallucination shadow creature during nightmare phase */}
      {isNightmare && (
        <ShadowStickman x={820} y={1140} frame={currentF} opacity={0.7} />
      )}

      {/* Pip Stickman in Mustard Hoodie */}
      <Hero pose={pipPose} look={LOOKS.pip} />
    </g>
  );
};

