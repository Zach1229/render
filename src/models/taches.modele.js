// Ancienne connexion à MySQL
// const db = require("../config/pg");
// Nouvelle connexion à PostGreSQL

import db from "../config/db_pg.js";

/**
 * Méthode permettant de lister tous les tâches d'un utilisateur.
 * 
 * @param cle_api - LA clé API de l'utilisateur.
 * @return La liste des tâches sous un objet "resultat" ou nul.
 * @throws - S'il y a une erreur SQL, on retourne.
 */
const getTousTachesSelon = (cle_api) => {
    return new Promise((resolve, reject) => {

        const requete = `SELECT taches.* FROM taches 
                            INNER JOIN utilisateurs ON utilisateurs.id = taches.utilisateur_id
                            WHERE cle_api = $1`;

        db.query(requete, cle_api, (erreur, resultat) => {
            if (erreur) {
                console.log(`Erreur sqlState ${erreur.sqlState} : ${erreur.sqlMessage}`);
                // S'il y a une erreur, je la retourne avec reject()
                reject(erreur);
            }
            // Sinon je retourne le résultat sans faire de validation, c'est possible que le résultat soit vide
            resolve(resultat.rows);
        });
    });
};

/**
 * Méthode permettant de lister tous les tâches non-complétées d'un utilisateur.
 * 
 * @param cle_api - LA clé API de l'utilisateur.
 * @return La liste des tâches sous un objet "resultat" ou nul.
 * @throws - S'il y a une erreur SQL, on retourne.
 */
const getTachesNonCompleteesSelon = (cle_api) => {
    return new Promise((resolve, reject) => {

        const requete = `SELECT taches.* FROM taches 
                            INNER JOIN utilisateurs ON utilisateurs.id = taches.utilisateur_id
                            WHERE cle_api = $1
                            AND complete = 0`;

        db.query(requete, cle_api, (erreur, resultat) => {
            if (erreur) {
                console.log(`Erreur sqlState ${erreur.sqlState} : ${erreur.sqlMessage}`);
                // S'il y a une erreur, je la retourne avec reject()
                reject(erreur);
            }
            // Sinon je retourne le résultat sans faire de validation, c'est possible que le résultat soit vide
            resolve(resultat.rows);
        });
    });
};

/**
 * Méthode permettant de supprimer une tâche.
 * 
 * @param id - L'id de la tâche à supprimer.
 * @return La tâche sous un objet "resultat" ou nul.
 * @throws - S'il y a une erreur SQL, on retourne.
 */
const supprimerTache = (id) => {
    return new Promise((resolve, reject) => {
        
        const requete = 'DELETE FROM taches WHERE id = $1';

        let valeur = id; 

        db.query(requete, valeur, (erreur, resultat) => {
            if (erreur) {
                console.log(`Erreur sqlState ${erreur.sqlState} : ${erreur.sqlMessage}`);
                // S'il y a une erreur, je la retourne avec reject()
                reject(erreur);
            }
            // Sinon je retourne le résultat sans faire de validation, c'est possible que le résultat soit vide
            resolve(resultat.rows);
        });
    });
};

/**
 * Méthode permettant de supprimer une sous-tâche.
 * 
 * @param id - L'id de la sous-tâche à supprimer.
 * @return La sous-tâche sous un objet "resultat" ou nul.
 * @throws - S'il y a une erreur SQL, on retourne.
 */
const supprimerUneSousTache = (id) => {
    return new Promise((resolve, reject) => {
        
        const requete = 'DELETE FROM sous_taches WHERE id = $1';

        let valeur = id; 

        db.query(requete, valeur, (erreur, resultat) => {
            if (erreur) {
                console.log(`Erreur sqlState ${erreur.sqlState} : ${erreur.sqlMessage}`);
                // S'il y a une erreur, je la retourne avec reject()
                reject(erreur);
            }
            // Sinon je retourne le résultat sans faire de validation, c'est possible que le résultat soit vide
            resolve(resultat.rows);
        });
    });
};

/**
 * Ajoute une nouvelle tâche pour un utilisateur donné.
 * 
 * @param utilisateur_id - ID de l'utilisateur.
 * @param titre - Titre de la tâche.
 * @param description - Description de la tâche.
 * @param date_debut - Date de début.
 * @param date_echeance - Date d'échéance.
 * @returns - Résultat de la requête SQL ou nul.
 * @throws - S'il y a une erreur SQL, on retourne.
 */
const ajouterTaches = (utilisateur_id, titre, description, date_debut, date_echeance) => {
    return new Promise((resolve, reject) => {
        
        const valeur = [utilisateur_id, titre, description, date_debut, date_echeance];

        const requete = 'INSERT INTO taches (utilisateur_id, titre, description, date_debut, date_echeance, complete) VALUES ($1, $2, $3, $4, $5, $6)';

        db.query(requete, valeur, (erreur, resultat) => {
            if (erreur) {
                console.log(`Erreur sqlState ${erreur.sqlState} : ${erreur.sqlMessage}`);
                reject(erreur);
            }
            // Sinon je retourne le résultat sans faire de validation, c'est possible que le résultat soit vide
            resolve(resultat.rows);
        });
    });
};

/**
 * Ajoute une sous-tâche à une tâche existante.
 * 
 * @param {number} tache_id - ID de la tâche parente.
 * @param {string} titre - Titre de la sous-tâche.
 * @returns {Promise<Object>} Résultat de l'insertion ou nul.
 * @throws - S'il y a une erreur SQL, on retourne.
 */
const ajouterSousTaches = (tache_id, titre) => {
    return new Promise((resolve, reject) => {
        
        const valeur = [tache_id, titre];

        const requete = 'INSERT INTO sous_taches (tache_id, titre, complete) VALUES ($1, $2, 0)';

        db.query(requete, valeur, (erreur, resultat) => {
            if (erreur) {
                console.log(`Erreur sqlState ${erreur.sqlState} : ${erreur.sqlMessage}`);
                reject(erreur);
            }
            // Sinon je retourne le résultat sans faire de validation, c'est possible que le résultat soit vide
            resolve(resultat.rows);
        });
    });
};

/**
 * Modifie une tâche existante dans la base de données.
 * 
 * @param  id - L'identifiant unique de la tâche à modifier.
 * @param titre - Le nouveau titre de la tâche.
 * @param description - La nouvelle description de la tâche.
 * @param date_debut - La nouvelle date de début.
 * @param date_echeance - La nouvelle date d’échéance.
 * @param complete - Le statut d’achèvement de la tâche (0 = incomplète, 1 = complète).
 * 
 * @returns - Résultat de la requête SQL.
 * 
 * @throws - S'il y a une erreur SQL, on retourne.
 */
const modifierUneTache = (id ,titre, description, date_debut, date_echeance, complete) => {
    return new Promise((resolve, reject) => {
        const valeurs = [titre, description, date_debut, date_echeance, complete, id];

        const requete = 'UPDATE taches SET titre = $1,  description = $2, date_debut = $3, date_echeance = $4, complete = $5 WHERE id = $6';

        db.query(requete, valeurs, (erreur, resultat) => {
            if (erreur) {
                console.log(`Erreur sqlState ${erreur.sqlState} : ${erreur.sqlMessage}`);
                // S'il y a une erreur, je la retourne avec reject()
                reject(erreur);
            }
            // Sinon je retourne le résultat sans faire de validation, c'est possible que le résultat soit vide
            resolve(resultat.rows);
        });
    });
};

/**
 * Modifie une sous-tâche existante dans la base de données.
 * 
 * @param id - L'identifiant unique de la sous-tâche à modifier.
 * @param titre - Le nouveau titre de la sous-tâche.
 * @param complete - Le statut d’achèvement de la sous-tâche (0 = incomplète, 1 = complète).
 * 
 * @returns - Résultat de la requête SQL contenant des informations sur l'opération.
 * 
 * @throws - S'il y a une erreur SQL, on retourne.
 */
const modifierUneSousTache = (id ,titre, complete) => {
    return new Promise((resolve, reject) => {
        const valeurs = [titre, complete, id];

        const requete = 'UPDATE sous_taches SET titre = $1,  complete = $2 WHERE id = $3';

        db.query(requete, valeurs, (erreur, resultat) => {
            if (erreur) {
                console.log(`Erreur sqlState ${erreur.sqlState} : ${erreur.sqlMessage}`);
                // S'il y a une erreur, je la retourne avec reject()
                reject(erreur);
            }
            // Sinon je retourne le résultat sans faire de validation, c'est possible que le résultat soit vide
            resolve(resultat.rows);
        });
    });
};

/**
 * Modifie le statut d’achèvement (complete) d’une sous-tâche par son id.
 * 
 * @param id - L’identifiant unique de la sous-tâche.
 * @param complete - Le statut d’achèvement (0 = incomplète, 1 = complète).
 * @returns - Résultat de la requête SQL.
 * @throws - S'il y a une erreur SQL, on retourne.
 */
const modifierLeStatutPourUneTache = (id, complete) => {
    return new Promise((resolve, reject) => {
        const valeurs = [complete, id];

        const requete = 'UPDATE sous_taches SET complete = $1 WHERE id = $2';

        db.query(requete, valeurs, (erreur, resultat) => {
            if (erreur) {
                console.log(`Erreur sqlState ${erreur.sqlState} : ${erreur.sqlMessage}`);
                // S'il y a une erreur, je la retourne avec reject()
                reject(erreur);
            }
            // Sinon je retourne le résultat sans faire de validation, c'est possible que le résultat soit vide
            resolve(resultat.rows);
        });
    });
};

/**
 * Modifie le statut d’achèvement (complete) d’une tâche par son id.
 * 
 * @param id - L’identifiant unique de la tâche.
 * @param complete - Le statut d’achèvement (0 = incomplète, 1 = complète).
 * @returns - Résultat de la requête SQL.
 * @throws - S'il y a une erreur SQL, on retourne.
 */
const modifierLeStatutPourUneSousTache = (id, complete) => {
    return new Promise((resolve, reject) => {
        const valeurs = [complete, id];

        const requete = 'UPDATE taches SET complete = $1 WHERE id = $2';

        db.query(requete, valeurs, (erreur, resultat) => {
            if (erreur) {
                console.log(`Erreur sqlState ${erreur.sqlState} : ${erreur.sqlMessage}`);
                // S'il y a une erreur, je la retourne avec reject()
                reject(erreur);
            }
            // Sinon je retourne le résultat sans faire de validation, c'est possible que le résultat soit vide
            resolve(resultat.rows);
        });
    });
};

/**
 * Crée un nouvel utilisateur dans la base de données.
 * 
 * @param nom - Nom .
 * @param prenom - Prénom.
 * @param courriel - Adresse email.
 * @param mot_de_passe - Mot de passe hashé de l’utilisateur.
 * @param cle_api - Clé API généré.
 * @returns - Résultat de l'insertion SQL.
 * @throws - S'il y a une erreur SQL, on retourne.
 */
const creerUtilisateur = (nom, prenom, courriel, mot_de_passe, cle_api) => {
    return new Promise((resolve, reject) => {

        const valeurs = [nom, prenom, courriel, mot_de_passe, cle_api];

        const requete = 'INSERT INTO utilisateurs (nom, prenom, courriel, password, cle_api) VALUES ($1, $2, $3, $4, $5)';

        db.query(requete, valeurs, (erreur, resultat) => {
            if (erreur) {
                console.log(`Erreur sqlState ${erreur.sqlState} : ${erreur.sqlMessage}`);
                // S'il y a une erreur, je la retourne avec reject()
                reject(erreur);
            }
            // Sinon je retourne le résultat sans faire de validation, c'est possible que le résultat soit vide
            resolve(resultat.rows);
        });
    });;
};

/**
 * Trouve un utilisateur dans la base de données selon son courriel.
 * 
 * @param courriel - Adresse email de l’utilisateur.
 * @returns - Objet utilisateur ou null si non trouvé.
 * @throws - S'il y a une erreur SQL, on retourne.
 */
const trouverUtilisateurSelonCourriel = (courriel) => {
    return new Promise((resolve, reject) => {
        const requete = 'SELECT * FROM utilisateurs WHERE courriel = $1';

        db.query(requete, [courriel], (erreur, resultat) => {
            if (erreur) {
                console.log(`Erreur sqlState ${erreur.sqlState} : ${erreur.sqlMessage}`);
                reject(erreur);
            } else {
                resolve(resultat.rows.length > 0 ? resultat.rows[0] : null);
            }
        });
    });
};

/**
 * Trouve une tâche selon son titre et l'id utilisateur.
 * 
 * @param titre - Titre de la tâche.
 * @param utilisateur_id - Identifiant de l’utilisateur.
 * @returns - Objet tâche ou nul si non trouvé.
 * @throws - S'il y a une erreur SQL, on retourne.
 */
const trouverTacheSelonTitreEtUtilisateurId = (titre, utilisateur_id) => {
    return new Promise((resolve, reject) => {
        const requete = 'SELECT * FROM taches WHERE titre = $1 AND utilisateur_id = $2';

        db.query(requete, [titre, utilisateur_id], (erreur, resultat) => {
            if (erreur) {
                console.log(`Erreur sqlState ${erreur.sqlState} : ${erreur.sqlMessage}`);
                reject(erreur);
            } else {
                resolve(resultat.rows.length > 0 ? resultat.rows[0] : null);
            }
        });
    });
};

/**
 * Trouve une tâche selon son id et l'identifiant utilisateur.
 * 
 * @param id - Identifiant de la tâche.
 * @param utilisateur_id - Identifiant de l’utilisateur.
 * @returns - Objet tâche ou null si non trouvé.
 * @throws - S'il y a une erreur SQL, on retourne.
 */
const trouverTacheSelonIdEtUtilisateurId = (id, utilisateur_id) => {
    return new Promise((resolve, reject) => {
        const requete = 'SELECT * FROM taches WHERE id = $1 AND utilisateur_id = $2';

        db.query(requete, [id, utilisateur_id], (erreur, resultat) => {
            if (erreur) {
                console.log(`Erreur sqlState ${erreur.sqlState} : ${erreur.sqlMessage}`);
                reject(erreur);
            } else {
                resolve(resultat.rows.length > 0 ? resultat.rows[0] : null);
            }
        });
    });
};

/**
 * Trouve une sous-tâche selon son id et l'identifiant utilisateur associé.
 * 
 * @param id - Identifiant de la sous-tâche.
 * @param utilisateur_id - Identifiant de l’utilisateur.
 * @returns - Objet sous-tâche ou null si non trouvé.
 * @throws - S'il y a une erreur SQL, on retourne.
 */
const trouverSousTacheSelonIdEtUtilisateurId = (id, utilisateur_id) => {
    return new Promise((resolve, reject) => {
        const requete = 'SELECT sous_taches.* FROM sous_taches INNER JOIN taches ON taches.id = sous_taches.tache_id WHERE sous_taches.id = $1 AND utilisateur_id = $2';

        db.query(requete, [id, utilisateur_id], (erreur, resultat) => {
            if (erreur) {
                console.log(`Erreur sqlState ${erreur.sqlState} : ${erreur.sqlMessage}`);
                reject(erreur);
            } else {
                resolve(resultat.length > 0 ? resultat[0] : null);
            }
        });
    });
};

/**
 * Trouve un utilisateur selon sa clé API.
 * 
 * @param cle_api - Clé API de l’utilisateur.
 * @returns - Objet utilisateur ou null si non trouvé.
 * @throws - S'il y a une erreur SQL, on retourne.
 */
const trouverUtilisateurSelonCleAPI = (cle_api) => {
    return new Promise((resolve, reject) => {
        const requete = 'SELECT * FROM utilisateurs WHERE cle_api = $1';

        db.query(requete, [cle_api], (erreur, resultat) => {
            if (erreur) {
                console.log(`Erreur sqlState ${erreur.sqlState} : ${erreur.sqlMessage}`);
                reject(erreur);
            } else {
                resolve(resultat.rows.length > 0 ? resultat.rows[0] : null);
            }
        });
    });
};

/**
 * Met à jour la clé API d’un utilisateur selon son courriel.
 * 
 * @param courriel - Adresse email de l’utilisateur.
 * @param cle_api - Nouvelle clé API à attribuer.
 * @returns - Résultat de la mise à jour SQL.
 * @throws - S'il y a une erreur SQL, on retourne.
 */
const genererNouvelleCleAPISelon = (courriel, cle_api) => {
    return new Promise((resolve, reject) => {

        const valeurs = [cle_api, courriel];
        
        const requete = 'UPDATE utilisateurs SET cle_api = $1 WHERE courriel = $2';

        db.query(requete, valeurs, (erreur, resultat) => {
            if (erreur) {
                console.log(`Erreur sqlState ${erreur.sqlState} : ${erreur.sqlMessage}`);
                // S'il y a une erreur, je la retourne avec reject()
                reject(erreur);
            }
            // Sinon je retourne le résultat sans faire de validation, c'est possible que le résultat soit vide
            resolve(resultat.rows);
        });
    });;
};

/**
 * Récupère la clé API d’un utilisateur selon son courriel et mot de passe.
 * 
 * @param courriel - Adresse email de l’utilisateur.
 * @param mot_de_passe - Mot de passe hashé de l’utilisateur.
 * @returns - Résultat contenant la clé API.
 * @throws - S'il y a une erreur SQL, on retourne.
 */
const recupererCleAPISelon = (courriel, mot_de_passe) => {
    return new Promise((resolve, reject) => {

        const valeurs = [courriel, mot_de_passe];

        const requete = 'SELECT cle_api FROM utilisateurs WHERE courriel = $1 AND password = $2';

        db.query(requete, valeurs, (erreur, resultat) => {
            if (erreur) {
                console.log(`Erreur sqlState ${erreur.sqlState} : ${erreur.sqlMessage}`);
                // S'il y a une erreur, je la retourne avec reject()
                reject(erreur);
            }
            // Sinon je retourne le résultat sans faire de validation, c'est possible que le résultat soit vide
            resolve(resultat.rows);
        });
    });;
};

/**
 * Récupère le nombre d’utilisateurs enregistrés avec un courriel donné.
 * 
 * @param  courriel - Adresse email à vérifier.
 * @returns - Nombre d’utilisateurs avec ce courriel (0 ou plus).
 * @throws - S'il y a une erreur SQL, on retourne.
 */
const getNombreUtilisateurSelon = (courriel) => {
    return new Promise((resolve, reject) => {

        const valeur = [courriel];

        const requete = `SELECT COUNT(*) AS count FROM utilisateurs WHERE courriel = $1`;

        db.query(requete, valeur, (erreur, resultat) => {
            if (erreur) {
                console.log(`Erreur sqlState ${erreur.sqlState} : ${erreur.sqlMessage}`);
                // S'il y a une erreur, je la retourne avec reject()
                reject(erreur);
            }
            // Sinon je retourne le résultat sans faire de validation, c'est possible que le résultat soit vide
            resolve(resultat.rows[0].count);
        });
    });
};

/**
 * Récupère le nombre d’utilisateurs enregistrés avec un courriel donné.
 * 
 * @param  courriel - Adresse email à vérifier.
 * @returns - Nombre d’utilisateurs avec ce courriel (0 ou plus).
 * @throws - S'il y a une erreur SQL, on retourne.
 */
const validationCle = (cle_api) => {
    return new Promise((resolve, reject) => {

        const valeur = [cle_api];
        
        const requete = `SELECT count(*) AS count FROM utilisateurs WHERE cle_api = $1`;

        db.query(requete, valeur, (erreur, resultat) => {
            if (erreur) {
                console.log(`Erreur sqlState ${erreur.sqlState} : ${erreur.sqlMessage}`);
                // S'il y a une erreur, je la retourne avec reject()
                reject(erreur);
            }
            // Sinon je retourne le résultat sans faire de validation, c'est possible que le résultat soit vide
            resolve(resultat.rows[0].count);
        });
    });
};



export default {
    getTachesNonCompleteesSelon,
    getTousTachesSelon,
    creerUtilisateur,
    getNombreUtilisateurSelon,
    trouverUtilisateurSelonCourriel,
    trouverUtilisateurSelonCleAPI,
    genererNouvelleCleAPISelon,
    recupererCleAPISelon,
    ajouterTaches,
    trouverTacheSelonTitreEtUtilisateurId,
    ajouterSousTaches,
    trouverTacheSelonIdEtUtilisateurId, 
    modifierUneTache,
    modifierLeStatutPourUneTache,
    supprimerTache,
    modifierUneSousTache,
    trouverSousTacheSelonIdEtUtilisateurId,
    modifierLeStatutPourUneSousTache,
    supprimerUneSousTache,
    validationCle
}