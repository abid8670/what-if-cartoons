import React from 'react';
import { interpolate, spring, staticFile } from 'remotion';
import { Hero, LOOKS, Pose } from '../../engine';

const GROUND_Y = 820;
const HIPS_Y = 687; // Grounded feet at y=820

// =========================================================================
// 1. CHAPTER 1: THE BROADCAST AWAKENS (1,128 frames)
// =========================================================================
export const MindReaderCh1: React.FC<{ f?: number; frame?: number }> = ({ f, frame }) => {
  const currentF = f ?? frame ?? 0;

  // Thought wave expansion pulse
  const wavePulse = (currentF % 40) / 40.0;
  const waveRadius = interpolate(wavePulse, [0, 1], [90, 320], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
  const waveOpacity = interpolate(wavePulse, [0, 0.7, 1], [0.85, 0.4, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });

  // Coffee cup fall animation (around frame 520)
  const cupFall = interpolate(currentF, [520, 560], [0, 180], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
  const cupRotate = interpolate(currentF, [520, 560], [0, 95], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });

  return (
    <g>
      {/* Background: Cozy Coffee Shop */}
      <image
        href={staticFile('mind-reader/bg_coffee_shop.jpg')}
        width={1920}
        height={1080}
        preserveAspectRatio="xMidYMid slice"
        opacity={0.88}
      />

      {/* Atmospheric lighting */}
      <rect width={1920} height={1080} fill="#060913" opacity={0.3} />

      {/* Barista Counter & Contact Shadows */}
      <ellipse cx={520} cy={GROUND_Y} rx={75} ry={16} fill="rgba(0,0,0,0.65)" />
      <ellipse cx={960} cy={GROUND_Y} rx={85} ry={18} fill="rgba(0,0,0,0.65)" />

      {/* Barista Stickman (Standing behind counter on left) */}
      <g transform="translate(0, 0)">
        <Hero
          pose={{
            x: 520,
            y: HIPS_Y,
            scale: 1.0,
            facing: 1,
            tilt: currentF > 480 ? -8 : 0,
            headTilt: currentF > 480 ? 12 : 0,
            expr: currentF > 480 ? 'shock' : 'happy',
            look: 0.8,
            armL: { a: currentF > 480 ? 20 : 10, b: 30 },
            armR: { a: currentF > 480 ? -40 : -10, b: 20 },
            legL: { a: 0, b: 0 },
            legR: { a: 0, b: 0 },
          }}
          look={LOOKS.suit}
        />
        {/* Ridiculous Tall Chef/Barista Hat */}
        <g transform="translate(520, 480)">
          <rect x={-22} y={-45} width={44} height={35} rx={6} fill="#F59E0B" stroke="#000" strokeWidth={2.5} />
          <ellipse cx={0} cy={-45} rx={28} ry={14} fill="#FDE047" stroke="#000" strokeWidth={2.5} />
        </g>
      </g>

      {/* Falling Coffee Cup */}
      {currentF > 520 && (
        <g transform={`translate(${580 + cupRotate * 0.4}, ${620 + cupFall}) rotate(${cupRotate})`}>
          <rect x={-14} y={-22} width={28} height={44} rx={6} fill="#FFFFFF" stroke="#000" strokeWidth={2.5} />
          {/* Coffee splash */}
          <path d="M -10 -15 Q 0 -35 15 -25" stroke="#78350F" strokeWidth={4} fill="none" />
        </g>
      )}

      {/* Pip - Main Stickman (Customer standing at counter) */}
      <Hero
        pose={{
          x: 960,
          y: HIPS_Y,
          scale: 1.0,
          facing: -1, // Facing barista on left
          tilt: currentF > 500 ? 6 : -2,
          headTilt: currentF > 500 ? -14 : 4,
          expr: currentF > 500 ? 'shock' : 'neutral',
          look: -0.8,
          armL: { a: currentF > 500 ? -60 : -15, b: currentF > 500 ? 60 : 30 },
          armR: { a: currentF > 500 ? 55 : 15, b: currentF > 500 ? 60 : 30 },
          legL: { a: -5, b: 0 },
          legR: { a: 5, b: 0 },
        }}
        look={LOOKS.pipHood}
      />

      {/* Thought Broadcast Waves emanating from Pip's head */}
      <g transform="translate(960, 520)">
        {/* Pulsing psychic wave rings */}
        <circle cx={0} cy={0} r={waveRadius} fill="none" stroke="#06B6D4" strokeWidth={4} opacity={waveOpacity} />
        <circle cx={0} cy={0} r={waveRadius * 0.65} fill="none" stroke="#A855F7" strokeWidth={3} opacity={waveOpacity * 0.8} />

        {/* Floating Holographic Thought Bubble */}
        {currentF > 180 && currentF < 720 && (
          <g transform="translate(-180, -110)">
            <rect x={-170} y={-45} width={340} height={70} rx={20} fill="rgba(15, 23, 42, 0.94)" stroke="#06B6D4" strokeWidth={3.5} style={{ filter: 'drop-shadow(0 0 25px rgba(6, 182, 212, 0.6))' }} />
            <text x={0} y={6} fill="#38BDF8" fontSize={24} fontWeight="900" fontFamily="system-ui, sans-serif" textAnchor="middle">
              💭 "THAT HAT IS RIDICULOUS"
            </text>
          </g>
        )}

        {/* Panic Alert Bubble */}
        {currentF >= 720 && (
          <g transform="translate(-180, -110)">
            <rect x={-190} y={-45} width={380} height={70} rx={20} fill="rgba(15, 23, 42, 0.94)" stroke="#EF4444" strokeWidth={3.5} style={{ filter: 'drop-shadow(0 0 25px rgba(239, 68, 68, 0.8))' }} />
            <text x={0} y={6} fill="#EF4444" fontSize={24} fontWeight="900" fontFamily="system-ui, sans-serif" textAnchor="middle">
              📢 THEY CAN HEAR EVERYTHING!
            </text>
          </g>
        )}
      </g>
    </g>
  );
};

// =========================================================================
// 2. CHAPTER 2: THE SUBWAY CROWD & BETRAYAL (1,265 frames)
// =========================================================================
export const MindReaderCh2: React.FC<{ f?: number; frame?: number }> = ({ f, frame }) => {
  const currentF = f ?? frame ?? 0;

  // Intense psychic static frequency
  const staticShift = Math.sin(currentF * 0.8) * 4;
  const panicPulse = (currentF % 25) / 25.0;
  const panicRadius = interpolate(panicPulse, [0, 1], [90, 360], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
  const panicOpacity = interpolate(panicPulse, [0, 0.6, 1], [0.9, 0.5, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });

  // Train passengers looking in shock at Pip
  const passengerLook = currentF > 420;

  return (
    <g>
      {/* Background: Subway Train Interior */}
      <image
        href={staticFile('mind-reader/bg_subway_crowd.jpg')}
        width={1920}
        height={1080}
        preserveAspectRatio="xMidYMid slice"
        opacity={0.85}
      />

      <rect width={1920} height={1080} fill="#090B16" opacity={0.35} />

      {/* Ground contact shadows */}
      <ellipse cx={480} cy={GROUND_Y} rx={80} ry={16} fill="rgba(0,0,0,0.7)" />
      <ellipse cx={960} cy={GROUND_Y} rx={90} ry={18} fill="rgba(0,0,0,0.7)" />
      <ellipse cx={1420} cy={GROUND_Y} rx={80} ry={16} fill="rgba(0,0,0,0.7)" />

      {/* Passenger Left (Commuter friend) */}
      <Hero
        pose={{
          x: 480,
          y: HIPS_Y,
          scale: 0.95,
          facing: 1, // Facing Pip
          tilt: passengerLook ? 6 : 0,
          headTilt: passengerLook ? 14 : 0,
          expr: passengerLook ? 'shock' : 'neutral',
          look: 0.7,
          armL: { a: passengerLook ? 40 : 0, b: 20 },
          armR: { a: passengerLook ? -30 : 0, b: 20 },
          legL: { a: 0, b: 0 },
          legR: { a: 0, b: 0 },
        }}
        look={LOOKS.mo}
      />

      {/* Pip in the Center clutching his head in pure panic */}
      <Hero
        pose={{
          x: 960 + staticShift,
          y: HIPS_Y,
          scale: 1.05,
          facing: 1,
          tilt: -4,
          headTilt: -16,
          expr: 'worried',
          armL: { a: -65, b: 70 }, // Hands on ears/head
          armR: { a: 65, b: 70 },
          legL: { a: -8, b: 0 },
          legR: { a: 8, b: 0 },
        }}
        look={LOOKS.pipHood}
      />

      {/* Passenger Right (Stranger in suit) */}
      <Hero
        pose={{
          x: 1420,
          y: HIPS_Y,
          scale: 0.95,
          facing: -1, // Facing Pip in disgust
          tilt: passengerLook ? -8 : 0,
          headTilt: passengerLook ? -12 : 0,
          expr: passengerLook ? 'shock' : 'neutral',
          look: -0.7,
          armL: { a: 0, b: 0 },
          armR: { a: 0, b: 0 },
          legL: { a: 0, b: 0 },
          legR: { a: 0, b: 0 },
        }}
        look={LOOKS.suit}
      />

      {/* Expanding crimson thought waves */}
      <g transform="translate(960, 520)">
        <circle cx={0} cy={0} r={panicRadius} fill="none" stroke="#EF4444" strokeWidth={4} opacity={panicOpacity} />
        <circle cx={0} cy={0} r={panicRadius * 0.7} fill="none" stroke="#F59E0B" strokeWidth={3} opacity={panicOpacity * 0.75} />

        {/* Thought Leak Bubble */}
        {currentF > 400 && (
          <g transform="translate(0, -130)">
            <rect x={-230} y={-45} width={460} height={80} rx={24} fill="rgba(15, 23, 42, 0.96)" stroke="#EF4444" strokeWidth={4} style={{ filter: 'drop-shadow(0 0 35px rgba(239, 68, 68, 0.8))' }} />
            <text x={0} y={8} fill="#FCA5A5" fontSize={26} fontWeight="900" fontFamily="system-ui, sans-serif" textAnchor="middle">
              📢 "I WISH YOU WEREN'T HERE"
            </text>
          </g>
        )}
      </g>
    </g>
  );
};

// =========================================================================
// 3. CHAPTER 3: THE ROOFTOP SANCTUARY & LONELINESS (1,047 frames)
// =========================================================================
export const MindReaderCh3: React.FC<{ f?: number; frame?: number }> = ({ f, frame }) => {
  const currentF = f ?? frame ?? 0;

  // Gentle wind particles
  const windOffset = (currentF * 6) % 1920;

  return (
    <g>
      {/* Background: Cyberpunk Rooftop Night */}
      <image
        href={staticFile('mind-reader/bg_rooftop_night.jpg')}
        width={1920}
        height={1080}
        preserveAspectRatio="xMidYMid slice"
        opacity={0.88}
      />

      <rect width={1920} height={1080} fill="#050713" opacity={0.3} />

      {/* Pip sitting alone on the rooftop ledge */}
      <ellipse cx={960} cy={GROUND_Y} rx={110} ry={22} fill="rgba(0,0,0,0.85)" />

      <Hero
        pose={{
          x: 960,
          y: HIPS_Y + 15,
          scale: 1.0,
          facing: 1,
          tilt: -8,
          headTilt: -20, // Head down in deep reflection
          expr: 'tired',
          armL: { a: 25, b: 40 },
          armR: { a: 30, b: 45 },
          legL: { a: 45, b: 85 }, // Sitting pose
          legR: { a: 40, b: 80 },
        }}
        look={LOOKS.pipHood}
      />

      {/* Faint dissolving thought whispers into the night sky */}
      <g transform="translate(960, 480)">
        {[-80, 0, 80].map((dx, i) => {
          const dy = -((currentF * 2 + i * 40) % 180);
          const op = interpolate(dy, [-180, 0], [0, 0.7], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
          return (
            <text key={i} x={dx} y={dy} fill="#A855F7" fontSize={22} fontWeight="bold" opacity={op} textAnchor="middle">
              {i === 0 ? 'silence' : i === 1 ? 'peace' : 'alone'}
            </text>
          );
        })}
      </g>
    </g>
  );
};

// =========================================================================
// 4. CHAPTER 4: THE HONEST CONNECTION (1,277 frames)
// =========================================================================
export const MindReaderCh4: React.FC<{ f?: number; frame?: number }> = ({ f, frame }) => {
  const currentF = f ?? frame ?? 0;

  // Gentle harmonic aura between Pip and Girl
  const auraPulse = Math.sin(currentF * 0.1) * 15 + 180;

  return (
    <g>
      {/* Background: Rooftop Golden Sunset / Twilight */}
      <image
        href={staticFile('mind-reader/bg_rooftop_sunset.jpg')}
        width={1920}
        height={1080}
        preserveAspectRatio="xMidYMid slice"
        opacity={0.92}
      />

      {/* Contact Shadows */}
      <ellipse cx={820} cy={GROUND_Y} rx={85} ry={18} fill="rgba(0,0,0,0.75)" />
      <ellipse cx={1100} cy={GROUND_Y} rx={85} ry={18} fill="rgba(0,0,0,0.75)" />

      {/* Harmonic Resonance Beam between them */}
      {currentF > 400 && (
        <path
          d="M 820 540 Q 960 480 1100 540"
          stroke="#F59E0B"
          strokeWidth={4}
          fill="none"
          strokeDasharray="8 8"
          style={{ filter: 'drop-shadow(0 0 15px rgba(245, 158, 11, 0.8))' }}
        />
      )}

      {/* Pip on the left looking at her */}
      <Hero
        pose={{
          x: 820,
          y: HIPS_Y,
          scale: 0.98,
          facing: 1, // Facing girl
          tilt: 4,
          headTilt: 8,
          expr: 'happy',
          look: 0.8,
          armL: { a: 15, b: 30 },
          armR: { a: 20, b: 30 },
          legL: { a: 0, b: 0 },
          legR: { a: 0, b: 0 },
        }}
        look={LOOKS.pipHood}
      />

      {/* The Girl on the right (Smiling, unconditionally accepting) */}
      <Hero
        pose={{
          x: 1100,
          y: HIPS_Y,
          scale: 0.98,
          facing: -1, // Facing Pip
          tilt: -4,
          headTilt: -8,
          expr: 'happy',
          look: -0.8,
          armL: { a: -20, b: 30 },
          armR: { a: -15, b: 30 },
          legL: { a: 0, b: 0 },
          legR: { a: 0, b: 0 },
        }}
        look={LOOKS.sis}
      />

      {/* Her Speech Dialogue Bubble */}
      {currentF > 350 && (
        <g transform="translate(1100, 420)">
          <rect x={-180} y={-45} width={360} height={70} rx={20} fill="rgba(15, 23, 42, 0.94)" stroke="#F59E0B" strokeWidth={3.5} style={{ filter: 'drop-shadow(0 0 25px rgba(245, 158, 11, 0.6))' }} />
          <text x={0} y={6} fill="#FDE047" fontSize={22} fontWeight="900" fontFamily="system-ui, sans-serif" textAnchor="middle">
            💛 "MY MIND IS JUST AS TERRIFYING"
          </text>
        </g>
      )}
    </g>
  );
};

// =========================================================================
// 5. CHAPTER 5: THE GLASS MIND & ULTIMATE QUESTION (1,187 frames)
// =========================================================================
export const MindReaderCh5: React.FC<{ f?: number; frame?: number }> = ({ f, frame }) => {
  const currentF = f ?? frame ?? 0;

  const cardScale = spring({
    frame: Math.max(0, currentF - 500),
    fps: 30,
    config: { damping: 14, stiffness: 180 },
  });

  const bellBounce = Math.sin(currentF * 0.4) * 8;

  // Staging: Pip shifts gracefully to left at frame 480 so the card and Pip are both fully visible
  const pipX = interpolate(currentF, [480, 520], [960, 360], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });

  return (
    <g>
      {/* Background: Night Rooftop Skyline */}
      <image
        href={staticFile('mind-reader/bg_rooftop_night.jpg')}
        width={1920}
        height={1080}
        preserveAspectRatio="xMidYMid slice"
        opacity={0.85}
      />

      <rect width={1920} height={1080} fill="#050713" opacity={0.45} />

      {/* Pip standing proudly presenting the question */}
      <g transform="translate(0, 0)">
        <ellipse cx={pipX} cy={GROUND_Y} rx={100} ry={20} fill="rgba(0,0,0,0.85)" />
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
            armR: currentF > 480 ? { a: -55, b: -15 } : { a: 20, b: 30 },
            legL: { a: 0, b: 0 },
            legR: { a: 0, b: 0 },
          }}
          look={LOOKS.pipHood}
        />
      </g>

      {/* Interactive Comment Challenge Card */}
      {currentF > 480 && (
        <g
          transform={`translate(1140, 500) scale(${cardScale * 0.92})`}
          style={{ filter: 'drop-shadow(0 20px 50px rgba(0,0,0,0.95))' }}
        >
          <rect x={-520} y={-250} width={1040} height={500} rx={28} fill="#0F172A" stroke="#06B6D4" strokeWidth={4} />

          <text x={0} y={-180} fill="#FDE047" fontSize={34} fontWeight="900" fontFamily="system-ui" textAnchor="middle">
            💬 ULTIMATE QUESTION:
          </text>
          <text x={0} y={-120} fill="#FFFFFF" fontSize={28} fontWeight="bold" fontFamily="system-ui" textAnchor="middle">
            If everyone could read your mind for 24 hours... what would happen?
          </text>

          {/* Option A */}
          <rect x={-460} y={-70} width={920} height={80} rx={16} fill="#1E293B" stroke="#EF4444" strokeWidth={2.5} />
          <text x={-420} y={-20} fill="#EF4444" fontSize={32} fontWeight="bold" fontFamily="system-ui">
            👉 OPTION A:
          </text>
          <text x={-180} y={-20} fill="#FFFFFF" fontSize={28} fontWeight="bold" fontFamily="system-ui">
            "DESTROYED — Society needs polite filters."
          </text>

          {/* Option B */}
          <rect x={-460} y={30} width={920} height={80} rx={16} fill="#1E293B" stroke="#10B981" strokeWidth={2.5} />
          <text x={-420} y={80} fill="#10B981" fontSize={32} fontWeight="bold" fontFamily="system-ui">
            👉 OPTION B:
          </text>
          <text x={-180} y={80} fill="#FFFFFF" fontSize={28} fontWeight="bold" fontFamily="system-ui">
            "TRULY FREE — Truth is the only real freedom."
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
// 6. SHORT VERSION (1,016 frames @ 30 FPS)
// =========================================================================
export const MindReaderShort: React.FC<{ f?: number; frame?: number }> = ({ f, frame }) => {
  const currentF = f ?? frame ?? 0;
  return (
    <g>
      {currentF < 400 ? (
        <MindReaderCh1 f={interpolate(currentF, [0, 400], [200, 750])} />
      ) : currentF < 720 ? (
        <MindReaderCh2 f={interpolate(currentF, [400, 720], [300, 800])} />
      ) : (
        <MindReaderCh5 f={interpolate(currentF, [720, 1016], [400, 800])} />
      )}
    </g>
  );
};

