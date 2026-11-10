import React from 'react';
import { interpolate, spring, staticFile } from 'remotion';

// ========================================================
// 1. BRANDED STUDIO INTRO (WHAT IF STUDIO) - 4 SECONDS
// ========================================================
export const StudioIntro: React.FC<{ f: number }> = ({ f }) => {
  const logoScale = spring({ frame: f, fps: 30, config: { damping: 14, stiffness: 180 } });
  const flareX = interpolate(f, [15, 85], [-200, 1920], { extrapolateRight: 'clamp' });
  const textOpacity = interpolate(f, [20, 50], [0, 1], { extrapolateRight: 'clamp' });
  const pulse = Math.sin(f * 0.15) * 0.2 + 0.8;

  return (
    <g>
      {/* Deep Space Background */}
      <rect x={0} y={0} width={1920} height={1080} fill="#020617" />

      {/* Subtle Radial Glow */}
      <circle cx={960} cy={540} r={480} fill="#38BDF8" opacity={0.12 * pulse} />

      {/* Animated Glowing Geometric Logo */}
      <g transform={`translate(960 440) scale(${logoScale})`}>
        {/* Outer Orbit Rings */}
        <circle cx={0} cy={0} r={95} fill="none" stroke="#38BDF8" strokeWidth={2.5} strokeDasharray="12 8" opacity={0.65} transform={`rotate(${f * 1.5} 0 0)`} />
        <circle cx={0} cy={0} r={115} fill="none" stroke="#F59E0B" strokeWidth={2} strokeDasharray="16 12" opacity={0.5} transform={`rotate(${-f * 1.2} 0 0)`} />
        {/* Core Glowing Emblem */}
        <polygon points="0,-60 52,30 -52,30" fill="none" stroke="#F8FAFC" strokeWidth={5} strokeLinejoin="round" />
        <circle cx={0} cy={2} r={18} fill="#38BDF8" />
        <polygon points="0,-18 16,10 -16,10" fill="#F59E0B" />
      </g>

      {/* Cinematic Lens Flare Sweep */}
      {f > 15 && f < 90 && (
        <g transform={`translate(${flareX} 440)`}>
          <ellipse cx={0} cy={0} rx={180} ry={6} fill="#FFFFFF" opacity={0.8} />
          <circle cx={0} cy={0} r={40} fill="#38BDF8" opacity={0.5} />
        </g>
      )}

      {/* Main Studio Typography */}
      <g opacity={textOpacity}>
        <text
          x={960}
          y={640}
          textAnchor="middle"
          fill="#F8FAFC"
          fontSize="48"
          fontWeight="900"
          letterSpacing="8px"
          fontFamily="Montserrat, sans-serif"
        >
          WHAT IF STUDIO
        </text>
        <text
          x={960}
          y={690}
          textAnchor="middle"
          fill="#38BDF8"
          fontSize="20"
          fontWeight="700"
          letterSpacing="4px"
          fontFamily="Plus Jakarta Sans, sans-serif"
        >
          ANIMATED STORIES THAT TOUCH THE SOUL
        </text>
      </g>
    </g>
  );
};

// ========================================================
// 2. KINETIC GLASSMORPHIC HUD BADGE
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
        width={620}
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
// 3. ANIMATED SUBSCRIBE CALL-TO-ACTION (VISUAL & ENGAGING)
// ========================================================
export const SubscribeCallout: React.FC<{ f: number; x?: number; y?: number }> = ({
  f,
  x = 660,
  y = 200,
}) => {
  const pop = spring({ frame: f, fps: 30, config: { damping: 14, stiffness: 200 } });
  // Simulated mouse click at frame 40
  const isClicked = f > 40;
  const bellSwing = Math.sin(f * 0.4) * (f > 40 ? 18 : 6);

  return (
    <g transform={`translate(${x} ${y}) scale(${pop})`}>
      {/* Background Glass Pill */}
      <rect
        x={0}
        y={0}
        width={600}
        height={130}
        rx={24}
        fill="#0F172A"
        fillOpacity={0.92}
        stroke="#EF4444"
        strokeWidth={2}
        filter="drop-shadow(0 16px 36px rgba(0,0,0,0.75))"
      />

      {/* Channel Title */}
      <text
        x={35}
        y={42}
        fill="#F8FAFC"
        fontSize="22"
        fontWeight="800"
        fontFamily="Montserrat, sans-serif"
      >
        WHAT IF STUDIO
      </text>
      <text
        x={35}
        y={68}
        fill="#94A3B8"
        fontSize="15"
        fontFamily="Plus Jakarta Sans, sans-serif"
      >
        Never miss an emotional story like Barnaby's
      </text>

      {/* Subscribe Button */}
      <g transform="translate(35 82)">
        <rect
          x={0}
          y={0}
          width={180}
          height={38}
          rx={19}
          fill={isClicked ? '#334155' : '#EF4444'}
        />
        <text
          x={90}
          y={25}
          textAnchor="middle"
          fill="#FFFFFF"
          fontSize="15"
          fontWeight="bold"
          fontFamily="Montserrat, sans-serif"
        >
          {isClicked ? 'SUBSCRIBED ✓' : 'SUBSCRIBE'}
        </text>
      </g>

      {/* Ringing Notification Bell */}
      <g transform={`translate(260 101) rotate(${bellSwing})`}>
        <path
          d="M 0 -14 C -6 -14 -10 -9 -10 2 L -14 10 L 14 10 L 10 2 C 10 -9 6 -14 0 -14 Z"
          fill="#FBBF24"
          stroke="#0F172A"
          strokeWidth={1.5}
        />
        <circle cx={0} cy={13} r={3} fill="#FBBF24" />
        {/* Ring vibration waves */}
        {isClicked && (
          <g stroke="#FBBF24" strokeWidth={2} fill="none" opacity={0.8}>
            <path d="M -16 -6 C -20 -2 -20 6 -16 10" />
            <path d="M 16 -6 C 20 -2 20 6 16 10" />
          </g>
        )}
      </g>

      {/* Animated Clicking Mouse Cursor */}
      {f < 55 && (
        <g transform={`translate(${interpolate(f, [0, 40], [220, 115])} ${interpolate(f, [0, 40], [130, 102])})`}>
          <polygon points="0,0 0,18 5,14 11,24 15,22 9,12 16,12" fill="#FFFFFF" stroke="#0F172A" strokeWidth={2} />
        </g>
      )}
    </g>
  );
};

// ========================================================
// 4. THE STICK DOG CHARACTER RIG (BARNABY)
// ========================================================
export const StickDog: React.FC<{
  x: number;
  y: number;
  f: number;
  action: 'walk' | 'sit' | 'sleep' | 'old' | 'jump';
  facing?: 1 | -1;
  scale?: number;
}> = ({ x, y, f, action, facing = 1, scale = 1 }) => {
  // Tail wagging animation
  const tailWag = action === 'old' ? Math.sin(f * 0.12) * 12 : Math.sin(f * 0.35) * 28;
  // Ear flopping animation
  const earBounce = Math.sin(f * 0.28) * 8;
  // Walking leg strides
  const leg1 = action === 'walk' ? Math.sin(f * 0.28) * 22 : 0;
  const leg2 = action === 'walk' ? -Math.sin(f * 0.28) * 22 : 0;
  // Jump leap
  const jumpY = action === 'jump' ? -Math.abs(Math.sin(f * 0.2)) * 120 : 0;

  const isOld = action === 'old';
  const furColor = isOld ? '#64748B' : '#0F172A';
  const earColor = isOld ? '#475569' : '#1E293B';

  return (
    <g transform={`translate(${x} ${y + jumpY}) scale(${scale * facing} ${scale})`}>
      {/* Soft Contact Shadow on Platform Floor */}
      <ellipse
        cx={0}
        cy={6 - jumpY * 0.3}
        rx={action === 'sleep' ? 45 : 32}
        ry={8}
        fill="#0F172A"
        opacity={action === 'jump' ? 0.15 : 0.32}
      />

      {action === 'sleep' ? (
        // Sleeping / Curled up pose
        <g>
          {/* Curled Body */}
          <ellipse cx={0} cy={-22} rx={36} ry={20} fill="#F8FAFC" stroke={furColor} strokeWidth={5} />
          {/* Head resting on front paws */}
          <circle cx={25} cy={-20} r={18} fill="#F8FAFC" stroke={furColor} strokeWidth={4.5} />
          {/* Closed peaceful eye */}
          <path d="M 22 -22 Q 26 -18 30 -22" fill="none" stroke={furColor} strokeWidth={3} strokeLinecap="round" />
          <circle cx={36} cy={-18} r={3} fill="#0F172A" />
          {/* Floppy ear draped down */}
          <path d="M 18 -26 C 10 -15 15 0 24 -10 Z" fill={earColor} />
          {/* Red Collar */}
          <rect x={12} y={-23} width={6} height={12} fill="#EF4444" rx={2} />
          {/* Curled tail */}
          <path d="M -30 -20 C -42 -12 -38 0 -26 -2" fill="none" stroke={furColor} strokeWidth={4.5} strokeLinecap="round" />
        </g>
      ) : action === 'sit' || action === 'old' ? (
        // Sitting attentively or old sitting pose
        <g>
          {/* Back leg tucked */}
          <path d="M -18 0 C -25 -10 -25 -25 -15 -25 L -5 -2" stroke={furColor} strokeWidth={4.5} fill="none" />
          {/* Front straight paws */}
          <line x1={15} y1={-30} x2={15} y2={0} stroke={furColor} strokeWidth={4.5} strokeLinecap="round" />
          <line x1={8} y1={-30} x2={8} y2={0} stroke={furColor} strokeWidth={4.5} strokeLinecap="round" />
          {/* Torso spine */}
          <path d="M -15 -25 C -10 -45 5 -50 15 -55" stroke={furColor} strokeWidth={5.5} fill="none" strokeLinecap="round" />
          {/* Head */}
          <circle cx={20} cy={-70} r={20} fill="#F8FAFC" stroke={furColor} strokeWidth={5} />
          {/* Snout & Nose */}
          <path d="M 28 -68 L 38 -65 L 30 -60 Z" fill="#F8FAFC" stroke={furColor} strokeWidth={3.5} />
          <circle cx={38} cy={-66} r={3.5} fill="#0F172A" />
          {/* Eye */}
          {isOld ? (
            <path d="M 18 -74 Q 23 -70 28 -74" fill="none" stroke={furColor} strokeWidth={3} strokeLinecap="round" />
          ) : (
            <ellipse cx={22} cy={-74} rx={3} ry={4.5} fill="#0F172A" />
          )}
          {/* Floppy Ear */}
          <path d={`M 10 -80 C -5 ${-65 + earBounce} 5 ${-45 + earBounce} 16 -68 Z`} fill={earColor} />
          {/* Red Collar with gold bell tag */}
          <rect x={12} y={-57} width={16} height={6} fill="#EF4444" rx={2} />
          <circle cx={20} cy={-48} r={3} fill="#FBBF24" />
          {/* Wagging Tail */}
          <path d={`M -18 -20 Q ${-35 + tailWag} -35 ${-42 + tailWag} -20`} fill="none" stroke={furColor} strokeWidth={4.5} strokeLinecap="round" />
        </g>
      ) : (
        // Running / Trotting / Jumping Pose
        <g>
          {/* Body Spine */}
          <path d="M -25 -35 Q 0 -42 25 -40" stroke={furColor} strokeWidth={6} fill="none" strokeLinecap="round" />
          {/* 4 Running Legs */}
          <line x1={-20} y1={-35} x2={-28 + leg1} y2={0} stroke={furColor} strokeWidth={4.5} strokeLinecap="round" />
          <line x1={-12} y1={-35} x2={-16 - leg1} y2={0} stroke={furColor} strokeWidth={4.5} strokeLinecap="round" />
          <line x1={15} y1={-40} x2={22 + leg2} y2={0} stroke={furColor} strokeWidth={4.5} strokeLinecap="round" />
          <line x1={22} y1={-40} x2={14 - leg2} y2={0} stroke={furColor} strokeWidth={4.5} strokeLinecap="round" />
          {/* Head */}
          <circle cx={38} cy={-60} r={19} fill="#F8FAFC" stroke={furColor} strokeWidth={4.5} />
          {/* Snout */}
          <path d="M 45 -58 L 56 -55 L 48 -50 Z" fill="#F8FAFC" stroke={furColor} strokeWidth={3.5} />
          <circle cx={56} cy={-56} r={3.5} fill="#0F172A" />
          {/* Eye */}
          <ellipse cx={40} cy={-64} rx={3} ry={4.5} fill="#0F172A" />
          {/* Floppy Flying Ear */}
          <path d={`M 26 -70 C 15 ${-85 + earBounce} 20 ${-55 + earBounce} 32 -58 Z`} fill={earColor} />
          {/* Red Collar */}
          <rect x={28} y={-50} width={14} height={6} fill="#EF4444" rx={2} />
          {/* High Wagging Tail */}
          <path d={`M -25 -35 Q ${-45 + tailWag} -55 ${-40 + tailWag} -70`} fill="none" stroke={furColor} strokeWidth={4.5} strokeLinecap="round" />
        </g>
      )}
    </g>
  );
};

// ========================================================
// 5. ARTHUR (THE COMMUTER MASTER)
// ========================================================
export const StickArthur: React.FC<{
  x: number;
  y: number;
  f: number;
  action: 'walk' | 'kneel' | 'wave' | 'reunion';
  scale?: number;
  facing?: 1 | -1;
}> = ({ x, y, f, action, scale = 1, facing = 1 }) => {
  const walkStride = action === 'walk' ? Math.sin(f * 0.22) * 26 : 0;
  const armSwing = action === 'walk' ? -Math.sin(f * 0.22) * 30 : 0;

  return (
    <g transform={`translate(${x} ${y}) scale(${scale * facing} ${scale})`}>
      {/* Contact Shadow */}
      <ellipse cx={0} cy={10} rx={action === 'kneel' ? 55 : 40} ry={10} fill="#0F172A" opacity={0.32} />

      {/* Head */}
      <circle cx={action === 'kneel' ? 15 : 0} cy={action === 'kneel' ? -140 : -220} r={38} fill="#F8FAFC" stroke="#1E293B" strokeWidth={6} />
      {/* Friendly Eyes */}
      <ellipse cx={action === 'kneel' ? 6 : -10} cy={action === 'kneel' ? -144 : -224} rx={5} ry={7} fill="#1E293B" />
      <ellipse cx={action === 'kneel' ? 26 : 12} cy={action === 'kneel' ? -144 : -224} rx={5} ry={7} fill="#1E293B" />
      {/* Warm Smile */}
      <path d={`M ${action === 'kneel' ? 8 : -8} ${action === 'kneel' ? -126 : -206} Q ${action === 'kneel' ? 16 : 2} ${action === 'kneel' ? -120 : -200} ${action === 'kneel' ? 24 : 12} ${action === 'kneel' ? -126 : -206}`} fill="none" stroke="#1E293B" strokeWidth={4} strokeLinecap="round" />

      {/* Mustard Winter Scarf */}
      <path d={`M ${action === 'kneel' ? -10 : -25} ${action === 'kneel' ? -115 : -190} C ${action === 'kneel' ? 15 : 0} ${action === 'kneel' ? -100 : -175} ${action === 'kneel' ? 40 : 25} ${action === 'kneel' ? -115 : -190} L ${action === 'kneel' ? 35 : 20} ${action === 'kneel' ? -80 : -140}`} stroke="#D97706" strokeWidth={12} fill="none" strokeLinecap="round" />

      {action === 'kneel' ? (
        // Kneeling down with open arms to hug Barnaby
        <g stroke="#1E293B" strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" fill="none">
          <path d="M 10 -105 C 15 -75 20 -40 0 0" />
          <path d="M 0 0 L -35 0" />
          <path d="M 0 0 L 25 -15 L 45 0" />
          {/* Open welcoming arms */}
          <path d="M 10 -90 L 55 -80 L 85 -70" />
          <path d="M 10 -90 L -25 -75 L -55 -65" />
        </g>
      ) : action === 'reunion' ? (
        // Standing with open arms in celestial reunion
        <g stroke="#1E293B" strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" fill="none">
          <line x1={0} y1={-182} x2={0} y2={-80} />
          <path d="M 0 -160 L -65 -130 L -90 -90" />
          <path d="M 0 -160 L 65 -130 L 90 -90" />
          <line x1={0} y1={-80} x2={-25} y2={0} />
          <line x1={0} y1={-80} x2={25} y2={0} />
        </g>
      ) : action === 'wave' ? (
        // Waving hand from train
        <g stroke="#1E293B" strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" fill="none">
          <line x1={0} y1={-182} x2={0} y2={-80} />
          <path d={`M 0 -160 L 45 -210 L ${55 + Math.sin(f * 0.4) * 15} -245`} />
          <path d="M 0 -160 L -35 -115 L -50 -85" />
          <line x1={0} y1={-80} x2={-20} y2={0} />
          <line x1={0} y1={-80} x2={20} y2={0} />
        </g>
      ) : (
        // Walking commuter with briefcase
        <g stroke="#1E293B" strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" fill="none">
          <line x1={0} y1={-182} x2={0} y2={-80} />
          {/* Walking Legs */}
          <path d={`M 0 -80 L ${-25 - walkStride} -40 L ${-35 - walkStride * 1.3} 0`} />
          <path d={`M 0 -80 L ${25 + walkStride} -40 L ${35 + walkStride * 1.3} 0`} />
          {/* Left Arm Swinging */}
          <path d={`M 0 -160 L ${-25 + armSwing} -115 L ${-40 + armSwing} -75`} />
          {/* Right Arm holding Briefcase */}
          <path d={`M 0 -160 L ${25 - armSwing} -115 L ${35 - armSwing} -75`} />
          {/* Leather Briefcase */}
          <g transform={`translate(${35 - armSwing} -70)`}>
            <rect x={-18} y={0} width={36} height={26} rx={4} fill="#78350F" stroke="#1E293B" strokeWidth={3} />
            <path d="M -8 0 C -8 -8 8 -8 8 0" fill="none" stroke="#1E293B" strokeWidth={3} />
          </g>
        </g>
      )}
    </g>
  );
};

// ========================================================
// 6. PROCEDURAL STATION ENVIRONMENT WITH WEATHER & TRAIN
// ========================================================
export const StationEnvironment: React.FC<{
  f: number;
  timeOfDay: 'morning' | 'rain' | 'winter' | 'dusk' | 'golden';
}> = ({ f, timeOfDay }) => {
  // Train arriving / stopping / departing animation
  const trainSlide = timeOfDay === 'morning'
    ? interpolate(f, [500, 750], [-1200, 150], { extrapolateRight: 'clamp' })
    : timeOfDay === 'rain'
    ? interpolate(f, [0, 300], [-1000, 150], { extrapolateRight: 'clamp' })
    : timeOfDay === 'golden'
    ? interpolate(f, [0, 400], [-1200, 150], { extrapolateRight: 'clamp' })
    : 150;

  // Clock Hand Rotation
  const clockMinute = (f * 1.2) % 360;

  return (
    <g>
      {/* Sky Canvas Gradient according to Time of Day */}
      {timeOfDay === 'morning' ? (
        <g>
          <rect x={0} y={0} width={1920} height={1080} fill="#FEF3C7" />
          <circle cx={400} cy={180} r={350} fill="#FDE047" opacity={0.25} />
        </g>
      ) : timeOfDay === 'rain' ? (
        <g>
          <rect x={0} y={0} width={1920} height={1080} fill="#1E293B" />
          <rect x={0} y={0} width={1920} height={1080} fill="#0F172A" opacity={0.5} />
        </g>
      ) : timeOfDay === 'winter' ? (
        <g>
          <rect x={0} y={0} width={1920} height={1080} fill="#0F172A" />
          <rect x={0} y={0} width={1920} height={1080} fill="#334155" opacity={0.4} />
        </g>
      ) : timeOfDay === 'dusk' ? (
        <g>
          <rect x={0} y={0} width={1920} height={1080} fill="#4C1D95" opacity={0.8} />
          <rect x={0} y={400} width={1920} height={680} fill="#1E1B4B" />
        </g>
      ) : (
        // Golden Celestial Reunion
        <g>
          <rect x={0} y={0} width={1920} height={1080} fill="#FDE047" opacity={0.85} />
          <circle cx={960} cy={400} r={650} fill="#FFFBEB" opacity={0.6} />
        </g>
      )}

      {/* Background Vintage Brick Architecture & Canopy */}
      <rect x={0} y={200} width={1920} height={380} fill="#78350F" opacity={0.35} />
      {/* Brick texture lines */}
      {Array.from({ length: 8 }).map((_, i) => (
        <line key={i} x1={0} y1={240 + i * 40} x2={1920} y2={240 + i * 40} stroke="#451A03" strokeWidth={2} opacity={0.3} />
      ))}

      {/* Platform Roof Canopy & Iron Pillars */}
      <polygon points="0,180 1920,180 1920,240 0,240" fill="#1E293B" />
      <line x1={320} y1={240} x2={320} y2={780} stroke="#334155" strokeWidth={14} />
      <line x1={1020} y1={240} x2={1020} y2={780} stroke="#334155" strokeWidth={14} />
      <line x1={1620} y1={240} x2={1620} y2={780} stroke="#334155" strokeWidth={14} />

      {/* Hanging Iron Clock "Platform 4" */}
      <g transform="translate(1020 320)">
        <line x1={0} y1={-80} x2={0} y2={0} stroke="#1E293B" strokeWidth={4} />
        <circle cx={0} cy={0} r={46} fill="#F8FAFC" stroke="#0F172A" strokeWidth={6} />
        {/* Clock Marks */}
        <circle cx={0} cy={-36} r={2.5} fill="#0F172A" />
        <circle cx={36} cy={0} r={2.5} fill="#0F172A" />
        <circle cx={0} cy={36} r={2.5} fill="#0F172A" />
        <circle cx={-36} cy={0} r={2.5} fill="#0F172A" />
        {/* Moving Clock Hands */}
        <line x1={0} y1={0} x2={18} y2={-10} stroke="#0F172A" strokeWidth={4} strokeLinecap="round" />
        <line x1={0} y1={0} x2={-15} y2={15} stroke="#EF4444" strokeWidth={2.5} strokeLinecap="round" transform={`rotate(${clockMinute} 0 0)`} />
        {/* Platform 4 Badge */}
        <rect x={-70} y={55} width={140} height={34} rx={6} fill="#1E293B" stroke="#FBBF24" strokeWidth={2} />
        <text x={0} y={78} textAnchor="middle" fill="#F8FAFC" fontSize="16" fontWeight="bold" fontFamily="Montserrat, sans-serif">
          PLATFORM 4
        </text>
      </g>

      {/* Railway Tracks & Rail Sleepers */}
      <g transform="translate(0 680)">
        {/* Rail ties (wooden sleepers) */}
        {Array.from({ length: 32 }).map((_, i) => (
          <line key={i} x1={i * 65} y1={20} x2={i * 65 + 35} y2={70} stroke="#451A03" strokeWidth={8} opacity={0.65} />
        ))}
        {/* Steel Rails */}
        <line x1={0} y1={25} x2={1920} y2={25} stroke="#64748B" strokeWidth={7} />
        <line x1={0} y1={65} x2={1920} y2={65} stroke="#475569" strokeWidth={9} />
      </g>

      {/* The Commuter Steam Train */}
      <g transform={`translate(${trainSlide} 440)`}>
        {/* Engine & Passenger Carriages */}
        <rect x={-800} y={0} width={750} height={250} rx={18} fill={timeOfDay === 'golden' ? '#F59E0B' : '#064E3B'} stroke="#0F172A" strokeWidth={6} />
        {/* Train Windows with Warm Interior Light */}
        {Array.from({ length: 5 }).map((_, i) => (
          <rect key={i} x={-760 + i * 140} y={35} width={90} height={85} rx={8} fill="#FEF08A" stroke="#0F172A" strokeWidth={4} />
        ))}
        {/* Train Sliding Door */}
        <rect x={-60} y={20} width={110} height={220} fill="#042F2E" stroke="#0F172A" strokeWidth={5} />
        <line x1={-5} y1={20} x2={-5} y2={240} stroke="#FBBF24" strokeWidth={3} />
        {/* Wheels */}
        {Array.from({ length: 6 }).map((_, i) => (
          <circle key={i} cx={-720 + i * 140} cy={255} r={24} fill="#1E293B" stroke="#64748B" strokeWidth={5} />
        ))}
      </g>

      {/* Platform Floor Plane (Solid Ground) */}
      <rect x={0} y={750} width={1920} height={330} fill="#334155" />
      <polygon points="0,750 1920,750 1920,765 0,765" fill="#E2E8F0" opacity={0.6} />

      {/* Station Wooden Waiting Bench */}
      <g transform="translate(620 660)">
        {/* Legs */}
        <line x1={20} y1={50} x2={15} y2={100} stroke="#1E293B" strokeWidth={6} strokeLinecap="round" />
        <line x1={160} y1={50} x2={165} y2={100} stroke="#1E293B" strokeWidth={6} strokeLinecap="round" />
        {/* Slats */}
        <rect x={0} y={10} width={180} height={14} rx={4} fill="#78350F" stroke="#1E293B" strokeWidth={3} />
        <rect x={0} y={30} width={180} height={14} rx={4} fill="#78350F" stroke="#1E293B" strokeWidth={3} />
        <rect x={0} y={50} width={180} height={14} rx={4} fill="#92400E" stroke="#1E293B" strokeWidth={3} />
        {/* Snow on Bench if Winter */}
        {(timeOfDay === 'winter' || timeOfDay === 'dusk') && (
          <path d="M 0 10 C 30 2 60 12 90 4 C 120 12 150 2 180 10 L 180 16 L 0 16 Z" fill="#F8FAFC" />
        )}
      </g>

      {/* Atmospheric Weather Overlays */}
      {timeOfDay === 'rain' && (
        <g>
          {Array.from({ length: 50 }).map((_, i) => {
            const rx = (i * 39) % 1920;
            const ry = ((f * 18 + i * 65) % 1100);
            return (
              <line key={i} x1={rx} y1={ry} x2={rx - 12} y2={ry + 40} stroke="#94A3B8" strokeWidth={1.8} opacity={0.4} />
            );
          })}
        </g>
      )}

      {(timeOfDay === 'winter' || timeOfDay === 'dusk') && (
        <g>
          {Array.from({ length: 45 }).map((_, i) => {
            const sx = ((i * 47 + Math.sin(f * 0.05 + i) * 60) % 1920);
            const sy = ((f * 2.5 + i * 40) % 1080);
            return (
              <circle key={i} cx={sx} cy={sy} r={2 + (i % 3)} fill="#FFFFFF" opacity={0.65} />
            );
          })}
        </g>
      )}

      {timeOfDay === 'morning' && (
        <g>
          {/* Swirling Autumn Leaves */}
          {Array.from({ length: 15 }).map((_, i) => {
            const lx = ((i * 125 + f * 3) % 1920);
            const ly = 300 + Math.sin(f * 0.08 + i) * 120 + ((f * 1.5 + i * 60) % 500);
            return (
              <ellipse key={i} cx={lx} cy={ly} rx={8} ry={4} fill={i % 2 === 0 ? '#F59E0B' : '#EF4444'} opacity={0.8} transform={`rotate(${f * 2 + i * 30} ${lx} ${ly})`} />
            );
          })}
        </g>
      )}
    </g>
  );
};

// ========================================================
// 7. CHAPTER 1: THE MORNING WHISTLE (1050 frames / 35s)
// ========================================================
export const Chapter1: React.FC<{ f: number }> = ({ f }) => {
  // Beats:
  // 0 - 320: Walking side by side to Platform 4
  // 320 - 650: Arthur kneels, shares morning biscuit, pets ears
  // 650 - 1050: Train arrives, Arthur boards & waves, Barnaby wags tail

  const beat = f < 320 ? 1 : f < 650 ? 2 : 3;

  return (
    <g>
      <StationEnvironment f={f} timeOfDay="morning" />

      {beat === 1 && (
        <g>
          <StickArthur x={interpolate(f, [0, 320], [200, 680])} y={750} f={f} action="walk" />
          <StickDog x={interpolate(f, [0, 320], [320, 800])} y={750} f={f} action="walk" />
          <HudBadge
            category="The Daily Promise"
            headline="EVERY MORNING AT 7:45 AM"
            accentColor="#F59E0B"
            f={f}
          />
        </g>
      )}

      {beat === 2 && (
        <g>
          <StickArthur x={680} y={750} f={f} action="kneel" />
          <StickDog x={790} y={750} f={f} action="sit" />
          {/* Shared Biscuit Piece */}
          <circle cx={745} cy={660} r={6} fill="#D97706" stroke="#1E293B" strokeWidth={2} />
          <HudBadge
            category="True Bond"
            headline="'WAIT HERE, BOY. I'LL BE BACK BY FIVE.'"
            accentColor="#38BDF8"
            f={f - 320}
          />
        </g>
      )}

      {beat === 3 && (
        <g>
          {/* Arthur waving from train */}
          <StickArthur x={220} y={580} f={f} action="wave" scale={0.7} />
          <StickDog x={780} y={750} f={f} action="sit" />
          <HudBadge
            category="The Journey Begins"
            headline="WATCHING THE COMMUTER TRAIN DEPART"
            accentColor="#10B981"
            f={f - 650}
          />
        </g>
      )}
    </g>
  );
};

// ========================================================
// 8. CHAPTER 2: THE EMPTY TRAIN (1100 frames / 36.6s)
// ========================================================
export const Chapter2: React.FC<{ f: number }> = ({ f }) => {
  const beat = f < 350 ? 1 : f < 720 ? 2 : 3;

  return (
    <g>
      <StationEnvironment f={f} timeOfDay="rain" />

      {beat === 1 && (
        <g>
          {/* 5:15 PM Train arrives in rain */}
          <StickDog x={780} y={750} f={f} action="walk" />
          <HudBadge
            category="5:15 PM"
            headline="THE EVENING COMMUTER TRAIN ARRIVES"
            accentColor="#38BDF8"
            f={f}
          />
        </g>
      )}

      {beat === 2 && (
        <g>
          {/* Crowd with umbrellas exits, but Arthur is missing */}
          <StickDog x={680} y={750} f={f} action="sit" />
          {/* Commuters with umbrellas walking away */}
          <g transform={`translate(${interpolate(f, [350, 720], [120, -500])} 750)`}>
            <circle cx={0} cy={-180} r={28} fill="#F8FAFC" stroke="#1E293B" strokeWidth={5} />
            <line x1={0} y1={-152} x2={0} y2={-80} stroke="#1E293B" strokeWidth={5} />
            <path d="M -60 -195 C -60 -250 60 -250 60 -195 Z" fill="#1E293B" />
          </g>
          <HudBadge
            category="The Missing Face"
            headline="SEARCHING EVERY FACE IN THE COLD RAIN"
            accentColor="#F59E0B"
            f={f - 350}
          />
        </g>
      )}

      {beat === 3 && (
        <g>
          {/* Empty platform into the night */}
          <StickDog x={780} y={750} f={f} action="sit" />
          <HudBadge
            category="Unbroken Faith"
            headline="ARTHUR HAD TOLD HIM TO WAIT."
            accentColor="#EF4444"
            f={f - 720}
          />
        </g>
      )}
    </g>
  );
};

// ========================================================
// 9. CHAPTER 3: SEASONS OF LOYALTY & SUBSCRIBE (1100 frames / 36.6s)
// ========================================================
export const Chapter3: React.FC<{ f: number }> = ({ f }) => {
  const beat = f < 380 ? 1 : f < 720 ? 2 : 3;

  return (
    <g>
      <StationEnvironment f={f} timeOfDay="winter" />

      {beat === 1 && (
        <g>
          {/* Curled on bench in snow */}
          <StickDog x={710} y={710} f={f} action="sleep" />
          <HudBadge
            category="Passing of Years"
            headline="THROUGH FREEZING BLIZZARDS AND STORMS"
            accentColor="#94A3B8"
            f={f}
          />
        </g>
      )}

      {beat === 2 && (
        <g>
          {/* Station master bringing warm bowl of food */}
          <StickDog x={710} y={710} f={f} action="old" />
          {/* Bowl of food */}
          <ellipse cx={810} cy={745} rx={18} ry={8} fill="#D97706" stroke="#0F172A" strokeWidth={2} />
          <HudBadge
            category="Enduring Heart"
            headline="HIS MUZZLE GRAYED, BUT HIS EYES NEVER WAIVERED"
            accentColor="#FBBF24"
            f={f - 380}
          />
        </g>
      )}

      {beat === 3 && (
        <g>
          {/* Integrated Subscribe Callout */}
          <StickDog x={710} y={710} f={f} action="old" />
          <SubscribeCallout f={f - 720} />
        </g>
      )}
    </g>
  );
};

// ========================================================
// 10. CHAPTER 4: THE TIRED EYES (950 frames / 31.6s)
// ========================================================
export const Chapter4: React.FC<{ f: number }> = ({ f }) => {
  const beat = f < 450 ? 1 : 2;

  return (
    <g>
      <StationEnvironment f={f} timeOfDay="dusk" />

      {beat === 1 && (
        <g>
          {/* Old Barnaby resting chin on paws */}
          <StickDog x={710} y={710} f={f} action="old" />
          <HudBadge
            category="Ten Years"
            headline="OVER 3,000 TRAINS ARRIVED AND DEPARTED"
            accentColor="#94A3B8"
            f={f}
          />
        </g>
      )}

      {beat === 2 && (
        <g>
          {/* Peaceful closing of eyes */}
          <StickDog x={710} y={710} f={f} action="sleep" />
          <HudBadge
            category="The Promise Kept"
            headline="RESTING HIS CHIN AND CLOSING TIRED EYES"
            accentColor="#F59E0B"
            f={f - 450}
          />
        </g>
      )}
    </g>
  );
};

// ========================================================
// 11. CHAPTER 5: THE FINAL TRAIN HOME (1180 frames / 39.3s)
// ========================================================
export const Chapter5: React.FC<{ f: number }> = ({ f }) => {
  const beat = f < 300 ? 1 : f < 650 ? 2 : f < 950 ? 3 : 4;

  return (
    <g>
      <StationEnvironment f={f} timeOfDay="golden" />

      {beat === 1 && (
        <g>
          {/* Golden train glides in, doors open */}
          <StickDog x={710} y={750} f={f} action="sit" />
          <HudBadge
            category="The Golden Whistle"
            headline="A FAMILIAR SOUND ECHOES THROUGH THE LIGHT"
            accentColor="#FBBF24"
            f={f}
          />
        </g>
      )}

      {beat === 2 && (
        <g>
          {/* Arthur steps out with open arms */}
          <StickArthur x={450} y={750} f={f} action="reunion" />
          <StickDog x={780} y={750} f={f} action="walk" />
          <HudBadge
            category="Eternal Reunion"
            headline="ARTHUR KNEELS WITH OPEN ARMS"
            accentColor="#F59E0B"
            f={f - 300}
          />
        </g>
      )}

      {beat === 3 && (
        <g>
          {/* Barnaby leaps high into Arthur's arms */}
          <StickArthur x={650} y={750} f={f} action="kneel" />
          <StickDog x={680} y={640} f={f} action="jump" />
          <HudBadge
            category="Reunion"
            headline="'GOOD BOY, BARNABY. THANK YOU FOR WAITING.'"
            accentColor="#10B981"
            f={f - 650}
          />
        </g>
      )}

      {beat === 4 && (
        <g>
          {/* Arthur & Barnaby walking together into the light */}
          <StickArthur x={interpolate(f, [950, 1180], [650, 1100])} y={750} f={f} action="walk" />
          <StickDog x={interpolate(f, [950, 1180], [740, 1190])} y={750} f={f} action="walk" />

          {/* Closing Philosophy HUD Badge */}
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
              WAITING AT PLATFORM 4
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
              “To the world you are one person, but to a dog you are their whole world.”
            </text>
          </g>
        </g>
      )}
    </g>
  );
};

// ========================================================
// 12. MOBILE SHORT (1169 frames / 38.9s)
// ========================================================
export const PlatformDogShort: React.FC<{ f: number }> = ({ f }) => {
  return (
    <g>
      {f < 250 ? (
        <Chapter1 f={f} />
      ) : f < 520 ? (
        <Chapter2 f={f - 250} />
      ) : f < 800 ? (
        <Chapter3 f={f - 520} />
      ) : (
        <Chapter5 f={f - 800} />
      )}
    </g>
  );
};

