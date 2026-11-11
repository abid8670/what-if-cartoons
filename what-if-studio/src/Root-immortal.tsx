import React from 'react';
import { Composition } from 'remotion';
import './engine/fonts';
import { STUDIO } from './studio.config';
import {
  ImmortalCh1Comp,
  ImmortalCh2Comp,
  ImmortalCh3Comp,
  ImmortalCh4Comp,
  ImmortalCh5Comp,
  ImmortalMain,
  ImmortalShortComp,
  IMMORTAL_DURATIONS,
  TOTAL_IMMORTAL_FRAMES,
  SHORT_IMMORTAL_FRAMES,
} from './episodes/immortal';

export const RootImmortal: React.FC = () => {
  const common = { width: STUDIO.width, height: STUDIO.height, fps: STUDIO.fps };
  return (
    <>
      <Composition id="Immortal-Ch1" component={ImmortalCh1Comp} durationInFrames={IMMORTAL_DURATIONS[0]} {...common} />
      <Composition id="Immortal-Ch2" component={ImmortalCh2Comp} durationInFrames={IMMORTAL_DURATIONS[1]} {...common} />
      <Composition id="Immortal-Ch3" component={ImmortalCh3Comp} durationInFrames={IMMORTAL_DURATIONS[2]} {...common} />
      <Composition id="Immortal-Ch4" component={ImmortalCh4Comp} durationInFrames={IMMORTAL_DURATIONS[3]} {...common} />
      <Composition id="Immortal-Ch5" component={ImmortalCh5Comp} durationInFrames={IMMORTAL_DURATIONS[4]} {...common} />
      <Composition id="Immortal-Short" component={ImmortalShortComp} durationInFrames={SHORT_IMMORTAL_FRAMES} {...common} />
      <Composition id="Immortal-Main" component={ImmortalMain} durationInFrames={TOTAL_IMMORTAL_FRAMES} {...common} />
    </>
  );
};

