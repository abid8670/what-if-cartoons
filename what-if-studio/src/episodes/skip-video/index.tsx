import React from 'react';
import { AbsoluteFill, Series, Audio, staticFile, useCurrentFrame } from 'remotion';
import { KitDefs, SetDefs, Grade } from '../../engine';
import {
  SkipVideoCh1,
  SkipVideoCh2,
  SkipVideoCh3,
  SkipVideoCh4,
  SkipVideoCh5,
  SkipVideoShort,
} from './chapters';

export const SKIP_VIDEO_DURATIONS = [1028, 991, 1264, 993, 1130];
export const TOTAL_SKIP_VIDEO_FRAMES = SKIP_VIDEO_DURATIONS.reduce((a, b) => a + b, 0); // 5,406 frames (~3m 0.2s)
export const SHORT_SKIP_VIDEO_FRAMES = 1203; // ~40.1s

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

export const SkipVideoCh1Comp: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#090D16' }}>
    <Audio src={staticFile('skip-video/ch_1_mixed.wav')} volume={1.0} />
    <ChapterWrap Comp={SkipVideoCh1} />
  </AbsoluteFill>
);

export const SkipVideoCh2Comp: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#090D16' }}>
    <Audio src={staticFile('skip-video/ch_2_mixed.wav')} volume={1.0} />
    <ChapterWrap Comp={SkipVideoCh2} />
  </AbsoluteFill>
);

export const SkipVideoCh3Comp: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#090D16' }}>
    <Audio src={staticFile('skip-video/ch_3_mixed.wav')} volume={1.0} />
    <ChapterWrap Comp={SkipVideoCh3} />
  </AbsoluteFill>
);

export const SkipVideoCh4Comp: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#090D16' }}>
    <Audio src={staticFile('skip-video/ch_4_mixed.wav')} volume={1.0} />
    <ChapterWrap Comp={SkipVideoCh4} />
  </AbsoluteFill>
);

export const SkipVideoCh5Comp: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#090D16' }}>
    <Audio src={staticFile('skip-video/ch_5_mixed.wav')} volume={1.0} />
    <ChapterWrap Comp={SkipVideoCh5} />
  </AbsoluteFill>
);

export const SkipVideoShortComp: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#090D16' }}>
    <Audio src={staticFile('skip-video/short_mixed.wav')} volume={1.0} />
    <ChapterWrap Comp={SkipVideoShort} />
  </AbsoluteFill>
);

export const SkipVideoMain: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#090D16' }}>
    <Series>
      <Series.Sequence durationInFrames={SKIP_VIDEO_DURATIONS[0]}>
        <Audio src={staticFile('skip-video/ch_1_mixed.wav')} volume={1.0} />
        <ChapterWrap Comp={SkipVideoCh1} />
      </Series.Sequence>
      <Series.Sequence durationInFrames={SKIP_VIDEO_DURATIONS[1]}>
        <Audio src={staticFile('skip-video/ch_2_mixed.wav')} volume={1.0} />
        <ChapterWrap Comp={SkipVideoCh2} />
      </Series.Sequence>
      <Series.Sequence durationInFrames={SKIP_VIDEO_DURATIONS[2]}>
        <Audio src={staticFile('skip-video/ch_3_mixed.wav')} volume={1.0} />
        <ChapterWrap Comp={SkipVideoCh3} />
      </Series.Sequence>
      <Series.Sequence durationInFrames={SKIP_VIDEO_DURATIONS[3]}>
        <Audio src={staticFile('skip-video/ch_4_mixed.wav')} volume={1.0} />
        <ChapterWrap Comp={SkipVideoCh4} />
      </Series.Sequence>
      <Series.Sequence durationInFrames={SKIP_VIDEO_DURATIONS[4]}>
        <Audio src={staticFile('skip-video/ch_5_mixed.wav')} volume={1.0} />
        <ChapterWrap Comp={SkipVideoCh5} />
      </Series.Sequence>
    </Series>
  </AbsoluteFill>
);

