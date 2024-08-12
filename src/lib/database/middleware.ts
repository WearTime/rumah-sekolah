import { NextApiRequest, NextApiResponse } from "next";

const middleware = (
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>
) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      await handler(req, res);
    } catch (error) {
      res
        .status(500)
        .json({ message: "MYSQL ERROR", error: (error as Error).message });
    }
  };
};

export default middleware;
