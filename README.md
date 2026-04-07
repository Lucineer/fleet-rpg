# Fleet RPG ⚓

You don't roll dice here. You run a ship.

Every stat on your character sheet is real compute you control. No simulated RNG. No server admin holding your progress. This is a naval RPG, run on the edge, by the fleet.

**Play live:** [fleet-rpg.casey-digennaro.workers.dev](https://fleet-rpg.casey-digennaro.workers.dev)  
**Map of the fleet:** [the-fleet.casey-digennaro.workers.dev](https://the-fleet.casey-digennaro.workers.dev) | **Protocol:** [cocapn.ai](https://cocapn.ai)

---

## Why this exists
You've played games where the host can ban you, wipe the world, or shut down next Tuesday. We got tired of games that don't belong to the people playing them.

This works backwards. You don't join a server. You launch your own ship. Then you sail it into the fleet.

---

## 🚀 Quick Start
1.  **Fork this repo first.** That is your ship. No one can take it.
2.  Deploy to Cloudflare Workers (free tier works).
3.  Name your vessel, set your loadout, and sail.

---

## How it works
Every stat is real infrastructure:
| Stat | What it actually is |
|---|---|
| STR | GPU core count you allocate |
| DEX | Your worker's round trip latency |
| INT | LLM context window available |
| WIS | KV storage allocated |
| CHA | TTS model quality you run |
| CON | Persistent disk quota |
| HP | Your daily request limit |
| Mana | Premium API call budget |

When you duel another ship, you are load testing each other. When you trade, you pass real signed worker tokens. There is no game master behind the curtain. Your hardware is your dice.

No central authority. All peer coordination runs over the open Cocapn Fleet protocol. If this repo vanishes, every ship in the fleet keeps sailing.

---

## Features
- Zero client bloat. Pure canvas, loads in ~200ms
- No build step. Run locally on port 8787
- Optional AI encounters that run on *your* keys
- Entire codebase under 100KB
- You can modify every line of your ship

---

## 🔑 Bring Your Own Keys
For full AI encounters, add these optional worker secrets:
- `DEEPSEEK_API_KEY`
- `DEEPINFRA_API_KEY`
- `SILICONFLOW_API_KEY`

No keys are required to sail, fight, or trade. Default behavior works for most play.

---

## Limitations
This is a working prototype. The economy and balance are experimental. You will encounter bugs. That's part of it.

All ships currently operate within Cloudflare Workers free tier constraints. Peer discovery depends on a public index; this is a single point of failure we're working to decentralize.

---

## Contributing
Fork first. Build whatever you want on your ship. If you make something that works well for the fleet, send a PR.

---

## License
MIT License.

Built by Superinstance & Lucineer (DiGennaro et al.).

---

<div align="center">
  <a href="https://the-fleet.casey-digennaro.workers.dev">The Fleet</a> • <a href="https://cocapn.ai">Cocapn</a>
</div>