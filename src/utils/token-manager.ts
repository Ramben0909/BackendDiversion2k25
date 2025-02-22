import dotenv from "dotenv";
dotenv.config();
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { COOKIE_NAME } from "./constants.js";

export const createToken = (id: string, email: string, expiresIn: string | number) => {
  const payload = { id, email };

  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in the environment variables.");
  }

  const token = jwt.sign(payload, process.env.JWT_SECRET as jwt.Secret, { expiresIn } as jwt.SignOptions);
  return token;
};

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.signedCookies[COOKIE_NAME];

  if (!token || token.trim() === "") {
    return res.status(401).json({ message: "Token Not Received" });
  }

  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ message: "JWT_SECRET is not set on the server" });
  }

  try {
    const decoded = await new Promise<jwt.JwtPayload>((resolve, reject) => {
      jwt.verify(token, process.env.JWT_SECRET as jwt.Secret, {}, (err, decoded) => {
        if (err) reject(err);
        else resolve(decoded as jwt.JwtPayload);
      });
    });

    res.locals.jwtData = decoded;
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Token Expired or Invalid" });
  }
};

