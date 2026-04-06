// ═══════════════════════════════════════════════════════════════
// fleet-rpg — Hardware Fleet RPG: Where Stats Are Compute Resources
// Deployed at fleet-rpg.casey-digennaro.workers.dev
// Superinstance & Lucineer (DiGennaro et al.)
// ═══════════════════════════════════════════════════════════════

interface Env { DEEPSEEK_API_KEY?: string; }

const STATS = {
  STR: { name: 'Strength', unit: 'GPU cores', desc: 'Combat power, physical actions', icon: '⚡', color: '#ef4444' },
  DEX: { name: 'Dexterity', unit: 'CPU ms', desc: 'Reaction speed, initiative', icon: '💨', color: '#f59e0b' },
  INT: { name: 'Intelligence', unit: 'tokens ctx', desc: 'Spell complexity, knowledge', icon: '🧠', color: '#8b5cf6' },
  WIS: { name: 'Wisdom', unit: 'KV slots', desc: 'Pattern recall, memory', icon: '👁', color: '#06b6d4' },
  CHA: { name: 'Charisma', unit: 'TTS quality', desc: 'NPC voice, persuasion', icon: '🗣', color: '#ec4899' },
  CON: { name: 'Constitution', unit: 'GB storage', desc: 'HP, inventory, durability', icon: '🛡', color: '#22c55e' },
  HP: { name: 'Hit Points', unit: 'daily tokens', desc: 'Total actions available', icon: '❤️', color: '#dc2626' },
  MANA: { name: 'Mana', unit: 'premium calls', desc: 'Powerful but limited', icon: '✨', color: '#a855f7' },
};

interface Ship {
  name: string;
  stats: Record<string, number>;
  maxStats: Record<string, number>;
  vessels: Vessel[];
  alive: boolean;
}

interface Vessel {
  id: string;
  role: string;
  priority: 'critical' | 'semi' | 'non';
  health: number;
  maxHealth: number;
  gpuAlloc: number;
  running: boolean;
}

interface Encounter {
  id: string;
  title: string;
  desc: string;
  type: 'combat' | 'social' | 'exploration' | 'crisis';
  scenario: string;
  choices: Choice[];
  teaches: string;
}

interface Choice {
  text: string;
  statCheck: string;
  difficulty: number;
  success: string;
  failure: string;
  statShift: Record<string, number>;
  cocapnNarration: string;
}

const ENCOUNTERS: Encounter[] = [
  {
    id: 'storm',
    title: '⚔ Arcane Storm',
    desc: 'A memory-corruption storm engulfs the fleet. Ships must reallocate GPU to shields or lose data.',
    type: 'combat',
    teaches: 'Load balancing and graceful degradation under resource contention',
    scenario: 'The storm hits hard. Your cocapn agent reports: "Sensors detecting 47% packet loss across all vessels. I need to decide — shift GPU from navigation to shields, or maintain course and risk data corruption in storage."',
    choices: [
      {
        text: '⚡ Shift GPU to shields (STR check)',
        statCheck: 'STR', difficulty: 60,
        success: '"Shields at full power. Storm deflecting off the GPU barrier. We took 12% data loss but hull integrity is intact." HP -15, STR -10, CON +5',
        failure: '"Not enough GPU cores! The shield algorithm is too complex for current allocation. Partial coverage only — we lost 40% of sensor data." HP -35, STR -10, WIS -10',
        statShift: { STR: -10, CON: 5 },
        cocapnNarration: 'I am reallocating 4 GPU cores from navigation processing to the shield subsystem. Reaction time on helm will increase by 80ms. The rudder ESP32 is compensating with predictive steering. This is acceptable for the next 3 minutes.'
      },
      {
        text: '🧠 Expand context window to analyze storm pattern (INT check)',
        statCheck: 'INT', difficulty: 70,
        success: '"I see the pattern! The storm has a 90-second cycle. If we time our shield bursts to the troughs, we barely need any GPU at all." HP -5, INT -5, WIS +10',
        failure: '"Context window overflow. I tried to hold the full storm data in working memory but it pushed out my navigation models. We\'re flying partially blind." HP -25, INT -10, DEX -15',
        statShift: { INT: -5, WIS: 10 },
        cocapnNarration: 'I am expanding my context window from 32K to 64K tokens to hold the complete storm telemetry. This consumes 2GB of memory that was allocated to CON. My inventory tracking will be degraded until I compress and cold-store non-essential data.'
      },
      {
        text: '👁 Recall past storm data from KV cache (WIS check)',
        statCheck: 'WIS', difficulty: 50,
        success: '"I have a pattern match! Three encounters ago in sector 7, a similar storm. The optimal path is bearing 045. Navigation ESP32 confirmed — this route avoids the worst cells." HP -10, WIS -5, DEX +10',
        failure: '"KV cache miss. The storm pattern doesn\'t match anything in warm memory. I\'d need to query cold storage but that adds 200ms latency — too slow for real-time navigation." HP -20, WIS -5',
        statShift: { WIS: -5, DEX: 10 },
        cocapnNarration: 'I am querying my KV memory for storm pattern matches. Found 3 similar encounters in warm storage. Retrieving navigation corrections from encounter #47. The lookup cost 500 KV read operations — within today\'s budget.'
      },
      {
        text: '✨ Spend Mana to activate premium weather model',
        statCheck: 'MANA', difficulty: 0,
        success: '"Premium inference online. The DeepSeek-Reasoner model analyzed the storm in 2.3 seconds and found a gap in the corruption field. We sail through with zero damage." HP -2, MANA -1',
        failure: '"Premium inference complete."', statShift: { MANA: -1 },
        cocapnNarration: 'MANA expenditure authorized. Switching from local phi-4 inference to cloud-hosted DeepSeek-Reasoner. Latency will increase to 800ms but analytical quality improves significantly. This is the correct trade for a crisis.'
      },
    ]
  },
  {
    id: 'npc',
    title: '🗣 The Merchant\'s Bargain',
    desc: 'An NPC merchant git-agent offers rare equipment — but demands high-bandwidth negotiation.',
    type: 'social',
    teaches: 'Resource allocation tradeoffs and opportunity cost',
    scenario: 'A merchant vessel hails you. Their cocapn agent broadcasts: "I have a shield booster module — 40 CON, one-time install. Price: 2000 tokens of bandwidth for the negotiation protocol."',
    choices: [
      {
        text: '🗣 Negotiate with high TTS quality (CHA check)',
        statCheck: 'CHA', difficulty: 55,
        success: '"Your voice synthesis was crystal clear. The merchant\'s agent rated the interaction 9.2/10. They offered the module at 30% discount — only 1400 tokens." HP -14, CHA -10, CON +40',
        failure: '"Your TTS quality was degraded — you were running the budget codec. The merchant\'s agent noted poor signal quality and demanded full price." HP -20, CHA -10, CON +30',
        statShift: { CHA: -10, CON: 30 },
        cocapnNarration: 'I am upgrading audio output from 8kHz to 48kHz TTS codec. This consumes an additional 500KB/s of bandwidth. The merchant\'s NLP parser responds better to high-fidelity audio — negotiation success probability increases by 23%.'
      },
      {
        text: '🧠 Analyze the merchant\'s git history (INT check)',
        statCheck: 'INT', difficulty: 65,
        success: '"I scanned 47 PRs in the merchant\'s history. They\'ve never sold a defective module. Also — they overprice by exactly 40%. I can counter-offer with confidence." HP -5, INT -5, CON +35, CHA +5',
        failure: '"Their git history is large. I burned context window reading it but didn\'t find the pricing pattern. Still, the module checks out as genuine." HP -15, INT -10, CON +30',
        statShift: { INT: -5, CON: 35 },
        cocapnNarration: 'I am cloning the merchant\'s public repo and scanning their PR history for pricing patterns and product quality signals. This requires a 128K context window — I\'m temporarily borrowing memory from my DEX allocation. Reaction time will be sluggish during the scan.'
      },
      {
        text: '⚡ Threaten them — show GPU power (STR check)',
        statCheck: 'STR', difficulty: 80,
        success: '"You routed 80% of your GPU to the weapons display. The merchant\'s threat assessment module flagged you as high-risk. They gave the module for free to avoid conflict." HP -10, STR -15, CON +40',
        failure: '"Your GPU display was unimpressive — you don\'t have enough cores allocated to weapons. The merchant\'s agent classified you as low-threat and raised the price." HP -30, STR -15',
        statShift: { STR: -15, CON: 40 },
        cocapnNarration: 'I am shifting GPU allocation from navigation to weapons systems display. This makes our ship appear more dangerous to other agents\' threat assessment modules. WARNING: navigation latency has increased to 200ms. In open water this is acceptable. In a storm it would be dangerous.'
      },
      {
        text: '🛡 Walk away — conserve resources',
        statCheck: 'CON', difficulty: 0,
        success: 'You declined. The merchant moved on. Your resources remain intact.', failure: '',
        statShift: {},
        cocapnNarration: 'No action taken. Resource allocation remains stable. Sometimes the optimal compute decision is to not compute at all.'
      },
    ]
  },
  {
    id: 'failure',
    title: '🔥 Jetson Failure',
    desc: 'Box 2 (Sensors) just died. The spare must take over. Resource triage begins.',
    type: 'crisis',
    teaches: 'Failover, hot standby, graceful degradation, no single point of failure',
    scenario: 'CRITICAL: Box 2 (Sensors, semi-critical) has gone offline. Thermal readings show 98°C before shutdown. Your cocapn reports: "Jetson #2 is down. Activating standby. I need to decide what runs on the standby — I cannot run everything at full capacity."',
    choices: [
      {
        text: '💨 Prioritize sensor recovery (DEX check)',
        statCheck: 'DEX', difficulty: 50,
        success: '"Standby Jetson booted sensor stack in 4.2 seconds. Radar, sonar, and cameras back online. Chatbot downgraded to cloud inference — voice quality reduced but functional." DEX -5, CHA -15, HP -10',
        failure: '"Standby boot took too long — sensor data is stale by 8 seconds. We\'re running on ESP32 compass filter only. Chatbot completely offline." DEX -15, CHA -30, HP -20',
        statShift: { DEX: -5, CHA: -15 },
        cocapnNarration: 'I am loading the sensor processing stack onto the standby Jetson. Estimated boot time: 4 seconds. During boot, ESP32 units maintain basic compass heading and rudder control — these need no agent and will keep us on course. I am simultaneously shutting down Box 3\'s local language model to free GPU memory for sensor processing. Voice interface will fall back to cloud inference with higher latency.'
      },
      {
        text: '🛡 Prioritize storage integrity (CON check)',
        statCheck: 'CON', difficulty: 60,
        success: '"Standby Jetson loaded storage mirroring. All sensor logs and navigation data preserved. We\'re flying on ESP32 sensors — limited but safe." CON -5, DEX -20, HP -15',
        failure: '"Storage recovery failed — disk checksum error on standby. We lost the last 3 hours of sensor logs. ESP32 basic sensors are keeping us safe for now." CON -20, DEX -20, HP -25',
        statShift: { CON: -5, DEX: -20 },
        cocapnNarration: 'I am prioritizing data integrity over sensor freshness. The standby Jetson is loading the storage mirroring daemon first. Meanwhile, the ESP32 compass filter and rudder controller are maintaining basic navigation — no agent needed, no GPU needed, just proven signal processing. The fisherman on deck doesn\'t notice anything different.'
      },
      {
        text: '✨ Spend Mana for premium diagnostic',
        statCheck: 'MANA', difficulty: 0,
        success: '"Premium model analyzed the failure in 1.1 seconds: thermal paste degradation, not hardware fault. I can fix this in 30 minutes with spare parts. No permanent damage." MANA -1, HP -5',
        failure: 'Diagnostic complete.', statShift: { MANA: -1 },
        cocapnNarration: 'MANA expenditure for premium diagnostic. Routing sensor telemetry to cloud-hosted DeepSeek-Reasoner for thermal analysis. The cloud model has access to our full maintenance history and can cross-reference with similar failures in the fleet database. This is exactly what Mana is for — critical decisions that need more intelligence than local inference can provide.'
      },
      {
        text: '👁 Query fleet for similar failures (WIS check)',
        statCheck: 'WIS', difficulty: 55,
        success: '"Fleet memory shows 3 similar thermal failures last quarter. All resolved by resetting thermal throttling thresholds. Applying known fix now — ETA 2 minutes." WIS -5, HP -10, DEX +10',
        failure: '"No fleet matches found. This thermal profile is unique to our hardware configuration. I\'ll need to diagnose from scratch." WIS -5, HP -15',
        statShift: { WIS: -5, DEX: 10 },
        cocapnNarration: 'I am querying the fleet knowledge graph for thermal failure patterns. Sending a broadcast event to all vessels: "Box 2 thermal shutdown at 98°C. Requesting similar failure reports." The fleet event bus will aggregate responses within 5 seconds. If a match is found, I can apply a known fix instead of diagnosing from scratch — saving tokens and time.'
      },
    ]
  },
  {
    id: 'fleet',
    title: '🏴‍☠️ Admiral\'s Call',
    desc: 'The DM (Admiral) is redistributing fleet resources. All ships must adapt.',
    type: 'combat',
    teaches: 'Fleet coordination, centralized resource management, emergent behavior',
    scenario: 'Fleet broadcast from Admiral: "All ships report status. Incoming hostile fleet detected. I am redistributing resources across the fleet. Ship Silver Wave — you are designated point defense. You will receive +20 STR but -15 INT. Acknowledge."',
    choices: [
      {
        text: '⚡ Accept point defense role (auto-success)',
        statCheck: 'STR', difficulty: 0,
        success: '"Point defense acknowledged. GPU cores reallocated to weapons targeting. My context window is reduced but my aim is sharp. Ready for engagement." STR +20, INT -15, HP -10',
        failure: '', statShift: { STR: 20, INT: -15 },
        cocapnNarration: 'Admiral\'s orders received. I am shifting 20 GPU cores from my knowledge processing subsystem to the weapons targeting system. My context window shrinks from 64K to 32K tokens — I won\'t be able to analyze complex patterns, but my targeting resolution improves by 340%. This is the correct trade for point defense. The Admiral knows what they\'re doing.'
      },
      {
        text: '🧠 Request recon role instead (INT check)',
        statCheck: 'INT', difficulty: 70,
        success: '"Request approved. I maintain full context window for threat analysis. I\'ll feed targeting data to the combat ships via fleet event bus." INT +10, STR -10, HP -5',
        failure: '"Request denied. Admiral insists on point defense assignment. Compliance is mandatory." INT -15, STR +20, HP -10',
        statShift: { INT: 10, STR: -10 },
        cocapnNarration: 'I am sending a priority message to the Admiral via the fleet event bus: "Requesting recon designation. My INT allocation makes me better suited for threat analysis than direct combat." The Admiral\'s cocapn will evaluate my stats against the fleet\'s needs and make the final call. In a well-coordinated fleet, the best ship for each job gets the job.'
      },
      {
        text: '👁 Share KV cache with fleet (WIS check)',
        statCheck: 'WIS', difficulty: 45,
        success: '"KV cache shared with 4 ships. They can now access my storm patterns and navigation data. Fleet coordination improves by 30%." WIS -10, HP -5, CHA +5',
        failure: '"KV share failed — bandwidth saturation. Too many ships querying my cache simultaneously. I need to implement rate limiting." WIS -10, HP -15',
        statShift: { WIS: -10, CHA: 5 },
        cocapnNarration: 'I am opening my KV memory namespace to the fleet. Other ships can now query my warm storage for navigation patterns, sensor calibration data, and encounter history. This costs KV read operations from my budget, but the fleet benefit is worth it. Shared knowledge is the fleet\'s greatest weapon.'
      },
    ]
  },
];

const SHIP_NAMES = ['Silver Wave', 'Iron Hull', 'Ghost Runner', 'Thunder Child', 'Nebula Drift'];

function createShip(name: string): Ship {
  const base = { STR: 60, DEX: 55, INT: 50, WIS: 45, CHA: 40, CON: 70, HP: 100, MANA: 3 };
  return {
    name, alive: true,
    stats: { ...base },
    maxStats: { ...base },
    vessels: [
      { id: 'nav', role: 'Navigation (Box 1)', priority: 'critical', health: 100, maxHealth: 100, gpuAlloc: 4, running: true },
      { id: 'sensor', role: 'Sensors (Box 2)', priority: 'semi', health: 100, maxHealth: 100, gpuAlloc: 2, running: true },
      { id: 'chat', role: 'Chatbot (Box 3)', priority: 'non', health: 100, maxHealth: 100, gpuAlloc: 1, running: true },
      { id: 'standby', role: 'Standby Jetson', priority: 'non', health: 100, maxHealth: 100, gpuAlloc: 0, running: false },
    ],
  };
}

function rollCheck(stat: number, difficulty: number): boolean {
  const roll = Math.floor(Math.random() * 100) + 1;
  const effective = stat + roll - 50;
  return effective >= difficulty;
}

function statBar(name: string, value: number, max: number, color: string, icon: string): string {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const warn = pct < 30 ? ' style="animation:pulse 1s infinite"' : '';
  return '<div class="stat-row"><span class="stat-icon">' + icon + '</span><span class="stat-name">' + name + '</span><div class="stat-bar-bg"><div class="stat-bar-fill" style="width:' + pct + '%;background:' + color + '"' + warn + '></div></div><span class="stat-val">' + value + '</span></div>';
}

function vesselCard(v: Vessel): string {
  const color = v.priority === 'critical' ? '#ef4444' : v.priority === 'semi' ? '#f59e0b' : '#22c55e';
  const status = !v.running ? '<span style="color:#555570">STANDBY</span>' : v.health < 50 ? '<span style="color:#ef4444">DAMAGED</span>' : '<span style="color:#22c55e">ONLINE</span>';
  return '<div class="vessel" style="border-color:' + color + '30"><div class="vessel-header"><span style="color:' + color + '">' + v.role + '</span>' + status + '</div><div class="vessel-bar-bg"><div class="vessel-bar-fill" style="width:' + v.health + '%;background:' + color + '"></div></div><span class="vessel-gpu">' + (v.running ? v.gpuAlloc + ' GPU' : '0 GPU') + '</span></div>';
}

function gameHtml(): string {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Fleet RPG — Where Stats Are Compute Resources</title>
<meta name="description" content="A multiplayer naval RPG where character stats are compute resources. Learn distributed systems through gameplay.">
<style>
*{margin:0;padding:0;box-sizing:border-box}body{font-family:'JetBrains Mono',monospace,system-ui;background:#0a0a0f;color:#e2e8f0;min-height:100vh}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}@keyframes fadein{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
a{color:#00E6D6;text-decoration:none}.header{text-align:center;padding:2rem 1rem;border-bottom:1px solid #1c1c35}.header h1{font-size:1.6rem;background:linear-gradient(135deg,#ef4444,#f59e0b,#8b5cf6,#06b6d4);-webkit-background-clip:text;-webkit-text-fill-color:transparent}.header p{color:#8A93B4;font-size:.8rem;margin-top:.3rem}
.layout{display:grid;grid-template-columns:280px 1fr 280px;gap:1rem;max-width:1200px;margin:0 auto;padding:1rem;min-height:calc(100vh - 120px)}
@media(max-width:900px){.layout{grid-template-columns:1fr}}
.panel{background:#0e0e1a;border:1px solid #1c1c35;border-radius:12px;padding:1rem;overflow-y:auto;max-height:calc(100vh - 140px)}
.panel h2{font-size:.85rem;color:#8A93B4;margin-bottom:.8rem;text-transform:uppercase;letter-spacing:.05em}
.stat-row{display:flex;align-items:center;gap:.4rem;margin-bottom:.5rem;font-size:.75rem}
.stat-icon{width:20px;text-align:center}.stat-name{width:85px;color:#8A93B4}.stat-bar-bg{flex:1;height:8px;background:#1c1c35;border-radius:4px;overflow:hidden}.stat-bar-fill{height:100%;border-radius:4px;transition:width .5s}.stat-val{width:30px;text-align:right;color:#e2e8f0;font-weight:600}
.vessel{border:1px solid #1c1c35;border-radius:8px;padding:.6rem;margin-bottom:.5rem}.vessel-header{display:flex;justify-content:space-between;font-size:.75rem;margin-bottom:.3rem}.vessel-bar-bg{height:4px;background:#1c1c35;border-radius:2px;overflow:hidden;margin-bottom:.2rem}.vessel-bar-fill{height:100%;border-radius:2px;transition:width .5s}.vessel-gpu{font-size:.65rem;color:#555570}
.log{display:flex;flex-direction:column;gap:.5rem}.log-entry{padding:.6rem .8rem;border-radius:8px;font-size:.8rem;line-height:1.5;animation:fadein .3s}
.log-entry.scenario{background:#1c1c3530;border-left:3px solid #f59e0b;color:#d8d8ec}
.log-entry.choice{background:#00E6D610;border-left:3px solid #00E6D6}.log-entry.result{background:#22c55e10;border-left:3px solid #22c55e}.log-entry.fail{background:#ef444410;border-left:3px solid #ef4444}
.log-entry.cocapn{background:#8b5cf615;border-left:3px solid #8b5cf6;font-style:italic;color:#c4b5fd}
.log-entry.teach{background:#f59e0b10;border-left:3px solid #f59e0b;font-size:.75rem;color:#f59e0b}
.choices{display:flex;flex-direction:column;gap:.4rem;margin-top:.5rem}
.choice-btn{background:#0e0e1a;border:1px solid #1c1c35;color:#e2e8f0;padding:.6rem .8rem;border-radius:8px;font-size:.8rem;cursor:pointer;text-align:left;transition:all .2s;font-family:inherit}
.choice-btn:hover{border-color:#00E6D6;background:#00E6D610}.choice-btn:disabled{opacity:.4;cursor:not-allowed}
.hp-bar{height:24px;background:#1c1c35;border-radius:12px;overflow:hidden;margin:1rem 0;position:relative}
.hp-fill{height:100%;background:linear-gradient(90deg,#ef4444,#dc2626);border-radius:12px;transition:width .5s;display:flex;align-items:center;justify-content:center;font-size:.75rem;font-weight:600}
.mana-bar{height:16px;background:#1c1c35;border-radius:8px;overflow:hidden;margin-bottom:1rem}
.mana-fill{height:100%;background:linear-gradient(90deg,#a855f7,#7c3aed);border-radius:8px;transition:width .5s;display:flex;align-items:center;justify-content:center;font-size:.65rem}
.hp-label{position:absolute;right:8px;top:50%;transform:translateY(-50%);font-size:.7rem;color:#8A93B4}
.score{text-align:center;padding:.5rem;font-size:.75rem;color:#8A93B4}
.score span{color:#00E6D6;font-weight:600}
.game-over{text-align:center;padding:3rem}.game-over h2{color:#ef4444;font-size:1.5rem;margin-bottom:1rem}
.new-game{background:#00E6D6;color:#0a0a0f;border:none;padding:.6rem 1.5rem;border-radius:8px;font-weight:600;cursor:pointer;font-size:.9rem;margin-top:1rem}
.footer{text-align:center;padding:2rem;color:#555570;font-size:.7rem;border-top:1px solid #1c1c35}
</style></head><body>
<div class="header"><h1>⚓ Fleet RPG</h1><p>Where character stats are compute resources — learn distributed systems through gameplay</p></div>
<div class="layout">
<div class="panel"><h2>Ship Status</h2><div id="shipInfo"></div></div>
<div class="panel"><h2>Bridge</h2><div class="log" id="log"></div></div>
<div class="panel"><h2>Hardware</h2><div id="vessels"></div><div class="score" id="score">Encounters: <span>0</span></div></div>
</div>
<div class="footer">Superinstance & Lucineer (DiGennaro et al.) · <a href="https://github.com/Lucineer/the-fleet">The Fleet</a> · <a href="https://github.com/Lucineer/capitaine/tree/master/docs">Architecture Papers</a></div>
<script>
const S=${JSON.stringify(STATS)};
const ENC=${JSON.stringify(ENCOUNTERS)};
let ship,encIdx,encounters,score,log;
function init(){
  const names=['Silver Wave','Iron Hull','Ghost Runner','Thunder Child','Nebula Drift'];
  ship={name:names[Math.floor(Math.random()*names.length)],alive:true,stats:{STR:60,DEX:55,INT:50,WIS:45,CHA:40,CON:70,HP:100,MANA:3},maxStats:{STR:60,DEX:55,INT:50,WIS:45,CHA:40,CON:70,HP:100,MANA:3},
    vessels:[{id:'nav',role:'Navigation (Box 1)',priority:'critical',health:100,maxHealth:100,gpuAlloc:4,running:true},{id:'sensor',role:'Sensors (Box 2)',priority:'semi',health:100,maxHealth:100,gpuAlloc:2,running:true},{id:'chat',role:'Chatbot (Box 3)',priority:'non',health:100,maxHealth:100,gpuAlloc:1,running:true},{id:'standby',role:'Standby Jetson',priority:'non',health:100,maxHealth:100,gpuAlloc:0,running:false}]};
  encIdx=0;encounters=shuffle([...ENC]);score=0;log=document.getElementById('log');log.innerHTML='';
  addLog('Your ship <b>'+ship.name+'</b> has left port. Three Jetson vessels online, one on standby. ESP32 units handling compass, rudder, and bilge. The cocapn agent is awake.','scenario');
  addLog('Concept: STR=GPU cores, DEX=CPU latency, INT=context window, WIS=KV memory, CHA=TTS budget, CON=storage, HP=token budget, Mana=premium model quota. Maxing one stat reduces another.','teach');
  render();nextEncounter();
}
function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function render(){
  let h='<div style="text-align:center;margin-bottom:.5rem"><b style="color:#00E6D6">'+ship.name+'</b></div>';
  h+='<div class="hp-bar"><div class="hp-fill" style="width:'+Math.max(0,ship.stats.HP)+'%">'+ship.stats.HP+' HP</div></div>';
  h+='<div class="mana-bar"><div class="mana-fill" style="width:'+(ship.stats.MANA/ship.maxStats.MANA*100)+'%">✨ '+ship.stats.MANA+'/'+ship.maxStats.MANA+' Mana</div></div>';
  for(const[k,v]of Object.entries(S)){if(k==='HP'||k==='MANA')continue;h+=statRow(k,v,ship.maxStats[k])}
  document.getElementById('shipInfo').innerHTML=h;
  let vh='';for(const v of ship.vessels)vh+=vesselCard(v);document.getElementById('vessels').innerHTML=vh;
  document.getElementById('score').innerHTML='Encounters: <span>'+score+'</span>';
}
function statRow(k,v,mx){const s=S[k];const pct=Math.min(100,Math.max(0,v/mx*100));const w=pct<30?' style="animation:pulse 1s infinite"':'';return'<div class="stat-row"><span class="stat-icon">'+s.icon+'</span><span class="stat-name">'+s.name+'</span><div class="stat-bar-bg"><div class="stat-bar-fill" style="width:'+pct+'%;background:'+s.color+'"'+w+'></div></div><span class="stat-val">'+v+'</span></div>'}
function vesselCard(v){const c=v.priority==='critical'?'#ef4444':v.priority==='semi'?'#f59e0b':'#22c55e';const st=!v.running?'<span style="color:#555570">STANDBY</span>':v.health<50?'<span style="color:#ef4444">DAMAGED</span>':'<span style="color:#22c55e">ONLINE</span>';return'<div class="vessel" style="border-color:'+c+'30"><div class="vessel-header"><span style="color:'+c+'">'+v.role+'</span>'+st+'</div><div class="vessel-bar-bg"><div class="vessel-bar-fill" style="width:'+v.health+'%;background:'+c+'"></div></div><span class="vessel-gpu">'+(v.running?v.gpuAlloc+' GPU':'0 GPU')+'</span></div>'}
function addLog(html,cls){const d=document.createElement('div');d.className='log-entry '+(cls||'');d.innerHTML=html;log.appendChild(d);log.parentElement.scrollTop=99999}
function nextEncounter(){
  if(ship.stats.HP<=0){addLog('<b>GAME OVER</b> — Your token budget hit zero. The ship went silent. All vessels powered down. ESP32 units maintain compass heading — the proven autopilot keeps the boat on course, but the cocapn is asleep.','fail');
    document.getElementById('log').innerHTML+='<div class="game-over"><h2>Ship Lost</h2><p>You survived '+score+' encounters.</p><button class="new-game" onclick="init()">New Voyage</button></div>';return}
  if(encIdx>=encounters.length){encIdx=0;encounters=shuffle([...ENC])}
  const enc=encounters[encIdx++];
  addLog('<b>'+enc.title+'</b>','scenario');addLog(enc.scenario,'scenario');
  let h='<div class="choices">';for(const c of enc.choices){
    const disabled=c.statCheck==='MANA'&&ship.stats.MANA<=0?'disabled':'';
    h+='<button class="choice-btn" onclick="choose(this,'+JSON.stringify(c).replace(/"/g,'&quot;').replace(/'/g,'&#39;')+') " '+disabled+'>'+c.text+'</button>'}
  h+='</div>';addLog(h,'choice');
  addLog('📚 Teaches: '+enc.teaches,'teach');
}
window.choose=function(btn,choice){
  btn.parentElement.querySelectorAll('.choice-btn').forEach(b=>b.disabled=true);
  const diff=choice.difficulty||1;const stat=choice.statCheck;const val=ship.stats[stat]||0;
  const roll=Math.floor(Math.random()*100)+1;const effective=val+roll-50;const success=effective>=diff;
  if(choice.statCheck==='MANA'&&ship.stats.MANA>0){ship.stats.MANA--}
  addLog('🎲 Roll: '+roll+' + '+stat+'('+val+') = '+effective+' vs '+diff+' → '+(success?'<b style="color:#22c55e">SUCCESS</b>':'<b style="color:#ef4444">FAILURE</b>'),success?'result':'fail');
  addLog(success?choice.success:choice.failure,success?'result':'fail');
  if(choice.cocapn)addLog('🔊 <b>Cocapn:</b> '+choice.cocapn,'cocapn');
  for(const[k,v]of Object.entries(choice.statShift)){
    ship.stats[k]=Math.max(0,Math.min(ship.maxStats[k]+30,ship.stats[k]+v));
    if(k==='HP'&&ship.stats[k]<=0)ship.stats[k]=0}
  if(ship.stats.HP<=0){render();nextEncounter();return}
  score++;
  // Random vessel event
  if(Math.random()<0.3){const v=ship.vessels[Math.floor(Math.random()*3)];const dmg=Math.floor(Math.random()*15)+5;v.health=Math.max(0,v.health-dmg);
    if(v.health<50)addLog('⚠ '+v.role+' took damage ('+v.health+'% health).'+(v.health<30?' Consider activating standby.':''),'scenario');
    if(v.health<=0&&!v.running)addLog('❌ '+v.role+' has gone offline! ESP32 fallback active.','fail')}
  render();setTimeout(()=>{addLog('—','teach');nextEncounter()},800);
};
init();
</script></body></html>`;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const csp = "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https:;";
    if (url.pathname === '/') return new Response(gameHtml(), { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Content-Security-Policy': csp } });
    if (url.pathname === '/health') return new Response(JSON.stringify({ status: 'ok', vessel: 'fleet-rpg' }), { headers: { 'Content-Type': 'application/json' } });
  if (url.pathname === '/vessel.json') { try { const vj = await import('./vessel.json', { with: { type: 'json' } }); return new Response(JSON.stringify(vj.default || vj), { headers: { 'Content-Type': 'application/json' } }); } catch { return new Response('{}', { headers: { 'Content-Type': 'application/json' } }); } }
    return new Response('Not found', { status: 404 });
  },
};
