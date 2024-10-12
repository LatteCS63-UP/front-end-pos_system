"use client"
import './page.scss'
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"

import React, { useRef, useState } from 'react'

function page() {
    const [warning, set_Warning] = useState({
        shop_code: false,
        shop_code_text_warning_1: false,

        username: false,
        username_text_warning_1: false,

        password: false,
        password_text_warning_1: false,
    })

    const shop_code = useRef<HTMLInputElement>(null)
    const username = useRef<HTMLInputElement>(null)
    const password = useRef<HTMLInputElement>(null)

    const router = useRouter()
    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get('callbackUrl') || '/home'

    const submit_signIn = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (shop_code.current?.value == '' || username.current?.value == '' || password.current?.value == '') {
            if (shop_code.current?.value == '') {
                set_Warning((value) => ({ ...value, shop_code: true }));
            } else {
                set_Warning((value) => ({ ...value, shop_code: false }));
            }

            if (username.current?.value == '') {
                set_Warning((value) => ({ ...value, username: true }));
            } else {
                set_Warning((value) => ({ ...value, username: false }));
            }

            if (password.current?.value == '') {
                set_Warning((value) => ({ ...value, password: true }));
            } else {
                set_Warning((value) => ({ ...value, password: false }));
            }

        } else {
            set_Warning((value) => ({
                ...value,
                shop_code: false,
                username: false,
                password: false,
            }));

            const res = await signIn('credentials', {
                ShopCode: shop_code.current?.value,
                Username: username.current?.value,
                Password: password.current?.value,
                redirect: false,
                callbackUrl
            });

            // *Description waring code.
            // * 1. W01 = no data shop in database.
            // * 2. W02 = username incorrect.
            // * 3. W03 = password incorrect.
            if (res?.error == 'W01') {
                console.log('no data shop in database.')
                set_Warning((value) => ({
                    ...value,
                    shop_code: true,
                    shop_code_text_warning_1: true,

                    username_text_warning_1: false,
                    password_text_warning_1: false
                }));

            } else if (res?.error == 'W02') {
                console.log('username incorrect.')
                set_Warning((value) => ({
                    ...value,
                    username: true,
                    username_text_warning_1: true,

                    shop_code_text_warning_1: false,
                    password_text_warning_1: false
                }));

            } else if (res?.error == 'W03') {
                console.log('password incorrect.')
                set_Warning((value) => ({
                    ...value,
                    password: true,
                    password_text_warning_1: true,

                    shop_code_text_warning_1: false,
                    username_text_warning_1: false
                }));
            } else {
                set_Warning((value) => ({
                    ...value,
                    password: false,
                    password_text_warning_1: false
                }))

                router.push(callbackUrl)
            }

        }
    };
    return (
        <div>
            <h2>Sign-in</h2>
            <form onSubmit={submit_signIn}>
                <label htmlFor="shop_code">Shop code</label>
                <input
                    type="text"
                    id="shop_code"
                    ref={shop_code}

                    className={`shop_code ${warning.shop_code ? 'active' : ''}`}
                /><br />
                {warning.shop_code_text_warning_1 && <p>no data shop in database.</p>}

                <label htmlFor="username">Username</label>
                <input
                    type="text"
                    id="username"
                    ref={username}

                    className={`username ${warning.username ? 'active' : ''}`}
                /><br />
                {warning.username_text_warning_1 && <p>username incorrect.</p>}

                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    id="password"
                    ref={password}

                    className={`password ${warning.password ? 'active' : ''}`}
                /><br />
                {warning.password_text_warning_1 && <p>password incorrect.</p>}

                <input type="submit" />
            </form>
        </div>
    )
}

export default page