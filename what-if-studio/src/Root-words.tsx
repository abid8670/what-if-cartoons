import React from 'react';
import { Composition } from 'remotion';
import './engine/fonts';
import { STUDIO } from './studio.config';
import {
  WordsCh1Comp,
  WordsCh2Comp,
  WordsCh3Comp,
  WordsCh4Comp,
  WordsCh5Comp,
  WordsMain,
  WordsShortComp,
  THOUSAND_WORDS_DURATIONS,
  TOTAL_THOUSAND_WORDS_FRAMES,
  SHORT_WORDS_FRAMES,
} from './episodes/thousand-words';

export const RootWords: React.FC = () => {
  const common = { width: STUDIO.width, height: STUDIO.height, fps: STUDIO.fps };
  return (
    <>
      <Composition id="Words-Ch1" component={WordsCh1Comp} durationInFrames={THOUSAND_WORDS_DURATIONS[0]} {...common} />
      <Composition id="Words-Ch2" component={WordsCh2Comp} durationInFrames={THOUSAND_WORDS_DURATIONS[1]} {...common} />
      <Composition id="Words-Ch3" component={WordsCh3Comp} durationInFrames={THOUSAND_WORDS_DURATIONS[2]} {...common} />
      <Composition id="Words-Ch4" component={WordsCh4Comp} durationInFrames={THOUSAND_WORDS_DURATIONS[3]} {...common} />
      <Composition id="Words-Ch5" component={WordsCh5Comp} durationInFrames={THOUSAND_WORDS_DURATIONS[4]} {...common} />
      <Composition id="Words-Short" component={WordsShortComp} durationInFrames={SHORT_WORDS_FRAMES} {...common} />
      <Composition id="Words-Main" component={WordsMain} durationInFrames={TOTAL_THOUSAND_WORDS_FRAMES} {...common} />
    </>
  );
};

