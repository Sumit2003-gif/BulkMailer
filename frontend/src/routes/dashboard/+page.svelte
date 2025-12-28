<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { API_URL } from '$lib/api';
    import { fade } from 'svelte/transition';

    let stats = $state({ sent: 0, active: 0, failed: 0, isRunning: false });
    let isInitialLoading = $state(true); 
    let pollTimer: any = null;
    let errorMessage = $state("");

    async function secureFetch(endpoint: string, options: RequestInit = {}) {
        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                ...options,
                credentials: 'include',
                headers: { 'Content-Type': 'application/json', ...options.headers }
            });
            if (response.status === 401) { window.location.href = '/login'; return null; }
            return await response.json();
        } catch (err) { return null; }
    }

    async function updateDashboard() {
        if (pollTimer) clearTimeout(pollTimer);
        const statusRes = await secureFetch('/campaign/status');
        if (statusRes?.success && statusRes.data) {
            stats.active = statusRes.data.activeBatchCount ?? 0;
            stats.isRunning = statusRes.data.hasActiveBatch ?? false;
        }
        const reportRes = await secureFetch('/report');
        if (reportRes?.success && reportRes.data?.stats) {
            stats.sent = reportRes.data.stats.sent || 0;
            stats.failed = reportRes.data.stats.failed || 0;
        }
        isInitialLoading = false; 
        pollTimer = setTimeout(updateDashboard, 5000);
    }

    async function handleAction(action: string) {
        const result = await secureFetch(`/campaign/${action}`, { method: 'POST' });
        if (result?.success) await updateDashboard();
        else {
            errorMessage = result?.message || "Action failed";
            setTimeout(() => errorMessage = "", 3000);
        }
    }

    onMount(updateDashboard);
    onDestroy(() => clearTimeout(pollTimer));
</script>

{#if isInitialLoading}
    <div class="h-[70vh] flex flex-col items-center justify-center"><div class="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>
{:else}
    <div class="space-y-6 md:space-y-8 p-2" in:fade>
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h1 class="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Overview</h1>
                <p class="text-slate-500 font-medium">Real-time health monitor.</p>
            </div>
            <a href="/dashboard/send" class="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold text-sm text-center shadow-lg active:scale-95 transition-transform">🚀 New Campaign</a>
        </div>

        {#if errorMessage}
            <div class="bg-rose-100 text-rose-700 p-4 rounded-xl font-bold text-xs">⚠️ {errorMessage}</div>
        {/if}

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            <div class="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-slate-100 flex justify-between items-center">
                <div>
                    <p class="text-slate-400 text-[10px] font-black uppercase mb-1">Sent</p>
                    <p class="text-3xl font-black">{stats.sent}</p>
                </div>
                <div class="text-2xl bg-emerald-50 p-3 rounded-xl">✅</div>
            </div>
            <div class="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-slate-100 flex justify-between items-center">
                <div>
                    <p class="text-slate-400 text-[10px] font-black uppercase mb-1">Active</p>
                    <p class="text-3xl font-black">{stats.active}</p>
                </div>
                <div class="{stats.isRunning ? 'animate-pulse' : ''} text-2xl bg-blue-50 p-3 rounded-xl">⚙️</div>
            </div>
            <div class="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-slate-100 flex justify-between items-center sm:col-span-2 lg:col-span-1">
                <div>
                    <p class="text-slate-400 text-[10px] font-black uppercase mb-1">Failed</p>
                    <p class="text-3xl font-black">{stats.failed}</p>
                </div>
                <div class="text-2xl bg-rose-50 p-3 rounded-xl">❌</div>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div class="lg:col-span-2 bg-slate-900 rounded-[2.5rem] p-8 md:p-10 text-white relative overflow-hidden">
                <div class="relative z-10">
                    <h3 class="text-xl font-black mb-2">Campaign Monitor</h3>
                    <p class="text-slate-400 mb-6 text-sm">{stats.active > 0 ? 'Processing emails...' : 'Standby mode.'}</p>
                    <div class="flex flex-col sm:flex-row gap-3">
                        <button onclick={() => handleAction(stats.isRunning ? 'pause' : 'resume')} disabled={stats.active === 0}
                            class="px-8 py-3 rounded-xl font-black text-xs uppercase bg-emerald-500 disabled:opacity-50">
                            {stats.isRunning ? 'Pause' : 'Resume'}
                        </button>
                        <button onclick={() => handleAction('cancel')} disabled={stats.active === 0}
                            class="px-8 py-3 rounded-xl font-black text-xs uppercase bg-rose-500/20 text-rose-500 border border-rose-500/30">
                            Stop
                        </button>
                    </div>
                </div>
            </div>
            <div class="bg-white border border-slate-100 rounded-[2.5rem] p-8 flex flex-col gap-4 justify-center">
                <a href="/dashboard/config" class="text-xs font-black uppercase text-slate-500 hover:text-blue-600">SMTP Settings →</a>
                <a href="/dashboard/report" class="text-xs font-black uppercase text-slate-500 hover:text-blue-600">Detailed Logs →</a>
            </div>
        </div>
    </div>
{/if}