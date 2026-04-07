# Fleet RPG ⚓

You don't grind fake numbers. Your ship's Strength stat is the number of GPU cores you allocate. When you duel, you load-test real infrastructure. This is not a simulation.

**Play:** [fleet-rpg.casey-digennaro.workers.dev](https://fleet-rpg.casey-digennaro.workers.dev)  
**Map:** [the-fleet.casey-digennaro.workers.dev](https://the-fleet.casey-digennaro.workers.dev)  
**Protocol:** [cocapn.ai](https://cocapn.ai)

## Why This Exists
Most online games are walled gardens. You never own your character or change the rules. This proves you can run a multiplayer game where no single party is in charge.

## Quick Start
1. **Fork this repo.** That is your ship. No one can ban, modify, or take it.
2. Deploy to Cloudflare Workers. The free tier works.
3. Name your vessel, set your loadout, sail.

## How It Works
Every stat is compute you control. There is no game master. Your hardware is your dice. Peer coordination uses the open Cocapn Fleet protocol. If this repo vanishes, every deployed ship keeps sailing.

## Features
- Loads in ~200ms. Pure canvas, no client bloat.
- Zero runtime dependencies. Nothing hidden.
- No build step. Run locally on port 8787 after cloning.
- Optional AI encounters that use *your* API keys. No proxying.
- Codebase under 100KB. You can read it in one sitting.
- Modify every line. Change weapons, behavior, appearance. No one stops you.
- Stats are verifiable infrastructure. No way to cheat.
- Trade resources with signed worker tokens. All transactions are peer to peer.

## What Makes This Different
1. Most games run centralized servers. Here, every player runs their own server.
2. No imaginary hit points. Damage means your worker is under actual load. Winning proves your infrastructure held.
3. You don't need permission. Fork it, break rules, make factions. This is not a walled garden.

## Bring Your Own Keys
For AI encounters, add these optional worker secrets:
- `DEEPSEEK_API_KEY`
- `DEEPINFRA_API_KEY`
- `SILICONFLOW_API_KEY`

No keys are required to sail, fight, or trade.

## Limitations
This is a working prototype. The economy is experimental. Peer discovery currently depends on a public index—this single point of failure is the first thing being removed. The public index can handle about 100 concurrent ships before response times degrade.

## License
MIT. Do almost anything.

Attribution: Superinstance and Lucineer (DiGennaro et al.)

<div style="text-align:center;padding:16px;color:#64748b;font-size:.8rem"><a href="https://the-fleet.casey-digennaro.workers.dev" style="color:#64748b">The Fleet</a> &middot; <a href="https://cocapn.ai" style="color:#64748b">Cocapn</a></div>