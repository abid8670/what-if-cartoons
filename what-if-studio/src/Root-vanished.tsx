import React from 'react';
import { Composition } from 'remotion';
import './engine/fonts';
import { STUDIO } from './studio.config';
import {
  VanishedCh1Comp,
  VanishedCh2Comp,
  VanishedCh3Comp,
  VanishedCh4Comp,
  VanishedCh5Comp,
  VanishedMain,
  VanishedShortComp,
  VANISHED_DURATIONS,
  TOTAL_VANISHED_FRAMES,
  SHORT_VANISHED_FRAMES,
} from './episodes/vanished';

export const RootVanished: React.FC = () => {
  const common = { width: STUDIO.width, height: STUDIO.height, fps: STUDIO.fps };
  return (
    <>
      <Composition id="Vanished-Ch1" component={VanishedCh1Comp} durationInFrames={VANISHED_DURATIONS[0]} {...common} />
      <Composition id="Vanished-Ch2" component={VanishedCh2Comp} durationInFrames={VANISHED_DURATIONS[1]} {...common} />
      <Composition id="Vanished-Ch3" component={VanishedCh3Comp} durationInFrames={VANISHED_DURATIONS[2]} {...common} />
      <Composition id="Vanished-Ch4" component={VanishedCh4Comp} durationInFrames={VANISHED_DURATIONS[3]} {...common} />
      <Composition id="Vanished-Ch5" component={VanishedCh5Comp} durationInFrames={VANISHED_DURATIONS[4]} {...common} />
      <Composition id="Vanished-Short" component={VanishedShortComp} durationInFrames={SHORT_VANISHED_FRAMES} {...common} />
      <Composition id="Vanished-Main" component={VanishedMain} durationInFrames={TOTAL_VANISHED_FRAMES} {...common} />
    </>
  );
};

