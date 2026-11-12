import React from 'react';
import { Composition } from 'remotion';
import './engine/fonts';
import { STUDIO } from './studio.config';
import {
  TimeRemoteCh1Comp,
  TimeRemoteCh2Comp,
  TimeRemoteCh3Comp,
  TimeRemoteCh4Comp,
  TimeRemoteCh5Comp,
  TimeRemoteMain,
  TimeRemoteShortComp,
  TIME_REMOTE_DURATIONS,
  TOTAL_TIME_REMOTE_FRAMES,
  SHORT_TIME_REMOTE_FRAMES,
} from './episodes/time-remote';

export const RootTimeRemote: React.FC = () => {
  const common = { width: STUDIO.width, height: STUDIO.height, fps: STUDIO.fps };
  return (
    <>
      <Composition id="TimeRemote-Ch1" component={TimeRemoteCh1Comp} durationInFrames={TIME_REMOTE_DURATIONS[0]} {...common} />
      <Composition id="TimeRemote-Ch2" component={TimeRemoteCh2Comp} durationInFrames={TIME_REMOTE_DURATIONS[1]} {...common} />
      <Composition id="TimeRemote-Ch3" component={TimeRemoteCh3Comp} durationInFrames={TIME_REMOTE_DURATIONS[2]} {...common} />
      <Composition id="TimeRemote-Ch4" component={TimeRemoteCh4Comp} durationInFrames={TIME_REMOTE_DURATIONS[3]} {...common} />
      <Composition id="TimeRemote-Ch5" component={TimeRemoteCh5Comp} durationInFrames={TIME_REMOTE_DURATIONS[4]} {...common} />
      <Composition id="TimeRemote-Short" component={TimeRemoteShortComp} durationInFrames={SHORT_TIME_REMOTE_FRAMES} width={1080} height={1920} fps={30} />
      <Composition id="TimeRemote-Main" component={TimeRemoteMain} durationInFrames={TOTAL_TIME_REMOTE_FRAMES} {...common} />
    </>
  );
};

