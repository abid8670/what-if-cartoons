import React from 'react';
import { Composition } from 'remotion';
import './engine/fonts';
import { STUDIO } from './studio.config';
import { EPISODES } from './episodes';
import { CastSheet } from './CastSheet';
import {
  Ch1Comp,
  Ch2Comp,
  Ch3Comp,
  Ch4Comp,
  Ch5Comp,
  Ch6Comp,
  Ch7Comp,
  Ch8Comp,
  DURATIONS,
} from './episodes/pause-10m';
import {
  GCh1Comp,
  GCh2Comp,
  GCh3Comp,
  GCh4Comp,
  GCh5Comp,
  GCh6Comp,
  GRAVITY_DURATIONS,
  NoGravityShort,
} from './episodes/no-gravity';
import {
  SCh1Comp,
  SCh2Comp,
  SCh3Comp,
  SCh4Comp,
  SCh5Comp,
  SCh6Comp,
  SUN_DURATIONS,
  NoSunShort,
} from './episodes/no-sun';
import {
  BCh1Comp,
  BCh2Comp,
  BCh3Comp,
  BCh4Comp,
  BCh5Comp,
  BCh6Comp,
  BEDREST_DURATIONS,
  BedRestShort,
} from './episodes/bed-rest';
import {
  ACh1Comp,
  ACh2Comp,
  ACh3Comp,
  ACh4Comp,
  ACh5Comp,
  ACh6Comp,
  ANCIENT_DURATIONS,
  AncientShortComp,
} from './episodes/ancient-pleasure';
import {
  QCh1Comp,
  QCh2Comp,
  QCh3Comp,
  QCh4Comp,
  QCh5Comp,
  QCh6Comp,
  QUIET_DURATIONS,
  QuietRoomShortComp,
  QuietRoomMain,
  TOTAL_QUIET_FRAMES,
} from './episodes/quiet-room';
import {
  LShCh1Comp,
  LShCh2Comp,
  LShCh3Comp,
  LShCh4Comp,
  LShCh5Comp,
  LShCh6Comp,
  SHADOW_DURATIONS,
  LivingShadowShortComp,
  LivingShadowMain,
  TOTAL_SHADOW_FRAMES,
} from './episodes/living-shadow';
import {
  WCh1Comp,
  WCh2Comp,
  WCh3Comp,
  WCh4Comp,
  WCh5Comp,
  WCh6Comp,
  WATER_DURATIONS,
  NoWaterShortComp,
  NoWaterMain,
  TOTAL_WATER_FRAMES,
  SHORT_WATER_FRAMES,
} from './episodes/no-water';
import {
  StickmanCh1Comp,
  StickmanCh2Comp,
  StickmanCh3Comp,
  StickmanCh4Comp,
  StickmanCh5Comp,
  STICKMAN_DURATIONS,
  StickmanLifeShortComp,
  StickmanLifeMain,
  TOTAL_STICKMAN_FRAMES,
  SHORT_STICKMAN_FRAMES,
} from './episodes/stickman-life';
import {
  DogIntroComp,
  DogCh1Comp,
  DogCh2Comp,
  DogCh3Comp,
  DogCh4Comp,
  DogCh5Comp,
  DOG_DURATIONS,
  TOTAL_DOG_FRAMES,
  SHORT_DOG_FRAMES,
  PlatformDogMain,
  PlatformDogShortComp,
} from './episodes/platform-dog';
import {
  DontWatchCh1Comp,
  DontWatchCh2Comp,
  DontWatchCh3Comp,
  DontWatchCh4Comp,
  DontWatchMain,
  DontWatchShortComp,
  DONT_WATCH_DURATIONS,
  TOTAL_DONT_WATCH_FRAMES,
  SHORT_DONT_WATCH_FRAMES,
} from './episodes/dont-watch';
import {
  ThousandCh1Comp,
  ThousandCh2Comp,
  ThousandCh3Comp,
  ThousandCh4Comp,
  ThousandCh5Comp,
  ThousandMain,
  ThousandShortComp,
  THOUSAND_DURATIONS,
  TOTAL_THOUSAND_FRAMES,
  SHORT_THOUSAND_FRAMES,
} from './episodes/one-thousand-or-one';
import {
  FanCh1Comp,
  FanCh2Comp,
  FanCh3Comp,
  FanMain,
  FanShortComp,
  FAN_DURATIONS,
  TOTAL_FAN_FRAMES,
  SHORT_FAN_FRAMES,
} from './episodes/fan-off-ammi';
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

export const Root: React.FC = () => {
  const common = { width: STUDIO.width, height: STUDIO.height, fps: STUDIO.fps };
  return (
    <>
      {EPISODES.map((e) => (
        <React.Fragment key={e.id}>
          <Composition id={e.id} component={e.Main} durationInFrames={Math.max(1, e.total)} {...common} />
          <Composition id={`${e.id}Board`} component={e.Board} durationInFrames={Math.max(1, e.shotCount)} {...common} />
        </React.Fragment>
      ))}
      {/* 10-Minute Chapter Compositions */}
      <Composition id="Pause10m-Ch1" component={Ch1Comp} durationInFrames={DURATIONS[0]} {...common} />
      <Composition id="Pause10m-Ch2" component={Ch2Comp} durationInFrames={DURATIONS[1]} {...common} />
      <Composition id="Pause10m-Ch3" component={Ch3Comp} durationInFrames={DURATIONS[2]} {...common} />
      <Composition id="Pause10m-Ch4" component={Ch4Comp} durationInFrames={DURATIONS[3]} {...common} />
      <Composition id="Pause10m-Ch5" component={Ch5Comp} durationInFrames={DURATIONS[4]} {...common} />
      <Composition id="Pause10m-Ch6" component={Ch6Comp} durationInFrames={DURATIONS[5]} {...common} />
      <Composition id="Pause10m-Ch7" component={Ch7Comp} durationInFrames={DURATIONS[6]} {...common} />
      <Composition id="Pause10m-Ch8" component={Ch8Comp} durationInFrames={DURATIONS[7]} {...common} />

      {/* No Gravity 6-Minute Chapters & Short */}
      <Composition id="NoGravity-Ch1" component={GCh1Comp} durationInFrames={GRAVITY_DURATIONS[0]} {...common} />
      <Composition id="NoGravity-Ch2" component={GCh2Comp} durationInFrames={GRAVITY_DURATIONS[1]} {...common} />
      <Composition id="NoGravity-Ch3" component={GCh3Comp} durationInFrames={GRAVITY_DURATIONS[2]} {...common} />
      <Composition id="NoGravity-Ch4" component={GCh4Comp} durationInFrames={GRAVITY_DURATIONS[3]} {...common} />
      <Composition id="NoGravity-Ch5" component={GCh5Comp} durationInFrames={GRAVITY_DURATIONS[4]} {...common} />
      <Composition id="NoGravity-Ch6" component={GCh6Comp} durationInFrames={GRAVITY_DURATIONS[5]} {...common} />
      <Composition id="NoGravity-Short" component={NoGravityShort} durationInFrames={1290} {...common} />

      <Composition id="NoSun-Ch1" component={SCh1Comp} durationInFrames={SUN_DURATIONS[0]} {...common} />
      <Composition id="NoSun-Ch2" component={SCh2Comp} durationInFrames={SUN_DURATIONS[1]} {...common} />
      <Composition id="NoSun-Ch3" component={SCh3Comp} durationInFrames={SUN_DURATIONS[2]} {...common} />
      <Composition id="NoSun-Ch4" component={SCh4Comp} durationInFrames={SUN_DURATIONS[3]} {...common} />
      <Composition id="NoSun-Ch5" component={SCh5Comp} durationInFrames={SUN_DURATIONS[4]} {...common} />
      <Composition id="NoSun-Ch6" component={SCh6Comp} durationInFrames={SUN_DURATIONS[5]} {...common} />
      <Composition id="NoSun-Short" component={NoSunShort} durationInFrames={420} {...common} />

      <Composition id="BedRest-Ch1" component={BCh1Comp} durationInFrames={BEDREST_DURATIONS[0]} {...common} />
      <Composition id="BedRest-Ch2" component={BCh2Comp} durationInFrames={BEDREST_DURATIONS[1]} {...common} />
      <Composition id="BedRest-Ch3" component={BCh3Comp} durationInFrames={BEDREST_DURATIONS[2]} {...common} />
      <Composition id="BedRest-Ch4" component={BCh4Comp} durationInFrames={BEDREST_DURATIONS[3]} {...common} />
      <Composition id="BedRest-Ch5" component={BCh5Comp} durationInFrames={BEDREST_DURATIONS[4]} {...common} />
      <Composition id="BedRest-Ch6" component={BCh6Comp} durationInFrames={BEDREST_DURATIONS[5]} {...common} />
      <Composition id="BedRest-Short" component={BedRestShort} durationInFrames={420} {...common} />

      <Composition id="Ancient-Ch1" component={ACh1Comp} durationInFrames={ANCIENT_DURATIONS[0]} {...common} />
      <Composition id="Ancient-Ch2" component={ACh2Comp} durationInFrames={ANCIENT_DURATIONS[1]} {...common} />
      <Composition id="Ancient-Ch3" component={ACh3Comp} durationInFrames={ANCIENT_DURATIONS[2]} {...common} />
      <Composition id="Ancient-Ch4" component={ACh4Comp} durationInFrames={ANCIENT_DURATIONS[3]} {...common} />
      <Composition id="Ancient-Ch5" component={ACh5Comp} durationInFrames={ANCIENT_DURATIONS[4]} {...common} />
      <Composition id="Ancient-Ch6" component={ACh6Comp} durationInFrames={ANCIENT_DURATIONS[5]} {...common} />
      <Composition id="Ancient-Short" component={AncientShortComp} durationInFrames={420} {...common} />

      <Composition id="Quiet-Ch1" component={QCh1Comp} durationInFrames={QUIET_DURATIONS[0]} {...common} />
      <Composition id="Quiet-Ch2" component={QCh2Comp} durationInFrames={QUIET_DURATIONS[1]} {...common} />
      <Composition id="Quiet-Ch3" component={QCh3Comp} durationInFrames={QUIET_DURATIONS[2]} {...common} />
      <Composition id="Quiet-Ch4" component={QCh4Comp} durationInFrames={QUIET_DURATIONS[3]} {...common} />
      <Composition id="Quiet-Ch5" component={QCh5Comp} durationInFrames={QUIET_DURATIONS[4]} {...common} />
      <Composition id="Quiet-Ch6" component={QCh6Comp} durationInFrames={QUIET_DURATIONS[5]} {...common} />
      <Composition id="Quiet-Short" component={QuietRoomShortComp} durationInFrames={527} {...common} />
      <Composition id="Quiet-Main" component={QuietRoomMain} durationInFrames={TOTAL_QUIET_FRAMES} {...common} />

      {/* Living Shadow (Episode 9) Compositions */}
      <Composition id="Shadow-Ch1" component={LShCh1Comp} durationInFrames={SHADOW_DURATIONS[0]} {...common} />
      <Composition id="Shadow-Ch2" component={LShCh2Comp} durationInFrames={SHADOW_DURATIONS[1]} {...common} />
      <Composition id="Shadow-Ch3" component={LShCh3Comp} durationInFrames={SHADOW_DURATIONS[2]} {...common} />
      <Composition id="Shadow-Ch4" component={LShCh4Comp} durationInFrames={SHADOW_DURATIONS[3]} {...common} />
      <Composition id="Shadow-Ch5" component={LShCh5Comp} durationInFrames={SHADOW_DURATIONS[4]} {...common} />
      <Composition id="Shadow-Ch6" component={LShCh6Comp} durationInFrames={SHADOW_DURATIONS[5]} {...common} />
      <Composition id="Shadow-Short" component={LivingShadowShortComp} durationInFrames={680} {...common} />
      <Composition id="Shadow-Main" component={LivingShadowMain} durationInFrames={TOTAL_SHADOW_FRAMES} {...common} />

      {/* What If Water Disappeared (Episode 10) Compositions */}
      <Composition id="Water-Ch1" component={WCh1Comp} durationInFrames={WATER_DURATIONS[0]} {...common} />
      <Composition id="Water-Ch2" component={WCh2Comp} durationInFrames={WATER_DURATIONS[1]} {...common} />
      <Composition id="Water-Ch3" component={WCh3Comp} durationInFrames={WATER_DURATIONS[2]} {...common} />
      <Composition id="Water-Ch4" component={WCh4Comp} durationInFrames={WATER_DURATIONS[3]} {...common} />
      <Composition id="Water-Ch5" component={WCh5Comp} durationInFrames={WATER_DURATIONS[4]} {...common} />
      <Composition id="Water-Ch6" component={WCh6Comp} durationInFrames={WATER_DURATIONS[5]} {...common} />
      <Composition id="Water-Short" component={NoWaterShortComp} durationInFrames={SHORT_WATER_FRAMES} {...common} />
      <Composition id="Water-Main" component={NoWaterMain} durationInFrames={TOTAL_WATER_FRAMES} {...common} />

      {/* The Life of a Stickman (Emotional Short Film) Compositions */}
      <Composition id="Stickman-Ch1" component={StickmanCh1Comp} durationInFrames={STICKMAN_DURATIONS[0]} {...common} />
      <Composition id="Stickman-Ch2" component={StickmanCh2Comp} durationInFrames={STICKMAN_DURATIONS[1]} {...common} />
      <Composition id="Stickman-Ch3" component={StickmanCh3Comp} durationInFrames={STICKMAN_DURATIONS[2]} {...common} />
      <Composition id="Stickman-Ch4" component={StickmanCh4Comp} durationInFrames={STICKMAN_DURATIONS[3]} {...common} />
      <Composition id="Stickman-Ch5" component={StickmanCh5Comp} durationInFrames={STICKMAN_DURATIONS[4]} {...common} />
      <Composition id="Stickman-Short" component={StickmanLifeShortComp} durationInFrames={SHORT_STICKMAN_FRAMES} {...common} />
      <Composition id="Stickman-Main" component={StickmanLifeMain} durationInFrames={TOTAL_STICKMAN_FRAMES} {...common} />

      {/* Waiting at Platform 4 (Dog Short Film) Compositions */}
      <Composition id="Dog-Ch1" component={DogCh1Comp} durationInFrames={DOG_DURATIONS[0]} {...common} />
      <Composition id="Dog-Ch2" component={DogCh2Comp} durationInFrames={DOG_DURATIONS[1]} {...common} />
      <Composition id="Dog-Ch3" component={DogCh3Comp} durationInFrames={DOG_DURATIONS[2]} {...common} />
      <Composition id="Dog-Ch4" component={DogCh4Comp} durationInFrames={DOG_DURATIONS[3]} {...common} />
      <Composition id="Dog-Ch5" component={DogCh5Comp} durationInFrames={DOG_DURATIONS[4]} {...common} />
      <Composition id="Dog-Short" component={PlatformDogShortComp} durationInFrames={SHORT_DOG_FRAMES} {...common} />
      <Composition id="Dog-Main" component={PlatformDogMain} durationInFrames={TOTAL_DOG_FRAMES} {...common} />

      {/* DON'T WATCH THIS VIDEO (Curiosity / Stickman Comedy Episode) */}
      <Composition id="DontWatch-Ch1" component={DontWatchCh1Comp} durationInFrames={DONT_WATCH_DURATIONS[0]} {...common} />
      <Composition id="DontWatch-Ch2" component={DontWatchCh2Comp} durationInFrames={DONT_WATCH_DURATIONS[1]} {...common} />
      <Composition id="DontWatch-Ch3" component={DontWatchCh3Comp} durationInFrames={DONT_WATCH_DURATIONS[2]} {...common} />
      <Composition id="DontWatch-Ch4" component={DontWatchCh4Comp} durationInFrames={DONT_WATCH_DURATIONS[3]} {...common} />
      <Composition id="DontWatch-Short" component={DontWatchShortComp} durationInFrames={SHORT_DONT_WATCH_FRAMES} {...common} />
      <Composition id="DontWatch-Main" component={DontWatchMain} durationInFrames={TOTAL_DONT_WATCH_FRAMES} {...common} />

      {/* 1,000 OR 1? (Loyalty vs Temptation Episode) */}
      <Composition id="Thousand-Ch1" component={ThousandCh1Comp} durationInFrames={THOUSAND_DURATIONS[0]} {...common} />
      <Composition id="Thousand-Ch2" component={ThousandCh2Comp} durationInFrames={THOUSAND_DURATIONS[1]} {...common} />
      <Composition id="Thousand-Ch3" component={ThousandCh3Comp} durationInFrames={THOUSAND_DURATIONS[2]} {...common} />
      <Composition id="Thousand-Ch4" component={ThousandCh4Comp} durationInFrames={THOUSAND_DURATIONS[3]} {...common} />
      <Composition id="Thousand-Ch5" component={ThousandCh5Comp} durationInFrames={THOUSAND_DURATIONS[4]} {...common} />
      <Composition id="Thousand-Short" component={ThousandShortComp} durationInFrames={SHORT_THOUSAND_FRAMES} {...common} />
      <Composition id="Thousand-Main" component={ThousandMain} durationInFrames={TOTAL_THOUSAND_FRAMES} {...common} />

      {/* JAB AMMI PANKHA BAND KAR DEIN (Urdu Comedy Demo Episode) */}
      <Composition id="Fan-Ch1" component={FanCh1Comp} durationInFrames={FAN_DURATIONS[0]} {...common} />
      <Composition id="Fan-Ch2" component={FanCh2Comp} durationInFrames={FAN_DURATIONS[1]} {...common} />
      <Composition id="Fan-Ch3" component={FanCh3Comp} durationInFrames={FAN_DURATIONS[2]} {...common} />
      <Composition id="Fan-Short" component={FanShortComp} durationInFrames={SHORT_FAN_FRAMES} {...common} />
      <Composition id="Fan-Main" component={FanMain} durationInFrames={TOTAL_FAN_FRAMES} {...common} />

      {/* WHAT IF YOU ONLY HAD 1,000 WORDS LEFT? (Philosophical Episode) */}
      <Composition id="Words-Ch1" component={WordsCh1Comp} durationInFrames={THOUSAND_WORDS_DURATIONS[0]} {...common} />
      <Composition id="Words-Ch2" component={WordsCh2Comp} durationInFrames={THOUSAND_WORDS_DURATIONS[1]} {...common} />
      <Composition id="Words-Ch3" component={WordsCh3Comp} durationInFrames={THOUSAND_WORDS_DURATIONS[2]} {...common} />
      <Composition id="Words-Ch4" component={WordsCh4Comp} durationInFrames={THOUSAND_WORDS_DURATIONS[3]} {...common} />
      <Composition id="Words-Ch5" component={WordsCh5Comp} durationInFrames={THOUSAND_WORDS_DURATIONS[4]} {...common} />
      <Composition id="Words-Short" component={WordsShortComp} durationInFrames={SHORT_WORDS_FRAMES} {...common} />
      <Composition id="Words-Main" component={WordsMain} durationInFrames={TOTAL_THOUSAND_WORDS_FRAMES} {...common} />

      <Composition id="Cast" component={CastSheet} durationInFrames={1} {...common} />
    </>
  );
};
