import React from 'react';
import { interpolate, spring, staticFile } from 'remotion';
import { Hero, LOOKS } from '../../engine';

const HIPS_Y = 687;

// =========================================================================
// 1. CHAPTER 1: THE MEMORY BROKER (786 frames)
// =========================================================================
export const MemoriesCh1: React.FC<{ f?: number; frame?: number }> = ({ f, frame }) => {
  const currentF = f ?? frame ?? 0;
  const zoom = interpolate(currentF, [0, 786], [1.0, 1.05], { extrapolateRight: 'clamp' });

  // Neural extraction pulse
  const isExtracting = currentF >= 180 && currentF <= 450;
  const pulse = Math.sin(currentF * 0.15) * 0.3 + 0.7;
  const vialFill = interpolate(currentF, [200, 440], [0, 100], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const isDeposited = currentF >= 460;

  return (
    <g transform={`scale(${zoom}) translate(${-(zoom - 1) * 960} ${-(zoom - 1) * 540})`}>
      {/* Background: Biotech Simulation Vault */}
      <image
        href={staticFile('memories/bg_biotech_vault.jpg')}
        width={1920}
        height={1080}
        preserveAspectRatio="xMidYMid slice"
        opacity={0.92}
      />
      <rect width={1920} height={1080} fill="#050814" opacity={0.3} />

      {/* Floating HUD Badges */}
      <g transform="translate(960, 130)">
        <rect x={-320} y={-45} width={640} height={90} rx={18} fill="rgba(15, 23, 42, 0.95)" stroke="#06B6D4" strokeWidth={3} />
        <text x={0} y={-5} fill="#06B6D4" fontSize={26} fontWeight="900" fontFamily="system-ui, sans-serif" textAnchor="middle" letterSpacing="2px">
          MNEMOSYNE BIOMETRICS
        </text>
        <text x={0} y={30} fill="#FDE047" fontSize={20} fontWeight="bold" fontFamily="system-ui, sans-serif" textAnchor="middle">
          NEURAL ELECTRICAL EXTRACTION LAB
        </text>
      </g>

      {/* Glowing Neural Extraction Canister on table right */}
      <g transform="translate(1380, 680)">
        {/* Metal Base */}
        <rect x={-50} y={40} width={100} height={30} rx={8} fill="#1E293B" stroke="#38BDF8" strokeWidth={3} />
        {/* Glass Cylinder */}
        <rect x={-40} y={-160} width={80} height={200} rx={16} fill="rgba(15, 23, 42, 0.85)" stroke="#38BDF8" strokeWidth={3} />
        {/* Extracted Memory Fluid */}
        <rect
          x={-34}
          y={40 - (vialFill * 1.9)}
          width={68}
          height={vialFill * 1.9}
          rx={8}
          fill="#06B6D4"
          opacity={0.85 * pulse}
        />
        {/* Glowing Core */}
        {isExtracting && (
          <circle cx={0} cy={-50} r={22 * pulse} fill="#FDE047" opacity={0.9} filter="blur(4px)" />
        )}
        <text x={0} y={100} fill="#38BDF8" fontSize={16} fontWeight="bold" fontFamily="monospace" textAnchor="middle">
          GRADUATION.DAT ({Math.floor(vialFill)}%)
        </text>
      </g>

      {/* Neural Transfer Cables connected from ceiling to Pip's head */}
      {isExtracting && (
        <g opacity={pulse}>
          <path d="M 960 480 Q 1150 400 1380 520" fill="none" stroke="#06B6D4" strokeWidth={4} strokeDasharray="8 6" />
          <path d="M 960 490 Q 1170 430 1380 550" fill="none" stroke="#FDE047" strokeWidth={3} strokeDasharray="6 4" />
          {/* Head Aura Glow */}
          <circle cx={960} cy={510} r={95} fill="#06B6D4" opacity={0.25} filter="blur(15px)" />
        </g>
      )}

      {/* Pip Stickman in Mustard Hoodie */}
      <Hero
        pose={{
          x: 960,
          y: HIPS_Y,
          scale: 1.2,
          facing: 1,
          expr: isDeposited ? 'smug' : (isExtracting ? 'surprised' : 'neutral'),
          armL: isDeposited ? { fold: 0.6, raise: 0.4 } : { fold: 0.3, raise: 0.1 },
          armR: isDeposited ? { fold: 0.7, raise: 0.5 } : { fold: 0.3, raise: 0.1 },
        }}
        look={LOOKS.pip}
      />

      {/* Bank Deposit Notification */}
      {isDeposited && (
        <g transform="translate(960, 260)">
          <rect x={-240} y={-40} width={480} height={80} rx={18} fill="rgba(16, 185, 129, 0.95)" stroke="#FFFFFF" strokeWidth={3} />
          <text x={0} y={-5} fill="#FFFFFF" fontSize={24} fontWeight="900" fontFamily="system-ui, sans-serif" textAnchor="middle">
            💰 DEPOSIT CONFIRMED!
          </text>
          <text x={0} y={26} fill="#FDE047" fontSize={22} fontWeight="900" fontFamily="system-ui, sans-serif" textAnchor="middle">
            +$200,000.00 TRANSFERRED
          </text>
        </g>
      )}
    </g>
  );
};

// =========================================================================
// 2. CHAPTER 2: THE GOLDEN AMNESIA (940 frames)
// =========================================================================
export const MemoriesCh2: React.FC<{ f?: number; frame?: number }> = ({ f, frame }) => {
  const currentF = f ?? frame ?? 0;
  const zoom = interpolate(currentF, [0, 940], [1.0, 1.05], { extrapolateRight: 'clamp' });

  // Wealth counter animation
  const netWorth = Math.floor(interpolate(currentF, [0, 800], [200000, 30000000]));

  return (
    <g transform={`scale(${zoom}) translate(${-(zoom - 1) * 960} ${-(zoom - 1) * 540})`}>
      {/* Background: Penthouse Luxury Living Room */}
      <image
        href={staticFile('memories/bg_luxury_penthouse.jpg')}
        width={1920}
        height={1080}
        preserveAspectRatio="xMidYMid slice"
        opacity={0.92}
      />
      <rect width={1920} height={1080} fill="#050814" opacity={0.25} />

      {/* HUD Badges */}
      <g transform="translate(420, 140)">
        <rect x={-200} y={-40} width={400} height={80} rx={16} fill="rgba(15, 23, 42, 0.95)" stroke="#10B981" strokeWidth={3} />
        <text x={0} y={-5} fill="#10B981" fontSize={22} fontWeight="900" fontFamily="system-ui, sans-serif" textAnchor="middle">
          TOTAL NET WORTH
        </text>
        <text x={0} y={24} fill="#FFFFFF" fontSize={22} fontWeight="bold" fontFamily="system-ui, sans-serif" textAnchor="middle">
          ${netWorth.toLocaleString()}
        </text>
      </g>

      <g transform="translate(1500, 140)">
        <rect x={-220} y={-40} width={440} height={80} rx={16} fill="rgba(15, 23, 42, 0.95)" stroke="#38BDF8" strokeWidth={3} />
        <text x={0} y={-5} fill="#38BDF8" fontSize={20} fontWeight="900" fontFamily="system-ui, sans-serif" textAnchor="middle">
          MEMORIES LIQUIDATED
        </text>
        <text x={0} y={24} fill="#FDE047" fontSize={18} fontWeight="bold" fontFamily="system-ui, sans-serif" textAnchor="middle">
          HEARTBREAK • INJURIES • REGRETS
        </text>
      </g>

      {/* Stacks of $100 bills on table */}
      <g transform="translate(1420, 760)">
        <rect x={-80} y={0} width={160} height={40} rx={6} fill="#16A34A" stroke="#14532D" strokeWidth={2} />
        <rect x={-70} y={-35} width={140} height={35} rx={6} fill="#22C55E" stroke="#14532D" strokeWidth={2} />
        <rect x={-60} y={-68} width={120} height={33} rx={6} fill="#4ADE80" stroke="#14532D" strokeWidth={2} />
      </g>

      {/* Sports car key fob on table left */}
      <g transform="translate(520, 780)">
        <rect x={-25} y={-15} width={50} height={30} rx={8} fill="#0F172A" stroke="#F59E0B" strokeWidth={2} />
        <circle cx={-8} cy={0} r={4} fill="#EF4444" />
        <circle cx={8} cy={0} r={4} fill="#38BDF8" />
      </g>

      {/* Pip Stickman Lounging as Carefree Millionaire */}
      <Hero
        pose={{
          x: 960,
          y: HIPS_Y,
          scale: 1.2,
          facing: 1,
          expr: 'cool',
          armL: { fold: 0.6, raise: 0.4 },
          armR: { fold: 0.6, raise: 0.4 },
        }}
        look={LOOKS.pip}
      />
    </g>
  );
};

// =========================================================================
// 3. CHAPTER 3: THE EMPTY MIRROR (884 frames)
// =========================================================================
export const MemoriesCh3: React.FC<{ f?: number; frame?: number }> = ({ f, frame }) => {
  const currentF = f ?? frame ?? 0;
  const zoom = interpolate(currentF, [0, 884], [1.0, 1.05], { extrapolateRight: 'clamp' });

  // Tear drop animation
  const tearY = (currentF * 2.5) % 80;
  const staticFlicker = Math.sin(currentF * 0.8) * 0.2 + 0.3;

  return (
    <g transform={`scale(${zoom}) translate(${-(zoom - 1) * 960} ${-(zoom - 1) * 540})`}>
      {/* Background: Moody Empty Bedroom */}
      <image
        href={staticFile('memories/bg_empty_bedroom.jpg')}
        width={1920}
        height={1080}
        preserveAspectRatio="xMidYMid slice"
        opacity={0.92}
      />
      <rect width={1920} height={1080} fill="#080711" opacity={0.4} />

      {/* Critical Memory Static Warning */}
      <g transform="translate(960, 130)">
        <rect x={-320} y={-45} width={640} height={90} rx={18} fill="rgba(15, 23, 42, 0.96)" stroke="#EF4444" strokeWidth={3} />
        <text x={0} y={-5} fill="#EF4444" fontSize={26} fontWeight="900" fontFamily="system-ui, sans-serif" textAnchor="middle" letterSpacing="2px">
          CRITICAL RECOGNITION FAILURE
        </text>
        <text x={0} y={30} fill="#E2E8F0" fontSize={20} fontWeight="bold" fontFamily="system-ui, sans-serif" textAnchor="middle">
          SOLD: MOTHER'S MEMORY FOR A MONACO YACHT
        </text>
      </g>

      {/* Framed Mother Photo on table left */}
      <g transform="translate(540, 700)">
        {/* Picture Frame */}
        <rect x={-70} y={-90} width={140} height={180} rx={8} fill="#1E293B" stroke="#F59E0B" strokeWidth={5} />
        {/* Photo Background */}
        <rect x={-55} y={-75} width={110} height={150} fill="#334155" />
        {/* Mother & Baby Silhouette */}
        <circle cx={-10} cy={-25} r={22} fill="#FDE047" opacity={0.8} />
        <circle cx={20} cy={10} r={14} fill="#FFAA55" opacity={0.8} />
        <text x={0} y={60} fill="#94A3B8" fontSize={14} fontWeight="bold" fontFamily="system-ui, sans-serif" textAnchor="middle">
          MOM & PIP (1998)
        </text>
      </g>

      {/* Neural Static Aura around Pip's head */}
      <g transform="translate(960, 480)" opacity={staticFlicker}>
        <circle cx={0} cy={0} r={110} fill="none" stroke="#EF4444" strokeWidth={3} strokeDasharray="6 8" />
        <line x1={-80} y1={-20} x2={80} y2={-20} stroke="#EF4444" strokeWidth={2} opacity={0.6} />
        <line x1={-60} y1={20} x2={60} y2={20} stroke="#EF4444" strokeWidth={2} opacity={0.6} />
      </g>

      {/* Pip Stickman looking at photo with deep grief & crying */}
      <Hero
        pose={{
          x: 960,
          y: HIPS_Y,
          scale: 1.2,
          facing: -1,
          expr: 'sad',
          armL: { fold: 0.5, raise: 0.3 },
          armR: { fold: 0.2, raise: 0.1 },
        }}
        look={LOOKS.pip}
      />

      {/* Falling Tear Drop */}
      <g transform="translate(945, 520)">
        <circle cx={0} cy={tearY} r={5} fill="#38BDF8" opacity={0.9} />
      </g>

      {/* Thought Bubble Question */}
      <g transform="translate(1320, 420)">
        <rect x={-180} y={-45} width={360} height={90} rx={18} fill="rgba(15, 23, 42, 0.92)" stroke="#94A3B8" strokeWidth={2} />
        <text x={0} y={-5} fill="#FFFFFF" fontSize={22} fontWeight="bold" fontFamily="system-ui, sans-serif" textAnchor="middle">
          "WHO WAS SHE?"
        </text>
        <text x={0} y={25} fill="#EF4444" fontSize={18} fontWeight="bold" fontFamily="system-ui, sans-serif" textAnchor="middle">
          WHY AM I CRYING?
        </text>
      </g>
    </g>
  );
};

// =========================================================================
// 4. CHAPTER 4: THE FINAL EXTRACTION (756 frames)
// =========================================================================
export const MemoriesCh4: React.FC<{ f?: number; frame?: number }> = ({ f, frame }) => {
  const currentF = f ?? frame ?? 0;
  const zoom = interpolate(currentF, [0, 756], [1.0, 1.05], { extrapolateRight: 'clamp' });

  return (
    <g transform={`scale(${zoom}) translate(${-(zoom - 1) * 960} ${-(zoom - 1) * 540})`}>
      {/* Background: Contract Office Vault */}
      <image
        href={staticFile('memories/bg_contract_office.jpg')}
        width={1920}
        height={1080}
        preserveAspectRatio="xMidYMid slice"
        opacity={0.92}
      />
      <rect width={1920} height={1080} fill="#050814" opacity={0.3} />

      {/* HUD Warning */}
      <g transform="translate(960, 130)">
        <rect x={-320} y={-45} width={640} height={90} rx={18} fill="rgba(15, 23, 42, 0.95)" stroke="#F59E0B" strokeWidth={3} />
        <text x={0} y={-5} fill="#F59E0B" fontSize={26} fontWeight="900" fontFamily="system-ui, sans-serif" textAnchor="middle" letterSpacing="2px">
          THE ULTIMATE CONTRACT
        </text>
        <text x={0} y={30} fill="#10B981" fontSize={22} fontWeight="bold" fontFamily="system-ui, sans-serif" textAnchor="middle">
          $50,000,000 FOR YOUR CORE IDENTITY & SOUL
        </text>
      </g>

      {/* Black Titanium Contract on Desk */}
      <g transform="translate(960, 800)">
        {/* Desk Pad */}
        <rect x={-260} y={-70} width={520} height={140} rx={12} fill="#0F172A" stroke="#334155" strokeWidth={3} />
        {/* Document */}
        <rect x={-220} y={-55} width={440} height={110} rx={6} fill="#F8FAFC" />
        <text x={0} y={-25} fill="#0F172A" fontSize={18} fontWeight="900" fontFamily="system-ui, sans-serif" textAnchor="middle">
          TOTAL IDENTITY SURRENDER AGREEMENT
        </text>
        <text x={0} y={2} fill="#64748B" fontSize={14} fontWeight="bold" fontFamily="monospace" textAnchor="middle">
          EXTRACTING: NAME • MORALS • VALUES • HUMOR
        </text>
        <text x={0} y={28} fill="#16A34A" fontSize={20} fontWeight="900" fontFamily="system-ui, sans-serif" textAnchor="middle">
          COMPENSATION: $50,000,000 GOLD BONDS
        </text>
      </g>

      {/* Doctor Stickman on Left */}
      <Hero
        pose={{
          x: 520,
          y: HIPS_Y,
          scale: 1.15,
          facing: 1,
          expr: 'smug',
          armL: { fold: 0.7, raise: 0.4 },
          armR: { fold: 0.7, raise: 0.4 },
        }}
        look={{ ...LOOKS.pip, jacket: '#E2E8F0', body: '#0F172A' }}
      />

      {/* Pip Stickman in hesitation on Right */}
      <Hero
        pose={{
          x: 1400,
          y: HIPS_Y,
          scale: 1.2,
          facing: -1,
          expr: 'worried',
          armL: { fold: 0.5, raise: 0.4 },
          armR: { fold: 0.3, raise: 0.1 },
        }}
        look={LOOKS.pip}
      />
    </g>
  );
};

// =========================================================================
// 5. CHAPTER 5: THE FINAL CHOICE & INTERACTIVE CARD (597 frames)
// =========================================================================
export const MemoriesCh5: React.FC<{ f?: number; frame?: number }> = ({ f, frame }) => {
  const currentF = f ?? frame ?? 0;

  // Transition to interactive end card at frame 180
  const isTransition = currentF >= 180;
  const pipX = interpolate(currentF, [180, 240], [960, 360], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const cardOpacity = interpolate(currentF, [210, 260], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const cardSlide = interpolate(currentF, [210, 260], [120, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Core soul glow pulse
  const pulse = Math.sin(currentF * 0.15) * 0.25 + 0.75;

  return (
    <g>
      {/* Background: Extraction Chamber */}
      <image
        href={staticFile('memories/bg_extraction_chamber.jpg')}
        width={1920}
        height={1080}
        preserveAspectRatio="xMidYMid slice"
        opacity={0.92}
      />
      <rect width={1920} height={1080} fill="#050814" opacity={0.3} />

      {/* Glowing Soul Jar in Pip's hand */}
      {!isTransition && (
        <g transform="translate(1080, 640)">
          <rect x={-35} y={-80} width={70} height={160} rx={16} fill="rgba(15, 23, 42, 0.9)" stroke="#F59E0B" strokeWidth={3} />
          <circle cx={0} cy={0} r={28 * pulse} fill="#F59E0B" opacity={0.8} filter="blur(8px)" />
          <circle cx={0} cy={0} r={16 * pulse} fill="#FFFFFF" />
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
            💬 WHAT WOULD YOU CHOOSE?
          </text>

          {/* Question Text */}
          <text x={0} y={-115} fill="#94A3B8" fontSize={22} fontWeight="600" fontFamily="system-ui, sans-serif" textAnchor="middle">
            The neurosurgeon holds the final memory transfer switch:
          </text>

          {/* Option A Box */}
          <g transform="translate(0, -40)">
            <rect x={-320} y={-45} width={640} height={90} rx={16} fill="rgba(30, 41, 59, 0.9)" stroke="#10B981" strokeWidth={3} />
            <text x={-290} y={-5} fill="#10B981" fontSize={24} fontWeight="900" fontFamily="system-ui, sans-serif">
              👉 OPTION A: BUY BACK YOUR SOUL!
            </text>
            <text x={-290} y={26} fill="#E2E8F0" fontSize={18} fontWeight="500" fontFamily="system-ui, sans-serif">
              "Return all $30M, live broke, but remember your mother & soul."
            </text>
          </g>

          {/* Option B Box */}
          <g transform="translate(0, 80)">
            <rect x={-320} y={-45} width={640} height={90} rx={16} fill="rgba(30, 41, 59, 0.9)" stroke="#F59E0B" strokeWidth={3} />
            <text x={-290} y={-5} fill="#F59E0B" fontSize={24} fontWeight="900" fontFamily="system-ui, sans-serif">
              👉 OPTION B: TAKE THE $50,000,000!
            </text>
            <text x={-290} y={26} fill="#E2E8F0" fontSize={18} fontWeight="500" fontFamily="system-ui, sans-serif">
              "Erase your past permanently and live as a blank billionaire."
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
// 6. SHORT COMPOSITION (1271 frames)
// =========================================================================
export const MemoriesShort: React.FC<{ f?: number; frame?: number }> = ({ f, frame }) => {
  const currentF = f ?? frame ?? 0;

  if (currentF < 280) {
    return <MemoriesCh1 f={currentF} />;
  } else if (currentF < 580) {
    return <MemoriesCh2 f={currentF - 280 + 100} />;
  } else if (currentF < 860) {
    return <MemoriesCh3 f={currentF - 580 + 50} />;
  } else if (currentF < 1040) {
    return <MemoriesCh4 f={currentF - 860 + 50} />;
  } else {
    return <MemoriesCh5 f={currentF - 1040 + 180} />;
  }
};

