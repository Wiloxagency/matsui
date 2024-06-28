// import passport from "passport";
// import passportLocal from "passport-local";
// import bcrypt from "bcrypt";
// import { UserInterface } from "../interfaces/interfaces";
// import { getUserByEmail } from "./userServices";

// const LocalStrategy = passportLocal.Strategy;

// export async function initializePassport(passport: passport.PassportStatic) {
//   const authenticateUser = async (
//     receivedEmail: string,
//     receivedPassword: string,
//     done: any
//   ) => {
//     const fetchedUser: UserInterface | null = await getUserByEmail(
//       receivedEmail
//     );
//     console.log(fetchedUser);

//     if (fetchedUser === null) {
//       return done(null, false, { message: "No user with provided email" });
//     }

//     try {
//       if (await bcrypt.compare(receivedPassword, fetchedUser.password)) {
//         return done(null, fetchedUser);
//       } else {
//         return done(null, false, { message: "Incorrect password" });
//       }
//     } catch (error) {
//       return done(error);
//     }
//   };

//   passport.use(new LocalStrategy({ usernameField: "email" }, authenticateUser));
//   passport.serializeUser((user, done) => done(null, user));
//   passport.deserializeUser((id, done) => {});
// }
