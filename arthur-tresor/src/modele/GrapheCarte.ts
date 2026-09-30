// Graphe pondéré non orienté de la carte, stocké en liste d'adjacence (section 8).
// Propriétaire : A (tâche A1). Signatures fixées à l'étape 0 : ne pas les changer sans accord.
import type { Graphe, Voisin } from "./Graphe";
import type { Lieu, Route } from "./donneesCarte";

export class GrapheCarte implements Graphe {
    // Liste d'adjacence : pour chaque identifiant de lieu, la liste de ses voisins.
    // Exemple : adjacence["taverne"] = [{ id: "moulin", cout: 2 }, { id: "chapelle", cout: 5 }, ...]
    private adjacence: { [id: string]: Voisin[] } = {};

    constructor(lieux: Lieu[], routes: Route[]) {
        // 1. Chaque lieu commence avec une liste de voisins vide
        for (const lieu of lieux) {
            this.adjacence[lieu.id] = [];
        }
        // 2. Chaque route est ajoutée dans les deux sens, puisqu'elle est non orientée
        for (const route of routes) {
            this.adjacence[route.de].push({ id: route.vers, cout: route.distance });
            this.adjacence[route.vers].push({ id: route.de, cout: route.distance });
        }
    }

    // Lieux reliés à « id » par une route, avec la distance de chaque route.
    // Un identifiant inconnu n'a aucun voisin.
    voisins(id: string): Voisin[] {
        const liste = this.adjacence[id];
        if (liste === undefined) {
            return [];
        }
        return liste;
    }

    // C3 : vrai si une route relie directement a et b
    estAdjacent(a: string, b: string): boolean {
        for (const voisin of this.voisins(a)) {
            if (voisin.id === b) {
                return true;
            }
        }
        return false;
    }
}
