// Point d'entrée : configuration du jeu Phaser (960 x 720, taille fixe) et liste des scènes.
// Figé après l'étape 0 (propriétaire : C) : chacun peut le modifier en local pour tester, sans committer.
import * as Phaser from "phaser";
import { SceneCarte } from "./vue/SceneCarte";
import { SceneLabyrinthe } from "./vue/SceneLabyrinthe";
import { SceneVictoire } from "./vue/SceneVictoire";
import { lancerVerifications } from "./modele/verifications";

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
    // La première scène de la liste démarre seule : le jeu commence sur la carte (section 1).
    scene: [SceneCarte, SceneLabyrinthe, SceneVictoire]
};

new Phaser.Game(config);

if (DEBUG) {
    console.log("[DEBUG] Arthur et la quête du trésor — prototype V0");
    lancerVerifications();
}
