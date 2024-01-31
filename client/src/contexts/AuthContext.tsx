"use client";

import {
  useContext,
  useState,
  useEffect,
  createContext,
  Dispatch,
  SetStateAction,
  PropsWithChildren,
  ProviderProps,
} from "react";

export interface IAuthContext {
  isAuth: boolean;
  setIsAuth: Dispatch<SetStateAction<boolean>>;
  isAdmin: boolean;
  setIsAdmin: Dispatch<SetStateAction<boolean>>;
  username: string;
  setUsername: Dispatch<SetStateAction<string>>;
}

export const AuthContext = createContext<IAuthContext>({
  isAuth: false,
  setIsAuth: () => {},
  isAdmin: false,
  setIsAdmin: () => {},
  username: "",
  setUsername: () => {},
});

AuthContext.displayName = "AuthContext";

export const useAuthCtx = (): IAuthContext => useContext(AuthContext);

interface AuthProviderProps {
  children: React.ReactNode;
  connectSid: {
    name: string;
    value: string;
  };
}

export function AuthProvider({
  connectSid,
  children,
}: AuthProviderProps): React.ReactNode {
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");

  /** 
   * @dev Note the middleware already handles the sessions.
   * AuthProvider, handles the UI display to the client
   * side.
   */
  const getSession = async () => {
    try {
      const req = await fetch("/api/auth/session", {
        credentials: "include",
        headers: {
          Accept: "application/json",
          Cookie: `${connectSid.name}=${connectSid.value}`,
        },
      });
      const { data } = await req.json();

      if (req.status === 200) {
        setUsername(data.username);
        setIsAdmin(data.isAdmin);
        setIsAuth(data.isAuth);
      }
    } catch (err) {
      console.error("[AuthProvider@getSession]:", (err as Error).message);
      setIsAuth(false);
      setIsAdmin(false);
      setUsername("");
    }
  };

  useEffect(() => {
    getSession();
  });

  const value: ProviderProps<IAuthContext> = {
    value: {
      isAuth,
      setIsAuth,
      isAdmin,
      setIsAdmin,
      username,
      setUsername,
    },
  };

  return <AuthContext.Provider {...value}>{children}</AuthContext.Provider>;
}
