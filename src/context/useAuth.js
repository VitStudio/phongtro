import { createContext, use } from 'react';

export const AuthContext = createContext();

export const useAuth = () => use(AuthContext);
