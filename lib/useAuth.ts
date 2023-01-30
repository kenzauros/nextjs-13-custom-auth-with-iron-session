import Router from "next/router";
import { useCallback, useEffect, useState } from "react";
import useSWR from "swr";
import fetchJson, { FetchError } from "./fetchJson";
import { User } from "./session";

export default function useAuth({
  redirectOnLoggedInTo = "",
  redirectOnNotLoggedInTo = "",
} = {}) {
  const { data: user, mutate: mutateUser } = useSWR<User | null>("/api/user");
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string>("");
  const [logoutError, setLogoutError] = useState<string>("");

  useEffect(() => {
    if (redirectOnNotLoggedInTo && !user) {
      Router.push(redirectOnNotLoggedInTo);
    } else if (redirectOnLoggedInTo && user) {
      Router.push(redirectOnLoggedInTo);
    }
  }, [user, redirectOnLoggedInTo, redirectOnNotLoggedInTo]);

  const login = useCallback(
    async (username: string, password: string) => {
      const body = {
        username,
        password,
      };
      try {
        setIsLoggingIn(true);
        const user = (await fetchJson("/api/login", "POST", body)) as User;
        mutateUser(user);
        setLoginError("");
      } catch (e: any) {
        if (e instanceof FetchError) {
          setLoginError(e.data.message);
        } else {
          setLoginError(e?.message ?? "unknown error");
        }
      } finally {
        setIsLoggingIn(false);
      }
    },
    [mutateUser, setIsLoggingIn, setLoginError]
  );

  const logout = useCallback(async () => {
    try {
      setIsLoggingOut(false);
      await fetchJson<{ ok: boolean }>("/api/logout");
      mutateUser(null);
      setLogoutError("");
    } catch (e: any) {
      if (e instanceof FetchError) {
        setLogoutError(e.data.message);
      } else {
        setLogoutError(e?.message ?? "unknown error");
      }
    } finally {
      setIsLoggingOut(false);
    }
  }, [mutateUser, setIsLoggingOut, setLogoutError]);

  return {
    user,
    mutateUser,
    login,
    isLoggingIn,
    loginError,
    logout,
    isLoggingOut,
    logoutError,
  };
}
