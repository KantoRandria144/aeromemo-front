import axios from "axios";
import { Participant, Reunion } from "../../types/reunion";

const endPoint = import.meta.env.VITE_API_ENDPOINT;
const endPoint_serveur = import.meta.env.VITE_API_ENDPOINT_SERVER;
// ✅ DTO pour créer un QR Code
export type CreateQRCodeDTO = {
  reunionid: string;
  tokens: string;
  etat: string;
};

// ✅ Structure du QR Code avec réunion liée
export type QRCodeWithReunion = {
  id: string;
  tokens: string;
  etat: string;
  reunion: Reunion; 
  participant: Participant;
};

// ✅ Générer un QR Code (renvoie un Blob image)
export const generateQRCode = async (
  createDto: CreateQRCodeDTO
): Promise<Blob> => {
  try {
    const token = localStorage.getItem("_au_pr");
    const url = `${endPoint}/api/QRCode/generate`;

    console.log("Tentative d'appel à:", url);
    console.log("Payload:", createDto);

    const response = await axios.post(url, createDto, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      responseType: "blob", // très important pour recevoir l’image
    });

    return response.data;
  } catch (error) {
    console.error("Erreur lors de la génération du QR Code:", error);
    throw error;
  }
};

// ✅ Scanner un QR Code (renvoie la liste des participants)
export const scanQRCodeForParticipants = async (
  qrCodeId: string
): Promise<{
  success: boolean;
  qrCodeId: string;
  reunionId: string;
  reunionTitre: string;
  participants: {
    id: string;
    name: string;
    email: string;
    type: string;
    state: string;
  }[];
  message: string;
}> => {
  try {
    const token = localStorage.getItem("_au_pr");
    const url = `${endPoint}/api/QRCode/scan/${qrCodeId}`;

    console.log("Scan URL:", url);

    const response = await axios.post(url, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Erreur lors du scan du QR code:", error);
    throw error;
  }
};

// ✅ Mettre à jour la présence d'un participant
export const updateParticipantPresence = async (
  qrCodeId: string,
  participantId: string,
  state: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const token = localStorage.getItem("_au_pr");
    const url = `${endPoint}/api/QRCode/update-presence/${qrCodeId}`;

    const response = await axios.post(
      url,
      {
        participantId,
        state
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la présence:", error);
    throw error;
  }
};
// ✅ Obtenir les infos d’un QR Code
export const getQRCodeInfo = async (
  qrCodeId: string
): Promise<QRCodeWithReunion> => {
  try {
    const token = localStorage.getItem("_au_pr");
    const url = `${endPoint}/api/QRCode/info/${qrCodeId}`;

    console.log("Info URL:", url);

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des infos du QR code:", error);
    throw error;
  }
};

export const scanCheckIn = async (
  userId: string,
  reunionId: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const url = `${endPoint_serveur}/api/participant/scan-checkin?userId=${userId}&reunionId=${reunionId}`;

    const response = await axios.get(url);

    return response.data;
  } catch (error: any) {
    console.error("❌ Erreur API scan-checkin:", error);

    // Gestion propre de l'erreur
    if (error.response) {
      return {
        success: false,
        message: error.response.data?.message || "Erreur serveur",
      };
    } else if (error.request) {
      return {
        success: false,
        message: "Aucune réponse du serveur. Vérifie la connexion réseau.",
      };
    } else {
      return {
        success: false,
        message: error.message || "Erreur inconnue",
      };
    }
  }
};

/**
 * 🔹 Génère l'URL de check-in à inclure dans le QR code
 * @param userId ID utilisateur
 * @param reunionId ID réunion
 * @returns {string} URL complète
 */
export const generateCheckInUrl = (userId: string, reunionId: string): string => {
  return `${endPoint_serveur}/api/participant/scan-checkin?userId=${userId}&reunionId=${reunionId}`;
};
