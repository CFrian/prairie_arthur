// Scène de la carte en vue locale (prompt v3) : Arthur au centre, voisins d'avant à gauche, d'après à droite.
// Propriétaire : A (tâches A2 et A3). Affiche et transmet les clics à QueteCarte, ne décide rien (P2).
import * as Phaser from "phaser";
import { lieux, routes, depart } from "../modele/donneesCarte";
import type { Lieu } from "../modele/donneesCarte";
import { GrapheCarte } from "../modele/GrapheCarte";

// Les trois colonnes de la vue locale : arrière, lieu d'Arthur, avant
const X_GAUCHE = 160;
const X_CENTRE = 480;
const X_DROITE = 800;
const Y_CENTRE = 330;
const ECART_VERTICAL = 150; // espace entre deux voisins d'une même colonne

// Couleurs du rendu V0 (formes géométriques uniquement)
const COULEUR_ROUTE = 0x8a8a8a;
const COULEUR_LIEU = 0xd9c9a3;
const COULEUR_ARTHUR = 0xe0b020;
const COULEUR_BOUTON = 0x3a3a3a;
const COULEUR_TEXTE = "#ffffff";

// Tailles
const RAYON_LIEU = 24;
const TAILLE_ARTHUR = 18;
const EPAISSEUR_ROUTE = 3;

export class SceneCarte extends Phaser.Scene {
    // Graphe utilisé pour connaître les voisins à afficher.
    // En A3, il sera remplacé par celui de QueteCarte (quete.graphe).
    private graphe = new GrapheCarte(lieux, routes);

    constructor() {
        super("SceneCarte");
    }

    create(): void {
        this.afficherVue(depart);  // C1 : Arthur démarre sur la Taverne
        this.creerBoutonReset();   // C13 : action branchée en A3
        // Panneau Taverne : ajouté en A3, via BoiteMessage.afficherPanneau() (tâche C1)
    }

    // ---------------------------------------------------------------
    // Vue locale : la « caméra » centrée sur le lieu d'Arthur
    // ---------------------------------------------------------------

    // Affiche le lieu d'Arthur au centre et ses voisins directs de part et d'autre.
    // Un voisin placé avant sur la feuille (x plus petit) va à gauche, un voisin placé après va à droite.
    private afficherVue(idLieu: string): void {
        const centre = this.trouverLieu(idLieu);

        // 1. Répartition des voisins entre la gauche et la droite
        const aGauche: Lieu[] = [];
        const aDroite: Lieu[] = [];
        for (const voisin of this.graphe.voisins(idLieu)) {
            const lieu = this.trouverLieu(voisin.id);
            if (lieu.x < centre.x) {
                aGauche.push(lieu);
            } else {
                aDroite.push(lieu);
            }
        }

        // 2. Dans chaque colonne, rangement de haut en bas selon le y de la feuille
        aGauche.sort((a, b) => a.y - b.y);
        aDroite.sort((a, b) => a.y - b.y);

        // 3. Les routes d'abord, pour qu'elles passent sous les cercles (C2 : aucune distance affichée)
        for (let i = 0; i < aGauche.length; i++) {
            this.creerVisuelRoute(X_CENTRE, Y_CENTRE, X_GAUCHE, this.yDansColonne(i, aGauche.length));
        }
        for (let i = 0; i < aDroite.length; i++) {
            this.creerVisuelRoute(X_CENTRE, Y_CENTRE, X_DROITE, this.yDansColonne(i, aDroite.length));
        }

        // 4. Les lieux : voisins à gauche et à droite, lieu d'Arthur au centre
        for (let i = 0; i < aGauche.length; i++) {
            this.creerVisuelLieu(aGauche[i], X_GAUCHE, this.yDansColonne(i, aGauche.length));
        }
        for (let i = 0; i < aDroite.length; i++) {
            this.creerVisuelLieu(aDroite[i], X_DROITE, this.yDansColonne(i, aDroite.length));
        }
        this.creerVisuelLieu(centre, X_CENTRE, Y_CENTRE);

        // 5. Arthur, en dernier pour être au-dessus de son lieu
        this.creerVisuelArthur(X_CENTRE, Y_CENTRE);
    }

    // Hauteur du rang « rang » dans une colonne de « total » lieux, centrée sur Y_CENTRE.
    // Exemple avec 3 lieux : 180, 330, 480.
    private yDansColonne(rang: number, total: number): number {
        return Y_CENTRE + (rang - (total - 1) / 2) * ECART_VERTICAL;
    }

    // ---------------------------------------------------------------
    // Préparation V1 : un élément visuel = une seule méthode dédiée.
    // Pour passer aux sprites, seule la ligne de création change.
    // ---------------------------------------------------------------

    // Une route entre deux points de l'écran
    private creerVisuelRoute(x1: number, y1: number, x2: number, y2: number): Phaser.GameObjects.Line {
        const ligne = this.add.line(0, 0, x1, y1, x2, y2, COULEUR_ROUTE);
        ligne.setOrigin(0, 0);
        ligne.setLineWidth(EPAISSEUR_ROUTE);
        return ligne;
    }

    // Un lieu : un cercle et son nom en dessous
    private creerVisuelLieu(lieu: Lieu, x: number, y: number): Phaser.GameObjects.Arc {
        const cercle = this.add.circle(x, y, RAYON_LIEU, COULEUR_LIEU);
        const nom = this.add.text(x, y + RAYON_LIEU + 6, lieu.nom, { fontSize: "18px", color: COULEUR_TEXTE });
        nom.setOrigin(0.5, 0);
        return cercle;
    }

    // Arthur : un carré doré posé sur son lieu
    private creerVisuelArthur(x: number, y: number): Phaser.GameObjects.Rectangle {
        return this.add.rectangle(x, y, TAILLE_ARTHUR, TAILLE_ARTHUR, COULEUR_ARTHUR);
    }

    // Bouton Reset en bas à droite (C13 : son action sera branchée en A3)
    private creerBoutonReset(): Phaser.GameObjects.Rectangle {
        const bouton = this.add.rectangle(870, 680, 120, 40, COULEUR_BOUTON);
        this.add.text(870, 680, "Reset", { fontSize: "18px", color: COULEUR_TEXTE }).setOrigin(0.5);
        return bouton;
    }

    // ---------------------------------------------------------------
    // Outils
    // ---------------------------------------------------------------

    // Retrouve un lieu par son identifiant dans les données
    private trouverLieu(id: string): Lieu {
        for (const lieu of lieux) {
            if (lieu.id === id) {
                return lieu;
            }
        }
        throw new Error("Lieu inconnu : " + id);
    }
}
