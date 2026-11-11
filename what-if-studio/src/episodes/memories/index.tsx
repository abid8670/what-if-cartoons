import React from 'react';
import { AbsoluteFill, Series, Audio, staticFile, useCurrentFrame } from 'remotion';
import { KitDefs, SetDefs, Grade } from '../../engine';
import {
  MemoriesCh1,
  MemoriesCh2,
  MemoriesCh3,
  MemoriesCh4,
  MemoriesCh5,
  MemoriesShort,
} from './chapters';

export const MEMORIES_DURATIONS = [786, 940, 884, 756, 597];
export const TOTAL_MEMORIES_FRAMES = MEMORIES_DURATIONS.reduce((a, b) => a + b, 0); // 3,963 frames (~2m 12s)
export const SHORT_MEMORIES_FRAMES = 1271; // ~42.4s

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

export const MemoriesCh1Comp: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#090D16' }}>
    <Audio src={staticFile('memories/ch_1.mp3')} volume={1.0} />
    <ChapterWrap Comp={MemoriesCh1} />
  </AbsoluteFill>
);

export const MemoriesCh2Comp: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#090D16' }}>
    <Audio src={staticFile('memories/ch_2.mp3')} volume={1.0} />
    <ChapterWrap Comp={MemoriesCh2} />
  </AbsoluteFill>
);

export const MemoriesCh3Comp: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#090D16' }}>
    <Audio src={staticFile('memories/ch_3.mp3')} volume={1.0} />
    <ChapterWrap Comp={MemoriesCh3} />
  </AbsoluteFill>
);

export const MemoriesCh4Comp: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#090D16' }}>
    <Audio src={staticFile('memories/ch_4.mp3')} volume={1.0} />
    <ChapterWrap Comp={MemoriesCh4} />
  </AbsoluteFill>
);

export const MemoriesCh5Comp: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#090D16' }}>
    <Audio src={staticFile('memories/ch_5.mp3')} volume={1.0} />
    <ChapterWrap Comp={MemoriesCh5} />
  </AbsoluteFill>
);

export const MemoriesShortComp: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#090D16' }}>
    <Audio src={staticFile('memories/short.mp3')} volume={1.0} />
    <ChapterWrap Comp={MemoriesShort} />
  </AbsoluteFill>
);

export const MemoriesMain: React.FC = () => (
  <Series>
    <Series.Sequence durationInFrames={MEMORIES_DURATIONS[0]}>
      <MemoriesCh1Comp />
    </Series.Sequence>
    <Series.Sequence durationInFrames={MEMORIES_DURATIONS[1]}>
      <MemoriesCh2Comp />
    </Series.Sequence>
    <Series.Sequence durationInFrames={MEMORIES_DURATIONS[2]}>
      <MemoriesCh3Comp />
    </Series.Sequence>
    <Series.Sequence durationInFrames={MEMORIES_DURATIONS[3]}>
      <MemoriesCh4Comp />
    </Series.Sequence>
    <Series.Sequence durationInFrames={MEMORIES_DURATIONS[4]}>
      <MemoriesCh5Comp />
    </Series.Sequence>
  </Series>
);

