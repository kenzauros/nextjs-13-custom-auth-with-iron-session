import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "lib/session";
import { NextApiRequest, NextApiResponse } from "next";

function logoutRoute(req: NextApiRequest, res: NextApiResponse<{ ok: boolean }>) {
  req.session.destroy();
  res.send({ ok: true });
}

export default withIronSessionApiRoute(logoutRoute, sessionOptions);
