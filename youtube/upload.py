"""YouTube upload script."""
import argparse, json, os, sys
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload

TOKEN_FILE = r"D:\AI-Cartoons\youtube\token.json"
CLIENT_SECRET = r"D:\AI-Cartoons\youtube\client_secret.json"
SCOPES = ["https://www.googleapis.com/auth/youtube", "https://www.googleapis.com/auth/youtube.upload"]

def get_creds():
    with open(TOKEN_FILE, encoding="utf-8") as f:
        data = json.load(f)
    with open(CLIENT_SECRET, encoding="utf-8") as f:
        cs = json.load(f)["installed"]
    data.setdefault("client_id", cs["client_id"])
    data.setdefault("client_secret", cs["client_secret"])
    data.setdefault("token_uri", cs["token_uri"])
    creds = Credentials.from_authorized_user_info(data, SCOPES)
    if creds.expired and creds.refresh_token:
        creds.refresh(Request())
        with open(TOKEN_FILE, "w", encoding="utf-8") as f:
            f.write(creds.to_json())
    return creds

def upload(args):
    creds = get_creds()
    youtube = build("youtube", "v3", credentials=creds)

    body = {
        "snippet": {
            "title": args.title,
            "description": args.description,
            "tags": [t.strip() for t in args.tags.split(",")] if args.tags else [],
            "categoryId": args.category,
            "defaultLanguage": "en",
        },
        "status": {
            "privacyStatus": args.privacy,
            "selfDeclaredMadeForKids": False,
        },
    }
    if args.schedule:
        body["status"]["publishAt"] = args.schedule
        body["status"]["privacyStatus"] = "private"

    media = MediaFileUpload(args.video, chunksize=-1, resumable=True, mimetype="video/mp4")
    req = youtube.videos().insert(part="snippet,status", body=body, media_body=media)
    response = None
    while response is None:
        status, response = req.next_chunk()
        if status:
            print(f"Upload progress: {int(status.progress() * 100)}%")
    video_id = response["id"]
    print(f"UPLOADED: https://youtu.be/{video_id}")

    if args.thumbnail and os.path.exists(args.thumbnail):
        youtube.thumbnails().set(videoId=video_id, media_body=MediaFileUpload(args.thumbnail)).execute()
        print("Thumbnail set.")

    if args.playlist:
        youtube.playlistItems().insert(part="snippet", body={
            "snippet": {"playlistId": args.playlist, "resourceId": {"kind": "youtube#video", "videoId": video_id}}
        }).execute()
        print(f"Added to playlist {args.playlist}")

    return video_id

if __name__ == "__main__":
    p = argparse.ArgumentParser()
    p.add_argument("--video", required=True)
    p.add_argument("--title", required=True)
    p.add_argument("--description", default="")
    p.add_argument("--tags", default="")
    p.add_argument("--thumbnail", default=None)
    p.add_argument("--category", default="24")
    p.add_argument("--privacy", default="private")
    p.add_argument("--schedule", default=None)
    p.add_argument("--playlist", default=None)
    args = p.parse_args()
    vid = upload(args)
    print("VIDEO_ID=" + vid)

