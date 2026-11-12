import React from 'react';
import { Composition } from 'remotion';
import './engine/fonts';
import { STUDIO } from './studio.config';
import {
  DeleteMemoryCh1Comp,
  DeleteMemoryCh2Comp,
  DeleteMemoryCh3Comp,
  DeleteMemoryCh4Comp,
  DeleteMemoryCh5Comp,
  DeleteMemoryMain,
  DeleteMemoryShortComp,
  DELETE_MEMORY_DURATIONS,
  TOTAL_DELETE_MEMORY_FRAMES,
  SHORT_DELETE_MEMORY_FRAMES,
} from './episodes/delete-memory';

export const RootDeleteMemory: React.FC = () => {
  const common = { width: STUDIO.width, height: STUDIO.height, fps: STUDIO.fps };
  return (
    <>
      <Composition id="DeleteMemory-Ch1" component={DeleteMemoryCh1Comp} durationInFrames={DELETE_MEMORY_DURATIONS[0]} {...common} />
      <Composition id="DeleteMemory-Ch2" component={DeleteMemoryCh2Comp} durationInFrames={DELETE_MEMORY_DURATIONS[1]} {...common} />
      <Composition id="DeleteMemory-Ch3" component={DeleteMemoryCh3Comp} durationInFrames={DELETE_MEMORY_DURATIONS[2]} {...common} />
      <Composition id="DeleteMemory-Ch4" component={DeleteMemoryCh4Comp} durationInFrames={DELETE_MEMORY_DURATIONS[3]} {...common} />
      <Composition id="DeleteMemory-Ch5" component={DeleteMemoryCh5Comp} durationInFrames={DELETE_MEMORY_DURATIONS[4]} {...common} />
      <Composition id="DeleteMemory-Short" component={DeleteMemoryShortComp} durationInFrames={SHORT_DELETE_MEMORY_FRAMES} width={1080} height={1920} fps={30} />
      <Composition id="DeleteMemory-Main" component={DeleteMemoryMain} durationInFrames={TOTAL_DELETE_MEMORY_FRAMES} {...common} />
    </>
  );
};

