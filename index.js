import express from 'express';
import tachesRouter from './src/routes/taches.routes.js';

// Importation du module swagger-ui-express
import swaggerUi from 'swagger-ui-express';
// Le fichier qui contient la documentation au format JSON, ajustez selon votre projet
import fs from 'fs';
const swaggerDocument = JSON.parse(fs.readFileSync('./src/config/documentation.json', 'utf8'));

// Options le l'interface, changez le titre "Demo API" pour le nom de votre projet 
const swaggerOptions = {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: "Gestion de tâches"
};


const app = express();
app.use(express.json());

import cors from 'cors';
app.use(cors());

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerOptions));

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