import React from 'react';
import { AbsoluteFill, Series, Audio, staticFile, useCurrentFrame } from 'remotion';
import { KitDefs, SetDefs, Grade } from '../../engine';
import {
  FiveClonesCh1,
  FiveClonesCh2,
  FiveClonesCh3,
  FiveClonesCh4,
  FiveClonesCh5,
  FiveClonesShort,
} from './chapters';

export const FIVE_CLONES_DURATIONS = [768, 878, 808, 823, 722];
export const TOTAL_FIVE_CLONES_FRAMES = FIVE_CLONES_DURATIONS.reduce((a, b) => a + b, 0); // 3,999 frames (~2m 13s)
export const SHORT_FIVE_CLONES_FRAMES = 1161; // ~38.7s

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

export const FiveClonesCh1Comp: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#090D16' }}>
    <Audio src={staticFile('five-clones/ch_1.mp3')} volume={1.0} />
    <ChapterWrap Comp={FiveClonesCh1} />
  </AbsoluteFill>
);

export const FiveClonesCh2Comp: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#090D16' }}>
    <Audio src={staticFile('five-clones/ch_2.mp3')} volume={1.0} />
    <ChapterWrap Comp={FiveClonesCh2} />
  </AbsoluteFill>
);

export const FiveClonesCh3Comp: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#090D16' }}>
    <Audio src={staticFile('five-clones/ch_3.mp3')} volume={1.0} />
    <ChapterWrap Comp={FiveClonesCh3} />
  </AbsoluteFill>
);

export const FiveClonesCh4Comp: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#090D16' }}>
    <Audio src={staticFile('five-clones/ch_4.mp3')} volume={1.0} />
    <ChapterWrap Comp={FiveClonesCh4} />
  </AbsoluteFill>
);

export const FiveClonesCh5Comp: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#090D16' }}>
    <Audio src={staticFile('five-clones/ch_5.mp3')} volume={1.0} />
    <ChapterWrap Comp={FiveClonesCh5} />
  </AbsoluteFill>
);

export const FiveClonesShortComp: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#090D16' }}>
    <Audio src={staticFile('five-clones/short.mp3')} volume={1.0} />
    <ChapterWrap Comp={FiveClonesShort} />
  </AbsoluteFill>
);

export const FiveClonesMain: React.FC = () => (
  <Series>
    <Series.Sequence durationInFrames={FIVE_CLONES_DURATIONS[0]}>
      <FiveClonesCh1Comp />
    </Series.Sequence>
    <Series.Sequence durationInFrames={FIVE_CLONES_DURATIONS[1]}>
      <FiveClonesCh2Comp />
    </Series.Sequence>
    <Series.Sequence durationInFrames={FIVE_CLONES_DURATIONS[2]}>
      <FiveClonesCh3Comp />
    </Series.Sequence>
    <Series.Sequence durationInFrames={FIVE_CLONES_DURATIONS[3]}>
      <FiveClonesCh4Comp />
    </Series.Sequence>
    <Series.Sequence durationInFrames={FIVE_CLONES_DURATIONS[4]}>
      <FiveClonesCh5Comp />
    </Series.Sequence>
  </Series>
);

