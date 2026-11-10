import React from 'react';
import {
  Hero, basePose, clamp, LOOKS, Foreground, Glow,
} from '../../engine';

const PIP = LOOKS.pipHood;
const GOLD = '#FBBF24';
const CYAN = '#38BDF8';
const CRIMSON = '#EF4444';
const PURPLE = '#A855F7';
const INDIGO = '#6366F1';

const makePose = (p: any) => ({ ...basePose, ...p });

// ========================================================
// 1. ANIMATED FACIAL EXPRESSION OVERLAYS
// ========================================================
export const ShadowFaceReaction: React.FC<{
  cx: number;
  cy: number;
  type: 'terrified' | 'lazy' | 'confused' | 'freezing' | 'evil_shadow' | 'happy';
  f: number;
  scale?: number;
}> = ({ cx, cy, type, f, scale = 1 }) => {
  return (
    <g transform={`translate(${cx} ${cy}) scale(${scale})`}>
      {/* 1. TERRIFIED (Wide cartoon eyes, tiny pupils, screaming mouth, flying sweat) */}
      {type === 'terrified' && (
        <g>
          {/* Sweat drops flying */}
          <circle cx={-36} cy={-25 - (f % 20)} r={5} fill="#38BDF8" />
          <circle cx={38} cy={-20 - (f % 16)} r={5} fill="#38BDF8" />
          {/* Eyes */}
          <ellipse cx={-18} cy={-8} rx={14} ry={16} fill="#FFFFFF" stroke="#0F172A" strokeWidth={3} />
          <ellipse cx={18} cy={-8} rx={14} ry={16} fill="#FFFFFF" stroke="#0F172A" strokeWidth={3} />
          {/* Dilated pupils jittering */}
          <circle cx={-18 + Math.sin(f * 0.8) * 2} cy={-8} r={5} fill="#0F172A" />
          <circle cx={18 + Math.sin(f * 0.8) * 2} cy={-8} r={5} fill="#0F172A" />
          {/* Screaming open mouth */}
          <ellipse cx={0} cy={16} rx={16} ry={22} fill="#7F1D1D" stroke="#0F172A" strokeWidth={3} />
          <rect x={-10} y={4} width={20} height={8} fill="#FFFFFF" rx={2} />
        </g>
      )}

      {/* 2. LAZY / SMUG (Drooping half-closed eyes, relaxed grin) */}
      {type === 'lazy' && (
        <g>
          <path d="M -24 -12 Q -16 -6 -8 -12" stroke="#0F172A" strokeWidth={3.5} fill="none" />
          <path d="M 8 -12 Q 16 -6 24 -12" stroke="#0F172A" strokeWidth={3.5} fill="none" />
          <path d="M -14 8 Q 0 18 16 6" stroke="#0F172A" strokeWidth={3.5} fill="none" />
          <ellipse cx={-18} cy={4} rx={6} ry={4} fill="#F59E0B" opacity={0.6} />
        </g>
      )}

      {/* 3. CONFUSED (One eyebrow up, mouth tilted) */}
      {type === 'confused' && (
        <g>
          <path d="M -20 -18 Q -10 -28 0 -20" stroke="#0F172A" strokeWidth={3.5} fill="none" />
          <path d="M 8 -16 Q 18 -12 24 -16" stroke="#0F172A" strokeWidth={3.5} fill="none" />
          <ellipse cx={-10} cy={-4} rx={8} ry={10} fill="#0F172A" />
          <circle cx={-12} cy={-6} r={3} fill="#FFFFFF" />
          <ellipse cx={14} cy={-4} rx={7} ry={9} fill="#0F172A" />
          <circle cx={12} cy={-6} r={3} fill="#FFFFFF" />
          <path d="M -10 14 Q 2 8 16 12" stroke="#0F172A" strokeWidth={3} fill="none" />
        </g>
      )}

      {/* 4. FREEZING (Chattering zigzag teeth, cyan shivering lips, frost) */}
      {type === 'freezing' && (
        <g transform={`translate(${Math.sin(f * 1.5) * 2} 0)`}>
          <ellipse cx={-16} cy={-6} rx={12} ry={14} fill="#E0F2FE" stroke="#0284C7" strokeWidth={3} />
          <ellipse cx={16} cy={-6} rx={12} ry={14} fill="#E0F2FE" stroke="#0284C7" strokeWidth={3} />
          <circle cx={-16} cy={-6} r={4} fill="#0284C7" />
          <circle cx={16} cy={-6} r={4} fill="#0284C7" />
          {/* Chattering teeth */}
          <path d="M -16 14 L -12 18 L -8 14 L -4 18 L 0 14 L 4 18 L 8 14 L 12 18 L 16 14" stroke="#0284C7" strokeWidth={3.5} fill="none" />
          {/* Icicles on chin */}
          <polygon points="-8,22 -4,34 0,22" fill="#BAE6FD" />
          <polygon points="4,22 8,36 12,22" fill="#BAE6FD" />
        </g>
      )}

      {/* 5. EVIL SHADOW (Neon cyan slit eyes and wicked grin) */}
      {type === 'evil_shadow' && (
        <g>
          {/* Glowing neon eyes */}
          <ellipse cx={-18} cy={-8} rx={14} ry={16} fill="#38BDF8" />
          <ellipse cx={18} cy={-8} rx={14} ry={16} fill="#38BDF8" />
          {/* Black vertical slit pupils */}
          <line x1={-18} y1={-18} x2={-18} y2={2} stroke="#000000" strokeWidth={4} />
          <line x1={18} y1={-18} x2={18} y2={2} stroke="#000000" strokeWidth={4} />
          {/* Sharp wicked grin */}
          <path d="M -22 10 Q 0 32 22 10 Z" fill="#38BDF8" stroke="#0284C7" strokeWidth={2} />
          {/* Sharp shadow teeth */}
          <polygon points="-14,14 -10,24 -6,14" fill="#000000" />
          <polygon points="-2,16 2,26 6,16" fill="#000000" />
          <polygon points="10,14 14,24 18,14" fill="#000000" />
        </g>
      )}

      {/* 6. HAPPY / RELIEVED */}
      {type === 'happy' && (
        <g>
          <ellipse cx={-18} cy={4} rx={8} ry={5} fill="#F43F5E" opacity={0.8} />
          <ellipse cx={18} cy={4} rx={8} ry={5} fill="#F43F5E" opacity={0.8} />
          <path d="M -16 6 Q 0 24 16 6 Z" fill="#DC2626" stroke="#0F172A" strokeWidth={3} />
          <path d="M -20 -10 Q -10 -16 0 -10" stroke="#0F172A" strokeWidth={3} fill="none" />
          <path d="M 0 -10 Q 10 -16 20 -10" stroke="#0F172A" strokeWidth={3} fill="none" />
        </g>
      )}
    </g>
  );
};

// ========================================================
// 2. THE LIVING SHADOW STICK FIGURE COMPONENT
// ========================================================
export const AutonomousShadowFigure: React.FC<{
  x: number;
  y: number;
  scale?: number;
  f: number;
  pose?: 'standing' | 'holding_remote' | 'doing_dishes' | 'vacuuming' | 'wrestling' | 'stretching' | 'cowering' | 'high_five';
  facing?: 1 | -1;
  glowColor?: string;
}> = ({ x, y, scale = 1, f, pose = 'standing', facing = 1, glowColor = '#38BDF8' }) => {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale * facing} ${scale})`}>
      {/* Eerie shadow aura */}
      <ellipse cx={0} cy={20} rx={140} ry={30} fill="#000000" opacity={0.4} filter="blur(8px)" />

      {/* Shadow Body (Pitch Black with Purple/Cyan Rim Glow) */}
      <g filter="drop-shadow(0 0 12px rgba(56, 189, 248, 0.45))">
        {/* Torso */}
        <line x1={0} y1={-80} x2={0} y2={-200} stroke="#05050A" strokeWidth={24} strokeLinecap="round" />

        {/* Legs depending on pose */}
        {pose === 'wrestling' ? (
          <g>
            <line x1={0} y1={-80} x2={-45} y2={0} stroke="#05050A" strokeWidth={22} strokeLinecap="round" />
            <line x1={0} y1={-80} x2={50} y2={0} stroke="#05050A" strokeWidth={22} strokeLinecap="round" />
          </g>
        ) : (
          <g>
            <line x1={0} y1={-80} x2={-30 + Math.sin(f * 0.1) * 10} y2={0} stroke="#05050A" strokeWidth={22} strokeLinecap="round" />
            <line x1={0} y1={-80} x2={30 - Math.sin(f * 0.1) * 10} y2={0} stroke="#05050A" strokeWidth={22} strokeLinecap="round" />
          </g>
        )}

        {/* Arms depending on pose */}
        {pose === 'holding_remote' && (
          <g>
            {/* Left arm swagger on hip */}
            <line x1={0} y1={-170} x2={-55} y2={-130} stroke="#05050A" strokeWidth={18} strokeLinecap="round" />
            <line x1={-55} y1={-130} x2={-30} y2={-90} stroke="#05050A" strokeWidth={18} strokeLinecap="round" />
            {/* Right arm stretching out with TV Remote */}
            <line x1={0} y1={-170} x2={90} y2={-170} stroke="#05050A" strokeWidth={18} strokeLinecap="round" />
            <line x1={90} y1={-170} x2={160} y2={-150} stroke="#05050A" strokeWidth={18} strokeLinecap="round" />
            {/* TV Remote */}
            <rect x={155} y={-175} width={45} height={26} rx={5} fill="#1E293B" stroke="#EF4444" strokeWidth={3} />
            <circle cx={190} cy={-162} r={5} fill="#EF4444" />
          </g>
        )}

        {pose === 'doing_dishes' && (
          <g>
            {/* Sponge scrubbing motion */}
            <line x1={0} y1={-170} x2={50} y2={-140 + Math.sin(f * 0.3) * 15} stroke="#05050A" strokeWidth={18} strokeLinecap="round" />
            <line x1={0} y1={-170} x2={80} y2={-140 - Math.sin(f * 0.3) * 15} stroke="#05050A" strokeWidth={18} strokeLinecap="round" />
            {/* Foam bubbles */}
            <circle cx={70 + Math.sin(f * 0.4) * 10} cy={-130} r={8} fill="#E0F2FE" opacity={0.8} />
            <circle cx={90} cy={-145} r={6} fill="#E0F2FE" opacity={0.8} />
          </g>
        )}

        {pose === 'vacuuming' && (
          <g>
            <line x1={0} y1={-170} x2={80} y2={-120} stroke="#05050A" strokeWidth={18} strokeLinecap="round" />
            <line x1={80} y1={-120} x2={120} y2={-60} stroke="#05050A" strokeWidth={18} strokeLinecap="round" />
            {/* Vacuum tube and nozzle */}
            <line x1={120} y1={-60} x2={160} y2={0} stroke="#94A3B8" strokeWidth={10} strokeLinecap="round" />
            <rect x={140} y={-10} width={60} height={15} rx={4} fill="#EF4444" />
          </g>
        )}

        {pose === 'stretching' && (
          <g>
            {/* Rubbery stretched arms */}
            <path d={`M 0 -170 Q 120 ${-260 + Math.sin(f * 0.2) * 40} 240 -300`} stroke="#05050A" strokeWidth={20} fill="none" strokeLinecap="round" />
            <path d={`M 0 -170 Q -120 ${-260 + Math.sin(f * 0.2) * 40} -240 -300`} stroke="#05050A" strokeWidth={20} fill="none" strokeLinecap="round" />
          </g>
        )}

        {pose === 'cowering' && (
          <g>
            {/* Hands shielding face from bright floodlights */}
            <line x1={0} y1={-170} x2={-40} y2={-230} stroke="#05050A" strokeWidth={18} strokeLinecap="round" />
            <line x1={0} y1={-170} x2={40} y2={-230} stroke="#05050A" strokeWidth={18} strokeLinecap="round" />
          </g>
        )}

        {pose === 'high_five' && (
          <g>
            <line x1={0} y1={-170} x2={-40} y2={-110} stroke="#05050A" strokeWidth={18} strokeLinecap="round" />
            <line x1={0} y1={-170} x2={90} y2={-220} stroke="#05050A" strokeWidth={18} strokeLinecap="round" />
          </g>
        )}

        {pose === 'standing' && (
          <g>
            <line x1={0} y1={-170} x2={-50} y2={-110} stroke="#05050A" strokeWidth={18} strokeLinecap="round" />
            <line x1={0} y1={-170} x2={50} y2={-110} stroke="#05050A" strokeWidth={18} strokeLinecap="round" />
          </g>
        )}

        {/* Head */}
        <ellipse cx={0} cy={-255} rx={50} ry={55} fill="#05050A" />
      </g>

      {/* Evil glowing facial reaction */}
      <ShadowFaceReaction cx={0} cy={-255} type="evil_shadow" f={f} scale={1.2} />
    </g>
  );
};

// ========================================================
// 3. STORYBOARD BACKGROUNDS & SETS
// ========================================================

/** 1. Pip's Bedroom / Living Room Set */
export const LivingRoomBg: React.FC<{ f: number; lightsOff?: boolean; frost?: boolean }> = ({
  f, lightsOff = false, frost = false,
}) => {
  return (
    <g>
      {/* Deep moody wall & floor */}
      <rect x={0} y={0} width={1920} height={1080} fill={lightsOff ? "#030712" : "#0F172A"} />
      
      {/* Wall Wallpaper with vertical textured lines */}
      <g opacity={lightsOff ? 0.15 : 0.4}>
        {[...Array(32)].map((_, i) => (
          <line key={i} x1={i * 65} y1={0} x2={i * 65} y2={820} stroke="#1E293B" strokeWidth={2} />
        ))}
      </g>

      {/* Floor with Wooden Planks */}
      <rect x={0} y={820} width={1920} height={260} fill={lightsOff ? "#02040A" : "#0B0F19"} />
      <line x1={0} y1={820} x2={1920} y2={820} stroke="#334155" strokeWidth={8} />
      {[...Array(12)].map((_, i) => (
        <line key={i} x1={i * 180} y1={820} x2={i * 180} y2={1080} stroke="#1E293B" strokeWidth={3} />
      ))}

      {/* Glowing Flat-screen TV Screen on Left */}
      <g transform="translate(180 320)">
        <rect x={0} y={0} width={380} height={240} rx={12} fill="#020617" stroke="#475569" strokeWidth={10} />
        {/* Screen Content: Animated glowing cartoon pulses */}
        {!lightsOff && (
          <g>
            <rect x={10} y={10} width={360} height={220} fill="#0284C7" opacity={0.6} />
            <circle cx={180 + Math.sin(f * 0.1) * 60} cy={120} r={45} fill="#FDE047" opacity={0.8} />
            {/* TV Light Glow Cones onto room */}
            <polygon points="380,20 800,-80 880,480 380,220" fill="url(#coneLight)" opacity={0.18} style={{ mixBlendMode: 'screen' }} />
          </g>
        )}
        {/* TV Stand */}
        <polygon points="150,240 230,240 260,320 120,320" fill="#334155" />
      </g>

      {/* Cozy Couch / Sofa */}
      <g transform="translate(700 680)">
        {/* Backrest */}
        <rect x={0} y={-100} width={500} height={120} rx={24} fill="#1E293B" stroke="#334155" strokeWidth={6} />
        {/* Cushions */}
        <rect x={-20} y={0} width={540} height={90} rx={20} fill="#334155" stroke="#475569" strokeWidth={6} />
        {/* Armrests */}
        <rect x={-50} y={-60} width={60} height={140} rx={18} fill="#1E293B" stroke="#334155" strokeWidth={6} />
        <rect x={490} y={-60} width={60} height={140} rx={18} fill="#1E293B" stroke="#334155" strokeWidth={6} />
      </g>

      {/* Coffee Table with Mug & Pizza Box */}
      <g transform="translate(800 830)">
        <rect x={0} y={0} width={300} height={40} rx={10} fill="#475569" stroke="#1E293B" strokeWidth={4} />
        <rect x={40} y={40} width={18} height={80} fill="#334155" />
        <rect x={240} y={40} width={18} height={80} fill="#334155" />
        {/* Coffee Mug */}
        <rect x={60} y={-35} width={32} height={35} rx={6} fill="#F97316" />
        {/* Pizza Box */}
        <rect x={120} y={-24} width={120} height={24} rx={4} fill="#D97706" stroke="#92400E" strokeWidth={2} />
      </g>

      {/* Ceiling Hanging Lamp */}
      <g transform="translate(1400 0)">
        <line x1={0} y1={0} x2={0} y2={220} stroke="#64748B" strokeWidth={6} />
        <polygon points="-60,280 60,280 30,220 -30,220" fill="#F59E0B" stroke="#B45309" strokeWidth={4} />
        {!lightsOff && (
          <g>
            <circle cx={0} cy={270} r={28} fill="#FEF08A" />
            {/* Volumetric Lamp Light Cone */}
            <polygon points="-50,280 50,280 380,860 -380,860" fill="url(#coneLight)" opacity={0.25} style={{ mixBlendMode: 'screen' }} />
          </g>
        )}
      </g>

      {/* Frost Overlay (If freeze is active) */}
      {frost && (
        <g opacity={0.75}>
          {/* Crystallized Ice Crystals across edges */}
          {[...Array(16)].map((_, i) => (
            <polygon
              key={i}
              points={`${i * 120},0 ${i * 120 + 60},${80 + (i % 4) * 40} ${i * 120 + 120},0`}
              fill="#BAE6FD"
              opacity={0.6}
            />
          ))}
          {/* Frost vignette on borders */}
          <rect x={0} y={0} width={1920} height={1080} fill="none" stroke="#7DD3FC" strokeWidth={30} opacity={0.4} />
        </g>
      )}

      {/* Foreground Depth Blur Silhouettes */}
      <Foreground blur={10}>
        <circle cx={140} cy={1020} r={120} fill="#030712" />
        <circle cx={1820} cy={1040} r={140} fill="#030712" />
      </Foreground>
    </g>
  );
};

/** 2. Header HUD Banner */
export const ShadowHeader: React.FC<{ epoch: string; title: string; subtitle: string; f: number }> = ({
  epoch, title, subtitle, f,
}) => {
  return (
    <g transform="translate(80 60)">
      {/* Background card with glass effect */}
      <rect x={0} y={0} width={760} height={110} rx={22} fill="#0B132B" opacity={0.88} stroke="#38BDF8" strokeWidth={3} />
      {/* Glowing dot indicator */}
      <circle cx={40} cy={40} r={10} fill={CRIMSON} />
      <circle cx={40} cy={40} r={18} fill="none" stroke={CRIMSON} strokeWidth={2} opacity={0.5 + Math.sin(f * 0.2) * 0.5} />
      {/* Text badges */}
      <text x={70} y={46} fill={GOLD} fontSize={22} fontWeight="bold" letterSpacing={3}>
        {epoch.toUpperCase()}
      </text>
      <text x={40} y={88} fill="#FFFFFF" fontSize={34} fontWeight="900" letterSpacing={1}>
        {title}
      </text>
      <text x={530} y={88} fill={CYAN} fontSize={24} fontWeight="bold">
        {subtitle}
      </text>
    </g>
  );
};

// ========================================================
// 4. THE 6 CHAPTERS (4.23 MINUTE LONG-FORM EPISODE)
// ========================================================

/** Chapter 1: The Detached Silhouette (1257 frames / ~41.9s) */
export const Chapter1: React.FC<{ f: number }> = ({ f }) => {
  // Scene cuts every 3-5 seconds (~100-150 frames):
  // Cut 1: f 0-250 (Pip relaxing on couch, drops remote)
  // Cut 2: f 250-550 (Shadow peels off wall, stretches black arm to grab remote!)
  // Cut 3: f 550-900 (Shadow places remote in Pip's lap; Pip freezes in shock)
  // Cut 4: f 900-1257 (Pip screams, shadow winks and taps foot!)

  return (
    <g>
      <LivingRoomBg f={f} />

      {f < 250 && (
        <g>
          <ShadowHeader epoch="00:01 • THE ACCIDENT" title="FRIDAY NIGHT CARTOONS" subtitle="DROPPED REMOTE" f={f} />
          {/* Pip relaxing on couch */}
          <Hero
            x={920}
            y={800}
            scale={1.05}
            facing={1}
            pose={makePose({
              torso: { angle: 12, bend: 5 },
              head: { angle: -8 },
              armL: { a: 45, b: 20 },
              armR: { a: 80, b: -20 },
              legL: { a: 70, b: -60 },
              legR: { a: 65, b: -55 },
            })}
            look={PIP}
          />
          <ShadowFaceReaction cx={920} cy={540} type="lazy" f={f} scale={1.1} />

          {/* Falling Remote */}
          <g transform={`translate(${1120 + clamp(f * 2, 0, 120)} ${720 + clamp(f * 3, 0, 190)}) rotate(${f * 15})`}>
            <rect x={-15} y={-8} width={30} height={16} rx={4} fill="#1E293B" stroke="#EF4444" strokeWidth={2} />
          </g>
        </g>
      )}

      {f >= 250 && f < 550 && (
        <g>
          <ShadowHeader epoch="00:15 • THE UNTETHERING" title="SHADOW PEELS OFF WALL!" subtitle="PHYSICS BROKEN" f={f} />
          {/* Close-up on the wall behind couch */}
          {/* Pip looking over shoulder confused */}
          <Hero
            x={760}
            y={800}
            scale={1.05}
            facing={1}
            pose={makePose({
              torso: { angle: -10, bend: 0 },
              head: { angle: -30 },
              armL: { a: 20, b: 30 },
              armR: { a: 40, b: 40 },
            })}
            look={PIP}
          />
          <ShadowFaceReaction cx={760} cy={545} type="confused" f={f} scale={1.1} />

          {/* The Living Shadow peeling off the wall! */}
          <AutonomousShadowFigure
            x={1260}
            y={800}
            scale={1.1}
            f={f}
            pose="holding_remote"
            facing={-1}
          />

          {/* Stretched shadow arm reaching toward remote */}
          <path
            d={`M 1260 630 Q 1160 ${740 + Math.sin(f * 0.2) * 20} 1040 820`}
            stroke="#05050A"
            strokeWidth={22}
            strokeLinecap="round"
            fill="none"
          />
        </g>
      )}

      {f >= 550 && f < 900 && (
        <g>
          <ShadowHeader epoch="00:28 • THE DELIVERY" title="A SENTIENT 2D CLONE" subtitle="ZERO PHYSICAL MASS" f={f} />
          {/* Medium two-shot: Shadow handing remote directly to Pip */}
          <Hero
            x={680}
            y={800}
            scale={1.1}
            facing={1}
            pose={makePose({
              torso: { angle: -15, bend: 0 },
              head: { angle: 10 },
              armL: { a: -30, b: 80 }, // Hands trembling
              armR: { a: 30, b: 80 },
              legL: { a: 20, b: -20 },
              legR: { a: -20, b: 20 },
            })}
            look={PIP}
          />
          <ShadowFaceReaction cx={680} cy={540} type="terrified" f={f} scale={1.2} />

          {/* Shadow standing tall, hands on hips */}
          <AutonomousShadowFigure
            x={1180}
            y={800}
            scale={1.15}
            f={f}
            pose="holding_remote"
            facing={-1}
          />

          {/* Red exclamation mark over Pip */}
          <text x={680} y={440 - (f % 15)} fill={CRIMSON} fontSize={58} fontWeight="900" textAnchor="middle">
            ?!
          </text>
        </g>
      )}

      {f >= 900 && (
        <g>
          <ShadowHeader epoch="00:38 • THE REACTION" title="IT HAS A MIND OF ITS OWN!" subtitle="DETACHED & ALIVE" f={f} />
          {/* Dramatic wide shot: Pip screaming, Shadow swaggering */}
          <Hero
            x={560}
            y={800}
            scale={1.1}
            facing={1}
            pose={makePose({
              torso: { angle: -20, bend: 0 },
              head: { angle: -15 },
              armL: { a: -60, b: 120 }, // Clutching head in terror
              armR: { a: -80, b: 110 },
              legL: { a: 35, b: -25 },
              legR: { a: -35, b: 25 },
            })}
            look={PIP}
          />
          <ShadowFaceReaction cx={560} cy={540} type="terrified" f={f} scale={1.3} />

          {/* Shadow swaggering and winking */}
          <AutonomousShadowFigure
            x={1320}
            y={800}
            scale={1.2}
            f={f}
            pose="holding_remote"
            facing={-1}
          />

          {/* HUD Callout box */}
          <g transform="translate(860 380)">
            <rect x={0} y={0} width={340} height={100} rx={16} fill="#1E293B" stroke="#FBBF24" strokeWidth={4} />
            <text x={170} y={44} fill="#FBBF24" fontSize={26} fontWeight="bold" textAnchor="middle">
              AUTONOMOUS
            </text>
            <text x={170} y={80} fill="#FFFFFF" fontSize={22} fontWeight="900" textAnchor="middle">
              SHADOW DETACHED!
            </text>
          </g>
        </g>
      )}
    </g>
  );
};

/** Chapter 2: The Ultimate Roommate (1167 frames / ~38.9s) */
export const Chapter2: React.FC<{ f: number }> = ({ f }) => {
  // Montage cuts:
  // Cut 1: f 0-300 (Pip in bed eating pizza, shadow washing dishes in bubbles)
  // Cut 2: f 300-650 (Shadow vacuuming the room at super speed)
  // Cut 3: f 650-950 (Shadow solving calculus homework on glowing chalkboard!)
  // Cut 4: f 950-1167 (Pip celebrating: "Cracked human laziness!")

  return (
    <g>
      <LivingRoomBg f={f} />

      {f < 300 && (
        <g>
          <ShadowHeader epoch="00:45 • SUPERPOWER UNLOCKED" title="THE ULTIMATE ASSISTANT" subtitle="DISHES DONE IN SECONDS" f={f} />
          {/* Pip lounging on couch with pizza slice */}
          <Hero
            x={560}
            y={800}
            scale={1.05}
            facing={1}
            pose={makePose({
              torso: { angle: 15, bend: 10 },
              head: { angle: -5 },
              armL: { a: 30, b: 40 },
              armR: { a: 80, b: -40 }, // Holding pizza slice
              legL: { a: 70, b: -60 },
              legR: { a: 65, b: -55 },
            })}
            look={PIP}
          />
          <ShadowFaceReaction cx={560} cy={545} type="lazy" f={f} scale={1.1} />
          {/* Pizza slice in hand */}
          <polygon points="620,680 660,670 650,710" fill="#F59E0B" stroke="#92400E" strokeWidth={2} />

          {/* Kitchen Sink area on Right with Shadow Washing Dishes */}
          <g transform="translate(1300 700)">
            {/* Counter */}
            <rect x={-100} y={0} width={280} height={180} rx={10} fill="#1E293B" stroke="#475569" strokeWidth={6} />
            <rect x={-60} y={-30} width={140} height={40} fill="#64748B" rx={6} />
            {/* Dish Stack */}
            <ellipse cx={-10} cy={-25} rx={35} ry={12} fill="#F8FAFC" stroke="#94A3B8" strokeWidth={3} />
            <ellipse cx={-10} cy={-40} rx={35} ry={12} fill="#F8FAFC" stroke="#94A3B8" strokeWidth={3} />
          </g>
          <AutonomousShadowFigure x={1400} y={800} scale={1.1} f={f} pose="doing_dishes" facing={-1} />
        </g>
      )}

      {f >= 300 && f < 650 && (
        <g>
          <ShadowHeader epoch="01:00 • ZERO FATIGUE" title="TURBO VACUUM CLEANING" subtitle="ZERO PHYSICAL MASS" f={f} />
          {/* Shadow gliding across screen with vacuum */}
          <AutonomousShadowFigure
            x={600 + ((f - 300) * 2.5) % 800}
            y={800}
            scale={1.15}
            f={f}
            pose="vacuuming"
            facing={1}
          />
          {/* Pip watching in awe with thumbs up */}
          <Hero
            x={380}
            y={800}
            scale={1.05}
            facing={1}
            pose={makePose({
              torso: { angle: 0, bend: 0 },
              head: { angle: 5 },
              armL: { a: -30, b: 60 },
              armR: { a: 90, b: 0 }, // Thumbs up
            })}
            look={PIP}
          />
          <ShadowFaceReaction cx={380} cy={540} type="happy" f={f} scale={1.1} />
        </g>
      )}

      {f >= 650 && f < 950 && (
        <g>
          <ShadowHeader epoch="01:15 • ZERO SWEAT" title="SOLVING ADVANCED CALCULUS" subtitle="HOMEWORK COMPLETE!" f={f} />
          {/* Chalkboard with Math Formulas */}
          <g transform="translate(980 280)">
            <rect x={0} y={0} width={580} height={340} rx={16} fill="#064E3B" stroke="#047857" strokeWidth={10} />
            <text x={40} y={60} fill="#A7F3D0" fontSize={28} fontWeight="bold" fontFamily="monospace">
              ∫ e^(x^2) dx = ∑ x^(2n)/n!
            </text>
            <text x={40} y={130} fill="#FDE047" fontSize={32} fontWeight="900" fontFamily="monospace">
              ∇ × E = -∂B/∂t
            </text>
            <text x={40} y={200} fill="#38BDF8" fontSize={30} fontWeight="bold" fontFamily="monospace">
              E = mc² • NO SALARY!
            </text>
            <text x={40} y={270} fill="#34D399" fontSize={36} fontWeight="900">
              GRADE: A+++ 100%
            </text>
          </g>

          {/* Shadow writing on board */}
          <AutonomousShadowFigure x={1480} y={800} scale={1.15} f={f} pose="standing" facing={-1} />

          {/* Pip laughing in pure satisfaction */}
          <Hero
            x={520}
            y={800}
            scale={1.1}
            facing={1}
            pose={makePose({
              torso: { angle: 10, bend: 5 },
              head: { angle: -10 },
              armL: { a: -50, b: 60 },
              armR: { a: 60, b: 40 },
            })}
            look={PIP}
          />
          <ShadowFaceReaction cx={520} cy={540} type="happy" f={f} scale={1.2} />
        </g>
      )}

      {f >= 950 && (
        <g>
          <ShadowHeader epoch="01:25 • THE TRAP" title="THE TERRIFYING CATCH..." subtitle="WHAT COULD GO WRONG?" f={f} />
          <Hero
            x={960}
            y={800}
            scale={1.2}
            facing={1}
            pose={makePose({
              torso: { angle: 0, bend: 0 },
              head: { angle: 0 },
              armL: { a: -40, b: 20 },
              armR: { a: 40, b: 20 },
            })}
            look={PIP}
          />
          <ShadowFaceReaction cx={960} cy={520} type="confused" f={f} scale={1.2} />

          {/* Warning Banner */}
          <g transform="translate(620 340)">
            <rect x={0} y={0} width={680} height={100} rx={20} fill="#7F1D1D" stroke="#EF4444" strokeWidth={5} />
            <text x={340} y={62} fill="#FFFFFF" fontSize={36} fontWeight="900" textAnchor="middle">
              ⚠️ SENTIENCE COMES WITH A PRICE!
            </text>
          </g>
        </g>
      )}
    </g>
  );
};

/** Chapter 3: Multiple Lights & The Darkness Paradox (1273 frames / ~42.4s) */
export const Chapter3: React.FC<{ f: number }> = ({ f }) => {
  // Cuts:
  // Cut 1: f 0-350 (Pip flips 2nd lamp on -> shadow splits into TWO sentient shadows!)
  // Cut 2: f 350-700 (Two shadows wrestling over TV remote on the wall)
  // Cut 3: f 700-1000 (Pip hits light switch -> TOTAL PITCH BLACK ROOM!)
  // Cut 4: f 1000-1273 (Shadow doesn't die: cold hands tap Pip's neck in darkness!)

  const inDarkness = f >= 700;

  return (
    <g>
      <LivingRoomBg f={f} lightsOff={inDarkness} />

      {f < 350 && (
        <g>
          <ShadowHeader epoch="01:30 • OPTICAL SPLIT" title="TWO LAMPS = TWO SHADOWS!" subtitle="CLONE DIVISION" f={f} />
          {/* Two Distinct Lamps on Left & Right */}
          <g transform="translate(300 200)">
            <circle cx={0} cy={0} r={35} fill="#FEF08A" />
            <polygon points="-40,0 40,0 240,620 -240,620" fill="url(#coneLight)" opacity={0.3} style={{ mixBlendMode: 'screen' }} />
          </g>
          <g transform="translate(1620 200)">
            <circle cx={0} cy={0} r={35} fill="#FEF08A" />
            <polygon points="-40,0 40,0 240,620 -240,620" fill="url(#coneLight)" opacity={0.3} style={{ mixBlendMode: 'screen' }} />
          </g>

          {/* Pip in center terrified */}
          <Hero
            x={960}
            y={800}
            scale={1.1}
            facing={1}
            pose={makePose({
              torso: { angle: 0, bend: 0 },
              head: { angle: 0 },
              armL: { a: -60, b: 30 },
              armR: { a: 60, b: 30 },
            })}
            look={PIP}
          />
          <ShadowFaceReaction cx={960} cy={530} type="terrified" f={f} scale={1.2} />

          {/* Shadow 1 on Left */}
          <AutonomousShadowFigure x={580} y={800} scale={1.05} f={f} pose="standing" facing={1} />
          {/* Shadow 2 on Right */}
          <AutonomousShadowFigure x={1340} y={800} scale={1.05} f={f} pose="standing" facing={-1} />
        </g>
      )}

      {f >= 350 && f < 700 && (
        <g>
          <ShadowHeader epoch="01:45 • SHADOW SCUFFLE" title="WRESTLING OVER THE REMOTE" subtitle="TWO ROGUE CLONES" f={f} />
          {/* The two shadows fighting in center */}
          <AutonomousShadowFigure
            x={900 + Math.sin(f * 0.4) * 30}
            y={800}
            scale={1.1}
            f={f}
            pose="wrestling"
            facing={1}
          />
          <AutonomousShadowFigure
            x={1040 - Math.sin(f * 0.4) * 30}
            y={800}
            scale={1.1}
            f={f}
            pose="wrestling"
            facing={-1}
          />

          {/* Comic Fight Cloud & Impact Stars */}
          <g transform={`translate(970 ${650 + Math.sin(f * 0.5) * 10})`}>
            <ellipse cx={0} cy={0} rx={90} ry={60} fill="#F8FAFC" opacity={0.8} />
            <text x={-40} y={15} fill="#EF4444" fontSize={36} fontWeight="900">
              POW!
            </text>
            <text x={30} y={-10} fill="#F59E0B" fontSize={32} fontWeight="900">
              BAM!
            </text>
          </g>

          {/* Pip running toward the light switch on the wall */}
          <Hero
            x={340}
            y={800}
            scale={1.05}
            facing={-1}
            pose={makePose({
              torso: { angle: -25, bend: 0 },
              head: { angle: -10 },
              armL: { a: 90, b: 0 }, // Reaching for switch
              armR: { a: 40, b: 20 },
              legL: { a: -35, b: 40 },
              legR: { a: 45, b: -20 },
            })}
            look={PIP}
          />
        </g>
      )}

      {f >= 700 && f < 1000 && (
        <g>
          <ShadowHeader epoch="02:00 • LIGHTS OUT" title="TOTAL PITCH BLACKNESS" subtitle="NO LIGHT = NO SHADOW?" f={f} />
          {/* Screen is pitch black */}
          <rect x={0} y={0} width={1920} height={1080} fill="#02040A" />

          {/* Pip's glowing white eyes trembling in the dark */}
          <g transform={`translate(960 540)`}>
            <ellipse cx={-20} cy={0} rx={12} ry={14} fill="#FFFFFF" />
            <ellipse cx={20} cy={0} rx={12} ry={14} fill="#FFFFFF" />
            <circle cx={-20 + Math.sin(f * 0.5) * 4} cy={0} r={4} fill="#020617" />
            <circle cx={20 + Math.sin(f * 0.5) * 4} cy={0} r={4} fill="#020617" />
          </g>

          {/* Comic Dialogue bubble */}
          <g transform="translate(960 400)">
            <rect x={-180} y={-40} width={360} height={80} rx={16} fill="#1E293B" stroke="#64748B" strokeWidth={3} />
            <text x={0} y={10} fill="#FFFFFF" fontSize={26} fontWeight="bold" textAnchor="middle">
              "Phew... lights out, I'm safe!"
            </text>
          </g>
        </g>
      )}

      {f >= 1000 && (
        <g>
          <ShadowHeader epoch="02:15 • THE DARK MERGE" title="COLD HANDS ON YOUR NECK!" subtitle="MERGED WITH ROOM" f={f} />
          <rect x={0} y={0} width={1920} height={1080} fill="#02040A" />

          {/* Pip's wide terrified eyes */}
          <g transform="translate(960 540)">
            <ellipse cx={-24} cy={0} rx={18} ry={22} fill="#FFFFFF" />
            <ellipse cx={24} cy={0} rx={18} ry={22} fill="#FFFFFF" />
            <circle cx={-24} cy={0} r={5} fill="#020617" />
            <circle cx={24} cy={0} r={5} fill="#020617" />
            {/* Screaming mouth */}
            <ellipse cx={0} cy={35} rx={16} ry={24} fill="#EF4444" />
          </g>

          {/* Two pairs of glowing cyan shadow eyes behind Pip! */}
          <g transform="translate(740 460)">
            <ellipse cx={-18} cy={0} rx={14} ry={18} fill="#38BDF8" />
            <ellipse cx={18} cy={0} rx={14} ry={18} fill="#38BDF8" />
          </g>
          <g transform="translate(1180 460)">
            <ellipse cx={-18} cy={0} rx={14} ry={18} fill="#38BDF8" />
            <ellipse cx={18} cy={0} rx={14} ry={18} fill="#38BDF8" />
          </g>

          {/* Cold shadowy claw tapping neck */}
          <path d="M 820 480 Q 900 520 940 540" stroke="#000000" strokeWidth={16} strokeLinecap="round" fill="none" />
          <text x={960} y={720} fill={CRIMSON} fontSize={54} fontWeight="900" textAnchor="middle">
            TAP! TAP! TAP!
          </text>
        </g>
      )}
    </g>
  );
};

/** Chapter 4: The Shadow Rebellion (1162 frames / ~38.7s) */
export const Chapter4: React.FC<{ f: number }> = ({ f }) => {
  // Cuts:
  // Cut 1: f 0-300 (Pip walks left to kitchen, shadow violently drags him right!)
  // Cut 2: f 300-600 (Pip waves politely to window, shadow makes rude mocking gestures)
  // Cut 3: f 600-900 (Shadow stretches 50 feet tall up the wallpaper!)
  // Cut 4: f 900-1162 (Shadow flattens itself and slips under locked door crack!)

  return (
    <g>
      <LivingRoomBg f={f} />

      {f < 300 && (
        <g>
          <ShadowHeader epoch="02:25 • TUG OF WAR" title="SHADOW DRAGS PIP'S FEET!" subtitle="REFUSING ORDERS" f={f} />
          {/* Pip straining left, shadow pulling right */}
          <Hero
            x={920}
            y={800}
            scale={1.1}
            facing={-1}
            pose={makePose({
              torso: { angle: -30, bend: 0 },
              head: { angle: -20 },
              armL: { a: 80, b: 20 },
              armR: { a: 60, b: 20 },
              legL: { a: 40, b: -30 },
              legR: { a: -50, b: 40 },
            })}
            look={PIP}
          />
          <ShadowFaceReaction cx={920} cy={535} type="terrified" f={f} scale={1.2} />

          {/* Shadow anchored at feet pulling violently right */}
          <AutonomousShadowFigure x={1260} y={800} scale={1.2} f={f} pose="standing" facing={1} />
          <path d="M 920 800 Q 1100 820 1260 800" stroke="#05050A" strokeWidth={24} fill="none" />
        </g>
      )}

      {f >= 300 && f < 600 && (
        <g>
          <ShadowHeader epoch="02:38 • TOTAL DISRESPECT" title="THE MOCKING SILHOUETTE" subtitle="INDEPENDENT WILL" f={f} />
          {/* Window on wall */}
          <g transform="translate(400 300)">
            <rect x={0} y={0} width={280} height={360} rx={12} fill="#0284C7" stroke="#E2E8F0" strokeWidth={8} />
            <line x1={140} y1={0} x2={140} y2={360} stroke="#E2E8F0" strokeWidth={6} />
            <line x1={0} y1={180} x2={280} y2={180} stroke="#E2E8F0" strokeWidth={6} />
          </g>

          {/* Pip waving politely */}
          <Hero
            x={540}
            y={800}
            scale={1.1}
            facing={-1}
            pose={makePose({
              torso: { angle: 0, bend: 0 },
              head: { angle: -10 },
              armL: { a: 90, b: 40 + Math.sin(f * 0.3) * 20 }, // Polite wave
              armR: { a: -20, b: 10 },
            })}
            look={PIP}
          />

          {/* Shadow mocking Pip on the right */}
          <AutonomousShadowFigure x={1180} y={800} scale={1.2} f={f} pose="holding_remote" facing={-1} />
        </g>
      )}

      {f >= 600 && f < 900 && (
        <g>
          <ShadowHeader epoch="02:50 • 2D STRETCHING" title="FIFTY FEET TALL!" subtitle="NOT BOUND BY ANATOMY" f={f} />
          {/* Pip looking up tiny in shock */}
          <Hero
            x={480}
            y={800}
            scale={0.9}
            facing={1}
            pose={makePose({
              torso: { angle: -15, bend: 0 },
              head: { angle: -45 }, // Looking straight up
              armL: { a: -40, b: 60 },
              armR: { a: 40, b: 60 },
            })}
            look={PIP}
          />
          <ShadowFaceReaction cx={480} cy={570} type="terrified" f={f} scale={1.0} />

          {/* Giant Stretched Shadow Figure towering up the wall */}
          <AutonomousShadowFigure x={1280} y={800} scale={2.2} f={f} pose="stretching" facing={-1} />
        </g>
      )}

      {f >= 900 && (
        <g>
          <ShadowHeader epoch="03:00 • THE INFILTRATOR" title="SLIPS UNDER LOCKED DOORS!" subtitle="BIOLOGICAL HOSTAGE" f={f} />
          {/* Locked Door on Right */}
          <g transform="translate(1380 340)">
            <rect x={0} y={0} width={260} height={520} rx={8} fill="#78350F" stroke="#451A03" strokeWidth={8} />
            <circle cx={40} cy={260} r={14} fill="#FBBF24" />
            {/* Crack under door with shadow flattening into it */}
            <rect x={-40} y={510} width={340} height={18} fill="#020617" />
          </g>

          {/* Shadow flattening and slithering under the door crack */}
          <path
            d={`M 980 820 Q 1200 810 1420 860`}
            stroke="#05050A"
            strokeWidth={30}
            strokeLinecap="round"
            fill="none"
          />

          {/* Pip running after it in horror */}
          <Hero
            x={740}
            y={800}
            scale={1.1}
            facing={1}
            pose={makePose({
              torso: { angle: 25, bend: 0 },
              head: { angle: 10 },
              armL: { a: 80, b: 0 },
              armR: { a: -60, b: 20 },
              legL: { a: 45, b: -30 },
              legR: { a: -40, b: 35 },
            })}
            look={PIP}
          />
          <ShadowFaceReaction cx={740} cy={540} type="terrified" f={f} scale={1.2} />
        </g>
      )}
    </g>
  );
};

/** Chapter 5: The Physics Nightmare: The Photon Vacuum (1297 frames / ~43.2s) */
export const Chapter5: React.FC<{ f: number }> = ({ f }) => {
  // Cuts:
  // Cut 1: f 0-350 (Physics breakdown: to touch matter, shadow must absorb photons!)
  // Cut 2: f 350-700 (Micro black hole vortex in center absorbing yellow light rays)
  // Cut 3: f 700-1000 (Temperature gauge drops to -40°C, frost covers walls)
  // Cut 4: f 1000-1297 (Pip shivering in winter coat, hypothermia panic!)

  return (
    <g>
      <LivingRoomBg f={f} frost={true} />

      {f < 350 && (
        <g>
          <ShadowHeader epoch="03:10 • THE PARADOX" title="A REAL SHADOW HAS NO MASS" subtitle="CANNOT PUSH OBJECTS" f={f} />
          {/* Scientific Diagram Card */}
          <g transform="translate(300 280)">
            <rect x={0} y={0} width={640} height={380} rx={20} fill="#0F172A" stroke="#38BDF8" strokeWidth={5} />
            <text x={320} y={60} fill="#38BDF8" fontSize={32} fontWeight="900" textAnchor="middle">
              CLASSICAL OPTICS
            </text>
            <text x={320} y={130} fill="#FFFFFF" fontSize={24} textAnchor="middle">
              Shadow = Absence of Light
            </text>
            <text x={320} y={190} fill="#FDE047" fontSize={24} textAnchor="middle">
              Energy = 0 Joules • Momentum = 0
            </text>
            <text x={320} y={260} fill="#EF4444" fontSize={28} fontWeight="900" textAnchor="middle">
              CANNOT LIFT A REMOTE!
            </text>
          </g>

          <Hero
            x={1320}
            y={800}
            scale={1.1}
            facing={-1}
            pose={makePose({
              torso: { angle: 0, bend: 0 },
              head: { angle: 0 },
              armL: { a: 40, b: 30 },
              armR: { a: -40, b: 30 },
            })}
            look={PIP}
          />
          <ShadowFaceReaction cx={1320} cy={530} type="confused" f={f} scale={1.2} />
        </g>
      )}

      {f >= 350 && f < 700 && (
        <g>
          <ShadowHeader epoch="03:25 • PHOTON VACUUM" title="THE MICROSCOPIC BLACK HOLE" subtitle="ABSORBING 100% LIGHT" f={f} />
          {/* Black Hole Photon Vortex in Center */}
          <g transform="translate(960 500)">
            {/* Spinning dark accretion disk */}
            <circle cx={0} cy={0} r={160 + Math.sin(f * 0.2) * 15} fill="#05050A" stroke="#6366F1" strokeWidth={6} />
            <circle cx={0} cy={0} r={110} fill="#000000" />
            {/* Swirling photon rays being sucked into the center */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
              <g key={i} transform={`rotate(${angle + f * 5})`}>
                <line x1={280} y1={0} x2={130} y2={0} stroke="#FDE047" strokeWidth={4} strokeDasharray="12 8" />
              </g>
            ))}
          </g>

          <Hero
            x={420}
            y={800}
            scale={1.05}
            facing={1}
            pose={makePose({
              torso: { angle: -20, bend: 0 },
              head: { angle: 10 },
              armL: { a: -40, b: 80 },
              armR: { a: 40, b: 80 },
            })}
            look={PIP}
          />
          <ShadowFaceReaction cx={420} cy={540} type="terrified" f={f} scale={1.1} />
        </g>
      )}

      {f >= 700 && f < 1000 && (
        <g>
          <ShadowHeader epoch="03:40 • TEMPERATURE DROP" title="THERMODYNAMIC PLUNGE" subtitle="-40°C INSTANT FREEZE" f={f} />
          {/* Giant Digital Thermometer */}
          <g transform="translate(1300 260)">
            <rect x={0} y={0} width={280} height={460} rx={24} fill="#0F172A" stroke="#38BDF8" strokeWidth={6} />
            <text x={140} y={60} fill="#94A3B8" fontSize={24} fontWeight="bold" textAnchor="middle">
              ROOM TEMP
            </text>
            <text x={140} y={160} fill="#38BDF8" fontSize={64} fontWeight="900" textAnchor="middle">
              -40°C
            </text>
            <text x={140} y={230} fill="#EF4444" fontSize={32} fontWeight="900" textAnchor="middle">
              CRITICAL!
            </text>
            {/* Thermometer Tube */}
            <rect x={120} y={270} width={40} height={150} rx={12} fill="#1E293B" />
            <rect x={125} y={380} width={30} height={35} rx={8} fill="#0284C7" />
          </g>

          {/* Pip freezing and teeth chattering */}
          <Hero
            x={640}
            y={800}
            scale={1.15}
            facing={1}
            pose={makePose({
              torso: { angle: 15, bend: 10 },
              head: { angle: -10 },
              armL: { a: 40, b: 110 }, // Hugging chest
              armR: { a: -40, b: 110 },
            })}
            look={PIP}
          />
          <ShadowFaceReaction cx={640} cy={530} type="freezing" f={f} scale={1.2} />
        </g>
      )}

      {f >= 1000 && (
        <g>
          <ShadowHeader epoch="03:55 • HYPOTHERMIA" title="FREEZING TO DEATH!" subtitle="THE SHADOW FEEDS" f={f} />
          {/* Frost vignette heavy */}
          <rect x={0} y={0} width={1920} height={1080} fill="#38BDF8" opacity={0.15} style={{ mixBlendMode: 'color-dodge' }} />

          <Hero
            x={960}
            y={800}
            scale={1.2}
            facing={1}
            pose={makePose({
              torso: { angle: 20, bend: 15 },
              head: { angle: -15 },
              armL: { a: 50, b: 120 },
              armR: { a: -50, b: 120 },
            })}
            look={PIP}
          />
          <ShadowFaceReaction cx={960} cy={520} type="freezing" f={f} scale={1.3} />

          {/* Shadow looming in the icy background */}
          <AutonomousShadowFigure x={1420} y={800} scale={1.3} f={f} pose="standing" facing={-1} />
        </g>
      )}
    </g>
  );
};

/** Chapter 6: The Spotlight Trap & Peace (1465 frames / ~48.8s) */
export const Chapter6: React.FC<{ f: number }> = ({ f }) => {
  // Cuts:
  // Cut 1: f 0-400 (Pip wheels in four 10,000-lumen stadium floodlights!)
  // Cut 2: f 400-800 (360-degree omnidirectional beam: zero shadows exist, shadow trapped!)
  // Cut 3: f 800-1150 (Reconciliation: Pip offers hand, shadow reconnects and high-fives!)
  // Cut 4: f 1150-1465 (Outro: Smash subscribe, bell animation, like button!)

  return (
    <g>
      <LivingRoomBg f={f} />

      {f < 400 && (
        <g>
          <ShadowHeader epoch="04:05 • SCIENTIFIC COUNTER" title="FOUR STADIUM FLOODLIGHTS" subtitle="40,000 LUMENS" f={f} />
          {/* Four Floodlight Towers positioned at corners */}
          <g transform="translate(240 400)">
            <rect x={-20} y={0} width={40} height={400} fill="#475569" />
            <polygon points="-80,0 80,0 50,-80 -50,-80" fill="#F59E0B" />
            <circle cx={0} cy={-40} r={45} fill="#FEF08A" />
          </g>
          <g transform="translate(1680 400)">
            <rect x={-20} y={0} width={40} height={400} fill="#475569" />
            <polygon points="-80,0 80,0 50,-80 -50,-80" fill="#F59E0B" />
            <circle cx={0} cy={-40} r={45} fill="#FEF08A" />
          </g>

          {/* Pip confident with remote power switch */}
          <Hero
            x={740}
            y={800}
            scale={1.1}
            facing={1}
            pose={makePose({
              torso: { angle: 0, bend: 0 },
              head: { angle: 0 },
              armL: { a: -30, b: 20 },
              armR: { a: 80, b: -20 }, // Holding detonator / switch
            })}
            look={PIP}
          />
          <ShadowFaceReaction cx={740} cy={530} type="happy" f={f} scale={1.2} />

          {/* Shadow nervous on the right */}
          <AutonomousShadowFigure x={1260} y={800} scale={1.1} f={f} pose="standing" facing={-1} />
        </g>
      )}

      {f >= 400 && f < 800 && (
        <g>
          <ShadowHeader epoch="04:20 • ZERO DARKNESS" title="360° OMNIDIRECTIONAL BEAM" subtitle="NOWHERE TO HIDE!" f={f} />
          {/* Intense Blinding Light Beams meeting in center */}
          <polygon points="160,200 400,200 1300,900 800,900" fill="url(#coneLight)" opacity={0.45} style={{ mixBlendMode: 'screen' }} />
          <polygon points="1760,200 1520,200 620,900 1120,900" fill="url(#coneLight)" opacity={0.45} style={{ mixBlendMode: 'screen' }} />

          {/* Trapped Shadow Cowering in center halo */}
          <AutonomousShadowFigure x={960} y={800} scale={0.9} f={f} pose="cowering" facing={1} />

          <Hero
            x={520}
            y={800}
            scale={1.1}
            facing={1}
            pose={makePose({
              torso: { angle: 10, bend: 0 },
              head: { angle: -10 },
              armL: { a: -20, b: 20 },
              armR: { a: 40, b: 30 },
            })}
            look={PIP}
          />
          <ShadowFaceReaction cx={520} cy={535} type="happy" f={f} scale={1.1} />
        </g>
      )}

      {f >= 800 && f < 1150 && (
        <g>
          <ShadowHeader epoch="04:35 • RECONCILIATION" title="THE HIGH-FIVE TRUCE" subtitle="CONNECTED AGAIN" f={f} />
          {/* Pip extending hand to shadow */}
          <Hero
            x={820}
            y={800}
            scale={1.15}
            facing={1}
            pose={makePose({
              torso: { angle: 5, bend: 0 },
              head: { angle: 0 },
              armL: { a: -30, b: 20 },
              armR: { a: 90, b: -20 }, // High-five hand
            })}
            look={PIP}
          />
          <ShadowFaceReaction cx={820} cy={520} type="happy" f={f} scale={1.2} />

          {/* Shadow reconnecting at feet and high-fiving Pip */}
          <AutonomousShadowFigure x={1080} y={800} scale={1.15} f={f} pose="high_five" facing={-1} />

          {/* Golden Sparkle Star at High Five Impact */}
          <g transform="translate(950 600)">
            <polygon points="0,-35 10,-10 35,0 10,10 0,35 -10,10 -35,0 -10,-10" fill={GOLD} />
            <circle cx={0} cy={0} r={12} fill="#FFFFFF" />
          </g>
        </g>
      )}

      {f >= 1150 && (
        <g>
          <ShadowHeader epoch="04:45 • SUBSCRIBE & BELL" title="WHAT IF ADVENTURES" subtitle="SMASH SUBSCRIBE!" f={f} />
          {/* Pip & Shadow together waving at the camera */}
          <Hero
            x={760}
            y={800}
            scale={1.2}
            facing={1}
            pose={makePose({
              torso: { angle: 0, bend: 0 },
              head: { angle: 0 },
              armL: { a: -30, b: 30 },
              armR: { a: 90, b: 40 + Math.sin(f * 0.3) * 20 }, // Waving hand
            })}
            look={PIP}
          />
          <ShadowFaceReaction cx={760} cy={515} type="happy" f={f} scale={1.3} />

          {/* Shadow happily waving too */}
          <AutonomousShadowFigure x={1160} y={800} scale={1.2} f={f} pose="standing" facing={-1} />

          {/* Massive Animated YouTube Subscribe Button & Bell Chime */}
          <g transform={`translate(960 ${340 + Math.sin(f * 0.2) * 8})`}>
            {/* Button */}
            <rect x={-220} y={-45} width={440} height={90} rx={45} fill="#EF4444" stroke="#FFFFFF" strokeWidth={5} />
            <text x={-40} y={15} fill="#FFFFFF" fontSize={38} fontWeight="900" textAnchor="middle">
              SUBSCRIBE
            </text>
            {/* Bell Icon */}
            <g transform="translate(130 5) rotate(${Math.sin(f * 0.5) * 20})">
              <path d="M -16 10 C -16 -10 16 -10 16 10 Z" fill="#FBBF24" stroke="#0F172A" strokeWidth={3} />
              <circle cx={0} cy={16} r={6} fill="#FBBF24" />
            </g>
          </g>
        </g>
      )}
    </g>
  );
};

// ========================================================
// 5. LIVING SHADOW MOBILE SHORT (9:16 VERTICAL COMPONENT)
// ========================================================
export const LivingShadowShort: React.FC<{ f: number }> = ({ f }) => {
  // 680 frames total (~22.7s):
  // 0-140f: Remote peels off wall (0-4.6s)
  // 140-280f: Roommate chores & calculus (4.6-9.3s)
  // 280-420f: Multiple lamps = 2 shadows wrestling (9.3-14s)
  // 420-550f: Photon vacuum freezing bedroom to -40°C (14-18.3s)
  // 550-680f: 360° floodlight trap & high five reunion! (18.3-22.7s)

  return (
    <g>
      <LivingRoomBg f={f} frost={f >= 420 && f < 550} />

      {f < 140 && (
        <g>
          <ShadowHeader epoch="PART 1" title="SHADOW MOVES ON ITS OWN!" subtitle="DETACHED" f={f} />
          <Hero
            x={780}
            y={800}
            scale={1.1}
            facing={1}
            pose={makePose({
              torso: { angle: 10, bend: 0 },
              head: { angle: -10 },
              armL: { a: 40, b: 20 },
              armR: { a: 70, b: -20 },
            })}
            look={PIP}
          />
          <ShadowFaceReaction cx={780} cy={535} type="terrified" f={f} scale={1.2} />
          <AutonomousShadowFigure x={1240} y={800} scale={1.15} f={f} pose="holding_remote" facing={-1} />
        </g>
      )}

      {f >= 140 && f < 280 && (
        <g>
          <ShadowHeader epoch="PART 2" title="DOES YOUR HOMEWORK!" subtitle="ULTIMATE ROOMMATE" f={f} />
          <Hero
            x={640}
            y={800}
            scale={1.1}
            facing={1}
            pose={makePose({
              torso: { angle: 15, bend: 10 },
              head: { angle: 0 },
              armL: { a: 40, b: 30 },
              armR: { a: 90, b: -20 },
            })}
            look={PIP}
          />
          <ShadowFaceReaction cx={640} cy={540} type="lazy" f={f} scale={1.1} />
          <AutonomousShadowFigure x={1300} y={800} scale={1.2} f={f} pose="doing_dishes" facing={-1} />
        </g>
      )}

      {f >= 280 && f < 420 && (
        <g>
          <ShadowHeader epoch="PART 3" title="TWO LIGHTS = TWO SHADOWS!" subtitle="ROGUE BRAWL" f={f} />
          <AutonomousShadowFigure x={860} y={800} scale={1.1} f={f} pose="wrestling" facing={1} />
          <AutonomousShadowFigure x={1080} y={800} scale={1.1} f={f} pose="wrestling" facing={-1} />
          <Hero
            x={480}
            y={800}
            scale={1.05}
            facing={1}
            pose={makePose({
              torso: { angle: -20, bend: 0 },
              head: { angle: 10 },
              armL: { a: -60, b: 90 },
              armR: { a: 60, b: 90 },
            })}
            look={PIP}
          />
          <ShadowFaceReaction cx={480} cy={540} type="terrified" f={f} scale={1.2} />
        </g>
      )}

      {f >= 420 && f < 550 && (
        <g>
          <ShadowHeader epoch="PART 4" title="ABSORBS LIGHT = -40°C!" subtitle="PHOTON VACUUM" f={f} />
          <Hero
            x={760}
            y={800}
            scale={1.2}
            facing={1}
            pose={makePose({
              torso: { angle: 20, bend: 15 },
              head: { angle: -15 },
              armL: { a: 50, b: 120 },
              armR: { a: -50, b: 120 },
            })}
            look={PIP}
          />
          <ShadowFaceReaction cx={760} cy={520} type="freezing" f={f} scale={1.3} />
          <AutonomousShadowFigure x={1340} y={800} scale={1.25} f={f} pose="standing" facing={-1} />
        </g>
      )}

      {f >= 550 && (
        <g>
          <ShadowHeader epoch="PART 5" title="THE SPOTLIGHT TRUCE!" subtitle="SMASH SUBSCRIBE!" f={f} />
          <Hero
            x={800}
            y={800}
            scale={1.2}
            facing={1}
            pose={makePose({
              torso: { angle: 5, bend: 0 },
              head: { angle: 0 },
              armL: { a: -30, b: 20 },
              armR: { a: 90, b: -20 },
            })}
            look={PIP}
          />
          <ShadowFaceReaction cx={800} cy={515} type="happy" f={f} scale={1.2} />
          <AutonomousShadowFigure x={1120} y={800} scale={1.2} f={f} pose="high_five" facing={-1} />

          {/* Subscribe Callout */}
          <g transform={`translate(960 ${340 + Math.sin(f * 0.2) * 8})`}>
            <rect x={-200} y={-40} width={400} height={80} rx={40} fill="#EF4444" stroke="#FFFFFF" strokeWidth={4} />
            <text x={0} y={14} fill="#FFFFFF" fontSize={34} fontWeight="900" textAnchor="middle">
              SUBSCRIBE!
            </text>
          </g>
        </g>
      )}
    </g>
  );
};
