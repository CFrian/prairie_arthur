// Écran de victoire : nombre de pas du joueur et bouton « Rejouer » (V1 à V3).
// Propriétaire : C (tâche C1). Clé fixée à l'étape 0 : "SceneVictoire", reçoit { pas }.
import * as Phaser from "phaser";

export interface DonneesVictoire {
    pas: number;
}

const COULEUR_TRESOR = 0xe0b020;
const COULEUR_BOUTON = 0x3a3a3a;
const COULEUR_BOUTON_SURVOL = 0x555555;
const COULEUR_TEXTE = "#ffffff";

export class SceneVictoire extends Phaser.Scene {
    private pas = 0;

    constructor() {
        super("SceneVictoire");
    }

    // Données transmises par SceneLabyrinthe : this.scene.start("SceneVictoire", { pas })
    init(donnees: DonneesVictoire): void {
        // Si la scène est lancée sans données (test), on affiche 0 plutôt que « undefined »
        this.pas = donnees.pas ?? 0;
    }

    create(): void {
        const centreX = this.scale.width / 2;

        // Le trésor ouvert : un simple coffre doré (rendu V0)
        this.creerVisuelTresor(centreX, 220);

        // V1 : message et nombre de pas du joueur (jamais l'optimal)
        this.add.text(centreX, 330, "Victoire ! Le trésor s'ouvre.", { fontSize: "34px", color: COULEUR_TEXTE })
            .setOrigin(0.5);
        this.add.text(centreX, 385, "Tu l'as atteint en " + this.pas + " pas.", { fontSize: "22px", color: COULEUR_TEXTE })
            .setOrigin(0.5);

        // V2, V3 : seul élément interactif de l'écran
        this.creerBoutonRejouer(centreX, 490);
    }

    // Préparation V1 : le trésor est créé par une seule méthode
    private creerVisuelTresor(x: number, y: number): Phaser.GameObjects.Rectangle {
        return this.add.rectangle(x, y, 90, 60, COULEUR_TRESOR);
    }

    // V2 : « Rejouer » relance la carte. Chaque scène crée une quête neuve dans create() :
    // tous les compteurs repartent donc à 0, sans code supplémentaire.
    private creerBoutonRejouer(x: number, y: number): void {
        const bouton = this.add.rectangle(x, y, 200, 56, COULEUR_BOUTON);
        bouton.setStrokeStyle(2, COULEUR_TRESOR);
        this.add.text(x, y, "Rejouer", { fontSize: "24px", color: COULEUR_TEXTE }).setOrigin(0.5);

        bouton.setInteractive({ useHandCursor: true });
        bouton.on("pointerover", () => bouton.setFillStyle(COULEUR_BOUTON_SURVOL));
        bouton.on("pointerout", () => bouton.setFillStyle(COULEUR_BOUTON));
        bouton.on("pointerdown", () => this.scene.start("SceneCarte"));
    }
}
