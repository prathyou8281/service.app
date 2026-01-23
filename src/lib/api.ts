const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export async function apiRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${BASE_URL}${endpoint}`;

    const headers = {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
    };

    const response = await fetch(url, {
        ...options,
        headers,
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
    }

    return data;
}

export const authApi = {
    adminLogin: (credentials: any) =>
        apiRequest('/auth/admin/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        }),
    vendorLogin: (credentials: any) =>
        apiRequest('/auth/vendor/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        }),
    technicianLogin: (credentials: any) =>
        apiRequest('/auth/technician/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        }),
    userLogin: (credentials: any) =>
        apiRequest('/auth/user/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        }),
    userRegister: (data: any) =>
        apiRequest('/auth/user/register', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
};
