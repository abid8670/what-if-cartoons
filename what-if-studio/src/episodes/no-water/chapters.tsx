import React from 'react';
import { staticFile } from 'remotion';
import {
  Hero, basePose, clamp, LOOKS, Foreground, Glow,
} from '../../engine';

const PIP = LOOKS.pipHood;
const MO = LOOKS.mo;
const GOLD = '#FBBF24';
const CYAN = '#38BDF8';
const CRIMSON = '#EF4444';
const ORANGE = '#F97316';
const AMBER = '#D97706';

const makePose = (p: any) => ({ ...basePose, ...p });

// ========================================================
// 1. REUSABLE AI BACKGROUND COMPONENT
// ========================================================
export const BgImage: React.FC<{ name: string; opacity?: number }> = ({ name, opacity = 1 }) => (
  <image
    href={staticFile(`no-water/${name}`)}
    x={0}
    y={0}
    width={1920}
    height={1080}
    preserveAspectRatio="xMidYMid slice"
    opacity={opacity}
  />
);

// ========================================================
// 2. ANIMATED FACIAL EXPRESSIONS
// ========================================================
export const WaterFaceReaction: React.FC<{
  cx: number;
  cy: number;
  type: 'terrified' | 'parched' | 'shocked' | 'relieved' | 'confused';
  f: number;
  scale?: number;
}> = ({ cx, cy, type, f, scale = 1 }) => {
  return (
    <g transform={`translate(${cx} ${cy}) scale(${scale})`}>
      {/* 1. TERRIFIED (Wide cartoon eyes, tiny pupils, screaming mouth, flying sweat) */}
      {type === 'terrified' && (
        <g>
          <circle cx={-36} cy={-25 - (f % 20)} r={5} fill="#38BDF8" />
          <circle cx={38} cy={-20 - (f % 16)} r={5} fill="#38BDF8" />
          <ellipse cx={-18} cy={-8} rx={14} ry={16} fill="#FFFFFF" stroke="#0F172A" strokeWidth={3} />
          <ellipse cx={18} cy={-8} rx={14} ry={16} fill="#FFFFFF" stroke="#0F172A" strokeWidth={3} />
          <circle cx={-18 + Math.sin(f * 0.8) * 2} cy={-8} r={5} fill="#0F172A" />
          <circle cx={18 + Math.sin(f * 0.8) * 2} cy={-8} r={5} fill="#0F172A" />
          <ellipse cx={0} cy={16} rx={16} ry={22} fill="#7F1D1D" stroke="#0F172A" strokeWidth={3} />
          <rect x={-10} y={4} width={20} height={8} fill="#FFFFFF" rx={2} />
        </g>
      )}

      {/* 2. PARCHED (Dry cracked lips, tongue hanging out, delirious drooping eyes) */}
      {type === 'parched' && (
        <g transform={`translate(${Math.sin(f * 0.8) * 2} 0)`}>
          <ellipse cx={-16} cy={-6} rx={12} ry={10} fill="#FEF3C7" stroke="#92400E" strokeWidth={3} />
          <ellipse cx={16} cy={-6} rx={12} ry={10} fill="#FEF3C7" stroke="#92400E" strokeWidth={3} />
          <circle cx={-16} cy={-4} r={4} fill="#451A03" />
          <circle cx={16} cy={-4} r={4} fill="#451A03" />
          <path d="M -24 -14 Q -16 -20 -8 -16" stroke="#92400E" strokeWidth={3} fill="none" />
          <path d="M 8 -16 Q 16 -20 24 -14" stroke="#92400E" strokeWidth={3} fill="none" />
          <ellipse cx={0} cy={16} rx={14} ry={10} fill="#92400E" />
          {/* Parched tongue hanging out */}
          <path d="M -6 16 C -6 28 6 28 6 16 Z" fill="#EF4444" stroke="#7F1D1D" strokeWidth={2} />
          <line x1={0} y1={18} x2={0} y2={25} stroke="#7F1D1D" strokeWidth={1.5} />
        </g>
      )}

      {/* 3. SHOCKED (Popping eyes, jaw dropped) */}
      {type === 'shocked' && (
        <g>
          <ellipse cx={-16} cy={-8} rx={15} ry={18} fill="#FFFFFF" stroke="#0F172A" strokeWidth={3.5} />
          <ellipse cx={16} cy={-8} rx={15} ry={18} fill="#FFFFFF" stroke="#0F172A" strokeWidth={3.5} />
          <circle cx={-16} cy={-8} r={4} fill="#0F172A" />
          <circle cx={16} cy={-8} r={4} fill="#0F172A" />
          <ellipse cx={0} cy={22} rx={12} ry={18} fill="#0F172A" />
          <circle cx={-25} cy={-22} r={4} fill="#38BDF8" />
        </g>
      )}

      {/* 4. RELIEVED (Smiling happy eyes, sparkling cheeks) */}
      {type === 'relieved' && (
        <g>
          <path d="M -22 -6 Q -14 -16 -6 -6" stroke="#0F172A" strokeWidth={3.5} fill="none" strokeLinecap="round" />
          <path d="M 6 -6 Q 14 -16 22 -6" stroke="#0F172A" strokeWidth={3.5} fill="none" strokeLinecap="round" />
          <path d="M -16 10 Q 0 24 16 10" stroke="#0F172A" strokeWidth={4} fill="none" strokeLinecap="round" />
          <ellipse cx={-22} cy={4} rx={8} ry={5} fill="#F43F5E" opacity={0.7} />
          <ellipse cx={22} cy={4} rx={8} ry={5} fill="#F43F5E" opacity={0.7} />
          <text x={26} y={-24} fill="#38BDF8" fontSize={26} fontWeight="bold">✦</text>
        </g>
      )}

      {/* 5. CONFUSED */}
      {type === 'confused' && (
        <g>
          <path d="M -20 -18 Q -10 -26 0 -18" stroke="#0F172A" strokeWidth={3.5} fill="none" />
          <path d="M 8 -16 Q 18 -12 24 -16" stroke="#0F172A" strokeWidth={3.5} fill="none" />
          <ellipse cx={-10} cy={-4} rx={8} ry={10} fill="#0F172A" />
          <circle cx={-12} cy={-6} r={3} fill="#FFFFFF" />
          <ellipse cx={14} cy={-4} rx={7} ry={9} fill="#0F172A" />
          <circle cx={12} cy={-6} r={3} fill="#FFFFFF" />
          <path d="M -10 14 Q 2 8 16 12" stroke="#0F172A" strokeWidth={3} fill="none" />
        </g>
      )}
    </g>
  );
};

// ========================================================
// 3. HUD HEADER COMPONENT
// ========================================================
export const WaterHeader: React.FC<{ epoch: string; title: string; subtitle: string; f: number }> = ({
  epoch, title, subtitle, f,
}) => {
  return (
    <g transform="translate(80 60)">
      <rect x={0} y={0} width={820} height={110} rx={22} fill="#0F172A" opacity={0.88} stroke="#F97316" strokeWidth={3} />
      <circle cx={40} cy={40} r={10} fill={CRIMSON} />
      <circle cx={40} cy={40} r={18} fill="none" stroke={CRIMSON} strokeWidth={2} opacity={0.5 + Math.sin(f * 0.2) * 0.5} />
      <text x={70} y={46} fill={GOLD} fontSize={22} fontWeight="bold" letterSpacing={3}>
        {epoch.toUpperCase()}
      </text>
      <text x={40} y={88} fill="#FFFFFF" fontSize={34} fontWeight="900" letterSpacing={1}>
        {title}
      </text>
      <text x={560} y={88} fill={CYAN} fontSize={24} fontWeight="bold">
        {subtitle}
      </text>
    </g>
  );
};

// ========================================================
// CHAPTER 1: THE MORNING VANISH (0 to 1167 frames)
// Word Cuts: 0 -> 305 (Vanish) -> 515 (Shower) -> 690 (Global Pools) -> 939 (1.38B wipe) -> 1167
// ========================================================
export const Chapter1: React.FC<{ f: number }> = ({ f }) => {
  return (
    <g>
      {/* 1. BEAT 1 (0 to 305): Kitchen Interior - Pip standing on floor next to counter, reaching to turn tap */}
      {f < 305 && (
        <g>
          <BgImage name="bg_kitchen.jpg" />
          <WaterHeader epoch="DAY 1 · 07:00 AM" title="THE MORNING VANISH" subtitle="0% WATER COMING OUT" f={f} />
          {/* Pip stands firmly on the kitchen FLOOR at x=440 (NOT inside the sink!) */}
          <g transform={`translate(${clamp(260 + f * 1.2, 260, 480)} 780)`}>
            {/* Soft contact shadow on the floor */}
            <ellipse cx={0} cy={135} rx={55} ry={14} fill="#000000" opacity={0.35} />
            <Hero
              pose={makePose({
                x: 0,
                y: 0,
                scale: 1.15,
                facing: 1,
                expr: 'happy',
                armL: { a: 20 + Math.sin(f * 0.3) * 15, b: 20 },
                armR: { a: -45, b: 50 }, // reaching arm onto counter toward faucet
                legL: { a: Math.sin(f * 0.25) * 20, b: Math.abs(Math.cos(f * 0.25) * 15) },
                legR: { a: -Math.sin(f * 0.25) * 20, b: Math.abs(Math.sin(f * 0.25) * 15) },
              })}
              look={PIP}
            />
            {/* Tall glass in left hand */}
            <g transform="translate(-45 30)">
              <rect x={-12} y={-22} width={24} height={44} rx={5} fill="#E0F2FE" opacity={0.85} stroke="#0284C7" strokeWidth={2.5} />
            </g>
          </g>
        </g>
      )}

      {/* 2. BEAT 2 (305 to 515): Water vanishes - Cinematic Medium Close-Up (Chest-up, legs occluded behind counter) */}
      {f >= 305 && f < 515 && (
        <g>
          <BgImage name="bg_kitchen.jpg" />
          <WaterHeader epoch="DAY 1 · 07:01 AM" title="THE WATER STREAM VANISHES" subtitle="TAP HISSED DRY" f={f} />
          {/* Cinematic Medium Close-up: Pip is behind the island counter, waist-up framing */}
          <g id="pip-medium-shot">
            {/* Clip path so character's lower legs don't awkwardly float on top of counter */}
            <clipPath id="counter-clip">
              <rect x="0" y="0" width="1920" height="740" />
            </clipPath>
            <g clipPath="url(#counter-clip)" transform="translate(620 620)">
              <Hero
                pose={makePose({
                  x: 0,
                  y: 0,
                  scale: 1.45,
                  facing: 1,
                  expr: 'shock',
                  armL: { a: -50, b: 70 },
                  armR: { a: 45, b: 65 },
                })}
                look={PIP}
              />
              <WaterFaceReaction cx={2} cy={-135} type="terrified" f={f} scale={1.4} />
            </g>
          </g>
          {/* Tipped glass on the counter */}
          <g transform="translate(980 720) rotate(55)">
            <rect x={-12} y={-22} width={24} height={44} rx={5} fill="#E0F2FE" opacity={0.85} stroke="#0284C7" strokeWidth={2.5} />
          </g>
          {/* Smoke puff & dry clank alert */}
          <g transform="translate(1080 520)">
            <circle cx={0} cy={0} r={25 + (f % 25) * 2.5} fill="none" stroke="#94A3B8" strokeWidth={4} opacity={1 - (f % 25) / 25} />
            <text x={-40} y={-30} fill="#EF4444" fontSize={36} fontWeight="900">POOF! *CLANK*</text>
          </g>
        </g>
      )}

      {/* 3. BEAT 3 (515 to 690): Rich Bathroom Shower Background - Mo covered in dry soap */}
      {f >= 515 && f < 690 && (
        <g>
          <BgImage name="bg_shower.jpg" />
          <WaterHeader epoch="DAY 1 · 07:05 AM" title="ACROSS TOWN · SHOWER FAILS" subtitle="DRY SOAP CRISIS" f={f} />
          <text x={960} y={260} textAnchor="middle" fill="#EF4444" fontSize={34} fontWeight="900" style={{ filter: 'drop-shadow(0 2px 8px #000)' }}>
            NO WATER COMING OUT!
          </text>
          {/* Mo standing on the shower stall floor with contact shadow */}
          <g transform="translate(960 740)">
            <ellipse cx={0} cy={135} rx={60} ry={15} fill="#000000" opacity={0.35} />
            <Hero
              pose={makePose({
                x: 0,
                y: 0,
                scale: 1.25,
                facing: 1,
                armL: { a: -70 + Math.sin(f * 0.8) * 30, b: 80 },
                armR: { a: 70 - Math.sin(f * 0.8) * 30, b: 80 },
              })}
              look={MO}
            />
            <WaterFaceReaction cx={0} cy={-130} type="terrified" f={f} scale={1.25} />
            {/* White soap suds */}
            <circle cx={-30} cy={-150} r={14} fill="#FFFFFF" opacity={0.9} />
            <circle cx={35} cy={-140} r={18} fill="#FFFFFF" opacity={0.9} />
            <circle cx={-15} cy={-20} r={22} fill="#FFFFFF" opacity={0.9} />
            <circle cx={25} cy={-10} r={16} fill="#FFFFFF" opacity={0.9} />
          </g>
        </g>
      )}

      {/* 4. BEAT 4 (690 to 939): Rich Suburban Backyard with Empty Swimming Pool */}
      {f >= 690 && f < 939 && (
        <g>
          <BgImage name="bg_pool.jpg" />
          <WaterHeader epoch="DAY 1 · 07:15 AM" title="WORLDWIDE PANIC" subtitle="ALL RESERVES DRIED UP" f={f} />
          {/* Pip standing on the poolside patio with shadow */}
          <g transform="translate(420 720)">
            <ellipse cx={0} cy={130} rx={55} ry={14} fill="#000000" opacity={0.4} />
            <Hero pose={makePose({ x: 0, y: 0, scale: 1.2, facing: 1, armL: { a: 20, b: 30 }, armR: { a: -60, b: 70 } })} look={PIP} />
            <WaterFaceReaction cx={0} cy={-120} type="shocked" f={f} scale={1.2} />
          </g>
          {/* Pool Alert Banner */}
          <g transform="translate(960 880)">
            <rect x={-320} y={-45} width={640} height={90} rx={18} fill="#0F172A" opacity={0.92} stroke="#38BDF8" strokeWidth={3} />
            <text x={0} y={12} textAnchor="middle" fill="#FFFFFF" fontSize={32} fontWeight="900">
              🏊 CRACKED EMPTY POOL RESERVOIRS
            </text>
          </g>
        </g>
      )}

      {/* 5. BEAT 5 (939 to 1167): 1.38 Billion Cubic Kilometers Wiped Off Earth */}
      {f >= 939 && (
        <g>
          <rect x={0} y={0} width={1920} height={1080} fill="#020617" />
          <WaterHeader epoch="DAY 1 · 07:30 AM" title="1.38 BILLION KM³ WIPED" subtitle="GLOBAL HYDROSPHERE = 0%" f={f} />
          {/* Earth Hologram */}
          <g transform="translate(960 560)">
            <circle cx={0} cy={0} r={240} fill="#1E293B" stroke="#EF4444" strokeWidth={8} />
            <circle cx={0} cy={0} r={265 + Math.sin(f * 0.2) * 10} fill="none" stroke="#EF4444" strokeWidth={3} opacity={0.6} />
            <text x={0} y={-40} textAnchor="middle" fill="#FFFFFF" fontSize={38} fontWeight="900">TOTAL WATER EXTINCTION</text>
            <text x={0} y={30} textAnchor="middle" fill={GOLD} fontSize={64} fontWeight="900">0.00%</text>
            <text x={0} y={80} textAnchor="middle" fill={CRIMSON} fontSize={28} fontWeight="bold">1.38 BILLION KM³ GONE</text>
          </g>
        </g>
      )}
    </g>
  );
};

// ========================================================
// CHAPTER 2: THE OCEAN ABYSS (0 to 1323 frames)
// Word Cuts: 0 -> 366 (Canyon) -> 634 (Ship snap) -> 903 (Salt flats) -> 1145 (Sunlight) -> 1323
// ========================================================
export const Chapter2: React.FC<{ f: number }> = ({ f }) => {
  return (
    <g>
      {/* 1. BEAT 1 (0 to 366): Planetary map transforms / 71% ocean drained */}
      {f < 366 && (
        <g>
          <rect x={0} y={0} width={1920} height={1080} fill="#0F172A" />
          <WaterHeader epoch="HOUR 0.5 · PACIFIC BASIN" title="71% OF EARTH EMPTY" subtitle="332 MILLION CUBIC MILES GONE" f={f} />
          {/* World ocean drain visual */}
          <g transform="translate(960 540)">
            <ellipse cx={0} cy={0} rx={500} ry={280} fill="#1E293B" stroke="#38BDF8" strokeWidth={6} />
            {/* Draining water level animation */}
            <rect x={-500} y={-280 + clamp(f * 1.5, 0, 560)} width={1000} height={560} fill="#0284C7" opacity={0.3} />
            <text x={0} y={0} textAnchor="middle" fill="#FFFFFF" fontSize={52} fontWeight="900">PACIFIC & ATLANTIC EMPTY</text>
            <text x={0} y={60} textAnchor="middle" fill={GOLD} fontSize={32} fontWeight="bold">TURNING INTO 3-MILE DEEP TRENCHES</text>
          </g>
        </g>
      )}

      {/* 2. BEAT 2 (366 to 634): Rich Ocean Abyss Background - Mariana Trench 36,000 ft drop */}
      {f >= 366 && f < 634 && (
        <g>
          <BgImage name="bg_ocean.jpg" />
          <WaterHeader epoch="HOUR 1 · MARIANA TRENCH" title="THE 36,000-FOOT ABYSS" subtitle="MILES-DEEP BARREN CANYONS" f={f} />
          {/* Pip standing at the canyon ledge */}
          <g transform="translate(380 620)">
            <ellipse cx={0} cy={130} rx={55} ry={15} fill="#000000" opacity={0.4} />
            <Hero pose={makePose({ x: 0, y: 0, scale: 1.2, facing: 1, armL: { a: -50, b: 70 }, armR: { a: -40, b: 60 } })} look={PIP} />
            <WaterFaceReaction cx={0} cy={-120} type="shocked" f={f} scale={1.2} />
            {/* Binoculars */}
            <rect x={40} y={-130} width={40} height={20} rx={6} fill="#0F172A" stroke="#FBBF24" strokeWidth={3} />
          </g>
          <text x={480} y={780} fill="#FFFFFF" fontSize={34} fontWeight="900" style={{ filter: 'drop-shadow(0 2px 8px #000)' }}>
            36,000 FEET DROP TO CRUST!
          </text>
        </g>
      )}

      {/* 3. BEAT 3 (634 to 903): Cargo ship falling and snapping in half on jagged rocks */}
      {f >= 634 && f < 903 && (
        <g>
          <BgImage name="bg_ocean.jpg" />
          <WaterHeader epoch="HOUR 2 · SEABED CRASH" title="CARGO SHIPS SNAPPED" subtitle="100,000-TON CRUSH" f={f} />
          {/* Snapped cargo ship with spark bursts */}
          <g transform="translate(1100 680) rotate(-15)">
            <polygon points="-180,60 180,60 140,-50 -140,-50" fill="#B91C1C" stroke="#0F172A" strokeWidth={6} />
            <rect x={-80} y={-120} width={120} height={70} fill="#FFFFFF" stroke="#0F172A" strokeWidth={4} />
            {/* Snap crack line */}
            <line x1={0} y1={-120} x2={20} y2={60} stroke="#FEF08A" strokeWidth={8} />
            <text x={-60} y={-140} fill="#EF4444" fontSize={42} fontWeight="900">SNAP! 💥</text>
          </g>
          {/* Floating dust & spark particles */}
          {Array.from({ length: 10 }).map((_, i) => (
            <circle key={i} cx={1050 + Math.sin(f * 0.4 + i) * 60} cy={640 - (f * 1.5 + i * 20) % 120} r={5} fill="#FDE047" />
          ))}
        </g>
      )}

      {/* 4. BEAT 4 (903 to 1145): Stranded marine life & toxic salt flats */}
      {f >= 903 && f < 1145 && (
        <g>
          <BgImage name="bg_ocean.jpg" />
          <WaterHeader epoch="HOUR 4 · DRY SEABED" title="VAST TOXIC SALT FLATS" subtitle="CORAL REEFS DESICCATED" f={f} />
          {/* Warning banner */}
          <rect x={560} y={780} width={800} height={100} rx={18} fill="#0F172A" opacity={0.9} stroke="#FBBF24" strokeWidth={3} />
          <text x={960} y={845} textAnchor="middle" fill="#FBBF24" fontSize={36} fontWeight="900">
            ⚠️ 100% MARINE ECOSYSTEM EXTINCTION
          </text>
        </g>
      )}

      {/* 5. BEAT 5 (1145 to 1323): Ocean floor illuminated by bright sunlight for first time in billions of years */}
      {f >= 1145 && (
        <g>
          <BgImage name="bg_ocean.jpg" />
          <WaterHeader epoch="HOUR 6 · SUNLIT ABYSS" title="ANCIENT SEABED UNCOVERED" subtitle="EXPOSED TO SUNLIGHT" f={f} />
          {/* Pip walking on the dry seabed */}
          <g transform={`translate(${clamp(300 + (f - 1145) * 3, 300, 960)} 680)`}>
            <ellipse cx={0} cy={130} rx={55} ry={14} fill="#000000" opacity={0.4} />
            <Hero
              pose={makePose({
                x: 0,
                y: 0,
                scale: 1.15,
                facing: 1,
                armL: { a: 25 * Math.sin(f * 0.2), b: 20 },
                armR: { a: -25 * Math.sin(f * 0.2), b: 20 },
                legL: { a: 30 * Math.sin(f * 0.2), b: 20 },
                legR: { a: -30 * Math.sin(f * 0.2), b: 20 },
              })}
              look={PIP}
            />
            <WaterFaceReaction cx={0} cy={-120} type="shocked" f={f} scale={1.15} />
          </g>
        </g>
      )}
    </g>
  );
};

// ========================================================
// CHAPTER 3: TECTONIC COLLAPSE & VOLCANISM (0 to 1266 frames)
// Word Cuts: 0 -> 317 (Lifted) -> 544 (Spring) -> 740 (Rupture) -> 1051 (Hellscape) -> 1266
// ========================================================
export const Chapter3: React.FC<{ f: number }> = ({ f }) => {
  return (
    <g>
      {/* 1. BEAT 1 (0 to 317): Hydrostatic Pressure Lifting Gauge */}
      {f < 317 && (
        <g>
          <rect x={0} y={0} width={1920} height={1080} fill="#020617" />
          <WaterHeader epoch="HOUR 12 · GEOPHYSICS" title="1.4 QUINTILLION TONS LIFTED" subtitle="OCEAN PRESSURE VANISHED" f={f} />
          {/* Tectonic Pressure Meter */}
          <g transform="translate(960 560)">
            <circle cx={0} cy={0} r={220} fill="#0F172A" stroke="#EF4444" strokeWidth={8} />
            <text x={0} y={-80} textAnchor="middle" fill="#94A3B8" fontSize={28} fontWeight="bold">OCEANIC HYDROSTATIC LOAD</text>
            <text x={0} y={10} textAnchor="middle" fill="#FFFFFF" fontSize={72} fontWeight="900">0.00 PSI</text>
            <text x={0} y={70} textAnchor="middle" fill={CRIMSON} fontSize={32} fontWeight="bold">PRESSURE DROP: -100%</text>
            <path d="M -140 130 L 140 130" stroke="#EF4444" strokeWidth={6} />
            <polygon points="130,120 155,130 130,140" fill="#EF4444" />
          </g>
        </g>
      )}

      {/* 2. BEAT 2 (317 to 544): Seabed rebounds upward like a compressed spring */}
      {f >= 317 && f < 544 && (
        <g transform={`translate(${Math.sin(f * 0.8) * 6} ${Math.cos(f * 0.9) * 4})`}>
          <BgImage name="bg_volcano.jpg" />
          <WaterHeader epoch="HOUR 18 · CRUSTAL REBOUND" title="SEABED REBOUNDS UPWARD" subtitle="EARTHQUAKES RUMBLE" f={f} />
          {/* Rebounding arrows */}
          <g transform="translate(960 700)">
            <text x={0} y={0} textAnchor="middle" fill={GOLD} fontSize={54} fontWeight="900" style={{ filter: 'drop-shadow(0 4px 12px #000)' }}>
              ⬆️ MANTLE SPRING REBOUND ⬆️
            </text>
          </g>
        </g>
      )}

      {/* 3. BEAT 3 (544 to 740): Ring of Fire ruptures / Glowing magma cracks */}
      {f >= 544 && f < 740 && (
        <g transform={`translate(${Math.sin(f * 0.9) * 8} 0)`}>
          <BgImage name="bg_volcano.jpg" />
          <WaterHeader epoch="HOUR 24 · RING OF FIRE" title="TECTONIC PLATES CRACK OPEN" subtitle="MAGMA FISSURES UNSEALED" f={f} />
          {/* Pip running away in sheer terror */}
          <g transform={`translate(${clamp(400 + (f - 544) * 4.5, 400, 1500)} 680)`}>
            <ellipse cx={0} cy={130} rx={55} ry={14} fill="#000000" opacity={0.45} />
            <Hero
              pose={makePose({
                x: 0,
                y: 0,
                scale: 1.25,
                facing: 1,
                armL: { a: 40 * Math.sin(f * 0.5), b: 60 },
                armR: { a: -40 * Math.sin(f * 0.5), b: 60 },
                legL: { a: 50 * Math.sin(f * 0.5), b: 40 },
                legR: { a: -50 * Math.sin(f * 0.5), b: 40 },
              })}
              look={PIP}
            />
            <WaterFaceReaction cx={0} cy={-120} type="terrified" f={f} scale={1.3} />
          </g>
        </g>
      )}

      {/* 4. BEAT 4 (740 to 1051): Massive Volcanic Eruptions & Ash Plumes */}
      {f >= 740 && f < 1051 && (
        <g>
          <BgImage name="bg_volcano.jpg" />
          <WaterHeader epoch="HOUR 36 · STRATOSPHERE" title="VOLCANIC MAGMA FOUNTAINS" subtitle="ASH PLUMES & SULFUR" f={f} />
          {/* Glowing embers rising */}
          {Array.from({ length: 20 }).map((_, i) => (
            <circle
              key={i}
              cx={300 + (i * 75 + Math.sin(f * 0.2 + i) * 30) % 1400}
              cy={1000 - ((f * 4 + i * 45) % 900)}
              r={4 + (i % 4)}
              fill={i % 2 === 0 ? '#F97316' : '#EF4444'}
              opacity={0.8}
            />
          ))}
          <text x={960} y={850} textAnchor="middle" fill="#FFFFFF" fontSize={38} fontWeight="900" style={{ filter: 'drop-shadow(0 2px 10px #000)' }}>
            SUPERHEATED LAVA FLOODS THE OCEAN BED
          </text>
        </g>
      )}

      {/* 5. BEAT 5 (1051 to 1266): Earth is an active volcanic hellscape */}
      {f >= 1051 && (
        <g>
          <BgImage name="bg_volcano.jpg" />
          <WaterHeader epoch="HOUR 48 · APOCALYPSE" title="PLANETARY VOLCANIC HELLSCAPE" subtitle="ZERO OCEAN LUBRICATION" f={f} />
          {/* Alert Callout */}
          <g transform="translate(960 560)">
            <rect x={-350} y={-60} width={700} height={120} rx={20} fill="#0F172A" opacity={0.92} stroke="#EF4444" strokeWidth={4} />
            <text x={0} y={15} textAnchor="middle" fill={GOLD} fontSize={40} fontWeight="900">
              EARTH HAS BECOME VENUS! 🌋
            </text>
          </g>
        </g>
      )}
    </g>
  );
};

// ========================================================
// CHAPTER 4: 60°C HEATWAVE & CLIMATE COLLAPSE (0 to 1330 frames)
// Word Cuts: 0 -> 204 (Zero clouds) -> 655 (60C Heat) -> 770 (Melt cars) -> 956 (Freezing Night) -> 1218 (Mercury) -> 1330
// ========================================================
export const Chapter4: React.FC<{ f: number }> = ({ f }) => {
  return (
    <g>
      {/* 1. BEAT 1 (0 to 204): Global climate collapse / 0% clouds / 0% rain */}
      {f < 204 && (
        <g>
          <rect x={0} y={0} width={1920} height={1080} fill="#0F172A" />
          <WaterHeader epoch="DAY 1 · METEOROLOGY" title="CLIMATE SYSTEM COLLAPSES" subtitle="0% CLOUDS · 0% RAIN" f={f} />
          <g transform="translate(960 540)">
            <circle cx={0} cy={0} r={180} fill="#1E293B" stroke="#FBBF24" strokeWidth={6} />
            <text x={0} y={-30} textAnchor="middle" fill="#94A3B8" fontSize={32} fontWeight="bold">CLOUD FORMATION</text>
            <text x={0} y={40} textAnchor="middle" fill={GOLD} fontSize={68} fontWeight="900">0.00%</text>
            <text x={0} y={90} textAnchor="middle" fill="#EF4444" fontSize={26} fontWeight="bold">NO WATER VAPOR</text>
          </g>
        </g>
      )}

      {/* 2. BEAT 2 (204 to 655): Rich Scorched City Street - 60°C Heatwave & Parched Pip */}
      {f >= 204 && f < 655 && (
        <g>
          <BgImage name="bg_city.jpg" />
          <WaterHeader epoch="DAY 1 · NOON (12:00 PM)" title="60°C SCORCHING HEATWAVE" subtitle="SOLAR RADIATION SPIKE" f={f} />
          {/* Heatwave shimmering mirage lines */}
          {Array.from({ length: 6 }).map((_, i) => (
            <path
              key={i}
              d={`M 0 ${750 + i * 40} Q 480 ${740 + Math.sin(f * 0.3 + i) * 15} 960 ${750 + i * 40} T 1920 ${750 + i * 40}`}
              stroke="#FEF08A"
              strokeWidth={3}
              fill="none"
              opacity={0.35}
            />
          ))}
          {/* Pip dragging forward in the heat */}
          <g transform="translate(960 700)">
            <ellipse cx={0} cy={130} rx={60} ry={15} fill="#000000" opacity={0.4} />
            <Hero
              pose={makePose({
                x: 0,
                y: 0,
                scale: 1.25,
                facing: 1,
                armL: { a: 20, b: 30 },
                armR: { a: 30, b: 30 },
                legL: { a: 15, b: 10 },
                legR: { a: -15, b: 10 },
              })}
              look={PIP}
            />
            <WaterFaceReaction cx={0} cy={-120} type="parched" f={f} scale={1.3} />
          </g>
        </g>
      )}

      {/* 3. BEAT 3 (655 to 770): Melting asphalt highway & blistered car hoods */}
      {f >= 655 && f < 770 && (
        <g>
          <BgImage name="bg_city.jpg" />
          <WaterHeader epoch="DAY 1 · 02:00 PM" title="PAVEMENT MELTS AT 60°C" subtitle="CARS BLISTER WITH HEAT" f={f} />
          {/* Melt alert */}
          <g transform="translate(960 620)">
            <rect x={-320} y={-60} width={640} height={120} rx={18} fill="#0F172A" opacity={0.92} stroke="#F97316" strokeWidth={4} />
            <text x={0} y={15} textAnchor="middle" fill="#FFFFFF" fontSize={38} fontWeight="900">
              🔥 ASPHALT LIQUEFIES: +60°C (140°F)
            </text>
          </g>
        </g>
      )}

      {/* 4. BEAT 4 (770 to 956): Night falls! Sub-zero freezing drop (-25°C) */}
      {f >= 770 && f < 956 && (
        <g>
          <rect x={0} y={0} width={1920} height={1080} fill="#020617" />
          <WaterHeader epoch="DAY 1 · MIDNIGHT" title="SUB-ZERO FREEZE DROP" subtitle="NO THERMAL BLANKET" f={f} />
          {/* Shivering Pip in deep freeze */}
          <g transform={`translate(${960 + Math.sin(f * 1.2) * 5} 660)`}>
            <ellipse cx={0} cy={130} rx={55} ry={14} fill="#000000" opacity={0.4} />
            <Hero
              pose={makePose({
                x: 0,
                y: 0,
                scale: 1.2,
                facing: 1,
                armL: { a: -70, b: 90 },
                armR: { a: -70, b: 90 },
              })}
              look={PIP}
            />
            <WaterFaceReaction cx={0} cy={-120} type="terrified" f={f} scale={1.2} />
            {/* Freezing breath / ice crystals */}
            <text x={-140} y={-140} fill="#38BDF8" fontSize={32} fontWeight="bold">BRRR! -25°C ❄️</text>
          </g>
        </g>
      )}

      {/* 5. BEAT 5 (956 to 1330): The Mercury wild swing paradox */}
      {f >= 956 && (
        <g>
          <rect x={0} y={0} width={1920} height={1080} fill="#0F172A" />
          <WaterHeader epoch="DAY 2 · ATMOSPHERE" title="SWINGING LIKE MERCURY" subtitle="FROM +60°C TO -30°C" f={f} />
          <g transform="translate(640 560)">
            <rect x={-200} y={-100} width={400} height={200} rx={20} fill="#1E293B" stroke="#F97316" strokeWidth={5} />
            <text x={0} y={-30} textAnchor="middle" fill="#FFFFFF" fontSize={30} fontWeight="bold">DAYTIME HEAT</text>
            <text x={0} y={40} textAnchor="middle" fill="#EF4444" fontSize={54} fontWeight="900">+60°C</text>
          </g>
          <g transform="translate(1280 560)">
            <rect x={-200} y={-100} width={400} height={200} rx={20} fill="#1E293B" stroke="#38BDF8" strokeWidth={5} />
            <text x={0} y={-30} textAnchor="middle" fill="#FFFFFF" fontSize={30} fontWeight="bold">NIGHTTIME FREEZE</text>
            <text x={0} y={40} textAnchor="middle" fill="#38BDF8" fontSize={54} fontWeight="900">-30°C</text>
          </g>
        </g>
      )}
    </g>
  );
};

// ========================================================
// CHAPTER 5: BIOLOGICAL COUNTDOWN & CONTINENTAL WILDFIRES (0 to 1316 frames)
// Word Cuts: 0 -> 273 (Blood sludge) -> 563 (Delirium) -> 907 (Mega-Wildfires) -> 1218 (100h Extinction) -> 1316
// ========================================================
export const Chapter5: React.FC<{ f: number }> = ({ f }) => {
  return (
    <g>
      {/* 1. BEAT 1 (0 to 273): Body water composition countdown */}
      {f < 273 && (
        <g>
          <rect x={0} y={0} width={1920} height={1080} fill="#020617" />
          <WaterHeader epoch="DAY 3 · HUMAN BIOLOGY" title="THE 72-HOUR CLOCK RUNS OUT" subtitle="BODY = 60% WATER" f={f} />
          <g transform="translate(960 560)">
            <rect x={-400} y={-120} width={800} height={240} rx={22} fill="#0F172A" stroke="#EF4444" strokeWidth={4} />
            <text x={0} y={-50} textAnchor="middle" fill="#FFFFFF" fontSize={34} fontWeight="900">CELLULAR DEHYDRATION</text>
            <text x={-250} y={20} fill="#38BDF8" fontSize={28} fontWeight="bold">BRAIN: 75% H2O</text>
            <text x={0} y={20} textAnchor="middle" fill="#EF4444" fontSize={28} fontWeight="bold">BLOOD: 90% H2O</text>
            <text x={250} y={20} textAnchor="end" fill={GOLD} fontSize={28} fontWeight="bold">BODY: 60% H2O</text>
            <text x={0} y={80} textAnchor="middle" fill="#FEF08A" fontSize={36} fontWeight="900">STATUS: CRITICAL FAILURE</text>
          </g>
        </g>
      )}

      {/* 2. BEAT 2 (273 to 563): Blood thickens into sluggish engine-oil sludge */}
      {f >= 273 && f < 563 && (
        <g>
          <rect x={0} y={0} width={1920} height={1080} fill="#1E1E2E" />
          <WaterHeader epoch="DAY 3 · 04:00 PM" title="BLOOD TURNS TO SLUDGE" subtitle="HEART STRAINS VIOLENTLY" f={f} />
          {/* Collapsing Pip holding chest */}
          <g transform="translate(960 660)">
            <ellipse cx={0} cy={120} rx={60} ry={15} fill="#000000" opacity={0.4} />
            <Hero pose={makePose({ x: 0, y: 0, scale: 1.25, facing: 1, armL: { a: -50, b: 70 }, armR: { a: -30, b: 60 } })} look={PIP} />
            <WaterFaceReaction cx={0} cy={-120} type="parched" f={f} scale={1.3} />
            {/* Heartbeat pulse */}
            <circle cx={-10} cy={-40} r={20 + Math.sin(f * 0.4) * 8} fill="#EF4444" opacity={0.7} />
          </g>
        </g>
      )}

      {/* 3. BEAT 3 (563 to 907): Delirium, kidney failure, trees turn into kindling */}
      {f >= 563 && f < 907 && (
        <g>
          <BgImage name="bg_wildfire.jpg" />
          <WaterHeader epoch="DAY 3 · 08:00 PM" title="FORESTS TURN TO TINDER" subtitle="DELIRIUM SETS IN" f={f} />
          <g transform="translate(960 680)">
            <ellipse cx={0} cy={120} rx={60} ry={14} fill="#000000" opacity={0.4} />
            <Hero pose={makePose({ x: 0, y: 0, scale: 1.2, facing: 1, armL: { a: 10, b: 20 }, armR: { a: 10, b: 20 } })} look={PIP} />
            <WaterFaceReaction cx={0} cy={-110} type="parched" f={f} scale={1.3} />
          </g>
        </g>
      )}

      {/* 4. BEAT 4 (907 to 1218): Rich Continental Mega-Wildfires Environment */}
      {f >= 907 && f < 1218 && (
        <g>
          <BgImage name="bg_wildfire.jpg" />
          <WaterHeader epoch="DAY 3 · CONTINENTAL WILDFIRES" title="MEGA-WILDFIRES CONSUME EARTH" subtitle="FIRESTORMS OF ASH" f={f} />
          {/* Roaring fire sparks */}
          {Array.from({ length: 25 }).map((_, i) => (
            <circle
              key={i}
              cx={200 + (i * 70 + Math.sin(f * 0.3 + i) * 40) % 1500}
              cy={1050 - ((f * 5 + i * 50) % 800)}
              r={5 + (i % 5)}
              fill={i % 3 === 0 ? '#FBBF24' : '#EF4444'}
              opacity={0.85}
            />
          ))}
          <text x={960} y={880} textAnchor="middle" fill="#FFFFFF" fontSize={42} fontWeight="900" style={{ filter: 'drop-shadow(0 2px 12px #000)' }}>
            🔥 FORESTS & RAINFORESTS CONSUMED IN MINUTES
          </text>
        </g>
      )}

      {/* 5. BEAT 5 (1218 to 1316): 100-Hour Biological Extinction Limit */}
      {f >= 1218 && (
        <g>
          <BgImage name="bg_wildfire.jpg" />
          <WaterHeader epoch="EXTINCTION THRESHOLD" title="100 HOURS MAXIMUM SURVIVAL" subtitle="LIFE CANNOT CONTINUE" f={f} />
          <g transform="translate(960 560)">
            <rect x={-320} y={-60} width={640} height={120} rx={20} fill="#0F172A" opacity={0.92} stroke="#EF4444" strokeWidth={4} />
            <text x={0} y={15} textAnchor="middle" fill={GOLD} fontSize={42} fontWeight="900">
              💀 100-HOUR BIOLOGICAL LIMIT
            </text>
          </g>
        </g>
      )}
    </g>
  );
};

// ========================================================
// CHAPTER 6: DESOLATE MARS, AWAKENING & OUTRO (0 to 1467 frames)
// Word Cuts: 0 -> 187 (Mars collapse) -> 442 (Jolts awake) -> 674 (Cold glass) -> 953 (Delicious gulp) -> 1288 (Subscribe) -> 1467
// ========================================================
export const Chapter6: React.FC<{ f: number }> = ({ f }) => {
  return (
    <g>
      {/* 1. BEAT 1 (0 to 187): Desolate Mars-like Earth Environment */}
      {f < 187 && (
        <g>
          <BgImage name="bg_mars.jpg" />
          <WaterHeader epoch="DAY 7 · POST-WATER EARTH" title="IDENTICAL TO MARS" subtitle="A RED DESERT WORLD" f={f} />
          {/* Swirling red dust clouds */}
          {Array.from({ length: 15 }).map((_, i) => (
            <ellipse
              key={i}
              cx={200 + (f * 6 + i * 120) % 1920}
              cy={600 + Math.sin(f * 0.1 + i) * 60}
              rx={120}
              ry={35}
              fill="#B45309"
              opacity={0.3}
            />
          ))}
        </g>
      )}

      {/* 2. BEAT 2 (187 to 442): Pip collapses on the cracked red earth gasping */}
      {f >= 187 && f < 442 && (
        <g>
          <BgImage name="bg_mars.jpg" />
          <WaterHeader epoch="DAY 7 · FINAL BREATH" title="PIP COLLAPSES ON CRACKED DIRT" subtitle="GASPING FOR BREATH" f={f} />
          <g transform="translate(960 720)">
            <ellipse cx={0} cy={80} rx={75} ry={18} fill="#000000" opacity={0.45} />
            <Hero pose={makePose({ x: 0, y: 0, scale: 1.15, facing: 1, armL: { a: 70, b: 40 }, armR: { a: 80, b: 30 } })} look={PIP} />
            <WaterFaceReaction cx={0} cy={-110} type="parched" f={f} scale={1.25} />
          </g>
        </g>
      )}

      {/* 3. BEAT 3 (442 to 674): SUDDEN JOLT AWAKE IN BEDROOM! */}
      {f >= 442 && f < 674 && (
        <g>
          <BgImage name="bg_bedroom.jpg" />
          <WaterHeader epoch="TUESDAY · 06:59 AM" title="SUDDENLY... PIP JOLTS AWAKE!" subtitle="IT WAS A THOUGHT EXPERIMENT" f={f} />
          {/* Buzzing alarm clock */}
          <g transform="translate(1380 620)">
            <text x={0} y={-30} textAnchor="middle" fill="#EF4444" fontSize={30} fontWeight="900">BUZZZZ! ⏰</text>
          </g>
          {/* Pip sitting up in shock and relief */}
          <g transform="translate(860 620)">
            <Hero pose={makePose({ x: 0, y: 0, scale: 1.25, facing: 1, armL: { a: -30, b: 40 }, armR: { a: -30, b: 40 } })} look={PIP} />
            <WaterFaceReaction cx={0} cy={-120} type="shocked" f={f} scale={1.25} />
          </g>
        </g>
      )}

      {/* 4. BEAT 4 (674 to 953): Cold condensation-covered glass of water on nightstand */}
      {f >= 674 && f < 953 && (
        <g>
          <BgImage name="bg_bedroom.jpg" />
          <WaterHeader epoch="THE MIRACLE MOLECULE" title="COLD GLASS OF FRESH WATER" subtitle="CONDENSATION DRIPPING" f={f} />
          {/* Close-up on Pip looking at the fresh glass */}
          <g transform="translate(880 620)">
            <Hero pose={makePose({ x: 0, y: 0, scale: 1.25, facing: 1, armL: { a: -60, b: 60 }, armR: { a: -50, b: 50 } })} look={PIP} />
            <WaterFaceReaction cx={0} cy={-120} type="relieved" f={f} scale={1.25} />
          </g>
        </g>
      )}

      {/* 5. BEAT 5 (953 to 1288): Deep delicious gulp with pure gratitude! */}
      {f >= 953 && f < 1288 && (
        <g>
          <BgImage name="bg_bedroom.jpg" />
          <WaterHeader epoch="PURE GRATITUDE" title="DELICIOUS COLD GULP" subtitle="WATER IS LIFE ITSELF" f={f} />
          {/* Pip drinking happily with sparkles */}
          <g transform="translate(920 620)">
            <Hero pose={makePose({ x: 0, y: 0, scale: 1.25, facing: 1, armL: { a: -80, b: 80 }, armR: { a: -80, b: 80 } })} look={PIP} />
            <WaterFaceReaction cx={0} cy={-120} type="relieved" f={f} scale={1.3} />
            <text x={70} y={-140} fill="#38BDF8" fontSize={42} fontWeight="900">*GULP!* ✦</text>
          </g>
        </g>
      )}

      {/* 6. BEAT 6 (1288 to 1467): Outro & Animated Subscribe Button & Bell */}
      {f >= 1288 && (
        <g>
          <BgImage name="bg_bedroom.jpg" />
          {/* Outro CTA Card */}
          <g transform="translate(960 480)">
            <rect x={-450} y={-160} width={900} height={320} rx={28} fill="#0F172A" opacity={0.94} stroke={GOLD} strokeWidth={5} />
            <text x={0} y={-80} textAnchor="middle" fill="#FFFFFF" fontSize={38} fontWeight="900">
              DID THIS BLOW YOUR MIND?
            </text>
            <text x={0} y={-35} textAnchor="middle" fill={CYAN} fontSize={26} fontWeight="bold">
              Join What If Studio for Weekly Science Adventures!
            </text>

            {/* Subscribe Button */}
            <g transform="translate(-180 60)">
              <rect x={-140} y={-40} width={280} height={80} rx={20} fill="#EF4444" stroke="#FFFFFF" strokeWidth={3} />
              <text x={0} y={12} textAnchor="middle" fill="#FFFFFF" fontSize={30} fontWeight="900">
                SUBSCRIBE
              </text>
            </g>

            {/* Ringing Notification Bell */}
            <g transform={`translate(180 60) rotate(${Math.sin(f * 0.8) * 15})`}>
              <circle cx={0} cy={0} r={40} fill="#FBBF24" stroke="#FFFFFF" strokeWidth={3} />
              <text x={0} y={12} textAnchor="middle" fontSize={32}>🔔</text>
            </g>
          </g>
        </g>
      )}
    </g>
  );
};

// ========================================================
// YOUTUBE SHORT: 27-SECOND VERTICAL MOBILE COMPOSITION (820 frames)
// ========================================================
export const NoWaterShort: React.FC<{ f: number }> = ({ f }) => {
  return (
    <g>
      {/* 0 to 140: Kitchen tap failure - Pip stands on floor beside counter */}
      {f < 140 && (
        <g>
          <BgImage name="bg_kitchen.jpg" />
          <WaterHeader epoch="WATER CRISIS" title="WHAT IF WATER VANISHED?" subtitle="KITCHEN DRIES UP" f={f} />
          <g transform="translate(460 780)">
            <ellipse cx={0} cy={135} rx={55} ry={14} fill="#000000" opacity={0.35} />
            <Hero pose={makePose({ x: 0, y: 0, scale: 1.2, facing: 1, armL: { a: -40, b: 60 }, armR: { a: 45, b: 65 } })} look={PIP} />
            <WaterFaceReaction cx={0} cy={-120} type="terrified" f={f} scale={1.25} />
          </g>
          <g transform="translate(1080 520)">
            <circle cx={0} cy={0} r={25 + (f % 25) * 2.5} fill="none" stroke="#94A3B8" strokeWidth={4} opacity={1 - (f % 25) / 25} />
            <text x={-40} y={-30} fill="#EF4444" fontSize={36} fontWeight="900">POOF! *CLANK*</text>
          </g>
        </g>
      )}

      {/* 140 to 260: Suburban backyard with cracked empty swimming pool */}
      {f >= 140 && f < 260 && (
        <g>
          <BgImage name="bg_pool.jpg" />
          <WaterHeader epoch="DAY 1 · DRY RESERVES" title="SWIMMING POOLS EMPTY" subtitle="ALL WATER GONE" f={f} />
          <g transform="translate(420 720)">
            <ellipse cx={0} cy={130} rx={55} ry={14} fill="#000000" opacity={0.4} />
            <Hero pose={makePose({ x: 0, y: 0, scale: 1.2, facing: 1, armL: { a: 20, b: 30 }, armR: { a: -60, b: 70 } })} look={PIP} />
            <WaterFaceReaction cx={0} cy={-120} type="shocked" f={f} scale={1.2} />
          </g>
        </g>
      )}

      {/* 260 to 380: 36,000-ft Ocean canyon drop */}
      {f >= 260 && f < 380 && (
        <g>
          <BgImage name="bg_ocean.jpg" />
          <WaterHeader epoch="36,000 FT DROP" title="OCEANS VANISH" subtitle="CRUISE SHIPS SNAPPED" f={f} />
          <g transform="translate(960 660)">
            <ellipse cx={0} cy={130} rx={55} ry={15} fill="#000000" opacity={0.4} />
            <Hero pose={makePose({ x: 0, y: 0, scale: 1.2, facing: 1 })} look={PIP} />
            <WaterFaceReaction cx={0} cy={-120} type="shocked" f={f} scale={1.2} />
          </g>
        </g>
      )}

      {/* 380 to 500: Volcanic hellscape & magma rupture */}
      {f >= 380 && f < 500 && (
        <g transform={`translate(${Math.sin(f * 0.9) * 6} 0)`}>
          <BgImage name="bg_volcano.jpg" />
          <WaterHeader epoch="TECTONIC CRACK" title="MAGMA BLASTS" subtitle="RING OF FIRE UNSEALED" f={f} />
          <g transform="translate(960 680)">
            <ellipse cx={0} cy={130} rx={55} ry={14} fill="#000000" opacity={0.45} />
            <Hero pose={makePose({ x: 0, y: 0, scale: 1.25, facing: 1 })} look={PIP} />
            <WaterFaceReaction cx={0} cy={-120} type="terrified" f={f} scale={1.3} />
          </g>
        </g>
      )}

      {/* 500 to 620: 60°C scorching heatwave */}
      {f >= 500 && f < 620 && (
        <g>
          <BgImage name="bg_city.jpg" />
          <WaterHeader epoch="+60°C HEATWAVE" title="ASPHALT MELTS" subtitle="ZERO CLOUDS" f={f} />
          <g transform="translate(960 700)">
            <ellipse cx={0} cy={130} rx={60} ry={15} fill="#000000" opacity={0.4} />
            <Hero pose={makePose({ x: 0, y: 0, scale: 1.25, facing: 1 })} look={PIP} />
            <WaterFaceReaction cx={0} cy={-120} type="parched" f={f} scale={1.3} />
          </g>
        </g>
      )}

      {/* 620 to 720: Continental mega-wildfires */}
      {f >= 620 && f < 720 && (
        <g>
          <BgImage name="bg_wildfire.jpg" />
          <WaterHeader epoch="DAY 3 WILDFIRES" title="CONTINENTAL FIRESTORM" subtitle="EXTINCTION LIMIT" f={f} />
          <g transform="translate(960 680)">
            <ellipse cx={0} cy={120} rx={60} ry={14} fill="#000000" opacity={0.4} />
            <Hero pose={makePose({ x: 0, y: 0, scale: 1.2, facing: 1 })} look={PIP} />
            <WaterFaceReaction cx={0} cy={-110} type="parched" f={f} scale={1.3} />
          </g>
        </g>
      )}

      {/* 720 to 820: Awakening & gratitude */}
      {f >= 720 && (
        <g>
          <BgImage name="bg_bedroom.jpg" />
          <WaterHeader epoch="BE GRATEFUL" title="WATER IS LIFE!" subtitle="SMASH SUBSCRIBE" f={f} />
          <g transform="translate(880 620)">
            <Hero pose={makePose({ x: 0, y: 0, scale: 1.25, facing: 1 })} look={PIP} />
            <WaterFaceReaction cx={0} cy={-120} type="relieved" f={f} scale={1.3} />
          </g>
        </g>
      )}
    </g>
  );
};
