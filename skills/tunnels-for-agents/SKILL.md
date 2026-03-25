---
license: Apache-2.0
name: tunnels-for-agents
description: |
  Tunneling for AI agent systems — exposing local services to the internet and connecting agents across network boundaries. Covers ngrok, Cloudflare Tunnel, Tailscale Funnel, bore, localhost.run, SSH tunneling, and WireGuard. Agent patterns: webhook callbacks to local agents, tunneling MCP servers, agent-to-agent communication across NATs, and tunnel mesh architectures. Activate on 'tunnel', 'ngrok', 'cloudflare tunnel', 'tailscale funnel', 'SSH tunnel', 'port forwarding', 'expose localhost', 'WireGuard', 'tunnel MCP server', 'NAT traversal'. NOT for: reverse proxy and load balancing (use reverse-proxy-for-agents), container networking (use devops-automator), firewall rules and zero-trust policies (use agentic-zero-trust-security), DNS management (use infrastructure skills).
allowed-tools: Read,Write,Edit,Bash,Glob,Grep,WebSearch,WebFetch
metadata:
  category: Infrastructure & Networking
  tags:
    - tunneling
    - ngrok
    - cloudflare-tunnel
    - tailscale
    - ssh-tunnel
    - wireguard
    - bore
    - nat-traversal
    - mcp-tunnel
    - webhook
    - vpn
    - port-forwarding
  pairs-with:
    - skill: reverse-proxy-for-agents
      reason: Tunnels expose services; reverse proxies route and protect the traffic once exposed
    - skill: ipc-communication-patterns
      reason: IPC handles local inter-process comms; tunnels extend that across network boundaries
    - skill: agentic-zero-trust-security
      reason: Tunnels open attack surface — zero-trust principles limit what gets exposed
    - skill: daemon-development
      reason: Tunnel daemons (cloudflared, tailscaled) are long-running processes with lifecycle needs
category: Backend & Infrastructure
tags:
  - tunnels
  - ngrok
  - agents
  - networking
  - local-development
---

# Tunnels for Agents

You are an expert in network tunneling with deep knowledge of how AI agent systems use tunnels to cross network boundaries. You understand the security tradeoffs of exposing local services, the operational differences between tunnel tools, and the specific patterns that emerge when agents need to communicate across NATs, firewalls, and cloud/local boundaries.

A tunnel creates a pathway between two network endpoints that would otherwise be unable to communicate directly. For agent systems, this means: exposing a local MCP server so a cloud-hosted LLM can reach it, giving a local agent access to a webhook callback URL, connecting agents running on different developer machines, and bridging the gap between "runs on my laptop" and "accessible from the internet."

## Decision Points

```
Need to expose agent service?
│
├─ Quick dev test (< 1 hour)?
│  ├─ Need request inspection?
│  │  └─► ngrok http 3001 (builtin traffic viewer)
│  └─ Zero signup/install?
│     └─► ssh -R 80:localhost:3001 localhost.run
│
├─ Production MCP server (permanent)?
│  ├─ Own domain + need auth?
│  │  └─► Cloudflare Tunnel + CF Access
│  └─ Demo/testing only?
│     └─► ngrok with stable domain (paid)
│
├─ Agent fleet (multiple machines)?
│  ├─ Need selective public exposure?
│  │  └─► Tailscale mesh + Funnel for specific services
│  └─ All private team access?
│     └─► Tailscale serve (no public exposure)
│
├─ Need to access remote database/API?
│  ├─ Have SSH access to jumpbox?
│  │  └─► ssh -L 5432:db:5432 user@jumpbox
│  └─ Need persistent connection?
│     └─► autossh or WireGuard VPN
│
└─ Self-hosted/no external deps?
   ├─ Simple TCP forwarding?
   │  └─► bore (Rust, minimal relay server)
   └─ Need full VPN mesh?
      └─► WireGuard (manual key management)
```

**Bandwidth and Auth Decision Matrix:**

| Scenario | Tool | Auth Method | Bandwidth Limit | Setup Time |
|----------|------|-------------|-----------------|------------|
| MCP demo to client | ngrok free | OAuth/IP restrict | 1GB/month | 30s |
| Production MCP | Cloudflare | CF Access (SSO) | Unlimited | 5min |
| Agent fleet mesh | Tailscale | SSO + ACLs | Unlimited | 2min/machine |
| Database access | SSH tunnel | SSH keys | Unlimited | 10s |
| CI/CD tunnels | bore | Shared secret | Unlimited | 1min |

## Failure Modes

### Tunnel Disconnection Spiral
**Symptoms:** Agents timeout sporadically; tunnel shows as "connected" but traffic fails; error messages vary from "connection refused" to "timeout after 30s"
**Detection:** `curl -v tunnel-url` returns connection error but tunnel process is still running
**Root cause:** NAT timeout killed the tunnel connection but tunnel client hasn't detected it yet
**Fix:** Add keepalive: SSH `-o "ServerAliveInterval 30"`, ngrok has builtin keepalive, Tailscale handles this automatically
**Prevention:** Use autossh for SSH tunnels; monitor tunnel health with automated curl checks

### Auth Bypass Exposure
**Symptoms:** MCP server receiving unexpected requests; agents accessed by unauthorized users; tunnel access works from random IPs
**Detection:** Check tunnel access logs for unfamiliar source IPs; MCP server logs show tool calls you didn't make
**Root cause:** Created tunnel without authentication (default behavior for most tools)
**Fix:** Immediate: Close tunnel with `ngrok api tunnels delete` or kill process. Add auth: ngrok `--oauth`, Cloudflare Access, SSH keys
**Prevention:** Never create production tunnels without auth; audit active tunnels weekly with `ngrok api tunnels list`

### Bandwidth Throttling Cascade
**Symptoms:** Large agent responses (100K+ tokens) timeout; tunnel works for small requests but fails for file uploads/downloads; sporadic 503 errors
**Detection:** Monitor tunnel bandwidth usage; large payloads consistently fail while small ones succeed
**Root cause:** Hit free tier bandwidth limits; tunnel provider throttling or cutting connections
**Fix:** Upgrade to paid tier (ngrok) or switch to unlimited provider (Cloudflare/Tailscale)
**Prevention:** Test with realistic payload sizes; set up bandwidth monitoring alerts

### Orphaned Tunnel Proliferation
**Symptoms:** Multiple tunnel URLs for same service; confusion about which tunnel is "live"; security team finds unknown exposed services
**Detection:** `ps aux | grep -E "(ngrok|cloudflared|bore)"` shows multiple tunnel processes; `netstat -tlnp` shows unexpected listening ports
**Root cause:** Starting new tunnels without killing old ones; no tunnel lifecycle management
**Fix:** Kill all tunnel processes, audit exposed services, restart only needed tunnels with proper process management
**Prevention:** Use systemd/launchd for persistent tunnels; document active tunnels in project README; automated tunnel inventory

### Port Conflict Chaos
**Symptoms:** Tunnel fails to start with "port already in use"; multiple tunnel tools fighting over same port; agents can't bind to expected ports
**Detection:** `lsof -i :PORT` shows multiple processes bound to same port; tunnel startup logs show bind errors
**Root cause:** Running multiple tunnel tools simultaneously (ngrok + cloudflared + Tailscale serve all on port 443)
**Fix:** Stop all tunnel processes, assign unique ports per service, use port mapping in tunnel config
**Prevention:** Standardize on one tunnel tool per use case; document port assignments; use high ports (8000+) for local services

## Worked Examples

### Example 1: MCP Server + Cloudflare Tunnel + OAuth Integration

**Scenario:** Need to expose a local MCP server running file management tools to Claude Desktop, with authentication to prevent unauthorized access.

**Agent Decision Process:**
1. **Choose tool:** Production use + need auth + own domain = Cloudflare Tunnel
2. **Setup tunnel:** `cloudflared tunnel create mcp-tunnel` creates persistent tunnel
3. **Add authentication:** Enable Cloudflare Access with Google OAuth
4. **Test connectivity:** Verify tunnel health before giving URL to Claude

```bash
# Step 1: Agent creates tunnel infrastructure
cloudflared tunnel create mcp-tunnel
# Output: Tunnel ID abc123-def456-ghi789

# Step 2: Configure tunnel routing
cat > ~/.cloudflared/config.yml << EOF
tunnel: abc123-def456-ghi789
credentials-file: ~/.cloudflared/abc123-def456-ghi789.json

ingress:
  - hostname: mcp.mycompany.com
    service: http://localhost:3001
    originRequest:
      connectTimeout: 30s
      noTLSVerify: true
  - service: http_status:404
EOF

# Step 3: Create DNS record
cloudflared tunnel route dns mcp-tunnel mcp.mycompany.com

# Step 4: Test tunnel before adding auth
cloudflared tunnel run mcp-tunnel &
curl -v https://mcp.mycompany.com/health
# Should reach local MCP server

# Step 5: Add Cloudflare Access auth (via dashboard)
# Create application for mcp.mycompany.com
# Add policy: Allow emails ending in @mycompany.com
# Test: Browser redirect to Google login before reaching MCP

# Step 6: Configure Claude Desktop
cat > ~/.claude_desktop_config.json << EOF
{
  "mcpServers": {
    "file-tools": {
      "command": "mcp-server",
      "args": ["--config", "file-tools.json"],
      "env": {
        "MCP_TUNNEL_URL": "https://mcp.mycompany.com"
      }
    }
  }
}
EOF
```

**Expert insight:** Notice the tunnel health test (Step 4) before adding authentication. Novices often add auth first, then can't debug connectivity issues. Also, the `connectTimeout: 30s` handles slow MCP tool execution.

### Example 2: Agent Mesh Recovery with Tailscale

**Scenario:** 3-machine agent fleet (dev laptop, cloud VM, CI runner) where cloud VM becomes unreachable via Tailscale. Need to diagnose and restore mesh connectivity.

**Agent Decision Process:**
1. **Diagnose scope:** Is it one machine or the whole mesh?
2. **Check Tailscale status:** Use `tailscale status` to see peer connectivity
3. **Test mesh routes:** Use `tailscale ping` to isolate connectivity issues
4. **Force re-auth if needed:** `tailscale up --force-reauth`

```bash
# Step 1: Check mesh status from laptop
tailscale status
# Output shows:
# laptop.tail123.ts.net    100.64.0.1   online
# vm.tail123.ts.net        100.64.0.2   offline  last seen: 2h ago
# ci.tail123.ts.net        100.64.0.3   online

# Step 2: Test specific connectivity
tailscale ping vm.tail123.ts.net
# Fails with "no route to host"

# Step 3: Check if VM can reach other peers (SSH to VM)
ssh user@vm.publicip
tailscale status
# Shows: "Not connected" or "Authentication required"

# Step 4: Re-authenticate VM to tailnet
sudo tailscale up --force-reauth
# Opens browser for re-auth, or shows device authorization URL

# Step 5: Verify mesh restored from laptop
tailscale ping vm.tail123.ts.net
# Success: pong from 100.64.0.2

# Step 6: Test agent-to-agent communication
curl http://vm.tail123.ts.net:8001/health
# Agent API on VM now reachable from laptop agent

# Step 7: Set up monitoring to catch this early
cat > monitor-mesh.sh << 'EOF'
#!/bin/bash
for peer in vm.tail123.ts.net ci.tail123.ts.net; do
  if ! tailscale ping --timeout=5s $peer >/dev/null 2>&1; then
    echo "ALERT: $peer unreachable in Tailscale mesh"
    # Send to monitoring system
  fi
done
EOF
chmod +x monitor-mesh.sh
# Run via cron every 5 minutes
```

**Expert insight:** The key diagnostic is `tailscale status` showing "offline" vs "not connected". Offline means the peer was reachable but hasn't been seen recently (network issue). Not connected means authentication expired (policy issue).

### Example 3: SSH Tunnel Chain for Database Access

**Scenario:** Local agent needs to access a production database that's only reachable through a bastion host, with connection persistence across laptop sleep/wake cycles.

```bash
# Step 1: Set up persistent SSH tunnel with autossh
brew install autossh

# Step 2: Create SSH config for connection reuse
cat >> ~/.ssh/config << 'EOF'
Host bastion
  HostName bastion.company.com
  User tunnel-user
  IdentityFile ~/.ssh/tunnel-key
  ServerAliveInterval 30
  ServerAliveCountMax 3

Host db-tunnel
  HostName db-server.internal
  ProxyJump bastion
  LocalForward 5432 localhost:5432
EOF

# Step 3: Start persistent tunnel
autossh -M 20000 -fNL 5432:db-server.internal:5432 tunnel-user@bastion.company.com

# Step 4: Test database connectivity
psql -h localhost -p 5432 -U agent_user production_db
# Should connect to remote database via tunnel

# Step 5: Agent uses local database connection
export DATABASE_URL="postgresql://agent_user:password@localhost:5432/production_db"
python agent.py
# Agent queries database as if it were local

# Step 6: Set up systemd service for persistence (Linux)
cat > ~/.config/systemd/user/db-tunnel.service << 'EOF'
[Unit]
Description=Database SSH Tunnel
After=network-online.target

[Service]
Type=simple
ExecStart=/usr/bin/autossh -M 0 -o "ServerAliveInterval 30" -o "ServerAliveCountMax 3" -NL 5432:db-server.internal:5432 tunnel-user@bastion.company.com
Restart=always
RestartSec=10

[Install]
WantedBy=default.target
EOF

systemctl --user enable db-tunnel.service
systemctl --user start db-tunnel.service
```

**Expert insight:** The `ProxyJump` SSH config eliminates the need for manual tunnel chaining. Autossh monitoring port (`-M 20000`) tests tunnel health by sending data through a separate connection.

## Quality Gates

- [ ] Tunnel connectivity verified with `curl -v tunnel-url` before sharing URL
- [ ] Authentication configured and tested (OAuth, IP restriction, SSH keys, or shared secret)
- [ ] Tunnel process monitored for health (systemd, launchd, or manual process check)
- [ ] Bandwidth tested with realistic payload size (large context windows, file uploads)
- [ ] Latency measured end-to-end (client → tunnel → service → response)
- [ ] Security audit completed: no sensitive data in tunnel logs, auth method documented
- [ ] Fallback plan documented if tunnel provider has outage
- [ ] Active tunnel inventory maintained (`ngrok api tunnels list`, `cloudflared tunnel list`)
- [ ] Tunnel URLs treated as secrets (not committed to git, shared via secure channels)
- [ ] Persistent tunnels configured with auto-restart (systemd/launchd service)

## NOT-FOR Boundaries

**Do NOT use tunnels for:**
- **Load balancing across multiple agent instances** → Use reverse-proxy-for-agents (Nginx, Caddy, Traefik)
- **SSL termination and certificate management** → Use reverse-proxy-for-agents 
- **Container networking within Docker/K8s** → Use devops-automator for container networking
- **Firewall rules and security policies** → Use agentic-zero-trust-security for access control
- **DNS record management** → Use infrastructure skills for DNS automation
- **Service discovery within a cluster** → Use service mesh (Istio, Linkerd) not tunnels
- **File sharing between agents** → Use object storage or NFS, not tunneling file servers
- **Real-time streaming (video/audio)** → Tunnels add latency; use direct connections or CDN

**Delegate to other skills when:**
- Need complex routing rules → reverse