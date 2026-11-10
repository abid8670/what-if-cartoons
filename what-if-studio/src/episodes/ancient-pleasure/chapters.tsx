import React from 'react';
import {
  Hero, basePose, walkPose, clamp, LOOKS,
} from '../../engine';

const MO = LOOKS.mo;
const PIP = LOOKS.pipHood;
const GOLD = '#FBBF24';
const CYAN = '#38BDF8';
const CRIMSON = '#EF4444';
const AMBER = '#D97706';

// ========================================================
// 1. REUSABLE ANIMATED FACIAL EXPRESSION OVERLAYS ("SLIME & EXPRESSIONS")
// ========================================================
export const FaceReaction: React.FC<{
  cx: number;
  cy: number;
  type: 'panic' | 'burnout' | 'happy' | 'dizzy' | 'smug' | 'angry' | 'awe' | 'romantic';
  f: number;
  scale?: number;
}> = ({ cx, cy, type, f, scale = 1 }) => {
  return (
    <g transform={`translate(${cx} ${cy}) scale(${scale})`}>
      {/* 1. PANIC (Screaming, sweating, terror) */}
      {type === 'panic' && (
        <g>
          {/* Flying sweat drops */}
          <circle cx={-40} cy={-25 - (f % 25)} r={6} fill="#38BDF8" />
          <circle cx={40} cy={-20 - (f % 20)} r={5} fill="#38BDF8" />
          <circle cx={-25} cy={-45 - (f % 30)} r={4} fill="#38BDF8" />
          {/* Shivering teeth / wide open mouth */}
          <ellipse cx={0} cy={8} rx={16} ry={22} fill="#7F1D1D" stroke="#0F172A" strokeWidth={3} />
          <rect x={-10} y={-4} width={20} height={8} fill="#FFFFFF" rx={2} />
        </g>
      )}

      {/* 2. BURNOUT (Tired, drooping, dizzy swirls) */}
      {type === 'burnout' && (
        <g>
          {/* Exhaustion steam cloud / sweat */}
          <circle cx={35} cy={-25} r={7} fill="#94A3B8" opacity={0.7} />
          <path d="M -20 -15 Q 0 -5 20 -15" stroke="#475569" strokeWidth={4} fill="none" />
          {/* Spiral exhaustion above head */}
          <g transform={`translate(0 -55) rotate(${f * 10})`}>
            <circle cx={0} cy={0} r={14} fill="none" stroke="#F59E0B" strokeWidth={3} strokeDasharray="6 4" />
          </g>
        </g>
      )}

      {/* 3. HAPPY (Rosy cheeks, wide joyful smile) */}
      {type === 'happy' && (
        <g>
          <ellipse cx={-24} cy={4} rx={10} ry={6} fill="#F43F5E" opacity={0.8} />
          <ellipse cx={24} cy={4} rx={10} ry={6} fill="#F43F5E" opacity={0.8} />
          <path d="M -18 8 Q 0 26 18 8 Z" fill="#DC2626" stroke="#0F172A" strokeWidth={3} />
        </g>
      )}

      {/* 4. DIZZY (Rotating spiral eyes & wobbly smile) */}
      {type === 'dizzy' && (
        <g>
          {/* Pink flushed drunk cheeks */}
          <ellipse cx={-26} cy={0} rx={12} ry={7} fill="#FB7185" />
          <ellipse cx={26} cy={0} rx={12} ry={7} fill="#FB7185" />
          {/* Rotating spiral pupils */}
          {[-18, 18].map((ex) => (
            <g key={ex} transform={`translate(${ex} -12) rotate(${f * 15})`}>
              <circle cx={0} cy={0} r={12} fill="#FEF08A" stroke="#0F172A" strokeWidth={2} />
              <path d="M 0 0 Q 5 -5 8 0 T 0 8 T -8 0" stroke="#7C3AED" strokeWidth={3} fill="none" />
            </g>
          ))}
          <path d="M -16 14 Q -5 8 0 16 T 16 12" stroke="#0F172A" strokeWidth={4} fill="none" />
        </g>
      )}

      {/* 5. SMUG (Mischievous grin, raised brow) */}
      {type === 'smug' && (
        <g>
          <path d="M -15 8 Q 5 18 20 6" stroke="#0F172A" strokeWidth={4} strokeLinecap="round" fill="none" />
          <path d="M 10 -22 Q 18 -28 26 -22" stroke="#0F172A" strokeWidth={3} fill="none" />
        </g>
      )}

      {/* 6. ANGRY (Steaming ears, red rage aura) */}
      {type === 'angry' && (
        <g>
          {/* Steam puffs from ears */}
          <circle cx={-40} cy={-10 - (f % 15)} r={8 + (f % 6)} fill="#EF4444" opacity={0.65} />
          <circle cx={40} cy={-10 - (f % 15)} r={8 + (f % 6)} fill="#EF4444" opacity={0.65} />
          {/* Angled rage eyebrows */}
          <line x1={-25} y1={-22} x2={-6} y2={-12} stroke="#7F1D1D" strokeWidth={5} strokeLinecap="round" />
          <line x1={25} y1={-22} x2={6} y2={-12} stroke="#7F1D1D" strokeWidth={5} strokeLinecap="round" />
          {/* Clenched teeth */}
          <rect x={-14} y={6} width={28} height={12} rx={3} fill="#FFFFFF" stroke="#0F172A" strokeWidth={3} />
          <line x1={0} y1={6} x2={0} y2={18} stroke="#0F172A" strokeWidth={2} />
        </g>
      )}

      {/* 7. AWE (Sparkling star eyes, mouth open in amazement) */}
      {type === 'awe' && (
        <g>
          {/* Star eyes */}
          {[-18, 18].map((ex) => (
            <text key={ex} x={ex} y={-5} fontSize={22} textAnchor="middle" fill="#FDE047">
              ✨
            </text>
          ))}
          <circle cx={0} cy={12} r={10} fill="#7F1D1D" stroke="#0F172A" strokeWidth={3} />
        </g>
      )}

      {/* 8. ROMANTIC (Heart eyes, blushing cheeks) */}
      {type === 'romantic' && (
        <g>
          <ellipse cx={-24} cy={6} rx={12} ry={7} fill="#FB7185" />
          <ellipse cx={24} cy={6} rx={12} ry={7} fill="#FB7185" />
          {[-18, 18].map((ex) => (
            <text key={ex} x={ex} y={-6} fontSize={22} textAnchor="middle" fill="#E11D48">
              ❤️
            </text>
          ))}
          <path d="M -12 12 Q 0 22 12 12" stroke="#E11D48" strokeWidth={4} strokeLinecap="round" fill="none" />
        </g>
      )}
    </g>
  );
};

// ========================================================
// 2. DYNAMIC STORYBOARD BACKGROUNDS (Tailored to each scene context!)
// ========================================================

// A. Cold Ice Age Blizzard (Heavy falling snow, icy glacier peaks, frost ground)
export const ColdBlizzardBg: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <rect x={0} y={0} width={1920} height={1080} fill="#0F172A" />
    {/* Jagged icy mountains with snow highlights */}
    <polygon points="0,520 280,240 600,460 950,180 1350,420 1700,210 1920,490 1920,780 0,780" fill="#1E293B" />
    <polygon points="280,240 330,320 230,320" fill="#E2E8F0" opacity={0.85} />
    <polygon points="950,180 1010,280 890,280" fill="#E2E8F0" opacity={0.85} />
    <polygon points="1700,210 1760,300 1640,300" fill="#E2E8F0" opacity={0.85} />
    
    {/* Frozen ground tundra */}
    <rect x={0} y={750} width={1920} height={330} fill="#CBD5E1" />
    <rect x={0} y={750} width={1920} height={20} fill="#94A3B8" />

    {/* 25 Dynamic swirling snowflakes */}
    {[...Array(25)].map((_, i) => {
      const sx = (i * 78 + f * 14) % 1920;
      const sy = (i * 44 + f * 9) % 1080;
      const r = 3 + (i % 4);
      return <circle key={i} cx={sx} cy={sy} r={r} fill="#F8FAFC" opacity={0.75} />;
    })}
    {/* Pale Ice Age Sun */}
    <circle cx={1680} cy={160} r={80} fill="#F1F5F9" opacity={0.5} />
  </g>
);

// B. Modern Office Cubicle (Fluorescent lights, clock, cubicle walls, desk)
export const ModernOfficeBg: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <rect x={0} y={0} width={1920} height={1080} fill="#1E293B" />
    {/* Fluorescent ceiling light panels with glow */}
    {[350, 960, 1570].map((lx) => (
      <g key={lx}>
        <rect x={lx - 120} y={0} width={240} height={30} fill="#F8FAFC" />
        <polygon points={`${lx-120},30 ${lx+120},30 ${lx+220},400 ${lx-220},400`} fill="#F8FAFC" opacity={0.06} />
      </g>
    ))}
    {/* Cubicle walls */}
    <rect x={120} y={280} width={1680} height={500} fill="#334155" stroke="#475569" strokeWidth={6} rx={12} />
    <line x1={960} y1={280} x2={960} y2={780} stroke="#475569" strokeWidth={8} />

    {/* Wall Clock Ticking */}
    <g transform="translate(960 180)">
      <circle cx={0} cy={0} r={55} fill="#F8FAFC" stroke="#0F172A" strokeWidth={5} />
      <line x1={0} y1={0} x2={0} y2={-32} stroke="#0F172A" strokeWidth={4} strokeLinecap="round" />
      <line x1={0} y1={0} x2={22} y2={0} stroke="#EF4444" strokeWidth={3} strokeLinecap="round" transform={`rotate(${f * 6})`} />
      <circle cx={0} cy={0} r={5} fill="#EF4444" />
    </g>
    {/* Office Floor */}
    <rect x={0} y={780} width={1920} height={300} fill="#0F172A" />
  </g>
);

// C. Warm Savanna & Mammoth Hills (Golden sunny prehistoric paradise)
export const WarmSavannaBg: React.FC<{ f: number }> = ({ f }) => (
  <g>
    {/* Golden Warm Sky */}
    <rect x={0} y={0} width={1920} height={1080} fill="#FEF08A" />
    <rect x={0} y={350} width={1920} height={400} fill="#FDE047" opacity={0.6} />
    {/* Blazing Golden Sun */}
    <circle cx={1650} cy={160} r={110} fill="#F59E0B" opacity={0.9} />
    <circle cx={1650} cy={160} r={160} fill="#FDE047" opacity={0.35} />

    {/* Distant Savanna Hills */}
    <ellipse cx={400} cy={720} rx={700} ry={220} fill="#15803D" />
    <ellipse cx={1500} cy={720} rx={800} ry={240} fill="#166534" />
    {/* Distant walking mammoths */}
    <g transform={`translate(${600 - (f * 0.5) % 800} 530) scale(0.35)`}>
      <ellipse cx={0} cy={0} rx={90} ry={65} fill="#451A03" />
      <circle cx={-85} cy={-20} r={40} fill="#451A03" />
      <path d="M -110 -15 Q -140 30 -115 50" stroke="#451A03" strokeWidth={16} strokeLinecap="round" fill="none" />
      <path d="M -105 -5 Q -145 10 -130 -35" stroke="#FDE68A" strokeWidth={8} strokeLinecap="round" fill="none" />
    </g>

    {/* Savanna ground */}
    <rect x={0} y={750} width={1920} height={330} fill="#CA8A04" />
  </g>
);

// D. Ancient Fermented Fruit Grove
export const AncientFruitGroveBg: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <rect x={0} y={0} width={1920} height={1080} fill="#065F46" />
    {/* Sunbeams filtering through foliage */}
    <polygon points="200,0 350,0 600,1080 300,1080" fill="#FEF08A" opacity={0.12} />
    <polygon points="800,0 950,0 1200,1080 900,1080" fill="#FEF08A" opacity={0.12} />
    <polygon points="1400,0 1550,0 1800,1080 1500,1080" fill="#FEF08A" opacity={0.12} />

    {/* Giant lush green tree canopies */}
    <circle cx={200} cy={200} r={280} fill="#047857" />
    <circle cx={700} cy={180} r={320} fill="#065F46" />
    <circle cx={1300} cy={190} r={300} fill="#047857" />
    <circle cx={1800} cy={220} r={290} fill="#065F46" />

    {/* Ground with moss & berries */}
    <rect x={0} y={740} width={1920} height={340} fill="#14532D" />
  </g>
);

// E. Megalithic Gobekli Tepe Temple (Carved T-pillars, stone brewery sanctuary)
export const GobekliTepeTempleBg: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <rect x={0} y={0} width={1920} height={1080} fill="#292524" />
    {/* Megalithic T-Pillars on Left and Right */}
    {[220, 1700].map((px) => (
      <g key={px} transform={`translate(${px} 250)`}>
        {/* T-Pillar Top Beam */}
        <rect x={-140} y={0} width={280} height={90} rx={10} fill="#78716C" stroke="#44403C" strokeWidth={6} />
        {/* T-Pillar Vertical Shaft */}
        <rect x={-70} y={90} width={140} height={460} fill="#57534E" stroke="#44403C" strokeWidth={6} />
        {/* Carved relief beast on pillar */}
        <ellipse cx={0} cy={260} rx={30} ry={70} fill="#44403C" />
      </g>
    ))}
    {/* Temple stone floor */}
    <rect x={0} y={750} width={1920} height={330} fill="#1C1917" />
  </g>
);

// F. Romantic Starry Night Cave (Moonlit constellations, twilight, crackling fire)
export const RomanticStarryCaveBg: React.FC<{ f: number }> = ({ f }) => (
  <g>
    {/* Deep Cosmic Sky */}
    <rect x={0} y={0} width={1920} height={1080} fill="#0F172A" />
    {/* Twinkling Constellation Stars */}
    {[
      [300, 120], [450, 180], [600, 110], [800, 220], [1100, 140],
      [1350, 90], [1500, 190], [1750, 130], [950, 80], [200, 240]
    ].map(([sx, sy], i) => (
      <circle
        key={i}
        cx={sx}
        cy={sy}
        r={2.5 + Math.sin(f * 0.2 + i) * 1.5}
        fill="#FEF08A"
        opacity={0.85}
      />
    ))}
    {/* Glowing Crescent Moon */}
    <circle cx={1550} cy={160} r={70} fill="#FDE047" />
    <circle cx={1580} cy={140} r={65} fill="#0F172A" />

    {/* Cave mouth silhouette framing the starlight */}
    <path
      d="M 0 0 L 450 0 C 400 350, 200 650, 0 750 Z"
      fill="#1C1917"
    />
    <path
      d="M 1920 0 L 1470 0 C 1520 350, 1720 650, 1920 750 Z"
      fill="#1C1917"
    />
    <rect x={0} y={750} width={1920} height={330} fill="#1C1917" />
  </g>
);

// G. Prehistoric Gaming Den (Torches, stalactites, warm hearth glow)
export const PrehistoricGamingDenBg: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <rect x={0} y={0} width={1920} height={1080} fill="#1C1917" />
    {/* Ceiling Stalactites */}
    {[
      [80, 200], [250, 280], [450, 220], [850, 310], [1150, 250],
      [1450, 290], [1650, 210], [1850, 260]
    ].map(([px, ph], i) => (
      <polygon key={i} points={`${px-40},0 ${px},${ph} ${px+40},0`} fill="#292524" />
    ))}

    {/* Wall Torches with dynamic flame flicker */}
    {[180, 1740].map((tx) => (
      <g key={tx} transform={`translate(${tx} 380)`}>
        <line x1={0} y1={70} x2={tx < 960 ? 30 : -30} y2={0} stroke="#78350F" strokeWidth={14} strokeLinecap="round" />
        <circle cx={tx < 960 ? 30 : -30} cy={0} r={28 + Math.sin(f*0.4)*5} fill="#EA580C" opacity={0.9} />
        <circle cx={tx < 960 ? 30 : -30} cy={0} r={16 + Math.sin(f*0.4)*3} fill="#FDE047" />
        {/* Glow halo */}
        <circle cx={tx < 960 ? 30 : -30} cy={0} r={90} fill="#F59E0B" opacity={0.15} />
      </g>
    ))}
    {/* Cave floor */}
    <rect x={0} y={750} width={1920} height={330} fill="#0C0A09" />
  </g>
);

// H. Deep Chauvet Cavern Gallery (Limestone texture & movie theater darkness)
export const ChauvetCavernBg: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <rect x={0} y={0} width={1920} height={1080} fill="#0C0A09" />
    {/* Huge Radial Firelight Glow from Torch */}
    <ellipse cx={960} cy={520} rx={680 + Math.sin(f * 0.3) * 30} ry={420 + Math.cos(f * 0.3) * 20} fill="#78350F" opacity={0.45} />
    <ellipse cx={960} cy={520} rx={480 + Math.sin(f * 0.4) * 20} ry={300 + Math.cos(f * 0.4) * 15} fill="#B45309" opacity={0.3} />
    
    {/* Cave wall rock frame */}
    <rect x={260} y={190} width={1400} height={560} rx={30} fill="#1C1917" stroke="#78350F" strokeWidth={5} />
    <rect x={0} y={750} width={1920} height={330} fill="#0A0A0A" />
  </g>
);

// I. Glowing Brain Synapses & Dopamine Fireworks
export const GlowingBrainSynapseBg: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <rect x={0} y={0} width={1920} height={1080} fill="#050814" />
    
    {/* Giant Glowing Anatomical Brain in Background */}
    <g transform="translate(960 480) scale(1.6)" opacity={0.85}>
      {/* Cerebral Hemispheres */}
      <path
        d="M -180 20 C -220 -80, -140 -180, -20 -180 C 40 -180, 80 -140, 100 -120 C 160 -120, 220 -60, 200 40 C 180 120, 80 160, 0 160 C -100 160, -180 100, -180 20 Z"
        fill="#1E1B4B"
        stroke="#818CF8"
        strokeWidth={6}
      />
      {/* Brain folds & gyri */}
      <path d="M -120 -80 Q -60 -40 -10 0 T 80 -40" stroke="#6366F1" strokeWidth={5} fill="none" />
      <path d="M -140 20 Q -40 60 20 20 T 120 60" stroke="#6366F1" strokeWidth={5} fill="none" />
      <path d="M -80 -120 Q 0 -90 60 -110" stroke="#A855F7" strokeWidth={4} fill="none" />
      
      {/* Pulsing Synaptic Electrical Nodes */}
      {[
        [-100, -60], [-40, -110], [40, -90], [90, -30], [-20, 40], [70, 70]
      ].map(([nx, ny], i) => (
        <g key={i}>
          <circle cx={nx} cy={ny} r={8 + Math.sin(f * 0.3 + i) * 4} fill="#EC4899" />
          <circle cx={nx} cy={ny} r={18 + Math.sin(f * 0.3 + i) * 8} fill="#EC4899" opacity={0.25} />
        </g>
      ))}
    </g>

    {/* Floating Dopamine Molecules (C8H11NO2) */}
    {[
      { x: 300, y: 320, l: "DOPAMINE (C₈H₁₁NO₂)" },
      { x: 1620, y: 320, l: "SEROTONIN (C₁₀H₁₂N₂O)" }
    ].map((mol, i) => (
      <g key={i} transform={`translate(${mol.x} ${mol.y + Math.sin(f*0.15+i)*15})`}>
        <rect x={-150} y={-35} width={300} height={70} rx={16} fill="#0F172A" opacity={0.92} stroke="#EC4899" strokeWidth={3} />
        <text x={0} y={8} fill="#FDE047" fontSize={20} fontWeight="bold" fontFamily="monospace" textAnchor="middle">
          {mol.l}
        </text>
      </g>
    ))}
    <rect x={0} y={750} width={1920} height={330} fill="#020617" />
  </g>
);

// J. Evolutionary Tribe Home & Modern Living Room
export const EvolutionaryTribeHomeBg: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <rect x={0} y={0} width={1920} height={1080} fill="#0F172A" />
    {/* Split Screen Divider */}
    <line x1={960} y1={0} x2={960} y2={1080} stroke={GOLD} strokeWidth={6} strokeDasharray="16 10" />
    
    {/* Left: 30,000 BC Cave Campfire */}
    <rect x={0} y={0} width={960} height={750} fill="#1C1917" />
    {/* Right: Modern Cozy Living Room with TV */}
    <rect x={960} y={0} width={960} height={750} fill="#1E293B" />
    {/* Modern TV screen glowing */}
    <rect x={1260} y={220} width={360} height={200} rx={12} fill="#0284C7" stroke="#38BDF8" strokeWidth={6} />
    <text x={1440} y={330} fontSize={60} textAnchor="middle">🎮</text>
    
    {/* Ground / Floor */}
    <rect x={0} y={750} width={960} height={330} fill="#0A0A0A" />
    <rect x={960} y={750} width={960} height={330} fill="#0F172A" />
  </g>
);

// Standard Ancient Header
export const AncientHeader: React.FC<{ epoch: string; title: string; subtitle: string; f: number }> = ({ epoch, title, subtitle, f }) => (
  <g transform="translate(60 45)" opacity={clamp(f / 15)}>
    <rect x={0} y={0} width={760} height={75} rx={12} fill="#0F172A" opacity={0.94} stroke={GOLD} strokeWidth={2.5} />
    <circle cx={40} cy={37} r={22} fill="#EA580C" />
    <text x={40} y={45} fill="#FFFFFF" fontSize={18} fontWeight="bold" fontFamily="monospace" textAnchor="middle">
      {epoch}
    </text>
    <text x={80} y={35} fill="#F8FAFC" fontSize={22} fontWeight="bold" fontFamily="sans-serif">
      {title.toUpperCase()}
    </text>
    <text x={80} y={58} fill="#94A3B8" fontSize={15} fontFamily="sans-serif">
      {subtitle}
    </text>
  </g>
);

// Prehistoric Campfire Graphic
export const Campfire: React.FC<{ cx: number; cy: number; f: number; scale?: number }> = ({ cx, cy, f, scale = 1 }) => {
  const flicker = Math.sin(f * 0.4) * 6;
  const flameH = 90 + Math.sin(f * 0.3) * 15;
  return (
    <g transform={`translate(${cx} ${cy}) scale(${scale})`}>
      <ellipse cx={0} cy={20} rx={90} ry={35} fill="#475569" stroke="#334155" strokeWidth={4} />
      <line x1={-60} y1={10} x2={60} y2={-10} stroke="#78350F" strokeWidth={16} strokeLinecap="round" />
      <line x1={-55} y1={-10} x2={55} y2={10} stroke="#92400E" strokeWidth={16} strokeLinecap="round" />
      <polygon points={`0,${-flameH} -45,10 0,0 45,10`} fill="#DC2626" opacity={0.85} transform={`skewX(${flicker})`} />
      <polygon points={`0,${-flameH + 20} -30,5 0,-5 30,5`} fill="#EA580C" opacity={0.9} transform={`skewX(${-flicker * 0.8})`} />
      <polygon points={`0,${-flameH + 45} -15,0 0,-10 15,0`} fill="#FDE047" opacity={0.95} />
      <circle cx={-15 + (f % 40) * 0.8} cy={-flameH - 10 - (f % 30)} r={3} fill="#F59E0B" opacity={0.8} />
      <circle cx={15 - (f % 35) * 0.7} cy={-flameH - 18 - (f % 25)} r={2.5} fill="#FBBF24" opacity={0.8} />
    </g>
  );
};

// ========================================================
// 3. AUTHENTIC PROPS & ANIMALS
// ========================================================

// Authentic Saber-Toothed Cat (Smilodon)
export const SaberToothedCat: React.FC<{ f: number }> = ({ f }) => {
  const pounce = Math.sin(f * 0.3) * 14;
  return (
    <g transform={`translate(${160 + pounce} 460)`}>
      <path d="M 40 140 Q 10 110 20 80" stroke="#B45309" strokeWidth={18} strokeLinecap="round" fill="none" />
      <path d="M 80 160 Q 60 220 70 280 L 110 280" stroke="#92400E" strokeWidth={24} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M 320 180 Q 350 230 340 280 L 380 280" stroke="#92400E" strokeWidth={24} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path
        d="M 60 170 C 90 95 190 75 270 85 C 340 95 385 115 395 170 C 385 225 290 235 200 225 C 130 220 80 215 60 170 Z"
        fill="#D97706"
        stroke="#92400E"
        strokeWidth={7}
      />
      {[ [140, 140], [180, 160], [220, 130], [260, 150] ].map(([sx, sy], i) => (
        <circle key={i} cx={sx} cy={sy} r={10} fill="#B45309" opacity={0.65} />
      ))}
      <g transform="translate(370 100)">
        <ellipse cx={40} cy={0} rx={75} ry={55} fill="#D97706" stroke="#92400E" strokeWidth={6} />
        <polygon points="10,-45 40,-75 60,-40" fill="#92400E" stroke="#78350F" strokeWidth={4} />
        <path d="M 75 10 L 120 15 L 95 50 L 50 35 Z" fill="#991B1B" stroke="#78350F" strokeWidth={4} />
        <path d="M 90 12 C 95 45 108 90 92 130 C 85 98 80 52 78 12 Z" fill="#FFFBEB" stroke="#475569" strokeWidth={3} />
        <path d="M 103 14 C 108 45 118 90 105 125 C 98 95 94 50 91 14 Z" fill="#FEF3C7" stroke="#475569" strokeWidth={3} />
        <ellipse cx={35} cy={-12} rx={14} ry={10} fill="#F59E0B" stroke="#451A03" strokeWidth={3} />
        <ellipse cx={35} cy={-12} rx={3} ry={8} fill="#000000" />
      </g>
      <g transform="translate(140 310)">
        <rect x={0} y={0} width={360} height={42} rx={8} fill="#0F172A" opacity={0.92} stroke="#EF4444" strokeWidth={2} />
        <text x={180} y={27} fill="#FCA5A5" fontSize={18} fontWeight="bold" fontFamily="monospace" textAnchor="middle">
          SMILODON (SABER-TOOTHED CAT) 🐅
        </text>
      </g>
    </g>
  );
};

// Roasted Mammoth Drumstick on real bone
export const PrehistoricRoastMeat: React.FC<{ scale?: number }> = ({ scale = 1 }) => (
  <g transform={`scale(${scale})`}>
    <line x1={-90} y1={0} x2={90} y2={0} stroke="#FFFBEB" strokeWidth={24} strokeLinecap="round" />
    <circle cx={-90} cy={-12} r={15} fill="#FEF3C7" stroke="#E2E8F0" strokeWidth={2} />
    <circle cx={-90} cy={12} r={15} fill="#FEF3C7" stroke="#E2E8F0" strokeWidth={2} />
    <circle cx={90} cy={-12} r={15} fill="#FEF3C7" stroke="#E2E8F0" strokeWidth={2} />
    <circle cx={90} cy={12} r={15} fill="#FEF3C7" stroke="#E2E8F0" strokeWidth={2} />
    <ellipse cx={0} cy={0} rx={65} ry={48} fill="#78350F" stroke="#451A03" strokeWidth={6} />
    <line x1={-30} y1={-32} x2={-10} y2={32} stroke="#451A03" strokeWidth={6} strokeLinecap="round" />
    <line x1={0} y1={-38} x2={15} y2={36} stroke="#451A03" strokeWidth={6} strokeLinecap="round" />
    <line x1={25} y1={-30} x2={40} y2={28} stroke="#451A03" strokeWidth={6} strokeLinecap="round" />
    <text x={0} y={75} fill="#FDE047" fontSize={20} fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">
      ROASTED MAMMOTH RIB 🍖
    </text>
  </g>
);

// 4-Sided Astragaloi Knucklebone
export const KnuckleBoneDice: React.FC<{ kx: number; ky: number; rot: number; label: string }> = ({ kx, ky, rot, label }) => (
  <g transform={`translate(${kx} ${ky}) rotate(${rot})`}>
    <path
      d="M -35 -50 C -45 -30, -50 0, -35 25 C -45 40, -30 55, 0 52 C 30 55, 45 40, 35 25 C 50 0, 45 -30, 35 -50 C 40 -65, 20 -70, 0 -68 C -20 -70, -40 -65, -35 -50 Z"
      fill="#FEF3C7"
      stroke="#78716C"
      strokeWidth={5}
    />
    <path d="M -15 -35 Q 0 -20 15 -35" stroke="#D6D3D1" strokeWidth={4} fill="none" />
    <path d="M -20 10 Q 0 30 20 10" stroke="#D6D3D1" strokeWidth={4} fill="none" />
    <g transform="translate(0 75) rotate(${-rot})">
      <rect x={-80} y={-16} width={160} height={32} rx={6} fill="#0F172A" opacity={0.92} stroke={GOLD} strokeWidth={2} />
      <text x={0} y={6} fill={GOLD} fontSize={14} fontWeight="bold" fontFamily="monospace" textAnchor="middle">
        {label}
      </text>
    </g>
  </g>
);

// Chauvet Cave Running Steppe Bison & Cave Lion
export const ChauvetCaveBison: React.FC<{ f: number }> = ({ f }) => {
  const gallop = Math.sin(f * 0.4) * 8;
  return (
    <g transform={`translate(960 480)`}>
      <ellipse cx={0} cy={10} rx={480} ry={250} fill="#B45309" opacity={0.25} />
      <g transform={`translate(0 ${gallop})`}>
        <path
          d="M -140 20 C -120 -80, -20 -120, 80 -100 C 180 -80, 240 -20, 220 70 C 160 120, -60 110, -140 20 Z"
          fill="#991B1B"
          stroke="#1C1917"
          strokeWidth={9}
        />
        <path d="M -60 -110 L -30 -140 L 10 -115 L 45 -145 L 80 -115" stroke="#1C1917" strokeWidth={6} strokeLinecap="round" fill="none" />
        <path d="M -160 -10 C -220 -20, -260 20, -250 60 C -220 85, -170 70, -150 40 Z" fill="#7F1D1D" stroke="#1C1917" strokeWidth={7} />
        <path d="M -210 0 C -230 -50, -190 -85, -165 -75" fill="#1C1917" stroke="#44403C" strokeWidth={3} />
        {/* Overlapping Running Legs */}
        <path d="M -120 70 L -150 180 L -130 195" stroke="#1C1917" strokeWidth={16} strokeLinecap="round" fill="none" />
        <path d="M -100 70 L -60 170 L -40 185" stroke="#7F1D1D" strokeWidth={14} strokeLinecap="round" fill="none" opacity={0.85} />
        <path d="M 140 60 L 190 175 L 210 190" stroke="#1C1917" strokeWidth={16} strokeLinecap="round" fill="none" />
        <path d="M 180 50 L 230 160 L 250 175" stroke="#7F1D1D" strokeWidth={14} strokeLinecap="round" fill="none" opacity={0.85} />
      </g>
      <g transform="translate(270 -50) scale(0.68)">
        <path d="M -120 40 C -80 -20, 20 -30, 100 -10 C 160 10, 220 50, 240 100 C 200 130, 120 120, 40 100 Z" fill="#1C1917" opacity={0.88} />
        <circle cx={-135} cy={35} r={35} fill="#1C1917" />
      </g>
      <text x={0} y={245} fill="#FDE047" fontSize={34} fontWeight="bold" fontFamily="impact" textAnchor="middle">
        CHAUVET CAVE (36,000 BC) — GALLOPING BISON & CAVE LION 🦬🦁
      </text>
    </g>
  );
};

// CaveWoman Stickman Character Component
export const CaveWoman: React.FC<{ cx: number; cy: number; f: number; blushing?: boolean }> = ({ cx, cy, f, blushing = true }) => (
  <g transform={`translate(${cx} ${cy})`}>
    {/* Flowing hair */}
    <ellipse cx={0} cy={-120} rx={45} ry={55} fill="#5C2E0B" />
    <path d="M -35 -140 Q -60 -70 -40 -30" stroke="#5C2E0B" strokeWidth={16} strokeLinecap="round" fill="none" />
    <path d="M 35 -140 Q 60 -70 40 -30" stroke="#5C2E0B" strokeWidth={16} strokeLinecap="round" fill="none" />
    {/* Bone in hair */}
    <g transform="translate(25 -145) rotate(25)">
      <line x1={-25} y1={0} x2={25} y2={0} stroke="#F8FAFC" strokeWidth={8} strokeLinecap="round" />
      <circle cx={-25} cy={-5} r={5} fill="#F8FAFC" />
      <circle cx={-25} cy={5} r={5} fill="#F8FAFC" />
      <circle cx={25} cy={-5} r={5} fill="#F8FAFC" />
      <circle cx={25} cy={5} r={5} fill="#F8FAFC" />
    </g>
    {/* Head */}
    <circle cx={0} cy={-120} r={38} fill="#FFFFFF" stroke="#0F172A" strokeWidth={5} />
    {/* Cheeks */}
    {blushing && (
      <>
        <ellipse cx={-18} cy={-112} rx={12} ry={7} fill="#FB7185" />
        <ellipse cx={18} cy={-112} rx={12} ry={7} fill="#FB7185" />
      </>
    )}
    {/* Lashes & Smile */}
    <path d="M -22 -125 Q -15 -132 -8 -125" stroke="#0F172A" strokeWidth={3} fill="none" />
    <path d="M 8 -125 Q 15 -132 22 -125" stroke="#0F172A" strokeWidth={3} fill="none" />
    <path d="M -12 -105 Q 0 -95 12 -105" stroke="#E11D48" strokeWidth={3} fill="none" />

    {/* Body & Fur Dress */}
    <line x1={0} y1={-82} x2={0} y2={0} stroke="#0F172A" strokeWidth={7} />
    <polygon points="-25,-75 25,-75 35,-15 -35,-15" fill="#B45309" stroke="#78350F" strokeWidth={4} />
    {/* Arms & Legs */}
    <line x1={0} y1={-60} x2={-35} y2={-30 + Math.sin(f*0.2)*10} stroke="#0F172A" strokeWidth={6} strokeLinecap="round" />
    <line x1={0} y1={-60} x2={35} y2={-45} stroke="#0F172A" strokeWidth={6} strokeLinecap="round" />
    <line x1={0} y1={0} x2={-20} y2={70} stroke="#0F172A" strokeWidth={6} strokeLinecap="round" />
    <line x1={0} y1={0} x2={20} y2={70} stroke="#0F172A" strokeWidth={6} strokeLinecap="round" />
  </g>
);

// ========================================================
// CHAPTER 1: THE PREHISTORIC MYTH (1182 frames, ~38.9s)
// ========================================================
export const Chapter1: React.FC<{ f: number }> = ({ f }) => {
  return (
    <g>
      {/* Sub-scene 1: Mo running in terror from Saber-Toothed Cat in Cold Blizzard (0 - 200 frames) */}
      {f < 200 && (
        <g>
          <ColdBlizzardBg f={f} />
          <AncientHeader epoch="30,000 BC" title="The Survival Myth" subtitle="Did ancient humans live in 24/7 terror?" f={f} />
          <SaberToothedCat f={f} />

          {/* Mo running frantically on the snow */}
          <Hero
            look={MO}
            pose={walkPose(1350 + Math.sin(f * 0.2) * 40, f * 0.6, 750, 1.05, {
              expr: 'shock',
              yaw: 1,
              tilt: 20,
              look: -1,
              armL: { a: 70 * Math.sin(f * 0.6), b: 40 },
              armR: { a: -70 * Math.sin(f * 0.6), b: 40 },
            }, 1)}
            rimId="rimR"
            shadow={0.4}
          />
          {/* Panic Face Overlay */}
          <FaceReaction cx={1350 + Math.sin(f * 0.2) * 40} cy={510} type="panic" f={f} scale={1.2} />

          <g transform={`translate(${1350 + Math.sin(f * 0.2) * 40} 420)`}>
            <rect x={-110} y={-35} width={220} height={46} rx={12} fill="#EF4444" stroke="#FFFFFF" strokeWidth={3} />
            <text x={0} y={-4} fill="#FFFFFF" fontSize={26} fontWeight="bold" fontFamily="impact" textAnchor="middle">
              RUN MO, RUN! 😱
            </text>
          </g>
        </g>
      )}

      {/* Sub-scene 2: Modern Burnout Office vs Hunter-Gatherer Feast (200 - 420 frames) */}
      {f >= 200 && f < 420 && (
        <g>
          <ModernOfficeBg f={f-200} />
          <AncientHeader epoch="WORK HOURS" title="Modern Desk vs Hunter-Gatherer" subtitle="Anthropological study of weekly working hours" f={f-200} />

          {/* Left: Modern Burnout Worker */}
          <g transform="translate(180 180)">
            <rect x={0} y={0} width={720} height={740} rx={24} fill="#0F172A" opacity={0.92} stroke="#EF4444" strokeWidth={4} />
            <text x={360} y={70} fill="#EF4444" fontSize={34} fontWeight="bold" textAnchor="middle">
              MODERN WORKER 💼
            </text>
            <text x={360} y={130} fill="#F8FAFC" fontSize={52} fontWeight="bold" textAnchor="middle" fontFamily="impact">
              40 - 60 HOURS / WEEK
            </text>
            <rect x={180} y={640} width={360} height={20} rx={6} fill="#475569" />
            <rect x={300} y={580} width={120} height={90} rx={8} fill="#0284C7" />
            <text x={360} y={230} fill="#F87171" fontSize={34} fontWeight="bold" textAnchor="middle">
              BURNOUT & STRESS 😩
            </text>
          </g>
          <Hero
            look={PIP}
            pose={{
              ...basePose,
              x: 540,
              y: 670,
              scale: 0.9,
              expr: 'tired',
              headTilt: 20,
              armL: { a: -30, b: 60 },
              armR: { a: -30, b: 60 },
            }}
            rimId="rimR"
            shadow={0.3}
          />
          <FaceReaction cx={540} cy={580} type="burnout" f={f-200} scale={1.2} />

          {/* Right: Prehistoric Hunter Chilling with Roasted Mammoth Bone */}
          <g transform="translate(1020 180)">
            <rect x={0} y={0} width={720} height={740} rx={24} fill="#0F172A" opacity={0.92} stroke="#22C55E" strokeWidth={4} />
            <text x={360} y={70} fill="#22C55E" fontSize={34} fontWeight="bold" textAnchor="middle">
              PREHISTORIC HUNTER 🍖
            </text>
            <text x={360} y={130} fill="#FDE047" fontSize={52} fontWeight="bold" textAnchor="middle" fontFamily="impact">
              15 - 20 HOURS / WEEK!
            </text>
            <ellipse cx={360} cy={660} rx={180} ry={45} fill="#166534" />
            <text x={360} y={230} fill="#22C55E" fontSize={32} fontWeight="bold" textAnchor="middle">
              RELAXED & FULL BELLIED! 😎
            </text>
          </g>
          <Hero
            look={MO}
            pose={{
              ...basePose,
              x: 1380,
              y: 670,
              scale: 0.95,
              expr: 'happy',
              armL: { a: 20, b: 30 },
              armR: { a: 60, b: 60 },
            }}
            rimId="rimR"
            shadow={0.3}
          />
          <FaceReaction cx={1380} cy={580} type="happy" f={f-200} scale={1.2} />
          <g transform="translate(1440 620) scale(0.9)">
            <PrehistoricRoastMeat scale={0.85} />
          </g>
        </g>
      )}

      {/* Sub-scene 3: Free Time Sundial in Warm Savanna (420 - 660 frames) */}
      {f >= 420 && f < 660 && (
        <g>
          <WarmSavannaBg f={f-420} />
          <AncientHeader epoch="DAILY ROUTINE" title="4 to 6 Hours of Free Time" subtitle="What did they do without internet or TV?" f={f-420} />

          {/* Giant Sundial */}
          <g transform="translate(680 540)">
            <circle cx={0} cy={0} r={220} fill="#312E81" stroke={GOLD} strokeWidth={8} />
            <circle cx={0} cy={0} r={180} fill="#1E1B4B" />
            <path d="M 0 0 L 130 -130 A 180 180 0 0 1 180 0 Z" fill="#22C55E" opacity={0.7} />
            <text x={80} y={-45} fill="#FFFFFF" fontSize={26} fontWeight="bold" fontFamily="impact">
              FREE TIME!
            </text>
            <line x1={0} y1={0} x2={80} y2={-90} stroke="#FBBF24" strokeWidth={10} strokeLinecap="round" />
            <circle cx={0} cy={0} r={18} fill={GOLD} />
          </g>

          {/* Mo Lounging in Savanna */}
          <Hero
            look={MO}
            pose={{
              ...basePose,
              x: 1350,
              y: 600,
              scale: 0.95,
              expr: 'cool',
              armL: { a: 40, b: 30 },
              armR: { a: -30, b: 40 },
            }}
            rimId="rimR"
            shadow={0.3}
          />
          <FaceReaction cx={1350} cy={510} type="happy" f={f-420} scale={1.1} />
          <g transform="translate(1350 440)">
            <rect x={-140} y={-35} width={280} height={46} rx={12} fill="#0F172A" stroke="#22C55E" strokeWidth={3} />
            <text x={0} y={-4} fill="#FDE047" fontSize={24} fontWeight="bold" fontFamily="impact" textAnchor="middle">
              5 HOURS FREE DAILY! 🕒
            </text>
          </g>
        </g>
      )}

      {/* Sub-scene 4: Bored in Cave with Torch (660 - 920 frames) */}
      {f >= 660 && f < 920 && (
        <g>
          <PrehistoricGamingDenBg f={f-660} />
          <Campfire cx={960} cy={820} f={f-660} scale={1.4} />
          <AncientHeader epoch="LEISURE CRISIS" title="No Phone. No Electricity. No TV." subtitle="Human ingenuity turned to pure pleasure" f={f-660} />

          <Hero
            look={MO}
            pose={{
              ...basePose,
              x: 640 + Math.sin(f * 0.1) * 25,
              y: 600,
              scale: 0.95,
              expr: 'worried',
              headTilt: -15,
              armL: { a: 60, b: 70 },
              armR: { a: -30, b: 40 },
            }}
            rimId="rimR"
            shadow={0.3}
          />
          <g transform={`translate(${640 + Math.sin(f*0.1)*25 - 40} 560)`}>
            <line x1={0} y1={35} x2={0} y2={-25} stroke="#78350F" strokeWidth={8} strokeLinecap="round" />
            <circle cx={0} cy={-25} r={16 + Math.sin(f*0.4)*3} fill="#EA580C" />
            <circle cx={0} cy={-25} r={9} fill="#FDE047" />
          </g>
          <g transform={`translate(${640 + Math.sin(f*0.1)*25} 440)`}>
            <text x={0} y={0} fill="#FBBF24" fontSize={36} fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">
              "What now?!" 🤔
            </text>
          </g>

          {/* Cross-out signs: No Phone, No Netflix */}
          <g transform="translate(1320 440)">
            <rect x={0} y={0} width={360} height={250} rx={18} fill="#0F172A" opacity={0.92} stroke="#EF4444" strokeWidth={4} />
            <text x={180} y={65} fill="#EF4444" fontSize={30} fontWeight="bold" textAnchor="middle">
              NO SMARTPHONES 📵
            </text>
            <text x={180} y={130} fill="#EF4444" fontSize={30} fontWeight="bold" textAnchor="middle">
              NO INTERNET 🌐❌
            </text>
            <text x={180} y={195} fill="#EF4444" fontSize={30} fontWeight="bold" textAnchor="middle">
              NO NETFLIX 📺❌
            </text>
          </g>
        </g>
      )}

      {/* Sub-scene 5: Title Reveal with Cavemen Celebrating (920 - 1182 frames) */}
      {f >= 920 && (
        <g>
          <PrehistoricGamingDenBg f={f-920} />
          <Campfire cx={960} cy={820} f={f-920} scale={1.8} />

          {/* Stone Title Slab */}
          <g transform={`translate(960 360) scale(${1 + Math.sin(f*0.08)*0.02})`}>
            <rect x={-720} y={-140} width={1440} height={280} rx={24} fill="#1C1917" stroke={GOLD} strokeWidth={8} />
            <text x={0} y={-30} fill="#F8FAFC" fontSize={48} fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">
              WHAT DID ANCIENT HUMANS
            </text>
            <text x={0} y={75} fill={GOLD} fontSize={92} fontWeight="bold" fontFamily="impact" textAnchor="middle">
              DO FOR PLEASURE?
            </text>
          </g>

          <Hero
            look={MO}
            pose={{
              ...basePose,
              x: 380,
              y: 620,
              scale: 0.95,
              expr: 'happy',
              armL: { a: 110, b: 30 },
              armR: { a: 110, b: 30 },
            }}
            rimId="rimR"
            shadow={0.3}
          />
          <FaceReaction cx={380} cy={530} type="happy" f={f-920} scale={1.2} />

          <Hero
            look={PIP}
            pose={{
              ...basePose,
              x: 1540,
              y: 620,
              scale: 0.95,
              expr: 'happy',
              armL: { a: 110, b: 30 },
              armR: { a: 110, b: 30 },
            }}
            rimId="rimR"
            shadow={0.3}
          />
          <FaceReaction cx={1540} cy={530} type="happy" f={f-920} scale={1.2} />
        </g>
      )}
    </g>
  );
};

// ========================================================
// CHAPTER 2: THE WORLD'S FIRST BOOZE (1434 frames, ~47.3s)
// ========================================================
export const Chapter2: React.FC<{ f: number }> = ({ f }) => {
  return (
    <g>
      {/* Sub-scene 1: Mo finding wild fermented berries in the Fruit Grove (0 - 240 frames) */}
      {f < 240 && (
        <g>
          <AncientFruitGroveBg f={f} />
          <AncientHeader epoch="DISCOVERY" title="The World's First Booze" subtitle="Wild berries fermenting under blazing prehistoric sun" f={f} />

          {/* Fermenting Berry Bush with bubbling juice */}
          <g transform="translate(680 620)">
            <ellipse cx={0} cy={0} rx={360} ry={200} fill="#166534" stroke="#14532D" strokeWidth={6} />
            {[
              [-150, -40], [-80, 20], [-40, -60], [40, -30], [100, 30], [160, -40],
              [-100, 50], [20, 40], [120, -10], [-20, -10]
            ].map(([bx, by], i) => (
              <g key={i} transform={`translate(${bx} ${by})`}>
                <circle cx={0} cy={0} r={28} fill={i % 2 === 0 ? "#7E22CE" : "#BE123C"} stroke="#4C1D95" strokeWidth={3} />
                <circle cx={-8} cy={-8} r={6} fill="#FFFFFF" opacity={0.6} />
                <circle cx={-8 + ((f * 3 + i * 20) % 40) * 0.4} cy={-35 - ((f * 2 + i * 15) % 35)} r={4} fill="#FDE047" opacity={0.8} />
              </g>
            ))}
          </g>

          <Hero
            look={MO}
            pose={{
              ...basePose,
              x: 1280,
              y: 600,
              scale: 0.95,
              expr: 'cool',
              armL: { a: -30, b: 30 },
              armR: { a: 85, b: 40 },
            }}
            rimId="rimR"
            shadow={0.3}
          />
          <FaceReaction cx={1280} cy={510} type="happy" f={f} scale={1.1} />
          <g transform="translate(1280 440)">
            <rect x={-140} y={-35} width={280} height={46} rx={10} fill="#0F172A" stroke="#FDE047" strokeWidth={2} />
            <text x={0} y={-4} fill="#FDE047" fontSize={24} fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">
              "THESE SMELL SWEET!" 🍇
            </text>
          </g>
        </g>
      )}

      {/* Sub-scene 2: Mo intoxicated & spinning (240 - 520 frames) */}
      {f >= 240 && f < 520 && (
        <g>
          <AncientFruitGroveBg f={f-240} />
          <AncientHeader epoch="FIRST HIGH" title="The Accidental Buzz" subtitle="One curious bite... and the prehistoric world began spinning!" f={f-240} />

          <Hero
            look={MO}
            pose={{
              ...basePose,
              x: 960 + Math.sin(f * 0.2) * 30,
              y: 600 + Math.cos(f * 0.2) * 15,
              scale: 1.1,
              expr: 'dizzy',
              tilt: Math.sin(f * 0.2) * 15,
              armL: { a: 45 + Math.sin(f * 0.3) * 30, b: 30 },
              armR: { a: 45 - Math.sin(f * 0.3) * 30, b: 30 },
            }}
            rimId="rimR"
            shadow={0.3}
          />
          <FaceReaction cx={960 + Math.sin(f * 0.2) * 30} cy={500} type="dizzy" f={f-240} scale={1.4} />

          <g transform={`translate(960 400)`}>
            <rect x={-260} y={-35} width={520} height={50} rx={14} fill="#0F172A" stroke="#EC4899" strokeWidth={3} />
            <text x={0} y={0} fill="#FDE047" fontSize={30} fontWeight="bold" fontFamily="impact" textAnchor="middle">
              "WHOA... THE WALLS ARE DANCING!" 😵‍💫✨
            </text>
          </g>
        </g>
      )}

      {/* Sub-scene 3: 9,000-Year-Old Jiahu Pottery Cocktail (520 - 820 frames) */}
      {f >= 520 && f < 820 && (
        <g>
          <PrehistoricGamingDenBg f={f-520} />
          <AncientHeader epoch="9,000 YEARS AGO" title="The Jiahu Cocktail (China)" subtitle="Archaeologists found chemical traces of the world's oldest booze" f={f-520} />

          {/* Jiahu Clay Amphora */}
          <g transform="translate(620 580)">
            <polygon points="-120,-240 120,-240 180,-120 160,180 -160,180 -180,-120" fill="#B45309" stroke="#78350F" strokeWidth={8} />
            <rect x={-140} y={-80} width={280} height={30} fill="#92400E" />
            <text x={0} y={60} fill="#FFFFFF" fontSize={30} fontWeight="bold" textAnchor="middle">
              JIAHU POTTERY JAR
            </text>
          </g>

          <Hero
            look={MO}
            pose={{
              ...basePose,
              x: 1320,
              y: 600,
              scale: 0.95,
              expr: 'happy',
              armL: { a: -30, b: 30 },
              armR: { a: 75, b: 60 },
            }}
            rimId="rimR"
            shadow={0.3}
          />
          <FaceReaction cx={1320} cy={510} type="happy" f={f-520} scale={1.2} />
          <g transform="translate(1320 420)">
            <rect x={-180} y={-60} width={360} height={120} rx={14} fill="#0F172A" opacity={0.92} stroke={GOLD} strokeWidth={3} />
            <text x={0} y={-15} fill="#FDE047" fontSize={26} fontWeight="bold" textAnchor="middle">
              ANCIENT RECIPE:
            </text>
            <text x={0} y={25} fill="#FFFFFF" fontSize={20} textAnchor="middle">
              Rice + Wild Honey + Hawthorn 🍯🍒
            </text>
          </g>
        </g>
      )}

      {/* Sub-scene 4: Gobekli Tepe 40-Gallon Beer Vats (820 - 1120 frames) */}
      {f >= 820 && f < 1120 && (
        <g>
          <GobekliTepeTempleBg f={f-820} />
          <AncientHeader epoch="11,000 YEARS AGO" title="Göbekli Tepe (Turkey)" subtitle="Massive stone temple vats capable of brewing 40 gallons of beer!" f={f-820} />

          {/* Giant Stone Beer Vat in center */}
          <g transform="translate(960 620)">
            <ellipse cx={0} cy={-120} rx={300} ry={65} fill="#78716C" stroke="#44403C" strokeWidth={8} />
            <rect x={-300} y={-120} width={600} height={280} fill="#57534E" stroke="#44403C" strokeWidth={8} />
            <ellipse cx={0} cy={160} rx={300} ry={65} fill="#44403C" />
            <ellipse cx={0} cy={-120} rx={280} ry={50} fill="#EAB308" />
            {[-180, -90, 0, 90, 180].map((bx, i) => (
              <ellipse key={i} cx={bx} cy={-125} rx={30} ry={15} fill="#FEF08A" stroke="#FDE047" strokeWidth={2} />
            ))}
          </g>

          <Hero
            look={MO}
            pose={{
              ...basePose,
              x: 450,
              y: 620,
              scale: 0.95,
              expr: 'happy',
              armL: { a: 70, b: 40 },
              armR: { a: -30, b: 20 },
            }}
            rimId="rimR"
            shadow={0.3}
          />
          <FaceReaction cx={450} cy={530} type="happy" f={f-820} scale={1.2} />

          <Hero
            look={PIP}
            pose={{
              ...basePose,
              x: 1470,
              y: 620,
              scale: 0.95,
              expr: 'happy',
              armL: { a: -30, b: 20 },
              armR: { a: 70, b: 40 },
            }}
            rimId="rimR"
            shadow={0.3}
          />
          <FaceReaction cx={1470} cy={530} type="happy" f={f-820} scale={1.2} />
        </g>
      )}

      {/* Sub-scene 5: Prehistoric Block Party (1120 - 1434 frames) */}
      {f >= 1120 && (
        <g>
          <PrehistoricGamingDenBg f={f-1120} />
          <Campfire cx={960} cy={820} f={f-1120} scale={1.8} />
          <AncientHeader epoch="PARTY TIME" title="Prehistoric Block Party" subtitle="Gathering around fire, clinking clay jugs & sharing stories" f={f-1120} />

          <Hero
            look={MO}
            pose={{
              ...basePose,
              x: 520 + Math.sin(f * 0.3) * 15,
              y: 620,
              scale: 0.95,
              expr: 'happy',
              armL: { a: 110, b: 30 },
              armR: { a: -50, b: 30 },
            }}
            rimId="rimR"
            shadow={0.3}
          />
          <FaceReaction cx={520 + Math.sin(f * 0.3) * 15} cy={530} type="happy" f={f-1120} scale={1.2} />
          <g transform={`translate(${520 + Math.sin(f*0.3)*15} 460)`}>
            <text x={0} y={0} fill="#FDE047" fontSize={32} fontWeight="bold" textAnchor="middle">
              CHEERS! 🍺
            </text>
          </g>

          <Hero
            look={PIP}
            pose={{
              ...basePose,
              x: 1400 - Math.sin(f * 0.3) * 15,
              y: 620,
              scale: 0.95,
              expr: 'happy',
              armL: { a: -50, b: 30 },
              armR: { a: 110, b: 30 },
            }}
            rimId="rimR"
            shadow={0.3}
          />
          <FaceReaction cx={1400 - Math.sin(f * 0.3) * 15} cy={530} type="happy" f={f-1120} scale={1.2} />
          <g transform={`translate(${1400 - Math.sin(f*0.3)*15} 460)`}>
            <text x={0} y={0} fill="#FDE047" fontSize={32} fontWeight="bold" textAnchor="middle">
              WOOHOO! 🎉
            </text>
          </g>
        </g>
      )}
    </g>
  );
};

// ========================================================
// CHAPTER 3: STONE AGE ROMANCE (1559 frames, ~51.5s)
// ========================================================
export const Chapter3: React.FC<{ f: number }> = ({ f }) => {
  return (
    <g>
      {/* Sub-scene 1: Prehistoric Tinder in Savanna (0 - 260 frames) */}
      {f < 260 && (
        <g>
          <WarmSavannaBg f={f} />
          <AncientHeader epoch="COURTSHIP" title="Prehistoric Romance" subtitle="No dating apps... so how did Stone Age humans find love?" f={f} />

          <Hero
            look={MO}
            pose={{
              ...basePose,
              x: 420,
              y: 620,
              scale: 0.95,
              expr: 'happy',
              yaw: 1,
              armL: { a: -30, b: 20 },
              armR: { a: 60, b: 40 },
            }}
            rimId="rimR"
            shadow={0.3}
          />
          <FaceReaction cx={420} cy={530} type="romantic" f={f} scale={1.1} />

          {/* Stone Dating Tablet */}
          <g transform="translate(760 560) scale(0.6)">
            <rect x={-180} y={-220} width={360} height={440} rx={22} fill="#334155" stroke="#F43F5E" strokeWidth={8} />
            <circle cx={0} cy={-160} r={28} fill="#F43F5E" />
            <text x={0} y={-150} fill="#FFFFFF" fontSize={26} textAnchor="middle">🔥</text>
            <rect x={-130} y={-100} width={260} height={200} rx={14} fill="#1E293B" />
            <circle cx={0} cy={-20} r={45} fill="#FFFFFF" />
            <text x={0} y={70} fill="#FDE047" fontSize={22} fontWeight="bold" textAnchor="middle">
              GROK (Loves Mammoths)
            </text>
          </g>

          <CaveWoman cx={1350} cy={620} f={f} blushing={true} />
          <FaceReaction cx={1350} cy={500} type="romantic" f={f} scale={1.1} />
        </g>
      )}

      {/* Sub-scene 2: Natural Aphrodisiacs & Mo grinding herbs (260 - 520 frames) */}
      {f >= 260 && f < 520 && (
        <g>
          <PrehistoricGamingDenBg f={f-260} />
          <AncientHeader epoch="APHRODISIACS" title="Ancient Romance Chemistry" subtitle="Prehistoric foragers mixed rare roots and mountain herbs" f={f-260} />

          <Hero
            look={MO}
            pose={{
              ...basePose,
              x: 680,
              y: 620,
              scale: 0.95,
              expr: 'happy',
              armL: { a: 60, b: 60 },
              armR: { a: 60, b: 60 },
            }}
            rimId="rimR"
            shadow={0.3}
          />
          <FaceReaction cx={680} cy={530} type="happy" f={f-260} scale={1.1} />

          {/* Stone Mortar in front */}
          <g transform="translate(680 690)">
            <path d="M -140 0 Q 0 180 140 0 Z" fill="#3F3F46" stroke="#27272A" strokeWidth={6} />
            <ellipse cx={0} cy={20} rx={110} ry={30} fill="#15803D" />
            <line x1={0} y1={-120} x2={Math.sin(f*0.3)*30} y2={30} stroke="#71717A" strokeWidth={26} strokeLinecap="round" />
          </g>

          {/* List of prehistoric herbs */}
          <g transform="translate(1180 340)">
            {[
              { t: 'Wild Ginger Roots', d: 'Natural blood circulation' },
              { t: 'Crushed Beetle Shells', d: 'Ancient mineral booster' },
              { t: 'Rare Mountain Pollen', d: 'Prehistoric plant energy' }
            ].map((item, i) => (
              <g key={i} transform={`translate(0 ${i * 150})`}>
                <rect x={0} y={0} width={560} height={110} rx={16} fill="#0F172A" opacity={0.92} stroke="#F43F5E" strokeWidth={3} />
                <text x={40} y={65} fontSize={40}>🌿</text>
                <text x={110} y={50} fill="#FDE047" fontSize={26} fontWeight="bold">{item.t}</text>
                <text x={110} y={85} fill="#94A3B8" fontSize={18}>{item.d}</text>
              </g>
            ))}
          </g>
        </g>
      )}

      {/* Sub-scene 3: 40,000-Year-Old Vulture Bone Flute Serenade (520 - 820 frames) */}
      {f >= 520 && f < 820 && (
        <g>
          <RomanticStarryCaveBg f={f-520} />
          <Campfire cx={960} cy={820} f={f-520} scale={1.4} />
          <AncientHeader epoch="40,000 YEARS AGO" title="The World's Oldest Instrument" subtitle="Hohle Fels Cave, Germany: Flute carved from giant vulture wing bone" f={f-520} />

          <Hero
            look={MO}
            pose={{
              ...basePose,
              x: 560,
              y: 620,
              scale: 0.95,
              expr: 'happy',
              armL: { a: 60, b: 70 },
              armR: { a: 60, b: 70 },
            }}
            rimId="rimR"
            shadow={0.3}
          />
          {/* Vulture Bone Flute in hands */}
          <g transform="translate(600 550) rotate(-25)">
            <rect x={0} y={0} width={260} height={22} rx={6} fill="#F5F5F4" stroke="#78716C" strokeWidth={3} />
            {[50, 95, 140, 185].map((hx) => (
              <circle key={hx} cx={hx} cy={11} r={5} fill="#1C1917" />
            ))}
          </g>

          {/* Floating musical notes & hearts */}
          {['🎵', '🎶', '💖', '🎵'].map((n, i) => (
            <text key={i} x={920 + i * 80} y={480 - i * 60 + Math.sin(f*0.2+i)*15} fill={GOLD} fontSize={50}>
              {n}
            </text>
          ))}

          <CaveWoman cx={1380} cy={620} f={f} blushing={true} />
          <FaceReaction cx={1380} cy={500} type="romantic" f={f-520} scale={1.2} />
        </g>
      )}

      {/* Sub-scene 4: Venus Figurines & Prehistoric Beauty (820 - 1140 frames) */}
      {f >= 820 && f < 1140 && (
        <g>
          <WarmSavannaBg f={f-820} />
          <AncientHeader epoch="30,000 BC" title="Prehistoric Beauty Standards" subtitle="Venus figurines carved from mammoth ivory: Symbol of fertility & attraction" f={f-820} />

          <Hero
            look={MO}
            pose={{
              ...basePose,
              x: 520,
              y: 620,
              scale: 0.95,
              expr: 'cool',
              yaw: 1,
              armL: { a: -30, b: 20 },
              armR: { a: 60, b: 30 },
            }}
            rimId="rimR"
            shadow={0.3}
          />
          <FaceReaction cx={520} cy={530} type="awe" f={f-820} scale={1.2} />

          {/* Rotating Venus of Willendorf Figurine */}
          <g transform={`translate(1220 520) scale(${1 + Math.sin(f*0.1)*0.03})`}>
            <circle cx={0} cy={0} r={220} fill="#CA8A04" opacity={0.2} />
            <ellipse cx={0} cy={-130} rx={50} ry={42} fill="#D97706" stroke="#78350F" strokeWidth={5} />
            <ellipse cx={-30} cy={-55} rx={45} ry={38} fill="#D97706" stroke="#78350F" strokeWidth={5} />
            <ellipse cx={30} cy={-55} rx={45} ry={38} fill="#D97706" stroke="#78350F" strokeWidth={5} />
            <ellipse cx={0} cy={20} rx={75} ry={50} fill="#D97706" stroke="#78350F" strokeWidth={5} />
            <ellipse cx={-40} cy={95} rx={40} ry={45} fill="#D97706" stroke="#78350F" strokeWidth={5} />
            <ellipse cx={40} cy={95} rx={40} ry={45} fill="#D97706" stroke="#78350F" strokeWidth={5} />
            <text x={0} y={200} fill="#FDE047" fontSize={32} fontWeight="bold" fontFamily="impact" textAnchor="middle">
              VENUS OF WILLENDORF
            </text>
          </g>
        </g>
      )}

      {/* Sub-scene 5: Campfire Cuddle under Starlight (1140 - 1559 frames) */}
      {f >= 1140 && (
        <g>
          <RomanticStarryCaveBg f={f-1140} />
          <Campfire cx={960} cy={820} f={f-1140} scale={1.8} />
          <AncientHeader epoch="HUMAN CONNECTION" title="The Primal Need for Affection" subtitle="Snuggling under warm mammoth furs by the glowing embers" f={f-1140} />

          <Hero
            look={MO}
            pose={{
              ...basePose,
              x: 680,
              y: 620,
              scale: 0.95,
              expr: 'happy',
              headTilt: 15,
              yaw: 1,
              armL: { a: -20, b: 20 },
              armR: { a: 45, b: 40 },
            }}
            rimId="rimR"
            shadow={0.3}
          />
          <FaceReaction cx={680} cy={530} type="romantic" f={f-1140} scale={1.2} />

          <CaveWoman cx={800} cy={620} f={f-1140} blushing={true} />
          <FaceReaction cx={800} cy={500} type="romantic" f={f-1140} scale={1.2} />

          <g transform={`translate(740 400) scale(${1 + Math.sin(f*0.2)*0.1})`}>
            <text x={0} y={0} fontSize={70} textAnchor="middle">❤️</text>
          </g>
        </g>
      )}
    </g>
  );
};

// ========================================================
// CHAPTER 4: PREHISTORIC GAMING & GAMBLING (1343 frames, ~44.3s)
// ========================================================
export const Chapter4: React.FC<{ f: number }> = ({ f }) => {
  return (
    <g>
      {/* Sub-scene 1: Mo & Opponent Tossing Knucklebones (0 - 260 frames) */}
      {f < 260 && (
        <g>
          <PrehistoricGamingDenBg f={f} />
          <AncientHeader epoch="5,000 YEARS AGO" title="The World's Oldest Dice" subtitle="Astragaloi: Four-sided animal ankle bones tossed for high stakes" f={f} />

          {/* Hide rug on floor with 3 authentic knucklebones */}
          <g transform="translate(960 640)">
            <ellipse cx={0} cy={30} rx={500} ry={180} fill="#78350F" stroke="#451A03" strokeWidth={6} />
            {[
              { x: -180, label: "SIDE 1: SUPINUM" },
              { x: 0, label: "SIDE 2: PRONUM" },
              { x: 180, label: "SIDE 3: TORTUOSUM" },
            ].map((bone, i) => {
              const bounceY = -20 + Math.abs(Math.sin((f + i * 20) * 0.25)) * -50;
              const rot = Math.sin((f + i * 25) * 0.2) * 20;
              return (
                <KnuckleBoneDice key={i} kx={bone.x} ky={bounceY} rot={rot} label={bone.label} />
              );
            })}
          </g>

          <Hero
            look={MO}
            pose={{
              ...basePose,
              x: 420,
              y: 620,
              scale: 0.95,
              expr: 'cool',
              yaw: 1,
              armL: { a: -30, b: 20 },
              armR: { a: 60 + Math.sin(f * 0.3) * 30, b: 40 },
            }}
            rimId="rimR"
            shadow={0.3}
          />
          <FaceReaction cx={420} cy={530} type="smug" f={f} scale={1.2} />

          <Hero
            look={PIP}
            pose={{
              ...basePose,
              x: 1500,
              y: 620,
              scale: 0.95,
              expr: 'shock',
              yaw: -1,
              armL: { a: 50, b: 30 },
              armR: { a: -30, b: 20 },
            }}
            rimId="rimR"
            shadow={0.3}
          />
          <FaceReaction cx={1500} cy={530} type="panic" f={f} scale={1.2} />
        </g>
      )}

      {/* Sub-scene 2: The Betting Pile with Stickmen (260 - 520 frames) */}
      {f >= 260 && f < 520 && (
        <g>
          <PrehistoricGamingDenBg f={f-260} />
          <AncientHeader epoch="HIGH STAKES" title="What Did Ancient Humans Bet?" subtitle="Arrowheads, mammoth pelts, dried salmon & family fortunes!" f={f-260} />

          {/* 3 Loot Piles between them */}
          <g transform="translate(960 560)">
            <g transform="translate(-380 0)">
              <rect x={-140} y={-90} width={280} height={240} rx={16} fill="#0F172A" opacity={0.92} stroke="#38BDF8" strokeWidth={4} />
              <text x={0} y={-20} fontSize={54} textAnchor="middle">🏹</text>
              <text x={0} y={50} fill="#38BDF8" fontSize={26} fontWeight="bold" textAnchor="middle">
                ARROWHEADS
              </text>
            </g>
            <g transform="translate(0 0)">
              <rect x={-140} y={-90} width={280} height={240} rx={16} fill="#0F172A" opacity={0.92} stroke="#FDE047" strokeWidth={4} />
              <text x={0} y={-20} fontSize={54} textAnchor="middle">🦣</text>
              <text x={0} y={50} fill="#FDE047" fontSize={26} fontWeight="bold" textAnchor="middle">
                MAMMOTH FURS
              </text>
            </g>
            <g transform="translate(380 0)">
              <rect x={-140} y={-90} width={280} height={240} rx={16} fill="#0F172A" opacity={0.92} stroke="#22C55E" strokeWidth={4} />
              <text x={0} y={-20} fontSize={54} textAnchor="middle">🐟</text>
              <text x={0} y={50} fill="#22C55E" fontSize={26} fontWeight="bold" textAnchor="middle">
                DRIED SALMON
              </text>
            </g>
          </g>

          <Hero
            look={MO}
            pose={{
              ...basePose,
              x: 320,
              y: 620,
              scale: 0.95,
              expr: 'smug',
              yaw: 1,
              armL: { a: -20, b: 20 },
              armR: { a: 60, b: 30 },
            }}
            rimId="rimR"
            shadow={0.3}
          />
          <FaceReaction cx={320} cy={530} type="smug" f={f-260} scale={1.2} />

          <Hero
            look={PIP}
            pose={{
              ...basePose,
              x: 1600,
              y: 620,
              scale: 0.95,
              expr: 'worried',
              yaw: -1,
              armL: { a: 60, b: 30 },
              armR: { a: -20, b: 20 },
            }}
            rimId="rimR"
            shadow={0.3}
          />
          <FaceReaction cx={1600} cy={530} type="burnout" f={f-260} scale={1.2} />
        </g>
      )}

      {/* Sub-scene 3: The Royal Game of Ur with Stick Players (520 - 820 frames) */}
      {f >= 520 && f < 820 && (
        <g>
          <PrehistoricGamingDenBg f={f-520} />
          <AncientHeader epoch="4,500 YEARS AGO" title="The Royal Game of Ur" subtitle="The world's oldest board game: Inlaid shell and lapis lazuli" f={f-520} />

          {/* Mosaic Board in Center */}
          <g transform="translate(960 560)">
            <rect x={-400} y={-140} width={800} height={280} rx={16} fill="#312E81" stroke={GOLD} strokeWidth={6} />
            {[-330, -220, -110, 0, 110, 220, 330].map((gx, i) => (
              <rect key={i} x={gx - 45} y={-80} width={90} height={90} fill={i % 2 === 0 ? "#4338CA" : "#6366F1"} />
            ))}
            <circle cx={-150 + Math.sin(f*0.2)*40} cy={-35} r={24} fill="#F43F5E" stroke="#FFFFFF" strokeWidth={3} />
            <circle cx={150 - Math.sin(f*0.2)*40} cy={-35} r={24} fill="#22C55E" stroke="#FFFFFF" strokeWidth={3} />
            <text x={0} y={190} fill="#FDE047" fontSize={34} fontWeight="bold" fontFamily="impact" textAnchor="middle">
              PLAYERS BET HOUSES & FORTUNES ON THIS GAME!
            </text>
          </g>

          <Hero
            look={MO}
            pose={{
              ...basePose,
              x: 420,
              y: 620,
              scale: 0.95,
              expr: 'tired',
              yaw: 1,
              armL: { a: 60, b: 50 },
              armR: { a: -30, b: 20 },
            }}
            rimId="rimR"
            shadow={0.3}
          />
          <FaceReaction cx={420} cy={530} type="burnout" f={f-520} scale={1.1} />

          <Hero
            look={PIP}
            pose={{
              ...basePose,
              x: 1500,
              y: 620,
              scale: 0.95,
              expr: 'worried',
              yaw: -1,
              armL: { a: -30, b: 20 },
              armR: { a: 60, b: 50 },
            }}
            rimId="rimR"
            shadow={0.3}
          />
          <FaceReaction cx={1500} cy={530} type="burnout" f={f-520} scale={1.1} />
        </g>
      )}

      {/* Sub-scene 4: Mo Cheating with his Toe! (820 - 1343 frames) */}
      {f >= 820 && (
        <g>
          <PrehistoricGamingDenBg f={f-820} />
          <Campfire cx={960} cy={820} f={f-820} scale={1.8} />
          <AncientHeader epoch="DRAMA" title="Campfire Cheating Scandals" subtitle="Even 5,000 years ago, players secretly nudged dice with their toes!" f={f-820} />

          <Hero
            look={MO}
            pose={{
              ...basePose,
              x: 560,
              y: 620,
              scale: 0.95,
              expr: 'smug',
              headTilt: 15,
              yaw: 1,
              armL: { a: -30, b: 20 },
              armR: { a: -30, b: 20 },
            }}
            rimId="rimR"
            shadow={0.3}
          />
          <FaceReaction cx={560} cy={530} type="smug" f={f-820} scale={1.2} />
          <g transform="translate(560 450)">
            <text x={0} y={0} fill="#FDE047" fontSize={36} fontWeight="bold" textAnchor="middle">
              🎶 Whistling... 😇
            </text>
          </g>
          <g transform="translate(600 730)">
            <KnuckleBoneDice kx={0} ky={0} rot={30} label="NUDGED!" />
          </g>

          <Hero
            look={PIP}
            pose={{
              ...basePose,
              x: 1360,
              y: 620,
              scale: 0.95,
              expr: 'shock',
              headTilt: -10,
              yaw: -1,
              armL: { a: 110, b: 30 },
              armR: { a: 110, b: 30 },
            }}
            rimId="rimR"
            shadow={0.3}
          />
          <FaceReaction cx={1360} cy={530} type="angry" f={f-820} scale={1.3} />
          <g transform="translate(1360 460)">
            <text x={0} y={0} fill="#EF4444" fontSize={42} fontWeight="bold" fontFamily="impact" textAnchor="middle">
              "YOU CHEATED, MO!!" 😡
            </text>
          </g>
        </g>
      )}
    </g>
  );
};

// ========================================================
// CHAPTER 5: CAVE CINEMA & SHADOW STORIES (1239 frames, ~40.8s)
// ========================================================
export const Chapter5: React.FC<{ f: number }> = ({ f }) => {
  return (
    <g>
      {/* Sub-scene 1: Mo exploring dark Chauvet Cave with torches (0 - 240 frames) */}
      {f < 240 && (
        <g>
          <ChauvetCavernBg f={f} />
          <AncientHeader epoch="CAVE ART" title="The World's First Movie Theater" subtitle="Chauvet Cave, France (36,000 BC): Flickering light creates motion" f={f} />

          <Hero
            look={MO}
            pose={{
              ...basePose,
              x: 960,
              y: 620,
              scale: 0.95,
              expr: 'shock',
              armL: { a: -30, b: 20 },
              armR: { a: 80, b: 30 },
            }}
            rimId="rimR"
            shadow={0.3}
          />
          <FaceReaction cx={960} cy={530} type="awe" f={f} scale={1.2} />

          <g transform="translate(1000 580)">
            <line x1={0} y1={40} x2={0} y2={-30} stroke="#78350F" strokeWidth={10} strokeLinecap="round" />
            <circle cx={0} cy={-30} r={22 + Math.sin(f*0.4)*4} fill="#EA580C" />
            <circle cx={0} cy={-30} r={12} fill="#FDE047" />
          </g>
          <g transform="translate(960 450)">
            <text x={0} y={0} fill="#FFFFFF" fontSize={38} fontWeight="bold" textAnchor="middle">
              EXPLORING DEEP CAVE GALLERIES 🔦
            </text>
          </g>
        </g>
      )}

      {/* Sub-scene 2: Chauvet Cave Art Animation Optical Illusion (240 - 540 frames) */}
      {f >= 240 && f < 540 && (
        <g>
          <ChauvetCavernBg f={f-240} />
          <AncientHeader epoch="OPTICAL ILLUSION" title="Prehistoric Animation" subtitle="Artists painted multiple overlapping legs to simulate galloping in firelight" f={f-240} />

          <ChauvetCaveBison f={f-240} />

          <Hero
            look={MO}
            pose={{
              ...basePose,
              x: 360,
              y: 620,
              scale: 0.95,
              expr: 'happy',
              yaw: 1,
              armL: { a: -30, b: 20 },
              armR: { a: 95 + Math.sin(f * 0.3) * 25, b: 30 },
            }}
            rimId="rimR"
            shadow={0.3}
          />
          <FaceReaction cx={360} cy={530} type="happy" f={f-240} scale={1.2} />

          <g transform={`translate(420 ${560 + Math.sin(f*0.3)*25})`}>
            <line x1={0} y1={50} x2={0} y2={-20} stroke="#78350F" strokeWidth={10} strokeLinecap="round" />
            <circle cx={0} cy={-20} r={26 + Math.sin(f*0.4)*5} fill="#EA580C" />
            <circle cx={0} cy={-20} r={14} fill="#FDE047" />
          </g>

          <Hero
            look={PIP}
            pose={{
              ...basePose,
              x: 1620,
              y: 620,
              scale: 0.9,
              expr: 'shock',
              yaw: -1,
              armL: { a: 70, b: 40 },
              armR: { a: 70, b: 40 },
            }}
            rimId="rimR"
            shadow={0.3}
          />
          <FaceReaction cx={1620} cy={530} type="awe" f={f-240} scale={1.2} />

          <g transform="translate(1620 460)">
            <text x={0} y={0} fill="#FDE047" fontSize={30} fontWeight="bold" textAnchor="middle">
              "IT'S RUNNING!!" 😲
            </text>
          </g>
        </g>
      )}

      {/* Sub-scene 3: Master Storyteller acting with wolf mask (540 - 860 frames) */}
      {f >= 540 && f < 860 && (
        <g>
          <PrehistoricGamingDenBg f={f-540} />
          <Campfire cx={960} cy={820} f={f-540} scale={1.8} />
          <AncientHeader epoch="ORAL TRADITION" title="Master Storytellers" subtitle="Roaring beast imitations & ancestral myths around the fire" f={f-540} />

          <Hero
            look={MO}
            pose={{
              ...basePose,
              x: 960,
              y: 580,
              scale: 1.05,
              expr: 'shock',
              headTilt: -15,
              armL: { a: 110, b: 40 },
              armR: { a: 110, b: 40 },
            }}
            rimId="rimR"
            shadow={0.4}
          />
          <g transform="translate(960 410)">
            <polygon points="-35,-55 0,-85 35,-55" fill="#44403C" />
            <text x={0} y={0} fill="#EF4444" fontSize={42} fontWeight="bold" textAnchor="middle" fontFamily="impact">
              "AND THEN THE SPIRIT ROARED!" 🐺
            </text>
          </g>
        </g>
      )}

      {/* Sub-scene 4: Dopamine Burst in Brain (860 - 1239 frames) */}
      {f >= 860 && (
        <g>
          <GlowingBrainSynapseBg f={f-860} />
          <AncientHeader epoch="NEUROSCIENCE" title="Why We Love Stories" subtitle="Storytelling lights up dopamine, serotonin and empathy in our brains" f={f-860} />

          <Hero
            look={MO}
            pose={{
              ...basePose,
              x: 560,
              y: 620,
              scale: 0.95,
              expr: 'happy',
              armL: { a: 60, b: 30 },
              armR: { a: 60, b: 30 },
            }}
            rimId="rimR"
            shadow={0.3}
          />
          <FaceReaction cx={560} cy={530} type="awe" f={f-860} scale={1.3} />

          <g transform="translate(1320 620)">
            <text x={0} y={0} fill="#FDE047" fontSize={36} fontWeight="bold" fontFamily="impact" textAnchor="middle">
              DOPAMINE BURST: JOY ACTIVATED! 🧠💥
            </text>
          </g>
        </g>
      )}
    </g>
  );
};

// ========================================================
// CHAPTER 6: THE POWER OF JOY & OUTRO (1372 frames, ~45.3s)
// ========================================================
export const Chapter6: React.FC<{ f: number }> = ({ f }) => {
  return (
    <g>
      {/* Sub-scene 1: Ice Age Blizzard vs Warm Tribe (0 - 260 frames) */}
      {f < 260 && (
        <g>
          <ColdBlizzardBg f={f} />
          <Campfire cx={1240} cy={820} f={f} scale={1.8} />
          <AncientHeader epoch="EVOLUTION" title="Joy Was a Survival Tool" subtitle="Without pleasure, human tribes could not survive brutal ice ages" f={f} />

          <Hero
            look={MO}
            pose={{
              ...basePose,
              x: 880,
              y: 620,
              scale: 0.95,
              expr: 'happy',
              armL: { a: 45, b: 30 },
              armR: { a: -30, b: 20 },
            }}
            rimId="rimR"
            shadow={0.3}
          />
          <FaceReaction cx={880} cy={530} type="happy" f={f} scale={1.1} />

          <Hero
            look={PIP}
            pose={{
              ...basePose,
              x: 1420,
              y: 620,
              scale: 0.95,
              expr: 'happy',
              armL: { a: -30, b: 20 },
              armR: { a: 45, b: 30 },
            }}
            rimId="rimR"
            shadow={0.3}
          />
          <FaceReaction cx={1420} cy={530} type="happy" f={f} scale={1.1} />

          <CaveWoman cx={1150} cy={620} f={f} blushing={false} />
        </g>
      )}

      {/* Sub-scene 2: 50,000-Year Legacy Toast Split Screen (260 - 580 frames) */}
      {f >= 260 && f < 580 && (
        <g>
          <EvolutionaryTribeHomeBg f={f-260} />
          <AncientHeader epoch="50,000 YEARS" title="Carrying On The Tradition" subtitle="From ancient campfires to modern living rooms, humans always seek joy" f={f-260} />

          {/* Left: Stone Age Toast */}
          <Campfire cx={480} cy={760} f={f-260} scale={1.2} />
          <Hero
            look={MO}
            pose={{
              ...basePose,
              x: 340,
              y: 600,
              scale: 0.85,
              expr: 'happy',
              armL: { a: 60, b: 40 },
              armR: { a: -30, b: 20 },
            }}
            rimId="rimR"
            shadow={0.3}
          />
          <FaceReaction cx={340} cy={520} type="happy" f={f-260} scale={1.1} />

          {/* Right: Modern Toast */}
          <Hero
            look={PIP}
            pose={{
              ...basePose,
              x: 1380,
              y: 600,
              scale: 0.85,
              expr: 'happy',
              armL: { a: -30, b: 20 },
              armR: { a: 60, b: 40 },
            }}
            rimId="rimR"
            shadow={0.3}
          />
          <FaceReaction cx={1380} cy={520} type="happy" f={f-260} scale={1.1} />
        </g>
      )}

      {/* Sub-scene 3: Mo asking viewer: "How do you relax?" (580 - 900 frames) */}
      {f >= 580 && f < 900 && (
        <g>
          <PrehistoricGamingDenBg f={f-580} />
          <Campfire cx={960} cy={820} f={f-580} scale={1.8} />
          <AncientHeader epoch="QUESTION" title="What is Your Favorite Way to Relax?" subtitle="Tell us in the comments below!" f={f-580} />

          <Hero
            look={MO}
            pose={{
              ...basePose,
              x: 960,
              y: 620,
              scale: 0.95,
              expr: 'happy',
              headTilt: 10,
              armL: { a: 60, b: 40 },
              armR: { a: -40, b: 20 },
            }}
            rimId="rimR"
            shadow={0.3}
          />
          <FaceReaction cx={960} cy={530} type="happy" f={f-580} scale={1.2} />

          <g transform="translate(960 450)">
            <text x={0} y={0} fill="#FDE047" fontSize={38} fontWeight="bold" textAnchor="middle">
              "HOW DO YOU CHILL?" 💬👇
            </text>
          </g>
        </g>
      )}

      {/* Sub-scene 4: Animated YouTube Subscribe & Ringing Bell Outro (900 - 1372 frames) */}
      {f >= 900 && (
        <g>
          <PrehistoricGamingDenBg f={f-900} />

          {/* Animated Subscribe Box */}
          <g transform={`translate(960 420) scale(${1 + Math.sin(f*0.1)*0.03})`}>
            {f < 1120 ? (
              <g>
                <rect x={-320} y={-70} width={640} height={140} rx={30} fill="#EF4444" stroke="#FFFFFF" strokeWidth={4} />
                <text x={0} y={22} fill="#FFFFFF" fontSize={56} fontWeight="bold" fontFamily="impact" textAnchor="middle">
                  ▶ SUBSCRIBE
                </text>
                <g transform="translate(180 30)">
                  <polygon points="0,0 20,45 8,40 0,60 -10,35" fill="#FFFFFF" stroke="#000000" strokeWidth={2} />
                </g>
              </g>
            ) : (
              <g>
                <rect x={-340} y={-70} width={680} height={140} rx={30} fill="#22C55E" stroke="#FFFFFF" strokeWidth={4} />
                <text x={0} y={22} fill="#FFFFFF" fontSize={54} fontWeight="bold" fontFamily="impact" textAnchor="middle">
                  SUBSCRIBED ✅
                </text>
              </g>
            )}
          </g>

          {/* Ringing Golden Bell */}
          <g transform={`translate(960 660) rotate(${Math.sin(f*0.4)*18})`}>
            <circle cx={0} cy={-40} r={16} fill="#F59E0B" />
            <path d="M -50 30 Q -40 -30 0 -40 Q 40 -30 50 30 Z" fill="#FBBF24" stroke="#D97706" strokeWidth={4} />
            <circle cx={0} cy={45} r={16} fill="#D97706" />
            <path d="M -75 0 Q -95 20 -75 40" stroke="#FDE047" strokeWidth={6} strokeLinecap="round" fill="none" />
            <path d="M 75 0 Q 95 20 75 40" stroke="#FDE047" strokeWidth={6} strokeLinecap="round" fill="none" />
          </g>

          {/* Waving Characters */}
          <Hero
            look={MO}
            pose={{
              ...basePose,
              x: 420,
              y: 620,
              scale: 0.95,
              expr: 'happy',
              armL: { a: -20, b: 20 },
              armR: { a: 120 + Math.sin(f * 0.3) * 25, b: 30 },
            }}
            rimId="rimR"
            shadow={0.3}
          />
          <FaceReaction cx={420} cy={530} type="happy" f={f-900} scale={1.2} />

          <Hero
            look={PIP}
            pose={{
              ...basePose,
              x: 1500,
              y: 620,
              scale: 0.95,
              expr: 'happy',
              armL: { a: 120 + Math.sin(f * 0.3) * 25, b: 30 },
              armR: { a: -20, b: 20 },
            }}
            rimId="rimR"
            shadow={0.3}
          />
          <FaceReaction cx={1500} cy={530} type="happy" f={f-900} scale={1.2} />

          <text x={960} y={880} fill="#FDE047" fontSize={38} fontWeight="bold" textAnchor="middle" fontFamily="impact">
            SEE YOU IN THE NEXT WHAT IF ADVENTURE! 🔔🎉
          </text>
        </g>
      )}
    </g>
  );
};

// ========================================================
// 14-SECOND SHORT COMPOSITION (420 frames)
// ========================================================
export const AncientPleasureShort: React.FC<{ f: number }> = ({ f }) => {
  return (
    <g>
      {/* Beat 1: Cold Blizzard Saber-Tooth Hook (0 - 110 frames = ~3.6s) */}
      {f < 110 && (
        <g>
          <ColdBlizzardBg f={f} />
          <AncientHeader epoch="ANCIENT TRUTH" title="Did Stone Age Humans Party?" subtitle="They actually worked LESS than you do today!" f={f} />
          <SaberToothedCat f={f} />
          <Hero
            look={MO}
            pose={walkPose(1350 + Math.sin(f * 0.2) * 40, f * 0.6, 750, 1.05, {
              expr: 'shock',
              yaw: 1,
              tilt: 20,
              look: -1,
              armL: { a: 70 * Math.sin(f * 0.6), b: 40 },
              armR: { a: -70 * Math.sin(f * 0.6), b: 40 },
            }, 1)}
            rimId="rimR"
            shadow={0.4}
          />
          <FaceReaction cx={1350 + Math.sin(f * 0.2) * 40} cy={510} type="panic" f={f} scale={1.2} />
          <g transform="translate(1350 430)">
            <rect x={-160} y={-40} width={320} height={50} rx={12} fill="#0F172A" stroke="#22C55E" strokeWidth={3} />
            <text x={0} y={-6} fill="#FDE047" fontSize={30} fontWeight="bold" fontFamily="impact" textAnchor="middle">
              4 HOURS FREE DAILY! 🕒
            </text>
          </g>
        </g>
      )}

      {/* Beat 2: Fermented Booze & Flutes (110 - 230 frames = ~4s) */}
      {f >= 110 && f < 230 && (
        <g>
          <RomanticStarryCaveBg f={f-110} />
          <AncientHeader epoch="WILD BOOZE" title="Ancient Beer & Bone Flutes" subtitle="Accidental berry wine & 40,000-year-old vulture bone flutes" f={f-110} />
          <Hero
            look={MO}
            pose={{
              ...basePose,
              x: 620,
              y: 620,
              scale: 0.95,
              expr: 'happy',
              armL: { a: -30, b: 20 },
              armR: { a: 60, b: 40 },
            }}
            rimId="rimR"
            shadow={0.3}
          />
          <FaceReaction cx={620} cy={530} type="dizzy" f={f-110} scale={1.2} />
          <CaveWoman cx={1300} cy={620} f={f-110} blushing={true} />
          <FaceReaction cx={1300} cy={500} type="romantic" f={f-110} scale={1.2} />
        </g>
      )}

      {/* Beat 3: Animal Bone Gambling with Mo and Pip (230 - 330 frames = ~3.3s) */}
      {f >= 230 && f < 330 && (
        <g>
          <PrehistoricGamingDenBg f={f-230} />
          <AncientHeader epoch="HIGH STAKES" title="Gambling with Animal Bones" subtitle="Betting mammoth pelts and dried fish on lucky rolls!" f={f-230} />
          <g transform="translate(960 620)">
            {[
              { x: -180, label: "ASTRAGALUS 1" },
              { x: 0, label: "ASTRAGALUS 2" },
              { x: 180, label: "ASTRAGALUS 3" },
            ].map((bone, i) => {
              const bounceY = Math.sin((f + i * 20) * 0.3) * 30;
              const rot = Math.sin((f + i * 15) * 0.2) * 20;
              return (
                <KnuckleBoneDice key={i} kx={bone.x} ky={bounceY} rot={rot} label={bone.label} />
              );
            })}
          </g>
          <Hero
            look={MO}
            pose={{
              ...basePose,
              x: 420,
              y: 620,
              scale: 0.95,
              expr: 'cool',
              armL: { a: -30, b: 20 },
              armR: { a: 75, b: 40 },
            }}
            rimId="rimR"
            shadow={0.3}
          />
          <FaceReaction cx={420} cy={530} type="smug" f={f-230} scale={1.2} />

          <Hero
            look={PIP}
            pose={{
              ...basePose,
              x: 1500,
              y: 620,
              scale: 0.95,
              expr: 'shock',
              armL: { a: 75, b: 40 },
              armR: { a: -30, b: 20 },
            }}
            rimId="rimR"
            shadow={0.3}
          />
          <FaceReaction cx={1500} cy={530} type="angry" f={f-230} scale={1.2} />
        </g>
      )}

      {/* Beat 4: Subscribe Call to Action (330 - 420 frames = ~3s) */}
      {f >= 330 && (
        <g>
          <PrehistoricGamingDenBg f={f-330} />
          <Campfire cx={960} cy={780} f={f-330} scale={1.8} />
          <g transform="translate(960 400)">
            <rect x={-320} y={-60} width={640} height={120} rx={25} fill="#EF4444" stroke="#FFFFFF" strokeWidth={4} />
            <text x={0} y={20} fill="#FFFFFF" fontSize={52} fontWeight="bold" fontFamily="impact" textAnchor="middle">
              ▶ SUBSCRIBE FOR FULL STORY!
            </text>
          </g>
          <Hero
            look={MO}
            pose={{
              ...basePose,
              x: 450,
              y: 620,
              scale: 0.95,
              expr: 'happy',
              armL: { a: 110, b: 30 },
              armR: { a: -20, b: 20 },
            }}
            rimId="rimR"
            shadow={0.3}
          />
          <FaceReaction cx={450} cy={530} type="happy" f={f-330} scale={1.2} />

          <Hero
            look={PIP}
            pose={{
              ...basePose,
              x: 1470,
              y: 620,
              scale: 0.95,
              expr: 'happy',
              armL: { a: -20, b: 20 },
              armR: { a: 110, b: 30 },
            }}
            rimId="rimR"
            shadow={0.3}
          />
          <FaceReaction cx={1470} cy={530} type="happy" f={f-330} scale={1.2} />
        </g>
      )}
    </g>
  );
};
