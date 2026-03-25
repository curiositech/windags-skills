# Interface Management: Where Independent Correctness Fails at Integration

## The Interface Problem: Why Correct Parts Make Failing Systems

A fundamental paradox in complex systems:
- Every subsystem passes its tests (verified against requirements)
- Every component is built to specification (validated by audit)
- Yet when you integrate them, **the system fails**

**The root cause**: Interfaces.

NASA's handbook dedicates Section 6.3 to Interface Management and references it across Configuration Management, Integration, and Verification sections. The message: **Interfaces are where most system failures originate—not from component malfunction, but from incompatibility between correctly functioning components.**

## What Is an Interface?

**NASA's definition** (implied from Section 6.3 and NPR 7120.5):

> An interface is the **shared boundary** between two system elements where they exchange:
> - **Physical entities** (mass, force, heat, fluids)
> - **Energy** (electrical power, mechanical work, radiation)
> - **Information** (data, commands, status)
> - **Control authority** (who decides what, when)

Critically, interfaces are **bilateral**—both sides must agree on:
- What's being exchanged
- How it's formatted/encoded
- When/how often it occurs
- What happens if it fails

## The Five Interface Failure Modes

### 1. Specification Mismatch
**What happens**: The two sides have incompatible specifications.

**Example: Mars Climate Orbiter (1998)**

The spacecraft was lost due to a **unit mismatch**:
- **Lander Team** sent thruster commands in **pound-force** (lbf)
- **Orbiter Team** expected thruster commands in **Newtons** (N)
- 1 lbf ≈ 4.45 N, so commands were interpreted as **4.5× too large**
- Spacecraft entered Mars atmosphere at wrong altitude and burned up

**Root cause**: The Interface Control Document (ICD) was **ambiguous** on units. Both teams "followed the ICD" but interpreted it differently.

**Lesson**: Interface specs must be **unambiguous, explicit, and machine-checkable**. "Force" is not sufficient; "Force (Newtons, SI)" is.

### 2. Timing Mismatch
**What happens**: One side produces data at rate R₁, the other consumes at rate R₂ ≠ R₁.

**Example: Sensor-Controller Interface**

- **Sensor**: Publishes position updates at 10 Hz (every 100 ms)
- **Controller**: Expects updates at 50 Hz (every 20 ms)
- **Symptom**: Controller uses stale data; vehicle oscillates or crashes

**Root cause**: Timing requirements not specified in ICD. Sensor team assumed "10 Hz is fast enough." Controller team assumed "we'll get fresh data each cycle."

**Lesson**: ICDs must specify **rate, latency, jitter, and staleness tolerance**.

### 3. Format/Protocol Mismatch
**What happens**: Two sides use incompatible data formats or communication protocols.

**Example: JWST Instrument-Spacecraft Interface**

- **Instrument Team**: Sends telemetry in **CCSDS Packet Protocol** (standard for space data)
- **Spacecraft Bus**: Initially expected telemetry in **MIL-STD-1553 format** (avionics bus protocol)

**Detected during**: Integration testing (before launch, fortunately)

**Resolution**: Spacecraft bus upgraded to support CCSDS. Cost: $5M and 3-month schedule delay.

**Lesson**: Protocol compatibility must be verified **before detailed design**. Changing protocols late is expensive.

### 4. Assumption Mismatch
**What happens**: Each side makes implicit assumptions about the other's behavior.

**Example: Software-Hardware Interface Assumption**

- **Software Team** assumes: "When I send RESET command, hardware will respond within 10 ms"
- **Hardware Team** assumes: "RESET command can take up to 100 ms if EEPROM write is in progress"

**Symptom**: Software times out, declares hardware fault, triggers unnecessary redundancy switch.

**Root cause**: Behavioral constraints not documented in ICD.

**Lesson**: ICDs must specify **behavioral invariants** (e.g., "RESET response time: 10 ms nominal, 100 ms maximum, timeout threshold 150 ms").

### 5. Change Propagation Failure
**What happens**: One side changes its interface without notifying the other.

**Example: Payload-Power Interface**

- **Power Subsystem**: Upgrades to higher voltage (28V → 32V) for efficiency
- **Payload**: Still designed for 28V ± 2V input; 32V exceeds rating
- **Result**: Payload components overheat, mission failure

**Root cause**: Power team made "local optimization" without checking impact on downstream consumers.

**Lesson**: Interface changes require **bilateral approval**. Configuration Management enforces this.

## NASA's Interface Management Framework

### The Interface Control Document (ICD)

**Purpose**: Formal specification of the interface between two system elements.

**Required contents** (from NPR 7120.5 and NASA RP-1370):

#### Physical Interfaces
- **Mechanical**: Mounting dimensions, bolt patterns, clearances, mass, center of gravity
- **Thermal**: Heat dissipation (W), operating temperature range (°C), interface conductance (W/m²·K)
- **Fluid**: Pressure, flow rate, temperature, contamination limits

#### Electrical Interfaces
- **Power**: Voltage (V), current (A), frequency (Hz), power quality (ripple, transients)
- **Signal**: Logic levels (TTL, CMOS), impedance (Ω), capacitance (pF), rise/fall times (ns)
- **Grounding**: Ground reference, isolation requirements, EMI/EMC limits

#### Data Interfaces
- **Protocol**: RS-232, CAN bus, Ethernet, SpaceWire, etc.
- **Message format**: Packet structure, byte order (big-endian vs. little-endian), error detection (CRC, parity)
- **Timing**: Data rate (bps), latency (ms), jitter tolerance (μs)
- **Semantics**: Command/response pairs, status codes, error handling

#### Functional Interfaces
- **Operational modes**: Startup, nominal operation, safe mode, shutdown
- **Command sequences**: Allowed/forbidden command orderings
- **Fault response**: How each side responds to failures of the other

### Example ICD: Spacecraft-Payload Power Interface

```
INTERFACE CONTROL DOCUMENT: ICD-42-PWR
Revision: 3.2
Date: 2024-01-15
Parties: Spacecraft Bus (Power Subsystem) ↔ Science Payload

1. ELECTRICAL CHARACTERISTICS
   Primary Power Bus:
     - Voltage: 28V DC ± 4V (24V min, 32V max)
     - Current: 5A maximum continuous, 8A peak for 100ms
     - Ripple: <100mV peak-to-peak
     - Transient: ±10V for <1ms (payload must tolerate)
   
   Power Control:
     - ON command: Payload power enabled within 10ms ± 2ms
     - OFF command: Payload power disabled within 5ms ± 1ms
     - Overcurrent protection: Trip at 10A, notify bus within 50ms

2. CONNECTOR SPECIFICATION
   - Type: MIL-DTL-38999 Series III, 4-pin
   - Pin 1: +28V (14 AWG wire, max 10A)
   - Pin 2: Ground Return (14 AWG wire)
   - Pin 3: Power Good Signal (TTL output from bus, high = power stable)
   - Pin 4: Fault Signal (TTL input to bus, high = payload fault)

3. OPERATIONAL CONSTRAINTS
   - Payload inrush current: <5A for first 50ms after power-on
   - Power-on self-test: Payload ready signal within 2 seconds
   - Shutdown: Payload must enter safe state within 1 second of OFF command

4. FAILURE MODES
   - Overvoltage (>32V): Payload enters safe mode, asserts Fault Signal
   - Undervoltage (<24V): Payload enters safe mode if >100ms duration
   - Overcurrent (>10A): Bus trips power, payload loses function

5. CHANGE CONTROL
   - Any changes to voltage, current, or timing require approval from:
     - Spacecraft Chief Engineer
     - Payload Lead Engineer
   - Changes submitted via ECR (Engineering Change Request) to CCB

6. VERIFICATION
   - Interface compliance verified via:
     - Electrical test: Payload powered from bus simulator, voltage/current measured
     - Fault injection test: Overvoltage/undervoltage applied, payload response measured
     - Integration test: Full spacecraft-payload power-up sequence

Approved by:
[Spacecraft Chief Engineer Signature]
[Payload Lead Engineer Signature]
```

### The Interface Management Process

**From Section 6.3**:

1. **Identify interfaces** early (during architecture definition)
2. **Define interface characteristics** (physical, electrical, data, functional)
3. **Document in ICDs** (formal, version-controlled)
4. **Baseline ICDs** (configuration-controlled, changes require approval)
5. **Verify interface compliance** (test both sides independently, then together)
6. **Monitor interface health** (during integration and operations)

**Critical rule**: "Both sides of the interface must approve changes."

## The Interface Verification Paradox

**Standard verification logic**:
- Subsystem A passes all its tests → A is correct
- Subsystem B passes all its tests → B is correct
- Therefore A+B should work

**Reality**:
- A passes tests against **simulated** version of B
- B passes tests against **simulated** version of A
- When real A meets real B, **simulation mismatches reality**

**Example: Hubble Space Telescope (1990)**

- **Primary Mirror**: Ground testing used a **calibration device** to verify mirror shape
- **Calibration device**: Misassembled, introduced 1mm spacing error
- **Result**: Mirror was **perfectly manufactured to the wrong specification** (spherical aberration)
- **Consequence**: $2B mission produced blurry images for 3 years until corrected by servicing mission

**Root cause**: The interface between mirror and calibration device was not independently verified.

**Lesson**: Interface verification requires **independent standards**, not just bilateral agreement.

### NASA's Interface Verification Methods

**From Section 5.3 (Verification)**:

1. **Test** (most rigorous): Connect actual components, measure actual behavior
   - Example: Plug payload into spacecraft bus, measure voltage, current, noise
   - Detects: Real-world effects (EMI, thermal coupling, mechanical misalignment)

2. **Analysis** (model-based): Simulate interface using validated models
   - Example: SPICE circuit simulation of power bus with payload load
   - Detects: Timing issues, transient responses, signal integrity

3. **Inspection** (dimensional): Verify physical dimensions, connector keying
   - Example: Measure bolt hole positions, check connector pin configuration
   - Detects: Mechanical incompatibilities before assembly

4. **Demonstration** (operational): Verify functional behavior in representative environment
   - Example: Power-on sequence in thermal-vacuum chamber
   - Detects: Environmental sensitivities (temperature, vacuum, radiation)

**Key principle**: Multiple verification methods reduce risk. Test alone misses corner cases; analysis alone misses real-world effects.

## Transfer to Agent Systems: Interface Contracts for Skills

### Principle 1: Skills Must Declare Interfaces Explicitly

Every skill should publish:
- **Input interface** (data types, value ranges, constraints)
- **Output interface** (data types, value ranges, guarantees)
- **Timing interface** (latency bounds, throughput)
- **Failure modes** (error types, recovery expectations)

**Implementation**:
```python
class SkillInterface:
    skill_id: str
    version: str
    
    inputs: Dict[str, TypeSpec]  # e.g., {"pose": Pose, "goal": Pose}
    outputs: Dict[str, TypeSpec]  # e.g., {"waypoints": List[Pose], "feasible": bool}
    
    constraints: Dict[str, Constraint]  # e.g., {"latency_ms": "<500", "memory_mb": "<100"}
    
    failure_modes: List[FailureMode]  # e.g., [NoPathFound, TimeoutExceeded]

class TypeSpec:
    type_name: str  # e.g., "Pose"
    schema: Dict  # e.g., {"x": float, "y": float, "theta": float}
    units: Dict  # e.g., {"x": "meters", "theta": "radians"}
    ranges: Dict  # e.g., {"x": [-100, 100], "theta": [-π, π]}
```

### Principle 2: Interface Compatibility Must Be Verified Before Invocation

Before Skill A calls Skill B, the orchestrator should check:
- **Type compatibility**: Does A's output match B's input?
- **Unit compatibility**: Are units consistent (meters vs. feet)?
- **Range compatibility**: Does A's output range fit within B's input constraints?
- **Timing compatibility**: Can B meet A's latency requirement?

**Implementation**:
```python
def verify_interface_compatibility(skill_a, skill_b):
    # Check type compatibility
    for output_key, output_type in skill_a.outputs.items():
        if output_key in skill_b.inputs:
            input_type = skill_b.inputs[output_key]
            if not types_compatible(output_type, input_type):
                raise InterfaceError(f"Type mismatch: {output_type} vs {input_type}")
    
    # Check unit compatibility
    for key in skill_a.outputs:
        if key in skill_b.inputs:
            if skill_a.outputs[key].units != skill_b.inputs[key].units:
                raise InterfaceError(f"Unit mismatch: {skill_a.outputs[key].units} vs {skill_b.inputs[key].units}")
    
    # Check constraint compatibility
    if skill_b.constraints["latency_ms"] < skill_a.constraints["latency_ms"]:
        raise InterfaceError(f"Latency incompatible: A produces in {skill_a.constraints['latency_ms']}ms, B requires <{skill_b.constraints['latency_ms']}ms")