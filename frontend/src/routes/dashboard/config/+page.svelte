<script lang="ts">
    import { enhance } from '$app/forms';
    import { fade, slide } from 'svelte/transition';

    interface SMTPConfig {
        id: string;
        name: string;
        host: string;
        port: number;
        secure: boolean;
        user: string;
        isDefault: boolean;
    }

    let { data, form }: { data: { userConfigs: SMTPConfig[] }, form: any } = $props();
    
    let editingConfig = $state<SMTPConfig | null>(null);
    let loading = $state(false);

    function setEdit(config: SMTPConfig) {
        editingConfig = config;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function resetForm() {
        editingConfig = null;
    }
</script>

<div class="max-w-5xl mx-auto p-4 sm:p-6 lg:p-10 space-y-8 font-sans">
    
    {#if form?.message}
        <div transition:slide class="p-4 rounded-2xl flex items-center gap-3 border-l-4 shadow-sm 
            {form.success ? 'bg-emerald-50 border-emerald-500 text-emerald-800' : 'bg-rose-50 border-rose-500 text-rose-800 animate-shake'}">
            <span class="text-xl">{form.success ? '✅' : '⚠️'}</span>
            <p class="font-bold text-xs sm:text-sm">{form.message}</p>
        </div>
    {/if}

    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
            <h1 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">SMTP Settings</h1>
            <p class="text-slate-500 text-xs sm:text-sm font-medium">Email bhejne ke liye server connect karein.</p>
        </div>
        {#if editingConfig}
            <button onclick={resetForm} class="w-full sm:w-auto text-[10px] bg-slate-900 text-white px-5 py-3 rounded-full font-black uppercase tracking-widest hover:bg-slate-700 transition-all">
                + Naya Server Add Karein
            </button>
        {/if}
    </div>

    <section class="bg-white p-6 sm:p-10 rounded-[1.5rem] sm:rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100">
        <h2 class="font-black text-slate-400 mb-6 sm:mb-8 uppercase text-[9px] sm:text-[10px] tracking-[0.2em]">
            {editingConfig ? 'Server Details Change Karein' : 'Naye Server ki Details'}
        </h2>
        
        <form method="POST" action="?/save" use:enhance={() => {
            loading = true;
            return async ({ update }) => { 
                loading = false; 
                if (form?.success) editingConfig = null; 
                await update(); 
            };
        }} class="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8">
            
            <input type="hidden" name="id" value={editingConfig?.id || ''} />

            <div class="md:col-span-2">
                <label class="text-[10px] font-black uppercase tracking-wider text-slate-400 ml-1">Compain Name </label>
                <input name="name" value={editingConfig?.name || ''} placeholder="Jaise: My Personal Gmail ya Marketing Team" required 
                       class="w-full border-slate-200 p-3 sm:p-4 rounded-xl sm:rounded-2xl border mt-2 focus:ring-4 focus:ring-blue-100 outline-none transition-all font-medium text-sm" />
                <p class="text-[9px] text-slate-400 mt-2 ml-1 italic">Write there name of Compain</p>
            </div>

            <div>
                <label class="text-[10px] font-black uppercase tracking-wider text-slate-400 ml-1">SMTP Host (Server Address)</label>
                <input name="host" value={editingConfig?.host || ''} placeholder="smtp.gmail.com" required 
                       class="w-full border-slate-200 p-3 sm:p-4 rounded-xl sm:rounded-2xl border mt-2 focus:ring-4 focus:ring-blue-100 outline-none transition-all font-medium text-sm" />
                <p class="text-[9px] text-slate-400 mt-2 ml-1">If Gmail = <b>smtp.gmail.com</b>, Outlook = <b>smtp-mail.outlook.com</b>.</p>
            </div>

            <div>
                <label class="text-[10px] font-black uppercase tracking-wider text-slate-400 ml-1">Port Number</label>
                <select name="port" class="w-full border-slate-200 p-3 sm:p-4 rounded-xl sm:rounded-2xl border mt-2 focus:ring-4 focus:ring-blue-100 outline-none transition-all font-medium text-sm bg-white">
                    <option value="587" selected={editingConfig?.port === 587}>587 ( Best for TLS )</option>
                    <option value="465" selected={editingConfig?.port === 465}>465 (Best for SSL )</option>
                    <!-- <option value="25" selected={editingConfig?.port === 25}>25 (Aksar block hota hai)</option> -->
                </select>
                <p class="text-[9px] text-slate-400 mt-2 ml-1">You Select <b>587</b> If you not Know.</p>
            </div>

            <div>
                <label class="text-[10px] font-black uppercase tracking-wider text-slate-400 ml-1">Email ID / Username</label>
                <input name="user" value={editingConfig?.user || ''} type="email" placeholder="example@gmail.com" required 
                       class="w-full border-slate-200 p-3 sm:p-4 rounded-xl sm:rounded-2xl border mt-2 focus:ring-4 focus:ring-blue-100 outline-none transition-all font-medium text-sm" />
                <p class="text-[9px] text-slate-400 mt-2 ml-1">Your Email Address.</p>
            </div>

            <div>
                <div class="flex justify-between items-center ml-1">
                    <label class="text-[10px] font-black uppercase tracking-wider text-slate-400">App Password (Security)</label>
                    <a href="https://support.google.com/accounts/answer/185833" target="_blank" class="text-[9px] text-blue-600 font-bold hover:underline">Kaise banayein?</a>
                </div>
                <input name="pass" type="password" placeholder={editingConfig ? "••••••••" : "Yahan 16 digits ka code paste karein"} 
                       class="w-full border-slate-200 p-3 sm:p-4 rounded-xl sm:rounded-2xl border mt-2 focus:ring-4 focus:ring-blue-100 outline-none transition-all font-medium text-sm" />
                <p class="text-[9px] text-amber-600 mt-2 ml-1 font-medium bg-amber-50 p-1 rounded italic"><b>Note:</b> Not use Login password . from Google/Outlook "App Password" generate .</p>
            </div>

            <div class="flex flex-wrap items-center gap-6 sm:gap-8 py-2 md:col-span-2 border-t border-slate-50 pt-5 mt-2">
                <label class="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" name="secure" checked={editingConfig?.secure ?? true} class="w-5 h-5 sm:w-6 sm:h-6 rounded-lg accent-blue-600 border-slate-300" />
                    <span class="text-xs sm:text-sm font-bold text-slate-600 group-hover:text-blue-600 transition-colors">SSL/TLS Secure (Hamesha On rakhein)</span>
                </label>
                <label class="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" name="isDefault" checked={editingConfig?.isDefault} class="w-5 h-5 sm:w-6 sm:h-6 rounded-lg accent-blue-600 border-slate-300" />
                    <span class="text-xs sm:text-sm font-bold text-slate-600 group-hover:text-blue-600 transition-colors">Default Server Banayein</span>
                </label>
            </div>

            <div class="md:col-span-2 flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 border-t border-slate-50">
                <button type="submit" disabled={loading} 
                    class="flex-[2] bg-blue-600 text-white py-4 sm:py-5 rounded-xl sm:rounded-2xl font-black uppercase tracking-widest text-[10px] sm:text-xs hover:bg-blue-700 active:scale-95 disabled:bg-slate-300 transition-all shadow-xl shadow-blue-100">
                    {loading ? 'Processing...' : (editingConfig ? 'Update Karein' : 'Server Save Karein')}
                </button>
                
                <button formaction="?/test" 
                    class="flex-1 px-6 py-4 sm:py-0 bg-slate-100 text-slate-900 rounded-xl sm:rounded-2xl font-black uppercase tracking-widest text-[10px] sm:text-xs hover:bg-slate-200 transition-all">
                    Test Connection
                </button>
            </div>
        </form>

        {#if form?.testResult}
            <div transition:slide class="mt-6 sm:mt-8 p-4 sm:p-5 rounded-2xl border flex items-center justify-between {form.testResult.success ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100'}">
                <div class="flex items-center gap-3">
                    <span class="text-lg sm:text-xl">{form.testResult.success ? '✅ Success:' : '❌ Error:'}</span>
                    <span class="font-bold text-xs sm:text-sm {form.testResult.success ? 'text-emerald-700' : 'text-rose-700'}">{form.testResult.message}</span>
                </div>
            </div>
        {/if}
    </section>

    <section class="space-y-4">
        <h2 class="font-black text-slate-400 uppercase text-[9px] sm:text-[10px] tracking-[0.2em] ml-2">Aapke Servers</h2>
        {#if data?.userConfigs && data.userConfigs.length > 0}
            <div class="grid grid-cols-1 gap-4">
                {#each data.userConfigs as config}
                    <div class="bg-white p-4 sm:p-6 rounded-[1.5rem] sm:rounded-3xl border border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between shadow-sm hover:shadow-md transition-shadow gap-4">
                        <div class="flex items-center gap-4 sm:gap-5 w-full">
                            <div class="bg-slate-50 p-3 sm:p-4 rounded-xl sm:rounded-2xl text-xl sm:text-2xl shrink-0">⚡</div>
                            <div class="min-w-0">
                                <p class="font-black text-slate-800 flex flex-wrap items-center gap-2 text-sm sm:text-base">
                                    {config.name} 
                                    {#if config.isDefault}
                                        <span class="text-[8px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-black tracking-widest uppercase">Default</span>
                                    {/if}
                                </p>
                                <p class="text-[10px] sm:text-xs text-slate-400 font-medium mt-0.5 truncate">{config.host} • {config.user}</p>
                            </div>
                        </div>
                        
                        <div class="flex gap-2 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0">
                            <button onclick={() => setEdit(config)} class="flex-1 sm:flex-none text-[10px] font-black text-slate-600 px-4 py-2.5 hover:bg-slate-100 rounded-xl transition-colors">Edit</button>
                            <form method="POST" action="?/delete" use:enhance class="flex-1 sm:flex-none">
                                <input type="hidden" name="id" value={config.id} />
                                <button class="w-full text-[10px] font-black text-rose-600 px-4 py-2.5 hover:bg-rose-50 rounded-xl transition-colors">Delete</button>
                            </form>
                        </div>
                    </div>
                {/each}
            </div>
        {:else}
            <div class="bg-slate-50 border-2 border-dashed border-slate-200 p-10 rounded-3xl text-center">
                <p class="text-slate-400 font-bold text-sm">Abhi tak koi server add nahi kiya gaya hai.</p>
            </div>
        {/if}
    </section>
</div>

<style>
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-4px); }
        75% { transform: translateX(4px); }
    }
    .animate-shake { animation: shake 0.2s ease-in-out 0s 2; }
</style>