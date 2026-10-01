// Phase carte : déplacements de lieu en lieu, compteur interne jamais affiché (C8).
// Propriétaire : C (tâche C2). Constructeur et signature fixés à l'étape 0.
import { Quete } from "./Quete";
import { GrapheCarte } from "./GrapheCarte";
import { dijkstra } from "./algorithmes";
import { lieux, routes, depart, arrivee } from "./donneesCarte";
import type { ResultatDeplacement } from "./resultats";

export class QueteCarte extends Quete {
    readonly graphe: GrapheCarte;

    // A1 : l'optimal est calculé au lancement par Dijkstra, jamais écrit en dur.
    // Attention : échoue tant que dijkstra() (tâche B1) n'est pas fusionné dans main.
    constructor() {
        const graphe = new GrapheCarte(lieux, routes);
        super(depart, dijkstra(graphe, depart, arrivee).cout);
        this.graphe = graphe;
    }

    // Déplace Arthur vers « lieu » et dit à la scène ce qui s'est passé.
    // La scène se contente d'afficher le résultat (P2).
    deplacer(lieu: string): ResultatDeplacement {
        // C10 : l'Entrée est terminale. Une fois arrivé, plus aucun déplacement
        // jusqu'au reset() demandé par la scène.
        if (this.position === arrivee) {
            return { type: "nonAdjacent" };
        }

        // C3 : un lieu non adjacent ne produit aucun effet
        const distance = this.distanceVers(lieu);
        if (distance === -1) {
            return { type: "nonAdjacent" };
        }

        // C7 : chaque déplacement compte, y compris un retour en arrière
        this.position = lieu;
        this.compteur = this.compteur + distance;

        // C10 à C12 : arrivée à l'Entrée → verdict (règle commune de Quete)
        if (lieu === arrivee) {
            if (this.verdictArrivee()) {
                return { type: "arriveeReussie", distance: distance };
            }
            // C12 : on renvoie la distance parcourue (total), jamais l'optimal
            return { type: "arriveeEchouee", distance: distance, total: this.compteur };
        }

        // C9 (prompt v3) : une impasse est un lieu à un seul voisin, autre que l'arrivée
        if (this.graphe.voisins(lieu).length === 1) {
            return { type: "impasse", distance: distance };
        }

        return { type: "deplace", distance: distance };
    }

    // Distance de la route qui relie la position actuelle à « lieu », ou -1 s'il n'y en a pas
    private distanceVers(lieu: string): number {
        for (const voisin of this.graphe.voisins(this.position)) {
            if (voisin.id === lieu) {
                return voisin.cout;
            }
        }
        return -1;
    }
}
