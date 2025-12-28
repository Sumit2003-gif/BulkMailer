<script lang="ts">
  import { page } from '$app/stores';
  
  // User data from layout or page store
  let user = $derived($page.data.user);

  const menuItems = [
    { name: 'Dashboard', icon: '📊', path: '/dashboard' },
    { name: 'SMTP Config', icon: '⚙️', path: '/dashboard/config' },
    { name: 'Send Campaign', icon: '🚀', path: '/dashboard/send' },
    // NAYA PAGE YAHAN ADD KIYA HAI
    { name: 'Schedule Queue', icon: '📅', path: '/dashboard/schedule' },
  ];
</script>

<aside class="flex flex-col w-64 h-screen px-5 py-8 overflow-y-auto bg-slate-900 border-r border-slate-700 shadow-2xl sticky top-0">
    <div class="flex items-center px-2 mb-10 group">
        <div class="bg-blue-600 p-2 rounded-lg mr-3 group-hover:rotate-12 transition-transform">
             <span class="text-white text-xl">✉️</span>
        </div>
        <span class="text-xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
            Mailer Pro
        </span>
    </div>

    <div class="flex flex-col justify-between flex-1">
        <nav class="space-y-2">
            {#each menuItems as item}
                <a 
                    href={item.path} 
                    class="flex items-center px-4 py-3 text-gray-400 transition-all duration-200 rounded-xl hover:bg-slate-800 hover:text-white group
                    {$page.url.pathname === item.path ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20 shadow-sm' : ''}"
                >
                    <span class="text-xl group-hover:scale-110 transition-transform">{item.icon}</span>
                    <span class="mx-4 font-medium">{item.name}</span>
                    
                    {#if $page.url.pathname === item.path}
                         <div class="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.6)]"></div>
                    {/if}
                </a>
            {/each}
        </nav>

        <div class="pt-6 mt-6 border-t border-slate-800">
            <div class="flex items-center px-4 py-3 mb-4 bg-slate-800/40 rounded-xl border border-slate-700/50">
                <div class="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold text-white uppercase">
                    {user?.name?.[0] || 'U'}
                </div>
                <div class="ml-3 overflow-hidden">
                    <p class="text-xs font-medium text-slate-200 truncate">{user?.name || 'User'}</p>
                    <p class="text-[10px] text-slate-500 truncate">{user?.email || 'authenticated'}</p>
                </div>
            </div>

            <form action="/logout" method="POST">
                <button 
                    type="submit"
                    class="flex items-center w-full px-4 py-3 text-slate-400 transition-all duration-200 rounded-xl hover:bg-red-500/10 hover:text-red-500 group"
                >
                    <span class="text-xl group-hover:-translate-x-1 transition-transform">🚪</span>
                    <span class="mx-4 font-medium">Sign Out</span>
                </button>
            </form>
        </div>
    </div>
</aside>