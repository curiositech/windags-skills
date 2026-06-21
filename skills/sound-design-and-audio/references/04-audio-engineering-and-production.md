# Audio Engineering & Production — Making the Actual Sounds

> Scope: the craft layer beneath Harbor's sound *design*. The companion doc covers *which* cues exist and *when* they fire. This doc is about turning a one-line brief ("sonar ping when a vessel docks") into a 48k/24-bit WAV that sits at the right loudness, fits the maritime palette, and is legally clean to ship in a commercial Rust desktop app. Maritime/neobrutalism brand: mustard, navy, signal flags. Cues are short — almost everything here is 80–600ms.

---

## 0. The non-negotiables (read this, then the rest is detail)

- **Work at 48kHz / 32-bit float internally, deliver 48kHz / 24-bit WAV.** 48k is the universal game/app/video standard; 44.1k is a music-CD legacy default you don't need. 24-bit gives you headroom to normalize cues without quantization grunge. ([game audio delivery norm](https://vi-control.net/community/threads/game-music-whats-the-norm-wav-ogg-mp3-16-bit-24-bit.45633/))
- **Mono unless the cue genuinely moves.** Operator console cues are functional, not cinematic. Mono halves your asset size and is rock-solid on every output device. Reserve stereo for ambience beds or a deliberate L→R "scan" motion.
- **Loudness, not peak, is what the ear judges.** Match cues by **short-term LUFS**, not peak. (See §4.)
- **Keep one project file per palette, not one per sound.** Coherence comes from shared reverb, shared EQ tilt, shared master chain — kill them the moment each cue lives in its own session.
- **Every source asset gets a license record before it touches the repo.** No exceptions. (See §6.)

---

## 1. Synthesis methods → which fits which maritime cue

The single highest-leverage decision is *method*, because it determines whether a sound is even reachable. Picking subtractive for a bell is fighting physics.

| Method | What it is | Timbral home | Maritime cues it nails |
|---|---|---|---|
| **Subtractive** | Rich source (saw/square/noise) → filter → envelope. Warm, analog, predictable. ([primer](https://homestudioguys.com/blog/subtractive-vs-additive-synthesis/)) | Bass, pads, whooshes, filtered noise | Foghorn (filtered saw), wind/air beds, low "hull" drones, swish/transition whooshes (filtered noise + envelope) |
| **FM** | Carrier frequency modulated by another oscillator → inharmonic sidebands. Bright, metallic, bell-like. ([FM vs subtractive](https://producerhive.com/ask-the-hive/wavetable-vs-fm-vs-additive-vs-subtractive-synthesis/)) | Bells, chimes, metallic pings, electric-piano | **Ship's bell** (success), **sonar ping** (sine carrier, tiny FM for shimmer), buoy bell, brass-instrument-ish alerts |
| **Granular** | Slice audio into grains, re-scatter. Dense, evolving, glitchy. ([granular VSTs](https://artistsindsp.com/the-best-15-granular-synthesis-vst-plugins-in-2026/)) | Textures, clouds, time-stretch beds | Water/foam ambience, "data streaming" textures, anxious shimmer under a warning, radio-static wash |
| **Physical modeling** | Simulate the physics of a resonator (string, tube, membrane). Organic, responsive. | Plucked/struck/blown bodies | Rope-creak, wood-knock (dock), tensioned-cable twang, realistic bell strike if FM sounds too synthetic |

**Decision points:**

- **Is it metallic or bell-like?** → FM first, physical-modeling if FM sounds "cheap." Never subtractive.
- **Is it air, water, or wind?** → filtered noise (subtractive) for the body; granular for movement/evolution.
- **Does it need to *evolve* over its (short) life?** → granular or a subtractive filter sweep. A static cue is fine for taps; a "connecting…" loop wants motion.
- **Is it a clean tonal alert (ping/beep)?** → start with a pure sine and *add* the minimum (slight FM, a touch of noise transient) rather than subtracting from something rich.

**Anti-pattern — "wavetable everything."**
- *Symptom:* every cue has the same vaguely-EDM digital sheen; the bell and the foghorn are cousins.
- *Detection:* you opened Vital/Serum for all six sounds.
- *Fix:* assign method by cue family. The palette's coherence should come from the *reverb and EQ tilt*, not from one synth's character bleeding into everything.

---

## 2. Tools — what to reach for, and the honest tradeoffs

| Tool | Cost | Strength | Use it for | Watch out |
|---|---|---|---|---|
| **Vital** | Free (paid tiers) | Wavetable + modulation, visual, fast | Tonal cues, evolving textures, modern UI shimmer | Free tier limits wavetable/preset packs; easy to make everything sound "Vital" |
| **VCV Rack 2** | Free core | Modular subtractive/FM/granular in one patch; total control | Sonar ping with hand-built FM, noise beds, signal-flow you can save and re-derive | Steep; CPU; export via recorder module |
| **Plugdata / Pure Data** | Free / OSS | Pd patches, scriptable, embeddable, reproducible | Physical-modeling, granular experiments, *generative* cue variants from one patch | Ugly UX; you build everything; great for "regenerate 8 ping variants" |
| **SuperCollider** | Free / OSS | Code-as-synth; text-diffable; deterministic | Programmatic cue *families* — same SynthDef, parameterized; checks into git as source | Code-first; no GUI; the most "engineering" option |
| **Sonic Pi** | Free | Approachable live-coding Ruby-ish over SC | Quick sketches, learning, rhythmic cue sequences | Less control than raw SC; aimed at performance |
| **Ableton Live** | Paid | Full DAW: arrange, layer, master, batch-export | Final assembly, layering synth + sample, the master chain, rendering all cues | Cost; overkill if you only synth |

**Recommendation for Harbor specifically:** synthesize cue *sources* in **SuperCollider or VCV Rack** (so the recipe is reproducible and version-controllable — a maritime palette is a small, stable set you'll re-render as the brand evolves), then do final **layering + mastering + batch export in Ableton** (or [Reaper] if you want a cheaper batch-render workhorse). The reproducibility point matters: a SynthDef in git is a *recipe*, a one-off WAV is a *photograph*.

**Decision point — synth vs. sample vs. AI:**
- Pure tonal cue (ping, beep, bell) → **synth** (cleanest, most controllable, smallest, zero license risk).
- Real-world texture (rope, water, gull, deck-creak) → **sample** (synthesis fights you here) — record or license.
- Need 20 plausible variants fast and originality matters less than coverage → **AI audio**, then hand-finish. (See §6 on the license trap.)

---

## 3. Concrete recipes

These are starting points — dial to taste, then run them through §4 mastering.

**Sonar ping (idle scan / "vessel detected"):**
- Sine, **880 Hz**, **180 ms** total.
- Amp: exponential decay, near-instant attack (~2 ms), full decay over the 180 ms.
- **Pitch drop**: glide 880 → ~840 Hz over the first ~60 ms (the doppler-ish "blip" feel).
- Optional: 2–4% FM (modulator at ~3× carrier, tiny index) for a hair of metallic shimmer.
- **Plate reverb**, ~1.2 s decay, 30–40% wet, high-cut at 6 kHz so the tail is dark, not glassy. This long-vs-short contrast is the signature.

**Ship's bell (task success):**
- FM: carrier sine, modulator at a **non-integer ratio (~1.4–2.7)** for inharmonic bell partials. Index ~3–5, decaying fast.
- Sharp strike transient (a 3–5 ms noise burst, high-passed at 2 kHz) layered at the front for the "clapper."
- Amp: fast attack, long exponential decay (**400–700 ms**).
- Light room reverb, ~0.8 s, 20% wet. Keep it close — a docked bell, not a cathedral.

**Foghorn (critical alert / blocking error):**
- Subtractive: saw or square through a low-pass at **~400 Hz**, slight resonance.
- Fundamental **~120–180 Hz**, optionally two stacked detuned osc for the "two-tone horn" beat.
- Slow attack (~80 ms) so it *swells*; sustain ~400 ms; slow release. Total **~700 ms–1 s** — longer than other cues on purpose; this is the one that should make you look up.
- Gentle saturation for "air being pushed." Minimal reverb — outdoor, dry.

**Soft tap / confirm (button, toggle):**
- Sine or triangle **~600–900 Hz**, **40–70 ms**, exp decay, no reverb.
- A 1–2 ms noise tick at the front for "click" articulation. Keep it *quiet* — taps sit lowest in the loudness hierarchy. ([taps ~−18 to −14 LUFS](https://elements.envato.com/learn/ui-sound-design-ai))

**"Connecting…" loop (agent spinning up):**
- Granular bed of filtered water/air, very low, or a subtractive noise pulse at ~1–2 Hz LFO.
- Loopable: ensure zero-crossing seam; keep it **under −20 LUFS** so it's ambient, not nagging.

**Signal-flag flourish (multi-success / fleet milestone):**
- A short 2–3 note arpeggio on the bell/FM patch (think semaphore turning into melody), 400–600 ms total, mapped to the brand's "victory" interval (a clean rising third or fourth).

---

## 4. Mastering UI sound — the part everyone skips

Short cues live or die on **loudness consistency and transient shape**, not on the synthesis. A palette where one cue is twice as loud as the next feels broken even when each sound is "good."

### Loudness targets

- **Match cues by short-term LUFS**, since they're too brief for integrated LUFS to mean much (the 3-second short-term window is the right meter for cue-length material). ([short-term LUFS for cues](https://beatstorapon.com/blog/the-ultimate-guide-to-lufs-loudness-units-full-scale/))
- Practical hierarchy for an operator console:
  - **Taps / confirms:** ~ **−20 to −16 LUFS** (short-term). Lowest — they fire constantly.
  - **Notifications / status:** ~ **−16 to −12 LUFS**. Perceptibly above taps. ([notifications ≈ −12 LUFS](https://elements.envato.com/learn/ui-sound-design-ai))
  - **Critical alerts (foghorn):** ~ **−12 to −10 LUFS**. The loudest, and the only one allowed to startle.
- **True peak ≤ −1.0 dBTP** on every export. This is the cross-platform safe ceiling and prevents inter-sample clipping on cheap DACs / Bluetooth codecs. ([−1 dBTP norm](https://imusician.pro/en/resources/blog/mastering-and-the-loudness-war-an-update))
- Do **not** brickwall-limit cues to maximum loudness. The whole point of a tap is that it's quiet. Loudness-war thinking is exactly wrong here.

### Transient shaping

- Cues are *all transient*. A transient shaper (or just envelope) controls "snap vs. soft."
- **Sharpen** the attack for taps/clicks (crisp = responsive). **Soften** for ambient/connecting cues (no jarring onset).
- Trim the leading silence to **< 10 ms** so the cue fires the instant it's triggered — latency in a UI cue reads as lag in the *app*.

### De-essing / harshness control

- FM and noise-transient sources can spit **3–7 kHz harshness** that fatigues over a workday. A gentle dynamic EQ or de-esser dip there makes a cue you can hear 200×/day without wincing.
- High-shelf or low-pass the reverb tail (e.g. 6 kHz on the sonar ping) so tails are dark and don't pile up into hiss.

### EQ tilt for palette coherence

- Decide one **spectral tilt** for the whole palette (Harbor: a slightly dark, "brass-and-water" tilt — full low-mids, controlled highs) and apply it to every cue. This is the *actual* mechanism that makes six different sounds feel like one family.
- High-pass everything you don't need below ~80–120 Hz (except the foghorn) to keep the palette tight.

### Dither

- Dither **only** on the final 32-float → 24-bit (or → 16-bit) WAV bounce. ([always dither on bit-depth reduction](https://www.raytownproductions.com/blog/best-song-export-settings-volume-dither-bit-depth/))
- **Do not** dither when exporting to OGG/MP3/AAC — lossy codecs don't carry the bit-depth reduction dither addresses, so it's pointless noise. ([no dither for lossy](https://gearspace.com/board/mastering-for-beginners/1386177-dithering-24bit-48k-release.html))
- One dither pass only, last in the chain. Never dither twice.

### Format / sample-rate choices

- **Master / archive:** 48kHz / 24-bit **WAV**, mono. This is your source of truth, checked into the asset repo. ([24-bit/48k WAV delivery](https://vi-control.net/community/threads/game-music-whats-the-norm-wav-ogg-mp3-16-bit-24-bit.45633/))
- **Ship in the Rust app:** depends on the audio backend.
  - `rodio` / `cpal` (typical gpui-adjacent stack) decode **OGG Vorbis** fine via `lewton`/`symphonia` — ship **OGG q5–q7** for cues to shrink the binary/bundle. For sub-second cues the file is tiny either way; OGG mainly helps ambience beds.
  - If you want zero decode latency and dead-simple playback, ship **WAV** for the shortest cues (taps/pings) and reserve OGG for longer/looping beds. Decode-on-trigger of a 60ms WAV is free.
- **Never resample at runtime.** Author at 48k, ship at 48k, let the device handle final output. Runtime SRC adds artifacts and CPU for no benefit.

---

## 5. Quality gates (run before any cue ships)

- [ ] **48kHz / 24-bit** source WAV exists and is in the asset repo (not just the synth project).
- [ ] **Mono** unless motion is intentional and documented.
- [ ] **True peak ≤ −1.0 dBTP** (measure, don't eyeball the waveform).
- [ ] **Short-term LUFS within the family's band** (tap/notification/alert) — measured, A/B'd against the adjacent cue in the hierarchy.
- [ ] **Leading silence < 10 ms**; no clicks at the seam (zero-crossing start/end).
- [ ] **Loop cues** seam-test for 30s with no audible bump.
- [ ] **Shared reverb + EQ tilt** confirmed (open the cue next to a sibling cue — do they sound related?).
- [ ] **Dither applied once**, last, only on 24/16-bit WAV bounces; **not** on OGG.
- [ ] **Listened at low volume** (you'll often run the console quiet) and **on laptop speakers** (not just monitors) — most operators won't have studio headphones.
- [ ] **License record** filed for every source asset (§6).
- [ ] **Played through the actual Rust backend** (`rodio`/`cpal`) at trigger time — not just in the DAW. UI cues that sound great in Ableton can have decode latency or a pop in-app.

---

## 6. Sourcing & licensing — the part that gets you sued

A commercial desktop app raises the licensing bar. "I found it on the internet" is not a license.

### Freesound

- Mixed licenses per-sound — **check each one**. ([Freesound FAQ](https://freesound.org/help/faq/))
  - **CC0** → use freely, **no attribution required**, commercial OK. *Best for shipping.* ([CC0 no credit](https://freesound.org/forum/legal-help-and-attribution-questions/35069/))
  - **CC-BY** → commercial OK but **attribution required** — and a desktop app needs a visible credits screen / `CREDITS.txt`. Track it.
  - **Sampling+ / NC** → avoid for a commercial product.
- **Trap:** some uploads are marked CC0 but the *description* asks for credit, or the uploader didn't actually own the source. Prefer high-reputation uploaders; when in doubt, synthesize it instead. ([CC0-but-description-says-attribute](https://freesound.org/forum/legal-help-and-attribution-questions/42164/))

### CC0 packs (lowest-friction)

- **Kenney** game asset packs include UI SFX, almost all **CC0** — modify and ship with no attribution. ([Kenney CC0](https://gamineai.com/blog/12-best-free-sound-effect-libraries-game-developers)) Great for placeholder taps while you synth the real palette.

### Commercial libraries

- Subscription/one-off libs (Soundly, Splice, A Sound Effect, Boom) grant a commercial license per their terms. ([Soundly commercial use](https://getsoundly.com/faq/how-can-i-use-the-freesound-library/)) Read the EULA for **redistribution-inside-software** — some music/loop licenses cover video but not "embedded in a shipped app." Buy the right tier.

### AI audio

- Useful for fast variant coverage (ElevenLabs SFX, Stable Audio, etc.). **License caveats:**
  - Confirm the generator grants **commercial rights** and **ownership/clearance** of output (terms vary and change).
  - AI output is your *raw material*, not the deliverable — re-synthesize the keeper, or at minimum re-master it into the palette so it isn't a recognizable stock asset.
- **Anti-pattern — shipping raw AI/stock cues.** *Symptom:* the success sound is identical to three other apps. *Detection:* you didn't run it through your master chain or change anything. *Fix:* treat every external sound as a sketch; the shipped cue must pass §5's "sounds related to its siblings" gate.

### Keeping a coherent palette across sources

- One **master bus chain** (tilt EQ + reverb send + limiter) that *every* cue passes through, regardless of whether it was synthesized, sampled, or AI'd. This is what makes a Kenney tap and an FM bell sound like the same product.
- One **reverb space** for the whole palette (the plate on the sonar ping is the *same plate* on the bell tail). Different reverbs = different rooms = incoherent.
- A **palette manifest** in the repo: cue name → method → source → license → LUFS target → file. When the brand shifts (mustard gets warmer, navy goes darker), you re-render from recipes, not from memory.

### License record (commit this next to the assets)

```
cue: sonar_ping_idle
source: synthesized (SuperCollider, recipe in synth/ping.scd)
license: original work — owned
lufs_st: -15.0
peak_dbtp: -1.2
file: assets/audio/sonar_ping_idle.wav (48k/24-bit) + .ogg (q6)

cue: deck_creak_ambient
source: Freesound #482910 by <user>
license: CC0 (verified 2026-06, no attribution required)
file: assets/audio/deck_creak.ogg
```

---

## 7. The one-paragraph workflow

Brief → pick **method** by cue family (§1) → synthesize the source in **SuperCollider/VCV** (reproducible) or license a **CC0** sample → layer/assemble in **Ableton/Reaper** → push through the **shared master chain** (tilt EQ, one reverb, transient shape, de-ess) → meter to the **family's short-term LUFS band** with **−1 dBTP** ceiling → **dither once** to **48k/24-bit WAV**, transcode to **OGG q6** for ambience → file the **license record** → run **§5 gates** including a real playback through `rodio`/`cpal` → commit recipe + WAV + OGG + manifest entry.

---

**Sources:**
- [UI sound design / cue LUFS — Envato](https://elements.envato.com/learn/ui-sound-design-ai)
- [LUFS ultimate guide & short-term window — BeatsToRapOn](https://beatstorapon.com/blog/the-ultimate-guide-to-lufs-loudness-units-full-scale/)
- [Mastering / loudness & −1 dBTP — iMusician](https://imusician.pro/en/resources/blog/mastering-and-the-loudness-war-an-update)
- [Subtractive vs additive vs FM — Home Studio Guys](https://homestudioguys.com/blog/subtractive-vs-additive-synthesis-explained/)
- [Wavetable vs FM vs additive vs subtractive — ProducerHive](https://producerhive.com/ask-the-hive/wavetable-vs-fm-vs-additive-vs-subtractive-synthesis/)
- [Granular synthesis VSTs — Artists in DSP](https://artistsindsp.com/the-best-15-granular-synthesis-vst-plugins-in-2026/)
- [Dither on bit-depth reduction — Raytown Productions](https://www.raytownproductions.com/blog/best-song-export-settings-volume-dither-bit-depth/)
- [No dither for lossy / 24-48k — Gearspace](https://gearspace.com/board/mastering-for-beginners/1386177-dithering-24bit-48k-release.html)
- [Game audio delivery norms (24-bit/48k WAV, OGG) — VI-Control](https://vi-control.net/community/threads/game-music-whats-the-norm-wav-ogg-mp3-16-bit-24-bit.45633/)
- [Freesound FAQ / CC0 / CC-BY](https://freesound.org/help/faq/)
- [Freesound CC0 no-attribution thread](https://freesound.org/forum/legal-help-and-attribution-questions/35069/)
- [Kenney & free game SFX libraries — Gamine AI](https://gamineai.com/blog/12-best-free-sound-effect-libraries-game-developers)
- [Soundly commercial-use FAQ](https://getsoundly.com/faq/how-can-i-use-the-freesound-library/)
