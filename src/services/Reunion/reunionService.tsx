import axios from "axios";
import { Participant, Reunion } from "../../types/reunion";


const endPoint = import.meta.env.VITE_API_ENDPOINT;

interface CreateReunionDto {
    id?: string;
    titre: string;
    description: string;
    dateDebut: string;
    dateFin: string;
    heureDebut: string;
    heureFin: string;
    etat: number;
    emplacement: string;
    participants?: Participant[];
    userReunions?: any[];
}

export const reunionService = {
    async create(reunionData: CreateReunionDto): Promise<Reunion> {
        try {
            const processedParticipants: Participant[] | undefined = reunionData.participants?.map(p => ({
            ...p,
            id: p.id || '',
            type: p.email.endsWith('@ravinala-airports.aero') ? 'Interne' : 'Externe',
            role: p.type === 'Interne' ? 'Obligatoire' : 'Facultatif', // Détermine le rôle
            state: p.state || 'En attente',
            userid: p.userid || p.email.split('@')[0],
            email: p.email,
            reunionid: p.reunionid || ''
        }));

        const response = await axios.post(`${endPoint}/api/Reu`, {
            ...reunionData,
            participants: processedParticipants
        });
        return response.data;
        } catch (error) {
            console.error("Erreur création réunion:", error);
            throw error;
        }
    },

    async getAll(): Promise<Reunion[]> {
        try {
            const response = await axios.get(`${endPoint}/api/Reu`);
            return response.data;
        } catch (error) {
            console.error("Erreur récupération réunions:", error);
            throw error;
        }
    },

    async getById(id: string): Promise<Reunion> {
        try {
            const response = await axios.get(`${endPoint}/api/Reu/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Erreur récupération réunion ${id}:`, error);
            throw error;
        }
    },

    async update(id: string, reunionData: Partial<CreateReunionDto>): Promise<Reunion> {
        try {
            const response = await axios.put(`${endPoint}/api/Reu/${id}`, reunionData);
            return response.data;
        } catch (error) {
            console.error(`Erreur mise à jour réunion ${id}:`, error);
            throw error;
        }
    },

    async delete(id: string): Promise<void> {
        try {
            await axios.delete(`${endPoint}/api/Reu/${id}`);
        } catch (error) {
            console.error(`Erreur suppression réunion ${id}:`, error);
            throw error;
        }
    }
};