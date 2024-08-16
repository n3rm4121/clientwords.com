import NextAuth, { CredentialsSignin } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import dbConnect from "./lib/dbConnect";
import User from "./models/user.model";
import bcrypt from 'bcryptjs';
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GithubProvider,
    GoogleProvider,
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      authorize: async (credentials) => {
        const email = credentials.email as string | undefined;
        const password = credentials.password as string | undefined;

        if (!email || !password) {
          throw new Error("Both email and password are required");
        }

        await dbConnect();

        const user = await User.findOne({ email }).select('+password');

        if (!user || !user.password) {
          throw new Error("Invalid email or password");
        }

        const isValid = bcrypt.compare(password, user.password);


        if (!isValid) {
          throw new Error("Invalid email or password");
        }

        return user;
      },
    }),
  ],

  secret: process.env.NEXT_AUTH_SECRET,

  pages: {
    signIn: "/auth/login",
  },
  
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
      }
      return token;
    },

    session: async ({ session, token }) => {
      session.user.id = token.id as string;
      return session;
    },

    signIn: async ({ user, account }) => {
      await dbConnect();

      if (account?.provider === 'google' || account?.provider === 'github') {
        const { email, name, image, id } = user;

        try {
          const existingUser = await User.findOne({ email });

          if (!existingUser) {
            const newUser = new User({
              email,
              authProviderId: id,
              authProvider: account.provider as string,
              name,
              image,
              isVerified: true,
            });
            await newUser.save();
            console.log("new user: " , newUser);

          }

          return true;

        } catch (error) {
          console.log("Error during OAuth sign-in:", error);
          return false;
        }

      } else if (account?.provider === 'credentials') {
        return true;
      } else {
        return false;
      }
    },
  },
});
