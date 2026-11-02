"""Exchange authorization code for refresh token. Usage: python exchange.py "CODE" """
import sys, json, urllib.request, urllib.parse

CLIENT_SECRET_FILE = r"D:\AI-Cartoons\youtube\client_secret.json"
TOKEN_FILE = r"D:\AI-Cartoons\youtube\token.json"
REDIRECT = "http://localhost:8080/"

with open(CLIENT_SECRET_FILE, encoding="utf-8") as f:
    cs = json.load(f)["installed"]
CLIENT_ID = cs["client_id"]
CLIENT_SECRET = cs["client_secret"]
TOKEN_URI = cs["token_uri"]

if len(sys.argv) < 2:
    print("Usage: python exchange.py \"PASTE_CODE_HERE\"")
    sys.exit(1)

code = sys.argv[1].strip()
data = urllib.parse.urlencode({
    "code": code,
    "client_id": CLIENT_ID,
    "client_secret": CLIENT_SECRET,
    "redirect_uri": REDIRECT,
    "grant_type": "authorization_code",
}).encode()

req = urllib.request.Request(TOKEN_URI, data=data, method="POST")
try:
    with urllib.request.urlopen(req) as resp:
        tokens = json.loads(resp.read())
    with open(TOKEN_FILE, "w", encoding="utf-8") as f:
        json.dump(tokens, f, indent=2)
    print("SUCCESS: token saved to", TOKEN_FILE)
    print("has refresh_token:", "refresh_token" in tokens)
except urllib.error.HTTPError as e:
    print("ERROR:", e.code, e.read().decode())

