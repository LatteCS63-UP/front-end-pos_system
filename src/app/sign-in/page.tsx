"use client"
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
    const callbackUrl = searchParams.get('callbackUrl') || '/system '

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
        <>
            <div className='w-full h-screen bg-[#E3EDEF] p-4 box-border flex items-center justify-center'>
                <div className='w-[350px] text-center bg-[#F9FAFB] px-[24px] py-[40px] rounded-2xl'>
                    <form onSubmit={submit_signIn}>
                        <h2 className='text-5xl font-medium'>เข้าสู่ระบบ</h2>
                        <p className='text-[#637381] text-2xl'>หากยังไม่มีบัญชีใช้งาน ? <a href="/register" className='text-[#1877F2] hover:underline'>ลงทะเบียน</a></p>

                        <div className='flex flex-col items-end'>
                            <div className='w-full relative my-3'>
                                <input id='shop_code' type="text" ref={shop_code} className={`w-full text-3xl px-3 py-2 border rounded-md outline-none box-border focus:border-[#1877F2] focus:border-2 peer ${warning.shop_code ? 'border-[#FD6262]' : 'border-[#E4E8EB]'}`} />
                                <label className={`absolute text-2xl bg-[#F9FAFB] px-1 top-[-15px] left-[10px] peer-focus:text-[#1877F2] ${warning.shop_code ? 'text-[#FD6262] peer-hover:text-[#811211]' : 'text-[#637381] peer-hover:text-black'}`} htmlFor="shop_code">รหัสร้าน</label>
                            </div>

                            <div className='w-full relative my-3'>
                                <input id='username' type="text" ref={username} className={`w-full text-3xl px-3 py-2 border rounded-md outline-none box-border focus:border-[#1877F2] focus:border-2 peer ${warning.username ? 'border-[#FD6262]' : 'border-[#E4E8EB]'}`} />
                                <label className={`absolute text-2xl bg-[#F9FAFB] px-1 top-[-15px] left-[10px] peer-focus:text-[#1877F2] ${warning.username ? 'text-[#FD6262] peer-hover:text-[#811211]' : 'text-[#637381] peer-hover:text-black'}`} htmlFor="username">ผู้ใช้งาน</label>
                            </div>

                            <div className='w-full relative my-3'>
                                <input id='password' type="password" ref={password} className={`w-full text-3xl px-3 py-2 border rounded-md outline-none box-border focus:border-[#1877F2] focus:border-2 peer ${warning.password ? 'border-[#FD6262]' : 'border-[#E4E8EB]'}`} />
                                <label className={`absolute text-2xl bg-[#F9FAFB] px-1 top-[-15px] left-[10px] peer-focus:text-[#1877F2] ${warning.password ? 'text-[#FD6262] peer-hover:text-[#811211]' : 'text-[#637381] peer-hover:text-black'}`} htmlFor="password">รหัสผ่าน</label>
                            </div>

                            <p><a href="#" className='text-2xl text-[#1C252E]'>ลืมรหัสผ่าน?</a></p>

                            <div className='w-full relative my-3'>
                                <input type="submit" value='เข้าสู่ระบบ' className='font-bold cursor-pointer w-full rounded-md outline-none text-[#FBFCFC] bg-[#1C252E]' />
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default page