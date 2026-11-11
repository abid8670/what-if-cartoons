import React from 'react';
import { AbsoluteFill, Series, Audio, staticFile, useCurrentFrame } from 'remotion';
import { KitDefs, SetDefs, Grade } from '../../engine';
import {
  ImmortalCh1,
  ImmortalCh2,
  ImmortalCh3,
  ImmortalCh4,
  ImmortalCh5,
  ImmortalShort,
} from './chapters';

export const IMMORTAL_DURATIONS = [776, 622, 720, 831, 601];
export const TOTAL_IMMORTAL_FRAMES = IMMORTAL_DURATIONS.reduce((a, b) => a + b, 0); // 3,550 frames (~1m 58s)
export const SHORT_IMMORTAL_FRAMES = 1289; // ~43.0s

const ChapterWrap: React.FC<{ Comp: React.FC<{ f: number }> }> = ({ Comp }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ width: '100%', height: '100%' }}>
        <KitDefs />
        <SetDefs />
        <Comp f={f} />
      </svg>
      <Grade f={f} grain={true} vignette={true} />
    </AbsoluteFill>
  );
};

export const ImmortalCh1Comp: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#090D16' }}>
    <Audio src={staticFile('immortal/ch_1.mp3')} volume={1.0} />
    <ChapterWrap Comp={ImmortalCh1} />
  </AbsoluteFill>
);

export const ImmortalCh2Comp: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#090D16' }}>
    <Audio src={staticFile('immortal/ch_2.mp3')} volume={1.0} />
    <ChapterWrap Comp={ImmortalCh2} />
  </AbsoluteFill>
);

export const ImmortalCh3Comp: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#090D16' }}>
    <Audio src={staticFile('immortal/ch_3.mp3')} volume={1.0} />
    <ChapterWrap Comp={ImmortalCh3} />
  </AbsoluteFill>
);

export const ImmortalCh4Comp: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#090D16' }}>
    <Audio src={staticFile('immortal/ch_4.mp3')} volume={1.0} />
    <ChapterWrap Comp={ImmortalCh4} />
  </AbsoluteFill>
);

export const ImmortalCh5Comp: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#090D16' }}>
    <Audio src={staticFile('immortal/ch_5.mp3')} volume={1.0} />
    <ChapterWrap Comp={ImmortalCh5} />
  </AbsoluteFill>
);

export const ImmortalShortComp: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#090D16' }}>
    <Audio src={staticFile('immortal/short.mp3')} volume={1.0} />
    <ChapterWrap Comp={ImmortalShort} />
  </AbsoluteFill>
);

export const ImmortalMain: React.FC = () => (
  <Series>
    <Series.Sequence durationInFrames={IMMORTAL_DURATIONS[0]}>
      <ImmortalCh1Comp />
    </Series.Sequence>
    <Series.Sequence durationInFrames={IMMORTAL_DURATIONS[1]}>
      <ImmortalCh2Comp />
    </Series.Sequence>
    <Series.Sequence durationInFrames={IMMORTAL_DURATIONS[2]}>
      <ImmortalCh3Comp />
    </Series.Sequence>
    <Series.Sequence durationInFrames={IMMORTAL_DURATIONS[3]}>
      <ImmortalCh4Comp />
    </Series.Sequence>
    <Series.Sequence durationInFrames={IMMORTAL_DURATIONS[4]}>
      <ImmortalCh5Comp />
    </Series.Sequence>
  </Series>
);

