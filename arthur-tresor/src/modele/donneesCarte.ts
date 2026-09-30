// Données figées de la carte (section 6) : 17 lieux et 18 routes non orientées.
// Propriétaire : A. Format fixé à l'étape 0 ; contenu saisi en tâche A1.

// Un lieu : identifiant en minuscules sans accent, nom affiché, position à l'écran (960 x 720)
export interface Lieu {
    id: string;
    nom: string;
    x: number;
    y: number;
}

// Une route non orientée entre deux lieux
export interface Route {
    de: string;
    vers: string;
    distance: number;
}

// « La feuille » : chaque lieu a une place fixe, du départ (à gauche) vers l'Entrée (à droite).
// La vue locale (prompt v3) s'en sert pour placer les voisins :
//   x plus petit que le lieu d'Arthur → à gauche (arrière) ; x plus grand → à droite (avant) ;
//   y → rang de haut en bas. Deux voisins n'ont jamais le même x.
// Trois bandes, comme le schéma de la section 6 : itinéraire A en haut, B au milieu, C en bas.
// Chaque impasse est placée un peu après son lieu de départ, pour être « en avant » de lui.
export const lieux: Lieu[] = [
    // Départ et arrivée, sur la bande du milieu
    { id: "taverne", nom: "Taverne", x: 70, y: 330 },
    { id: "entree", nom: "Entrée", x: 890, y: 330 },

    // Itinéraire A (bande du haut) et son impasse
    { id: "moulin", nom: "Moulin", x: 200, y: 150 },
    { id: "marais", nom: "Marais", x: 280, y: 50 },
    { id: "pont", nom: "Pont", x: 360, y: 150 },
    { id: "gue", nom: "Gué", x: 520, y: 150 },
    { id: "tour", nom: "Tour", x: 680, y: 150 },

    // Itinéraire B (bande du milieu) et son impasse
    { id: "chapelle", nom: "Chapelle", x: 180, y: 330 },
    { id: "ferme", nom: "Ferme", x: 310, y: 330 },
    { id: "clairiere", nom: "Clairière", x: 440, y: 330 },
    { id: "source", nom: "Source", x: 570, y: 330 },
    { id: "grotte", nom: "Grotte", x: 635, y: 430 },
    { id: "rocher", nom: "Rocher", x: 700, y: 330 },

    // Itinéraire C (bande du bas) et son impasse
    { id: "foret", nom: "Forêt", x: 220, y: 560 },
    { id: "ruines", nom: "Ruines", x: 440, y: 560 },
    { id: "cimetiere", nom: "Cimetière", x: 550, y: 470 },
    { id: "colline", nom: "Colline", x: 660, y: 560 }
];

// Les 18 routes de la section 6, distances de 2 à 9
export const routes: Route[] = [
    // Itinéraire A : 2 + 7 + 6 + 5 + 6 = 26
    { de: "taverne", vers: "moulin", distance: 2 },
    { de: "moulin", vers: "pont", distance: 7 },
    { de: "pont", vers: "gue", distance: 6 },
    { de: "gue", vers: "tour", distance: 5 },
    { de: "tour", vers: "entree", distance: 6 },
    // Impasse A (gauche, début)
    { de: "moulin", vers: "marais", distance: 3 },

    // Itinéraire B : 5 + 3 + 4 + 3 + 2 + 4 = 21
    { de: "taverne", vers: "chapelle", distance: 5 },
    { de: "chapelle", vers: "ferme", distance: 3 },
    { de: "ferme", vers: "clairiere", distance: 4 },
    { de: "clairiere", vers: "source", distance: 3 },
    { de: "source", vers: "rocher", distance: 2 },
    { de: "rocher", vers: "entree", distance: 4 },
    // Impasse B (droite, fin)
    { de: "source", vers: "grotte", distance: 2 },

    // Itinéraire C : 4 + 9 + 8 + 3 = 24
    { de: "taverne", vers: "foret", distance: 4 },
    { de: "foret", vers: "ruines", distance: 9 },
    { de: "ruines", vers: "colline", distance: 8 },
    { de: "colline", vers: "entree", distance: 3 },
    // Impasse C (gauche, milieu)
    { de: "ruines", vers: "cimetiere", distance: 5 }
];

export const depart = "taverne";   // C1
export const arrivee = "entree";   // C10
