// À ajuster selon la structure
import tachesModeles from "../models/taches.modele.js";
import { generateApiKey } from 'generate-api-key';

import bcrypt from 'bcrypt';
const costFactor = 10;

/**
 * Récupère les tâches associées à un utilisateur selon sa clé API.
 * Si le paramètre "tous=oui" est présent, toutes les tâches sont retournées.
 * Sinon, seules les tâches non complétées sont retournées.
 * 
 * @param req - Requête HTTP.
 * @param res - Réponse HTTP retournant les tâches trouvées ou un message d'erreur.
 */
const ListerTachesPourUtilisateur = async (req, res) => {
    const cleApi = req.headers.authorization.split(' ')[1];

    const siTousTaches = req.query.tous;
    
    if(siTousTaches == "oui") {
        tachesModeles.getTousTachesSelon(cleApi)
            // Si c'est un succès
            .then((taches) => {
                if (taches.length > 0) {
                    const resultats = taches.map(taches => ({ titre: taches.titre, id: taches.id }));
                    res.status(200).json(resultats);
                } else {
                    res.status(404).json({ message: 'Aucune tâches trouvées pour cette utilisateur.' });
                }
            })
            // S'il y a eu une erreur au niveau de la requête, on retourne un erreur 500 car c'est du serveur que provient l'erreur.
            .catch((erreur) => {
                console.log('Erreur : ', erreur);
                res.status(500)
                res.send({
                    message: "Erreur lors de la récupération de la liste de tâches."
                });
            });
    } 
    else {
        tachesModeles.getTachesNonCompleteesSelon(cleApi)
            // Si c'est un succès
            .then((taches) => {
                if (taches.length > 0) {
                    const resultats = taches.map(taches => ({ titre: taches.titre, id: taches.id }));
                    res.status(200).json(resultats);
                } else {
                    res.status(404).json({ message: 'Aucune tâches trouvées pour cette utilisateur.' });
                }
            })
            // S'il y a eu une erreur au niveau de la requête, on retourne un erreur 500 car c'est du serveur que provient l'erreur.
            .catch((erreur) => {
                console.log('Erreur : ', erreur);
                res.status(500)
                res.send({
                    message: "Erreur lors de la récupération de la liste des tâches non-complétées."
                });
            });
    }
};

/**
 * Trouve une tâche selon son ID.
 * 
 * @param req - Requête HTTP.
 * @param res - Réponse HTTP retournant la tâches trouvée ou un message d'erreur.
 */
const TrouverUneTacheDetaillee = async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const cleApi = req.headers.authorization.split(' ')[1];

    const utilisateur = await tachesModeles.trouverUtilisateurSelonCleAPI(cleApi);

    if (!utilisateur) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    const utilisateur_id = utilisateur.id;


   tachesModeles.trouverTacheSelonIdEtUtilisateurId(id, utilisateur_id)
    // Si c'est un succès
    .then((tache) => {
        if (tache != null) {
            res.status(200).json(tache);
        } else {
            res.status(404).json({ message: 'Aucune tâche trouvée pour cet id.' });
        }
    })
    // S'il y a eu une erreur au niveau de la requête, on retourne un erreur 500 car c'est du serveur que provient l'erreur.
    .catch((erreur) => {
        console.log('Erreur : ', erreur);
        res.status(500)
        res.send({
            message: "Erreur lors de la récupération de la tâche."
        });
    });
};

/**
 * Ajoute une nouvelle tâche à la base de données pour l'utilisateur identifié par sa clé API.
 * 
 * @param req - Requête HTTP.
 * @param res - Réponse HTTP avec un message de succès ou une erreur.
 */
const AjouterTaches = async (req, res) => {
    const champsManquants = [];
    const { titre, description, date_debut, date_echeance } = req.body;

    if (!titre) champsManquants.push('titre');
    if (!description) champsManquants.push('description');
    if (!date_debut) champsManquants.push('date_debut');
    if (!date_echeance) champsManquants.push('date_echeance');

    if (champsManquants.length > 0) {
        return res.status(400).json({
            erreur: 'Le format des données est invalide',
            champ_manquant: champsManquants
        });
    }

    try {
        const cle_api = req.headers.authorization?.split(' ')[1];

        const utilisateur = await tachesModeles.trouverUtilisateurSelonCleAPI(cle_api);

        if (!utilisateur) {
            return res.status(404).json({ message: "Utilisateur non trouvé ou clé API invalide" });
        }

        const utilisateur_id = utilisateur.id;

        const nouvelleTache = await tachesModeles.ajouterTaches(
            utilisateur_id,
            titre,
            description,
            date_debut,
            date_echeance
        );

        return res.status(200).json({
            message: `La tâche "${titre}" a été ajoutée avec succès.`,
            tache: description
        });
    } catch (erreur) {
        console.error(`Erreur (${erreur})`);
        return res.status(500).json({
            message: `Erreur lors de l'ajout de la tâche : ${titre}`
        });
    }
    
};

/**
 * Ajoute une sous-tache.
 * 
 * @param req - Requête HTTP.
 * @param res - Réponse HTTP retournant un message de réusssir ou un message d'erreur.
 */
const AjouterSousTaches = async (req, res) => {
    const champsManquants = [];
    const titre = req.body.titre;
    const tache_titre = req.body.tache_titre;

    if (!tache_titre) champsManquants.push('tache_titre');
    if (!titre) champsManquants.push('titre');

    if (champsManquants.length > 0) {
        return res.status(400).json({
            erreur: 'Le format des données est invalide',
            champ_manquant: champsManquants
        });
    }

    try {
        const cle_api = req.headers.authorization?.split(' ')[1];

        const utilisateur = await tachesModeles.trouverUtilisateurSelonCleAPI(cle_api);

        if (!utilisateur) {
            return res.status(404).json({ message: "Utilisateur non trouvé ou clé API invalide" });
        }

        const utilisateur_id = utilisateur.id;

        const tache = await tachesModeles.trouverTacheSelonTitreEtUtilisateurId(tache_titre, utilisateur_id);

       if (!tache) {
            return res.status(404).json({ message: "Tache non trouvé" });
        }

        const tache_id = tache.id;

        const nouvelleSousTache = await tachesModeles.ajouterSousTaches(
            tache_id,
            titre
        );

        return res.status(200).json({
            message: `La sous-tâche "${titre}" a été ajoutée avec succès.`,
            tache_principale: tache_titre
        });
    } catch (erreur) {
        console.error(`Erreur (${erreur})`);
        return res.status(500).json({
            message: `Erreur lors de l'ajout de la sous-tâche : ${titre}`
        });
    }
    
};

/**
 * Met à jour le statut d'une tâche.
 * 
 * @param req - Requête HTTP.
 * @param res - Réponse HTTP avec un message de succès ou d'erreur.
 */
const ModifierLeStatutPourUneTache = async (req, res) => {
 const champsManquants = [];
    const id = parseInt(req.params.id, 10);
    let complete_int = parseInt(req.params.complete, 10);
    
    if (!id) champsManquants.push('titre');
    if (!complete_int || complete_int != 0 && complete_int != 1) champsManquants.push('complete');

    if (champsManquants.length > 0) {
        return res.status(400).json({
            erreur: 'Le format des données est invalide',
            champ_manquant: champsManquants
        });
    }

    const cle_api = req.headers.authorization?.split(' ')[1];

    const utilisateur = await tachesModeles.trouverUtilisateurSelonCleAPI(cle_api);

    if (!utilisateur) {
        return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    const utilisateur_id = utilisateur.id;

    const tache = await tachesModeles.trouverTacheSelonIdEtUtilisateurId(id, utilisateur_id); // Pour s'assurer du bonne utilisateur!

    if (!tache) {
        return res.status(404).json({ message: "Tâche non trouvée." });
    }

    const tache_id = tache.id;

    tachesModeles.modifierLeStatutPourUneTache(tache_id, complete_int)
        // Si c'est un succès
        .then((tache) => {
            res.status(200).send({
                message: "La tâche a été modifié avec succès"
            });
        })
        // S'il y a eu une erreur au niveau de la requête, on retourne un eprreur 500 car c'est du serveur que provient l'erreur.
        .catch((erreur) => {
            console.log(`Erreur SQL (${erreur.sqlState}) : ${erreur.sqlMessage}`);
            res.status(500)
            res.send({
                message: "Erreur lors de la récupération de la tâche : " + titre
            });
        });
};

/**
 * Modifie le statut pour une sous-tache.
 * 
 * @param req - Requête HTTP.
 * @param res - Réponse HTTP retournant un message de réussite ou un message d'erreur.
 */
const ModifierLeStatutPourUneSousTache = async (req, res) => {
 const champsManquants = [];
    const id = parseInt(req.params.id, 10);
    let complete_int = parseInt(req.params.complete, 10);

    if (!id) champsManquants.push('titre');
    if (!complete_int || complete_int != 0 && complete_int != 1) champsManquants.push('complete');

    if (champsManquants.length > 0) {
        return res.status(400).json({
            erreur: 'Le format des données est invalide',
            champ_manquant: champsManquants
        });
    }

    const cle_api = req.headers.authorization?.split(' ')[1];

    const utilisateur = await tachesModeles.trouverUtilisateurSelonCleAPI(cle_api);

    if (!utilisateur) {
        return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    const utilisateur_id = utilisateur.id;

    const sous_tache = await tachesModeles.trouverSousTacheSelonIdEtUtilisateurId(id, utilisateur_id); // Pour s'assurer du bonne utilisateur!

    if (!sous_tache) {
        return res.status(404).json({ message: "Tâche non trouvée." });
    }

    const sous_tache_id = sous_tache.id;

    tachesModeles.modifierLeStatutPourUneSousTache(sous_tache_id, complete_int)
        // Si c'est un succès
        .then((tache) => {
            res.status(200).send({
                message: "La sous-tâche a été modifié avec succès"
            });
        })
        // S'il y a eu une erreur au niveau de la requête, on retourne un eprreur 500 car c'est du serveur que provient l'erreur.
        .catch((erreur) => {
            console.log(`Erreur SQL (${erreur.sqlState}) : ${erreur.sqlMessage}`);
            res.status(500)
            res.send({
                message: "Erreur lors de la récupération de la tâche : " + titre
            });
        });
};


/**
 * Modifie une tâche.
 * 
 * @param req - Requête HTTP.
 * @param res - Réponse HTTP retournant un message de réussite ou un message d'erreur.
 */
const ModifierUneTache = async (req, res) => {
 const champsManquants = [];
    const { titre, description, date_debut, date_echeance, complete } = req.body;
    const id = parseInt(req.params.id, 10);
    let complete_int;

    if(complete == "oui")  {
        complete_int = 1;
    }
    else {
        complete_int = 0;
    }

    if (!titre) champsManquants.push('titre');
    if (!description) champsManquants.push('description');
    if (!date_debut) champsManquants.push('date_debut');
    if (!date_echeance) champsManquants.push('date_echeance');
    if (!complete) champsManquants.push('complete');

    if (champsManquants.length > 0) {
        return res.status(400).json({
            erreur: 'Le format des données est invalide',
            champ_manquant: champsManquants
        });
    }

    const cle_api = req.headers.authorization?.split(' ')[1];

    const utilisateur = await tachesModeles.trouverUtilisateurSelonCleAPI(cle_api);

    if (!utilisateur) {
        return res.status(401).json({ message: "Utilisateur non trouvé." });
    }

    const utilisateur_id = utilisateur.id;

    const tache = await tachesModeles.trouverTacheSelonIdEtUtilisateurId(id, utilisateur_id); // Pour s'assurer du bonne utilisateur!

    if (!tache) {
        return res.status(401).json({ message: "Tâche non trouvée." });
    }

    const tache_id = tache.id;

    tachesModeles.modifierUneTache(tache_id, titre, description, date_debut, date_echeance, complete_int)
        // Si c'est un succès
        .then((tache) => {
            res.status(200).send({
                message: "La tâche " + titre + " a été modifié avec succès"
            });
        })
        // S'il y a eu une erreur au niveau de la requête, on retourne un eprreur 500 car c'est du serveur que provient l'erreur.
        .catch((erreur) => {
            console.log(`Erreur SQL (${erreur.sqlState}) : ${erreur.sqlMessage}`);
            res.status(500)
            res.send({
                message: "Erreur lors de la récupération de la tâche : " + titre
            });
        });
};

/**
 * Modifie une sous-tache.
 * 
 * @param req - Requête HTTP.
 * @param res - Réponse HTTP retournant un message de réussite ou un message d'erreur.
 */
const ModifierUneSousTache = async (req, res) => {
 const champsManquants = [];
    const { titre, complete} = req.body;
    const id = parseInt(req.params.id, 10);
    let complete_int;

    if(complete == "oui")  {
        complete_int = 1;
    }
    else {
        complete_int = 0;
    }

    if (!titre) champsManquants.push('titre');
    if (!complete) champsManquants.push('complete');
    if (!id) champsManquants.push('id');

    if (champsManquants.length > 0) {
        return res.status(400).json({
            erreur: 'Le format des données est invalide',
            champ_manquant: champsManquants
        });
    }

    const cle_api = req.headers.authorization?.split(' ')[1];

    const utilisateur = await tachesModeles.trouverUtilisateurSelonCleAPI(cle_api);

    if (!utilisateur) {
        return res.status(401).json({ message: "Utilisateur non trouvé." });
    }

    const utilisateur_id = utilisateur.id;

    const sous_tache = await tachesModeles.trouverSousTacheSelonIdEtUtilisateurId(id, utilisateur_id); // Pour s'assurer du bonne utilisateur!

    if (!sous_tache) {
        return res.status(401).json({ message: "Sous-tâche non trouvée." });
    }

    const sous_tache_id = sous_tache.id;

    tachesModeles.modifierUneTache(sous_tache_id, titre,  complete_int)
        // Si c'est un succès
        .then((tache) => {
            res.status(200).send({
                message: "La tâche " + titre + " a été modifié avec succès"
            });
        })
        // S'il y a eu une erreur au niveau de la requête, on retourne un eprreur 500 car c'est du serveur que provient l'erreur.
        .catch((erreur) => {
            console.log(`Erreur SQL (${erreur.sqlState}) : ${erreur.sqlMessage}`);
            res.status(500)
            res.send({
                message: "Erreur lors de la récupération de la tâche : " + titre
            });
        });
};

/**
 * Supprime une tache.
 * 
 * @param req - Requête HTTP.
 * @param res - Réponse HTTP retournant un message de réussite ou un message d'erreur.
 */
const SupprimerUneTache = async (req, res) => {
    
    const id = parseInt(req.params.id, 10); // Convertir en nombre

    const cle_api = req.headers.authorization?.split(' ')[1];

    const utilisateur = await tachesModeles.trouverUtilisateurSelonCleAPI(cle_api);

    if (!utilisateur) {
        return res.status(401).json({ message: "Utilisateur non trouvé." });
    }

    const utilisateur_id = utilisateur.id;

    const tache = await tachesModeles.trouverTacheSelonIdEtUtilisateurId(id, utilisateur_id); // Pour s'assurer du bonne utilisateur!

    if (!tache) {
        return res.status(401).json({ message: "Tâche non trouvée." });
    }

    const tache_id = tache.id;
    
    tachesModeles.supprimerTache(tache_id)
    // Si c'est un succès
    .then((tache) => {
        res.status(200).json({
                message : "La tâche " + id + " a été supprimé avec succès", 
            });
    })
    // S'il y a eu une erreur au niveau de la requête, on retourne un erreur 500 car c'est du serveur que provient l'erreur.
    .catch((erreur) => {
        console.log('Erreur : ', erreur);
        res.status(500)
        res.send({
            message: "Erreur lors de la récupération de la tâche."
        });
    });
};

/**
 * Supprime une sous-tache.
 * 
 * @param req - Requête HTTP.
 * @param res - Réponse HTTP retournant un message de réussite ou un message d'erreur.
 */
const SupprimerUneSousTache = async (req, res) => {
    
    const id = parseInt(req.params.id, 10); // Convertir en nombre

    const cle_api = req.headers.authorization?.split(' ')[1];

    const utilisateur = await tachesModeles.trouverUtilisateurSelonCleAPI(cle_api);

    if (!utilisateur) {
        return res.status(401).json({ message: "Utilisateur non trouvé." });
    }

    const utilisateur_id = utilisateur.id;

    const sous_tache = await tachesModeles.trouverSousTacheSelonIdEtUtilisateurId(id, utilisateur_id); // Pour s'assurer du bonne utilisateur!

    if (!sous_tache) {
        return res.status(401).json({ message: "Tâche non trouvée." });
    }

    const sous_tache_id = sous_tache.id;
    
    tachesModeles.supprimerTache(sous_tache_id)
    // Si c'est un succès
    .then((tache) => {
        res.status(200).json({
                message : "La sous-tâche " + id + " a été supprimé avec succès", 
            });
    })
    // S'il y a eu une erreur au niveau de la requête, on retourne un erreur 500 car c'est du serveur que provient l'erreur.
    .catch((erreur) => {
        console.log('Erreur : ', erreur);
        res.status(500)
        res.send({
            message: "Erreur lors de la récupération de la tâche."
        });
    });
};

/**
 * Ajoute un utilisateur.
 * 
 * @param req - Requête HTTP.
 * @param res - Réponse HTTP retournant un message de réussite ou un message d'erreur.
 */
const AjouterUtilisateur = async (req, res) => {
    const champsManquants = [];
    const nom = req.body.nom;
    const prenom = req.body.prenom;
    const courriel = req.body.courriel;
    const mot_de_passe_clair = req.body.mot_de_passe; // On le garde pour l'instant

    if (!nom) champsManquants.push('nom');
    if (!prenom) champsManquants.push('prenom');
    if (!courriel) champsManquants.push('courriel');
    if (!mot_de_passe_clair) champsManquants.push('mot_de_passe');

    if (champsManquants.length > 0) {
        return res.status(400).json({
            erreur: 'Le format des données est invalide',
            champ_manquant: champsManquants
        });
    }

    const api_key = generateApiKey();
    if (!api_key) {
        return res.status(400).json({ erreur: 'La génération de la clé a échoué' });
    }

    const nombreUtilisateur = await tachesModeles.getNombreUtilisateurSelon(courriel);

    if (nombreUtilisateur == 0) {
        try {
            const mot_de_passe_hash = await bcrypt.hash(mot_de_passe_clair, costFactor);

            await tachesModeles.creerUtilisateur(nom, prenom, courriel, mot_de_passe_hash, api_key);
            return res.status(200).send({
                message: "L'utilisateur a été créé",
                cle_api: api_key
            });
        } catch (erreur) {
            console.log(`Erreur SQL (${erreur.sqlState}) : ${erreur.sqlMessage}`);
            return res.status(500).send({
                message: "Erreur lors de la création de l'utilisateur"
            });
        }
    } else {
        return res.status(400).json({
            erreur: 'Un compte avec ce courriel est déjà existant'
        });
    }
};

/**
 * Récupère ou génère une clé API si on retrouve le champ ""nouvelle_cle": "oui"" dans le body de la requête.
 * 
 * @param req - Requête HTTP.
 * @param res - Réponse HTTP retournant un message de réussite ou un message d'erreur.
 */
const RecupererOuGenererCleAPI= async (req, res)  => {
    const champsManquants = [];
    const courriel = req.body.courriel;
    const mot_de_passe_clair = req.body.mot_de_passe; // On le garde pour l'instant
    const siNouvelleCle = req.body.nouvelle_cle; // On le garde pour l'instant


    if (!siNouvelleCle) champsManquants.push('siNouvelleCle');
    if (!courriel) champsManquants.push('courriel');
    if (!mot_de_passe_clair) champsManquants.push('mot_de_passe');

    if (champsManquants.length > 0) {
        return res.status(400).json({
            erreur: 'Le format des données est invalide',
            champ_manquant: champsManquants
        });
    }

    const nombreUtilisateur = await tachesModeles.getNombreUtilisateurSelon(courriel);

    if (nombreUtilisateur > 0) {
        try {
            if(siNouvelleCle == "oui")  {
                const cle_api = generateApiKey();
                if (!cle_api) {
                     return res.status(400).json({ erreur: 'La génération de la clé a échoué' });
                }
                await tachesModeles.genererNouvelleCleAPISelon(courriel, cle_api);
            
                return res.status(200).send({
                message: "Noter votre nouvelle clé :",
                cle_api: cle_api
            });
            }
            else {
                const utilisateur = await tachesModeles.trouverUtilisateurSelonCourriel(courriel);

                if (!utilisateur) {
                    return res.status(404).json({ erreur: 'Utilisateur non trouvé' });
                }

                const mot_de_passe_valide = await bcrypt.compare(mot_de_passe_clair, utilisateur.password);

                if (!mot_de_passe_valide) {
                    return res.status(401).json({ erreur: 'Mot de passe invalide' });
                }

                return res.status(200).json({ cle_api: utilisateur.cle_api });
            }
        } catch (erreur) {
            console.log(`Erreur SQL (${erreur.sqlState}) : ${erreur.sqlMessage}`);
            return res.status(500).send({
                message: "Erreur lors de la récuperation de la clé API"
            });
        }
    } else {
        return res.status(400).json({
            erreur: 'Il n\y a pas d\'utilisateur avec ces identifiants.'
        });
    }
};



export {
    ListerTachesPourUtilisateur,
    AjouterUtilisateur,
    RecupererOuGenererCleAPI,
    AjouterTaches,
    AjouterSousTaches,
    TrouverUneTacheDetaillee,
    ModifierUneTache,
    ModifierLeStatutPourUneTache,
    SupprimerUneTache,
    ModifierUneSousTache,
    ModifierLeStatutPourUneSousTache,
    SupprimerUneSousTache
}