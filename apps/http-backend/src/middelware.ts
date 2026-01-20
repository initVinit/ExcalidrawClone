import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";

interface AuthJwtPayload extends JwtPayload {
  userId: string;
}

export function middleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (
      typeof decoded === "object" &&
      "userId" in decoded
    ) {
      req.userId = (decoded as AuthJwtPayload).userId;
      return next();
    }

    return res.status(403).json({ message: "Unauthorized" });
  } catch {
    return res.status(403).json({ message: "Unauthorized" });
  }
}
