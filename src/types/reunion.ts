export interface CreateReunion {
    titre: string;
    description: string;
    dateDebut: string;
    dateFin: string;
    heureDebut: string;
    heureFin: string;
    emplacement: string;
    etat: number; 
    type: number; 
    participantsObligatoires?:string[];
    participantsFacultatifs?:string[];
    participants?: ParticipantDTO[];
    userId?: string;
}

export type ParticipantDTO = {
  id: string;
  reunionId: string;
  userId: string;
  userEmail: string;
  userName: string; // nom complet de l'utilisateur
  type: string;
  state: string;
  checkIn:string;
};

export interface UpdateReunion {
    titre:string;
    description:string;
    dateDebut:string;
    dateFin:string;
    heureDebut:string;
    heureFin:string;
    etat: number;
    type: number;
}

export interface Reunion {
    outlookUrl(outlookUrl: any, arg1: string): void;
    qrCodeGenerated: string | null;
    id:string;
    titre: string;
    description: string;
    dateDebut: string;
    dateFin:string;
    heureDebut:string;
    heureFin:string;
    emplacement?:string;
    etat: number; 
    type: number; 
    participants?: ParticipantDTO[];
    participantsObligatoires: string[];  
    participantsFacultatifs: string[]; 
    teamsMeetingLink?: string;
    teamsMeetingId?: string;
    teamsSecretCode?: string;
    outlookEventId?:string;
    userId?: string;
}
export enum EtatReunion {
    Planifie="Planifié",
    EnCours="En Cours",
    Termine="Terminé",
    Annule="Annulé",
}
export enum TypeReunion {
    Transverse = 1,
    Projet = 2,
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

export interface SaveReunionResponse {
  reunion: Reunion;
  outlookUrl: string;
}