import axios from "axios";

const endPoint = import.meta.env.VITE_API_ENDPOINT;

export type CreateQRCodeDTO = {
  reunionid: string;
  tokens: string;
  etat: string;
};

export type QRCodeWithReunion = {
  id: string;
  tokens: string;
  etat: string;
  reunion: any; // Vous pouvez créer un type plus spécifique si nécessaire
};

export const generateQRCode = async (createDto: CreateQRCodeDTO): Promise<Blob> => {
  try {
    const token = localStorage.getItem("_au_pr");
    const url = `${endPoint}/api/QRCode/generate`;
    
    console.log("Tentative d'appel à:", url); // Debug
    console.log("Payload:", createDto); // Debug
    
    const response = await axios.post(url, createDto, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      responseType: 'blob'
    });

    return response.data;
  } catch (error) {
    console.error("Erreur complète:", error); // Plus de détails
    throw error;
  }
};

export const scanQRCode = async (qrCodeId: string): Promise<QRCodeWithReunion> => {
  try {
    const token = localStorage.getItem("_au_pr");
    
    const response = await axios.get(`${endPoint}/api/QRCode/scan/${qrCodeId}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error) {
    console.error("Erreur lors du scan du QR code:", error);
    throw error;
  }
};