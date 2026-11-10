import React from 'react';
import { AbsoluteFill, Series, Audio, staticFile, useCurrentFrame } from 'remotion';
import { KitDefs, SetDefs, Grade } from '../../engine';
import {
  DeathTimerCh1,
  DeathTimerCh2,
  DeathTimerCh3,
  DeathTimerCh4,
  DeathTimerCh5,
  DeathTimerShort,
  DeathTimerThumbStill,
} from './chapters';

export const DEATH_TIMER_DURATIONS = [943, 1218, 957, 1575, 1432];
export const TOTAL_DEATH_TIMER_FRAMES = DEATH_TIMER_DURATIONS.reduce((a, b) => a + b, 0); // 6,137 frames (~3m 24.5s)
export const SHORT_DEATH_TIMER_FRAMES = 951; // ~31.7s

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

export const DeathTimerCh1Comp: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#090D16' }}>
    <Audio src={staticFile('death-timer/ch_1_mixed.wav')} volume={1.0} />
    <ChapterWrap Comp={DeathTimerCh1} />
  </AbsoluteFill>
);

export const DeathTimerCh2Comp: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#090D16' }}>
    <Audio src={staticFile('death-timer/ch_2_mixed.wav')} volume={1.0} />
    <ChapterWrap Comp={DeathTimerCh2} />
  </AbsoluteFill>
);

export const DeathTimerCh3Comp: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#090D16' }}>
    <Audio src={staticFile('death-timer/ch_3_mixed.wav')} volume={1.0} />
    <ChapterWrap Comp={DeathTimerCh3} />
  </AbsoluteFill>
);

export const DeathTimerCh4Comp: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#090D16' }}>
    <Audio src={staticFile('death-timer/ch_4_mixed.wav')} volume={1.0} />
    <ChapterWrap Comp={DeathTimerCh4} />
  </AbsoluteFill>
);

export const DeathTimerCh5Comp: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#090D16' }}>
    <Audio src={staticFile('death-timer/ch_5_mixed.wav')} volume={1.0} />
    <ChapterWrap Comp={DeathTimerCh5} />
  </AbsoluteFill>
);

export const DeathTimerMain: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#090D16' }}>
    <Series>
      <Series.Sequence durationInFrames={DEATH_TIMER_DURATIONS[0]}>
        <Audio src={staticFile('death-timer/ch_1_mixed.wav')} volume={1.0} />
        <ChapterWrap Comp={DeathTimerCh1} />
      </Series.Sequence>
      <Series.Sequence durationInFrames={DEATH_TIMER_DURATIONS[1]}>
        <Audio src={staticFile('death-timer/ch_2_mixed.wav')} volume={1.0} />
        <ChapterWrap Comp={DeathTimerCh2} />
      </Series.Sequence>
      <Series.Sequence durationInFrames={DEATH_TIMER_DURATIONS[2]}>
        <Audio src={staticFile('death-timer/ch_3_mixed.wav')} volume={1.0} />
        <ChapterWrap Comp={DeathTimerCh3} />
      </Series.Sequence>
      <Series.Sequence durationInFrames={DEATH_TIMER_DURATIONS[3]}>
        <Audio src={staticFile('death-timer/ch_4_mixed.wav')} volume={1.0} />
        <ChapterWrap Comp={DeathTimerCh4} />
      </Series.Sequence>
      <Series.Sequence durationInFrames={DEATH_TIMER_DURATIONS[4]}>
        <Audio src={staticFile('death-timer/ch_5_mixed.wav')} volume={1.0} />
        <ChapterWrap Comp={DeathTimerCh5} />
      </Series.Sequence>
    </Series>
  </AbsoluteFill>
);

export const DeathTimerShortComp: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#090D16' }}>
    <Audio src={staticFile('death-timer/short_mixed.wav')} volume={1.0} />
    <ChapterWrap Comp={DeathTimerShort} />
  </AbsoluteFill>
);

export const DeathTimerThumbComp: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#090D16' }}>
    <ChapterWrap Comp={DeathTimerThumbStill} />
  </AbsoluteFill>
);
