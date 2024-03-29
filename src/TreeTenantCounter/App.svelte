<svelte:options tag="tree-tenantcounter" immutable={true} />

<script>
	import UserProfileLoader from '../../utils/contentLoaders/UserProfileLoader.svelte';
	import { localizedAbbreviatedNumber } from '../../utils/formatNumber';
	import enLocale from './../../public/data/locales/en.json';
	import csLocale from './../../public/data/locales/cs.json';
	import deLocale from './../../public/data/locales/de.json';
	import esLocale from './../../public/data/locales/es.json';
	import frLocale from './../../public/data/locales/fr.json';
	import itLocale from './../../public/data/locales/it.json';
	import ptBRLocale from './../../public/data/locales/pt-BR.json';
	import TcBackground from '../common/themes/leniKlum/TcBackground.svelte';

	// Props that can be passed
	export let primarycolor = '#68b030';
	export let circlebgcolor;
	export let theme = 'light';
	export let locale = 'en';
	export let goal;
	export let tenantkey;
	export let forestname;

	goal = Number(goal);
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
	const fetchProfileData = (async () => {
		const response = await fetch(`${__myapp.env.API_URL}/tenantScore`, {
			headers: {
				'tenant-key': tenantkey,
			},
		});
		userpofiledata = await response.json();
		return userpofiledata;
	})();

	let radius = 140;
	let size = 154;
	let circumference = 2 * Math.PI * radius;
</script>

<div
	class="treecounter"
	style="--primary-color: {primarycolor};
    --counter-background-color: {theme === 'forest'
		? 'transparent'
		: counterbgcolor};
    --background-color: {theme === 'light'
		? '#fff'
		: theme === 'dark'
		? '#2f3336'
		: 'transparent'};
    --link-color: {theme === 'light' ? '#6daff0' : '#fff'}"
>
	{#await fetchProfileData}
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
							{localizedAbbreviatedNumber(locale, Number(data.total), 1)}
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
							{#if goal && goal != '' && goal != 0}
								<div class="textContainer">
									<p class="treecount">
										{localizedAbbreviatedNumber(locale, Number(goal), 1)}
									</p>
									<p class="treecountLabel">{language[locale].target}</p>
								</div>
							{/if}
						</div>
					{/if}
				</div>
				{#if goal && goal != '' && goal != 0}
					<svg
						style={`width:${size * 2}px; height:${
							size * 2
						}px;position:absolute;`}
					>
						{#if goal > data.total}
							<circle
								cx={size}
								cy={size}
								r={radius}
								stroke={primarycolor}
								stroke-linecap="round"
								stroke-width="16"
								transform={`rotate(-90,${size},${size})`}
								stroke-dasharray={circumference}
								stroke-dashoffset={circumference * (1 - data.total / goal)}
								fill="transparent"
							/>
						{:else if goal < data.total}
							<circle
								cx={size}
								cy={size}
								r={radius}
								stroke={primarycolor}
								stroke-linecap="round"
								stroke-width="16"
								transform={`rotate(-90,${size},${size})`}
								stroke-dasharray={circumference}
								stroke-dashoffset={circumference * (1 == data.total / goal)}
								fill="transparent"
							/>
						{/if}
					</svg>
				{/if}
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

	.treecounter {
		width: 100%;
		max-width: 420px;
		border-radius: 10px;
		display: flex;
		flex-direction: column;
		align-items: center;
		/* border: 1px solid #d5d5d5; */
		vertical-align: baseline;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
			'Helvetica', Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji',
			'Segoe UI Symbol';
		text-decoration: none;
		margin: 10px 0px 10px 0px;
		background-color: var(--background-color);
	}

	.treeCounterContainer {
		/*     min-height: 420px; */
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		border-radius: 10px;
		max-width: 420px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		position: relative;
	}
	.treeCounterComponent {
		height: 295px;
		width: 295px;
		background-image: radial-gradient(white 0%, white 60%, #47a8dc 100%);
		border-radius: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
		position: relative;
	}

	.customBackground {
		width: 100%;
		height: 100%;
		position: absolute;
	}

	.treeCounter {
		height: 266px;
		width: 266px;
		border-radius: 50%;
		background-color: var(--counter-background-color);
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		text-align: center;
		z-index: 1;
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
		max-width: 220px;
		word-wrap: break-word;
	}

	@media screen and (min-width: 640px) {
		.treeCounterContainer {
			border-top-right-radius: 0px;
			border-top-left-radius: 10px;
			border-bottom-left-radius: 10px;
		}
	}

	@media screen and (min-width: 940px) {
		.treeCounterContainer {
			width: 420px;
		}
	}
	.planted {
		color: var(--primary-color);
	}
</style>
