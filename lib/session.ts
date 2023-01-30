import type { IronSessionOptions } from "iron-session";
import { withIronSessionSsr } from "iron-session/next";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";

export const sessionOptions: IronSessionOptions = {
  password: process.env.COOKIE_PASSWORD as string,
  cookieName: "nextjs-13-custom-auth-with-iron-session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};

declare module "iron-session" {
  interface IronSessionData {
    user?: User | null;
  }
}

/**
 * User
 */
export type User = {
  username: string;
};

/**
 * User object that indicates not logged in
 */
export const NullUser: User = {
  username: "",
};

/**
 * Create getServerSideProps function with current logged in user.
 * @param redirectIfUnauthenticatedTo redirect url on unauthencated
 * @param handler additional props handler
 * @returns getServerSideProps function
 * @example export const getServerSideProps = withUserSessionSsr("/login");
 */
export function withUserSessionSsr<
  P extends {
    [key: string]: unknown;
    user?: User | null;
    redirectIfUnauthenticatedTo?: string;
  }
>(
  redirectIfUnauthenticatedTo: string,
  handler?: (
    context: GetServerSidePropsContext
  ) => GetServerSidePropsResult<P> | Promise<GetServerSidePropsResult<P>>
): (
  context: GetServerSidePropsContext
) => Promise<GetServerSidePropsResult<P>> {
  return withIronSessionSsr(async (ctx: GetServerSidePropsContext) => {
    const { req } = ctx;
    const user = req.session.user;
    if (!user) {
      console.warn("Not authenticated. Redirecting to login page...");
      return {
        redirect: {
          statusCode: 302,
          destination: redirectIfUnauthenticatedTo,
          basePath: false,
        },
      };
    }
    if (handler) {
      const result = await handler(ctx);
      if ("props" in result) {
        result.props = { user } as P;
      }
      return result;
    } else {
      return {
        props: { user },
      } as GetServerSidePropsResult<P>;
    }
  }, sessionOptions);
}
