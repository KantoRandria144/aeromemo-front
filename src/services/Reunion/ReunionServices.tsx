import axios from "axios";
import { CreateReunion, Reunion, UpdateReunion } from "../../types/reunion";

const endPoint = import.meta.env.VITE_API_ENDPOINT;

export type SaveReunionPayload = {
    titre: string;
    description: string;
    dateDebut: string;          
    dateFin: string;            
    heureDebut: string;         
    heureFin: string;           
    emplacement: string;
    etat: number;               
    participantsObligatoires: string[];  
    participantsFacultatifs: string[];   
    participantsObligatoiresEmails: string[];
    participantsFacultatifsEmails: string[];
  };

export type SaveReunionResponse = {
    id: any;
    reunion: Reunion;
    outlookUrl: string;
};

export const saveReunion = async (payload: SaveReunionPayload): Promise<SaveReunionResponse> => {
    try {
      const res = await axios.post(`${endPoint}/api/reunion/save`, payload);

       if (res.data.reunion) {
        const reunion = res.data.reunion;
        
        // Ajouter les emails si disponibles dans le payload
        if (payload.participantsObligatoiresEmails) {
          reunion.participantsObligatoiresEmails = payload.participantsObligatoiresEmails;
        }
        
        if (payload.participantsFacultatifsEmails) {
          reunion.participantsFacultatifsEmails = payload.participantsFacultatifsEmails;
        }
      }

      return res.data;
    } catch (error) {
      console.error("Erreur lors de l’enregistrement de la réunion:", error);
      
      throw error;
    }
  };

export const buildOutlookUrl = (reunion: Reunion): string => {
    
    const {
    titre,
    description,
    dateDebut,
    dateFin,
    heureDebut,
    heureFin,
    emplacement,
    participantsObligatoires = [],
    participantsFacultatifs = []
  } = reunion;
   
 const startTime = `${dateDebut}T${heureDebut}`;
    const endTime = `${dateFin}T${heureFin}`;
    //const formatDate = (date: Date) => date.toISOString().replace(/-|:|\.\d+/g, '');
    
    // return `https://outlook.office.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent` +
    //     `&startdt=${encodeURIComponent(startTime)}` +
    //     `&enddt=${encodeURIComponent(endTime)}` +
    //     `&subject=${encodeURIComponent(reunion.titre)}` +
    //     `&location=${encodeURIComponent(reunion.emplacement || "")}` +
    //     `&body=${encodeURIComponent(reunion.description || "")}`;
    
    let url = `https://outlook.office.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(titre)}`;
        url += `&body=${encodeURIComponent(description || "")}`;
        url += `&location=${encodeURIComponent(emplacement || "")}`;
        url += `&startdt=${encodeURIComponent(startTime)}`;
        url += `&enddt=${encodeURIComponent(endTime)}`;
    
    // Extraire les emails des participants
    const getEmails = (participants: any[]) => {
        return participants
        .filter(p => p && (p.email || (typeof p === 'string' && p.includes('@'))))
        .map(p => typeof p === 'string' ? p : p.email);
    };

    const requiredEmails = getEmails(participantsObligatoires);
    const optionalEmails = getEmails(participantsFacultatifs);
    const allEmails = [...requiredEmails, ...optionalEmails];

    
    // Ajouter les participants à l'URL
    if (allEmails.length > 0) {
        // Outlook limite généralement à ~20 participants dans l'URL
        const emailsToInclude = allEmails.slice(0, 20).join(';');
        url += `&attendees=${encodeURIComponent(emailsToInclude)}`;
    }

    return url;
};

export const listAllReunion = async (): Promise<Reunion[]> => {
    try {
        const response = await axios.get(`${endPoint}/api/Reunion/list`, {
            headers: {
                "Accept": "application/json"
            }
        });
        console.log("Réponse brute de l'API:", response);
        return response.data;
    } catch (error: any) {
        if (error.response) {
            console.error("Erreur côté serveur:", error.response.data);
        } else if (error.request) {
            console.error("Aucune réponse reçue:", error.request);
        } else {
            console.error("Erreur de configuration Axios:", error.message);
        }
        throw error;
    }
};

  
//  créer une réunion
export const createReunion = async (reunionData: CreateReunion): Promise<Reunion> => {
    try {
        const response = await axios.post(`${endPoint}/api/Reunion`, reunionData);
        console.log(`Réunion créée avec succès : ${response.data}`);
        return response.data;
    } catch (error) {
        console.error(`Erreur lors de la création de la réunion: ${error}`);
        throw error;
    }
};

//  récupérer toutes les réunions
export const getAllReunions = async (): Promise<Reunion[]> => {
    try {
        const response = await axios.get(`${endPoint}/api/Reunion`);
        return response.data;
    } catch (error) {
        console.error(`Erreur lors de la récupération des réunions: ${error}`);
        throw error;
    }
};

//  recuperer reunion par ID 
export const getReunionById = async (id: string): Promise<Reunion[]> => {
    try {
        const response = await axios.get(`${endPoint}/api/Reunion/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Erreur lors de la recuperation de la reunion avec l'ID: ${id}`);
        throw error;
    }
};

// modifier une reunion
export const updateReunion = async (id: string, reunionData: UpdateReunion): Promise<Reunion> => {
    try {
        const response = await axios.put(`${endPoint}/api/Reunion/${id}`, reunionData);
        console.log(`Reunion mise à jour avec succès: ${response.data}`);
        return response.data;
    } catch(error) {
        console.error(`Erreur lors de la mise à jour de la réunion: ${error}`);
        throw error;
    }
};

// supprimer une reunion
export const deletereunion = async (id: string): Promise<Reunion> => {
    try {
        const response = await axios.delete(`${endPoint}/api/Reunion/${id}`);
        console.log(`Reunion supprimée avec succès`);
        return response.data;
    } catch (error) {
        console.error(`Erroro lors de la suppression de la réunion: ${error}`);
        throw error;
    }
};