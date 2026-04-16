# SpendNod

**Your AI agent wants to buy something — should it ask you first?**

SpendNod is a human-in-the-loop authorization gateway for AI agent transactions. Set spending limits, vendor blocklists, daily caps, and category restrictions. Approve or deny from your phone.

---

## Quick Start

### Claude Code
```bash
claude mcp add spendnod --transport http https://api.spendnod.com/mcp
```

### ChatGPT
Settings → Apps → Developer Mode → Create app → paste `https://api.spendnod.com/mcp`

### Any MCP client
```json
{
  "mcpServers": {
    "spendnod": {
      "url": "https://api.spendnod.com/mcp"
    }
  }
}
```

---

## What It Does

AI agents can now book flights, place orders, and transfer money on your behalf. SpendNod sits between your agent and every transaction — evaluating your rules in real-time and escalating anything outside your guardrails to you for approval.

**Rule evaluation (in priority order):**
1. Blocked vendors / blocked categories → instant deny
2. Auto-approve below threshold → instant approve
3. Require approval above threshold → escalate to human
4. Max per transaction → escalate if exceeded
5. Max per day (aggregate) → escalate if would exceed
6. Max per month (aggregate) → escalate if would exceed
7. Allowed vendors / allowed categories → escalate if not in whitelist
8. Default (no rules triggered) → auto-approve

---

## Features

- **Spending thresholds** — auto-approve small purchases, require human sign-off above a limit
- **Vendor blocklists** — permanently block specific merchants
- **Daily & monthly caps** — hard budget limits across all agent activity
- **Category restrictions** — block or restrict entire spending categories (gambling, travel, etc.)
- **Rule templates** — Conservative, Moderate, and Permissive presets to get started fast
- **Real-time dashboard** — live activity feed, stats, and pending approvals at [app.spendnod.com](https://app.spendnod.com)
- **Audit trail** — every request logged with outcome, timestamp, and rule that fired
- **OAuth 2.1 login** — Google and GitHub sign-in, no password required

---

## Works With

- Claude Code
- ChatGPT
- Cursor
- VS Code
- OpenClaw
- Any MCP-compatible client

---

## Pricing

| Plan | Price | Agents | Requests/mo |
|------|-------|--------|-------------|
| Free | $0 | 2 | 200 |
| Starter | $29/mo | 10 | 5,000 |
| Pro | $99/mo | Unlimited | 50,000 |

---

## Links

- **Website:** [spendnod.com](https://spendnod.com)
- **Dashboard:** [app.spendnod.com](https://app.spendnod.com)
- **API docs:** [api.spendnod.com/docs](https://api.spendnod.com/docs)

---

## License

Proprietary — All rights reserved.

Built by [Stack Industries LLC](https://spendnod.com)
