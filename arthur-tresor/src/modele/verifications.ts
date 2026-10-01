// Vérifications T1 à T5.
import { dijkstra, bfs } from "./algorithmes";
import { GrapheCarte } from "./GrapheCarte";
import { GrilleLabyrinthe } from "./GrilleLabyrinthe";
import { lieux, routes, depart, arrivee } from "./donneesCarte";
import { lignes, reperesRoutes } from "./donneesLabyrinthe";

function verifier(nom: string, condition: boolean): boolean {
  console.log(`[DEBUG] ${nom} : ${condition ? "OK" : "KO"}`);
  return condition;
}

export function lancerVerifications(): void {
  const t1 = lieux.length === 17 && routes.length === 18;

  const graphe = new GrapheCarte(lieux, routes);
  const t2 =
    graphe.voisins("taverne").length === 3 &&
    graphe.voisins("11,1").length === 0;

  const grille = new GrilleLabyrinthe(lignes);
  const resultatBfs = bfs(grille, grille.entree, grille.tresor);
  const t3 = resultatBfs.cout === 25;

  const mesuresAttendues = [33, 29, 25, 27, 35];
  const mesures = reperesRoutes.map((repere) => {
    const bloques = reperesRoutes
      .filter((autre) => autre.numero !== repere.numero)
      .map((autre) => autre.caseRepere);

    const grilleRoute = new GrilleLabyrinthe(lignes, bloques);
    return bfs(grilleRoute, grilleRoute.entree, grilleRoute.tresor).cout;
  });

  const t4 = mesures.every(
    (distance, index) => distance === mesuresAttendues[index]
  );

  const resultatDijkstra = dijkstra(graphe, depart, arrivee);
  const t5 = resultatDijkstra.cout === 21;

  verifier("T1 données carte", t1);
  verifier("T2 voisinage", t2);
  verifier("T3 BFS = 25", t3);
  verifier("T4 routes = 33/29/25/27/35", t4);
  verifier("T5 Dijkstra = 21", t5);

  if (t1 && t2 && t3 && t4 && t5) {
    console.log("[DEBUG] Vérifications T1 à T5 : OK");
  } else {
    console.log("[DEBUG] Vérifications T1 à T5 : KO");
  }

  // Évite une erreur de compilation si les constantes sont modifiées plus tard.
  void resultatBfs;
}
