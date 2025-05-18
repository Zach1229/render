// Nous avons besoin d'importer le module express pour utiliser le Router
import express from 'express';

// À ajuster selon la structure
import {
    AjouterUtilisateur,
    RecupererOuGenererCleAPI, 
    ListerTachesPourUtilisateur, 
    AjouterTaches, 
    AjouterSousTaches, 
    TrouverUneTacheDetaillee,
    ModifierUneTache,
    ModifierLeStatutPourUneTache,
    SupprimerUneTache,
    ModifierUneSousTache,
    ModifierLeStatutPourUneSousTache,
    SupprimerUneSousTache
} from "../controllers/taches.controller.js";

// Protection de route (clé api)
import authentification from '../middlewares/authentification.middleware.js'

// Nous créons un objet router qui va nous permettre de gérer les routes
const router = express.Router();

// // On utilise router au lieu de app, 

router.post('/utilisateur', AjouterUtilisateur);

router.post('/utilisateur/cle', RecupererOuGenererCleAPI);

router.get('/liste', authentification, ListerTachesPourUtilisateur);

router.put('/soustache/:id/:complete', authentification, ModifierLeStatutPourUneSousTache);

router.delete('/soustache/:id', SupprimerUneSousTache);

router.put('/modifier/soustache/:id', authentification, ModifierUneSousTache);

router.put('/modifier/:id', authentification, ModifierUneTache);

router.post('/taches', authentification, AjouterTaches);
router.post('/soustaches', authentification, AjouterSousTaches);

router.put('/:id/:complete', authentification, ModifierLeStatutPourUneTache);

router.get('/:id', authentification, TrouverUneTacheDetaillee);

router.delete('/:id', SupprimerUneTache);


router.get('/api', (req, res) => {
    res.status(200).send('<h1>Bienvenue à mon API des tâches.</h1>');
});

// On exporte le router pour pouvoir l'utiliser dans index.js
export default router;