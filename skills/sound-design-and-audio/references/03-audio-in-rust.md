# Audio in Rust — Playing and Synthesizing Sound in a Native gpui App

> Scope: the Harbor operator console is a native Rust [gpui](https://www.gpui.rs/) desktop app. It needs *cues*, not a DAW: short feedback blips when an agent claims a file, a low navy drone when the fleet is healthy, a sharp signal-flag chime on escalation, ducked when a voice readout fires. This doc is the audio stack for that: which crate, what architecture, how to never block the render thread, and how to make synthesized cues that don't sound like a 1998 error dialog.
>
> Versions current as of mid-2026: `cpal 0.15`, `rodio 0.21`, `kira 0.10`, `fundsp 0.23`, `symphonia 0.5`, `oddio 0.7`. Pin exact minors — every one of these breaks API across minor bumps.

---

## The crate landscape

You are choosing a layer, not a library. From the metal up:

| Crate | Layer | What it gives you | What it costs |
|---|---|---|---|
| **cpal** | device I/O | Raw cross-platform output/input stream + audio callback. CoreAudio / WASAPI / ALSA / JACK. Nothing else. | You write the mixer, the resampler, the format decode, the lifetime juggling. |
| **rodio** | playback | `Sink`/`SpatialSink`, decode via symphonia, `Source` trait combinators (`.amplify`, `.fade_in`, `.speed`). Built on cpal. | Pull-based per-source iterators; no real bus graph, no first-class ducking, coarse mixing. |
| **kira** | game/app audio engine | Mixer with named **tracks** (a real console: main + sub-tracks), tweens, clocks, effects (filter, reverb, delay, EQ, compressor), spatial scenes. Built on cpal. | Heavier; its own command/handle model; opinionated. |
| **fundsp** | DSP / synthesis | Inline graph notation (`sine() * 0.2 >> lowpass_hz(800.0, 1.0)`), zero-cost typed networks, oscillators, envelopes, filters, noise, reverb. | Not a player — produces samples. You still need cpal/kira to hear it. |
| **symphonia** | decode | Pure-Rust decoders: WAV, FLAC, MP3, AAC, OGG/Vorbis, ALAC. The decode backend rodio/kira use. | Decode only. |
| **oddio** | spatial mixer | Lightweight, lock-free-ish spatial mixer designed for the audio thread. HRTF-ish panning, low alloc. | Sparse; smaller ecosystem; you wire cpal yourself. |

### Decision Point: which one for the Harbor console?

**Default: `kira`.** A console app wants *named buses* ("ui", "ambient", "alerts"), volume tweens, and ducking — kira gives all three out of the box, runs its mixer on its own thread, and hands you cheap clonable handles you poke from the UI thread. That is exactly the gpui integration shape you want (see [Threading](#threading--never-touch-the-audio-thread-from-render)).

**Use `fundsp` *alongside* kira** when a cue is procedural — a drone whose pitch tracks fleet load, a chime synthesized from the brand's signal-flag palette rather than a baked WAV. Render the fundsp graph into a buffer or feed it through a kira `Sound` impl.

**Drop to `rodio`** only if you need nothing but "play this short WAV now, occasionally fade." It's the smallest dependency and the least to learn. The moment you need a second bus you can duck independently, you'll wish you'd started on kira.

**Drop to raw `cpal` + `fundsp`/`oddio`** only if you are building the mixer yourself for a reason (sample-accurate scheduling kira's clock can't express, a custom spatializer). For an operator console this is over-engineering — note it as a non-goal.

**Anti-Pattern: starting on cpal "to stay close to the metal."**
- *Symptom:* week-two PRs reimplementing a voice pool, an SPSC ring buffer, and float resampling that kira already ships and tests.
- *Detection:* your crate graph has `cpal` but not `kira`/`rodio`, and `src/audio/` is over ~600 lines.
- *Fix:* adopt kira; keep cpal only as kira's backend feature. Reserve hand-rolled cpal for a documented, benchmarked need.

---

## Architecture: mixer, buses, voice pool, latency

Think of the audio subsystem as a **headless service** the UI talks to by sending small commands. It owns one output stream and one mixer; the UI owns nothing but handles.

```
gpui UI thread  ──cmd──►  AudioService (owns kira AudioManager)
   (App/Context)            │
                            ├─ track "master"
                            │     ├─ track "ui"      (blips, claims, toggles)
                            │     ├─ track "ambient" (fleet-health drone)
                            │     └─ track "alerts"  (escalation chime, voice)
                            │
   kira spawns ───────────► audio render thread (cpal callback)
                            │  pulls voices → mixes → resamples → device
```

### Bus layout (concrete)

Give every category its own sub-track so you can set volume, mute, and duck independently:

```rust
use kira::{AudioManager, AudioManagerSettings, DefaultBackend};
use kira::track::{TrackBuilder, TrackHandle};

pub struct AudioService {
    manager: AudioManager<DefaultBackend>,
    ui: TrackHandle,       // claims, toggles, hover blips
    ambient: TrackHandle,  // health drone, loops, low LUFS
    alerts: TrackHandle,   // escalation, voice readouts — duck others
}

impl AudioService {
    pub fn new() -> anyhow::Result<Self> {
        let mut manager =
            AudioManager::<DefaultBackend>::new(AudioManagerSettings::default())?;
        let ui = manager.add_sub_track(TrackBuilder::new())?;
        let ambient = manager.add_sub_track(TrackBuilder::new())?;
        let alerts = manager.add_sub_track(TrackBuilder::new())?;
        Ok(Self { manager, ui, ambient, alerts })
    }
}
```

### Voice pool

A "voice" is one playing instance of a cue. Two failure modes to design against: (1) ten claim-events in one frame spawning ten overlapping blips into a wall of mush, and (2) a single instance restarting before it finishes, clicking.

- **Cap concurrency per cue.** Keep the last N (e.g. 4) handles per cue id in a ring; if full, either drop the new one (UI blips — newest-wins-but-bounded) or steal the oldest (one-shot music stings).
- **Debounce high-frequency events.** A 30–50 ms minimum re-trigger interval per cue id kills machine-gunning when the fleet emits a burst of identical events.
- **Use kira's `IDLE`/handle state**, not your own playing-flag, to know when a voice freed.

```rust
use std::collections::HashMap;
use std::time::{Duration, Instant};
use kira::sound::static_sound::StaticSoundHandle;

struct VoicePool {
    live: HashMap<CueId, Vec<StaticSoundHandle>>, // bounded per cue
    last_fired: HashMap<CueId, Instant>,
    max_per_cue: usize,        // 4
    debounce: Duration,        // 40ms
}

impl VoicePool {
    fn may_fire(&mut self, cue: CueId) -> bool {
        let now = Instant::now();
        match self.last_fired.get(&cue) {
            Some(t) if now.duration_since(*t) < self.debounce => false,
            _ => { self.last_fired.insert(cue, now); true }
        }
    }
    fn admit(&mut self, cue: CueId, h: StaticSoundHandle) {
        let v = self.live.entry(cue).or_default();
        v.retain(|h| h.state() != kira::sound::PlaybackState::Stopped);
        if v.len() >= self.max_per_cue { v.remove(0); } // drop oldest handle
        v.push(h);
    }
}
```

### Latency budget

You are not doing live monitoring; you do *not* want the smallest buffer the device offers. UI feedback feels instant well under ~30 ms, and a bigger buffer means fewer xruns under render-thread contention.

| Path | Target | Notes |
|---|---|---|
| Device buffer | 256–512 frames @ 48 kHz (~5–11 ms) | Let cpal pick default; only shrink if cues feel laggy. |
| Event → audible | < 30 ms end-to-end | Command send + voice spawn + buffer. Imperceptible for UI. |
| Drone xfade / duck | 80–250 ms tween | Fast enough to feel responsive, slow enough to avoid clicks. |
| Decode of a new asset | off the audio thread, always | Pre-decode at startup; never decode in a callback. |

**Quality Gate:** measure it once. Log `Instant` at event ingress and at the kira `play()` return; assert the median is < 5 ms before the device buffer even enters the picture. If your *command latency* is already 20 ms, the bug is in your channel/UI scheduling, not the audio buffer.

---

## Threading — never touch the audio thread from render

This is the single rule that, broken, produces every "audio is glitchy / app stutters" bug. The audio render callback runs on a high-priority OS thread that can preempt anything and **must never block**. Inside the callback (which kira/cpal own): no `malloc`/`free`, no `Mutex`, no `println!`, no file I/O, no `Vec::push` that might grow.

You don't write that callback — kira does — but you can still poison it by handing it data through a lock. So the contract is: **the UI thread and the audio thread communicate only through lock-free, allocation-free channels.** kira already does this internally; your job is to not add a `Mutex<AudioService>` around it.

### gpui integration shape

In gpui, `AudioService` lives as a [global](https://docs.rs/gpui/latest/gpui/) (`cx.set_global` / `cx.global`) or inside a long-lived model `Entity`. UI handlers call cheap, non-blocking methods on it. kira's handles are `Send + Sync` and clonable; setting a track volume is a wait-free message to the audio thread.

```rust
// In your app setup:
cx.set_global(AudioService::new()?);

// In a gpui event handler (render/interaction thread):
fn on_agent_claimed_file(&mut self, cx: &mut Context<Self>) {
    let audio = cx.global::<AudioService>();
    audio.cue(CueId::Claim);   // returns instantly; no I/O, no lock you hold
}
```

**Anti-Pattern: decode-on-click.**
- *Symptom:* first play of each sound hitches; the gpui frame that triggered it drops.
- *Detection:* `StaticSoundData::from_file(...)` (or `Decoder::new`) called inside a click/render handler.
- *Fix:* decode every asset once at startup into `StaticSoundData` (kira) / cached `Vec<f32>`, store in an `Arc`, and only `play()` the cached copy on the hot path.

**Anti-Pattern: `Mutex<AudioManager>` shared with anything on a tight loop.**
- *Symptom:* render thread occasionally blocks for milliseconds; audio occasionally clicks; both correlated.
- *Detection:* a `Mutex`/`RwLock` wrapping the audio service that's locked from both a `gpui` handler and a background task.
- *Fix:* the audio service is single-owner (global). Hand out *handles* (clonable, lock-free) for volume/duck control. If you must mutate the service from a background thread, send a command over an `mpsc`/`crossbeam` channel the service drains on the UI tick — never share the manager under a lock.

**Anti-Pattern: spawning the audio stream on a `gpui` foreground task.**
- *Symptom:* stream dies when the task completes, or audio stalls when the UI is busy.
- *Detection:* `OutputStream`/`AudioManager` owned by a transient future.
- *Fix:* kira owns its own thread; just keep the `AudioManager` alive for the app's lifetime (the global does this). If you're on raw cpal, keep the `Stream` in a long-lived struct — dropping it stops audio.

> Sidenote: for raw cpal paths, the canonical UI→audio transport is an SPSC ring buffer — [`rtrb`](https://rust-audio.discourse.group/t/announcement-real-time-ring-buffer-rtrb/346) is the audio-community standard (wait-free, no alloc in the callback). Don't reach for `crossbeam::channel` *inside* the callback; use it only for UI-side, non-realtime command flow.

---

## Procedural cues with fundsp vs sampled assets

Two ways to get a sound: bake a WAV in a DAW and ship it, or synthesize it at runtime with fundsp. The Harbor brand (mustard/navy, signal flags, maritime) actually wants *both* — but lean synthesized for the systemic, parameterized cues.

### When to synthesize (fundsp)

- The cue should **track a value**: a drone whose pitch/brightness encodes fleet load, an alert whose urgency scales with severity.
- You want a **coherent family** of cues from shared DSP (same filter, different intervals) — cheaper to keep consistent than hand-authoring 12 WAVs.
- You want **zero asset bytes** and no decode at startup.

```rust
use fundsp::hacker::*;

// A short, warm "claim" blip: two-osc sine stack, fast AD envelope, gentle LP.
// ~120ms. Navy-calm, not a Windows ding.
fn claim_blip() -> An<impl AudioNode> {
    let freq = 660.0; // E5-ish
    let osc  = sine_hz(freq) * 0.6 + sine_hz(freq * 2.0) * 0.15;
    let env  = envelope(|t| if t < 0.01 { t / 0.01 }          // 10ms attack
                            else { exp(-(t - 0.01) * 12.0) }); // exp decay
    (osc * env) >> lowpass_hz(2200.0, 0.7) >> pan(0.0)
}

// A health drone whose cutoff opens as load rises (0.0..=1.0).
fn health_drone(load: f32) -> An<impl AudioNode> {
    let cutoff = 220.0 + load * 1400.0;
    (saw_hz(55.0) * 0.18 + saw_hz(55.0 * 1.005) * 0.18) // slight detune = warmth
        >> lowpass_hz(cutoff, 1.2)
        >> pan(0.0)
}
```

Render the graph into a buffer (or wrap it as a kira `Sound` for streaming control). For one-shots, render once into `Vec<f32>` at startup and treat it exactly like a decoded asset — same cache, same voice pool.

```rust
fn render_oneshot(mut node: An<impl AudioNode>, secs: f32, sr: f64) -> Vec<f32> {
    node.set_sample_rate(sr);
    let n = (secs as f64 * sr) as usize;
    (0..n).map(|_| node.get_mono()).collect() // mono; pan upstream if stereo
}
```

### When to ship samples

- **Recorded character** you can't cheaply synthesize (a real bell, a foley snap, a voiced word).
- **Hero moments** where a sound designer's baked WAV simply sounds better than runtime DSP.
- **Voice/TTS readouts** — always assets/streams.

**Decision Point:** systemic + parameterized → fundsp. One-off + characterful → WAV via symphonia/kira. Keep both behind the *same* `CueId` API so the UI never knows or cares which a cue is.

---

## Loading + caching

```
startup:
  for each CueId:
     - sampled → StaticSoundData::from_file()  (kira; symphonia-decoded)  → Arc
     - procedural → render_oneshot() into Vec<f32> → StaticSoundData::from_frames → Arc
  store Arc<StaticSoundData> in HashMap<CueId, _>
runtime:
  play() the cached Arc — cheap clone, no decode, no alloc spike
```

- **Decode once, at startup, off the hot path.** symphonia is the decoder under both kira and rodio; you never call it per-play.
- **Cache by `CueId`**, hold `Arc<StaticSoundData>`. `StaticSoundData::clone()` is Arc-cheap; clone per play.
- **Loops** (the ambient drone) load once as a looping `StaticSoundData` or stream; keep a single live handle and tween its volume — don't re-spawn.
- **Hash large/optional packs** if you ever hot-reload assets; invalidate the cache by content hash, not filename mtime.

**Anti-Pattern: re-decoding a loop on every restart.**
- *Symptom:* memory churn and a click each time the drone re-arms.
- *Fix:* one persistent looping handle; control it with `set_volume` tweens, never stop/recreate.

**Quality Gate:** a startup assertion that every `CueId` resolved to a cached `Arc` before the first frame renders — a missing asset should fail loudly at boot, not silently no-op on first click.

---

## Spatialization and pan

For a 2-D operator console you do **not** need HRTF or a 3-D scene. You need **stereo pan as a spatial cue**: a blip nudged left/right to match where on the dashboard the event fired ("agent in the left pane just claimed a file"). That's free and effective.

- **Pan in fundsp** with `pan(x)` where `x ∈ [-1.0, 1.0]`, or **per-voice** with kira's panning (`StaticSoundData::panning(...)` / a track pan tween).
- Map the **screen-x of the originating UI element** to pan: `pan = (elem_center_x / viewport_w) * 2.0 - 1.0`. Clamp to ±0.6 so nothing slams fully to one ear.
- Keep the **ambient drone centered** (pan 0); only transient events pan. A panned drone is disorienting.
- Reach for **kira's spatial scene** (listener + emitter positions) only if the console ever goes 3-D/immersive — note it as out of scope otherwise. `oddio` is the lighter alternative if you do.

**Anti-Pattern: hard-panning alerts.**
- *Symptom:* an escalation chime fully in one ear reads as a bug, not urgency, and is missed on mono/single-speaker setups.
- *Fix:* alerts stay near center (±0.2); pan is a hint, never the carrier of critical information. Never make meaning *depend* on stereo position — mono listeners and the hearing-impaired must get the full signal.

---

## Ducking

When an alert chime or a voice readout fires on the `alerts` track, dip `ui` and `ambient` so the alert cuts through, then restore. This is a side-chain-style duck done with track-volume tweens.

```rust
use kira::tween::Tween;
use std::time::Duration;

impl AudioService {
    fn duck(&mut self, to_db: f64, attack: Duration) {
        let t = Tween { duration: attack, ..Default::default() };
        self.ui.set_volume(to_db, t);       // e.g. -12.0 dB
        self.ambient.set_volume(to_db, t);
    }
    fn unduck(&mut self, release: Duration) {
        let t = Tween { duration: release, ..Default::default() };
        self.ui.set_volume(0.0, t);
        self.ambient.set_volume(0.0, t);
    }

    pub fn play_alert(&mut self, data: &kira::sound::static_sound::StaticSoundData) {
        self.duck(-12.0, Duration::from_millis(80));   // fast attack
        self.manager.play(data.output_destination(&self.alerts)).ok();
        // restore after the alert's length (schedule on UI tick, not audio thread)
        self.unduck(Duration::from_millis(250));       // slower release
    }
}
```

- **Attack fast (60–120 ms), release slower (200–400 ms).** Fast duck = the alert isn't masked; slow release = no jarring volume pump.
- **Duck by a fixed dB** (−9 to −12 dB), not to silence — the operator should still feel the fleet is alive underneath.
- **Schedule the unduck on your UI tick / a `gpui` timer**, keyed to the alert's known length. Never compute timing on the audio thread.
- **Coalesce overlapping alerts:** a second alert mid-duck extends the duck; it doesn't stack a second −12 dB on top.

---

## Loudness — get the levels right

Mismatched cue loudness is the most common reason app audio feels amateur. Normalize the whole set to consistent integrated loudness; per the practice for UI sound, taps/blips sit quieter than notifications, with notifications a few dB louder so the hierarchy reads.

| Cue class | Target integrated loudness | True peak ceiling |
|---|---|---|
| UI blips (claim, toggle, hover) | **−18 to −16 LUFS** | ≤ −1 dBTP |
| Notifications / state changes | **−14 to −12 LUFS** | ≤ −1 dBTP |
| Alerts / escalation | **−12 LUFS**, never hotter | ≤ −1 dBTP |
| Ambient health drone | **−26 to −23 LUFS** (sits under everything) | ≤ −3 dBTP |

- Author/measure to these in a meter (any EBU R128 / ITU-1770 meter; broadcast refs are −23 LUFS EBU R128 / −24 LKFS CALM, but UI cues live a few dB hotter so they register over desktop ambience).
- **For synthesized cues, measure the rendered buffer** and bake a gain into the `CueId` definition — fundsp output isn't loudness-normalized for free.
- **Cap true peak at −1 dBTP** so cues don't clip on cheap laptop DACs.

**Quality Gate:** a one-time offline pass that loads every cached cue, computes integrated LUFS, and asserts each is within ±1.5 LU of its class target. Ship it as a test; a cue that drifts out of range fails CI, not the user's ears.

---

## Putting it together — the cue API

The whole subsystem reduces to one enum and one method the UI ever calls:

```rust
#[derive(Copy, Clone, PartialEq, Eq, Hash)]
pub enum CueId { Claim, Toggle, Escalation, FleetHealthy, VoiceStart }

impl AudioService {
    /// Non-blocking, allocation-free on the hot path. Safe to call from any
    /// gpui handler. Routes to the right bus, respects voice cap + debounce,
    /// ducks if it's an alert, pans from the originating element if given.
    pub fn cue(&mut self, id: CueId) { self.cue_at(id, 0.0) }
    pub fn cue_at(&mut self, id: CueId, pan: f32) { /* pool gate → play on bus */ }
}
```

Everything above — crate choice, buses, voice pool, ducking, LUFS — exists so this two-line call site is correct, instant, and never touches the audio thread or the render frame.

---

## Quality Gates (checklist)

- [ ] No decode, alloc, lock, or I/O on the play hot path — all assets pre-decoded into cached `Arc`s at startup.
- [ ] Audio service is single-owner (gpui global / long-lived entity); UI holds only clonable, lock-free handles.
- [ ] No `Mutex<AudioManager>` shared with a render or background loop.
- [ ] Per-cue concurrency cap (≈4) + per-cue debounce (≈40 ms) enforced.
- [ ] Alerts duck `ui`+`ambient` by a fixed dB, fast attack / slow release, unduck scheduled on the UI tick.
- [ ] Every cue within ±1.5 LU of its LUFS class target; true peak ≤ −1 dBTP — verified by a CI test.
- [ ] Pan is a hint only; mono listeners get full meaning; alerts stay near center.
- [ ] Startup asserts every `CueId` resolved to a cached buffer (fail loud, not silent).
- [ ] Exact minor versions pinned for cpal/rodio/kira/fundsp/symphonia.

## Anti-Pattern index

1. Start on raw cpal "for control" → reimplement kira badly.
2. Decode-on-click → dropped gpui frames on first play of each sound.
3. `Mutex<AudioManager>` shared with the render loop → correlated UI stutter + audio clicks.
4. Audio stream owned by a transient gpui task → audio dies mid-session.
5. Re-decoding a loop on every restart → click + memory churn.
6. Hard-panned alerts → meaning lost on mono; reads as a bug.
7. Unnormalized cue set → amateur, inconsistent loudness; clipping on cheap DACs.

---

### Sources

- [rodio — RustAudio (GitHub)](https://github.com/RustAudio/rodio) · [rodio docs.rs](https://docs.rs/rodio) · [rodio crates.io](https://crates.io/crates/rodio)
- [cpal — RustAudio (GitHub)](https://github.com/RustAudio/cpal)
- [kira docs.rs](https://docs.rs/kira/latest/kira/) · [kira track module](https://docs.rs/kira/latest/kira/track/index.html) · [kira — tesselode (GitHub)](https://github.com/tesselode/kira)
- [FunDSP — SamiPerttu (GitHub)](https://github.com/SamiPerttu/fundsp) · [fundsp docs.rs](https://docs.rs/fundsp) · [fundsp crates.io](https://crates.io/crates/fundsp)
- [Audio crate index — lib.rs](https://lib.rs/multimedia/audio)
- [Announcement: Real-Time Ring Buffer (rtrb) — Rust Audio Discourse](https://rust-audio.discourse.group/t/announcement-real-time-ring-buffer-rtrb/346)
- [Applying sound to UI — Material Design](https://m2.material.io/design/sound/applying-sound-to-ui.html)
- [UI sound design loudness — Envato Elements](https://elements.envato.com/learn/ui-sound-design-ai)
- [The Audio Producer's Guide to Loudness — Transom](https://transom.org/2021/the-audio-producers-guide-to-loudness/)
