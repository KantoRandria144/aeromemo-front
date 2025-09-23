// services/oauthService.ts
import axios from "axios";

const endPoint = import.meta.env.VITE_API_ENDPOINT;

export interface OAuthService {
  startOAuthFlow(): Promise<void>;
  handleOAuthCallback(code: string, state: string): Promise<any>;
  getAuthOptions(): Promise<any>;
  refreshToken(refreshToken: string): Promise<any>;
}

export const oauthService = {
  // Démarrer le flux OAuth
  startOAuthFlow: async (): Promise<void> => {
    try {
      // Option 1: Redirection directe vers le backend
      window.location.href = `${endPoint}/api/oauth/login`;
      
      // Option 2: Récupérer l'URL et rediriger
      // const response = await axios.get(`${endPoint}/api/oauth/auth-options`);
      // window.location.href = response.data.oauthUrl;
    } catch (error) {
      console.error('Error starting OAuth flow:', error);
      throw error;
    }
  },

  // Gérer le callback OAuth
  handleOAuthCallback: async (code: string, state: string): Promise<any> => {
    try {
      const response = await axios.get(`${endPoint}/api/oauth/callback`, {
        params: { code, state }
      });
      return response.data;
    } catch (error) {
      console.error('Error handling OAuth callback:', error);
      throw error;
    }
  },

  // Obtenir les options d'authentification
  getAuthOptions: async (): Promise<any> => {
    try {
      const response = await axios.get(`${endPoint}/api/login/auth-options`);
      return response.data;
    } catch (error) {
      console.error('Error getting auth options:', error);
      throw error;
    }
  },

  // Rafraîchir le token
  refreshToken: async (refreshToken: string): Promise<any> => {
    try {
      const response = await axios.post(`${endPoint}/api/oauth/refresh`, {
        refreshToken
      });
      return response.data;
    } catch (error) {
      console.error('Error refreshing token:', error);
      throw error;
    }
  }
};