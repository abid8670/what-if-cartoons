import React from 'react';
import { AbsoluteFill, Series, Audio, staticFile, useCurrentFrame } from 'remotion';
import {
  Chapter1,
  Chapter2,
  Chapter3,
  Chapter4,
  Chapter5,
  Chapter6,
  Chapter7,
  Chapter8,
} from './chapters';

export const DURATIONS = [2313, 2730, 2568, 3015, 2481, 2667, 2289, 2781];
export const TOTAL_FRAMES = DURATIONS.reduce((a, b) => a + b, 0); // 20844 frames = 694.8s (11.58 min)

const ChapterWrap: React.FC<{ Comp: React.FC<{ f: number }> }> = ({ Comp }) => {
  const f = useCurrentFrame();
  return (
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ width: '100%', height: '100%' }}>
      <Comp f={f} />
    </svg>
  );
};

export const Pause10mMain: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#020617' }}>
      <Audio src={staticFile('pause-10m/voice_10m.mp3')} volume={1.0} />
      <Series>
        <Series.Sequence durationInFrames={DURATIONS[0]}>
          <ChapterWrap Comp={Chapter1} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={DURATIONS[1]}>
          <ChapterWrap Comp={Chapter2} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={DURATIONS[2]}>
          <ChapterWrap Comp={Chapter3} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={DURATIONS[3]}>
          <ChapterWrap Comp={Chapter4} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={DURATIONS[4]}>
          <ChapterWrap Comp={Chapter5} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={DURATIONS[5]}>
          <ChapterWrap Comp={Chapter6} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={DURATIONS[6]}>
          <ChapterWrap Comp={Chapter7} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={DURATIONS[7]}>
          <ChapterWrap Comp={Chapter8} />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};

const CHAPTER_COMPS = [Chapter1, Chapter2, Chapter3, Chapter4, Chapter5, Chapter6, Chapter7, Chapter8];

// Individual Chapter Compositions with their respective audio
export const MakeChapterComp = (idx: number) => {
  const Comp = CHAPTER_COMPS[idx];
  const audioFile = `pause-10m/ch_${idx + 1}_mixed.wav`;
  return () => (
    <AbsoluteFill style={{ backgroundColor: '#020617' }}>
      <Audio src={staticFile(audioFile)} volume={1.0} />
      <ChapterWrap Comp={Comp} />
    </AbsoluteFill>
  );
};

export const Ch1Comp = MakeChapterComp(0);
export const Ch2Comp = MakeChapterComp(1);
export const Ch3Comp = MakeChapterComp(2);
export const Ch4Comp = MakeChapterComp(3);
export const Ch5Comp = MakeChapterComp(4);
export const Ch6Comp = MakeChapterComp(5);
export const Ch7Comp = MakeChapterComp(6);
export const Ch8Comp = MakeChapterComp(7);

export const Pause10mBoard: React.FC = () => {
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

export const pause10m = {
  id: 'Pause10m',
  total: TOTAL_FRAMES,
  shotCount: 8,
  Main: Pause10mMain,
  Board: Pause10mBoard,
};
