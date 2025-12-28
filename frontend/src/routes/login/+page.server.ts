import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { API_URL } from '$lib/api';
import { dev } from '$app/environment';

export const actions: Actions = {
    default: async ({ request, cookies }) => {
        const data = await request.formData();
        const email = data.get('email');
        const password = data.get('password');

        if (!email || !password) {
            return fail(400, { message: 'Email and password are required' });
        }

        let loginSuccess = false;

        try {
            // Check: Kya API_URL mein trailing slash to nahi?
            const loginEndpoint = `${API_URL.replace(/\/$/, '')}/auth/login`;
            console.log(`📡 Sending login request to: ${loginEndpoint}`);

            const response = await fetch(loginEndpoint, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const result = await response.json();

            if (result.success && result.token) {
                // IMPORTANT FIX: Vercel (Frontend) aur Render (Backend) alag domains hain
                // Isliye 'none' aur 'secure: true' hona MUST hai
                cookies.set('session_token', result.token, {
                    path: '/',
                    httpOnly: true,
                    // 'lax' sirf same-domain pe chalta hai, live ke liye 'none' karein
                    sameSite: 'lax', 
                    // 'none' ke bina 'secure: true' browser reject kar dega
                    secure: true, 
                    maxAge: 60 * 60 * 24 // 1 day
                });
                loginSuccess = true;
            } else {
                return fail(401, { message: result.message || 'Invalid email or password' });
            }
        } catch (err: any) {
            console.error("❌ Login Action Error:", err);
            return fail(500, { message: 'Backend is sleeping or connection failed. Check Render logs.' });
        }

        // IMPORTANT: Redirect hamesha try-catch se bahar rakhein
        if (loginSuccess) {
            throw redirect(303, '/dashboard');
        }
    }
};