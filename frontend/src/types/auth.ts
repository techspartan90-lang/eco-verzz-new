export interface User {
  id?: string;
  name: string;
  full_name?: string;
  username?: string;
  email: string;
  phone?: string;
  role: "Admin" | "Analyst" | "Investor" | string;
  ecoPoints?: number;
  scannedItemsCount?: number;
  rank?: string;
  joinedAt?: string;
}

export type UserProfile = User;

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterPayload {
  full_name: string;
  email: string;
  password: string;
  phone?: string;
  role?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  message?: string;
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (emailOrCredentials: string | LoginCredentials, password?: string) => Promise<User>;
  register: (payload: RegisterPayload) => Promise<User>;
  logout: () => void;
  clearError: () => void;
}
