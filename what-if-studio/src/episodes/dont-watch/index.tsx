import React from 'react';
import { AbsoluteFill, Series, Audio, staticFile, useCurrentFrame } from 'remotion';
import { KitDefs, SetDefs, Grade } from '../../engine';
import {
  Chapter1,
  Chapter2,
  Chapter3,
  Chapter4,
  DontWatchShort,
} from './chapters';

export const DONT_WATCH_DURATIONS = [967, 1049, 1061, 1122];
export const TOTAL_DONT_WATCH_FRAMES = DONT_WATCH_DURATIONS.reduce((a, b) => a + b, 0); // 4199 frames (~2.33 min)
export const SHORT_DONT_WATCH_FRAMES = 1403; // ~46.77s

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

export const DontWatchCh1Comp: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#020617' }}>
      <Audio src={staticFile('dont-watch/ch_1_mixed.wav')} volume={1.0} />
      <ChapterWrap Comp={Chapter1} />
    </AbsoluteFill>
  );
};

export const DontWatchCh2Comp: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#020617' }}>
      <Audio src={staticFile('dont-watch/ch_2_mixed.wav')} volume={1.0} />
      <ChapterWrap Comp={Chapter2} />
    </AbsoluteFill>
  );
};

export const DontWatchCh3Comp: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#020617' }}>
      <Audio src={staticFile('dont-watch/ch_3_mixed.wav')} volume={1.0} />
      <ChapterWrap Comp={Chapter3} />
    </AbsoluteFill>
  );
};

export const DontWatchCh4Comp: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#020617' }}>
      <Audio src={staticFile('dont-watch/ch_4_mixed.wav')} volume={1.0} />
      <ChapterWrap Comp={Chapter4} />
    </AbsoluteFill>
  );
};

export const DontWatchMain: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#020617' }}>
      <Series>
        <Series.Sequence durationInFrames={DONT_WATCH_DURATIONS[0]}>
          <Audio src={staticFile('dont-watch/ch_1_mixed.wav')} volume={1.0} />
          <ChapterWrap Comp={Chapter1} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={DONT_WATCH_DURATIONS[1]}>
          <Audio src={staticFile('dont-watch/ch_2_mixed.wav')} volume={1.0} />
          <ChapterWrap Comp={Chapter2} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={DONT_WATCH_DURATIONS[2]}>
          <Audio src={staticFile('dont-watch/ch_3_mixed.wav')} volume={1.0} />
          <ChapterWrap Comp={Chapter3} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={DONT_WATCH_DURATIONS[3]}>
          <Audio src={staticFile('dont-watch/ch_4_mixed.wav')} volume={1.0} />
          <ChapterWrap Comp={Chapter4} />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};

export const DontWatchShortComp: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#020617' }}>
      <Audio src={staticFile('dont-watch/short_mixed.wav')} volume={1.0} />
      <ChapterWrap Comp={DontWatchShort} />
    </AbsoluteFill>
  );
};

