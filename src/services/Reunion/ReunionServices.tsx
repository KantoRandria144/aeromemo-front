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
    participantsObligatoires: string[];  // seulement les emails
    participantsFacultatifs: string[]; 
    userid: string;
  };

export type SaveReunionResponse = {
    id: any;
    reunion: Reunion;
    outlookUrl: string;
};

export const saveReunion = async (payload: SaveReunionPayload): Promise<SaveReunionResponse> => {
    
    try {
        console.log("Payload envoyé au serveur:", JSON.stringify(payload,null,2));
        const token = localStorage.getItem("_au_pr"); 

        const res = await axios.post(`${endPoint}/api/reunion/save`,payload, {
            headers: {
                "Authorization": `Bearer ${token}`,
                'Content-type': 'application/json'
            }
        });

        console.log("Réponse au serveur:", res.data);
        return res.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Erreur détaillée:", error.response?.data);
            console.error("Status:", error.response?.status);
            console.error("Headers:", error.response?.headers);
        }
        throw error;
    }
    
    // try {
    //   const res = await axios.post(`${endPoint}/api/reunion/save`, payload);

    //   if(res.data.reunion) {
    //     return res.data.reunion;
    //   }

    // //    if (res.data.reunion) {
    // //     const reunion = res.data.reunion;
        
    // //     // Ajouter les emails si disponibles dans le payload
    // //     if (payload.participantsObligatoiresEmails) {
    // //       reunion.participantsObligatoiresEmails = payload.participantsObligatoiresEmails;
    // //     }
        
    // //     if (payload.participantsFacultatifsEmails) {
    // //       reunion.participantsFacultatifsEmails = payload.participantsFacultatifsEmails;
    // //     }
    // //   }

    //   return res.data;
    // } catch (error) {
    //   console.error("Erreur lors de l’enregistrement de la réunion:", error);
      
    //   throw error;
    // }
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
   
  // Fonction utilitaire pour forcer un format avec timezone
function ensureTimeWithTimezone(time: string): string {
  // Si déjà au format HH:mm:ssZ, on ne touche pas
  if (time.match(/^\d{2}:\d{2}(:\d{2})?(Z|[+-]\d{2}:\d{2})$/)) {
    return time;
  }

  // Si au format HH:mm → on ajoute secondes et UTC par défaut
  if (time.match(/^\d{2}:\d{2}$/)) {
    return `${time}:00Z`;
  }

  return time; // fallback si autre format
}

const startTime = `${dateDebut}T${ensureTimeWithTimezone( heureDebut)}`;
const endTime   = `${dateFin}T${ensureTimeWithTimezone( heureFin)}`;

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
    //const allEmails = [...requiredEmails, ...optionalEmails];

    
    // Ajouter les participants obligatoires (champ "to")
    if (requiredEmails.length > 0) {
        const emailsToInclude = requiredEmails.join(';');
        url += `&to=${encodeURIComponent(emailsToInclude)}`;
    }

    // Ajouter les participants facultatifs (champ "cc")
   
    if (optionalEmails.length > 0) {
        const emailsToInclude = optionalEmails.join(';');
         console.log("optionalEmails.length =", optionalEmails.length);
        url += `&cc=${encodeURIComponent(emailsToInclude)}`;
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

// Récupérer les réunions de l’utilisateur connecté
export const getMyReunions = async (): Promise<Reunion[]> => {
  try {
    const token = localStorage.getItem("_au_pr");

    const response = await axios.get(`${endPoint}/api/reunion/my-reunions`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json"
      }
    });

    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des réunions de l’utilisateur connecté:", error);
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