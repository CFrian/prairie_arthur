// CONTRAT D'ÉQUIPE (étape 0) — ne se modifie que sur main, avec l'accord des trois.
// Types de résultats échangés entre le modèle et les scènes : les scènes se contentent de les afficher.

// Sortie de dijkstra() et de bfs() (section 8)
export interface ResultatChemin {
    cout: number;      // distance ou nombre de pas minimal
    chemin: string[];  // identifiants, du départ à l'arrivée inclus
}

// Sortie de QueteCarte.deplacer() (C3, C5, C9, C10 à C12)
// distance = longueur du tronçon (popup C5) ; total = distance cumulée (message C12)
// impasse = arrivée sur un lieu qui n'a qu'un seul voisin et n'est pas l'arrivée (C9, prompt v3)
export type ResultatDeplacement =
    | { type: "nonAdjacent" }
    | { type: "deplace"; distance: number }
    | { type: "impasse"; distance: number }
    | { type: "arriveeReussie"; distance: number }
    | { type: "arriveeEchouee"; distance: number; total: number };

// Sortie de QueteLabyrinthe.pas() (L4, L7 à L9)
export type ResultatPas =
    | { type: "mur" }
    | { type: "deplace" }
    | { type: "tresorOuvert"; pas: number }
    | { type: "tresorRefuse"; pas: number };

// Directions du labyrinthe (L2 : sans diagonale)
export type Direction = "haut" | "bas" | "gauche" | "droite";
