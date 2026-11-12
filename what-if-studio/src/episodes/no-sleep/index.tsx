import React from 'react';
import { AbsoluteFill, Series, Audio, staticFile, useCurrentFrame } from 'remotion';
import { KitDefs, SetDefs, Grade } from '../../engine';
import {
  NoSleepCh1,
  NoSleepCh2,
  NoSleepCh3,
  NoSleepCh4,
  NoSleepCh5,
  NoSleepShort,
} from './chapters';

export const NO_SLEEP_DURATIONS = [916, 841, 844, 778, 878];
export const TOTAL_NO_SLEEP_FRAMES = NO_SLEEP_DURATIONS.reduce((a, b) => a + b, 0); // 4,257 frames (~2m 22s)
export const SHORT_NO_SLEEP_FRAMES = 934; // ~31.1s

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

export const NoSleepCh1Comp: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#090D16' }}>
    <Audio src={staticFile('no-sleep/ch_1.mp3')} volume={1.0} />
    <ChapterWrap Comp={NoSleepCh1} />
  </AbsoluteFill>
);

export const NoSleepCh2Comp: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#090D16' }}>
    <Audio src={staticFile('no-sleep/ch_2.mp3')} volume={1.0} />
    <ChapterWrap Comp={NoSleepCh2} />
  </AbsoluteFill>
);

export const NoSleepCh3Comp: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#090D16' }}>
    <Audio src={staticFile('no-sleep/ch_3.mp3')} volume={1.0} />
    <ChapterWrap Comp={NoSleepCh3} />
  </AbsoluteFill>
);

export const NoSleepCh4Comp: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#090D16' }}>
    <Audio src={staticFile('no-sleep/ch_4.mp3')} volume={1.0} />
    <ChapterWrap Comp={NoSleepCh4} />
  </AbsoluteFill>
);

export const NoSleepCh5Comp: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#090D16' }}>
    <Audio src={staticFile('no-sleep/ch_5.mp3')} volume={1.0} />
    <ChapterWrap Comp={NoSleepCh5} />
  </AbsoluteFill>
);

export const NoSleepShortComp: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#090D16' }}>
    <Audio src={staticFile('no-sleep/short.mp3')} volume={1.0} />
    <ShortWrap Comp={NoSleepShort} />
  </AbsoluteFill>
);

export const NoSleepMain: React.FC = () => (
  <Series>
    <Series.Sequence durationInFrames={NO_SLEEP_DURATIONS[0]}>
      <NoSleepCh1Comp />
    </Series.Sequence>
    <Series.Sequence durationInFrames={NO_SLEEP_DURATIONS[1]}>
      <NoSleepCh2Comp />
    </Series.Sequence>
    <Series.Sequence durationInFrames={NO_SLEEP_DURATIONS[2]}>
      <NoSleepCh3Comp />
    </Series.Sequence>
    <Series.Sequence durationInFrames={NO_SLEEP_DURATIONS[3]}>
      <NoSleepCh4Comp />
    </Series.Sequence>
    <Series.Sequence durationInFrames={NO_SLEEP_DURATIONS[4]}>
      <NoSleepCh5Comp />
    </Series.Sequence>
  </Series>
);

