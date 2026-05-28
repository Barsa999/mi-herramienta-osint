const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get('/api/ip/:targetIp', async (req, res) => {
    const ip = req.params.targetIp;
    try {
        const respuesta = await fetch(`http://ip-api.com/json/${ip}`);
        const datos = await respuesta.json();
        res.json(datos);
    } catch (error) {
        res.status(500).json({ error: "Error de conexión" });
    }
});


app.listen(PORT, '0.0.0.0', () => {
    console.log(`[SYSTEM READY] Servidor corriendo en http://192.168.100.93:${PORT}`);
});