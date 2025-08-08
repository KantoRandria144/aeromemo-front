import axios from "axios";
import { CreateReunion, Reunion, UpdateReunion } from "../../types/reunion";

const endPoint = import.meta.env.VITE_API_ENDPOINT;

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