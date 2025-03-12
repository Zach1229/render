// À ajuster selon la structure
import db from '../config/db.js';

const getPokemon = () => {
    return new Promise((resolve, reject) => {

        const requete = `SELECT * FROM pokemon`;

        db.query(requete, (erreur, resultat) => {
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

const deletePokemon = (id) => {
    return new Promise((resolve, reject) => {
        
        const requete = 'DELETE FROM pokemon WHERE id = ?';

        let valeur = id; 

        db.query(requete, valeur, (erreur, resultat) => {
            if (erreur) {
                console.log(`Erreur sqlState ${erreur.sqlState} : ${erreur.sqlMessage}`);
                // S'il y a une erreur, je la retourne avec reject()
                reject(erreur);
            }
            // Sinon je retourne le résultat sans faire de validation, c'est possible que le résultat soit vide
            resolve(resultat);
        });
    });
};

const addPokemon = (nom, type_primaire, type_secondaire, pv, attaque, defense) => {
    return new Promise((resolve, reject) => {
        
        const valeur = [nom, type_primaire, type_secondaire, pv, attaque, defense];

        const requete = 'INSERT INTO pokemon (nom, type_primaire, type_secondaire, pv, attaque, defense) VALUES (?, ?, ?, ?, ?, ?)';

        db.query(requete, valeur, (erreur, resultat) => {
            if (erreur) {
                console.log(`Erreur sqlState ${erreur.sqlState} : ${erreur.sqlMessage}`);
                // S'il y a une erreur, je la retourne avec reject()
                reject(erreur);
            }
            // Sinon je retourne le résultat sans faire de validation, c'est possible que le résultat soit vide
            resolve(resultat);
        });
    });
};

const modifierPokemon = (nom, type_primaire, type_secondaire, pv, attaque, defense, id) => {
    return new Promise((resolve, reject) => {
        const valeurs = [nom, type_primaire, type_secondaire, pv, attaque, defense, id];

        const requete = 'UPDATE pokemon SET nom = ?,  type_primaire = ?, type_secondaire = ?, pv = ?, attaque = ?, defense = ? WHERE id = ?';

        db.query(requete, valeurs, (erreur, resultat) => {
            if (erreur) {
                console.log(`Erreur sqlState ${erreur.sqlState} : ${erreur.sqlMessage}`);
                // S'il y a une erreur, je la retourne avec reject()
                reject(erreur);
            }
            // Sinon je retourne le résultat sans faire de validation, c'est possible que le résultat soit vide
            resolve(resultat);
        });
    });
};

const creerUtilisateur = (nom, courriel, mot_de_passe, api_key) => {
    return new Promise((resolve, reject) => {

        const valeurs = [nom, courriel, mot_de_passe, api_key];

        const requete = 'INSERT INTO utilisateurs (nom, courriel, mot_de_passe, cle_api) VALUES (?, ?, ?, ?)';

        db.query(requete, valeurs, (erreur, resultat) => {
            if (erreur) {
                console.log(`Erreur sqlState ${erreur.sqlState} : ${erreur.sqlMessage}`);
                // S'il y a une erreur, je la retourne avec reject()
                reject(erreur);
            }
            // Sinon je retourne le résultat sans faire de validation, c'est possible que le résultat soit vide
            resolve(resultat);
        });
    });;
};

const getNombreUtilisateurSelon = (courriel) => {
    return new Promise((resolve, reject) => {

        const valeur = [courriel];

        const requete = `SELECT COUNT(*) AS count FROM utilisateurs WHERE courriel = ?`;

        db.query(requete, (erreur, resultat) => {
            if (erreur) {
                console.log(`Erreur sqlState ${erreur.sqlState} : ${erreur.sqlMessage}`);
                // S'il y a une erreur, je la retourne avec reject()
                reject(erreur);
            }
            // Sinon je retourne le résultat sans faire de validation, c'est possible que le résultat soit vide
            resolve(resultat[0].count);
        });
    });
};


export default {
    getPokemon,
    addPokemon,
    modifierPokemon,
    deletePokemon,
    creerUtilisateur,
    getNombreUtilisateurSelon
}