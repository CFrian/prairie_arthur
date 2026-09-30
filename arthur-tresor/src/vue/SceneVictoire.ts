// Écran de victoire : nombre de pas du joueur et bouton « Rejouer » (V1 à V3).
// Propriétaire : C (tâche C1). Clé fixée à l'étape 0 : "SceneVictoire", reçoit { pas }.
import * as Phaser from "phaser";

export interface DonneesVictoire {
    pas: number;
}

export class SceneVictoire extends Phaser.Scene {
    private pas = 0;

    constructor() {
        super("SceneVictoire");
    }

    // Données transmises par SceneLabyrinthe : this.scene.start("SceneVictoire", { pas })
    init(donnees: DonneesVictoire): void {
        this.pas = donnees.pas;
    }

    create(): void {
        // À IMPLÉMENTER (C1) : V1 (afficher this.pas), V2 et V3 (bouton « Rejouer » → "SceneCarte")
        console.log("[DEBUG] SceneVictoire : à implémenter (C1), pas reçus = " + this.pas);
    }
}
