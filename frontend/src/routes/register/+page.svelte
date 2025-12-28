<script lang="ts">
  import { enhance } from '$app/forms';
  
  // Svelte 5 logic
  let { form } = $props(); 
  let loading = $state(false); 
  let showPassword = $state(false);
</script>

<div class="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
  <div class="max-w-md w-full bg-white p-10 rounded-2xl shadow-xl border border-slate-100">
    <div class="text-center mb-8">
      <h2 class="text-3xl font-bold text-slate-800">Create Account</h2>
      <p class="text-slate-500 mt-2">Join us to start sending bulk emails</p>
    </div>
    
    {#if form?.message}
      <div class="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm flex items-center shadow-sm">
        <span class="mr-2">⚠️</span> {form.message}
      </div>
    {/if}

    <form 
      method="POST" 
      use:enhance={() => {
        loading = true;
        return async ({ update }) => {
          loading = false;
          await update();
        };
      }} 
      class="space-y-5"
    >
      <div>
        <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1" for="name">Full Name</label>
        <input 
          id="name" name="name" type="text" placeholder="John Doe" required 
          class="w-full border-slate-200 p-3 rounded-xl mt-1 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all border text-slate-800" 
        />
      </div>

      <div>
        <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1" for="email">Email Address</label>
        <input 
          id="email" name="email" type="email" placeholder="name@company.com" required 
          class="w-full border-slate-200 p-3 rounded-xl mt-1 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all border text-slate-800" 
        />
      </div>

      <div>
        <label class="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1" for="password">Password</label>
        <div class="relative">
          <input 
            id="password"
            name="password" 
            type={showPassword ? "text" : "password"} 
            required 
            placeholder="••••••••"
            class="w-full border-slate-200 p-3 rounded-xl mt-1 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all border text-slate-800 pr-12" 
          />
          
          <button 
            type="button"
            class="absolute right-3 top-1/2 -translate-y-1/2 p-2 cursor-pointer text-slate-400 hover:text-slate-600 transition-colors"
            onclick={() => showPassword = !showPassword}
            tabindex="-1"
          >
            {#if showPassword}
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>
            {:else}
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
            {/if}
          </button>
        </div>
      </div>
      
      <button 
        disabled={loading}
        type="submit" 
        class="w-full bg-blue-600 cursor-pointer text-white py-3.5 rounded-xl font-bold hover:bg-blue-700 active:scale-[0.98] transition-all shadow-lg shadow-blue-200 disabled:bg-blue-300 flex justify-center items-center"
      >
        {#if loading}
          <span class="animate-spin mr-2">⏳</span> Creating Account...
        {:else}
          Register Now
        {/if}
      </button>
    </form>

    <div class="mt-8 text-center text-sm border-t border-slate-100 pt-6">
      <span class="text-slate-500 text-xs">Already have an account?</span>
      <a href="/login" class="text-blue-600 font-bold hover:text-blue-800 ml-1 transition-colors">Sign In</a>
    </div>
  </div>
</div>