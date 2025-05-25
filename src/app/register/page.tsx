"use client"

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';

interface Province {
    ProvinceID: number
    ProvinceNameTh: string;
}

interface District {
    DistrictID: number;
    DistrictNameTh: string;

    ProvinceID: number
}

interface SubDistrict {
    SubDistrictID: number;
    SubDistrictNameTh: string;

    DistrictID: number;
}

function page() {
    const router = useRouter()

    const [status_form, set_Status_form] = useState({
        shop: true,
        owner: false,
        owner2: false,

        confirm_password: true
    })

    const [warning, set_Warning] = useState({
        //* shop
        shop_name: false,
        shop_address: false,
        province: false,
        districts: false,
        subdistricts: false,

        //* owner
        username: false,
        password: false,
        first_name: false,
        last_name: false,
    })

    const [provinces, set_Provinces] = useState<Province[]>([]);
    const [districts, set_Districts] = useState<District[]>([]);
    const [subdistricts, set_SubDistricts] = useState<SubDistrict[]>([]);

    const [shop_code, set_Shop_code] = useState<String>('');
    const [confirm_password, set_Confirm_password] = useState<String>('');
    const [register_shop, set_Register_shop] = useState({
        Shop_name: '',
        Shop_address: '',
        ProvinceID: 0,
        DistrictID: 0,
        SubDistrictID: 0,

    });

    const [register_owner, set_Register_owner] = useState({
        Owner_username: '',
        Owner_password: '',
        Owner_first_name: '',
        Owner_last_name: '',

    });

    useEffect(() => {
        const fetchData = async () => {
            const res_provinces = await fetch("http://localhost:3000/group/Province-District-SubDistrict");

            const req_provinces: Province[] = await res_provinces.json();
            set_Provinces(req_provinces)

            // const res_job_title = await fetch(`http://localhost:3000/register/setting-code-shop`)
            // const job_title = await res_job_title.json();
            // set_Register_shop((value) => ({ ...value, ShopCode: job_title.Code_of_shop }))

        };

        fetchData()
    }, []);

    const Select_district = async (e: any) => {
        set_Register_shop((value) => ({ ...value, ProvinceID: Number(e.target.value) }))

        const res_district = await fetch(`http://localhost:3000/group/Province-District-SubDistrict?ProvinceID=${e.target.value}`)
        const req_district: District[] = await res_district.json();
        set_Districts(req_district)

        // *Clear data
        set_SubDistricts([])
        set_Register_shop((value) => ({ ...value, DistrictID: 0, SubDistrictID: 0 }))
    }

    const Select_subdistrict = async (e: any) => {
        set_Register_shop((value) => ({ ...value, DistrictID: Number(e.target.value) }))

        const res_subdistrict = await fetch(`http://localhost:3000/group/Province-District-SubDistrict?DistrictID=${e.target.value}`)
        const req_subdistrict: SubDistrict[] = await res_subdistrict.json();
        set_SubDistricts(req_subdistrict)

        // *Clear data
        set_Register_shop((value) => ({ ...value, SubDistrictID: 0 }))
    }

    const submit_shop = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        let status_check: number;
        status_check = 0;

        Object.values(register_shop).forEach((value, key) => {
            const field = Object.keys(warning)[key]

            if (value == 0 || value == '' || value == null) {
                set_Warning((value) => ({ ...value, [field]: true }));

            } else {
                status_check++;
                set_Warning((value) => ({ ...value, [field]: false }));
            }
        });

        if (status_check == 5) {
            //* send body shop to api for register shop.
            const res_shop = await fetch(`http://localhost:3000/register/shop`, {
                method: 'POST',
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify(register_shop)
            });

            const req_shop = await res_shop.json();

            set_Shop_code(req_shop.Shop_code)
            set_Status_form((value) => ({ ...value, shop: false, owner: true }))

        } else {
            alert('please, check your form register shop')
        }
    }

    const submit_owner = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (confirm_password != register_owner.Owner_password) {
            set_Status_form((value) => ({ ...value, confirm_password: true }))

        } else {
            set_Status_form((value) => ({ ...value, confirm_password: false }))

            let status_check: number;
            status_check = 0;

            Object.values(register_owner).forEach((value, key) => {
                const field = Object.keys(warning)[key + 5]

                if (value == '' || value == null) {
                    set_Warning((value) => ({ ...value, [field]: true }));

                } else {
                    status_check++;
                    set_Warning((value) => ({ ...value, [field]: false }));
                }
            })

            if (status_check == 4) {
                //* send body owner to api for register owner
                const res_owner = await fetch(`http://localhost:3000/register/owner?Shop_code=${shop_code}`, {
                    method: 'POST',
                    headers: { 'Content-type': 'application/json' },
                    body: JSON.stringify(register_owner)
                });

                const req_owner = await res_owner.json();

                if (req_owner.username_status) {
                    set_Status_form((value) => ({ ...value, owner: false, owner2: true }))
                    await new Promise((resolve) => setTimeout(resolve, 3000))

                    //* register success
                    alert(req_owner.description);
                    router.push("/sign-in")

                } else {
                    //* register not success
                    //* show alert message "Duplicate username, Please fill in again."
                    alert(req_owner.description);

                };

            } else {
                alert('please, check your form register owner')
            }
        }
    }

    return (
        <>
            <div className='w-full h-screen bg-[#E3EDEF] p-4 box-border flex items-center justify-center'>
                <div className='w-[400px] text-center bg-[#F9FAFB] flex items-center flex-col px-[24px] py-[40px] rounded-2xl'>
                    <h2 className='text-5xl font-medium'>ลงทะเบียน</h2>
                    <div className='w-full my-10'>
                        <div>
                            <div className='flex justify-between items-center'>
                                <p>
                                    <span className='pr-4 pl-1 text-2xl'>ขั้นตอนที่ 1</span>
                                    <span className='text-2xl text-[#637381]'>ลงทะเบียนร้านค้า</span>
                                </p>
                                <div className={`w-[20px] h-[20px] border-2 ${status_form.shop ? 'border-[#F8A01E]' : 'border-[#64D579]'}`} style={{ borderRadius: '44% 56% 48% 52% / 55% 40% 60% 45%' }}></div>
                            </div>

                            {status_form.shop &&
                                <form onSubmit={submit_shop} style={{ width: "100%" }}>
                                    <div className='relative w-full flex my-5'>
                                        <input
                                            type="text"
                                            id='shop_name'
                                            className='w-full text-3xl px-3 py-2 border border-[#E4E8EB] rounded-md outline-none box-border peer hover:border-black focus:border-2 focus:border-[#1877F2]'
                                            onChange={(e) => set_Register_shop((value) => ({ ...value, Shop_name: e.target.value }))}
                                        />
                                        <label htmlFor="shop_name" className='absolute text-2xl text-[#637381] bg-[#F9FAFB] px-1 top-[-15px] left-[10px] peer-hover:text-black peer-focus:text-[#1877F2]'>ชื่อร้าน</label>
                                    </div>

                                    <div className='relative w-full flex my-7'>
                                        <select
                                            name=""
                                            id="province"
                                            className='w-full text-3xl px-3 py-2 border border-[#E4E8EB] rounded-md outline-none box-border peer hover:border-black focus:border-2 focus:border-[#1877F2]'
                                            onChange={Select_district}
                                        >
                                            <option></option>
                                            {provinces.map((province) => (
                                                <option key={province.ProvinceID} value={province.ProvinceID}>{province.ProvinceNameTh}</option>
                                            ))}
                                        </select>
                                        <label htmlFor="province" className='absolute text-2xl text-[#637381] bg-[#F9FAFB] px-1 top-[-15px] left-[10px] peer-hover:text-black peer-focus:text-[#1877F2]'>จังหวัด</label>
                                    </div>

                                    <div className='relative w-full flex my-7'>
                                        <select
                                            name=""
                                            id="district"
                                            className='w-full text-3xl px-3 py-2 border border-[#E4E8EB] rounded-md outline-none box-border peer hover:border-black focus:border-2 focus:border-[#1877F2]'
                                            onChange={Select_subdistrict}
                                        >
                                            <option></option>
                                            {districts.map((district) => (
                                                <option key={district.DistrictID} value={district.DistrictID}>{district.DistrictNameTh}</option>
                                            ))}
                                        </select>
                                        <label htmlFor="district" className='absolute text-2xl text-[#637381] bg-[#F9FAFB] px-1 top-[-15px] left-[10px] peer-hover:text-black peer-focus:text-[#1877F2]'>อำเภอ</label>
                                    </div>

                                    <div className='relative w-full flex my-7'>
                                        <select
                                            name=""
                                            id="sub_district"
                                            className='w-full text-3xl px-3 py-2 border border-[#E4E8EB] rounded-md outline-none box-border peer hover:border-black focus:border-2 focus:border-[#1877F2]'
                                            onChange={(e) => set_Register_shop((value) => ({ ...value, SubDistrictID: Number(e.target.value) }))}
                                        >
                                            <option></option>
                                            {subdistricts.map((subdistrict) => (
                                                <option key={subdistrict.SubDistrictID} value={subdistrict.SubDistrictID}>{subdistrict.SubDistrictNameTh}</option>
                                            ))}
                                        </select>
                                        <label htmlFor="sub_district" className='absolute text-2xl text-[#637381] bg-[#F9FAFB] px-1 top-[-15px] left-[10px] peer-hover:text-black peer-focus:text-[#1877F2]'>ตำบล</label>
                                    </div>

                                    <div className='relative w-full flex my-7'>
                                        <input
                                            type="text"
                                            id='address'
                                            className='w-full text-3xl px-3 py-2 border border-[#E4E8EB] rounded-md outline-none box-border peer hover:border-black focus:border-2 focus:border-[#1877F2]'
                                            onChange={(e) => set_Register_shop((value) => ({ ...value, Shop_address: e.target.value }))}
                                        />
                                        <label htmlFor="address" className='absolute text-2xl text-[#637381] bg-[#F9FAFB] px-1 top-[-15px] left-[10px] peer-hover:text-black peer-focus:text-[#1877F2]'>ที่อยู่</label>
                                    </div>

                                    <div className='relative w-full flex my-7' style={{ marginBottom: '0' }}>
                                        <input
                                            type="submit"
                                            value="ต่อไป"
                                            className='w-full text-3xl text-[#FBFCFC] py-3 rounded-md outline-none box-border cursor-pointer font-semibold bg-[#1C252E]'
                                        />
                                    </div>
                                </form>
                            }

                        </div>
                        <hr className='border-none h-[1px] bg-[#808080] my-4' />
                        <div>
                            <div className='flex justify-between items-center'>
                                <p>
                                    <span className='pr-4 pl-1 text-2xl'>ขั้นตอนที่ 2</span>
                                    <span className='text-2xl text-[#637381]'>ลงทะเบียนผู้จัดการร้าน</span>
                                </p>
                                <div className={`w-[20px] h-[20px] border-2 ${status_form.owner ? '' : 'border-[#F8A01E]'} ${status_form.owner2 ? 'border-[#64D579]' : 'border-[#F8A01E]'} `} style={{ borderRadius: '44% 56% 48% 52% / 55% 40% 60% 45%' }}></div>
                            </div>

                            {status_form.owner &&
                                <form onSubmit={submit_owner} style={{ width: "100%" }}>
                                    <div className='relative w-full flex my-5'>
                                        <input type="text" value={`${shop_code}`} readOnly id='shop_code' className='w-full text-3xl px-3 py-2 border border-[#E4E8EB] rounded-md outline-none box-border' />
                                        <label htmlFor="shop_code" className='absolute text-2xl text-[#637381] bg-[#F9FAFB] px-1 top-[-15px] left-[10px]'>รหัสร้าน</label>
                                    </div>

                                    <div className='relative w-full flex my-5'>
                                        <input
                                            type="text"
                                            id='first_name'
                                            className='w-full text-3xl px-3 py-2 border border-[#E4E8EB] rounded-md outline-none box-border peer hover:border-black focus:border-2 focus:border-[#1877F2]'
                                            onChange={(e) => set_Register_owner((value) => ({ ...value, Owner_first_name: e.target.value }))}
                                        />
                                        <label htmlFor="first_name" className='absolute text-2xl text-[#637381] bg-[#F9FAFB] px-1 top-[-15px] left-[10px] peer-hover:text-black peer-focus:text-[#1877F2]'>ชื่อ</label>
                                    </div>

                                    <div className='relative w-full flex my-5'>
                                        <input
                                            type="text"
                                            id='last_name'
                                            className='w-full text-3xl px-3 py-2 border border-[#E4E8EB] rounded-md outline-none box-border peer hover:border-black focus:border-2 focus:border-[#1877F2]'
                                            onChange={(e) => set_Register_owner((value) => ({ ...value, Owner_last_name: e.target.value }))}
                                        />
                                        <label htmlFor="last_name" className='absolute text-2xl text-[#637381] bg-[#F9FAFB] px-1 top-[-15px] left-[10px] peer-hover:text-black peer-focus:border-[#1877F2]'>นามสกุล</label>
                                    </div>

                                    <div className='relative w-full flex my-5'>
                                        <input
                                            type="text"
                                            id='username'
                                            className='w-full text-3xl px-3 py-2 border border-[#E4E8EB] rounded-md outline-none box-border peer hover:border-black focus:border-2 focus:border-[#1877F2]'
                                            onChange={(e) => set_Register_owner((value) => ({ ...value, Owner_username: e.target.value }))}
                                        />
                                        <label htmlFor="username" className='absolute text-2xl text-[#637381] bg-[#F9FAFB] px-1 top-[-15px] left-[10px] peer-hover:text-black peer-focus:border-black'>บัญชีผู้ใช้งาน</label>
                                    </div>

                                    <div className='relative w-full flex my-5'>
                                        <input
                                            type="password"
                                            id='password'
                                            className={`w-full text-3xl px-3 py-2 border border-[#E4E8EB] rounded-md outline-none box-border peer hover:border-black focus:border-2 focus:border-[#1877F2] ${status_form.confirm_password ? '' : 'border-[#FD6262]'}`}
                                            onChange={(e) => set_Register_owner((value) => ({ ...value, Owner_password: e.target.value }))}
                                        />
                                        <label htmlFor="password" className='absolute text-2xl text-[#637381] bg-[#F9FAFB] px-1 top-[-15px] left-[10px] peer-hover:text-black peer-focus:text-[#1877F2]'>รหัสผ่าน</label>
                                    </div>

                                    <div className='relative w-full flex my-5'>
                                        <input
                                            type="password"
                                            id='confirm_password'
                                            className={`w-full text-3xl px-3 py-2 border border-[#E4E8EB] rounded-md outline-none box-border peer hover:border-black focus:border-2 focus:border-[#1877F2] ${status_form.confirm_password ? '' : 'border-[#FD6262]'}`}
                                            onChange={(e) => set_Confirm_password(e.target.value)}
                                        />
                                        <label htmlFor="confirm_password" className='absolute text-2xl text-[#637381] bg-[#F9FAFB] px-1 top-[-15px] left-[10px] peer-hover:text-black peer-focus:text-[#1877F2]'>ยืนยันรหัสผ่าน</label>
                                    </div>

                                    <div className='relative w-full flex my-5' style={{ marginBottom: '0' }}>
                                        <input
                                            type="submit"
                                            value='ลงทะเบียน'
                                            className='w-full text-3xl text-[#FBFCFC] py-3 rounded-md outline-none box-border cursor-pointer font-semibold bg-[#1C252E]'
                                        />
                                    </div>
                                </form>
                            }
                        </div>
                    </div>
                    {status_form.owner2 &&
                        <div>
                            <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                            </svg>
                            <span className="sr-only">Loading...</span>
                        </div>
                    }
                </div >
            </div >
        </>
    )
}

export default page