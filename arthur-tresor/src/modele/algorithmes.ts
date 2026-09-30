// Algorithmes de plus court chemin, indépendants de Phaser et du terrain (A4).
// Propriétaire : B (tâche B1). Signatures fixées à l'étape 0.
import type { Graphe } from "./Graphe";
import type { ResultatChemin } from "./resultats";

// A2 : Dijkstra simple, minimum choisi par parcours de tableau (pas de file de priorité)
export function dijkstra(_graphe: Graphe, _depart: string, _arrivee: string): ResultatChemin {
    throw new Error("dijkstra : à implémenter (B1)");
}

// A3 : BFS avec une file (tableau + index) et une table des cases visitées
export function bfs(_graphe: Graphe, _depart: string, _arrivee: string): ResultatChemin {
    throw new Error("bfs : à implémenter (B1)");
}
