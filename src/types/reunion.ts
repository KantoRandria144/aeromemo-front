export interface CreateReunion {
    titre: string;
    description: string;
    dateDebut: string;
    dateFin: string;
    heureDebut: string;
    heureFin: string;
    emplacement: string;
    participantsObligatoires?:string[];
    participantsFacultatifs?:string[];
}

export interface UpdateReunion {
    titre:string;
    description:string;
    dateDebut:string;
    dateFin:string;
    heureDebut:string;
    heureFin:string;
    etat:EtatReunion;
}

export interface Reunion {
    id:string;
    titre: string;
    description: string;
    dateDebut: string;
    dateFin:string;
    heureDebut:string;
    heureFin:string;
    emplacement?:string;
    etat:EtatReunion;
    outlookEventId?:string;
}
export enum EtatReunion {
    Planifie="Planifié",
    EnCours="EnCours",
    Termine="Terminé",
    Annule="Annulé",
}

export interface Participant {
    id?: string;
    type: 'Interne' | 'Externe'; // Type original basé sur le domaine email
    role: 'Obligatoire' | 'Facultatif'; // Nouveau champ pour le rôle
    state: 'En attente' | 'Confirmé' | 'Refusé';
    userid: string;
    email: string;
    reunionid?: string;
}
export interface CreateReunionResponse {
    message: string;
    webLink?: string;
}

export interface IUserReunion {
    user?: any;
    userid: string | undefined;
    role?: string;
}