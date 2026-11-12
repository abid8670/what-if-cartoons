import json
import pathlib
import sys
import google.oauth2.credentials
import googleapiclient.discovery

sys.stdout.reconfigure(encoding='utf-8')

PLAYLIST_ID = "PLenjyhuVye08"
TOKEN_FILE = pathlib.Path(r"D:\AI-Cartoons\youtube\token.json")
MAIN_URL_FILE = pathlib.Path(r"D:\AI-Cartoons\what-if-studio\out\dont-pause\uploaded_main.txt")

if not MAIN_URL_FILE.exists():
    print(f"Error: {MAIN_URL_FILE} does not exist yet. Run upload_dont_pause_main.py first.")
    sys.exit(1)

with open(MAIN_URL_FILE, "r", encoding="utf-8") as f:
    main_url = f.read().strip()

video_id = main_url.split("https://youtu.be/")[-1].strip()
print(f"Video ID to add: {video_id} into Playlist: {PLAYLIST_ID}")

with open(TOKEN_FILE, "r", encoding="utf-8") as f:
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

request_body = {
    'snippet': {
        'playlistId': PLAYLIST_ID,
        'position': 0, # Add to top of playlist!
        'resourceId': {
            'kind': 'youtube#video',
            'videoId': video_id
        }
    }
}

try:
    response = yt.playlistItems().insert(
        part='snippet',
        body=request_body
    ).execute()
    print(f"🎉 Successfully added {video_id} to top of playlist {PLAYLIST_ID}!")
    print(f"Playlist URL: https://www.youtube.com/playlist?list={PLAYLIST_ID}")
except Exception as e:
    print(f"Failed to add to playlist: {e}")

