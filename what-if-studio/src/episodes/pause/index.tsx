import React from 'react';
import { defineEpisode, Timeline, LookDef, HudChip, Dial } from '../../engine';
import timeline from './timeline.json';
import { S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14 } from './shots';

const freezeLook: LookDef = {
  grade: (lv) => `saturate(${1 - 0.6 * lv}) contrast(${1 + 0.2 * lv}) brightness(${1 - 0.08 * lv})`,
  jitter: 0,
  Overlay: ({ f, p }) => {
    return (
      <g>
        <HudChip f={f} label="PAUSED" icon="pause" />
        {/* Subtle cyan frost border vignette */}
        <rect x={0} y={0} width={1920} height={1080} fill="none" stroke="#38BDF8" strokeWidth={16} opacity={0.65} />
      </g>
    );
  },
};

export const pauseEveryone = defineEpisode('PauseEveryone', {
  timeline: timeline as Timeline,
  shots: { S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14 },
  looks: { freeze: freezeLook },
});

