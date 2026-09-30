// Scène du labyrinthe : affiche la grille, transmet les flèches à QueteLabyrinthe, ne décide rien (P2).
// Propriétaire : B (tâche B3). Clé de scène fixée à l'étape 0 : "SceneLabyrinthe".
import * as Phaser from "phaser";

export class SceneLabyrinthe extends Phaser.Scene {
    constructor() {
        super("SceneLabyrinthe");
    }

    create(): void {
        // À IMPLÉMENTER (B3)
        // Trésor ouvert : this.scene.start("SceneVictoire", { pas: resultat.pas });
    }
}
