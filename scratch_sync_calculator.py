import json

data = json.load(open(r"D:\AI-Cartoons\what-if-studio\public\no-water\timestamps.json"))

def find_word_frame(words, target_words, fallback_frame):
    for w in words:
        cleaned = w["word"].lower().strip(".,!?:;\"'")
        for tw in target_words:
            if tw.lower() in cleaned:
                return int(round(w["t"] * 30))
    return fallback_frame

print("=== TIMESTAMPS SYNC ANALYSIS ===")

# CH 1:
# Beat 1: Morning Kitchen & Pip waking up / turning on faucet (0 to 'vanishes')
# Beat 2: Water vanishing / dry clank ('vanishes' to 'shower')
# Beat 3: Mo in shower with dry soap ('shower' to 'coffee' or 'pools')
# Beat 4: Global shock / empty pools & cups ('pools' to 'disappeared')
# Beat 5: 1.38 billion cubic km wiped out ('disappeared' to end)
ch1_words = data["ch_1"]
t_vanish = find_word_frame(ch1_words, ["vanishes", "stream"], 180)
t_shower = find_word_frame(ch1_words, ["shower", "soap"], 360)
t_global = find_word_frame(ch1_words, ["coffee", "pools"], 540)
t_wipe = find_word_frame(ch1_words, ["billion", "wiped", "disappeared"], 780)
print(f"CH1 Frames: 0 -> {t_vanish} (Vanish) -> {t_shower} (Shower) -> {t_global} (Global Pools) -> {t_wipe} (1.38B wipe) -> 1167 (End)")

# CH 2:
# Beat 1: Planetary map changes / 71% ocean (0 to 'canyons')
# Beat 2: Miles-deep canyon & Marian Trench ('canyons' to 'plummet' or 'snapping')
# Beat 3: Stranded cargo ship snapped in half ('snapping' to 'coral' or 'whales')
# Beat 4: Stranded marine life on salt flats ('salt', 'flats' to 'exposed' or 'sunlight')
# Beat 5: Ocean floor exposed to sunlight ('exposed', 'sunlight' to end)
ch2_words = data["ch_2"]
t_canyon = find_word_frame(ch2_words, ["canyons", "transformed"], 250)
t_ship = find_word_frame(ch2_words, ["snapping", "plummet", "hulls"], 520)
t_salt = find_word_frame(ch2_words, ["stranded", "whales", "salt"], 780)
t_sunlight = find_word_frame(ch2_words, ["exposed", "darkness", "sunlight"], 1020)
print(f"CH2 Frames: 0 -> {t_canyon} (Canyon) -> {t_ship} (Ship snap) -> {t_salt} (Salt flats) -> {t_sunlight} (Sunlight) -> 1323 (End)")

# CH 3:
# Beat 1: Hour 1 & Ocean weight hydrostatic pressure (0 to 'lifted' or 'rebounds')
# Beat 2: Seabed rebounds upward like a spring ('rebounds', 'spring' to 'crack' or 'ring')
# Beat 3: Ring of fire ruptures / volcanic cracks ('crack', 'ring', 'rupture' to 'lava' or 'molten')
# Beat 4: Magma explosion & ash plume into stratosphere ('lava', 'ash', 'plumes' to 'hellscape')
# Beat 5: Volcanic hellscape conclusion ('hellscape' to end)
ch3_words = data["ch_3"]
t_lift = find_word_frame(ch3_words, ["lifted", "pressure", "tons"], 300)
t_spring = find_word_frame(ch3_words, ["rebounds", "spring", "crack"], 500)
t_rupture = find_word_frame(ch3_words, ["rupture", "fire", "volcanoes"], 720)
t_hell = find_word_frame(ch3_words, ["hellscape", "stratosphere", "ash"], 1000)
print(f"CH3 Frames: 0 -> {t_lift} (Lifted) -> {t_spring} (Spring) -> {t_rupture} (Rupture) -> {t_hell} (Hellscape) -> 1266 (End)")

# CH 4:
# Beat 1: Day 1 weather collapse & zero clouds (0 to 'clouds', 'zero')
# Beat 2: 60°C Heatwave & scorching sun ('sixty', 'skyrocket' to 'pavement')
# Beat 3: Melting pavement & blistering cars ('pavement', 'melts', 'blister' to 'night')
# Beat 4: Night falls & freezing sub-zero drop ('night', 'freezing', 'sub-zero' to 'mercury')
# Beat 5: Mercury-like wild swing ('mercury', 'swings' to end)
ch4_words = data["ch_4"]
t_clouds = find_word_frame(ch4_words, ["clouds", "weather", "zero"], 240)
t_heat = find_word_frame(ch4_words, ["sixty", "skyrocket", "temperatures"], 480)
t_melt = find_word_frame(ch4_words, ["pavement", "melts", "cars"], 700)
t_night = find_word_frame(ch4_words, ["night", "freezing", "sub-zero"], 940)
t_merc = find_word_frame(ch4_words, ["mercury", "swings"], 1150)
print(f"CH4 Frames: 0 -> {t_clouds} (Zero clouds) -> {t_heat} (60C Heat) -> {t_melt} (Melt cars) -> {t_night} (Freezing Night) -> {t_merc} (Mercury) -> 1330 (End)")

# CH 5:
# Beat 1: Day 3 & Biological clock 60% water (0 to 'sludge' or 'blood')
# Beat 2: Thick blood & heart strain ('sludge', 'strain', 'blood' to 'delirium' or 'kidneys')
# Beat 3: Parched delirium & dry kindling ('kidneys', 'delirium', 'kindling' to 'wildfires')
# Beat 4: Continental mega-wildfires ignite ('wildfires', 'firestorms', 'ignite' to 'hundred')
# Beat 5: 100-hour extinction countdown ('hundred', 'survive' to end)
ch5_words = data["ch_5"]
t_bio = find_word_frame(ch5_words, ["blood", "sludge", "thickens"], 320)
t_delir = find_word_frame(ch5_words, ["kidneys", "delirium", "bleed"], 560)
t_fire = find_word_frame(ch5_words, ["wildfires", "ignite", "continents"], 800)
t_extinct = find_word_frame(ch5_words, ["hundred", "survive", "extinction"], 1080)
print(f"CH5 Frames: 0 -> {t_bio} (Blood sludge) -> {t_delir} (Delirium) -> {t_fire} (Mega-Wildfires) -> {t_extinct} (100h Extinction) -> 1316 (End)")

# CH 6:
# Beat 1: Desolate red Mars-like Earth (0 to 'collapses', 'dust')
# Beat 2: Pip collapsing on cracked earth ('collapses', 'gasping' to 'jolts', 'awake')
# Beat 3: Morning awakening in bed ('jolts', 'awake', 'alarm' to 'glass', 'nightstand')
# Beat 4: Cold glass of water & delicious gulp ('glass', 'nightstand', 'gulp' to 'molecule', 'sanity')
# Beat 5: Outro & Subscribe ('subscribe', 'bell' to end)
ch6_words = data["ch_6"]
t_mars = find_word_frame(ch6_words, ["collapses", "dust", "mars"], 280)
t_wake = find_word_frame(ch6_words, ["jolts", "awake", "alarm"], 480)
t_glass = find_word_frame(ch6_words, ["nightstand", "condensation", "cold"], 720)
t_gulp = find_word_frame(ch6_words, ["gulp", "delicious", "gratitude"], 960)
t_sub = find_word_frame(ch6_words, ["subscribe", "smash", "bell"], 1220)
print(f"CH6 Frames: 0 -> {t_mars} (Mars collapse) -> {t_wake} (Jolts awake) -> {t_glass} (Cold glass) -> {t_gulp} (Delicious gulp) -> {t_sub} (Subscribe) -> 1467 (End)")

