import React from 'react';
import { interpolate, spring, staticFile } from 'remotion';
import { Hero, LOOKS } from '../../engine';

const HIPS_Y = 687;

// =========================================================================
// 1. CHAPTER 1: THE BIO-POD IN THE BASEMENT (768 frames)
// =========================================================================
export const FiveClonesCh1: React.FC<{ f?: number; frame?: number }> = ({ f, frame }) => {
  const currentF = f ?? frame ?? 0;
  const podGlow = Math.sin(currentF * 0.12) * 0.25 + 0.75;
  const zoom = interpolate(currentF, [0, 768], [1.0, 1.05], { extrapolateRight: 'clamp' });

  // Phase transition: mist and clones emerge after frame 320
  const isEmerge = currentF >= 320;
  const cloneOpacity = interpolate(currentF, [320, 380], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const mistPulse = Math.sin(currentF * 0.18) * 0.15 + 0.35;

  return (
    <g transform={`scale(${zoom}) translate(${-(zoom - 1) * 960} ${-(zoom - 1) * 540})`}>
      {/* Background: Bio-Lab cryogenic pods */}
      <image
        href={staticFile('five-clones/bg_biolab_pods.jpg')}
        width={1920}
        height={1080}
        preserveAspectRatio="xMidYMid slice"
        opacity={0.92}
      />
      <rect width={1920} height={1080} fill="#050814" opacity={0.25} />

      {/* Floating Mystery Badge */}
      <g transform="translate(960, 130)">
        <rect x={-280} y={-45} width={560} height={90} rx={18} fill="rgba(15, 23, 42, 0.94)" stroke="#10B981" strokeWidth={3} />
        <text x={0} y={-5} fill="#10B981" fontSize={28} fontWeight="900" fontFamily="system-ui, sans-serif" textAnchor="middle" letterSpacing="2px">
          BIOPRINTING POD DISCOVERED
        </text>
        <text x={0} y={30} fill="#FDE047" fontSize={22} fontWeight="bold" fontFamily="system-ui, sans-serif" textAnchor="middle">
          5 IDENTICAL BIOLOGICAL COPIES
        </text>
      </g>

      {/* Glowing Bio-Fluid Mist */}
      <circle cx={960} cy={720} r={280 * podGlow} fill="#10B981" opacity={mistPulse} />

      {!isEmerge ? (
        /* Inspecting Pip */
        <Hero
          pose={{
            x: 760,
            y: HIPS_Y,
            scale: 1.15,
            facing: 1,
            expr: 'neutral',
            armL: { fold: 0.4, raise: 0.2 },
            armR: { fold: 0.6, raise: 0.4 },
          }}
          look={LOOKS.pip}
        />
      ) : (
        /* 5 Clones Standing in Formation */
        <g opacity={cloneOpacity}>
          <Hero pose={{ x: 380, y: HIPS_Y + 15, scale: 0.95, facing: 1, expr: 'happy', armL: { fold: 0.2, raise: 0.1 }, armR: { fold: 0.2, raise: 0.1 } }} look={LOOKS.pip} />
          <Hero pose={{ x: 620, y: HIPS_Y + 10, scale: 1.0, facing: 1, expr: 'happy', armL: { fold: 0.3, raise: 0.2 }, armR: { fold: 0.3, raise: 0.2 } }} look={LOOKS.pip} />
          <Hero pose={{ x: 860, y: HIPS_Y, scale: 1.05, facing: 1, expr: 'smug', armL: { fold: 0.4, raise: 0.2 }, armR: { fold: 0.4, raise: 0.2 } }} look={LOOKS.pip} />
          <Hero pose={{ x: 1100, y: HIPS_Y + 10, scale: 1.0, facing: -1, expr: 'happy', armL: { fold: 0.3, raise: 0.2 }, armR: { fold: 0.3, raise: 0.2 } }} look={LOOKS.pip} />
          <Hero pose={{ x: 1340, y: HIPS_Y + 15, scale: 0.95, facing: -1, expr: 'happy', armL: { fold: 0.2, raise: 0.1 }, armR: { fold: 0.2, raise: 0.1 } }} look={LOOKS.pip} />

          {/* Original Shocked Pip in foreground */}
          <Hero pose={{ x: 1600, y: HIPS_Y, scale: 1.15, facing: -1, expr: 'shock', armL: { fold: 0.7, raise: 0.5 }, armR: { fold: 0.7, raise: 0.5 } }} look={LOOKS.pip} />
        </g>
      )}
    </g>
  );
};

// =========================================================================
// 2. CHAPTER 2: THE PERFECT UTOPIA (878 frames)
// =========================================================================
export const FiveClonesCh2: React.FC<{ f?: number; frame?: number }> = ({ f, frame }) => {
  const currentF = f ?? frame ?? 0;
  const zoom = interpolate(currentF, [0, 878], [1.0, 1.04], { extrapolateRight: 'clamp' });

  // Cash counter animation
  const cashAmount = Math.min(240000, Math.floor(interpolate(currentF, [0, 800], [10000, 240000])));

  return (
    <g transform={`scale(${zoom}) translate(${-(zoom - 1) * 960} ${-(zoom - 1) * 540})`}>
      {/* Background: Penthouse Living Room */}
      <image
        href={staticFile('five-clones/bg_living_room_couch.jpg')}
        width={1920}
        height={1080}
        preserveAspectRatio="xMidYMid slice"
        opacity={0.92}
      />
      <rect width={1920} height={1080} fill="#050814" opacity={0.25} />

      {/* Floating HUD Badges */}
      <g transform="translate(420, 140)">
        <rect x={-200} y={-40} width={400} height={80} rx={16} fill="rgba(15, 23, 42, 0.94)" stroke="#22C55E" strokeWidth={3} />
        <text x={0} y={-5} fill="#22C55E" fontSize={22} fontWeight="900" fontFamily="system-ui, sans-serif" textAnchor="middle">
          CLONE 1: FINANCE DESK
        </text>
        <text x={0} y={24} fill="#FFFFFF" fontSize={20} fontWeight="bold" fontFamily="system-ui, sans-serif" textAnchor="middle">
          ${cashAmount.toLocaleString()} EARNED
        </text>
      </g>

      <g transform="translate(1500, 140)">
        <rect x={-200} y={-40} width={400} height={80} rx={16} fill="rgba(15, 23, 42, 0.94)" stroke="#38BDF8" strokeWidth={3} />
        <text x={0} y={-5} fill="#38BDF8" fontSize={22} fontWeight="900" fontFamily="system-ui, sans-serif" textAnchor="middle">
          CLONE 2 & 3: INTELLECT & GYM
        </text>
        <text x={0} y={24} fill="#FDE047" fontSize={18} fontWeight="bold" fontFamily="system-ui, sans-serif" textAnchor="middle">
          QUANTUM PHYSICS & 6-PACK ABS
        </text>
      </g>

      {/* Hardworking Clones in background */}
      {/* Clone 1 working at desk */}
      <Hero pose={{ x: 340, y: HIPS_Y + 10, scale: 0.9, facing: 1, expr: 'neutral', armL: { fold: 0.8, raise: 0.3 }, armR: { fold: 0.8, raise: 0.3 } }} look={LOOKS.pip} />
      {/* Clone 2 working out */}
      <Hero pose={{ x: 1420, y: HIPS_Y + 10, scale: 0.9, facing: -1, expr: 'smug', armL: { fold: 0.9, raise: 0.8 }, armR: { fold: 0.9, raise: 0.8 } }} look={LOOKS.pip} />
      {/* Clone 3 studying */}
      <Hero pose={{ x: 1640, y: HIPS_Y + 10, scale: 0.9, facing: -1, expr: 'neutral', armL: { fold: 0.5, raise: 0.4 }, armR: { fold: 0.5, raise: 0.4 } }} look={LOOKS.pip} />

      {/* Original Pip Lounging on Couch Playing Games */}
      <g transform="translate(920, 680)">
        {/* Modern Sectional Couch */}
        <rect x={-220} y={-50} width={440} height={120} rx={24} fill="#1E293B" stroke="#334155" strokeWidth={3} />
        <rect x={-200} y={-110} width={400} height={70} rx={18} fill="#0F172A" />

        {/* Original Pip Chilling */}
        <Hero
          pose={{
            x: 0,
            y: 0,
            scale: 1.15,
            facing: 1,
            expr: 'cool',
            armL: { fold: 0.7, raise: 0.4 },
            armR: { fold: 0.7, raise: 0.4 },
          }}
          look={LOOKS.pip}
        />
        {/* Game Controller in hands */}
        <rect x={-24} y={-45} width={48} height={26} rx={8} fill="#38BDF8" stroke="#0F172A" strokeWidth={2} />
      </g>
    </g>
  );
};

// =========================================================================
// 3. CHAPTER 3: THE SILENT WHISPERS (808 frames)
// =========================================================================
export const FiveClonesCh3: React.FC<{ f?: number; frame?: number }> = ({ f, frame }) => {
  const currentF = f ?? frame ?? 0;
  const isTurn = currentF >= 360;
  const turnPulse = isTurn ? Math.sin(currentF * 0.1) * 0.2 + 0.8 : 0;

  return (
    <g>
      {/* Background: Dark Kitchen Whispers */}
      <image
        href={staticFile('five-clones/bg_kitchen_whispers.jpg')}
        width={1920}
        height={1080}
        preserveAspectRatio="xMidYMid slice"
        opacity={0.92}
      />
      <rect width={1920} height={1080} fill="#030712" opacity={0.35} />

      {/* Eerie Warning Badge */}
      <g transform="translate(960, 130)">
        <rect x={-260} y={-45} width={520} height={90} rx={18} fill="rgba(15, 23, 42, 0.94)" stroke={isTurn ? '#EF4444' : '#F59E0B'} strokeWidth={3} />
        <text x={0} y={-5} fill={isTurn ? '#EF4444' : '#F59E0B'} fontSize={28} fontWeight="900" fontFamily="system-ui, sans-serif" textAnchor="middle" letterSpacing="2px">
          {isTurn ? 'THE SILENT MUTINY' : 'PARADISE ROTS (MONTH 4)'}
        </text>
        <text x={0} y={30} fill="#E2E8F0" fontSize={20} fontWeight="bold" fontFamily="system-ui, sans-serif" textAnchor="middle">
          {isTurn ? '"WHY FUND A ZERO-VALUE COMPONENT?"' : 'WHISPERS IN THE DARK KITCHEN'}
        </text>
      </g>

      {/* Red Hazard Pulse when they turn on him */}
      {isTurn && <circle cx={600} cy={680} r={280 * turnPulse} fill="#EF4444" opacity={0.2} />}

      {/* 3 Clones in Kitchen */}
      {!isTurn ? (
        /* Whispering huddled together */
        <g>
          <Hero pose={{ x: 480, y: HIPS_Y, scale: 1.05, facing: 1, expr: 'smug', armL: { fold: 0.6, raise: 0.3 }, armR: { fold: 0.6, raise: 0.3 } }} look={LOOKS.pip} />
          <Hero pose={{ x: 620, y: HIPS_Y, scale: 1.08, facing: -1, expr: 'neutral', armL: { fold: 0.7, raise: 0.4 }, armR: { fold: 0.7, raise: 0.4 } }} look={LOOKS.pip} />
          <Hero pose={{ x: 760, y: HIPS_Y, scale: 1.05, facing: -1, expr: 'smug', armL: { fold: 0.5, raise: 0.2 }, armR: { fold: 0.5, raise: 0.2 } }} look={LOOKS.pip} />
        </g>
      ) : (
        /* Frozen stone cold, glaring at Original Pip */
        <g>
          <Hero pose={{ x: 480, y: HIPS_Y, scale: 1.05, facing: 1, expr: 'neutral', armL: { fold: 0.9, raise: 0.5 }, armR: { fold: 0.9, raise: 0.5 } }} look={LOOKS.pip} />
          <Hero pose={{ x: 640, y: HIPS_Y, scale: 1.1, facing: 1, expr: 'smug', armL: { fold: 0.8, raise: 0.4 }, armR: { fold: 0.8, raise: 0.4 } }} look={LOOKS.pip} />
          <Hero pose={{ x: 800, y: HIPS_Y, scale: 1.05, facing: 1, expr: 'neutral', armL: { fold: 0.8, raise: 0.4 }, armR: { fold: 0.8, raise: 0.4 } }} look={LOOKS.pip} />
        </g>
      )}

      {/* Original Pip entering kitchen shocked */}
      <Hero
        pose={{
          x: 1480,
          y: HIPS_Y,
          scale: 1.15,
          facing: -1,
          expr: isTurn ? 'worried' : 'neutral',
          armL: { fold: 0.4, raise: 0.2 },
          armR: { fold: 0.4, raise: 0.2 },
        }}
        look={LOOKS.pip}
      />
    </g>
  );
};

// =========================================================================
// 4. CHAPTER 4: THE BOARDROOM COUP (823 frames)
// =========================================================================
export const FiveClonesCh4: React.FC<{ f?: number; frame?: number }> = ({ f, frame }) => {
  const currentF = f ?? frame ?? 0;
  const lightFlicker = Math.sin(currentF * 0.4) > 0.92 ? 0.35 : 0.85;

  return (
    <g>
      {/* Background: Interrogation Basement */}
      <image
        href={staticFile('five-clones/bg_interrogation_room.jpg')}
        width={1920}
        height={1080}
        preserveAspectRatio="xMidYMid slice"
        opacity={lightFlicker}
      />
      <rect width={1920} height={1080} fill="#050814" opacity={0.3} />

      {/* Dramatic Overhead Conical Spotlight */}
      <polygon points="960,0 640,840 1280,840" fill="#FEF08A" opacity={0.14 * lightFlicker} />

      {/* Floating Evaluation Verdict */}
      <g transform="translate(960, 130)">
        <rect x={-270} y={-45} width={540} height={90} rx={18} fill="rgba(15, 23, 42, 0.95)" stroke="#EF4444" strokeWidth={3} />
        <text x={0} y={-5} fill="#EF4444" fontSize={28} fontWeight="900" fontFamily="system-ui, sans-serif" textAnchor="middle" letterSpacing="2px">
          VERDICT: DEFECTIVE COMPONENT
        </text>
        <text x={0} y={30} fill="#FFFFFF" fontSize={20} fontWeight="bold" fontFamily="system-ui, sans-serif" textAnchor="middle">
          UNANIMOUS VOTE TO REPLACE ORIGINAL
        </text>
      </g>

      {/* Steel Folding Chair & Ropes */}
      <g transform="translate(960, 680)">
        <rect x={-30} y={-40} width={60} height={100} rx={8} fill="#475569" stroke="#1E293B" strokeWidth={3} />
        {/* Ropes bound around Pip */}
        <line x1={-35} y1={-15} x2={35} y2={-15} stroke="#D97706" strokeWidth={5} />
        <line x1={-35} y1={10} x2={35} y2={10} stroke="#D97706" strokeWidth={5} />
        <line x1={-35} y1={35} x2={35} y2={35} stroke="#D97706" strokeWidth={5} />

        {/* Original Pip tied down and terrified */}
        <Hero
          pose={{
            x: 0,
            y: 0,
            scale: 1.15,
            facing: 1,
            expr: 'shock',
            armL: { fold: 0.9, raise: 0.2 },
            armR: { fold: 0.9, raise: 0.2 },
          }}
          look={LOOKS.pip}
        />
      </g>

      {/* Surrounding Clones Judging Him */}
      {/* Clone 1 & 2 Left */}
      <Hero pose={{ x: 380, y: HIPS_Y, scale: 1.05, facing: 1, expr: 'smug', armL: { fold: 0.8, raise: 0.4 }, armR: { fold: 0.8, raise: 0.4 } }} look={LOOKS.pip} />
      <Hero pose={{ x: 560, y: HIPS_Y + 10, scale: 1.08, facing: 1, expr: 'neutral', armL: { fold: 0.8, raise: 0.4 }, armR: { fold: 0.8, raise: 0.4 } }} look={LOOKS.pip} />

      {/* Clone 3 (Leader with clipboard) */}
      <Hero pose={{ x: 1360, y: HIPS_Y, scale: 1.12, facing: -1, expr: 'smug', armL: { fold: 0.6, raise: 0.3 }, armR: { fold: 0.7, raise: 0.5 } }} look={LOOKS.pip} />
      {/* Clipboard in hand */}
      <rect x={1260} y={580} width={40} height={55} rx={4} fill="#F8FAFC" stroke="#0F172A" strokeWidth={2} />

      {/* Clone 4 & 5 Right */}
      <Hero pose={{ x: 1540, y: HIPS_Y + 10, scale: 1.05, facing: -1, expr: 'neutral', armL: { fold: 0.8, raise: 0.4 }, armR: { fold: 0.8, raise: 0.4 } }} look={LOOKS.pip} />
    </g>
  );
};

// =========================================================================
// 5. CHAPTER 5: THE FINAL CHOICE & INTERACTIVE CARD (722 frames)
// =========================================================================
export const FiveClonesCh5: React.FC<{ f?: number; frame?: number }> = ({ f, frame }) => {
  const currentF = f ?? frame ?? 0;

  // Transition to interactive end card at frame 360
  const isTransition = currentF >= 360;
  const pipX = interpolate(currentF, [360, 420], [740, 360], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const cardOpacity = interpolate(currentF, [390, 430], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const cardSlide = interpolate(currentF, [390, 430], [120, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <g>
      {/* Background: Interrogation Room */}
      <image
        href={staticFile('five-clones/bg_interrogation_room.jpg')}
        width={1920}
        height={1080}
        preserveAspectRatio="xMidYMid slice"
        opacity={0.92}
      />
      <rect width={1920} height={1080} fill="#050814" opacity={0.3} />

      {/* Glowing Remote Detonator Button pulsing in sock */}
      {!isTransition && (
        <g transform="translate(740, 780)">
          <circle cx={-18} cy={0} r={12} fill="#EF4444" />
          <circle cx={-18} cy={0} r={18} fill="#EF4444" opacity={0.3} />
        </g>
      )}

      {/* Pip Stickman */}
      <Hero
        pose={{
          x: pipX,
          y: HIPS_Y,
          scale: 1.15,
          facing: 1,
          expr: isTransition ? 'smug' : 'worried',
          armL: isTransition ? { fold: 0.3, raise: 0.1 } : { fold: 0.6, raise: 0.5 },
          armR: isTransition ? { fold: 0.8, raise: 0.6 } : { fold: 0.8, raise: 0.7 },
        }}
        look={LOOKS.pip}
      />

      {/* ================================================================= */}
      {/* MANDATORY INTERACTIVE CHOICE QUESTION CARD (Option A vs Option B) */}
      {/* ================================================================= */}
      {isTransition && (
        <g transform={`translate(1140, ${500 + cardSlide})`} opacity={cardOpacity}>
          {/* Card Backplate */}
          <rect x={-360} y={-240} width={720} height={480} rx={28} fill="rgba(15, 23, 42, 0.96)" stroke="#F59E0B" strokeWidth={4} />

          {/* Glowing Header */}
          <rect x={-330} y={-215} width={660} height={60} rx={14} fill="#1E293B" stroke="#38BDF8" strokeWidth={2} />
          <text x={0} y={-175} fill="#FFFFFF" fontSize={30} fontWeight="900" fontFamily="system-ui, sans-serif" textAnchor="middle" letterSpacing="2px">
            💬 WHAT WOULD YOU DO?
          </text>

          {/* Question Text */}
          <text x={0} y={-115} fill="#94A3B8" fontSize={22} fontWeight="600" fontFamily="system-ui, sans-serif" textAnchor="middle">
            The 5 clones are about to replace you forever:
          </text>

          {/* Option A Box */}
          <g transform="translate(0, -40)">
            <rect x={-320} y={-45} width={640} height={90} rx={16} fill="rgba(30, 41, 59, 0.9)" stroke="#EF4444" strokeWidth={3} />
            <text x={-290} y={-5} fill="#EF4444" fontSize={24} fontWeight="900" fontFamily="system-ui, sans-serif">
              👉 OPTION A: TERMINATE ALL 5 CLONES!
            </text>
            <text x={-290} y={26} fill="#E2E8F0" fontSize={18} fontWeight="500" fontFamily="system-ui, sans-serif">
              "Press the emergency kill switch & do all the work alone."
            </text>
          </g>

          {/* Option B Box */}
          <g transform="translate(0, 80)">
            <rect x={-320} y={-45} width={640} height={90} rx={16} fill="rgba(30, 41, 59, 0.9)" stroke="#38BDF8" strokeWidth={3} />
            <text x={-290} y={-5} fill="#38BDF8" fontSize={24} fontWeight="900" fontFamily="system-ui, sans-serif">
              👉 OPTION B: SURRENDER YOUR CONTROL!
            </text>
            <text x={-290} y={26} fill="#E2E8F0" fontSize={18} fontWeight="500" fontFamily="system-ui, sans-serif">
              "Let the superior clones rule the world while you live in hiding."
            </text>
          </g>

          {/* Call to action */}
          <text x={0} y={185} fill="#FDE047" fontSize={22} fontWeight="900" fontFamily="system-ui, sans-serif" textAnchor="middle">
            👇 DROP YOUR CHOICE IN THE COMMENTS BELOW! 👇
          </text>
        </g>
      )}
    </g>
  );
};

// =========================================================================
// 6. SHORT COMPOSITION (1161 frames)
// =========================================================================
export const FiveClonesShort: React.FC<{ f?: number; frame?: number }> = ({ f, frame }) => {
  const currentF = f ?? frame ?? 0;

  if (currentF < 260) {
    return <FiveClonesCh1 f={currentF} />;
  } else if (currentF < 540) {
    return <FiveClonesCh2 f={currentF - 260 + 100} />;
  } else if (currentF < 820) {
    return <FiveClonesCh4 f={currentF - 540 + 50} />;
  } else {
    return <FiveClonesCh5 f={currentF - 820 + 360} />;
  }
};

