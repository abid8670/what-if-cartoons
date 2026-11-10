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
  AncientPleasureShort,
} from './chapters';

export const ANCIENT_DURATIONS = [1182, 1434, 1559, 1343, 1239, 1372];
export const TOTAL_ANCIENT_FRAMES = ANCIENT_DURATIONS.reduce((a, b) => a + b, 0); // 8047 frames (~4.47 min)

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

export const AncientPleasureMain: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#020617' }}>
      <Series>
        <Series.Sequence durationInFrames={ANCIENT_DURATIONS[0]}>
          <Audio src={staticFile('ancient-pleasure/ch_1_mixed.wav')} volume={1.0} />
          <ChapterWrap Comp={Chapter1} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={ANCIENT_DURATIONS[1]}>
          <Audio src={staticFile('ancient-pleasure/ch_2_mixed.wav')} volume={1.0} />
          <ChapterWrap Comp={Chapter2} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={ANCIENT_DURATIONS[2]}>
          <Audio src={staticFile('ancient-pleasure/ch_3_mixed.wav')} volume={1.0} />
          <ChapterWrap Comp={Chapter3} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={ANCIENT_DURATIONS[3]}>
          <Audio src={staticFile('ancient-pleasure/ch_4_mixed.wav')} volume={1.0} />
          <ChapterWrap Comp={Chapter4} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={ANCIENT_DURATIONS[4]}>
          <Audio src={staticFile('ancient-pleasure/ch_5_mixed.wav')} volume={1.0} />
          <ChapterWrap Comp={Chapter5} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={ANCIENT_DURATIONS[5]}>
          <Audio src={staticFile('ancient-pleasure/ch_6_mixed.wav')} volume={1.0} />
          <ChapterWrap Comp={Chapter6} />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};

const CHAPTER_COMPS = [Chapter1, Chapter2, Chapter3, Chapter4, Chapter5, Chapter6];

export const MakeAncientChapterComp = (idx: number) => {
  const Comp = CHAPTER_COMPS[idx];
  const audioFile = `ancient-pleasure/ch_${idx + 1}_mixed.wav`;
  return () => (
    <AbsoluteFill style={{ backgroundColor: '#020617' }}>
      <Audio src={staticFile(audioFile)} volume={1.0} />
      <ChapterWrap Comp={Comp} />
    </AbsoluteFill>
  );
};

export const ACh1Comp = MakeAncientChapterComp(0);
export const ACh2Comp = MakeAncientChapterComp(1);
export const ACh3Comp = MakeAncientChapterComp(2);
export const ACh4Comp = MakeAncientChapterComp(3);
export const ACh5Comp = MakeAncientChapterComp(4);
export const ACh6Comp = MakeAncientChapterComp(5);

export const AncientShortComp: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: '#020617' }}>
      <Audio src={staticFile('ancient-pleasure/short_mixed.wav')} volume={1.0} />
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ width: '100%', height: '100%' }}>
        <KitDefs />
        <SetDefs />
        <AncientPleasureShort f={f} />
      </svg>
      <Grade f={f} grain={true} vignette={true} />
    </AbsoluteFill>
  );
};

