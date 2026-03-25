---
license: Apache-2.0
name: model-serving-api-builder
description: "Deploy ML models as production APIs with vLLM, TGI, ONNX Runtime, batching, autoscaling, and GPU optimization. Activate on: model serving, deploy LLM, vLLM setup, inference API, GPU serving. NOT for: model training (ai-engineer), prompt engineering (prompt-engineer)."
allowed-tools: Read,Write,Edit,Bash(python:*,pip:*,npm:*,npx:*)
category: AI & Machine Learning
tags:
  - model-serving
  - vllm
  - inference
  - gpu-optimization
  - api
pairs-with:
  - skill: ai-engineer
    reason: AI engineer builds the model; this skill deploys it as a scalable API
  - skill: api-architect
    reason: API design patterns for model serving endpoints
  - skill: llm-cost-optimizer
    reason: Serving optimization directly reduces inference cost
---

# Model Serving API Builder

Deploy machine learning models as production APIs using vLLM, TGI, ONNX Runtime, and custom FastAPI services with batching, autoscaling, and GPU optimization.

## Activation Triggers

**Activate on**: "deploy model API", "serve LLM", "vLLM setup", "inference server", "GPU serving", "model endpoint", "batch inference API", "TGI deployment", "ONNX serving", "autoscale inference"

**NOT for**: Model training or fine-tuning (ai-engineer), prompt design (prompt-engineer), or LLM application logic (ai-engineer)

## Quick Start

1. **Choose serving framework** — vLLM for LLMs (best throughput), TGI for HuggingFace models, ONNX Runtime for non-LLM models, Triton for multi-model.
2. **Configure resources** — GPU type and count, memory limits, tensor parallelism for large models.
3. **Add batching** — Continuous batching (vLLM native) for LLMs, dynamic batching for traditional ML models.
4. **Deploy with health checks** — Kubernetes with GPU node pools, or managed services (Modal, Replicate, RunPod).
5. **Set up autoscaling** — Scale on GPU utilization (70-80%), request queue depth, or custom latency targets.

## Core Capabilities

| Domain | Technologies | Notes |
|--------|-------------|-------|
| **LLM Serving** | vLLM, TGI (HuggingFace), SGLang | PagedAttention, continuous batching, speculative decoding |
| **General ML** | ONNX Runtime, Triton, TorchServe | Non-LLM models: vision, audio, tabular |
| **API Layer** | FastAPI, gRPC, OpenAI-compatible endpoints | vLLM exposes OpenAI-compatible API natively |
| **Orchestration** | Kubernetes + GPU operator, Docker, Modal, RunPod | GPU scheduling and resource management |
| **Quantization** | AWQ, GPTQ, GGUF, bitsandbytes | 4-bit reduces VRAM 4x with < 2% quality loss |
| **Autoscaling** | KEDA, HPA on GPU metrics, serverless (Modal) | Scale-to-zero for cost; scale-up for throughput |

## Architecture Patterns

### Pattern 1: vLLM Production Deployment

```
Client ──→ [Load Balancer] ──→ [vLLM Instance(s)] ──→ [GPU(s)]
                │                      │
           health checks          OpenAI-compatible API
           rate limiting           /v1/completions
           API key auth            /v1/chat/completions
                                       │
                                  continuous batching
                                  PagedAttention
                                  tensor parallelism
```

```bash
# vLLM serving with optimizations (2026 best practices)
pip install vllm

# Single GPU (e.g., A100 80GB, Llama 3.1 8B)
vllm serve meta-llama/Llama-3.1-8B-Instruct \
  --host 0.0.0.0 --port 8000 \
  --max-model-len 8192 \
  --gpu-memory-utilization 0.90 \
  --enable-prefix-caching \
  --dtype auto

# Multi-GPU tensor parallelism (e.g., 2x A100 for 70B)
vllm serve meta-llama/Llama-3.1-70B-Instruct \
  --tensor-parallel-size 2 \
  --max-model-len 4096 \
  --gpu-memory-utilization 0.90 \
  --enable-prefix-caching

# Quantized serving (4-bit AWQ, fits 70B on single A100)
vllm serve TheBloke/Llama-3.1-70B-Instruct-AWQ \
  --quantization awq \
  --max-model-len 4096 \
  --gpu-memory-utilization 0.95
```

### Pattern 2: Multi-Model Serving Architecture

```
Requests ──→ [API Gateway / Router]
                    │
          ┌────────┼────────┐
          │        │        │
          ▼        ▼        ▼
      [vLLM]   [ONNX]   [Triton]
      LLM       Vision    Ensemble
      Llama 3   CLIP      Multi-step
                ResNet    Pipeline
          │        │        │
          ▼        ▼        ▼
       GPU 0    GPU 1    GPU 2-3

Router logic:
  /v1/chat/*         → vLLM (LLM inference)
  /v1/embeddings/*   → ONNX (embedding model)
  /v1/classify/*     → Triton (vision classifier)
```

### Pattern 3: Kubernetes GPU Deployment

```yaml
# k8s deployment with GPU scheduling
apiVersion: apps/v1
kind: Deployment
metadata:
  name: vllm-llama3
spec:
  replicas: 2
  template:
    spec:
      containers:
      - name: vllm
        image: vllm/vllm-openai:latest
        args:
        - --model=meta-llama/Llama-3.1-8B-Instruct
        - --gpu-memory-utilization=0.90
        - --enable-prefix-caching
        resources:
          limits:
            nvidia.com/gpu: 1      # Request 1 GPU per pod
            memory: "32Gi"
          requests:
            nvidia.com/gpu: 1
            memory: "24Gi"
        ports:
        - containerPort: 8000
        livenessProbe:
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 120  # Model loading takes time
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 120
      tolerations:
      - key: "nvidia.com/gpu"
        operator: "Exists"
        effect: "NoSchedule"
```

## Anti-Patterns

1. **No health check grace period** — LLM model loading takes 30-120 seconds. Setting `initialDelaySeconds: 5` causes restart loops. Profile startup time and set accordingly.
2. **Over-provisioning GPU memory** — Setting `gpu-memory-utilization` to 1.0 leaves no room for request spikes. Use 0.85-0.92 as the safe range.
3. **Synchronous inference without batching** — Processing one request at a time wastes GPU cycles. vLLM's continuous batching handles this automatically; for custom serving, implement dynamic batching.
4. **No quantization evaluation** — Serving a 70B FP16 model on 4x A100s when AWQ 4-bit on 1x A100 gives equivalent quality at 1/4 the cost. Always benchmark quantized variants.
5. **Missing graceful shutdown** — Killing inference mid-generation corrupts responses. Implement drain mode: stop accepting new requests, finish in-flight, then terminate.

## Quality Checklist

- [ ] Serving framework chosen based on model type (vLLM for LLMs, ONNX for traditional ML)
- [ ] GPU memory utilization set to 0.85-0.92 (not 1.0)
- [ ] Quantization benchmarked: quality vs. resource savings for target model
- [ ] Health check probes configured with sufficient startup delay
- [ ] Continuous batching enabled (vLLM default) or dynamic batching configured
- [ ] Prefix caching enabled for repeated prompt patterns
- [ ] Autoscaling configured: GPU utilization target 70-80%, or queue-depth based
- [ ] Graceful shutdown implemented: drain mode before termination
- [ ] Latency monitoring: P50, P95, P99 for time-to-first-token and total generation
- [ ] Load tested at 2x expected peak traffic before production deployment
