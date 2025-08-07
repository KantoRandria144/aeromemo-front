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
    id: string;
    reunionid: string;
    userid: string;
    type: "Obligatoire" | "Facultatif";
    state: "En attente" | "Acceptée" | "Réfusé";
}

export interface CreateReunionResponse {
    message: string;
    webLink?: string;
}