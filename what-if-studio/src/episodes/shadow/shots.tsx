import React from 'react';
import {
  LightVeil, Glow, Foreground,
  Hero, Pose, Look, basePose, poseAt, faceAt, kf, clamp, easeOut, camT, LOOKS, LEG_LEN, reachAngle, walkPose,
  Bedroom, BedDuvet, bedSit, BEDROOM, LAMP, WINDOW,
  Tabletop, Schematic, SCH, Arrow, SchLabel, CountUp, DrawOn,
  Sparkle, TitleCard, ShotProps,
} from '../../engine';

// "What if your shadow could move on its own?" Eleven shots on two sets (the bedroom at night, the schematic).
// The power: Pip says "Detach" and his shadow - the one rig in a silhouette costume, a cool violet rim where the
// light catches its edge - stands up and acts for him. Each shot is a pure function of its own clock t.

const PIP = LOOKS.pipHood;
const MO = LOOKS.mo;
const VIOLET = '#B79CFF';

/** The shadow: the rig in a silhouette costume, a cool violet rim where the light catches its edge. */
const SHADOW_LOOK: Look = {
  skin: '#191527',
  skinShade: '#110E1C',
  hand: '#191527',
  jacket: '#191527',
  jacketShade: '#110E1C',
  accent: '#262040',
  limb: '#110E1C',
  line: '#0A0812',
  shoe: '#110E1C',
  face: '#191527',
  hair: '#191527',
  extra: 'hood',
};

const SEAT = bedSit(0.24);
const CLOCK = '22:47';

// ---------- S1: medium, the bedroom, lamp on: Pip sits up in bed and points at the dresser ----------
export const S1: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: SEAT.x, y: SEAT.y, scale: SEAT.scale, yaw: 0.45, look: 0.7, armL: { a: 12, b: -6 }, armR: { a: 24, b: -8 } } },
    { f: 6, p: { armR: { a: 58, b: 0 }, handR: 'point' }, ease: easeOut },
    { f: 12, p: { armR: { a: 62, b: 0 } } },
    { f: 20, p: { look: -0.3, headTilt: -4 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, SEAT.x + 70], [len, SEAT.x + 80]]), SEAT.y - 130, kf(t, [[0, 1.95], [len, 2.05]]))}>
      <Bedroom t={t + 40} id="bd1" duvet={false} clock={CLOCK} crossed={0} lamp={1} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [10, 'smug']]) }} rimId="rimR" shadow={0} />
      <BedDuvet from={0.05} />
    </g>
  );
};

// ---------- S2: wide: the silhouette peels off the floor and walks toward the dresser ----------
const G2 = BEDROOM.P(0.55, 1, 0.5).y;
const S2_SCALE = 0.62 * 422 * BEDROOM.s(0.5) / 378;
export const S2: React.FC<ShotProps> = ({ t, len }) => {
  const shPose = walkPose(kf(t, [[0, 700], [len, 980]]), t * 0.7, G2, S2_SCALE, { yaw: 0.2 }, 1);
  const seatPose: Pose = { ...basePose, x: SEAT.x, y: SEAT.y, scale: SEAT.scale, yaw: 0.45, look: 0.8, armL: { a: 12, b: -6 }, armR: { a: 58, b: 0 }, handR: 'point', ...faceAt(t, [[0, 'smug']]) };
  return (
    <g transform={camT(960, kf(t, [[0, 550], [len, 540]]), kf(t, [[0, 0.95], [len, 0.98]]))}>
      <Bedroom t={t + 70} id="bd2" duvet={false} clock={CLOCK} crossed={0} lamp={1} />
      <Hero look={PIP} pose={seatPose} rimId="rimR" shadow={0} />
      <BedDuvet from={0.05} />
      <Glow x={kf(t, [[0, 700], [len, 980]])} y={G2 + 10} r={280} kind="cool" o={0.25} />
      <Hero look={SHADOW_LOOK} pose={shPose} rimId="rimBlue" shadow={0} />
      <Foreground blur={6}>
        <path d="M -40 1080 L 320 1080 Q 300 900 360 820 L -40 760 Z" fill="#0C0A14" />
      </Foreground>
    </g>
  );
};

// ---------- S3: top-down insert over the dresser top: the shadow's mitten lifts the remote ----------
export const S3: React.FC<ShotProps> = ({ t, len }) => {
  const hx = kf(t, [[0, 340], [12, 1080], [18, 1080], [30, 520]]);
  const hy = kf(t, [[0, 1220], [12, 540], [18, 540], [30, 1140]]);
  return (
    <g transform={camT(960, kf(t, [[0, 520], [len, 540]]), kf(t, [[0, 1.0], [len, 1.06]]))}>
      <Tabletop edge={1400} wood="#4E3E46" grain="#42343C" lip="#332830" floor="#14101C" floorLines="#100D16" />
      <LightVeil id="s3veil" lights={[[960, 220, 780]]} o={0.5} />
      <Glow x={960} y={240} r={640} kind="cool" o={0.3} />
      {/* the plant and the speaker that live on the dresser */}
      <circle cx={300} cy={330} r={86} fill="#000" opacity={0.3} />
      <ellipse cx={300} cy={310} rx={70} ry={26} fill="#5A4636" />
      {[[-52, -60], [-8, -84], [30, -58], [56, -34]].map(([dx, dy], i) => (
        <path key={i} d={`M 300 300 Q ${300 + dx * 0.5} ${300 + dy * 0.6} ${300 + dx} ${300 + dy} Q ${300 + dx * 0.6} ${300 + dy * 0.5} 300 300 Z`} fill={i % 2 ? '#3F5E44' : '#4E7350'} />
      ))}
      <rect x={1420} y={300} width={130} height={170} rx={14} fill="#1E1C28" />
      <circle cx={1485} cy={360} r={22} fill="#2E2C3A" />
      <circle cx={1485} cy={420} r={10} fill="#2E2C3A" />
      {/* the remote, then the shadow's arm takes it away */}
      <g transform={`translate(${t > 18 ? hx - 1080 : 0} ${t > 18 ? hy - 540 : 0})`}>
        <rect x={1020} y={510} width={120} height={62} rx={12} fill="#26222E" stroke="#0F0D14" strokeWidth={5} />
        <rect x={1040} y={528} width={26} height={12} rx={6} fill="#C9503E" />
        <rect x={1076} y={528} width={26} height={12} rx={6} fill="#4A4556" />
        <rect x={1040} y={548} width={62} height={10} rx={5} fill="#4A4556" />
      </g>
      {/* the shadow's arm, from the bottom left: dark sleeve, dark mitten, violet edge */}
      <g filter="url(#rimBlue)" opacity={0.94}>
        <path d={`M ${hx + 50} ${hy - 50} Q ${hx - 120} ${hy + 240} ${hx - 380} ${hy + 520}`} stroke="#0A0812" strokeWidth={118} fill="none" strokeLinecap="round" />
        <path d={`M ${hx + 50} ${hy - 50} Q ${hx - 120} ${hy + 240} ${hx - 380} ${hy + 520}`} stroke="#191527" strokeWidth={100} fill="none" strokeLinecap="round" />
        <g transform={`translate(${hx} ${hy}) rotate(-30) scale(4.8)`}>
          <rect x={-4} y={10} width={8} height={24} rx={4} fill="#191527" stroke="#0A0812" strokeWidth={2.4} />
          <path d="M -11 -2 Q -14 14 -6 18 L 7 18 Q 14 14 11 -2 Z" fill="#191527" stroke="#0A0812" strokeWidth={2.6} strokeLinejoin="round" />
          <ellipse cx={10} cy={6} rx={4.5} ry={7} fill="#191527" stroke="#0A0812" strokeWidth={2.4} />
        </g>
      </g>
      <Sparkle x={1150} y={430} t={t - 20} s={0.9} />
    </g>
  );
};

// ---------- S4: medium wide, high angle: the shadow reaches the lamp and pulls it dark ----------
const NS_FLOOR = BEDROOM.P(0.56, 1, 0.18);
const S4_STAND = { x: NS_FLOOR.x, y: NS_FLOOR.y - LEG_LEN * (0.62 * 422 * BEDROOM.s(0.18) / 378), scale: 0.62 * 422 * BEDROOM.s(0.18) / 378 };
export const S4: React.FC<ShotProps> = ({ t, len }) => {
  const lamp = kf(t, [[0, 1], [46, 1], [50, 0]]);
  const aim = reachAngle({ ...basePose, x: S4_STAND.x, y: S4_STAND.y, scale: S4_STAND.scale, yaw: 0.2 }, { x: LAMP.x, y: LAMP.y + 16 });
  const shPose = poseAt(t, [
    { f: 0, p: { ...walkPose(620, 0, NS_FLOOR.y, S4_STAND.scale, {}, 1), yaw: 0.3 } },
    { f: 22, p: { x: S4_STAND.x, y: S4_STAND.y, scale: S4_STAND.scale } },
    { f: 28, p: { armR: { a: aim - 10, b: -4 }, handR: 'open' }, ease: easeOut },
    { f: 40, p: { armR: { a: aim, b: 0 } } },
    { f: 48, p: { armR: { a: aim + 44, b: 8 } }, ease: easeOut },
    { f: 58, p: { armR: { a: 30, b: -8 }, handR: 'open', headTilt: 6 } },
  ]);
  const pose = poseAt(t, [
    { f: 0, p: { x: SEAT.x, y: SEAT.y, scale: SEAT.scale, yaw: 0.4, look: 0.6, armL: { a: 12, b: -6 }, armR: { a: 20, b: -8 } } },
    { f: 46, p: { look: 0.2, headTilt: 6 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, LAMP.x - 60], [len, LAMP.x - 30]]), kf(t, [[0, 640], [len, 610]]), kf(t, [[0, 1.42], [len, 1.58]]))}>
      <Bedroom t={t + 90} id="bd4" duvet={false} clock={CLOCK} crossed={0} lamp={lamp} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [48, 'shock']]) }} rimId="rimR" shadow={0} />
      <BedDuvet from={0.05} />
      <Glow x={LAMP.x} y={LAMP.y} r={200} kind="cool" o={0.22 * clamp((t - 50) / 8)} />
      <Hero look={SHADOW_LOOK} pose={shPose} rimId="rimBlue" shadow={0} />
      <Foreground blur={10}>
        <path d="M 1560 1080 Q 1520 800 1620 640 Q 1700 840 1740 1080 Z" fill="#0C0A14" />
      </Foreground>
    </g>
  );
};

// ---------- S5: over Pip's shoulder: Mo leans in at the lit doorway waving; the shadow waves back first ----------
const MO5 = { x: BEDROOM.P(0.05, 1, 0.78).x, y: BEDROOM.P(0.05, 1, 0.78).y - LEG_LEN * (0.62 * 422 * BEDROOM.s(0.78) / 378), scale: 0.62 * 422 * BEDROOM.s(0.78) / 378 };
const SH5 = { x: BEDROOM.P(0.3, 1, 0.5).x, y: BEDROOM.P(0.3, 1, 0.5).y - LEG_LEN * (0.62 * 422 * BEDROOM.s(0.5) / 378), scale: 0.62 * 422 * BEDROOM.s(0.5) / 378 };
export const S5: React.FC<ShotProps> = ({ t, len }) => {
  const wave = Math.sin(t / 3) * 14;
  const shWave = t > 16 ? Math.sin((t - 16) / 3) * 16 : 0;
  const moPose = poseAt(t, [
    { f: 0, p: { x: MO5.x, y: MO5.y, scale: MO5.scale, yaw: 0.85, tilt: 7, look: 0.9, armL: { a: 12, b: -6 }, armR: { a: 122 + wave, b: 12 }, handR: 'open' } },
    { f: 34, p: { look: 0.3, headTilt: -5, armR: { a: 60, b: 10 } }, ease: easeOut },
  ]);
  const shPose = poseAt(t, [
    { f: 0, p: { x: SH5.x, y: SH5.y, scale: SH5.scale * 1.06, yaw: 0.5, look: 0.6, armL: { a: 12, b: -6 }, armR: { a: 20, b: -8 } } },
    { f: 16, p: { armR: { a: 128 + shWave, b: 10 }, handR: 'open' }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 560], [len, 545]]), 430, kf(t, [[0, 1.3], [len, 1.38]]))}>
      <Bedroom t={t + 130} id="bd5" duvet={false} clock={CLOCK} crossed={0} lamp={0} />
      <Hero look={MO} pose={{ ...moPose, ...faceAt(t, [[0, 'happy'], [34, 'shock']]) }} rimId="rimR" shadow={0.4} />
      <Glow x={SH5.x} y={SH5.y + 10} r={240} kind="cool" o={0.2} />
      <Hero look={SHADOW_LOOK} pose={shPose} rimId="rimBlue" shadow={0} />
      <Foreground blur={10}>
        <path d="M 700 1080 Q 720 780 900 700 Q 1080 640 1180 760 Q 1260 860 1280 1080 Z" fill="#100D18" />
        <circle cx={960} cy={620} r={130} fill="#16121F" />
        <path d="M 850 560 Q 880 420 980 420 Q 1080 420 1100 560" stroke="#FFB46A" strokeWidth={5} fill="none" opacity={0.3} />
      </Foreground>
    </g>
  );
};

// ---------- S6: close-up: Pip, uneasy in the moonlight, looks from the wave to Mo ----------
export const S6: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 3.9 * (1 + 0.04 * clamp(t / len));
  const head = { x: 960, y: 700 };
  const pose: Pose = { ...basePose, x: head.x, y: head.y - 378 * sc * 0.42, scale: sc, yaw: -0.35, look: -0.8, armL: { a: 14, b: -6 }, armR: { a: 14, b: -6 }, headTilt: kf(t, [[0, 0], [8, -6]]), ...faceAt(t, [[0, 'oops'], [8, 'worried']]) };
  return (
    <g>
      <g filter="url(#blur16)">
        <g transform="translate(-500 -620) scale(2)">
          <Bedroom t={t + 160} id="bd6" duvet clock={CLOCK} crossed={0} lamp={0} />
        </g>
      </g>
      <rect x={0} y={0} width={1920} height={1080} fill="#07040C" opacity={0.25} />
      <Hero look={PIP} pose={pose} rimId="rimR" shadow={0} />
    </g>
  );
};

// ---------- S7: the title, wide: Pip and his shadow standing side by side on the moonlit floor ----------
const P7 = { x: BEDROOM.P(0.48, 1, 0.5).x, y: BEDROOM.P(0.48, 1, 0.5).y - LEG_LEN * (0.62 * 422 * BEDROOM.s(0.5) / 378), scale: 0.62 * 422 * BEDROOM.s(0.5) / 378 };
const SH7P = BEDROOM.P(0.64, 1, 0.42);
const SH7 = { x: SH7P.x, y: SH7P.y - LEG_LEN * (0.62 * 422 * BEDROOM.s(0.42) / 378) * 1.08, scale: 0.62 * 422 * BEDROOM.s(0.42) / 378 * 1.08 };
export const S7: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: P7.x, y: P7.y, scale: P7.scale, yaw: 0.1, look: 0.6, armL: { a: 14, b: -6 }, armR: { a: 14, b: -6 } } },
    { f: 30, p: { headTilt: 4 } },
  ]);
  const shPose = poseAt(t, [
    { f: 0, p: { x: SH7.x, y: SH7.y, scale: SH7.scale, yaw: -0.1, armL: { a: 12, b: -6 }, armR: { a: 12, b: -6 } } },
    { f: 36, p: { armR: { a: 26, b: -4 }, headTilt: 5 }, ease: easeOut },
  ]);
  return (
    <g transform={camT(960, kf(t, [[0, 520], [len, 545]]), kf(t, [[0, 1.0], [len, 1.07]]))}>
      <Bedroom t={t} id="bd7" duvet={false} clock={CLOCK} crossed={0} lamp={0} />
      <Glow x={(WINDOW.x0 + WINDOW.x1) / 2} y={480} r={520} kind="cool" o={0.3} />
      <Hero look={SHADOW_LOOK} pose={shPose} rimId="rimBlue" shadow={0} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'neutral']]) }} rimId="rimR" shadow={0} />
      <TitleCard t={t} lines={['WHAT IF YOUR SHADOW', 'MOVED ON ITS OWN?']} accent="OWN?" accentT={44} size={100} y={170} />
    </g>
  );
};

// ---------- S8: schematic: a shadow is a hole in the light - no photons, no mass ----------
export const S8: React.FC<ShotProps> = ({ t }) => (
  <g transform={`translate(960 540) scale(${kf(t, [[0, 1], [64, 1.05]])}) translate(-960 -540)`}>
    <Schematic t={t} id="sch8" />
    <SchLabel x={960} y={170} t={t - 2} text="A SHADOW IS A HOLE IN THE LIGHT" size={54} />
    {(() => {
      const on = clamp((t - 4) / 6);
      return (
        <g opacity={on}>
          <circle cx={280} cy={400} r={80} fill="none" stroke={SCH.live} strokeWidth={8} />
          {Array.from({ length: 8 }).map((_, i) => {
            const a = (i / 8) * Math.PI * 2 + t / 40;
            return <path key={i} d={`M ${280 + Math.cos(a) * 100} ${400 + Math.sin(a) * 100} L ${280 + Math.cos(a) * 138} ${400 + Math.sin(a) * 138}`} stroke={SCH.live} strokeWidth={7} strokeLinecap="round" opacity={0.7} />;
          })}
        </g>
      );
    })()}
    {[0, 1, 2].map((i) => (
      <Arrow key={i} x0={430} y0={340 + i * 70} x1={660} y1={340 + i * 70} t={t - 10 - i * 4} />
    ))}
    {/* you: the blocker */}
    {(() => {
      const on = clamp((t - 10) / 6);
      return (
        <g opacity={on} stroke={SCH.live} strokeWidth={9} fill="none" strokeLinecap="round">
          <circle cx={790} cy={350} r={44} />
          <path d="M 790 394 L 790 540 M 790 430 L 730 490 M 790 430 L 850 490 M 790 540 L 750 640 M 790 540 L 830 640" />
        </g>
      );
    })()}
    <SchLabel x={790} y={700} t={t - 16} text="YOU" size={44} />
    {/* the rays that get past, bending round the hole */}
    <DrawOn d="M 680 320 Q 900 250 1240 310" t={t - 30} dur={10} />
    <DrawOn d="M 680 470 Q 900 540 1240 480" t={t - 36} dur={10} />
    {/* the shadow: the hole where the light is missing */}
    {(() => {
      const on = clamp((t - 24) / 8);
      return (
        <g opacity={on}>
          <circle cx={1030} cy={350} r={44} fill="#0B0E1A" stroke={SCH.dim} strokeWidth={4} />
          <path d="M 1030 394 L 1030 540 M 1030 430 L 970 490 M 1030 430 L 1090 490 M 1030 540 L 990 640 M 1030 540 L 1070 640" stroke="#0B0E1A" strokeWidth={30} fill="none" strokeLinecap="round" />
          <SchLabel x={1030} y={700} t={t - 30} text="YOUR SHADOW" size={44} />
        </g>
      );
    })()}
    <SchLabel x={960} y={820} t={t - 44} text="NO PHOTONS · NO MASS" size={38} color={SCH.dim} />
    <SchLabel x={960} y={890} t={t - 54} text="NOT A THING" size={50} color={SCH.live} />
  </g>
);

// ---------- S9: schematic: the beam on the Moon; a flick sweeps the edge at 12.8 times light speed ----------
export const S9: React.FC<ShotProps> = ({ t }) => (
  <g>
    <Schematic t={t + 40} id="sch9" />
    {/* you, flicking your hand; the beam it casts */}
    {(() => {
      const on = clamp((t - 2) / 6);
      return (
        <g opacity={on} stroke={SCH.live} strokeWidth={9} fill="none" strokeLinecap="round">
          <circle cx={280} cy={420} r={44} />
          <path d="M 280 464 L 280 610 M 280 500 L 220 560 M 280 500 L 340 560 M 280 610 L 240 710 M 280 610 L 320 710" />
          <path d={`M 280 500 L ${300 + 8 * Math.sin(t / 9)} 380 L ${340 + 12 * Math.sin(t / 9)} 320`} strokeWidth={8} />
        </g>
      );
    })()}
    <DrawOn d="M 360 400 L 1180 290" t={t - 8} dur={12} />
    <SchLabel x={280} y={790} t={t - 22} text="ONE FLICK · 1 RADIAN · 0.1 s" size={36} />
    {/* the Moon the beam lands on */}
    {(() => {
      const on = clamp((t - 14) / 6);
      return (
        <g opacity={on}>
          <circle cx={1330} cy={290} r={88} fill="#0B0E1A" stroke={SCH.live} strokeWidth={8} />
          <circle cx={1300} cy={270} r={14} fill="none" stroke={SCH.dim} strokeWidth={4} />
          <circle cx={1355} cy={315} r={9} fill="none" stroke={SCH.dim} strokeWidth={4} />
          <SchLabel x={1330} y={430} t={t - 18} text="MOON · 384,400 KM" size={38} />
        </g>
      );
    })()}
    {/* the shadow's edge sweeping across the Moon's face */}
    {(() => {
      const sw = clamp((t - 30) / 22);
      return (
        <g opacity={clamp((t - 30) / 4)}>
          <path d={`M ${1330 - 88 + 176 * sw} 202 L ${1330 - 88 + 176 * sw} 378`} stroke={SCH.live} strokeWidth={8} strokeDasharray="16 10" />
          <path d={`M ${1330 - 88 + 176 * sw} 202 L ${1330 - 88 + 176 * sw + 60} 180`} stroke={SCH.live} strokeWidth={7} strokeLinecap="round" />
        </g>
      );
    })()}
    <CountUp x={820} y={790} t={t - 34} to={12.8} dur={42} size={110} format={(v) => v.toFixed(1)} />
    <SchLabel x={820} y={880} t={t - 40} text="× LIGHT SPEED" size={46} />
    <SchLabel x={820} y={660} t={t - 52} text="A HOLE IN THE LIGHT HAS NO SPEED LIMIT" size={30} color={SCH.dim} />
  </g>
);

// ---------- S10: extreme close-up: "That's real." Pip, worried, the rims cooling toward red ----------
export const S10: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 6.6 * (1 + 0.04 * clamp(t / len));
  const head = { x: 960, y: 720 };
  const pose: Pose = { ...basePose, x: head.x, y: head.y - 378 * sc * 0.42, scale: sc, yaw: 0.12, look: 0.1, armL: { a: 14, b: -6 }, armR: { a: 14, b: -6 }, ...faceAt(t, [[0, 'worried']]) };
  return (
    <g>
      <g filter="url(#blur16)">
        <g transform="translate(-500 -620) scale(2)">
          <Bedroom t={t + 200} id="bd10" duvet clock={CLOCK} crossed={0} lamp={0} />
        </g>
      </g>
      <rect x={0} y={0} width={1920} height={1080} fill="#07040C" opacity={0.22} />
      <Hero look={PIP} pose={pose} rimId={t > len * 0.55 ? 'rimRed' : 'rimR'} shadow={0} />
    </g>
  );
};

// ---------- S11: wide, low angle: the shadow waves on its own behind still Pip, then walks out through the door ----------
const P11 = { x: BEDROOM.P(0.6, 1, 0.55).x, y: BEDROOM.P(0.6, 1, 0.55).y - LEG_LEN * (0.62 * 422 * BEDROOM.s(0.55) / 378), scale: 0.62 * 422 * BEDROOM.s(0.55) / 378 };
const G11 = (x: number) => kf(x, [[280, BEDROOM.P(0.08, 1, 0.68).y], [1250, BEDROOM.P(0.78, 1, 0.4).y]]);
export const S11: React.FC<ShotProps> = ({ t, len }) => {
  const wave = t > 4 && t < 26 ? Math.sin((t - 4) / 3) * 16 : 0;
  const shPose = poseAt(t, [
    { f: 0, p: { x: BEDROOM.P(0.78, 1, 0.4).x, y: BEDROOM.P(0.78, 1, 0.4).y - LEG_LEN * 0.72, scale: 0.72, yaw: -0.3, armL: { a: 12, b: -6 }, armR: { a: 12, b: -6 } } },
    { f: 4, p: { armR: { a: 132 + wave, b: 10 }, handR: 'open' }, ease: easeOut },
    { f: 26, p: {} },
    { f: 30, p: { yaw: -0.5, armR: { a: 16, b: -6 }, handR: 'open' }, ease: easeOut },
  ]);
  const walking = t >= 30;
  const shX = kf(t, [[30, BEDROOM.P(0.78, 1, 0.4).x], [60, 240]]);
  const shScale = kf(shX, [[280, 0.6], [1250, 0.72]]);
  const shWalk = walkPose(shX, (t - 30) * 0.62, G11, shScale, { yaw: -0.5 }, -1);
  const fade = 1 - clamp((t - 54) / 10);
  const pose = poseAt(t, [
    { f: 0, p: { x: P11.x, y: P11.y, scale: P11.scale, yaw: -0.4, look: -0.8, armL: { a: 14, b: -6 }, armR: { a: 14, b: -6 } } },
    { f: 28, p: { headTilt: 6, look: -0.9 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 930]]), kf(t, [[0, 540], [len, 520]]), kf(t, [[0, 1.0], [len, 1.12]]))}>
      <Bedroom t={t + 230} id="bd11" duvet={false} clock={CLOCK} crossed={0} lamp={0} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'worried'], [30, 'shock']]) }} rimId="rimRed" shadow={0} />
      <Glow x={BEDROOM.P(0.78, 1, 0.4).x} y={G11(BEDROOM.P(0.78, 1, 0.4).x) + 10} r={280} kind="cool" o={0.2 * fade} />
      <g opacity={fade}>
        <Hero look={SHADOW_LOOK} pose={walking ? shWalk : shPose} rimId="rimBlue" shadow={0} />
      </g>
    </g>
  );
};
