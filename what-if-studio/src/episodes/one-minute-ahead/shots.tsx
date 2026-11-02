import React from 'react';
import {
  Hero, Pose, basePose, poseAt, faceAt, kf, clamp, easeOut, easeIn, rnd, settle, camT, LOOKS, LEG_LEN, joints, toWorld, walkPose,
  KITCHEN, Kitchen, KitchenIsland, islandTop, Classroom, CLS, SchoolDesk, Stairwell, SW, Banister, hipGround, Rooftop, Schematic,
  SCH, SchLabel, CountUp, DrawOn, Arrow, Mug, PaperBall, Cat, Foreground, Glow, FocusRings, Sparkle, Dust, TitleCard,
  ShotProps, stand,
} from '../../engine';

// "What if you could see one minute ahead?" Seventeen shots on five sets (kitchen, classroom, stairwell, rooftop,
// schematic). The power: the next minute plays as luminous cyan ghosts under the AHEAD look, and Pip's life follows
// the script anyway. Each shot is a pure function of its own clock t.

const PIP = LOOKS.pipHood;
const MO = LOOKS.mo;
const CYAN = '#7FD4FF';

/** The future: whatever is inside renders as a luminous cyan ghost over the scene. */
const Ghost: React.FC<{ id: string; children: React.ReactNode }> = ({ id, children }) => (
  <g>
    <defs>
      <filter id={id} x="-40%" y="-40%" width="180%" height="180%">
        <feColorMatrix
          type="matrix"
          values="0.18 0.18 0.18 0 0.02
                  0.52 0.48 0.52 0 0.10
                  0.78 0.72 0.78 0 0.14
                  0    0    0    0 0.78"
        />
      </filter>
    </defs>
    <g filter={`url(#${id})`} style={{ mixBlendMode: 'screen' }}>
      {children}
    </g>
  </g>
);

// ---------- S1: medium, the kitchen: Pip behind the island, the mug at its edge ----------
const K_STAND = stand(KITCHEN, 0.42, 0.4);
const K_MUG = islandTop(0.63, 0.5);
export const S1: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: K_STAND.x, y: K_STAND.y, scale: K_STAND.scale, yaw: 0.45, look: 0.7, armR: { a: 26, b: -8 }, armL: { a: 12, b: -6 } } },
    { f: 5, p: { armR: { a: 36, b: -4 }, headTilt: 3, handR: 'point' }, ease: easeOut },
    { f: 9, p: {} },
  ]);
  const face = faceAt(t, [[0, 'neutral']]);
  return (
    <g transform={camT(kf(t, [[0, 905], [len, 918]]), 590, kf(t, [[0, 1.85], [len, 1.9]]))}>
      <Kitchen t={t + 60} id="k1" />
      <Hero look={PIP} pose={{ ...pose, ...face }} rimId="rimR" shadow={0} />
      <KitchenIsland />
      <Mug x={K_MUG.x} y={K_MUG.y - 6} rot={0} f={t + 60} />
      <Foreground blur={10}>
        <path d="M -60 1080 L -40 700 Q 120 660 260 720 L 300 1080 Z" fill="#101612" />
      </Foreground>
    </g>
  );
};

// ---------- S2: macro insert, side angle on the island edge: the future plays, the ghost mug tips ----------
export const S2: React.FC<ShotProps> = ({ t }) => {
  const tip = easeIn(clamp((t - 6) / 18));
  const gx = kf(t, [[6, 1150], [24, 1450]]);
  const gy = kf(t, [[6, 736], [24, 1010]]);
  return (
    <g>
      {/* the kitchen behind, out of focus: dark panels and window bokeh */}
      <g filter="url(#blur16)">
        <rect x={-200} y={-200} width={2400} height={1400} fill="#141A1E" />
        {[0, 1, 2, 3, 4].map((i) => (
          <rect key={i} x={60 + i * 190} y={-100} width={120} height={900} fill="#1B232A" />
        ))}
        <circle cx={430} cy={200} r={190} fill="#E08A5E" opacity={0.5} />
        <circle cx={610} cy={330} r={120} fill="#FFC27A" opacity={0.4} />
      </g>
      <rect x={-200} y={-200} width={2400} height={1400} fill="#07040C" opacity={0.14} />
      <Glow x={480} y={220} r={640} o={0.45} />
      {/* the island's top slab and its front side crossing the frame */}
      <rect x={-200} y={736} width={2400} height={30} fill="#9A8472" />
      <rect x={-200} y={764} width={2400} height={320} fill="#4F5F5A" />
      <rect x={-200} y={764} width={2400} height={10} fill="#3E4B47" />
      <path d="M -200 736 L 2200 736" stroke="#C9AF94" strokeWidth={3} opacity={0.7} />
      {/* the ledge edge, where the future drop happens */}
      <rect x={1240} y={736} width={26} height={348} fill="#44554F" />
      <ellipse cx={1150} cy={738} rx={200} ry={14} fill="#E08A5E" opacity={0.12} style={{ mixBlendMode: 'screen' }} />
      {/* the real mug, standing */}
      <Mug x={1150} y={736} rot={0} f={t} />
      <ellipse cx={1150} cy={740} rx={110} ry={12} fill="#000" opacity={0.35} />
      {/* the future: the same mug tips off the edge */}
      {t > 5 ? (
        <Ghost id="s2g">
          <Mug x={gx} y={gy} rot={-6 - 128 * tip} steam={0} f={t} />
        </Ghost>
      ) : null}
      <Foreground blur={10}>
        <path d="M -60 1080 L -60 820 Q 240 790 420 850 L 500 1080 Z" fill="#0C130E" />
      </Foreground>
    </g>
  );
};

// ---------- S3: close-up: Pip watching the future view, eyes lit ----------
export const S3: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 4.1 * (1 + 0.03 * clamp(t / len));
  const head = { x: 920, y: 600 };
  const pose: Pose = {
    ...basePose,
    x: head.x,
    y: head.y + 176 * sc,
    scale: sc,
    yaw: 0.35,
    look: 0.75,
    armL: { a: 14, b: -6 },
    armR: { a: 18, b: -8 },
    ...faceAt(t, [[0, 'neutral'], [11, 'worried']]),
  };
  return (
    <g>
      <g filter="url(#blur16)">
        <rect x={-200} y={-200} width={2400} height={1400} fill="#161C20" />
        <circle cx={340} cy={230} r={220} fill="#E08A5E" opacity={0.5} />
        <circle cx={560} cy={360} r={130} fill="#FFC27A" opacity={0.4} />
        <circle cx={1720} cy={760} r={300} fill="#1E262C" />
      </g>
      <rect x={0} y={0} width={1920} height={1080} fill="#07040C" opacity={0.2} />
      <Glow x={380} y={240} r={700} o={0.35} />
      <Hero look={PIP} pose={{ ...pose, glint: 0.9, glintColor: CYAN }} rimId="rimR" shadow={0} />
      <g transform={`translate(${head.x} ${head.y}) scale(0.35)`}>
        <FocusRings x={0} y={0} t={t} r0={150} color={CYAN} />
      </g>
      <Foreground blur={16}>
        <rect x={-100} y={880} width={1300} height={400} fill="#0A0F0C" />
      </Foreground>
    </g>
  );
};

// ---------- S4: macro insert, low angle: the mitten slides the real mug back from the edge ----------
export const S4: React.FC<ShotProps> = ({ t }) => {
  const slide = easeOut(clamp((t - 5) / 10));
  const mx = 1150 - 155 * slide + settle(t - 15, 3, 1.5, 4);
  const hand = { x: mx - 108, y: 700 };
  return (
    <g>
      <g filter="url(#blur16)">
        <rect x={-200} y={-200} width={2400} height={1400} fill="#141A1E" />
        <circle cx={430} cy={210} r={170} fill="#E08A5E" opacity={0.45} />
        <circle cx={640} cy={320} r={110} fill="#FFC27A" opacity={0.35} />
      </g>
      <rect x={-200} y={-200} width={2400} height={1400} fill="#07040C" opacity={0.2} />
      <Glow x={480} y={220} r={620} o={0.42} />
      <rect x={-200} y={736} width={2400} height={30} fill="#9A8472" />
      <rect x={-200} y={764} width={2400} height={320} fill="#4F5F5A" />
      <rect x={-200} y={764} width={2400} height={10} fill="#3E4B47" />
      <path d="M -200 736 L 2200 736" stroke="#C9AF94" strokeWidth={3} opacity={0.7} />
      <rect x={1240} y={736} width={26} height={348} fill="#44554F" />
      <ellipse cx={mx} cy={740} rx={130} ry={12} fill="#000" opacity={0.35} />
      <Mug x={mx} y={736} rot={0} f={t} />
      <ellipse cx={mx - 40} cy={738} rx={170} ry={14} fill="#E08A5E" opacity={0.14} style={{ mixBlendMode: 'screen' }} />
      {/* the arm comes in from the left, where Pip stands: dark sleeve, light mitten */}
      <g filter="url(#rimR)">
        <path d={`M ${hand.x + 46} ${hand.y - 2} Q ${hand.x - 160} ${hand.y + 60} ${hand.x - 540} ${hand.y + 250}`} stroke={PIP.line} strokeWidth={120} fill="none" strokeLinecap="round" />
        <path d={`M ${hand.x + 46} ${hand.y - 2} Q ${hand.x - 160} ${hand.y + 60} ${hand.x - 540} ${hand.y + 250}`} stroke={PIP.limb} strokeWidth={102} fill="none" strokeLinecap="round" />
        <g transform={`translate(${hand.x} ${hand.y}) rotate(-14) scale(5)`}>
          <rect x={-4} y={10} width={8} height={24} rx={4} fill={PIP.hand} stroke={PIP.line} strokeWidth={2.2} />
          <path d="M -13 -2 Q -16 14 -6 18 L 9 18 Q 15 14 12 -2 Z" fill={PIP.hand} stroke={PIP.line} strokeWidth={2.4} strokeLinejoin="round" />
          <ellipse cx={11} cy={7} rx={4.5} ry={7} fill={PIP.hand} stroke={PIP.line} strokeWidth={2.2} />
        </g>
      </g>
      <Foreground blur={16}>
        <rect x={-100} y={880} width={900} height={400} fill="#0A0F0C" />
      </Foreground>
    </g>
  );
};

// ---------- S5: wide, the kitchen: the mug rests mid-island; Pip sits back smug; the cat wakes ----------
const S5_CAT = KITCHEN.P(0.85, 1, 0.66);
export const S5: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: K_STAND.x, y: K_STAND.y, scale: K_STAND.scale, yaw: 0.4, look: 0.5, armR: { a: 26, b: -8 }, armL: { a: 12, b: -6 }, tilt: 0 } },
    { f: 10, p: { tilt: -8, headTilt: -5, armR: { a: 16, b: -6 }, look: 0.2 }, ease: easeOut },
    { f: 26, p: {} },
  ]);
  const mug = islandTop(0.555, 0.45);
  return (
    <g transform={camT(960, kf(t, [[0, 560], [len, 575]]), kf(t, [[0, 0.96], [len, 1.01]]))}>
      <Kitchen t={t + 130} id="k5" veil={0.34} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [8, 'smug']]) }} rimId="rimR" shadow={0} />
      <KitchenIsland />
      <Mug x={mug.x} y={mug.y - 6} rot={0} f={t + 130} />
      <Cat x={S5_CAT.x} y={S5_CAT.y} mood={t > 18 ? 'alert' : 'sleep'} f={t + 130} />
      <Foreground blur={10}>
        <path d="M 1560 1080 L 1530 620 Q 1680 570 1860 660 L 1980 760 L 1980 1080 Z" fill="#0E1610" />
      </Foreground>
    </g>
  );
};

// ---------- S6: over the shoulder: Mo winds up behind Pip's seat ----------
const CL_MO = stand(CLS, 0.52, 0.46);
const moWind = (t: number) =>
  poseAt(t, [
    { f: 0, p: { x: CL_MO.x, y: CL_MO.y, scale: CL_MO.scale, yaw: 0.55, look: 0.8, armR: { a: 96, b: -30 }, armL: { a: 24, b: -10 } } },
    { f: 12, p: { armR: { a: 152, b: -18 }, tilt: -4, headTilt: -4 }, ease: easeOut },
    { f: 16, p: {} },
  ]);
export const S6: React.FC<ShotProps> = ({ t }) => {
  const mo = moWind(t);
  const ball = toWorld(mo, joints(mo).armR.end);
  return (
    <g transform={camT(kf(t, [[0, CL_MO.x + 130], [16, CL_MO.x + 142]]), 470, kf(t, [[0, 1.5], [16, 1.56]]))}>
      <Classroom t={t + 40} id="cls6" />
      <Hero look={MO} pose={{ ...mo, ...faceAt(t, [[0, 'smug']]) }} rimId="rimL" shadow={0.5} />
      <PaperBall x={ball.x} y={ball.y} r={34} rot={-24} />
      {/* Pip's head and shoulder, near, dark, soft, taking a third of the frame */}
      <Foreground blur={10}>
        <path d="M 1400 1080 Q 1340 640 1490 480 Q 1660 320 1830 470 L 1980 640 L 1980 1080 Z" fill="#14121C" />
        <circle cx={1660} cy={470} r={215} fill="#1A1724" />
        <path d="M 1510 420 Q 1535 265 1655 265 Q 1775 265 1800 420" stroke="#FFB46A" strokeWidth={5} fill="none" opacity={0.3} />
      </Foreground>
    </g>
  );
};

// ---------- S7: macro insert: the future ball arcs straight at the camera ----------
export const S7: React.FC<ShotProps> = ({ t }) => {
  const d = easeIn(clamp((t - 4) / 40));
  const bx = kf(t, [[0, 1520], [44, 1010]]);
  const by = kf(t, [[0, 300], [44, 560]]);
  const br = 110 + 130 * d;
  return (
    <g>
      <g filter="url(#blur16)">
        <rect x={-200} y={-200} width={2400} height={1400} fill="#221A26" />
        <rect x={520} y={40} width={560} height={360} fill="#5A3A3E" />
        <circle cx={260} cy={300} r={220} fill="#E08A5E" opacity={0.4} />
        <circle cx={1760} cy={700} r={260} fill="#3A3240" />
      </g>
      <rect x={-200} y={-200} width={2400} height={1400} fill="#07040C" opacity={0.25} />
      <Glow x={300} y={300} r={600} o={0.35} />
      {/* the trajectory drawing on behind the ball */}
      <path d="M 1560 220 Q 1240 130 980 380" stroke={CYAN} strokeWidth={7} fill="none" strokeDasharray="26 20" opacity={0.55 * easeOut(clamp(t / 10))} />
      {t > 3 ? (
        <Ghost id="s7g">
          <g transform={`translate(${bx} ${by}) rotate(${-30 + 60 * d})`}>
            <PaperBall x={0} y={0} r={br} rot={20 + 90 * d} />
          </g>
        </Ghost>
      ) : null}
      {/* Pip's hood rising into the bottom of frame, where the ball is headed */}
      <Foreground blur={16}>
        <path d="M 640 1080 Q 660 900 780 760 Q 900 660 1080 700 Q 1240 740 1300 900 L 1340 1080 Z" fill="#14121C" />
        <circle cx={960} cy={700} r={190} fill="#1A1724" />
      </Foreground>
    </g>
  );
};

// ---------- S8: medium, the classroom: Pip folds down behind his desk before the throw ----------
export const S8: React.FC<ShotProps> = ({ t, len }) => {
  const duck = poseAt(t, [
    { f: 0, p: { x: 1150, y: 742, scale: 1, facing: -1 as const, yaw: -0.55, look: -0.6, armL: { a: 40, b: -20 }, armR: { a: 30, b: -10 }, legL: { a: 78, b: -78 }, legR: { a: 82, b: -80 }, tilt: 0 } },
    { f: 3, p: { squash: 0.06 } },
    { f: 9, p: { squash: 0.13, tilt: -20, headTilt: -14, look: -0.4, armL: { a: 118, b: -48 }, armR: { a: 96, b: -42 } }, ease: easeOut },
    { f: 14, p: { tilt: -15, headTilt: -10, squash: 0.08 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 1085], [len, 1075]]), kf(t, [[0, 560], [len, 580]]), kf(t, [[0, 2.3], [len, 2.4]]))}>
      <Classroom t={t + 70} id="cls8" />
      <SchoolDesk x={1150} />
      <Hero look={PIP} pose={{ ...duck, ...faceAt(t, [[0, 'worried']]) }} rimId="rimR" shadow={0} />
      <Foreground blur={10}>
        <path d="M 1980 1080 L 1980 600 Q 1780 590 1620 680 L 1560 1080 Z" fill="#100D16" />
      </Foreground>
    </g>
  );
};

// ---------- S9: wide, the classroom: the real throw sails over the ducked desk, the ball smacks the wall ----------
export const S9: React.FC<ShotProps> = ({ t }) => {
  const arc = easeOut(clamp((t - 2) / 15));
  const bx9 = kf(t, [[3, 760], [13, 1180], [21, 1420]]);
  const by9 = kf(t, [[3, 640], [13, 300], [19, 300], [21, 330]]);
  const mo9 = poseAt(t, [
    { f: 0, p: { x: CL_MO.x, y: CL_MO.y, scale: CL_MO.scale, yaw: 0.55, look: 1, armR: { a: 170, b: -30 }, armL: { a: 30, b: -12 } } },
    { f: 5, p: { armR: { a: 20, b: 30 }, tilt: 6, armL: { a: 60, b: 20 } }, ease: easeOut },
    { f: 10, p: {} },
    { f: 14, p: { armR: { a: 30, b: 60 }, headTilt: -6 }, ease: easeOut },
    { f: 20, p: {} },
  ]);
  return (
    <g transform={camT(960, 470, kf(t, [[0, 0.85], [22, 0.9]]))}>
      <Classroom t={t + 110} laugh={t > 12 ? 1 : 0} id="cls9" />
      <Hero look={MO} pose={{ ...mo9, ...faceAt(t, [[0, 'happy'], [16, 'oops']]) }} rimId="rimL" shadow={0.5} />
      <PaperBall x={t < 21 ? bx9 : 1500} y={t < 21 ? by9 : 656} r={40} rot={90 + 200 * arc} />
      <SchoolDesk x={1150} />
      <Hero
        look={PIP}
        pose={{
          ...basePose,
          x: 1150,
          y: 742 - 34 * easeOut(clamp((t - 14) / 8)),
          scale: 1,
          facing: -1 as const,
          yaw: -0.55 + 0.5 * easeOut(clamp((t - 14) / 8)),
          look: -0.3,
          armL: { a: 40, b: -20 },
          armR: { a: 30, b: -10 },
          legL: { a: 78, b: -78 },
          legR: { a: 82, b: -80 },
          tilt: -8,
          headTilt: -4,
          ...faceAt(t, [[0, 'worried'], [18, 'smug']]),
        }}
        rimId="rimR"
        shadow={0}
      />
    </g>
  );
};

// ---------- S10: wide, the stairwell: a ghost of him walks down while he stands frozen ----------
export const S10: React.FC<ShotProps> = ({ t, len }) => {
  const ghostX = 470 + 29 * Math.max(0, t - 3);
  const real = poseAt(t, [
    { f: 0, p: { x: 170, y: SW.top - LEG_LEN, scale: 1, yaw: 0.75, look: 0.9, armL: { a: 14, b: -6 }, armR: { a: 16, b: -6 } } },
    { f: 20, p: {} },
  ]);
  return (
    <g transform={camT(940, kf(t, [[0, 540], [len, 556]]), kf(t, [[0, 0.88], [len, 0.93]]))}>
      <Stairwell t={t + 150} id="sw10" />
      <Ghost id="s10g">
        {t > 3 ? (
          <Hero look={PIP} pose={{ ...walkPose(ghostX, t * 0.5, hipGround(ghostX), 1, {}, 1 as const), ...faceAt(t, [[0, 'neutral']]) }} rimId="rimR" shadow={0} />
        ) : null}
      </Ghost>
      <Hero look={PIP} pose={{ ...real, glint: 0.9, glintColor: CYAN, ...faceAt(t, [[0, 'neutral'], [22, 'worried']]) }} rimId="rimR" shadow={0} />
      <Banister />
    </g>
  );
};

// ---------- S11: close-up: the real Pip holds still; the ghost keeps walking behind him ----------
export const S11: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 4.0 * (1 + 0.03 * clamp(t / len));
  const head = { x: 900, y: 640 };
  const pose: Pose = {
    ...basePose,
    x: head.x,
    y: head.y + 176 * sc,
    scale: sc,
    yaw: 0.6,
    look: 0.85,
    armL: { a: 14, b: -6 },
    armR: { a: 14, b: -6 },
    headTilt: kf(t, [[0, 0], [16, 6]]),
    ...faceAt(t, [[0, 'neutral'], [14, 'worried']]),
  };
  const ghostX = 470 + 29 * (41 + t);
  return (
    <g>
      <g filter="url(#blur16)">
        <g transform="translate(96 -48) scale(0.92)">
          <Stairwell t={t + 170} id="sw11" />
          <Ghost id="s11g">
            <Hero look={PIP} pose={{ ...walkPose(ghostX, t * 0.5, hipGround(ghostX), 1, { expr: 'neutral' }, 1 as const) }} rimId="rimR" shadow={0} />
          </Ghost>
        </g>
      </g>
      <rect x={0} y={0} width={1920} height={1080} fill="#07040C" opacity={0.25} />
      <Hero look={PIP} pose={{ ...pose, glint: 0.85, glintColor: CYAN }} rimId="rimR" shadow={0} />
      <Foreground blur={16}>
        <rect x={-80} y={-200} width={220} height={1400} fill="#0A0F0C" />
      </Foreground>
    </g>
  );
};

// ---------- S12: medium: his feet take him anyway ----------
export const S12: React.FC<ShotProps> = ({ t, len }) => {
  const x12 = 400 + 8 * Math.max(0, t - 6);
  const pose: Pose = t <= 6
    ? poseAt(t, [
        { f: 0, p: { ...basePose, x: 400, scale: 1, yaw: 0.75, facing: 1, look: 0.7, armL: { a: 14, b: -6 }, armR: { a: 14, b: -6 }, squash: 0.03 } },
        { f: 4, p: {} },
      ])
    : { ...walkPose(x12, (t - 6) * 0.5, hipGround(x12), 1, {}, 1 as const), yaw: 0.75, look: 0.6 };
  return (
    <g transform={camT(kf(t, [[0, 470], [len, 530]]), kf(t, [[0, 300], [len, 380]]), kf(t, [[0, 1.25], [len, 1.3]]))}>
      <Stairwell t={t + 200} id="sw12" />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'worried']]) }} rimId="rimR" shadow={0} />
      <Banister />
      <Foreground blur={10}>
        <path d="M -60 1080 L -40 640 Q 140 620 260 700 L 320 1080 Z" fill="#0C130E" />
      </Foreground>
    </g>
  );
};

// ---------- S13: the title, wide on the roof at dusk ----------
const R_FEET = 840;
export const S13: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 1150, y: R_FEET - LEG_LEN * 0.62, scale: 0.62, yaw: -0.15, look: -0.5, armL: { a: 16, b: -8 }, armR: { a: 16, b: -8 } } },
    { f: 30, p: {} },
  ]);
  return (
    <g transform={camT(960, kf(t, [[0, 520], [len, 545]]), kf(t, [[0, 1.0], [len, 1.07]]))}>
      <Rooftop t={t + 40} sunX={980} sunY={520 + 60 * easeOut(clamp(t / len))} cityLit={1.4} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'cool']]), sway: 1.2 * Math.sin(t / 5) }} rimId="rimR" shadow={0.6} />
      <TitleCard t={t} lines={['WHAT IF YOU COULD', 'SEE ONE MINUTE AHEAD?']} accent="AHEAD" accentT={44} size={92} y={170} />
    </g>
  );
};

// ---------- S14: medium, low angle: he reaches through a ghost of himself ----------
export const S14: React.FC<ShotProps> = ({ t, len }) => {
  const gx = 1780 - 17.7 * t;
  const pose = poseAt(t, [
    { f: 0, p: { x: 880, y: 700, scale: 1.05, yaw: -0.35, look: 0.8, armL: { a: -14, b: 6 }, armR: { a: 14, b: -6 } } },
    { f: 30, p: {} },
    { f: 38, p: {} },
    { f: 48, p: { armR: { a: 84, b: -6 }, look: 0.95, tilt: 5, headTilt: 4 }, ease: easeOut },
    { f: 56, p: {} },
    { f: 66, p: { armR: { a: 16, b: -6 }, look: -0.2, tilt: 0, headTilt: -4 }, ease: easeOut },
  ]);
  const reach = poseAt(t, [
    { f: 0, p: { x: 880, y: 700, scale: 1.05, yaw: -0.35, look: 0.8, armL: { a: -14, b: 6 }, armR: { a: 14, b: -6 } } },
    { f: 48, p: { armR: { a: 84, b: -6 } }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 1000], [len, 970]]), kf(t, [[0, 560], [len, 542]]), kf(t, [[0, 1.5], [len, 1.58]]))}>
      <Rooftop t={t + 90} sunX={1290} sunY={600} red={0.3 * clamp((t - 70) / 34)} cityLit={1.35} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [46, 'shock'], [64, 'worried']]) }} rimId="rimR" shadow={0} />
      {/* hand passes through the walker (the walker luminescence screens over the arm) */}
      <Ghost id="s14g">
        <Hero look={PIP} pose={{ ...walkPose(Math.max(gx, 100), t * 0.52, 840, 1.0, {}, -1 as const), ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={0} />
      </Ghost>
      {/* ripple rings where the mitten crosses the walker */}
      {t >= 44 && t < 58
        ? (() => {
            const j = toWorld(reach, joints(reach).armR.end);
            return (
              <g opacity={1 - (t - 44) / 14} style={{ mixBlendMode: 'screen' }}>
                <circle cx={j.x} cy={j.y} r={20 + (t - 44) * 30} fill="none" stroke={CYAN} strokeWidth={8} />
                <circle cx={j.x} cy={j.y} r={8 + (t - 44) * 16} fill="none" stroke="#EAF8FF" strokeWidth={4} />
              </g>
            );
          })()
        : null}
      <Foreground blur={10}>
        <path d="M -60 1080 L -20 660 Q 120 620 240 700 L 300 1080 Z" fill="#100D16" />
      </Foreground>
    </g>
  );
};

// ---------- S15: schematic: the light is old; the future minute has no ray to send ----------
export const S15: React.FC<ShotProps> = ({ t }) => (
  <g transform={`translate(960 540) scale(${kf(t, [[0, 1], [44, 1.05]])}) translate(-960 -540)`}>
    <Schematic t={t} id="sch15" />
    <SchLabel x={960} y={140} t={t - 2} text="WHAT YOU SEE IS ALREADY OLD" size={52} />
    {/* the sun, and the ray of old light that reaches the eye */}
    <DrawOn d="M 300 470 A 84 84 0 1 1 299 469" t={t - 6} dur={7} color={SCH.live} width={7} />
    {t > 10 ? (
      <g stroke={SCH.glow} strokeWidth={7} strokeLinecap="round" opacity={0.85 * clamp((t - 10) / 4)}>
        <path d="M 300 350 L 300 302" />
        <path d="M 216 386 L 182 352" />
        <path d="M 384 386 L 418 352" />
        <path d="M 384 554 L 418 588" />
        <path d="M 216 554 L 182 588" />
        <path d="M 300 590 L 300 638" />
      </g>
    ) : null}
    <Arrow x0={430} y0={470} x1={1260} y1={470} t={t - 12} dur={10} />
    <CountUp x={960} y={662} t={t - 22} to={499} dur={16} size={110} />
    <SchLabel x={960} y={734} t={t - 26} text="SECONDS OF DELAY, SUN TO EYE" size={34} color={SCH.dim} />
    <SchLabel x={1390} y={412} t={t - 22} text="YOUR EYE" size={44} />
    {/* the future minute's ray: it starts, then dies */}
    <DrawOn d="M 332 396 L 660 336" t={t - 30} dur={5} color={SCH.dim} width={5} />
    <SchLabel x={700} y={196} t={t - 30} text="ONE MINUTE AHEAD?" size={30} color={SCH.dim} />
    {t > 36 ? (
      <g stroke="#FF5A6A" strokeWidth={10} strokeLinecap="round" opacity={0.95} style={{ filter: 'drop-shadow(0 0 10px #FF5A6A)' }}>
        <path d="M 615 235 L 785 405 M 785 235 L 615 405" strokeDasharray={240} strokeDashoffset={240 * (1 - clamp((t - 36) / 5))} />
      </g>
    ) : null}
  </g>
);

// ---------- S16: extreme close-up: "That's real." ----------
export const S16: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 6.8 * (1 + 0.04 * clamp(t / len));
  const head = { x: 960, y: 700 };
  const red = 0.4 * clamp(t / len);
  const pose: Pose = {
    ...basePose,
    x: head.x,
    y: head.y + 176 * sc,
    scale: sc,
    yaw: 0.15,
    look: -0.1,
    armL: { a: 14, b: -6 },
    armR: { a: 14, b: -6 },
    ...faceAt(t, [[0, 'worried'], [12, 'shock']]),
  };
  return (
    <g>
      <g filter="url(#blur16)">
        <g transform="translate(-700 -520) scale(2.1)">
          <Rooftop t={t + 130} sunX={980} sunY={590} red={red} low={150} />
        </g>
      </g>
      <rect x={0} y={0} width={1920} height={1080} fill="#07040C" opacity={0.22} />
      <Hero look={PIP} pose={pose} rimId={t > len * 0.55 ? 'rimRed' : 'rimR'} shadow={0} />
    </g>
  );
};

// ---------- S17: wide, low angle: red dusk, the parapet, nobody beside him ----------
export const S17: React.FC<ShotProps> = ({ t, len }) => {
  const red = 0.55 + 0.45 * clamp(t / 30);
  const pose = poseAt(t, [
    { f: 0, p: { x: 930, y: R_FEET + 10 - LEG_LEN, scale: 1, yaw: -0.1, look: -0.2, headTilt: -3, armL: { a: 16, b: -6 }, armR: { a: 14, b: -6 } } },
    { f: 30, p: {} },
    { f: 50, p: { look: -0.5, headTilt: -7 } },
  ]);
  return (
    <g transform={camT(960, kf(t, [[0, 560], [len, 585]]), kf(t, [[0, 1.04], [len, 0.93]]))}>
      <Rooftop t={t + 230} sunX={1120} sunY={640} red={red} cityLit={1.6} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'worried'], [40, 'tired']]), sway: 0.9 * Math.sin(t / 4) }} rimId="rimRed" shadow={0} />
      <Dust t={t} seed={31} x0={400} y0={300} w={1100} h={500} n={44} o={0.5} />
    </g>
  );
};
