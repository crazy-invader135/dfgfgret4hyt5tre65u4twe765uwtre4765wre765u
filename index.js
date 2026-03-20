const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

let commandQueue = [];

// Basic Dashboard
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Roblox Loadstring Controller</title>
            <style>
                body { font-family: sans-serif; text-align: center; padding: 50px; background: #1a1a1a; color: #eee; }
                button { padding: 15px 30px; margin: 10px; font-size: 18px; cursor: pointer; border: none; border-radius: 8px; background: #6200ee; color: white; }
                button:hover { background: #3700b3; }
            </style>
        </head>
        <body>
            <h1>Remote Script Executor</h1>
            <button onclick="send('BaseplateChange')">Turn Baseplate Red</button>
            <button onclick="send('Nuke')">Kill Everyone</button>
            <button onclick="send('Foggy')">Toggle Fog</button>

            <script>
                function send(id) {
                    fetch('/send?id=' + id)
                        .then(r => r.text())
                        .then(data => console.log(data));
                }
            </script>
        </body>
        </html>
    `);
});

app.get('/send', (req, res) => {
    const id = req.query.id;
    if (id) {
        commandQueue.push(id);
        res.send("Command queued: " .. id);
    } else {
        res.status(400).send("No ID provided");
    }
});

app.get('/getCommand', (req, res) => {
    res.json({ id: commandQueue.shift() || null });
});

app.listen(PORT, () => console.log(`Server live on port ${PORT}`));
