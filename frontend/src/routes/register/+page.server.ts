import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { API_URL } from '$lib/api';

export const actions: Actions = {
    default: async ({ request, cookies }) => {
        const data = await request.formData();
        const name = data.get('name');
        const email = data.get('email');
        const password = data.get('password');

        // Validation logic
        if (!name || !email || !password) {
            return fail(400, { message: 'All fields are required' });
        }

        let registrationData;
        
        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });

            registrationData = await response.json();
            console.log("Register Result=>", registrationData);

            if (!registrationData.success) {
                return fail(400, { message: registrationData.message || 'Registration failed' });
            }
        } catch (err) {
            console.error("Fetch error:", err);
            return fail(500, { message: 'Server connection failed' });
        }

        // --- SUCCESS LOGIC (Outside Try-Catch) ---
        
        if (registrationData.success && registrationData.token) {
            cookies.set('session_token', registrationData.token, {
                path: '/',
                httpOnly: true,
                sameSite: 'none', // Required for Vercel -> Render
                secure: true,     // Mandatory when sameSite is 'none'
                maxAge: 60 * 60 * 24 
            });
            throw redirect(303, '/dashboard');
        }

        // If no token, just go to login
        throw redirect(303, '/login?registered=true');
    }
};