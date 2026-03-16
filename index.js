const express = require('express');
const app = express();

app.use(express.json());
app.use(express.text());

// --- CONFIGURATION ---
const VERSION = "2.0.1"; 
// ---------------------

let currentScript = "-- No script set";
let targetUser = "All";
let scriptId = Date.now(); 

app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Roblox Remote Executor v${VERSION}</title>
            <style>
                body { font-family: 'Segoe UI', sans-serif; background: #121212; color: #e0e0e0; padding: 40px; }
                .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #333; padding-bottom: 15px; margin-bottom: 25px; }
                .version { background: #00ff00; color: #000; padding: 5px 10px; border-radius: 4px; font-weight: bold; font-size: 0.8em; }
                textarea { width: 100%; height: 350px; background: #1e1e1e; color: #00ff41; border: 1px solid #444; padding: 15px; font-family: 'Consolas', monospace; border-radius: 8px; outline: none; }
                .controls { margin-top: 20px; display: flex; gap: 15px; align-items: center; background: #1e1e1e; padding: 15px; border-radius: 8px; }
                input, select { background: #2d2d2d; color: white; border: 1px solid #555; padding: 10px; border-radius: 4px; }
                button { background: #007bff; color: white; border: none; padding: 12px 25px; cursor: pointer; border-radius: 4px; font-weight: bold; transition: 0.2s; }
                button:hover { background: #0056b3; transform: translateY(-2px); }
                .status { margin-top: 15px; color: #888; font-style: italic; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>Executor Dashboard</h1>
                <span class="version">V ${VERSION}</span>
            </div>
            
            <textarea id="code" placeholder="print('Hello from the Cloud!')"></textarea>
            
            <div class="controls">
                <label>Target Filter:</label>
                <select id="targetType" onchange="toggleInput()">
                    <option value="All">Global (Everyone)</option>
                    <option value="Specific">Specific Player</option>
                </select>
                <input type="text" id="username" placeholder="Exact Username" style="display:none;">
                <button onclick="sendScript()">Deploy Script</button>
            </div>
            
            <div id="status" class="status">Awaiting Input...</div>

            <script>
                function toggleInput() {
                    document.getElementById('username').style.display = 
                        document.getElementById('targetType').value === 'Specific' ? 'block' : 'none';
                }

                async function sendScript() {
                    const code = document.getElementById('code').value;
                    const type = document.getElementById('targetType').value;
                    const user = document.getElementById('username').value;
                    const status = document.getElementById('status');
                    
                    status.innerText = "Broadcasting...";
                    
                    try {
                        const res = await fetch('/set-script', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                code: code,
                                target: type === 'All' ? 'All' : user
                            })
                        });
                        if(res.ok) status.innerText = "Successfully deployed to " + (type === 'All' ? 'Global' : user);
                    } catch (e) {
                        status.innerText = "Failed to reach Render server.";
                    }
                }
            </script>
        </body>
        </html>
    `);
});

app.post('/set-script', (req, res) => {
    const data = req.body;
    currentScript = data.code;
    targetUser = data.target;
    scriptId = Date.now(); 
    res.send("OK");
});

app.get('/get-script', (req, res) => {
    res.json({
        code: currentScript,
        target: targetUser,
        id: scriptId
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Dashboard Online on Port ${PORT}`));
