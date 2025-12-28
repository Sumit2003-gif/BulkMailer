<script lang="ts">
  import { enhance } from '$app/forms';
  import { campaignAPI } from '$lib/api';
  import { fade, slide } from 'svelte/transition';

  interface Contact {
    email?: string; Email?: string;
    name?: string; Name?: string;
  }

  let { form } = $props();
  let loading = $state(false);
  let previewData = $state<Contact[]>([]); 
  let totalContacts = $state(0);
  let isParsing = $state(false);
  let parseError = $state("");
  let showFormatGuide = $state(false);

  let subjectValue = $state("");
  let messageValue = $state("");
  let notifyEmailValue = $state(""); // State for notification email

  async function handleFileChange(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;

    parseError = "";
    previewData = [];
    
    if (!file.name.match(/\.(csv|xlsx)$/i)) {
      parseError = "Galti: Sirf .csv ya .xlsx file hi chalegi.";
      (e.target as HTMLInputElement).value = '';
      return;
    }

    isParsing = true;
    const formData = new FormData();
    formData.append('excelFile', file);

    try {
      const res = await campaignAPI.parseExcel(formData);
      if (res.success) {
        previewData = res.contacts; 
        totalContacts = res.totalCount;

        if (totalContacts > 0) {
            subjectValue = "Special Offer for {{name}}! 🎁";
            messageValue = "Namaste {{name}},\n\nAapka email humein mil gaya hai. Hamare paas aapke liye kuch khaas hai!\n\nTeam 🚀";
        }
      } else {
        parseError = res.message || "File read nahi ho pa rahi.";
      }
    } catch (err) {
      parseError = "Server se connection toot gaya.";
    } finally {
      isParsing = false;
    }
  }
</script>

<div class="w-full max-w-2xl mx-auto py-6 sm:py-8 px-4 font-sans">
  <div class="bg-white rounded-[1.5rem] sm:rounded-[2.5rem] shadow-xl shadow-slate-200 border border-slate-100 overflow-hidden">
    
    <div class="bg-slate-900 p-6 sm:p-10 text-white">
        <h1 class="text-2xl sm:text-3xl font-black flex items-center gap-3">
          <span class="bg-blue-600 p-2 rounded-xl text-lg sm:text-xl">🚀</span> Create Campaign
        </h1>
        <p class="text-slate-400 text-xs sm:text-sm mt-2 font-medium italic">File upload karte hi details apne aap bhar jayengi.</p>
    </div>

    <form method="POST" enctype="multipart/form-data" use:enhance={() => {
      loading = true;
      return async ({ result, update }) => {
        loading = false;
        
        // --- LOGIC: Campaign success hone par sab reset karein ---
        if (result.type === 'success') {
          previewData = []; 
          totalContacts = 0;
          subjectValue = "";
          messageValue = "";
          notifyEmailValue = ""; // Reset notification email
          const fileInput = document.getElementById('csvFile') as HTMLInputElement;
          if (fileInput) fileInput.value = '';
        }
        
        await update();
      };
    }} class="p-6 sm:p-10 space-y-6 sm:space-y-8">
      
      <div class="space-y-3">
        <div class="flex justify-between items-center">
            <label for="csvFile" class="text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-500">
                1. Recipient List
            </label>
            <button type="button" onclick={() => showFormatGuide = !showFormatGuide} 
                    class="text-[10px] text-blue-600 font-bold underline hover:text-blue-800">
                {showFormatGuide ? 'Close Guide' : 'Format ?'}
            </button>
        </div>

        {#if showFormatGuide}
          <div transition:slide class="bg-blue-50 border border-blue-100 rounded-2xl p-4 space-y-3 mb-4">
             <p class="text-[11px] font-bold text-blue-800 uppercase tracking-tight">Excel Format Example:</p>
             <div class="overflow-x-auto">
                <table class="w-full text-left text-[10px] border-collapse bg-white rounded-lg overflow-hidden shadow-sm">
                    <thead class="bg-blue-600 text-white">
                      <tr><th class="p-2 border border-blue-200">email</th><th class="p-2 border border-blue-200">name</th></tr>
                    </thead>
                    <tbody class="text-slate-600">
                      <tr><td class="p-2 border border-slate-100">amit@gmail.com</td><td class="p-2 border border-slate-100">Amit Kumar</td></tr>
                    </tbody>
                </table>
             </div>
          </div>
        {/if}
        
        <input id="csvFile" type="file" name="csvFile" accept=".csv, .xlsx" required 
               onchange={handleFileChange} 
               class="w-full border-2 border-dashed border-slate-200 p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-slate-50 
                      hover:border-blue-400 hover:bg-blue-50/30 transition-all cursor-pointer 
                      file:mr-2 sm:file:mr-4 file:py-2 file:px-4 sm:file:px-6 file:rounded-full file:border-0 
                      file:text-[10px] sm:file:text-xs file:font-black file:bg-slate-900 file:text-white" />

        {#if parseError}
          <p class="text-rose-500 text-[10px] sm:text-xs font-bold animate-shake">⚠️ {parseError}</p>
        {/if}
      </div>

      {#if isParsing}
        <div class="flex items-center gap-3 text-blue-600 font-bold text-xs sm:text-sm bg-blue-50 p-4 rounded-2xl animate-pulse">
           <div class="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
           Analyzing and Auto-filling fields...
        </div>
      {:else if previewData.length > 0}
        <div class="bg-emerald-50 border border-emerald-100 rounded-2xl p-3 flex items-center gap-2" transition:slide>
           <span class="text-emerald-600">✨</span>
           <p class="text-[10px] font-bold text-emerald-800 uppercase tracking-widest">
                {totalContacts} Contacts loaded & name tags synchronized!
           </p>
        </div>
      {/if}

      <div class="space-y-3">
        <label for="subject" class="text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-500 flex justify-between">
            2. Subject Line
            <span class="text-[9px] text-emerald-600 font-bold">Auto-pickup active</span>
        </label>
        <input id="subject" name="subject" type="text" bind:value={subjectValue} placeholder="Subject" required 
               class="w-full border border-slate-200 p-3 sm:p-4 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none transition-all font-medium text-sm" />
      </div>

      <div class="space-y-3">
        <label for="message" class="text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-500">3. Email Body</label>
        <textarea id="message" name="message" rows="5" bind:value={messageValue} placeholder="Content..." required
                  class="w-full border border-slate-200 p-3 sm:p-4 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none transition-all font-medium text-sm"></textarea>
      </div>

      <div class="space-y-3" transition:slide>
        <label for="notifyEmail" class="text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-500 flex justify-between">
            4. Delivery Report Email (Optional)
            <span class="text-[9px] text-blue-600 font-bold italic underline">Receive PDF Report</span>
        </label>
        <div class="relative">
            <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">📧</span>
            <input id="notifyEmail" name="notifyEmail" type="email" bind:value={notifyEmailValue}
                   placeholder="e.g. your-email@gmail.com"
                   class="w-full border border-slate-200 p-3 sm:p-4 pl-10 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none transition-all font-medium text-sm bg-slate-50/50" />
        </div>
        <p class="text-[9px] text-slate-400 font-medium px-1">Campaign khatam hone par saari reports is email par bhej di jayengi.</p>
      </div>

      <button type="submit" disabled={loading}
              class="w-full py-4 sm:py-5 rounded-2xl sm:rounded-3xl font-black text-sm sm:text-base text-white transition-all shadow-xl shadow-blue-100
              {loading ? 'bg-slate-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:scale-95'}">
        {loading ? '🚀 SENDING...' : 'LAUNCH CAMPAIGN'}
      </button>
    </form>
  </div>
</div>

<style>
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-4px); }
    75% { transform: translateX(4px); }
  }
  .animate-shake { animation: shake 0.2s ease-in-out 0s 2; }
</style>