// Point d'entrée : configuration du jeu Phaser (960 x 720, taille fixe) et liste des scènes.
// Porte la constante DEBUG, qui activera les vérifications T1 à T5 en console (lot 5).
import * as Phaser from "phaser";

// Mode debug : true pendant la production, false pour la version jouée.
const DEBUG = true;

// Taille du jeu, fixe (section 1 : 960 x 720 px)
const LARGEUR = 960;
const HAUTEUR = 720;

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: LARGEUR,
    height: HAUTEUR,
    parent: "game-container", // div prévue dans index.html
    backgroundColor: "#1e1e1e",
    audio: { noAudio: true }, // son et musique hors périmètre (section 1)
    scale: {
        mode: Phaser.Scale.NONE // taille fixe, aucune adaptation (mobile hors périmètre)
    },
    // Règle d'ordre : aucune scène avant le jalon 1.
    // SceneCarte, SceneLabyrinthe et SceneVictoire seront ajoutées aux lots 6 et 7.
    scene: []
};

const jeu = new Phaser.Game(config);

if (DEBUG) {
    jeu.events.once("ready", () => {
        console.log("[DEBUG] Arthur et la quête du trésor — prototype V0, lot 0");
        console.log("[DEBUG] Taille du jeu : " + LARGEUR + " x " + HAUTEUR);
        console.log("[DEBUG] Modèle : pas encore de données ni d'algorithme (lots 1 à 5)");
    });
}