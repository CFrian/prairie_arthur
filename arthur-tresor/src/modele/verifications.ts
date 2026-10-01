// Vérifications T1 à T5 (section 11), lancées au démarrage si DEBUG, résultat OK/KO en console.
// Propriétaire : B (tâche B2). Seul fichier où les valeurs 21 et 25 peuvent être écrites (A1, P3).
import type { Graphe, Voisin } from "./Graphe";
import { dijkstra, bfs } from "./algorithmes";
import { GrapheCarte } from "./GrapheCarte";
import { GrilleLabyrinthe } from "./GrilleLabyrinthe";
import { lieux, routes, depart, arrivee } from "./donneesCarte";
import { lignes, reperesRoutes } from "./donneesLabyrinthe";

// Valeurs de référence de la préproduction (sections 6, 7 et 11)
const OPTIMAL_CARTE = 21;
const OPTIMAL_LABYRINTHE = 25;
const CHEMIN_ITINERAIRE_B = ["taverne", "chapelle", "ferme", "clairiere", "source", "rocher", "entree"];
const CASE_ROUTE_3 = "9,11"; // case propre à la route 3 (voir donneesLabyrinthe.ts)

// Longueur de chaque route du labyrinthe, par numéro (tableau de la section 7)
const LONGUEURS_ROUTES: { [numero: number]: number } = { 1: 33, 2: 29, 3: 25, 4: 27, 5: 35 };

// Affiche le résultat d'un test et le renvoie
function verifier(nom: string, reussi: boolean, detail: string): boolean {
  console.log("[DEBUG] " + nom + " : " + (reussi ? "OK" : "KO") + " (" + detail + ")");
  return reussi;
}

// Vrai si les deux listes contiennent les mêmes éléments, dans le même ordre
function memesListes(a: string[], b: string[]): boolean {
  if (a.length !== b.length) {
    return false;
  }
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return false;
    }
  }
  return true;
}

// T1 : Dijkstra sur la carte renvoie 21 et le chemin de l'itinéraire B
function testT1(): boolean {
  const resultat = dijkstra(new GrapheCarte(lieux, routes), depart, arrivee);
  return verifier(
    "T1 Dijkstra carte = 21, itinéraire B",
    resultat.cout === OPTIMAL_CARTE && memesListes(resultat.chemin, CHEMIN_ITINERAIRE_B),
    "coût " + resultat.cout + ", chemin " + resultat.chemin.join(" > ")
  );
}

// T2 : BFS sur la grille renvoie 25 et le chemin de la route 3
function testT2(): boolean {
  const grille = new GrilleLabyrinthe(lignes);
  const resultat = bfs(grille, grille.entree, grille.tresor);
  const cheminCorrect =
    resultat.chemin.length === OPTIMAL_LABYRINTHE + 1 &&       // 25 pas = 26 cases, départ compris
    resultat.chemin[0] === grille.entree &&
    resultat.chemin[resultat.chemin.length - 1] === grille.tresor &&
    resultat.chemin.includes(CASE_ROUTE_3);                    // passe bien par la route 3
  return verifier(
    "T2 BFS grille = 25, route 3",
    resultat.cout === OPTIMAL_LABYRINTHE && cheminCorrect,
    "coût " + resultat.cout + ", " + resultat.chemin.length + " cases, passe par " + CASE_ROUTE_3 + " : " + resultat.chemin.includes(CASE_ROUTE_3)
  );
}

// T3 : Dijkstra sur un petit graphe jouet renvoie le bon résultat.
// A–B 1, B–C 2, A–C 5, C–D 1 : le plus court de A à D est A > B > C > D, coût 4
// (le raccourci apparent A–C coûte 5, il ne doit pas être choisi).
function testT3(): boolean {
  const jouet: { [id: string]: Voisin[] } = {
    A: [{ id: "B", cout: 1 }, { id: "C", cout: 5 }],
    B: [{ id: "A", cout: 1 }, { id: "C", cout: 2 }],
    C: [{ id: "A", cout: 5 }, { id: "B", cout: 2 }, { id: "D", cout: 1 }],
    D: [{ id: "C", cout: 1 }]
  };
  // Un simple objet suffit pour respecter le contrat Graphe : pas de classe en plus (P4)
  const grapheJouet: Graphe = {
    voisins: (id: string): Voisin[] => jouet[id] ?? []
  };
  const resultat = dijkstra(grapheJouet, "A", "D");
  return verifier(
    "T3 Dijkstra graphe jouet = 4",
    resultat.cout === 4 && memesListes(resultat.chemin, ["A", "B", "C", "D"]),
    "coût " + resultat.cout + ", chemin " + resultat.chemin.join(" > ")
  );
}

// T4 : BFS mesure chaque route du labyrinthe, les autres routes étant bloquées
function testT4(): boolean {
  let toutesBonnes = true;
  const mesures: string[] = [];
  for (const route of reperesRoutes) {
    // On bloque le repère de toutes les autres routes
    const bloquees: string[] = [];
    for (const autre of reperesRoutes) {
      if (autre.numero !== route.numero) {
        bloquees.push(autre.caseRepere);
      }
    }
    const grille = new GrilleLabyrinthe(lignes, bloquees);
    const mesure = bfs(grille, grille.entree, grille.tresor).cout;
    mesures.push("route " + route.numero + " = " + mesure);
    if (mesure !== LONGUEURS_ROUTES[route.numero]) {
      toutesBonnes = false;
    }
  }
  return verifier("T4 routes 1 à 5 = 33 / 29 / 25 / 27 / 35", toutesBonnes, mesures.join(", "));
}

// T5 : Dijkstra appliqué à la grille renvoie 25, comme BFS
function testT5(): boolean {
  const grille = new GrilleLabyrinthe(lignes);
  const resultat = dijkstra(grille, grille.entree, grille.tresor);
  return verifier("T5 Dijkstra grille = 25", resultat.cout === OPTIMAL_LABYRINTHE, "coût " + resultat.cout);
}

export function lancerVerifications(): void {
  const resultats = [testT1(), testT2(), testT3(), testT4(), testT5()];
  let reussis = 0;
  for (const reussi of resultats) {
    if (reussi) {
      reussis++;
    }
  }
  console.log("[DEBUG] Vérifications T1 à T5 : " + reussis + "/5 " + (reussis === 5 ? "OK" : "KO"));
}