import { User, sessionOptions } from "@/lib/session";
import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";

async function userRoute(
  req: NextApiRequest,
  res: NextApiResponse<User | null>
) {
  if (req.session.user) {
    res.json(req.session.user);
  } else {
    res.json(null);
  }
}

export default withIronSessionApiRoute(userRoute, sessionOptions);
