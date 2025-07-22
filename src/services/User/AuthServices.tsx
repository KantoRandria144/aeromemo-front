import axios from "axios";
import { AuthResponse, LoginRequest, RegisterRequest } from "../../types/Auth";

const endPoint = import.meta.env.VITE_API_ENDPOINT;

export const AuthService = {
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const res = await axios.post(`${endPoint}/api/Auth/register`, data, {withCredentials: true});
    return res.data;
  },

  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const res = await axios.post(`${endPoint}/api/Auth/login`, data, {withCredentials: true});
    return res.data;
  },

 logout: async (): Promise<void> => {
    await axios.post(`${endPoint}/api/Auth/logout`, null, {
      withCredentials: true, // pour que le cookie de session soit envoyé au serveur
    });
  },

  getCurrentUser: async (): Promise<AuthResponse> => {
    const res = await axios.get(`${endPoint}/api/Auth/users`, {
      withCredentials: true,
    });
    return res.data;
  },
};