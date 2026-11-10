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

export const BEDREST_DURATIONS = [1398, 1258, 1042, 992, 1183, 781];
export const TOTAL_BEDREST_FRAMES = BEDREST_DURATIONS.reduce((a, b) => a + b, 0); // 6654 frames (~3.7 min)

const ChapterWrap: React.FC<{ Comp: React.FC<{ f: number }> }> = ({ Comp }) => {
  const f = useCurrentFrame();
  return (
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ width: '100%', height: '100%' }}>
      <Comp f={f} />
    </svg>
  );
};

export const BedRestMain: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#020617' }}>
      <Series>
        <Series.Sequence durationInFrames={BEDREST_DURATIONS[0]}>
          <Audio src={staticFile('bed-rest/ch_1_mixed.wav')} volume={1.0} />
          <ChapterWrap Comp={Chapter1} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={BEDREST_DURATIONS[1]}>
          <Audio src={staticFile('bed-rest/ch_2_mixed.wav')} volume={1.0} />
          <ChapterWrap Comp={Chapter2} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={BEDREST_DURATIONS[2]}>
          <Audio src={staticFile('bed-rest/ch_3_mixed.wav')} volume={1.0} />
          <ChapterWrap Comp={Chapter3} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={BEDREST_DURATIONS[3]}>
          <Audio src={staticFile('bed-rest/ch_4_mixed.wav')} volume={1.0} />
          <ChapterWrap Comp={Chapter4} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={BEDREST_DURATIONS[4]}>
          <Audio src={staticFile('bed-rest/ch_5_mixed.wav')} volume={1.0} />
          <ChapterWrap Comp={Chapter5} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={BEDREST_DURATIONS[5]}>
          <Audio src={staticFile('bed-rest/ch_6_mixed.wav')} volume={1.0} />
          <ChapterWrap Comp={Chapter6} />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};

const CHAPTER_COMPS = [Chapter1, Chapter2, Chapter3, Chapter4, Chapter5, Chapter6];

export const MakeBedRestChapterComp = (idx: number) => {
  const Comp = CHAPTER_COMPS[idx];
  const audioFile = `bed-rest/ch_${idx + 1}_mixed.wav`;
  return () => (
    <AbsoluteFill style={{ backgroundColor: '#020617' }}>
      <Audio src={staticFile(audioFile)} volume={1.0} />
      <ChapterWrap Comp={Comp} />
    </AbsoluteFill>
  );
};

export const BCh1Comp = MakeBedRestChapterComp(0);
export const BCh2Comp = MakeBedRestChapterComp(1);
export const BCh3Comp = MakeBedRestChapterComp(2);
export const BCh4Comp = MakeBedRestChapterComp(3);
export const BCh5Comp = MakeBedRestChapterComp(4);
export const BCh6Comp = MakeBedRestChapterComp(5);

// 14-Second Short (420 frames @ 30fps)
export const BedRestShort: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#020617' }}>
      <Audio src={staticFile('bed-rest/short_mixed.wav')} volume={1.0} />
      <Series>
        {/* Hook: $19,000 for 30 days in bed (0-3.5s = 105 frames) */}
        <Series.Sequence durationInFrames={105}>
          <ChapterWrap Comp={Chapter1} />
        </Series.Sequence>
        {/* Muscle & Bone dissolve (3.5-7.5s = 120 frames) */}
        <Series.Sequence durationInFrames={120}>
          <ChapterWrap Comp={Chapter2} />
        </Series.Sequence>
        {/* Day 30 Floor Collapse (7.5-11.5s = 120 frames) */}
        <Series.Sequence durationInFrames={120}>
          <ChapterWrap Comp={Chapter5} />
        </Series.Sequence>
        {/* Subscribe outro beat (11.5-14s = 75 frames) */}
        <Series.Sequence durationInFrames={75}>
          <ChapterWrap Comp={Chapter6} />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};

