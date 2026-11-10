import React from 'react';
import { Composition } from 'remotion';
import './engine/fonts';
import { STUDIO } from './studio.config';
import {
  MindReaderCh1Comp,
  MindReaderCh2Comp,
  MindReaderCh3Comp,
  MindReaderCh4Comp,
  MindReaderCh5Comp,
  MindReaderMain,
  MindReaderShortComp,
  MIND_READER_DURATIONS,
  TOTAL_MIND_READER_FRAMES,
  SHORT_MIND_READER_FRAMES,
} from './episodes/mind-reader';

export const RootMind: React.FC = () => {
  const common = { width: STUDIO.width, height: STUDIO.height, fps: STUDIO.fps };
  return (
    <>
      <Composition id="Mind-Ch1" component={MindReaderCh1Comp} durationInFrames={MIND_READER_DURATIONS[0]} {...common} />
      <Composition id="Mind-Ch2" component={MindReaderCh2Comp} durationInFrames={MIND_READER_DURATIONS[1]} {...common} />
      <Composition id="Mind-Ch3" component={MindReaderCh3Comp} durationInFrames={MIND_READER_DURATIONS[2]} {...common} />
      <Composition id="Mind-Ch4" component={MindReaderCh4Comp} durationInFrames={MIND_READER_DURATIONS[3]} {...common} />
      <Composition id="Mind-Ch5" component={MindReaderCh5Comp} durationInFrames={MIND_READER_DURATIONS[4]} {...common} />
      <Composition id="Mind-Short" component={MindReaderShortComp} durationInFrames={SHORT_MIND_READER_FRAMES} {...common} />
      <Composition id="Mind-Main" component={MindReaderMain} durationInFrames={TOTAL_MIND_READER_FRAMES} {...common} />
    </>
  );
};

