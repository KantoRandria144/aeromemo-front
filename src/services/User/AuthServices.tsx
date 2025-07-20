import axios from "axios";
import { AuthResponse, LoginRequest, RegisterRequest } from "../../types/Auth";

const endPoint = import.meta.env.VITE_API_ENDPOINT;

export const AuthService = {
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const res = await axios.post(`${endPoint}/api/Auth/register`, data);
    return res.data;
  },

  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const res = await axios.post(`${endPoint}/api/Auth/login`, data);
    return res.data;
  }
};