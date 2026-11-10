import asyncio
import os
import pathlib
import subprocess
import edge_tts

PUB_DIR = pathlib.Path(r"D:\AI-Cartoons\what-if-studio\public\million-button")
PUB_TIMER = pathlib.Path(r"D:\AI-Cartoons\what-if-studio\public_timer\million-button")
PUB_DIR.mkdir(parents=True, exist_ok=True)
PUB_TIMER.mkdir(parents=True, exist_ok=True)

VOICE = "en-US-GuyNeural"
RATE = "+6%"

SCRIPTS = {
    "ch_1": (
        "A heavy wooden box arrived on Pip's doorstep with no return address. "
        "Inside sat a polished mahogany pedestal and a glowing, blood-red dome button. "
        "A handwritten note warned: Every time you press this button, one million dollars in clean cash will deposit into your bank account. "
        "The catch? Somewhere in the world, a completely random human being will lose ten years of their lifespan. "
        "Pip laughed nervously. It was obviously an elaborate internet prank... right?"
    ),
    "ch_2": (
        "Three AM. Surrounded by unpaid eviction notices, final notices, and crippling debt. "
        "Pip stared at the silent red button. "
        "Just once, he whispered. One million dollars wipes out my debt forever. And what does ten years matter to someone I'll never even meet? "
        "Pip slammed his palm down. CLICK. "
        "A second later, his phone buzzed. Notification: Bank wire transfer confirmed. Balance: one million dollars. "
        "His hands began to shake."
    ),
    "ch_3": (
        "Wealth is the most addictive poison on earth. "
        "One million cleared his debt, but five million bought the penthouse. "
        "Ten million bought the supercars, the private jet, and the champagne parties. "
        "Over six months, Pip pressed the crimson button fifteen times. Fifteen million dollars. "
        "He stopped thinking about the strangers... until the evening news reported an inexplicable medical mystery. "
        "Thousands of healthy young people collapsing with organs aged eighty years overnight."
    ),
    "ch_4": (
        "The consequences finally came home. "
        "At a lavish dinner party in Pip's penthouse, his younger brother suddenly gasped, clutched his chest, and collapsed onto the marble floor. "
        "At the hospital, the head surgeon delivered the devastating diagnosis: "
        "His body has inexplicably aged forty years in less than a month. He doesn't have much time left. "
        "Pip stood frozen in the sterile hallway, ice in his veins. The math hit him like a bullet."
    ),
    "ch_5": (
        "Pip sprinted back to his penthouse, locked the steel vault, and raised a sledgehammer above the cursed box. "
        "Suddenly, the box emitted a piercing crimson hum, and a digital message glowed across the pedestal: "
        "Final Offer: Press one last time for one hundred million dollars... or destroy the mechanism forever. "
        "Pip transitions to the left of your screen. Look at the choice right now: "
        "Option A: Press it one last time! One hundred million could buy the world's best experimental medicine to save his brother! "
        "Or Option B: Smash the box with the sledgehammer and live with the guilt forever! "
        "Drop your choice in the comments below!"
    ),
    "short": (
        "Press this red button and you get one million dollars in cash! "
        "The catch? A random stranger on Earth loses ten years of their life! "
        "Pip pressed it fifteen times. He bought penthouses, luxury cars, and private jets! "
        "Until his own brother mysteriously collapsed with a body aged forty years overnight! "
        "Now the box offers one final choice: "
        "Option A: Press for one hundred million dollars! "
        "Option B: Smash it to dust! "
        "What would you do? Comment Option A or B right now!"
    )
}

async def generate():
    for name, text in SCRIPTS.items():
        raw_path = PUB_DIR / f"{name}_raw.mp3"
        final_path = PUB_DIR / f"{name}.mp3"
        timer_path = PUB_TIMER / f"{name}.mp3"
        
        communicate = edge_tts.Communicate(text, VOICE, rate=RATE)
        await communicate.save(str(raw_path))
        print(f"Generated raw TTS for {name}")
        
        cmd = [
            "ffmpeg", "-y", "-i", str(raw_path),
            "-filter:a", "loudnorm=I=-14:LRA=7:tp=-1.5",
            str(final_path)
        ]
        subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
        subprocess.run(["copy", str(final_path), str(timer_path)], shell=True, stdout=subprocess.DEVNULL, check=True)
        print(f"Mastered {name}.mp3 to -14 LUFS")

if __name__ == "__main__":
    asyncio.run(generate())

