import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { API_URL } from '$lib/api';

export const actions: Actions = {
    default: async ({ cookies, fetch }) => {
        const token = cookies.get('session_token');

        if (token) {
            try {
                // 1. Backend ko notify karein (Session delete karne ke liye)
                await fetch(`${API_URL}/auth/logout`, {
                    method: 'POST',
                    headers: {
                        'Cookie': `session_token=${token}`
                    }
                });
            } catch (err) {
                console.error("Logout Backend Error:", err);
            }
        }

        // 2. Browser se cookie delete karein
        cookies.delete('session_token', { path: '/' });

        // 3. Login par bhej dein
        throw redirect(303, '/login');
    }
};