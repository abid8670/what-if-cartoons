# 📜 WHAT IF ANIMATION STUDIO — MASTER PRODUCTION RULES & SYSTEM ARCHITECTURE
> **IMPORTANT FOR ALL FUTURE AI AGENTS & CODING SESSIONS:**  
> Read this file before generating any video, script, animation, thumbnail, or YouTube upload. These rules represent all hard requirements, bug fixes, user preferences, and production standards established for this project.

---

## 🏆 1. GOLDEN RULES & NON-NEGOTIABLES

1. **NO OPENCODE:** Antigravity / Gemini handles everything directly using standard Python scripts, Node.js, Remotion, and FFmpeg. Never call or invoke `opencode`.
2. **100% FREE VOICE GENERATION:** Never use ElevenLabs or paid voice APIs. Always use `edge-tts` with high-quality free neural voices (default: `en-US-ChristopherNeural` or `en-US-GuyNeural`). Zero credits required.
3. **TEMP STORAGE ON D:\temp (CRITICAL):**
   - Drive `C:` has critically low free space (< 1.5 GB).
   - Drive `D:` has abundant space (35+ GB).
   - Every Remotion render and FFmpeg command **MUST** run with environment variables:  
     `env = {**os.environ, 'TEMP': r'D:\temp', 'TMP': r'D:\temp'}`.
   - `remotion.config.ts` must use `jpeg` format with quality `90` (never raw uncompressed PNGs).
4. **REMOTION COMPOSITION IDS:** Remotion strictly forbids underscores (`_`) in composition IDs. Always use hyphens (`-`) (e.g., `NoSun-Ch1`, `NoSun-Short`).
5. **WINDOWS CONSOLE UTF-8 (NO CP1252 CRASH):** Every Python script must include at line 1-2:
   ```python
   import sys
   sys.stdout.reconfigure(encoding='utf-8')
   ```
   This prevents `UnicodeEncodeError` when printing emojis (`🌍`, `☀️`, `⏱️`, `😱`).

---

## 🎬 2. VIDEO EDITING & DYNAMIC PACING RULES

### ⚠️ THE 3-TO-5 SECOND SCENE CHANGE RULE (USER PRIORITY #1):
* **The Problem:** In earlier episodes, scenes remained static for 30–50 seconds, killing viewer retention.
* **The Mandate:** **The visual scene, camera angle, or graphic MUST change every 3 to 5 seconds!** No single visual may stay on screen for more than 5 seconds.
* **How It Is Implemented (Audio-First Synchronized Workflow):**
  1. **Generate Audio First:** Generate voiceover via `edge-tts`.
  2. **Extract Word-Level Timestamps:** Pass `boundary="WordBoundary"` to `edge_tts.Communicate`. Capture exact fractional-second timestamps for every word/sentence.
  3. **Segment Script into 3–5s Chunks:** Split narration into small 3 to 5 second beats.
  4. **Dedicated Visual per Beat:** For every beat, display a fresh, relevant visual illustrating the exact spoken words (e.g. Beat 1: cozy rain window -> Beat 2: flooded street -> Beat 3: cracking dam -> Beat 4: subway waterfall -> Beat 5: blackout).
  5. **Sequence via Remotion:** Cut cleanly between shots using Remotion `Series.Sequence` or shot state machines.

### Video Durations:
* **Main Explainer Video:** Between **3 minutes to 5 minutes** (exact duration specified by the user per episode).
* **Mobile Short:** Fast-paced, high retention (typically **14 seconds** or under 60 seconds) rendered in vertical **9:16 (1080×1920)** with ambient background blur and bold headline captions.
* **Animated Outro:** The end of every main video **MUST** feature an animated **Subscribe button & Ringing Notification Bell** call-to-action in English with waving characters.

---

## 🔍 2B. GRAPHIC ACCURACY & ZERO ANACHRONISMS (USER MANDATE)

> **CRITICAL RULE FOR ALL AI AGENTS:**  
> The visual illustration on screen **MUST EXACTLY MATCH** the spoken voiceover. Viewers immediately notice and get confused if spoken words contradict graphics.

1. **Biological & Anatomical Fidelity (No Blob Animals):**
   - **Saber-Toothed Cat (Smilodon):** Must have quadruped feline anatomy, arched predatory spine, feline claws, triangular cat ears, and long curved backward-arching ivory saber daggers. **NEVER draw a brown oval that looks like a walrus or seal!**
   - **Cave Art (Steppe Bison & Cave Lions):** Must feature high dorsal shoulder humps, cloven hooves, curved horns, downward bovine bearded heads, and authentic Chauvet ochre/charcoal silhouettes. **NEVER draw a brown circle with stick legs that looks like a bug or cockroach!**
2. **Prehistoric Cuisine (Zero Modern Food Anachronisms):**
   - Prehistoric food must strictly be fire-charred whole meat on genuine white ivory joint bones (mammoth ribs, drumsticks) or wild foraged berries.
   - **NEVER draw modern processed foods** (hamburgers, sandwiches, hotdogs, bread buns) in prehistoric or ancient eras!
3. **Archaeological Authenticity (Ancient Gaming & Artifacts):**
   - Prehistoric dice must strictly be organic, calcified animal talus/astragaloi knucklebones with 4 asymmetrical natural anatomical faces.
   - **NEVER draw modern 6-sided cubic dice with dots/pips** when the script talks about ancient knucklebones!
4. **Visual-to-Audio Synchronous Verification:**
   - Before compiling any episode, verify that every 3-5 second scene graphic literally portrays the specific entity mentioned in the voiceover.

---

## 🧠 2C. COMMON SENSE STAGING & PHYSICAL REALISM (NON-NEGOTIABLE)

> **CRITICAL RULE FOR ALL SCENE COMPOSITION & ANIMATION:**  
> Always respect common sense physics, human staging, and complete environmental art. Never create absurd physical positioning or leave background voids.

1. **Physical Grounding & Logical Placement (Who Walks on a Sink?!):**
   - **Characters MUST stand on the floor plane.**
   - **NEVER put a character's feet inside a washbasin, on top of a kitchen sink, on a stove, or on a countertop!**
   - When interacting with a kitchen sink, counter, or desk:
     - **Option A (Side View):** Place the character standing firmly on the floor plane beside the counter (`x=420, y=720`), with their feet on the ground and arm reaching onto the counter to turn the faucet.
     - **Option B (Front Medium Shot):** If looking from the front, crop at waist/chest height with the counter in front, so the character's legs are naturally occluded behind the counter cabinetry.
2. **Complete Living Environments (Zero Blank/Sparse Geometry):**
   - **Never draw a lone shape on a blank dark void** (e.g. an empty pool drawn as a single polygon on a blank `#1E293B` screen).
   - If a scene depicts a swimming pool, the background **MUST** be a complete, lush suburban backyard: patio tiles, grass lawn, fence, trees, sun loungers, and sky.
   - If a scene depicts a shower, it **MUST** be a complete modern bathroom: tiles, glass stall, showerhead, shampoo shelf, and mirror.
   - If a scene depicts a street, it **MUST** show sidewalks, road perspective, buildings, and sky.
3. **Scale & Spatial Awareness:**
   - Tables and counters reach character waist height (~y+40 to y+60 from hips).
   - Doors are noticeably taller than characters.
   - Cars, furniture, and appliances are scaled proportionally.
4. **Contact Ground Shadows:**
   - Every grounded character or prop must have a soft elliptical contact shadow (`opacity: 0.3 to 0.4`) cast directly on the floor beneath their feet so they feel anchored to the physical world.

---

## 🎥 2D. CINEMATIC VISUAL FINISHING (THE "ONE MINUTE AHEAD" QUALITY STANDARD FOR LONG VIDEOS)

> **USER MANDATE:**  
> All full-length videos (3 to 10 minutes) MUST maintain the exact same premium cinematic quality, lighting, depth, and texture established in the reference episode *"What If You Could See 1 Minute Ahead?"*.

### The 5 Non-Negotiable Visual Pillars for Long Episodes:
1. **Master Cinematic Post-Processing (`Grade`):**
   - Every long video chapter wrapper **MUST** include `<Grade f={f} grain={true} vignette={true} />`.
   - **Film Grain on Twos:** SVG `feTurbulence` with `seed={Math.floor(f / 2) % 97}`. Strips away sterile vector looks and gives a rich, organic cinematic finish.
   - **Radial Vignette:** Darkens outer screen boundaries (`epVig`), pulling viewer focus directly into center-stage action.
2. **Global Lighting Kit (`KitDefs` & `SetDefs`):**
   - Every chapter root SVG **MUST** mount `<KitDefs />` and `<SetDefs />`.
   - Stickman heroes must always have active directional rim lights:
     - Golden Sunset / Warm Fire: `rimId="rimR"` or `rimId="rimL"`.
     - Night / Screens / Ice Age: `rimId="rimBlue"` or `rimId="rimBlueL"`.
     - Danger / Warning: `rimId="rimRed"`.
   - Soft ground contact shadows: `shadow={0.3}` to `shadow={0.5}` under characters and props.
3. **3-Layer Depth of Field (DoF):**
   - **Foreground Layer:** Silhouetted, out-of-focus elements (`<Foreground blur={10}>` or `blur={16}`) passing in front of the lens.
   - **Midground Layer:** Crisp, razor-sharp stickman acting with facial reactions.
   - **Background Layer:** Softly blurred architectural panels, landscape gradients, and warm window/sun bokeh circles (`filter="url(#blur16)"`).
4. **Dynamic Camera Framing & Motion (`camT`):**
   - Do NOT keep a static wide camera for the entire video. Alternate every 3–5 seconds between:
     - **Extreme Close-Up (ECU):** `scale: 3.5 - 4.1` with subtle creep-in for emotional/shock beats.
     - **Macro Insert:** Low-angle focus on hands, dice, mugs, or props.
     - **Over-the-Shoulder:** Depth-layered conversational or antagonist framing.
     - **Wide Establishing:** Sweeping environmental reveals.
5. **Living Character Rigs & Eased Physics:**
   - Keyframed pose transitions with anticipation squash (`squash: 0.13`), head tilts, and easing (`easeOut`, `easeIn`, `settle`).
   - Dynamic animated facial expression overlays (`FaceReaction`: panic, burnout, happy, dizzy, smug, angry, awe).

---

## 🎨 3. THUMBNAIL PACKAGING STANDARDS (THINK BEYOND STYLE)

* **Reference Channel:** *Think Beyond* (110k+ views in 24 hours).
* **Illustration Style:**
  - One expressive, colorful cartoon scene telling an immediate visual story.
  - Characters with exaggerated, funny emotions (blush, dizzy spirals, heart eyes, sweat drops, wide-eyed comic shock).
* **TEXT RULE (STRICT): ONLY 2 TO 3 WORDS!**
  - **NEVER** write long sentences, paragraphs, or cluttered warning boxes on thumbnails.
  - Use **exactly 2 or 3 high-curiosity, punchy words** (e.g. `ANCIENT PLEASURE`, `30 DAYS IN BED`, `THE WHITE ROOM`, `ENDLESS RAIN`).
  - **Typography:** Bold `Impact` font (`C:\Windows\Fonts\impact.ttf`), bright yellow/gold fill (`#FFDE00` / `#FACC15`), thick 14–16px black stroke (`#000000`), subtle drop shadow.
  - Clean placement at top or bottom center, leaving the cartoon character uncluttered.
* **Thumbnail Files:**
  - Full Video: 1920×1080 landscape (`thumbnail.png`).
  - Mobile Short: 1080×1920 vertical (`thumbnail_short.png`).
  - Keep backed-up copies (`thumbnail_art.png`, `thumbnail_short_art.png`) so FFmpeg never overwrites custom designs.

---

## 🔊 4. AUDIO MASTERING & DUAL VOICE SOUND DESIGN

1. **Dual Voice Architecture (Character & Topic Responsive):**
   - **Male Narrator (Default):** `en-US-ChristopherNeural` (Rate: `+2%` to `+4%`). Deep, resonant, authoritative scientific documentary style (classic Kurzgesagt/What-If feel). Ideal for cosmic, disaster, biological, and thought experiment episodes.
   - **Female Narrator:** `en-US-AvaNeural` (Rate: `+2%` to `+4%`). Bright, energetic, expressive cartoon style. Ideal for character-driven, quirky, domestic, or comedic what-if adventures.
2. **Female Voice Broadcast Boost Chain (MANDATORY for Ava):**
   - Female voices naturally have higher frequencies and less sub-bass body. Additionally, raw uncompressed voices get masked by background tracks.
   - Whenever `en-US-AvaNeural` is used, **MUST** apply the 4-part Broadcast Vocal Chain:
     ```python
     # 1. Warmth EQ: +4dB at 200 Hz (adds rich body, removes thinness)
     # 2. Presence EQ: +3dB at 4,000 Hz (ensures speech cut-through)
     # 3. Dynamic Compression: threshold=-18dB, ratio=3.5:1, attack=15ms, release=120ms, makeup=+5dB
     # 4. Loudness Normalization: target integrated loudness -14.0 LUFS
     vocal_filter = "bass=g=4:f=200,treble=g=3:f=4000,acompressor=threshold=-18dB:ratio=3.5:attack=15:release=120:makeup=5"
     ```
   - This boosts mean dialogue loudness by **+6.5 dB**, guaranteeing the voice is crystal clear and punchy on mobile speakers.
3. **FFmpeg Multi-Track Mixing Rules (Crucial Bug Prevention):**
   - **NEVER** use default `amix=inputs=N` without level controls! By default, FFmpeg's `amix` scales all inputs down by `1/N` (e.g. 8 inputs divides voice level by 8, causing a 12 dB volume collapse).
   - In any mix, the voice **MUST** have volume `1.0`, background music **MUST** be ducked to `0.03 - 0.05`, and SFX kept between `0.20 - 0.35`.
4. **Mastering Standard (EBU R128):**
   - Integrated Loudness: **-14.0 LUFS** (YouTube optimal target).
   - True Peak: **-1.5 dBTP**.
   - Loudness Range: **11.0 LRA**.
   - 2-pass FFmpeg loudnorm filter:
     ```python
     I, TP, LRA = -14.0, -1.5, 11
     filt = f"loudnorm=I={I}:TP={TP}:LRA={LRA}:measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true"
     ```

---

## 📺 5. YOUTUBE UPLOAD & CHANNEL SPECIFICATIONS

### YouTube Channel:
* **Current YouTube Title:** `What-eif` (Typo on YouTube to be updated).
* **Current Handle:** `@what-eif`
* **Target / Brand Name:** `What If Theory` / `What If`
* **Category ID:** `27` (Education).
* **Privacy:** `public`.

### YouTube Daily Upload Limit (Quota):
* YouTube imposes a strict daily cap (typically 6 to 10 video uploads per 24 hours).
* When `uploadLimitExceeded` (HTTP 400) occurs, the final mastered 1080p MP4 is preserved safely on disk at `D:\AI-Cartoons\what-if-studio\out\<slug>\<slug>_main_final.mp4` ready for upload once the 24-hour quota window resets.

### OAuth & API Authentication:
* **Token file:** `D:\AI-Cartoons\youtube\token.json`
* **Client secret:** `D:\AI-Cartoons\youtube\client_secret.json`
* **Automatic Token Refresh:**
  ```python
  from google.oauth2.credentials import Credentials
  from google.auth.transport.requests import Request
  if creds.expired and creds.refresh_token:
      creds.refresh(Request())
      with open(TOKEN_FILE, "w", encoding="utf-8") as f:
          f.write(creds.to_json())
  ```
* **Safe Thumbnail Setting:** Wrap `youtube.thumbnails().set(...)` in `try...except` so API quota/rate warnings never crash video uploads.

### SEO Best Practices:
* **Title:** Viral curiosity hook + Topic + Emoji (e.g. `What If Earth Lost Gravity for 60 Seconds? 🌍 (The Terrifying Truth)`).
* **Description:** Engaging storytelling intro, full chapter timestamps (`0:00 - ...`), scientific breakdown bullets, subscribe prompt, and viral hashtags.
* **Tags:** 20–25 comma-separated high-intent search tags.

---

## 🗂️ 6. FILE DIRECTORY STRUCTURE

```
D:\AI-Cartoons\
├── PIPELINE_RULES.md              # THIS MASTER GUIDE
├── README.md                      # Episode table & project overview
├── check_status.py                # Fast check for rendered files & temp folders
├── what-if-studio/
│   ├── remotion.config.ts         # JPEG 90, overwrite output
│   ├── public/
│   │   ├── no-gravity/            # Episode 4 assets & audio
│   │   └── no-sun/                # Episode 5 assets & audio
│   ├── src/
│   │   ├── Root.tsx               # Compositions registry
│   │   ├── engine/                # Core cartoon engine (Hero, Looks, Poses)
│   │   └── episodes/
│   │       ├── no-gravity/        # Gravity episode code
│   │       └── no-sun/            # Sun episode code
│   └── out/
│       ├── no-gravity/            # Episode 4 MP4s & thumbnails
│       └── no-sun/                # Episode 5 MP4s & thumbnails
└── youtube/
    ├── token.json                 # Active OAuth credentials
    ├── client_secret.json         # Google Cloud OAuth app secret
    ├── upload.py                  # Core resumable uploader
    └── meta_*.json                # Upload metadata definitions
```

---

## 🎬 7. PUBLISHED EPISODES LOG

| Ep | Title | Duration | Type | Live YouTube URL |
|---|---|---|---|---|
| **1** | What If You Could See 60 Seconds Ahead? | 21s | Short | https://youtu.be/sXBCKgzT9iI |
| **2** | What If You Could Pause Everyone But You? ⏱️ | 11m 35s | Full | https://youtu.be/JjkD5aBAtmU |
| **2S**| What If You Could Pause Everyone But You? ⏱️ | 44s | Short (9:16) | https://youtube.com/shorts/uE9Sihs-SHc |
| **3** | What If You Could Copy and Paste Anything? 🍪 | 23s | Short | https://youtu.be/-VTonzzFAYI |
| **4** | What If Earth Lost Gravity for 60 Seconds? 🌍 | 5m 19s | Full | https://youtu.be/CrDEJ1P7REY |
| **4S**| What If Earth Lost Gravity for 60 Seconds? 🌍 | 43s | Short (9:16) | https://youtube.com/shorts/9-afD5REO4Q |
| **5** | What If the Sun Disappeared for 7 Days? ☀️ | 4m 46s | Full | https://youtu.be/glf6Ke_jwME |
| **5S**| What If the Sun Disappeared for 7 Days? ☀️ | 14s | Short (9:16) | https://youtube.com/shorts/BQ9CjoUvHlU |
| **6** | What If You Never Left Your Bed for 30 Days? 🛏️ | 3m 42s | Full | https://youtu.be/sNLHyLtjzX4 |
| **6S**| What If You Stayed in Bed for 30 Days? 🛏️ | 14s | Short (9:16) | https://youtube.com/shorts/MubyT_l4Tf4 |
| **7** | What Did Ancient Humans Do For Pleasure? 🏺 | 4m 28s | Full | https://youtu.be/lFA3bdjwXqk |
| **7S**| What Did Ancient Humans Do For Pleasure? 🏺 | 14s | Short (9:16) | https://youtube.com/shorts/14cQCn1QqJk |

