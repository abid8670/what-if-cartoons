import React from 'react';
import { defineEpisode, Timeline, LookDef, HudChip, Dial } from '../../engine';
import timeline from './timeline.json';
import { S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15, S16, S17 } from './shots';

// The power's one look. AHEAD: while the next minute plays, the picture cools and jitters a touch, an AHEAD chip
// blinks and the dial counts the watched minute down from +60.00. The ghosts and lights of the future are drawn in
// the shots (the Ghost wrapper, sparkles), the flashes are fx cues.
const aheadLook: LookDef = {
  grade: (lv) => `saturate(${1 - 0.2 * lv}) brightness(${1 + 0.04 * lv}) contrast(${1 + 0.05 * lv})`,
  jitter: 2,
  Overlay: ({ f, p }) => {
    const secs = 60 * (1 - p);
    const read = `+${secs.toFixed(2).padStart(6, '0')}s`;
    return (
      <g>
        <HudChip f={f} label="AHEAD" icon="skip" />
        <Dial p={1 - p} readout={read} />
      </g>
    );
  },
};

export const oneMinuteAhead = defineEpisode('OneMinuteAhead', {
  timeline: timeline as Timeline,
  shots: { S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15, S16, S17 },
  looks: { ahead: aheadLook },
});
