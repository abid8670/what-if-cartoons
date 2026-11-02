"""Generate OAuth authorization URL. User visits it, authorizes, copies code from redirect URL."""
import urllib.parse, json

import json; _cs = json.load(open(r"D:\AI-Cartoons\youtube\client_secret.json", encoding="utf-8"))["installed"]; CLIENT_ID = _cs["client_id"]
SCOPES = "https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtube"
REDIRECT = "http://localhost:8080/"

params = {
    "client_id": CLIENT_ID,
    "redirect_uri": REDIRECT,
    "response_type": "code",
    "scope": SCOPES,
    "access_type": "offline",
    "prompt": "consent",
}
url = "https://accounts.google.com/o/oauth2/auth?" + urllib.parse.urlencode(params)
print("VISIT THIS URL:")
print(url)
print()
print("After authorizing, you'll be redirected to http://localhost:8080/?code=XXXX&scope=...")
print("Copy the 'code' value from the URL and run:")
print('python "D:\\AI-Cartoons\\youtube\\exchange.py" "PASTE_CODE_HERE"')

