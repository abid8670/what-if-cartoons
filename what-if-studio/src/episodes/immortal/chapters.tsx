import React from 'react';
import { interpolate, spring, staticFile } from 'remotion';
import { Hero, LOOKS } from '../../engine';

const HIPS_Y = 687;

// =========================================================================
// 1. CHAPTER 1: THE CURSE OF FOREVER (776 frames)
// =========================================================================
export const ImmortalCh1: React.FC<{ f?: number; frame?: number }> = ({ f, frame }) => {
  const currentF = f ?? frame ?? 0;
  const zoom = interpolate(currentF, [0, 776], [1.0, 1.05], { extrapolateRight: 'clamp' });

  // Bullet animation (frames 270 to 330)
  const isBulletFired = currentF >= 270 && currentF <= 340;
  const bulletX = interpolate(currentF, [270, 320], [1700, 1000], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const isHit = currentF >= 320;
  const sparkIntensity = isHit && currentF < 370 ? Math.max(0, 1 - (currentF - 320) / 50) : 0;
  const bulletDropY = isHit ? interpolate(currentF, [320, 360], [420, 850], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : 420;

  return (
    <g transform={`scale(${zoom}) translate(${-(zoom - 1) * 960} ${-(zoom - 1) * 540})`}>
      {/* Background: Moody City Street at night */}
      <image
        href={staticFile('immortal/bg_city_street.jpg')}
        width={1920}
        height={1080}
        preserveAspectRatio="xMidYMid slice"
        opacity={0.92}
      />
      <rect width={1920} height={1080} fill="#050814" opacity={0.3} />

      {/* Floating HUD Badges */}
      <g transform="translate(960, 130)">
        <rect x={-320} y={-45} width={640} height={90} rx={18} fill="rgba(15, 23, 42, 0.94)" stroke="#06B6D4" strokeWidth={3} />
        <text x={0} y={-5} fill="#06B6D4" fontSize={26} fontWeight="900" fontFamily="system-ui, sans-serif" textAnchor="middle" letterSpacing="2px">
          CELLULAR MUTATION DETECTED
        </text>
        <text x={0} y={30} fill="#FDE047" fontSize={20} fontWeight="bold" fontFamily="system-ui, sans-serif" textAnchor="middle">
          BIOLOGICAL CLOCK FROZEN AT AGE 25
        </text>
      </g>

      {/* Gunshot smoke & muzzle flash from alley right */}
      {currentF >= 265 && currentF <= 285 && (
        <g transform="translate(1720, 420)">
          <circle cx={0} cy={0} r={50} fill="#F59E0B" opacity={0.8} />
          <circle cx={-15} cy={-5} r={30} fill="#FFFFFF" opacity={0.9} />
        </g>
      )}

      {/* Flying bullet with tracer trail */}
      {isBulletFired && !isHit && (
        <g transform={`translate(${bulletX}, 420)`}>
          <line x1={80} y1={0} x2={0} y2={0} stroke="#FDE047" strokeWidth={5} opacity={0.8} />
          <ellipse cx={0} cy={0} rx={12} ry={6} fill="#F59E0B" stroke="#FFFFFF" strokeWidth={2} />
        </g>
      )}

      {/* Dropping flattened bullet after impact */}
      {isHit && (
        <g transform={`translate(1000, ${bulletDropY})`}>
          <ellipse cx={0} cy={0} rx={14} ry={8} fill="#94A3B8" stroke="#FDE047" strokeWidth={2} />
        </g>
      )}

      {/* Spark explosion on forehead impact */}
      {sparkIntensity > 0 && (
        <g transform="translate(1000, 420)" opacity={sparkIntensity}>
          <circle cx={0} cy={0} r={45 * sparkIntensity} fill="#FFFFFF" />
          <circle cx={0} cy={0} r={80 * sparkIntensity} fill="#F59E0B" opacity={0.5} />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
            <line
              key={i}
              x1={0}
              y1={0}
              x2={Math.cos((angle * Math.PI) / 180) * 110 * sparkIntensity}
              y2={Math.sin((angle * Math.PI) / 180) * 110 * sparkIntensity}
              stroke="#FDE047"
              strokeWidth={4}
            />
          ))}
        </g>
      )}

      {/* Pip Stickman in Mustard Hoodie */}
      <Hero
        pose={{
          x: 960,
          y: HIPS_Y,
          scale: 1.2,
          facing: 1,
          expr: isHit ? (currentF > 420 ? 'smug' : 'surprised') : 'neutral',
          armL: isHit ? { fold: 0.8, raise: 0.3 } : { fold: 0.3, raise: 0.1 },
          armR: isHit ? { fold: 0.8, raise: 0.3 } : { fold: 0.3, raise: 0.1 },
        }}
        look={LOOKS.pip}
      />

      {/* Damage 0% badge after impact */}
      {isHit && currentF >= 380 && (
        <g transform="translate(960, 250)">
          <rect x={-220} y={-35} width={440} height={70} rx={16} fill="rgba(16, 185, 129, 0.95)" stroke="#FFFFFF" strokeWidth={2} />
          <text x={0} y={10} fill="#FFFFFF" fontSize={24} fontWeight="900" fontFamily="system-ui, sans-serif" textAnchor="middle">
            ⚡ DAMAGE: 0.00% (INVULNERABLE)
          </text>
        </g>
      )}
    </g>
  );
};

// =========================================================================
// 2. CHAPTER 2: THE GOLDEN CENTURIES (622 frames)
// =========================================================================
export const ImmortalCh2: React.FC<{ f?: number; frame?: number }> = ({ f, frame }) => {
  const currentF = f ?? frame ?? 0;
  const zoom = interpolate(currentF, [0, 622], [1.0, 1.04], { extrapolateRight: 'clamp' });

  // Time & compound wealth animation
  const year = Math.floor(interpolate(currentF, [0, 600], [2026, 2326]));
  const wealthBillions = Math.floor(interpolate(currentF, [0, 600], [1, 30]));

  return (
    <g transform={`scale(${zoom}) translate(${-(zoom - 1) * 960} ${-(zoom - 1) * 540})`}>
      {/* Background: Victorian Grand Study & Ancient Library */}
      <image
        href={staticFile('immortal/bg_victorian_study.jpg')}
        width={1920}
        height={1080}
        preserveAspectRatio="xMidYMid slice"
        opacity={0.92}
      />
      <rect width={1920} height={1080} fill="#050814" opacity={0.25} />

      {/* Golden Year Counter HUD */}
      <g transform="translate(420, 140)">
        <rect x={-200} y={-40} width={400} height={80} rx={16} fill="rgba(15, 23, 42, 0.95)" stroke="#F59E0B" strokeWidth={3} />
        <text x={0} y={-5} fill="#F59E0B" fontSize={22} fontWeight="900" fontFamily="system-ui, sans-serif" textAnchor="middle">
          TIME ELAPSED: +300 YEARS
        </text>
        <text x={0} y={24} fill="#FFFFFF" fontSize={22} fontWeight="bold" fontFamily="system-ui, sans-serif" textAnchor="middle">
          YEAR {year} A.D.
        </text>
      </g>

      <g transform="translate(1500, 140)">
        <rect x={-220} y={-40} width={440} height={80} rx={16} fill="rgba(15, 23, 42, 0.95)" stroke="#10B981" strokeWidth={3} />
        <text x={0} y={-5} fill="#10B981" fontSize={20} fontWeight="900" fontFamily="system-ui, sans-serif" textAnchor="middle">
          COMPOUND WEALTH & INTELLECT
        </text>
        <text x={0} y={24} fill="#FDE047" fontSize={20} fontWeight="bold" fontFamily="system-ui, sans-serif" textAnchor="middle">
          ${wealthBillions} BILLION • 16 LANGUAGES
        </text>
      </g>

      {/* Floating Holographic Knowledge Glyphs */}
      <g transform="translate(1420, 600)">
        <circle cx={0} cy={0} r={120} fill="none" stroke="#38BDF8" strokeWidth={2} strokeDasharray="8 6" opacity={0.6} />
        <circle cx={0} cy={0} r={80} fill="none" stroke="#F59E0B" strokeWidth={2} opacity={0.5} />
        <text x={0} y={-30} fill="#38BDF8" fontSize={16} fontWeight="bold" fontFamily="monospace" textAnchor="middle">
          ASTROPHYSICS • ARCHITECTURE
        </text>
        <text x={0} y={5} fill="#FDE047" fontSize={16} fontWeight="bold" fontFamily="monospace" textAnchor="middle">
          QUANTUM NEURAL NETWORKS
        </text>
        <text x={0} y={40} fill="#10B981" fontSize={16} fontWeight="bold" fontFamily="monospace" textAnchor="middle">
          14 EMPIRES OUTLIVED
        </text>
      </g>

      {/* Stacks of gold bars on the study table left */}
      <g transform="translate(560, 780)">
        <rect x={-60} y={0} width={120} height={30} rx={4} fill="#F59E0B" stroke="#D97706" strokeWidth={2} />
        <rect x={-50} y={-26} width={100} height={26} rx={4} fill="#FDE047" stroke="#D97706" strokeWidth={2} />
        <rect x={-40} y={-50} width={80} height={24} rx={4} fill="#F59E0B" stroke="#D97706" strokeWidth={2} />
      </g>

      {/* Pip Stickman as Supreme Scholar & Immortal Tycoon */}
      <Hero
        pose={{
          x: 960,
          y: HIPS_Y,
          scale: 1.2,
          facing: 1,
          expr: 'cool',
          armL: { fold: 0.6, raise: 0.4 },
          armR: { fold: 0.4, raise: 0.2 },
        }}
        look={LOOKS.pip}
      />
    </g>
  );
};

// =========================================================================
// 3. CHAPTER 3: THE GRAVEYARD OF MEMORY (720 frames)
// =========================================================================
export const ImmortalCh3: React.FC<{ f?: number; frame?: number }> = ({ f, frame }) => {
  const currentF = f ?? frame ?? 0;
  const zoom = interpolate(currentF, [0, 720], [1.0, 1.05], { extrapolateRight: 'clamp' });

  // Floating ash particles
  const ashParticles = Array.from({ length: 24 }).map((_, i) => {
    const seed = i * 83;
    const px = (seed * 17) % 1920;
    const py = ((currentF * (1.5 + (seed % 3)) + seed * 23) % 1080);
    const size = 3 + (seed % 4);
    return { px, py, size };
  });

  return (
    <g transform={`scale(${zoom}) translate(${-(zoom - 1) * 960} ${-(zoom - 1) * 540})`}>
      {/* Background: Ruined Ash Earth Horizon */}
      <image
        href={staticFile('immortal/bg_ruined_earth.jpg')}
        width={1920}
        height={1080}
        preserveAspectRatio="xMidYMid slice"
        opacity={0.92}
      />
      <rect width={1920} height={1080} fill="#180B07" opacity={0.35} />

      {/* Dying Violet Sun on Horizon */}
      <circle cx={960} cy={620} r={140} fill="#EF4444" opacity={0.3} filter="blur(20px)" />

      {/* Grim Reality Badge */}
      <g transform="translate(960, 130)">
        <rect x={-320} y={-45} width={640} height={90} rx={18} fill="rgba(15, 23, 42, 0.96)" stroke="#EF4444" strokeWidth={3} />
        <text x={0} y={-5} fill="#EF4444" fontSize={26} fontWeight="900" fontFamily="system-ui, sans-serif" textAnchor="middle" letterSpacing="2px">
          YEAR 3000: THE EXTINCTION ERA
        </text>
        <text x={0} y={30} fill="#E2E8F0" fontSize={20} fontWeight="bold" fontFamily="system-ui, sans-serif" textAnchor="middle">
          EVERYONE YOU EVER LOVED IS DUST
        </text>
      </g>

      {/* Weathered Tombstone Silhouettes */}
      <g transform="translate(480, 780)">
        <path d="M -50 60 L -50 0 C -50 -40 50 -40 50 0 L 50 60 Z" fill="#334155" stroke="#1E293B" strokeWidth={3} />
        <text x={0} y={-5} fill="#94A3B8" fontSize={16} fontWeight="bold" fontFamily="system-ui, sans-serif" textAnchor="middle">
          ANNA (2030-2105)
        </text>
        <text x={0} y={20} fill="#64748B" fontSize={14} fontFamily="system-ui, sans-serif" textAnchor="middle">
          BELOVED WIFE
        </text>
      </g>

      <g transform="translate(1440, 780)">
        <path d="M -50 60 L -50 0 C -50 -40 50 -40 50 0 L 50 60 Z" fill="#334155" stroke="#1E293B" strokeWidth={3} />
        <text x={0} y={-5} fill="#94A3B8" fontSize={16} fontWeight="bold" fontFamily="system-ui, sans-serif" textAnchor="middle">
          LEO & CHILDREN
        </text>
        <text x={0} y={20} fill="#64748B" fontSize={14} fontFamily="system-ui, sans-serif" textAnchor="middle">
          LOST TO TIME
        </text>
      </g>

      {/* Falling ash particles */}
      {ashParticles.map((p, idx) => (
        <circle key={idx} cx={p.px} cy={p.py} r={p.size} fill="#CBD5E1" opacity={0.4} />
      ))}

      {/* Pip Stickman standing alone in mournful sorrow */}
      <Hero
        pose={{
          x: 960,
          y: HIPS_Y,
          scale: 1.18,
          facing: 1,
          expr: 'sad',
          armL: { fold: 0.2, raise: 0.1 },
          armR: { fold: 0.2, raise: 0.1 },
        }}
        look={LOOKS.pip}
      />
    </g>
  );
};

// =========================================================================
// 4. CHAPTER 4: THE TRILLION-YEAR VOID (831 frames)
// =========================================================================
export const ImmortalCh4: React.FC<{ f?: number; frame?: number }> = ({ f, frame }) => {
  const currentF = f ?? frame ?? 0;
  const zoom = interpolate(currentF, [0, 831], [1.0, 1.06], { extrapolateRight: 'clamp' });

  // Weightless floating physics
  const floatY = Math.sin(currentF * 0.04) * 25;
  const floatTilt = Math.sin(currentF * 0.03) * 8;

  // Star twinkling
  const stars = Array.from({ length: 40 }).map((_, i) => {
    const seed = i * 71;
    const cx = (seed * 47) % 1920;
    const cy = (seed * 89) % 1080;
    const twinkle = Math.sin(currentF * 0.1 + seed) * 0.4 + 0.6;
    const r = (seed % 3) + 1.5;
    return { cx, cy, twinkle, r };
  });

  return (
    <g transform={`scale(${zoom}) translate(${-(zoom - 1) * 960} ${-(zoom - 1) * 540})`}>
      {/* Background: Starry Cosmic Space Void */}
      <image
        href={staticFile('immortal/bg_space_void.jpg')}
        width={1920}
        height={1080}
        preserveAspectRatio="xMidYMid slice"
        opacity={0.94}
      />
      <rect width={1920} height={1080} fill="#02040A" opacity={0.4} />

      {/* Dynamic Twinkling Stars */}
      {stars.map((s, idx) => (
        <circle key={idx} cx={s.cx} cy={s.cy} r={s.r} fill="#E0F2FE" opacity={s.twinkle * 0.7} />
      ))}

      {/* Cold Cosmic Nebula Cloud Glow */}
      <circle cx={960} cy={540} r={400} fill="#3B82F6" opacity={0.12} filter="blur(60px)" />
      <circle cx={700} cy={480} r={300} fill="#8B5CF6" opacity={0.1} filter="blur(50px)" />

      {/* Floating HUD Badges */}
      <g transform="translate(960, 130)">
        <rect x={-330} y={-45} width={660} height={90} rx={18} fill="rgba(15, 23, 42, 0.95)" stroke="#6366F1" strokeWidth={3} />
        <text x={0} y={-5} fill="#6366F1" fontSize={26} fontWeight="900" fontFamily="system-ui, sans-serif" textAnchor="middle" letterSpacing="2px">
          EARTH DESTROYED • 3 TRILLION YEARS LATER
        </text>
        <text x={0} y={30} fill="#93C5FD" fontSize={20} fontWeight="bold" fontFamily="system-ui, sans-serif" textAnchor="middle">
          TEMPERATURE: -270°C • VACUUM OF SPACE
        </text>
      </g>

      {/* Floating Frozen Pip in Zero Gravity */}
      <g transform={`translate(960, ${540 + floatY}) rotate(${floatTilt})`}>
        {/* Frost / Ice aura around Pip */}
        <circle cx={0} cy={0} r={140} fill="#60A5FA" opacity={0.15} filter="blur(15px)" />

        <Hero
          pose={{
            x: 0,
            y: 50,
            scale: 1.15,
            facing: 1,
            expr: 'tired',
            armL: { fold: 0.4, raise: 0.3 },
            armR: { fold: 0.5, raise: 0.4 },
          }}
          look={LOOKS.pip}
        />

        {/* Ice crystals on hoodie */}
        <line x1={-30} y1={-20} x2={-10} y2={-5} stroke="#BAE6FD" strokeWidth={3} opacity={0.8} />
        <line x1={20} y1={10} x2={40} y2={25} stroke="#BAE6FD" strokeWidth={3} opacity={0.8} />
      </g>
    </g>
  );
};

// =========================================================================
// 5. CHAPTER 5: THE FINAL CHOICE & INTERACTIVE CARD (601 frames)
// =========================================================================
export const ImmortalCh5: React.FC<{ f?: number; frame?: number }> = ({ f, frame }) => {
  const currentF = f ?? frame ?? 0;

  // Transition to interactive end card at frame 180
  const isTransition = currentF >= 180;
  const pipX = interpolate(currentF, [180, 240], [960, 360], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const cardOpacity = interpolate(currentF, [210, 260], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const cardSlide = interpolate(currentF, [210, 260], [120, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Monolith pulse
  const monolithPulse = Math.sin(currentF * 0.1) * 0.2 + 0.8;

  return (
    <g>
      {/* Background: Cosmic Artifact Portal */}
      <image
        href={staticFile('immortal/bg_cosmic_artifact.jpg')}
        width={1920}
        height={1080}
        preserveAspectRatio="xMidYMid slice"
        opacity={0.92}
      />
      <rect width={1920} height={1080} fill="#050814" opacity={0.3} />

      {/* Pulsing Monolith Rings in background center */}
      <g transform="translate(1300, 480)" opacity={0.7 * monolithPulse}>
        <circle cx={0} cy={0} r={220} fill="none" stroke="#06B6D4" strokeWidth={3} strokeDasharray="14 10" />
        <circle cx={0} cy={0} r={170} fill="none" stroke="#F59E0B" strokeWidth={3} strokeDasharray="10 8" />
        <circle cx={0} cy={0} r={120} fill="#06B6D4" opacity={0.25} filter="blur(20px)" />
      </g>

      {/* Pip Stickman */}
      <Hero
        pose={{
          x: pipX,
          y: HIPS_Y,
          scale: 1.15,
          facing: 1,
          expr: isTransition ? 'smug' : 'surprised',
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
            An ancient cosmic artifact offers one final escape:
          </text>

          {/* Option A Box */}
          <g transform="translate(0, -40)">
            <rect x={-320} y={-45} width={640} height={90} rx={16} fill="rgba(30, 41, 59, 0.9)" stroke="#10B981" strokeWidth={3} />
            <text x={-290} y={-5} fill="#10B981" fontSize={24} fontWeight="900" fontFamily="system-ui, sans-serif">
              👉 OPTION A: DRINK THE CURE!
            </text>
            <text x={-290} y={26} fill="#E2E8F0" fontSize={18} fontWeight="500" fontFamily="system-ui, sans-serif">
              "Live 80 normal years, grow old, and die peacefully with family."
            </text>
          </g>

          {/* Option B Box */}
          <g transform="translate(0, 80)">
            <rect x={-320} y={-45} width={640} height={90} rx={16} fill="rgba(30, 41, 59, 0.9)" stroke="#F59E0B" strokeWidth={3} />
            <text x={-290} y={-5} fill="#F59E0B" fontSize={24} fontWeight="900" fontFamily="system-ui, sans-serif">
              👉 OPTION B: REMAIN IMMORTAL!
            </text>
            <text x={-290} y={26} fill="#E2E8F0" fontSize={18} fontWeight="500" fontFamily="system-ui, sans-serif">
              "Drift alone in space until the next universe is born."
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
// 6. SHORT COMPOSITION (1289 frames)
// =========================================================================
export const ImmortalShort: React.FC<{ f?: number; frame?: number }> = ({ f, frame }) => {
  const currentF = f ?? frame ?? 0;

  if (currentF < 280) {
    return <ImmortalCh1 f={currentF} />;
  } else if (currentF < 560) {
    return <ImmortalCh2 f={currentF - 280 + 100} />;
  } else if (currentF < 820) {
    return <ImmortalCh3 f={currentF - 560 + 50} />;
  } else if (currentF < 1040) {
    return <ImmortalCh4 f={currentF - 820 + 200} />;
  } else {
    return <ImmortalCh5 f={currentF - 1040 + 180} />;
  }
};
