import React from 'react';
import { interpolate, spring, staticFile } from 'remotion';
import { Hero, LOOKS } from '../../engine';

const GROUND_Y = 820;
const HIPS_Y = 687;

// =========================================================================
// 1. CHAPTER 1: THE INSTANT SILENCE (796 frames)
// =========================================================================
export const VanishedCh1: React.FC<{ f?: number; frame?: number }> = ({ f, frame }) => {
  const currentF = f ?? frame ?? 0;

  // Pip looking left, then right in panic
  const lookDir = Math.sin(currentF * 0.08);
  const facing = lookDir > 0 ? 1 : -1;
  const headLook = Math.sin(currentF * 0.12) * 8;

  // Camera slow cinematic zoom
  const zoom = interpolate(currentF, [0, 796], [1.0, 1.08], { extrapolateRight: 'clamp' });

  // Floating dust and paper blowing across the intersection
  const paperX1 = ((currentF * 8) % 2200) - 200;
  const paperY1 = 700 + Math.sin(currentF * 0.15) * 40;

  return (
    <g transform={`scale(${zoom}) translate(${-(zoom - 1) * 960} ${-(zoom - 1) * 540})`}>
      {/* Background: Empty 8-lane Intersection */}
      <image
        href={staticFile('vanished/bg_empty_intersection.jpg')}
        width={1920}
        height={1080}
        preserveAspectRatio="xMidYMid slice"
        opacity={0.92}
      />
      <rect width={1920} height={1080} fill="#050714" opacity={0.25} />

      {/* Floating ominous timestamp badge */}
      <g transform="translate(960, 140)">
        <rect x={-240} y={-45} width={480} height={90} rx={18} fill="rgba(15, 23, 42, 0.9)" stroke="#EF4444" strokeWidth={3} />
        <text x={0} y={-5} fill="#EF4444" fontSize={28} fontWeight="900" fontFamily="system-ui, sans-serif" textAnchor="middle" letterSpacing="2px">
          2:14 PM — TUESDAY
        </text>
        <text x={0} y={30} fill="#FDE047" fontSize={22} fontWeight="bold" fontFamily="system-ui, sans-serif" textAnchor="middle">
          8,000,000,000 PEOPLE VANISHED
        </text>
      </g>

      {/* Windblown trash / paper debris */}
      <g transform={`translate(${paperX1}, ${paperY1}) rotate(${currentF * 6})`}>
        <rect x={-15} y={-10} width={30} height={20} fill="#FFFFFF" opacity={0.7} rx={2} />
      </g>

      {/* Pip Stickman in center of the empty street */}
      <Hero
        pose={{
          x: 960,
          y: HIPS_Y,
          scale: 1.15,
          facing: facing as 1 | -1,
          expr: currentF < 250 ? 'shock' : 'worried',
          head: { look: { x: headLook, y: -2 }, tilt: headLook * 0.5 },
          armL: { fold: 0.4, raise: 0.3 },
          armR: { fold: 0.5, raise: 0.4 },
        }}
        look={LOOKS.pip}
      />
    </g>
  );
};

// =========================================================================
// 2. CHAPTER 2: THE GOLDEN WEEK (799 frames)
// =========================================================================
export const VanishedCh2: React.FC<{ f?: number; frame?: number }> = ({ f, frame }) => {
  const currentF = f ?? frame ?? 0;

  // Pip enjoying the billionaire penthouse
  const glassY = Math.sin(currentF * 0.1) * 8;
  const smugSway = Math.sin(currentF * 0.05) * 4;

  return (
    <g>
      {/* Background: Penthouse Luxury overlooking city */}
      <image
        href={staticFile('vanished/bg_penthouse_luxury.jpg')}
        width={1920}
        height={1080}
        preserveAspectRatio="xMidYMid slice"
        opacity={0.92}
      />
      <rect width={1920} height={1080} fill="#0F172A" opacity={0.2} />

      {/* Golden Badge: Day 7 Owner of Earth */}
      <g transform="translate(960, 140)">
        <rect x={-260} y={-45} width={520} height={90} rx={18} fill="rgba(15, 23, 42, 0.9)" stroke="#F59E0B" strokeWidth={3} />
        <text x={0} y={-5} fill="#FDE047" fontSize={28} fontWeight="900" fontFamily="system-ui, sans-serif" textAnchor="middle">
          DAY 7: ABSOLUTE FREEDOM
        </text>
        <text x={0} y={30} fill="#38BDF8" fontSize={22} fontWeight="bold" fontFamily="system-ui, sans-serif" textAnchor="middle">
          NO RENT. NO LAWS. SOLE OWNER OF EARTH.
        </text>
      </g>

      {/* Champagne / Golden Wine Glass floating near Pip */}
      <g transform={`translate(1080, ${580 + glassY})`}>
        <path d="M -15 0 L 15 0 L 8 25 L -8 25 Z" fill="#F59E0B" opacity={0.8} />
        <line x1={0} y1={25} x2={0} y2={45} stroke="#FFFFFF" strokeWidth={3} />
        <line x1={-12} y1={45} x2={12} y2={45} stroke="#FFFFFF" strokeWidth={3} />
      </g>

      {/* Pip Stickman in relaxed smug pose */}
      <Hero
        pose={{
          x: 960 + smugSway,
          y: HIPS_Y,
          scale: 1.15,
          facing: 1,
          expr: 'smug',
          armL: { fold: 0.3, raise: 0.1 },
          armR: { fold: 0.7, raise: 0.5 },
        }}
        look={LOOKS.pip}
      />
    </g>
  );
};

// =========================================================================
// 3. CHAPTER 3: THE DARKENING (757 frames)
// =========================================================================
export const VanishedCh3: React.FC<{ f?: number; frame?: number }> = ({ f, frame }) => {
  const currentF = f ?? frame ?? 0;

  // Flashlight beam animation
  const beamAngle = Math.sin(currentF * 0.08) * 12;
  const flicker = currentF % 45 === 0 ? 0.3 : 0.85;

  return (
    <g>
      {/* Background: Overgrown Abandoned Metropolis */}
      <image
        href={staticFile('vanished/bg_overgrown_city.jpg')}
        width={1920}
        height={1080}
        preserveAspectRatio="xMidYMid slice"
        opacity={0.9}
      />
      {/* Heavy darkness layer */}
      <rect width={1920} height={1080} fill="#050714" opacity={0.55} />

      {/* Badge: Day 30 - The Grid Collapses */}
      <g transform="translate(960, 140)">
        <rect x={-260} y={-45} width={520} height={90} rx={18} fill="rgba(15, 23, 42, 0.94)" stroke="#EF4444" strokeWidth={3} />
        <text x={0} y={-5} fill="#EF4444" fontSize={28} fontWeight="900" fontFamily="system-ui, sans-serif" textAnchor="middle">
          DAY 30: THE POWER DIES
        </text>
        <text x={0} y={30} fill="#94A3B8" fontSize={22} fontWeight="bold" fontFamily="system-ui, sans-serif" textAnchor="middle">
          TOTAL BLACKOUT & PACKS OF WILD DOGS
        </text>
      </g>

      {/* Flashlight Beam emitted from Pip's hand */}
      <g transform={`translate(860, 640) rotate(${beamAngle})`}>
        <polygon points="0,0 800,-160 800,160" fill="url(#flashBeam)" opacity={flicker} />
      </g>

      <defs>
        <linearGradient id="flashBeam" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#FEF08A" stopOpacity="0.0" />
        </linearGradient>
      </defs>

      {/* Pip Stickman holding flashlight in fear */}
      <Hero
        pose={{
          x: 820,
          y: HIPS_Y,
          scale: 1.15,
          facing: 1,
          expr: 'worried',
          armL: { fold: 0.2, raise: 0.1 },
          armR: { fold: 0.8, raise: 0.4 },
        }}
        look={LOOKS.pip}
      />
    </g>
  );
};

// =========================================================================
// 4. CHAPTER 4: THE MIND FRACTURES (758 frames)
// =========================================================================
export const VanishedCh4: React.FC<{ f?: number; frame?: number }> = ({ f, frame }) => {
  const currentF = f ?? frame ?? 0;

  return (
    <g>
      {/* Background: Penthouse darkened to candlelight */}
      <image
        href={staticFile('vanished/bg_penthouse_luxury.jpg')}
        width={1920}
        height={1080}
        preserveAspectRatio="xMidYMid slice"
        opacity={0.65}
      />
      <rect width={1920} height={1080} fill="#0A0612" opacity={0.6} />

      {/* Badge: Month 6 Isolation */}
      <g transform="translate(960, 140)">
        <rect x={-260} y={-45} width={520} height={90} rx={18} fill="rgba(15, 23, 42, 0.94)" stroke="#A855F7" strokeWidth={3} />
        <text x={0} y={-5} fill="#C084FC" fontSize={28} fontWeight="900" fontFamily="system-ui, sans-serif" textAnchor="middle">
          MONTH 6: THE SILENCE BITES
        </text>
        <text x={0} y={30} fill="#E2E8F0" fontSize={22} fontWeight="bold" fontFamily="system-ui, sans-serif" textAnchor="middle">
          TALKING TO MANNEQUINS FOR COMPANY
        </text>
      </g>

      {/* Candle flicker glow on table */}
      <circle cx={960} cy={680} r={180 + Math.sin(currentF * 0.3) * 15} fill="#F59E0B" opacity={0.15} />

      {/* Mannequin 1 (Left) */}
      <g transform="translate(680, 560)">
        <circle cx={0} cy={-80} r={35} fill="#64748B" />
        <rect x={-25} y={-40} width={50} height={180} rx={12} fill="#334155" />
        <text x={0} y={-130} fill="#94A3B8" fontSize={20} fontFamily="system-ui, sans-serif" textAnchor="middle">
          "BOB"
        </text>
      </g>

      {/* Mannequin 2 (Right) */}
      <g transform="translate(1240, 560)">
        <circle cx={0} cy={-80} r={35} fill="#64748B" />
        <rect x={-25} y={-40} width={50} height={180} rx={12} fill="#334155" />
        <text x={0} y={-130} fill="#94A3B8" fontSize={20} fontFamily="system-ui, sans-serif" textAnchor="middle">
          "SARAH"
        </text>
      </g>

      {/* Pip talking animatedly to mannequins */}
      <Hero
        pose={{
          x: 960,
          y: HIPS_Y,
          scale: 1.15,
          facing: Math.sin(currentF * 0.08) > 0 ? 1 : -1,
          expr: 'dizzy',
          armL: { fold: 0.6, raise: 0.4 + Math.sin(currentF * 0.2) * 0.1 },
          armR: { fold: 0.6, raise: 0.4 - Math.sin(currentF * 0.2) * 0.1 },
        }}
        look={LOOKS.pip}
      />
    </g>
  );
};

// =========================================================================
// 5. CHAPTER 5: THE KNOCK ON THE DOOR & INTERACTIVE CARD (1206 frames)
// =========================================================================
export const VanishedCh5: React.FC<{ f?: number; frame?: number }> = ({ f, frame }) => {
  const currentF = f ?? frame ?? 0;

  // Knocks occur at frame 60, 110, 160
  const isKnock1 = currentF >= 60 && currentF < 75;
  const isKnock2 = currentF >= 110 && currentF < 125;
  const isKnock3 = currentF >= 160 && currentF < 175;
  const screenShake = isKnock1 || isKnock2 || isKnock3 ? Math.sin(currentF * 2.0) * 14 : 0;

  // Transition to interactive end card at frame 480
  const isTransition = currentF >= 480;
  const pipX = interpolate(currentF, [480, 540], [780, 360], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const cardOpacity = interpolate(currentF, [520, 560], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const cardSlide = interpolate(currentF, [520, 560], [120, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <g transform={`translate(${screenShake}, 0)`}>
      {/* Background: Heavy Reinforced Locked Door */}
      <image
        href={staticFile('vanished/bg_locked_door.jpg')}
        width={1920}
        height={1080}
        preserveAspectRatio="xMidYMid slice"
        opacity={0.92}
      />
      <rect width={1920} height={1080} fill="#050714" opacity={0.3} />

      {/* Knock Shockwaves from door */}
      {(isKnock1 || isKnock2 || isKnock3) && (
        <g transform="translate(960, 540)">
          <circle cx={0} cy={0} r={160} fill="none" stroke="#EF4444" strokeWidth={8} opacity={0.8} />
          <circle cx={0} cy={0} r={240} fill="none" stroke="#F59E0B" strokeWidth={5} opacity={0.5} />
          <text x={0} y={-180} fill="#EF4444" fontSize={56} fontWeight="900" fontFamily="system-ui, sans-serif" textAnchor="middle">
            *KNOCK... KNOCK...*
          </text>
        </g>
      )}

      {/* Pip Stickman */}
      <Hero
        pose={{
          x: pipX,
          y: HIPS_Y,
          scale: 1.15,
          facing: 1,
          expr: isTransition ? 'smug' : 'shock',
          armL: isTransition ? { fold: 0.3, raise: 0.1 } : { fold: 0.5, raise: 0.4 },
          armR: isTransition ? { fold: 0.8, raise: 0.6 } : { fold: 0.5, raise: 0.4 },
        }}
        look={LOOKS.pip}
      />

      {/* ================================================================= */}
      {/* MANDATORY INTERACTIVE CHOICE QUESTION CARD (Option A vs Option B) */}
      {/* ================================================================= */}
      {isTransition && (
        <g transform={`translate(1140, ${500 + cardSlide})`} opacity={cardOpacity}>
          {/* Card Backplate */}
          <rect x={-360} y={-240} width={720} height={480} rx={28} fill="rgba(15, 23, 42, 0.95)" stroke="#F59E0B" strokeWidth={4} />

          {/* Glowing Header */}
          <rect x={-330} y={-215} width={660} height={60} rx={14} fill="#1E293B" stroke="#38BDF8" strokeWidth={2} />
          <text x={0} y={-175} fill="#FFFFFF" fontSize={30} fontWeight="900" fontFamily="system-ui, sans-serif" textAnchor="middle" letterSpacing="2px">
            💬 WHAT WOULD YOU DO?
          </text>

          {/* Question Text */}
          <text x={0} y={-115} fill="#94A3B8" fontSize={22} fontWeight="600" fontFamily="system-ui, sans-serif" textAnchor="middle">
            Someone—or something—is knocking at your door:
          </text>

          {/* Option A Box */}
          <g transform="translate(0, -40)">
            <rect x={-320} y={-45} width={640} height={90} rx={16} fill="rgba(30, 41, 59, 0.9)" stroke="#38BDF8" strokeWidth={3} />
            <text x={-290} y={-5} fill="#38BDF8" fontSize={24} fontWeight="900" fontFamily="system-ui, sans-serif">
              👉 OPTION A: OPEN THE DOOR
            </text>
            <text x={-290} y={26} fill="#E2E8F0" fontSize={18} fontWeight="500" fontFamily="system-ui, sans-serif">
              "Anything is better than living and dying completely alone."
            </text>
          </g>

          {/* Option B Box */}
          <g transform="translate(0, 80)">
            <rect x={-320} y={-45} width={640} height={90} rx={16} fill="rgba(30, 41, 59, 0.9)" stroke="#EF4444" strokeWidth={3} />
            <text x={-290} y={-5} fill="#EF4444" fontSize={24} fontWeight="900" fontFamily="system-ui, sans-serif">
              👉 OPTION B: BARRICADE IT & HIDE
            </text>
            <text x={-290} y={26} fill="#E2E8F0" fontSize={18} fontWeight="500" fontFamily="system-ui, sans-serif">
              "Whatever survived 8 billion people vanishing is NOT human."
            </text>
          </g>

          {/* Call to action footer */}
          <text x={0} y={195} fill="#FDE047" fontSize={22} fontWeight="bold" fontFamily="system-ui, sans-serif" textAnchor="middle">
            👇 COMMENT OPTION A OR B BELOW! 👇
          </text>
        </g>
      )}
    </g>
  );
};

// =========================================================================
// 6. SHORT COMPOSITION (1118 frames)
// =========================================================================
export const VanishedShort: React.FC<{ f?: number; frame?: number }> = ({ f, frame }) => {
  const currentF = f ?? frame ?? 0;

  if (currentF < 250) {
    return <VanishedCh1 f={currentF} />;
  } else if (currentF < 520) {
    return <VanishedCh2 f={currentF - 250} />;
  } else if (currentF < 780) {
    return <VanishedCh3 f={currentF - 520} />;
  } else {
    return <VanishedCh5 f={currentF - 780 + 100} />;
  }
};
