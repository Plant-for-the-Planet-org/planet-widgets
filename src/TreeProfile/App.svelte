<!-- svelte-ignore non-top-level-reactive-declaration -->
<svelte:options tag="tree-profile" immutable={true} />

<script>
	import UserProfileLoader from '../../utils/contentLoaders/UserProfileLoader.svelte';
	import { localizedAbbreviatedNumber } from '../../utils/formatNumber';
	import getImageUrl from '../../utils/getImageUrl';
	import enLocale from './../../public/data/locales/en.json';
	import csLocale from './../../public/data/locales/cs.json';
	import deLocale from './../../public/data/locales/de.json';
	import esLocale from './../../public/data/locales/es.json';
	import frLocale from './../../public/data/locales/fr.json';
	import itLocale from './../../public/data/locales/it.json';
	import ptBRLocale from './../../public/data/locales/pt-BR.json';
	import { onMount } from 'svelte';
	import getTenantConfig from '../../utils/tenantsConfig';
	import TcBackground from '../common/themes/leniKlum/TcBackground.svelte';
	// Props that can be passed
	export let user;
	export let primarycolor = '#68b030';
	export let circlebgcolor;
	export let theme = 'light';
	export let community = 'true';
	export let locale = 'en';
	export let refresh = 'none';
	export let tenantkey = 'ten_NxJq55pm';
	export let forestname;
	export let project;

	$: primarycolor = primarycolor;
	$: counterbgcolor = circlebgcolor
		? circlebgcolor
		: theme === 'light'
		? '#007A49'
		: '#2f3336';

	let language = [];
	language['en'] = enLocale;
	language['cs'] = csLocale;
	language['de'] = deLocale;
	language['es'] = esLocale;
	language['fr'] = frLocale;
	language['it'] = itLocale;
	language['pt-br'] = ptBRLocale;

	let userpofiledata;
	async function fetchData() {
		const response = await fetch(`${__myapp.env.API_URL}/profiles/${user}`);
		userpofiledata = await response.json();
		return userpofiledata;
	}

	let promise = fetchData();
	let radius = 126;
	let size = 154;
	let circumference = 2 * Math.PI * radius;

	onMount(() => {
		if (refresh === 'slow') {
			const slow = setInterval(() => {
				fetchData();
			}, 10000);
			return () => clearInterval(slow);
		} else if (refresh === 'fast') {
			const fast = setInterval(() => {
				fetchData();
			}, 5000);
			return () => clearInterval(fast);
		} else refresh === 'none';
		return;
	});
</script>

<div
	class="treeProfile"
	style="--primary-color: {primarycolor};
    --counter-background-color: {theme === 'forest'
		? 'transparent'
		: counterbgcolor};
    --background-color: {theme === 'light'
		? '#fff'
		: theme === 'dark'
		? '#2f3336'
		: '#fff'};
    --link-color: {theme === 'light' || 'forest' ? '#6daff0' : '#fff'}"
>
	{#await promise}
		<UserProfileLoader />
	{:then data}
		<div class="treeCounterContainer">
			<div class="treeCounterComponent">
				{#if theme === 'forest'}
					<div class={'customBackground'}>
						<TcBackground />
					</div>
				{/if}
				<div class="treeCounter">
					<div class="textContainer">
						<p class={`treecount ${theme === 'dark' ? 'planted' : ''}`}>
							{community === 'true'
								? localizedAbbreviatedNumber(
										locale,
										data.scores.treesDonated.personal + data.scores.treesDonated.received + data.scores.treesPlanted,
										1
								  )
								: localizedAbbreviatedNumber(locale, data.scores.treesDonated.personal + data.scores.treesPlanted, 1)}
						</p>
					</div>
					{#if forestname}
						<div class="textContainer">
							<p class={`treecountLabel ${theme === 'dark' ? 'planted' : ''}`}>
								{language[locale].trees}.
							</p>
							<p class={`treecountLabel ${theme === 'dark' ? 'planted' : ''}`}>
								{language[locale].the}
								{forestname}
								{language[locale].forestGrows}
							</p>
						</div>
					{:else}
						<div class="textContainer">
							<p class={`treecountLabel ${theme === 'dark' ? 'planted' : ''}`}>
								{language[locale].treesPlanted}
							</p>
							{#if data.scores.treesDonated.target != 0}
								<p class="treecount">
									{localizedAbbreviatedNumber(locale, data.scores.treesDonated.target, 1)}
								</p>
								<p class="treecountLabel">{language[locale].target}</p>
							{/if}
						</div>
					{/if}
				</div>
				<svg
					style={`width:${size * 2}px; height:${size * 2}px;position:absolute;`}
				>
					{#if data.scores.treesDonated.target > data.scores.treesDonated.personal + data.scores.treesDonated.received + data.scores.treesPlanted}
						<circle
							cx={size}
							cy={size}
							r={radius}
							stroke={primarycolor}
							stroke-linecap="round"
							stroke-width="14"
							transform={`rotate(-90,${size},${size})`}
							stroke-dasharray={circumference}
							stroke-dashoffset={circumference *
								(1 -
									(data.scores.treesDonated.personal + data.scores.treesDonated.received + data.scores.treesPlanted) /
										data.scores.treesDonated.target)}
							fill="transparent"
						/>
					{:else if data.scores.treesDonated.target <= data.scores.treesDonated.personal + data.scores.treesDonated.received + data.scores.treesPlanted}
						<circle
							cx={size}
							cy={size}
							r={radius}
							stroke={primarycolor}
							stroke-linecap="round"
							stroke-width="16"
							transform={`rotate(-90,${size},${size})`}
							stroke-dasharray={circumference}
							stroke-dashoffset={0}
							fill="transparent"
						/>
					{/if}
				</svg>
			</div>
			<a
				href={project
					? `https://donate.plant-for-the-planet.org/?tenant=${tenantkey}&to=${project}${
							data.slug ? `&s=${data.slug}` : ''
					  }`
					: `${getTenantConfig(tenantkey).url}/s/${data.slug}`}
				class="primaryButton"
				on:click
				target="_blank">{language[locale].plantTrees}</a
			>

			<div class="imageHeader">
				{#if data.image}
					<a
						href={`${getTenantConfig(tenantkey).url}/t/${data.slug}`}
						target="_blank"
					>
						<img
							class="logo"
							src={getImageUrl('profile', 'thumb', data.image)}
							alt={data.displayName}
						/>
					</a>
				{/if}
				{#if data.hasLogoLicense}
					<div
						class="logoPlanet"
						style={`background-color:${theme === 'dark' ? '#2f3336' : ''}`}
					>
						{#if theme === 'dark'}
							<img
								src={`${__myapp.env.CDN_URL}/logo/svg/planetDark.svg`}
								alt="Plant-for-the-Planet Logo"
							/>
						{:else}
							<img
								src={`${__myapp.env.CDN_URL}/logo/svg/planet.svg`}
								alt="Plant-for-the-Planet Logo"
							/>
						{/if}
					</div>
				{/if}
			</div>

			<div class="footer">
				<a
					href={`${getTenantConfig(tenantkey).url}/t/${data.slug}`}
					target="_blank"
					class="footerLink"
					>{language[locale].viewProfile}
				</a>
				<div class="block">
					<a
						class="footerLinkBold"
						href={'https://www.plant-for-the-planet.org/'}
						target="_blank"
						>| {language[locale].poweredBy}
					</a>
					{#if community === 'true'}
						<div
							class="infoIcon"
							style={`color: ${theme === 'dark' ? '#fff' : '#000'}`}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								height="14"
								width="14"
								viewBox="0 0 512 512"
							>
								<path
									fill={'#6daff0'}
									d="M256 40c118.621 0 216 96.075 216 216 0 119.291-96.61 216-216 216-119.244 0-216-96.562-216-216 0-119.203 96.602-216 216-216m0-32C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm-36 344h12V232h-12c-6.627 0-12-5.373-12-12v-8c0-6.627 5.373-12 12-12h48c6.627 0 12 5.373 12 12v140h12c6.627 0 12 5.373 12 12v8c0 6.627-5.373 12-12 12h-72c-6.627 0-12-5.373-12-12v-8c0-6.627 5.373-12 12-12zm36-240c-17.673 0-32 14.327-32 32s14.327 32 32 32 32-14.327 32-32-14.327-32-32-32z"
								/>
							</svg>
							<p class="infoText ">
								{localizedAbbreviatedNumber(
									locale,
									Number(data.scores.treesDonated.personal + data.scores.treesPlanted),
									1
								)}
								{language[locale].treesPlantedBy}
								{data.displayName}
								{community === 'true'
									? `${language[locale].and} ${localizedAbbreviatedNumber(
											locale,
											Number(data.scores.treesDonated.received),
											1
									  )} ${language[locale].treesPlantedByComm}`
									: ''}
							</p>
						</div>
					{/if}
				</div>
			</div>
		</div>
	{:catch error}
		<p>An error occurred!</p>
	{/await}
</div>

<style>

	:host {
		all: initial;
	}

	.treeProfile {
		width: 100%;
		max-width: 420px;
		border-radius: 10px;
		display: flex;
		flex-direction: column;
		align-items: center;
		border: 1px solid #d5d5d5;
		vertical-align: baseline;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
			'Helvetica', Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji',
			'Segoe UI Symbol';
		text-decoration: none;
		margin: 10px 0px 10px 0px;
		background-color: var(--background-color);
	}

	.treeCounterContainer {
		min-height: 420px;
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		border-top-right-radius: 10px;
		border-top-left-radius: 10px;
		max-width: 420px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		position: relative;
		padding: 12px;
	}
	.treeCounterComponent {
		height: 265px;
		width: 265px;
		background-image: radial-gradient(white 0%, white 60%, #47a8dc 100%);
		border-radius: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
		position: relative;
		margin-top: 40px;
		margin-bottom: 10px;
	}
	.treeCounter {
		height: 240px;
		width: 240px;
		border-radius: 50%;
		background-color: var(--counter-background-color);
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		text-align: center;
		z-index: 1;
	}
	.customBackground {
		width: 100%;
		height: 100%;
		position: absolute;
	}
	.treecount {
		font-size: 48px;
		font-weight: bold;
		text-align: center;
		color: white;
		margin: 0px;
		line-height: 72px;
	}
	.treecountLabel {
		font-size: 13px;
		font-weight: bold;
		text-align: center;
		color: white;
		margin: 0px;
		margin-top: 6px;
		max-width: 195px;
		word-wrap: break-word;
	}
	.primaryButton {
		color: white;
		font-weight: bold;
		background-image: linear-gradient(97deg, #68b030 4%, #007a49 116%);
		height: 40px;
		padding: 0px;
		text-align: center;
		border: 0px;
		border-radius: 52px;
		min-width: 205px;
		margin-top: 18px;
		display: flex;
		align-items: center;
		justify-content: center;
		transition-duration: 0.5s;
		transition-timing-function: cubic-bezier(0.165, 0.84, 0.44, 1);
		text-decoration: none;
	}
	.primaryButton:hover {
		transform: translateY(-7px);
		cursor: pointer;
	}
	.block {
		display: flex;
		flex-direction: row;
	}
	.footer {
		display: flex;
		flex-direction: row;
		font-size: 14px;
		margin-top: 10px;
		justify-content: center;
		align-items: center;
		margin-top: 15px;
	}
	.footerLink {
		color: var(--link-color);
		text-decoration: none;
	}
	.footerLinkBold {
		color: var(--link-color);
		font-weight: bold;
		margin-left: 4px;
		text-decoration: none;
	}

	.imageHeader {
		position: absolute;
		top: 12px;
		right: 12px;
		display: flex;
		flex-direction: row;
	}

	.logo {
		border-radius: 50%;
		height: 52px;
		width: 52px;
		box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.16);
		margin-right: 12px;
	}

	.logoPlanet {
		height: 52px;
		width: 52px;
		background-color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.16);
		margin-right: 12px;
	}

	.logoPlanet > img {
		height: 46px;
		width: 46px;
	}

	.logoPlanet > svg {
		border-radius: 50%;
	}

	@media screen and (min-width: 320px) and (max-width: 419px) {
		.treeCounterContainer {
			border-top-right-radius: 0px;
			border-top-left-radius: 10px;
			border-bottom-left-radius: 10px;
		}

		.block {
			display: flex;
			flex-direction: row;
		}

		.treeCounterComponent {
			margin-top: 50px;
		}

		.footer {
			display: flex;
			flex-direction: column;
			font-size: 14px;
			margin-bottom: -5px;
			margin-top: 25px;
		}
		.footerLink {
			color: var(--link-color);
			text-decoration: none;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
		}

		.primaryButton {
			margin-top: 10px;
		}
	}
	@media screen and (min-width: 420px) {
		.treeCounterContainer {
			border-top-right-radius: 0px;
			border-top-left-radius: 10px;
			border-bottom-left-radius: 10px;
		}

		.treeCounterContainer {
			width: 420px;
		}
		.footer {
			margin-top: 20px;
		}
	}

	a {
		text-decoration: none;
	}

	.infoIcon {
		margin-left: 8px;
		position: relative;
	}

	.infoText {
		background-color: var(--background-color);
		margin: 0px;
		padding: 8px;
		position: absolute;
		right: 0px;
		bottom: 20px;
		width: 220px;
		border-radius: 4px;
		text-align: center;
		font-weight: normal;
	}

	.infoIcon > .infoText {
		display: none;
	}
	.infoIcon:hover {
		cursor: pointer;
	}
	.infoIcon:hover > .infoText {
		display: block;
	}

	.planted {
		color: var(--primary-color);
	}
</style>
