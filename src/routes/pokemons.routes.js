// Nous avons besoin d'importer le module express pour utiliser le Router
import express from 'express';
// À ajuster selon la structure
import { ListerPokemonsParTypes, TrouverUnPokemon, AjouterPokemon, ModifierUnPokemon, SupprimerUnPokemon } from "../controllers/pokemon.controller.js";

// Nous créons un objet router qui va nous permettre de gérer les routes
const router = express.Router();

// On utilise router au lieu de app, 
router.get('/liste', ListerPokemonsParTypes);

router.get('/:id', TrouverUnPokemon);

router.put('/:id', ModifierUnPokemon);

router.post('/', AjouterPokemon);

router.delete('/:id', SupprimerUnPokemon);

// On exporte le router pour pouvoir l'utiliser dans index.js
export default router;