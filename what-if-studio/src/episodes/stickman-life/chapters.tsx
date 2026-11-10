import React from 'react';
import { interpolate, spring, staticFile } from 'remotion';

// ========================================================
// 1. ASSET WRAPPER & BACKGROUND IMAGES
// ========================================================
export const BgImage: React.FC<{ name: string; opacity?: number }> = ({ name, opacity = 1 }) => (
  <image
    href={staticFile(`stickman-life/${name}`)}
    x={0}
    y={0}
    width={1920}
    height={1080}
    preserveAspectRatio="xMidYMid slice"
    opacity={opacity}
  />
);

// ========================================================
// 2. KINETIC GLASSMORPHIC HUD BADGE (NEW TYPOGRAPHY STANDARD)
// ========================================================
export const HudBadge: React.FC<{
  category: string;
  headline: string;
  accentColor?: string;
  x?: number;
  y?: number;
  f: number;
}> = ({ category, headline, accentColor = '#F59E0B', x = 60, y = 60, f }) => {
  const pop = spring({ frame: f, fps: 30, config: { damping: 14, stiffness: 220 } });
  const pulse = Math.sin(f * 0.12) * 0.3 + 0.7;

  return (
    <g transform={`translate(${x} ${y}) scale(${pop})`} style={{ transformOrigin: 'top left' }}>
      <rect
        x={0}
        y={0}
        width={580}
        height={96}
        rx={18}
        fill="#0F172A"
        fillOpacity={0.88}
        stroke={accentColor}
        strokeWidth={2}
        strokeOpacity={0.65}
        filter="drop-shadow(0 12px 24px rgba(0,0,0,0.65))"
      />
      <circle cx={28} cy={34} r={6} fill={accentColor} fillOpacity={pulse} />
      <text
        x={48}
        y={38}
        fill={accentColor}
        fontSize="15"
        fontWeight="800"
        letterSpacing="2px"
        fontFamily="Montserrat, sans-serif"
      >
        {category.toUpperCase()}
      </text>
      <text
        x={28}
        y={72}
        fill="#F8FAFC"
        fontSize="22"
        fontWeight="800"
        fontFamily="Plus Jakarta Sans, sans-serif"
      >
        {headline}
      </text>
    </g>
  );
};

// ========================================================
// 3. EXPRESSIVE VECTOR STICKMAN CHARACTERS
// ========================================================

/** Young Arthur (Vibrant, Curious, Agile) */
export const StickArthur: React.FC<{
  x: number;
  y: number;
  f: number;
  action: 'born' | 'walk' | 'jump' | 'sit' | 'reach' | 'hug' | 'kneel' | 'shield' | 'weep' | 'draw';
  scale?: number;
  facing?: 1 | -1;
  fadeOpacity?: number;
}> = ({ x, y, f, action, scale = 1, facing = 1, fadeOpacity = 1 }) => {
  // Jump cycle
  const jumpY = action === 'jump' ? -Math.abs(Math.sin(f * 0.15)) * 90 : 0;
  // Walk cycle
  const legAngle = action === 'walk' ? Math.sin(f * 0.22) * 28 : 0;
  const armAngle = action === 'walk' ? -Math.sin(f * 0.22) * 32 : 0;
  // Breathing
  const breathe = Math.sin(f * 0.08) * 3;

  return (
    <g
      transform={`translate(${x} ${y + jumpY}) scale(${scale * facing} ${scale})`}
      opacity={fadeOpacity}
    >
      {/* Contact Shadow on Floor/Paper Plane */}
      <ellipse
        cx={0}
        cy={10 - jumpY * 0.4}
        rx={action === 'sit' ? 65 : 42}
        ry={action === 'sit' ? 16 : 10}
        fill="#0F172A"
        opacity={action === 'jump' ? 0.15 : 0.32}
      />

      {/* Head */}
      <circle
        cx={action === 'weep' ? 8 : 0}
        cy={action === 'sit' ? -120 + breathe : action === 'kneel' ? -130 + breathe : -210 + breathe}
        r={38}
        fill="#F8FAFC"
        stroke="#1E293B"
        strokeWidth={6}
      />

      {/* Eyes */}
      {action === 'weep' ? (
        // Closed weeping eyes
        <g transform={`translate(${action === 'weep' ? 8 : 0} ${action === 'sit' ? -120 + breathe : action === 'kneel' ? -130 + breathe : -210 + breathe})`}>
          <path d="M -16 -4 Q -10 -12 -4 -4" fill="none" stroke="#1E293B" strokeWidth={4} strokeLinecap="round" />
          <path d="M 6 -4 Q 12 -12 18 -4" fill="none" stroke="#1E293B" strokeWidth={4} strokeLinecap="round" />
          {/* Falling Ink Tear */}
          <circle cx={14} cy={6 + ((f * 4) % 40)} r={4} fill="#38BDF8" opacity={0.85} />
        </g>
      ) : (
        // Open expressive cartoon eyes
        <g transform={`translate(0 ${action === 'sit' ? -120 + breathe : action === 'kneel' ? -130 + breathe : -210 + breathe})`}>
          <ellipse cx={-10} cy={-4} rx={5} ry={7} fill="#1E293B" />
          <ellipse cx={12} cy={-4} rx={5} ry={7} fill="#1E293B" />
          <circle cx={-8} cy={-6} r={2} fill="#FFFFFF" />
          <circle cx={14} cy={-6} r={2} fill="#FFFFFF" />
        </g>
      )}

      {/* Smile / Mouth */}
      <g transform={`translate(0 ${action === 'sit' ? -120 + breathe : action === 'kneel' ? -130 + breathe : -210 + breathe})`}>
        {action === 'jump' || action === 'reach' ? (
          <path d="M -10 12 Q 2 24 14 12" fill="none" stroke="#1E293B" strokeWidth={4} strokeLinecap="round" />
        ) : action === 'shield' ? (
          <ellipse cx={2} cy={14} rx={8} ry={10} fill="#7F1D1D" stroke="#1E293B" strokeWidth={3} />
        ) : action === 'weep' ? (
          <path d="M -8 18 Q 2 10 12 18" fill="none" stroke="#1E293B" strokeWidth={4} strokeLinecap="round" />
        ) : (
          <path d="M -8 14 Q 2 20 12 14" fill="none" stroke="#1E293B" strokeWidth={4} strokeLinecap="round" />
        )}
      </g>

      {/* Body & Limbs depending on Action */}
      {action === 'sit' ? (
        // Sitting on paper hugging knees
        <g stroke="#1E293B" strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" fill="none">
          {/* Spine */}
          <path d="M 0 -82 C 5 -50 0 -20 -15 0" />
          {/* Knees bent up */}
          <path d="M -15 0 L 25 -40 L 45 0" />
          {/* Arms hugging legs */}
          <path d="M -8 -60 L 20 -45 L 35 -20" />
        </g>
      ) : action === 'kneel' || action === 'draw' ? (
        // Kneeling on floor drawing with pencil lead
        <g stroke="#1E293B" strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" fill="none">
          {/* Spine arched */}
          <path d="M 0 -92 C 15 -60 20 -30 0 0" />
          {/* Kneeling Legs */}
          <path d="M 0 0 L -35 0 L -20 0" />
          <path d="M 0 0 L 25 -15 L 45 0" />
          {/* Arms outstretched holding pencil lead */}
          <path d={`M 10 -75 L 50 -45 L ${65 + Math.sin(f * 0.25) * 8} -5`} />
          <path d={`M 10 -75 L 40 -40 L ${60 + Math.sin(f * 0.25) * 8} -5`} />
          {/* Graphite Lead Piece */}
          <polygon
            points={`${65 + Math.sin(f * 0.25) * 8}, -5 ${72 + Math.sin(f * 0.25) * 8}, -14 ${60 + Math.sin(f * 0.25) * 8}, -12`}
            fill="#0F172A"
          />
          {/* Glowing Drawn Branch Sparkles */}
          {action === 'draw' && (
            <circle
              cx={65 + Math.sin(f * 0.25) * 8}
              cy={-5}
              r={12 + (f % 10)}
              fill="#FBBF24"
              opacity={0.65}
            />
          )}
        </g>
      ) : action === 'shield' ? (
        // Shielding Lily with wide arms
        <g stroke="#1E293B" strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" fill="none">
          <line x1={0} y1={-172} x2={0} y2={-80} />
          {/* Wide defensive arms */}
          <path d="M 0 -150 L -75 -130 L -90 -90" />
          <path d="M 0 -150 L 75 -140 L 95 -100" />
          {/* Braced legs */}
          <path d="M 0 -80 L -45 0" />
          <path d="M 0 -80 L 50 0" />
        </g>
      ) : action === 'reach' ? (
        // Reaching hand up to butterfly / sky
        <g stroke="#1E293B" strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" fill="none">
          <line x1={0} y1={-172} x2={0} y2={-80} />
          {/* Left arm reaching high */}
          <path d="M 0 -150 L 45 -210 L 65 -245" />
          {/* Right arm balanced */}
          <path d="M 0 -150 L -35 -115 L -55 -95" />
          {/* Legs */}
          <path d="M 0 -80 L -25 0" />
          <path d="M 0 -80 L 25 0" />
        </g>
      ) : (
        // Standard Standing / Walking / Jumping
        <g stroke="#1E293B" strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" fill="none">
          {/* Spine */}
          <line x1={0} y1={-172} x2={0} y2={-80} />
          {/* Arms with swing */}
          <path d={`M 0 -150 L ${-30 + armAngle} -110 L ${-45 + armAngle * 1.2} -75`} />
          <path d={`M 0 -150 L ${30 - armAngle} -110 L ${45 - armAngle * 1.2} -75`} />
          {/* Legs with swing */}
          <path d={`M 0 -80 L ${-25 - legAngle} -40 L ${-35 - legAngle * 1.3} 0`} />
          <path d={`M 0 -80 L ${25 + legAngle} -40 L ${35 + legAngle * 1.3} 0`} />
        </g>
      )}
    </g>
  );
};

/** Lily (Delicate, Soft Ribbon, Companion) */
export const StickLily: React.FC<{
  x: number;
  y: number;
  f: number;
  action: 'stand' | 'hold' | 'fade';
  scale?: number;
  fadeOpacity?: number;
}> = ({ x, y, f, action, scale = 0.95, fadeOpacity = 1 }) => {
  const breathe = Math.sin(f * 0.09 + 1.2) * 3;

  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} opacity={fadeOpacity}>
      {/* Contact Shadow */}
      <ellipse cx={0} cy={10} rx={38} ry={9} fill="#0F172A" opacity={0.28 * fadeOpacity} />

      {/* Head */}
      <circle cx={0} cy={-200 + breathe} r={35} fill="#FFFBEB" stroke="#1E293B" strokeWidth={5.5} />

      {/* Pink Hair Ribbon */}
      <g transform={`translate(-18 ${-225 + breathe})`}>
        <path d="M 0 0 C -12 -12 -20 0 -5 10 Z" fill="#F43F5E" />
        <path d="M 0 0 C 12 -12 20 0 5 10 Z" fill="#F43F5E" />
        <circle cx={0} cy={0} r={5} fill="#BE123C" />
      </g>

      {/* Blushing Cheeks & Eyes */}
      <circle cx={-18} cy={-190 + breathe} r={5} fill="#FDA4AF" opacity={0.7} />
      <circle cx={18} cy={-190 + breathe} r={5} fill="#FDA4AF" opacity={0.7} />
      <ellipse cx={-10} cy={-200 + breathe} rx={4.5} ry={6} fill="#1E293B" />
      <ellipse cx={10} cy={-200 + breathe} rx={4.5} ry={6} fill="#1E293B" />
      <circle cx={-8} cy={-202 + breathe} r={1.8} fill="#FFFFFF" />
      <circle cx={12} cy={-202 + breathe} r={1.8} fill="#FFFFFF" />

      {/* Smile */}
      <path d="M -8 -184 Q 0 -176 8 -184" fill="none" stroke="#1E293B" strokeWidth={3.5} strokeLinecap="round" />

      {/* Body & Dress Contour */}
      <g stroke="#1E293B" strokeWidth={5.5} strokeLinecap="round" strokeLinejoin="round" fill="none">
        <line x1={0} y1={-165} x2={0} y2={-80} />
        {/* Soft A-line skirt contour */}
        <path d="M -15 -80 L 15 -80 L 28 -35 L -28 -35 Z" fill="#FEF3C7" stroke="#1E293B" strokeWidth={4} />
        {/* Legs */}
        <line x1={-12} y1={-35} x2={-12} y2={0} />
        <line x1={12} y1={-35} x2={12} y2={0} />
        {/* Arms */}
        {action === 'hold' ? (
          <path d="M 0 -145 L -35 -115 L -55 -110" />
        ) : (
          <path d="M 0 -145 L -25 -110 L -35 -85" />
        )}
        <path d="M 0 -145 L 25 -110 L 35 -85" />
      </g>

      {/* Disintegrating Graphite Dust Particles if Fading */}
      {action === 'fade' && (
        <g>
          {Array.from({ length: 18 }).map((_, i) => {
            const seed = (i * 47) % 100;
            const px = (seed - 50) * 2;
            const py = -200 + ((f * 3 + seed * 8) % 220);
            return (
              <circle
                key={i}
                cx={px}
                cy={py}
                r={2 + (i % 3)}
                fill="#475569"
                opacity={Math.max(0, 1 - py / 50)}
              />
            );
          })}
        </g>
      )}
    </g>
  );
};

/** Elderly Arthur (Hunched, Cane, Frail, Wise) */
export const StickElderly: React.FC<{
  x: number;
  y: number;
  f: number;
  scale?: number;
}> = ({ x, y, f, scale = 0.95 }) => {
  const walkStep = Math.sin(f * 0.12) * 12;

  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      {/* Contact Shadow */}
      <ellipse cx={0} cy={10} rx={48} ry={11} fill="#0F172A" opacity={0.3} />

      {/* Arched Spine & Hunched Head */}
      <g stroke="#334155" strokeWidth={5.5} strokeLinecap="round" strokeLinejoin="round" fill="none">
        {/* Arched back */}
        <path d="M 0 -80 C 10 -115 15 -145 -15 -165" />
        {/* Slow trembling legs */}
        <path d={`M 0 -80 L ${-15 + walkStep} -40 L ${-20 + walkStep} 0`} />
        <path d={`M 0 -80 L ${15 - walkStep} -40 L ${20 - walkStep} 0`} />
        {/* Left arm holding cane */}
        <path d="M -8 -140 L 25 -110 L 35 -85" />
        {/* Wooden Walking Cane */}
        <path d="M 35 -95 C 45 -115 55 -110 50 -95 L 45 0" stroke="#78350F" strokeWidth={6} />
      </g>

      {/* Hunched Head */}
      <circle cx={-25} cy={-185} r={32} fill="#F8FAFC" stroke="#334155" strokeWidth={5.5} />
      {/* Gentle Tired Eyes */}
      <path d="M -36 -188 Q -30 -194 -24 -188" fill="none" stroke="#334155" strokeWidth={3.5} strokeLinecap="round" />
      <path d="M -18 -188 Q -12 -194 -6 -188" fill="none" stroke="#334155" strokeWidth={3.5} strokeLinecap="round" />
      <path d="M -26 -174 Q -20 -170 -14 -174" fill="none" stroke="#334155" strokeWidth={3} strokeLinecap="round" />
    </g>
  );
};

/** Glowing Love Heart */
export const GlowingHeart: React.FC<{ cx: number; cy: number; f: number; scale?: number }> = ({
  cx,
  cy,
  f,
  scale = 1,
}) => {
  const pulse = Math.sin(f * 0.18) * 0.12 + 1.0;
  return (
    <g transform={`translate(${cx} ${cy}) scale(${scale * pulse})`}>
      <defs>
        <radialGradient id="heartGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#EF4444" stopOpacity="0.8" />
          <stop offset="60%" stopColor="#F59E0B" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#EF4444" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx={0} cy={0} r={48} fill="url(#heartGlow)" />
      <path
        d="M 0 -12 C -18 -42 -55 -12 0 42 C 55 -12 18 -42 0 -12 Z"
        fill="#EF4444"
        stroke="#FDE047"
        strokeWidth={3}
      />
    </g>
  );
};

// ========================================================
// 4. CHAPTER 1: THE FIRST STROKE (36s / 1084 frames)
// ========================================================
export const Chapter1: React.FC<{ f: number }> = ({ f }) => {
  // Pacing: 4 distinct beats
  // Beat 1 (0-240): Pencil drawing birth
  // Beat 2 (240-520): First wobbly steps & jump
  // Beat 3 (520-800): Butterfly chase & landing
  // Beat 4 (800-1084): Solitary sitting & longing

  const beat = f < 240 ? 1 : f < 520 ? 2 : f < 800 ? 3 : 4;
  const pencilY = interpolate(f, [0, 140], [-100, 520], { extrapolateRight: 'clamp' });

  return (
    <g>
      {/* Background: Artist Desk with Sketchbook */}
      <BgImage name="bg_desk.jpg" />

      {/* Desk Lamp Ambient Glow Overlay */}
      <circle cx={350} cy={180} r={550} fill="#F59E0B" opacity={0.12} />

      {beat === 1 && (
        <g>
          {/* Animated Hand/Pencil drawing the stickman */}
          {f < 160 && (
            <g transform={`translate(960 ${pencilY})`}>
              <rect x={-8} y={-350} width={16} height={320} fill="#F59E0B" rx={4} />
              <polygon points="-8,-30 8,-30 0,0" fill="#D97706" />
              <polygon points="-3,-10 3,-10 0,0" fill="#0F172A" />
              {/* Drawing spark */}
              <circle cx={0} cy={0} r={10 + (f % 8)} fill="#FBBF24" opacity={0.7} />
            </g>
          )}
          {/* Stickman progressively appearing */}
          <StickArthur
            x={960}
            y={760}
            f={f}
            action="born"
            scale={0.95}
            fadeOpacity={Math.min(1, f / 90)}
          />
          <HudBadge
            category="The Origin"
            headline="BORN FROM A SINGLE GRAPHITE STROKE"
            accentColor="#F59E0B"
            f={f}
          />
        </g>
      )}

      {beat === 2 && (
        <g>
          {/* Walking & Joyful Jumping across the desk sketchbook */}
          <StickArthur
            x={interpolate(f, [240, 520], [600, 1150])}
            y={760}
            f={f}
            action={f > 380 && f < 480 ? 'jump' : 'walk'}
            scale={0.95}
          />
          <HudBadge
            category="Curiosity"
            headline="A BLANK PAGE AS AN ENDLESS UNIVERSE"
            accentColor="#38BDF8"
            f={f - 240}
          />
        </g>
      )}

      {beat === 3 && (
        <g>
          {/* Butterfly fluttering across the screen */}
          {(() => {
            const bX = 960 + Math.sin(f * 0.08) * 180;
            const bY = 480 + Math.cos(f * 0.1) * 70;
            const flap = Math.sin(f * 0.45) * 12;
            return (
              <g transform={`translate(${bX} ${bY})`}>
                {/* Wings */}
                <ellipse cx={-12} cy={-10} rx={16} ry={12 + flap} fill="#F43F5E" />
                <ellipse cx={12} cy={-10} rx={16} ry={12 + flap} fill="#FB7185" />
                <ellipse cx={-8} cy={8} rx={10} ry={8 + flap} fill="#F59E0B" />
                <ellipse cx={8} cy={8} rx={10} ry={8 + flap} fill="#FBBF24" />
                {/* Body */}
                <line x1={0} y1={-18} x2={0} y2={18} stroke="#0F172A" strokeWidth={3} />
              </g>
            );
          })()}
          <StickArthur x={820} y={760} f={f} action="reach" scale={0.95} />
          <HudBadge
            category="Wonder"
            headline="JOY DOES NOT REQUIRE COLOR"
            accentColor="#10B981"
            f={f - 520}
          />
        </g>
      )}

      {beat === 4 && (
        <g>
          {/* Solitary sitting at the edge of the sketchbook */}
          <StickArthur x={1200} y={780} f={f} action="sit" scale={0.95} />
          <HudBadge
            category="Longing"
            headline="A SOLITARY LINE LONGS FOR ANOTHER"
            accentColor="#F59E0B"
            f={f - 800}
          />
        </g>
      )}
    </g>
  );
};

// ========================================================
// 5. CHAPTER 2: THE TWO LINES (31.7s / 952 frames)
// ========================================================
export const Chapter2: React.FC<{ f: number }> = ({ f }) => {
  const beat = f < 250 ? 1 : f < 520 ? 2 : f < 740 ? 3 : 4;

  return (
    <g>
      {/* Background: Sunset Hill (Beats 1 & 2), Starry Sky (Beat 3), Darkening (Beat 4) */}
      {beat < 3 ? (
        <BgImage name="bg_sunset.jpg" />
      ) : (
        <BgImage name="bg_starry.jpg" />
      )}

      {beat === 1 && (
        <g>
          {/* Arthur watching Lily being drawn */}
          <StickArthur x={750} y={780} f={f} action="walk" scale={0.95} facing={1} />
          <StickLily
            x={1080}
            y={780}
            f={f}
            action="stand"
            scale={0.95}
            fadeOpacity={Math.min(1, f / 90)}
          />
          <HudBadge
            category="The Companion"
            headline="AND THEN... A SECOND LINE APPEARED"
            accentColor="#F43F5E"
            f={f}
          />
        </g>
      )}

      {beat === 2 && (
        <g>
          {/* Walking together & sharing the glowing heart */}
          <StickArthur x={820} y={780} f={f} action="walk" scale={0.95} facing={1} />
          <StickLily x={980} y={780} f={f} action="stand" scale={0.95} />
          <GlowingHeart cx={900} cy={600} f={f} scale={0.8} />
          <HudBadge
            category="Love"
            headline="SUDDENLY, THE PAGE HAD WARMTH"
            accentColor="#EF4444"
            f={f - 250}
          />
        </g>
      )}

      {beat === 3 && (
        <g>
          {/* Starry night dancing */}
          <StickArthur
            x={860 + Math.sin(f * 0.12) * 40}
            y={780}
            f={f}
            action="walk"
            scale={0.95}
          />
          <StickLily
            x={1020 - Math.sin(f * 0.12) * 40}
            y={780}
            f={f}
            action="stand"
            scale={0.95}
          />
          <GlowingHeart cx={940} cy={560} f={f} scale={1.0} />
          <HudBadge
            category="Devotion"
            headline="PROMISING NO STORM COULD TEAR THEM APART"
            accentColor="#FBBF24"
            f={f - 520}
          />
        </g>
      )}

      {beat === 4 && (
        <g>
          {/* Darkening horizon, wind blowing */}
          <rect x={0} y={0} width={1920} height={1080} fill="#0F172A" opacity={0.35} />
          <StickArthur x={880} y={780} f={f} action="walk" scale={0.95} />
          <StickLily x={1000} y={780} f={f} action="stand" scale={0.95} />
          <HudBadge
            category="Foreshadowing"
            headline="BUT PAPER IS FRAGILE... AND TIME HAS FRICTION"
            accentColor="#E2E8F0"
            f={f - 740}
          />
        </g>
      )}
    </g>
  );
};

// ========================================================
// 6. CHAPTER 3: THE ERASER (37.6s / 1128 frames)
// ========================================================
export const Chapter3: React.FC<{ f: number }> = ({ f }) => {
  const beat = f < 260 ? 1 : f < 550 ? 2 : f < 820 ? 3 : 4;

  // Eraser movement
  const eraserY = interpolate(f, [0, 320], [-250, 480], { extrapolateRight: 'clamp' });
  const eraserShake = Math.sin(f * 0.45) * 15;

  return (
    <g>
      {/* Background: Rainy gray desk canvas */}
      <BgImage name="bg_desk.jpg" opacity={0.45} />
      {/* Dark gray paper tint */}
      <rect x={0} y={0} width={1920} height={1080} fill="#1E293B" opacity={0.65} />

      {beat === 1 && (
        <g>
          {/* Looming giant rubber eraser descending */}
          <g transform={`translate(${1100 + eraserShake} ${eraserY}) rotate(-18)`}>
            {/* Rubber block */}
            <rect x={-90} y={-220} width={180} height={280} rx={14} fill="#F43F5E" />
            {/* Cardboard sleeve */}
            <rect x={-92} y={-230} width={184} height={140} rx={6} fill="#1E40AF" />
            <text x={-60} y={-160} fill="#FFFFFF" fontSize="26" fontWeight="bold">
              ERASER
            </text>
            {/* Smudge trail */}
            <ellipse cx={0} cy={70} rx={80} ry={20} fill="#0F172A" opacity={0.3} />
          </g>

          {/* Arthur shielding Lily */}
          <StickArthur x={820} y={780} f={f} action="shield" scale={1.0} />
          <StickLily x={720} y={780} f={f} action="stand" scale={0.95} />

          <HudBadge
            category="The Inevitable"
            headline="THE ERASER: COLD, MERCILESS, AND BLIND TO LOVE"
            accentColor="#EF4444"
            f={f}
          />
        </g>
      )}

      {beat === 2 && (
        <g>
          {/* Eraser rubbing friction & Lily beginning to smudge */}
          <g transform={`translate(${1020 + eraserShake} 520) rotate(-15)`}>
            <rect x={-80} y={-200} width={160} height={250} rx={12} fill="#F43F5E" />
            <rect x={-82} y={-210} width={164} height={120} rx={4} fill="#1E40AF" />
          </g>
          {/* Smudge cloud */}
          <circle cx={1000} cy={700} r={110} fill="#475569" opacity={0.35} />

          <StickArthur x={780} y={780} f={f} action="shield" scale={1.0} />
          <StickLily
            x={920}
            y={780}
            f={f}
            action="fade"
            scale={0.95}
            fadeOpacity={interpolate(f, [260, 550], [1, 0.45])}
          />

          <HudBadge
            category="The Struggle"
            headline="BEGGING THE SKY TO TAKE HIM INSTEAD"
            accentColor="#F59E0B"
            f={f - 260}
          />
        </g>
      )}

      {beat === 3 && (
        <g>
          {/* Heartbreaking Goodbye: Lily presses heart into Arthur's chest */}
          <StickArthur x={840} y={780} f={f} action="reach" scale={1.0} facing={1} />
          <StickLily
            x={980}
            y={780}
            f={f}
            action="fade"
            scale={0.95}
            fadeOpacity={interpolate(f, [550, 780], [0.45, 0.05], { extrapolateRight: 'clamp' })}
          />
          {/* Glowing heart transferring */}
          <GlowingHeart cx={880} cy={640} f={f} scale={0.9} />

          <HudBadge
            category="Heartbreak"
            headline="HER HAND FADED WITH A QUIET, LOVING SMILE"
            accentColor="#EF4444"
            f={f - 550}
          />
        </g>
      )}

      {beat === 4 && (
        <g>
          {/* Arthur collapses to his knees, weeping ink tears */}
          <StickArthur x={960} y={800} f={f} action="weep" scale={1.0} />
          <GlowingHeart cx={960} cy={680} f={f} scale={0.7} />

          {/* Smudged empty space where Lily once stood */}
          <ellipse cx={1120} cy={780} rx={60} ry={15} fill="#475569" opacity={0.2} />

          <HudBadge
            category="Grief"
            headline="AN ACHE THAT NO PENCIL COULD EVER FIX"
            accentColor="#64748B"
            f={f - 820}
          />
        </g>
      )}
    </g>
  );
};

// ========================================================
// 7. CHAPTER 4: THE WEARY LINE (36.8s / 1104 frames)
// ========================================================
export const Chapter4: React.FC<{ f: number }> = ({ f }) => {
  const beat = f < 280 ? 1 : f < 580 ? 2 : f < 840 ? 3 : 4;

  return (
    <g>
      {/* Cold Rainy Atmosphere */}
      <BgImage name="bg_desk.jpg" opacity={0.35} />
      <rect x={0} y={0} width={1920} height={1080} fill="#090D16" opacity={0.72} />

      {/* Animated Falling Rain Streaks */}
      {Array.from({ length: 45 }).map((_, i) => {
        const rx = ((i * 43) % 1920);
        const ry = ((f * 18 + i * 85) % 1200) - 100;
        return (
          <line
            key={i}
            x1={rx}
            y1={ry}
            x2={rx - 15}
            y2={ry + 45}
            stroke="#94A3B8"
            strokeWidth={1.5}
            opacity={0.35}
          />
        );
      })}

      {beat === 1 && (
        <g>
          {/* Elderly Arthur walking slowly with cane */}
          <StickElderly
            x={interpolate(f, [0, 280], [700, 920])}
            y={780}
            f={f}
            scale={0.95}
          />
          <HudBadge
            category="The Weight of Years"
            headline="BOLD LINES THINNED INTO FRAIL, FADING GRAY"
            accentColor="#94A3B8"
            f={f}
          />
        </g>
      )}

      {beat === 2 && (
        <g>
          {/* Rain soaking the paper, ink bleeding */}
          <ellipse cx={960} cy={790} rx={160} ry={25} fill="#334155" opacity={0.45} />
          <StickElderly x={960} y={780} f={f} scale={0.95} />
          <HudBadge
            category="The Final Element"
            headline="WATER: THE ULTIMATE END OF INK"
            accentColor="#38BDF8"
            f={f - 280}
          />
        </g>
      )}

      {beat === 3 && (
        <g>
          {/* Sinking to knee, ready to surrender */}
          <StickArthur x={960} y={810} f={f} action="kneel" scale={0.95} />
          <HudBadge
            category="Surrender"
            headline="SO TIRED... READY TO LET THE WATER WASH HIM AWAY"
            accentColor="#64748B"
            f={f - 580}
          />
        </g>
      )}

      {beat === 4 && (
        <g>
          {/* Discovering the broken piece of pencil lead */}
          <StickArthur x={960} y={810} f={f} action="kneel" scale={0.95} />

          {/* The Broken Graphite Lead lying in the wet paper */}
          <g transform="translate(1030 805)">
            <polygon points="0,0 12,-16 -6,-14" fill="#0F172A" />
            <circle cx={4} cy={-8} r={14 + Math.sin(f * 0.2) * 4} fill="#FBBF24" opacity={0.65} />
          </g>

          <HudBadge
            category="A Spark of Hope"
            headline="A FORGOTTEN, BROKEN PIECE OF PENCIL LEAD"
            accentColor="#FBBF24"
            f={f - 840}
          />
        </g>
      )}
    </g>
  );
};

// ========================================================
// 8. CHAPTER 5: THE FINAL MASTERPIECE (52.6s / 1577 frames)
// ========================================================
export const Chapter5: React.FC<{ f: number }> = ({ f }) => {
  const beat = f < 300 ? 1 : f < 750 ? 2 : f < 1150 ? 3 : f < 1400 ? 4 : 5;

  return (
    <g>
      {/* Background: Radiant Cherry Blossom Tree on Hill */}
      <BgImage name="bg_blossom.jpg" />

      {/* Floating Cherry Blossom Petals */}
      {Array.from({ length: 30 }).map((_, i) => {
        const px = ((i * 67 + f * 1.5) % 1920);
        const py = ((f * 2.5 + i * 55) % 1080);
        return (
          <ellipse
            key={i}
            cx={px}
            cy={py}
            rx={7}
            ry={4}
            fill="#FDA4AF"
            opacity={0.7}
            transform={`rotate(${f + i * 20} ${px} ${py})`}
          />
        );
      })}

      {beat === 1 && (
        <g>
          {/* Arthur lifting the broken lead with resolve */}
          <StickArthur x={960} y={800} f={f} action="draw" scale={0.95} />
          <HudBadge
            category="The Decision"
            headline="HE DID NOT SAVE HIMSELF. HE KNELT TO DRAW."
            accentColor="#F59E0B"
            f={f}
          />
        </g>
      )}

      {beat === 2 && (
        <g>
          {/* Drawing the massive sheltering tree branches */}
          <StickArthur x={960} y={800} f={f} action="draw" scale={0.95} />
          <HudBadge
            category="The Masterpiece"
            headline="POURING ALL THE LOVE AND SORROW INTO THE PAGE"
            accentColor="#EC4899"
            f={f - 300}
          />
        </g>
      )}

      {beat === 3 && (
        <g>
          {/* Arthur watching the newborn stick child under the sheltering tree */}
          <StickArthur
            x={820}
            y={800}
            f={f}
            action="kneel"
            scale={0.95}
            fadeOpacity={interpolate(f, [750, 1150], [1, 0.6])}
          />

          {/* Newborn Stick Child sitting on grass gazing up */}
          <StickArthur x={1080} y={800} f={f} action="sit" scale={0.55} facing={-1} />

          <HudBadge
            category="The Legacy"
            headline="A CHILD OF HOPE, SHELTERED BENEATH HIS LOVE"
            accentColor="#10B981"
            f={f - 750}
          />
        </g>
      )}

      {beat === 4 && (
        <g>
          {/* Arthur dissolving into golden particles to rejoin Lily */}
          <StickArthur
            x={820}
            y={800}
            f={f}
            action="reach"
            scale={0.95}
            fadeOpacity={interpolate(f, [1150, 1400], [0.6, 0.0])}
          />
          {/* Golden Dispersal motes */}
          {Array.from({ length: 24 }).map((_, i) => {
            const mx = 820 + (Math.sin(i * 1.5) * 80);
            const my = 750 - ((f - 1150) * 2 + i * 15);
            return (
              <circle
                key={i}
                cx={mx}
                cy={my}
                r={3 + (i % 4)}
                fill="#FBBF24"
                opacity={Math.max(0, 1 - (f - 1150) / 250)}
              />
            );
          })}

          {/* Stick Child catching petal */}
          <StickArthur x={1080} y={800} f={f} action="reach" scale={0.55} facing={-1} />

          <HudBadge
            category="Reunion"
            headline="DISPERSING PEACEFULLY INTO THE GOLDEN LIGHT"
            accentColor="#FBBF24"
            f={f - 1150}
          />
        </g>
      )}

      {beat === 5 && (
        <g>
          {/* Final Cinematic Pull-Back: The Sheltered Child & Majestic Message */}
          <StickArthur x={960} y={800} f={f} action="walk" scale={0.6} />

          {/* Grand Philosophy HUD Badge */}
          <g transform="translate(460 220)">
            <rect
              x={0}
              y={0}
              width={1000}
              height={140}
              rx={24}
              fill="#0F172A"
              fillOpacity={0.92}
              stroke="#F59E0B"
              strokeWidth={2.5}
              filter="drop-shadow(0 16px 36px rgba(0,0,0,0.8))"
            />
            <text
              x={500}
              y={52}
              textAnchor="middle"
              fill="#FBBF24"
              fontSize="24"
              fontWeight="800"
              letterSpacing="3px"
              fontFamily="Montserrat, sans-serif"
            >
              THE LIFE OF A STICKMAN
            </text>
            <text
              x={500}
              y={98}
              textAnchor="middle"
              fill="#F8FAFC"
              fontSize="26"
              fontWeight="700"
              fontFamily="Plus Jakarta Sans, sans-serif"
            >
              “Lines may fade... but the shade you drew lasts forever.”
            </text>
          </g>
        </g>
      )}
    </g>
  );
};

// ========================================================
// 9. MOBILE SHORT (1042 frames / 34.7s)
// ========================================================
export const StickmanLifeShort: React.FC<{ f: number }> = ({ f }) => {
  // Pacing:
  // 0-220: Birth on Desk
  // 220-450: Love with Lily & Glowing Heart
  // 450-700: Eraser & Heartbreak
  // 700-1042: Kneeling, Blooming Tree & Legacy

  return (
    <g>
      {f < 220 ? (
        <Chapter1 f={f} />
      ) : f < 450 ? (
        <Chapter2 f={f - 220} />
      ) : f < 700 ? (
        <Chapter3 f={f - 450} />
      ) : (
        <Chapter5 f={f - 700} />
      )}
    </g>
  );
};

