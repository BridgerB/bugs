<script lang="ts">
	let loading = $state(false);
	let error = $state('');

	const submitLogin = async (idToken: string): Promise<string | null> => {
		const response = await fetch('/api/auth/login', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ idToken })
		});
		if (response.ok) {
			window.location.href = '/';
			return null;
		}
		const data = await response.json();
		return data.error || 'Failed to sign in';
	};

	const handleGoogleSignIn = async () => {
		loading = true;
		error = '';
		try {
			const { signInWithGoogle } = await import('$lib/firebase/client');
			const idToken = await signInWithGoogle();
			const err = await submitLogin(idToken);
			if (err) error = err;
		} catch (err) {
			console.error('Sign in error:', err);
			error = 'Failed to sign in with Google';
		} finally {
			loading = false;
		}
	};
</script>

<svelte:head>
	<title>Sign In — Bugs</title>
</svelte:head>

<div class="login-page">
	<div class="login-card">
		<h1>Sign in</h1>

		{#if error}
			<p class="login-error">{error}</p>
		{/if}

		<button class="login-google" onclick={handleGoogleSignIn} disabled={loading}>
			{#if loading}
				Signing in...
			{:else}
				Continue with Google
			{/if}
		</button>
	</div>
</div>

<style>
	.login-page {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 100vh;
		padding: 1.5rem;
	}

	.login-card {
		width: 100%;
		max-width: 24rem;
		text-align: center;
	}

	.login-error {
		color: red;
		margin-bottom: 1rem;
	}
</style>
