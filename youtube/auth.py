"""YouTube OAuth2 setup. Run once to get a refresh token.
Usage: python auth.py
Opens browser for authorization, saves token.json for reuse.
"""
import json, os
from google_auth_oauthlib.flow import InstalledAppFlow

CLIENT_SECRET = r"D:\AI-Cartoons\youtube\client_secret.json"
TOKEN_FILE = r"D:\AI-Cartoons\youtube\token.json"
SCOPES = ["https://www.googleapis.com/auth/youtube.upload",
          "https://www.googleapis.com/auth/youtube"]

flow = InstalledAppFlow.from_client_secrets_file(CLIENT_SECRET, SCOPES)
creds = flow.run_local_server(port=8080, prompt="consent", access_type="offline")

with open(TOKEN_FILE, "w") as f:
    f.write(creds.to_json())
print("SUCCESS: token saved to", TOKEN_FILE)
print("Refresh token present:", bool(creds.refresh_token))
