import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import User from "@models/user";

import { connectToDB } from "@utils/database";

// console.log({
//     clientId: process.env.GOOGLE_ID,
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
// })

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        })
    ],
    callbacks: {
    async session({ session }) {
        const sessionUsers = await User.findOne({ email: session.user.email });
        session.user.id = sessionUsers._id.toString();
        return session;

    },
    async signIn( profile ){
        try{
            await connectToDB();
            // check if a user already exists
            const userExists = await User.findOne({ email: profile.profile.email });
            // console.log(profile.profile.name);
            // if not, create a new user
            if(!userExists){
                // console.log(profile.profile);
                await User.create({
                    email: profile.profile.email,
                    username: profile.profile.name.replace(" ", "").toLowerCase(),
                    image: profile.profile.picture})
            }return true;
        }catch(error){
            console.log(error)
            return false;
        }
    }}
});

export { handler as GET, handler as POST}