import React from 'react';
import { interpolate, spring, staticFile } from 'remotion';
import { Hero, LOOKS, basePose, Pose, Expr, CastName } from '../../engine';

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
export const POSE_CLICK = { armL: { a: 30, b: 20 }, armR: { a: 75, b: 60 } };
export const POSE_POCKETS = { armL: { a: 18, b: -25 }, armR: { a: 18, b: -25 } };

// =========================================================================
// REWIND HUD TICKER COMPONENT
// =========================================================================
export const RewindHUD: React.FC<{
  x: number;
  y: number;
  active: boolean;
  frame: number;
  scale?: number;
}> = ({ x, y, active, frame, scale = 1 }) => {
  if (!active) return null;
  const pulse = Math.sin(frame * 0.3) * 0.15 + 0.85;
  const sec = (10 - ((frame % 30) / 30) * 10).toFixed(2);

  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      <ellipse cx={0} cy={0} rx={160} ry={48} fill="#38BDF8" opacity={0.25 * pulse} />
      <rect
        x={-140}
        y={-32}
        width={280}
        height={64}
        rx={16}
        fill="rgba(10, 20, 38, 0.95)"
        stroke="#38BDF8"
        strokeWidth={3}
      />
      <text
        x={0}
        y={8}
        fill="#38BDF8"
        fontSize={26}
        fontWeight="900"
        fontFamily="Courier, monospace, sans-serif"
        textAnchor="middle"
        letterSpacing="2px"
      >
        ⏪ -{sec}s
      </text>
      <text
        x={0}
        y={24}
        fill="#BAE6FD"
        fontSize={10}
        fontWeight="bold"
        fontFamily="system-ui, sans-serif"
        textAnchor="middle"
        letterSpacing="1px"
      >
        TEMPORAL REVERSAL
      </text>
    </g>
  );
};

// =========================================================================
// REWIND SPEED LINES / TAPE GLITCH
// =========================================================================
export const RewindGlitch: React.FC<{ active: boolean; frame: number }> = ({ active, frame }) => {
  if (!active) return null;
  const lines = Array.from({ length: 8 }, (_, i) => {
    const y = ((frame * 23 + i * 137) % 1080);
    return (
      <line
        key={i}
        x1={0}
        y1={y}
        x2={1920}
        y2={y}
        stroke="#38BDF8"
        strokeWidth={2 + (i % 3)}
        opacity={0.3 + (i % 4) * 0.15}
        strokeDasharray="40 20 80 30"
      />
    );
  });
  return <g>{lines}</g>;
};

// =========================================================================
// 1. CHAPTER 1: THE DISCOVERY & FIRST CLICK (930 frames)
// =========================================================================
export const TimeRemoteCh1: React.FC<{ f?: number; frame?: number }> = ({ f, frame }) => {
  const currentF = f ?? frame ?? 0;
  const zoom = interpolate(currentF, [0, 930], [1.0, 1.05], { extrapolateRight: 'clamp' });

  // Rewind event triggers at frame 420
  const isRewinding = currentF >= 420 && currentF <= 720;
  const cupY = isRewinding
    ? interpolate(currentF, [420, 680], [820, 600], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : interpolate(currentF, [300, 419], [600, 820], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const pipPose = makePipPose(currentF, {
    x: 620,
    y: HIPS_Y,
    scale: 1.15,
    facing: 1,
    expr: isRewinding ? 'shock' : (currentF >= 300 ? 'oops' : 'neutral'),
    ...(isRewinding ? POSE_SHOCKED : (currentF >= 300 ? POSE_CLICK : POSE_POCKETS)),
  });

  // Subway stranger sitting on bench (100% Stickman!)
  const strangerPose = makePipPose(currentF, {
    x: 1380,
    y: HIPS_Y + 15,
    scale: 1.05,
    facing: -1,
    expr: 'neutral',
    ...POSE_POCKETS,
  });

  return (
    <g transform={`scale(${zoom}) translate(${-(zoom - 1) * 960} ${-(zoom - 1) * 540})`}>
      {/* Background: Subway Platform */}
      <image
        href={staticFile('time-remote/bg_subway_platform.jpg')}
        width={1920}
        height={1080}
        preserveAspectRatio="xMidYMid slice"
        opacity={0.92}
      />
      <rect width={1920} height={1080} fill="#050814" opacity={0.35} />

      {/* Header HUD */}
      <g transform="translate(960, 110)">
        <rect x={-260} y={-35} width={520} height={70} rx={16} fill="rgba(10, 20, 38, 0.95)" stroke="#38BDF8" strokeWidth={2} />
        <text x={0} y={0} fill="#38BDF8" fontSize={22} fontWeight="900" fontFamily="system-ui, sans-serif" textAnchor="middle" letterSpacing="2px">
          SUBWAY BENCH: 11:42 PM
        </text>
        <text x={0} y={24} fill="#FDE047" fontSize={16} fontWeight="bold" fontFamily="system-ui, sans-serif" textAnchor="middle">
          THE RETRO CASSETTE REMOTE
        </text>
      </g>

      {/* The Rewinding Coffee Cup */}
      <g transform={`translate(740, ${cupY})`}>
        <polygon points="-18,-25 18,-25 14,25 -14,25" fill="#F8FAFC" stroke="#38BDF8" strokeWidth={isRewinding ? 3 : 1} />
        <ellipse cx={0} cy={-25} rx={18} ry={6} fill="#78350F" />
        {isRewinding && (
          <ellipse cx={0} cy={-45} rx={8} ry={14} fill="#78350F" opacity={0.8} />
        )}
      </g>

      {/* Side Stickman on subway platform */}
      <Hero pose={strangerPose} look={LOOKS.mo} />

      {/* Main Stickman: Pip */}
      <Hero pose={pipPose} look={LOOKS.pip} />

      {/* Rewind HUD ticker */}
      <RewindHUD x={620} y={380} active={isRewinding} frame={currentF} scale={1.2} />

      {/* Rewind Scanlines Glitch */}
      <RewindGlitch active={isRewinding} frame={currentF} />
    </g>
  );
};

// =========================================================================
// 2. CHAPTER 2: LIVING IN GOD MODE (753 frames)
// =========================================================================
export const TimeRemoteCh2: React.FC<{ f?: number; frame?: number }> = ({ f, frame }) => {
  const currentF = f ?? frame ?? 0;
  const zoom = interpolate(currentF, [0, 753], [1.0, 1.05], { extrapolateRight: 'clamp' });

  // Success counter increments
  const winCount = Math.min(42, Math.floor(interpolate(currentF, [60, 650], [1, 42])));
  const isRewindTick = (currentF % 120) >= 80;

  const pipPose = makePipPose(currentF, {
    x: 720,
    y: HIPS_Y,
    scale: 1.18,
    facing: 1,
    expr: 'smug',
    ...POSE_EXPLAIN,
  });

  // Interviewer / Boss stickman in suit across desk
  const bossPose = makePipPose(currentF, {
    x: 1320,
    y: HIPS_Y,
    scale: 1.15,
    facing: -1,
    expr: 'happy',
    ...POSE_EXPLAIN,
  });

  return (
    <g transform={`scale(${zoom}) translate(${-(zoom - 1) * 960} ${-(zoom - 1) * 540})`}>
      {/* Background: Modern City Office */}
      <image
        href={staticFile('time-remote/bg_city_street.jpg')}
        width={1920}
        height={1080}
        preserveAspectRatio="xMidYMid slice"
        opacity={0.9}
      />
      <rect width={1920} height={1080} fill="#050814" opacity={0.35} />

      {/* God Mode Stats HUD */}
      <g transform="translate(960, 120)">
        <rect x={-280} y={-40} width={560} height={80} rx={18} fill="rgba(10, 20, 38, 0.95)" stroke="#10B981" strokeWidth={3} />
        <text x={0} y={-5} fill="#10B981" fontSize={26} fontWeight="900" fontFamily="system-ui, sans-serif" textAnchor="middle" letterSpacing="2px">
          FLAWLESS UNDOS: {winCount}
        </text>
        <text x={0} y={26} fill="#FDE047" fontSize={16} fontWeight="bold" fontFamily="system-ui, sans-serif" textAnchor="middle">
          ROULETTE, INTERVIEWS & TRADES WON
        </text>
      </g>

      {/* Desk between them */}
      <rect x={900} y={730} width={240} height={120} rx={8} fill="#1E293B" stroke="#334155" strokeWidth={3} />

      {/* Stickman Boss */}
      <Hero pose={bossPose} look={LOOKS.suit} />

      {/* Pip Stickman in Mustard Hoodie */}
      <Hero pose={pipPose} look={LOOKS.pip} />

      {/* Rewind HUD */}
      <RewindHUD x={720} y={390} active={isRewindTick} frame={currentF} scale={1.1} />

      <RewindGlitch active={isRewindTick} frame={currentF} />
    </g>
  );
};

// =========================================================================
// 3. CHAPTER 3: THE TEMPORAL GHOSTING (709 frames)
// =========================================================================
export const TimeRemoteCh3: React.FC<{ f?: number; frame?: number }> = ({ f, frame }) => {
  const currentF = f ?? frame ?? 0;
  const zoom = interpolate(currentF, [0, 709], [1.0, 1.06], { extrapolateRight: 'clamp' });

  const isGlitching = currentF >= 200;

  // Main Pip pose
  const pipPose = makePipPose(currentF, {
    x: 960,
    y: HIPS_Y + 10,
    scale: 1.25,
    facing: 1,
    expr: isGlitching ? 'worried' : 'neutral',
    ...(isGlitching ? POSE_CONFUSED : POSE_POCKETS),
  });

  // Translucent Temporal Ghost 1 (lagging behind)
  const ghostPose1 = makePipPose(currentF - 15, {
    x: 820,
    y: HIPS_Y + 10,
    scale: 1.25,
    facing: 1,
    expr: 'neutral',
  });

  // Translucent Temporal Ghost 2 (lagging further)
  const ghostPose2 = makePipPose(currentF - 30, {
    x: 680,
    y: HIPS_Y + 10,
    scale: 1.25,
    facing: 1,
    expr: 'neutral',
  });

  return (
    <g transform={`scale(${zoom}) translate(${-(zoom - 1) * 960} ${-(zoom - 1) * 540})`}>
      {/* Background: Empty Bedroom / Mirror */}
      <image
        href={staticFile('time-remote/bg_empty_bedroom.jpg')}
        width={1920}
        height={1080}
        preserveAspectRatio="xMidYMid slice"
        opacity={0.92}
      />
      <rect width={1920} height={1080} fill="#050814" opacity={0.4} />

      {/* Warning HUD */}
      <g transform="translate(960, 120)">
        <rect x={-320} y={-40} width={640} height={80} rx={18} fill="rgba(30, 10, 20, 0.95)" stroke="#EF4444" strokeWidth={3} />
        <text x={0} y={-5} fill="#EF4444" fontSize={26} fontWeight="900" fontFamily="system-ui, sans-serif" textAnchor="middle" letterSpacing="2px">
          842 REWINDS LOGGED: REALITY FRACTURE
        </text>
        <text x={0} y={26} fill="#FCA5A5" fontSize={16} fontWeight="bold" fontFamily="system-ui, sans-serif" textAnchor="middle">
          TEMPORAL GHOSTING DETECTED
        </text>
      </g>

      {/* Ghost stickman copies lagging behind */}
      {isGlitching && (
        <>
          <g opacity={0.25} filter="blur(2px)">
            <Hero pose={ghostPose2} look={LOOKS.pip} />
          </g>
          <g opacity={0.45} filter="blur(1px)">
            <Hero pose={ghostPose1} look={LOOKS.pip} />
          </g>
        </>
      )}

      {/* True Pip Stickman */}
      <Hero pose={pipPose} look={LOOKS.pip} />

      <RewindGlitch active={isGlitching} frame={currentF} />
    </g>
  );
};

// =========================================================================
// 4. CHAPTER 4: THE STRANGER WHO DIDN'T REWIND (847 frames)
// =========================================================================
export const TimeRemoteCh4: React.FC<{ f?: number; frame?: number }> = ({ f, frame }) => {
  const currentF = f ?? frame ?? 0;
  const zoom = interpolate(currentF, [0, 847], [1.0, 1.05], { extrapolateRight: 'clamp' });

  // Truck accident trigger & rewind
  const isRewinding = currentF >= 320;

  const pipPose = makePipPose(currentF, {
    x: 480,
    y: HIPS_Y,
    scale: 1.18,
    facing: 1,
    expr: 'shock',
    ...POSE_SHOCKED,
  });

  // The Collector: Stickman in dark trench coat who stands completely still, immune to the rewind!
  const collectorPose = makePipPose(currentF, {
    x: 1360,
    y: HIPS_Y - 10,
    scale: 1.25,
    facing: -1,
    expr: 'neutral',
    ...POSE_POCKETS,
  });

  return (
    <g transform={`scale(${zoom}) translate(${-(zoom - 1) * 960} ${-(zoom - 1) * 540})`}>
      {/* Background: City Street Crosswalk */}
      <image
        href={staticFile('time-remote/bg_city_street.jpg')}
        width={1920}
        height={1080}
        preserveAspectRatio="xMidYMid slice"
        opacity={0.92}
      />
      <rect width={1920} height={1080} fill="#050814" opacity={0.35} />

      {/* Crosswalk Zebra Stripes */}
      <g opacity={0.3}>
        {Array.from({ length: 9 }).map((_, i) => (
          <rect key={i} x={300 + i * 140} y={760} width={90} height={200} fill="#F8FAFC" rx={4} />
        ))}
      </g>

      {/* Critical Alert HUD */}
      <g transform="translate(960, 110)">
        <rect x={-320} y={-35} width={640} height={70} rx={16} fill="rgba(10, 20, 38, 0.95)" stroke="#38BDF8" strokeWidth={3} />
        <text x={0} y={0} fill="#38BDF8" fontSize={22} fontWeight="900" fontFamily="system-ui, sans-serif" textAnchor="middle" letterSpacing="2px">
          DOWNTOWN CROSSWALK: CRASH REWIND
        </text>
        <text x={0} y={24} fill="#EF4444" fontSize={16} fontWeight="bold" fontFamily="system-ui, sans-serif" textAnchor="middle">
          ANOMALY: STRANGER IMMUNE TO REWIND
        </text>
      </g>

      {/* The Collector Stickman in Charcoal Trench Coat */}
      <g>
        {/* Mysterious purple timeline aura around collector */}
        <ellipse cx={1360} cy={520} rx={180} ry={260} fill="#A855F7" opacity={0.2} />
        <Hero pose={collectorPose} look={LOOKS.suit} />
        {/* Floating HUD over Collector */}
        <g transform="translate(1360, 340)">
          <rect x={-120} y={-24} width={240} height={48} rx={10} fill="rgba(15, 23, 42, 0.95)" stroke="#A855F7" strokeWidth={2} />
          <text x={0} y={5} fill="#A855F7" fontSize={14} fontWeight="bold" fontFamily="system-ui, sans-serif" textAnchor="middle">
            IMMUNE TO TIME REVERSAL
          </text>
        </g>
      </g>

      {/* Pip Stickman in Mustard Hoodie */}
      <Hero pose={pipPose} look={LOOKS.pip} />

      {/* Rewind HUD */}
      <RewindHUD x={480} y={390} active={isRewinding} frame={currentF} scale={1.2} />

      <RewindGlitch active={isRewinding} frame={currentF} />
    </g>
  );
};

// =========================================================================
// 5. CHAPTER 5: THE FINAL DILEMMA (OPTION A VS OPTION B) (878 frames)
// =========================================================================
export const TimeRemoteCh5: React.FC<{ f?: number; frame?: number }> = ({ f, frame }) => {
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
        href={staticFile('time-remote/bg_warm_room.jpg')}
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
        {/* OPTION A: Keep Remote, Pay Lifespan */}
        <g transform={`translate(480, 420) scale(${pulseA})`}>
          <rect x={-280} y={-160} width={560} height={320} rx={24} fill="rgba(10, 20, 38, 0.95)" stroke="#38BDF8" strokeWidth={4} />
          <rect x={-260} y={-140} width={120} height={44} rx={10} fill="#38BDF8" />
          <text x={-200} y={-112} fill="#0B132B" fontSize={22} fontWeight="900" fontFamily="system-ui, sans-serif" textAnchor="middle">
            OPTION A
          </text>
          <text x={0} y={-40} fill="#FFFFFF" fontSize={26} fontWeight="bold" fontFamily="system-ui, sans-serif" textAnchor="middle">
            KEEP THE REWIND REMOTE
          </text>
          <text x={0} y={15} fill="#94A3B8" fontSize={18} fontFamily="system-ui, sans-serif" textAnchor="middle">
            Unlimited 10-second undos whenever needed.
          </text>
          <text x={0} y={45} fill="#94A3B8" fontSize={18} fontFamily="system-ui, sans-serif" textAnchor="middle">
            COST: Pay 1 month of your life per click!
          </text>
          {/* Badge */}
          <rect x={-140} y={80} width={280} height={42} rx={12} fill="rgba(56, 189, 248, 0.2)" stroke="#38BDF8" strokeWidth={1} />
          <text x={0} y={107} fill="#38BDF8" fontSize={16} fontWeight="bold" fontFamily="system-ui, sans-serif" textAnchor="middle">
            ⏪ GOD MODE AT A PRICE
          </text>
        </g>

        {/* OPTION B: Destroy The Remote Forever */}
        <g transform={`translate(1440, 420) scale(${pulseB})`}>
          <rect x={-280} y={-160} width={560} height={320} rx={24} fill="rgba(10, 20, 38, 0.95)" stroke="#F59E0B" strokeWidth={4} />
          <rect x={-260} y={-140} width={120} height={44} rx={10} fill="#F59E0B" />
          <text x={-200} y={-112} fill="#0B132B" fontSize={22} fontWeight="900" fontFamily="system-ui, sans-serif" textAnchor="middle">
            OPTION B
          </text>
          <text x={0} y={-40} fill="#FFFFFF" fontSize={26} fontWeight="bold" fontFamily="system-ui, sans-serif" textAnchor="middle">
            DESTROY THE REMOTE FOREVER
          </text>
          <text x={0} y={15} fill="#94A3B8" fontSize={18} fontFamily="system-ui, sans-serif" textAnchor="middle">
            Live with mistakes, heartbreak, and risk.
          </text>
          <text x={0} y={45} fill="#94A3B8" fontSize={18} fontFamily="system-ui, sans-serif" textAnchor="middle">
            Zero temporal corruption, 100% human free will.
          </text>
          {/* Badge */}
          <rect x={-140} y={80} width={280} height={42} rx={12} fill="rgba(245, 158, 11, 0.2)" stroke="#F59E0B" strokeWidth={1} />
          <text x={0} y={107} fill="#F59E0B" fontSize={16} fontWeight="bold" fontFamily="system-ui, sans-serif" textAnchor="middle">
            ✨ PURE HUMAN FREE WILL
          </text>
        </g>
      </g>

      {/* Pip Stickman in Mustard Hoodie at bottom */}
      <Hero pose={pipPose} look={LOOKS.pip} />
    </g>
  );
};

// =========================================================================
// 6. SHORT (9:16 VERTICAL - 1,099 frames)
// =========================================================================
export const TimeRemoteShort: React.FC<{ f?: number; frame?: number }> = ({ f, frame }) => {
  const currentF = f ?? frame ?? 0;
  const isCoffee = currentF <= 360;
  const isCrowd = currentF > 360 && currentF <= 720;
  const isVote = currentF > 720;

  const pipPose = makePipPose(currentF, {
    x: 540,
    y: 1280,
    scale: 1.45,
    facing: 1,
    expr: isVote ? 'smug' : (isCoffee ? 'oops' : 'shock'),
    ...(isVote ? POSE_EXPLAIN : (isCoffee ? POSE_CLICK : POSE_SHOCKED)),
  });

  return (
    <g>
      {/* Background based on phase */}
      <image
        href={staticFile(isCoffee ? 'time-remote/bg_subway_platform.jpg' : 'time-remote/bg_city_street.jpg')}
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
          I FOUND A TIME MACHINE
        </text>
        <text x={0} y={45} fill="#FDE047" fontSize={26} fontWeight="bold" fontFamily="system-ui, sans-serif" textAnchor="middle">
          {isVote ? 'CHOOSE OPTION A OR B' : (isCoffee ? 'REWINDING COFFEE BY 10s' : 'STRANGER IMMUNE TO REWIND')}
        </text>
      </g>

      {/* Rewind HUD in center */}
      {!isVote && (
        <RewindHUD x={540} y={640} active={true} frame={currentF} scale={1.5} />
      )}

      {/* Voting Dilemma Cards for Shorts */}
      {isVote && (
        <g transform="translate(540, 680)">
          {/* Card A */}
          <rect x={-420} y={-160} width={840} height={130} rx={20} fill="rgba(10, 20, 38, 0.95)" stroke="#38BDF8" strokeWidth={4} />
          <text x={-320} y={-85} fill="#38BDF8" fontSize={30} fontWeight="900" fontFamily="system-ui, sans-serif">
            OPTION A:
          </text>
          <text x={-140} y={-85} fill="#FFFFFF" fontSize={24} fontWeight="bold" fontFamily="system-ui, sans-serif">
            Keep Remote (Pay 1 Month Life) ⏪
          </text>

          {/* Card B */}
          <rect x={-420} y={10} width={840} height={130} rx={20} fill="rgba(10, 20, 38, 0.95)" stroke="#F59E0B" strokeWidth={4} />
          <text x={-320} y={85} fill="#F59E0B" fontSize={30} fontWeight="900" fontFamily="system-ui, sans-serif">
            OPTION B:
          </text>
          <text x={-140} y={85} fill="#FFFFFF" fontSize={24} fontWeight="bold" fontFamily="system-ui, sans-serif">
            Destroy Remote Forever ✨
          </text>
        </g>
      )}

      {/* Pip Stickman in Mustard Hoodie */}
      <Hero pose={pipPose} look={LOOKS.pip} />

      <RewindGlitch active={!isVote} frame={currentF} />
    </g>
  );
};

