// Algorithmes de plus court chemin, indépendants de Phaser et du terrain (A4).
// Propriétaire : B (tâche B1). Aucun générique TypeScript (prompt maître, section 4).
import type { Graphe } from "./Graphe";
import type { ResultatChemin } from "./resultats";

// A2 : Dijkstra simple, minimum choisi par parcours de tableau (pas de file de priorité)
export function dijkstra(
  graphe: Graphe,
  depart: string,
  arrivee: string
): ResultatChemin {
  const distances: { [id: string]: number } = {};
  const precedents: { [id: string]: string | undefined } = {};
  const visites: { [id: string]: boolean } = {};

  distances[depart] = 0;

  while (true) {
    let courant: string | undefined;
    let meilleureDistance = Infinity;

    for (const id of Object.keys(distances)) {
      if (!visites[id] && distances[id] < meilleureDistance) {
        meilleureDistance = distances[id];
        courant = id;
      }
    }

    if (courant === undefined) break;
    if (courant === arrivee) break;

    visites[courant] = true;

    for (const voisin of graphe.voisins(courant)) {
      if (visites[voisin.id]) continue;

      const nouvelleDistance = distances[courant] + voisin.cout;
      const ancienneDistance = distances[voisin.id] ?? Infinity;

      if (nouvelleDistance < ancienneDistance) {
        distances[voisin.id] = nouvelleDistance;
        precedents[voisin.id] = courant;
      }
    }
  }

  if (distances[arrivee] === undefined) {
    return { cout: Infinity, chemin: [] };
  }

  const chemin: string[] = [];
  let courant: string | undefined = arrivee;

  while (courant !== undefined) {
    chemin.unshift(courant);
    if (courant === depart) break;
    courant = precedents[courant];
  }

  if (chemin[0] !== depart) {
    return { cout: Infinity, chemin: [] };
  }

  return { cout: distances[arrivee], chemin };
}

// A3 : BFS avec une file (tableau + index) et une table des cases visitées
export function bfs(
  graphe: Graphe,
  depart: string,
  arrivee: string
): ResultatChemin {
  const file: string[] = [depart];
  let index = 0;

  // Table des cases visitées et case précédente de chacune (simples objets, sans générique)
  const visites: { [id: string]: boolean } = {};
  const precedents: { [id: string]: string } = {};
  visites[depart] = true;

  while (index < file.length) {
    const courant = file[index++];

    if (courant === arrivee) break;

    for (const voisin of graphe.voisins(courant)) {
      if (visites[voisin.id]) continue;

      visites[voisin.id] = true;
      precedents[voisin.id] = courant;
      file.push(voisin.id);
    }
  }

  if (!visites[arrivee]) {
    return { cout: Infinity, chemin: [] };
  }

  const chemin: string[] = [];
  let courant: string | undefined = arrivee;

  while (courant !== undefined) {
    chemin.unshift(courant);
    if (courant === depart) break;
    courant = precedents[courant];
  }

  if (chemin[0] !== depart) {
    return { cout: Infinity, chemin: [] };
  }

  return { cout: chemin.length - 1, chemin };
}