"use client"

import React, { useEffect, useState } from 'react'

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
    const [register_shop, set_Register_shop] = useState({
        ShopName: '',
        ShopAddress: '',
        ProvinceID: 0,
        DistrictID: 0,
        SubDistrictID: 0,

    });

    const [register_owner, set_Register_owner] = useState({
        OwnerUsername: '',
        OwnerPassword: '',
        OwnerFirstname: '',
        OwnerLastname: '',

    });

    useEffect(() => {
        const fetchData = async () => {
            const res_provinces = await fetch("http://localhost:3000/group/Province-District-SubDistrict");

            const req_provinces: Province[] = await res_provinces.json();
            set_Provinces(req_provinces)

            // const res_job_title = await fetch(`http://localhost:3000/register/setting-code-shop`)
            // const job_title = await res_job_title.json();
            // set_Register_shop((selectValue) => ({ ...selectValue, ShopCode: job_title.Code_of_shop }))

        };

        fetchData()
    }, []);

    const Select_district = async (e: any) => {
        set_Register_shop((selectValue) => ({ ...selectValue, ProvinceID: Number(e.target.value) }))

        const res_district = await fetch(`http://localhost:3000/group/Province-District-SubDistrict?ProvinceID=${e.target.value}`)
        const req_district: District[] = await res_district.json();
        set_Districts(req_district)

        // *Clear data
        set_SubDistricts([])
        set_Register_shop((selectValue) => ({ ...selectValue, DistrictID: 0, SubDistrictID: 0 }))
    }

    const Select_subdistrict = async (e: any) => {
        set_Register_shop((selectValue) => ({ ...selectValue, DistrictID: Number(e.target.value) }))

        const res_subdistrict = await fetch(`http://localhost:3000/group/Province-District-SubDistrict?DistrictID=${e.target.value}`)
        const req_subdistrict: SubDistrict[] = await res_subdistrict.json();
        set_SubDistricts(req_subdistrict)

        // *Clear data
        set_Register_shop((selectValue) => ({ ...selectValue, SubDistrictID: 0 }))
    }

    const submit_shop = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        let status_check: number;
        status_check = 0;

        Object.values(register_shop).forEach((value, key) => {
            const field = Object.keys(warning)[key]

            if (value == 0 || value == '' || value == null) {
                set_Warning((selectValue) => ({ ...selectValue, [field]: true }));

            } else {
                status_check++;
                set_Warning((selectValue) => ({ ...selectValue, [field]: false }));
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

            set_Shop_code(req_shop.ShopCode)
            set_Status_form((value) => ({ ...value, shop: false, owner: true }))

        } else {
            alert('please, check your form register shop')
        }
    }

    const submit_owner = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        let status_check: number;
        status_check = 0;

        Object.values(register_owner).forEach((value, key) => {
            const field = Object.keys(warning)[key + 5]

            if (value == '' || value == null) {
                set_Warning((selectValue) => ({ ...selectValue, [field]: true }));

            } else {
                status_check++;
                set_Warning((selectValue) => ({ ...selectValue, [field]: false }));
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

    return (
        <div>
            {status_form.shop &&
                <form onSubmit={submit_shop}>
                    <h2>Shop</h2>
                    <label htmlFor="Shop_name">Shop name :</label>
                    <input
                        type="text"
                        id='Shop_name'
                        onChange={(e) => set_Register_shop((selectValue) => ({ ...selectValue, ShopName: e.target.value }))}
                    /><br />

                    <label htmlFor="Address">Address :</label>
                    <input
                        type="text"
                        id='Address'
                        onChange={(e) => set_Register_shop((selectValue) => ({ ...selectValue, ShopAddress: e.target.value }))}
                    /><br />

                    <label htmlFor="Province">Province :</label>
                    <select name="" id="Province" onChange={Select_district}>
                        <option></option>
                        {provinces.map((province) => (
                            <option key={province.ProvinceID} value={province.ProvinceID}>{province.ProvinceNameTh}</option>
                        ))}
                    </select><br />

                    <label htmlFor="District">District :</label>
                    <select name="" id="District" onChange={Select_subdistrict}>
                        <option></option>
                        {districts.map((district) => (
                            <option key={district.DistrictID} value={district.DistrictID}>{district.DistrictNameTh}</option>
                        ))}
                    </select><br />

                    <label htmlFor="SubDistrict">SubDistrict :</label>
                    <select name="" id="SubDistrict" onChange={(e) => set_Register_shop((selectValue) => ({ ...selectValue, SubDistrictID: Number(e.target.value) }))}>
                        <option></option>
                        {subdistricts.map((subdistrict) => (
                            <option key={subdistrict.SubDistrictID} value={subdistrict.SubDistrictID}>{subdistrict.SubDistrictNameTh}</option>
                        ))}
                    </select><br />

                    <input type='submit' />
                </form>
            }

            {status_form.owner &&
                <form onSubmit={submit_owner}>
                    <h2>Owner</h2>
                    <label htmlFor="Shop_code">Shop code</label>
                    <input type="text" value={`${shop_code}`} readOnly /><br />

                    <label htmlFor="First_name">First name</label>
                    <input
                        type="text"
                        id="First_name"
                        onChange={(e) => set_Register_owner((selectValue) => ({ ...selectValue, OwnerFirstname: e.target.value }))}
                    /><br />

                    <label htmlFor="Last_name">Last name</label>
                    <input
                        type="text"
                        id="Last_name"
                        onChange={(e) => set_Register_owner((selectValue) => ({ ...selectValue, OwnerLastname: e.target.value }))}
                    /><br />

                    <label htmlFor="Username">Username</label>
                    <input
                        type="text"
                        id="Username"
                        onChange={(e) => set_Register_owner((selectValue) => ({ ...selectValue, OwnerUsername: e.target.value }))}
                    /><br />

                    <label htmlFor="Password">Password</label>
                    <input
                        type="password"
                        id="Password"
                        onChange={(e) => set_Register_owner((selectValue) => ({ ...selectValue, OwnerPassword: e.target.value }))}
                    /><br />

                    <input type='submit' />
                </form>
            }
        </div>
    )
}

export default page