const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

// Update these URLs whenever you want to change what a preset does
const presets = {
    "kill_all": "https://pastebin.com/raw/PasteID1",
    "spawn_car": "https://pastebin.com/raw/PasteID2",
    "test": "https://pastebin.com/raw/PasteID3"
};

app.get('/get-command', async (req, res) => {
    const presetName = req.query.preset;
    const targetUrl = presets[presetName];

    if (targetUrl) {
        try {
            const response = await axios.get(targetUrl);
            res.set('Content-Type', 'text/plain');
            res.send(response.data);
        } catch (error) {
            res.status(500).send("-- Error: Could not reach Pastebin");
        }
    } else {
        res.status(404).send("-- Error: Preset not found");
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
