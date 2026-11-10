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

export const GRAVITY_DURATIONS = [1641, 1490, 1691, 1588, 1446, 1714];
export const TOTAL_GRAVITY_FRAMES = GRAVITY_DURATIONS.reduce((a, b) => a + b, 0); // 9570 frames

const ChapterWrap: React.FC<{ Comp: React.FC<{ f: number }> }> = ({ Comp }) => {
  const f = useCurrentFrame();
  return (
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ width: '100%', height: '100%' }}>
      <Comp f={f} />
    </svg>
  );
};

export const NoGravityMain: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#020617' }}>
      <Audio src={staticFile('no-gravity/voice_6m.mp3')} volume={1.0} />
      <Audio src={staticFile('library/sfx/music-4cdabe20.mp3')} volume={0.12} loop />
      <Series>
        <Series.Sequence durationInFrames={GRAVITY_DURATIONS[0]}>
          <ChapterWrap Comp={Chapter1} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={GRAVITY_DURATIONS[1]}>
          <ChapterWrap Comp={Chapter2} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={GRAVITY_DURATIONS[2]}>
          <ChapterWrap Comp={Chapter3} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={GRAVITY_DURATIONS[3]}>
          <ChapterWrap Comp={Chapter4} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={GRAVITY_DURATIONS[4]}>
          <ChapterWrap Comp={Chapter5} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={GRAVITY_DURATIONS[5]}>
          <ChapterWrap Comp={Chapter6} />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};

const CHAPTER_COMPS = [Chapter1, Chapter2, Chapter3, Chapter4, Chapter5, Chapter6];

export const MakeGravityChapterComp = (idx: number) => {
  const Comp = CHAPTER_COMPS[idx];
  const audioFile = `no-gravity/ch_${idx + 1}_mixed.wav`;
  return () => (
    <AbsoluteFill style={{ backgroundColor: '#020617' }}>
      <Audio src={staticFile(audioFile)} volume={1.0} />
      <ChapterWrap Comp={Comp} />
    </AbsoluteFill>
  );
};

export const GCh1Comp = MakeGravityChapterComp(0);
export const GCh2Comp = MakeGravityChapterComp(1);
export const GCh3Comp = MakeGravityChapterComp(2);
export const GCh4Comp = MakeGravityChapterComp(3);
export const GCh5Comp = MakeGravityChapterComp(4);
export const GCh6Comp = MakeGravityChapterComp(5);

// 43-second YouTube Short Composition
export const NoGravityShort: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#020617' }}>
      <Audio src={staticFile('no-gravity/short_mixed.wav')} volume={1.0} />
      <Series>
        <Series.Sequence durationInFrames={270}>
          <ChapterWrap Comp={Chapter1} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={240}>
          <ChapterWrap Comp={Chapter2} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={270}>
          <ChapterWrap Comp={Chapter3} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={250}>
          <ChapterWrap Comp={Chapter4} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={260}>
          <ChapterWrap Comp={Chapter5} />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};

export const NoGravityBoard: React.FC = () => {
  const f = useCurrentFrame();
  const idx = Math.min(f, CHAPTER_COMPS.length - 1);
  const Comp = CHAPTER_COMPS[idx];
  return (
    <AbsoluteFill style={{ backgroundColor: '#020617' }}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080">
        <Comp f={300} />
      </svg>
    </AbsoluteFill>
  );
};

export const noGravity = {
  id: 'NoGravity',
  total: TOTAL_GRAVITY_FRAMES,
  shotCount: 6,
  Main: NoGravityMain,
  Board: NoGravityBoard,
};

