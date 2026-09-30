// Graphe pondéré non orienté de la carte, stocké en liste d'adjacence (section 8).
// Propriétaire : A (tâche A1). Signatures fixées à l'étape 0 : ne pas les changer sans accord.
import type { Graphe, Voisin } from "./Graphe";
import type { Lieu, Route } from "./donneesCarte";

export class GrapheCarte implements Graphe {
    // À IMPLÉMENTER (A1) : construire la liste d'adjacence (chaque route dans les deux sens).
    // Retirer le « _ » des paramètres en les utilisant.
    constructor(_lieux: Lieu[], _routes: Route[]) {}

    // Lieux reliés à « id » par une route, avec la distance de chaque route
    voisins(_id: string): Voisin[] {
        throw new Error("GrapheCarte.voisins : à implémenter (A1)");
    }

    // C3 : vrai si une route relie directement a et b
    estAdjacent(_a: string, _b: string): boolean {
        throw new Error("GrapheCarte.estAdjacent : à implémenter (A1)");
    }
}
