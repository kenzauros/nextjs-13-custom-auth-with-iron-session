import useAuth from "@/lib/useAuth";
import { useCallback } from "react";

export default function Login() {
  const { login, isLoggingIn, loginError } = useAuth({
    redirectOnLoggedInTo: "/",
  });

  const handleSubmit = useCallback(
    async (event: any) => {
      event.preventDefault();
      await login(
        event.currentTarget.username.value,
        event.currentTarget.password.value
      );
    },
    [login]
  );

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <div>
          <label htmlFor="username">Username</label>
          <input name="username" type="username" required={true} />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input name="password" type="password" required={true} />
        </div>
        <div>
          <button type="submit" disabled={isLoggingIn}>
            {isLoggingIn ? "Logging in..." : "Log in"}
          </button>
        </div>
        <p>{loginError}</p>
      </div>
    </form>
  );
}
