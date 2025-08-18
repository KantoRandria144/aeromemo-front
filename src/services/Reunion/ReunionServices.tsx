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
  };

export const saveReunion = async (payload: SaveReunionPayload): Promise<Reunion> => {
    try {
      const res = await axios.post(`${endPoint}/api/reunion/save`, payload);
      return res.data;
    } catch (error) {
      console.error("Erreur lors de l’enregistrement de la réunion:", error);
      
      throw error;
    }
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