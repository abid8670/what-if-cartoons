---
name: what-if-animation
description: Comprehensive production pipeline for high-retention "What-If" animated films and viral Shorts. Features the signature Pip stickman in mustard-yellow hoodie (#F59E0B) with warm peach rim light (#FFAA55), dynamic 3-5 second scene cuts, 100% free neural voiceover (Edge-TTS), Remotion & SVG vector animations, broadcast -14 LUFS mastering, mobile 9:16 Short reformatting, Iflord-style clickbait thumbnails, and mandatory interactive end-card decision cards (Option A vs Option B) driving community engagement for the YouTube channel What-eif.
---

# 🎬 What-If Animation Production Skill

A complete, battle-tested end-to-end animation studio for producing viral "What-If" philosophical and psychological animated films (2 to 5 minutes) and vertical YouTube Shorts (15 to 45 seconds).

Every frame is rendered in high-definition SVG through Remotion, voiced with free high-fidelity neural narration (Edge-TTS), sound-designed to broadcast standard `-14.0 LUFS`, and paired with high-CTR Iflord-style thumbnails.

---

## 🏆 Core Identity & Hard Constraints

1. **Channel Name:** Strictly **What-eif** (never "Studio" or generic variants).
2. **Hero Rig Standard (Pip):**
   - **Hoodie:** Warm mustard yellow (`#F59E0B` body, `#D97706` shading, `#B45309` shadows).
   - **Drawstrings:** Crisp white (`#FFFFFF`, stroke `#CBD5E1`).
   - **Head:** Dark silhouette (`#1C1A24`) with warm peach rim glow (`#FFAA55`, width 2.5–3.5px).
   - **Facial Features:** Pure white slit/arc eyes (`#FFFFFF`) and expressive mouth paths.
3. **The 3-to-5 Second Pacing Rule (Crucial for Retention):**
   - No camera angle, visual scene, or character composition stays static for more than 5 seconds.
   - Pacing is driven by word-boundary audio timestamps: every 3–5 seconds triggers a fresh visual or dramatic cut.
4. **Mandatory Interactive End Card (Chapter 5):**
   - Every full film and Short MUST conclude with an interactive dilemma question.
   - Pip transitions to screen-left (`x=360`), posing and gesturing toward the question card on screen-right (`x=1140, y=500`).
   - Two distinct choices: **Option A** vs **Option B**, prompting viewers to comment below.
5. **Zero-Credit Neural Audio (100% Free):**
   - No paid ElevenLabs credits needed. Uses `edge-tts` with `en-US-GuyNeural` or `en-US-ChristopherNeural` at `+6%` speed.
   - Mastered via FFmpeg filter `loudnorm` to exact `-14.0 LUFS` integrated loudness and `-1.5 dBTP` true peak.
6. **Disk & Temp Memory Management:**
   - On Windows environments with constrained `C:` drives, Remotion and FFmpeg MUST write temporary frame caches to `D:\temp` via `TEMP` and `TMP` environment variables.
   - Composition IDs must strictly use hyphens (`-`), never underscores (`_`).

---

## 📐 Episode Architecture (The 5-Beat Film Structure)

Every long-form episode (2:00 to 4:00 minutes) is structured across 5 distinct chapters:

| Chapter | Purpose | Visual Setup & Energy |
|---|---|---|
| **Ch 1: The Inciting Incident** | Hook the audience in 5 seconds. Establish the supernatural or existential "What If" rule. | Wide establishing shot, sudden environmental shift, Pip's initial shock. |
| **Ch 2: The Golden Phase / Greed** | The protagonist abuses or exploits the power (wealth, invincibility, total freedom). | Vibrant lighting, luxury environments, rapid comedic montage. |
| **Ch 3: The Darkening / Consequence** | The unforeseen consequence emerges (infrastructure collapse, organ failure, madness). | Cold color temperature, desaturated hues, heavy shadows, tension drone. |
| **Ch 4: The Fracture** | The psychological breaking point. Protagonist realizes the price of their decision. | Dynamic close-ups, camera shakes, hallucination overlays, distorted audio. |
| **Ch 5: The Climax & Interactive Choice** | High-stakes dilemma and direct audience engagement. | Pip moves to screen-left (`x=360`), interactive dilemma card on screen-right (`Option A vs Option B`). |

---

## 🛠️ Production Pipeline Steps

### Step 1: Scripting & Concept Validation
* Validate premise: must explore an existential question (*"What If Everyone Vanished?"*, *"What If You Had The Million Dollar Button?"*, *"What If You Were Immortal?"*).
* Script length: 320 to 450 words split cleanly into 5 narrative chapters + 1 punchy 50-word Short script.
* Formulate two high-stakes, morally polarized dilemma options (A vs B) for the ending.

### Step 2: Audio Synthesis & Word Boundaries
* Generate narration via `edge-tts` with word boundaries:
  ```python
  import edge_tts
  communicate = edge_tts.Communicate(text, voice="en-US-GuyNeural", rate="+6%")
  ```
* Extract JSON timestamps for audio-visual syncing.
* Mix background music and cinematic sound effects (whooshes, risers, heartbeats, ambient beds).

### Step 3: SVG Scene & Remotion Chapter Assembly
* Each chapter is an independent Remotion component wrapped in `<ChapterWrap>`:
  ```tsx
  <AbsoluteFill style={{ backgroundColor: '#0B0F19' }}>
    <svg viewBox="0 0 1920 1080" width="100%" height="100%">
      <KitDefs />
      <SetDefs />
      {/* Dynamic Background */}
      {/* Props & Environmental Elements */}
      {/* Pip Rig with pose & expression states */}
      <Grade f={frame} grain={true} vignette={true} />
    </svg>
  </AbsoluteFill>
  ```

### Step 4: Multi-Process Rendering
* Render each chapter concurrently to `D:\temp`:
  ```bash
  npx remotion render src/index.ts <Episode>-Ch1 out/<slug>/ch_1.mp4 --jpeg-quality=90
  ```
* Concatenate chapters using FFmpeg concat protocol without re-encoding video stream.
* Apply `-14.0 LUFS` loudness normalization to final master.

### Step 5: Vertical Short Production (9:16 Mobile)
* Crop/scale master video to 1080×1920 with background ambient blur.
* Add high-contrast upper text badge (`(A or B)`), dynamic subtitles, and bottom pinned dilemma card.

### Step 6: Viral Clickbait Thumbnails (Iflord Style)
* 1280×720 master resolution with 3-layer depth:
  1. **Background:** Deep dark atmosphere with heavy radial vignette.
  2. **Character:** High-contrast Pip pose with peach/red edge glow.
  3. **Typography:** Huge, bold, 2–3 word impact hook (e.g. `ALL GONE.`, `PRESS IT?`) with 12px outer stroke and drop glow.

### Step 7: YouTube Publishing & Metadata Automation
* Push video with automated OAuth token via YouTube Data API v3.
* Rich metadata template:
  - Viral clickbait title with topic emoji.
  - Comprehensive dilemma description highlighting Option A vs Option B.
  - Exact chapter timestamps for high audience retention.
  - Targeted sci-fi and animation tags.

---

## 📚 References & File Directory Guide

- `references/rules.md`: Complete master production rules, physical staging standards, and anti-anachronism mandates.
- `references/look.md`: Visual grading, color palettes, lighting gradients, and camera framing.
- `references/formula.md`: Narrative structure, psychological pacing, and hook formulas.
- `references/sound.md`: Audio mastering, LUFS targets, and sound design layers.
- `scripts/`: Production scripts for Edge voice synthesis, audio mixing, rendering, and Shorts generation.
