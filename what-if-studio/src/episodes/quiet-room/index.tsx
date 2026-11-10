import React from 'react';
import { AbsoluteFill, Series, Audio, staticFile, useCurrentFrame } from 'remotion';
import { KitDefs, SetDefs, Grade } from '../../engine';
import {
  Chapter1,
  Chapter2,
  Chapter3,
  Chapter4,
  Chapter5,
  Chapter6,
  QuietRoomShort,
} from './chapters';

export const QUIET_DURATIONS = [1088, 1000, 948, 950, 939, 1039];
export const TOTAL_QUIET_FRAMES = QUIET_DURATIONS.reduce((a, b) => a + b, 0); // 5964 frames (~3.31 min)

const ChapterWrap: React.FC<{ Comp: React.FC<{ f: number }> }> = ({ Comp }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ width: '100%', height: '100%' }}>
        <KitDefs />
        <SetDefs />
        <Comp f={f} />
      </svg>
      {/* Film Grain on twos + Radial Vignette from One Minute Ahead */}
      <Grade f={f} grain={true} vignette={true} />
    </AbsoluteFill>
  );
};

export const QuietRoomMain: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#020617' }}>
      <Series>
        <Series.Sequence durationInFrames={QUIET_DURATIONS[0]}>
          <Audio src={staticFile('quiet-room/ch_1_mixed.wav')} volume={1.0} />
          <ChapterWrap Comp={Chapter1} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={QUIET_DURATIONS[1]}>
          <Audio src={staticFile('quiet-room/ch_2_mixed.wav')} volume={1.0} />
          <ChapterWrap Comp={Chapter2} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={QUIET_DURATIONS[2]}>
          <Audio src={staticFile('quiet-room/ch_3_mixed.wav')} volume={1.0} />
          <ChapterWrap Comp={Chapter3} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={QUIET_DURATIONS[3]}>
          <Audio src={staticFile('quiet-room/ch_4_mixed.wav')} volume={1.0} />
          <ChapterWrap Comp={Chapter4} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={QUIET_DURATIONS[4]}>
          <Audio src={staticFile('quiet-room/ch_5_mixed.wav')} volume={1.0} />
          <ChapterWrap Comp={Chapter5} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={QUIET_DURATIONS[5]}>
          <Audio src={staticFile('quiet-room/ch_6_mixed.wav')} volume={1.0} />
          <ChapterWrap Comp={Chapter6} />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};

const CHAPTER_COMPS = [Chapter1, Chapter2, Chapter3, Chapter4, Chapter5, Chapter6];

export const MakeQuietChapterComp = (idx: number) => {
  const Comp = CHAPTER_COMPS[idx];
  const audioFile = `quiet-room/ch_${idx + 1}_mixed.wav`;
  return () => (
    <AbsoluteFill style={{ backgroundColor: '#020617' }}>
      <Audio src={staticFile(audioFile)} volume={1.0} />
      <ChapterWrap Comp={Comp} />
    </AbsoluteFill>
  );
};

export const QCh1Comp = MakeQuietChapterComp(0);
export const QCh2Comp = MakeQuietChapterComp(1);
export const QCh3Comp = MakeQuietChapterComp(2);
export const QCh4Comp = MakeQuietChapterComp(3);
export const QCh5Comp = MakeQuietChapterComp(4);
export const QCh6Comp = MakeQuietChapterComp(5);

export const QuietRoomShortComp: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: '#020617' }}>
      <Audio src={staticFile('quiet-room/short_mixed.wav')} volume={1.0} />
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ width: '100%', height: '100%' }}>
        <KitDefs />
        <SetDefs />
        <QuietRoomShort f={f} />
      </svg>
      <Grade f={f} grain={true} vignette={true} />
    </AbsoluteFill>
  );
};
