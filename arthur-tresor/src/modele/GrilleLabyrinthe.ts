// Grille du labyrinthe vue comme un graphe : cases "ligne,colonne", 4 voisins, coût 1, murs exclus.
// Propriétaire : A (tâche A1). Signatures fixées à l'étape 0 : ne pas les changer sans accord.
import type { Graphe, Voisin } from "./Graphe";

export class GrilleLabyrinthe implements Graphe {
    // Cases lues dans la grille (lettres E et T), jamais saisies à la main
    entree = "";
    tresor = "";

    // casesBloquees : cases traitées comme des murs (utilisé uniquement par T4).
    // À IMPLÉMENTER (A1) : lire E et T, mémoriser la grille. Retirer les « _ » en les utilisant.
    constructor(_lignes: string[], _casesBloquees: string[] = []) {}

    // Cases de sol voisines (haut, bas, gauche, droite), coût 1 chacune
    voisins(_id: string): Voisin[] {
        throw new Error("GrilleLabyrinthe.voisins : à implémenter (A1)");
    }
}
