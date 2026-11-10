import asyncio
import edge_tts
import os
import pathlib
import json

OUT_DIR = pathlib.Path(r"D:\AI-Cartoons\what-if-studio\public\fan-off-ammi")
VOICE = "ur-PK-AsadNeural"
RATE = "+10%"
PITCH = "+2Hz"

# Detailed Urdu scripts for crisp Pakistani Urdu pronunciation
SCRIPTS = {
    "ch_1": """دنیا کا سب سے خطرناک الارم کلاک موبائل کا نہیں ہوتا، بلکہ صبح سات بجے امی کا وہ خاموش حملہ ہوتا ہے! تم رات کو دو بجے سوئے ہو، پنکھا فل اسپیڈ پر چل رہا ہے، اور تم جنت کے خواب دیکھ رہے ہو۔ لیکن دروازہ آہستہ سے کھلتا ہے... اور مہم شروع ہو جاتی ہے!""",
    
    "ch_2": """امی کمرے میں داخل ہوتی ہیں۔ نہ کوئی آواز، نہ کوئی چیخ۔ وہ سیدھی سوئچ بورڈ کی طرف جاتی ہیں... اور ٹک! پنکھا بند! پنکھے کے پر آہستہ آہستہ ایسے رکتے ہیں جیسے تمھاری زندگی کی سانسیں رک رہی ہوں۔ اور صرف دس سیکنڈ کے اندر لحاف کے اندر کا درجہ حرارت پچاس ڈگری کراس کر جاتا ہے!""",
    
    "ch_3": """آنکھیں ایسے کھلتی ہیں جیسے بندہ مریخ پر پھینک دیا گیا ہو! اور پیچھے سے امی کا شاہکار ڈائیلاگ: اٹھ جاؤ بارہ بج گئے ہیں! حالانکہ گھڑی میں ابھی سوا سات ہوئے ہوتے ہیں! سچ سچ کمنٹس میں بتاؤ، کس کس کی امی صبح پنکھا بند کرتی ہیں؟ نیچے کمنٹ کرو 'ہاں' یا 'روزانہ'، اور چینل کو فوراً سبسکرائب کرو!""",
    
    "short": """دنیا کا سب سے خطرناک الارم کلاک صبح سات بجے امی کا پنکھا بند کرنا ہے! ادھر بٹن آف ہوا، ادھر لحاف کے اندر گرمی سے پسینے کے فوارے چھوٹ گئے! اور پیچھے سے آواز آئے گی: اٹھ جاؤ بارہ بج گئے ہیں! حالانکہ گھڑی میں سوا سات ہوئے ہوتے ہیں! سچ بتاؤ، کیا تمھاری امی بھی صبح پنکھا بند کرتی ہیں؟ کمنٹس میں لکھو 'روزانہ' اور سبسکرائب کرو!"""
}

async def generate():
    durations = {}
    for key, text in SCRIPTS.items():
        out_file = OUT_DIR / f"{key}.mp3"
        print(f"Generating {key} with {VOICE}...")
        comm = edge_tts.Communicate(text, VOICE, rate=RATE, pitch=PITCH)
        await comm.save(str(out_file))
        print(f"Saved {out_file} ({out_file.stat().st_size} bytes)")

if __name__ == "__main__":
    asyncio.run(generate())

