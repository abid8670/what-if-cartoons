# What If Cartoons — Free AI Animation Studio

Make stick-figure "What If" cartoons (the viral YouTube style) for **$0**, with no Claude subscription.

You give one line — *"What if you could see one minute ahead?"* — and get a finished 15–25 second animated episode: script, voice, storyboard, animation, sound, mastered to -14 LUFS. Every frame is drawn in code (SVG + Remotion), voiced by ElevenLabs. No image model, no video model, no drawing.

Built on the free [What If animation skill](https://github.com/kelano86/what-if-animation) (MIT licensed) by [FreshStack](https://freshstack.ai).

## What you need

| Tool | Why | Cost |
|---|---|---|
| [Node.js](https://nodejs.org/) 18+ | Runs Remotion (renders the video) | Free |
| [Python](https://www.python.org/) 3.9+ with `numpy` + `Pillow` | Runs the skill's helper scripts | Free |
| [FFmpeg](https://ffmpeg.org/) (with `ffprobe`) | Audio/video handling, loudness mastering | Free |
| [OpenCode](https://opencode.ai/) | Free, open-source coding agent (like Claude Code) | Free |
| GLM-5.3-Flash Free (inside OpenCode) | The model that does the thinking | Free, for a limited time |
| [ElevenLabs](https://elevenlabs.io/) API key | Voice + sound effects (10,000 free credits/month) | Free tier |
| OpenCode account | Free API key at https://opencode.ai/auth | Free |

## Quick start

### 1. Install the tools

**Windows (PowerShell):**
```powershell
winget install OpenJS.NodeJS.LTS
winget install Python.Python.3.12
winget install Gyan.FFmpeg
pip install numpy pillow
npm install -g opencode-ai
```

**Mac:**
```bash
brew install node python ffmpeg
pip install numpy pillow
npm install -g opencode-ai
```

### 2. Set up the skill

```powershell
mkdir what-if; cd what-if
git clone https://github.com/kelano86/what-if-animation .claude/skills/what-if-animation
mkdir .opencode/commands
copy .claude/skills/what-if-animation/opencode/commands/what-if.md .opencode/commands/
```

Mac/Linux:
```bash
mkdir what-if && cd what-if
git clone https://github.com/kelano86/what-if-animation .claude/skills/what-if-animation
mkdir -p .opencode/commands && cp .claude/skills/what-if-animation/opencode/commands/what-if.md .opencode/commands/
```

### 3. Add your API keys

Create a `.env` file in the same folder:
```
ELEVENLABS_API_KEY=your-elevenlabs-key
```

Then log in to OpenCode (free account):
```bash
opencode providers login --provider opencode
# paste your key from https://opencode.ai/auth
```

### 4. Run OpenCode (from inside the folder!)

```bash
cd what-if   # always start from inside the folder
opencode
```

Inside OpenCode:
1. `/models` → pick **GLM-5.3-Flash Free**
2. Press `Ctrl+T` until reasoning level reads **high**
3. `/what-if What if you could see one minute ahead?`
4. Leave it running (~28 min). Output lands in `out/<slug>/<slug>-final.mp4`

> ⚠️ OpenCode only sees skills in the folder you open it in. Start it from anywhere else and the skill won't be there.

## Tips (from the video)

- **One session per episode.** An episode can fill most of the model's 200K context — start fresh for the next one.
- **Search YouTube for your idea yourself.** The free model's search can miss episodes that already exist.
- **Check the fact.** Every episode has one real, sourced fact — open its source before you post.
- **Give notes in plain words.** e.g. *"the ball in shot three is covering his face"* — it fixes that shot and re-renders.
- **Custom heroes are just code.** Describe a character and it draws a cast sheet, then swaps it in with the same voice/sound (0 extra ElevenLabs credits).

## Is the free model as good as Claude Opus?

Close enough that it's hard to tell them apart. Both wrote, voiced, storyboarded, checked, animated and mixed a finished episode on their first render. Two real differences:
- Opus found existing "What If" channels and changed its idea; the free model's search missed them.
- The free model took several tries to get the sound mix right (both came out at the same loudness).

**So:** use the free model to *run* skills, and Claude (paid) to *build* them.

## Project structure

```
what-if/
├── .claude/skills/what-if-animation/   # the skill (cloned)
│   ├── SKILL.md                        # pipeline the AI follows
│   ├── references/                     # formula, look, sound, traps
│   ├── scripts/                        # voice, plan, stills, board, sfx, master
│   └── studio/                         # Remotion project (copied to what-if-studio/ on first run)
├── .opencode/commands/what-if.md       # /what-if command for OpenCode
├── what-if-studio/                     # Remotion studio (engine + episodes)
├── .env                                # ELEVENLABS_API_KEY (not committed)
└── out/                                # finished episodes land here
```

## Links

- Skill repo: https://github.com/kelano86/what-if-animation
- Companion guide: https://www.freshstack.ai/resources/free-ai-animation
- Claude version guide: https://www.freshstack.ai/resources/claude-2d-animation
- Tool Reel System (Instagram reels skills): https://github.com/kelano86/tool-reel-system
- Baptiste O'Donovan on YouTube: https://www.youtube.com/@baptisteodonovan

## License

The skill code is free to use, change and share. Remotion is free for individuals and companies of up to 3 people (larger companies need a Remotion company licence). Voices/sound effects are generated by your ElevenLabs account under its terms. The example episodes' audio and starter clips were generated on a paid plan.
