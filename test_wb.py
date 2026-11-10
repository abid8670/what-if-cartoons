import asyncio, edge_tts

async def test():
    comm = edge_tts.Communicate("What if it rained for twenty-five days without stopping? At first, it feels cozy.", "en-US-ChristopherNeural", boundary="WordBoundary")
    words = []
    async for chunk in comm.stream():
        if chunk["type"] == "WordBoundary":
            t = chunk["offset"] / 10_000_000
            words.append((t, chunk["text"]))
    print(f"Extracted {len(words)} word timestamps:")
    for t, w in words[:8]:
        print(f"  {t:.2f}s: {w}")

asyncio.run(test())
