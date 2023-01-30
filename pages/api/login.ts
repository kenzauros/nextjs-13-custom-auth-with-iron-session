import { tryLogin } from "../../lib/database";
import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "lib/session";
import { NextApiRequest, NextApiResponse } from "next";

async function loginRoute(req: NextApiRequest, res: NextApiResponse) {
  const { username, password } = await req.body;
  try {
    const userInfo = await tryLogin({ username, password });
    if (!userInfo) {
      res.status(400).json({ message: "Authentication failed" });
      return;
    }
    req.session.user = userInfo;
    await req.session.save();
    res.json(userInfo);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
}

export default withIronSessionApiRoute(loginRoute, sessionOptions);
