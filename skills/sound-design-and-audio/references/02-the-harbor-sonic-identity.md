# The Harbor Sonic Identity

> A maritime motif kit for the Harbor operator console — soft sonar pings, water laps, ship's bells, distant foghorns, signal-flag whooshes, rope creaks — mapped to agent-fleet events. This is a *system*, not a folder of free samples. Every cue is a member of one family, tuned so an operator can run the fleet with their eyes on another monitor and still know, by ear alone, that a dispatch landed, an agent went down, or a cost threshold tripped.

**Audience:** the engineer wiring `rodio`/`kira` into the gpui app, and the designer (or the synthesis script) producing the WAVs. Read it as a contract: the **Sound Map** table is the source of truth; everything else justifies the numbers.

**Scope:** functional event audio for a single-operator desktop console. Not music, not voice, not ambient generative soundscape (that's a separate, later document). Every cue here is ≤ 1.2 s and earns its place by closing an interaction loop or raising an alarm.

---

## 1. Why a sonic identity at all

An **earcon** is a brief, abstract audio cue that stands for an action or event the way an icon stands for a function ([AUX NYC](https://www.auxnyc.com/blog-posts/earcons-small-sounds-mean-big-business)). The console is glanceable but not always *glanced at* — the operator is steering agents in one window while reading a diff in another. Functional audio closes the loop the screen can't: the message-sent *whoosh*, the lock *click*, the alarm that says *look now* ([UXmatters](https://www.uxmatters.com/mt/archives/2024/08/the-role-of-sound-design-in-ux-design-beyond-notifications-and-alerts.php)).

The trap most products fall into: **every alert sounds equally urgent, so users learn to ignore all of them** ([Design Project](https://www.newsletter.designproject.io/p/sonic-branding-strategy-why-audio-design-is-your-secret-ux-weapon-in-2025)). The Harbor kit defends against this with a strict **urgency hierarchy** (§4) and a **rate-limit / debounce policy** (§7). A fleet of 30 agents hopping and dispatching generates thousands of events an hour; if each one beeped, the console would be unusable in ninety seconds.

### Decision Point — earcons vs. recorded foley

We use **synthesized abstract earcons with maritime *gestural* shaping**, not field-recorded foley. A literal 2-second recording of an actual ship's bell is too long, too loud, and too uncontrollable for a UI loop. Instead we synthesize a bell-*like* tone (inharmonic partials, fast attack, long ring) at a controlled length and pitch. The maritime motif lives in the **gesture and timbre family**, not in literal samples. This keeps every cue short, loudness-normalized, and tunable from a single synthesis script (§6).

> **Why this matters for brand:** maritime/neobrutalism is the *visual* brand — mustard, navy, signal flags. The audio brand is the *gesture vocabulary*: sonar, water, bell, horn, whoosh, creak. A listener should be able to say "that's the harbor app" without ever seeing it, the same way you know the Slack knock or the macOS *Tink*.

---

## 2. The family system (the part that makes it coherent)

A sound family is built from **related motives** — short pitched gestures — that share timbre, register, and envelope so the ear groups them as "one voice" ([Earcons & Icons, Blattner et al.](https://dl.acm.org/doi/abs/10.1207/s15327051hci0401_1); [academia.edu PDF](https://www.academia.edu/121598749/Earcons_and_Icons_Their_Structure_and_Common_Design_Principles)). Coherence comes from **shared timbre, register, volume, and mix qualities deployed consistently** across the set ([Design Project](https://www.newsletter.designproject.io/p/sonic-branding-strategy-why-audio-design-is-your-secret-ux-weapon-in-2025)).

The Harbor kit enforces coherence through four shared anchors:

| Anchor | Decision | Rationale |
|---|---|---|
| **Tonal center** | All pitched cues sit in **D minor pentatonic** (D / F / G / A / C), anchor pitch **D4 = 293.66 Hz** | A fixed scale means any two cues that fire close together still consonate. Pentatonic has no semitone clashes, so overlapping events never sound "wrong." Minor reads as serious/operational, not cheerful. |
| **Register bands** | Routine = **293–587 Hz** (D4–D5); alarms = **descend below 200 Hz** or **stab above 1 kHz** | Routine events live in a comfortable mid band; alarms deliberately *leave* it (down to the foghorn, up to the failure stab) so urgency is encoded in register, not just volume ([BeepBank-500](https://arxiv.org/pdf/2509.17277) uses 350/500/750/1000 Hz nominal centers for exactly this low→high coverage). |
| **Envelope grammar** | Three presets: **`ping` (pluck)**, **`swell` (soft pad)**, **`stab` (hard transient)** | Maps directly to event class. Confirmations pluck, ambient/state-change swells, alarms stab. ([BeepBank-500](https://arxiv.org/pdf/2509.17277) ships `adsr_fast` / `adsr_med` / `percussive` for the same reason.) |
| **Loudness** | Every asset normalized to **−23 LUFS integrated**, true-peak **≤ −2 dBTP** (see §5) | One normalization target means relative urgency is *designed in via mix*, not an accident of which sample was recorded louder. |

### The motive map (pitch relationships)

The family reads as a single instrument because the cues are literally *intervals of one chord*:

```
        UP = good / arrival / completion          DOWN = departure / loss / alarm
        ──────────────────────────────►          ◄──────────────────────────────
  D5 ·············· approve-&-land (D4→A4→D5 rising) ·· dispatch-arrives (A4→D5)
  A4 ·· board (A4) ····· steer-send (D5→A4 falling whoosh)
  G4 ·· hop (G4, single, quietest) ····· flag-change (G4↔A4 two-tone)
  F4 ·· spawn/cast-off (D4→F4 rising open-fifth-ish) ··
  D4 ·· (anchor) ····················· cost-threshold (D3, octave below, AM roughness)
  ────────────────────────────────────────────────────────────────────────────
  sub  ····················· agent-FAILED (foghorn G2≈98Hz, descending, longest)
```

Three gestural rules, applied everywhere:

1. **Rising interval = something began or succeeded** (spawn, dispatch-arrives, approve-&-land). Up = positive, the standard UX gestural association ([Design Project](https://www.newsletter.designproject.io/p/sonic-branding-strategy-why-audio-design-is-your-secret-ux-weapon-in-2025)).
2. **Falling interval = something left or was lost** (steer-send goes *out*, agent-FAILED, foghorn drops).
3. **Single flat tone = a neutral tick** (hop, board) — the heartbeat of routine activity, deliberately the quietest things in the kit.

---

## 3. The Sound Map (source of truth)

This is the contract. Synthesis script targets these numbers; the wiring layer maps these event IDs.

| Event (fleet verb) | Maritime motif | Pitch / interval | Length | Envelope | Rel. loudness | Texture & timbre notes |
|---|---|---|---|---|---|---|
| **spawn / cast-off** | Rope creak → soft sonar ping | **D4→F4** rising (294→349 Hz), ping on F4 | 320 ms | `swell`→`ping` (40 ms attack, 280 ms decay) | −26 LUFS (quiet) | Short filtered-noise "creak" (60 ms, band-pass 300–800 Hz, slight pitch-up) then a clean sine ping. Reads as *something leaving the dock.* |
| **board** (agent attached / opened) | Single soft sonar ping | **A4** (440 Hz), flat | 180 ms | `ping` (5 ms attack, 175 ms exp decay) | −26 LUFS | Pure-ish sine + 2nd partial at −12 dB. Warm, neutral, the "you're here" tick. |
| **steer-send** (operator → agent msg) | Signal-flag whoosh, falling | **D5→A4** falling (587→440 Hz) | 220 ms | `swell` (10 ms attack, fast 150 ms decay) | −24 LUFS | Pitched filtered noise sweeping band-pass 1.2 kHz→500 Hz over the fall. The *whoosh of the flag run up the halyard going out.* Directional = outbound. |
| **hop** (agent step / heartbeat) | Faint water lap | **G4** (392 Hz), flat, lowpassed | 90 ms | `ping` (3 ms attack, 87 ms decay) | **−30 LUFS (quietest)** | Heavily lowpassed (cutoff 1 kHz) sine with tiny noise "plip." This fires *constantly* — it must be felt more than heard. Subject to hard debounce (§7). |
| **dispatch-arrives** (result returns) | Sonar ping, rising answer | **A4→D5** rising (440→587 Hz) | 260 ms | `ping`×2 (two plucks 110 ms apart) | −23 LUFS | Two clean sine pings, the second a fourth up. The classic sonar "return echo." Brighter than `board` — *something came back.* |
| **approve-&-land** (PR merged / job done) | Ship's bell, three-note rise | **D4→A4→D5** (294→440→587) | 700 ms | `ping`×3, bell timbre, long ring | −22 LUFS (the reward) | Inharmonic bell partials (1.0, 2.76, 5.40, 8.93 × f), 8 ms attack, 650 ms ring with shimmer. The single most *satisfying* cue — completion deserves resonance. Use sparingly; it's the dopamine. |
| **agent-FAILED** | Distant foghorn, descending | **G2→D2** (≈98→73 Hz) descending | **1100 ms** (longest) | `swell` (60 ms attack, slow 900 ms decay) | **−20 LUFS (loudest)** | Stacked low sawtooth+sine, lowpass 400 Hz, slow vibrato (4 Hz), slight detune for the mournful "wrongness." This is the only cue that goes sub-bass and the only one that's *meant to interrupt.* |
| **flag-change** (state/status flip) | Two-tone signal flag | **G4↔A4** (392↔440), two pips | 240 ms | `stab`×2 (3 ms attack, 100 ms each) | −25 LUFS | Two short square-ish pips a whole tone apart. Direction encodes polarity: **up G→A = promoted/green**, **down A→G = demoted/red**. Neobrutalist: blunt, square, no reverb. |
| **cost-threshold** (budget alarm) | Ship's bell, alarmed (rapid) | **D3** (147 Hz) + **AM roughness** | 600 ms | `stab`→ring, AM 8 Hz depth 0.4 | −21 LUFS (alarm tier) | Bell timbre an octave below `approve`, with **8 Hz amplitude modulation** for the "this is an alarm" roughness cue ([BeepBank-500](https://arxiv.org/pdf/2509.17277): AM rate {0,8,30} Hz, depth {0,0.3,0.5} encodes urgency). Three rapid strikes. *Money is burning.* |

**Reading the loudness column:** these are *relative authored* levels *after* −23 LUFS normalization is applied as the asset baseline; the relative offsets are achieved by mix/limiting *within* the asset (a quieter cue has more headroom to its peak), not by shipping un-normalized files. See §5 for the exact gate.

---

## 4. Urgency hierarchy (the tiering that prevents alarm fatigue)

Borrowing the tiered model from modern UI sound systems — distinctive earcons for core actions, subtle functional sounds for common interactions, ambient for context ([Design Project](https://www.newsletter.designproject.io/p/sonic-branding-strategy-why-audio-design-is-your-secret-ux-weapon-in-2025)) — Harbor cues fall into four tiers:

| Tier | Name | Events | Loudness band | Default in `quiet` mode? |
|---|---|---|---|---|
| **0** | **Heartbeat** | hop | −30 LUFS | **muted** |
| **1** | **Confirmation** | board, spawn, steer-send, flag-change | −24 to −26 LUFS | on |
| **2** | **Reward** | dispatch-arrives, approve-&-land | −22 to −23 LUFS | on |
| **3** | **Alarm** | agent-FAILED, cost-threshold | −20 to −21 LUFS | **always on (cannot be muted without explicit override)** |

> **Rule:** loudness *increases* monotonically with tier, and only Tier 3 may use sub-bass (foghorn) or AM-roughness (cost alarm). That's two reserved "this is serious" timbres the routine tiers never touch — so an alarm is unmistakable even at low volume ([BeepBank-500](https://arxiv.org/pdf/2509.17277) on AM as an urgency cue; NN/g via [Design Project] on hierarchy of sonic urgency).

---

## 5. Loudness & format spec (the engineering gate)

UI cues need a normalization target so no single sample blasts the operator. The streaming world standardized on **LUFS per ITU-R BS.1770 / EBU R128** ([LuvLang](https://luvlang.studio/blog/lufs-explained); [Alessandro Fois](https://alessandrofois.com/en/mastering-guide-for-streaming-platforms-lufs-and-loudness-normalization/)). We adopt the **EBU R128 broadcast target of −23 LUFS integrated** as the *asset baseline* rather than the −14 LUFS streaming-music target ([Spotify](https://support.spotify.com/us/artists/article/loudness-normalization/), [YouTube]) — because these are *interruptions over silence on a desktop*, not music competing for loudness, and −14 would be fatiguing for a cue that fires hundreds of times a session.

| Parameter | Target | Why |
|---|---|---|
| Integrated loudness (asset baseline) | **−23 LUFS** (EBU R128) | Calm desktop interruption level; headroom for relative tiering ([Alessandro Fois](https://alessandrofois.com/en/mastering-guide-for-streaming-platforms-lufs-and-loudness-normalization/)). |
| True peak ceiling | **≤ −2 dBTP** | Prevents transcode/codec clipping; stricter than the −1 dBTP streaming minimum ([Spotify](https://support.spotify.com/us/artists/article/loudness-normalization/)) because alarm stabs have sharp transients. |
| Relative tier offsets | −30 → −20 LUFS across tiers 0–3 | Encodes urgency in the mix, designed not accidental. |
| Sample rate | **48 kHz** | Matches `cpal`/CoreAudio default; no resample on playback. |
| Bit depth | 24-bit PCM source → ship 16-bit | 24-bit for authoring headroom, 16-bit WAV for the bundle. |
| Format | **WAV (PCM)** in the app bundle | Zero decode latency vs. mp3/vorbis; cues must fire in < 10 ms. `rodio` decodes wav natively ([rodio docs](https://docs.rs/rodio)). |
| Channels | Mono | Pan is decorative for UI cues; mono halves the asset size and plays identically on any output. |
| Fade | 5–10 ms fade-out floor on every asset | Kills end-of-buffer clicks; non-negotiable. |

### Anti-Pattern — the un-normalized sample folder
**Symptom:** the failure horn is barely audible but the hop tick makes you jump.
**Detection:** run an LUFS meter (e.g. `ffmpeg -af loudnorm=print_format=json -f null -`) across the asset folder; any file deviating > ±1.5 LU from its tier target is a defect.
**Fix:** re-render through the synthesis script's normalization stage (§6); never hand-tweak gain in an editor. Normalization is a build step, not a vibe.

---

## 6. Synthesis approach (how the assets get made)

These cues are **procedurally synthesized**, not recorded. Two viable paths; pick based on whether assets are baked at build time or generated live:

### Path A — bake WAVs offline (recommended)
A small Python script using `numpy` renders each cue from the Sound Map params, applies the ADSR envelope, applies AM where specified, normalizes to the tier LUFS target (via `pyloudnorm`), limits true-peak to −2 dBTP, and writes 16-bit/48 kHz mono WAV. Committed assets, reproducible, auditable in CI. **This is the source of truth for the assets.**

Envelope presets (durations from [BeepBank-500](https://arxiv.org/pdf/2509.17277)'s 100/250/500 ms × `adsr_fast`/`adsr_med`/`percussive` grammar; ADSR semantics per [Native Instruments](https://blog.native-instruments.com/adsr-explained/)):

```
ping   (pluck):   A=3-8ms    D=exp to -inf   S=0      R=n/a     → confirmations, sonar
swell  (pad):     A=40-60ms  D=slow          S=0.6    R=200ms+  → cast-off, foghorn
stab   (transient): A=2-3ms  D=fast 80-120ms S=0      R=n/a     → flag-change, cost alarm
```

Bell timbre = sum of inharmonic partials at frequency ratios **1.0, 2.76, 5.40, 8.93** (classic struck-metal series), each partial with its own faster decay on the upper partials so the tone "settles" into the fundamental as it rings.

### Path B — synthesize live in Rust
`rodio` ships source generators (`SineWave`, plus you compose noise/envelopes) and procedural-audio utilities ([rodio docs](https://docs.rs/rodio); [lib.rs](https://lib.rs/crates/rodio)); `kira` ([kira docs](https://docs.rs/kira/latest/kira/)) is the stronger choice if you want per-cue tweening, built-in clock-scheduled playback, and effect sends (a shared lowpass/limiter bus) without rolling your own mixer. Use this only if cues must vary at runtime (e.g. pitch-shift the hop by agent index). **Default to Path A**; Path B is for the day someone wants the dispatch ping to encode *which lane* returned.

### Decision Point — `rodio` vs `kira`
- **`rodio`**: simplest, battle-tested, decodes WAV, plays a one-shot in three lines. Pick for Path A playback. ([github.com/RustAudio/rodio](https://github.com/RustAudio/rodio))
- **`kira`**: game-audio oriented — clocks, tweens, effect buses, spatial. Pick if you need a shared limiter bus, ducking (drop hop volume when an alarm plays), or scheduled sequences. ([kira docs](https://docs.rs/kira/latest/kira/))

For v1: **`rodio`, baked WAVs, one shared `OutputStream`, fire-and-forget `play_raw`.** Add `kira` only when ducking becomes necessary.

---

## 7. Playback policy (the part that keeps it from being hell)

The fleet is loud in the *event* sense. Policy is what makes the *audio* quiet enough to live with. Interface audio must be **immediate and brief** to avoid disrupting flow ([NN/g via Design Project](https://www.newsletter.designproject.io/p/sonic-branding-strategy-why-audio-design-is-your-secret-ux-weapon-in-2025)).

| Mechanism | Rule | Reason |
|---|---|---|
| **Heartbeat debounce** | `hop` plays at most **once per 800 ms**, regardless of how many agents hopped. Coalesce. | 30 agents × multiple hops/sec = a buzzsaw. One tick per ~second reads as "fleet alive." |
| **Confirmation throttle** | Tier 1 cues: max **1 per 250 ms** per event type; collapse bursts to a single play. | Rapid-fire boards during a fan-out should sound like *one* board, not a machine gun. |
| **Alarm priority + duck** | Tier 3 always plays; when it does, **duck Tiers 0–1 by −12 dB** for its duration (kira bus) or simply suppress them (rodio). | The failure horn must never be masked by routine ticks. |
| **Alarm de-dupe** | Same alarm (e.g. cost-threshold) won't re-fire within **5 s** unless the value crossed a *new* threshold. | One agent thrashing a budget shouldn't ring ten times. |
| **Global gain + mute** | User-facing **volume slider (0–100%)**, a **mute toggle**, and a **`quiet` preset** (mutes Tier 0, halves Tier 1). | Sound must be optional and controllable ([Design Project](https://www.newsletter.designproject.io/p/sonic-branding-strategy-why-audio-design-is-your-secret-ux-weapon-in-2025); [Material](https://m2.material.io/design/sound/applying-sound-to-ui.html)). |
| **Tier-3 override** | Even in `quiet`/muted, alarms still play *unless* the user explicitly checks "silence alarms too" with a confirmation dialog. | You do not let someone accidentally mute the building's fire alarm. |
| **Focus awareness** | When the app is backgrounded, Tier 0–1 suppressed; Tier 2–3 still play (optionally as OS notifications with sound). | A merged PR / dead agent matters when you're away; a hop doesn't. |

### Anti-Pattern — the unthrottled event bus
**Symptom:** opening the fleet view during a big fan-out produces a wall of overlapping pings; the operator reaches for the mute button and never turns it back on.
**Detection:** instrument cue plays/sec; if any 1-second window exceeds ~4 audible plays in normal operation, throttling is broken.
**Fix:** debounce/coalesce at the *event → cue* mapping layer (§7 table), not at the synth. The mapping layer owns rate; the player just plays.

### Anti-Pattern — alarm-as-routine drift
**Symptom:** `agent-FAILED` fires so often (flaky agents) it becomes background noise; operators stop reacting.
**Detection:** if Tier-3 plays > ~6×/hour sustained, the *failure rate*, not the sound, is the bug — but the sound will mask it.
**Fix:** the de-dupe + new-threshold rule (§7) plus surfacing a *visual* "N failures in last 10 min" badge. Audio flags the edge; it doesn't narrate a flood.

---

## 8. Accessibility & honesty

- **Audio is never the only channel.** Every cue has a visual twin (toast, badge, log line, flag color). For Deaf/HoH operators and muted environments the console is fully usable silently. Sound *augments*; it never *is* the information ([Material](https://m2.material.io/design/sound/applying-sound-to-ui.html)).
- **Reduced-motion ↔ reduced-audio parity.** If the OS/app signals "reduce motion," default the sound preset to `quiet`. Same user, same sensitivity.
- **No locked volume.** The app's slider is independent of and respectful to system volume; we never force loud.
- **Test across outputs.** Verify on laptop speakers, AirPods, and a desk monitor — the foghorn's sub-bass that's lovely on headphones may be inaudible on a laptop ([WANDR](https://wandrstudio.medium.com/ui-sounds-for-a-better-user-experience-31603b494754)). If a Tier-3 alarm is inaudible on laptop speakers, add a mid-frequency partial; do not just raise gain.

---

## 9. Quality Gates (ship checklist)

A cue ships only when **all** pass:

1. **Loudness gate** — integrated LUFS within ±1.5 LU of its tier target; true peak ≤ −2 dBTP. (CI: `ffmpeg loudnorm` JSON probe across the asset dir.)
2. **Length gate** — within ±15% of the Sound Map length; nothing > 1.2 s except `agent-FAILED`.
3. **Click gate** — every asset has ≥ 5 ms fade-out; zero-crossing or faded at both ends. No buffer-edge clicks.
4. **Family gate** — pitched cue lands on a D-minor-pentatonic degree (D/F/G/A/C); off-scale = reject.
5. **Hierarchy gate** — measured loudness is monotonic by tier (hop quietest, alarms loudest). A Tier-1 cue louder than a Tier-2 cue is a defect.
6. **Reserved-timbre gate** — only Tier 3 uses sub-bass (< 200 Hz fundamental) or AM roughness. Any routine cue doing so is a defect.
7. **Throttle gate** — simulate a 30-agent fan-out; audible plays/sec stays ≤ 4 in normal mode. (Integration test against the event→cue mapping.)
8. **Blind-test gate** — an operator who hasn't seen the map can, after one pass, distinguish *arrival* (rising) from *departure/loss* (falling) and *routine* from *alarm*. If the gesture grammar isn't legible by ear, the kit failed its one job.

---

## 10. Open questions (honest scope edges)

- **Per-lane / per-agent pitch coding** — encoding *which* lane returned by transposing the dispatch ping. Powerful, but risks turning the kit into atonal chaos at 30 agents. Deferred to Path B + a real listening study; do not ship blind.
- **Ambient generative bed** — a near-silent harbor-at-night drone whose density tracks fleet activity (more agents → more water/gulls). Genuinely nice, genuinely a separate document and a real risk of fatigue. Out of scope here.
- **Spatialization** — panning cues by on-screen pane position (kira spatial). Tempting; likely gimmick on a single desktop. Park it.

These are real features with real cost. Flagging them as *more than a session's work* rather than stubbing a half-version.

---

**Sources:**
- [Earcons & The Advantages of Sonic Branding — AUX NYC](https://www.auxnyc.com/blog-posts/earcons-small-sounds-mean-big-business)
- [Earcons and Icons: Their Structure and Common Design Principles — Blattner et al. (ACM)](https://dl.acm.org/doi/abs/10.1207/s15327051hci0401_1) / [PDF](https://www.academia.edu/121598749/Earcons_and_Icons_Their_Structure_and_Common_Design_Principles)
- [BeepBank-500: A Synthetic Earcon Mini-Corpus — arXiv 2509.17277](https://arxiv.org/pdf/2509.17277)
- [Sonic Branding Strategy: Why Audio Design Is Your Secret UX Weapon in 2025 — Design Project](https://www.newsletter.designproject.io/p/sonic-branding-strategy-why-audio-design-is-your-secret-ux-weapon-in-2025)
- [The Role of Sound Design in UX Design — UXmatters](https://www.uxmatters.com/mt/archives/2024/08/the-role-of-sound-design-in-ux-design-beyond-notifications-and-alerts.php)
- [Applying sound to UI — Material Design](https://m2.material.io/design/sound/applying-sound-to-ui.html)
- [UI Sounds for a Better User Experience — WANDR](https://wandrstudio.medium.com/ui-sounds-for-a-better-user-experience-31603b494754)
- [LUFS Explained — LuvLang](https://luvlang.studio/blog/lufs-explained)
- [Mastering for Streaming: LUFS and Loudness Normalization — Alessandro Fois](https://alessandrofois.com/en/mastering-guide-for-streaming-platforms-lufs-and-loudness-normalization/)
- [Loudness normalization — Spotify](https://support.spotify.com/us/artists/article/loudness-normalization/)
- [ADSR Explained — Native Instruments](https://blog.native-instruments.com/adsr-explained/)
- [rodio — docs.rs](https://docs.rs/rodio) / [RustAudio/rodio — GitHub](https://github.com/RustAudio/rodio) / [lib.rs](https://lib.rs/crates/rodio)
- [kira — docs.rs](https://docs.rs/kira/latest/kira/)
