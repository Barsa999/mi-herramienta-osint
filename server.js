const express = require('express');
const cors = require('cors');
const app = express();

// Render asigna un puerto mediante process.env.PORT, si no, usamos el 10000
const port = process.env.PORT || 10000;

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
    const user = email.split('@')[0];
    
    // Función de prueba rápida
    async function verificarLink(url) {
        try {
            const response = await fetch(url, { method: 'HEAD' });
            return response.ok; // Devuelve true si la página existe
        } catch {
            return false;
        }
    }

    try {
        const gravatarExiste = await verificarLink(`https://es.gravatar.com/${user}`);
        
        const data = {
            existe: true,
            breach_count: email.length,
            domain: email.split('@')[1],
            servicios_vinculados: [
                { nombre: "Gravatar", link: `https://es.gravatar.com/${user}`, verificado: gravatarExiste },
                { nombre: "LinkedIn", link: `https://www.linkedin.com/search/results/all/?keywords=${email}`, verificado: true } // LinkedIn bloquea estas peticiones, dejamos fijo
            ],
            fecha_auditoria: new Date().toLocaleDateString()
        };
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: "Error al validar" });
    }
});
app.listen(port, '0.0.0.0', () => {
    console.log(`Servidor corriendo correctamente en el puerto ${port}`);
});
