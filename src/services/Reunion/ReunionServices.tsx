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
    type: number;
    participantsObligatoires: string[];  // seulement les emails
    participantsFacultatifs: string[]; 
    userId: string;
  };

export type SaveReunionResponse = {
    id: any;
    reunion: Reunion;
    outlookUrl: string;
    teamsMeetingLink: string;
    teamsMeetingId: string;
    teamsSecretCode: string;
};

export interface MonthlyReunionTime {
  month: string; // Format "YYYY-MM"
  totalHours: number;
}

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
        if (res.data.reunion && res.data.reunion.id) {
            await autoConfirmCreatorPresence(res.data.reunion.id);
        }
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

export const updateReunionService = async (id: string, payload: SaveReunionPayload): Promise<SaveReunionResponse> => {
    try {
        console.log("Payload de mise à jour envoyé au serveur:", JSON.stringify(payload, null, 2));
        const token = localStorage.getItem("_au_pr"); 

        const res = await axios.put(`${endPoint}/api/reunion/${id}`, payload, {
            headers: {
                "Authorization": `Bearer ${token}`,
                'Content-type': 'application/json'
            }
        });

        console.log("Réponse de mise à jour:", res.data);
        return res.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Erreur détaillée lors de la mise à jour:", error.response?.data);
        }
        throw error;
    }
};

export const getReunionByIdService = async (id: string): Promise<Reunion> => {
    try {
        const token = localStorage.getItem("_au_pr");
        const response = await axios.get(`${endPoint}/api/reunion/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json"
            }
        });
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la récupération de la réunion:", error);
        throw error;
    }
};

export const buildOutlookUrl = (reunion: Reunion): string => {
    if (reunion.outlookEventId) {
        return reunion.outlookEventId;
    }
    
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

  return time; 
}

const startTime = `${dateDebut}T${ensureTimeWithTimezone( heureDebut)}`;
const endTime   = `${dateFin}T${ensureTimeWithTimezone( heureFin)}`;
    
    let url = `https://outlook.office.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent`;
        url += `&startdt=${encodeURIComponent(startTime)}`;
        url += `&enddt=${encodeURIComponent(endTime)}`;
        url += `&subject=${encodeURIComponent(titre)}`;
        url += `&location=${encodeURIComponent(emplacement || "")}`;
        url += `&body=${encodeURIComponent(description || "")}`
        
    
    // Extraire les emails des participants
    const getEmails = (participants: any[]) => {
        return participants
        .filter(p => p && (p.email || (typeof p === 'string' && p.includes('@'))))
        .map(p => typeof p === 'string' ? p : p.email)
        .filter((email): email is string => email !== undefined && email !== null);
    };

    const requiredEmails = getEmails(participantsObligatoires);
    const optionalEmails = getEmails(participantsFacultatifs);
    
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

export const buildTeamsUrl = (reunion: Reunion): string => {
    if (reunion.teamsMeetingLink) {
        return reunion.teamsMeetingLink;
    }
     const {
        titre,
        description,
        dateDebut,
        dateFin,
        heureDebut,
        heureFin,
    } = reunion;

    function ensureTimeWithTimezone(time: string): string {
        if (time.match(/^\d{2}:\d{2}(:\d{2})?(Z|[+-]\d{2}:\d{2})$/)) {
            return time;
        }
        if (time.match(/^\d{2}:\d{2}$/)) {
            return `${time}:00Z`;
        }
        return time;
    }

    const startTime = `${dateDebut}T${ensureTimeWithTimezone(heureDebut)}`;
    const endTime = `${dateFin}T${ensureTimeWithTimezone(heureFin)}`;

    let url = `https://teams.microsoft.com/l/meeting/new?subject=${encodeURIComponent(titre)}`;
        url += `&startDate=${encodeURIComponent(startTime)}`;
        url += `&endDate=${encodeURIComponent(endTime)}`;
        url += `&content=${encodeURIComponent(description || "")}`;
    return url;
};

export const listAllReunion = async (): Promise<Reunion[]> => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${endPoint}/api/Reunion/list`, {
            
            headers: {
                "Accept": "application/json",
                Authorization: `Bearer ${token}`
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
export const getMyReunions = async (userId: string): Promise<Reunion[]> => {
    try {
      const token = localStorage.getItem("_au_pr");
      if (!token) throw new Error("Utilisateur non connecté");

      const response = await axios.get(`${endPoint}/api/reunion/my-reunions/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json"
        }
      });
  
      return response.data as Reunion[];
    } catch (error) {
      console.error("Erreur lors de la récupération des réunions :", error);
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

        // const token = localStorage.getItem("_au_pr");
        // if (!token) throw new Error("Token d'authentification manquant");

        // await axios.delete(`${endPoint}/api/reunion/${id}`, {
        //     headers: {
        //         "Authorization": `Bearer ${token}`
        //     }
        // });
        
        // console.log("Réunion supprimée avec succès");
    } catch (error) {
        console.error(`Erroro lors de la suppression de la réunion: ${error}`);
        throw error;
    }
};

export const formatTeamsInfo = (reunion: Reunion): string => {
    if (reunion.teamsMeetingId && reunion.teamsSecretCode) {
        return `Microsoft Teams Besoin d'aide ?\n\n` +
               `Rejoignez la réunion maintenant\n\n` +
               `Numéro de réunion: ${reunion.teamsMeetingId}\n` +
               `Code secret: ${reunion.teamsSecretCode}\n\n` +
               `Lien direct: ${reunion.teamsMeetingLink || 'Non disponible'}`;
    }
    return "Informations de réunion Teams non disponibles";
};

export const copyTeamsInfoToClipboard = async (reunion: Reunion): Promise<boolean> => {
    try {
        const teamsInfo = formatTeamsInfo(reunion);
        await navigator.clipboard.writeText(teamsInfo);
        return true;
    } catch (error) {
        console.error("Erreur lors de la copie des informations Teams:", error);
        return false;
    }
};

export const openOutlookCalendar = (reunion: Reunion): void => {
    const outlookUrl = buildOutlookUrl(reunion);
    window.open(outlookUrl, '_blank');
};

export const openTeamsMeeting = (reunion: Reunion): void => {
    const teamsUrl = buildTeamsUrl(reunion);
    window.open(teamsUrl, '_blank');
};

export const exportReunionInfo = (reunion: Reunion): string => {
    return `RÉUNION: ${reunion.titre}\n` +
           `Date: ${reunion.dateDebut} ${reunion.heureDebut} - ${reunion.dateFin} ${reunion.heureFin}\n` +
           `Lieu: ${reunion.emplacement || 'Non spécifié'}\n` +
           `Description: ${reunion.description || 'Aucune description'}\n\n` +
           `${formatTeamsInfo(reunion)}\n\n` +
           `Lien Outlook: ${buildOutlookUrl(reunion)}`;
};

export const hasTeamsInfo = (reunion: Reunion): boolean => {
    return !!(reunion.teamsMeetingId && reunion.teamsSecretCode);
};

export const hasOutlookInfo = (reunion: Reunion): boolean => {
    return !!reunion.outlookEventId;
};


// Récupérer tous les événements Outlook via Graph API
export const getOutlookEvents = async (): Promise<any[]> => {
  try {
    const token = localStorage.getItem("_au_pr");
    if (!token) throw new Error("Utilisateur non connecté");

    const response = await axios.get(`${endPoint}/api/reunion/outlook-events`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    console.log("Événements Outlook récupérés:", response.data);
    return response.data.events; // ⚠️ ton contrôleur renvoie { message, events, count }
  } catch (error: any) {
    if (error.response) {
      console.error("Erreur côté serveur:", error.response.data);
    } else if (error.request) {
      console.error("Aucune réponse reçue:", error.request);
    } else {
      console.error("Erreur Axios:", error.message);
    }
    throw error;
  }
};

// Ajouter cette fonction pour confirmer automatiquement la présence du créateur
export const autoConfirmCreatorPresence = async (reunionId: string): Promise<boolean> => {
    try {
        const token = localStorage.getItem("_au_pr");
        const response = await axios.post(
            `${endPoint}/api/reunion/${reunionId}/confirm-presence`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-type': 'application/json'
                }
            }
        );
        return true;
    } catch (error) {
        console.error("Erreur lors de la confirmation automatique:", error);
        return false;
    }
};


// Fonction pour calculer le temps total de réunion par mois
export const getMonthlyReunionTime = async (userIds: string[]): Promise<MonthlyReunionTime[]> => {
  try {
    const token = localStorage.getItem("_au_pr");
    if (!token) throw new Error("Utilisateur non connecté");

    // Récupérer les réunions pour les utilisateurs spécifiés
    const allReunions: Reunion[] = [];
    
    for (const userId of userIds) {
      try {
        const response = await axios.get(`${endPoint}/api/reunion/my-reunions/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json"
          }
        });
        allReunions.push(...response.data);
      } catch (error) {
        console.error(`Erreur pour l'utilisateur ${userId}:`, error);
      }
    }

    // Calculer le temps total par mois
    const monthlyData: { [key: string]: number } = {};

    allReunions.forEach(reunion => {
      try {
        // Convertir les dates et heures en objets Date
        const startDateTime = new Date(`${reunion.dateDebut}T${reunion.heureDebut}`);
        const endDateTime = new Date(`${reunion.dateFin}T${reunion.heureFin}`);
        
        // Calculer la durée en heures
        const durationMs = endDateTime.getTime() - startDateTime.getTime();
        const durationHours = durationMs / (1000 * 60 * 60);
        
        // Extraire le mois (format YYYY-MM)
        const month = reunion.dateDebut.substring(0, 7);
        
        // Ajouter la durée au mois correspondant
        if (monthlyData[month]) {
          monthlyData[month] += durationHours;
        } else {
          monthlyData[month] = durationHours;
        }
      } catch (error) {
        console.error("Erreur de traitement pour la réunion:", reunion, error);
      }
    });

    // Convertir en tableau et trier par mois
    return Object.keys(monthlyData)
      .sort()
      .map(month => ({
        month,
        totalHours: parseFloat(monthlyData[month].toFixed(2)) // Arrondir à 2 décimales
      }));
  } catch (error) {
    console.error("Erreur lors du calcul du temps de réunion:", error);
    throw error;
  }
};
