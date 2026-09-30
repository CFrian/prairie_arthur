// Classe abstraite commune aux deux phases : position, compteur, optimal, reset et règle de victoire.
// Propriétaire : C. Déjà complète à l'étape 0, car les deux quêtes et les deux scènes en dépendent.

export abstract class Quete {
    position: string;
    compteur = 0;
    readonly optimal: number;   // calculé par la sous-classe à partir des données (A1)
    private readonly depart: string;

    constructor(depart: string, optimal: number) {
        this.depart = depart;
        this.position = depart;
        this.optimal = optimal;
    }

    // C13, L10, et à la fermeture d'un message d'échec (C12, L9) : retour au départ, compteur à 0
    reset(): void {
        this.position = this.depart;
        this.compteur = 0;
    }

    // Règle commune aux deux phases (C11, L8)
    verdictArrivee(): boolean {
        return this.compteur === this.optimal;
    }
}
