<script lang="ts">
    import { onMount } from 'svelte';
    import { API_URL } from '$lib/api';
    import { fade } from 'svelte/transition';

    interface EmailLog {
        email: string;
        status: string;
        createdAt: string;
    }

    let reports = $state<EmailLog[]>([]);
    let isLoading = $state(true);

    async function fetchReports() {
        try {
            const response = await fetch(`${API_URL}/report`, {
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' }
            });
            const result = await response.json();
            
            if (result.success) {
                // Backend se data nikaalte waqt dhyan dein ki 
                // logs kahan hain (result.data.logs ya direct result.data)
                reports = result.data.logs || [];
            }
        } catch (e) {
            console.error("Failed to load reports", e);
        } finally {
            isLoading = false;
        }
    }

    onMount(() => {
        fetchReports();
    });
</script>
<div class="p-6 space-y-6" in:fade>
    <div class="flex items-center justify-between">
        <div>
            <h1 class="text-3xl font-black text-slate-900">Campaign Logs</h1>
            <p class="text-slate-500 font-medium">Detailed delivery reports for your emails.</p>
        </div>
    </div>

    {#if isLoading}
        <div class="flex justify-center py-20">
            <div class="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
    {:else if reports.length === 0}
        <div class="bg-white border border-dashed border-slate-300 rounded-[2rem] p-20 text-center">
            <p class="text-slate-400 font-bold">No logs found. Start a campaign to see results.</p>
        </div>
    {:else}
        <div class="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm overflow-hidden">
            <table class="w-full text-left border-collapse">
                <thead class="bg-slate-50 border-b border-slate-100">
                    <tr>
                        <th class="p-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Recipient</th>
                        <th class="p-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                        <th class="p-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Timestamp</th>
                    </tr>
                </thead>
                <tbody>
                    {#each reports as log}
                        <tr class="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                            <td class="p-5">
                                <span class="font-bold text-slate-700">{log.email}</span>
                            </td>
                            <td class="p-5">
                                <span class="px-3 py-1 rounded-full text-[10px] font-black uppercase 
                                    {log.status === 'sent' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}">
                                    {log.status}
                                </span>
                            </td>
                            <td class="p-5 text-slate-400 text-sm">
                                {new Date(log.createdAt).toLocaleString()}
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    {/if}

    <a href="/dashboard" class="inline-block text-blue-600 font-bold hover:underline">← Back to Dashboard</a>
</div>