import { sign, verify } from "jsonwebtoken";
import { NoHashToken } from "../types";
import { APP } from "../config";

function generateToken(toHash: NoHashToken): string {
  const token = sign(toHash, APP.PRIVATE_KEY, { expiresIn: "1d" });

  return token;
}

function decodeToken(token: string): null | NoHashToken {
  try {
    const noHash: NoHashToken = verify(token, APP.PRIVATE_KEY) as NoHashToken;
    return noHash;
  } catch (err) {
    console.log(err);

    return null;
  }
}

export { generateToken, decodeToken };
