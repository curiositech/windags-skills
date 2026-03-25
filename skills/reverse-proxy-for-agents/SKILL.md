---
license: Apache-2.0
name: reverse-proxy-for-agents
description: |
  Reverse proxy architecture for AI agent systems — Nginx, Caddy, Traefik, and Cloudflare. Agent-specific patterns: routing to specialist agents, load balancing, TLS termination, rate limiting, WebSocket proxying, header injection for agent identity, and the "agent gateway" pattern. Covers LLM routers (LiteLLM, OpenRouter) as intelligent reverse proxies, service mesh (Envoy/Istio) for agent fleets, and MCP servers behind reverse proxies. Activate on 'reverse proxy', 'nginx proxy', 'caddy', 'traefik', 'agent gateway', 'LLM router', 'LiteLLM proxy', 'WebSocket proxy', 'service mesh agents'. NOT for: tunnels (use tunnels-for-agents), firewall rules (use agentic-zero-trust-security), container orchestration (use devops-automator), DNS configuration (use infrastructure skills).
allowed-tools: Read,Write,Edit,Bash,Glob,Grep,WebSearch,WebFetch
metadata:
  category: Infrastructure & Networking
  tags:
    - reverse-proxy
    - nginx
    - caddy
    - traefik
    - load-balancing
    - api-gateway
    - llm-router
    - websocket
    - service-mesh
    - agent-routing
    - tls-termination
    - mcp-proxy
  pairs-with:
    - skill: tunnels-for-agents
      reason: Tunnels expose local services; reverse proxies route and protect them
    - skill: ipc-communication-patterns
      reason: IPC handles inter-process messaging; reverse proxy handles inter-network routing
    - skill: agentic-zero-trust-security
      reason: Zero-trust principles govern how the proxy authenticates and authorizes agent traffic
    - skill: daemon-development
      reason: Reverse proxies are long-running daemons with lifecycle management needs
    - skill: multi-agent-coordination
      reason: Multi-agent systems need intelligent routing to coordinate work across agents
category: Backend & Infrastructure
tags:
  - reverse-proxy
  - agents
  - routing
  - load-balancing
  - api-gateway
---

# Reverse Proxy for Agents

Expert in reverse proxy architecture for AI agent systems, specializing in routing, load balancing, TLS termination, and real-time communication patterns.

## Decision Points

Given requirements, choose proxy tool:

```
INPUT: (throughput, k8s_env, auto_reload, simplicity)

IF throughput > 10k_rps:
  → Use Nginx (C implementation, event-driven)
  → Configure keepalive, worker processes
  → Manual config reload with nginx -s reload

ELIF k8s_env == true AND auto_reload == true:
  → Use Traefik (Docker/K8s service discovery)
  → Configure via container labels
  → Automatic routing updates on container changes

ELIF simplicity == true AND throughput < 5k_rps:
  → Use Caddy (automatic HTTPS, zero-config WebSocket)
  → Caddyfile syntax, hot reload via API
  → Built-in Let's Encrypt integration

ELIF edge_protection == true:
  → Use Cloudflare (DDoS, WAF, CDN at edge)
  → Dashboard config, instant propagation
  → DNS-based routing
```

### Routing Strategy Decision Tree

```
REQUEST ANALYSIS:

IF agent_fleet_size < 5:
  → Path-based routing: /api/code/* → code-agent
  → Manual upstream configuration
  → Health checks every 30s

ELIF agents_are_stateful == true:
  → Cookie-based sticky sessions
  → lb_policy cookie agent_session (Caddy)
  → ip_hash (Nginx) for IP-based affinity

ELIF real_time_required == true:
  → WebSocket proxying configuration
  → proxy_buffering off (Nginx)
  → Long timeouts: proxy_read_timeout 86400s
  → Connection upgrade headers

ELIF content_based_routing == true:
  → Implement lightweight classifier at proxy
  → Keyword matching or fast LLM (Haiku-class)
  → Route based on request body analysis
```

### LLM Router Selection

```
CONSTRAINTS ANALYSIS:

IF budget_control == critical:
  → LiteLLM (self-hosted, full cost tracking)
  → max_budget configuration
  → Per-user spending limits

ELIF model_variety > 100:
  → OpenRouter (500+ models, provider fallback)
  → Cloud service, per-token markup
  → Built-in latency-based routing

ELIF observability == priority:
  → Helicone (request tracing, analytics)
  → Pass-through proxy model
  → Cost per request tracking
```

## Failure Modes

### 1. "Dead Backend Broadcasting" Anti-Pattern

**Symptom Detection:**
- 502 Bad Gateway errors in proxy logs
- Health check endpoint returning failures
- Upstream connect timeouts in metrics

**Root Cause:** Proxy sending traffic to crashed/unresponsive agents
**Fix Strategy:**
1. Configure health checks: `health_uri /health` (Caddy) or `max_fails=2 fail_timeout=60s` (Nginx)
2. Set fail_timeout to remove dead backends from rotation
3. Monitor upstream response codes: 502/503/504 indicate backend issues

### 2. "Streaming Buffer Trap" Anti-Pattern

**Symptom Detection:**
- Agent responses arrive in large chunks instead of streaming
- Client sees no output for 30+ seconds then full response
- proxy_buffering enabled in Nginx config

**Root Cause:** Proxy buffering streaming responses before forwarding
**Fix Strategy:**
1. Set `proxy_buffering off` for all streaming endpoints
2. Use `proxy_cache off` and `chunked_transfer_encoding off` for SSE
3. Configure `X-Accel-Buffering: no` header for dynamic buffering control

### 3. "Timeout Guillotine" Anti-Pattern

**Symptom Detection:**
- 504 Gateway Timeout errors
- Agent logs show successful completion after proxy timeout
- proxy_read_timeout shorter than agent processing time

**Root Cause:** Default timeouts killing long-running agent requests
**Fix Strategy:**
1. Profile agent response times: code agents (120s), research agents (300s+)
2. Set per-route timeouts: `proxy_read_timeout 300s` (Nginx) or `timeout 300s` (Caddy)
3. Configure client-side timeout > server timeout to avoid race conditions

### 4. "Round Robin Context Loss" Anti-Pattern

**Symptom Detection:**
- Agents report "no conversation history" errors
- Users complain responses ignore previous context
- Load balancing spreads requests across instances

**Root Cause:** Stateful agents losing context due to round-robin load balancing
**Fix Strategy:**
1. Implement sticky sessions: `lb_policy cookie agent_session` (Caddy)
2. Use `ip_hash` directive (Nginx) for IP-based affinity
3. Alternative: Store context in shared storage (Redis) instead of agent memory

### 5. "Heavy Classifier Bottleneck" Anti-Pattern

**Symptom Detection:**
- High latency on all requests (200ms+ added)
- Proxy CPU usage spikes on routing decisions
- Large LLM calls in proxy access logs

**Root Cause:** Content-based routing using heavyweight classifier
**Fix Strategy:**
1. Replace heavy LLM with keyword matching or tiny model (Haiku-class)
2. Cache classification results for similar requests
3. Move classification to client-side with fallback routing

### 6. "Single Proxy Death Star" Anti-Pattern

**Symptom Detection:**
- All agents become unreachable when one proxy fails
- No redundancy in proxy layer
- DNS points to single proxy instance

**Root Cause:** Single point of failure in proxy layer
**Fix Strategy:**
1. Deploy multiple proxy instances with health checks
2. Use DNS round-robin or cloud load balancer above proxies
3. Configure graceful degradation: fallback to direct agent access

### 7. "Rate Limit Amnesia" Anti-Pattern

**Symptom Detection:**
- Unexpected high LLM bills
- Single client consuming entire token budget
- No rate limiting in proxy configuration

**Root Cause:** Missing or insufficient rate limiting allowing budget exhaustion
**Fix Strategy:**
1. Implement per-IP limits: `limit_req_zone $binary_remote_addr` (Nginx)
2. Add per-API-key limits: `rate_limit zone api_key` (Caddy)
3. Set burst capacity with `nodelay` for legitimate traffic spikes

## Worked Examples

### Example: Setting Up Caddy Agent Gateway

**Scenario:** 3 specialist agents (code, research, data) need routing with auto-HTTPS and WebSocket support.

**Agent Decision Process:**
1. **Tool Selection:** Caddy (simplicity priority, < 5k RPS, auto-HTTPS needed)
2. **Routing Strategy:** Path-based (agents don't maintain state)
3. **Health Checks:** 10s interval (agents start in ~5s)

**Step-by-Step Implementation:**

```bash
# 1. Create Caddyfile with agent routing
cat > Caddyfile << 'EOF'
agents.example.com {
    handle /api/code/* {
        reverse_proxy code-agent:8001 {
            health_uri /health
            health_interval 10s
        }
    }
    
    handle /api/research/* {
        reverse_proxy research-agent:8002 {
            health_uri /health
            health_interval 10s
        }
    }
    
    handle /ws/* {
        reverse_proxy agent-ws:8010
        # Caddy handles WebSocket upgrade automatically
    }
    
    # Rate limiting per client
    rate_limit {
        zone agent_api {
            key {remote_host}
            events 100
            window 1m
        }
    }
    
    # Agent identity headers
    header_up X-Request-ID {http.request.uuid}
    header_up X-Gateway "windags-caddy"
}
EOF

# 2. Start Caddy (gets certificates automatically)
caddy run

# 3. Test routing and health
curl https://agents.example.com/api/code/health
curl -H "Upgrade: websocket" https://agents.example.com/ws/connect
```

**Novice Mistakes vs Expert Choices:**
- **Novice:** Forgets health checks → traffic goes to dead agents
- **Expert:** Configures health_uri with appropriate interval
- **Novice:** Uses default timeouts → kills long research queries
- **Expert:** Sets per-agent timeout based on profiled response times
- **Novice:** No rate limiting → budget exhaustion
- **Expert:** Per-client limits with reasonable burst capacity

**Configuration Validation:**
```bash
# Test health check behavior
docker stop code-agent
curl -v https://agents.example.com/api/code/test
# Should return 502 after health check fails

# Test WebSocket upgrade
wscat -c wss://agents.example.com/ws/stream
# Should successfully upgrade connection

# Test rate limiting
for i in {1..110}; do curl https://agents.example.com/api/code/health; done
# Should get 429 Too Many Requests after 100 requests
```

## Quality Gates

- [ ] Health checks configured for all upstream agent pools with appropriate intervals (5-30s)
- [ ] TLS termination working with valid certificates (test with `curl -v https://`)
- [ ] Rate limiting configured per-IP and per-API-key with reasonable burst capacity
- [ ] WebSocket endpoints handle upgrade headers correctly (test with wscat)
- [ ] Streaming endpoints have buffering disabled (`proxy_buffering off` or equivalent)
- [ ] Request/response latency under 50ms for proxy overhead (excluding agent processing)
- [ ] Agent identity headers injected in all forwarded requests (X-Request-ID, X-Gateway)
- [ ] Load balancing strategy matches agent statefulness (sticky sessions for stateful agents)
- [ ] Timeout configuration exceeds agent processing time by 30s minimum
- [ ] At least 2 proxy instances deployed for high availability
- [ ] Graceful config reload tested without dropping active connections
- [ ] Error responses include correlation ID for debugging
- [ ] Logs structured (JSON) with request ID, route, latency, status code
- [ ] Cost budget headers propagated to downstream agents when configured
- [ ] MCP server endpoints require authentication and validate Bearer tokens

## NOT-FOR Boundaries

**Use reverse-proxy-for-agents for:**
- Routing requests between clients and agent services
- Load balancing across multiple agent instances
- TLS termination and automatic HTTPS for agent endpoints
- Rate limiting and throttling for agent API protection
- WebSocket proxying for real-time agent communication

**Do NOT use reverse-proxy-for-agents for:**
- **Network tunneling:** For exposing local services through firewalls → use `tunnels-for-agents`
- **VPN setup:** For secure network-to-network connections → use `tunnels-for-agents`
- **Firewall rules:** For packet-level access control → use `agentic-zero-trust-security`
- **Container orchestration:** For deploying/scaling proxy containers → use `devops-automator`
- **DNS management:** For domain/subdomain configuration → use infrastructure skills
- **LLM security:** For prompt injection defense → use `prompt-engineer`
- **Message queue routing:** For async agent communication → use `ipc-communication-patterns`