---
license: Apache-2.0
name: image-generation-workflow-engine
description: "Build image generation pipelines with Stable Diffusion, FLUX, ControlNet, LoRA, and ComfyUI workflows. Activate on: image generation pipeline, ComfyUI workflow, ControlNet, LoRA training, diffusion model. NOT for: video generation (ai-video-production-master), image classification (computer-vision-pipeline)."
allowed-tools: Read,Write,Edit,Bash(python:*,pip:*,npm:*,npx:*)
category: AI & Machine Learning
tags:
  - image-generation
  - stable-diffusion
  - flux
  - comfyui
  - lora
pairs-with:
  - skill: ai-video-production-master
    reason: Generated images serve as keyframes and style references for video pipelines
  - skill: computer-vision-pipeline
    reason: CV preprocessing (segmentation, depth) feeds ControlNet conditioning
  - skill: multimodal-embedding-generator
    reason: CLIP/SigLIP embeddings guide generation and enable style search
---

# Image Generation Workflow Engine

Build production image generation pipelines with FLUX, Stable Diffusion 3.5, ControlNet, LoRA, and ComfyUI for automated creative workflows.

## Activation Triggers

**Activate on**: "image generation pipeline", "ComfyUI workflow", "ControlNet conditioning", "LoRA training", "FLUX generation", "Stable Diffusion pipeline", "batch image generation", "img2img workflow", "inpainting pipeline"

**NOT for**: Video generation from images (ai-video-production-master), image classification or object detection (computer-vision-pipeline), or multimodal search embeddings (multimodal-embedding-generator)

## Quick Start

1. **Choose model** — FLUX.1-dev for quality, FLUX.1-schnell for speed, SD 3.5 for ControlNet ecosystem, SDXL for LoRA abundance.
2. **Design workflow** — Text-to-image (simplest), img2img (style transfer), ControlNet (structural guidance), inpainting (targeted edits).
3. **Build pipeline** — ComfyUI for visual node graphs, diffusers library for code-first, or API services (Replicate, fal.ai) for managed.
4. **Add conditioning** — ControlNet (canny, depth, pose), IP-Adapter (style transfer), LoRA (fine-tuned concepts).
5. **Automate** — Batch generation with parameter sweeps, quality filtering, and output organization.

## Core Capabilities

| Domain | Technologies | Notes |
|--------|-------------|-------|
| **Models** | FLUX.1-dev/schnell, SD 3.5, SDXL, Kandinsky 3 | FLUX is 2025-2026 standard for quality |
| **Conditioning** | ControlNet (canny, depth, pose, segmentation), IP-Adapter | Structural and style guidance |
| **Fine-Tuning** | LoRA, DreamBooth, textual inversion | Custom concepts in 20 min on consumer GPU |
| **Workflows** | ComfyUI, diffusers (Python), A1111 | ComfyUI for complex multi-step; diffusers for code |
| **APIs** | Replicate, fal.ai, Together AI, HF Inference | Managed GPU, pay-per-image |
| **Local** | qwen-image-mps (Apple Silicon), CUDA, ROCm | M4 Max: FLUX.1-schnell in 4-8 sec/image |

## Architecture Patterns

### Pattern 1: ComfyUI Production Pipeline

```
[Load Checkpoint] ──→ [CLIP Text Encode] ──→ [KSampler] ──→ [VAE Decode] ──→ [Save Image]
       │                      │                    │
   FLUX.1-dev          positive + negative     steps: 20-30
   or SD 3.5           prompts with weights    cfg: 3.5-7.5
                                                scheduler: euler
                                                    │
                                    [ControlNet Apply] (optional)
                                           │
                                    canny/depth/pose
                                    from reference image
```

ComfyUI workflows are JSON-serializable. Store them in version control:

```
workflows/
├── txt2img-flux-base.json          # Basic FLUX text-to-image
├── controlnet-canny-sd35.json      # Canny edge guided generation
├── lora-character-flux.json        # Character LoRA application
├── inpaint-background-swap.json    # Background replacement
└── batch-product-shots.json        # Automated product photography
```

### Pattern 2: Code-First with diffusers

```python
# FLUX.1-dev with ControlNet conditioning
from diffusers import FluxPipeline, FluxControlNetPipeline
from diffusers.utils import load_image
import torch

# Basic text-to-image
pipe = FluxPipeline.from_pretrained(
    "black-forest-labs/FLUX.1-dev", torch_dtype=torch.bfloat16
).to("cuda")

image = pipe(
    prompt="A cozy library with warm lighting, bookshelves floor to ceiling",
    num_inference_steps=28,
    guidance_scale=3.5,
    width=1024, height=1024,
).images[0]

# Batch generation with parameter sweep
params = [
    {"guidance_scale": 3.0, "num_inference_steps": 20},
    {"guidance_scale": 3.5, "num_inference_steps": 28},
    {"guidance_scale": 4.0, "num_inference_steps": 35},
]
for i, p in enumerate(params):
    img = pipe(prompt=prompt, **p).images[0]
    img.save(f"output/sweep_{i}_cfg{p['guidance_scale']}.png")
```

### Pattern 3: LoRA Training and Application

```
Training:
  20-50 images of concept ──→ [kohya_ss / ai-toolkit] ──→ LoRA weights (.safetensors)
                                    │
                              captioned with BLIP/Florence2
                              trained 1000-3000 steps
                              rank 16-32, alpha = rank

Application:
  [Base Model] + [LoRA weights @ strength 0.6-0.9] ──→ [Generate with trigger word]

File organization:
  loras/
  ├── character-alice-v2.safetensors    # trigger: "alice_character"
  ├── style-watercolor-v1.safetensors   # trigger: "watercolor_style"
  └── product-shoe-v3.safetensors       # trigger: "brandx_shoe"
```

## Anti-Patterns

1. **CFG scale too high** — FLUX works best at 3.0-4.0 CFG. Using 7-12 (old SD habits) produces oversaturated, artifact-heavy images. Check model-specific recommendations.
2. **Ignoring negative prompts where supported** — SD 3.5 and SDXL benefit from negative prompts ("blurry, low quality, distorted"). FLUX does not use negatives the same way.
3. **Training LoRA on uncaptioned data** — Images without accurate captions produce LoRAs that activate unpredictably. Always caption training data with BLIP-2 or Florence-2.
4. **No seed tracking** — Without recording seeds, you cannot reproduce good results or iterate systematically. Always log seed, prompt, and all parameters.
5. **Single-image evaluation** — Generating one image and judging the model is like evaluating a coin flip from one toss. Generate 4-8 images per prompt and evaluate the distribution.

## Quality Checklist

- [ ] Model chosen based on use case: FLUX for quality, schnell for speed, SD 3.5 for ControlNet
- [ ] CFG scale appropriate for model (FLUX: 3.0-4.0, SD 3.5: 4.0-7.5, SDXL: 7.0-12.0)
- [ ] Seeds logged for every generation (reproducibility)
- [ ] ControlNet conditioning validated: reference image preprocessed correctly
- [ ] LoRA training data captioned with automated tool (BLIP-2, Florence-2)
- [ ] Batch generation used for evaluation (minimum 4 images per prompt)
- [ ] Output organized with metadata (prompt, seed, model, params in filename or sidecar)
- [ ] ComfyUI workflows version-controlled as JSON
- [ ] GPU memory managed: model offloading for large models, attention slicing for VRAM limits
- [ ] Generation latency profiled: target < 10 sec for interactive, < 60 sec for batch
