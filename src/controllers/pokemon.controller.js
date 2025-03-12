// À ajuster selon la structure
import pokemonsModeles from "../models/pokemons.modele.js";
import generateApiKey from 'generate-api-key';

import bcrypt from 'bcrypt';
const costFactor = 10;


const ListerPokemonsParTypes = async (req, res) => {   /// PAS BESOIN DE AWAIT MAIS MM MÉThode pcq pas de code après
    pokemonsModeles.getPokemon()
        // Si c'est un succès
        .then((pokemons) => {
            var page = 1;
            var type = null;


            if (req.query.type) {
                type = req.query.type;
            }

            if (req.query.page) {
                page = req.query.page;
            }
         
            var tableauPokemon = [];
            var indexTableauTotal = 0;

            for (let i = 0; i < page; i++) {
                for (let index = 0; index < 25 ;) {
                    if (pokemons[indexTableauTotal].type_primaire == type && i == page - 1) {
                        tableauPokemon.push(pokemons[indexTableauTotal]);
                        index++;
                    }
                    else if (i != page - 1) {
                        index++;
                    }
                    else if (type == null && i == page - 1) {
                        tableauPokemon.push(pokemons[indexTableauTotal]);
                        index++;
                    }
                    indexTableauTotal++;
                }
            }

            if (tableauPokemon.length > 0) {
                res.status(200).json(tableauPokemon);
            } else {
                res.status(404).json({ message: 'Aucune salutation trouvée pour cette langue.' });
            }
        })
        // S'il y a eu une erreur au niveau de la requête, on retourne un erreur 500 car c'est du serveur que provient l'erreur.
        .catch((erreur) => {
            console.log('Erreur : ', erreur);
            res.status(500)
            res.send({
                message: "Erreur lors de la récupération de la liste de pokemons"
            });
        });
};

const TrouverUnPokemon = async (req, res) => {   /// PAS BESOIN DE AWAIT MAIS MM MÉThode
   pokemonsModeles.getPokemon()
    // Si c'est un succès
    .then((pokemons) => {
        let id = parseInt(req.params.id, 10); // Convertir en nombre
        let pokemonSouhaite = pokemons[0];
        
        for(let i = 0; i < pokemons.length; i++) {
            if(pokemons[i].id === id) {
                pokemonSouhaite = pokemons[i];
            }
        }            
    
        if (pokemons.length > 0) {
            res.status(200).json(pokemonSouhaite);
        } else {
            res.status(404).json({ message: 'Aucun pokemons trouvé pour cet id.' });
        }
    })
    // S'il y a eu une erreur au niveau de la requête, on retourne un erreur 500 car c'est du serveur que provient l'erreur.
    .catch((erreur) => {
        console.log('Erreur : ', erreur);
        res.status(500)
        res.send({
            message: "Erreur lors de la récupération du pokemons"
        });
    });
};

const AjouterPokemon = async (req, res) => { //// Pas bon faut j'ajoute à bd pas à mon tableau
    const champsManquants = [];
    const nom = req.body.nom;
    const type_primaire = req.body.type_primaire;
    const type_secondaire = req.body.type_secondaire;
    const pv = req.body.pv;
    const attaque = req.body.attaque;
    const defense = req.body.defense;
    const id = parseInt(req.params.id, 10); // Convertir en nombre

    if (!nom) champsManquants.push('nom');
    if (!pv) champsManquants.push('pv');
    if (!attaque) champsManquants.push('attaque');
    if (!defense) champsManquants.push('defense');
    if (!type_secondaire) champsManquants.push('type_secondaire');
    if (!type_primaire) champsManquants.push('type_primaire');

    // Si des champs manquent, retourne une erreur
    if (champsManquants.length > 0) {
        return res.status(400).json({
            erreur: 'Le format des données est invalide',
            champ_manquant: champsManquants
        });
    }

    pokemonsModeles.addPokemon(nom, type_primaire, type_secondaire, pv, attaque, defense)
    const nouveauPokemon 
    =
    [ nom, type_primaire,  type_secondaire, pv, attaque, defense, id ]
    
        // Si c'est un succès
        .then((pokemon) => {
            res.status(200).send({
                message: "Le pokemon" + nom + "a été ajouté avec succès",
                pokemon:nouveauPokemon
            });
        })
        // S'il y a eu une erreur au niveau de la requête, on retourne un erreur 500 car c'est du serveur que provient l'erreur.
        .catch((erreur) => {
            console.log(`Erreur SQL (${erreur.sqlState}) : ${erreur.sqlMessage}`);
            res.status(500)
            res.send({
                message: "Erreur lors de la récupération du pokemons : " + nom
            });
        });
};

const ModifierUnPokemon = async (req, res) => { //// Pas bon faut j'ajoute à bd pas à mon tableau

    const champsManquants = [];
    
    const nom = req.body.nom;
    const type_primaire = req.body.type_primaire;
    const type_secondaire = req.body.type_secondaire;
    const pv = req.body.pv;
    const attaque = req.body.attaque;
    const defense = req.body.defense;
    const id = parseInt(req.params.id, 10); // Convertir en nombre


    if (!nom) champsManquants.push('nom');
    if (!pv) champsManquants.push('pv');
    if (!attaque) champsManquants.push('attaque');
    if (!defense) champsManquants.push('defense');
    if (!type_secondaire) champsManquants.push('type_secondaire');
    if (!type_primaire) champsManquants.push('type_primaire');

    // Si des champs manquants, retourne une erreur
    if (champsManquants.length > 0) {
        return res.status(400).json({
            erreur: 'Le format des données est invalide',
            champ_manquant: champsManquants
        });
    }

    pokemonsModeles.modifierPokemon(nom, type_primaire, type_secondaire, pv, attaque, defense, id)
        // Si c'est un succès
        .then((pokemon) => {
            const nouveauPokemon 
            =
            [ nom, type_primaire,  type_secondaire, pv, attaque, defense, id ]

            res.status(200).send({
                message: "Le pokemon" + nom + "a été modifié avec succès",
                pokemon:nouveauPokemon
            });
        })
        // S'il y a eu une erreur au niveau de la requête, on retourne un eprreur 500 car c'est du serveur que provient l'erreur.
        .catch((erreur) => {
            console.log(`Erreur SQL (${erreur.sqlState}) : ${erreur.sqlMessage}`);
            res.status(500)
            res.send({
                message: "Erreur lors de la récupération du pokemons : " + nom
            });
        });
};

const SupprimerUnPokemon = async (req, res) => { //// Pas bon faut j'ajoute à bd pas à mon tableau
    
    const id = parseInt(req.params.id, 10); // Convertir en nombre
    let pokemonSouhaite;

    await pokemonsModeles.getPokemon()
    // Si c'est un succès
    .then((pokemons) => {
        pokemonSouhaite = pokemons[0];


        for(let i = 0; i < pokemons.length; i++) {
            if(pokemons[i].id === id) {
                pokemonSouhaite = pokemons[i];
            }
        }            
    })
    // S'il y a eu une erreur au niveau de la requête, on retourne un erreur 500 car c'est du serveur que provient l'erreur.
    .catch((erreur) => {
        console.log('Erreur : ', erreur);
        res.status(500)
        res.send({
            message: "Erreur lors de la supppression"
        });
    });
    
    pokemonsModeles.deletePokemon(id)
    // Si c'est un succès
    .then((pokemon) => {
        res.status(200).json({
                message : "Le pokemon" + id + "a été supprimé avec succès", 
                pokemon : pokemonSouhaite
            });
    })
    // S'il y a eu une erreur au niveau de la requête, on retourne un erreur 500 car c'est du serveur que provient l'erreur.
    .catch((erreur) => {
        console.log('Erreur : ', erreur);
        res.status(500)
        res.send({
            message: "Erreur lors de la récupération du pokemons"
        });
    });
};

const AjouterUtilisateur = async (req, res) => { //// Pas bon faut j'ajoute à bd pas à mon tableau
    const champsManquants = [];
    const nom = req.body.nom;
    const courriel = req.body.courriel;
    const api_key = generateApiKey();
    const mot_de_passe = await bcrypt.hash(req.body.mot_de_passe, costFactor);


    if (!nom) champsManquants.push('nom');
    if (!courriel) champsManquants.push('courriel');
    if (!mot_de_passse) champsManquants.push('mot_de_passe');

    // Si des champs manquent, retourne une erreur
    if (champsManquants.length > 0) {
        return res.status(400).json({
            erreur: 'Le format des données est invalide',
            champ_manquant: champsManquants
        });
    }

    if (!api_key) {
        return res.status(400).json({
            erreur: 'La génération de la clé a échoué'
        });
    }

    const nombre = await pokemonsModeles.getNombreUtilisateurSelon(courriel);

    if (nombre == 0) {
        pokemonsModeles.creerUtilisateur(nom, courriel, mot_de_passe, api_key)
                // Si c'est un succès
                .then((resultat) => {
                    res.status(200).send({
                        message: "L'utilisateur a été créé",
                        cle_api: api_key
                    });
                })
                // S'il y a eu une erreur au niveau de la requête, on retourne un erreur 500 car c'est du serveur que provient l'erreur.
                .catch((erreur) => {
                    console.log(`Erreur SQL (${erreur.sqlState}) : ${erreur.sqlMessage}`);
                    res.status(500)
                    res.send({
                        message: "Erreur lors de la creéation de l'utilisateur"
                    });
                });
    }
    else {
        return res.status(400).json({
            erreur: 'Un compte avec ce courriel est déjà éxistent'
        });
    }
};

export {
    ListerPokemonsParTypes,
    TrouverUnPokemon,
    AjouterPokemon,
    ModifierUnPokemon,
    SupprimerUnPokemon,
    AjouterUtilisateur
}