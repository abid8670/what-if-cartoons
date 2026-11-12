import React from 'react';
import { interpolate, spring, staticFile } from 'remotion';
import { Hero, LOOKS, basePose, Pose } from '../../engine';

const HIPS_Y = 700;

// =========================================================================
// DYNAMIC PIP RIG HELPER
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

export const POSE_WARNING_STOP = { armL: { a: 110, b: 35 }, armR: { a: 110, b: -35 }, headTilt: -4 };
export const POSE_POINT_FORWARD = { armL: { a: 25, b: 15 }, armR: { a: 95, b: 85 }, headTilt: 6 };
export const POSE_CONFUSED = { armL: { a: 15, b: -10 }, armR: { a: 135, b: 85 }, headTilt: 10 };
export const POSE_SHOCKED = { armL: { a: 125, b: 35 }, armR: { a: 125, b: 35 }, squash: -0.12 };
export const POSE_HEADACHE = { armL: { a: 130, b: 70 }, armR: { a: 130, b: -70 }, headTilt: -8 };

// =========================================================================
// GLOWING HOLOGRAPHIC RED PAUSE ICON (MATCHING THUMBNAIL)
// =========================================================================
export const HolographicPause: React.FC<{
  x: number;
  y: number;
  frame: number;
  scale?: number;
  pulseSpeed?: number;
}> = ({ x, y, frame, scale = 1, pulseSpeed = 0.2 }) => {
  const pulse = Math.sin(frame * pulseSpeed) * 0.2 + 0.8;
  const floatY = Math.sin(frame * 0.1) * 5;

  return (
    <g transform={`translate(${x}, ${y + floatY}) scale(${scale})`}>
      {/* Outer Crimson Glow */}
      <circle cx={0} cy={0} r={140} fill="#EF4444" opacity={0.3 * pulse} filter="blur(16px)" />
      {/* Pause Circle */}
      <circle cx={0} cy={0} r={110} fill="#180A10" stroke="#EF4444" strokeWidth={7} />
      <circle cx={0} cy={0} r={100} fill="none" stroke="#FCA5A5" strokeWidth={2} opacity={0.6} />

      {/* Pause Bars (⏸️) */}
      <rect x={-52} y={-60} width={34} height={120} rx={10} fill="#EF4444" />
      <rect x={18} y={-60} width={34} height={120} rx={10} fill="#EF4444" />

      {/* Rotating Hazard Ring */}
      <circle
        cx={0}
        cy={0}
        r={124}
        fill="none"
        stroke="#F59E0B"
        strokeWidth={3}
        strokeDasharray="16 12"
        transform={`rotate(${frame * 2})`}
        opacity={0.8}
      />
    </g>
  );
};

// =========================================================================
// CAUTION BANNERS (TOP & BOTTOM HAZARD STRIPES)
// =========================================================================
export const CautionBanner: React.FC<{ y: number; text: string; width?: number }> = ({ y, text, width = 1920 }) => {
  return (
    <g transform={`translate(0, ${y})`}>
      <rect x={0} y={0} width={width} height={42} fill="#F59E0B" />
      <text
        x={width / 2}
        y={28}
        fill="#000000"
        fontSize={18}
        fontWeight="900"
        fontFamily="sans-serif"
        letterSpacing="4px"
        textAnchor="middle"
      >
        ⚠️ {text} ⚠️
      </text>
    </g>
  );
};

// =========================================================================
// CHAPTER 1: THE INCITING WARNING (THE STREISAND PARADOX)
// =========================================================================
export const DontPauseCh1: React.FC<{ f: number }> = ({ f }) => {
  const shake = Math.sin(f * 0.8) * 4;

  const pipPose = makePipPose(f, {
    x: 580 + shake,
    y: HIPS_Y,
    expr: 'shock',
    ...POSE_WARNING_STOP,
  });

  return (
    <g>
      {/* Background Image: Dark High-Tech Bedroom */}
      <image href={staticFile('dont-pause/bg_empty_bedroom.jpg')} x={0} y={0} width={1920} height={1080} preserveAspectRatio="xMidYMid slice" />
      <rect x={0} y={0} width={1920} height={1080} fill="rgba(14, 8, 20, 0.55)" />

      {/* Caution Header */}
      <CautionBanner y={0} text="RESTRICTED COGNITIVE EXPERIMENT: DO NOT HIT PAUSE" />

      {/* Pip Stickman Hero (Panicked Warning Pose) */}
      <Hero p={pipPose} look={LOOKS.pip} f={f} />

      {/* Giant Holographic Pause Icon (Matching Thumbnail) */}
      <HolographicPause x={1260} y={520} frame={f} scale={1.5} />

      {/* Floating Warning HUD Box */}
      <g transform="translate(1260, 240)">
        <rect x={-260} y={-50} width={520} height={100} rx={22} fill="rgba(20, 10, 15, 0.95)" stroke="#EF4444" strokeWidth={4} />
        <text x={0} y={-10} fill="#FCA5A5" fontSize={16} fontWeight="bold" textAnchor="middle">
          CURRENT CHALLENGE:
        </text>
        <text x={0} y={32} fill="#EF4444" fontSize={34} fontWeight="900" fontFamily="sans-serif" textAnchor="middle">
          DO NOT TOUCH SCREEN!
        </text>
      </g>
    </g>
  );
};

// =========================================================================
// CHAPTER 2: THE SUBLIMINAL FLASH TEST (THE 1-FRAME TRAP)
// =========================================================================
export const DontPauseCh2: React.FC<{ f: number }> = ({ f }) => {
  // Flash single subliminal frame at intervals
  const isFlash = f % 60 === 24;

  const pipPose = makePipPose(f, {
    x: 640,
    y: HIPS_Y,
    expr: isFlash ? 'shock' : 'worried',
    ...POSE_POINT_FORWARD,
  });

  return (
    <g>
      <image href={staticFile('dont-pause/bg_contract_office.jpg')} x={0} y={0} width={1920} height={1080} preserveAspectRatio="xMidYMid slice" />
      <rect x={0} y={0} width={1920} height={1080} fill="rgba(12, 10, 24, 0.55)" />

      <CautionBanner y={0} text="SUBLIMINAL FLASH DETECTION IN PROGRESS" />

      {/* Hidden Subliminal Symbol Frame */}
      {isFlash && (
        <g transform="translate(960, 480)">
          <rect x={-400} y={-250} width={800} height={500} rx={32} fill="#EF4444" stroke="#FFFFFF" strokeWidth={10} />
          <text x={0} y={-40} fill="#FFFFFF" fontSize={64} fontWeight="900" textAnchor="middle">
            YOU FAILED!
          </text>
          <text x={0} y={40} fill="#FDE68A" fontSize={36} fontWeight="bold" textAnchor="middle">
            SECRET CODE: 404_ANOMALY
          </text>
          <text x={0} y={110} fill="#FFFFFF" fontSize={26} textAnchor="middle">
            Did you pause to read this?
          </text>
        </g>
      )}

      {/* Pip Stickman Hero */}
      <Hero p={pipPose} look={LOOKS.pip} f={f} />

      {/* Timeline Scrubber Mockup */}
      <g transform="translate(1280, 520)">
        <rect x={-260} y={-70} width={520} height={140} rx={20} fill="#0F172A" stroke="#06B6D4" strokeWidth={3} />
        <text x={0} y={-24} fill="#38BDF8" fontSize={18} fontWeight="bold" textAnchor="middle">
          TIMELINE SCRUBBER
        </text>
        {/* Scrubber Bar */}
        <line x1={-220} y1={15} x2={220} y2={15} stroke="#334155" strokeWidth={10} strokeLinecap="round" />
        <line x1={-220} y1={15} x2={-20} y2={15} stroke="#EF4444" strokeWidth={10} strokeLinecap="round" />
        <circle cx={-20} cy={15} r={16} fill="#EF4444" stroke="#FFFFFF" strokeWidth={3} />
        <text x={0} y={52} fill="#EF4444" fontSize={14} fontWeight="bold" textAnchor="middle">
          ⚠️ PAUSE ATTEMPT DETECTED
        </text>
      </g>
    </g>
  );
};

// =========================================================================
// CHAPTER 3: THE BRAIN HIJACK (NEUROSCIENCE & THE 99% FAIL RATE)
// =========================================================================
export const DontPauseCh3: React.FC<{ f: number }> = ({ f }) => {
  const pipPose = makePipPose(f, {
    x: 640,
    y: HIPS_Y,
    expr: 'dizzy',
    ...POSE_HEADACHE,
  });

  return (
    <g>
      <image href={staticFile('dont-pause/bg_biotech_vault.jpg')} x={0} y={0} width={1920} height={1080} preserveAspectRatio="xMidYMid slice" />
      <rect x={0} y={0} width={1920} height={1080} fill="rgba(15, 8, 20, 0.6)" />

      <CautionBanner y={0} text="NEUROSCIENCE REPORT: 99.2% WILLPOWER BREAKDOWN" />

      {/* Pip Stickman Hero */}
      <Hero p={pipPose} look={LOOKS.pip} f={f} />

      {/* Giant Brain / Neural Wave HUD */}
      <g transform="translate(1280, 520)">
        <rect x={-280} y={-180} width={560} height={360} rx={24} fill="#1E1015" stroke="#EF4444" strokeWidth={4} />

        <text x={0} y={-120} fill="#EF4444" fontSize={26} fontWeight="900" textAnchor="middle">
          PREFRONTAL CORTEX SPIKE
        </text>
        <text x={0} y={-80} fill="#FCA5A5" fontSize={18} fontWeight="bold" textAnchor="middle">
          NEURAL STRESS: +400%
        </text>

        {/* Pulse waveform */}
        <path
          d={`M -240 10 Q -180 ${-50 + Math.sin(f * 0.3) * 30} -120 10 T 0 10 T 120 10 T 240 10`}
          fill="none"
          stroke="#EF4444"
          strokeWidth={4}
        />

        <rect x={-220} y={50} width={440} height={70} rx={14} fill="#3B0715" stroke="#F87171" strokeWidth={2} />
        <text x={0} y={78} fill="#FFFFFF" fontSize={16} fontWeight="bold" textAnchor="middle">
          MANUAL BREATHING: ACTIVATED
        </text>
        <text x={0} y={102} fill="#FCA5A5" fontSize={14} textAnchor="middle">
          Your brain cannot ignore this command.
        </text>
      </g>
    </g>
  );
};

// =========================================================================
// CHAPTER 4: THE 4TH-WALL BREAKDOWN (THE SCREEN FREEZE TRAP)
// =========================================================================
export const DontPauseCh4: React.FC<{ f: number }> = ({ f }) => {
  const glitch = Math.sin(f * 0.8) > 0.4;
  const shake = glitch ? Math.sin(f * 2.5) * 8 : 0;

  const pipPose = makePipPose(f, {
    x: 640 + shake,
    y: HIPS_Y,
    expr: 'shock',
    armL: { a: 110, b: 35 },
    armR: { a: 110, b: -35 },
  });

  return (
    <g>
      <image href={staticFile('dont-pause/bg_subway_platform.jpg')} x={0} y={0} width={1920} height={1080} preserveAspectRatio="xMidYMid slice" />
      <rect x={0} y={0} width={1920} height={1080} fill="rgba(10, 15, 26, 0.5)" />

      <CautionBanner y={0} text="SYSTEM WARNING: 4TH WALL BUFFER OVERFLOW" />

      {/* Pip Stickman Hero */}
      <Hero p={pipPose} look={LOOKS.pip} f={f} />

      {/* Glitch Cubes */}
      {glitch && (
        <g>
          {Array.from({ length: 16 }).map((_, i) => (
            <rect
              key={i}
              x={640 + Math.sin(i * 3 + f) * 140}
              y={380 + Math.cos(i * 2 + f) * 120}
              width={24}
              height={24}
              fill={i % 2 === 0 ? '#EF4444' : '#F59E0B'}
              opacity={0.85}
            />
          ))}
        </g>
      )}

      {/* Algorithmic Predictive Model Breaker */}
      <g transform="translate(1280, 520)">
        <rect x={-260} y={-150} width={520} height={300} rx={24} fill="#090D16" stroke="#10B981" strokeWidth={4} />
        <text x={0} y={-95} fill="#10B981" fontSize={24} fontWeight="900" textAnchor="middle">
          ALGORITHM ANOMALY
        </text>
        <text x={0} y={-55} fill="#A7F3D0" fontSize={16} fontWeight="bold" textAnchor="middle">
          PREDICTED PAUSE TIME: 0:14
        </text>
        <text x={0} y={-20} fill="#FFFFFF" fontSize={22} fontWeight="900" textAnchor="middle">
          STATUS: FAILED TO PREDICT YOU
        </text>

        <rect x={-220} y={25} width={440} height={70} rx={12} fill="#064E3B" stroke="#34D399" strokeWidth={2} />
        <text x={0} y={55} fill="#34D399" fontSize={16} fontWeight="bold" textAnchor="middle">
          WILLPOWER: TOP 0.1%
        </text>
        <text x={0} y={78} fill="#FFFFFF" fontSize={14} textAnchor="middle">
          You refused to hit the pause button.
        </text>
      </g>
    </g>
  );
};

// =========================================================================
// CHAPTER 5: THE FORBIDDEN CHOICE (OPTION A VS OPTION B INTERACTIVE DILEMMA)
// =========================================================================
export const DontPauseCh5: React.FC<{ f: number }> = ({ f }) => {
  const pipPose = makePipPose(f, {
    x: 960,
    y: 770,
    expr: 'worried',
    ...POSE_WARNING_STOP,
  });

  return (
    <g>
      <image href={staticFile('dont-pause/bg_warm_room.jpg')} x={0} y={0} width={1920} height={1080} preserveAspectRatio="xMidYMid slice" />
      <rect x={0} y={0} width={1920} height={1080} fill="rgba(12, 10, 20, 0.65)" />

      <CautionBanner y={0} text="FINAL CHALLENGE: CHOOSE YOUR ACTION" />

      {/* OPTION A CARD (LEFT) */}
      <g transform="translate(480, 480)">
        <rect x={-250} y={-220} width={500} height={440} rx={28} fill="rgba(20, 10, 15, 0.95)" stroke="#EF4444" strokeWidth={5} />
        {/* Badge */}
        <rect x={-140} y={-250} width={280} height={56} rx={16} fill="#EF4444" />
        <text x={0} y={-215} fill="#FFFFFF" fontSize={24} fontWeight="900" fontFamily="sans-serif" textAnchor="middle">
          OPTION A
        </text>

        <text x={0} y={-140} fill="#EF4444" fontSize={30} fontWeight="900" textAnchor="middle">
          HIT PAUSE NOW
        </text>
        <text x={0} y={-80} fill="#E2E8F0" fontSize={18} fontWeight="bold" textAnchor="middle">
          ✕ Admit Defeat
        </text>
        <text x={0} y={-45} fill="#E2E8F0" fontSize={18} fontWeight="bold" textAnchor="middle">
          ✕ Amygdala Won The Battle
        </text>
        <text x={0} y={15} fill="#FCA5A5" fontSize={19} fontWeight="900" textAnchor="middle">
          💬 PENALTY:
        </text>
        <text x={0} y={55} fill="#FFFFFF" fontSize={16} fontWeight="bold" textAnchor="middle">
          Comment Your Phone Battery %
        </text>

        <rect x={-180} y={110} width={360} height={60} rx={14} fill="#DC2626" stroke="#FFFFFF" strokeWidth={2} />
        <text x={0} y={148} fill="#FFFFFF" fontSize={22} fontWeight="900" textAnchor="middle">
          I ADMIT DEFEAT
        </text>
      </g>

      {/* OPTION B CARD (RIGHT) */}
      <g transform="translate(1440, 480)">
        <rect x={-250} y={-220} width={500} height={440} rx={28} fill="rgba(10, 20, 18, 0.95)" stroke="#10B981" strokeWidth={5} />
        {/* Badge */}
        <rect x={-140} y={-250} width={280} height={56} rx={16} fill="#10B981" />
        <text x={0} y={-215} fill="#FFFFFF" fontSize={24} fontWeight="900" fontFamily="sans-serif" textAnchor="middle">
          OPTION B
        </text>

        <text x={0} y={-140} fill="#34D399" fontSize={30} fontWeight="900" textAnchor="middle">
          NEVER PAUSE
        </text>
        <text x={0} y={-80} fill="#E2E8F0" fontSize={18} fontWeight="bold" textAnchor="middle">
          ✓ 100% Mental Discipline
        </text>
        <text x={0} y={-45} fill="#E2E8F0" fontSize={18} fontWeight="bold" textAnchor="middle">
          ✓ Beat The Algorithmic Trap
        </text>
        <text x={0} y={15} fill="#A7F3D0" fontSize={19} fontWeight="900" textAnchor="middle">
          💬 VICTORY:
        </text>
        <text x={0} y={55} fill="#FFFFFF" fontSize={16} fontWeight="bold" textAnchor="middle">
          Comment: "I WON" Below
        </text>

        <rect x={-180} y={110} width={360} height={60} rx={14} fill="#059669" stroke="#FFFFFF" strokeWidth={2} />
        <text x={0} y={148} fill="#FFFFFF" fontSize={22} fontWeight="900" textAnchor="middle">
          I CONQUERED IT
        </text>
      </g>

      {/* Pip Stickman in Center */}
      <Hero p={pipPose} look={LOOKS.pip} f={f} />

      {/* Bottom Reverse CTA Banner */}
      <g transform="translate(960, 1010)">
        <rect x={-450} y={-35} width={900} height={70} rx={18} fill="#0F172A" stroke="#EF4444" strokeWidth={3} />
        <text x={0} y={8} fill="#FCA5A5" fontSize={22} fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">
          WHATEVER YOU DO, DO NOT SUBSCRIBE TO WHAT-EIF!
        </text>
      </g>
    </g>
  );
};

// =========================================================================
// SHORT COMPONENT: 9:16 VERTICAL (100% INFINITE SEAMLESS LOOP & EXACT MATCH)
// =========================================================================
export const DontPauseShort: React.FC<{ f: number }> = ({ f }) => {
  // Pacing: 741 frames across ~24.7s
  // Scene 1: 0-180 (~6.0s) - Direct Warning & Thumb Hook
  // Scene 2: 180-360 (~6.0s) - Subliminal flash flicker
  // Scene 3: 360-540 (~6.0s) - Neuroscience & 99% fail rate
  // Scene 4: 540-741 (~6.7s) - Seamless Loop back to start!

  const scene = f < 180 ? 1 : f < 360 ? 2 : f < 540 ? 3 : 4;
  const isFlash = scene === 2 && f % 40 === 18;

  const pipPose = makePipPose(f, {
    x: 540,
    y: 1320,
    expr: scene === 1 ? 'shock' : scene === 2 ? 'worried' : scene === 3 ? 'dizzy' : 'shock',
    ...(scene === 1 ? POSE_WARNING_STOP : scene === 2 ? POSE_POINT_FORWARD : scene === 3 ? POSE_HEADACHE : POSE_WARNING_STOP),
  });

  return (
    <g>
      {/* Background Image */}
      <image href={staticFile('dont-pause/bg_empty_bedroom.jpg')} x={-400} y={0} width={1880} height={1920} preserveAspectRatio="xMidYMid slice" />
      <rect x={0} y={0} width={1080} height={1920} fill="rgba(14, 8, 20, 0.55)" />

      {/* Top Floating Hook Headline (Matching Thumbnail) */}
      <g transform="translate(540, 240)">
        <rect x={-460} y={-80} width={920} height={160} rx={28} fill="rgba(20, 10, 15, 0.95)" stroke="#EF4444" strokeWidth={5} />
        <text x={0} y={-15} fill="#FFFFFF" fontSize={38} fontWeight="900" fontFamily="sans-serif" textAnchor="middle">
          DO NOT PAUSE
        </text>
        <text x={0} y={45} fill="#EF4444" fontSize={44} fontWeight="900" fontFamily="sans-serif" textAnchor="middle">
          THIS VIDEO ⏸️
        </text>
      </g>

      {/* Giant Holographic Pause Icon (Prominently Placed in Center) */}
      <HolographicPause x={540} y={660} frame={f} scale={1.8} />

      {/* Subliminal Flash in Scene 2 */}
      {isFlash && (
        <g transform="translate(540, 660)">
          <rect x={-360} y={-160} width={720} height={320} rx={24} fill="#EF4444" stroke="#FFFFFF" strokeWidth={6} />
          <text x={0} y={-30} fill="#FFFFFF" fontSize={42} fontWeight="900" textAnchor="middle">
            DID YOU PAUSE?
          </text>
          <text x={0} y={35} fill="#FDE68A" fontSize={30} fontWeight="bold" textAnchor="middle">
            SECRET CODE: 404
          </text>
        </g>
      )}

      {/* Fail Badge in Scene 3 */}
      {scene === 3 && (
        <g transform="translate(540, 960)">
          <rect x={-340} y={-45} width={680} height={90} rx={20} fill="#DC2626" stroke="#FFFFFF" strokeWidth={3} />
          <text x={0} y={15} fill="#FFFFFF" fontSize={26} fontWeight="900" textAnchor="middle">
            ⚠️ 99% OF PEOPLE FAIL HERE
          </text>
        </g>
      )}

      {/* Pip Stickman Hero (Exact Warning Pose) */}
      <Hero p={pipPose} look={LOOKS.pip} f={f} />

      {/* Bottom Looping Hook Prompt for infinite Shorts replay */}
      {scene === 4 && (
        <g transform="translate(540, 1680)">
          <rect x={-380} y={-40} width={760} height={80} rx={20} fill="#1E1015" stroke="#EF4444" strokeWidth={3} />
          <text x={0} y={10} fill="#FCA5A5" fontSize={22} fontWeight="bold" textAnchor="middle">
            🔄 DID YOU SMASH PAUSE? WATCH AGAIN!
          </text>
        </g>
      )}
    </g>
  );
};

