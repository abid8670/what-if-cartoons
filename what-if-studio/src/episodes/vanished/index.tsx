import React from 'react';
import { AbsoluteFill, Series, Audio, staticFile, useCurrentFrame } from 'remotion';
import { KitDefs, SetDefs, Grade } from '../../engine';
import {
  VanishedCh1,
  VanishedCh2,
  VanishedCh3,
  VanishedCh4,
  VanishedCh5,
  VanishedShort,
} from './chapters';

export const VANISHED_DURATIONS = [796, 799, 757, 758, 1206];
export const TOTAL_VANISHED_FRAMES = VANISHED_DURATIONS.reduce((a, b) => a + b, 0); // 4,316 frames (~2m 24s)
export const SHORT_VANISHED_FRAMES = 1118; // ~37.3s

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

export const VanishedCh1Comp: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#090D16' }}>
    <Audio src={staticFile('vanished/ch_1.mp3')} volume={1.0} />
    <ChapterWrap Comp={VanishedCh1} />
  </AbsoluteFill>
);

export const VanishedCh2Comp: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#090D16' }}>
    <Audio src={staticFile('vanished/ch_2.mp3')} volume={1.0} />
    <ChapterWrap Comp={VanishedCh2} />
  </AbsoluteFill>
);

export const VanishedCh3Comp: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#090D16' }}>
    <Audio src={staticFile('vanished/ch_3.mp3')} volume={1.0} />
    <ChapterWrap Comp={VanishedCh3} />
  </AbsoluteFill>
);

export const VanishedCh4Comp: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#090D16' }}>
    <Audio src={staticFile('vanished/ch_4.mp3')} volume={1.0} />
    <ChapterWrap Comp={VanishedCh4} />
  </AbsoluteFill>
);

export const VanishedCh5Comp: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#090D16' }}>
    <Audio src={staticFile('vanished/ch_5.mp3')} volume={1.0} />
    <ChapterWrap Comp={VanishedCh5} />
  </AbsoluteFill>
);

export const VanishedShortComp: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#090D16' }}>
    <Audio src={staticFile('vanished/short.mp3')} volume={1.0} />
    <ChapterWrap Comp={VanishedShort} />
  </AbsoluteFill>
);

export const VanishedMain: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#090D16' }}>
    <Series>
      <Series.Sequence durationInFrames={VANISHED_DURATIONS[0]}>
        <Audio src={staticFile('vanished/ch_1.mp3')} volume={1.0} />
        <ChapterWrap Comp={VanishedCh1} />
      </Series.Sequence>
      <Series.Sequence durationInFrames={VANISHED_DURATIONS[1]}>
        <Audio src={staticFile('vanished/ch_2.mp3')} volume={1.0} />
        <ChapterWrap Comp={VanishedCh2} />
      </Series.Sequence>
      <Series.Sequence durationInFrames={VANISHED_DURATIONS[2]}>
        <Audio src={staticFile('vanished/ch_3.mp3')} volume={1.0} />
        <ChapterWrap Comp={VanishedCh3} />
      </Series.Sequence>
      <Series.Sequence durationInFrames={VANISHED_DURATIONS[3]}>
        <Audio src={staticFile('vanished/ch_4.mp3')} volume={1.0} />
        <ChapterWrap Comp={VanishedCh4} />
      </Series.Sequence>
      <Series.Sequence durationInFrames={VANISHED_DURATIONS[4]}>
        <Audio src={staticFile('vanished/ch_5.mp3')} volume={1.0} />
        <ChapterWrap Comp={VanishedCh5} />
      </Series.Sequence>
    </Series>
  </AbsoluteFill>
);

export {
  VanishedCh1,
  VanishedCh2,
  VanishedCh3,
  VanishedCh4,
  VanishedCh5,
  VanishedShort,
};
