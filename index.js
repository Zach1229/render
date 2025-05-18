import express from 'express';
import tachesRouter from './src/routes/taches.routes.js';

const app = express();
app.use(express.json());

import cors from 'cors';
app.use(cors());

// Associer les routes aux bons fichiers
app.use('/', tachesRouter);

// Middleware pour gérer les routes 404
app.use((req, res) => {
    res.status(404).json({ message: `La route ${req.originalUrl} n'est pas définie.` });
});

// Démarrer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});