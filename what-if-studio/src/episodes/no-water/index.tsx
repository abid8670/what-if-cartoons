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
  NoWaterShort,
} from './chapters';

export const WATER_DURATIONS = [1167, 1323, 1266, 1330, 1316, 1467];
export const TOTAL_WATER_FRAMES = WATER_DURATIONS.reduce((a, b) => a + b, 0); // 7869 frames (~4.37 min)
export const SHORT_WATER_FRAMES = 820; // 27.3s vertical short

const ChapterWrap: React.FC<{ Comp: React.FC<{ f: number }> }> = ({ Comp }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ width: '100%', height: '100%' }}>
        <KitDefs />
        <SetDefs />
        <Comp f={f} />
      </svg>
      {/* Film Grain on twos + Radial Vignette (Signature One Minute Ahead finishing standard) */}
      <Grade f={f} grain={true} vignette={true} />
    </AbsoluteFill>
  );
};

export const NoWaterMain: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#020617' }}>
      <Series>
        <Series.Sequence durationInFrames={WATER_DURATIONS[0]}>
          <Audio src={staticFile('no-water/ch_1_mixed.wav')} volume={1.0} />
          <ChapterWrap Comp={Chapter1} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={WATER_DURATIONS[1]}>
          <Audio src={staticFile('no-water/ch_2_mixed.wav')} volume={1.0} />
          <ChapterWrap Comp={Chapter2} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={WATER_DURATIONS[2]}>
          <Audio src={staticFile('no-water/ch_3_mixed.wav')} volume={1.0} />
          <ChapterWrap Comp={Chapter3} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={WATER_DURATIONS[3]}>
          <Audio src={staticFile('no-water/ch_4_mixed.wav')} volume={1.0} />
          <ChapterWrap Comp={Chapter4} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={WATER_DURATIONS[4]}>
          <Audio src={staticFile('no-water/ch_5_mixed.wav')} volume={1.0} />
          <ChapterWrap Comp={Chapter5} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={WATER_DURATIONS[5]}>
          <Audio src={staticFile('no-water/ch_6_mixed.wav')} volume={1.0} />
          <ChapterWrap Comp={Chapter6} />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};

const CHAPTER_COMPS = [Chapter1, Chapter2, Chapter3, Chapter4, Chapter5, Chapter6];

export const MakeWaterChapterComp = (idx: number) => {
  const Comp = CHAPTER_COMPS[idx];
  const audioFile = `no-water/ch_${idx + 1}_mixed.wav`;
  return () => (
    <AbsoluteFill style={{ backgroundColor: '#020617' }}>
      <Audio src={staticFile(audioFile)} volume={1.0} />
      <ChapterWrap Comp={Comp} />
    </AbsoluteFill>
  );
};

export const WCh1Comp = MakeWaterChapterComp(0);
export const WCh2Comp = MakeWaterChapterComp(1);
export const WCh3Comp = MakeWaterChapterComp(2);
export const WCh4Comp = MakeWaterChapterComp(3);
export const WCh5Comp = MakeWaterChapterComp(4);
export const WCh6Comp = MakeWaterChapterComp(5);

export const NoWaterShortComp: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: '#020617' }}>
      <Audio src={staticFile('no-water/short_mixed.wav')} volume={1.0} />
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ width: '100%', height: '100%' }}>
        <KitDefs />
        <SetDefs />
        <NoWaterShort f={f} />
      </svg>
      <Grade f={f} grain={true} vignette={true} />
    </AbsoluteFill>
  );
};

