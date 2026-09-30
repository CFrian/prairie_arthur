// CONTRAT D'ÉQUIPE (étape 0) — ne se modifie que sur main, avec l'accord des trois.
// Interface commune aux deux terrains : dijkstra() et bfs() ne connaissent que ce contrat.

// Un voisin d'un sommet : son identifiant et le coût pour s'y rendre.
export interface Voisin {
    id: string;
    cout: number;
}

// Tout terrain parcourable : la carte (GrapheCarte) et le labyrinthe (GrilleLabyrinthe).
export interface Graphe {
    voisins(id: string): Voisin[];
}
