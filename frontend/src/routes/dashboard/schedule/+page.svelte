<script lang="ts">
    import { campaignAPI } from '$lib/api';
    import { fade, slide } from 'svelte/transition';

    // 1. Typescript Interface for Type Safety
    interface ScheduledJob {
        id: string;
        configName: string;
        scheduledTime: string;
        contactCount: number;
        status: string;
    }

    // 2. Receiving data from +page.server.ts
    interface Props {
        data: {
            initialJobs: ScheduledJob[];
        };
    }
    let { data }: Props = $props();
    
    // 3. Reactive State
    let jobs = $state<ScheduledJob[]>(data.initialJobs || []);
    let isProcessing = $state(false);

    // 4. Derived State: Stats calculate karna
    let totalLeads = $derived(jobs.reduce((sum, job) => sum + (job.contactCount || 0), 0));

    // 5. Cancel Job Logic using campaignAPI
    async function cancelJob(id: string) {
        if (!confirm("Are you sure you want to cancel this scheduled campaign?")) return;
        
        isProcessing = true;
        try {
            // Humne api.ts wala function use kiya
            const res = await campaignAPI.deleteScheduled(id);
            const result = await res.json();
            
            if (result.success || res.ok) {
                // UI se turant remove karne ke liye filter
                jobs = jobs.filter((job) => job.id !== id);
            } else {
                alert(result.message || "Failed to cancel job");
            }
        } catch (error) {
            console.error("Cancel error:", error);
            alert("Connection error with Backend.");
        } finally {
            isProcessing = false;
        }
    }

    // Date formatter helper
    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
    };

    const formatTime = (dateStr: string) => {
        return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };
</script>

<div class="p-6 md:p-10 max-w-7xl mx-auto">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
            <h1 class="text-4xl font-black text-slate-900 tracking-tight">Scheduled Queue</h1>
            <p class="text-slate-500 font-medium mt-1 italic">Your upcoming automated email broadcasts.</p>
        </div>
        <div class="flex items-center gap-3">
            <div class="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border border-emerald-100">
                System Active
            </div>
            <a href="/dashboard/send" class="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all flex items-center gap-2">
                <span class="text-xl">+</span> New Schedule
            </a>
        </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
        <div class="bg-white border border-slate-100 p-6 rounded-[2rem] shadow-sm">
            <p class="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Pending Campaigns</p>
            <p class="text-4xl font-black text-slate-900">{jobs.length}</p>
        </div>
        <div class="bg-slate-900 border border-slate-800 p-6 rounded-[2rem] shadow-xl">
            <p class="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2 text-blue-400">Total Leads in Queue</p>
            <p class="text-4xl font-black text-white">{totalLeads.toLocaleString()}</p>
        </div>
    </div>

    {#if jobs.length === 0}
        <div class="bg-white border-2 border-dashed border-slate-200 rounded-[3rem] py-32 text-center" in:fade>
            <div class="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <span class="text-4xl">⏰</span>
            </div>
            <p class="text-slate-900 font-black text-2xl">No tasks scheduled</p>
            <p class="text-slate-400 font-medium mb-10">You haven't queued any email campaigns yet.</p>
            <a href="/dashboard/send" class="bg-slate-100 text-slate-900 px-8 py-4 rounded-2xl font-black hover:bg-slate-200 transition-all">Start Sending Now</a>
        </div>
    {:else}
        <div class="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden" in:fade>
            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                    <thead class="bg-slate-50/50 border-b border-slate-100">
                        <tr>
                            <th class="px-10 py-6 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Campaign & ID</th>
                            <th class="px-10 py-6 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Execution Time</th>
                            <th class="px-10 py-6 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Recipients</th>
                            <th class="px-10 py-6 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-50">
                        {#each jobs as job (job.id)}
                            <tr class="group hover:bg-slate-50/60 transition-all" out:slide>
                                <td class="px-10 py-8">
                                    <div class="flex items-center gap-5">
                                        <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-black text-xl shadow-lg shadow-indigo-100 uppercase">
                                            {job.configName?.[0] || 'C'}
                                        </div>
                                        <div>
                                            <p class="font-black text-slate-900 text-lg leading-tight">{job.configName || 'Bulk Mail'}</p>
                                            <p class="text-[10px] text-slate-400 font-mono mt-1.5 uppercase tracking-tighter">ID: {job.id.slice(0,14)}...</p>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-10 py-8">
                                    <div class="flex flex-col">
                                        <span class="text-sm font-black text-slate-700">
                                            {formatDate(job.scheduledTime)}
                                        </span>
                                        <span class="text-[11px] text-blue-500 font-bold mt-1 bg-blue-50 w-fit px-2 py-0.5 rounded-md">
                                            at {formatTime(job.scheduledTime)}
                                        </span>
                                    </div>
                                </td>
                                <td class="px-10 py-8">
                                    <div class="flex items-center gap-2">
                                        <div class="w-2 h-2 rounded-full bg-emerald-400"></div>
                                        <span class="text-sm font-black text-slate-600">{job.contactCount?.toLocaleString()} Leads</span>
                                    </div>
                                </td>
                                <td class="px-10 py-8 text-right">
                                    <button 
                                        onclick={() => cancelJob(job.id)}
                                        disabled={isProcessing}
                                        class="p-4 text-rose-500 hover:bg-rose-50 rounded-2xl transition-all border border-transparent hover:border-rose-100 disabled:opacity-30 active:scale-90"
                                        title="Cancel Schedule"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        </div>
    {/if}
</div>

<style>
    /* Clean Custom Scrollbar */
    .overflow-x-auto::-webkit-scrollbar { height: 6px; }
    .overflow-x-auto::-webkit-scrollbar-track { background: transparent; }
    .overflow-x-auto::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
</style>