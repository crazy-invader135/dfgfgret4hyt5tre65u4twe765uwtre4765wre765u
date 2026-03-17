const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

// The "Queue" - Roblox will fetch the script from here
let currentQueue = {
    script: null,
    timestamp: 0
};

// Your Library of Raw Pastebin URLs
const presets = {
    "kill_all": "https://pastebin.com/raw/example1",
    "message_all": "https://pastebin.com/raw/example2",
    "fling_players": "https://pastebin.com/raw/example3"
};

// 1. The Website Interface (The Control Panel)
app.get('/', (req, res) => {
    let buttons = Object.keys(presets).map(name => 
        `<button onclick="execute('${name}')" style="padding:10px; margin:5px; cursor:pointer;">Execute ${name}</button>`
    ).join('');

    res.send(`
        <html>
            <body style="font-family:sans-serif; text-align:center; padding-top:50px;">
                <h1>Roblox Command Center</h1>
                <div id="status">Ready</div>
                <hr/>
                ${buttons}
                <script>
                    function execute(name) {
                        document.getElementById('status').innerText = "Sending " + name + "...";
                        fetch('/set-command?preset=' + name)
                            .then(res => res.text())
                            .then(data => {
                                document.getElementById('status').innerText = "Last Sent: " + name;
                            });
                    }
                </script>
            </body>
        </html>
    `);
});

// 2. Set the command (Called by the Website buttons)
app.get('/set-command', async (req, res) => {
    const presetName = req.query.preset;
    const url = presets[presetName];
    if (url) {
        try {
            const response = await axios.get(url);
            currentQueue.script = response.data;
            currentQueue.timestamp = Date.now();
            res.send("Success");
        } catch (e) {
            res.status(500).send("Error fetching script");
        }
    } else {
        res.status(404).send("Preset not found");
    }
});

// 3. Get the command (Called by Roblox)
app.get('/get-command', (req, res) => {
    if (currentQueue.script) {
        res.send(currentQueue.script);
        // Clear the queue after sending so it doesn't run twice
        currentQueue.script = null; 
    } else {
        res.send("-- No command");
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
