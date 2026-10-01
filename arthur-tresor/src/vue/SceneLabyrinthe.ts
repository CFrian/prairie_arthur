// Scène du labyrinthe : affiche la grille, transmet les flèches à QueteLabyrinthe, ne décide rien (P2).
// Propriétaire : B (tâche B3). Clé de scène fixée à l'étape 0 : "SceneLabyrinthe".
import * as Phaser from "phaser";
import { QueteLabyrinthe } from "../modele/QueteLabyrinthe";
import type { Direction } from "../modele/resultats";
import { lignes } from "../modele/donneesLabyrinthe";
import { BoiteMessage } from "./BoiteMessage";

// Grille : cases de 30 px (amendement « Rendu V0 »), soit 660 x 630, à gauche de l'écran,
// sous le panneau d'entrée
const TAILLE_CASE = 30;
const X_GRILLE = 20;
const Y_GRILLE = 76;

// Colonne d'informations, à droite de la grille
const X_INFOS = 710;

// L2 : une case toutes les 0,15 s quand une flèche reste enfoncée
const INTERVALLE_REPETITION_MS = 150;

// Petit délai pour voir Arthur sur le trésor avant l'écran de victoire
const DELAI_VICTOIRE_MS = 400;

// Couleurs du rendu V0 (formes géométriques uniquement)
const COULEUR_MUR = 0x2e2e2e;
const COULEUR_SOL = 0xbfb39a;
const COULEUR_TRESOR = 0x8b4513;
const COULEUR_BORD_TRESOR = 0xe0b020;
const COULEUR_ARTHUR = 0xe0b020;
const COULEUR_BORD_ARTHUR = 0x3a2a00;
const COULEUR_BOUTON = 0x3a3a3a;
const COULEUR_BOUTON_SURVOL = 0x555555;
const COULEUR_TEXTE = "#ffffff";

// Textes affichés au joueur (section 10). Aucun ne mentionne l'optimal (L6).
const TEXTE_PANNEAU = "Seul le chemin le plus court ouvre le trésor.";

// Les 4 directions (L2 : sans diagonale)
const DIRECTIONS: Direction[] = ["haut", "bas", "gauche", "droite"];

export class SceneLabyrinthe extends Phaser.Scene {
    // Modèle et affichage des textes. Créés dans create() : une quête neuve à chaque
    // lancement de la scène, donc « Rejouer » remet tout à 0 (V2).
    private quete!: QueteLabyrinthe;
    private boite!: BoiteMessage;

    private visuelArthur!: Phaser.GameObjects.Rectangle;
    private texteCompteur!: Phaser.GameObjects.Text;

    // Une touche du clavier par direction
    private touches: { [direction: string]: Phaser.Input.Keyboard.Key } = {};

    // L2 : direction maintenue enfoncée et moment du prochain pas automatique
    private directionTenue: Direction | null = null;
    private prochainPasA = 0;

    // L7 : vrai dès qu'Arthur atteint le trésor, jusqu'au retour à l'entrée
    private verrouille = false;

    constructor() {
        super("SceneLabyrinthe");
    }

    create(): void {
        // A1 : la quête calcule l'optimal par BFS dès sa création
        this.quete = new QueteLabyrinthe();
        this.boite = new BoiteMessage(this);
        this.directionTenue = null;
        this.verrouille = false;

        // 1. La grille, puis Arthur sur l'entrée (L1)
        this.dessinerGrille();
        this.visuelArthur = this.creerVisuelArthur(0, 0);
        this.placerArthur();

        // 2. Panneau d'entrée au-dessus de la grille ; à droite, compteur de pas (L5) et bouton Reset (L10)
        this.boite.afficherPanneau(TEXTE_PANNEAU, X_GRILLE, 10);
        this.texteCompteur = this.add.text(X_INFOS, Y_GRILLE + 20, "", { fontSize: "26px", color: COULEUR_TEXTE });
        this.mettreAJourCompteur();
        this.creerBoutonReset();

        // 3. Les flèches du clavier
        const clavier = this.input.keyboard;
        if (clavier === null) {
            throw new Error("Clavier indisponible : le labyrinthe se joue aux flèches (L2)");
        }
        const fleches = clavier.createCursorKeys();
        this.touches = {
            haut: fleches.up,
            bas: fleches.down,
            gauche: fleches.left,
            droite: fleches.right
        };
    }

    // ---------------------------------------------------------------
    // L2 : déplacement aux flèches, une case par pression, puis une toutes les 0,15 s
    // ---------------------------------------------------------------

    update(temps: number): void {
        // 1. On relève les nouvelles pressions À CHAQUE image, même quand le jeu est bloqué :
        //    sinon une pression faite pendant un message serait jouée à sa fermeture.
        let nouvelleDirection: Direction | null = null;
        for (const direction of DIRECTIONS) {
            if (Phaser.Input.Keyboard.JustDown(this.touches[direction])) {
                nouvelleDirection = direction;
            }
        }

        // 2. Bloqué : trésor atteint (L7) ou message ouvert (L11)
        if (!this.peutJouer()) {
            this.directionTenue = null;
            return;
        }

        // 3. Nouvelle pression : un pas tout de suite
        if (nouvelleDirection !== null) {
            this.directionTenue = nouvelleDirection;
            this.prochainPasA = temps + INTERVALLE_REPETITION_MS;
            this.faireUnPas(nouvelleDirection);
            return;
        }

        // 4. Touche toujours enfoncée : un pas toutes les 0,15 s
        if (this.directionTenue !== null) {
            if (!this.touches[this.directionTenue].isDown) {
                this.directionTenue = null;
            } else if (temps >= this.prochainPasA) {
                this.prochainPasA = temps + INTERVALLE_REPETITION_MS;
                this.faireUnPas(this.directionTenue);
            }
        }
    }

    // Vrai si le joueur a le droit de bouger
    private peutJouer(): boolean {
        return !this.verrouille && !this.boite.estOuvert();
    }

    // La quête décide (P2) ; la scène affiche le résultat
    private faireUnPas(direction: Direction): void {
        const resultat = this.quete.pas(direction);

        switch (resultat.type) {
            case "mur":
                // L4 : Arthur ne bouge pas, le compteur non plus
                break;
            case "deplace":
                // L3 : un pas de plus
                this.placerArthur();
                this.mettreAJourCompteur();
                break;
            case "tresorOuvert":
                // L7, L8 : commandes bloquées, puis écran de victoire avec les pas du joueur (V1)
                this.verrouiller();
                this.time.delayedCall(DELAI_VICTOIRE_MS, () => {
                    this.scene.start("SceneVictoire", { pas: resultat.pas });
                });
                break;
            case "tresorRefuse":
                // L7, L9 : commandes bloquées, message avec les pas du joueur (jamais l'optimal),
                // puis retour à l'entrée, compteur à 0
                this.verrouiller();
                this.boite.afficherMessage(
                    "Tu as fait " + resultat.pas + " pas.\nLe trésor reste fermé : ce n'est pas le chemin le plus court.",
                    () => this.recommencer()
                );
                break;
        }
    }

    // L7 : Arthur est sur le trésor, plus aucun pas possible
    private verrouiller(): void {
        this.verrouille = true;
        this.directionTenue = null;
        this.placerArthur();
        this.mettreAJourCompteur();
    }

    // L9, L10 : retour à l'entrée, compteur à 0
    private recommencer(): void {
        this.quete.reset();
        this.verrouille = false;
        this.directionTenue = null;
        this.placerArthur();
        this.mettreAJourCompteur();
    }

    // L10 : Reset, disponible hors message et hors verdict
    private surClicReset(): void {
        if (!this.peutJouer()) {
            return;
        }
        this.recommencer();
    }

    // ---------------------------------------------------------------
    // Affichage
    // ---------------------------------------------------------------

    // Une case par caractère de la grille : # = mur, T = trésor, le reste = sol
    private dessinerGrille(): void {
        for (let ligne = 0; ligne < lignes.length; ligne++) {
            for (let colonne = 0; colonne < lignes[ligne].length; colonne++) {
                const x = this.xCase(colonne);
                const y = this.yCase(ligne);
                const caractere = lignes[ligne][colonne];
                if (caractere === "#") {
                    this.creerVisuelMur(x, y);
                } else {
                    this.creerVisuelSol(x, y);
                    if (caractere === "T") {
                        this.creerVisuelTresor(x, y);
                    }
                }
            }
        }
    }

    // Place Arthur au centre de la case indiquée par la quête ("ligne,colonne")
    private placerArthur(): void {
        const morceaux = this.quete.position.split(",");
        const ligne = Number(morceaux[0]);
        const colonne = Number(morceaux[1]);
        this.visuelArthur.setPosition(this.xCase(colonne), this.yCase(ligne));
    }

    // L5 : compteur de pas toujours visible
    private mettreAJourCompteur(): void {
        this.texteCompteur.setText("Pas : " + this.quete.compteur);
    }

    // Centre d'une case à l'écran
    private xCase(colonne: number): number {
        return X_GRILLE + colonne * TAILLE_CASE + TAILLE_CASE / 2;
    }

    private yCase(ligne: number): number {
        return Y_GRILLE + ligne * TAILLE_CASE + TAILLE_CASE / 2;
    }

    // ---------------------------------------------------------------
    // Préparation V1 : un élément visuel = une seule méthode dédiée.
    // Pour passer aux sprites, seule la ligne de création change.
    // ---------------------------------------------------------------

    private creerVisuelMur(x: number, y: number): Phaser.GameObjects.Rectangle {
        return this.add.rectangle(x, y, TAILLE_CASE, TAILLE_CASE, COULEUR_MUR);
    }

    private creerVisuelSol(x: number, y: number): Phaser.GameObjects.Rectangle {
        return this.add.rectangle(x, y, TAILLE_CASE, TAILLE_CASE, COULEUR_SOL);
    }

    private creerVisuelTresor(x: number, y: number): Phaser.GameObjects.Rectangle {
        const tresor = this.add.rectangle(x, y, 22, 16, COULEUR_TRESOR);
        tresor.setStrokeStyle(2, COULEUR_BORD_TRESOR);
        return tresor;
    }

    private creerVisuelArthur(x: number, y: number): Phaser.GameObjects.Rectangle {
        const arthur = this.add.rectangle(x, y, 18, 18, COULEUR_ARTHUR);
        arthur.setStrokeStyle(2, COULEUR_BORD_ARTHUR);
        return arthur;
    }

    // Bouton Reset en bas à droite (L10), au même endroit que sur la carte
    private creerBoutonReset(): Phaser.GameObjects.Rectangle {
        const bouton = this.add.rectangle(870, 680, 120, 40, COULEUR_BOUTON);
        this.add.text(870, 680, "Reset", { fontSize: "18px", color: COULEUR_TEXTE }).setOrigin(0.5);
        bouton.setInteractive({ useHandCursor: true });
        bouton.on("pointerover", () => bouton.setFillStyle(COULEUR_BOUTON_SURVOL));
        bouton.on("pointerout", () => bouton.setFillStyle(COULEUR_BOUTON));
        bouton.on("pointerdown", () => this.surClicReset());
        return bouton;
    }
}
