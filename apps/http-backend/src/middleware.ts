import { SECRET_KEY } from "@repo/backend-common/config";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
export const middleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization ?? "";

  const decoded = await jwt.verify(token, SECRET_KEY);
  if (decoded) {
    req.userId = (decoded as jwt.JwtPayload).id;
    next();
  } else {
    res.status(401).send("Unauthorized");
  }
};
