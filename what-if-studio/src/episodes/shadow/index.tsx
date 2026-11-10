import React from 'react';
import { defineEpisode, Timeline, LookDef, HudChip } from '../../engine';
import timeline from './timeline.json';
import { S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11 } from './shots';

// The power's look. DETACH: the picture cools and sinks a touch while the shadow acts on its own, a DETACH chip
// blinks. The violet edge on the shadow itself is drawn per shot (rimBlue).
const shadowLook: LookDef = {
  grade: (lv) => `saturate(${1 - 0.16 * lv}) hue-rotate(${12 * lv}deg) brightness(${1 - 0.05 * lv})`,
  Overlay: ({ f }) => <HudChip f={f} label="DETACH" icon="dot" />,
};

export const shadow = defineEpisode('Shadow', {
  timeline: timeline as Timeline,
  shots: { S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11 },
  looks: { shadow: shadowLook },
});
