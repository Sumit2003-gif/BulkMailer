import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { API_URL } from '$lib/api';

export const actions: Actions = {
    default: async ({ request, fetch, cookies }) => {
        const token = cookies.get('session_token');
        if (!token) throw redirect(302, '/login');

        const data = await request.formData();
        const csvFile = data.get('csvFile') as File;
        const subject = data.get('subject') as string;
        const message = data.get('message') as string;
        const notifyEmail = data.get('notifyEmail') as string; // <--- 1. Data Capture

        if (!csvFile || csvFile.size === 0) {
            return fail(400, { message: "Please upload a valid contacts file." });
        }

        const backendData = new FormData();
        backendData.append('excelFile', csvFile);
        backendData.append('subject', subject);
        backendData.append('htmlContent', message);
        backendData.append('notifyEmail', notifyEmail); // <--- 2. Forward to Backend
        backendData.append('delay', '5'); 
        backendData.append('useBatch', 'false');
        backendData.append('emailDelay', '1');

        try {
            const response = await fetch(`${API_URL}/send`, {
                method: 'POST',
                headers: {
                    'Cookie': `session_token=${token}`
                },
                body: backendData
            });

            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                return fail(500, { message: "Backend error: Received non-JSON response." });
            }

            const result = await response.json();
            
            if (result.success) {
                return { 
                    success: true, 
                    message: "Campaign successfully started! Report will be sent to " + (notifyEmail || "your email"),
                    count: result.totalProcessed || 0
                };
            } else {
                return fail(response.status || 400, { 
                    message: result.message || "Failed to start campaign." 
                });
            }
        } catch (err) {
            console.error("Campaign Launch Error:", err);
            return fail(500, { message: "Server unreachable." });
        }
    }
};