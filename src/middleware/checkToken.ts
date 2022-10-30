import * as jwt from "jsonwebtoken";
import { Request, NextFunction } from "express";
import { AppResponse } from "../types";
import { APP } from "../config";

function verifyToken(req: Request, res: AppResponse, next: NextFunction) {
  const token = req.get("Authorization");
  if (!token) return next({ status: 401, message: "token is not present" });
  try {
    let decodeToken: string[] | string = token?.split(" ");

    if (decodeToken.length <= 1)
      return next({ status: 401, message: "token is malformed" });
    decodeToken = decodeToken[1];
    jwt.verify(decodeToken, APP.PRIVATE_KEY, { algorithms: ["RS384"] });
  } catch (err) {
    return next({ status: 401, message: "token is malformed" });
  }
  next();
}
export { verifyToken };
