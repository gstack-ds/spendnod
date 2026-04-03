# SpendNod MCP Server

**Human authorization for AI agent transactions.** SpendNod sits between your AI agent and financial transactions — your agent checks in before every purchase, and you approve with one tap.

## What it does

When your AI agent wants to buy something, book a flight, or make any financial transaction, it calls SpendNod first. SpendNod evaluates your rules and returns one of three outcomes:

- **Auto-approved** — under your threshold, instant response, no human needed
- **Pending review** — above your threshold, you approve from your phone or dashboard
- **Denied** — blocked vendor or spending limit hit, instant rejection

Every decision is logged with a full audit trail.

## Available Tools

| Tool | Description |
|------|-------------|
| `authorize_transaction` | Request authorization before making a purchase, booking, or transfer. Call this BEFORE executing any transaction. |
| `check_authorization_status` | Check the status of a pending authorization request. Use this to poll for human approval. |
| `cancel_authorization` | Cancel a pending authorization request that is no longer needed. |

## Quick Start

### 1. Create an account

Sign up free at [spendnod.com](https://spendnod.com)

### 2. Set your rules

Go to the **Rules** page, select your agent, and apply a template:

- **Conservative** — every purchase requires your approval
- **Moderate** — purchases under $25 auto-approve, over $100 require approval
- **Permissive** — purchases under $100 auto-approve

Or create custom rules with vendor blocklists, daily spending caps, and category restrictions.

### 3. Connect your agent

Add the SpendNod MCP URL to your AI tool. When you connect, a browser window opens — log in with your SpendNod account and click "Allow." No API keys needed.

#### Claude Code ✅ Tested
```bash
claude mcp add spendnod --transport http https://agent-gate-production.up.railway.app/mcp
```
A browser window opens → log in → click Allow → connected.

#### Claude Desktop
Add to your `claude_desktop_config.json`:
```json
{
  "mcpServers": {
    "spendnod": {
      "url": "https://agent-gate-production.up.railway.app/mcp"
    }
  }
}
```
Restart Claude Desktop. You'll be prompted to authenticate in your browser.

#### Cursor
Add to `.cursor/mcp.json` in your project folder:
```json
{
  "mcpServers": {
    "spendnod": {
      "url": "https://agent-gate-production.up.railway.app/mcp"
    }
  }
}
```
Restart Cursor. Authenticate when prompted.

#### VS Code (Copilot)
Add to `.vscode/mcp.json` in your project folder:
```json
{
  "mcpServers": {
    "spendnod": {
      "url": "https://agent-gate-production.up.railway.app/mcp"
    }
  }
}
```
Restart VS Code. Authenticate when prompted.

#### OpenClaw
Add to your `openclaw.json`:
```json
{
  "mcpServers": {
    "spendnod": {
      "url": "https://agent-gate-production.up.railway.app/mcp"
    }
  }
}
```
Or via CLI:
```bash
openclaw config set mcpServers.spendnod.url "https://agent-gate-production.up.railway.app/mcp"
```

#### Any MCP Client
Any client that supports Streamable HTTP transport:
```json
{
  "mcpServers": {
    "spendnod": {
      "url": "https://agent-gate-production.up.railway.app/mcp"
    }
  }
}
```

### 4. Test it

Ask your AI agent:
> "Buy wireless headphones from Best Buy for $75"

The agent will call `authorize_transaction`. If it returns `pending`, check your dashboard to approve or deny.

## Example Usage

### Natural language (with MCP)
Just tell your agent what you want to buy. It automatically calls SpendNod before proceeding:

> "Order a 4K monitor from Amazon for $400"

Agent response:
> "I've submitted an authorization request to SpendNod. The purchase of $400.00 at Amazon is pending your approval. Please check your SpendNod dashboard to approve or deny this request."

### Direct API (for developers)
```bash
curl -X POST https://agent-gate-production.up.railway.app/v1/authorize \
  -H "Authorization: Bearer sk-ag-..." \
  -H "Content-Type: application/json" \
  -d '{"action":"purchase","amount":400,"vendor":"Amazon","description":"4K Monitor"}'
```

## Tool Parameters

### authorize_transaction

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `action` | string | Yes | What the agent wants to do (e.g., "purchase", "booking", "transfer") |
| `amount` | number | Yes | Transaction amount in the specified currency |
| `vendor` | string | Yes | The vendor or merchant name |
| `category` | string | No | Transaction category (e.g., "electronics", "travel", "food") |
| `description` | string | No | Human-readable description of the transaction |
| `currency` | string | No | ISO currency code (default: "USD") |

**Response:**
```json
{
  "id": "uuid",
  "status": "auto_approved | pending | denied",
  "amount": 400.00,
  "vendor": "Amazon",
  "rule_evaluation": {
    "decision": "pending",
    "reason": "Amount exceeds auto-approve threshold",
    "matched_rule_type": "require_approval_above"
  }
}
```

### check_authorization_status

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `request_id` | string | Yes | The ID returned from authorize_transaction |

### cancel_authorization

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `request_id` | string | Yes | The ID of the pending request to cancel |

## Features

- **OAuth login** — connect with one URL, log in with your browser, no API keys to manage
- **8-step rule engine** — spending thresholds, vendor blocklists, daily caps, category restrictions, velocity limits
- **Rule templates** — Conservative, Moderate, Permissive presets with one-click apply
- **Mobile dashboard** — approve or deny from any device
- **Conservative defaults** — new agents require approval for everything until you set rules
- **Full audit trail** — every request, decision, and rule change is logged
- **EU AI Act ready** — complete audit trail for compliance

## Pricing

All features included on every plan. You only pay for scale.

| Plan | Authorizations/month | Agents | Price |
|------|---------------------|--------|-------|
| Free | 200 | 2 | $0 |
| Starter | 5,000 | 10 | $29/mo |
| Pro | 50,000 | 50 | $99/mo |
| Business | Unlimited | Unlimited | $299/mo |

Only `authorize_transaction` calls count. Checking status and cancelling are free.

## Links

- **Website:** [spendnod.com](https://spendnod.com)
- **API Docs:** [agent-gate-production.up.railway.app/docs](https://agent-gate-production.up.railway.app/docs)

## Support

Email: gary@stackindustries.com
