import { redirect, type Handle } from '@sveltejs/kit';
import { API_URL } from '$lib/api';

export const handle: Handle = async ({ event, resolve }) => {
    const token = event.cookies.get('session_token');
    const { pathname } = event.url;

    // 1. Agar token hai aur user locals set nahi hai, toh info fetch karein
    if (token && !event.locals.user) {
        try {
            const response = await fetch(`${API_URL}/auth/me`, {
                headers: {
                    'Cookie': `session_token=${token}`
                }
            });
            const result = await response.json();

            if (result.success) {
                event.locals.user = result.user;
            } else {
                // Token invalid hai toh uda do
                event.cookies.delete('session_token', { path: '/' });
            }
        } catch (err) {
            console.error("Auth Hook Error:", err);
        }
    }

    // 2. DASHBOARD PROTECTION
    // Agar user dashboard pe jana chahta hai par login nahi hai
    if (pathname.startsWith('/dashboard') && !event.locals.user) {
        throw redirect(302, '/login');
    }

    // 3. AUTH PAGE PROTECTION (Reverse Guard)
    // Agar user login/register pe jana chahta hai par pehle se login hai
    if ((pathname === '/login' || pathname === '/register') && event.locals.user) {
        throw redirect(302, '/dashboard');
    }

    return resolve(event);
};