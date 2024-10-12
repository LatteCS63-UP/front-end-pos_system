"use client"

import { signIn, signOut, useSession } from 'next-auth/react'
import React from 'react'

function page() {
    const { data: session }: any = useSession()

    if (session) {
        return (
            <div>
                <h1>hello user</h1>
                <button onClick={() => signOut({ callbackUrl: '/' })}>Sign Out</button>
            </div>
        )
    } else {
        return (
            <div>
                <h1>no</h1>
                <button onClick={() => signIn()}>Sign in</button>
            </div>
        )
    }
    // return (
    //     <div>page</div>
    // )
}

export default page