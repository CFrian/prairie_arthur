// Données figées de la carte (section 6) : 17 lieux et 18 routes non orientées.
// Propriétaire : A. Format fixé à l'étape 0 ; seul le contenu des tableaux est à compléter (tâche A1).

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

// À COMPLÉTER (A1) : 17 lieux, disposés en trois bandes horizontales
export const lieux: Lieu[] = [];

// À COMPLÉTER (A1) : 18 routes de la section 6
export const routes: Route[] = [];

export const depart = "taverne";   // C1
export const arrivee = "entree";   // C10
