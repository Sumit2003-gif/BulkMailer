<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	onMount(() => {
		// Redirect to login page on app load
		goto('/login');
	});
</script>

<div class="min-h-screen flex items-center justify-center bg-slate-50">
	<div class="text-center">
		<div class="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
		<p class="text-slate-500 font-medium">Loading BulkMailer Pro...</p>
	</div>
</div>
