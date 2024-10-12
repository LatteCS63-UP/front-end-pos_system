import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { signIn } from "next-auth/react";

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                ShopCode: {label: 'shop_code', type: "text"},
                Username: {label: 'username', type: 'text'},
                Password: {label: 'password', type: 'text'}
            },

            async authorize(credentials: any) {
                const res = await fetch(`http://localhost:3000/sign-in`, {
                    method: 'POST',
                    body: JSON.stringify(credentials),
                    headers: { "Content-Type": "application/json" }
                });
                const req = await res.json();
                
                // *Description waring code.
                // * 1. W01 = no data shop in database.
                // * 2. W02 = username incorrect.
                // * 3. W03 = password incorrect.
                if(req.shop_code) {
                    if(req.username) {
                        if(req.password) {
                            return req.user

                        }else {
                            throw Error('W03')
                        }

                    }else {
                        throw Error('W02')
                    }

                }else {
                    throw Error('W01')
                }
            }
        })
    ],
    callbacks: {
        async jwt({token, user}) {
            if(user) {
                token.shop_id = user.shop_id
                token.owner_id = user.owner_id
                token.status_login = user.status_login
            }
            return token
        },

        async session({session, token}) {
            if(token && session.user) {
                session.user.shop_id = token.shop_id as number
                session.user.owner_id = token.owner_id as number
                session.user.status_login = token.status_login as string
            }
            return session
        },
    },

    pages: {
        signIn: '/sign-in',
        // signOut: '/'
    }
});

export {handler as GET, handler as POST}