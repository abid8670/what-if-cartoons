import React from 'react';
import { AbsoluteFill, Series, Audio, staticFile, useCurrentFrame } from 'remotion';
import { KitDefs, SetDefs, Grade } from '../../engine';
import {
  Chapter1,
  Chapter2,
  Chapter3,
  Chapter4,
  Chapter5,
  WordsShort,
} from './chapters';

export const THOUSAND_WORDS_DURATIONS = [825, 1026, 960, 1104, 1035];
export const TOTAL_THOUSAND_WORDS_FRAMES = THOUSAND_WORDS_DURATIONS.reduce((a, b) => a + b, 0); // 4950 frames (~2m 45s)
export const SHORT_WORDS_FRAMES = 795; // ~26.5s

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

export const WordsCh1Comp: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#020617' }}>
      <Audio src={staticFile('thousand-words/ch_1_mixed.wav')} volume={1.0} />
      <ChapterWrap Comp={Chapter1} />
    </AbsoluteFill>
  );
};

export const WordsCh2Comp: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#020617' }}>
      <Audio src={staticFile('thousand-words/ch_2_mixed.wav')} volume={1.0} />
      <ChapterWrap Comp={Chapter2} />
    </AbsoluteFill>
  );
};

export const WordsCh3Comp: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#020617' }}>
      <Audio src={staticFile('thousand-words/ch_3_mixed.wav')} volume={1.0} />
      <ChapterWrap Comp={Chapter3} />
    </AbsoluteFill>
  );
};

export const WordsCh4Comp: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#020617' }}>
      <Audio src={staticFile('thousand-words/ch_4_mixed.wav')} volume={1.0} />
      <ChapterWrap Comp={Chapter4} />
    </AbsoluteFill>
  );
};

export const WordsCh5Comp: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#020617' }}>
      <Audio src={staticFile('thousand-words/ch_5_mixed.wav')} volume={1.0} />
      <ChapterWrap Comp={Chapter5} />
    </AbsoluteFill>
  );
};

export const WordsMain: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#020617' }}>
      <Series>
        <Series.Sequence durationInFrames={THOUSAND_WORDS_DURATIONS[0]}>
          <Audio src={staticFile('thousand-words/ch_1_mixed.wav')} volume={1.0} />
          <ChapterWrap Comp={Chapter1} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={THOUSAND_WORDS_DURATIONS[1]}>
          <Audio src={staticFile('thousand-words/ch_2_mixed.wav')} volume={1.0} />
          <ChapterWrap Comp={Chapter2} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={THOUSAND_WORDS_DURATIONS[2]}>
          <Audio src={staticFile('thousand-words/ch_3_mixed.wav')} volume={1.0} />
          <ChapterWrap Comp={Chapter3} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={THOUSAND_WORDS_DURATIONS[3]}>
          <Audio src={staticFile('thousand-words/ch_4_mixed.wav')} volume={1.0} />
          <ChapterWrap Comp={Chapter4} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={THOUSAND_WORDS_DURATIONS[4]}>
          <Audio src={staticFile('thousand-words/ch_5_mixed.wav')} volume={1.0} />
          <ChapterWrap Comp={Chapter5} />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};

export const WordsShortComp: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#020617' }}>
      <Audio src={staticFile('thousand-words/short_mixed.wav')} volume={1.0} />
      <ChapterWrap Comp={WordsShort} />
    </AbsoluteFill>
  );
};

