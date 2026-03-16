const express = require('express');
const app = express();
app.use(express.json());

// --- CONFIGURATION ---
const VERSION = "3.1.0 (Locked)"; 
const ACCESS_KEY = "YOUR_SECRET_KEY_HERE"; // <--- CHANGE THIS TO YOUR PASSWORD
// ---------------------

let currentCommand = "none";
let targetUser = "All";
let scriptId = Date.now(); 

app.get('/', (req, res) => {
    res.send(`
        <html>
        <head>
            <title>Admin Panel v${VERSION}</title>
            <style>
                body { font-family: 'Segoe UI', sans-serif; background: #0f0f0f; color: white; padding: 40px; text-align: center; }
                .container { max-width: 450px; margin: auto; background: #1a1a1a; padding: 30px; border-radius: 15px; border: 1px solid #333; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
                h2 { color: #007bff; margin-bottom: 20px; }
                label { display: block; text-align: left; margin-top: 15px; font-size: 0.8em; color: #888; text-transform: uppercase; }
                select, input { width: 100%; padding: 12px; margin: 8px 0; background: #252525; color: white; border: 1px solid #444; border-radius: 6px; outline: none; }
                input:focus { border-color: #007bff; }
                button { width: 100%; padding: 15px; background: #007bff; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; margin-top: 20px; }
                button:hover { background: #0056b3; }
                .status { color: #555; margin-top: 20px; font-size: 0.85em; }
            </style>
        </head>
        <body>
            <div class="container">
                <h2>Admin Login</h2>
                
                <label>Security Key</label>
                <input type="password" id="key" placeholder="Enter Secret Key">

                <hr style="border: 0; border-top: 1px solid #333; margin: 20px 0;">

                <label>Command</label>
                <select id="cmd">
                    <option value="none">-- Select Preset --</option>
                    <option value="kill">Kill Player</option>
                    <option value="freeze">Freeze Player</option>
                    <option value="unfreeze">Unfreeze Player</option>
                    <option value="kick">Kick Player</option>
                    <option value="fly_yield">Load Infinite Yield (URL)</option>
                </select>

                <label>Target Username</label>
                <input type="text" id="user" value="All">

                <button onclick="send()">Execute Command</button>
                <div id="status" class="status">Waiting for authentication...</div>
            </div>

            <script>
                async function send() {
                    const key = document.getElementById('key').value;
                    const cmd = document.getElementById('cmd').value;
                    const target = document.getElementById('user').value;
                    const status = document.getElementById('status');

                    if(!key) return alert("Please enter your Security Key!");
                    
                    status.innerText = "Authenticating...";
                    
                    const res = await fetch('/set-script', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({
                            code: cmd, 
                            target: target,
                            key: key
                        })
                    });

                    const result = await res.text();
                    if(result === "OK") {
                        status.innerText = "✅ Command Sent Successfully";
                        status.style.color = "#00ff00";
                    } else {
                        status.innerText = "❌ Access Denied: Invalid Key";
                        status.style.color = "#ff4444";
                    }
                }
            </script>
        </body>
        </html>
    `);
});

app.post('/set-script', (req, res) => {
    // Check if the key sent from the website matches our ACCESS_KEY
    if (req.body.key === ACCESS_KEY) {
        currentCommand = req.body.code;
        targetUser = req.body.target;
        scriptId = Date.now(); 
        res.send("OK");
    } else {
        res.status(403).send("Forbidden");
    }
});

app.get('/get-script', (req, res) => {
    res.json({ code: currentCommand, target: targetUser, id: scriptId });
});

app.listen(process.env.PORT || 3000);
