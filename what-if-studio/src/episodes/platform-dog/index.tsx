import React from 'react';
import { AbsoluteFill, Series, Audio, staticFile, useCurrentFrame } from 'remotion';
import { KitDefs, SetDefs, Grade } from '../../engine';
import {
  StudioIntro,
  Chapter1,
  Chapter2,
  Chapter3,
  Chapter4,
  Chapter5,
  PlatformDogShort,
} from './chapters';

export const DOG_DURATIONS = [1050, 1100, 1100, 950, 1180];
export const TOTAL_DOG_FRAMES = DOG_DURATIONS.reduce((a, b) => a + b, 0); // 5380 frames (~2.99 min)
export const SHORT_DOG_FRAMES = 1169; // ~38.98s

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

export const DogIntroComp: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#020617' }}>
      <Audio src={staticFile('platform-dog/intro_mixed.wav')} volume={1.0} />
      <ChapterWrap Comp={StudioIntro} />
    </AbsoluteFill>
  );
};

export const DogCh1Comp: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#020617' }}>
      <Audio src={staticFile('platform-dog/ch_1_mixed.wav')} volume={1.0} />
      <ChapterWrap Comp={Chapter1} />
    </AbsoluteFill>
  );
};

export const DogCh2Comp: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#020617' }}>
      <Audio src={staticFile('platform-dog/ch_2_mixed.wav')} volume={1.0} />
      <ChapterWrap Comp={Chapter2} />
    </AbsoluteFill>
  );
};

export const DogCh3Comp: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#020617' }}>
      <Audio src={staticFile('platform-dog/ch_3_mixed.wav')} volume={1.0} />
      <ChapterWrap Comp={Chapter3} />
    </AbsoluteFill>
  );
};

export const DogCh4Comp: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#020617' }}>
      <Audio src={staticFile('platform-dog/ch_4_mixed.wav')} volume={1.0} />
      <ChapterWrap Comp={Chapter4} />
    </AbsoluteFill>
  );
};

export const DogCh5Comp: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#020617' }}>
      <Audio src={staticFile('platform-dog/ch_5_mixed.wav')} volume={1.0} />
      <ChapterWrap Comp={Chapter5} />
    </AbsoluteFill>
  );
};

export const PlatformDogMain: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#020617' }}>
      <Series>
        <Series.Sequence durationInFrames={DOG_DURATIONS[0]}>
          <Audio src={staticFile('platform-dog/ch_1_mixed.wav')} volume={1.0} />
          <ChapterWrap Comp={Chapter1} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={DOG_DURATIONS[1]}>
          <Audio src={staticFile('platform-dog/ch_2_mixed.wav')} volume={1.0} />
          <ChapterWrap Comp={Chapter2} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={DOG_DURATIONS[2]}>
          <Audio src={staticFile('platform-dog/ch_3_mixed.wav')} volume={1.0} />
          <ChapterWrap Comp={Chapter3} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={DOG_DURATIONS[3]}>
          <Audio src={staticFile('platform-dog/ch_4_mixed.wav')} volume={1.0} />
          <ChapterWrap Comp={Chapter4} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={DOG_DURATIONS[4]}>
          <Audio src={staticFile('platform-dog/ch_5_mixed.wav')} volume={1.0} />
          <ChapterWrap Comp={Chapter5} />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};

export const PlatformDogShortComp: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#020617' }}>
      <Audio src={staticFile('platform-dog/short_mixed.wav')} volume={1.0} />
      <ChapterWrap Comp={PlatformDogShort} />
    </AbsoluteFill>
  );
};

