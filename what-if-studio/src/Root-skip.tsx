import React from 'react';
import { Composition } from 'remotion';
import './engine/fonts';
import { STUDIO } from './studio.config';
import {
  SkipVideoCh1Comp,
  SkipVideoCh2Comp,
  SkipVideoCh3Comp,
  SkipVideoCh4Comp,
  SkipVideoCh5Comp,
  SkipVideoMain,
  SkipVideoShortComp,
  SKIP_VIDEO_DURATIONS,
  TOTAL_SKIP_VIDEO_FRAMES,
  SHORT_SKIP_VIDEO_FRAMES,
} from './episodes/skip-video';

export const RootSkip: React.FC = () => {
  const common = { width: STUDIO.width, height: STUDIO.height, fps: STUDIO.fps };
  return (
    <>
      <Composition id="Skip-Ch1" component={SkipVideoCh1Comp} durationInFrames={SKIP_VIDEO_DURATIONS[0]} {...common} />
      <Composition id="Skip-Ch2" component={SkipVideoCh2Comp} durationInFrames={SKIP_VIDEO_DURATIONS[1]} {...common} />
      <Composition id="Skip-Ch3" component={SkipVideoCh3Comp} durationInFrames={SKIP_VIDEO_DURATIONS[2]} {...common} />
      <Composition id="Skip-Ch4" component={SkipVideoCh4Comp} durationInFrames={SKIP_VIDEO_DURATIONS[3]} {...common} />
      <Composition id="Skip-Ch5" component={SkipVideoCh5Comp} durationInFrames={SKIP_VIDEO_DURATIONS[4]} {...common} />
      <Composition id="Skip-Short" component={SkipVideoShortComp} durationInFrames={SHORT_SKIP_VIDEO_FRAMES} {...common} />
      <Composition id="Skip-Main" component={SkipVideoMain} durationInFrames={TOTAL_SKIP_VIDEO_FRAMES} {...common} />
    </>
  );
};

