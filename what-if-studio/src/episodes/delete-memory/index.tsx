import React from 'react';
import { AbsoluteFill, Series, Audio, staticFile, useCurrentFrame } from 'remotion';
import { KitDefs, SetDefs, Grade } from '../../engine';
import {
  DeleteMemoryCh1,
  DeleteMemoryCh2,
  DeleteMemoryCh3,
  DeleteMemoryCh4,
  DeleteMemoryCh5,
  DeleteMemoryShort,
} from './chapters';

export const DELETE_MEMORY_DURATIONS = [1151, 1115, 1105, 995, 1240];
export const TOTAL_DELETE_MEMORY_FRAMES = DELETE_MEMORY_DURATIONS.reduce((a, b) => a + b, 0); // 5,606 frames (~3m 06s)
export const SHORT_DELETE_MEMORY_FRAMES = 1027; // ~34.2s

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

const ShortWrap: React.FC<{ Comp: React.FC<{ f: number }> }> = ({ Comp }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ width: '1080px', height: '1920px' }}>
        <KitDefs />
        <SetDefs />
        <Comp f={f} />
      </svg>
      <Grade f={f} grain={true} vignette={true} />
    </AbsoluteFill>
  );
};

export const DeleteMemoryCh1Comp: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#090D16' }}>
    <Audio src={staticFile('delete-memory/ch_1.mp3')} volume={1.0} />
    <ChapterWrap Comp={DeleteMemoryCh1} />
  </AbsoluteFill>
);

export const DeleteMemoryCh2Comp: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#090D16' }}>
    <Audio src={staticFile('delete-memory/ch_2.mp3')} volume={1.0} />
    <ChapterWrap Comp={DeleteMemoryCh2} />
  </AbsoluteFill>
);

export const DeleteMemoryCh3Comp: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#090D16' }}>
    <Audio src={staticFile('delete-memory/ch_3.mp3')} volume={1.0} />
    <ChapterWrap Comp={DeleteMemoryCh3} />
  </AbsoluteFill>
);

export const DeleteMemoryCh4Comp: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#090D16' }}>
    <Audio src={staticFile('delete-memory/ch_4.mp3')} volume={1.0} />
    <ChapterWrap Comp={DeleteMemoryCh4} />
  </AbsoluteFill>
);

export const DeleteMemoryCh5Comp: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#090D16' }}>
    <Audio src={staticFile('delete-memory/ch_5.mp3')} volume={1.0} />
    <ChapterWrap Comp={DeleteMemoryCh5} />
  </AbsoluteFill>
);

export const DeleteMemoryShortComp: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#090D16' }}>
    <Audio src={staticFile('delete-memory/short.mp3')} volume={1.0} />
    <ShortWrap Comp={DeleteMemoryShort} />
  </AbsoluteFill>
);

export const DeleteMemoryMain: React.FC = () => (
  <Series>
    <Series.Sequence durationInFrames={DELETE_MEMORY_DURATIONS[0]}>
      <DeleteMemoryCh1Comp />
    </Series.Sequence>
    <Series.Sequence durationInFrames={DELETE_MEMORY_DURATIONS[1]}>
      <DeleteMemoryCh2Comp />
    </Series.Sequence>
    <Series.Sequence durationInFrames={DELETE_MEMORY_DURATIONS[2]}>
      <DeleteMemoryCh3Comp />
    </Series.Sequence>
    <Series.Sequence durationInFrames={DELETE_MEMORY_DURATIONS[3]}>
      <DeleteMemoryCh4Comp />
    </Series.Sequence>
    <Series.Sequence durationInFrames={DELETE_MEMORY_DURATIONS[4]}>
      <DeleteMemoryCh5Comp />
    </Series.Sequence>
  </Series>
);

