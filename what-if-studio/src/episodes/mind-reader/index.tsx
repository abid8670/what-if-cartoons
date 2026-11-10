import React from 'react';
import { AbsoluteFill, Series, Audio, staticFile, useCurrentFrame } from 'remotion';
import { KitDefs, SetDefs, Grade } from '../../engine';
import {
  MindReaderCh1,
  MindReaderCh2,
  MindReaderCh3,
  MindReaderCh4,
  MindReaderCh5,
  MindReaderShort,
} from './chapters';

export const MIND_READER_DURATIONS = [1128, 1265, 1047, 1277, 1187];
export const TOTAL_MIND_READER_FRAMES = MIND_READER_DURATIONS.reduce((a, b) => a + b, 0); // 5,904 frames (~3m 16.8s)
export const SHORT_MIND_READER_FRAMES = 1016; // ~33.8s

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

export const MindReaderCh1Comp: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#090D16' }}>
    <Audio src={staticFile('mind-reader/ch_1_mixed.wav')} volume={1.0} />
    <ChapterWrap Comp={MindReaderCh1} />
  </AbsoluteFill>
);

export const MindReaderCh2Comp: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#090D16' }}>
    <Audio src={staticFile('mind-reader/ch_2_mixed.wav')} volume={1.0} />
    <ChapterWrap Comp={MindReaderCh2} />
  </AbsoluteFill>
);

export const MindReaderCh3Comp: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#090D16' }}>
    <Audio src={staticFile('mind-reader/ch_3_mixed.wav')} volume={1.0} />
    <ChapterWrap Comp={MindReaderCh3} />
  </AbsoluteFill>
);

export const MindReaderCh4Comp: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#090D16' }}>
    <Audio src={staticFile('mind-reader/ch_4_mixed.wav')} volume={1.0} />
    <ChapterWrap Comp={MindReaderCh4} />
  </AbsoluteFill>
);

export const MindReaderCh5Comp: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#090D16' }}>
    <Audio src={staticFile('mind-reader/ch_5_mixed.wav')} volume={1.0} />
    <ChapterWrap Comp={MindReaderCh5} />
  </AbsoluteFill>
);

export const MindReaderShortComp: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#090D16' }}>
    <Audio src={staticFile('mind-reader/short_mixed.wav')} volume={1.0} />
    <ChapterWrap Comp={MindReaderShort} />
  </AbsoluteFill>
);

export const MindReaderMain: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#090D16' }}>
    <Series>
      <Series.Sequence durationInFrames={MIND_READER_DURATIONS[0]}>
        <Audio src={staticFile('mind-reader/ch_1_mixed.wav')} volume={1.0} />
        <ChapterWrap Comp={MindReaderCh1} />
      </Series.Sequence>
      <Series.Sequence durationInFrames={MIND_READER_DURATIONS[1]}>
        <Audio src={staticFile('mind-reader/ch_2_mixed.wav')} volume={1.0} />
        <ChapterWrap Comp={MindReaderCh2} />
      </Series.Sequence>
      <Series.Sequence durationInFrames={MIND_READER_DURATIONS[2]}>
        <Audio src={staticFile('mind-reader/ch_3_mixed.wav')} volume={1.0} />
        <ChapterWrap Comp={MindReaderCh3} />
      </Series.Sequence>
      <Series.Sequence durationInFrames={MIND_READER_DURATIONS[3]}>
        <Audio src={staticFile('mind-reader/ch_4_mixed.wav')} volume={1.0} />
        <ChapterWrap Comp={MindReaderCh4} />
      </Series.Sequence>
      <Series.Sequence durationInFrames={MIND_READER_DURATIONS[4]}>
        <Audio src={staticFile('mind-reader/ch_5_mixed.wav')} volume={1.0} />
        <ChapterWrap Comp={MindReaderCh5} />
      </Series.Sequence>
    </Series>
  </AbsoluteFill>
);

