import React from 'react';
import { AbsoluteFill, Series, Audio, staticFile, useCurrentFrame } from 'remotion';
import { KitDefs, SetDefs, Grade } from '../../engine';
import {
  LifespanCh1,
  LifespanCh2,
  LifespanCh3,
  LifespanCh4,
  LifespanCh5,
  LifespanShort,
} from './chapters';

export const LIFESPAN_DURATIONS = [760, 706, 721, 619, 857];
export const TOTAL_LIFESPAN_FRAMES = LIFESPAN_DURATIONS.reduce((a, b) => a + b, 0); // 3,663 frames (~2m 02s)
export const SHORT_LIFESPAN_FRAMES = 935; // ~31.2s

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

const ShortWrap: React.FC<{ Comp: React.FC<{ f: number }> }> = ({ Comp }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ width: '100%', height: '100%' }}>
        <KitDefs />
        <SetDefs />
        <Comp f={f} />
      </svg>
      <Grade f={f} grain={true} vignette={true} />
    </AbsoluteFill>
  );
};

export const LifespanCh1Comp: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#090D16' }}>
    <Audio src={staticFile('lifespan/ch_1.mp3')} volume={1.0} />
    <ChapterWrap Comp={LifespanCh1} />
  </AbsoluteFill>
);

export const LifespanCh2Comp: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#090D16' }}>
    <Audio src={staticFile('lifespan/ch_2.mp3')} volume={1.0} />
    <ChapterWrap Comp={LifespanCh2} />
  </AbsoluteFill>
);

export const LifespanCh3Comp: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#090D16' }}>
    <Audio src={staticFile('lifespan/ch_3.mp3')} volume={1.0} />
    <ChapterWrap Comp={LifespanCh3} />
  </AbsoluteFill>
);

export const LifespanCh4Comp: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#090D16' }}>
    <Audio src={staticFile('lifespan/ch_4.mp3')} volume={1.0} />
    <ChapterWrap Comp={LifespanCh4} />
  </AbsoluteFill>
);

export const LifespanCh5Comp: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#090D16' }}>
    <Audio src={staticFile('lifespan/ch_5.mp3')} volume={1.0} />
    <ChapterWrap Comp={LifespanCh5} />
  </AbsoluteFill>
);

export const LifespanShortComp: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#090D16' }}>
    <Audio src={staticFile('lifespan/short.mp3')} volume={1.0} />
    <ShortWrap Comp={LifespanShort} />
  </AbsoluteFill>
);

export const LifespanMain: React.FC = () => (
  <Series>
    <Series.Sequence durationInFrames={LIFESPAN_DURATIONS[0]}>
      <LifespanCh1Comp />
    </Series.Sequence>
    <Series.Sequence durationInFrames={LIFESPAN_DURATIONS[1]}>
      <LifespanCh2Comp />
    </Series.Sequence>
    <Series.Sequence durationInFrames={LIFESPAN_DURATIONS[2]}>
      <LifespanCh3Comp />
    </Series.Sequence>
    <Series.Sequence durationInFrames={LIFESPAN_DURATIONS[3]}>
      <LifespanCh4Comp />
    </Series.Sequence>
    <Series.Sequence durationInFrames={LIFESPAN_DURATIONS[4]}>
      <LifespanCh5Comp />
    </Series.Sequence>
  </Series>
);

