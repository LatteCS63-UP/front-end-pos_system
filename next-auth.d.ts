import 'next-auth';
declare module 'next-auth' {
    interface User {
        owner_id: number;
        shop_id: number;
        status_login: string;

        employee_id: number;
    }

    interface Session {
        owner_id: number;
        shop_id: number;
        status_login: string;

        employee_id: number;

        user?: {
            owner_id: number;
            shop_id: number;
            status_login: string;

            employee_id: number;
        }
    }
}