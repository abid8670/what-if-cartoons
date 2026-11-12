import React from 'react';
import { Composition } from 'remotion';
import './engine/fonts';
import { STUDIO } from './studio.config';
import {
  NoSleepCh1Comp,
  NoSleepCh2Comp,
  NoSleepCh3Comp,
  NoSleepCh4Comp,
  NoSleepCh5Comp,
  NoSleepMain,
  NoSleepShortComp,
  NO_SLEEP_DURATIONS,
  TOTAL_NO_SLEEP_FRAMES,
  SHORT_NO_SLEEP_FRAMES,
} from './episodes/no-sleep';

export const RootNoSleep: React.FC = () => {
  const common = { width: STUDIO.width, height: STUDIO.height, fps: STUDIO.fps };
  return (
    <>
      <Composition id="NoSleep-Ch1" component={NoSleepCh1Comp} durationInFrames={NO_SLEEP_DURATIONS[0]} {...common} />
      <Composition id="NoSleep-Ch2" component={NoSleepCh2Comp} durationInFrames={NO_SLEEP_DURATIONS[1]} {...common} />
      <Composition id="NoSleep-Ch3" component={NoSleepCh3Comp} durationInFrames={NO_SLEEP_DURATIONS[2]} {...common} />
      <Composition id="NoSleep-Ch4" component={NoSleepCh4Comp} durationInFrames={NO_SLEEP_DURATIONS[3]} {...common} />
      <Composition id="NoSleep-Ch5" component={NoSleepCh5Comp} durationInFrames={NO_SLEEP_DURATIONS[4]} {...common} />
      <Composition id="NoSleep-Short" component={NoSleepShortComp} durationInFrames={SHORT_NO_SLEEP_FRAMES} width={1080} height={1920} fps={30} />
      <Composition id="NoSleep-Main" component={NoSleepMain} durationInFrames={TOTAL_NO_SLEEP_FRAMES} {...common} />
    </>
  );
};

