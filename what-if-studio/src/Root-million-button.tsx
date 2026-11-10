import React from 'react';
import { Composition } from 'remotion';
import './engine/fonts';
import { STUDIO } from './studio.config';
import {
  MillionButtonCh1Comp,
  MillionButtonCh2Comp,
  MillionButtonCh3Comp,
  MillionButtonCh4Comp,
  MillionButtonCh5Comp,
  MillionButtonMain,
  MillionButtonShortComp,
  MILLION_BUTTON_DURATIONS,
  TOTAL_MILLION_BUTTON_FRAMES,
  SHORT_MILLION_BUTTON_FRAMES,
} from './episodes/million-button';

export const RootMillionButton: React.FC = () => {
  const common = { width: STUDIO.width, height: STUDIO.height, fps: STUDIO.fps };
  return (
    <>
      <Composition id="Million-Ch1" component={MillionButtonCh1Comp} durationInFrames={MILLION_BUTTON_DURATIONS[0]} {...common} />
      <Composition id="Million-Ch2" component={MillionButtonCh2Comp} durationInFrames={MILLION_BUTTON_DURATIONS[1]} {...common} />
      <Composition id="Million-Ch3" component={MillionButtonCh3Comp} durationInFrames={MILLION_BUTTON_DURATIONS[2]} {...common} />
      <Composition id="Million-Ch4" component={MillionButtonCh4Comp} durationInFrames={MILLION_BUTTON_DURATIONS[3]} {...common} />
      <Composition id="Million-Ch5" component={MillionButtonCh5Comp} durationInFrames={MILLION_BUTTON_DURATIONS[4]} {...common} />
      <Composition id="Million-Short" component={MillionButtonShortComp} durationInFrames={SHORT_MILLION_BUTTON_FRAMES} {...common} />
      <Composition id="Million-Main" component={MillionButtonMain} durationInFrames={TOTAL_MILLION_BUTTON_FRAMES} {...common} />
    </>
  );
};

