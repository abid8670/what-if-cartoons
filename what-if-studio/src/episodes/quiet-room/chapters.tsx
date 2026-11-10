import React from 'react';
import {
  Hero, basePose, walkPose, clamp, LOOKS, Foreground, Glow,
} from '../../engine';

const MO = LOOKS.mo;
const PIP = LOOKS.pipHood;
const GOLD = '#FBBF24';
const CYAN = '#38BDF8';
const CRIMSON = '#EF4444';
const AMBER = '#D97706';

// ========================================================
// 1. ANIMATED FACIAL EXPRESSION OVERLAYS
// ========================================================
export const FaceReaction: React.FC<{
  cx: number;
  cy: number;
  type: 'smug' | 'curious' | 'worried' | 'dizzy' | 'panic' | 'hallucination' | 'happy';
  f: number;
  scale?: number;
}> = ({ cx, cy, type, f, scale = 1 }) => {
  return (
    <g transform={`translate(${cx} ${cy}) scale(${scale})`}>
      {/* 1. SMUG (Confident grin) */}
      {type === 'smug' && (
        <g>
          <path d="M -16 6 Q 0 16 18 2" stroke="#0F172A" strokeWidth={3} fill="none" />
          <ellipse cx={-18} cy={-4} rx={6} ry={4} fill="#F59E0B" opacity={0.6} />
        </g>
      )}

      {/* 2. CURIOUS (Tilted brow, questioning eye) */}
      {type === 'curious' && (
        <g>
          <path d="M -18 -18 Q -6 -24 6 -16" stroke="#0F172A" strokeWidth={3} fill="none" />
          <ellipse cx={0} cy={8} rx={8} ry={10} fill="#0F172A" />
          <circle cx={-2} cy={6} r={3} fill="#FFFFFF" />
        </g>
      )}

      {/* 3. WORRIED (Trembling mouth, brow drop) */}
      {type === 'worried' && (
        <g>
          <path d="M -16 -18 Q 0 -12 16 -18" stroke="#0F172A" strokeWidth={3} fill="none" />
          <path d="M -14 12 Q 0 4 14 12" stroke="#0F172A" strokeWidth={3.5} fill="none" />
          <circle cx={28} cy={-15} r={5} fill="#38BDF8" />
        </g>
      )}

      {/* 4. DIZZY (Spiral spinning eyes & wobbly mouth) */}
      {type === 'dizzy' && (
        <g>
          <g transform={`translate(-18 -4) rotate(${f * 12})`}>
            <circle cx={0} cy={0} r={10} fill="none" stroke="#6366F1" strokeWidth={3} strokeDasharray="5 3" />
          </g>
          <g transform={`translate(18 -4) rotate(${f * -12})`}>
            <circle cx={0} cy={0} r={10} fill="none" stroke="#6366F1" strokeWidth={3} strokeDasharray="5 3" />
          </g>
          <path d={`M -15 14 Q 0 ${14 + Math.sin(f * 0.4) * 6} 15 14`} stroke="#0F172A" strokeWidth={3.5} fill="none" />
        </g>
      )}

      {/* 5. PANIC (Screaming, sweating, wide terror) */}
      {type === 'panic' && (
        <g>
          {/* Flying sweat drops */}
          <circle cx={-36} cy={-25 - (f % 22)} r={5} fill="#38BDF8" />
          <circle cx={38} cy={-20 - (f % 18)} r={5} fill="#38BDF8" />
          <circle cx={-20} cy={-45 - (f % 25)} r={4} fill="#38BDF8" />
          {/* Screaming open mouth */}
          <ellipse cx={0} cy={8} rx={16} ry={22} fill="#7F1D1D" stroke="#0F172A" strokeWidth={3} />
          <rect x={-10} y={-4} width={20} height={8} fill="#FFFFFF" rx={2} />
        </g>
      )}

      {/* 6. HALLUCINATION (Cosmic glowing eyes & phantom waves) */}
      {type === 'hallucination' && (
        <g>
          <ellipse cx={-18} cy={-4} rx={10} ry={12} fill="#A855F7" stroke="#38BDF8" strokeWidth={2} />
          <circle cx={-18} cy={-4} r={4} fill="#FFFFFF" />
          <ellipse cx={18} cy={-4} rx={10} ry={12} fill="#A855F7" stroke="#38BDF8" strokeWidth={2} />
          <circle cx={18} cy={-4} r={4} fill="#FFFFFF" />
          {/* Floating music/wave note */}
          <text x={35} y={-30 - (f % 30)} fill="#C084FC" fontSize={24} fontWeight="bold">♫</text>
          <text x={-45} y={-35 - ((f + 15) % 30)} fill="#38BDF8" fontSize={20} fontWeight="bold">⚡</text>
        </g>
      )}

      {/* 7. HAPPY (Relief & joyful breath) */}
      {type === 'happy' && (
        <g>
          <ellipse cx={-22} cy={4} rx={8} ry={5} fill="#F43F5E" opacity={0.8} />
          <ellipse cx={22} cy={4} rx={8} ry={5} fill="#F43F5E" opacity={0.8} />
          <path d="M -16 6 Q 0 22 16 6 Z" fill="#DC2626" stroke="#0F172A" strokeWidth={3} />
        </g>
      )}
    </g>
  );
};

// ========================================================
// 2. STORYBOARD BACKGROUNDS & SETS
// ========================================================

/** 1. Orfield Labs Anechoic Chamber Set */
export const AnechoicChamberBg: React.FC<{ f: number; lightsOn?: boolean }> = ({ f, lightsOn = false }) => {
  return (
    <g>
      {/* Deep dark chamber perspective walls */}
      <rect x={0} y={0} width={1920} height={1080} fill={lightsOn ? "#0F172A" : "#050811"} />
      
      {/* 3D Spiked Acoustic Wedges across back wall */}
      <g opacity={lightsOn ? 0.75 : 0.35}>
        {[0, 1, 2, 3, 4, 5].map((row) => (
          <g key={row} transform={`translate(0 ${160 + row * 110})`}>
            {[...Array(18)].map((_, col) => (
              <polygon
                key={col}
                points={`${col * 110},50 ${col * 110 + 55},0 ${col * 110 + 110},50`}
                fill={row % 2 === 0 ? "#1E293B" : "#182234"}
                stroke="#334155"
                strokeWidth={1.5}
              />
            ))}
          </g>
        ))}
      </g>

      {/* Side Wedge Panels */}
      <g opacity={lightsOn ? 0.8 : 0.4}>
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <polygon key={i} points={`0,${150 + i * 110} 120,${185 + i * 110} 0,${220 + i * 110}`} fill="#1E293B" stroke="#334155" strokeWidth={2} />
        ))}
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <polygon key={i} points={`1920,${150 + i * 110} 1800,${185 + i * 110} 1920,${220 + i * 110}`} fill="#1E293B" stroke="#334155" strokeWidth={2} />
        ))}
      </g>

      {/* Suspended Steel Wire Mesh Floor */}
      <g transform="translate(0 800)">
        <polygon points="0,280 1920,280 1720,0 200,0" fill="#0B1120" opacity={0.9} />
        {/* Wire mesh cross grid */}
        {[...Array(16)].map((_, i) => (
          <line key={i} x1={200 + i * 95} y1={0} x2={i * 128} y2={280} stroke="#38BDF8" strokeWidth={1.5} opacity={0.6} />
        ))}
        {[0, 45, 90, 140, 190, 240].map((y, j) => (
          <line key={j} x1={200 - y * 0.7} y1={y} x2={1720 + y * 0.7} y2={y} stroke="#0284C7" strokeWidth={2} opacity={0.5} />
        ))}
        {/* Springs suspending floor */}
        <line x1={250} y1={20} x2={250} y2={120} stroke="#94A3B8" strokeWidth={4} strokeDasharray="8 6" />
        <line x1={1670} y1={20} x2={1670} y2={120} stroke="#94A3B8" strokeWidth={4} strokeDasharray="8 6" />
      </g>

      {/* Overhead Single Cone Spotlight (When lights are slightly on) */}
      {lightsOn ? (
        <polygon points="860,0 1060,0 1480,940 440,940" fill="url(#coneLight)" opacity={0.35} style={{ mixBlendMode: 'screen' }} />
      ) : (
        <polygon points="900,0 1020,0 1260,940 660,940" fill="url(#coneLight)" opacity={0.12} style={{ mixBlendMode: 'screen' }} />
      )}

      {/* Foreground Depth Blur Silhouettes */}
      <Foreground blur={12}>
        <polygon points="0,1080 0,820 180,880 240,1080" fill="#020617" />
        <polygon points="1920,1080 1920,840 1740,900 1680,1080" fill="#020617" />
      </Foreground>
    </g>
  );
};

/** 2. Bank Vault Steel Door Component */
export const VaultDoor: React.FC<{ x: number; y: number; open?: boolean; f: number }> = ({ x, y, open = false, f }) => {
  return (
    <g transform={`translate(${x} ${y})`}>
      {/* Outer steel frame */}
      <rect x={-20} y={-20} width={280} height={640} rx={16} fill="#1E293B" stroke="#475569" strokeWidth={8} />
      {/* Door panel */}
      <g transform={open ? "scale(0.35 1) translate(-200 0)" : "scale(1 1)"}>
        <rect x={0} y={0} width={240} height={600} rx={10} fill="#334155" stroke="#94A3B8" strokeWidth={6} />
        {/* Steel locking bolts */}
        <circle cx={20} cy={100} r={12} fill="#CBD5E1" stroke="#0F172A" strokeWidth={3} />
        <circle cx={20} cy={300} r={12} fill="#CBD5E1" stroke="#0F172A" strokeWidth={3} />
        <circle cx={20} cy={500} r={12} fill="#CBD5E1" stroke="#0F172A" strokeWidth={3} />
        {/* Bank vault locking wheel */}
        <g transform={`translate(120 300) rotate(${open ? f * 8 : 0})`}>
          <circle cx={0} cy={0} r={55} fill="#1E293B" stroke="#FBBF24" strokeWidth={8} />
          <line x1={-65} y1={0} x2={65} y2={0} stroke="#FBBF24" strokeWidth={7} />
          <line x1={0} y1={-65} x2={0} y2={65} stroke="#FBBF24" strokeWidth={7} />
          <circle cx={0} cy={0} r={18} fill="#F59E0B" stroke="#0F172A" strokeWidth={3} />
        </g>
        {/* Reinforced Window with Pip's Face */}
        <rect x={50} y={60} width={140} height={140} rx={12} fill="#0284C7" opacity={0.8} stroke="#E2E8F0" strokeWidth={4} />
      </g>
    </g>
  );
};

/** 3. Header HUD Banner */
export const QuietHeader: React.FC<{ epoch: string; title: string; subtitle: string; f: number }> = ({
  epoch, title, subtitle, f,
}) => {
  return (
    <g transform="translate(60 60)">
      <rect x={0} y={0} width={760} height={90} rx={16} fill="#0F172A" opacity={0.92} stroke="#38BDF8" strokeWidth={3} />
      <circle cx={50} cy={45} r={28} fill="#EF4444" />
      <text x={50} y={52} fill="#FFFFFF" fontSize={18} fontWeight="bold" textAnchor="middle" fontFamily="impact">
        {epoch}
      </text>
      <text x={100} y={40} fill="#F8FAFC" fontSize={26} fontWeight="bold">
        {title.toUpperCase()}
      </text>
      <text x={100} y={68} fill="#94A3B8" fontSize={18}>
        {subtitle}
      </text>
    </g>
  );
};

/** 4. Decibel Level HUD Meter */
export const DecibelMeter: React.FC<{ db: number; x: number; y: number }> = ({ db, x, y }) => {
  const isDeadly = db < 0;
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={0} y={0} width={340} height={120} rx={16} fill="#0F172A" opacity={0.94} stroke={isDeadly ? "#EF4444" : "#22C55E"} strokeWidth={4} />
      <text x={170} y={45} fill={isDeadly ? "#EF4444" : "#22C55E"} fontSize={44} fontWeight="bold" fontFamily="impact" textAnchor="middle">
        {db.toFixed(1)} dB
      </text>
      <text x={170} y={85} fill="#94A3B8" fontSize={18} fontWeight="bold" textAnchor="middle">
        {isDeadly ? "BELOW HUMAN HEARING THRESHOLD 🤫" : "NORMAL AMBIENT ROOM 🔊"}
      </text>
    </g>
  );
};

// ========================================================
// 3. CHAPTER COMPOSITIONS (EVERY 3-5 SECONDS CUTS)
// ========================================================

/** CHAPTER 1: The Ten Thousand Dollar Bet & The Vault Door */
export const Chapter1: React.FC<{ f: number }> = ({ f }) => {
  return (
    <g>
      <AnechoicChamberBg f={f} lightsOn={f < 720} />
      
      {/* Sub-scene 1: Minnesota Lab & The Bet (0 - 360 frames) */}
      {f < 360 && (
        <g>
          <QuietHeader epoch="-20.6 dB" title="The World's Quietest Place" subtitle="Orfield Laboratories Anechoic Chamber" f={f} />
          <DecibelMeter db={-20.6} x={1520} y={60} />
          
          {/* Vault Door Open */}
          <VaultDoor x={240} y={320} open={true} f={f} />

          {/* Pip offering $10,000 cash briefcase */}
          <Hero
            look={PIP}
            pose={{
              ...basePose,
              x: 680,
              y: 720,
              scale: 0.95,
              expr: 'smug',
              armR: { a: 45, b: 20 },
              armL: { a: -20, b: 40 },
            }}
            rimId="rimR"
            shadow={0.3}
          />
          <FaceReaction cx={680} cy={630} type="smug" f={f} scale={1.1} />

          {/* $10,000 Cash Briefcase Prop */}
          <g transform="translate(820 680)">
            <rect x={-50} y={-35} width={100} height={70} rx={8} fill="#78350F" stroke="#451A03" strokeWidth={4} />
            <rect x={-15} y={-45} width={30} height={14} fill="none" stroke="#FBBF24" strokeWidth={4} />
            <text x={0} y={8} fill="#22C55E" fontSize={26} fontWeight="bold" fontFamily="impact" textAnchor="middle">
              $10,000
            </text>
          </g>

          {/* Mo accepting challenge with confident grin */}
          <Hero
            look={MO}
            pose={{
              ...basePose,
              x: 1220,
              y: 720,
              scale: 0.95,
              expr: 'happy',
              armL: { a: 40, b: 30 },
              armR: { a: -30, b: 45 },
            }}
            rimId="rimR"
            shadow={0.3}
          />
          <FaceReaction cx={1220} cy={630} type="smug" f={f} scale={1.1} />
        </g>
      )}

      {/* Sub-scene 2: Stepping Inside & Vault Door Clangs Shut (360 - 720 frames) */}
      {f >= 360 && f < 720 && (
        <g>
          <QuietHeader epoch="VAULT LOCK" title="Stepping Into The Void" subtitle="Heavy bank vault door seals the chamber" f={f - 360} />
          
          {/* Vault Door Closing animation */}
          <VaultDoor x={240} y={320} open={f < 540} f={f} />

          {/* Mo walking across wire mesh */}
          <Hero
            look={MO}
            pose={{
              ...basePose,
              x: 960,
              y: 720,
              scale: 0.95,
              expr: f < 540 ? 'happy' : 'surprised',
              legL: { a: 22 * Math.sin((f - 360) * 0.18), b: -15 },
              legR: { a: -22 * Math.sin((f - 360) * 0.18), b: -15 },
              armL: { a: -25 * Math.sin((f - 360) * 0.18), b: 25 },
              armR: { a: 25 * Math.sin((f - 360) * 0.18), b: 25 },
            }}
            rimId="rimR"
            shadow={0.3}
          />
          <FaceReaction cx={960} cy={630} type={f < 540 ? 'curious' : 'worried'} f={f - 360} scale={1.1} />

          {/* Dialogue Bubble */}
          <g transform={`translate(960 490) scale(${clamp((f - 380) / 15)})`}>
            <rect x={-180} y={-40} width={360} height={60} rx={14} fill="#0F172A" stroke="#FBBF24" strokeWidth={3} />
            <text x={0} y={2} fill="#FBBF24" fontSize={22} fontWeight="bold" textAnchor="middle">
              {f < 540 ? "60 mins of peace? Easy cash! 😎" : "CLANG! ...Wait, why is it so quiet? 😳"}
            </text>
          </g>
        </g>
      )}

      {/* Sub-scene 3: Absolute Silence Settles In (720 - 1088 frames) */}
      {f >= 720 && (
        <g>
          <QuietHeader epoch="00:00:00" title="The Darkness & The Dead Silence" subtitle="Zero decibels. Zero echoes. The experiment begins." f={f - 720} />
          <DecibelMeter db={-20.6} x={1520} y={60} />
          
          {/* Mo sitting cross-legged in dark room with subtle rim */}
          <Hero
            look={MO}
            pose={{
              ...basePose,
              x: 960,
              y: 740,
              scale: 1.0,
              armL: { a: 20, b: 50 },
              armR: { a: 20, b: 50 },
              legL: { a: 75, b: -75 },
              legR: { a: 75, b: -75 },
            }}
            rimId="rimBlue"
            shadow={0.4}
          />
          <FaceReaction cx={960} cy={650} type="curious" f={f - 720} scale={1.1} />
        </g>
      )}
    </g>
  );
};

/** CHAPTER 2: Minute Five — When Silence Turns Loud */
export const Chapter2: React.FC<{ f: number }> = ({ f }) => {
  return (
    <g>
      <AnechoicChamberBg f={f} lightsOn={false} />

      {/* Sub-scene 1: Normal Bedroom vs Anechoic Chamber (0 - 450 frames) */}
      {f < 450 && (
        <g>
          <QuietHeader epoch="MINUTE 05" title="The Silence Turns Deafening" subtitle="Normal 30 dB ambient noise vs 0 dB reflection" f={f} />
          
          {/* Left card: Normal Room (30 dB) */}
          <g transform="translate(180 180)">
            <rect x={0} y={0} width={720} height={700} rx={24} fill="#0F172A" opacity={0.92} stroke="#38BDF8" strokeWidth={4} />
            <text x={360} y={70} fill="#38BDF8" fontSize={34} fontWeight="bold" textAnchor="middle">
              NORMAL BEDROOM 🛌
            </text>
            <text x={360} y={130} fill="#F8FAFC" fontSize={52} fontWeight="bold" fontFamily="impact" textAnchor="middle">
              30 - 40 DECIBELS
            </text>
            <text x={360} y={200} fill="#94A3B8" fontSize={24} textAnchor="middle">
              Air conditioner, street breeze, clock ticks
            </text>
            {/* Ticking clock illustration */}
            <circle cx={360} cy={450} r={120} fill="#1E293B" stroke="#38BDF8" strokeWidth={8} />
            <line x1={360} y1={450} x2={360} y2={370} stroke="#F8FAFC" strokeWidth={6} strokeLinecap="round" />
            <line x1={360} y1={450} x2={430} y2={450} stroke="#EF4444" strokeWidth={4} strokeLinecap="round" />
          </g>

          {/* Right card: Anechoic Foam Chamber (-20.6 dB) */}
          <g transform="translate(1020 180)">
            <rect x={0} y={0} width={720} height={700} rx={24} fill="#0F172A" opacity={0.92} stroke="#EF4444" strokeWidth={4} />
            <text x={360} y={70} fill="#EF4444" fontSize={34} fontWeight="bold" textAnchor="middle">
              ANECHOIC CHAMBER 🤫
            </text>
            <text x={360} y={130} fill="#EF4444" fontSize={52} fontWeight="bold" fontFamily="impact" textAnchor="middle">
              -20.6 DECIBELS
            </text>
            <text x={360} y={200} fill="#FCA5A5" fontSize={24} textAnchor="middle">
              99.99% Sound Absorbed by Fiberglass Wedges
            </text>
            {/* Fiberglass foam wedges schematic */}
            <g transform="translate(160 360)">
              {[0, 1, 2, 3].map((k) => (
                <polygon key={k} points={`${k * 100},160 ${k * 100 + 50},0 ${k * 100 + 100},160`} fill="#334155" stroke="#EF4444" strokeWidth={3} />
              ))}
            </g>
          </g>
        </g>
      )}

      {/* Sub-scene 2: Inner Ear AGC (Automatic Gain Control) Diagram (450 - 1000 frames) */}
      {f >= 450 && (
        <g>
          <QuietHeader epoch="BIOLOGY" title="The Brain Turns Up The Volume" subtitle="Auditory cortex increases ear microphone gain to max" f={f - 450} />
          
          {/* Giant Inner Ear Cochlea Schematic */}
          <g transform="translate(960 480)">
            <ellipse cx={0} cy={0} rx={340} ry={220} fill="#1E1B4B" stroke="#6366F1" strokeWidth={6} opacity={0.85} />
            {/* Cochlea snail spiral */}
            <path d="M -180 80 Q -240 -80 0 -120 Q 200 -120 180 40 Q 160 120 0 100 Q -100 80 -80 -20 Q -60 -80 0 -60" fill="none" stroke="#A855F7" strokeWidth={16} strokeLinecap="round" />
            
            {/* Animated sound nerve pulses */}
            {[...Array(6)].map((_, idx) => (
              <circle
                key={idx}
                cx={-80 + idx * 35}
                cy={-40 + Math.sin((f - 450) * 0.2 + idx) * 20}
                r={8}
                fill="#38BDF8"
              />
            ))}

            {/* Volume Gain Slider */}
            <g transform="translate(0 150)">
              <rect x={-220} y={-16} width={440} height={32} rx={16} fill="#0F172A" stroke="#38BDF8" strokeWidth={3} />
              {/* Slider fill */}
              <rect x={-220} y={-16} width={clamp((f - 450) / 400) * 440} height={32} rx={16} fill="#EF4444" />
              <text x={0} y={8} fill="#FFFFFF" fontSize={22} fontWeight="bold" textAnchor="middle">
                EAR MICROPHONE GAIN: {Math.min(100, Math.round(((f - 450) / 400) * 100))}% (MAX)
              </text>
            </g>
          </g>

          {/* Mo hearing the high-pitch tinnitus ringing */}
          <Hero
            look={MO}
            pose={{
              ...basePose,
              x: 320,
              y: 720,
              scale: 0.95,
              armL: { a: 70, b: 60 },
              armR: { a: 70, b: 60 },
            }}
            rimId="rimBlue"
            shadow={0.3}
          />
          <FaceReaction cx={320} cy={630} type="worried" f={f - 450} scale={1.1} />

          {/* 4000 Hz Tinnitus Ringing Label */}
          <g transform="translate(320 480)">
            <rect x={-160} y={-30} width={320} height={60} rx={12} fill="#0F172A" stroke="#FBBF24" strokeWidth={3} />
            <text x={0} y={8} fill="#FBBF24" fontSize={22} fontWeight="bold" textAnchor="middle">
              4,000 Hz TINNITUS RING ⚡
            </text>
          </g>
        </g>
      )}
    </g>
  );
};

/** CHAPTER 3: Minute Fifteen — The Blood Symphony */
export const Chapter3: React.FC<{ f: number }> = ({ f }) => {
  return (
    <g>
      <AnechoicChamberBg f={f} lightsOn={false} />

      {/* Sub-scene 1: Mo's Beating Heart as a Bass Drum (0 - 480 frames) */}
      {f < 480 && (
        <g>
          <QuietHeader epoch="MINUTE 15" title="The Blood Symphony" subtitle="Heartbeat sounds like a sledgehammer" f={f} />
          
          {/* Giant Beating Heart Diagram with pulse scale */}
          <g transform={`translate(960 480) scale(${1 + Math.sin(f * 0.3) * 0.12})`}>
            {/* Heart shape */}
            <path
              d="M 0 60 C -120 -60 -220 -180 -100 -260 C -20 -280 0 -180 0 -160 C 0 -180 20 -280 100 -260 C 220 -180 120 -60 0 60 Z"
              fill="#DC2626"
              stroke="#7F1D1D"
              strokeWidth={8}
            />
            {/* EKG Heartbeat Line */}
            <path d="M -160 -120 L -60 -120 L -30 -180 L 0 -40 L 30 -150 L 60 -120 L 160 -120" fill="none" stroke="#FEF08A" strokeWidth={6} strokeLinecap="round" />
            <text x={0} y={-80} fill="#FFFFFF" fontSize={36} fontWeight="bold" fontFamily="impact" textAnchor="middle">
              THUMP... THUMP...
            </text>
          </g>

          {/* Mo Clutching Chest */}
          <Hero
            look={MO}
            pose={{
              ...basePose,
              x: 320,
              y: 720,
              scale: 0.95,
              armL: { a: 45, b: 30 },
              armR: { a: 50, b: -20 },
            }}
            rimId="rimBlue"
            shadow={0.3}
          />
          <FaceReaction cx={320} cy={630} type="worried" f={f} scale={1.1} />
        </g>
      )}

      {/* Sub-scene 2: Carotid Artery & Body Sounds (480 - 948 frames) */}
      {f >= 480 && (
        <g>
          <QuietHeader epoch="INTERNAL AUDIO" title="Carotid Artery & Eye Friction" subtitle="Blood rushing in neck, eyeballs scraping in sockets" f={f - 480} />
          
          {/* Split comparison cards */}
          <g transform="translate(240 220)">
            <rect x={0} y={0} width={680} height={660} rx={24} fill="#0F172A" opacity={0.92} stroke="#DC2626" strokeWidth={4} />
            <text x={340} y={70} fill="#EF4444" fontSize={32} fontWeight="bold" textAnchor="middle">
              CAROTID ARTERY SURGE 🩸
            </text>
            <text x={340} y={130} fill="#F8FAFC" fontSize={26} textAnchor="middle">
              Pressurized blood whooshes to brain
            </text>
            {/* Artery tube with red blood cells */}
            <rect x={140} y={220} width={400} height={120} rx={30} fill="#7F1D1D" stroke="#DC2626" strokeWidth={6} />
            {[0, 1, 2, 3, 4].map((i) => (
              <circle
                key={i}
                cx={190 + ((i * 70 + (f - 480) * 14) % 320)}
                cy={280}
                r={24}
                fill="#EF4444"
                stroke="#991B1B"
                strokeWidth={3}
              />
            ))}
            <text x={340} y={420} fill="#FCA5A5" fontSize={32} fontWeight="bold" fontFamily="impact" textAnchor="middle">
              WHOOSH... WHOOSH!
            </text>
          </g>

          <g transform="translate(1000 220)">
            <rect x={0} y={0} width={680} height={660} rx={24} fill="#0F172A" opacity={0.92} stroke="#38BDF8" strokeWidth={4} />
            <text x={340} y={70} fill="#38BDF8" fontSize={32} fontWeight="bold" textAnchor="middle">
              EYEBALL & JOINT FRICTION 👁️
            </text>
            <text x={340} y={130} fill="#F8FAFC" fontSize={26} textAnchor="middle">
              Moving eyes sounds like sandpaper
            </text>
            {/* Eye graphic */}
            <g transform="translate(340 300)">
              <ellipse cx={0} cy={0} rx={120} ry={75} fill="#FFFFFF" stroke="#0F172A" strokeWidth={6} />
              <circle cx={Math.sin((f - 480) * 0.1) * 35} cy={0} r={40} fill="#0284C7" />
              <circle cx={Math.sin((f - 480) * 0.1) * 35} cy={0} r={18} fill="#0F172A" />
            </g>
            <text x={340} y={440} fill="#BAE6FD" fontSize={30} fontWeight="bold" fontFamily="impact" textAnchor="middle">
              SCRAPE... RASP...
            </text>
          </g>
        </g>
      )}
    </g>
  );
};

/** CHAPTER 4: Minute Thirty — Balance & Spatial Chaos */
export const Chapter4: React.FC<{ f: number }> = ({ f }) => {
  return (
    <g>
      <AnechoicChamberBg f={f} lightsOn={false} />

      {/* Sub-scene 1: Echolocation Breakdown (0 - 450 frames) */}
      {f < 450 && (
        <g>
          <QuietHeader epoch="MINUTE 30" title="Loss of 3D Spatial Orientation" subtitle="Humans rely on acoustic reflection to balance" f={f} />
          
          {/* Radar / Acoustic Sonar Wave Grid */}
          <g transform="translate(960 480)">
            <circle cx={0} cy={0} r={280} fill="none" stroke="#334155" strokeWidth={2} strokeDasharray="8 6" />
            <circle cx={0} cy={0} r={190} fill="none" stroke="#334155" strokeWidth={2} strokeDasharray="8 6" />
            <circle cx={0} cy={0} r={100} fill="none" stroke="#334155" strokeWidth={2} strokeDasharray="8 6" />
            {/* Red X for zero bounce */}
            <line x1={-80} y1={-80} x2={80} y2={80} stroke="#EF4444" strokeWidth={12} strokeLinecap="round" />
            <line x1={80} y1={-80} x2={-80} y2={80} stroke="#EF4444" strokeWidth={12} strokeLinecap="round" />
            <text x={0} y={140} fill="#EF4444" fontSize={32} fontWeight="bold" fontFamily="impact" textAnchor="middle">
              ZERO ACOUSTIC REFLECTION
            </text>
          </g>

          {/* Mo wobbling, trying to stand */}
          <Hero
            look={MO}
            pose={{
              ...basePose,
              x: 420,
              y: 720,
              scale: 0.95,
              tilt: Math.sin(f * 0.15) * 18,
              armL: { a: -40, b: 60 },
              armR: { a: 60, b: 40 },
            }}
            rimId="rimBlue"
            shadow={0.3}
          />
          <FaceReaction cx={420} cy={630} type="dizzy" f={f} scale={1.1} />
        </g>
      )}

      {/* Sub-scene 2: Vertigo Strike & Floor Collapse (450 - 950 frames) */}
      {f >= 450 && (
        <g>
          <QuietHeader epoch="VERTIGO" title="The Vestibular Collapse" subtitle="Inner ear fluid sloshes without spatial cues" f={f - 450} />
          
          {/* Tilted room illusion effect */}
          <g transform={`translate(960 540) rotate(${Math.sin((f - 450) * 0.1) * 8}) translate(-960 -540)`}>
            {/* Mo collapsed on wire mesh */}
            <Hero
              look={MO}
              pose={{
                ...basePose,
                x: 960,
                y: 820,
                scale: 0.95,
                tilt: 65,
                armL: { a: 80, b: 60 },
                armR: { a: -40, b: 20 },
                legL: { a: 40, b: 60 },
                legR: { a: 80, b: 20 },
              }}
              rimId="rimBlue"
              shadow={0.4}
            />
            <FaceReaction cx={980} cy={760} type="dizzy" f={f - 450} scale={1.2} />
          </g>

          {/* Warning Banner */}
          <g transform="translate(960 360)">
            <rect x={-320} y={-45} width={640} height={90} rx={18} fill="#7F1D1D" stroke="#EF4444" strokeWidth={4} />
            <text x={0} y={12} fill="#FFFFFF" fontSize={34} fontWeight="bold" fontFamily="impact" textAnchor="middle">
              SEVERE VERTIGO: YOU CANNOT STAND!
            </text>
          </g>
        </g>
      )}
    </g>
  );
};

/** CHAPTER 5: Minute Forty-Five — Auditory Hallucinations */
export const Chapter5: React.FC<{ f: number }> = ({ f }) => {
  return (
    <g>
      <AnechoicChamberBg f={f} lightsOn={false} />

      {/* Sub-scene 1: Sensory Deprivation Breaks Brain (0 - 460 frames) */}
      {f < 460 && (
        <g>
          <QuietHeader epoch="MINUTE 45" title="Auditory Hallucinations" subtitle="Deprived of input, the brain invents phantom sound" f={f} />
          
          {/* Brain cortex generating phantom soundwaves */}
          <g transform="translate(1360 480)">
            <ellipse cx={0} cy={0} rx={260} ry={190} fill="#3B0764" stroke="#A855F7" strokeWidth={6} />
            {/* Neural spark lines */}
            {[0, 1, 2, 3, 4].map((j) => (
              <circle
                key={j}
                cx={-120 + j * 60}
                cy={Math.sin(f * 0.2 + j) * 40}
                r={12}
                fill="#C084FC"
              />
            ))}
            <text x={0} y={-80} fill="#F8FAFC" fontSize={26} fontWeight="bold" textAnchor="middle">
              AUDITORY CORTEX
            </text>
            <text x={0} y={110} fill="#E9D5FF" fontSize={22} fontWeight="bold" textAnchor="middle">
              INVENTING SOUND! 🧠⚡
            </text>
          </g>

          {/* Floating phantom sounds: whispers, bees, music */}
          <g transform="translate(760 340)">
            <text x={0} y={0} fill="#C084FC" fontSize={34} fontWeight="bold" fontFamily="impact">
              "SHHH... WE HEAR YOU..."
            </text>
            <text x={80} y={60} fill="#FBBF24" fontSize={32} fontWeight="bold" fontFamily="impact">
              BUZZZZZZZ 🐝
            </text>
            <text x={-60} y={120} fill="#38BDF8" fontSize={36} fontWeight="bold" fontFamily="impact">
              ♫ CIRCUS MUSIC ♫
            </text>
          </g>

          {/* Mo Clutching head in full panic */}
          <Hero
            look={MO}
            pose={{
              ...basePose,
              x: 380,
              y: 720,
              scale: 1.0,
              armL: { a: 110, b: -40 },
              armR: { a: 110, b: -40 },
            }}
            rimId="rimBlue"
            shadow={0.3}
          />
          <FaceReaction cx={380} cy={630} type="panic" f={f} scale={1.2} />
        </g>
      )}

      {/* Sub-scene 2: Racing Pulse & Pounding on Vault Door (460 - 939 frames) */}
      {f >= 460 && (
        <g>
          <QuietHeader epoch="PANIC ATTACK" title="Rushing To The Vault Door" subtitle="140 BPM Heart Rate. Pounding wildly: LET ME OUT!" f={f - 460} />
          
          {/* Steel Vault Door on Left */}
          <VaultDoor x={240} y={320} open={false} f={f} />

          {/* Mo banging on the vault door */}
          <Hero
            look={MO}
            pose={{
              ...basePose,
              x: 480,
              y: 720,
              scale: 1.0,
              facing: -1 as const,
              armL: { a: 90 + Math.sin(f * 0.8) * 30, b: 20 },
              armR: { a: 90 + Math.cos(f * 0.8) * 30, b: 20 },
            }}
            rimId="rimBlue"
            shadow={0.3}
          />
          <FaceReaction cx={480} cy={630} type="panic" f={f - 460} scale={1.2} />

          {/* POUND IMPACT SHOCKWAVES */}
          <circle cx={240} cy={540} r={30 + (f % 20) * 4} fill="none" stroke="#EF4444" strokeWidth={4} opacity={1 - (f % 20) / 20} />

          {/* Screaming Dialog Bubble */}
          <g transform="translate(760 480)">
            <rect x={-200} y={-50} width={400} height={100} rx={20} fill="#EF4444" stroke="#FFFFFF" strokeWidth={4} />
            <text x={0} y={15} fill="#FFFFFF" fontSize={38} fontWeight="bold" fontFamily="impact" textAnchor="middle">
              LET ME OUT!! 😱
            </text>
          </g>

          {/* 140 BPM Counter */}
          <g transform="translate(1440 220)">
            <rect x={0} y={0} width={340} height={110} rx={16} fill="#0F172A" stroke="#EF4444" strokeWidth={4} />
            <text x={170} y={45} fill="#EF4444" fontSize={42} fontWeight="bold" fontFamily="impact" textAnchor="middle">
              140 BPM
            </text>
            <text x={170} y={85} fill="#FCA5A5" fontSize={20} fontWeight="bold" textAnchor="middle">
              PANIC HEART RATE 💓
            </text>
          </g>
        </g>
      )}
    </g>
  );
};

/** CHAPTER 6: The Great Escape & The Sound of Life */
export const Chapter6: React.FC<{ f: number }> = ({ f }) => {
  return (
    <g>
      {/* Lights Flood Back On! */}
      <AnechoicChamberBg f={f} lightsOn={true} />

      {/* Sub-scene 1: Door Opens & Sweet Relief (0 - 480 frames) */}
      {f < 480 && (
        <g>
          <QuietHeader epoch="THE ESCAPE" title="Sweet Ambient Noise" subtitle="Vault door opens, flooded with light & air" f={f} />
          
          {/* Vault Door Wide Open */}
          <VaultDoor x={240} y={320} open={true} f={f} />

          {/* Pip helping Mo */}
          <Hero
            look={PIP}
            pose={{
              ...basePose,
              x: 640,
              y: 720,
              scale: 0.95,
              armR: { a: 45, b: 20 },
              armL: { a: -20, b: 30 },
            }}
            rimId="rimR"
            shadow={0.3}
          />

          {/* Mo on floor gasping for breath, relieved */}
          <Hero
            look={MO}
            pose={{
              ...basePose,
              x: 980,
              y: 780,
              scale: 0.95,
              armL: { a: 20, b: 60 },
              armR: { a: 20, b: 60 },
            }}
            rimId="rimR"
            shadow={0.3}
          />
          <FaceReaction cx={980} cy={690} type="happy" f={f} scale={1.1} />

          {/* Sound waves returning */}
          <g transform="translate(1380 440)">
            <rect x={-200} y={-40} width={400} height={80} rx={16} fill="#0F172A" stroke="#22C55E" strokeWidth={3} />
            <text x={0} y={12} fill="#22C55E" fontSize={28} fontWeight="bold" textAnchor="middle">
              AIR & SOUND RETURN! 🍃
            </text>
          </g>
        </g>
      )}

      {/* Sub-scene 2: Biological Truth & Animated Subscribe Call To Action (480 - 1039 frames) */}
      {f >= 480 && (
        <g>
          <QuietHeader epoch="THE TRUTH" title="Silence Is An Illusion" subtitle="Humans need ambient noise to anchor sanity" f={f - 480} />
          
          {/* Mo and Pip together waving to audience */}
          <Hero
            look={MO}
            pose={{
              ...basePose,
              x: 620,
              y: 700,
              scale: 1.0,
              expr: 'happy',
              armR: { a: 90 + Math.sin(f * 0.2) * 20, b: 30 },
              armL: { a: -30, b: 30 },
            }}
            rimId="rimR"
            shadow={0.3}
          />
          <FaceReaction cx={620} cy={610} type="happy" f={f - 480} scale={1.1} />

          <Hero
            look={PIP}
            pose={{
              ...basePose,
              x: 920,
              y: 700,
              scale: 1.0,
              expr: 'happy',
              armL: { a: 90 + Math.sin(f * 0.2 + 1) * 20, b: 30 },
              armR: { a: -30, b: 30 },
            }}
            rimId="rimR"
            shadow={0.3}
          />
          <FaceReaction cx={920} cy={610} type="happy" f={f - 480} scale={1.1} />

          {/* ANIMATED YOUTUBE SUBSCRIBE BUTTON & BELL CALL TO ACTION */}
          <g transform="translate(1420 620)">
            {/* Subscribe Red Box */}
            <rect x={-180} y={-45} width={360} height={90} rx={22} fill="#DC2626" stroke="#FFFFFF" strokeWidth={4} />
            <text x={-20} y={14} fill="#FFFFFF" fontSize={36} fontWeight="bold" fontFamily="impact" textAnchor="middle">
              SUBSCRIBE
            </text>
            {/* Ringing Notification Bell */}
            <g transform={`translate(120 0) rotate(${Math.sin(f * 0.4) * 25})`}>
              <path d="M -16 12 Q -16 -12 0 -16 Q 16 -12 16 12 Z" fill="#FBBF24" stroke="#0F172A" strokeWidth={3} />
              <circle cx={0} cy={16} r={5} fill="#D97706" />
            </g>
          </g>
        </g>
      )}
    </g>
  );
};

/** MOBILE SHORT (9:16 Vertical Focused) */
export const QuietRoomShort: React.FC<{ f: number }> = ({ f }) => {
  return (
    <g>
      <AnechoicChamberBg f={f} lightsOn={f < 120 || f > 450} />
      
      {/* -20.6 dB Badge */}
      <g transform="translate(960 220)">
        <rect x={-240} y={-40} width={480} height={80} rx={18} fill="#0F172A" stroke="#EF4444" strokeWidth={4} />
        <text x={0} y={14} fill="#EF4444" fontSize={38} fontWeight="bold" fontFamily="impact" textAnchor="middle">
          -20.6 dB DEADLY SILENCE
        </text>
      </g>

      {/* Mo Center Acting */}
      <Hero
        look={MO}
        pose={{
          ...basePose,
          x: 960,
          y: 720,
          scale: 1.2,
          armL: { a: f < 300 ? 90 : 120, b: 40 },
          armR: { a: f < 300 ? 90 : 120, b: 40 },
        }}
        rimId="rimBlue"
        shadow={0.4}
      />
      <FaceReaction cx={960} cy={610} type={f < 150 ? 'curious' : f < 350 ? 'worried' : 'panic'} f={f} scale={1.3} />

      {/* Pounding Ear Ring Waves */}
      {f > 150 && (
        <g transform="translate(960 610)">
          <circle cx={0} cy={0} r={100 + (f % 25) * 6} fill="none" stroke="#FACC15" strokeWidth={5} opacity={1 - (f % 25) / 25} />
        </g>
      )}

      {/* Dynamic Caption */}
      <g transform="translate(960 920)">
        <rect x={-320} y={-35} width={640} height={70} rx={16} fill="#0F172A" stroke="#FBBF24" strokeWidth={3} />
        <text x={0} y={10} fill="#FBBF24" fontSize={26} fontWeight="bold" textAnchor="middle">
          {f < 180 ? "CAN YOU SURVIVE 1 HOUR? 🤫" : f < 360 ? "HEARING YOUR OWN BLOOD PUMP! 🩸" : "BRAIN HALLUCINATES SOUND! 😱"}
        </text>
      </g>
    </g>
  );
};
