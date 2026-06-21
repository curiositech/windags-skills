# UI Sound Design Principles

> Scope: audible feedback for **Harbor**, a native Rust **gpui** operator console for an AI agent fleet. Maritime / neobrutalism brand (mustard, navy, signal flags). This is the *audio* counterpart to `rust-gpui-motion`. It governs **when the app makes sound, what that sound means, and how loud it is allowed to be** — not the synthesis engine internals.
>
> One sentence to remember: **a desktop tool that pings is a desktop tool people mute, and a muted tool has no audio channel at all.** Restraint is not timidity; it is the only way to keep the channel alive.

---

## 0. The Harbor sound budget (read this first)

Harbor is an *ambient operator surface*. It runs all day in a background window while the operator works in an editor or terminal. That single fact dictates almost every decision below.

**Default posture: SILENT.** Audio is opt-in, off by default, and earns its way back on one sound at a time. The brand is loud *visually* (mustard, flags, hard borders); the brand is **quiet audibly**. Neobrutalism in sound is not a klaxon — it is one clean, confident, low-frequency *thunk* where a glassy product would have a shimmer.

**Total vocabulary ceiling: 6 sounds.** If a seventh sound is proposed, one of the six dies first. This is a hard cap, not a guideline. (Justification: the earcon literature — Blattner, Sumikawa & Greenberg 1989 — shows learnability collapses once families overlap; people stop distinguishing motives.)

### Decision Point — does this event get a sound at all?
Answer **all** of these "yes" or it stays silent:
1. Is the event **asynchronous** — happening when the operator is *not* looking at Harbor? (Sound's only superpower is reaching an eye that's elsewhere. Synchronous feedback for a button the user is staring at almost never needs audio.)
2. Is it **state-changing and consequential** — a fleet agent finished, a spend cap tripped, a guard blocked a commit — not cosmetic?
3. If the user **missed** it entirely, would that be a real problem worth a startle-risk?
4. Is there **no quieter channel** (a visual flag, a dock badge) that already covers it for an attentive user? (Sound *augments* the visual; it is never the only carrier — see §6.)

Three "yes"es and a "no other channel" → candidate for sound. Anything less → silent, visual-only.

---

## 1. The functional vocabulary

Six functions. Each maps to exactly one earcon. Names are load-bearing — use them in code (`Sound::Confirm`, `Sound::Arrival`) so the *intent* is legible at the call site, never the waveform.

| Function | Meaning in Harbor | Trigger example | Felt quality | When it fires |
|---|---|---|---|---|
| **confirm** | "Your deliberate action took." | `pd done` succeeded; sortie dispatched | short, dry, *closed* | only on **explicit user-initiated** commands, and only when the result isn't instantly visible |
| **error** | "It did not take / it is blocked." | guard rejected a commit; claim conflict | distinct timbre, **lower** pitch, never harsh | on failure of a user action, or a blocking condition the user must clear |
| **notify** | "Something wants your attention, no rush." | agent posted to your inbox; PR review landed | gentle, single, *un-urgent* | background events the operator can attend to whenever |
| **transition** | "A surface changed under you." | pane zoom/expand, view swap | barely-there, *textural* | rare; only for **large** spatial changes the eye might lose (pairs with gpui motion) |
| **arrival** | "A fleet agent came online / a task completed." | sortie finished; agent joined the swarm | warm, **rising** contour | the workhorse — async completion is Harbor's #1 audio job |
| **departure** | "An agent left / a session ended / something died." | session TTL'd out; agent crashed | warm, **falling** contour, sibling of arrival | the mirror of arrival; reuses the same motive inverted |

**arrival/departure are a matched pair.** Same instrument, same length, contour inverted (rising vs. falling pitch). This is a textbook earcon *family*: a shared motive with a single transformed parameter, so the operator learns one thing and gets two meanings. Do the same for **confirm/error** if you can (confirm = consonant resolve, error = the same gesture left unresolved / a minor-second below).

That's it. **notify** and **arrival** are *different* on purpose: arrival is "a unit of work you dispatched came back"; notify is "another actor is talking to you." If you can't articulate which bucket an event is in, it doesn't get a sound.

### Anti-Pattern — the "everything clicks" UI
- **Symptom:** every button, hover, toggle, and tab makes a sound. Within an hour the operator has muted the app system-wide.
- **Detection:** grep the call sites — if `play_sound(` appears on synchronous, user-is-looking interactions (hover, focus, ordinary button press), or if total distinct sounds > 6, you've failed.
- **Fix:** delete every synchronous-feedback sound. Audio is for the **async, the consequential, and the missed**. Let the visual + gpui motion carry synchronous feedback.

---

## 2. Restraint: every sound earns its place

The governing aesthetic is **subtraction**. A great UI sound budget reads like a haiku, not a synthesizer demo.

- **Start from zero.** Ship Harbor with audio *off by default*. Each sound is added only after it survives the §0 Decision Point in a real workday.
- **One sound per event class, not per event.** Twelve agents finishing in a burst should not fire twelve `arrival`s. **Coalesce** (see §3).
- **Silence is a designed state, not an absence.** The quiet between a `confirm` and the next `arrival` is what makes each one mean something. Carpet the app in sound and every sound becomes noise.
- **The mute test:** if a power user's first config change is "turn the sounds off," the sounds were wrong — not the user. Design so that the *default-on* sounds are ones people *leave* on.

### Decision Point — earcon vs. auditory icon
Two ways to map sound to meaning:
- **Auditory icon** — a sound that *resembles* its referent (a paper-crumple for delete, a metal-cabinet *clunk* for "file closed"). Leans on prior real-world association; near-zero learning cost; can feel literal/cute.
- **Earcon** — an abstract synthesized motive with a *learned* meaning, composable into families (arrival/departure as inverted contours). Higher initial learning cost; scales and stays consistent; reads as "designed," not "cartoon."

**Harbor's call: earcons, with one or two metaphorical leanings.** The fleet has no real-world soundtrack ("an AI agent arriving" makes no literal noise), so auditory *icons* have nothing to imitate — they'd be arbitrary cartoons. Use **abstract earcons** with *metaphorical* contour mapping (rising = arrival, falling = departure, lower pitch = error) so the family is internally consistent and on-brand. Reserve a single auditory-icon flourish — a short maritime *signal-flag flap* or a muted ship's-bell *ting* — as the brand-anchoring `notify`, since that one *does* have a real-world referent.

---

## 3. Psychoacoustics: clarity without fatigue

The difference between a sound people tolerate for eight hours and one that drives them to mute is mostly physics. Four parameters do the work.

### Frequency
- **Keep the spectral center mid-range, ~400 Hz–2.5 kHz**, where the ear is most sensitive and discrimination is easiest. Push toward the upper edge for *urgency* (error), lower for *calm* (confirm, departure).
- **Avoid the 2–5 kHz fatigue band** for *repeated* sounds. The ear's sensitivity peaks there (Fletcher-Munson); a 3 kHz `arrival` that fires 40×/day becomes an ice-pick. Round the top off with a gentle low-pass.
- **Avoid sub-200 Hz as the *carrier*** — laptop speakers can't reproduce it, so the sound vanishes on the move. A little low-end *body* under a mid carrier is fine; a sound that *lives* in the low end is inaudible on a MacBook.
- **Separate the six sounds by ≥ a minor third in pitch and/or by timbre.** Two earcons a semitone apart are indistinguishable in a noisy room — that's masking by similarity, the silent killer of earcon families.

### Duration
- **confirm / error: 80–150 ms.** Crisp, punctuating, gone.
- **arrival / departure: 200–400 ms** so the rising/falling contour is *perceivable* — a 60 ms glide reads as a click, not a gesture.
- **notify: ≤ 300 ms.**
- **transition: 60–120 ms**, sub-perceptual texture.
- **Hard ceiling: 500 ms.** Nothing in a productivity tool earns a half-second of the user's ear. (Compare: a video-game *level-up* fanfare runs 1–2 s — wrong genre. Harbor is a cockpit, not a slot machine.)

### Envelope (ADSR)
This is where fatigue is won or lost.
- **Soften the attack: 5–20 ms, never 0 ms.** A zero-attack transient *is* the startle reflex — a hard click on the leading edge is what makes a sound feel like a slap. The maritime/brutalist "thunk" still wants a *fast* attack, but a 10 ms ramp removes the click while keeping the punch.
- **Short, natural decay/release.** Let it ring out gently (exponential), don't gate it dead — a hard cutoff sounds broken/digital and snags attention wrongly.
- **No sustain** on UI sounds. Sustain = drone = the thing people mute.

### Masking & loudness
- **Loudness target: roughly –20 to –18 LUFS integrated** per sound, peaks ceilinged at **≤ –1.0 dBTP** (true peak) to leave headroom and avoid clipping on cheap speakers. This sits Harbor's UI sounds *under* typical media/music so they punctuate rather than dominate. (PlayStation's mobile spec is –18 LUFS; we sit at or slightly below it because we coexist with the user's music, not replace it.)
- **Normalize all six to the same perceived loudness**, then *attenuate error and notify slightly* if anything — never make any single sound the loudest thing in the room. The loudest sound in a 6-sound set trains people to flinch.
- **Coalesce bursts.** If N `arrival`s land within ~750 ms, play **one**. Twelve agents finishing should be one *ting*, not a machine-gun. (Energetic masking aside, rapid repetition is the #1 reported fatigue cause.)

### Anti-Pattern — the fatiguing arrival
- **Symptom:** by 4 p.m. the operator winces at every agent completion.
- **Detection:** the sound has a 0 ms attack, energy parked at 3–4 kHz, fires once per event with no coalescing, and is the loudest cue in the set.
- **Fix:** 10 ms attack ramp, low-pass above ~3 kHz, coalesce bursts within 750 ms, normalize to match the quietest functional sibling.

### Anti-Pattern — masked-into-mush sounds
- **Symptom:** "confirm" and "arrival" are indistinguishable to the operator.
- **Detection:** the two sounds sit within a semitone and share a timbre; you can't ID them blind.
- **Fix:** move them ≥ a minor third apart *and* change one parameter of timbre (e.g., confirm = dry plucked, arrival = soft bell). Contour + pitch + timbre should each carry redundant identity.

---

## 4. Accessibility (non-negotiable)

Sound is an **enhancement layer, never a sole carrier**. WCAG-aligned and beyond.

- **Never sound-only.** Every audible event has a *visual* equivalent that is fully sufficient on its own — a signal-flag flip, a badge, a toast, a log line. A Deaf or hard-of-hearing operator must lose **zero** information by never hearing a single beep. (This is also why audio-off-by-default is safe: the app is fully usable silent.)
- **No information lives *only* in pitch contour.** arrival-vs-departure is a *nicety* for hearing users; the visual must already distinguish "agent joined" from "agent left." Don't make pitch the only channel for a distinction.
- **Provide per-function volume + mute, not just a master toggle.** Some operators want `error` but not `notify`. A settings pane with six checkboxes + a master volume is the floor.
- **Honor an explicit Harbor "reduce sound" preference** as a sibling to OS *reduce-motion* — the same operators who set reduce-motion (vestibular sensitivity, ADHD overwhelm) often want minimal audio. Map "reduce sound" → only `error` survives.

### Quality Gate — accessibility
Before any sound ships, ALL must hold:
- [ ] The event is fully understandable with **audio muted**.
- [ ] No distinction depends solely on a sound parameter (pitch/timbre/contour).
- [ ] Per-function mute exists and works.
- [ ] A "reduce sound" preference exists and degrades gracefully to error-only (or silent).
- [ ] Captions/visual log entry exist for every audible notification.

---

## 5. Ethics & system citizenship

Harbor lives on the operator's machine, in their attention, all day. Audio is an intrusion into a shared space — treat it like a guest.

- **Respect system mute.** If the OS output is muted, Harbor is silent. No "but it's important" override. Ever. (gpui/CoreAudio respects this by default — *don't* fight it with a separate audio session that bypasses the mute switch.)
- **Respect Do-Not-Disturb / Focus.** When macOS Focus (or Windows DND) is active, suppress `notify` and `arrival` (the optional, attention-soliciting class). You may *queue* a visual badge. You may keep `error` only if it's blocking the user's own in-progress action — never for ambient fleet chatter. **Default: when in doubt under DND, stay silent and badge.**
- **No startle.** Covered acoustically in §3 (attack ramp, loudness ceiling, true-peak headroom) — restating as ethics because a startle response is an involuntary stress hit, not an annoyance. **A UI has no right to spike someone's cortisol.** First sound after launch should never be at full volume into a silence — ramp the audio subsystem in.
- **No dark-pattern audio.** Never use sound to manufacture urgency, anxiety, or engagement (no "you have unread items!" nag tones, no escalating-pitch pressure). Harbor reports the fleet's reality; it doesn't manipulate the operator into checking it.
- **Real volume control, sensible default.** Master volume slider in settings; default audio **off**, and when enabled, default master to ~50–60% so the first experience is *quiet* and the user *opts up* — never the reverse.
- **No audio on launch / no "brand sting."** Harbor does not announce itself with a startup chime. The operator opened a cockpit, not a console game.

### Anti-Pattern — the DND override
- **Symptom:** operator sets macOS Focus for a deep-work block; Harbor `notify`s anyway because "an agent finished."
- **Detection:** the playback path doesn't query Focus/DND state, or has an `important: true` bypass.
- **Fix:** gate all `notify`/`arrival`/`transition` playback behind a DND check; allow only blocking-`error` through, and only when tied to the user's own foreground action. Badge the rest.

---

## 6. Sound ⇄ motion: pair them, don't duplicate them

Harbor already has `rust-gpui-motion`. Audio and motion are **redundant channels for the same meaning**, not two separate notification systems.

- **Pair, don't double-notify.** A pane `transition` that *animates* (slide/zoom) may carry a whisper-quiet textural sound — one event, two senses. Two *separate* systems each deciding to alert about the same thing = clutter.
- **Co-gate on reduce-motion AND reduce-sound.** If the operator set reduce-motion, assume sensory-load sensitivity and *also* trim audio to essentials. The two preferences are correlated; treat "reduced sensory load" as the real intent.
- **Sync the envelopes.** Match audio attack to the motion's ease-in and audio release to the motion's settle, so the *thunk* lands when the pane *lands*. A sound that fires 80 ms before the animation completes feels broken.

---

## 7. Implementation notes (Rust / gpui)

- **Bundle pre-rendered assets, don't synth at runtime.** Ship six small **48 kHz / 24-bit WAV or Ogg** one-shots in the app bundle, pre-mixed to the §3 loudness targets. Real-time synthesis (an oscillator + ADSR in code) is *possible* but buys you nothing and risks per-platform drift — bake the envelope into the file.
- **Playback crate:** `rodio` (on `cpal`) is the pragmatic default for one-shot UI cues — decode once into a cached `SamplesBuffer`, replay from memory, never hit disk on the hot path. `kira` is the upgrade if you later want bus-level ducking/coalescing logic in audio-land rather than app-land. Avoid pulling a full game-audio engine for six beeps.
- **Respect the system mute/DND state explicitly in your gate** before you even call `play()` — don't rely solely on the OS swallowing it; you want to *skip* the playback so you can badge instead.
- **Coalescing belongs in the app layer:** a 750 ms debounce keyed by `Sound` variant, so a burst of `arrival`s collapses to one. Implement it once, in the sound dispatcher, not at every call site.
- **One dispatcher, typed by function.** `enum Sound { Confirm, Error, Notify, Transition, Arrival, Departure }` and a single `play(sound: Sound)` that owns: the DND/mute gate, the per-function-mute check, the reduce-sound check, the coalescing debounce, and loudness. **No call site touches a file path or a volume number.** This is the single chokepoint that keeps all the rules above enforceable.

### Quality Gate — before any sound ships
- [ ] Total distinct sounds ≤ 6, each mapped to one §1 function.
- [ ] Default state: **audio off**; when on, master defaults ≤ 60%.
- [ ] Every sound: attack ≥ 5 ms, duration ≤ 500 ms, integrated ≈ –20…–18 LUFS, true peak ≤ –1 dBTP.
- [ ] The six are mutually distinguishable blind (≥ minor-third and/or timbre apart).
- [ ] Full info parity with audio muted (§4 gate passes).
- [ ] DND/Focus + system-mute gate verified (§5 anti-pattern can't reproduce).
- [ ] Bursts coalesce within 750 ms.
- [ ] No launch chime; no synchronous hover/focus/press sounds.

---

## TL;DR

1. **Silent by default.** Six sounds, hard cap. Each survives the §0 Decision Point or it doesn't exist.
2. **Vocabulary:** confirm · error · notify · transition · arrival · departure — arrival/departure and confirm/error are inverted-contour *families*.
3. **Audio is for the async, consequential, and missed** — never synchronous feedback the user is already watching.
4. **Physics of non-fatigue:** mid-band frequency, ≤500 ms, ≥5 ms attack (no startle clicks), ~–18 LUFS / –1 dBTP, coalesce bursts.
5. **Earcons over auditory icons** (the fleet has no real-world soundtrack); one maritime signal-flag/bell flourish as the brand anchor.
6. **Never sound-only; respect mute + DND; real volume control; no manufactured urgency.**
7. One typed dispatcher owns every rule. No call site sets a path or a number.

**Sources:**
- [Blattner, Sumikawa & Greenberg — *Earcons and Icons: Their Structure and Common Design Principles* (HCI 1989)](https://www.tandfonline.com/doi/abs/10.1207/s15327051hci0401_1)
- [Auditory Icons, Earcons, and Speech — Hearing Health & Technology Matters](https://hearinghealthmatters.org/waynesworld/2023/auditory-icons-earcons-speech/)
- [Bhatara et al. — *Designing Emotional and Intuitive Sounds for Tech: Insights From Psychoacoustics* (Wiley, 2025)](https://onlinelibrary.wiley.com/doi/full/10.1155/hbe2/5925146)
- [BeepBank-500: A Synthetic Earcon Mini-Corpus for UI Sound and Psychoacoustics Research (arXiv 2025)](https://arxiv.org/pdf/2509.17277)
- [The Role of Sound Design in UX Design — UXmatters (2024)](https://www.uxmatters.com/mt/archives/2024/08/the-role-of-sound-design-in-ux-design-beyond-notifications-and-alerts.php)
- [Sensory Inclusive Design in UX: Beyond Visual Disabilities — UX Bulletin](https://www.ux-bulletin.com/sensory-inclusive-design-in-ux/)
- [Mastering a Game with Wwise, Part 1 — Audiokinetic Blog (LUFS/true-peak targets)](https://www.audiokinetic.com/en/blog/mastering-a-game-with-wwise-part1/)
- [Guide: Balancing a Game's Loudness — VNDev Wiki (LUFS defaults, 50–75% volume default)](https://vndev.wiki/Guide:Balancing_a_Game's_Loudness)
- [Notifications and Do Not Disturb in Windows — Microsoft Support](https://support.microsoft.com/en-us/windows/notifications-and-do-not-disturb-in-windows-feeca47f-0baf-5680-16f0-8801db1a8466)
