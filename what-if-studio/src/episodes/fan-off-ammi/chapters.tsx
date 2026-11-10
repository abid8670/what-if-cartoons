import React from 'react';
import { interpolate, spring, staticFile } from 'remotion';
import { Hero, LOOKS, Pose, Look, C } from '../../engine';

const GROUND_Y = 820;

// Custom Desi Ammi Look: Traditional magenta/rose kurta, gold accent border, dark brown hair with dupatta
const AMMI_LOOK: Look = {
  skin: C.skin,
  skinShade: C.skinShade,
  hand: C.skin,
  jacket: '#9D174D',      // Deep royal rose/magenta kameez
  jacketShade: '#831843',
  accent: '#F59E0B',      // Warm golden border
  limb: '#4C1D95',        // Deep purple shalwar
  line: '#1E1B2E',
  shoe: '#BE185D',
  face: '#1E1B2E',
  hair: '#2D1B18',
  extra: 'bob',
};

// Spinning Ceiling Fan Component with Dynamic Deceleration
export const CeilingFan: React.FC<{ f: number; speedMultiplier?: number; isSlowing?: boolean; slowStartFrame?: number }> = ({
  f,
  speedMultiplier = 1,
  isSlowing = false,
  slowStartFrame = 216,
}) => {
  let angle = f * 24 * speedMultiplier;
  let opacityBlades = 0.55;

  if (isSlowing) {
    if (f < slowStartFrame) {
      angle = f * 24;
    } else {
      const elapsed = f - slowStartFrame;
      // Exponential decay of rotation speed
      const curSpeed = Math.max(0, 24 * Math.exp(-elapsed * 0.035));
      angle = slowStartFrame * 24 + (1 - Math.exp(-elapsed * 0.035)) * 680;
      opacityBlades = Math.min(0.95, 0.55 + elapsed * 0.005);
    }
  }

  return (
    <g transform="translate(960, 110)">
      {/* Downrod and mounting canopy */}
      <rect x={-8} y={-80} width={16} height={80} fill="#475569" rx={4} />
      <ellipse cx={0} cy={-75} rx={30} ry={10} fill="#334155" />
      
      {/* Motor hub */}
      <ellipse cx={0} cy={0} rx={45} ry={22} fill="#1E293B" stroke="#0F172A" strokeWidth={3} />
      <ellipse cx={0} cy={-4} rx={32} ry={15} fill="#475569" />

      {/* Rotating 3 Blades */}
      <g transform={`rotate(${angle})`}>
        {[0, 120, 240].map((rot, i) => (
          <g key={i} transform={`rotate(${rot})`}>
            {/* Blade Bracket */}
            <rect x={-6} y={15} width={12} height={20} fill="#CBD5E1" rx={2} />
            {/* Aerodynamic blade */}
            <path
              d="M -16 35 C -20 120, -18 210, -12 240 C -8 250, 8 250, 12 240 C 18 210, 20 120, 16 35 Z"
              fill="#0284C7"
              stroke="#0369A1"
              strokeWidth={2}
              opacity={opacityBlades}
            />
            {/* Highlight line on blade */}
            <line x1={0} y1={50} x2={0} y2={220} stroke="#BAE6FD" strokeWidth={2} opacity={0.6} />
          </g>
        ))}
      </g>
      
      {/* Center Cap */}
      <circle cx={0} cy={0} r={14} fill="#F59E0B" stroke="#B45309" strokeWidth={2} />
    </g>
  );
};

// Cozy Bed with Pillow, Blanket and Sleeping Pip Head
export const CozyBed: React.FC<{ f: number; isSuffocating?: boolean; isUp?: boolean }> = ({
  f,
  isSuffocating = false,
  isUp = false,
}) => {
  const breath = Math.sin(f * 0.15) * 4;
  const sweatOffset = isSuffocating ? Math.sin(f * 0.5) * 8 : 0;

  return (
    <g transform="translate(380, 0)">
      {/* Bed Contact Shadow */}
      <ellipse cx={220} cy={GROUND_Y + 12} rx={270} ry={18} fill="rgba(0,0,0,0.5)" />

      {/* Wooden Headboard */}
      <rect x={-40} y={GROUND_Y - 300} width={45} height={310} fill="#78350F" rx={8} stroke="#451A03" strokeWidth={4} />
      <rect x={-32} y={GROUND_Y - 290} width={28} height={180} fill="#92400E" rx={4} />
      <circle cx={-18} cy={GROUND_Y - 315} r={14} fill="#B45309" />

      {/* Bed Mattress and Base Frame */}
      <rect x={0} y={GROUND_Y - 140} width={440} height={140} fill="#1E293B" rx={10} stroke="#0F172A" strokeWidth={4} />
      <rect x={0} y={GROUND_Y - 140} width={440} height={40} fill="#F8FAFC" rx={8} stroke="#CBD5E1" strokeWidth={2} />
      {/* Bed Legs */}
      <rect x={20} y={GROUND_Y - 20} width={24} height={26} fill="#451A03" rx={3} />
      <rect x={400} y={GROUND_Y - 20} width={24} height={26} fill="#451A03" rx={3} />

      {/* Soft Fluffy Pillow */}
      <rect x={25} y={GROUND_Y - 180} width={130} height={50} rx={16} fill="#E2E8F0" stroke="#94A3B8" strokeWidth={3} />

      {/* Sleeping Stickman Pip (If not sitting up) */}
      {!isUp && (
        <g transform={`translate(85, ${GROUND_Y - 170})`}>
          {/* Head resting on pillow */}
          <circle cx={0} cy={0} r={34} fill={C.skin} stroke="#0F172A" strokeWidth={4} />
          
          {/* Facial Expression */}
          {!isSuffocating ? (
            // Peaceful Sleeping Face
            <g>
              {/* Closed relaxed eyes */}
              <path d="M -18 -4 Q -12 -12 -6 -4" fill="none" stroke="#0F172A" strokeWidth={3.5} strokeLinecap="round" />
              <path d="M 6 -4 Q 12 -12 18 -4" fill="none" stroke="#0F172A" strokeWidth={3.5} strokeLinecap="round" />
              {/* Soft smiling sleeping mouth */}
              <path d="M -6 12 Q 0 16 6 12" fill="none" stroke="#0F172A" strokeWidth={3} strokeLinecap="round" />
              
              {/* Floating Z z z comic bubbles */}
              {[0, 1, 2].map((i) => {
                const zt = (f * 0.04 + i * 0.33) % 1;
                const zx = 25 + zt * 60;
                const zy = -20 - zt * 70;
                const zSize = 14 + zt * 14;
                const zOp = Math.sin(zt * Math.PI);
                return (
                  <text key={i} x={zx} y={zy} fill="#38BDF8" fontSize={zSize} fontWeight="bold" fontFamily="Arial" opacity={zOp}>
                    Z
                  </text>
                );
              })}
            </g>
          ) : (
            // Suffocating / Melting Hot Face
            <g transform={`translate(${sweatOffset}, 0)`}>
              {/* Wide shock spiral eyes */}
              <circle cx={-12} cy={-6} r={12} fill="#FFFFFF" stroke="#0F172A" strokeWidth={3} />
              <circle cx={12} cy={-6} r={12} fill="#FFFFFF" stroke="#0F172A" strokeWidth={3} />
              {/* Spirals inside eyes */}
              <path d="M -12 -10 A 4 4 0 1 1 -12 -2 A 2 2 0 1 1 -12 -6" fill="none" stroke="#EF4444" strokeWidth={2.5} />
              <path d="M 12 -10 A 4 4 0 1 1 12 -2 A 2 2 0 1 1 12 -6" fill="none" stroke="#EF4444" strokeWidth={2.5} />
              
              {/* Wide open screaming mouth */}
              <ellipse cx={0} cy={16} rx={14} ry={12} fill="#991B1B" stroke="#0F172A" strokeWidth={3} />
              <path d="M -8 18 Q 0 24 8 18" fill="#F87171" />

              {/* Giant Anime Sweat Drops Gushing Out */}
              {[ -35, -20, 20, 35 ].map((sx, i) => {
                const dropY = -35 + ((f * 5 + i * 15) % 40);
                return (
                  <path
                    key={i}
                    d={`M ${sx} ${dropY} Q ${sx + 6} ${dropY + 12} ${sx} ${dropY + 16} Q ${sx - 6} ${dropY + 12} ${sx} ${dropY} Z`}
                    fill="#38BDF8"
                    stroke="#0284C7"
                    strokeWidth={1.5}
                  />
                );
              })}
            </g>
          )}
        </g>
      )}

      {/* Cozy Blanket Over Body (with breathing or boiling effect) */}
      <path
        d={`M 130 ${GROUND_Y - 145 + breath} Q 280 ${GROUND_Y - 170 + breath * 1.5} 440 ${GROUND_Y - 140} L 440 ${GROUND_Y - 20} L 130 ${GROUND_Y - 20} Z`}
        fill="#2563EB"
        stroke="#1E40AF"
        strokeWidth={4}
      />
      {/* Blanket Stripe Pattern */}
      <path
        d={`M 140 ${GROUND_Y - 120 + breath} Q 280 ${GROUND_Y - 145 + breath * 1.5} 430 ${GROUND_Y - 120}`}
        fill="none"
        stroke="#60A5FA"
        strokeWidth={8}
        strokeLinecap="round"
      />
    </g>
  );
};

// Wall Switchboard with Toggle Switch
export const Switchboard: React.FC<{ f: number; isOff: boolean; switchFrame?: number }> = ({
  f,
  isOff,
  switchFrame = 216,
}) => {
  const switchPos = isOff ? 1 : 0; // 0: ON (UP), 1: OFF (DOWN)
  const sparkAnim = isOff && f >= switchFrame && f < switchFrame + 18;

  return (
    <g transform="translate(1550, 480)">
      {/* Switchboard Plate */}
      <rect x={0} y={0} width={90} height={130} rx={10} fill="#F8FAFC" stroke="#64748B" strokeWidth={4} />
      <circle cx={45} cy={18} r={4} fill="#94A3B8" />
      <circle cx={45} cy={112} r={4} fill="#94A3B8" />

      {/* Fan Switch Socket */}
      <rect x={25} y={40} width={40} height={50} rx={6} fill="#E2E8F0" stroke="#94A3B8" strokeWidth={2} />
      
      {/* Rocker / Toggle Switch */}
      <rect
        x={30}
        y={45 + switchPos * 18}
        width={30}
        height={22}
        rx={4}
        fill={isOff ? '#EF4444' : '#10B981'}
        stroke="#0F172A"
        strokeWidth={2.5}
      />
      <line x1={36} y1={56 + switchPos * 18} x2={54} y2={56 + switchPos * 18} stroke="#FFFFFF" strokeWidth={3} strokeLinecap="round" />

      {/* Label */}
      <text x={45} y={32} textAnchor="middle" fill="#475569" fontSize={11} fontWeight="bold" fontFamily="Arial">
        FAN
      </text>

      {/* Electric Spark on Click */}
      {sparkAnim && (
        <g transform="translate(45, 65)">
          <path d="M 0 -22 L 6 -6 L 22 -4 L 8 8 L 14 24 L 0 12 L -14 24 L -8 8 L -22 -4 L -6 -6 Z" fill="#FBBF24" stroke="#D97706" strokeWidth={2} />
        </g>
      )}
    </g>
  );
};

// Comic Digital Wall Clock (Showing 07:15 AM)
export const WallClock: React.FC = () => {
  return (
    <g transform="translate(180, 240)">
      <rect x={0} y={0} width={190} height={85} rx={14} fill="#020617" stroke="#38BDF8" strokeWidth={4} />
      <rect x={8} y={8} width={174} height={69} rx={8} fill="#0F172A" />
      <text x={95} y={55} textAnchor="middle" fill="#22C55E" fontSize={42} fontWeight="bold" fontFamily="Courier New, monospace" letterSpacing={2}>
        07:15
      </text>
      <text x={95} y={72} textAnchor="middle" fill="#FACC15" fontSize={14} fontWeight="bold" fontFamily="Arial">
        AM (MORNING)
      </text>
    </g>
  );
};

// ----------------------------------------------------
// CHAPTER 1: THE PEACEFUL SLEEP & THE STEALTH ATTACK (562 frames / 18.7s)
// ----------------------------------------------------
export const Chapter1: React.FC<{ f: number }> = ({ f }) => {
  // Ammi walks into the room on tiptoes starting at frame 320
  const ammiWalk = interpolate(f, [320, 530], [1950, 1420], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const ammiBob = Math.sin(f * 0.28) * 8;
  const ammiPresent = f >= 320;

  return (
    <g>
      {/* Background Image */}
      <image href={staticFile('fan-off-ammi/bg_cozy_bedroom.jpg')} width={1920} height={1080} />

      {/* Spinning Ceiling Fan (Full Speed) */}
      <CeilingFan f={f} speedMultiplier={1.0} />

      {/* Cozy Bed with Peaceful Sleeping Pip */}
      <CozyBed f={f} isSuffocating={false} />

      {/* Wall Clock */}
      <WallClock />

      {/* Switchboard (ON) */}
      <Switchboard f={f} isOff={false} />

      {/* Desi Ammi Tiptoeing into the room */}
      {ammiPresent && (
        <g transform={`translate(${ammiWalk}, 0)`}>
          {/* Ammi Contact Shadow */}
          <ellipse cx={0} cy={GROUND_Y + 10} rx={60} ry={14} fill="rgba(0,0,0,0.45)" />

          {/* Ammi Rig */}
          <Hero
            pose={{
              x: 0,
              y: GROUND_Y - 130 + ammiBob,
              scale: 0.95,
              facing: -1,
              tilt: -6,
              head: {
                expr: 'smug',
                look: { x: -1, y: 0 },
                tilt: 4,
              },
              armL: { a: -30, b: 60 },
              armR: { a: 45, b: 40 },
              legL: { a: -15, b: 20 },
              legR: { a: 20, b: 35 },
            }}
            look={AMMI_LOOK}
          />

          {/* Comic Stealth Label */}
          <g transform="translate(-70, -260)">
            <rect x={-80} y={-25} width={160} height={40} rx={10} fill="#991B1B" stroke="#FDE047" strokeWidth={2.5} />
            <text x={0} y={3} textAnchor="middle" fill="#FFFFFF" fontSize={18} fontWeight="bold" fontFamily="Arial">
              STEALTH MODE 🤫
            </text>
          </g>
        </g>
      )}

      {/* Subtitle / Hook Banner */}
      <g transform="translate(960, 970)">
        <rect x={-480} y={-42} width={960} height={76} rx={16} fill="#0B0818" stroke="#FACC15" strokeWidth={3} opacity={0.92} />
        <text x={0} y={7} textAnchor="middle" fill="#FFFFFF" fontSize={28} fontWeight="bold" fontFamily="Arial">
          Duniya Ka Sabse Khatarnaak Alarm Clock... AMMI KA HAMLA! ⏰😱
        </text>
      </g>
    </g>
  );
};

// ----------------------------------------------------
// CHAPTER 2: THE FATAL CLICK & THE HEATWAVE MELTDOWN (672 frames / 22.4s)
// ----------------------------------------------------
export const Chapter2: React.FC<{ f: number }> = ({ f }) => {
  const switchFrame = 216; // Click at t = 7.2s
  const isOff = f >= switchFrame;

  // Heat opacity rises dramatically after switch is clicked
  const heatOp = interpolate(f, [switchFrame, switchFrame + 240], [0, 0.45], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  // Temp rises from 22 to 55 degrees
  const tempVal = Math.round(interpolate(f, [switchFrame, switchFrame + 240], [22, 55], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));

  return (
    <g>
      {/* Background Image */}
      <image href={staticFile('fan-off-ammi/bg_cozy_bedroom.jpg')} width={1920} height={1080} />

      {/* Red Heatwave Overlay when turned off */}
      {isOff && (
        <rect width={1920} height={1080} fill="#DC2626" opacity={heatOp} style={{ mixBlendMode: 'color-burn' }} />
      )}

      {/* Spinning / Decelerating Ceiling Fan */}
      <CeilingFan f={f} isSlowing={true} slowStartFrame={switchFrame} />

      {/* Cozy Bed with Sweating / Suffocating Pip */}
      <CozyBed f={f} isSuffocating={isOff} />

      {/* Wall Clock */}
      <WallClock />

      {/* Switchboard (Clicks to OFF at frame 216) */}
      <Switchboard f={f} isOff={isOff} switchFrame={switchFrame} />

      {/* Ammi Standing near switchboard */}
      <g transform="translate(1420, 0)">
        <ellipse cx={0} cy={GROUND_Y + 10} rx={60} ry={14} fill="rgba(0,0,0,0.45)" />
        <Hero
          pose={{
            x: 0,
            y: GROUND_Y - 130,
            scale: 0.95,
            facing: -1,
            tilt: 0,
            head: {
              expr: isOff ? 'smug' : 'neutral',
              look: { x: isOff ? -1 : 1, y: 0 },
              tilt: 0,
            },
            armL: { a: isOff ? -20 : -60, b: isOff ? 40 : 10 },
            armR: { a: 30, b: 20 },
            legL: { a: 0, b: 0 },
            legR: { a: 0, b: 0 },
          }}
          look={AMMI_LOOK}
        />
      </g>

      {/* Comic Click Burst Notification */}
      {isOff && f < switchFrame + 60 && (
        <g transform="translate(1500, 440)">
          <polygon points="0,-40 25,-15 60,-30 45,10 80,35 40,35 40,70 10,45 -30,65 -20,25 -60,10 -25,-10 -40,-35" fill="#FACC15" stroke="#B45309" strokeWidth={3} />
          <text x={5} y={15} textAnchor="middle" fill="#000000" fontSize={26} fontWeight="900" fontFamily="Arial">
            TUK! 🔌
          </text>
        </g>
      )}

      {/* Burning Thermometer HUD */}
      {isOff && (
        <g transform="translate(140, 420)">
          <rect x={0} y={0} width={120} height={260} rx={18} fill="#0F172A" stroke="#EF4444" strokeWidth={4} />
          {/* Mercury tube */}
          <rect x={48} y={30} width={24} height={180} rx={12} fill="#334155" />
          <rect
            x={50}
            y={30 + (180 - (tempVal / 60) * 180)}
            width={20}
            height={(tempVal / 60) * 180}
            rx={10}
            fill="#EF4444"
          />
          <circle cx={60} cy={220} r={22} fill="#EF4444" stroke="#991B1B" strokeWidth={3} />
          <text x={60} y={-10} textAnchor="middle" fill="#F87171" fontSize={24} fontWeight="bold" fontFamily="Arial">
            {tempVal}°C 🔥
          </text>
          <text x={60} y={285} textAnchor="middle" fill="#FDE047" fontSize={16} fontWeight="bold" fontFamily="Arial">
            GARMI 100%
          </text>
        </g>
      )}

      {/* Subtitle Banner */}
      <g transform="translate(960, 970)">
        <rect x={-520} y={-42} width={1040} height={76} rx={16} fill="#0B0818" stroke="#EF4444" strokeWidth={3} opacity={0.92} />
        <text x={0} y={7} textAnchor="middle" fill="#FFFFFF" fontSize={26} fontWeight="bold" fontFamily="Arial">
          {isOff
            ? '10 Second Mein Kamra Sahara Registan Ban Gaya! 🏜️🔥'
            : 'Ammi Ne Switch Board Par Hamla Kar Diya...'}
        </text>
      </g>
    </g>
  );
};

// ----------------------------------------------------
// CHAPTER 3: THE AWAKENING & THE COMMENT DARE (660 frames / 22.0s)
// ----------------------------------------------------
export const Chapter3: React.FC<{ f: number }> = ({ f }) => {
  return (
    <g>
      {/* Background Image */}
      <image href={staticFile('fan-off-ammi/bg_cozy_bedroom.jpg')} width={1920} height={1080} />

      {/* Fan completely stopped */}
      <CeilingFan f={f} isSlowing={true} slowStartFrame={0} />

      {/* Wall Clock (07:15 AM) */}
      <WallClock />

      {/* Switchboard (OFF) */}
      <Switchboard f={f} isOff={true} />

      {/* Bed with Pip JUMPING UP in Shock */}
      <CozyBed f={f} isSuffocating={false} isUp={true} />

      {/* Sitting Up / Gasping Pip */}
      <g transform={`translate(470, ${GROUND_Y - 170})`}>
        <Hero
          pose={{
            x: 0,
            y: 0,
            scale: 0.95,
            facing: 1,
            tilt: 12,
            head: {
              expr: 'shock',
              look: { x: 1, y: -1 },
              tilt: 8,
            },
            armL: { a: -60, b: 30 },
            armR: { a: 80, b: 20 },
            legL: { a: 70, b: 90 },
            legR: { a: 70, b: 90 },
          }}
          look={LOOKS.pip}
        />
        {/* Messy Hair strands sticking up */}
        <path d="M -15 -40 L -25 -65 L -8 -45 L 0 -70 L 10 -45 L 22 -62 L 15 -38" fill="#1E293B" stroke="#0F172A" strokeWidth={2} />
      </g>

      {/* Ammi Standing Proudly with Dialogue Bubble */}
      <g transform="translate(1380, 0)">
        <ellipse cx={0} cy={GROUND_Y + 10} rx={60} ry={14} fill="rgba(0,0,0,0.45)" />
        <Hero
          pose={{
            x: 0,
            y: GROUND_Y - 130,
            scale: 0.95,
            facing: -1,
            tilt: 0,
            head: {
              expr: 'happy',
              look: { x: -1, y: 0 },
              tilt: -4,
            },
            armL: { a: -50, b: 80 }, // Hands on hips
            armR: { a: 50, b: 80 },
            legL: { a: 0, b: 0 },
            legR: { a: 0, b: 0 },
          }}
          look={AMMI_LOOK}
        />

        {/* Ammi Iconic Dialogue Bubble */}
        <g transform="translate(-140, -280)">
          <rect x={-170} y={-50} width={340} height={80} rx={20} fill="#FACC15" stroke="#0F172A" strokeWidth={4} />
          <polygon points="-20,30 0,60 20,30" fill="#FACC15" stroke="#0F172A" strokeWidth={4} />
          <rect x={-15} y={26} width={30} height={10} fill="#FACC15" />
          <text x={0} y={-8} textAnchor="middle" fill="#0F172A" fontSize={26} fontWeight="900" fontFamily="Arial">
            "UTHO! 12 BAJ GAYE HAIN!" ⏰
          </text>
          <text x={0} y={20} textAnchor="middle" fill="#B91C1C" fontSize={16} fontWeight="bold" fontFamily="Arial">
            (Halanke abhi sirf 7:15 hue hain!)
          </text>
        </g>
      </g>

      {/* Interactive Comment Challenge Card (Appears at frame 220) */}
      {f >= 200 && (
        <g transform="translate(960, 680)">
          {/* Card Frame */}
          <rect x={-420} y={-110} width={840} height={220} rx={24} fill="#020617" stroke="#38BDF8" strokeWidth={4} />
          
          {/* Top Title */}
          <text x={0} y={-65} textAnchor="middle" fill="#FDE047" fontSize={26} fontWeight="900" fontFamily="Arial">
            💬 BATAO: KYA AAPKI AMMI BHI PANKHA BAND KARTI HAIN?
          </text>

          {/* Option A */}
          <g transform="translate(-190, 0)">
            <rect x={-180} y={-30} width={360} height={60} rx={14} fill="#1E293B" stroke="#22C55E" strokeWidth={3} />
            <text x={0} y={8} textAnchor="middle" fill="#4ADE80" fontSize={22} fontWeight="bold" fontFamily="Arial">
              👉 TYPE 'ROZANA' (Daily)
            </text>
          </g>

          {/* Option B */}
          <g transform="translate(190, 0)">
            <rect x={-180} y={-30} width={360} height={60} rx={14} fill="#1E293B" stroke="#EAB308" strokeWidth={3} />
            <text x={0} y={8} textAnchor="middle" fill="#FDE047" fontSize={22} fontWeight="bold" fontFamily="Arial">
              👉 TYPE 'KABHI KABHI'
            </text>
          </g>

          {/* Subscribe CTA */}
          <g transform="translate(0, 75)">
            <rect x={-160} y={-22} width={320} height={44} rx={22} fill="#EF4444" stroke="#FFFFFF" strokeWidth={2} />
            <text x={0} y={6} textAnchor="middle" fill="#FFFFFF" fontSize={19} fontWeight="bold" fontFamily="Arial">
              🔔 SUBSCRIBE TO WHAT IF!
            </text>
          </g>
        </g>
      )}

      {/* Bottom Subtitle */}
      <g transform="translate(960, 970)">
        <rect x={-480} y={-42} width={960} height={76} rx={16} fill="#0B0818" stroke="#38BDF8" strokeWidth={3} opacity={0.92} />
        <text x={0} y={7} textAnchor="middle" fill="#FFFFFF" fontSize={26} fontWeight="bold" fontFamily="Arial">
          Sachi Baat Comments Mein Batao Aur Channel Ko Subscribe Karo! ❤️👇
        </text>
      </g>
    </g>
  );
};

// ----------------------------------------------------
// VERTICAL SHORT COMPILATION (750 frames / 25.0s)
// ----------------------------------------------------
export const FanShort: React.FC<{ f: number }> = ({ f }) => {
  // Rapid 3-part sequence:
  // 0 - 240: Sleep & stealth Ammi
  // 240 - 480: The Click & Heatwave
  // 480 - 750: Wakeup & Comment Challenge
  if (f < 240) {
    return <Chapter1 f={f * 1.5} />;
  } else if (f < 480) {
    return <Chapter2 f={(f - 240) * 1.8 + 150} />;
  } else {
    return <Chapter3 f={(f - 480) * 1.6 + 150} />;
  }
};

