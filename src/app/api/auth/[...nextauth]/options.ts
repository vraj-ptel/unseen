import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";

import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      // need to make autoriZation function for next-auth
      async authorize(credentials: any): Promise<any> {
        await dbConnect();
        try {
          const user = await UserModel.findOne({
            $or: [
              { email: credentials.identifier },
              { userName: credentials.identifier },
            ],
          });
          // if user not found
          if (!user) {
            throw new Error("No User Found With This Email or Username");
          }
          // if user is not verified
          if (!user.isVerified) {
            throw new Error("User Not Verified Please Verify Your Email");
          }
          //   checking whether password is correct or not
          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (!isPasswordCorrect) {
            throw new Error("Invalid Password");
          } else {
            return user;
          }
        } catch (error: any) {
          throw new Error(error);
        }
      },
    }),
  ], 
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      await dbConnect();
      try{
        let existingUser = await UserModel.findOne({ email: user.email });

      if (!existingUser) {
        
        const uName=user.email?.split("@")[0];
        const newUser = new UserModel({
          email: user.email,
          userName: uName?.split(" ").join(""), 
          isVerified: true,
          isAcceptingMessages: true,  

        });
        await newUser.save();
        return true; 
      } else {
        const uName=user.email?.split("@")[0];
        existingUser.userName =  uName?.split(" ").join("")|| ""; 
        await existingUser.save();
        return true; 
      }
      }catch(e){
        console.log(e);
      }
      finally{
        return true
      }
      
    },
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString();
        token.isVerified = user.isVerified;
        token.isAcceptingMessage = user.isAcceptingMessage;
        token.userName = user.userName;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessage = token.isAcceptingMessage;
        session.user.userName = token.userName;
      }
      return session;
    },
  },
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
