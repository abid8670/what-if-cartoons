import asyncio, hashlib, json, os, pathlib, re, sys, time
import numpy as np
import edge_tts

# Add scripts directory to sys.path
sys.path.insert(0, str(pathlib.Path(__file__).parent))
from wi import SR, decode, ep_dir, load_episode, load_json, out_dir, pub_dir, save_json, write_wav

if len(sys.argv) < 2:
    print("Usage: python edge_voice.py <slug> [--force]")
    sys.exit(1)

slug = sys.argv[1]
force = '--force' in sys.argv
ep = load_episode(slug)

# Voice configuration: default to ChristopherNeural
voice_name = ep.get('voice', {}).get('name', 'en-US-ChristopherNeural')
rate = ep.get('voice', {}).get('rate', '+0%')
pitch = ep.get('voice', {}).get('pitch', '+0Hz')

text = ' '.join(b['text'].strip() for b in ep['script'])
sig = hashlib.sha1(f"{text}_{voice_name}_{rate}".encode()).hexdigest()[:12]

raw_mp3 = pub_dir(slug) / 'voice_raw.mp3'
raw_words_file = out_dir(slug) / 'words_raw.json'
meta_file = out_dir(slug) / 'voice_meta.json'
meta = load_json(meta_file, {})

async def generate_speech():
    print(f"Generating voice with Edge-TTS ({voice_name})...")
    comm = edge_tts.Communicate(text, voice_name, rate=rate, pitch=pitch, boundary="WordBoundary")
    audio = bytearray()
    wb_events = []
    
    async for chunk in comm.stream():
        if chunk['type'] == 'audio':
            audio.extend(chunk['data'])
        elif chunk['type'] == 'WordBoundary':
            s = chunk['offset'] / 1e7
            e = (chunk['offset'] + chunk['duration']) / 1e7
            txt = chunk['text']
            wb_events.append({'w': txt, 's': round(s, 3), 'e': round(e, 3)})
            
    raw_mp3.write_bytes(audio)
    return wb_events

if force or meta.get('sig') != sig or not raw_mp3.exists() or not raw_words_file.exists():
    t0 = time.time()
    wb_events = asyncio.run(generate_speech())
    
    # Associate punctuation from the original text if needed
    # Split original text into tokens to extract trailing punctuation
    orig_tokens = text.split()
    words = []
    for i, ev in enumerate(wb_events):
        token = ev['w']
        # Extract letters/numbers and punctuation
        w_clean = re.sub(r"[^\w'’]", '', token)
        p = ''
        m = re.search(r"[^\w'’]+$", token)
        if m:
            p = m.group(0)
        elif i < len(orig_tokens):
            # check corresponding original token
            m_orig = re.search(r"[^\w'’]+$", orig_tokens[i])
            if m_orig:
                p = m_orig.group(0)
        words.append({'w': w_clean, 's': ev['s'], 'e': ev['e'], 'p': p})
        
    save_json(raw_words_file, words)
    save_json(meta_file, {'sig': sig, 'chars': len(text), 'provider': 'edge-tts'})
    print(f"Edge-TTS generated {len(words)} words in {time.time()-t0:.2f}s (Cost: 0 credits, 100% Free)")
else:
    print("Voice unchanged: reusing cached voice (no generation needed).")
    words = load_json(raw_words_file)

# ---------------------------------------------------------------- tighten pauses
G = {'word': 0.12, 'comma': 0.2, 'sentence': 0.3, 'question': 0.45, 'pairs': {}}
G.update(ep.get('gaps', {}))
x = decode(raw_mp3)
cuts = []

def bare(w):
    return re.sub(r'[^\w]', '', w)

for a, b in zip(words, words[1:]):
    gap = b['s'] - a['e']
    key = bare(a['w']) + '|' + bare(b['w'])
    if key in G['pairs']:
        keep = G['pairs'][key]
    elif '?' in a['p'] or '!' in a['p']:
        keep = G['question']
    elif '.' in a['p'] or ':' in a['p'] or ';' in a['p'] or '…' in a['p']:
        keep = G['sentence']
    elif ',' in a['p'] or '—' in a['p'] or '-' in a['p']:
        keep = G['comma']
    else:
        keep = G['word']
    if gap > keep:
        mid = (a['e'] + b['s']) / 2
        rm = gap - keep
        cuts.append((mid - rm / 2, mid + rm / 2))

parts, last = [], 0.0
for s, e in cuts:
    parts.append(x[int(last * SR):int(s * SR)])
    last = e
parts.append(x[int(last * SR):])

fade = int(0.004 * SR)
for i, part in enumerate(parts):
    part = part.copy()
    if i > 0 and len(part) > fade:
        part[:fade] *= np.linspace(0, 1, fade)
    if i < len(parts) - 1 and len(part) > fade:
        part[-fade:] *= np.linspace(1, 0, fade)
    parts[i] = part

y = np.concatenate(parts)
write_wav(pub_dir(slug) / 'voice.wav', y)

def shift(t):
    return t - sum(min(e, t) - s for s, e in cuts if t > s)

out = [{'w': w['w'], 's': round(shift(w['s']), 3), 'e': round(shift(w['e']), 3), 'p': w.get('p', '')} for w in words]
save_json(ep_dir(slug) / 'words.json', out)
print(f"Tightened {len(cuts)} pauses, removed {sum(e - s for s, e in cuts):.2f} s: {len(x) / SR:.2f} s -> {len(y) / SR:.2f} s")
print("Saved words to words.json and audio to voice.wav")

