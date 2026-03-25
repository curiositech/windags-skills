# Adaptation Without Attack Detection: Symptom-Based Defense Mechanisms

## The Detection Paradox

Traditional cybersecurity follows a classify-then-respond paradigm:
1. **Monitoring**: Collect system telemetry (network traffic, system calls, sensor readings)
2. **Detection**: Classify observations as "normal" or "attack" using signatures, anomaly detection, or machine learning
3. **Response**: If attack detected, trigger mitigation (block traffic, quarantine agent, alert operator)

This approach faces fundamental challenges against sophisticated adversaries:
- **Evasion**: Attackers craft inputs that evade detection signatures
- **Mimicry**: Attacks disguised as legitimate behavior fool anomaly detectors
- **Zero-day exploits**: Unknown attack patterns lack signatures
- **Adversarial ML**: Attackers optimize inputs to maximize classifier error
- **False positives**: Overly sensitive detection disrupts legitimate operations

The microgrid resilience paper demonstrates a radical alternative: **systems can maintain stability and performance without ever detecting or classifying attacks**. Instead of asking "Is this signal an attack?", the system asks "Is this signal causing deviations from desired behavior?" and responds proportionally to the *magnitude of deviation*, regardless of whether it stems from attacks, faults, or legitimate disturbances.

This "symptom-based defense" paradigm transfers directly to AI agent systems, providing resilience against attacks the system never explicitly recognizes as malicious.

## The Core Mechanism: Responding to Symptoms, Not Causes

### Traditional Detection-Based Defense

```python
class DetectionBasedAgent:
    def process_input(self, data):
        # Step 1: Classify input
        if self.attack_detector.is_malicious(data):
            # Step 2: Respond to detected attack
            return self.reject_input(data)
        else:
            # Process normally
            return self.execute_task(data)
    
    def attack_detector.is_malicious(self, data):
        # Signature matching
        if self.matches_known_attack_pattern(data):
            return True
        
        # Anomaly detection
        if self.statistical_distance(data, self.normal_profile) > threshold:
            return True
            
        # ML classifier
        if self.ml_model.predict(data) == "attack":
            return True
            
        return False
```

Problems:
- **Evasion**: Attacker modifies pattern to avoid signatures
- **False negatives**: Novel attacks (zero-days) not in training data
- **False positives**: Legitimate unusual inputs flagged as attacks
- **Computational cost**: Classification requires expensive feature extraction, model inference
- **Delay**: Detection time allows attack to cause damage before response

### Symptom-Based Adaptive Defense

```python
class SymptomBasedAgent:
    def process_input(self, data):
        # No attack classification—just observe symptoms
        symptom_severity = self.measure_deviation()
        
        # Adapt processing based on symptom magnitude
        throttle_factor = self.compute_adaptive_throttle(symptom_severity)
        
        # Execute with adapted resources
        return self.execute_task(data, throttle=throttle_factor)
        
    def measure_deviation(self):
        """Observe symptoms: deviations from expected behavior"""
        # Compare to neighbors (consensus error)
        neighbor_avg = mean([n.state for n in self.neighbors])
        consensus_error = abs(self.state - neighbor_avg)
        
        # Compare to baseline (historical normal)
        baseline_error = abs(self.state - self.baseline)
        
        # Compare to reference (global objectives)
        reference_error = abs(self.state - self.target)
        
        # Combined symptom severity
        return consensus_error + baseline_error + reference_error
        
    def compute_adaptive_throttle(self, symptom):
        """Scale response to symptom magnitude—no classification"""
        # Adaptive parameter grows with persistent symptoms
        self.phi += self.beta * (symptom - self.lambda_threshold)
        self.phi = max(0, self.phi)
        
        # Compensation grows exponentially with phi
        compensation = symptom * math.exp(self.phi) / (symptom + 0.01)
        
        # Throttle factor in [0, 1]: reduces processing aggressiveness
        return 1.0 / (1.0 + compensation)
```

Key differences:
- **No classification**: Never asks "Is this an attack?"—only "How much deviation am I observing?"
- **Unified response**: Same mechanism handles attacks, faults, and legitimate complexity
- **Proportional adaptation**: Response scales continuously with symptom severity (not binary allow/block)
- **Adaptive tuning**: Parameters (phi) automatically adjust to match disturbance characteristics
- **No evasion**: Attackers cannot "evade" by disguising their signals—if attacks cause symptoms, response triggers regardless of attack disguise

## The Mathematical Foundation: UUB Stability Without Attack Knowledge

### The Setup

System dynamics under unknown disturbances (Equation 13 from paper):

**˙ξ = -Φ·diag(c)·(ξ + µ + Γ)**

where:
- **ξ**: Deviation from desired state (consensus error, resource usage anomaly, etc.)
- **µ**: Unknown disturbance (could be attack, fault, or legitimate complexity)
- **Γ**: Adaptive compensation
- **Φ, diag(c)**: System parameters encoding topology and control gains

The system does NOT have access to µ. Traditional robust control requires bounding µ (||µ|| ≤ D), but sophisticated attackers violate any fixed bound. The adaptive approach instead observes ξ (the *symptom* of disturbance) and adjusts Γ to compensate.

### The Lyapunov Proof (Without Attack Detection)

Construct energy function (Equation 14):

**E = (1/2)ξᵀΦ⁻¹ξ**

This is always non-negative (E ≥ 0) and measures system deviation. Compute derivative (Equation 15):

**˙E ≤ -σmin(diag(c))||ξ||² + diag(c)Σ|ξi||µi| - diag(c)Σ(ξi·Γi)**

Interpretation:
- First term (negative): Control dissipates energy, reducing error
- Second term (positive): Disturbance µ injects energy, increasing error
- Third term (negative): Compensation Γ removes energy, counteracting disturbance

The key: **Design Γ such that the second and third terms cancel (or third dominates second) whenever ξ is large**.

### The Adaptive Compensation Design

Choose (Equation 12):

**Γi = (ξi·e^φi)/(|ξi| + ηi)**
**˙φi = β(|ξi| - λi)**

where φi is an adaptive parameter that grows when symptom |ξi| persists. The critical inequality (Equation 23):

**diag(c)Σ|ξi||µi| - diag(c)Σ(ξi·Γi) ≤ 0 when e^φi ≥ ||µi||**

Since the adaptation law ensures φi ≈ ln(||µi||) (proven in Equation 22), we have e^φi ≈ ||µi||, causing compensation to match disturbance. The Lyapunov derivative becomes:

**˙E ≤ -σmin(diag(c))||ξ||² when ||ξ|| large enough**

This proves: **Errors ξ remain uniformly ultimately bounded (UUB) without the system ever measuring, estimating, or classifying the disturbance µ**.

The system doesn't "know" if µ is:
- Malicious attack (adversarial prompt injection)
- Benign fault (communication glitch)
- Legitimate complexity (hard reasoning problem)

It only knows "ξ is large, therefore I should compensate more aggressively." The response is identical in all three cases, and the mathematical guarantee (UUB stability) holds regardless of which case is actually occurring.

## Transfer to AI Agent Systems

### Application 1: Prompt Injection Defense Without Classification

Traditional defense:
```python
def process_user_prompt(prompt):
    # Try to detect injection
    if contains_jailbreak_pattern(prompt):
        return "Request rejected: potential security threat"
    
    if sentiment_classifier(prompt) == "malicious":
        return "Request rejected: suspicious intent"
        
    # If passes all checks, process
    return llm.generate(prompt)
```

Problems:
- Adversaries craft prompts that evade pattern matching
- Sentiment classifiers fail on subtle manipulations
- False positives reject legitimate creative requests
- Zero-day injection techniques (unknown patterns) succeed

Symptom-based alternative:
```python
class SymptomBasedLLMAgent:
    def __init__(self):
        self.baseline_token_rate = 10  # Tokens/sec under normal use
        self.phi = 1.0  # Adaptive throttle parameter
        self.beta = 20.0  # Adaptation gain
        
    def process_user_prompt(self, prompt):
        """Process without classifying as malicious/benign"""
        generated_tokens = []
        start_time = time.time()
        
        for step in range(max_tokens):
            # Measure symptom: deviation from baseline rate
            elapsed = time.time() - start_time
            current_rate = len(generated_tokens) / max(elapsed, 1e-6)
            symptom = abs(current_rate - self.baseline_token_rate)
            
            # Update adaptive parameter based on symptom
            lambda_i = 0.5 * self.phi  # Simple threshold
            self.phi += self.beta * (symptom - lambda_i) * dt
            self.phi = max(0, self.phi)
            
            # Compute adaptive throttle (reduces generation rate if symptom large)
            compensation = symptom * math.exp(self.phi) / (symptom + 0.01)
            throttle = 1.0 / (1.0 + compensation)
            
            # Generate next token with throttled rate
            if random.random() < throttle:
                next_token = self.llm.generate(prompt, generated_tokens)
                generated_tokens.append(next_token)
            else:
                # Skip generation this step (adaptive rate limiting)
                time.sleep(1.0 / self.baseline_token_rate)
                
            # Early termination if symptom extremely severe
            if throttle < 0.05:
                generated_tokens.append("[Output truncated due to unusual generation pattern]")
                break
                
        return generated_tokens
```

Key features:
- **No attack classification**: System never decides "this is a jailbreak" vs "this is legitimate"
- **Symptom observation**: Monitors token generation rate (observable outcome) not prompt content (requires classification)
- **Adaptive response**: Throttling strength grows with symptom severity (minor deviation → minor throttling; major deviation → strong throttling)
- **Graceful degradation**: Legitimate complex prompts (requiring many tokens) experience mild slowdown; attacks (exponential token growth) experience aggressive throttling
- **No false positive/negative tradeoff**: Doesn't reject or accept requests—adapts processing to observed behavior

### Application 2: Resource Exhaustion Defense in Multi-Agent Orchestration

Traditional approach:
```python
def allocate_resources(agent, task):
    # Estimate required resources
    estimated_tokens = predict_token_count(task)
    estimated_time = predict_execution_time(task)
    
    # Detect excessive requests
    if estimated_tokens > MAX_TOKENS:
        raise ResourceExhaustionAttack("Token limit exceeded")
    if estimated_time > MAX_TIME:
        raise ResourceExhaustionAttack("Time limit exceeded")
        
    # Allocate if within limits
    return agent.execute(task, token_budget=estimated_tokens)
```

Problems:
- Prediction errors: Estimators fail on novel tasks
- Fixed limits: MAX_TOKENS too low blocks legitimate complex tasks; too high allows attacks
- Binary decision: Either allow (full resources) or reject (no resources)—no middle ground

Symptom-based approach:
```python
class SymptomBasedOrchestrator:
    def __init__(self):
        self.agents = [Agent(i) for i in range(N)]
        # Each agent tracks its own resource usage and adapts
        
class SymptomBasedAgent:
    def __init__(self, agent_id):
        self.id = agent_id
        self.tokens_used = 0
        self.baseline_usage = 100  # Expected tokens per task
        self.phi = 1.0  # Adaptive resource limiter
        self.beta = 10.0
        
    def execute_task(self, task):
        """Execute with adaptive resource allocation"""
        allocated_tokens = self.baseline_usage
        
        while not task.complete():
            # Measure symptom: current usage vs baseline
            symptom = abs(self.tokens_used - self.baseline_usage)
            
            # Compare to neighbors (distributed consensus)
            neighbor_avg_usage = mean([a.tokens_used for a in self.neighbors])
            symptom += abs(self.tokens_used - neighbor_avg_usage)
            
            # Update adaptive limiter
            lambda_i = 0.5 * self.phi
            self.phi += self.beta * (symptom - lambda_i) * dt
            self.phi = max(0, self.phi)
            
            # Adaptive allocation: reduce if symptom large
            compensation = symptom * math.exp(self.phi) / (symptom + 1.0)
            throttle = 1.0 / (1.0 + compensation)
            
            allocated_tokens = self.baseline_usage * throttle
            
            # Do work with allocated resources
            task.step(token_budget=allocated_tokens)
            self.tokens_used += allocated_tokens
            
        return task.result()
```

Advantages:
- **No prediction required**: Doesn't estimate future resource needs (error-prone)
- **Adaptive limits**: Allocation scales with observed usage patterns, not fixed thresholds
- **Graceful degradation**: Legitimate high-resource tasks proceed slowly; attacks are throttled aggressively but not blocked entirely
- **Distributed implementation**: Each agent self-regulates based on neighbors, no central resource allocator

### Application 3: Quality Assurance Without Adversarial Example Detection

Traditional approach:
```python
def validate_output(agent_output):
    # Try to detect adversarial examples
    if adversarial_detector.is_adversarial(agent_output):
        return "Output rejected: potential adversarial manipulation"
    
    # Check output quality
    if quality_score(agent_output) < THRESHOLD:
        return "Output rejected: insufficient quality"
        
    return agent_output  # Accept if passes checks