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
    // Attention : échoue tant que dijkstra() et GrapheCarte ne sont pas fusionnés dans main.
    constructor() {
        const graphe = new GrapheCarte(lieux, routes);
        super(depart, dijkstra(graphe, depart, arrivee).cout);
        this.graphe = graphe;
    }

    // À IMPLÉMENTER (C2) : C3, C7, C10, C11, C12. Retirer le « _ » en l'utilisant.
    deplacer(_lieu: string): ResultatDeplacement {
        throw new Error("QueteCarte.deplacer : à implémenter (C2)");
    }
}
