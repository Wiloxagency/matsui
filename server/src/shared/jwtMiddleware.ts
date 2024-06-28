// import { Request, Response, NextFunction } from "express";
// import jwt from "jsonwebtoken";

// interface JWTPayload {
//   userId: string;
// }

// export const jwtSecret = "your_jwt_secret";
// export const refreshSecret = "your_refresh_secret";

// export const authenticateToken = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   next();
//   // const authHeader = req.headers["authorization"];
//   // const token = authHeader && authHeader.split(" ")[1];
//   // console.log("token: ", token);

//   // if (!token) {
//   //   return res.sendStatus(401);
//   // }

//   // jwt.verify(token, jwtSecret, (err, user) => {
//   //   if (err) {
//   //     return res.sendStatus(403);
//   //   }

//   //   req.user = user;
//   //   next();
//   // });
// };

// export const generateAccessToken = (userId: string) => {
//   // console.log("ACCESS TOKEN GENERATED");
//   // return jwt.sign({ userId }, jwtSecret, { expiresIn: "15m" });
//   const accessToken = jwt.sign({ userId }, jwtSecret, { expiresIn: "5s" });
//   return accessToken;
// };

// export const generateRefreshToken = (userId: string) => {
//   // console.log("REFRESH TOKEN GENERATED");
//   return jwt.sign({ userId }, jwtSecret, { expiresIn: "7d" });
// };
