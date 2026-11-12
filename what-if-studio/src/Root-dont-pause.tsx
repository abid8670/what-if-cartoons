import React from 'react';
import { Composition } from 'remotion';
import './engine/fonts';
import { STUDIO } from './studio.config';
import {
  DontPauseCh1Comp,
  DontPauseCh2Comp,
  DontPauseCh3Comp,
  DontPauseCh4Comp,
  DontPauseCh5Comp,
  DontPauseMain,
  DontPauseShortComp,
  DONT_PAUSE_DURATIONS,
  TOTAL_DONT_PAUSE_FRAMES,
  SHORT_DONT_PAUSE_FRAMES,
} from './episodes/dont-pause';

export const RootDontPause: React.FC = () => {
  const common = { width: STUDIO.width, height: STUDIO.height, fps: STUDIO.fps };
  return (
    <>
      <Composition id="DontPause-Ch1" component={DontPauseCh1Comp} durationInFrames={DONT_PAUSE_DURATIONS[0]} {...common} />
      <Composition id="DontPause-Ch2" component={DontPauseCh2Comp} durationInFrames={DONT_PAUSE_DURATIONS[1]} {...common} />
      <Composition id="DontPause-Ch3" component={DontPauseCh3Comp} durationInFrames={DONT_PAUSE_DURATIONS[2]} {...common} />
      <Composition id="DontPause-Ch4" component={DontPauseCh4Comp} durationInFrames={DONT_PAUSE_DURATIONS[3]} {...common} />
      <Composition id="DontPause-Ch5" component={DontPauseCh5Comp} durationInFrames={DONT_PAUSE_DURATIONS[4]} {...common} />
      <Composition id="DontPause-Short" component={DontPauseShortComp} durationInFrames={SHORT_DONT_PAUSE_FRAMES} width={1080} height={1920} fps={30} />
      <Composition id="DontPause-Main" component={DontPauseMain} durationInFrames={TOTAL_DONT_PAUSE_FRAMES} {...common} />
    </>
  );
};

