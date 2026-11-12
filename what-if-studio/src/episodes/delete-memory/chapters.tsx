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

export const POSE_EXPLAIN = { armL: { a: 45, b: 35 }, armR: { a: 15, b: -10 } };
export const POSE_CONFUSED = { armL: { a: 15, b: -10 }, armR: { a: 135, b: 85 }, headTilt: 10 };
export const POSE_SHOCKED = { armL: { a: 125, b: 35 }, armR: { a: 125, b: 35 }, squash: -0.12 };
export const POSE_PHONE = { armL: { a: 35, b: 25 }, armR: { a: 80, b: 70 } };
export const POSE_HEADACHE = { armL: { a: 130, b: 70 }, armR: { a: 130, b: -70 }, headTilt: -8 };
export const POSE_POCKETS = { armL: { a: 18, b: -25 }, armR: { a: 18, b: -25 } };

// =========================================================================
// GLOWING MINDPURGE PHONE COMPONENT
// =========================================================================
export const MindPurgePhone: React.FC<{
  x: number;
  y: number;
  frame: number;
  title: string;
  cashAmount?: string;
  status?: string;
  scale?: number;
  isDeleted?: boolean;
}> = ({ x, y, frame, title, cashAmount = '+$100,000.00', status = 'TAP TO DELETE', scale = 1, isDeleted = false }) => {
  const pulse = Math.sin(frame * 0.2) * 0.15 + 0.85;
  const floatY = Math.sin(frame * 0.1) * 4;

  return (
    <g transform={`translate(${x}, ${y + floatY}) scale(${scale})`}>
      {/* Cyan Phone Aura */}
      <rect x={-95} y={-155} width={190} height={310} rx={28} fill="#06B6D4" opacity={0.3 * pulse} filter="blur(12px)" />

      {/* Phone Body */}
      <rect x={-80} y={-140} width={160} height={280} rx={22} fill="#0F172A" stroke="#06B6D4" strokeWidth={3} />
      {/* Screen Area */}
      <rect x={-72} y={-125} width={144} height={250} rx={14} fill="#090D16" />

      {/* Top Header Bar */}
      <rect x={-72} y={-125} width={144} height={32} rx={6} fill="#1E293B" />
      <text x={0} y={-104} fill="#38BDF8" fontSize={11} fontWeight="bold" fontFamily="system-ui, sans-serif" textAnchor="middle">
        MINDPURGE v2.4
      </text>

      {/* Memory Icon / Cloud */}
      <g transform="translate(0, -50)">
        <circle cx={-16} cy={0} r={18} fill={isDeleted ? '#EF4444' : '#0284C7'} opacity={0.8} />
        <circle cx={16} cy={0} r={18} fill={isDeleted ? '#EF4444' : '#0284C7'} opacity={0.8} />
        <circle cx={0} cy={-12} r={22} fill={isDeleted ? '#EF4444' : '#38BDF8'} opacity={0.9} />
        {/* Brain symbol or trash icon */}
        {isDeleted ? (
          <text x={0} y={-4} fill="#FFFFFF" fontSize={18} fontWeight="bold" textAnchor="middle">✕</text>
        ) : (
          <text x={0} y={-4} fill="#FFFFFF" fontSize={16} fontWeight="bold" textAnchor="middle">🧠</text>
        )}
      </g>

      {/* Memory Title */}
      <text x={0} y={0} fill="#E2E8F0" fontSize={10} fontWeight="600" fontFamily="system-ui, sans-serif" textAnchor="middle">
        {title}
      </text>

      {/* Action / Delete Button */}
      <g transform="translate(0, 42)">
        <rect
          x={-58}
          y={-18}
          width={116}
          height={36}
          rx={8}
          fill={isDeleted ? '#10B981' : '#EF4444'}
          stroke="#FFFFFF"
          strokeWidth={1.5}
        />
        <text x={0} y={5} fill="#FFFFFF" fontSize={11} fontWeight="900" fontFamily="system-ui, sans-serif" textAnchor="middle">
          {isDeleted ? 'PURGED ✓' : status}
        </text>
      </g>

      {/* Bank Deposit Alert */}
      <rect x={-64} y={75} width={128} height={26} rx={6} fill="#064E3B" stroke="#10B981" strokeWidth={1.5} />
      <text x={0} y={92} fill="#34D399" fontSize={11} fontWeight="900" fontFamily="Courier, monospace" textAnchor="middle">
        {cashAmount}
      </text>
    </g>
  );
};

// =========================================================================
// GLOWING NEURAL MEMORY VIAL COMPONENT
// =========================================================================
export const MemoryVial: React.FC<{
  x: number;
  y: number;
  frame: number;
  label?: string;
  color?: string;
  scale?: number;
}> = ({ x, y, frame, label = 'MEMORY #07', color = '#06B6D4', scale = 1 }) => {
  const pulse = Math.sin(frame * 0.15) * 0.2 + 0.8;
  const floatY = Math.sin(frame * 0.08) * 5;

  return (
    <g transform={`translate(${x}, ${y + floatY}) scale(${scale})`}>
      {/* Outer Glow */}
      <ellipse cx={0} cy={0} rx={45} ry={85} fill={color} opacity={0.3 * pulse} filter="blur(14px)" />

      {/* Glass Cylinder Base & Cap */}
      <rect x={-26} y={-90} width={52} height={16} rx={6} fill="#334155" stroke="#94A3B8" strokeWidth={2} />
      <rect x={-26} y={74} width={52} height={16} rx={6} fill="#334155" stroke="#94A3B8" strokeWidth={2} />

      {/* Glass Body */}
      <rect x={-22} y={-74} width={44} height={148} rx={8} fill="rgba(15, 23, 42, 0.6)" stroke={color} strokeWidth={2.5} />

      {/* Glowing Neural Fluid */}
      <path
        d={`M -18 ${-50 + Math.sin(frame * 0.1) * 8} Q 0 ${-60 + Math.cos(frame * 0.1) * 6} 18 ${-50 + Math.sin(frame * 0.1) * 8} L 18 68 L -18 68 Z`}
        fill={color}
        opacity={0.65}
      />
      {/* Neural Core Sparkles */}
      <circle cx={-6} cy={-10} r={4} fill="#FFFFFF" opacity={pulse} />
      <circle cx={8} cy={20} r={3} fill="#FFFFFF" opacity={pulse * 0.8} />

      {/* Vial Label Plaque */}
      <rect x={-32} y={96} width={64} height={20} rx={4} fill="#0F172A" stroke={color} strokeWidth={1} />
      <text x={0} y={110} fill="#E2E8F0" fontSize={8} fontWeight="bold" fontFamily="monospace" textAnchor="middle">
        {label}
      </text>
    </g>
  );
};

// =========================================================================
// CASH STACKS
// =========================================================================
export const CashStacks: React.FC<{ x: number; y: number; count?: number }> = ({ x, y, count = 3 }) => {
  return (
    <g transform={`translate(${x}, ${y})`}>
      {Array.from({ length: count }).map((_, i) => (
        <g key={i} transform={`translate(${(i - 1) * 65}, ${-i * 8})`}>
          <rect x={-28} y={-16} width={56} height={28} rx={4} fill="#059669" stroke="#10B981" strokeWidth={2} />
          <rect x={-10} y={-16} width={20} height={28} fill="#FFFFFF" opacity={0.7} />
          <text x={0} y={4} fill="#064E3B" fontSize={14} fontWeight="900" fontFamily="sans-serif" textAnchor="middle">
            $
          </text>
        </g>
      ))}
    </g>
  );
};

// =========================================================================
// CHAPTER 1: THE APP & THE FIRST $100,000
// =========================================================================
export const DeleteMemoryCh1: React.FC<{ f: number }> = ({ f }) => {
  const isDeleted = f > 340;
  const shake = f > 330 && f < 370 ? Math.sin(f * 2.0) * 8 : 0;

  const pipPose = makePipPose(f, {
    x: 620 + shake,
    y: HIPS_Y,
    expr: isDeleted ? 'shock' : 'neutral',
    ...(isDeleted ? POSE_SHOCKED : POSE_PHONE),
  });

  return (
    <g>
      {/* Background Image: Office / Study */}
      <image href={staticFile('delete-memory/bg_empty_bedroom.jpg')} x={0} y={0} width={1920} height={1080} preserveAspectRatio="xMidYMid slice" />
      <rect x={0} y={0} width={1920} height={1080} fill="rgba(10, 15, 26, 0.45)" />

      {/* Pip Stickman Hero */}
      <Hero p={pipPose} look={LOOKS.pip} f={f} />

      {/* Glowing Smartphone in Center Foreground */}
      <MindPurgePhone
        x={1180}
        y={540}
        frame={f}
        title="7TH GRADE TALENT SHOW"
        cashAmount={isDeleted ? '+$100,000.00' : '$0.00'}
        status={isDeleted ? 'DELETED' : 'TAP TO DELETE'}
        scale={1.4}
        isDeleted={isDeleted}
      />

      {/* Thought Bubble with embarrassing memory that dissolves */}
      <g transform="translate(780, 260)">
        <ellipse cx={0} cy={0} rx={140} ry={70} fill="#1E293B" stroke="#06B6D4" strokeWidth={3} opacity={isDeleted ? 0.2 : 0.95} />
        <circle cx={-120} cy={80} r={14} fill="#1E293B" stroke="#06B6D4" strokeWidth={2} opacity={isDeleted ? 0.2 : 0.95} />
        <circle cx={-140} cy={120} r={8} fill="#1E293B" stroke="#06B6D4" strokeWidth={2} opacity={isDeleted ? 0.2 : 0.95} />
        
        {isDeleted ? (
          <text x={0} y={8} fill="#EF4444" fontSize={26} fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">
            STATIC [NO SIGNAL]
          </text>
        ) : (
          <text x={0} y={6} fill="#E2E8F0" fontSize={20} fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">
            STAGE FALL: 7TH GRADE
          </text>
        )}
      </g>

      {/* Top Banner */}
      <rect x={80} y={50} width={520} height={56} rx={12} fill="#0F172A" stroke="#06B6D4" strokeWidth={2} />
      <text x={340} y={86} fill="#38BDF8" fontSize={22} fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">
        DAY 1: THE FIRST $100,000
      </text>
    </g>
  );
};

// =========================================================================
// CHAPTER 2: THE $3 MILLION SPENDING SPREE
// =========================================================================
export const DeleteMemoryCh2: React.FC<{ f: number }> = ({ f }) => {
  const friendArrives = f > 500;

  const pipPose = makePipPose(f, {
    x: 820,
    y: HIPS_Y,
    expr: friendArrives ? 'worried' : 'happy',
    ...(friendArrives ? POSE_CONFUSED : POSE_POCKETS),
  });

  const friendPose = makePipPose(f, {
    x: 480,
    y: HIPS_Y,
    expr: 'happy',
    armL: { a: 45, b: 35 },
    armR: { a: 75, b: 50 },
  });

  return (
    <g>
      {/* Background Image: Luxury Penthouse */}
      <image href={staticFile('delete-memory/bg_luxury_penthouse.jpg')} x={0} y={0} width={1920} height={1080} preserveAspectRatio="xMidYMid slice" />
      <rect x={0} y={0} width={1920} height={1080} fill="rgba(10, 15, 26, 0.35)" />

      {/* Stacks of Cash on Ground */}
      <CashStacks x={820} y={890} count={5} />
      <CashStacks x={1040} y={870} count={4} />

      {/* Friend Stickman (approaching) */}
      {friendArrives && (
        <g>
          <Hero p={friendPose} look={LOOKS.mo} f={f} />
          {/* Friend Speech Bubble */}
          <g transform="translate(420, 360)">
            <rect x={-140} y={-40} width={280} height={80} rx={16} fill="#1E293B" stroke="#F59E0B" strokeWidth={3} />
            <text x={0} y={-10} fill="#FDE68A" fontSize={18} fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">
              "PIP! You saved my life in 2018!"
            </text>
            <text x={0} y={16} fill="#FFFFFF" fontSize={14} fontFamily="sans-serif" textAnchor="middle">
              "Remember our road trip?!"
            </text>
          </g>
        </g>
      )}

      {/* Pip Stickman Hero */}
      <Hero p={pipPose} look={LOOKS.pip} f={f} />

      {/* Pip Confused '???' Symbol */}
      {friendArrives && (
        <text x={840} y={320} fill="#EF4444" fontSize={55} fontWeight="900" fontFamily="sans-serif">
          ???
        </text>
      )}

      {/* Floating Bank Balance Pill */}
      <g transform="translate(1420, 120)">
        <rect x={-190} y={-40} width={380} height={80} rx={20} fill="#064E3B" stroke="#10B981" strokeWidth={4} />
        <text x={0} y={-8} fill="#A7F3D0" fontSize={14} fontWeight="bold" textAnchor="middle">
          ACCOUNT BALANCE:
        </text>
        <text x={0} y={24} fill="#FFFFFF" fontSize={30} fontWeight="900" fontFamily="monospace" textAnchor="middle">
          $3,000,000.00
        </text>
      </g>
    </g>
  );
};

// =========================================================================
// CHAPTER 3: THE IDENTITY FRACTURE & GLITCH
// =========================================================================
export const DeleteMemoryCh3: React.FC<{ f: number }> = ({ f }) => {
  const glitch = Math.sin(f * 0.8) > 0.4;
  const shake = glitch ? Math.sin(f * 2.5) * 12 : 0;

  const pipPose = makePipPose(f, {
    x: 680 + shake,
    y: HIPS_Y,
    expr: 'dizzy',
    ...POSE_HEADACHE,
  });

  return (
    <g>
      {/* Background Image: Dark Contract Office */}
      <image href={staticFile('delete-memory/bg_contract_office.jpg')} x={0} y={0} width={1920} height={1080} preserveAspectRatio="xMidYMid slice" />
      <rect x={0} y={0} width={1920} height={1080} fill="rgba(20, 8, 14, 0.55)" />

      {/* Pip Stickman Hero */}
      <Hero p={pipPose} look={LOOKS.pip} f={f} />

      {/* Pixel Glitch Cubes flying off Pip's head */}
      {glitch && (
        <g>
          {Array.from({ length: 14 }).map((_, i) => (
            <rect
              key={i}
              x={680 + Math.sin(i * 3 + f) * 120}
              y={380 + Math.cos(i * 2 + f) * 100}
              width={20 + (i % 3) * 10}
              height={20 + (i % 3) * 10}
              fill={i % 2 === 0 ? '#06B6D4' : '#EF4444'}
              opacity={0.8}
            />
          ))}
        </g>
      )}

      {/* Red Alert Phone Screen on Right */}
      <g transform="translate(1320, 520) scale(1.3)">
        <rect x={-160} y={-200} width={320} height={400} rx={24} fill="#0F172A" stroke="#EF4444" strokeWidth={5} />
        <rect x={-140} y={-180} width={280} height={360} rx={16} fill="#180B12" />

        <text x={0} y={-120} fill="#EF4444" fontSize={24} fontWeight="900" fontFamily="sans-serif" textAnchor="middle">
          CRITICAL DEMAND
        </text>

        <rect x={-120} y={-80} width={240} height={80} rx={12} fill="#2A0815" stroke="#EF4444" strokeWidth={2} />
        <text x={0} y={-50} fill="#FCA5A5" fontSize={13} fontWeight="bold" textAnchor="middle">
          CORE MEMORY:
        </text>
        <text x={0} y={-24} fill="#FFFFFF" fontSize={16} fontWeight="bold" textAnchor="middle">
          "MOTHER'S VOICE"
        </text>
        <text x={0} y={-4} fill="#34D399" fontSize={15} fontWeight="900" textAnchor="middle">
          +$500,000.00
        </text>

        {/* Deletion Fee Warning */}
        <rect x={-125} y={35} width={250} height={95} rx={10} fill="#3B0715" stroke="#F87171" strokeWidth={2} />
        <text x={0} y={60} fill="#F87171" fontSize={12} fontWeight="bold" textAnchor="middle">
          WARNING: APP CANNOT BE CLOSED
        </text>
        <text x={0} y={85} fill="#FFFFFF" fontSize={14} fontWeight="900" textAnchor="middle">
          EXIT FEE: $10,000,000
        </text>
        <text x={0} y={110} fill="#FCA5A5" fontSize={12} textAnchor="middle">
          OR 100 CORE MEMORIES
        </text>
      </g>
    </g>
  );
};

// =========================================================================
// CHAPTER 4: THE UNDERGROUND MEMORY VAULT
// =========================================================================
export const DeleteMemoryCh4: React.FC<{ f: number }> = ({ f }) => {
  const pipPose = makePipPose(f, {
    x: 460,
    y: HIPS_Y,
    expr: 'shock',
    ...POSE_SHOCKED,
  });

  const buyerPose = makePipPose(f, {
    x: 1450,
    y: HIPS_Y,
    expr: 'neutral',
    ...POSE_EXPLAIN,
  });

  return (
    <g>
      {/* Background Image: Biotech Vault */}
      <image href={staticFile('delete-memory/bg_biotech_vault.jpg')} x={0} y={0} width={1920} height={1080} preserveAspectRatio="xMidYMid slice" />
      <rect x={0} y={0} width={1920} height={1080} fill="rgba(8, 14, 28, 0.45)" />

      {/* Hanging Ceiling Rows of Memory Vials */}
      <MemoryVial x={680} y={220} frame={f} label="LOT #21: FIRST KISS" color="#06B6D4" scale={0.9} />
      <MemoryVial x={960} y={200} frame={f + 20} label="LOT #42: CHILDHOOD PET" color="#A855F7" scale={0.9} />
      <MemoryVial x={1240} y={230} frame={f + 40} label="LOT #88: GRADUATION" color="#3B82F6" scale={0.9} />

      {/* Central Glass Pedestal with Mother's Smile */}
      <g transform="translate(960, 680)">
        {/* Pedestal Base */}
        <polygon points="-80,180 80,180 60,80 -60,80" fill="#1E293B" stroke="#06B6D4" strokeWidth={3} />
        <MemoryVial x={0} y={0} frame={f} label="VIAL #07: MOTHER" color="#06B6D4" scale={1.3} />
      </g>

      {/* Pip Stickman Hero */}
      <Hero p={pipPose} look={LOOKS.pip} f={f} />

      {/* Wealthy Elite Buyer Stickman */}
      <Hero p={buyerPose} look={LOOKS.suit} f={f} />
      {/* Buyer dialogue tag */}
      <g transform="translate(1450, 420)">
        <rect x={-110} y={-30} width={220} height={60} rx={12} fill="#1E293B" stroke="#A855F7" strokeWidth={2} />
        <text x={0} y={-6} fill="#E9D5FF" fontSize={13} fontWeight="bold" textAnchor="middle">
          "AUCTION WINNER"
        </text>
        <text x={0} y={15} fill="#C084FC" fontSize={12} textAnchor="middle">
          Bidding $2,500,000
        </text>
      </g>
    </g>
  );
};

// =========================================================================
// CHAPTER 5: OPTION A VS OPTION B DILEMMA (INTERACTIVE END CARD)
// =========================================================================
export const DeleteMemoryCh5: React.FC<{ f: number }> = ({ f }) => {
  const countdown = Math.max(0, 10 - Math.floor(f / 90));
  const alarmPulse = Math.sin(f * 0.4) > 0;

  const pipPose = makePipPose(f, {
    x: 960,
    y: 760,
    expr: 'dizzy',
    armL: { a: 110, b: 40 },
    armR: { a: 110, b: -40 },
  });

  return (
    <g>
      {/* Background Image: Extraction Chamber */}
      <image href={staticFile('delete-memory/bg_extraction_chamber.jpg')} x={0} y={0} width={1920} height={1080} preserveAspectRatio="xMidYMid slice" />
      <rect x={0} y={0} width={1920} height={1080} fill={alarmPulse ? 'rgba(239, 68, 68, 0.35)' : 'rgba(10, 15, 26, 0.65)'} />

      {/* Top Countdown Alarm */}
      <g transform="translate(960, 110)">
        <rect x={-280} y={-50} width={560} height={100} rx={20} fill="#1E1015" stroke="#EF4444" strokeWidth={5} />
        <text x={0} y={-10} fill="#FCA5A5" fontSize={16} fontWeight="bold" textAnchor="middle">
          SELF-DESTRUCT INITIATED
        </text>
        <text x={0} y={32} fill="#EF4444" fontSize={42} fontWeight="900" fontFamily="monospace" textAnchor="middle">
          00:{countdown < 10 ? `0${countdown}` : countdown} SECONDS
        </text>
      </g>

      {/* OPTION A CARD (LEFT) */}
      <g transform="translate(480, 480)">
        <rect x={-250} y={-220} width={500} height={440} rx={28} fill="rgba(15, 23, 42, 0.95)" stroke="#06B6D4" strokeWidth={5} />
        {/* Badge */}
        <rect x={-140} y={-250} width={280} height={56} rx={16} fill="#06B6D4" />
        <text x={0} y={-215} fill="#FFFFFF" fontSize={24} fontWeight="900" fontFamily="sans-serif" textAnchor="middle">
          OPTION A
        </text>

        <text x={0} y={-140} fill="#38BDF8" fontSize={30} fontWeight="900" textAnchor="middle">
          RECALL MEMORIES
        </text>
        <text x={0} y={-80} fill="#E2E8F0" fontSize={18} fontWeight="bold" textAnchor="middle">
          ✓ Regain Identity & Heart
        </text>
        <text x={0} y={-45} fill="#E2E8F0" fontSize={18} fontWeight="bold" textAnchor="middle">
          ✓ Remember Your Mother & Love
        </text>
        <text x={0} y={15} fill="#EF4444" fontSize={20} fontWeight="900" textAnchor="middle">
          ✕ Bank Balance: $0.00
        </text>
        <text x={0} y={55} fill="#94A3B8" fontSize={16} textAnchor="middle">
          Return to poor, normal life
        </text>

        <rect x={-180} y={110} width={360} height={60} rx={14} fill="#0891B2" stroke="#FFFFFF" strokeWidth={2} />
        <text x={0} y={148} fill="#FFFFFF" fontSize={22} fontWeight="900" textAnchor="middle">
          CHOOSE IDENTITY
        </text>
      </g>

      {/* OPTION B CARD (RIGHT) */}
      <g transform="translate(1440, 480)">
        <rect x={-250} y={-220} width={500} height={440} rx={28} fill="rgba(15, 23, 42, 0.95)" stroke="#10B981" strokeWidth={5} />
        {/* Badge */}
        <rect x={-140} y={-250} width={280} height={56} rx={16} fill="#10B981" />
        <text x={0} y={-215} fill="#FFFFFF" fontSize={24} fontWeight="900" fontFamily="sans-serif" textAnchor="middle">
          OPTION B
        </text>

        <text x={0} y={-140} fill="#34D399" fontSize={30} fontWeight="900" textAnchor="middle">
          KEEP $10,000,000
        </text>
        <text x={0} y={-80} fill="#E2E8F0" fontSize={18} fontWeight="bold" textAnchor="middle">
          ✓ Billionaire Lifestyle Forever
        </text>
        <text x={0} y={-45} fill="#E2E8F0" fontSize={18} fontWeight="bold" textAnchor="middle">
          ✓ Ultimate Freedom & Power
        </text>
        <text x={0} y={15} fill="#EF4444" fontSize={20} fontWeight="900" textAnchor="middle">
          ✕ Total Amnesia
        </text>
        <text x={0} y={55} fill="#94A3B8" fontSize={16} textAnchor="middle">
          Never know who you are
        </text>

        <rect x={-180} y={110} width={360} height={60} rx={14} fill="#059669" stroke="#FFFFFF" strokeWidth={2} />
        <text x={0} y={148} fill="#FFFFFF" fontSize={22} fontWeight="900" textAnchor="middle">
          CHOOSE WEALTH
        </text>
      </g>

      {/* Pip Stickman in Center */}
      <Hero p={pipPose} look={LOOKS.pip} f={f} />

      {/* Bottom Subscribe Banner */}
      <g transform="translate(960, 1010)">
        <rect x={-450} y={-35} width={900} height={70} rx={18} fill="#0F172A" stroke="#F59E0B" strokeWidth={3} />
        <text x={0} y={8} fill="#FDE68A" fontSize={22} fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">
          COMMENT YOUR CHOICE BELOW & SUBSCRIBE TO WHAT-EIF!
        </text>
      </g>
    </g>
  );
};

// =========================================================================
// SHORT COMPONENT: 9:16 VERTICAL (100% INFINITE SEAMLESS LOOP)
// =========================================================================
export const DeleteMemoryShort: React.FC<{ f: number }> = ({ f }) => {
  // Pacing: 5 scenes across 1027 frames (~34.2s)
  // Scene 1: frames 0-210 (~7.0s) - App & first $100K
  // Scene 2: frames 210-420 (~7.0s) - Penthouse & $3M cash
  // Scene 3: frames 420-630 (~7.0s) - Friend approaches & blank static
  // Scene 4: frames 630-840 (~7.0s) - Glitch static head & underground vault
  // Scene 5: frames 840-1027 (~6.2s) - Looping hook ending back to start!

  const scene = f < 210 ? 1 : f < 420 ? 2 : f < 630 ? 3 : f < 840 ? 4 : 5;
  const shake = scene === 4 || scene === 5 ? Math.sin(f * 1.5) * 6 : 0;

  const pipPose = makePipPose(f, {
    x: 540 + shake,
    y: 1320,
    expr: scene === 1 ? 'neutral' : scene === 2 ? 'happy' : scene === 3 ? 'worried' : 'shock',
    ...(scene === 1 ? POSE_PHONE : scene === 2 ? POSE_POCKETS : scene === 3 ? POSE_CONFUSED : POSE_HEADACHE),
  });

  return (
    <g>
      {/* Dynamic Backgrounds per scene */}
      {scene === 1 && (
        <image href={staticFile('delete-memory/bg_empty_bedroom.jpg')} x={-400} y={0} width={1880} height={1920} preserveAspectRatio="xMidYMid slice" />
      )}
      {scene === 2 && (
        <image href={staticFile('delete-memory/bg_luxury_penthouse.jpg')} x={-400} y={0} width={1880} height={1920} preserveAspectRatio="xMidYMid slice" />
      )}
      {scene === 3 && (
        <image href={staticFile('delete-memory/bg_contract_office.jpg')} x={-400} y={0} width={1880} height={1920} preserveAspectRatio="xMidYMid slice" />
      )}
      {(scene === 4 || scene === 5) && (
        <image href={staticFile('delete-memory/bg_biotech_vault.jpg')} x={-400} y={0} width={1880} height={1920} preserveAspectRatio="xMidYMid slice" />
      )}

      {/* Dark Vignette Overlay */}
      <rect x={0} y={0} width={1080} height={1920} fill="rgba(10, 15, 26, 0.45)" />

      {/* Top Floating Hook Headline */}
      <g transform="translate(540, 240)">
        <rect x={-460} y={-80} width={920} height={160} rx={28} fill="rgba(15, 23, 42, 0.95)" stroke="#06B6D4" strokeWidth={5} />
        <text x={0} y={-15} fill="#FFFFFF" fontSize={36} fontWeight="900" fontFamily="sans-serif" textAnchor="middle">
          I DELETED 1 MEMORY
        </text>
        <text x={0} y={45} fill="#10B981" fontSize={42} fontWeight="900" fontFamily="sans-serif" textAnchor="middle">
          FOR $100,000 CASH 🧠
        </text>
      </g>

      {/* Scene Elements */}
      {scene === 1 && (
        <MindPurgePhone
          x={540}
          y={660}
          frame={f}
          title="GRADE SCHOOL MEMORY"
          cashAmount="+$100,000.00"
          status={f > 110 ? 'PURGED ✓' : 'TAP TO DELETE'}
          scale={1.8}
          isDeleted={f > 110}
        />
      )}

      {scene === 2 && (
        <g>
          <CashStacks x={540} y={1520} count={6} />
          {/* Floating Balance */}
          <g transform="translate(540, 620)">
            <rect x={-260} y={-50} width={520} height={100} rx={22} fill="#064E3B" stroke="#10B981" strokeWidth={5} />
            <text x={0} y={-10} fill="#A7F3D0" fontSize={20} fontWeight="bold" textAnchor="middle">
              DAY 30 WEALTH:
            </text>
            <text x={0} y={35} fill="#FFFFFF" fontSize={44} fontWeight="900" fontFamily="monospace" textAnchor="middle">
              $3,000,000.00
            </text>
          </g>
        </g>
      )}

      {scene === 3 && (
        <g transform="translate(540, 640)">
          <rect x={-320} y={-100} width={640} height={200} rx={24} fill="#1E293B" stroke="#EF4444" strokeWidth={4} />
          <text x={0} y={-40} fill="#EF4444" fontSize={28} fontWeight="900" textAnchor="middle">
            MEMORY LOSS DETECTED
          </text>
          <text x={0} y={10} fill="#FFFFFF" fontSize={26} fontWeight="bold" textAnchor="middle">
            "WHO IS MY BEST FRIEND?"
          </text>
          <text x={0} y={60} fill="#94A3B8" fontSize={24} textAnchor="middle">
            DATA ERASED FROM BRAIN
          </text>
        </g>
      )}

      {(scene === 4 || scene === 5) && (
        <g>
          <MemoryVial x={540} y={640} frame={f} label="LOT #07: IDENTITY" color="#06B6D4" scale={1.8} />
          {/* Glitch Cubes */}
          {Array.from({ length: 18 }).map((_, i) => (
            <rect
              key={i}
              x={540 + Math.sin(i * 2.5 + f) * 160}
              y={980 + Math.cos(i * 1.8 + f) * 140}
              width={26}
              height={26}
              fill={i % 2 === 0 ? '#06B6D4' : '#EF4444'}
              opacity={0.8}
            />
          ))}
        </g>
      )}

      {/* Pip Stickman Hero */}
      <Hero p={pipPose} look={LOOKS.pip} f={f} />

      {/* Bottom Looping Hook Prompt for infinite Shorts replay */}
      {scene === 5 && (
        <g transform="translate(540, 1680)">
          <rect x={-380} y={-40} width={760} height={80} rx={20} fill="#1E1B4B" stroke="#818CF8" strokeWidth={3} />
          <text x={0} y={10} fill="#C7D2FE" fontSize={22} fontWeight="bold" textAnchor="middle">
            🔄 WATCH AGAIN TO CATCH THE CLUES!
          </text>
        </g>
      )}
    </g>
  );
};
