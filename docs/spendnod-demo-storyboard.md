# SpendNod Demo Video — Shot-by-Shot Storyboard

**Total runtime:** ~2 minutes
**Recording tool:** Loom (recommended) or OBS
**Setup before recording:**
- Dashboard open in browser (logged in, dark mode)
- Terminal open with Python ready
- Phone with dashboard open at agentgate-two.vercel.app
- Have your test bot API key ready to paste
- Apply Moderate template to your test bot before recording
- Add a blocked_vendors rule for "Walmart" before recording

---

## PRE-RECORDING CHECKLIST

- [ ] Dashboard logged in, Overview page showing
- [ ] Terminal open, sized to show ~15 lines
- [ ] Phone charged, dashboard loaded, screen recording or Loom mobile ready
- [ ] Moderate rules applied to test bot (auto-approve <$25, require approval >$100, $200/day)
- [ ] Walmart added to blocked vendors
- [ ] Clear any old pending requests so the dashboard looks clean
- [ ] Practice the script once out loud

---

## SHOT 1 — Cold open
**Duration:** 8 seconds
**Screen:** Terminal with cursor blinking on empty line
**Action:** Nothing — just the terminal sitting there
**Say:** "As AI agents become more embedded in the economy — shopping for us, booking travel, managing subscriptions — one question keeps coming up:"
**Transition:** Pause for effect

## SHOT 2 — The question
**Duration:** 5 seconds
**Screen:** Same terminal
**Action:** None
**Say:** "Who's actually in control of the spending?"
**Transition:** Switch to browser

## SHOT 3 — Introduce SpendNod
**Duration:** 5 seconds
**Screen:** Browser — SpendNod dashboard login page
**Action:** Show the login screen briefly, then cut to the Overview (already logged in)
**Say:** "Introducing SpendNod. The authorization layer between AI agents and your wallet."
**Transition:** Switch to terminal

## SHOT 4 — Show the SDK code
**Duration:** 15 seconds
**Screen:** Terminal
**Action:** Type or paste these lines (have them ready in clipboard):

```python
from spendnod import SpendNod
gate = SpendNod(api_key="sk-ag-...")
approval = gate.authorize(action="purchase", amount=749.99, vendor="Best Buy", description="4K Monitor")
```

**Say:** "For developers, it's three lines of code. Import SpendNod, initialize with your API key, and call authorize with what the agent wants to do."
**Note:** Don't actually run this — we'll use PowerShell for the real call. This is just to show the SDK syntax. If you want to run it live, use the PowerShell version instead.

## SHOT 5 — Fire the big purchase (PowerShell)
**Duration:** 10 seconds
**Screen:** Terminal (PowerShell)
**Action:** Run:
```powershell
$body = '{"action":"purchase","amount":749.99,"vendor":"Best Buy","category":"electronics","description":"4K Monitor"}'
Invoke-RestMethod -Uri "https://agent-gate-production.up.railway.app/v1/authorize" -Method POST -Body $body -Headers $agentHeaders
```
**Wait for response:** status = pending
**Say:** "This agent wants to buy a 4K monitor from Best Buy for $749. The rule engine flagged it — above the approval threshold. It's waiting for a human."
**Transition:** Pick up phone

## SHOT 6 — Phone approval
**Duration:** 15 seconds
**Screen:** Phone showing SpendNod dashboard → Pending Requests page
**Action:**
1. Show the pending card: "test bot — Best Buy — $749.99 — 4K Monitor"
2. Show the countdown timer
3. Tap "Approve"
4. Show the "Request approved" toast
**Say:** "On my phone, I see the request instantly. Agent name, vendor, amount, description, and a countdown timer. I tap Approve — and the agent gets the green light."
**Transition:** Back to terminal

## SHOT 7 — Auto-approve scenario
**Duration:** 10 seconds
**Screen:** Terminal
**Action:** Run:
```powershell
$body = '{"action":"purchase","amount":15.00,"vendor":"Amazon","description":"Phone charger"}'
Invoke-RestMethod -Uri "https://agent-gate-production.up.railway.app/v1/authorize" -Method POST -Body $body -Headers $agentHeaders
```
**Wait for response:** status = auto_approved
**Say:** "Now watch what happens with a small purchase. $15 at Amazon — auto-approved. Under the threshold, no human needed."
**Transition:** Stay on terminal

## SHOT 8 — Blocked vendor scenario
**Duration:** 10 seconds
**Screen:** Terminal
**Action:** Run:
```powershell
$body = '{"action":"purchase","amount":10.00,"vendor":"Walmart","description":"Paper towels"}'
Invoke-RestMethod -Uri "https://agent-gate-production.up.railway.app/v1/authorize" -Method POST -Body $body -Headers $agentHeaders
```
**Wait for response:** status = denied, reason = "Vendor 'Walmart' is blocked"
**Say:** "And a blocked vendor? Denied instantly. The agent never even gets to check out."
**Transition:** Switch to browser

## SHOT 9 — Show the rules
**Duration:** 15 seconds
**Screen:** Browser — Rules page
**Action:**
1. Show the three template preset cards (Conservative, Moderate, Permissive)
2. Hover over each briefly
3. Scroll down to show the active rules for your agent
**Say:** "You set your own rules. Conservative — everything requires approval. Moderate — small purchases auto-approve, big ones need your sign-off. Permissive — higher thresholds for power users. Or build custom rules with vendor blocklists, daily spending caps, and per-transaction limits."
**Transition:** Click to Activity page

## SHOT 10 — Activity feed / audit trail
**Duration:** 8 seconds
**Screen:** Browser — Activity page
**Action:** Show the activity feed with colored dots — green for approved, red for denied
**Say:** "Every decision is logged. Auto-approved, human-approved, denied. Complete audit trail — exactly what the EU AI Act requires when it takes effect August 2nd."
**Transition:** Pause, then close

## SHOT 11 — Closing
**Duration:** 8 seconds
**Screen:** Browser — Overview page (or a title card if you make one)
**Action:** Just show the clean dashboard
**Say:** "Three lines of code for the developer. One tap to approve for the human. Full audit trail for compliance. SpendNod — sign up free at spendnod.dev."
**Transition:** End recording

---

## TIPS FOR RECORDING

1. **Record in one take if possible.** Loom makes this easy — you can trim the start and end.
2. **Talk slower than you think.** Developers watch at 1.5x speed anyway.
3. **Don't read the script word-for-word.** Use the bullet points above as a guide and speak naturally.
4. **Show the terminal responses.** Pause for 2-3 seconds after each API response so viewers can read it.
5. **Phone filming:** If you can't screen-record your phone, just point your webcam/laptop camera at your phone screen. It's authentic and shows the real mobile experience.
6. **Clean your terminal.** Run `clear` before starting so there's no clutter.
7. **Use dark mode everywhere.** Terminal, dashboard, phone dashboard. Looks more professional in video.
8. **Set up $agentHeaders before recording:** Have this ready in your terminal so you don't fumble during the video:
   ```powershell
   $agentKey = "your-sk-ag-key"
   $agentHeaders = @{Authorization="Bearer $agentKey"; "Content-Type"="application/json"}
   ```

---

## POST-RECORDING

1. Trim dead air from start and end
2. Add the video to: LinkedIn, Twitter/X, YouTube, and your landing page
3. Post with: "I built an authorization gateway for AI agents in 3 days. Here's a 2-minute demo."
4. Tag relevant communities: AI agent developers, LangChain, CrewAI, FastAPI
