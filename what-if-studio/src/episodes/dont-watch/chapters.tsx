import React from 'react';
import { interpolate, spring, staticFile } from 'remotion';
import { Hero, LOOKS, Pose } from '../../engine';

const GROUND_Y = 820;
const HIPS_Y = 687; // 820 - 140 * 0.95 (feet grounded at 820)

// ========================================================
// 1. CHAPTER 1: THE FORBIDDEN WARNING (967 frames)
// ========================================================
export const Chapter1: React.FC<{ f: number }> = ({ f }) => {
  // Stickman walking in from screen-left and stopping at x=780
  const walkProgress = interpolate(f, [0, 45], [0, 1], { extrapolateRight: 'clamp' });
  const stickX = interpolate(walkProgress, [0, 1], [300, 780]);
  const isWalking = f < 45;
  const legCycle = Math.sin(f * 0.45);

  // Button glow and pulse
  const btnPulse = Math.sin(f * 0.2) * 0.15 + 0.85;

  // Pink elephant reveal (frames 700 - 950)
  const elephantScale = spring({ frame: Math.max(0, f - 720), fps: 30, config: { damping: 12, stiffness: 160 } });

  // Warning HUD banner (frames 15 - 120)
  const hudSlide = spring({ frame: Math.max(0, f - 10), fps: 30, config: { damping: 14, stiffness: 180 } });
  const hudExit = interpolate(f, [100, 120], [0, -250], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const pose: Pose = {
    x: stickX,
    y: HIPS_Y + (isWalking ? Math.abs(Math.sin(f * 0.45)) * 6 : 0),
    scale: 0.95,
    facing: 1,
    tilt: isWalking ? 4 : (f > 180 && f < 350 ? -6 : 0),
    spin: 0,
    headTilt: f > 720 ? -12 : (f > 45 && f < 180 ? 6 : 0),
    armL: isWalking
      ? { a: -legCycle * 25, b: 15 }
      : f > 720
      ? { a: 45, b: 65 } // pointing up at elephant
      : { a: 15, b: -10 },
    armR: isWalking
      ? { a: legCycle * 25, b: 15 }
      : f > 180 && f < 400
      ? { a: 35, b: 45 } // pointing at the forbidden button
      : { a: -20, b: -10 },
    legL: isWalking ? { a: legCycle * 32, b: Math.max(0, -legCycle * 20) } : { a: 5, b: 0 },
    legR: isWalking ? { a: -legCycle * 32, b: Math.max(0, legCycle * 20) } : { a: -5, b: 0 },
    expr: f > 720 ? 'shock' : f > 200 ? 'worried' : f > 50 ? 'smug' : 'neutral',
    blink: Math.sin(f * 0.1) > 0.94 ? 1 : 0,
    look: f > 720 ? 0.8 : f > 180 && f < 400 ? 0.9 : 0,
    glasses: f > 720 ? 0 : 0,
    yaw: isWalking ? 0.3 : 0,
    squash: 0,
    handL: f > 720 ? 'point' : 'open',
    handR: f > 180 && f < 400 ? 'point' : 'open',
    sway: 0,
  };

  return (
    <g>
      {/* Background Image */}
      <image href={staticFile('dont-watch/bg_forbidden_studio.jpg')} x={0} y={0} width={1920} height={1080} preserveAspectRatio="xMidYMid slice" />

      {/* Atmospheric dark vignette */}
      <rect x={0} y={0} width={1920} height={1080} fill="#050814" opacity={0.35} />

      {/* Floor Spotlight Halo */}
      <ellipse cx={stickX} cy={GROUND_Y + 10} rx={140} ry={25} fill="#38BDF8" opacity={0.12} />

      {/* The Forbidden Pedestal and Red Button at x=1420 */}
      <g transform="translate(1420 0)">
        {/* Pedestal shadow */}
        <ellipse cx={0} cy={GROUND_Y + 12} rx={110} ry={22} fill="#000000" opacity={0.55} />
        {/* Sleek metallic pedestal body */}
        <path d={`M -65 ${GROUND_Y} L -45 520 L 45 520 L 65 ${GROUND_Y} Z`} fill="#1E293B" stroke="#334155" strokeWidth={3} />
        <ellipse cx={0} cy={520} rx={55} ry={16} fill="#0F172A" stroke="#475569" strokeWidth={2} />

        {/* Hazard warning stripes on pedestal */}
        <rect x={-40} y={560} width={80} height={20} fill="#F59E0B" />
        <line x1={-30} y1={560} x2={-15} y2={580} stroke="#000" strokeWidth={4} />
        <line x1={-10} y1={560} x2={5} y2={580} stroke="#000" strokeWidth={4} />
        <line x1={10} y1={560} x2={25} y2={580} stroke="#000" strokeWidth={4} />

        {/* The Big Red Button with pulsating aura */}
        <circle cx={0} cy={508} r={46 * btnPulse} fill="#EF4444" opacity={0.25} />
        <ellipse cx={0} cy={512} rx={36} ry={14} fill="#B91C1C" />
        <ellipse cx={0} cy={505} rx={34} ry={12} fill="#EF4444" stroke="#FCA5A5" strokeWidth={2} />
        <ellipse cx={0} cy={502} rx={18} ry={6} fill="#FFFFFF" opacity={0.4} />

        {/* Floating holographic label */}
        <g transform="translate(0 440)">
          <rect x={-110} y={-22} width={220} height={44} rx={12} fill="#0F172A" opacity={0.9} stroke="#EF4444" strokeWidth={2.5} />
          <text x={0} y={6} textAnchor="middle" fill="#FFFFFF" fontSize="18" fontWeight="900" fontFamily="Montserrat, sans-serif" letterSpacing="2px">
            ⚠️ DO NOT PRESS
          </text>
        </g>
      </g>

      {/* Stickman grounded on floor plane */}
      <ellipse cx={stickX} cy={GROUND_Y} rx={60} ry={14} fill="#000000" opacity={0.4} />
      <Hero pose={pose} look={LOOKS.pipInk} shadow={1.0} />

      {/* Floating Pink Elephant with Sunglasses (Thought Bubble Paradox) */}
      {f > 700 && (
        <g transform={`translate(1080 340) scale(${elephantScale})`}>
          {/* Cloud Bubble Backdrop */}
          <ellipse cx={0} cy={0} rx={150} ry={100} fill="#FDF2F8" stroke="#F472B6" strokeWidth={4} />
          <circle cx={-90} cy={-40} r={45} fill="#FDF2F8" />
          <circle cx={90} cy={-40} r={50} fill="#FDF2F8" />
          <circle cx={0} cy={-70} r={55} fill="#FDF2F8" />

          {/* Thought bubbles leading to stickman head */}
          <circle cx={-130} cy={120} r={18} fill="#FDF2F8" stroke="#F472B6" strokeWidth={2} />
          <circle cx={-170} cy={165} r={10} fill="#FDF2F8" stroke="#F472B6" strokeWidth={2} />

          {/* Pink Elephant Body */}
          <ellipse cx={10} cy={20} rx={75} ry={55} fill="#F472B6" />
          {/* Elephant Head */}
          <circle cx={-40} cy={0} r={42} fill="#EC4899" />
          {/* Big Ear */}
          <ellipse cx={-15} cy={-10} rx={22} ry={34} fill="#DB2777" />
          {/* Trunk */}
          <path d="M -75 -5 Q -105 10 -90 45 Q -80 60 -65 50" fill="none" stroke="#EC4899" strokeWidth={16} strokeLinecap="round" />
          {/* Cool Pixel Sunglasses */}
          <rect x={-65} y={-14} width={28} height={16} fill="#0F172A" rx={2} />
          <rect x={-32} y={-14} width={24} height={16} fill="#0F172A" rx={2} />
          <line x1={-37} y1={-8} x2={-32} y2={-8} stroke="#0F172A" strokeWidth={3} />
          <line x1={-60} y1={-10} x2={-45} y2={-4} stroke="#38BDF8" strokeWidth={2} />

          {/* Label */}
          <text x={0} y={85} textAnchor="middle" fill="#BE185D" fontSize="16" fontWeight="900" fontFamily="Montserrat, sans-serif">
            DON'T THINK OF ME! 🐘🕶️
          </text>
        </g>
      )}

      {/* Top Warning HUD */}
      {f > 10 && f < 130 && (
        <g transform={`translate(960 ${80 + hudExit}) scale(${hudSlide})`}>
          <rect x={-420} y={-35} width={840} height={70} rx={20} fill="#0F172A" opacity={0.95} stroke="#EF4444" strokeWidth={3} />
          <text x={0} y={8} textAnchor="middle" fill="#FFFFFF" fontSize="24" fontWeight="900" letterSpacing="3px" fontFamily="Montserrat, sans-serif">
            🚨 REVERSE PSYCHOLOGY DETECTED: DO NOT WATCH 🚨
          </text>
        </g>
      )}
    </g>
  );
};

// ========================================================
// 2. CHAPTER 2: THE $300M CGI vs 5 LINES (1049 frames)
// ========================================================
export const Chapter2: React.FC<{ f: number }> = ({ f }) => {
  // 3D wireframe sphere rotation & pulse
  const spin = f * 2.2;
  const meshGlow = Math.sin(f * 0.15) * 0.2 + 0.8;

  // Drawing the 5 stickman lines on the right easel
  const drawProg = interpolate(f, [400, 750], [0, 5], { extrapolateRight: 'clamp' });
  const heartScale = spring({ frame: Math.max(0, f - 780), fps: 30, config: { damping: 10, stiffness: 140 } });

  // Stickman presenter position in center
  const pose: Pose = {
    x: 960,
    y: HIPS_Y,
    scale: 0.95,
    facing: 1,
    tilt: f > 400 ? 5 : -4,
    spin: 0,
    headTilt: f > 400 ? 6 : -4,
    armL: f < 400 ? { a: 45, b: 40 } : { a: 10, b: -10 }, // gesturing left at CGI
    armR: f >= 400 ? { a: 45, b: 40 } : { a: 10, b: -10 }, // gesturing right at 5 lines
    legL: { a: 6, b: 0 },
    legR: { a: -6, b: 0 },
    expr: f > 780 ? 'happy' : f > 400 ? 'neutral' : 'smug',
    blink: Math.sin(f * 0.12) > 0.93 ? 1 : 0,
    look: f >= 400 ? 0.7 : -0.7,
    glasses: 0,
    yaw: f >= 400 ? 0.2 : -0.2,
    squash: 0,
    handL: f < 400 ? 'point' : 'open',
    handR: f >= 400 ? 'point' : 'open',
    sway: 0,
  };

  return (
    <g>
      {/* Background */}
      <image href={staticFile('dont-watch/bg_cgi_lab.jpg')} x={0} y={0} width={1920} height={1080} preserveAspectRatio="xMidYMid slice" />
      <rect x={0} y={0} width={1920} height={1080} fill="#030712" opacity={0.3} />

      {/* LEFT SIDE: $300,000,000 CGI SPHERE */}
      <g transform="translate(440 450)">
        {/* Glow */}
        <circle cx={0} cy={0} r={170} fill="#38BDF8" opacity={0.12 * meshGlow} />

        {/* Rotating wireframe polygon rings */}
        {[0, 45, 90, 135].map((deg, i) => (
          <ellipse
            key={i}
            cx={0}
            cy={0}
            rx={140}
            ry={45}
            fill="none"
            stroke="#38BDF8"
            strokeWidth={2}
            strokeDasharray="8 6"
            opacity={0.7}
            transform={`rotate(${deg + spin * 0.5} 0 0)`}
          />
        ))}
        {/* Core sphere with glowing vertices */}
        <circle cx={0} cy={0} r={110} fill="none" stroke="#0284C7" strokeWidth={3} />
        {[-70, -30, 15, 60].map((vx, i) => (
          <circle key={i} cx={vx} cy={Math.sin(vx * 0.1 + f * 0.1) * 40} r={5} fill="#F59E0B" />
        ))}

        {/* Budget HUD Card */}
        <g transform="translate(0 230)">
          <rect x={-180} y={-35} width={360} height={70} rx={16} fill="#0F172A" opacity={0.9} stroke="#F59E0B" strokeWidth={2.5} />
          <text x={0} y={-5} textAnchor="middle" fill="#F8FAFC" fontSize="20" fontWeight="900" fontFamily="Montserrat, sans-serif">
            $300,000,000 CGI
          </text>
          <text x={0} y={22} textAnchor="middle" fill="#F59E0B" fontSize="14" fontWeight="700" fontFamily="Plus Jakarta Sans, sans-serif">
            400,000 VERTICES • 8K FUR
          </text>
        </g>
      </g>

      {/* VS Badge in Center Sky */}
      <g transform="translate(960 220)">
        <circle cx={0} cy={0} r={35} fill="#EF4444" stroke="#FFFFFF" strokeWidth={3} />
        <text x={0} y={8} textAnchor="middle" fill="#FFFFFF" fontSize="22" fontWeight="900" fontFamily="Montserrat, sans-serif">
          VS
        </text>
      </g>

      {/* RIGHT SIDE: THE 5 LINES (Easel Board) */}
      <g transform="translate(1480 0)">
        {/* Easel Stand grounded at GROUND_Y */}
        <ellipse cx={0} cy={GROUND_Y + 10} rx={100} ry={20} fill="#000" opacity={0.5} />
        <line x1={-60} y1={GROUND_Y} x2={-20} y2={350} stroke="#475569" strokeWidth={6} strokeLinecap="round" />
        <line x1={60} y1={GROUND_Y} x2={20} y2={350} stroke="#475569" strokeWidth={6} strokeLinecap="round" />
        <line x1={0} y1={GROUND_Y} x2={0} y2={320} stroke="#334155" strokeWidth={8} />

        {/* Whiteboard / Easel Canvas */}
        <rect x={-160} y={240} width={320} height={260} rx={14} fill="#F8FAFC" stroke="#E2E8F0" strokeWidth={4} />

        {/* The 5 Minimalist Lines drawn progressively */}
        {drawProg >= 1 && (
          // Line 1: Head
          <circle cx={0} cy={315} r={26} fill="none" stroke="#0F172A" strokeWidth={4} />
        )}
        {drawProg >= 2 && (
          // Line 2: Torso
          <line x1={0} y1={341} x2={0} y2={410} stroke="#0F172A" strokeWidth={4} strokeLinecap="round" />
        )}
        {drawProg >= 3 && (
          // Line 3: Arms
          <line x1={-40} y1={365} x2={40} y2={365} stroke="#0F172A" strokeWidth={4} strokeLinecap="round" />
        )}
        {drawProg >= 4 && (
          // Line 4: Legs
          <g>
            <line x1={0} y1={410} x2={-28} y2={465} stroke="#0F172A" strokeWidth={4} strokeLinecap="round" />
            <line x1={0} y1={410} x2={28} y2={465} stroke="#0F172A" strokeWidth={4} strokeLinecap="round" />
          </g>
        )}
        {drawProg >= 5 && (
          // Glowing Heart in Stickman Chest
          <g transform={`translate(0 365) scale(${heartScale})`}>
            <circle cx={0} cy={0} r={16} fill="#EF4444" opacity={0.3} />
            <path d="M 0 -6 Q -8 -16 -14 -6 Q -18 4 0 16 Q 18 4 14 -6 Q 8 -16 0 -6 Z" fill="#EF4444" />
          </g>
        )}

        {/* Easel HUD Label */}
        <g transform="translate(0 540)">
          <rect x={-170} y={-30} width={340} height={60} rx={14} fill="#0F172A" opacity={0.9} stroke="#38BDF8" strokeWidth={2.5} />
          <text x={0} y={-2} textAnchor="middle" fill="#F8FAFC" fontSize="18" fontWeight="900" fontFamily="Montserrat, sans-serif">
            5 BLACK LINES ($0.00)
          </text>
          <text x={0} y={20} textAnchor="middle" fill="#38BDF8" fontSize="13" fontWeight="700" fontFamily="Plus Jakarta Sans, sans-serif">
            100% PURE HUMAN SOUL
          </text>
        </g>
      </g>

      {/* Stickman Center Stage */}
      <ellipse cx={960} cy={GROUND_Y} rx={60} ry={14} fill="#000000" opacity={0.4} />
      <Hero pose={pose} look={LOOKS.pipInk} shadow={1.0} />
    </g>
  );
};

// ========================================================
// 3. CHAPTER 3: THE FORBIDDEN COMMENT SECTION (1061 frames)
// ========================================================
export const Chapter3: React.FC<{ f: number }> = ({ f }) => {
  // Comment Card Pop In (frame 180+)
  const commentScale = spring({ frame: Math.max(0, f - 180), fps: 30, config: { damping: 12, stiffness: 150 } });

  // Dynamic typing animation in comment card
  const fullText = 'I was told NOT to comment... so here is my battery: 84% 🥔🔥';
  const charCount = Math.floor(interpolate(f, [260, 650], [0, fullText.length], { extrapolateRight: 'clamp' }));
  const typedText = fullText.substring(0, charCount);
  const cursorBlink = Math.sin(f * 0.3) > 0;

  // Floating heart reactions bursting
  const heartPop = Math.max(0, Math.sin((f - 600) * 0.15));

  // Stickman panicked animation (waving arms, pointing at comment box)
  const waveCycle = Math.sin(f * 0.6);
  const pose: Pose = {
    x: 650,
    y: HIPS_Y,
    scale: 0.95,
    facing: 1,
    tilt: f > 200 ? -8 : 0,
    spin: 0,
    headTilt: f > 200 ? -10 : 0,
    armL: f > 200 ? { a: 45 + waveCycle * 25, b: 40 } : { a: 15, b: -10 },
    armR: f > 200 ? { a: 70 + waveCycle * 20, b: 50 } : { a: -15, b: -10 },
    legL: { a: 8, b: 0 },
    legR: { a: -8, b: 0 },
    expr: f > 200 ? 'shock' : 'smug',
    blink: Math.sin(f * 0.1) > 0.94 ? 1 : 0,
    look: 0.9,
    glasses: 0,
    yaw: 0.2,
    squash: f > 200 ? Math.abs(waveCycle) * 0.08 : 0,
    handL: 'open',
    handR: 'point',
    sway: 0,
  };

  return (
    <g>
      {/* Background Server Center */}
      <image href={staticFile('dont-watch/bg_algorithm_center.jpg')} x={0} y={0} width={1920} height={1080} preserveAspectRatio="xMidYMid slice" />
      <rect x={0} y={0} width={1920} height={1080} fill="#030712" opacity={0.35} />

      {/* Top Hazard Warning Tape */}
      <g transform="translate(960 90)">
        <rect x={-520} y={-35} width={1040} height={70} rx={18} fill="#FEF08A" stroke="#CA8A04" strokeWidth={4} />
        {/* Diagonal black warning bars */}
        {[-480, -360, -240, -120, 0, 120, 240, 360, 480].map((bx, i) => (
          <line key={i} x1={bx - 20} y1={-35} x2={bx + 20} y2={35} stroke="#000000" strokeWidth={12} opacity={0.2} />
        ))}
        <text x={0} y={10} textAnchor="middle" fill="#000000" fontSize="28" fontWeight="900" fontFamily="Montserrat, sans-serif" letterSpacing="4px">
          ⚠️ STRICTLY RESTRICTED: DO NOT COMMENT ⚠️
        </text>
      </g>

      {/* Floating Interactive YouTube Comment Card */}
      {f > 180 && (
        <g transform={`translate(1320 520) scale(${commentScale})`}>
          {/* Card Glow & Drop Shadow */}
          <rect x={-360} y={-190} width={720} height={380} rx={24} fill="#000000" opacity={0.45} transform="translate(10 15)" />
          {/* Card Body (Dark YouTube Theme) */}
          <rect x={-360} y={-190} width={720} height={380} rx={24} fill="#0F172A" stroke="#334155" strokeWidth={3} />

          {/* Comment Header */}
          <circle cx={-300} cy={-130} r={28} fill="#EF4444" />
          <text x={-300} y={-122} textAnchor="middle" fill="#FFFFFF" fontSize="22" fontWeight="900">
            R
          </text>
          <text x={-255} y={-136} fill="#F8FAFC" fontSize="20" fontWeight="700" fontFamily="Montserrat, sans-serif">
            @RebelViewer_42
          </text>
          <text x={-255} y={-112} fill="#94A3B8" fontSize="14" fontFamily="Plus Jakarta Sans, sans-serif">
            2 seconds ago • (Broke the rule)
          </text>

          {/* Comment Text Box */}
          <rect x={-310} y={-70} width={620} height={130} rx={14} fill="#1E293B" stroke="#475569" strokeWidth={2} />
          <text x={-285} y={-25} fill="#FFFFFF" fontSize="22" fontWeight="600" fontFamily="Plus Jakarta Sans, sans-serif">
            {typedText}
            {cursorBlink && <tspan fill="#38BDF8">|</tspan>}
          </text>

          {/* Floating Live Reactions */}
          <g transform="translate(-280 115)">
            <g transform={`scale(${1 + heartPop * 0.3})`}>
              <circle cx={0} cy={0} r={20} fill="#EF4444" opacity={0.25} />
              <text x={0} y={8} textAnchor="middle" fontSize="22">
                ❤️
              </text>
            </g>
            <text x={35} y={7} fill="#F8FAFC" fontSize="16" fontWeight="700">
              1,429
            </text>

            <g transform="translate(120 0)">
              <text x={0} y={8} textAnchor="middle" fontSize="22">
                👍
              </text>
              <text x={35} y={7} fill="#F8FAFC" fontSize="16" fontWeight="700">
                854
              </text>
            </g>

            <g transform="translate(260 0)">
              <text x={0} y={8} textAnchor="middle" fontSize="22">
                🥔
              </text>
              <text x={35} y={7} fill="#F59E0B" fontSize="16" fontWeight="900">
                POTATO SQUAD
              </text>
            </g>
          </g>

          {/* Warning Stamp across the Card */}
          <g transform="translate(200 -120) rotate(-12)">
            <rect x={-80} y={-18} width={160} height={36} rx={8} fill="#EF4444" />
            <text x={0} y={6} textAnchor="middle" fill="#FFFFFF" fontSize="14" fontWeight="900" fontFamily="Montserrat, sans-serif">
              RULE VIOLATION
            </text>
          </g>
        </g>
      )}

      {/* Stickman grounded on floor plane */}
      <ellipse cx={650} cy={GROUND_Y} rx={60} ry={14} fill="#000000" opacity={0.4} />
      <Hero pose={pose} look={LOOKS.pipInk} shadow={1.0} />
    </g>
  );
};

// ========================================================
// 4. CHAPTER 4: THE NOTHING PARADOX & REVERSE CTA (1122 frames)
// ========================================================
export const Chapter4: React.FC<{ f: number }> = ({ f }) => {
  // Countdown timer: 01:59 ticking to 02:00:00
  const seconds = Math.min(120, Math.floor(f / 30) + 84);
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  const timeStr = `0${m}:${s < 10 ? '0' : ''}${s}`;

  // Subscribe button animation: clicked at frame 620
  const isClicked = f >= 620;
  const btnClickScale = spring({ frame: Math.max(0, f - 620), fps: 30, config: { damping: 10, stiffness: 200 } });
  const bellSwing = Math.sin((f - 620) * 0.4) * 15 * (isClicked ? 1 : 0);

  // Mouse cursor moves to button
  const mouseX = interpolate(f, [540, 620], [1800, 1420], { extrapolateRight: 'clamp' });
  const mouseY = interpolate(f, [540, 620], [700, 520], { extrapolateRight: 'clamp' });

  // Stickman pose: standing confidently next to pedestal, winking & gesturing
  const pose: Pose = {
    x: 820,
    y: HIPS_Y,
    scale: 0.95,
    facing: 1,
    tilt: 4,
    spin: 0,
    headTilt: 4,
    armL: { a: 25, b: 20 },
    armR: { a: 35, b: 40 }, // pointing right at Subscribe button
    legL: { a: 5, b: 0 },
    legR: { a: -5, b: 0 },
    expr: isClicked ? 'happy' : 'smug',
    blink: Math.sin(f * 0.1) > 0.94 ? 1 : 0,
    look: 0.8,
    glasses: isClicked ? 1 : 0, // cool sunglasses on subscribe!
    yaw: 0.15,
    squash: 0,
    handL: 'open',
    handR: 'point',
    sway: 0,
  };

  return (
    <g>
      {/* Background Stage */}
      <image href={staticFile('dont-watch/bg_countdown_stage.jpg')} x={0} y={0} width={1920} height={1080} preserveAspectRatio="xMidYMid slice" />
      <rect x={0} y={0} width={1920} height={1080} fill="#030712" opacity={0.35} />

      {/* Sleek Center Countdown Timer Screen */}
      <g transform="translate(960 210)">
        {/* Glow */}
        <rect x={-260} y={-70} width={520} height={140} rx={24} fill="#0F172A" opacity={0.92} stroke="#38BDF8" strokeWidth={3} />
        {/* Digits */}
        <text x={0} y={18} textAnchor="middle" fill="#38BDF8" fontSize="72" fontWeight="900" fontFamily="Montserrat, sans-serif" letterSpacing="6px">
          {timeStr}
        </text>
        <text x={0} y={52} textAnchor="middle" fill="#94A3B8" fontSize="16" fontWeight="700" letterSpacing="3px">
          TOTAL NOTHING WATCHED
        </text>
      </g>

      {/* THE FORBIDDEN RED SUBSCRIBE BUTTON & BELL ON PEDESTAL */}
      <g transform="translate(1420 520)">
        {/* Pedestal grounded down to GROUND_Y */}
        <line x1={0} y1={70} x2={0} y2={GROUND_Y - 520} stroke="#334155" strokeWidth={12} />
        <ellipse cx={0} cy={GROUND_Y - 520 + 8} rx={90} ry={18} fill="#000" opacity={0.5} />

        {/* Subscribe Button */}
        <g transform={`scale(${isClicked ? 0.95 + btnClickScale * 0.05 : 1})`}>
          <rect
            x={-170}
            y={-40}
            width={340}
            height={80}
            rx={40}
            fill={isClicked ? '#1E293B' : '#EF4444'}
            stroke={isClicked ? '#38BDF8' : '#FCA5A5'}
            strokeWidth={3}
          />
          <text x={-20} y={12} textAnchor="middle" fill="#FFFFFF" fontSize="26" fontWeight="900" fontFamily="Montserrat, sans-serif">
            {isClicked ? 'SUBSCRIBED!' : 'SUBSCRIBE'}
          </text>
        </g>

        {/* Golden Notification Bell */}
        <g transform={`translate(130 0) rotate(${bellSwing})`}>
          <circle cx={0} cy={0} r={28} fill="#F59E0B" stroke="#FDE68A" strokeWidth={2.5} />
          <path d="M -12 8 Q -16 14 -10 14 L 10 14 Q 16 14 12 8 L 8 -6 Q 6 -14 0 -14 Q -6 -14 -8 -6 Z" fill="#FFFFFF" />
          <circle cx={0} cy={16} r={3} fill="#FFFFFF" />
          {/* Soundwaves if clicked */}
          {isClicked && (
            <g>
              <circle cx={0} cy={0} r={38} fill="none" stroke="#F59E0B" strokeWidth={2} opacity={0.6} />
              <circle cx={0} cy={0} r={48} fill="none" stroke="#F59E0B" strokeWidth={1.5} opacity={0.3} />
            </g>
          )}
        </g>

        {/* Warning Badge above Subscribe Button */}
        <g transform="translate(0 -65)">
          <rect x={-140} y={-16} width={280} height={32} rx={12} fill="#0F172A" stroke="#EF4444" strokeWidth={2} />
          <text x={0} y={5} textAnchor="middle" fill="#EF4444" fontSize="13" fontWeight="900" fontFamily="Montserrat, sans-serif">
            🚫 DO NOT CLICK THIS BUTTON
          </text>
        </g>
      </g>

      {/* Cartoon Mouse Cursor */}
      {f > 530 && f < 720 && (
        <g transform={`translate(${mouseX} ${mouseY})`}>
          <polygon points="0,0 0,32 8,24 16,36 22,32 14,20 26,20" fill="#FFFFFF" stroke="#000000" strokeWidth={2.5} />
        </g>
      )}

      {/* Confetti Explosion on Subscribe Click */}
      {f >= 620 && f <= 800 && (
        <g transform="translate(1420 520)">
          {[-60, -30, 0, 30, 60].map((dx, i) => (
            <rect
              key={i}
              x={dx * (f - 620) * 0.08}
              y={-((f - 620) * 3) + Math.sin(i * 1.5) * 50}
              width={10}
              height={10}
              fill={['#EF4444', '#38BDF8', '#F59E0B', '#10B981', '#EC4899'][i]}
              transform={`rotate(${(f - 620) * 12 + i * 45})`}
            />
          ))}
        </g>
      )}

      {/* Stickman grounded on floor plane */}
      <ellipse cx={820} cy={GROUND_Y} rx={60} ry={14} fill="#000000" opacity={0.4} />
      <Hero pose={pose} look={LOOKS.pipInk} shadow={1.0} />

      {/* Final End Screen Card */}
      {f > 950 && (
        <g transform="translate(960 540)" opacity={interpolate(f, [950, 1000], [0, 1], { extrapolateRight: 'clamp' })}>
          <rect x={-450} y={-120} width={900} height={240} rx={28} fill="#020617" opacity={0.96} stroke="#38BDF8" strokeWidth={3} />
          <text x={0} y={-30} textAnchor="middle" fill="#F8FAFC" fontSize="36" fontWeight="900" fontFamily="Montserrat, sans-serif">
            CONGRATULATIONS.
          </text>
          <text x={0} y={20} textAnchor="middle" fill="#EF4444" fontSize="24" fontWeight="800" fontFamily="Montserrat, sans-serif">
            YOU WATCHED THE VIDEO YOU WERE TOLD NOT TO WATCH.
          </text>
          <text x={0} y={65} textAnchor="middle" fill="#94A3B8" fontSize="18" fontWeight="600" fontFamily="Plus Jakarta Sans, sans-serif">
            SEE YOU IN THE NEXT NOTHING.
          </text>
        </g>
      )}
    </g>
  );
};

// ========================================================
// 5. SHORT FILM VERTICAL / HIGHLIGHT VERSION (1403 frames)
// ========================================================
export const DontWatchShort: React.FC<{ f: number }> = ({ f }) => {
  // Short spans 1403 frames (~46.7s):
  // 0 - 350: Chapter 1 hook & pink elephant
  // 350 - 750: Chapter 2 $300M CGI vs 5 lines
  // 750 - 1100: Chapter 3 The Forbidden Comment Challenge
  // 1100 - 1403: Chapter 4 The Reverse Subscribe CTA
  if (f < 350) {
    return <Chapter1 f={f * 2.5} />;
  } else if (f < 750) {
    return <Chapter2 f={(f - 350) * 2.5} />;
  } else if (f < 1100) {
    return <Chapter3 f={(f - 750) * 3.0} />;
  } else {
    return <Chapter4 f={(f - 1100) * 3.5} />;
  }
};

