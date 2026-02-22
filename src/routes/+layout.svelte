<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import { resolve } from '$app/paths';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="app">
	<nav class="sidebar">
		<a href={resolve('/data')} class="nav-item">Data</a>
	</nav>
	<main class="content">
		{@render children()}
	</main>
</div>

<style>
	:global(body) {
		margin: 0;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
		color: #1a1a1a;
	}

	.app {
		display: flex;
		min-height: 100vh;
	}

	.sidebar {
		width: 200px;
		background: #111;
		display: flex;
		flex-direction: column;
		padding: 16px 0;
	}

	.nav-item {
		padding: 10px 20px;
		color: #999;
		text-decoration: none;
		font-size: 14px;
	}

	.nav-item:hover {
		color: #fff;
		background: #222;
	}

	.content {
		flex: 1;
		padding: 24px;
	}
</style>
