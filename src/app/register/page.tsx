"use client"

import React, { useEffect, useState } from 'react'
import './page.scss';

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
    const [status_form, set_Status_form] = useState({
        shop: true,
        owner: false,
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

        // fetchData()
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

        if (confirm_password != register_owner.Owner_username) {

        } else {
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
                    //* register success
                    alert(req_owner.description);

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
            <div className='container_1'>
                <div className='container_2'>
                    <h2>Register</h2>
                    <div className='container_3'>
                        <div className='form'>
                            <div className='step-header'>
                                <p>
                                    <span style={{ paddingRight: "1rem", fontWeight: "800", fontSize: "18px" }}>Step 1</span>
                                    <span style={{ fontSize: "16px", color: "#637381" }}>Register shop</span>
                                </p>
                                <div className={`status-shop-form ${status_form.shop ? "" : "active"}`}></div>
                            </div>

                            {status_form.shop &&
                                <form onSubmit={submit_shop} style={{ width: "100%" }}>
                                    <div className='input-box'>
                                        <input type="text" id='shop_name'
                                            onChange={(e) => set_Register_shop((value) => ({ ...value, Shop_name: e.target.value }))}
                                        />
                                        <label htmlFor="shop_name">Shop name</label>
                                    </div>

                                    <div className='input-box'>
                                        <select name="" id="province"
                                            onChange={Select_district}
                                        >
                                            <option></option>
                                            {provinces.map((province) => (
                                                <option key={province.ProvinceID} value={province.ProvinceID}>{province.ProvinceNameTh}</option>
                                            ))}
                                        </select>
                                        <label htmlFor="province">Province</label>
                                    </div>

                                    <div className='input-box'>
                                        <select name="" id="district"
                                            onChange={Select_subdistrict}
                                        >
                                            <option></option>
                                            {districts.map((district) => (
                                                <option key={district.DistrictID} value={district.DistrictID}>{district.DistrictNameTh}</option>
                                            ))}
                                        </select>
                                        <label htmlFor="district">District</label>
                                    </div>

                                    <div className='input-box'>
                                        <select name="" id="sub_district"
                                            onChange={(e) => set_Register_shop((value) => ({ ...value, SubDistrictID: Number(e.target.value) }))}
                                        >
                                            <option></option>
                                            {subdistricts.map((subdistrict) => (
                                                <option key={subdistrict.SubDistrictID} value={subdistrict.SubDistrictID}>{subdistrict.SubDistrictNameTh}</option>
                                            ))}
                                        </select>
                                        <label htmlFor="sub_district">Sub district</label>
                                    </div>

                                    <div className='input-box'>
                                        <input type="text" id='address'
                                            onChange={(e) => set_Register_shop((value) => ({ ...value, Shop_address: e.target.value }))}
                                        />
                                        <label htmlFor="address">Address</label>
                                    </div>

                                    <div className='input-box' style={{ marginBottom: '0' }}>
                                        <input type="submit" value="Next step" style={{ fontWeight: "600", cursor: 'pointer' }} />
                                    </div>
                                </form>
                            }

                        </div>
                        <hr />
                        <div className='form'>
                            <div className='step-header'>
                                <p>
                                    <span style={{ paddingRight: "1rem", fontWeight: "800", fontSize: "18px" }}>Step 2</span>
                                    <span style={{ fontSize: "16px", color: "#637381" }}>Register owner</span>
                                </p>
                                <div className={`status-owner-form ${status_form.owner ? "" : "active"}`}></div>
                            </div>

                            {status_form.owner &&
                                <form onSubmit={submit_owner} style={{ width: "100%" }}>
                                    <div className='input-box'>
                                        <input type="text" value={`${shop_code}`} id='shop_code' />
                                        <label htmlFor="shop_code">Shop code</label>
                                    </div>

                                    <div className='input-box'>
                                        <input type="text" id='first_name'
                                            onChange={(e) => set_Register_owner((value) => ({ ...value, Owner_first_name: e.target.value }))}
                                        />
                                        <label htmlFor="first_name">First name</label>
                                    </div>

                                    <div className='input-box'>
                                        <input type="text" id='last_name'
                                            onChange={(e) => set_Register_owner((value) => ({ ...value, Owner_last_name: e.target.value }))}
                                        />
                                        <label htmlFor="last_name">Last name</label>
                                    </div>

                                    <div className='input-box'>
                                        <input type="text" id='username'
                                            onChange={(e) => set_Register_owner((value) => ({ ...value, Owner_username: e.target.value }))}
                                        />
                                        <label htmlFor="username">Username</label>
                                    </div>

                                    <div className='input-box'>
                                        <input type="password" id='password'
                                            onChange={(e) => set_Register_owner((value) => ({ ...value, Owner_password: e.target.value }))}
                                        />
                                        <label htmlFor="password">Password</label>
                                    </div>

                                    <div className='input-box'>
                                        <input type="password" id='confirm_password'
                                            onChange={(e) => set_Confirm_password(e.target.value)}
                                        />
                                        <label htmlFor="confirm_password">Confirm Password</label>
                                    </div>

                                    <div className='input-box' style={{ marginBottom: '0' }}>
                                        <input type="submit" style={{ fontWeight: "600", cursor: 'pointer' }} />
                                    </div>
                                </form>
                            }
                        </div>
                    </div>
                </div >
            </div >
        </>
    )
}

export default page