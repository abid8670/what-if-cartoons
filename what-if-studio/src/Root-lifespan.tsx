import React from 'react';
import { Composition } from 'remotion';
import './engine/fonts';
import { STUDIO } from './studio.config';
import {
  LifespanCh1Comp,
  LifespanCh2Comp,
  LifespanCh3Comp,
  LifespanCh4Comp,
  LifespanCh5Comp,
  LifespanMain,
  LifespanShortComp,
  LIFESPAN_DURATIONS,
  TOTAL_LIFESPAN_FRAMES,
  SHORT_LIFESPAN_FRAMES,
} from './episodes/lifespan';

export const RootLifespan: React.FC = () => {
  const common = { width: STUDIO.width, height: STUDIO.height, fps: STUDIO.fps };
  return (
    <>
      <Composition id="Lifespan-Ch1" component={LifespanCh1Comp} durationInFrames={LIFESPAN_DURATIONS[0]} {...common} />
      <Composition id="Lifespan-Ch2" component={LifespanCh2Comp} durationInFrames={LIFESPAN_DURATIONS[1]} {...common} />
      <Composition id="Lifespan-Ch3" component={LifespanCh3Comp} durationInFrames={LIFESPAN_DURATIONS[2]} {...common} />
      <Composition id="Lifespan-Ch4" component={LifespanCh4Comp} durationInFrames={LIFESPAN_DURATIONS[3]} {...common} />
      <Composition id="Lifespan-Ch5" component={LifespanCh5Comp} durationInFrames={LIFESPAN_DURATIONS[4]} {...common} />
      <Composition id="Lifespan-Short" component={LifespanShortComp} durationInFrames={SHORT_LIFESPAN_FRAMES} width={1080} height={1920} fps={30} />
      <Composition id="Lifespan-Main" component={LifespanMain} durationInFrames={TOTAL_LIFESPAN_FRAMES} {...common} />
    </>
  );
};

