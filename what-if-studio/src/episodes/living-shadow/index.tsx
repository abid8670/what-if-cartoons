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
  LivingShadowShort,
} from './chapters';

export const SHADOW_DURATIONS = [1257, 1167, 1273, 1162, 1297, 1465];
export const TOTAL_SHADOW_FRAMES = SHADOW_DURATIONS.reduce((a, b) => a + b, 0); // 7621 frames (~4.23 min)

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

export const LivingShadowMain: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#020617' }}>
      <Series>
        <Series.Sequence durationInFrames={SHADOW_DURATIONS[0]}>
          <Audio src={staticFile('living-shadow/ch_1_mixed.wav')} volume={1.0} />
          <ChapterWrap Comp={Chapter1} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SHADOW_DURATIONS[1]}>
          <Audio src={staticFile('living-shadow/ch_2_mixed.wav')} volume={1.0} />
          <ChapterWrap Comp={Chapter2} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SHADOW_DURATIONS[2]}>
          <Audio src={staticFile('living-shadow/ch_3_mixed.wav')} volume={1.0} />
          <ChapterWrap Comp={Chapter3} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SHADOW_DURATIONS[3]}>
          <Audio src={staticFile('living-shadow/ch_4_mixed.wav')} volume={1.0} />
          <ChapterWrap Comp={Chapter4} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SHADOW_DURATIONS[4]}>
          <Audio src={staticFile('living-shadow/ch_5_mixed.wav')} volume={1.0} />
          <ChapterWrap Comp={Chapter5} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SHADOW_DURATIONS[5]}>
          <Audio src={staticFile('living-shadow/ch_6_mixed.wav')} volume={1.0} />
          <ChapterWrap Comp={Chapter6} />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};

const CHAPTER_COMPS = [Chapter1, Chapter2, Chapter3, Chapter4, Chapter5, Chapter6];

export const MakeShadowChapterComp = (idx: number) => {
  const Comp = CHAPTER_COMPS[idx];
  const audioFile = `living-shadow/ch_${idx + 1}_mixed.wav`;
  return () => (
    <AbsoluteFill style={{ backgroundColor: '#020617' }}>
      <Audio src={staticFile(audioFile)} volume={1.0} />
      <ChapterWrap Comp={Comp} />
    </AbsoluteFill>
  );
};

export const LShCh1Comp = MakeShadowChapterComp(0);
export const LShCh2Comp = MakeShadowChapterComp(1);
export const LShCh3Comp = MakeShadowChapterComp(2);
export const LShCh4Comp = MakeShadowChapterComp(3);
export const LShCh5Comp = MakeShadowChapterComp(4);
export const LShCh6Comp = MakeShadowChapterComp(5);

export const LivingShadowShortComp: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: '#020617' }}>
      <Audio src={staticFile('living-shadow/short_mixed.wav')} volume={1.0} />
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ width: '100%', height: '100%' }}>
        <KitDefs />
        <SetDefs />
        <LivingShadowShort f={f} />
      </svg>
      <Grade f={f} grain={true} vignette={true} />
    </AbsoluteFill>
  );
};
