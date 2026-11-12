import React from 'react';
import { AbsoluteFill, Series, Audio, staticFile, useCurrentFrame } from 'remotion';
import { KitDefs, SetDefs, Grade } from '../../engine';
import {
  DontPauseCh1,
  DontPauseCh2,
  DontPauseCh3,
  DontPauseCh4,
  DontPauseCh5,
  DontPauseShort,
} from './chapters';

export const DONT_PAUSE_DURATIONS = [969, 1021, 1017, 960, 886];
export const TOTAL_DONT_PAUSE_FRAMES = DONT_PAUSE_DURATIONS.reduce((a, b) => a + b, 0); // 4,853 frames (~2m 41s)
export const SHORT_DONT_PAUSE_FRAMES = 741; // ~24.7s

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
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ width: '1080px', height: '1920px' }}>
        <KitDefs />
        <SetDefs />
        <Comp f={f} />
      </svg>
      <Grade f={f} grain={true} vignette={true} />
    </AbsoluteFill>
  );
};

export const DontPauseCh1Comp: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#090D16' }}>
    <Audio src={staticFile('dont-pause/ch_1.mp3')} volume={1.0} />
    <ChapterWrap Comp={DontPauseCh1} />
  </AbsoluteFill>
);

export const DontPauseCh2Comp: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#090D16' }}>
    <Audio src={staticFile('dont-pause/ch_2.mp3')} volume={1.0} />
    <ChapterWrap Comp={DontPauseCh2} />
  </AbsoluteFill>
);

export const DontPauseCh3Comp: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#090D16' }}>
    <Audio src={staticFile('dont-pause/ch_3.mp3')} volume={1.0} />
    <ChapterWrap Comp={DontPauseCh3} />
  </AbsoluteFill>
);

export const DontPauseCh4Comp: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#090D16' }}>
    <Audio src={staticFile('dont-pause/ch_4.mp3')} volume={1.0} />
    <ChapterWrap Comp={DontPauseCh4} />
  </AbsoluteFill>
);

export const DontPauseCh5Comp: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#090D16' }}>
    <Audio src={staticFile('dont-pause/ch_5.mp3')} volume={1.0} />
    <ChapterWrap Comp={DontPauseCh5} />
  </AbsoluteFill>
);

export const DontPauseShortComp: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#090D16' }}>
    <Audio src={staticFile('dont-pause/short.mp3')} volume={1.0} />
    <ShortWrap Comp={DontPauseShort} />
  </AbsoluteFill>
);

export const DontPauseMain: React.FC = () => (
  <Series>
    <Series.Sequence durationInFrames={DONT_PAUSE_DURATIONS[0]}>
      <DontPauseCh1Comp />
    </Series.Sequence>
    <Series.Sequence durationInFrames={DONT_PAUSE_DURATIONS[1]}>
      <DontPauseCh2Comp />
    </Series.Sequence>
    <Series.Sequence durationInFrames={DONT_PAUSE_DURATIONS[2]}>
      <DontPauseCh3Comp />
    </Series.Sequence>
    <Series.Sequence durationInFrames={DONT_PAUSE_DURATIONS[3]}>
      <DontPauseCh4Comp />
    </Series.Sequence>
    <Series.Sequence durationInFrames={DONT_PAUSE_DURATIONS[4]}>
      <DontPauseCh5Comp />
    </Series.Sequence>
  </Series>
);

