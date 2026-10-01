// Scène de la carte en vue locale (prompt v3) : Arthur au centre, voisins d'avant à gauche, d'après à droite.
// Propriétaire : A (tâches A2 et A3). Affiche et transmet les clics à QueteCarte, ne décide rien (P2).
import * as Phaser from "phaser";
import { lieux } from "../modele/donneesCarte";
import type { Lieu } from "../modele/donneesCarte";
import { QueteCarte } from "../modele/QueteCarte";
import type { ResultatDeplacement } from "../modele/resultats";
import { BoiteMessage } from "./BoiteMessage";

// Les trois colonnes de la vue locale : arrière, lieu d'Arthur, avant
const X_GAUCHE = 160;
const X_CENTRE = 480;
const X_DROITE = 800;
const Y_CENTRE = 330;
const ECART_VERTICAL = 150; // espace entre deux voisins d'une même colonne

// Couleurs du rendu V0 (formes géométriques uniquement)
const COULEUR_ROUTE = 0x8a8a8a;
const COULEUR_LIEU = 0xd9c9a3;
const COULEUR_LIEU_SURVOL = 0xf2e6c4;
const COULEUR_ARTHUR = 0xe0b020;
const COULEUR_BOUTON = 0x3a3a3a;
const COULEUR_BOUTON_SURVOL = 0x555555;
const COULEUR_TEXTE = "#ffffff";

// Tailles
const RAYON_LIEU = 24;
const TAILLE_ARTHUR = 18;
const EPAISSEUR_ROUTE = 3;

// C4, C5 : durée d'un déplacement et du popup de distance
const DUREE_DEPLACEMENT_MS = 3000;

// Textes affichés au joueur (section 10 et prompt v3). Aucun ne mentionne l'optimal.
const TEXTE_PANNEAU = "Rejoins l'entrée du labyrinthe par le chemin le plus court. Retiens bien les distances.";
const TEXTE_REUSSITE = "Tu as trouvé le chemin le plus court !";
const TEXTE_IMPASSE = "Cul-de-sac : tu ne peux pas aller plus loin. Reviens sur tes pas.";

export class SceneCarte extends Phaser.Scene {
    // Modèle et affichage des textes. Créés dans create() : une quête neuve à chaque
    // lancement de la scène, donc « Rejouer » remet tout à 0 (V2).
    private quete!: QueteCarte;
    private boite!: BoiteMessage;

    // C6 : vrai pendant les 3 s d'un déplacement. Tout clic est alors ignoré.
    private enDeplacement = false;

    // Éléments de la vue locale, détruits et recréés à chaque arrivée sur un lieu
    private elementsVue: Phaser.GameObjects.GameObject[] = [];
    private visuelArthur!: Phaser.GameObjects.Rectangle;

    constructor() {
        super("SceneCarte");
    }

    create(): void {
        // A1 : la quête calcule l'optimal par Dijkstra dès sa création
        this.quete = new QueteCarte();
        this.boite = new BoiteMessage(this);
        this.enDeplacement = false;
        this.elementsVue = [];

        // Éléments fixes : panneau Taverne (section 10) et bouton Reset (C13)
        this.boite.afficherPanneau(TEXTE_PANNEAU, 16, 16);
        this.creerBoutonReset();

        // C1 : Arthur démarre sur la Taverne
        this.afficherVue(this.quete.position);
    }

    // ---------------------------------------------------------------
    // Interactions
    // ---------------------------------------------------------------

    // Vrai si le joueur a le droit d'agir : ni déplacement en cours (C6), ni message ouvert (C14)
    private peutAgir(): boolean {
        return !this.enDeplacement && !this.boite.estOuvert();
    }

    // C3 : clic sur un lieu voisin. La quête décide ; la scène anime puis affiche le résultat.
    private surClicLieu(idLieu: string, cercle: Phaser.GameObjects.Arc): void {
        if (!this.peutAgir()) {
            return;
        }

        const resultat = this.quete.deplacer(idLieu);
        if (resultat.type === "nonAdjacent") {
            return; // C3 : aucun effet
        }

        // C4, C5, C6 : Arthur glisse vers le lieu en 3 s, le popup affiche la distance du tronçon
        this.enDeplacement = true;
        this.boite.afficherPopup("Distance : " + resultat.distance, DUREE_DEPLACEMENT_MS);
        this.tweens.add({
            targets: this.visuelArthur,
            x: cercle.x,
            y: cercle.y,
            duration: DUREE_DEPLACEMENT_MS,
            ease: "Sine.easeInOut",
            onComplete: () => this.surArrivee(resultat)
        });
    }

    // Fin des 3 s : la caméra se recentre sur le nouveau lieu, puis le résultat est affiché
    private surArrivee(resultat: ResultatDeplacement): void {
        this.enDeplacement = false;
        this.afficherVue(this.quete.position);

        switch (resultat.type) {
            case "impasse":
                // C9 (prompt v3) : message à l'arrivée dans un cul-de-sac, jamais avant
                this.boite.afficherMessage(TEXTE_IMPASSE, () => {});
                break;
            case "arriveeReussie":
                // C11 : message obligatoire, puis entrée dans le labyrinthe
                this.boite.afficherMessage(TEXTE_REUSSITE, () => this.scene.start("SceneLabyrinthe"));
                break;
            case "arriveeEchouee":
                // C12 : distance parcourue, jamais l'optimal ; retour à la Taverne, compteur à 0
                this.boite.afficherMessage(
                    "Tu as parcouru " + resultat.total + ".\nCe n'est pas le chemin le plus court.",
                    () => this.recommencer()
                );
                break;
            default:
                // "deplace" : rien de plus à afficher
                break;
        }
    }

    // C13 : Reset, uniquement hors déplacement et hors message ; ne révèle aucune information
    private surClicReset(): void {
        if (!this.peutAgir()) {
            return;
        }
        this.recommencer();
    }

    // Retour à la Taverne, compteur à 0 (C12, C13)
    private recommencer(): void {
        this.quete.reset();
        this.afficherVue(this.quete.position);
    }

    // ---------------------------------------------------------------
    // Vue locale : la « caméra » centrée sur le lieu d'Arthur
    // ---------------------------------------------------------------

    // Affiche le lieu d'Arthur au centre et ses voisins directs de part et d'autre.
    // Un voisin placé avant sur la feuille (x plus petit) va à gauche, un voisin placé après va à droite.
    private afficherVue(idLieu: string): void {
        // 0. On efface la vue précédente
        for (const element of this.elementsVue) {
            element.destroy();
        }
        this.elementsVue = [];

        const centre = this.trouverLieu(idLieu);

        // 1. Répartition des voisins entre la gauche et la droite
        const aGauche: Lieu[] = [];
        const aDroite: Lieu[] = [];
        for (const voisin of this.quete.graphe.voisins(idLieu)) {
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

        // 4. Les voisins, cliquables (C3) ; le lieu d'Arthur au centre, non cliquable
        for (let i = 0; i < aGauche.length; i++) {
            this.creerLieuCliquable(aGauche[i], X_GAUCHE, this.yDansColonne(i, aGauche.length));
        }
        for (let i = 0; i < aDroite.length; i++) {
            this.creerLieuCliquable(aDroite[i], X_DROITE, this.yDansColonne(i, aDroite.length));
        }
        this.creerVisuelLieu(centre, X_CENTRE, Y_CENTRE);

        // 5. Arthur, en dernier pour être au-dessus de son lieu
        this.visuelArthur = this.creerVisuelArthur(X_CENTRE, Y_CENTRE);
        this.elementsVue.push(this.visuelArthur);
    }

    // Un voisin : son visuel, rendu cliquable
    private creerLieuCliquable(lieu: Lieu, x: number, y: number): void {
        const cercle = this.creerVisuelLieu(lieu, x, y);
        cercle.setInteractive({ useHandCursor: true });
        cercle.on("pointerover", () => cercle.setFillStyle(COULEUR_LIEU_SURVOL));
        cercle.on("pointerout", () => cercle.setFillStyle(COULEUR_LIEU));
        cercle.on("pointerdown", () => this.surClicLieu(lieu.id, cercle));
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
        this.elementsVue.push(ligne);
        return ligne;
    }

    // Un lieu : un cercle et son nom en dessous
    private creerVisuelLieu(lieu: Lieu, x: number, y: number): Phaser.GameObjects.Arc {
        const cercle = this.add.circle(x, y, RAYON_LIEU, COULEUR_LIEU);
        const nom = this.add.text(x, y + RAYON_LIEU + 6, lieu.nom, { fontSize: "18px", color: COULEUR_TEXTE });
        nom.setOrigin(0.5, 0);
        this.elementsVue.push(cercle, nom);
        return cercle;
    }

    // Arthur : un carré doré posé sur son lieu
    private creerVisuelArthur(x: number, y: number): Phaser.GameObjects.Rectangle {
        return this.add.rectangle(x, y, TAILLE_ARTHUR, TAILLE_ARTHUR, COULEUR_ARTHUR);
    }

    // Bouton Reset en bas à droite (C13)
    private creerBoutonReset(): Phaser.GameObjects.Rectangle {
        const bouton = this.add.rectangle(870, 680, 120, 40, COULEUR_BOUTON);
        this.add.text(870, 680, "Reset", { fontSize: "18px", color: COULEUR_TEXTE }).setOrigin(0.5);
        bouton.setInteractive({ useHandCursor: true });
        bouton.on("pointerover", () => bouton.setFillStyle(COULEUR_BOUTON_SURVOL));
        bouton.on("pointerout", () => bouton.setFillStyle(COULEUR_BOUTON));
        bouton.on("pointerdown", () => this.surClicReset());
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
