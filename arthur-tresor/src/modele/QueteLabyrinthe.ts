// Phase labyrinthe : déplacement case par case, compteur de pas visible (L5).
// Propriétaire : C (tâche C2). Constructeur et signature fixés à l'étape 0.
import { Quete } from "./Quete";
import { GrilleLabyrinthe } from "./GrilleLabyrinthe";
import { bfs } from "./algorithmes";
import { lignes } from "./donneesLabyrinthe";
import type { Direction, ResultatPas } from "./resultats";

export class QueteLabyrinthe extends Quete {
    readonly grille: GrilleLabyrinthe;

    // A1 : l'optimal est calculé au lancement par BFS, jamais écrit en dur.
    // Attention : échoue tant que bfs() et GrilleLabyrinthe ne sont pas fusionnés dans main.
    constructor() {
        const grille = new GrilleLabyrinthe(lignes);
        super(grille.entree, bfs(grille, grille.entree, grille.tresor).cout);
        this.grille = grille;
    }

    // À IMPLÉMENTER (C2) : L3, L4, L7, L8, L9. Retirer le « _ » en l'utilisant.
    pas(_direction: Direction): ResultatPas {
        throw new Error("QueteLabyrinthe.pas : à implémenter (C2)");
    }
}
