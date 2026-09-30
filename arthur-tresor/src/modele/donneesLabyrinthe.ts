// Données figées du labyrinthe (section 7) : grille de 22 colonnes x 21 lignes.
// Propriétaire : A. Format fixé à l'étape 0 ; seul le contenu est à compléter (tâche A1).

// À COMPLÉTER (A1) : les 21 chaînes copiées telles quelles de la section 7
// Légende : E = entrée · T = trésor · # = mur · . = sol
export const lignes: string[] = [];

// Repère d'une route : une case de sol qui n'appartient qu'à cette route.
// Pour mesurer une route (T4), on bloque les repères de toutes les autres.
export interface RepereRoute {
    numero: number;     // 1 à 5, comme dans la section 7
    caseRepere: string; // format "ligne,colonne"
}

// À COMPLÉTER (A1) : un repère par route, 5 au total
export const reperesRoutes: RepereRoute[] = [];
