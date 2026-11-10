import asyncio
import edge_tts
import os

async def test_sample(voice, text, filename):
    communicate = edge_tts.Communicate(text, voice)
    await communicate.save(filename)
    size = os.path.getsize(filename)
    print(f"Generated {filename} with voice {voice}: size = {size} bytes")

async def main():
    # Test 1: Urdu script with ur-PK-AsadNeural
    urdu_text = "بھائی صاحب! سچ بتا رہا ہوں، اگر تم نے ابھی سبسکرائب نہیں کیا تو تمہارا موبائل سوئچ آف ہو جائے گا!"
    await test_sample("ur-PK-AsadNeural", urdu_text, "test_ur_script.mp3")

    # Test 2: Roman Urdu with ur-PK-AsadNeural
    roman_urdu = "Bhai sahab! Sach bta raha hoon, agar subscribe nahi kia to mobile switch off ho jaye ga!"
    await test_sample("ur-PK-AsadNeural", roman_urdu, "test_ur_roman.mp3")

    # Test 3: Roman Hindi/Urdu with hi-IN-MadhurNeural
    await test_sample("hi-IN-MadhurNeural", roman_urdu, "test_hi_roman.mp3")

    # Test 4: Devanagari with hi-IN-MadhurNeural
    hindi_text = "भाई साहब! सच बता रहा हूँ, अगर तुमने अभी सब्सक्राइब नहीं किया तो तुम्हारा मोबाइल स्विच ऑफ हो जाएगा!"
    await test_sample("hi-IN-MadhurNeural", hindi_text, "test_hi_script.mp3")

if __name__ == "__main__":
    asyncio.run(main())

