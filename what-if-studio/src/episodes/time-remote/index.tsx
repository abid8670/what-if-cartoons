import React from 'react';
import { AbsoluteFill, Series, Audio, staticFile, useCurrentFrame } from 'remotion';
import { KitDefs, SetDefs, Grade } from '../../engine';
import {
  TimeRemoteCh1,
  TimeRemoteCh2,
  TimeRemoteCh3,
  TimeRemoteCh4,
  TimeRemoteCh5,
  TimeRemoteShort,
} from './chapters';

export const TIME_REMOTE_DURATIONS = [930, 753, 709, 847, 878];
export const TOTAL_TIME_REMOTE_FRAMES = TIME_REMOTE_DURATIONS.reduce((a, b) => a + b, 0); // 4,117 frames (~2m 17s)
export const SHORT_TIME_REMOTE_FRAMES = 1099; // ~36.6s

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
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ width: '100%', height: '100%' }}>
        <KitDefs />
        <SetDefs />
        <Comp f={f} />
      </svg>
      <Grade f={f} grain={true} vignette={true} />
    </AbsoluteFill>
  );
};

export const TimeRemoteCh1Comp: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#090D16' }}>
    <Audio src={staticFile('time-remote/ch_1.mp3')} volume={1.0} />
    <ChapterWrap Comp={TimeRemoteCh1} />
  </AbsoluteFill>
);

export const TimeRemoteCh2Comp: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#090D16' }}>
    <Audio src={staticFile('time-remote/ch_2.mp3')} volume={1.0} />
    <ChapterWrap Comp={TimeRemoteCh2} />
  </AbsoluteFill>
);

export const TimeRemoteCh3Comp: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#090D16' }}>
    <Audio src={staticFile('time-remote/ch_3.mp3')} volume={1.0} />
    <ChapterWrap Comp={TimeRemoteCh3} />
  </AbsoluteFill>
);

export const TimeRemoteCh4Comp: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#090D16' }}>
    <Audio src={staticFile('time-remote/ch_4.mp3')} volume={1.0} />
    <ChapterWrap Comp={TimeRemoteCh4} />
  </AbsoluteFill>
);

export const TimeRemoteCh5Comp: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#090D16' }}>
    <Audio src={staticFile('time-remote/ch_5.mp3')} volume={1.0} />
    <ChapterWrap Comp={TimeRemoteCh5} />
  </AbsoluteFill>
);

export const TimeRemoteShortComp: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#090D16' }}>
    <Audio src={staticFile('time-remote/short.mp3')} volume={1.0} />
    <ShortWrap Comp={TimeRemoteShort} />
  </AbsoluteFill>
);

export const TimeRemoteMain: React.FC = () => (
  <Series>
    <Series.Sequence durationInFrames={TIME_REMOTE_DURATIONS[0]}>
      <TimeRemoteCh1Comp />
    </Series.Sequence>
    <Series.Sequence durationInFrames={TIME_REMOTE_DURATIONS[1]}>
      <TimeRemoteCh2Comp />
    </Series.Sequence>
    <Series.Sequence durationInFrames={TIME_REMOTE_DURATIONS[2]}>
      <TimeRemoteCh3Comp />
    </Series.Sequence>
    <Series.Sequence durationInFrames={TIME_REMOTE_DURATIONS[3]}>
      <TimeRemoteCh4Comp />
    </Series.Sequence>
    <Series.Sequence durationInFrames={TIME_REMOTE_DURATIONS[4]}>
      <TimeRemoteCh5Comp />
    </Series.Sequence>
  </Series>
);

