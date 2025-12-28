import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ locals }) => {
    // Agar user logged in nahi hai, toh login page par bhej do
    if (!locals.user) {
        throw redirect(302, '/login');
    }

    return {
        user: locals.user
    };
};