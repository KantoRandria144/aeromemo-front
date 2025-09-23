export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  id: string;
  name: string;
  email: string;
  appToken: string;
  graphToken?: string;
  refreshToken?: string;
}

export interface OAuthConfig {
  oauthUrl: string;
  traditionalLoginUrl: string;
  recommendedMethod: string;
}