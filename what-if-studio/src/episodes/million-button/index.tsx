import React from 'react';
import { AbsoluteFill, Series, Audio, staticFile, useCurrentFrame } from 'remotion';
import { KitDefs, SetDefs, Grade } from '../../engine';
import {
  MillionButtonCh1,
  MillionButtonCh2,
  MillionButtonCh3,
  MillionButtonCh4,
  MillionButtonCh5,
  MillionButtonShort,
} from './chapters';

export const MILLION_BUTTON_DURATIONS = [849, 996, 859, 794, 1080];
export const TOTAL_MILLION_BUTTON_FRAMES = MILLION_BUTTON_DURATIONS.reduce((a, b) => a + b, 0); // 4,578 frames (~2m 32s)
export const SHORT_MILLION_BUTTON_FRAMES = 977; // ~32.5s

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

export const MillionButtonCh1Comp: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#090D16' }}>
    <Audio src={staticFile('million-button/ch_1.mp3')} volume={1.0} />
    <ChapterWrap Comp={MillionButtonCh1} />
  </AbsoluteFill>
);

export const MillionButtonCh2Comp: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#090D16' }}>
    <Audio src={staticFile('million-button/ch_2.mp3')} volume={1.0} />
    <ChapterWrap Comp={MillionButtonCh2} />
  </AbsoluteFill>
);

export const MillionButtonCh3Comp: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#090D16' }}>
    <Audio src={staticFile('million-button/ch_3.mp3')} volume={1.0} />
    <ChapterWrap Comp={MillionButtonCh3} />
  </AbsoluteFill>
);

export const MillionButtonCh4Comp: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#090D16' }}>
    <Audio src={staticFile('million-button/ch_4.mp3')} volume={1.0} />
    <ChapterWrap Comp={MillionButtonCh4} />
  </AbsoluteFill>
);

export const MillionButtonCh5Comp: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#090D16' }}>
    <Audio src={staticFile('million-button/ch_5.mp3')} volume={1.0} />
    <ChapterWrap Comp={MillionButtonCh5} />
  </AbsoluteFill>
);

export const MillionButtonShortComp: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#090D16' }}>
    <Audio src={staticFile('million-button/short.mp3')} volume={1.0} />
    <ChapterWrap Comp={MillionButtonShort} />
  </AbsoluteFill>
);

export const MillionButtonMain: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#090D16' }}>
    <Series>
      <Series.Sequence durationInFrames={MILLION_BUTTON_DURATIONS[0]}>
        <Audio src={staticFile('million-button/ch_1.mp3')} volume={1.0} />
        <ChapterWrap Comp={MillionButtonCh1} />
      </Series.Sequence>
      <Series.Sequence durationInFrames={MILLION_BUTTON_DURATIONS[1]}>
        <Audio src={staticFile('million-button/ch_2.mp3')} volume={1.0} />
        <ChapterWrap Comp={MillionButtonCh2} />
      </Series.Sequence>
      <Series.Sequence durationInFrames={MILLION_BUTTON_DURATIONS[2]}>
        <Audio src={staticFile('million-button/ch_3.mp3')} volume={1.0} />
        <ChapterWrap Comp={MillionButtonCh3} />
      </Series.Sequence>
      <Series.Sequence durationInFrames={MILLION_BUTTON_DURATIONS[3]}>
        <Audio src={staticFile('million-button/ch_4.mp3')} volume={1.0} />
        <ChapterWrap Comp={MillionButtonCh4} />
      </Series.Sequence>
      <Series.Sequence durationInFrames={MILLION_BUTTON_DURATIONS[4]}>
        <Audio src={staticFile('million-button/ch_5.mp3')} volume={1.0} />
        <ChapterWrap Comp={MillionButtonCh5} />
      </Series.Sequence>
    </Series>
  </AbsoluteFill>
);

export {
  MillionButtonCh1,
  MillionButtonCh2,
  MillionButtonCh3,
  MillionButtonCh4,
  MillionButtonCh5,
  MillionButtonShort,
};

