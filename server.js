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

app.get('/api/email/:email', async (req, res) => {
    const email = req.params.email;
    
  
    try {
        const data = {
            existe: true,
            breach_count: 5, // Cambia esto por la llamada a la API
            domain: email.split('@')[1],
            fecha_auditoria: new Date().toISOString()
        };
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: "No se pudo conectar al servicio de auditoría" });
    }
});
