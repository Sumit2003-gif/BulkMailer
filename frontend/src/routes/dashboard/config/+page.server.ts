import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { API_URL } from '$lib/api';

interface SMTPConfigBody {
    name: string;
    host: string;
    port: number;
    secure: boolean;
    user: string;
    pass: string;
    fromEmail: string;
    fromName: string;
    isDefault: boolean;
}

export const load: PageServerLoad = async ({ fetch }) => {
    try {
        const res = await fetch(`${API_URL}/config/smtp`);
        const result = await res.json();
        return {
            userConfigs: result.userConfigs || [],
            activeConfig: result.data || null
        };
    } catch (err) {
        return { userConfigs: [], activeConfig: null };
    }
};

export const actions: Actions = {
    save: async ({ request, fetch }) => {
        const formData = await request.formData();
        const configId = formData.get('id') as string | null;
        
        const configData: SMTPConfigBody = {
            name: (formData.get('name') as string) || "Default Server",
            host: formData.get('host') as string,
            port: Number(formData.get('port')),
            secure: formData.get('secure') === 'on',
            user: formData.get('user') as string,
            pass: formData.get('pass') as string,
            fromEmail: formData.get('user') as string, 
            fromName: (formData.get('fromName') as string) || "Bulk Mailer",
            isDefault: formData.get('isDefault') === 'on'
        };

        try {
            const url = configId ? `${API_URL}/config/smtp/${configId}` : `${API_URL}/config/smtp`;
            const method = configId ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(configData)
            });

            const result = await res.json();

            if (!res.ok) {
                return fail(res.status, { success: false, message: result.message || "Failed to save settings." });
            }

            return { success: true, message: "SMTP Settings updated successfully! 🎉" };
        } catch (err) {
            return fail(500, { success: false, message: "Backend API is unreachable." });
        }
    },

    test: async ({ request, fetch }) => {
        const formData = await request.formData();
        const testData = {
            host: formData.get('host') as string,
            port: Number(formData.get('port')),
            user: formData.get('user') as string,
            pass: formData.get('pass') as string,
            secure: formData.get('secure') === 'on'
        };

        try {
            const res = await fetch(`${API_URL}/config/smtp/test`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(testData)
            });

            const result = await res.json();
            return { testResult: result };
        } catch (err) {
            return { testResult: { success: false, message: "Test failed: Backend connection error." } };
        }
    },

    delete: async ({ request, fetch }) => {
        const data = await request.formData();
        const id = data.get('id') as string;
        try {
            await fetch(`${API_URL}/config/smtp/${id}`, { method: 'DELETE' });
            return { success: true, message: "Configuration deleted." };
        } catch {
            return fail(500, { message: "Delete failed." });
        }
    }
};