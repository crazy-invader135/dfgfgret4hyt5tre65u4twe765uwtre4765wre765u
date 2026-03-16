const express = require('express');
const app = express();
app.use(express.json());

// --- CONFIGURATION (EDIT THESE) ---
const ACCESS_KEY = "pass"; 
const OWNER_NAME = "crazy_invader135"; // Your exact Roblox name
const VERSION = "4.0.0 (Stable)";
// ----------------------------------

let currentCommand = "none";
let targetUser = "All";
let scriptId = Date.now(); 

app.get('/', (req, res) => {
    res.send(`
        <html>
        <head>
            <title>Bridge v${VERSION}</title>
            <style>
                body { font-family: sans-serif; background: #0a0a0a; color: #fff; padding: 40px; text-align: center; }
                .box { max-width: 400px; margin: auto; background: #111; padding: 30px; border-radius: 10px; border: 1px solid #333; }
                input, select { width: 100%; padding: 10px; margin: 10px 0; background: #222; color: #fff; border: 1px solid #444; border-radius: 5px; }
                button { width: 100%; padding: 12px; background: #007bff; border: none; color: #fff; font-weight: bold; cursor: pointer; }
                .owner-tag { color: #00ff00; font-size: 0.8em; margin-bottom: 20px; }
            </style>
        </head>
        <body>
            <div class="box">
                <h2>Cloud Bridge</h2>
                <div class="owner-tag">Registered Owner: ${OWNER_NAME}</div>
                
                <input type="password" id="key" placeholder="Security Key">
                <hr style="border:0; border-top:1px solid #333">
                
                <select id="cmd">
                    <option value="none">-- Select Command --</option>
                    <option value="kill">Kill Target</option>
                    <option value="freeze">Freeze Target</option>
                    <option value="kick">Kick Target</option>
                    <option value="inf_yield">Load Infinite Yield</option>
                </select>
                <input type="text" id="target" value="All" placeholder="Username or All">
                
                <button onclick="send()">Execute</button>
                <p id="msg" style="color:#888; font-size:0.8em"></p>
            </div>
            <script>
                async function send() {
                    const res = await fetch('/set-script', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({
                            key: document.getElementById('key').value,
                            code: document.getElementById('cmd').value,
                            target: document.getElementById('target').value
                        })
                    });
                    document.getElementById('msg').innerText = res.ok ? "Sent!" : "Invalid Key";
                }
            </script>
        </body>
        </html>
    `);
});

app.post('/set-script', (req, res) => {
    if (req.body.key === ACCESS_KEY) {
        currentCommand = req.body.code;
        targetUser = req.body.target;
        scriptId = Date.now();
        res.send("OK");
    } else { res.status(403).send("No"); }
});

app.get('/get-script', (req, res) => {
    res.json({ code: currentCommand, target: targetUser, id: scriptId, owner: OWNER_NAME });
});

app.listen(process.env.PORT || 3000);
