import type { PageServerLoad } from './$types';
import { API_URL } from '$lib/api';

export const load: PageServerLoad = async ({ fetch }) => {
    try {
        const res = await fetch(`${API_URL}/scheduled-jobs`);
        const result = await res.json();
        console.log("Result..=>",result)
        
        return {
            initialJobs: result.success ? result.data : []
        };
    } catch (err) {
        console.error("Load error:", err);
        return { initialJobs: [] };
    }
};