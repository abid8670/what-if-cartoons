# What-If Animation: Production Studio Skill for Antigravity & Claude

Produce viral, broadcast-quality **"What-If"** philosophical and psychological animated films (2 to 5 minutes) and vertical YouTube Shorts (15 to 45 seconds).

Powered by **Remotion**, **SVG code rigs**, **Edge-TTS (100% free zero-credit neural voice)**, and automated **YouTube Data API v3** publishing for the channel **What-eif**.

---

## 🌟 Key Highlights & Enhancements

- 🎨 **Original Hero Rig (Pip):** Signature mustard-yellow hoodie (`#F59E0B`), white drawstrings, dark silhouette head (`#1C1A24`) with warm peach rim glow (`#FFAA55`), and slit eyes/mouth.
- ⏱️ **The 3-to-5 Second Pacing Rule:** Guaranteed high viewer retention — no static shot exceeds 5 seconds. Every scene transitions synchronously with word-boundary timestamps.
- 🗣️ **100% Free Neural Voice (Edge-TTS):** Zero ElevenLabs credits required. High-clarity `en-US-GuyNeural` narration mastered to broadcast standard `-14.0 LUFS` and `-1.5 dBTP`.
- ❓ **Mandatory Interactive Choice End-Card:** Chapter 5 features Pip gesturing toward an on-screen dilemma card (**Option A vs Option B**), maximizing YouTube comments and community engagement.
- 📱 **Automated 9:16 Shorts Generation:** Instant vertical reformatting with centered action, dynamic subtitle badges, and pinned comment prompts.
- 🖼️ **Iflord-Style Clickbait Thumbnails:** High-contrast 1280×720 thumbnails with bold 2–3 word glowing impact typography, atmospheric lighting, and expressive Pip poses.
- 🚀 **Automated YouTube Upload & SEO:** One-click OAuth publishing with rich descriptions, timestamps, and targeted tags.

---

## 📁 Repository Structure

```
what-if-animation/
├── SKILL.md                 # Antigravity & Claude Skill definition
├── README.md                # Quickstart documentation
├── references/
│   ├── rules.md             # Master production rules & anti-anachronism mandates
│   ├── formula.md           # 5-beat philosophical narrative formula
│   ├── look.md              # Cinematic grading, lighting, and camera framing
│   └── sound.md             # Audio mastering and LUFS loudness specs
├── scripts/
│   ├── edge_voice.py        # Free neural voice synthesis with word boundaries
│   ├── master.py            # Chapter concat and -14 LUFS loudness mastering
│   ├── plan.py              # Shot list and pacing analyzer
│   └── sfx.py               # Sound design and ambience generator
└── studio/                  # Remotion engine and reusable SVG components
    ├── src/engine/          # Rig, lighting, sets, room kit, and grading
    └── src/episodes/        # Complete episode compositions
```

---

## 🚀 Quick Setup

### 1. Requirements
- Node.js 18+
- Python 3.9+ with `edge-tts`, `numpy`, `Pillow`
- FFmpeg and FFprobe on your PATH

### 2. Studio Installation
```bash
git clone https://github.com/abid8670/what-if-animation.git
cd what-if-animation/studio
npm install
```

### 3. Rendering an Episode
```bash
# Render all 5 chapters to temporary scratch storage (D:\temp)
npx remotion render src/index.ts Vanished-Ch1 out/vanished/ch_1.mp4 --jpeg-quality=90
```

---

## 📜 License
MIT License. Created by [Abid Iqbal](https://github.com/abid8670).
