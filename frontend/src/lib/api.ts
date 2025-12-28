// import { PUBLIC_BACKEND_URL } from '$env/static/public';
import { dev } from '$app/environment';

// const PUBLIC_BACKEND_URL =  

// console.log("Backend_Url=>",PUBLIC_BACKEND_URL)
export const API_URL =  'http://localhost:3000';

const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    const res = await fetch(`${API_URL}${url}`, {
        ...options,
        credentials: 'include', 
        headers: {
            ...options.headers,
            ...(options.body && !(options.body instanceof FormData) 
                ? { 'Content-Type': 'application/json' } 
                : {})
        }
    });
    
    return res.json();
};

export const campaignAPI = {
    // 1. Live Stats & Polling
    getStatus: () => fetchWithAuth('/dashboard/poll-status'),
    getDashboardData: () => fetchWithAuth('/dashboard/data'),

    // 2. Batch Controls
    pause: () => fetchWithAuth('/batch-pause', { method: 'POST' }),
    resume: () => fetchWithAuth('/batch-resume', { method: 'POST' }),
    cancel: () => fetchWithAuth('/batch-cancel', { method: 'DELETE' }),

    // 3. Scheduling
    getScheduled: () => fetchWithAuth('/scheduled-jobs'),
    deleteScheduled: (id: string) => fetchWithAuth(`/scheduled-jobs/${id}`, { method: 'DELETE' }),

    // 4. Excel Parsing
    parseExcel: (formData: FormData) => fetchWithAuth('/parse-excel', {
        method: 'POST',
        body: formData,
    }),

    // 5. SMTP Test & Provider Info
    testNotification: (testEmail: string) => fetchWithAuth('/test-notification', {
        method: 'POST',
        body: JSON.stringify({ testEmail })
    }),

    getProviderInfo: (smtpHost: string, hasNotification: boolean = false) => {
        const formData = new FormData();
        formData.append('smtpHost', smtpHost);
        formData.append('hasNotification', String(hasNotification));
        
        return fetchWithAuth('/provider-info', {
            method: 'POST',
            body: formData
        });
    }
};