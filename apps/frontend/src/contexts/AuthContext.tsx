import { createContext, useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";

export type User = {
  name: string;
  email: string;
  picture: string;
};

export type SignInData = {
  token: string;
};

export type AuthContextType = {
  isAuthenticated: boolean;
  user: User | null;
  setUser: (user: User | null) => void;
  clearUser: () => void;
};

export const AuthContext = createContext({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      setIsAuthenticated(true);
      navigate({ to: "/" });
    } else {
      setIsAuthenticated(false);
      navigate({ to: "/login" });
    }
  }, [user]);

  function clearUser() {
    setUser(null);
    setIsAuthenticated(false);
    navigate({ to: "/login" });
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        setUser,
        clearUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
