import json
import pathlib
import sys
import google.oauth2.credentials
import googleapiclient.discovery

sys.stdout.reconfigure(encoding='utf-8')

TOKEN_PATH = pathlib.Path(r"D:\AI-Cartoons\youtube\token.json")

with open(TOKEN_PATH, encoding="utf-8") as f:
    t = json.load(f)

creds = google.oauth2.credentials.Credentials(
    token=t['token'],
    refresh_token=t.get('refresh_token'),
    token_uri=t.get('token_uri'),
    client_id=t.get('client_id'),
    client_secret=t.get('client_secret'),
    scopes=t.get('scopes')
)

yt = googleapiclient.discovery.build('youtube', 'v3', credentials=creds)

def post_comment(video_id, text):
    try:
        body = {
            'snippet': {
                'videoId': video_id,
                'topLevelComment': {
                    'snippet': {
                        'textOriginal': text
                    }
                }
            }
        }
        res = yt.commentThreads().insert(part='snippet', body=body).execute()
        comment_id = res['id']
        print(f"✅ Posted comment on {video_id} (ID: {comment_id})")
        return comment_id
    except Exception as e:
        print(f"⚠️ Failed to comment on {video_id}: {e}")
        return None

def create_playlist(title, description, privacy="public"):
    try:
        body = {
            'snippet': {
                'title': title,
                'description': description
            },
            'status': {
                'privacyStatus': privacy
            }
        }
        res = yt.playlists().insert(part='snippet,status', body=body).execute()
        pl_id = res['id']
        print(f"🎉 Created Playlist: {title} (ID: {pl_id})")
        return pl_id
    except Exception as e:
        print(f"⚠️ Failed to create playlist: {e}")
        return None

def add_to_playlist(playlist_id, video_id):
    try:
        body = {
            'snippet': {
                'playlistId': playlist_id,
                'resourceId': {
                    'kind': 'youtube#video',
                    'videoId': video_id
                }
            }
        }
        res = yt.playlistItems().insert(part='snippet', body=body).execute()
        print(f"  ➕ Added {video_id} to playlist {playlist_id}")
    except Exception as e:
        print(f"  ⚠️ Could not add {video_id}: {e}")

print("==================================================")
print("1. POSTING ENGAGEMENT DILEMMA COMMENTS")
print("==================================================")

# Episode 17: Time Remote
c_ep17 = (
    "⏳ Which choice are you taking? 👇\n\n"
    "🅰️ OPTION A: Keep the 10-Second Rewind remote (Cost: 1 month of life per click)\n"
    "🅱️ OPTION B: Destroy the remote forever (Live with mistakes and human free will)\n\n"
    "Drop your reason below! Hearting every answer ❤️"
)
post_comment("F-3rGKOtN-g", c_ep17) # Ep 17 Full Film
post_comment("V-pR7gGvUgg", c_ep17) # Ep 17 Short

# Episode 16: Lifespan
c_ep16 = (
    "💀 The Ultimate Existential Dilemma:\n\n"
    "🅰️ OPTION A: Know your exact death date & second (Live with zero fear)\n"
    "🅱️ OPTION B: Live in complete uncertainty (Every day is a mystery and a gift)\n\n"
    "Which one are you picking? Drop below! ❤️"
)
post_comment("GgrBvld5OYY", c_ep16) # Ep 16 Full Film
post_comment("BNCvzG064lI", c_ep16) # Ep 16 Short

# Episode 15: Memories
c_ep15 = (
    "🧠 Memory Dilemma:\n\n"
    "🅰️ OPTION A: Buy back your soul for $30M & stay broke, but remember your mother\n"
    "🅱️ OPTION B: Keep $50M CASH and erase your past forever as a nameless billionaire\n\n"
    "Which one are you choosing? Drop below! 👇"
)
post_comment("sCMPiW4UDRg", c_ep15) # Ep 15 Full Film
post_comment("LJpGcaNwo7c", c_ep15) # Ep 15 Short

print("\n==================================================")
print("2. CREATING OFFICIAL BINGE-WATCH PLAYLIST")
print("==================================================")

pl_title = "Mind-Bending Animated Stories & Dilemmas | What-eif"
pl_desc = (
    "Watch the complete collection of high-retention sci-fi animated thought experiments, "
    "impossible moral dilemmas, and existential stories from What-eif. "
    "Featuring Pip in the signature mustard hoodie. New episodes regularly!"
)

pl_id = create_playlist(pl_title, pl_desc)

if pl_id:
    # Add recent top episodes in recommended watch order:
    ep_videos = [
        "F-3rGKOtN-g", # Ep 17: Time Remote
        "GgrBvld5OYY", # Ep 16: Lifespan
        "sCMPiW4UDRg", # Ep 15: Memory Cash
        "QDkOVf75DHs", # Ep 14: Immortal
        "KW-vgWYRUx4", # Ep 13: 5 Clones
        "PAyEAe5Njpw", # Ep 12: Million Dollar Button
        "0UqrqZB4eaM", # Ep 11: Everyone Vanished
        "rMeR7yjSB-w", # Ep 10: Read Mind
    ]
    for vid in ep_videos:
        add_to_playlist(pl_id, vid)

print("\nALL GROWTH ACTIONS COMPLETED!")

