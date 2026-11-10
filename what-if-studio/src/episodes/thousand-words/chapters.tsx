import React from 'react';
import { interpolate, spring, staticFile } from 'remotion';
import { Hero, LOOKS, Pose, Look, C } from '../../engine';

const GROUND_Y = 820;

// Custom Look for the Loyal Companion (Girl in green jacket & yellow scarf)
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

// Holographic Digital Word Counter
export const WordCounter: React.FC<{
  x: number;
  y: number;
  count: number;
  isRed?: boolean;
  pulse?: boolean;
  scale?: number;
}> = ({ x, y, count, isRed = false, pulse = false, scale = 1.0 }) => {
  const primaryColor = isRed ? '#EF4444' : '#06B6D4';
  const bgColor = isRed ? '#450A0A' : '#083344';
  const glow = pulse ? 'drop-shadow(0 0 16px rgba(239,68,68,0.8))' : 'drop-shadow(0 0 10px rgba(6,182,212,0.6))';

  // Format count to 4 digits or 3
  const strCount = count.toString().padStart(count > 999 ? 4 : 3, '0');

  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`} style={{ filter: glow }}>
      {/* Outer Glow Plate */}
      <rect x={-90} y={-38} width={180} height={56} rx={14} fill={bgColor} stroke={primaryColor} strokeWidth={3} opacity={0.92} />
      {/* Tech corner brackets */}
      <path d="M -85 -24 L -85 -33 L -74 -33" fill="none" stroke={primaryColor} strokeWidth={2.5} />
      <path d="M 85 -24 L 85 -33 L 74 -33" fill="none" stroke={primaryColor} strokeWidth={2.5} />
      <path d="M -85 4 L -85 13 L -74 13" fill="none" stroke={primaryColor} strokeWidth={2.5} />
      <path d="M 85 4 L 85 13 L 74 13" fill="none" stroke={primaryColor} strokeWidth={2.5} />

      {/* Digits Display */}
      <text
        x={0}
        y={-2}
        textAnchor="middle"
        fill="#FFFFFF"
        fontSize={28}
        fontWeight="900"
        fontFamily="Courier New, monospace"
        letterSpacing={3}
      >
        {strCount}
      </text>

      {/* Sublabel */}
      <text
        x={0}
        y={14}
        textAnchor="middle"
        fill={primaryColor}
        fontSize={10}
        fontWeight="bold"
        fontFamily="Arial"
        letterSpacing={1.5}
      >
        WORDS LEFT
      </text>
    </g>
  );
};

// Reusable Falling Rain
const RainOverlay: React.FC<{ f: number; intensity?: number }> = ({ f, intensity = 50 }) => {
  return (
    <g opacity={0.55}>
      {Array.from({ length: intensity }).map((_, i) => {
        const x = (i * 41 + (f * 16)) % 1920;
        const y = ((i * 59 + (f * 30)) % 1080) - 60;
        return (
          <line
            key={i}
            x1={x}
            y1={y}
            x2={x - 10}
            y2={y + 35}
            stroke="#93C5FD"
            strokeWidth={1.5}
            strokeOpacity={0.6}
            strokeLinecap="round"
          />
        );
      })}
    </g>
  );
};

// ----------------------------------------------------
// CHAPTER 1: THE 1,000 WORD CURSE (825 frames / 27.5s)
// ----------------------------------------------------
export const Chapter1: React.FC<{ f: number }> = ({ f }) => {
  // Counter appears at frame 540
  const counterActive = f >= 540;
  const counterScale = counterActive ? spring({ frame: f - 540, fps: 30, config: { damping: 12 } }) : 0;
  const pipBob = Math.sin(f * 0.12) * 3;

  return (
    <g>
      {/* Background Street */}
      <image href={staticFile('thousand-words/bg_city_street_morning.jpg')} width={1920} height={1080} />

      {/* Street Ground Plane Line */}
      <line x1={0} y1={GROUND_Y} x2={1920} y2={GROUND_Y} stroke="#334155" strokeWidth={2} opacity={0.4} />

      {/* Chatty Passerby 1 on the left */}
      <g transform="translate(420, 0)">
        <ellipse cx={0} cy={GROUND_Y + 10} rx={50} ry={12} fill="rgba(0,0,0,0.4)" />
        <Hero
          pose={{
            x: 0,
            y: GROUND_Y - 130,
            scale: 0.9,
            facing: 1,
            tilt: 4,
            head: { expr: 'happy', look: { x: 1, y: 0 }, tilt: 0 },
            armL: { a: -40, b: 60 },
            armR: { a: 20, b: 40 },
            legL: { a: 0, b: 0 },
            legR: { a: 0, b: 0 },
          }}
          look={LOOKS.suit}
        />
        {/* Busy chatter bubble */}
        <g transform="translate(60, -220)">
          <rect x={-80} y={-24} width={160} height={42} rx={12} fill="#FFFFFF" stroke="#0F172A" strokeWidth={2.5} />
          <text x={0} y={4} textAnchor="middle" fill="#0F172A" fontSize={14} fontWeight="bold" fontFamily="Arial">
            "Blah blah blah!" 🗣️
          </text>
        </g>
      </g>

      {/* Pip Centered in Scene */}
      <g transform="translate(960, 0)">
        {/* Contact Shadow strictly on ground plane */}
        <ellipse cx={0} cy={GROUND_Y + 10} rx={60} ry={14} fill="rgba(0,0,0,0.5)" />

        <Hero
          pose={{
            x: 0,
            y: GROUND_Y - 130 + pipBob,
            scale: 0.95,
            facing: 1,
            tilt: counterActive ? -6 : 0,
            head: {
              expr: counterActive ? 'shock' : 'neutral',
              look: { x: counterActive ? 0 : 1, y: counterActive ? -1 : 0 },
              tilt: counterActive ? -8 : 0,
            },
            armL: { a: counterActive ? -50 : -20, b: counterActive ? 80 : 30 },
            armR: { a: counterActive ? 50 : 20, b: counterActive ? 80 : 20 },
            legL: { a: 0, b: 0 },
            legR: { a: 0, b: 0 },
          }}
          look={LOOKS.pipHood}
        />

        {/* Digital Counter Floating Above Head */}
        {counterActive && (
          <WordCounter x={0} y={GROUND_Y - 320} count={1000} scale={counterScale} />
        )}
      </g>

      {/* Cinematic Glitch Beam Descending at frame 540 */}
      {f >= 520 && f <= 560 && (
        <line
          x1={960}
          y1={0}
          x2={960}
          y2={GROUND_Y - 140}
          stroke="#06B6D4"
          strokeWidth={f % 4 === 0 ? 12 : 4}
          strokeOpacity={0.8}
        />
      )}

      {/* Subtitle Banner */}
      <g transform="translate(960, 970)">
        <rect x={-520} y={-42} width={1040} height={76} rx={16} fill="#0B0818" stroke="#06B6D4" strokeWidth={3} opacity={0.92} />
        <text x={0} y={7} textAnchor="middle" fill="#FFFFFF" fontSize={26} fontWeight="bold" fontFamily="Arial">
          {counterActive
            ? 'EXACTLY 1,000 WORDS... FOR THE REST OF YOUR LIFE.'
            : 'Humans speak 16,000 words a day. Most are wasted noise.'}
        </text>
      </g>
    </g>
  );
};

// ----------------------------------------------------
// CHAPTER 2: THE CARELESS DRAIN (1026 frames / 34.2s)
// ----------------------------------------------------
export const Chapter2: React.FC<{ f: number }> = ({ f }) => {
  // Word count burns down as events happen:
  // 0 - 300: 1000 -> 995 (espresso)
  // 300 - 600: 995 -> 983 (weather)
  // 600 - 1026: 983 -> 412 (road rage traffic argument)
  let currentCount = 1000;
  let isRed = false;
  if (f < 300) {
    currentCount = Math.round(interpolate(f, [0, 180], [1000, 995], { extrapolateRight: 'clamp' }));
  } else if (f < 600) {
    currentCount = Math.round(interpolate(f, [300, 480], [995, 983], { extrapolateRight: 'clamp' }));
  } else {
    currentCount = Math.round(interpolate(f, [600, 850], [983, 412], { extrapolateRight: 'clamp' }));
    isRed = f >= 750;
  }

  const shake = isRed ? Math.sin(f * 0.8) * 4 : 0;

  return (
    <g transform={`translate(${shake}, 0)`}>
      {/* Background Street */}
      <image href={staticFile('thousand-words/bg_city_street_morning.jpg')} width={1920} height={1080} />

      {/* Red Alert Screen Tint when counter hits 412 */}
      {isRed && (
        <rect width={1920} height={1080} fill="#EF4444" opacity={0.2} style={{ mixBlendMode: 'color-burn' }} />
      )}

      {/* Pip in center */}
      <g transform="translate(960, 0)">
        <ellipse cx={0} cy={GROUND_Y + 10} rx={60} ry={14} fill="rgba(0,0,0,0.5)" />

        <Hero
          pose={{
            x: 0,
            y: GROUND_Y - 130,
            scale: 0.95,
            facing: 1,
            tilt: isRed ? 8 : 0,
            head: {
              expr: isRed ? 'shock' : 'worried',
              look: { x: isRed ? 0 : 1, y: isRed ? -1 : 0 },
              tilt: isRed ? 10 : 0,
            },
            // Clamping hands over mouth when red
            armL: { a: isRed ? -75 : -30, b: isRed ? 120 : 40 },
            armR: { a: isRed ? 75 : 30, b: isRed ? 120 : 40 },
            legL: { a: 0, b: 0 },
            legR: { a: 0, b: 0 },
          }}
          look={LOOKS.pipHood}
        />

        {/* Dynamic Word Counter */}
        <WordCounter x={0} y={GROUND_Y - 320} count={currentCount} isRed={isRed} pulse={isRed} />
      </g>

      {/* Comic Speech Burn Indicators */}
      {f >= 100 && f < 280 && (
        <g transform="translate(1080, 520)">
          <rect x={0} y={0} width={240} height={50} rx={12} fill="#0F172A" stroke="#EF4444" strokeWidth={2.5} />
          <text x={120} y={32} textAnchor="middle" fill="#F87171" fontSize={20} fontWeight="bold" fontFamily="Arial">
            -5 WORDS (Coffee) ☕
          </text>
        </g>
      )}

      {f >= 620 && f < 800 && (
        <g transform="translate(1080, 520)">
          <rect x={0} y={0} width={280} height={50} rx={12} fill="#0F172A" stroke="#EF4444" strokeWidth={2.5} />
          <text x={140} y={32} textAnchor="middle" fill="#EF4444" fontSize={20} fontWeight="900" fontFamily="Arial">
            -87 WORDS (Traffic Rage) 💥
          </text>
        </g>
      )}

      {/* Subtitle Banner */}
      <g transform="translate(960, 970)">
        <rect x={-520} y={-42} width={1040} height={76} rx={16} fill="#0B0818" stroke={isRed ? '#EF4444' : '#06B6D4'} strokeWidth={3} opacity={0.92} />
        <text x={0} y={7} textAnchor="middle" fill="#FFFFFF" fontSize={26} fontWeight="bold" fontFamily="Arial">
          {isRed
            ? 'FLASHING RED: 412 WORDS REMAINING! SILENCE IS SURVIVAL.'
            : 'Every petty argument was burning away his future.'}
        </text>
      </g>
    </g>
  );
};

// ----------------------------------------------------
// CHAPTER 3: THE POWER OF SILENCE (960 frames / 32.0s)
// ----------------------------------------------------
export const Chapter3: React.FC<{ f: number }> = ({ f }) => {
  return (
    <g>
      {/* Melancholic Rainy Park Bench Background */}
      <image href={staticFile('thousand-words/bg_rainy_park_bench.jpg')} width={1920} height={1080} />

      {/* Gentle Rain overlay */}
      <RainOverlay f={f} intensity={40} />

      {/* Wooden Park Bench & Sitting Pip */}
      <g transform="translate(860, 0)">
        {/* Contact Shadow under bench */}
        <ellipse cx={80} cy={GROUND_Y + 12} rx={180} ry={16} fill="rgba(0,0,0,0.5)" />

        {/* Pip Sitting in Quiet Contemplation */}
        <Hero
          pose={{
            x: 80,
            y: GROUND_Y - 140,
            scale: 0.95,
            facing: 1,
            tilt: -4,
            head: { expr: 'tired', look: { x: 1, y: 0 }, tilt: 0 },
            armL: { a: -30, b: 60 },
            armR: { a: 40, b: 70 },
            legL: { a: 70, b: 90 },
            legR: { a: 70, b: 90 },
          }}
          look={LOOKS.pipHood}
        />

        {/* Floating Counter: Guarded at 240 */}
        <WordCounter x={80} y={GROUND_Y - 330} count={240} isRed={false} />
      </g>

      {/* Philosophical Wisdom Card */}
      <g transform="translate(960, 320)">
        <rect x={-360} y={-45} width={720} height={90} rx={18} fill="#020617" stroke="#38BDF8" strokeWidth={3} opacity={0.92} />
        <text x={0} y={-8} textAnchor="middle" fill="#38BDF8" fontSize={22} fontWeight="bold" fontFamily="Georgia, serif" fontStyle="italic">
          "Silence wasn't a prison."
        </text>
        <text x={0} y={24} textAnchor="middle" fill="#FDE047" fontSize={26} fontWeight="900" fontFamily="Georgia, serif">
          "IT WAS A MIRROR."
        </text>
      </g>

      {/* Subtitle Banner */}
      <g transform="translate(960, 970)">
        <rect x={-520} y={-42} width={1040} height={76} rx={16} fill="#0B0818" stroke="#38BDF8" strokeWidth={3} opacity={0.92} />
        <text x={0} y={7} textAnchor="middle" fill="#FFFFFF" fontSize={26} fontWeight="bold" fontFamily="Arial">
          In silence, he realized 90% of speech is just people avoiding the quiet.
        </text>
      </g>
    </g>
  );
};

// ----------------------------------------------------
// CHAPTER 4: THE FINAL THREE WORDS (1104 frames / 36.8s)
// ----------------------------------------------------
export const Chapter4: React.FC<{ f: number }> = ({ f }) => {
  // Counter drops to 003 around frame 400, then hits 000 at frame 850
  let wordCount = 3;
  if (f >= 850) {
    wordCount = 0;
  }

  const isWhisper = f >= 750 && f < 950;
  const glowBurst = f >= 850 ? Math.min(0.4, (f - 850) * 0.005) : 0;

  return (
    <g>
      {/* Warm Room with Rain Outside Background */}
      <image href={staticFile('thousand-words/bg_warm_room_rain.jpg')} width={1920} height={1080} />

      {/* Golden Warmth Halo Burst when count hits 0 */}
      {glowBurst > 0 && (
        <rect width={1920} height={1080} fill="#F59E0B" opacity={glowBurst} style={{ mixBlendMode: 'screen' }} />
      )}

      {/* Pip on the Left */}
      <g transform="translate(760, 0)">
        <ellipse cx={0} cy={GROUND_Y + 10} rx={55} ry={14} fill="rgba(0,0,0,0.5)" />
        <Hero
          pose={{
            x: 0,
            y: GROUND_Y - 130,
            scale: 0.95,
            facing: 1,
            tilt: 8,
            head: { expr: wordCount === 0 ? 'happy' : 'worried', look: { x: 1, y: 0 }, tilt: 6 },
            armL: { a: -30, b: 40 },
            armR: { a: 45, b: 30 }, // Reaching hand out
            legL: { a: 0, b: 0 },
            legR: { a: 0, b: 0 },
          }}
          look={LOOKS.pipHood}
        />

        {/* Word Counter: [ 003 ] -> [ 000 ] */}
        <WordCounter x={0} y={GROUND_Y - 320} count={wordCount} isRed={wordCount === 3} />
      </g>

      {/* Loyal Girl on the Right Holding His Hand */}
      <g transform="translate(1080, 0)">
        <ellipse cx={0} cy={GROUND_Y + 10} rx={55} ry={14} fill="rgba(0,0,0,0.5)" />
        <Hero
          pose={{
            x: 0,
            y: GROUND_Y - 130,
            scale: 0.95,
            facing: -1,
            tilt: -6,
            head: { expr: 'happy', look: { x: -1, y: 0 }, tilt: -4 },
            armL: { a: -45, b: 30 }, // Holding hand
            armR: { a: 30, b: 40 },
            legL: { a: 0, b: 0 },
            legR: { a: 0, b: 0 },
          }}
          look={GIRL_LOOK}
        />
      </g>

      {/* The Final 3 Words Speech Bubble */}
      {isWhisper && (
        <g transform="translate(920, 480)">
          <rect x={-140} y={-45} width={280} height={75} rx={20} fill="#FDE047" stroke="#0F172A" strokeWidth={3.5} />
          <polygon points="-15,30 0,55 15,30" fill="#FDE047" stroke="#0F172A" strokeWidth={3.5} />
          <rect x={-12} y={26} width={24} height={10} fill="#FDE047" />
          <text x={0} y={5} textAnchor="middle" fill="#0F172A" fontSize={26} fontWeight="900" fontFamily="Arial">
            "I LOVE YOU." ❤️
          </text>
        </g>
      )}

      {/* Subtitle Banner */}
      <g transform="translate(960, 970)">
        <rect x={-520} y={-42} width={1040} height={76} rx={16} fill="#0B0818" stroke="#F59E0B" strokeWidth={3} opacity={0.92} />
        <text x={0} y={7} textAnchor="middle" fill="#FFFFFF" fontSize={26} fontWeight="bold" fontFamily="Arial">
          {wordCount === 0
            ? 'The counter hit zero. He was finally completely peaceful.'
            : 'He spent his final three words on what truly mattered: I love you.'}
        </text>
      </g>
    </g>
  );
};

// ----------------------------------------------------
// CHAPTER 5: THE PHILOSOPHY & COMMENT CHALLENGE (1035 frames / 34.5s)
// ----------------------------------------------------
export const Chapter5: React.FC<{ f: number }> = ({ f }) => {
  return (
    <g>
      {/* Background Starry Street */}
      <image href={staticFile('thousand-words/bg_rainy_park_bench.jpg')} width={1920} height={1080} />

      {/* Pip Grounded Peacefully in Center */}
      <g transform="translate(960, 0)">
        <ellipse cx={0} cy={GROUND_Y + 10} rx={60} ry={14} fill="rgba(0,0,0,0.5)" />
        <Hero
          pose={{
            x: 0,
            y: GROUND_Y - 130,
            scale: 0.95,
            facing: 1,
            tilt: 0,
            head: { expr: 'happy', look: { x: 0, y: -1 }, tilt: 0 },
            armL: { a: -30, b: 40 },
            armR: { a: 30, b: 40 },
            legL: { a: 0, b: 0 },
            legR: { a: 0, b: 0 },
          }}
          look={LOOKS.pipHood}
        />
        {/* Zero Counter Badge with Golden Infinity */}
        <WordCounter x={0} y={GROUND_Y - 320} count={0} isRed={false} />
      </g>

      {/* The Big Dilemma & Interactive Comment Card (Appears at frame 150) */}
      {f >= 120 && (
        <g transform="translate(960, 360)">
          <rect x={-460} y={-110} width={920} height={220} rx={24} fill="#020617" stroke="#FACC15" strokeWidth={4} />
          
          <text x={0} y={-60} textAnchor="middle" fill="#FDE047" fontSize={26} fontWeight="900" fontFamily="Arial">
            💬 IF YOU ONLY HAD 3 WORDS LEFT... WHAT WOULD YOU SAY?
          </text>

          {/* Option A */}
          <g transform="translate(-210, 5)">
            <rect x={-180} y={-28} width={360} height={56} rx={14} fill="#1E293B" stroke="#EC4899" strokeWidth={3} />
            <text x={0} y={8} textAnchor="middle" fill="#F472B6" fontSize={22} fontWeight="bold" fontFamily="Arial">
              👉 "I LOVE YOU" ❤️
            </text>
          </g>

          {/* Option B */}
          <g transform="translate(210, 5)">
            <rect x={-180} y={-28} width={360} height={56} rx={14} fill="#1E293B" stroke="#38BDF8" strokeWidth={3} />
            <text x={0} y={8} textAnchor="middle" fill="#38BDF8" fontSize={22} fontWeight="bold" fontFamily="Arial">
              👉 "I FORGIVE YOU" 🕊️
            </text>
          </g>

          {/* Subscribe Callout */}
          <g transform="translate(0, 78)">
            <rect x={-190} y={-22} width={380} height={44} rx={22} fill="#EF4444" stroke="#FFFFFF" strokeWidth={2} />
            <text x={0} y={7} textAnchor="middle" fill="#FFFFFF" fontSize={18} fontWeight="bold" fontFamily="Arial">
              🔔 SUBSCRIBE BEFORE YOUR WORDS RUN OUT!
            </text>
          </g>
        </g>
      )}

      {/* Subtitle Banner */}
      <g transform="translate(960, 970)">
        <rect x={-520} y={-42} width={1040} height={76} rx={16} fill="#0B0818" stroke="#FACC15" strokeWidth={3} opacity={0.92} />
        <text x={0} y={7} textAnchor="middle" fill="#FFFFFF" fontSize={26} fontWeight="bold" fontFamily="Arial">
          Tell me your final 3 words in the comments below. And Subscribe to WHAT IF STUDIO!
        </text>
      </g>
    </g>
  );
};

// ----------------------------------------------------
// VERTICAL SHORT COMPILATION (795 frames / 26.5s)
// ----------------------------------------------------
export const WordsShort: React.FC<{ f: number }> = ({ f }) => {
  // Fast 3-part compilation:
  // 0 - 260: The 1,000 word counter appears
  // 260 - 520: The sudden drain to red 003
  // 520 - 795: Final 3 words & Comment Challenge
  if (f < 260) {
    return <Chapter1 f={f * 2.2 + 250} />;
  } else if (f < 520) {
    return <Chapter2 f={(f - 260) * 2.0 + 500} />;
  } else {
    return <Chapter5 f={(f - 520) * 1.8 + 100} />;
  }
};

