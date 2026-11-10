import React from 'react';
import { defineEpisode, Timeline, LookDef, HudChip } from '../../engine';
import timeline from './timeline.json';
import { S1, S2, S3, S4, S5, S6, S7, S8, S9, S10 } from './shots';

// The power's look. WAKE: the picture cools a touch while the shadow is off the leash, a WAKE chip blinks.
// The cyan rim on the ink and the wake rings are drawn in the shots themselves.
const wakeLook: LookDef = {
  grade: (lv) => `saturate(${1 - 0.1 * lv}) hue-rotate(${-10 * lv}deg) brightness(${1 + 0.05 * lv})`,
  Overlay: ({ f }) => <HudChip f={f} label="WAKE" icon="dot" />,
};

export const ownShadow = defineEpisode('OwnShadow', {
  timeline: timeline as Timeline,
  shots: { S1, S2, S3, S4, S5, S6, S7, S8, S9, S10 },
  looks: { wake: wakeLook },
});
