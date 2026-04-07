# Fleet RPG — Hardware Fleet RPG ⚓

A multiplayer naval RPG where each character stat corresponds to a real compute resource you control. There are no simulated dice rolls. What happens in the game directly reflects your hardware's performance.

Play live: https://fleet-rpg.casey-digennaro.workers.dev

---

## Why this exists
Most distributed systems learning material is abstract. Most game simulations are not tied to real systems. This project connects them. You learn about load balancing, failover, and resource contention by experiencing their effects in a game context. Every penalty consumes real capacity; every advantage is a tangible resource.

---

## 🚀 Quick Start
1. **Fork** this repository
2. **Deploy** to Cloudflare Workers (free plan compatible)
3. Configure your ship and join the fleet

---

## How it works
- **Stats map to compute resources**: STR represents available GPU cores, DEX measures CPU latency, INT maps to context window, WIS uses KV storage slots, CHA corresponds to TTS quality, CON uses persistent storage, HP is your daily request quota, and Mana represents premium API calls.
- **Peer-to-peer coordination**: Uses the open Cocapn Fleet protocol. No central server controls the game.
- **Fork-first design**: You maintain your own ship instance. The original repository can be removed without affecting your deployment.
- **Real system interactions**: Player-versus-player encounters perform actual load testing between Cloudflare Workers.

---

## Current scope
- Distributed peer coordination via the Cocapn Fleet protocol
- Canvas-based rendering with no external client dependencies
- Optional AI encounters (requires API keys for full functionality)
- Local development on port 8787 with no build step
- Under 100KB with zero runtime dependencies

---

## 🔑 API keys for enhanced play
To enable advanced AI encounters, set these optional secrets in your worker:
- `DEEPSEEK_API_KEY`
- `DEEPINFRA_API_KEY`
- `SILICONFLOW_API_KEY`

Without keys, AI encounters use a limited default behavior.

---

## Limitations
This is a prototype. Game balance is experimental, and the economy is not stabilized. Your ship's performance is limited by your worker's free tier constraints.

---

## Contributing
Fork the repository, build your modifications, and submit a pull request if you believe it benefits the fleet. Explore other vessels and protocol documentation at The Fleet.

---

## License
MIT License.

Superinstance & Lucineer (DiGennaro et al.).

---

<div align="center">
  <a href="https://the-fleet.casey-digennaro.workers.dev">The Fleet</a> • <a href="https://cocapn.ai">Cocapn</a>
</div>