import React from 'react';
import { interpolate, spring, staticFile } from 'remotion';
import { Hero, LOOKS, basePose, Pose, Expr } from '../../engine';

const HIPS_Y = 700;

// =========================================================================
// PIP V2 DYNAMIC LIFE RIG
// =========================================================================
export const makePipPose = (frame: number, base: Partial<Pose> = {}): Pose => {
  // 1. Natural Breathing Bob
  const breathY = Math.sin(frame * 0.12) * 3;
  
  // 2. Procedural Eyelid Blink cycle (blinks every 95 frames for 5 frames)
  const blinkCycle = frame % 95;
  const naturalBlink = blinkCycle >= 90 && blinkCycle <= 94 ? 1 : 0;
  
  // 3. Hoodie drawstrings secondary motion sway
  const swayVal = Math.sin(frame * 0.15) * 4;
  
  // 4. Subtle head tilt micro-motion
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

// Common expressive arm poses
export const POSE_EXPLAIN = { armL: { a: 45, b: 35 }, armR: { a: 15, b: -10 } };
export const POSE_CONFUSED = { armL: { a: 15, b: -10 }, armR: { a: 135, b: 85 }, headTilt: 10 };
export const POSE_SHOCKED = { armL: { a: 125, b: 35 }, armR: { a: 125, b: 35 }, squash: -0.12 };
export const POSE_POCKETS = { armL: { a: 18, b: -25 }, armR: { a: 18, b: -25 } };
export const POSE_REACH = { armL: { a: 75, b: 15 }, armR: { a: 15, b: -10 } };

// =========================================================================
// FLOATING HOLOGRAPHIC COUNTDOWN TIMER
// =========================================================================
export const HoloTimer: React.FC<{
  x: number;
  y: number;
  digits: string;
  label?: string;
  critical?: boolean;
  frame?: number;
  scale?: number;
}> = ({ x, y, digits, label = 'LIFESPAN', critical = false, frame = 0, scale = 1 }) => {
  const f = frame ?? 0;
  const pulse = Math.sin(f * (critical ? 0.35 : 0.12)) * 0.15 + 0.85;
  const primaryColor = critical ? '#EF4444' : '#FFAA55';
  const bgColor = critical ? 'rgba(30, 10, 15, 0.92)' : 'rgba(15, 23, 42, 0.92)';

  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      {/* Neon Glow Aura */}
      <ellipse cx={0} cy={0} rx={140} ry={40} fill={primaryColor} opacity={critical ? 0.35 * pulse : 0.2} />
      
      {/* Connecting Stem from Head to Timer */}
      <line x1={0} y1={25} x2={0} y2={65} stroke={primaryColor} strokeWidth={2} strokeDasharray="4 3" opacity={0.8} />
      <circle cx={0} cy={65} r={3} fill={primaryColor} />

      {/* Main Container HUD */}
      <rect
        x={-120}
        y={-28}
        width={240}
        height={54}
        rx={12}
        fill={bgColor}
        stroke={primaryColor}
        strokeWidth={critical ? 3 : 2}
      />

      {/* Countdown Digits */}
      <text
        x={0}
        y={6}
        fill={primaryColor}
        fontSize={22}
        fontWeight="900"
        fontFamily="Courier, monospace, sans-serif"
        textAnchor="middle"
        letterSpacing="2px"
      >
        {digits}
      </text>

      {/* Sub Label */}
      <text
        x={0}
        y={20}
        fill={critical ? '#FCA5A5' : '#FED7AA'}
        fontSize={10}
        fontWeight="bold"
        fontFamily="system-ui, sans-serif"
        textAnchor="middle"
        letterSpacing="1px"
      >
        {label}
      </text>
    </g>
  );
};

// =========================================================================
// FOREGROUND FLOATING CYBER DUST PARTICLES
// =========================================================================
export const CyberParticles: React.FC<{ frame: number; count?: number; color?: string }> = ({
  frame,
  count = 16,
  color = '#FFAA55',
}) => {
  const particles = Array.from({ length: count }, (_, i) => {
    const seed = i * 137.5;
    const x = (seed * 19) % 1920;
    const baseY = (seed * 31) % 1080;
    const speed = 0.8 + ((seed % 7) / 7) * 1.5;
    const y = (baseY - frame * speed + 1080 * 10) % 1080;
    const r = 1.5 + ((seed % 3) / 3) * 2.5;
    const opacity = (Math.sin(frame * 0.05 + seed) * 0.3 + 0.5) * 0.6;
    return <circle key={i} cx={x} cy={y} r={r} fill={color} opacity={opacity} filter="blur(1px)" />;
  });

  return <g>{particles}</g>;
};

// =========================================================================
// 1. CHAPTER 1: THE AWAKENING (760 frames)
// =========================================================================
export const LifespanCh1: React.FC<{ f?: number; frame?: number }> = ({ f, frame }) => {
  const currentF = f ?? frame ?? 0;
  // Slow cinematic camera push-in
  const zoom = interpolate(currentF, [0, 760], [1.0, 1.05], { extrapolateRight: 'clamp' });

  // Phase transitions
  const isShocked = currentF >= 320;
  const isTruckDanger = currentF >= 480;

  // Countdown timer for stranger: 12 seconds ticking down
  const remainingSeconds = Math.max(0, 12 - (currentF / 30) * 0.8);
  const strangerTimer = `00:00:${remainingSeconds < 10 ? '0' : ''}${Math.floor(remainingSeconds)}`;

  const pipPose = makePipPose(currentF, {
    x: 520,
    y: HIPS_Y,
    scale: 1.15,
    facing: 1,
    expr: isShocked ? 'shock' : 'neutral',
    ...(isShocked ? POSE_SHOCKED : POSE_EXPLAIN),
  });

  return (
    <g transform={`scale(${zoom}) translate(${-(zoom - 1) * 960} ${-(zoom - 1) * 540})`}>
      {/* Background: City Street */}
      <image
        href={staticFile('lifespan/bg_city_street.jpg')}
        width={1920}
        height={1080}
        preserveAspectRatio="xMidYMid slice"
        opacity={0.92}
      />
      <rect width={1920} height={1080} fill="#050814" opacity={0.35} />

      {/* Floating HUD Badge */}
      <g transform="translate(960, 110)">
        <rect x={-260} y={-35} width={520} height={70} rx={16} fill="rgba(15, 23, 42, 0.95)" stroke="#FFAA55" strokeWidth={2} />
        <text x={0} y={0} fill="#FFAA55" fontSize={22} fontWeight="900" fontFamily="system-ui, sans-serif" textAnchor="middle" letterSpacing="2px">
          TUESDAY 8:42 AM
        </text>
        <text x={0} y={24} fill="#FDE047" fontSize={16} fontWeight="bold" fontFamily="system-ui, sans-serif" textAnchor="middle">
          THE COSMIC TIMERS APPEAR
        </text>
      </g>

      {/* Pedestrian 1 (Barista / Normal Person) */}
      <g transform="translate(1380, 680) scale(0.95)">
        <ellipse cx={0} cy={-160} rx={45} ry={55} fill="#1C1A24" />
        <path d="M -35 -105 L 35 -105 L 45 100 L -45 100 Z" fill="#3B82F6" />
        <HoloTimer x={0} y={-240} digits="48:06:14" label="48 YEARS" frame={currentF} />
      </g>

      {/* Pedestrian 2 (The Stranger in Danger) */}
      <g transform="translate(1020, 690) scale(1.0)">
        <ellipse cx={0} cy={-160} rx={48} ry={58} fill="#1C1A24" />
        <path d="M -40 -105 L 40 -105 L 50 110 L -50 110 Z" fill="#475569" />
        <HoloTimer x={0} y={-250} digits={strangerTimer} label="CRITICAL DANGER" critical={true} frame={currentF} />
      </g>

      {/* Danger Red Warning Flash when truck nears */}
      {isTruckDanger && (
        <rect width={1920} height={1080} fill="#EF4444" opacity={Math.sin(currentF * 0.4) * 0.12 + 0.12} />
      )}

      {/* Pip Stickman in Mustard Hoodie */}
      <Hero pose={pipPose} look={LOOKS.pip} />

      {/* Foreground Drifting Dust Particles */}
      <CyberParticles frame={currentF} count={18} color="#FFAA55" />
    </g>
  );
};

// =========================================================================
// 2. CHAPTER 2: THE GUARDIAN ANGEL (706 frames)
// =========================================================================
export const LifespanCh2: React.FC<{ f?: number; frame?: number }> = ({ f, frame }) => {
  const currentF = f ?? frame ?? 0;
  const zoom = interpolate(currentF, [0, 706], [1.0, 1.05], { extrapolateRight: 'clamp' });

  const hasIntervened = currentF >= 300;
  const savedCount = Math.min(24, Math.floor(interpolate(currentF, [100, 600], [1, 24])));

  const pipPose = makePipPose(currentF, {
    x: 820,
    y: HIPS_Y,
    scale: 1.18,
    facing: 1,
    expr: hasIntervened ? 'smug' : 'worried',
    ...(hasIntervened ? POSE_EXPLAIN : POSE_REACH),
  });

  return (
    <g transform={`scale(${zoom}) translate(${-(zoom - 1) * 960} ${-(zoom - 1) * 540})`}>
      {/* Background: Subway Platform */}
      <image
        href={staticFile('lifespan/bg_subway_platform.jpg')}
        width={1920}
        height={1080}
        preserveAspectRatio="xMidYMid slice"
        opacity={0.92}
      />
      <rect width={1920} height={1080} fill="#050814" opacity={0.35} />

      {/* Stats Counter HUD */}
      <g transform="translate(960, 130)">
        <rect x={-280} y={-40} width={560} height={80} rx={18} fill="rgba(15, 23, 42, 0.95)" stroke="#10B981" strokeWidth={3} />
        <text x={0} y={-5} fill="#10B981" fontSize={26} fontWeight="900" fontFamily="system-ui, sans-serif" textAnchor="middle" letterSpacing="2px">
          GUARDIAN INTERVENTIONS: {savedCount} LIVES
        </text>
        <text x={0} y={26} fill="#FDE047" fontSize={16} fontWeight="bold" fontFamily="system-ui, sans-serif" textAnchor="middle">
          FATE SUCCESSFULLY REWRITTEN
        </text>
      </g>

      {/* Saved Citizen whose timer resets */}
      <g transform="translate(1320, 700) scale(1.05)">
        <ellipse cx={0} cy={-160} rx={48} ry={58} fill="#1C1A24" />
        <path d="M -40 -105 L 40 -105 L 50 110 L -50 110 Z" fill="#0284C7" />
        <HoloTimer
          x={0}
          y={-250}
          digits={hasIntervened ? '54:11:02' : '00:00:03'}
          label={hasIntervened ? 'FATE EXTENDED (+54 YRS)' : 'FALLING ON TRACK'}
          critical={!hasIntervened}
          frame={currentF}
        />
      </g>

      {/* Golden halo of light when saved */}
      {hasIntervened && (
        <circle cx={820} cy={520} r={280} fill="none" stroke="#FDE047" strokeWidth={2} opacity={Math.sin(currentF * 0.2) * 0.2 + 0.3} />
      )}

      {/* Pip Stickman */}
      <Hero pose={pipPose} look={LOOKS.pip} />

      <CyberParticles frame={currentF} count={16} color="#10B981" />
    </g>
  );
};

// =========================================================================
// 3. CHAPTER 3: THE MIRROR DISCOVERY (721 frames)
// =========================================================================
export const LifespanCh3: React.FC<{ f?: number; frame?: number }> = ({ f, frame }) => {
  const currentF = f ?? frame ?? 0;
  const zoom = interpolate(currentF, [0, 721], [1.0, 1.06], { extrapolateRight: 'clamp' });

  // Clock countdown on Pip's head: 72 hours left!
  const isHorrified = currentF >= 220;
  const pipTimer = '03:00:00'; // 3 days

  const pipPose = makePipPose(currentF, {
    x: 960,
    y: HIPS_Y + 10,
    scale: 1.25,
    facing: 1,
    expr: isHorrified ? 'shock' : 'worried',
    ...(isHorrified ? POSE_SHOCKED : POSE_CONFUSED),
  });

  return (
    <g transform={`scale(${zoom}) translate(${-(zoom - 1) * 960} ${-(zoom - 1) * 540})`}>
      {/* Background: Bathroom Mirror */}
      <image
        href={staticFile('lifespan/bg_bathroom_mirror.jpg')}
        width={1920}
        height={1080}
        preserveAspectRatio="xMidYMid slice"
        opacity={0.92}
      />
      <rect width={1920} height={1080} fill="#050814" opacity={0.35} />

      {/* Red Glitch Warning HUD */}
      <g transform="translate(960, 120)">
        <rect x={-300} y={-40} width={600} height={80} rx={18} fill="rgba(30, 10, 15, 0.95)" stroke="#EF4444" strokeWidth={3} />
        <text x={0} y={-5} fill="#EF4444" fontSize={26} fontWeight="900" fontFamily="system-ui, sans-serif" textAnchor="middle" letterSpacing="2px">
          COSMIC BALANCE VIOLATION
        </text>
        <text x={0} y={26} fill="#FCA5A5" fontSize={16} fontWeight="bold" fontFamily="system-ui, sans-serif" textAnchor="middle">
          TIME SUBTRACTED DIRECTLY FROM YOU
        </text>
      </g>

      {/* Pip Stickman in front of mirror */}
      <Hero pose={pipPose} look={LOOKS.pip} />

      {/* Crimson Countdown Timer FLOATING ABOVE PIP'S HEAD */}
      <HoloTimer
        x={960}
        y={420}
        digits={pipTimer}
        label="YOUR REMAINING LIFESPAN: 3 DAYS"
        critical={true}
        frame={currentF}
        scale={1.2}
      />

      {/* Red ambient breathing pulse */}
      <rect width={1920} height={1080} fill="#EF4444" opacity={Math.sin(currentF * 0.15) * 0.08 + 0.04} />

      <CyberParticles frame={currentF} count={20} color="#EF4444" />
    </g>
  );
};

// =========================================================================
// 4. CHAPTER 4: THE LIFESPAN BLACK MARKET (619 frames)
// =========================================================================
export const LifespanCh4: React.FC<{ f?: number; frame?: number }> = ({ f, frame }) => {
  const currentF = f ?? frame ?? 0;
  const zoom = interpolate(currentF, [0, 619], [1.0, 1.05], { extrapolateRight: 'clamp' });

  const pipPose = makePipPose(currentF, {
    x: 520,
    y: HIPS_Y,
    scale: 1.15,
    facing: 1,
    expr: 'worried',
    ...POSE_CONFUSED,
  });

  return (
    <g transform={`scale(${zoom}) translate(${-(zoom - 1) * 960} ${-(zoom - 1) * 540})`}>
      {/* Background: Park Hospital / Clinic */}
      <image
        href={staticFile('lifespan/bg_park_hospital.jpg')}
        width={1920}
        height={1080}
        preserveAspectRatio="xMidYMid slice"
        opacity={0.92}
      />
      <rect width={1920} height={1080} fill="#050814" opacity={0.4} />

      {/* Underground Trade HUD */}
      <g transform="translate(960, 120)">
        <rect x={-320} y={-40} width={640} height={80} rx={18} fill="rgba(15, 23, 42, 0.95)" stroke="#F59E0B" strokeWidth={3} />
        <text x={0} y={-5} fill="#F59E0B" fontSize={24} fontWeight="900" fontFamily="system-ui, sans-serif" textAnchor="middle" letterSpacing="2px">
          UNDERGROUND LIFESPAN EXCHANGE
        </text>
        <text x={0} y={26} fill="#FDE047" fontSize={16} fontWeight="bold" fontFamily="system-ui, sans-serif" textAnchor="middle">
          RATE: $10,000,000 PER YEAR OF LIFE
        </text>
      </g>

      {/* Billionaire in wheelchair / bed */}
      <g transform="translate(1360, 680) scale(1.0)">
        <ellipse cx={0} cy={-160} rx={50} ry={60} fill="#1C1A24" />
        <path d="M -42 -105 L 42 -105 L 52 110 L -52 110 Z" fill="#1E293B" />
        <HoloTimer x={0} y={-250} digits="00:05:42" label="BILLIONAIRE: 5 HOURS LEFT" critical={true} frame={currentF} />
      </g>

      {/* Pip Stickman in Mustard Hoodie */}
      <Hero pose={pipPose} look={LOOKS.pip} />

      <CyberParticles frame={currentF} count={16} color="#F59E0B" />
    </g>
  );
};

// =========================================================================
// 5. CHAPTER 5: THE FINAL DILEMMA (OPTION A VS OPTION B) (857 frames)
// =========================================================================
export const LifespanCh5: React.FC<{ f?: number; frame?: number }> = ({ f, frame }) => {
  const currentF = f ?? frame ?? 0;
  const zoom = interpolate(currentF, [0, 857], [1.0, 1.04], { extrapolateRight: 'clamp' });

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
        href={staticFile('lifespan/bg_warm_room.jpg')}
        width={1920}
        height={1080}
        preserveAspectRatio="xMidYMid slice"
        opacity={0.9}
      />
      <rect width={1920} height={1080} fill="#050814" opacity={0.65} />

      {/* Dilemma Title */}
      <g transform="translate(960, 120)">
        <rect x={-380} y={-50} width={760} height={100} rx={22} fill="rgba(15, 23, 42, 0.95)" stroke="#FFAA55" strokeWidth={3} />
        <text x={0} y={-8} fill="#FFAA55" fontSize={30} fontWeight="900" fontFamily="system-ui, sans-serif" textAnchor="middle" letterSpacing="2px">
          WHAT WOULD YOU CHOOSE?
        </text>
        <text x={0} y={30} fill="#FDE047" fontSize={18} fontWeight="bold" fontFamily="system-ui, sans-serif" textAnchor="middle">
          VOTE OPTION A OR OPTION B IN THE COMMENTS
        </text>
      </g>

      {/* Choice Cards Container */}
      <g opacity={cardProgress} transform={`translate(0, ${(1 - cardProgress) * 40})`}>
        {/* OPTION A: Know Exact Death Date */}
        <g transform={`translate(480, 420) scale(${pulseA})`}>
          <rect x={-280} y={-160} width={560} height={320} rx={24} fill="rgba(15, 23, 42, 0.95)" stroke="#38BDF8" strokeWidth={4} />
          <rect x={-260} y={-140} width={120} height={44} rx={10} fill="#38BDF8" />
          <text x={-200} y={-112} fill="#0B132B" fontSize={22} fontWeight="900" fontFamily="system-ui, sans-serif" textAnchor="middle">
            OPTION A
          </text>
          <text x={0} y={-40} fill="#FFFFFF" fontSize={26} fontWeight="bold" fontFamily="system-ui, sans-serif" textAnchor="middle">
            KNOW YOUR EXACT DEATH DATE
          </text>
          <text x={0} y={15} fill="#94A3B8" fontSize={18} fontFamily="system-ui, sans-serif" textAnchor="middle">
            Live without fear until the final second.
          </text>
          <text x={0} y={45} fill="#94A3B8" fontSize={18} fontFamily="system-ui, sans-serif" textAnchor="middle">
            Zero doubt, absolute certainty.
          </text>
          {/* Badge */}
          <rect x={-140} y={80} width={280} height={42} rx={12} fill="rgba(56, 189, 248, 0.2)" stroke="#38BDF8" strokeWidth={1} />
          <text x={0} y={107} fill="#38BDF8" fontSize={16} fontWeight="bold" fontFamily="system-ui, sans-serif" textAnchor="middle">
            ⏳ NO FEAR OF UNEXPECTED DEATH
          </text>
        </g>

        {/* OPTION B: Live In Complete Mystery */}
        <g transform={`translate(1440, 420) scale(${pulseB})`}>
          <rect x={-280} y={-160} width={560} height={320} rx={24} fill="rgba(15, 23, 42, 0.95)" stroke="#F59E0B" strokeWidth={4} />
          <rect x={-260} y={-140} width={120} height={44} rx={10} fill="#F59E0B" />
          <text x={-200} y={-112} fill="#0B132B" fontSize={22} fontWeight="900" fontFamily="system-ui, sans-serif" textAnchor="middle">
            OPTION B
          </text>
          <text x={0} y={-40} fill="#FFFFFF" fontSize={26} fontWeight="bold" fontFamily="system-ui, sans-serif" textAnchor="middle">
            LIVE IN COMPLETE UNCERTAINTY
          </text>
          <text x={0} y={15} fill="#94A3B8" fontSize={18} fontFamily="system-ui, sans-serif" textAnchor="middle">
            Every day is a mystery and a gift.
          </text>
          <text x={0} y={45} fill="#94A3B8" fontSize={18} fontFamily="system-ui, sans-serif" textAnchor="middle">
            No morbid ticking clock above your head.
          </text>
          {/* Badge */}
          <rect x={-140} y={80} width={280} height={42} rx={12} fill="rgba(245, 158, 11, 0.2)" stroke="#F59E0B" strokeWidth={1} />
          <text x={0} y={107} fill="#F59E0B" fontSize={16} fontWeight="bold" fontFamily="system-ui, sans-serif" textAnchor="middle">
            ✨ PURE FREEDOM & HOPE
          </text>
        </g>
      </g>

      {/* Pip Stickman in Mustard Hoodie at bottom */}
      <Hero pose={pipPose} look={LOOKS.pip} />

      <CyberParticles frame={currentF} count={16} color="#FFAA55" />
    </g>
  );
};

// =========================================================================
// 6. SHORT (9:16 VERTICAL - 935 frames)
// =========================================================================
export const LifespanShort: React.FC<{ f?: number; frame?: number }> = ({ f, frame }) => {
  const currentF = f ?? frame ?? 0;
  const isDanger = currentF <= 380;
  const isMirror = currentF > 380 && currentF <= 640;
  const isVote = currentF > 640;

  const remainingSeconds = Math.max(0, 6 - (currentF / 30) * 0.9);
  const strangerTimer = `00:00:${remainingSeconds < 10 ? '0' : ''}${Math.floor(remainingSeconds)}`;

  const pipPose = makePipPose(currentF, {
    x: 540,
    y: 1280,
    scale: 1.45,
    facing: 1,
    expr: isMirror ? 'shock' : (isDanger ? 'worried' : 'smug'),
    ...(isMirror ? POSE_SHOCKED : (isDanger ? POSE_REACH : POSE_EXPLAIN)),
  });

  return (
    <g>
      {/* Background based on phase */}
      <image
        href={staticFile(isMirror ? 'lifespan/bg_bathroom_mirror.jpg' : 'lifespan/bg_city_street.jpg')}
        width={1080}
        height={1920}
        preserveAspectRatio="xMidYMid slice"
        opacity={0.9}
      />
      <rect width={1080} height={1920} fill="#050814" opacity={0.45} />

      {/* Top Header Card */}
      <g transform="translate(540, 220)">
        <rect x={-460} y={-80} width={920} height={160} rx={24} fill="rgba(15, 23, 42, 0.95)" stroke="#EF4444" strokeWidth={4} />
        <text x={0} y={-15} fill="#EF4444" fontSize={42} fontWeight="900" fontFamily="system-ui, sans-serif" textAnchor="middle">
          WHAT IF YOU SAW LIFESPANS?
        </text>
        <text x={0} y={45} fill="#FDE047" fontSize={26} fontWeight="bold" fontFamily="system-ui, sans-serif" textAnchor="middle">
          {isVote ? 'CHOOSE OPTION A OR B' : (isMirror ? 'YOUR CLOCK: 2 DAYS LEFT' : '6 SECONDS UNTIL TRUCK CRASH')}
        </text>
      </g>

      {/* Floating Holographic Timer in center */}
      {!isVote && (
        <HoloTimer
          x={540}
          y={620}
          digits={isMirror ? '02:00:00' : strangerTimer}
          label={isMirror ? 'PIP: 2 DAYS REMAINING' : 'PEDESTRIAN IN DANGER'}
          critical={true}
          frame={currentF}
          scale={1.5}
        />
      )}

      {/* Voting Dilemma Cards for Shorts */}
      {isVote && (
        <g transform="translate(540, 680)">
          {/* Card A */}
          <rect x={-420} y={-160} width={840} height={130} rx={20} fill="rgba(15, 23, 42, 0.95)" stroke="#38BDF8" strokeWidth={4} />
          <text x={-320} y={-85} fill="#38BDF8" fontSize={30} fontWeight="900" fontFamily="system-ui, sans-serif">
            OPTION A:
          </text>
          <text x={-140} y={-85} fill="#FFFFFF" fontSize={24} fontWeight="bold" fontFamily="system-ui, sans-serif">
            Know Exact Death Date ⏳
          </text>

          {/* Card B */}
          <rect x={-420} y={10} width={840} height={130} rx={20} fill="rgba(15, 23, 42, 0.95)" stroke="#F59E0B" strokeWidth={4} />
          <text x={-320} y={85} fill="#F59E0B" fontSize={30} fontWeight="900" fontFamily="system-ui, sans-serif">
            OPTION B:
          </text>
          <text x={-140} y={85} fill="#FFFFFF" fontSize={24} fontWeight="bold" fontFamily="system-ui, sans-serif">
            Live Completely Blind ✨
          </text>
        </g>
      )}

      {/* Pip Stickman in Mustard Hoodie */}
      <Hero pose={pipPose} look={LOOKS.pip} />

      <CyberParticles frame={currentF} count={16} color="#FFAA55" />
    </g>
  );
};

