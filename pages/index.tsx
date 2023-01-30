import { withUserSessionSsr } from "@/lib/session";
import useAuth from "@/lib/useAuth";
import { InferGetServerSidePropsType } from "next";
import { useCallback } from "react";

export default function Index({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { logout, isLoggingOut } = useAuth({
    redirectOnNotLoggedInTo: "/login",
  });

  const handleSubmit = useCallback(
    async (event: any) => {
      event.preventDefault();
      await logout();
    },
    [logout]
  );

  return (
    <>
      {user && (
        <>
          <div>
            Your username is <strong>{user?.username}</strong>
          </div>
          <div>
            <button onClick={handleSubmit} disabled={isLoggingOut}>
              {isLoggingOut ? "Logging out..." : "Log out"}
            </button>
          </div>
        </>
      )}
    </>
  );
}

export const getServerSideProps = withUserSessionSsr("/login");
