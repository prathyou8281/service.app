'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api';

export default function AdminLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await authApi.adminLogin({ email, password });

            setSuccess('Login successful! Redirecting...');

            // Store admin data in localStorage (Matches dashboard expectation)
            const userData = {
                username: response.admin.name,
                email: response.admin.email,
                role: "admin",
            };
            localStorage.setItem('userData', JSON.stringify(userData));
            localStorage.setItem('access_token', response.admin.access_token);

            // Set cookie for middleware
            document.cookie = `userData=${JSON.stringify({
                username: response.admin.name,
                role: "admin",
            })}; path=/; max-age=86400; SameSite=Lax`;

            // Redirect to admin dashboard after short delay
            setTimeout(() => {
                router.push('/admin/dashboard');
            }, 1500);
        } catch (err: any) {
            setError(err.message || 'Invalid email or password');
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 to-indigo-300">
            <div className="card w-full max-w-md p-8">
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Admin Portal</h1>
                    <p className="text-gray-600">Login to manage your services</p>
                </div>

                {error && <div className="text-red-600 mb-4 text-center">{error}</div>}
                {success && <div className="text-green-600 mb-4 text-center">{success}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            className="form-input w-full"
                            placeholder="admin@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoComplete="email"
                        />
                    </div>

                    <div className="space-y-1">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            id="password"
                            className="form-input w-full"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            autoComplete="current-password"
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn-primary w-full flex items-center justify-center"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="loader mr-2"></span>Logging in...
                            </>
                        ) : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
}
