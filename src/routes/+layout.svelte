<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import { resolve } from '$app/paths';

	let { data, children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="app-layout">
	<nav class="sidebar">
		<div class="sidebar-group">
			<strong class="sidebar-heading">Operations</strong>
			<ul class="sidebar-links">
				<li><a class="sidebar-link" href={resolve('/')}>Dashboard</a></li>
				<li><a class="sidebar-link" href={resolve('/')}>Schedule</a></li>
				<li><a class="sidebar-link" href={resolve('/')}>Jobs</a></li>
				<li><a class="sidebar-link" href={resolve('/')}>Customers</a></li>
			</ul>
		</div>

		<div class="sidebar-group">
			<strong class="sidebar-heading">Services</strong>
			<ul class="sidebar-links">
				<li><a class="sidebar-link" href={resolve('/')}>Subscriptions</a></li>
				<li><a class="sidebar-link" href={resolve('/')}>Devices</a></li>
				<li><a class="sidebar-link" href={resolve('/')}>Products</a></li>
			</ul>
		</div>

		<div class="sidebar-group">
			<strong class="sidebar-heading">Billing</strong>
			<ul class="sidebar-links">
				<li><a class="sidebar-link" href={resolve('/')}>Invoices</a></li>
				<li><a class="sidebar-link" href={resolve('/')}>Payments</a></li>
			</ul>
		</div>

		<div class="sidebar-group">
			<strong class="sidebar-heading">Admin</strong>
			<ul class="sidebar-links">
				<li><a class="sidebar-link" href={resolve('/')}>Team</a></li>
				<li><a class="sidebar-link" href={resolve('/')}>Settings</a></li>
			</ul>
		</div>

		<div class="sidebar-group">
			<strong class="sidebar-heading">Dev</strong>
			<ul class="sidebar-links">
				<li><a class="sidebar-link" href={resolve('/data')}>Data</a></li>
			</ul>
		</div>

		<div class="sidebar-user">
			{#if data.user}
				<span class="sidebar-user-name">{data.user.firstName} {data.user.lastName}</span>
				<form method="POST" action={resolve('/api/auth/logout')}>
					<button class="sidebar-logout" type="submit">Sign out</button>
				</form>
			{:else}
				<a class="sidebar-link" href={resolve('/login')}>Sign in</a>
			{/if}
		</div>
	</nav>

	<main class="main-content">
		{@render children()}
	</main>
</div>

<style>
	:global(body) {
		margin: 0;
		font-family: system-ui, sans-serif;
	}

	.app-layout {
		display: flex;
		min-height: 100vh;
	}

	.sidebar {
		width: 200px;
		border-right: 1px solid #ddd;
		padding: 1rem;
		display: flex;
		flex-direction: column;
	}

	.sidebar-links {
		list-style: none;
		padding: 0;
		margin: 0 0 1rem;
	}

	.sidebar-heading {
		display: block;
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: #666;
		margin-bottom: 0.25rem;
	}

	.sidebar-link {
		display: block;
		padding: 0.25rem 0;
		color: inherit;
		text-decoration: none;
	}

	.sidebar-link:hover {
		text-decoration: underline;
	}

	.main-content {
		flex: 1;
		min-width: 0;
		padding: 1.5rem;
	}

	.sidebar-user {
		margin-top: auto;
		padding-top: 1rem;
		border-top: 1px solid #ddd;
	}

	.sidebar-user-name {
		display: block;
		font-size: 0.875rem;
		margin-bottom: 0.25rem;
	}

	.sidebar-logout {
		background: none;
		border: none;
		padding: 0;
		color: inherit;
		font: inherit;
		cursor: pointer;
		text-decoration: underline;
		font-size: 0.875rem;
	}
</style>
