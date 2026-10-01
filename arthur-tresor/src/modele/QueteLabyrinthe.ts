// Phase labyrinthe : déplacement case par case, compteur de pas visible (L5).
// Propriétaire : C (tâche C2). Constructeur et signature fixés à l'étape 0.
import { Quete } from "./Quete";
import { GrilleLabyrinthe } from "./GrilleLabyrinthe";
import { bfs } from "./algorithmes";
import { lignes } from "./donneesLabyrinthe";
import type { Direction, ResultatPas } from "./resultats";

export class QueteLabyrinthe extends Quete {
    readonly grille: GrilleLabyrinthe;

    // A1 : l'optimal est calculé au lancement par BFS, jamais écrit en dur.
    // Attention : échoue tant que bfs() (tâche B1) n'est pas fusionné dans main.
    constructor() {
        const grille = new GrilleLabyrinthe(lignes);
        super(grille.entree, bfs(grille, grille.entree, grille.tresor).cout);
        this.grille = grille;
    }

    // Fait un pas dans la direction demandée et dit à la scène ce qui s'est passé.
    // La scène se contente d'afficher le résultat (P2).
    pas(direction: Direction): ResultatPas {
        // L7 : le trésor est terminal. Une fois atteint, plus aucun pas
        // jusqu'au reset() demandé par la scène.
        if (this.position === this.grille.tresor) {
            return { type: "mur" };
        }

        // Case visée, au format "ligne,colonne"
        const cible = this.caseVoisine(this.position, direction);

        // L4 : la grille ne propose que les cases de sol ; une case absente de ses voisins
        // est un mur (ou le bord). Arthur ne bouge pas, le compteur non plus.
        if (!this.estVoisinPraticable(cible)) {
            return { type: "mur" };
        }

        // L3 : chaque case franchie compte, y compris en rebroussant chemin
        this.position = cible;
        this.compteur = this.compteur + 1;

        // L7 à L9 : arrivée sur le trésor → verdict (règle commune de Quete)
        if (cible === this.grille.tresor) {
            if (this.verdictArrivee()) {
                return { type: "tresorOuvert", pas: this.compteur };
            }
            // L9 : on renvoie les pas du joueur, jamais l'optimal
            return { type: "tresorRefuse", pas: this.compteur };
        }

        return { type: "deplace" };
    }

    // Case voisine dans une direction (L2 : sans diagonale). Exemple : "11,5" + droite → "11,6"
    private caseVoisine(id: string, direction: Direction): string {
        const morceaux = id.split(",");
        let ligne = Number(morceaux[0]);
        let colonne = Number(morceaux[1]);
        switch (direction) {
            case "haut":
                ligne = ligne - 1;
                break;
            case "bas":
                ligne = ligne + 1;
                break;
            case "gauche":
                colonne = colonne - 1;
                break;
            case "droite":
                colonne = colonne + 1;
                break;
        }
        return ligne + "," + colonne;
    }

    // Vrai si « cible » fait partie des voisins de sol de la position actuelle
    private estVoisinPraticable(cible: string): boolean {
        for (const voisin of this.grille.voisins(this.position)) {
            if (voisin.id === cible) {
                return true;
            }
        }
        return false;
    }
}
