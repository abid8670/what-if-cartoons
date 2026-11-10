import asyncio
import edge_tts

async def main():
    voices = await edge_tts.list_voices()
    for v in voices:
        locale = v.get("Locale", "").lower()
        if "ur-" in locale or "hi-" in locale:
            print(f"{v['ShortName']:<25} | {v.get('Gender', 'N/A'):<8} | {v['Locale']}")

if __name__ == "__main__":
    asyncio.run(main())
