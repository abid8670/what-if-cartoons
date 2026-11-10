import React from 'react';
import { AbsoluteFill, Series, Audio, staticFile, useCurrentFrame } from 'remotion';
import { KitDefs, SetDefs, Grade } from '../../engine';
import {
  Chapter1,
  Chapter2,
  Chapter3,
  Chapter4,
  Chapter5,
  StickmanLifeShort,
} from './chapters';

export const STICKMAN_DURATIONS = [1084, 952, 1128, 1104, 1577];
export const TOTAL_STICKMAN_FRAMES = STICKMAN_DURATIONS.reduce((a, b) => a + b, 0); // 5845 frames (~3.25 min)
export const SHORT_STICKMAN_FRAMES = 1042; // ~34.7s

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

export const StickmanCh1Comp: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#020617' }}>
      <Audio src={staticFile('stickman-life/ch_1_mixed.wav')} volume={1.0} />
      <ChapterWrap Comp={Chapter1} />
    </AbsoluteFill>
  );
};

export const StickmanCh2Comp: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#020617' }}>
      <Audio src={staticFile('stickman-life/ch_2_mixed.wav')} volume={1.0} />
      <ChapterWrap Comp={Chapter2} />
    </AbsoluteFill>
  );
};

export const StickmanCh3Comp: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#020617' }}>
      <Audio src={staticFile('stickman-life/ch_3_mixed.wav')} volume={1.0} />
      <ChapterWrap Comp={Chapter3} />
    </AbsoluteFill>
  );
};

export const StickmanCh4Comp: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#020617' }}>
      <Audio src={staticFile('stickman-life/ch_4_mixed.wav')} volume={1.0} />
      <ChapterWrap Comp={Chapter4} />
    </AbsoluteFill>
  );
};

export const StickmanCh5Comp: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#020617' }}>
      <Audio src={staticFile('stickman-life/ch_5_mixed.wav')} volume={1.0} />
      <ChapterWrap Comp={Chapter5} />
    </AbsoluteFill>
  );
};

export const StickmanLifeMain: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#020617' }}>
      <Series>
        <Series.Sequence durationInFrames={STICKMAN_DURATIONS[0]}>
          <Audio src={staticFile('stickman-life/ch_1_mixed.wav')} volume={1.0} />
          <ChapterWrap Comp={Chapter1} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={STICKMAN_DURATIONS[1]}>
          <Audio src={staticFile('stickman-life/ch_2_mixed.wav')} volume={1.0} />
          <ChapterWrap Comp={Chapter2} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={STICKMAN_DURATIONS[2]}>
          <Audio src={staticFile('stickman-life/ch_3_mixed.wav')} volume={1.0} />
          <ChapterWrap Comp={Chapter3} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={STICKMAN_DURATIONS[3]}>
          <Audio src={staticFile('stickman-life/ch_4_mixed.wav')} volume={1.0} />
          <ChapterWrap Comp={Chapter4} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={STICKMAN_DURATIONS[4]}>
          <Audio src={staticFile('stickman-life/ch_5_mixed.wav')} volume={1.0} />
          <ChapterWrap Comp={Chapter5} />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};

export const StickmanLifeShortComp: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#020617' }}>
      <Audio src={staticFile('stickman-life/short_mixed.wav')} volume={1.0} />
      <ChapterWrap Comp={StickmanLifeShort} />
    </AbsoluteFill>
  );
};

