import axios from "axios";
import { CreateReunion} from "../../types/reunion";

const endPoint = import.meta.env.VITE_API_ENDPOINT;

// Method POST
//Créer reunion
export const CreateReunion = async (reunionData: CreateReunion): Promise<CreateReunion> => {
    try{
        const response = await axios.post(`${endPoint}/api/Reunion`,reunionData);
        console.log(`Réunion crée avec succès:${response.data}`);
        return response.data;
    } catch (error) {
        console.error(`Erreur lors de la création de la réunion: ${error}`);
        throw error;
    }
};