// Grille du labyrinthe vue comme un graphe : 4 voisins, coût 1, murs exclus.
import type { Graphe, Voisin } from "./Graphe";

const DECALAGES = [
  { ligne: -1, colonne: 0 },
  { ligne: 1, colonne: 0 },
  { ligne: 0, colonne: -1 },
  { ligne: 0, colonne: 1 },
];

export class GrilleLabyrinthe implements Graphe {
  entree = "";
  tresor = "";

  private readonly lignes: string[];
  private readonly casesBloquees: string[];

  constructor(lignes: string[], casesBloquees: string[] = []) {
    this.lignes = lignes;
    this.casesBloquees = casesBloquees;

    for (let ligne = 0; ligne < lignes.length; ligne++) {
      for (let colonne = 0; colonne < lignes[ligne].length; colonne++) {
        const caractere = lignes[ligne][colonne];

        if (caractere === "E") {
          this.entree = `${ligne},${colonne}`;
        }

        if (caractere === "T") {
          this.tresor = `${ligne},${colonne}`;
        }
      }
    }
  }

  voisins(id: string): Voisin[] {
    const [ligneTexte, colonneTexte] = id.split(",");
    const ligne = Number(ligneTexte);
    const colonne = Number(colonneTexte);

    if (!Number.isInteger(ligne) || !Number.isInteger(colonne)) {
      return [];
    }

    const resultat: Voisin[] = [];

    for (const decalage of DECALAGES) {
      const l = ligne + decalage.ligne;
      const c = colonne + decalage.colonne;

      if (this.estPraticable(l, c)) {
        resultat.push({
          id: `${l},${c}`,
          cout: 1,
        });
      }
    }

    return resultat;
  }

  private estPraticable(ligne: number, colonne: number): boolean {
    if (ligne < 0 || ligne >= this.lignes.length) return false;
    if (colonne < 0 || colonne >= this.lignes[ligne].length) return false;
    if (this.lignes[ligne][colonne] === "#") return false;

    return !this.casesBloquees.includes(`${ligne},${colonne}`);
  }
}
