import React from 'react';
import { AbsoluteFill, Series, Audio, staticFile, useCurrentFrame } from 'remotion';
import { KitDefs, SetDefs, Grade } from '../../engine';
import {
  Chapter1,
  Chapter2,
  Chapter3,
  Chapter4,
  Chapter5,
  ThousandShort,
} from './chapters';

export const THOUSAND_DURATIONS = [920, 906, 1067, 915, 1055];
export const TOTAL_THOUSAND_FRAMES = THOUSAND_DURATIONS.reduce((a, b) => a + b, 0); // 4863 frames (~2m 42s)
export const SHORT_THOUSAND_FRAMES = 1553; // ~51.8s

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

export const ThousandCh1Comp: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#05040a' }}>
      <Audio src={staticFile('one-thousand-or-one/ch_1_mixed.wav')} volume={1.0} />
      <ChapterWrap Comp={Chapter1} />
    </AbsoluteFill>
  );
};

export const ThousandCh2Comp: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#05040a' }}>
      <Audio src={staticFile('one-thousand-or-one/ch_2_mixed.wav')} volume={1.0} />
      <ChapterWrap Comp={Chapter2} />
    </AbsoluteFill>
  );
};

export const ThousandCh3Comp: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#05040a' }}>
      <Audio src={staticFile('one-thousand-or-one/ch_3_mixed.wav')} volume={1.0} />
      <ChapterWrap Comp={Chapter3} />
    </AbsoluteFill>
  );
};

export const ThousandCh4Comp: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#05040a' }}>
      <Audio src={staticFile('one-thousand-or-one/ch_4_mixed.wav')} volume={1.0} />
      <ChapterWrap Comp={Chapter4} />
    </AbsoluteFill>
  );
};

export const ThousandCh5Comp: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#05040a' }}>
      <Audio src={staticFile('one-thousand-or-one/ch_5_mixed.wav')} volume={1.0} />
      <ChapterWrap Comp={Chapter5} />
    </AbsoluteFill>
  );
};

export const ThousandMain: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#05040a' }}>
      <Series>
        <Series.Sequence durationInFrames={THOUSAND_DURATIONS[0]}>
          <Audio src={staticFile('one-thousand-or-one/ch_1_mixed.wav')} volume={1.0} />
          <ChapterWrap Comp={Chapter1} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={THOUSAND_DURATIONS[1]}>
          <Audio src={staticFile('one-thousand-or-one/ch_2_mixed.wav')} volume={1.0} />
          <ChapterWrap Comp={Chapter2} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={THOUSAND_DURATIONS[2]}>
          <Audio src={staticFile('one-thousand-or-one/ch_3_mixed.wav')} volume={1.0} />
          <ChapterWrap Comp={Chapter3} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={THOUSAND_DURATIONS[3]}>
          <Audio src={staticFile('one-thousand-or-one/ch_4_mixed.wav')} volume={1.0} />
          <ChapterWrap Comp={Chapter4} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={THOUSAND_DURATIONS[4]}>
          <Audio src={staticFile('one-thousand-or-one/ch_5_mixed.wav')} volume={1.0} />
          <ChapterWrap Comp={Chapter5} />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};

export const ThousandShortComp: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#05040a' }}>
      <Audio src={staticFile('one-thousand-or-one/short_mixed.wav')} volume={1.0} />
      <ChapterWrap Comp={ThousandShort} />
    </AbsoluteFill>
  );
};

