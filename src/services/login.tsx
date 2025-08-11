import axios from "axios";
import { useAuth } from "../context/AuthContext";
import {
  HabilitationAdminInterface,
  HabilitationProjectInterface,
} from "../types/Habilitation";

const endPoint = import.meta.env.VITE_API_ENDPOINT;

/* ======= POST ======= */

// login
export const useAuthService = () => {
  const { login } = useAuth();

  const loginUser = async (userCredentials: {
    username: string;
    password: string;
    type: string;
  }) => {
    try {
      const response = await axios.post(
        `${endPoint}/api/Login`,
        userCredentials,
        { withCredentials: false }
      );

      if (response.data && response.data.type === "success") {
        let adminPrivilege = false;
        const habilitation = response.data.user.habilitations;

        habilitation?.forEach(
          (hab: {
            habilitationAdmins: HabilitationAdminInterface[];
            habilitationProjects: HabilitationProjectInterface[];
          }) => {
            hab.habilitationAdmins.forEach(
              (admin: HabilitationAdminInterface) => {
                if (
                  admin?.createHabilitation === 1 ||
                  admin?.deleteHabilitation === 1 ||
                  admin?.modifyHierarchy === 1 ||
                  admin?.restoreHierarchy === 1 ||
                  admin?.updateHabilitation === 1
                ) {
                  adminPrivilege = true;
                }
              }
            );
          }
        );

        // Sauvegarde du token selon le rôle
        if (adminPrivilege) {
          localStorage.setItem("_au_ad", response.data.token);
        }
        // Toujours sauvegarder _au_pr pour détecter l'utilisateur connecté
        localStorage.setItem("_au_pr", response.data.token);

        // Met à jour le contexte Auth
        login(response.data.user);
      }

      return response.data;
    } catch (error) {
      console.error(`Error while login ${error}`);
      return {
        message:
          "Vous n'avez pas accès à cette plateforme, veuillez vérifier votre connexion ou contacter l'administrateur",
        type: "error",
      };
    }
  };

  return { loginUser };
};

// logout
export const logout = async () => {
  try {
    const response = await axios.post(`${endPoint}/api/Login/logout`);
    localStorage.removeItem("_au_ad");
    localStorage.removeItem("_au_pr");
    return response;
  } catch (error) {
    console.error(`Error while logout service ${error}`);
  }
};
