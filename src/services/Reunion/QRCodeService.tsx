import axios from "axios";
import { Participant, Reunion } from "../../types/reunion";

const endPoint = import.meta.env.VITE_API_ENDPOINT;

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

// ✅ Scanner un QR Code (renvoie les infos de la réunion et du participant)
export const scanQRCode = async (
  qrCodeId: string,
  email: string
): Promise<QRCodeWithReunion> => {
  try {
    const token = localStorage.getItem("_au_pr");
    const url = `${endPoint}/api/QRCode/scan/${qrCodeId}?email=${encodeURIComponent(
      email
    )}`;

    console.log("Scan URL:", url);

    const response = await axios.post(
      url,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Erreur lors du scan du QR code:", error);
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
