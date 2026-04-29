# Redundant Multi-Channel Sensing: Why Experts Never Rely on a Single Signal

## The Architecture of Reliable Perception Under Uncertainty

One of the most consistent structural features in Grassi's task analysis of pier-side ship-handling is that at every significant decision point, the conning officer maintains *multiple independent channels* for the same information. This is not described explicitly as a design principle in the thesis — it emerges from the CCIs as an empirical fact about how experts perceive.

Consider the CCI for assessing distance between ship and pier:

| Signal | Method |
|---|---|
| Open space between stern and pier | Visual estimation, compared to known reference (brow ≈ 16 feet) |
| Open space between bow and pier | Visual estimation from bridge wing |
| Diameter of fenders | Visual estimation at waterline |
| Verbal report from bow watch | Radio communication |
| Verbal report from stern watch | Radio communication |
| Surface radar reading | Electronic instrument |
| OOD consultation | Verbal exchange |

Seven channels for a single quantity (distance to pier). In practice, a conning officer uses some subset simultaneously. They cross-reference. They update their estimate when channels disagree. They do not trust any single channel absolutely.

Or consider assessing whether an engine order was executed (from CCI Table 6):
- **Visual**: churning water at stern (propeller cavitation bubbles)
- **Visual**: plume of smoke from smokestack
- **Auditory**: sound of engines accelerating
- **Auditory**: bell of EOT acknowledgment

Four channels, two sensory modalities. Any one might be absent or degraded (storm conditions obscure the stern, noise masks engine sounds, the EOT bell fails). The ensemble is robust even when individual channels are not.

## Why Single-Channel Reliance Is a Systematic Failure Mode

The value of multi-channel sensing becomes visible when you consider what happens when single channels fail:

**Loss of gyrocompass**: 
> "The most common indication to the conning officer will be that the gyrocompass alarm will sound on the bridge. Other indications might be that the gyrocompass repeater will not move with the changes in the ship's direction or begins to spin wildly out of control. Although this is the primary means for monitoring the ship's heading, the conning officer must shift to using the magnetic compass." (p. 35)

The primary channel (gyrocompass) can fail. When it does, a backup channel (magnetic compass) must be immediately available. The expert does not need to *decide* to use the backup in the moment of failure — the backup is already part of the trained perceptual system.

**Loss of steering**:
> "Another indication is that the rudder does not respond to the action of the wheel being turned by the helmsman. The response of the conning officer is to immediately shift to the stand by steering unit." (p. 34)

The rudder's non-responsiveness is itself a perceptual cue — a second-order cue that something is wrong with the primary channel. Experts monitor not just task-relevant signals but also signals about the *reliability of their primary signals*.

This is meta-perception: perceiving whether your perception is working. It requires a second, independent monitoring layer.

## The Redundancy Hierarchy: Primary, Secondary, Tertiary

Across the task analysis, a consistent hierarchy emerges:

**Primary channel**: The fastest, most reliable, most frequently used signal under normal conditions. For most distance assessments, this is direct visual estimation. For engine execution, it's the EOT bell.

**Secondary channel**: A backup available when the primary is degraded or ambiguous. For distance, the bow/stern watch verbal reports. For heading, the magnetic compass.

**Tertiary channels**: Additional confirmation used when there is doubt or when the stakes are high. For distance, radar. For environmental assessment, chart consultation.

The expert's cognitive model allocates attention according to this hierarchy — usually monitoring the primary channel, occasionally sampling the secondary, deliberately consulting the tertiary when uncertain or when a decision is consequential.

## Implications for Agent System Design

### Principle 1: Every consequential input should have at least two independent channels

An agent that receives information through a single channel is architecturally fragile in the same way a ship-handler who only watches the gyrocompass is fragile. When the gyrocompass fails (or when the API returns a wrong value, or when the tool call errors), there is no fallback.

For any skill that reads environmental state before making a consequential decision, the skill specification should include:
- Primary sensing method
- At least one secondary sensing method
- Criteria for when to escalate to secondary
- What to do when channels disagree

### Principle 2: Channels should be independent in their failure modes

Five witnesses who all saw the same security camera footage are not five independent witnesses to the original event. Similarly, five tools that all call the same underlying API are not five independent channels. Independence means *different failure modes* — if the primary fails, the secondary remains available.

For agent systems: tools that query the same database are not independent. Tools that use the same authentication mechanism share a failure mode. True redundancy requires architectural independence.

### Principle 3: Disagreement between channels is itself informative

When the conning officer's visual estimate of distance disagrees with the stern watch's report, something is wrong — either the estimate is off, the watch is off, or there's a parallax issue. This disagreement is a signal that demands resolution, not a problem to ignore.

For agent systems: when two information sources disagree, the agent should not silently use one and discard the other. The disagreement should be flagged and resolved. The resolution process itself often reveals important information about the task state.

### Principle 4: Monitor second-order signals (is my perception working?)

The conning officer does not just monitor whether the ship is responding correctly — they monitor whether their monitoring instruments are working. Gyrocompass alarm, rudder non-responsiveness, EOT bell non-acknowledgment: these are all signals that the primary sensing layer has failed.

Agent systems should implement analogous second-order monitoring:
- Is the tool returning results in expected time ranges?
- Are returned values within plausible ranges?
- Do multiple independent queries return consistent results?
- Is the information freshness acceptable?

When second-order signals indicate monitoring failure, the agent should switch to secondary channels before proceeding, not after a failure has caused a consequential error.

### Principle 5: Communication confirmation is not communication

The GOMS model for issuing a rudder order includes:
```
goal: Give_Verbal_Order_To_Helm
goal: Receive_Repeating_Of_Order_From_Helmsman
  [select: Acknowledge Repeat Back  ...if order properly understood
           Repeat Order             ...if order not properly acknowledged]
goal: Determine_If_Order_Was_Executed
  [select: Observe Rudder Angle Indicator]
goal: Receive_Report_That_Order_Was_Executed_From_Helmsman
```

The conning officer gives the order, receives a repeat-back (confirmation of *receipt*), observes the rudder angle indicator (confirmation of *execution*), and receives a verbal execution report (second confirmation of execution). Receipt and execution are separately confirmed, through independent channels.

The analogous failure in agent systems: assuming that a tool call that returned without error means the intended operation was performed. The tool's success return is confirmation of *communication*. Confirmation of *execution* requires observing the downstream effect of the action.

For consequential agent actions, the pattern should be:
1. Issue the action (invoke skill)
2. Receive acknowledgment (skill returns)
3. Verify execution (observe effect in a channel independent from the skill's own return value)
4. Confirm correct execution (compare observed effect against expected effect)

Steps 3 and 4 are commonly omitted in agent system design. Their omission is a systematic reliability risk.

## The Limits of Redundancy

Multi-channel sensing does have costs and limits:

**Time cost**: Sampling multiple channels takes longer than sampling one. In time-critical situations, the number of channels queried must be reduced to match available time. The conning officer doesn't consult charts and radar during a crash-stop scenario — they act on primary visual signals and adjust.

**Consistency maintenance**: When channels disagree, resolution takes effort. If resolution is required at every decision point, system velocity collapses.

**Channel correlation**: In practice, channels are often correlated — they share common upstream causes that can fail together. True independence is asymptotic; the redundancy hierarchy reduces single points of failure but cannot eliminate them.

**Diminishing returns**: Beyond three or four independent channels, additional channels rarely add meaningfully to reliability. The architecture should be designed for a practical level of redundancy, not infinite redundancy.

The practical design target: **two independent primary channels for every consequential sensing point, with tertiary channels available for high-stakes or uncertain situations**.