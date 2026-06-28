import { createContext, use } from 'react';

export const ToastContext = createContext();

export const useToast = () => use(ToastContext);
