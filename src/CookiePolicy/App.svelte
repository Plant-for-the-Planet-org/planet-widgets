<svelte:options tag="tree-popup" immutable={true} />

<script>
	import { writable } from '../../utils/localstorage';
	export let message;
	export let buttontext;
	export let theme = 'light';
	const now = new Date();
	let cookiePolicy = localStorage.getItem('hidePlanetCookie');
	if (cookiePolicy) {
		cookiePolicy = JSON.parse(cookiePolicy);
		if (now.getTime() > cookiePolicy.expiry) {
			localStorage.removeItem('hidePlanetCookie');
			cookiePolicy = null;
		}
	}

	export const hideCookieNotification = writable(cookiePolicy);
	function hideCookieNotice() {
		const expiryTime =
			now.getTime() +
			(__myapp.env.ENVIORNMENT === 'development' ? 15000 : 15778800000); //6 months in milliseconds
		const data = {
			value: true,
			expiry: expiryTime,
		};
		hideCookieNotification.subscribe((value) => {
			localStorage.setItem('hidePlanetCookie', JSON.stringify(data));
		});

		cookiePolicy = true;
	}
</script>

{#if !cookiePolicy}
	<div
		class="cookie-policy"
		style="--bg-color: {theme === 'light' ? '#fff' : '#2f3336'};
            --text-color: {theme === 'light' ? '#000000' : '#fff'};"
	>
		<div class="policy-notice">
			<div class="cookie-policy-link" />
			{@html message}
		</div>
		<button
			id={'cookie-close-button'}
			class="primary-button"
			on:click={hideCookieNotice}
		>
			{buttontext}
		</button>
	</div>
{/if}

<style>
	.cookie-policy-link {
		font-weight: 700;
		color: #007a49;
		text-decoration: none;
	}
	.cookie-policy {
		position: fixed;
		background-color: var(--bg-color);
		color: var(--text-color);
		box-shadow: 0 13px 27px -5px rgba(50, 50, 93, 0.25),
			0 8px 16px -8px rgba(0, 0, 0, 0.3);
		bottom: 20px;
		left: 20px;
		width: 280px;
		border-radius: 4px;
		padding: 20px;
		z-index: 999999;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
			'Helvetica', Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji',
			'Segoe UI Symbol';
	}
	.policy-notice {
		text-align: center;
	}

	.primary-button {
		color: white;
		font-weight: bold;
		background-image: linear-gradient(97deg, #68b030 4%, #007a49 116%);
		height: 40px;
		padding: 0px;
		text-align: center;
		border: 0px;
		border-radius: 40px;
		min-width: 200px;
		width: 100%;
		margin-top: 24px;
		display: flex;
		align-items: center;
		justify-content: center;
		transition-duration: 0.5s;
		transition-timing-function: cubic-bezier(0.165, 0.84, 0.44, 1);
		text-decoration: none;
	}
	.primary-button:hover {
		transform: translateY(-7px);
		cursor: pointer;
	}
</style>
