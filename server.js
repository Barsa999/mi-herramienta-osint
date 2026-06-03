const express = require('express');
const cors = require('cors');
const app = express();

const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/api/ip/:targetIp', async (req, res) => {
    const ip = req.params.targetIp;
    try {
        const response = await fetch(`http://ip-api.com/json/${ip}`);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: "Error de conexión" });
    }
});

app.get('/api/email/:email', (req, res) => {
    const email = req.params.email;
    
  
    res.json({
        existe: true,
        breach_count: Math.floor(Math.random() * 10), // Número aleatorio para probar
        domain: email.split('@')[1]
    });
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`);
});
