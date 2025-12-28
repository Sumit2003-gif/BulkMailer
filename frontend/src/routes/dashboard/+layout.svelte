<script lang="ts">
  import { page } from '$app/stores';
  import '../layout.css';
  import { fade, fly } from 'svelte/transition';

  let { data, children } = $props();
  
  // Mobile menu open/close karne ke liye state
  let isMobileMenuOpen = $state(false);

  const navLinks = [
    { name: 'Overview', path: '/dashboard', icon: '📊' },
    { name: 'Send Email', path: '/dashboard/send', icon: '🚀' },
    { name: 'Schedule Queue', path: '/dashboard/schedule', icon: '📅' },
    { name: 'SMTP Settings', path: '/dashboard/config', icon: '⚙️' }
  ];

  let currentTitle = $derived(
    navLinks.find(link => link.path === $page.url.pathname)?.name || 'Dashboard'
  );

  // Link click hote hi mobile menu band ho jaye
  const closeMenu = () => isMobileMenuOpen = false;
</script>

<div class="flex h-screen bg-slate-50 overflow-hidden relative">
  
  {#if isMobileMenuOpen}
    <div 
      class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-30 lg:hidden"
      onclick={closeMenu}
      transition:fade
    ></div>
  {/if}

  <aside 
    class="fixed inset-y-0 left-0 w-72 bg-slate-900 text-white flex flex-col shadow-2xl z-40 
           transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
           {isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}"
  >
    <div class="p-8 mb-4 flex items-center justify-between">
      <div class="flex items-center space-x-3">
        <div class="bg-blue-600 p-2 rounded-lg">
          <span class="text-xl">✉️</span>
        </div>
        <h1 class="text-xl font-bold tracking-tight">BulkMailer <span class="text-blue-400">Pro</span></h1>
      </div>
      <button onclick={closeMenu} class="lg:hidden text-slate-400 hover:text-white">
        ✕
      </button>
    </div>
    
    <nav class="flex-1 px-4 space-y-1">
      {#each navLinks as link}
        <a 
          href={link.path} 
          onclick={closeMenu}
          class="flex items-center space-x-3 p-3.5 rounded-xl transition-all duration-200 group
          {$page.url.pathname === link.path 
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/40' 
            : 'text-slate-400 hover:bg-slate-800 hover:text-white'}"
        >
          <span class="text-lg group-hover:scale-110 transition-transform">{link.icon}</span>
          <span class="font-bold text-sm">{link.name}</span>
          {#if $page.url.pathname === link.path}
            <div class="ml-auto w-1.5 h-1.5 rounded-full bg-blue-200 animate-pulse"></div>
          {/if}
        </a>
      {/each}
    </nav>

    <div class="p-6 m-4 bg-slate-800/40 rounded-2xl border border-slate-700/50">
      <div class="flex items-center space-x-3 mb-4">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center font-black">
          {data.user?.email?.[0].toUpperCase() || 'U'}
        </div>
        <div class="overflow-hidden">
          <p class="text-[10px] text-blue-400 uppercase font-black">Admin Mode</p>
          <p class="font-bold text-xs truncate text-slate-200">{data.user?.email || 'User'}</p>
        </div>
      </div>
      <form action="/logout" method="POST">
        <button type="submit" class="w-full py-2.5 px-4 bg-slate-800 hover:bg-rose-500/10 hover:text-rose-400 text-slate-400 rounded-xl text-xs font-bold border border-slate-700 transition-all">
          Sign Out
        </button>
      </form>
    </div>
  </aside>

  <main class="flex-1 flex flex-col min-w-0 bg-slate-50 w-full">
    <header class="h-20 border-b border-slate-200 flex items-center justify-between px-4 lg:px-10 bg-white/60 backdrop-blur-xl z-10 sticky top-0">
        <div class="flex items-center space-x-4">
            <button 
              onclick={() => isMobileMenuOpen = true}
              class="lg:hidden p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200"
            >
              ☰
            </button>

            <div class="flex flex-col">
                <h2 class="text-sm lg:text-lg font-black text-slate-800 tracking-tight">
                    {currentTitle}
                </h2>
                <p class="hidden sm:block text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                    System / {currentTitle.replace(' ', ' / ')}
                </p>
            </div>
        </div>

        <div class="flex items-center space-x-6">
           <div class="flex items-center space-x-2 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-full">
              <span class="relative flex h-2 w-2">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span class="text-[10px] text-emerald-700 font-black uppercase tracking-wider">Server Live</span>
           </div>
        </div>
    </header>

    <div class="flex-1 overflow-y-auto p-4 lg:p-10 custom-scrollbar">
      <div class="max-w-6xl mx-auto">
        {@render children()}
      </div>
    </div>
  </main>
</div>