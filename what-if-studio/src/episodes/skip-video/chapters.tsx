import React from 'react';
import { interpolate, spring, staticFile } from 'remotion';
import { Hero, LOOKS } from '../../engine';

const GROUND_Y = 820;
const HIPS_Y = 687; // Grounded feet at y=820

// =========================================================================
// 1. CHAPTER 1: THE FORBIDDEN SCROLL (1,028 frames)
// =========================================================================
export const SkipVideoCh1: React.FC<{ f?: number; frame?: number }> = ({ f, frame }) => {
  const currentF = f ?? frame ?? 0;

  // Pip walking in from left
  const walkProgress = interpolate(currentF, [0, 50], [0, 1], { extrapolateRight: 'clamp' });
  const pipX = interpolate(walkProgress, [0, 1], [400, 840]);
  const isWalking = currentF < 50;
  const legCycle = Math.sin(currentF * 0.45);

  // Phone hover and swipe animation
  const thumbY = Math.sin(currentF * 0.25) * 18;
  const warningPulse = Math.sin(currentF * 0.3) * 0.15 + 0.85;

  return (
    <g>
      {/* Background: Cyber Surveillance Warning Hub */}
      <image
        href={staticFile('skip-video/bg_warning_hub.jpg')}
        width={1920}
        height={1080}
        preserveAspectRatio="xMidYMid slice"
        opacity={0.88}
      />

      <rect width={1920} height={1080} fill="#050714" opacity={0.3} />

      {/* Floating Holographic "SKIP THIS VIDEO" Warning Sign */}
      <g transform="translate(1360, 420)">
        {/* Glow halo */}
        <rect x={-260} y={-90} width={520} height={180} rx={24} fill="#EF4444" opacity={0.18 * warningPulse} />
        {/* Main Sign Panel */}
        <rect x={-250} y={-80} width={500} height={160} rx={20} fill="rgba(15, 23, 42, 0.94)" stroke="#EF4444" strokeWidth={4} />

        {/* Hazard diagonal stripes on top border */}
        <path d="M -230 -64 L -210 -80 M -190 -64 L -170 -80 M -150 -64 L -130 -80 M 130 -64 L 150 -80 M 170 -64 L 190 -80 M 210 -64 L 230 -80" stroke="#F59E0B" strokeWidth={3} />

        <text x={0} y={-20} fill="#EF4444" fontSize={36} fontWeight="900" fontFamily="system-ui, sans-serif" textAnchor="middle" letterSpacing="3px">
          ⚠️ DO NOT WATCH
        </text>
        <text x={0} y={32} fill="#FDE047" fontSize={28} fontWeight="bold" fontFamily="system-ui, sans-serif" textAnchor="middle">
          SWIPE UP IMMEDIATELY
        </text>
      </g>

      {/* Stylized Giant Floating Smartphone with animated thumb */}
      <g transform="translate(1360, 720)">
        {/* Phone Body */}
        <rect x={-90} y={-110} width={180} height={220} rx={22} fill="#0F172A" stroke="#38BDF8" strokeWidth={3.5} />
        <rect x={-78} y={-95} width={156} height={190} rx={12} fill="#1E293B" />
        {/* Animated Swipe Arrow */}
        <path d="M 0 40 L 0 -40 M -20 -20 L 0 -40 L 20 -20" stroke="#38BDF8" strokeWidth={4} strokeLinecap="round" fill="none" />
        {/* Hovering Thumb (Hesitating) */}
        <g transform={`translate(25, ${thumbY})`}>
          <ellipse cx={0} cy={0} rx={18} ry={28} fill="#F6EFE3" stroke="#000" strokeWidth={3} transform="rotate(-25)" />
        </g>
      </g>

      {/* Contact Shadow */}
      <ellipse cx={pipX} cy={GROUND_Y} rx={85} ry={18} fill="rgba(0,0,0,0.65)" />

      {/* Pip (Stickman) */}
      <Hero
        pose={{
          x: pipX,
          y: HIPS_Y + (isWalking ? Math.abs(legCycle) * 5 : 0),
          scale: 1.0,
          facing: 1,
          tilt: isWalking ? 4 : (currentF > 450 ? 5 : -2),
          headTilt: currentF > 450 ? 10 : -4,
          expr: currentF > 500 ? 'smug' : (currentF > 150 ? 'shock' : 'neutral'),
          look: 0.8,
          armL: isWalking
            ? { a: -legCycle * 25, b: 15 }
            : (currentF > 450 ? { a: -35, b: 20 } : { a: 15, b: 30 }),
          armR: isWalking
            ? { a: legCycle * 25, b: 15 }
            : (currentF > 200 ? { a: -50, b: -10 } : { a: 20, b: 30 }), // Pointing right at warning
          legL: isWalking ? { a: legCycle * 30, b: Math.max(0, -legCycle * 18) } : { a: -5, b: 0 },
          legR: isWalking ? { a: -legCycle * 30, b: Math.max(0, legCycle * 18) } : { a: 5, b: 0 },
        }}
        look={LOOKS.pipHood}
      />
    </g>
  );
};

// =========================================================================
// 2. CHAPTER 2: THE FORBIDDEN VAULT (991 frames)
// =========================================================================
export const SkipVideoCh2: React.FC<{ f?: number; frame?: number }> = ({ f, frame }) => {
  const currentF = f ?? frame ?? 0;

  // Door warning light pulse
  const alarmPulse = Math.sin(currentF * 0.4) * 0.5 + 0.5;

  return (
    <g>
      {/* Background: Cyberpunk Vault Corridor */}
      <image
        href={staticFile('skip-video/bg_forbidden_vault.jpg')}
        width={1920}
        height={1080}
        preserveAspectRatio="xMidYMid slice"
        opacity={0.88}
      />

      <rect width={1920} height={1080} fill="#050816" opacity={0.3} />

      {/* Pulsing Alarm Beacon on Vault Door */}
      <circle cx={960} cy={340} r={45 * alarmPulse + 15} fill="#EF4444" opacity={0.35} />

      {/* Floating Holographic "LOCKED ROOM" Alert */}
      <g transform="translate(960, 240)">
        <rect x={-220} y={-35} width={440} height={70} rx={16} fill="rgba(15, 23, 42, 0.95)" stroke="#EF4444" strokeWidth={3} />
        <text x={0} y={8} fill="#FCA5A5" fontSize={24} fontWeight="900" fontFamily="system-ui, sans-serif" textAnchor="middle">
          ⛔ DO NOT ENTER UNDER ANY CIRCUMSTANCES
        </text>
      </g>

      {/* Contact Shadow */}
      <ellipse cx={820} cy={GROUND_Y} rx={85} ry={18} fill="rgba(0,0,0,0.7)" />

      {/* Pip approaching the vault door with intense curiosity */}
      <Hero
        pose={{
          x: 820,
          y: HIPS_Y,
          scale: 1.0,
          facing: 1, // Facing vault door
          tilt: 6,
          headTilt: -8,
          expr: currentF > 400 ? 'worried' : 'shock',
          look: 0.9,
          armL: { a: 25, b: 35 },
          armR: { a: -45, b: 30 }, // Reaching hand towards door
          legL: { a: -8, b: 0 },
          legR: { a: 12, b: 0 },
        }}
        look={LOOKS.pipHood}
      />
    </g>
  );
};

// =========================================================================
// 3. CHAPTER 3: THE 5-LINE MIRROR (1,264 frames)
// =========================================================================
export const SkipVideoCh3: React.FC<{ f?: number; frame?: number }> = ({ f, frame }) => {
  const currentF = f ?? frame ?? 0;

  // 3D Wireframe glitch / shatter effect
  const glitchOffset = currentF > 400 && currentF < 600 ? Math.sin(currentF * 0.9) * 12 : 0;
  const wireframeOpacity = interpolate(currentF, [450, 550], [0.85, 0], { extrapolateRight: 'clamp' });

  return (
    <g>
      {/* Background: Digital Simulation Lab */}
      <image
        href={staticFile('skip-video/bg_simulation_lab.jpg')}
        width={1920}
        height={1080}
        preserveAspectRatio="xMidYMid slice"
        opacity={0.88}
      />

      <rect width={1920} height={1080} fill="#040713" opacity={0.35} />

      {/* Holographic Comparison Board */}
      <g transform="translate(1350, 480)">
        {/* Hollywood 3D side */}
        <g transform={`translate(0, -90) translate(${glitchOffset}, 0)`} opacity={wireframeOpacity}>
          <rect x={-240} y={-50} width={480} height={100} rx={18} fill="rgba(30, 41, 59, 0.9)" stroke="#EF4444" strokeWidth={3} />
          <text x={0} y={-10} fill="#EF4444" fontSize={24} fontWeight="900" fontFamily="system-ui" textAnchor="middle">
            $300,000,000 CGI
          </text>
          <text x={0} y={24} fill="#94A3B8" fontSize={20} fontWeight="bold" fontFamily="system-ui" textAnchor="middle">
            Forces someone else's face
          </text>
        </g>

        {/* 5 Lines Stickman side */}
        <g transform="translate(0, 70)">
          <rect x={-240} y={-50} width={480} height={100} rx={18} fill="rgba(15, 23, 42, 0.95)" stroke="#10B981" strokeWidth={3.5} />
          <text x={0} y={-10} fill="#10B981" fontSize={26} fontWeight="900" fontFamily="system-ui" textAnchor="middle">
            5 BLACK LINES & HOODIE
          </text>
          <text x={0} y={24} fill="#FDE047" fontSize={20} fontWeight="bold" fontFamily="system-ui" textAnchor="middle">
            An Emotional Mirror (Your Mind)
          </text>
        </g>
      </g>

      {/* Contact Shadow */}
      <ellipse cx={720} cy={GROUND_Y} rx={85} ry={18} fill="rgba(0,0,0,0.7)" />

      {/* Pip standing proudly in yellow hoodie */}
      <Hero
        pose={{
          x: 720,
          y: HIPS_Y,
          scale: 1.05,
          facing: 1,
          tilt: 0,
          headTilt: 4,
          expr: 'smug',
          armL: { a: -20, b: 25 },
          armR: { a: -35, b: 20 },
          legL: { a: 0, b: 0 },
          legR: { a: 0, b: 0 },
        }}
        look={LOOKS.pipHood}
      />
    </g>
  );
};

// =========================================================================
// 4. CHAPTER 4: THE 5-SECOND ULTIMATUM (993 frames)
// =========================================================================
export const SkipVideoCh4: React.FC<{ f?: number; frame?: number }> = ({ f, frame }) => {
  const currentF = f ?? frame ?? 0;

  // Countdown timer from 5 down to 0
  // Starts around frame 200, decrements every 40 frames
  const timerNum = Math.max(0, 5 - Math.floor(Math.max(0, currentF - 180) / 45));
  const timerPulse = ((currentF - 180) % 45) / 45.0;
  const numScale = interpolate(timerPulse, [0, 0.15, 1], [1.3, 1.0, 1.0], { extrapolateRight: 'clamp' });

  return (
    <g>
      {/* Background: Cyber Surveillance Hub */}
      <image
        href={staticFile('skip-video/bg_warning_hub.jpg')}
        width={1920}
        height={1080}
        preserveAspectRatio="xMidYMid slice"
        opacity={0.85}
      />

      <rect width={1920} height={1080} fill="#050814" opacity={0.35} />

      {/* Giant Floating Countdown HUD in Center */}
      <g transform="translate(1320, 480)">
        <rect x={-220} y={-160} width={440} height={320} rx={28} fill="rgba(15, 23, 42, 0.95)" stroke="#EF4444" strokeWidth={4} />
        <text x={0} y={-95} fill="#94A3B8" fontSize={24} fontWeight="900" fontFamily="system-ui" textAnchor="middle" letterSpacing="2px">
          WILLPOWER TEST:
        </text>

        {/* Animated Number */}
        <text
          x={0}
          y={60}
          fill={timerNum === 0 ? '#10B981' : '#EF4444'}
          fontSize={150}
          fontWeight="900"
          fontFamily="system-ui"
          textAnchor="middle"
          transform={`scale(${numScale})`}
          style={{ transformOrigin: '0px 20px', filter: 'drop-shadow(0 0 25px rgba(239, 68, 68, 0.7))' }}
        >
          0{timerNum}
        </text>

        <text x={0} y={120} fill="#FDE047" fontSize={22} fontWeight="bold" fontFamily="system-ui" textAnchor="middle">
          {timerNum === 0 ? 'STATUS: REBEL DETECTED 🔥' : 'SWIPE AWAY NOW'}
        </text>
      </g>

      {/* Contact Shadow */}
      <ellipse cx={680} cy={GROUND_Y} rx={85} ry={18} fill="rgba(0,0,0,0.7)" />

      {/* Pip standing with arms folded, mocking the viewer */}
      <Hero
        pose={{
          x: 680,
          y: HIPS_Y,
          scale: 1.05,
          facing: 1,
          tilt: -2,
          headTilt: 6,
          expr: currentF > 420 ? 'smug' : 'neutral',
          look: 0.8,
          armL: { a: 45, b: 70 }, // Folded arms
          armR: { a: -45, b: 70 },
          legL: { a: -4, b: 0 },
          legR: { a: 4, b: 0 },
        }}
        look={LOOKS.pipHood}
      />
    </g>
  );
};

// =========================================================================
// 5. CHAPTER 5: THE ULTIMATE FORBIDDEN QUESTION (1,130 frames)
// =========================================================================
export const SkipVideoCh5: React.FC<{ f?: number; frame?: number }> = ({ f, frame }) => {
  const currentF = f ?? frame ?? 0;

  const cardScale = spring({
    frame: Math.max(0, currentF - 450),
    fps: 30,
    config: { damping: 14, stiffness: 180 },
  });

  const bellBounce = Math.sin(currentF * 0.4) * 8;

  // Pip transitions gracefully to the left to give the question card full breathing room
  const pipX = interpolate(currentF, [420, 480], [960, 360], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });

  return (
    <g>
      {/* Background: Midnight Rooftop Skyline */}
      <image
        href={staticFile('skip-video/bg_rooftop_choice.jpg')}
        width={1920}
        height={1080}
        preserveAspectRatio="xMidYMid slice"
        opacity={0.88}
      />

      <rect width={1920} height={1080} fill="#050713" opacity={0.4} />

      {/* Pip standing proudly presenting the question */}
      <g transform="translate(0, 0)">
        <ellipse cx={pipX} cy={GROUND_Y} rx={95} ry={20} fill="rgba(0,0,0,0.85)" />
        <Hero
          pose={{
            x: pipX,
            y: HIPS_Y,
            scale: 1.05,
            facing: 1,
            tilt: 0,
            headTilt: 4,
            expr: 'smug',
            armL: { a: -20, b: 30 },
            armR: currentF > 450 ? { a: -55, b: -15 } : { a: 20, b: 30 }, // Pointing right at card
            legL: { a: 0, b: 0 },
            legR: { a: 0, b: 0 },
          }}
          look={LOOKS.pipHood}
        />
      </g>

      {/* Interactive Comment Challenge Card */}
      {currentF > 450 && (
        <g
          transform={`translate(1140, 500) scale(${cardScale * 0.92})`}
          style={{ filter: 'drop-shadow(0 20px 50px rgba(0,0,0,0.95))' }}
        >
          <rect x={-520} y={-250} width={1040} height={500} rx={28} fill="#0F172A" stroke="#EF4444" strokeWidth={4} />

          <text x={0} y={-180} fill="#FDE047" fontSize={34} fontWeight="900" fontFamily="system-ui" textAnchor="middle">
            💬 THE ULTIMATE FORBIDDEN TEST:
          </text>
          <text x={0} y={-120} fill="#FFFFFF" fontSize={28} fontWeight="bold" fontFamily="system-ui" textAnchor="middle">
            If you received a sealed envelope with your exact death date...
          </text>

          {/* Option A */}
          <rect x={-460} y={-70} width={920} height={80} rx={16} fill="#1E293B" stroke="#EF4444" strokeWidth={2.5} />
          <text x={-420} y={-20} fill="#EF4444" fontSize={32} fontWeight="bold" fontFamily="system-ui">
            👉 OPTION A:
          </text>
          <text x={-180} y={-20} fill="#FFFFFF" fontSize={28} fontWeight="bold" fontFamily="system-ui">
            "OPEN IT — The agony of not knowing is worse."
          </text>

          {/* Option B */}
          <rect x={-460} y={30} width={920} height={80} rx={16} fill="#1E293B" stroke="#10B981" strokeWidth={2.5} />
          <text x={-420} y={80} fill="#10B981" fontSize={32} fontWeight="bold" fontFamily="system-ui">
            👉 OPTION B:
          </text>
          <text x={-180} y={80} fill="#FFFFFF" fontSize={28} fontWeight="bold" fontFamily="system-ui">
            "BURN IT — Some doors should stay locked forever."
          </text>

          <text x={0} y={155} fill="#94A3B8" fontSize={22} fontWeight="bold" fontFamily="system-ui" textAnchor="middle">
            Drop 'Option A' or 'Option B' in the comments below! 👇
          </text>

          {/* Subscribe CTA Button with animated Bell - STRICTLY WHAT-EIF (NO STUDIO) */}
          <rect x={-220} y={180} width={440} height={56} rx={14} fill="#DC2626" />
          <text x={-20} y={218} fill="#FFFFFF" fontSize={24} fontWeight="900" fontFamily="system-ui" textAnchor="middle">
            SUBSCRIBE TO WHAT-EIF
          </text>
          <g transform={`translate(170, 208) rotate(${bellBounce})`}>
            <path
              d="M -10 6 L -6 -6 A 6 6 0 0 1 6 -6 L 10 6 Z"
              fill="#FDE047"
              stroke="#000"
              strokeWidth={1.5}
            />
            <circle cx={0} cy={8} r={2.5} fill="#FDE047" />
          </g>
        </g>
      )}
    </g>
  );
};

// =========================================================================
// 6. SHORT VERSION (1,203 frames @ 30 FPS)
// =========================================================================
export const SkipVideoShort: React.FC<{ f?: number; frame?: number }> = ({ f, frame }) => {
  const currentF = f ?? frame ?? 0;
  return (
    <g>
      {currentF < 450 ? (
        <SkipVideoCh1 f={interpolate(currentF, [0, 450], [50, 750])} />
      ) : currentF < 800 ? (
        <SkipVideoCh4 f={interpolate(currentF, [450, 800], [150, 700])} />
      ) : (
        <SkipVideoCh5 f={interpolate(currentF, [800, 1203], [420, 800])} />
      )}
    </g>
  );
};

