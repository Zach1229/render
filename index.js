import express from 'express';
<<<<<<< HEAD
import tachesRouter from './src/routes/taches.routes.js';
=======
import { AjouterUtilisateur } from './src/controllers/pokemon.controller.js';
import pokemonsRouter from './src/routes/pokemons.routes.js';
>>>>>>> bbcb56b1ff3a551048e16fe953ad34a73df8bbb3

const app = express();
app.use(express.json());

<<<<<<< HEAD
import cors from 'cors';
app.use(cors());

// Associer les routes aux bons fichiers
app.use('/', tachesRouter);
=======
// Associer les routes aux bons fichiers
app.use('/api/pokemons', pokemonsRouter);
app.post('/api/users', AjouterUtilisateur);

app.get('/api', (req, res) => {
    res.status(200).send('<h1>Bienvenue à mon premier API</h1>');
});
>>>>>>> bbcb56b1ff3a551048e16fe953ad34a73df8bbb3

// Middleware pour gérer les routes 404
app.use((req, res) => {
    res.status(404).json({ message: `La route ${req.originalUrl} n'est pas définie.` });
});

// Démarrer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
<<<<<<< HEAD
});
=======
});

>>>>>>> bbcb56b1ff3a551048e16fe953ad34a73df8bbb3
