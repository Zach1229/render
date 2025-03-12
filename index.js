import express from 'express';
import { AjouterUtilisateur } from './src/controllers/pokemon.controller.js';
import pokemonsRouter from './src/routes/pokemons.routes.js';

const app = express();
app.use(express.json());

// Associer les routes aux bons fichiers
app.use('/api/pokemons', pokemonsRouter);
app.post('/api/users', AjouterUtilisateur);

app.get('/api', (req, res) => {
    res.status(200).send('<h1>Bienvenue à mon premier API</h1>');
});

// Middleware pour gérer les routes 404
app.use((req, res) => {
    res.status(404).json({ message: `La route ${req.originalUrl} n'est pas définie.` });
});

// Démarrer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});

