// Données figées du labyrinthe (section 7) : grille de 22 colonnes x 21 lignes.
// Propriétaire : A. Format fixé à l'étape 0 ; contenu saisi en tâche A1.

// Les 21 lignes copiées telles quelles de la section 7.
// Légende : E = entrée · T = trésor · # = mur · . = sol
// Coordonnées d'une case : "ligne,colonne", à partir de 0 (E = "11,1", T = "11,20").
export const lignes: string[] = [
    "######################",
    "##########.###########",
    "##########.###########",
    "##########.###########",
    "###...............####",
    "###.#############.####",
    "###.#####....####.####",
    "###.......##......####",
    "###.#############.####",
    "###.####....#####.####",
    "###.####.##.#####.####",
    "#E.......##...#.....T#",
    "###.#.#######...#.####",
    "###.#.###########.####",
    "###.#############.####",
    "###...............####",
    "###.#############.####",
    "###.#########.....####",
    "###.#############.####",
    "###...............####",
    "######################"
];

// Repère d'une route : une case de sol qui n'appartient qu'à cette route.
// Pour mesurer une route (T4), on bloque les repères de toutes les autres.
export interface RepereRoute {
    numero: number;     // 1 à 5, comme dans la section 7
    caseRepere: string; // format "ligne,colonne"
}

// Un repère par route. Chaque case a été choisie au milieu de la partie propre à sa route :
// en bloquant les 4 autres repères, BFS mesure 33 / 29 / 25 / 27 / 35 (routes 1 à 5).
export const reperesRoutes: RepereRoute[] = [
    { numero: 1, caseRepere: "4,10" },   // haut large : couloir du haut
    { numero: 2, caseRepere: "6,10" },   // haut directe
    { numero: 3, caseRepere: "9,11" },   // centre (route optimale)
    { numero: 4, caseRepere: "15,10" },  // bas directe
    { numero: 5, caseRepere: "19,10" }   // bas large : couloir du bas
];
