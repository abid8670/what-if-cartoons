import React from 'react';
import { Composition } from 'remotion';
import './engine/fonts';
import { STUDIO } from './studio.config';
import {
  FiveClonesCh1Comp,
  FiveClonesCh2Comp,
  FiveClonesCh3Comp,
  FiveClonesCh4Comp,
  FiveClonesCh5Comp,
  FiveClonesMain,
  FiveClonesShortComp,
  FIVE_CLONES_DURATIONS,
  TOTAL_FIVE_CLONES_FRAMES,
  SHORT_FIVE_CLONES_FRAMES,
} from './episodes/five-clones';

export const RootClones: React.FC = () => {
  const common = { width: STUDIO.width, height: STUDIO.height, fps: STUDIO.fps };
  return (
    <>
      <Composition id="Clones-Ch1" component={FiveClonesCh1Comp} durationInFrames={FIVE_CLONES_DURATIONS[0]} {...common} />
      <Composition id="Clones-Ch2" component={FiveClonesCh2Comp} durationInFrames={FIVE_CLONES_DURATIONS[1]} {...common} />
      <Composition id="Clones-Ch3" component={FiveClonesCh3Comp} durationInFrames={FIVE_CLONES_DURATIONS[2]} {...common} />
      <Composition id="Clones-Ch4" component={FiveClonesCh4Comp} durationInFrames={FIVE_CLONES_DURATIONS[3]} {...common} />
      <Composition id="Clones-Ch5" component={FiveClonesCh5Comp} durationInFrames={FIVE_CLONES_DURATIONS[4]} {...common} />
      <Composition id="Clones-Short" component={FiveClonesShortComp} durationInFrames={SHORT_FIVE_CLONES_FRAMES} {...common} />
      <Composition id="Clones-Main" component={FiveClonesMain} durationInFrames={TOTAL_FIVE_CLONES_FRAMES} {...common} />
    </>
  );
};

