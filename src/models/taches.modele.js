import db from "../config/db_pg.js";

/**
 * Lister toutes les tâches d'un utilisateur selon sa clé API.
 */
const getTousTachesSelon = (cle_api) => {
    return new Promise((resolve, reject) => {
        const requete = `
            SELECT taches.* FROM taches
            INNER JOIN utilisateurs ON utilisateurs.id = taches.utilisateur_id
            WHERE cle_api = $1`;
        
        db.query(requete, [cle_api], (erreur, resultat) => {
            if (erreur) {
                console.log(`Erreur sqlState ${erreur.code} : ${erreur.message}`);
                reject(erreur);
                return;
            }
            resolve(resultat.rows);
        });
    });
};

/**
 * Lister toutes les tâches non complétées d'un utilisateur selon sa clé API.
 */
const getTachesNonCompleteesSelon = (cle_api) => {
    return new Promise((resolve, reject) => {
        const requete = `
            SELECT taches.* FROM taches
            INNER JOIN utilisateurs ON utilisateurs.id = taches.utilisateur_id
            WHERE cle_api = $1 AND complete = 0`;

        db.query(requete, [cle_api], (erreur, resultat) => {
            if (erreur) {
                console.log(`Erreur sqlState ${erreur.code} : ${erreur.message}`);
                reject(erreur);
                return;
            }
            resolve(resultat.rows);
        });
    });
};

/**
 * Supprimer une tâche par son id.
 */
const supprimerTache = (id) => {
    return new Promise((resolve, reject) => {
        const requete = 'DELETE FROM taches WHERE id = $1';
        db.query(requete, [id], (erreur, resultat) => {
            if (erreur) {
                console.log(`Erreur sqlState ${erreur.code} : ${erreur.message}`);
                reject(erreur);
                return;
            }
            resolve(resultat.rows);
        });
    });
};

/**
 * Supprimer une sous-tâche par son id.
 */
const supprimerUneSousTache = (id) => {
    return new Promise((resolve, reject) => {
        const requete = 'DELETE FROM sous_taches WHERE id = $1';
        db.query(requete, [id], (erreur, resultat) => {
            if (erreur) {
                console.log(`Erreur sqlState ${erreur.code} : ${erreur.message}`);
                reject(erreur);
                return;
            }
            resolve(resultat.rows);
        });
    });
};

/**
 * Ajouter une tâche.
 */
const ajouterTaches = (utilisateur_id, titre, description, date_debut, date_echeance) => {
    return new Promise((resolve, reject) => {
        const requete = `
            INSERT INTO taches (utilisateur_id, titre, description, date_debut, date_echeance, complete)
            VALUES ($1, $2, $3, $4, $5, 0) RETURNING *`;
        const valeurs = [utilisateur_id, titre, description, date_debut, date_echeance];

        db.query(requete, valeurs, (erreur, resultat) => {
            if (erreur) {
                console.log(`Erreur sqlState ${erreur.code} : ${erreur.message}`);
                reject(erreur);
                return;
            }
            resolve(resultat.rows[0]);
        });
    });
};

/**
 * Ajouter une sous-tâche.
 */
const ajouterSousTaches = (tache_id, titre) => {
    return new Promise((resolve, reject) => {
        const requete = `
            INSERT INTO sous_taches (tache_id, titre, complete)
            VALUES ($1, $2, 0) RETURNING *`;
        const valeurs = [tache_id, titre];

        db.query(requete, valeurs, (erreur, resultat) => {
            if (erreur) {
                console.log(`Erreur sqlState ${erreur.code} : ${erreur.message}`);
                reject(erreur);
                return;
            }
            resolve(resultat.rows[0]);
        });
    });
};

/**
 * Modifier une tâche.
 */
const modifierUneTache = (id, titre, description, date_debut, date_echeance, complete) => {
    return new Promise((resolve, reject) => {
        const requete = `
            UPDATE taches SET
                titre = $1,
                description = $2,
                date_debut = $3,
                date_echeance = $4,
                complete = $5
            WHERE id = $6 RETURNING *`;
        const valeurs = [titre, description, date_debut, date_echeance, complete, id];

        db.query(requete, valeurs, (erreur, resultat) => {
            if (erreur) {
                console.log(`Erreur sqlState ${erreur.code} : ${erreur.message}`);
                reject(erreur);
                return;
            }
            resolve(resultat.rows[0]);
        });
    });
};

/**
 * Modifier une sous-tâche.
 */
const modifierUneSousTache = (id, titre, complete) => {
    return new Promise((resolve, reject) => {
        const requete = `
            UPDATE sous_taches SET
                titre = $1,
                complete = $2
            WHERE id = $3 RETURNING *`;
        const valeurs = [titre, complete, id];

        db.query(requete, valeurs, (erreur, resultat) => {
            if (erreur) {
                console.log(`Erreur sqlState ${erreur.code} : ${erreur.message}`);
                reject(erreur);
                return;
            }
            resolve(resultat.rows[0]);
        });
    });
};

/**
 * Modifier le statut d’achèvement d’une sous-tâche.
 */
const modifierLeStatutPourUneSousTache = (id, complete) => {
    return new Promise((resolve, reject) => {
        const requete = 'UPDATE sous_taches SET complete = $1 WHERE id = $2 RETURNING *';
        const valeurs = [complete, id];

        db.query(requete, valeurs, (erreur, resultat) => {
            if (erreur) {
                console.log(`Erreur sqlState ${erreur.code} : ${erreur.message}`);
                reject(erreur);
                return;
            }
            resolve(resultat.rows[0]);
        });
    });
};

/**
 * Modifier le statut d’achèvement d’une tâche.
 */
const modifierLeStatutPourUneTache = (id, complete) => {
    return new Promise((resolve, reject) => {
        const requete = 'UPDATE taches SET complete = $1 WHERE id = $2 RETURNING *';
        const valeurs = [complete, id];

        db.query(requete, valeurs, (erreur, resultat) => {
            if (erreur) {
                console.log(`Erreur sqlState ${erreur.code} : ${erreur.message}`);
                reject(erreur);
                return;
            }
            resolve(resultat.rows[0]);
        });
    });
};

/**
 * Créer un utilisateur.
 */
const creerUtilisateur = (nom, prenom, courriel, mot_de_passe, cle_api) => {
    return new Promise((resolve, reject) => {
        const requete = `
            INSERT INTO utilisateurs (nom, prenom, courriel, password, cle_api)
            VALUES ($1, $2, $3, $4, $5) RETURNING *`;
        const valeurs = [nom, prenom, courriel, mot_de_passe, cle_api];

        db.query(requete, valeurs, (erreur, resultat) => {
            if (erreur) {
                console.log(`Erreur sqlState ${erreur.code} : ${erreur.message}`);
                reject(erreur);
                return;
            }
            resolve(resultat.rows[0]);
        });
    });
};

/**
 * Trouver un utilisateur selon son courriel.
 */
const trouverUtilisateurSelonCourriel = (courriel) => {
    return new Promise((resolve, reject) => {
        const requete = 'SELECT * FROM utilisateurs WHERE courriel = $1';
        db.query(requete, [courriel], (erreur, resultat) => {
            if (erreur) {
                console.log(`Erreur sqlState ${erreur.code} : ${erreur.message}`);
                reject(erreur);
                return;
            }
            resolve(resultat.rows[0] || null);
        });
    });
};

export default {
    getTousTachesSelon,
    getTachesNonCompleteesSelon,
    supprimerTache,
    supprimerUneSousTache,
    ajouterTaches,
    ajouterSousTaches,
    modifierUneTache,
    modifierUneSousTache,
    modifierLeStatutPourUneSousTache,
    modifierLeStatutPourUneTache,
    creerUtilisateur,
    trouverUtilisateurSelonCourriel
};
