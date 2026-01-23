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

export const adminApi = {
    getUsers: (role: string) =>
        apiRequest(`/admins/users/${role}`, {
            headers: typeof window !== 'undefined' ? { Authorization: `Bearer ${localStorage.getItem('access_token')}` } : {}
        }),
    updateUser: (role: string, id: number, data: any) =>
        apiRequest(`/admins/users/${role}/${id}`, {
            method: 'PUT',
            headers: typeof window !== 'undefined' ? { Authorization: `Bearer ${localStorage.getItem('access_token')}` } : {},
            body: JSON.stringify(data),
        }),
    deleteUser: (role: string, id: number) =>
        apiRequest(`/admins/users/${role}/${id}`, {
            method: 'DELETE',
            headers: typeof window !== 'undefined' ? { Authorization: `Bearer ${localStorage.getItem('access_token')}` } : {},
        }),
    updateStatus: (role: string, id: number, status: string) =>
        apiRequest(`/admins/users/${role}/${id}/status`, {
            method: 'PUT',
            headers: typeof window !== 'undefined' ? { Authorization: `Bearer ${localStorage.getItem('access_token')}` } : {},
            body: JSON.stringify({ status }),
        }),
};
