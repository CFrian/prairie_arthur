// Grille du labyrinthe vue comme un graphe : cases "ligne,colonne", 4 voisins, coût 1, murs exclus.
// Propriétaire : A (tâche A1). Signatures fixées à l'étape 0 : ne pas les changer sans accord.
import type { Graphe, Voisin } from "./Graphe";

// Les 4 directions autorisées, sans diagonale (L2) : décalage de ligne et de colonne
const DECALAGES = [
    { ligne: -1, colonne: 0 },  // haut
    { ligne: 1, colonne: 0 },   // bas
    { ligne: 0, colonne: -1 },  // gauche
    { ligne: 0, colonne: 1 }    // droite
];

export class GrilleLabyrinthe implements Graphe {
    // Cases lues dans la grille (lettres E et T), jamais saisies à la main
    entree = "";
    tresor = "";

    private lignes: string[];
    // Cases traitées comme des murs en plus des « # » (utilisé uniquement par T4)
    private casesBloquees: string[];

    constructor(lignes: string[], casesBloquees: string[] = []) {
        this.lignes = lignes;
        this.casesBloquees = casesBloquees;

        // Recherche des lettres E et T dans toute la grille
        for (let ligne = 0; ligne < lignes.length; ligne++) {
            for (let colonne = 0; colonne < lignes[ligne].length; colonne++) {
                const caractere = lignes[ligne][colonne];
                if (caractere === "E") {
                    this.entree = ligne + "," + colonne;
                }
                if (caractere === "T") {
                    this.tresor = ligne + "," + colonne;
                }
            }
        }
    }

    // Cases de sol voisines (haut, bas, gauche, droite), coût 1 chacune
    voisins(id: string): Voisin[] {
        // "11,5" → ligne 11, colonne 5
        const morceaux = id.split(",");
        const ligne = Number(morceaux[0]);
        const colonne = Number(morceaux[1]);

        const resultat: Voisin[] = [];
        for (const decalage of DECALAGES) {
            const l = ligne + decalage.ligne;
            const c = colonne + decalage.colonne;
            if (this.estPraticable(l, c)) {
                resultat.push({ id: l + "," + c, cout: 1 });
            }
        }
        return resultat;
    }

    // Vrai si la case existe, n'est pas un mur (L4) et n'est pas bloquée
    private estPraticable(ligne: number, colonne: number): boolean {
        if (ligne < 0 || ligne >= this.lignes.length) {
            return false;
        }
        if (colonne < 0 || colonne >= this.lignes[ligne].length) {
            return false;
        }
        if (this.lignes[ligne][colonne] === "#") {
            return false;
        }
        return !this.casesBloquees.includes(ligne + "," + colonne);
    }
}
