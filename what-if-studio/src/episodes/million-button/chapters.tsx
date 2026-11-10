import React from 'react';
import { interpolate, spring, staticFile } from 'remotion';
import { Hero, LOOKS } from '../../engine';

const GROUND_Y = 820;
const HIPS_Y = 687;

// =========================================================================
// 1. CHAPTER 1: THE MAHOGANY BOX & RED BUTTON (849 frames)
// =========================================================================
export const MillionButtonCh1: React.FC<{ f?: number; frame?: number }> = ({ f, frame }) => {
  const currentF = f ?? frame ?? 0;

  const btnPulse = Math.sin(currentF * 0.15) * 0.2 + 0.8;
  const zoom = interpolate(currentF, [0, 849], [1.0, 1.06], { extrapolateRight: 'clamp' });

  return (
    <g transform={`scale(${zoom}) translate(${-(zoom - 1) * 960} ${-(zoom - 1) * 540})`}>
      {/* Background: Mystery Desk */}
      <image
        href={staticFile('million-button/bg_mystery_desk.jpg')}
        width={1920}
        height={1080}
        preserveAspectRatio="xMidYMid slice"
        opacity={0.92}
      />
      <rect width={1920} height={1080} fill="#050714" opacity={0.25} />

      {/* Floating Mystery Badge */}
      <g transform="translate(960, 140)">
        <rect x={-260} y={-45} width={520} height={90} rx={18} fill="rgba(15, 23, 42, 0.92)" stroke="#EF4444" strokeWidth={3} />
        <text x={0} y={-5} fill="#EF4444" fontSize={28} fontWeight="900" fontFamily="system-ui, sans-serif" textAnchor="middle" letterSpacing="2px">
          THE MYSTERY BOX ARRIVES
        </text>
        <text x={0} y={30} fill="#FDE047" fontSize={22} fontWeight="bold" fontFamily="system-ui, sans-serif" textAnchor="middle">
          +$1,000,000 CASH / -10 YEARS LIFESPAN
        </text>
      </g>

      {/* Pulsing Red Hazard Aura around the Button on Desk */}
      <circle cx={1320} cy={680} r={120 * btnPulse} fill="#EF4444" opacity={0.2} />

      {/* Pip Stickman curious / inspecting the box */}
      <Hero
        pose={{
          x: 740,
          y: HIPS_Y,
          scale: 1.15,
          facing: 1,
          expr: 'neutral',
          head: { look: { x: 5, y: 2 }, tilt: 4 },
          armL: { fold: 0.3, raise: 0.1 },
          armR: { fold: 0.6, raise: 0.3 },
        }}
        look={LOOKS.pip}
      />
    </g>
  );
};

// =========================================================================
// 2. CHAPTER 2: THE FIRST PRESS & CASH RAIN (996 frames)
// =========================================================================
export const MillionButtonCh2: React.FC<{ f?: number; frame?: number }> = ({ f, frame }) => {
  const currentF = f ?? frame ?? 0;

  // Slam press at frame 200
  const isPress = currentF >= 200;
  const flashOpacity = currentF >= 200 && currentF < 220 ? 0.7 : 0;
  const cashRaining = currentF >= 200;

  return (
    <g>
      {/* Background: Mystery Desk */}
      <image
        href={staticFile('million-button/bg_mystery_desk.jpg')}
        width={1920}
        height={1080}
        preserveAspectRatio="xMidYMid slice"
        opacity={0.88}
      />
      <rect width={1920} height={1080} fill="#050714" opacity={0.3} />

      {/* Flash on press */}
      {flashOpacity > 0 && <rect width={1920} height={1080} fill="#22C55E" opacity={flashOpacity} />}

      {/* Floating notification badge */}
      <g transform="translate(960, 140)">
        <rect x={-270} y={-45} width={540} height={90} rx={18} fill="rgba(15, 23, 42, 0.94)" stroke={isPress ? '#22C55E' : '#EF4444'} strokeWidth={3} />
        <text x={0} y={-5} fill={isPress ? '#22C55E' : '#EF4444'} fontSize={28} fontWeight="900" fontFamily="system-ui, sans-serif" textAnchor="middle">
          {isPress ? '💰 WIRE TRANSFER CONFIRMED!' : 'SURROUNDED BY UNPAID BILLS'}
        </text>
        <text x={0} y={30} fill="#FFFFFF" fontSize={22} fontWeight="bold" fontFamily="system-ui, sans-serif" textAnchor="middle">
          {isPress ? 'ACCOUNT BALANCE: +$1,000,000' : 'JUST ONE PRESS SOLVES EVERYTHING...'}
        </text>
      </g>

      {/* Raining cash particles after press */}
      {cashRaining && (
        <g>
          {[400, 600, 800, 1000, 1200, 1400].map((cx, i) => {
            const py = ((currentF * 9 + i * 140) % 1100);
            return (
              <g key={i} transform={`translate(${cx}, ${py}) rotate(${currentF * 4 + i * 20})`}>
                <rect x={-30} y={-16} width={60} height={32} rx={4} fill="#22C55E" stroke="#166534" strokeWidth={2} />
                <circle cx={0} cy={0} r={8} fill="#166534" />
                <text x={0} y={5} fill="#FFFFFF" fontSize={16} fontWeight="bold" textAnchor="middle">$</text>
              </g>
            );
          })}
        </g>
      )}

      {/* Pip Stickman slamming hand or trembling with cash */}
      <Hero
        pose={{
          x: 760,
          y: HIPS_Y,
          scale: 1.15,
          facing: 1,
          expr: isPress ? 'shock' : 'worried',
          armL: isPress ? { fold: 0.4, raise: 0.3 } : { fold: 0.2, raise: 0.1 },
          armR: isPress ? { fold: 0.9, raise: 0.5 } : { fold: 0.7, raise: 0.6 },
        }}
        look={LOOKS.pip}
      />
    </g>
  );
};

// =========================================================================
// 3. CHAPTER 3: THE SPIRAL OF GREED (859 frames)
// =========================================================================
export const MillionButtonCh3: React.FC<{ f?: number; frame?: number }> = ({ f, frame }) => {
  const currentF = f ?? frame ?? 0;

  const countVal = Math.min(15, Math.floor(interpolate(currentF, [0, 600], [1, 15])));
  const cashVal = countVal;

  return (
    <g>
      {/* Background: Penthouse Luxury */}
      <image
        href={staticFile('million-button/bg_penthouse_luxury.jpg')}
        width={1920}
        height={1080}
        preserveAspectRatio="xMidYMid slice"
        opacity={0.92}
      />
      <rect width={1920} height={1080} fill="#050714" opacity={0.2} />

      {/* Floating Counter Badge */}
      <g transform="translate(960, 140)">
        <rect x={-280} y={-45} width={560} height={90} rx={18} fill="rgba(15, 23, 42, 0.95)" stroke="#F59E0B" strokeWidth={3} />
        <text x={0} y={-5} fill="#FDE047" fontSize={28} fontWeight="900" fontFamily="system-ui, sans-serif" textAnchor="middle">
          TOTAL PRESSES: {countVal} TIMES
        </text>
        <text x={0} y={30} fill="#22C55E" fontSize={24} fontWeight="900" fontFamily="system-ui, sans-serif" textAnchor="middle">
          NET WORTH: ${cashVal},000,000 CASH
        </text>
      </g>

      {/* Breaking News Ticker at bottom */}
      <g transform="translate(960, 980)">
        <rect x={-900} y={-35} width={1800} height={70} rx={14} fill="rgba(239, 68, 68, 0.92)" />
        <text x={0} y={8} fill="#FFFFFF" fontSize={24} fontWeight="900" fontFamily="system-ui, sans-serif" textAnchor="middle">
          🚨 BREAKING: THOUSANDS MYSTERIOUSLY COLLAPSE WITH ORGANS AGED 80 YEARS
        </text>
      </g>

      {/* Pip living the billionaire life */}
      <Hero
        pose={{
          x: 960,
          y: HIPS_Y,
          scale: 1.15,
          facing: 1,
          expr: 'smug',
          armL: { fold: 0.3, raise: 0.1 },
          armR: { fold: 0.7, raise: 0.4 },
        }}
        look={LOOKS.pip}
      />
    </g>
  );
};

// =========================================================================
// 4. CHAPTER 4: THE HOSPITAL CORRIDOR & BROTHER (794 frames)
// =========================================================================
export const MillionButtonCh4: React.FC<{ f?: number; frame?: number }> = ({ f, frame }) => {
  const currentF = f ?? frame ?? 0;

  // EKG pulse beep
  const ekgPulse = Math.sin(currentF * 0.3) * 0.2 + 0.8;

  return (
    <g>
      {/* Background: Sterile Hospital Corridor */}
      <image
        href={staticFile('million-button/bg_hospital_corridor.jpg')}
        width={1920}
        height={1080}
        preserveAspectRatio="xMidYMid slice"
        opacity={0.92}
      />
      <rect width={1920} height={1080} fill="#050714" opacity={0.3} />

      {/* Medical Warning Badge */}
      <g transform="translate(960, 140)">
        <rect x={-280} y={-45} width={560} height={90} rx={18} fill="rgba(15, 23, 42, 0.95)" stroke="#EF4444" strokeWidth={3} />
        <text x={0} y={-5} fill="#EF4444" fontSize={28} fontWeight="900" fontFamily="system-ui, sans-serif" textAnchor="middle">
          ICU EMERGENCY: YOUNGER BROTHER
        </text>
        <text x={0} y={30} fill="#FDE047" fontSize={22} fontWeight="bold" fontFamily="system-ui, sans-serif" textAnchor="middle">
          CELLULAR AGE: 85 YEARS OLD OVERNIGHT
        </text>
      </g>

      {/* EKG Monitor Pulse in window */}
      <g transform="translate(1420, 520)">
        <rect x={-90} y={-50} width={180} height={100} rx={12} fill="#022C22" stroke="#10B981" strokeWidth={2} />
        <path d="M -80 0 L -40 0 L -30 -30 L -10 30 L 0 -15 L 10 0 L 80 0" stroke="#34D399" strokeWidth={3} fill="none" opacity={ekgPulse} />
      </g>

      {/* Pip Horrified realizing he caused it */}
      <Hero
        pose={{
          x: 780,
          y: HIPS_Y,
          scale: 1.15,
          facing: 1,
          expr: 'shock',
          armL: { fold: 0.6, raise: 0.4 },
          armR: { fold: 0.7, raise: 0.5 },
        }}
        look={LOOKS.pip}
      />
    </g>
  );
};

// =========================================================================
// 5. CHAPTER 5: THE FINAL CHOICE & INTERACTIVE CARD (1080 frames)
// =========================================================================
export const MillionButtonCh5: React.FC<{ f?: number; frame?: number }> = ({ f, frame }) => {
  const currentF = f ?? frame ?? 0;

  // Transition to interactive end card at frame 420
  const isTransition = currentF >= 420;
  const pipX = interpolate(currentF, [420, 480], [780, 360], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const cardOpacity = interpolate(currentF, [460, 500], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const cardSlide = interpolate(currentF, [460, 500], [120, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <g>
      {/* Background: Concrete Vault Spotlight */}
      <image
        href={staticFile('million-button/bg_vault_decision.jpg')}
        width={1920}
        height={1080}
        preserveAspectRatio="xMidYMid slice"
        opacity={0.92}
      />
      <rect width={1920} height={1080} fill="#050714" opacity={0.3} />

      {/* Sledgehammer raised in Pip's hands before transition */}
      {!isTransition && (
        <g transform="translate(860, 480) rotate(-35)">
          <rect x={-8} y={-80} width={16} height={160} rx={4} fill="#94A3B8" />
          <rect x={-30} y={-110} width={60} height={35} rx={6} fill="#334155" stroke="#1E293B" strokeWidth={2} />
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
            The cursed button box offers one final choice:
          </text>

          {/* Option A Box */}
          <g transform="translate(0, -40)">
            <rect x={-320} y={-45} width={640} height={90} rx={16} fill="rgba(30, 41, 59, 0.9)" stroke="#22C55E" strokeWidth={3} />
            <text x={-290} y={-5} fill="#22C55E" fontSize={24} fontWeight="900" fontFamily="system-ui, sans-serif">
              👉 OPTION A: PRESS FOR $100,000,000
            </text>
            <text x={-290} y={26} fill="#E2E8F0" fontSize={18} fontWeight="500" fontFamily="system-ui, sans-serif">
              "Use the fortune to buy world-class experimental medicine."
            </text>
          </g>

          {/* Option B Box */}
          <g transform="translate(0, 80)">
            <rect x={-320} y={-45} width={640} height={90} rx={16} fill="rgba(30, 41, 59, 0.9)" stroke="#EF4444" strokeWidth={3} />
            <text x={-290} y={-5} fill="#EF4444" fontSize={24} fontWeight="900" fontFamily="system-ui, sans-serif">
              👉 OPTION B: SMASH IT TO DUST
            </text>
            <text x={-290} y={26} fill="#E2E8F0" fontSize={18} fontWeight="500" fontFamily="system-ui, sans-serif">
              "Destroy the greed forever and live with the consequences."
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
// 6. SHORT COMPOSITION (977 frames)
// =========================================================================
export const MillionButtonShort: React.FC<{ f?: number; frame?: number }> = ({ f, frame }) => {
  const currentF = f ?? frame ?? 0;

  if (currentF < 220) {
    return <MillionButtonCh1 f={currentF} />;
  } else if (currentF < 480) {
    return <MillionButtonCh2 f={currentF - 220 + 150} />;
  } else if (currentF < 700) {
    return <MillionButtonCh3 f={currentF - 480} />;
  } else {
    return <MillionButtonCh5 f={currentF - 700 + 350} />;
  }
};

