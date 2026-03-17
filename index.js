const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Your Presets Library
const presets = {
    "kill_all": "for _, v in pairs(game.Players:GetPlayers()) do v.Character:BreakJoints() end",
    "fling_all": "for _, v in pairs(game.Players:GetPlayers()) do v.Character.HumanoidRootPart.Velocity = Vector3.new(0, 1000, 0) end",
    "msg_server": "local m = Instance.new('Message', workspace); m.Text = 'System Update in Progress'; wait(5); m:Destroy()"
};

app.get('/get-command', (req, res) => {
    const presetName = req.query.preset;
    
    if (presets[presetName]) {
        res.send(presets[presetName]);
    } else {
        res.status(404).send("-- Preset not found");
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
