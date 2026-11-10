import React from 'react';
import { Composition } from 'remotion';
import './engine/fonts';
import { STUDIO } from './studio.config';
import {
  DeathTimerCh1Comp,
  DeathTimerCh2Comp,
  DeathTimerCh3Comp,
  DeathTimerCh4Comp,
  DeathTimerCh5Comp,
  DeathTimerMain,
  DeathTimerShortComp,
  DeathTimerThumbComp,
  DEATH_TIMER_DURATIONS,
  TOTAL_DEATH_TIMER_FRAMES,
  SHORT_DEATH_TIMER_FRAMES,
} from './episodes/death-timer';

export const RootTimer: React.FC = () => {
  const common = { width: STUDIO.width, height: STUDIO.height, fps: STUDIO.fps };
  return (
    <>
      <Composition id="Timer-Ch1" component={DeathTimerCh1Comp} durationInFrames={DEATH_TIMER_DURATIONS[0]} {...common} />
      <Composition id="Timer-Ch2" component={DeathTimerCh2Comp} durationInFrames={DEATH_TIMER_DURATIONS[1]} {...common} />
      <Composition id="Timer-Ch3" component={DeathTimerCh3Comp} durationInFrames={DEATH_TIMER_DURATIONS[2]} {...common} />
      <Composition id="Timer-Ch4" component={DeathTimerCh4Comp} durationInFrames={DEATH_TIMER_DURATIONS[3]} {...common} />
      <Composition id="Timer-Ch5" component={DeathTimerCh5Comp} durationInFrames={DEATH_TIMER_DURATIONS[4]} {...common} />
      <Composition id="Timer-Short" component={DeathTimerShortComp} durationInFrames={SHORT_DEATH_TIMER_FRAMES} {...common} />
      <Composition id="Timer-Main" component={DeathTimerMain} durationInFrames={TOTAL_DEATH_TIMER_FRAMES} {...common} />
      <Composition id="Timer-Thumb" component={DeathTimerThumbComp} durationInFrames={30} {...common} />
    </>
  );
};

