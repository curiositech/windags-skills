---
license: Apache-2.0
name: api-gateway-reverse-proxy-expert
description: "API gateway and reverse proxy configuration with Kong, Nginx, Traefik, routing, and auth middleware. Activate on: API gateway, reverse proxy, Kong, Nginx, Traefik, load balancer, ingress, auth middleware. NOT for: rate limiting algorithms (use api-rate-limiting-throttling-expert), service mesh (use service-mesh-microservices-expert)."
allowed-tools: Read,Write,Edit,Bash(npm:*,npx:*,docker:*,kubectl:*)
category: Backend & Infrastructure
tags:
  - api-gateway
  - reverse-proxy
  - nginx
  - kong
  - traefik
pairs-with:
  - skill: api-rate-limiting-throttling-expert
    reason: Rate limiting is a core gateway plugin
  - skill: service-mesh-microservices-expert
    reason: Gateways sit at the edge of service meshes
  - skill: observability-apm-expert
    reason: Gateway-level tracing and metrics collection
---

# API Gateway & Reverse Proxy Expert

Configure and optimize API gateways and reverse proxies for routing, authentication, rate limiting, and traffic management.

## Decision Points

### Authentication Strategy Selection

```
Traffic Pattern & Requirements
├── Internal services only
│   └── API Key authentication
│       ├── Low complexity, fast validation
│       └── Kong: key-auth plugin, Traefik: forwardAuth
├── Customer-facing API with session needs
│   └── JWT authentication
│       ├── Stateless, includes user claims
│       └── Kong: jwt plugin, Nginx: lua-resty-jwt
├── Enterprise B2B integration
│   └── mTLS authentication
│       ├── Certificate-based, highest security
│       └── Kong: mtls-auth, Nginx: ssl_verify_client
└── Third-party SaaS integration
    └── OAuth2 flow
        ├── Token exchange, delegated auth
        └── Kong: oauth2 plugin, AWS API Gateway: authorizer
```

### Gateway Technology Selection

```
Requirements → Choice
├── Plugin ecosystem & GUI needed
│   └── Kong Enterprise/OSS
├── Kubernetes-native with auto-discovery
│   └── Traefik v3 or Ingress-NGINX
├── Maximum performance, minimal features
│   └── Nginx or Envoy
└── Cloud-managed, serverless scaling
    └── AWS API Gateway or Azure Application Gateway
```

### Upstream Routing Strategy

```
Service Architecture → Routing Method
├── Microservices with service discovery
│   └── Dynamic upstream targets
│       ├── Consul/Eureka integration
│       └── Health check based load balancing
├── Static backend services
│   └── Fixed upstream pools
│       ├── Round-robin or least-connections
│       └── Weighted routing for canary deployments
└── Multi-region deployment
    └── Geographic routing
        ├── Latency-based or geo-IP
        └── Fallback to secondary regions
```

## Failure Modes

### Gateway Timeout Cascade
**Symptom:** Slow API responses (>10s) under load  
**Detection:** Response times spike while upstream services report normal latency  
**Root Cause:** Gateway timeout higher than upstream timeout, causing request queuing  
**Fix:** Set gateway read timeout < upstream timeout (gateway: 30s, upstream: 25s)

### Authentication Bypass
**Symptom:** Unauthorized requests reaching backend services  
**Detection:** Backend logs show requests without expected auth headers  
**Root Cause:** Route order allows permissive rules to match before auth rules  
**Fix:** Move auth middleware to global level or ensure specific routes come first in config

### Circuit Breaker Thrashing
**Symptom:** Intermittent 503 errors during traffic spikes  
**Detection:** Circuit breaker opens/closes rapidly (multiple times per minute)  
**Root Cause:** Threshold too sensitive or health check misconfigured  
**Fix:** Tune failure threshold (5+ failures) and recovery time (30s minimum)

### SSL Certificate Expiry
**Symptom:** HTTPS handshake failures, browser certificate warnings  
**Detection:** SSL cert check shows expiry within 30 days  
**Root Cause:** Manual certificate management without renewal automation  
**Fix:** Implement cert-manager (K8s) or ACME client with auto-renewal

### Resource Exhaustion
**Symptom:** Gateway stops accepting connections, memory/CPU at 100%  
**Detection:** Connection refused errors, gateway health checks failing  
**Root Cause:** No connection limits or memory leaks in plugins  
**Fix:** Set worker_connections (Nginx) or connection pool limits (Kong), restart gateway

## Worked Examples

### Scenario: E-commerce API Gateway Setup

**Context:** Deploy Kong for microservices handling orders, inventory, payments with JWT auth

**Step 1: Route Definition**
```yaml
# Identify service endpoints first
services:
  - orders: /api/v1/orders/* → http://orders:8080
  - inventory: /api/v1/inventory/* → http://inventory:8080  
  - payments: /api/v1/payments/* → http://payments:8080
```

**Step 2: Apply Decision Tree**
- Traffic pattern: Customer-facing API → JWT authentication
- Architecture: Microservices → Dynamic upstream targets
- Requirements: Plugin ecosystem needed → Kong selected

**Step 3: Plugin Ordering**
```yaml
# Apply plugins in correct order
plugins:
  1. cors (pre-auth)
  2. jwt (authentication) 
  3. rate-limiting (post-auth)
  4. request-transformer (last)
```

**Expert vs Novice:**
- **Novice mistake:** Applies rate limiting before authentication (anonymous users consume quota)
- **Expert approach:** Auth first, then rate limit per authenticated user
- **Novice mistake:** Uses global CORS policy
- **Expert approach:** Different CORS per route (orders allows admin origins, payments restricts to frontend only)

### Failure Scenario: Canary Deployment Gone Wrong

**Situation:** Deployed 20% traffic to new orders service version, seeing 500 errors

**Detection Process:**
1. Check gateway metrics: 500 rate spike correlates with deployment time
2. Upstream health checks: New version failing health checks
3. Gateway logs: Upstream connection timeouts

**Rollback Procedure:**
```yaml
# Step 1: Immediate traffic shift
kong:
  routes:
    - service: orders-v1
      weight: 100  # Was 80
    - service: orders-v2  
      weight: 0    # Was 20

# Step 2: Validate rollback
curl -H "Authorization: Bearer $JWT" \
  https://api.company.com/orders/health

# Step 3: Remove failed upstream
kubectl scale deployment orders-v2 --replicas=0
```

**Root Cause Analysis:** New version had database connection pool misconfiguration, causing timeouts under load

## Quality Gates

- [ ] All routes have explicit path matching (no catch-all /* routes)
- [ ] Authentication middleware configured before business logic plugins
- [ ] Health checks return 2xx for healthy upstreams within 5 seconds
- [ ] Circuit breaker thresholds set: 5 failures in 60s window, 30s recovery
- [ ] TLS certificates auto-renew with 30+ days before expiry
- [ ] Rate limiting applied per authenticated user, not globally
- [ ] CORS policy restricts origins to required domains only
- [ ] Gateway timeout (30s) < upstream timeout (25s) to prevent cascades
- [ ] Access logs include correlation ID for request tracing
- [ ] Gateway deployed with minimum 2 replicas for high availability

## NOT-FOR Boundaries

**This skill handles:** Gateway configuration, routing rules, authentication middleware, reverse proxy setup

**NOT for:**
- Rate limiting algorithm design → Use `api-rate-limiting-throttling-expert`
- Service mesh data plane configuration → Use `service-mesh-microservices-expert`  
- API specification and design → Use `api-architect`
- Database connection pooling → Use `database-performance-expert`
- Container orchestration → Use `kubernetes-expert` or `docker-expert`
- SSL certificate generation → Use `security-infrastructure-expert`

**Delegation Rules:**
- For custom rate limiting algorithms: "I'll configure the rate limiting plugin, but for custom algorithms, use api-rate-limiting-throttling-expert"
- For service discovery setup: "I'll configure upstream targets, but for service mesh setup, use service-mesh-microservices-expert"