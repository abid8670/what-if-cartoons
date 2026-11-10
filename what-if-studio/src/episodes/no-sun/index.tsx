import React from 'react';
import { AbsoluteFill, Series, Audio, staticFile, useCurrentFrame } from 'remotion';
import {
  Chapter1,
  Chapter2,
  Chapter3,
  Chapter4,
  Chapter5,
  Chapter6,
} from './chapters';

export const SUN_DURATIONS = [1572, 1437, 1548, 1557, 1305, 1167];
export const TOTAL_SUN_FRAMES = SUN_DURATIONS.reduce((a, b) => a + b, 0); // 8586 frames (~4.8 min)

const ChapterWrap: React.FC<{ Comp: React.FC<{ f: number }> }> = ({ Comp }) => {
  const f = useCurrentFrame();
  return (
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ width: '100%', height: '100%' }}>
      <Comp f={f} />
    </svg>
  );
};

export const NoSunMain: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#020617' }}>
      <Series>
        <Series.Sequence durationInFrames={SUN_DURATIONS[0]}>
          <Audio src={staticFile('no-sun/ch_1_mixed.wav')} volume={1.0} />
          <ChapterWrap Comp={Chapter1} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SUN_DURATIONS[1]}>
          <Audio src={staticFile('no-sun/ch_2_mixed.wav')} volume={1.0} />
          <ChapterWrap Comp={Chapter2} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SUN_DURATIONS[2]}>
          <Audio src={staticFile('no-sun/ch_3_mixed.wav')} volume={1.0} />
          <ChapterWrap Comp={Chapter3} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SUN_DURATIONS[3]}>
          <Audio src={staticFile('no-sun/ch_4_mixed.wav')} volume={1.0} />
          <ChapterWrap Comp={Chapter4} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SUN_DURATIONS[4]}>
          <Audio src={staticFile('no-sun/ch_5_mixed.wav')} volume={1.0} />
          <ChapterWrap Comp={Chapter5} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SUN_DURATIONS[5]}>
          <Audio src={staticFile('no-sun/ch_6_mixed.wav')} volume={1.0} />
          <ChapterWrap Comp={Chapter6} />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};

const CHAPTER_COMPS = [Chapter1, Chapter2, Chapter3, Chapter4, Chapter5, Chapter6];

export const MakeSunChapterComp = (idx: number) => {
  const Comp = CHAPTER_COMPS[idx];
  const audioFile = `no-sun/ch_${idx + 1}_mixed.wav`;
  return () => (
    <AbsoluteFill style={{ backgroundColor: '#020617' }}>
      <Audio src={staticFile(audioFile)} volume={1.0} />
      <ChapterWrap Comp={Comp} />
    </AbsoluteFill>
  );
};

export const SCh1Comp = MakeSunChapterComp(0);
export const SCh2Comp = MakeSunChapterComp(1);
export const SCh3Comp = MakeSunChapterComp(2);
export const SCh4Comp = MakeSunChapterComp(3);
export const SCh5Comp = MakeSunChapterComp(4);
export const SCh6Comp = MakeSunChapterComp(5);

// 14-Second Short (420 frames @ 30fps)
export const NoSunShort: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#020617' }}>
      <Audio src={staticFile('no-sun/short_mixed.wav')} volume={1.0} />
      <Series>
        {/* Hook: Warm sun & 8-min illusion (0-4s = 120 frames) */}
        <Series.Sequence durationInFrames={120}>
          <ChapterWrap Comp={Chapter1} />
        </Series.Sequence>
        {/* Slingshot into deep space (4-8s = 120 frames) */}
        <Series.Sequence durationInFrames={120}>
          <ChapterWrap Comp={Chapter2} />
        </Series.Sequence>
        {/* The Big Freeze (8-11s = 90 frames) */}
        <Series.Sequence durationInFrames={90}>
          <ChapterWrap Comp={Chapter3} />
        </Series.Sequence>
        {/* Golden Return & CTA (11-14s = 90 frames) */}
        <Series.Sequence durationInFrames={90}>
          <ChapterWrap Comp={Chapter5} />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};

