import axios from "axios";
import { useAuth } from "../context/AuthContext";
import {
  HabilitationAdminInterface,
  HabilitationReunionInterface,
} from "../types/Habilitation";

const endPoint = import.meta.env.VITE_API_ENDPOINT;

/* ======= SERVICE D’AUTHENTIFICATION ======= */
export const useAuthService = () => {
  const { login } = useAuth();

  const loginUser = async (userCredentials: {
    username: string;
    password: string;
    type: string;
  }) => {
    try {
      const response = await axios.post(`${endPoint}/api/Login`, userCredentials, {
        withCredentials: false,
      });

      console.log("Réponse du backend login :", response.data);

      if (response.data?.type === "success") {
        const user = response.data.user;
        const token = response.data.appToken || response.data.token; // ✅ correction
        const message = response.data.message;

        // Vérifications
        if (!user?.id) {
          console.warn("⚠️ Aucun ID utilisateur trouvé dans la réponse.");
        } else {
          localStorage.setItem("userId", user.id);
        }

        if (!token) {
          console.warn("⚠️ Aucun token (appToken/token) trouvé dans la réponse.");
        } else {
          localStorage.setItem("_au_pr", token);
        }

        // Détection des habilitations
        let adminPrivilege = false;
        let reunionPrivilege = false;

        const habilitations = user?.habilitations || [];
        if (Array.isArray(habilitations)) {
          habilitations.forEach(
            (hab: {
              habilitationAdmins?: HabilitationAdminInterface[];
              habilitationReunions?: HabilitationReunionInterface[];
            }) => {
              if (Array.isArray(hab.habilitationAdmins)) {
                hab.habilitationAdmins.forEach((admin: HabilitationAdminInterface) => {
                  if (
                    admin.createHabilitation === 1 ||
                    admin.deleteHabilitation === 1 ||
                    admin.modifyHierarchy === 1 ||
                    admin.restoreHierarchy === 1 ||
                    admin.updateHabilitation === 1
                  ) {
                    adminPrivilege = true;
                  }
                });
              }

              if (Array.isArray(hab.habilitationReunions)) {
                hab.habilitationReunions.forEach((reunion: HabilitationReunionInterface) => {
                  if (
                    reunion.create === 1 ||
                    reunion.update === 1 ||
                    reunion.delete === 1 ||
                    reunion.assign === 1
                  ) {
                    reunionPrivilege = true;
                  }
                });
              }
            }
          );
        }

        // Sauvegarde des tokens selon privilèges
        if (adminPrivilege && token) localStorage.setItem("_au_ad", token);
        if (reunionPrivilege && token) localStorage.setItem("_au_pr", token);

        // Met à jour le contexte Auth global
        login(user);

        return { type: "success", user, token, message };
      } else {
        console.warn("Réponse inattendue :", response.data);
        return {
          type: "error",
          message: "Réponse inattendue du serveur.",
        };
      }
    } catch (error) {
      console.error("❌ Erreur lors du login :", error);
      return {
        message:
          "Vous n'avez pas accès à cette plateforme, veuillez vérifier votre connexion ou contacter l'administrateur",
        type: "error",
      };
    }
  };

  return { loginUser };
};

// ======= LOGOUT =======
export const logout = async () => {
  try {
    const response = await axios.post(`${endPoint}/api/Login/logout`);
    localStorage.removeItem("_au_ad");
    localStorage.removeItem("_au_pr");
    localStorage.removeItem("userId");
    return response;
  } catch (error) {
    console.error(`Error while logout service ${error}`);
  }
};
