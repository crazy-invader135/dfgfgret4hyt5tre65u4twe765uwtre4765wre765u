const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

// This stores the current command and who it is meant for
let activeCommand = {
    script: null,
    targetPlayer: null, // Username of the person to "target"
    expiry: 0
};

const presets = {
    "kill_target": "https://pastebin.com/raw/example1",
    "fling_target": "https://pastebin.com/raw/example2"
};

app.get('/', (req, res) => {
    let buttons = Object.keys(presets).map(name => 
        `<button onclick="send('${name}')" style="padding:10px;margin:5px;">Execute ${name}</button>`
    ).join('');

    res.send(`
        <html>
            <body style="font-family:sans-serif; text-align:center;">
                <h1>Command Center</h1>
                <input type="text" id="target" placeholder="Target Username" style="padding:10px;"><br><br>
                ${buttons}
                <p id="status">Waiting...</p>
                <script>
                    function send(name) {
                        const target = document.getElementById('target').value;
                        if(!target) return alert("Enter a target username!");
                        fetch(\`/set-command?preset=\${name}&target=\${target}\`)
                            .then(() => document.getElementById('status').innerText = "Sent " + name + " to " + target);
                    }
                </script>
            </body>
        </html>
    `);
});

app.get('/set-command', async (req, res) => {
    const { preset, target } = req.query;
    if (presets[preset]) {
        try {
            const response = await axios.get(presets[preset]);
            activeCommand = {
                script: response.data,
                targetPlayer: target.toLowerCase(),
                expiry: Date.now() + 30000 // Command stays active for 30 seconds
            };
            res.send("Command Set");
        } catch (e) { res.status(500).send("Source Error"); }
    }
});

// Roblox calls this. It sends the target name so the server knows if it should run it.
app.get('/check', (req, res) => {
    if (activeCommand.script && Date.now() < activeCommand.expiry) {
        res.json({
            script: activeCommand.script,
            target: activeCommand.targetPlayer
        });
    } else {
        res.json({ script: null });
    }
});

app.listen(PORT, () => console.log("Server Live"));
