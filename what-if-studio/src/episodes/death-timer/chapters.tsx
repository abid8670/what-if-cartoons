import React from 'react';
import { interpolate, spring, staticFile } from 'remotion';
import { Hero, LOOKS, Look, C } from '../../engine';

const GROUND_Y = 820;

// Custom Look for the Loyal Girl Companion (Green coat & yellow scarf)
const GIRL_LOOK: Look = {
  skin: C.skin,
  skinShade: C.skinShade,
  hand: C.skin,
  jacket: '#2A433A',      // Pine green
  jacketShade: '#1C2F28',
  accent: '#F59E0B',      // Mustard yellow scarf
  limb: '#1E293B',
  line: '#0F172A',
  shoe: '#D97706',
  face: '#0F172A',
  hair: '#1E1B2E',
  extra: 'bob',
};

// Holographic Floating Death Timer HUD
export const DeathTimerHUD: React.FC<{
  x: number;
  y: number;
  timeStr: string;
  status?: 'green' | 'red' | 'cyan';
  pulse?: boolean;
  scale?: number;
}> = ({ x, y, timeStr, status = 'green', pulse = false, scale = 1.0 }) => {
  const colorMap = {
    green: { primary: '#10B981', bg: '#064E3B', glow: 'rgba(16,185,129,0.7)' },
    red: { primary: '#EF4444', bg: '#450A0A', glow: 'rgba(239,68,68,0.85)' },
    cyan: { primary: '#06B6D4', bg: '#083344', glow: 'rgba(6,182,212,0.8)' },
  };

  const current = colorMap[status];
  const glowStyle = pulse
    ? `drop-shadow(0 0 16px ${current.glow}) drop-shadow(0 0 6px ${current.primary})`
    : `drop-shadow(0 0 10px ${current.glow})`;

  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`} style={{ filter: glowStyle }}>
      {/* HUD Background Panel */}
      <rect
        x={-110}
        y={-34}
        width={220}
        height={52}
        rx={14}
        fill={current.bg}
        opacity={0.92}
        stroke={current.primary}
        strokeWidth={2.5}
      />
      {/* Corner Tech Brackets */}
      <path d="M -102 -24 L -102 -16 M -102 -24 L -94 -24" stroke={current.primary} strokeWidth={2} fill="none" />
      <path d="M 102 -24 L 102 -16 M 102 -24 L 94 -24" stroke={current.primary} strokeWidth={2} fill="none" />
      <path d="M -102 10 L -102 2 M -102 10 L -94 10" stroke={current.primary} strokeWidth={2} fill="none" />
      <path d="M 102 10 L 102 2 M 102 10 L 94 10" stroke={current.primary} strokeWidth={2} fill="none" />

      {/* Clock Icon */}
      <circle cx={-80} cy={-8} r={9} fill="none" stroke={current.primary} strokeWidth={2} />
      <path d="M -80 -12 L -80 -8 L -77 -6" stroke={current.primary} strokeWidth={2} fill="none" />

      {/* Countdown Text */}
      <text
        x={12}
        y={0}
        fill="#FFFFFF"
        fontSize={22}
        fontFamily="'Courier New', Courier, monospace"
        fontWeight="bold"
        textAnchor="middle"
        letterSpacing={1.5}
      >
        {timeStr}
      </text>

      {/* Hologram Beam down to head */}
      <line
        x1={0}
        y1={18}
        x2={0}
        y2={44}
        stroke={current.primary}
        strokeWidth={2}
        strokeDasharray="4 3"
        opacity={0.7}
      />
      <circle cx={0} cy={44} r={3} fill={current.primary} />
    </g>
  );
};

// -------------------------------------------------------------------------
// CHAPTER 1: THE CURSE AWAKENS (Frame 0 Hook, Morning City Street)
// -------------------------------------------------------------------------
export const DeathTimerCh1: React.FC<{ f?: number; frame?: number }> = ({ f, frame }) => {
  const currentF = f ?? frame ?? 0;
  const panX = interpolate(currentF, [0, 943], [0, -40]);

  // Pip wake-up / realization
  const pipBob = Math.sin(currentF * 0.1) * 3;
  const isShocked = currentF > 200;

  // Background Commuters
  const commuter1X = interpolate(currentF, [0, 943], [1300, 1080]);
  const commuter2X = interpolate(currentF, [0, 943], [1620, 1460]);

  // Timers appear at frame 90
  const timerReveal = spring({ frame: currentF - 90, fps: 30, config: { damping: 12 } });
  const timerScale = interpolate(timerReveal, [0, 1], [0, 1]);

  return (
    <g>
      {/* Background Street */}
      <g transform={`translate(${panX}, 0)`}>
        <image
          href={staticFile('death-timer/bg_city_street.jpg')}
          x={-100}
          y={0}
          width={2120}
          height={1080}
          preserveAspectRatio="xMidYMid slice"
        />
      </g>

      {/* Commuter 1 (Green 78y) */}
      <g transform={`translate(${commuter1X}, 0)`}>
        <ellipse cx={0} cy={GROUND_Y + 10} rx={55} ry={13} fill="rgba(0,0,0,0.45)" />
        <Hero
          pose={{
            x: 0,
            y: GROUND_Y - 130 + Math.sin(currentF * 0.2) * 4,
            scale: 0.88,
            facing: -1,
            tilt: 2,
            head: { expr: 'idle', look: { x: -1, y: 0 }, tilt: 0 },
            armL: { a: Math.sin(currentF * 0.2) * 30, b: 20 },
            armR: { a: -Math.sin(currentF * 0.2) * 30, b: 20 },
            legL: { a: -Math.sin(currentF * 0.2) * 35, b: 15 },
            legR: { a: Math.sin(currentF * 0.2) * 35, b: 15 },
          }}
          look={LOOKS.suit}
        />
        {currentF > 90 && (
          <DeathTimerHUD
            x={0}
            y={GROUND_Y - 290}
            timeStr="78y 214d"
            status="green"
            scale={timerScale * 0.85}
          />
        )}
      </g>

      {/* Commuter 2 (Green 43y) */}
      <g transform={`translate(${commuter2X}, 0)`}>
        <ellipse cx={0} cy={GROUND_Y + 10} rx={50} ry={12} fill="rgba(0,0,0,0.45)" />
        <Hero
          pose={{
            x: 0,
            y: GROUND_Y - 130 + Math.sin(currentF * 0.22) * 4,
            scale: 0.82,
            facing: -1,
            tilt: 0,
            head: { expr: 'idle', look: { x: -1, y: 0 }, tilt: 0 },
            armL: { a: -Math.sin(currentF * 0.22) * 25, b: 15 },
            armR: { a: Math.sin(currentF * 0.22) * 25, b: 15 },
            legL: { a: Math.sin(currentF * 0.22) * 30, b: 10 },
            legR: { a: -Math.sin(currentF * 0.22) * 30, b: 10 },
          }}
          look={LOOKS.coolStickman}
        />
        {currentF > 110 && (
          <DeathTimerHUD
            x={0}
            y={GROUND_Y - 275}
            timeStr="43y 012d"
            status="green"
            scale={timerScale * 0.8}
          />
        )}
      </g>

      {/* Pip Center Stage */}
      <g transform="translate(680, 0)">
        <ellipse cx={0} cy={GROUND_Y + 10} rx={65} ry={15} fill="rgba(0,0,0,0.55)" />
        <Hero
          pose={{
            x: 0,
            y: GROUND_Y - 130 + pipBob,
            scale: 1.0,
            facing: 1,
            tilt: isShocked ? -4 : 0,
            head: {
              expr: isShocked ? 'shock' : 'think',
              look: { x: isShocked ? 1 : 0, y: isShocked ? -1 : 0 },
              tilt: isShocked ? -6 : 0,
            },
            armL: { a: isShocked ? -45 : -20, b: isShocked ? 75 : 30 },
            armR: { a: isShocked ? 45 : 20, b: isShocked ? 75 : 30 },
            legL: { a: 0, b: 0 },
            legR: { a: 0, b: 0 },
          }}
          look={LOOKS.pipHood}
        />
      </g>

      {/* Floating HUD Question Badge */}
      {currentF > 450 && (
        <g
          transform={`translate(960, 160) scale(${spring({ frame: currentF - 450, fps: 30 })})`}
          style={{ filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.85))' }}
        >
          <rect x={-340} y={-45} width={680} height={90} rx={20} fill="#0F172A" stroke="#10B981" strokeWidth={3} />
          <text x={0} y={10} fill="#FFFFFF" fontSize={32} fontWeight="bold" fontFamily="system-ui" textAnchor="middle">
            CAN YOU SEE THE TIME TICKING? ⏳👀
          </text>
        </g>
      )}
    </g>
  );
};

// -------------------------------------------------------------------------
// CHAPTER 2: THE SUBWAY GLITCH & CHEATING FATE (Platform Rescue)
// -------------------------------------------------------------------------
export const DeathTimerCh2: React.FC<{ f?: number; frame?: number }> = ({ f, frame }) => {
  const currentF = f ?? frame ?? 0;
  const trainComing = currentF > 420;
  const isRedAlarm = currentF > 210 && currentF < 720;
  const isSaved = currentF >= 720;

  // Commuter countdown
  let timerText = "58y 290d";
  let timerStatus: 'green' | 'red' | 'cyan' = 'green';
  if (currentF > 210 && currentF < 720) {
    const secLeft = Math.max(2, Math.floor(interpolate(currentF, [210, 680], [12, 2])));
    timerText = `00h 00m 0${secLeft}s`;
    timerStatus = 'red';
  } else if (isSaved) {
    timerText = "58y 290d";
    timerStatus = 'cyan';
  }

  // Stumble & Rescue Physics
  const commuterX = currentF < 580 ? 1120 : currentF < 680 ? interpolate(currentF, [580, 680], [1120, 1280]) : interpolate(currentF, [680, 750], [1280, 960]);
  const pipX = currentF < 580 ? 620 : currentF < 680 ? interpolate(currentF, [580, 680], [620, 1200]) : 860;

  return (
    <g>
      {/* Subway Platform Background */}
      <image
        href={staticFile('death-timer/bg_subway_platform.jpg')}
        x={0}
        y={0}
        width={1920}
        height={1080}
        preserveAspectRatio="xMidYMid slice"
      />

      {/* Train Light Rush in Tunnel */}
      {trainComing && (
        <rect
          x={1400}
          y={350}
          width={520}
          height={480}
          fill="#FDE047"
          opacity={interpolate(currentF % 10, [0, 5, 10], [0.15, 0.45, 0.15])}
        />
      )}

      {/* Red Alert Flash over scene */}
      {isRedAlarm && (
        <rect width={1920} height={1080} fill="#EF4444" opacity={(currentF % 16 < 8 ? 0.12 : 0.02)} pointerEvents="none" />
      )}

      {/* Commuter */}
      <g transform={`translate(${commuterX}, 0)`}>
        <ellipse cx={0} cy={GROUND_Y + 10} rx={60} ry={14} fill="rgba(0,0,0,0.6)" />
        <Hero
          pose={{
            x: 0,
            y: GROUND_Y - 130,
            scale: 0.95,
            facing: currentF > 580 && currentF < 680 ? 1 : -1,
            tilt: currentF > 580 && currentF < 680 ? 18 : 0,
            head: { expr: isRedAlarm ? 'shock' : 'idle', look: { x: 1, y: 0 }, tilt: 0 },
            armL: { a: isRedAlarm ? -40 : -15, b: 30 },
            armR: { a: isRedAlarm ? 40 : 15, b: 30 },
            legL: { a: 0, b: 0 },
            legR: { a: 0, b: 0 },
          }}
          look={LOOKS.suit}
        />
        <DeathTimerHUD
          x={0}
          y={GROUND_Y - 300}
          timeStr={timerText}
          status={timerStatus}
          pulse={isRedAlarm}
          scale={1.05}
        />
      </g>

      {/* Pip */}
      <g transform={`translate(${pipX}, 0)`}>
        <ellipse cx={0} cy={GROUND_Y + 10} rx={60} ry={14} fill="rgba(0,0,0,0.55)" />
        <Hero
          pose={{
            x: 0,
            y: GROUND_Y - 130,
            scale: 1.0,
            facing: 1,
            tilt: currentF > 580 && currentF < 680 ? 15 : 0,
            head: { expr: isRedAlarm ? 'shock' : 'happy', look: { x: 1, y: 0 }, tilt: 0 },
            armL: { a: currentF > 580 && currentF < 680 ? -60 : -20, b: 60 },
            armR: { a: currentF > 580 && currentF < 680 ? 60 : 20, b: 60 },
            legL: { a: currentF > 580 && currentF < 680 ? -30 : 0, b: 10 },
            legR: { a: currentF > 580 && currentF < 680 ? 30 : 0, b: 10 },
          }}
          look={LOOKS.pipHood}
        />
      </g>

      {/* Fate Reset Ring */}
      {isSaved && currentF < 840 && (
        <circle
          cx={commuterX}
          cy={GROUND_Y - 300}
          r={interpolate(currentF - 720, [0, 120], [10, 320], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' })}
          fill="none"
          stroke="#06B6D4"
          strokeWidth={interpolate(currentF - 720, [0, 120], [8, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' })}
          opacity={0.8}
        />
      )}

      {/* HUD Banner */}
      {isSaved && (
        <g transform="translate(960, 150)" style={{ filter: 'drop-shadow(0 8px 24px rgba(6,182,212,0.6))' }}>
          <rect x={-280} y={-40} width={560} height={80} rx={16} fill="#083344" stroke="#06B6D4" strokeWidth={3} />
          <text x={0} y={8} fill="#FFFFFF" fontSize={28} fontWeight="bold" fontFamily="system-ui" textAnchor="middle">
            FATE REWRITTEN: +58 YEARS ✨
          </text>
        </g>
      )}
    </g>
  );
};

// -------------------------------------------------------------------------
// CHAPTER 3: THE WEIGHT OF THE BURDEN (Park & Distant Hospital)
// -------------------------------------------------------------------------
export const DeathTimerCh3: React.FC<{ f?: number; frame?: number }> = ({ f, frame }) => {
  const currentF = f ?? frame ?? 0;
  const panX = interpolate(currentF, [0, 957], [0, -30]);

  // Pip walking slowly in deep contemplation
  const pipX = interpolate(currentF, [0, 957], [380, 820]);
  const oldManX = 1380;
  const coupleX = 1660;

  return (
    <g>
      <g transform={`translate(${panX}, 0)`}>
        <image
          href={staticFile('death-timer/bg_park_hospital.jpg')}
          x={-50}
          y={0}
          width={2020}
          height={1080}
          preserveAspectRatio="xMidYMid slice"
        />
      </g>

      {/* Melancholic Rain/Mist Overlay */}
      <rect width={1920} height={1080} fill="#1E293B" opacity={0.25} pointerEvents="none" />

      {/* Old man on bench */}
      <g transform={`translate(${oldManX}, 0)`}>
        <ellipse cx={0} cy={GROUND_Y + 10} rx={55} ry={13} fill="rgba(0,0,0,0.5)" />
        <Hero
          pose={{
            x: 0,
            y: GROUND_Y - 110,
            scale: 0.88,
            facing: -1,
            tilt: 4,
            head: { expr: 'idle', look: { x: -1, y: 0 }, tilt: 0 },
            armL: { a: -10, b: 40 },
            armR: { a: 20, b: 40 },
            legL: { a: 45, b: 60 },
            legR: { a: 45, b: 60 },
          }}
          look={LOOKS.suit}
        />
        <DeathTimerHUD
          x={0}
          y={GROUND_Y - 260}
          timeStr="00y 02d 14h"
          status="red"
          pulse={true}
          scale={0.9}
        />
      </g>

      {/* Young couple in distance */}
      <g transform={`translate(${coupleX}, 0)`}>
        <ellipse cx={0} cy={GROUND_Y + 10} rx={45} ry={11} fill="rgba(0,0,0,0.4)" />
        <Hero
          pose={{
            x: 0,
            y: GROUND_Y - 110,
            scale: 0.78,
            facing: 1,
            tilt: 0,
            head: { expr: 'happy', look: { x: 1, y: 0 }, tilt: 0 },
            armL: { a: -15, b: 20 },
            armR: { a: 15, b: 20 },
            legL: { a: 0, b: 0 },
            legR: { a: 0, b: 0 },
          }}
          look={LOOKS.coolStickman}
        />
        <DeathTimerHUD
          x={0}
          y={GROUND_Y - 230}
          timeStr="00y 04m 12d"
          status="green"
          scale={0.75}
        />
      </g>

      {/* Pip Heavy Walk */}
      <g transform={`translate(${pipX}, 0)`}>
        <ellipse cx={0} cy={GROUND_Y + 10} rx={65} ry={15} fill="rgba(0,0,0,0.55)" />
        <Hero
          pose={{
            x: 0,
            y: GROUND_Y - 130 + Math.sin(currentF * 0.15) * 3,
            scale: 1.0,
            facing: 1,
            tilt: -2,
            head: { expr: 'think', look: { x: 0, y: 1 }, tilt: 4 },
            armL: { a: Math.sin(currentF * 0.15) * 20, b: 15 },
            armR: { a: -Math.sin(currentF * 0.15) * 20, b: 15 },
            legL: { a: -Math.sin(currentF * 0.15) * 25, b: 10 },
            legR: { a: Math.sin(currentF * 0.15) * 25, b: 10 },
          }}
          look={LOOKS.pipHood}
        />
      </g>

      {/* Narrative Card */}
      {currentF > 350 && (
        <g transform="translate(960, 160)" style={{ filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.8))' }}>
          <rect x={-360} y={-45} width={720} height={90} rx={18} fill="#0F172A" stroke="#EF4444" strokeWidth={2.5} opacity={0.92} />
          <text x={0} y={10} fill="#FCA5A5" fontSize={26} fontWeight="bold" fontFamily="system-ui" textAnchor="middle">
            "Knowing when a story ends makes you a prisoner of grief."
          </text>
        </g>
      )}
    </g>
  );
};

// -------------------------------------------------------------------------
// CHAPTER 4: THE RED BLINKING AT HOME (The Balcony Collapse Save)
// -------------------------------------------------------------------------
export const DeathTimerCh4: React.FC<{ f?: number; frame?: number }> = ({ f, frame }) => {
  const currentF = f ?? frame ?? 0;
  const isAlarm = currentF > 360 && currentF < 1100;
  const isSaved = currentF >= 1100;

  let girlTimer = "64y 118d";
  let girlStatus: 'green' | 'red' | 'cyan' = 'green';
  if (currentF < 360) {
    girlTimer = "?? ? ??";
  } else if (isAlarm) {
    const sec = Math.max(1, Math.floor(interpolate(currentF, [360, 1050], [45, 1])));
    girlTimer = `00h 00m ${sec < 10 ? '0' + sec : sec}s`;
    girlStatus = 'red';
  } else {
    girlTimer = "64y 118d";
    girlStatus = 'green';
  }

  // Escape physics (Pip grabs her and runs outside)
  const girlX = currentF < 750 ? 1160 : interpolate(currentF, [750, 950], [1160, 520]);
  const pipX = currentF < 750 ? 760 : interpolate(currentF, [750, 950], [760, 400]);

  // Balcony collapse debris
  const debrisFall = currentF > 980 ? interpolate(currentF - 980, [0, 40], [0, 600], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }) : 0;

  return (
    <g>
      {/* Warm Room Background */}
      <image
        href={staticFile('death-timer/bg_warm_room.jpg')}
        x={0}
        y={0}
        width={1920}
        height={1080}
        preserveAspectRatio="xMidYMid slice"
      />

      {/* Red Alarm Vignette */}
      {isAlarm && (
        <rect
          width={1920}
          height={1080}
          fill="#EF4444"
          opacity={currentF % 16 < 8 ? 0.16 : 0.04}
          pointerEvents="none"
        />
      )}

      {/* Falling Debris at frame 980 */}
      {currentF > 980 && (
        <g transform={`translate(1160, ${debrisFall})`} style={{ filter: 'drop-shadow(0 20px 30px black)' }}>
          <rect x={-140} y={-80} width={280} height={120} fill="#334155" rx={8} />
          <polygon points="-120,40 -90,90 -40,40" fill="#1E293B" />
          <polygon points="40,40 80,95 130,40" fill="#475569" />
          <text x={0} y={-20} fill="#94A3B8" fontSize={24} fontWeight="bold" textAnchor="middle">CRASH!!</text>
        </g>
      )}

      {/* Loyal Girl */}
      <g transform={`translate(${girlX}, 0)`}>
        <ellipse cx={0} cy={GROUND_Y + 10} rx={60} ry={14} fill="rgba(0,0,0,0.55)" />
        <Hero
          pose={{
            x: 0,
            y: GROUND_Y - 120,
            scale: 0.95,
            facing: -1,
            tilt: 0,
            head: { expr: isAlarm ? 'shock' : 'happy', look: { x: -1, y: 0 }, tilt: 0 },
            armL: { a: -20, b: 30 },
            armR: { a: 20, b: 30 },
            legL: { a: currentF < 750 ? 40 : 0, b: currentF < 750 ? 60 : 0 },
            legR: { a: currentF < 750 ? 40 : 0, b: currentF < 750 ? 60 : 0 },
          }}
          look={GIRL_LOOK}
        />
        <DeathTimerHUD
          x={0}
          y={GROUND_Y - 290}
          timeStr={girlTimer}
          status={girlStatus}
          pulse={isAlarm}
          scale={1.1}
        />
      </g>

      {/* Pip */}
      <g transform={`translate(${pipX}, 0)`}>
        <ellipse cx={0} cy={GROUND_Y + 10} rx={60} ry={14} fill="rgba(0,0,0,0.55)" />
        <Hero
          pose={{
            x: 0,
            y: GROUND_Y - 130,
            scale: 1.0,
            facing: 1,
            tilt: isAlarm ? 10 : 0,
            head: { expr: isAlarm ? 'shock' : 'idle', look: { x: 1, y: 0 }, tilt: 0 },
            armL: { a: isAlarm ? -50 : -20, b: 50 },
            armR: { a: isAlarm ? 50 : 20, b: 50 },
            legL: { a: 0, b: 0 },
            legR: { a: 0, b: 0 },
          }}
          look={LOOKS.pipHood}
        />
      </g>

      {/* Saved Emerald Chime Halo */}
      {isSaved && currentF < 1300 && (
        <circle
          cx={girlX}
          cy={GROUND_Y - 290}
          r={interpolate(currentF - 1100, [0, 200], [20, 500], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' })}
          fill="none"
          stroke="#10B981"
          strokeWidth={interpolate(currentF - 1100, [0, 200], [10, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' })}
          opacity={0.7}
        />
      )}

      {/* Resolution Badge */}
      {isSaved && (
        <g transform="translate(960, 150)" style={{ filter: 'drop-shadow(0 8px 24px rgba(16,185,129,0.7))' }}>
          <rect x={-280} y={-40} width={560} height={80} rx={16} fill="#064E3B" stroke="#10B981" strokeWidth={3} />
          <text x={0} y={8} fill="#FFFFFF" fontSize={28} fontWeight="bold" fontFamily="system-ui" textAnchor="middle">
            SAVED: +64 YEARS ❤️
          </text>
        </g>
      )}
    </g>
  );
};

// -------------------------------------------------------------------------
// CHAPTER 5: THE MIRROR & THE ULTIMATE QUESTION (The Moral Choice)
// -------------------------------------------------------------------------
export const DeathTimerCh5: React.FC<{ f?: number; frame?: number }> = ({ f, frame }) => {
  const currentF = f ?? frame ?? 0;
  const clothY = currentF < 200 ? 0 : currentF < 500 ? interpolate(currentF, [200, 500], [0, 80], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }) : interpolate(currentF, [500, 650], [80, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });

  // Interactive Question Card at frame 680
  const cardScale = spring({ frame: currentF - 680, fps: 30, config: { damping: 14 } });
  const bellBounce = currentF > 1100 ? Math.sin((currentF - 1100) * 0.4) * 8 : 0;

  return (
    <g>
      {/* Bathroom Background */}
      <image
        href={staticFile('death-timer/bg_bathroom_mirror.jpg')}
        x={0}
        y={0}
        width={1920}
        height={1080}
        preserveAspectRatio="xMidYMid slice"
      />

      {/* The Draped Mirror Cloth */}
      <g transform={`translate(960, ${440 + clothY})`}>
        <rect x={-220} y={-240} width={440} height={480} rx={16} fill="#1E293B" stroke="#475569" strokeWidth={4} />
        <path d="M -220 -20 Q 0 40 220 -20 L 220 240 L -220 240 Z" fill="#0F172A" opacity={0.6} />
        <text x={0} y={20} fill="#94A3B8" fontSize={22} fontWeight="bold" textAnchor="middle" letterSpacing={2}>
          DO NOT LOOK
        </text>
      </g>

      {/* Pip in front of mirror */}
      <g transform="translate(960, 0)">
        <ellipse cx={0} cy={GROUND_Y + 10} rx={70} ry={16} fill="rgba(0,0,0,0.6)" />
        <Hero
          pose={{
            x: 0,
            y: GROUND_Y - 130,
            scale: 1.05,
            facing: 1,
            tilt: 0,
            head: { expr: currentF < 500 ? 'think' : 'happy', look: { x: 0, y: -1 }, tilt: 0 },
            armL: { a: currentF < 500 ? -40 : -15, b: 30 },
            armR: { a: currentF < 500 ? 50 : 15, b: 50 },
            legL: { a: 0, b: 0 },
            legR: { a: 0, b: 0 },
          }}
          look={LOOKS.pipHood}
        />
      </g>

      {/* Interactive Comment Challenge Card */}
      {currentF > 680 && (
        <g
          transform={`translate(960, 500) scale(${cardScale})`}
          style={{ filter: 'drop-shadow(0 20px 50px rgba(0,0,0,0.95))' }}
        >
          <rect x={-520} y={-250} width={1040} height={500} rx={28} fill="#0F172A" stroke="#EF4444" strokeWidth={4} />

          <text x={0} y={-180} fill="#FDE047" fontSize={34} fontWeight="900" fontFamily="system-ui" textAnchor="middle">
            💬 ULTIMATE QUESTION:
          </text>
          <text x={0} y={-120} fill="#FFFFFF" fontSize={28} fontWeight="bold" fontFamily="system-ui" textAnchor="middle">
            Would you look in the mirror to see YOUR OWN death timer?
          </text>

          {/* Option A */}
          <rect x={-460} y={-70} width={920} height={80} rx={16} fill="#1E293B" stroke="#10B981" strokeWidth={2.5} />
          <text x={-420} y={-20} fill="#10B981" fontSize={32} fontWeight="bold" fontFamily="system-ui">
            👉 OPTION A:
          </text>
          <text x={-180} y={-20} fill="#FFFFFF" fontSize={28} fontWeight="bold" fontFamily="system-ui">
            "YES — I want to prepare and say goodbyes."
          </text>

          {/* Option B */}
          <rect x={-460} y={30} width={920} height={80} rx={16} fill="#1E293B" stroke="#EF4444" strokeWidth={2.5} />
          <text x={-420} y={80} fill="#EF4444" fontSize={32} fontWeight="bold" fontFamily="system-ui">
            👉 OPTION B:
          </text>
          <text x={-180} y={80} fill="#FFFFFF" fontSize={28} fontWeight="bold" fontFamily="system-ui">
            "NO — I want to live freely without fear."
          </text>

          <text x={0} y={155} fill="#94A3B8" fontSize={22} fontWeight="bold" fontFamily="system-ui" textAnchor="middle">
            Drop 'Option A' or 'Option B' in the comments below! 👇
          </text>

          {/* Subscribe CTA Button with animated Bell */}
          <rect x={-220} y={180} width={440} height={56} rx={14} fill="#DC2626" />
          <text x={-20} y={218} fill="#FFFFFF" fontSize={24} fontWeight="900" fontFamily="system-ui" textAnchor="middle">
            SUBSCRIBE TO WHAT-EIF
          </text>
          <g transform={`translate(190, 208) rotate(${bellBounce})`}>
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

// -------------------------------------------------------------------------
// SHORT VERSION (9:16 Mobile Vertical Framing)
// -------------------------------------------------------------------------
export const DeathTimerShort: React.FC<{ f?: number; frame?: number }> = ({ f, frame }) => {
  const currentF = f ?? frame ?? 0;
  return (
    <g>
      {currentF < 380 ? (
        <DeathTimerCh2 f={interpolate(currentF, [0, 380], [300, 800])} />
      ) : currentF < 700 ? (
        <DeathTimerCh4 f={interpolate(currentF, [380, 700], [400, 1150])} />
      ) : (
        <DeathTimerCh5 f={interpolate(currentF, [700, 951], [600, 950])} />
      )}
    </g>
  );
};

// -------------------------------------------------------------------------
// ICONIC STICKMAN THUMBNAIL STILL
// -------------------------------------------------------------------------
export const DeathTimerThumbStill: React.FC<{ f?: number }> = () => {
  return (
    <g>
      <image
        href={staticFile('death-timer/bg_city_street.jpg')}
        width={1920}
        height={1080}
        preserveAspectRatio="xMidYMid slice"
        opacity={0.65}
      />
      <rect width={1920} height={1080} fill="#050814" opacity={0.35} />
      <ellipse cx={960} cy={820} rx={180} ry={32} fill="rgba(0,0,0,0.85)" />
      <Hero
        pose={{
          x: 960,
          y: 620,
          scale: 1.5,
          facing: 1,
          tilt: -4,
          headTilt: -18,
          armL: { a: -60, b: 65 },
          armR: { a: 60, b: 65 },
          legL: { a: -8, b: 0 },
          legR: { a: 12, b: 0 },
        }}
        look={LOOKS.pipHood}
      />
      <g transform="translate(960, 260)">
        <rect
          x={-280}
          y={-55}
          width={560}
          height={110}
          rx={24}
          fill="rgba(15, 23, 42, 0.96)"
          stroke="#EF4444"
          strokeWidth={6}
          style={{ filter: 'drop-shadow(0 0 35px rgba(239, 68, 68, 0.8))' }}
        />
        <text
          x={0}
          y={18}
          fill="#EF4444"
          fontSize={64}
          fontWeight="900"
          fontFamily="system-ui, monospace"
          textAnchor="middle"
          style={{ letterSpacing: '4px' }}
        >
          [ 00h 00m 03s ]
        </text>
      </g>
    </g>
  );
};
