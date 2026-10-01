// Affichage des textes : popup de distance, messages de réussite et d'échec, panneaux fixes.
// Propriétaire : C (tâche C1). Signatures fixées à l'étape 0 : SceneCarte et SceneLabyrinthe les utilisent.
import * as Phaser from "phaser";

// Couleurs et tailles du rendu V0
const COULEUR_FOND_BOITE = 0x2b2b2b;
const COULEUR_BORD_BOITE = 0xd9c9a3;
const COULEUR_VOILE = 0x000000;
const OPACITE_VOILE = 0.6;
const COULEUR_TEXTE = "#ffffff";
const COULEUR_AIDE = "#bbbbbb";
const MARGE = 16;

// Au-dessus de tous les autres éléments de la scène
const PROFONDEUR = 1000;

// Délai avant qu'un message accepte d'être fermé (voir afficherMessage)
const DELAI_AVANT_FERMETURE_MS = 300;

export class BoiteMessage {
    private scene: Phaser.Scene;

    // Popup de distance en cours (un seul à la fois)
    private popup: Phaser.GameObjects.Container | null = null;

    // Message en cours : ses éléments graphiques, et la fonction qui le ferme
    private elementsMessage: Phaser.GameObjects.GameObject[] = [];
    private fermerMessage: (() => void) | null = null;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
    }

    // ---------------------------------------------------------------
    // C5 : popup de distance
    // ---------------------------------------------------------------

    // Affiche le texte en haut de l'écran, puis le retire seul après dureeMs. Aucune interaction.
    afficherPopup(texte: string, dureeMs: number): void {
        // Un nouveau popup remplace l'ancien
        if (this.popup !== null) {
            this.popup.destroy();
        }

        const centreX = this.scene.scale.width / 2;
        const libelle = this.scene.add.text(0, 0, texte, { fontSize: "22px", color: COULEUR_TEXTE });
        libelle.setOrigin(0.5);
        const fond = this.creerBoite(libelle.width + 2 * MARGE, libelle.height + MARGE);

        this.popup = this.scene.add.container(centreX, 50, [fond, libelle]);
        this.popup.setDepth(PROFONDEUR);

        // Disparition automatique à la fin de la durée (C5 : à la fin des 3 s)
        const popupAffiche = this.popup;
        this.scene.time.delayedCall(dureeMs, () => {
            popupAffiche.destroy();
            if (this.popup === popupAffiche) {
                this.popup = null;
            }
        });
    }

    // ---------------------------------------------------------------
    // C14, L11 : message fermé au clic ou à une touche
    // ---------------------------------------------------------------

    // Affiche un message au centre de l'écran, sur un voile sombre.
    // Il reste affiché jusqu'à un clic ou une touche (aucune minuterie), puis appelle aLaFermeture.
    afficherMessage(texte: string, aLaFermeture: () => void): void {
        // Un seul message à la fois
        if (this.estOuvert()) {
            return;
        }

        const largeur = this.scene.scale.width;
        const hauteur = this.scene.scale.height;

        // 1. Voile sur tout l'écran. Il est « interactif » : comme il est au-dessus de tout,
        //    il capte les clics, qui n'atteignent donc plus les lieux ni le bouton Reset (C14).
        const voile = this.scene.add.rectangle(largeur / 2, hauteur / 2, largeur, hauteur, COULEUR_VOILE, OPACITE_VOILE);
        voile.setDepth(PROFONDEUR);
        voile.setInteractive();

        // 2. Le texte du message et une ligne d'aide, empilés et centrés dans une boîte
        const ESPACE = 14; // entre le texte et la ligne d'aide
        const libelle = this.scene.add.text(0, 0, texte, {
            fontSize: "22px",
            color: COULEUR_TEXTE,
            align: "center",
            wordWrap: { width: 560 }
        });
        libelle.setOrigin(0.5, 0);
        const aide = this.scene.add.text(0, 0, "Clique ou appuie sur une touche pour continuer", {
            fontSize: "14px",
            color: COULEUR_AIDE
        });
        aide.setOrigin(0.5, 0);
        // Hauteur totale du contenu, puis placement à partir du haut pour un centrage exact
        const hauteurContenu = libelle.height + ESPACE + aide.height;
        libelle.setY(-hauteurContenu / 2);
        aide.setY(-hauteurContenu / 2 + libelle.height + ESPACE);
        const fond = this.creerBoite(Math.max(libelle.width, aide.width) + 3 * MARGE, hauteurContenu + 2 * MARGE);
        const boite = this.scene.add.container(largeur / 2, hauteur / 2, [fond, libelle, aide]);
        boite.setDepth(PROFONDEUR + 1);

        this.elementsMessage = [voile, boite];

        // 3. Fermeture. Les 300 premières ms sont ignorées, et les répétitions automatiques
        //    d'une touche aussi : sinon, une flèche maintenue (L2) fermerait le message
        //    à l'instant même où il apparaît.
        const ouvertA = this.scene.time.now;
        const clavier = this.scene.input.keyboard;

        const surTouche = (evenement: KeyboardEvent): void => {
            if (evenement.repeat) {
                return;
            }
            tenterFermeture();
        };

        const tenterFermeture = (): void => {
            if (this.scene.time.now - ouvertA < DELAI_AVANT_FERMETURE_MS) {
                return;
            }
            // Nettoyage : on retire les écouteurs et les éléments graphiques
            voile.off("pointerdown", tenterFermeture);
            if (clavier !== null) {
                clavier.off("keydown", surTouche);
            }
            for (const element of this.elementsMessage) {
                element.destroy();
            }
            this.elementsMessage = [];
            this.fermerMessage = null;
            // Le message est fermé AVANT l'appel : la scène peut donc en ouvrir un autre
            aLaFermeture();
        };

        voile.on("pointerdown", tenterFermeture);
        if (clavier !== null) {
            clavier.on("keydown", surTouche);
        }
        this.fermerMessage = tenterFermeture;
    }

    // P5 : vrai tant qu'un message est affiché. La scène bloque alors les déplacements.
    estOuvert(): boolean {
        return this.fermerMessage !== null;
    }

    // ---------------------------------------------------------------
    // Section 10 : panneaux
    // ---------------------------------------------------------------

    // Panneau de texte fixe, toujours visible, sans interaction.
    // (x, y) = coin supérieur gauche du panneau.
    afficherPanneau(texte: string, x: number, y: number): void {
        const libelle = this.scene.add.text(MARGE, MARGE / 2, texte, {
            fontSize: "16px",
            color: COULEUR_TEXTE,
            wordWrap: { width: 300 }
        });
        const fond = this.creerBoite(libelle.width + 2 * MARGE, libelle.height + MARGE);
        fond.setOrigin(0, 0);
        const panneau = this.scene.add.container(x, y, [fond, libelle]);
        panneau.setDepth(PROFONDEUR - 1); // sous les messages et les popups
    }

    // ---------------------------------------------------------------
    // Outil commun : un rectangle sombre bordé, centré par défaut
    // ---------------------------------------------------------------
    private creerBoite(largeur: number, hauteur: number): Phaser.GameObjects.Rectangle {
        const boite = this.scene.add.rectangle(0, 0, largeur, hauteur, COULEUR_FOND_BOITE);
        boite.setStrokeStyle(2, COULEUR_BORD_BOITE);
        return boite;
    }
}
