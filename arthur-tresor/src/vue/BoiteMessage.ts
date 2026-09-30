// Affichage des textes : popup de distance, messages de réussite et d'échec, panneaux fixes.
// Propriétaire : C (tâche C1). Signatures fixées à l'étape 0 : SceneCarte et SceneLabyrinthe les utilisent.
import * as Phaser from "phaser";

export class BoiteMessage {
    // Retirer le « _ » en l'utilisant (C1)
    constructor(_scene: Phaser.Scene) {}

    // C5 : affiche « Distance : X » puis disparaît seul après dureeMs. Aucune interaction.
    afficherPopup(_texte: string, _dureeMs: number): void {
        throw new Error("BoiteMessage.afficherPopup : à implémenter (C1)");
    }

    // C14, L11 : reste affiché jusqu'à un clic ou une touche, puis appelle aLaFermeture.
    afficherMessage(_texte: string, _aLaFermeture: () => void): void {
        throw new Error("BoiteMessage.afficherMessage : à implémenter (C1)");
    }

    // P5 : la scène bloque les déplacements tant qu'un message est ouvert
    estOuvert(): boolean {
        throw new Error("BoiteMessage.estOuvert : à implémenter (C1)");
    }

    // Section 10 : panneau de texte fixe, toujours visible, sans interaction
    afficherPanneau(_texte: string, _x: number, _y: number): void {
        throw new Error("BoiteMessage.afficherPanneau : à implémenter (C1)");
    }
}
