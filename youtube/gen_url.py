"""Generate OAuth authorization URL. User visits it, authorizes, copies code from redirect URL."""
import urllib.parse, json

CLIENT_ID = "574389904023-a3tp7jmohg1m5ia2llr7hl5iop78o08h.apps.googleusercontent.com"
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
