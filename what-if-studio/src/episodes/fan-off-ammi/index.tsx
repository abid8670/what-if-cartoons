import React from 'react';
import { AbsoluteFill, Series, Audio, staticFile, useCurrentFrame } from 'remotion';
import { KitDefs, SetDefs, Grade } from '../../engine';
import {
  Chapter1,
  Chapter2,
  Chapter3,
  FanShort,
} from './chapters';

export const FAN_DURATIONS = [562, 672, 660];
export const TOTAL_FAN_FRAMES = FAN_DURATIONS.reduce((a, b) => a + b, 0); // 1894 frames (~63.1s)
export const SHORT_FAN_FRAMES = 750; // 25.0s

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

export const FanCh1Comp: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#0F172A' }}>
      <Audio src={staticFile('fan-off-ammi/ch_1_mixed.wav')} volume={1.0} />
      <ChapterWrap Comp={Chapter1} />
    </AbsoluteFill>
  );
};

export const FanCh2Comp: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#0F172A' }}>
      <Audio src={staticFile('fan-off-ammi/ch_2_mixed.wav')} volume={1.0} />
      <ChapterWrap Comp={Chapter2} />
    </AbsoluteFill>
  );
};

export const FanCh3Comp: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#0F172A' }}>
      <Audio src={staticFile('fan-off-ammi/ch_3_mixed.wav')} volume={1.0} />
      <ChapterWrap Comp={Chapter3} />
    </AbsoluteFill>
  );
};

export const FanMain: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#0F172A' }}>
      <Series>
        <Series.Sequence durationInFrames={FAN_DURATIONS[0]}>
          <Audio src={staticFile('fan-off-ammi/ch_1_mixed.wav')} volume={1.0} />
          <ChapterWrap Comp={Chapter1} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={FAN_DURATIONS[1]}>
          <Audio src={staticFile('fan-off-ammi/ch_2_mixed.wav')} volume={1.0} />
          <ChapterWrap Comp={Chapter2} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={FAN_DURATIONS[2]}>
          <Audio src={staticFile('fan-off-ammi/ch_3_mixed.wav')} volume={1.0} />
          <ChapterWrap Comp={Chapter3} />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};

export const FanShortComp: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#0F172A' }}>
      <Audio src={staticFile('fan-off-ammi/short_mixed.wav')} volume={1.0} />
      <ChapterWrap Comp={FanShort} />
    </AbsoluteFill>
  );
};

