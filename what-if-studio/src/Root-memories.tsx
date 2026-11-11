import React from 'react';
import { Composition } from 'remotion';
import './engine/fonts';
import { STUDIO } from './studio.config';
import {
  MemoriesCh1Comp,
  MemoriesCh2Comp,
  MemoriesCh3Comp,
  MemoriesCh4Comp,
  MemoriesCh5Comp,
  MemoriesMain,
  MemoriesShortComp,
  MEMORIES_DURATIONS,
  TOTAL_MEMORIES_FRAMES,
  SHORT_MEMORIES_FRAMES,
} from './episodes/memories';

export const RootMemories: React.FC = () => {
  const common = { width: STUDIO.width, height: STUDIO.height, fps: STUDIO.fps };
  return (
    <>
      <Composition id="Memories-Ch1" component={MemoriesCh1Comp} durationInFrames={MEMORIES_DURATIONS[0]} {...common} />
      <Composition id="Memories-Ch2" component={MemoriesCh2Comp} durationInFrames={MEMORIES_DURATIONS[1]} {...common} />
      <Composition id="Memories-Ch3" component={MemoriesCh3Comp} durationInFrames={MEMORIES_DURATIONS[2]} {...common} />
      <Composition id="Memories-Ch4" component={MemoriesCh4Comp} durationInFrames={MEMORIES_DURATIONS[3]} {...common} />
      <Composition id="Memories-Ch5" component={MemoriesCh5Comp} durationInFrames={MEMORIES_DURATIONS[4]} {...common} />
      <Composition id="Memories-Short" component={MemoriesShortComp} durationInFrames={SHORT_MEMORIES_FRAMES} {...common} />
      <Composition id="Memories-Main" component={MemoriesMain} durationInFrames={TOTAL_MEMORIES_FRAMES} {...common} />
    </>
  );
};

