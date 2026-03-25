---
license: Apache-2.0
name: file-upload-storage-expert
description: "S3, multipart uploads, CDN integration, and presigned URLs for file storage. Activate on: file upload, S3, presigned URL, multipart upload, CDN, blob storage, image upload, media storage. NOT for: data warehouse storage (use lakehouse-architect), database design (use dimensional-modeler)."
allowed-tools: Read,Write,Edit,Bash(npm:*,npx:*,aws:*,wrangler:*)
category: Backend & Infrastructure
tags:
  - file-upload
  - s3
  - cdn
  - storage
  - presigned-url
pairs-with:
  - skill: api-gateway-reverse-proxy-expert
    reason: Upload routing and size limits at the gateway
  - skill: cache-strategy-invalidation-expert
    reason: CDN cache invalidation for updated assets
  - skill: observability-apm-expert
    reason: Upload latency and failure rate monitoring
---

# File Upload & Storage Expert

Design secure, scalable file upload and storage systems with presigned URLs, multipart uploads, CDN distribution, and lifecycle management.

## Activation Triggers

**Activate on:** "file upload", "S3", "presigned URL", "multipart upload", "CDN", "blob storage", "image upload", "R2", "media storage", "upload progress"

**NOT for:** Data lake storage → `lakehouse-architect` | Database BLOB columns → `dimensional-modeler` | Video processing pipelines → relevant media skill

## Quick Start

1. **Choose storage backend** — S3, R2 (zero egress), GCS, or Supabase Storage
2. **Generate presigned URLs server-side** — never expose credentials to clients
3. **Implement multipart upload** for files >10MB with resume capability
4. **Process asynchronously** — thumbnails, transcoding, virus scanning via queue
5. **Serve via CDN** — CloudFront, Cloudflare, or Vercel Edge for global delivery

## Core Capabilities

| Domain | Technologies |
|--------|-------------|
| **Object Storage** | AWS S3, Cloudflare R2, GCS, MinIO |
| **Upload Libraries** | @aws-sdk/client-s3, tus-js-client, Uppy 4.x |
| **CDN** | CloudFront, Cloudflare CDN, Fastly |
| **Processing** | Sharp (images), FFmpeg (video), ClamAV (scanning) |
| **Managed** | Supabase Storage, Vercel Blob, Uploadthing |

## Architecture Patterns

### Presigned URL Upload Flow

```
Client                    Server                    S3/R2
  │                         │                         │
  ├─ POST /upload/init ────→│                         │
  │  { filename, type }     │                         │
  │                         ├─ createPresignedPost() ─→│
  │                         │                         │
  │←── { url, fields } ────┤                         │
  │                         │                         │
  ├─ PUT (direct to S3) ──────────────────────────────→│
  │                         │                         │
  │                         │←── S3 Event Notification│
  │                         ├─ Process (thumbnail,    │
  │                         │   scan, metadata)       │
  │←── webhook: ready ─────┤                         │
```

### Multipart Upload with Resume

```typescript
import { S3Client, CreateMultipartUploadCommand,
  UploadPartCommand, CompleteMultipartUploadCommand } from '@aws-sdk/client-s3';

const PART_SIZE = 10 * 1024 * 1024; // 10MB parts

async function multipartUpload(file: Buffer, key: string) {
  const { UploadId } = await s3.send(
    new CreateMultipartUploadCommand({ Bucket: BUCKET, Key: key })
  );

  const parts: { ETag: string; PartNumber: number }[] = [];
  for (let i = 0; i < file.length; i += PART_SIZE) {
    const partNumber = Math.floor(i / PART_SIZE) + 1;
    const { ETag } = await s3.send(new UploadPartCommand({
      Bucket: BUCKET, Key: key, UploadId,
      PartNumber: partNumber,
      Body: file.subarray(i, i + PART_SIZE),
    }));
    parts.push({ ETag: ETag!, PartNumber: partNumber });
  }

  await s3.send(new CompleteMultipartUploadCommand({
    Bucket: BUCKET, Key: key, UploadId,
    MultipartUpload: { Parts: parts },
  }));
}
```

### CDN-First Serving Architecture

```
User Request → CDN Edge (cache hit?) ──yes──→ Serve cached
                    │ no
                    ↓
              Origin (S3/R2)
                    ↓
              Response + Cache-Control: public, max-age=31536000, immutable
              (use content-hash in filename for cache busting)
```

## Anti-Patterns

1. **Proxying uploads through your server** — use presigned URLs so clients upload directly to object storage; your server should never be a relay
2. **Synchronous processing** — never resize/transcode during the upload request; push to a queue and process async
3. **Mutable filenames** — use content-addressable keys (`sha256-{hash}.ext`) for CDN cacheability
4. **No upload size limits** — enforce max file size server-side in presigned URL policy AND client-side
5. **Storing credentials client-side** — presigned URLs expire; never send AWS keys to the browser

## Quality Checklist

- [ ] Presigned URLs used for client-to-storage uploads
- [ ] Presigned URL expiry set to 5-15 minutes
- [ ] Multipart upload implemented for files >10MB
- [ ] Upload size limits enforced in presigned URL policy
- [ ] Content-Type validation on server (not just extension)
- [ ] Virus/malware scanning before making files public
- [ ] CDN configured with immutable cache headers
- [ ] Lifecycle policy deletes incomplete multipart uploads after 24h
- [ ] CORS configured on bucket for browser direct uploads
- [ ] Storage costs monitored with lifecycle transitions (Standard → IA → Glacier)
