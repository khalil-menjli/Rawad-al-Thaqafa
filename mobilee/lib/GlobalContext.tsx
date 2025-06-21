import useAuthStore from "@/store/useAuthStore";
import React, { createContext, useContext, ReactNode, useEffect } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isApproved?: boolean;
  role?: string;
  platform?: string;
}

interface GlobalContextType {
  isLogged: boolean;
  user: User | null;
  loading: boolean;
  refetch: () => Promise<void>;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

interface Props {
  children: ReactNode;
}

const GlobalProvider = ({ children }: Props) => {
  const { user, isAuthenticated, isLoading, checkAuth, refreshUser } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const refetch = async () => {
    await refreshUser();
  };

  return (
    <GlobalContext.Provider
      value={{
        isLogged: isAuthenticated,
        user: user as User | null,
        loading: isLoading,
        refetch,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  const ctx = useContext(GlobalContext);
  if (!ctx) throw new Error("useGlobalContext must be used inside GlobalProvider");
  return ctx;
};

export default GlobalProvider;
