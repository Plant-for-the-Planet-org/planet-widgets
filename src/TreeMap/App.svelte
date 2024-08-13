<svelte:options tag="tree-map" immutable={true} />

<script>
	import UserProfileLoader from '../../utils/contentLoaders/UserProfileLoader.svelte';
	import { localizedAbbreviatedNumber } from '../../utils/formatNumber';

	import mapboxgl from 'mapbox-gl';
	import mapStyleLight from '../../public/data/styles/light.json';
	import mapStyleDark from '../../public/data/styles/dark.json';
	import { fetchTiles } from '../../utils/mapUtils';
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
	let w;
	// Props that can be passed
	export let user;
	export let primarycolor = '#68b030';
	export let circlebgcolor;
	export let theme = 'light';
	export let community = 'true';
	export let locale = 'en';
	export let refresh = 'none';
	export let tenantkey = 'ten_I9TW3ncG';
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

	let promise = fetchData();
	let mapStyle;
	let userpofiledata;
	async function fetchData() {
		const response = await fetch(`${__myapp.env.API_URL}/profiles/${user}`);
		userpofiledata = await response.json();
		return userpofiledata;
	}

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
		// Find a way to do this without ID
		let el = document.getElementsByTagName('tree-map')[0];
		el.style.width = '100%';
		return;
	});

	let radius = 140;
	let size = 154;
	let circumference = 2 * Math.PI * radius;

	const fetchContributionsData = (async () => {
		const response = await fetch(
			`${__myapp.env.API_URL}/profiles/${user}/contributions`
		);
		return await response.json();
	})();

	// Function that gets called when the element is created.
	// https://svelte.dev/tutorial/actions
	// https://svelte.school/tutorials/introduction-to-actions
	const createMap = async (domNode) => {
		fetchTiles(
			theme === 'light' || 'forest' ? mapStyleLight : mapStyleDark,
			'https://basemaps.arcgis.com/arcgis/rest/services/World_Basemap_v2/VectorTileServer'
		).then((style) => {
			if (style) {
				mapStyle = style;
			}
			const map = new mapboxgl.Map({
				container: domNode,
				style: mapStyle, // stylesheet location
				center: [-28.5, 36.96], // starting position [lng, lat]
				zoom: 1, // starting zoom
				height: '100%',
				width: '100%',
				maxZoom: 16,
			});
			map.on('load', () => {
				fetchContributionsData.then((contributions) => {
					let filteredContributions;
					if (community === 'true') {
						filteredContributions = contributions.filter((contrib) => {
							return contrib.properties.plantDate !== null;
						});
					} else {
						filteredContributions = contributions.filter((contrib) => {
							return contrib.properties.type !== 'gift' && contrib.properties.plantDate !== null;
						});
					}
					const geojson = {
						type: 'FeatureCollection',
						features: filteredContributions,
					};
					map.addSource('contributions', {
						type: 'geojson',
						data: geojson,
						cluster: true,
						clusterMaxZoom: 24, // Max zoom to cluster points on
						clusterRadius: 50, // Radius of each cluster when clustering points (defaults to 50)
						clusterProperties: {
							sum: ['+', ['to-number', ['get', 'treeCount', ['properties']]]],
						},
					});

					map.addLayer({
						id: 'contrib-cluster',
						type: 'circle',
						source: 'contributions',
						filter: ['has', 'point_count'],
						paint: {
							'circle-color': primarycolor,
							'circle-radius': ['step', ['get', 'sum'], 20, 50, 30, 100, 40],
							'circle-stroke-width': 4,
							'circle-stroke-color': '#fff',
						},
					});
					map.addLayer({
						id: 'contrib-cluster-label',
						type: 'symbol',
						source: 'contributions',
						filter: ['has', 'point_count'],
						layout: {
							'text-field': [
								'number-format',
								['get', 'sum'],
								{ 'max-fraction-digits': 1 },
							],
							'text-font': ['Ubuntu Bold'],
							'text-size': 12,
						},
						paint: {
							'text-color': '#fff',
						},
					});

					map.addLayer({
						id: 'contrib',
						type: 'circle',
						source: 'contributions',
						filter: ['!', ['has', 'point_count']],
						paint: {
							'circle-color': primarycolor,
							'circle-radius': [
								'step',
								['to-number', ['get', 'treeCount']],
								15,
								50,
								20,
								100,
								30,
							],
							'circle-stroke-width': 4,
							'circle-stroke-color': '#fff',
						},
					});
					map.addLayer({
						id: 'contrib-label',
						type: 'symbol',
						source: 'contributions',
						filter: ['!', ['has', 'point_count']],
						layout: {
							'text-field': [
								'number-format',
								['to-number', ['get', 'treeCount']],
								{ 'max-fraction-digits': 1 },
							],
							'text-font': ['Ubuntu Bold'],
							'text-size': 12,
						},
						paint: {
							'text-color': '#fff',
						},
					});
				});
			});
		});
	};
</script>

<div
	class={`treemap ${w > 640 ? 'landscape' : 'portrait'}`}
	bind:clientWidth={w}
	style="--widgetWidth:{w};--primary-color: {primarycolor};
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
		<div class={`treeCounterContainer ${w > 640 ? 'w40' : 'w100'}`}>
			<div class="mainContainer">
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
											data.score.personal + data.score.received,
											1
									  )
									: localizedAbbreviatedNumber(locale, data.score.personal, 1)}
							</p>
						</div>
						{#if forestname}
							<div class="textContainer">
								<p
									class={`treecountLabel ${theme === 'dark' ? 'planted' : ''}`}
								>
									{language[locale].trees}.
								</p>
								<p
									class={`treecountLabel ${theme === 'dark' ? 'planted' : ''}`}
								>
									{language[locale].the}
									{forestname}
									{language[locale].forestGrows}
								</p>
							</div>
						{:else}
							<div class="textContainer">
								<p
									class={`treecountLabel ${theme === 'dark' ? 'planted' : ''}`}
								>
									{language[locale].treesPlanted}
								</p>
								{#if data.score.target != 0}
									<p class="treecount">
										{localizedAbbreviatedNumber(locale, data.score.target, 1)}
									</p>
									<p class="treecountLabel">{language[locale].target}</p>
								{/if}
							</div>
						{/if}
					</div>
					<svg
						style={`width:${size * 2}px; height:${
							size * 2
						}px;position:absolute;`}
					>
						{#if data.score.target > data.score.personal + data.score.received}
							<circle
								cx={size}
								cy={size}
								r={radius}
								stroke={primarycolor}
								stroke-linecap="round"
								stroke-width="16"
								transform={`rotate(-90,${size},${size})`}
								stroke-dasharray={circumference}
								stroke-dashoffset={circumference *
									(1 -
										(data.score.personal + data.score.received) /
											data.score.target)}
								fill="transparent"
							/>
						{:else if data.score.target < data.score.personal + data.score.received}
							<circle
								cx={size}
								cy={size}
								r={radius}
								stroke={primarycolor}
								stroke-linecap="round"
								stroke-width="16"
								transform={`rotate(-90,${size},${size})`}
								stroke-dasharray={circumference}
								stroke-dashoffset={circumference *
									(1 ==
										(data.score.personal + data.score.received) /
											data.score.target)}
								fill="transparent"
							/>
						{/if}
					</svg>
				</div>
				<a
					href={project
						? `https://donate.plant-for-the-planet.org/?tenant=${tenantkey}&to=${project}&s=${data.slug}`
						: `${getTenantConfig(tenantkey).url}/s/${data.slug}`}
					class="primaryButton"
					on:click
					target="_blank">{language[locale].plantTrees}</a
				>
			</div>
		</div>
		<div class={`mapContainer ${w > 640 ? 'w60' : 'w100'}`}>
			<div
				id="map"
				class={`view ${w > 640 ? 'viewLandscape' : 'viewPortrait'}`}
				use:createMap
			/>

			<div class="footer">
				<div class="footerContainer">
					<div class="footerLink">
						<a
							href={`${getTenantConfig(tenantkey).url}/t/${data.slug}`}
							target="_blank"
							>{language[locale].viewProfile}
						</a>
					</div>
					<div class="footerLinkBold">
						<a href={'https://www.plant-for-the-planet.org/'} target="_blank">
							<div class="seperater">|</div>
							{language[locale].poweredBy}
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
										fill={`${theme === 'light' ? '#6daff0' : '#fff'}`}
										d="M256 40c118.621 0 216 96.075 216 216 0 119.291-96.61 216-216 216-119.244 0-216-96.562-216-216 0-119.203 96.602-216 216-216m0-32C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm-36 344h12V232h-12c-6.627 0-12-5.373-12-12v-8c0-6.627 5.373-12 12-12h48c6.627 0 12 5.373 12 12v140h12c6.627 0 12 5.373 12 12v8c0 6.627-5.373 12-12 12h-72c-6.627 0-12-5.373-12-12v-8c0-6.627 5.373-12 12-12zm36-240c-17.673 0-32 14.327-32 32s14.327 32 32 32 32-14.327 32-32-14.327-32-32-32z"
									/>
								</svg>
								<p class="infoText ">
									{localizedAbbreviatedNumber(
										locale,
										Number(data.score.personal),
										1
									)}
									{language[locale].treesPlantedBy}
									{data.displayName}
									{community === 'true'
										? `${language[locale].and} ${localizedAbbreviatedNumber(
												locale,
												Number(data.score.received),
												1
										  )} ${language[locale].treesPlantedByComm}`
										: ''}
								</p>
							</div>
						{/if}
					</div>
				</div>
			</div>
			<div class="imageHeader">
				{#if data.image}
					<div
						class="logoPlanet"
						style={`background-color:${theme === 'dark' ? '#2f3336' : ''}`}
					>
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
					</div>
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
		</div>
	{:catch error}
		<p>An error occurred!</p>
	{/await}
</div>
<div class="marker" style="display:none">
	<svg />
</div>

<style>
	/* @import "https://api.mapbox.com/mapbox-gl-js/v1.2.0/mapbox-gl.css"; */
	@import 'https://widgets.plant-for-the-planet.org/map.css';
	:host {
		all: initial;
	}
	.treemap {
		width: 100%;
		max-width: 940px;
		border-radius: 10px;
		display: flex;

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

	.portrait {
		flex-direction: column;
	}

	.landscape {
		flex-direction: row;
	}

	.w40 {
		width: 40%;
	}

	.w60 {
		width: 60%;
	}

	.w100 {
		width: 100%;
	}

	.mainContainer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	.treeCounterContainer {
		height: 420px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		border-top-right-radius: 10px;
		border-top-left-radius: 10px;
		padding-right: 10px;
		padding-left: 10px;
	}

	.customBackground {
		width: 100%;
		height: 100%;
		position: absolute;
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
		max-width: 220px;
		word-wrap: break-word;
	}
	.planted {
		color: var(--primary-color);
	}
	.primaryButton {
		color: white;
		font-weight: bold;
		background-image: linear-gradient(97deg, #68b030 4%, #007a49 116%);
		height: 48px;
		padding: 0px;
		text-align: center;
		border: 0px;
		border-radius: 52px;
		min-width: 205px;
		margin-top: 24px;
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

	.mapContainer {
		position: relative;
		height: 420px;
		border-radius: 20px;
	}
	.view {
		height: 420px;
		width: 100%;
	}

	* {
		outline: none !important;
	}
	.footer {
		display: flex;
		flex-direction: row;
		font-size: 14px;
		position: absolute;
		bottom: 12px;
		right: 12px;
	}
	.footerLink > a,
	.footerLinkBold > a {
		color: var(--link-color);
		text-decoration: none;
	}
	.footerLinkBold {
		font-weight: bold;
		margin-left: 4px;
		display: flex;
		flex-direction: row;
	}
	.seperater {
		padding-right: 4px;
	}
	.footerContainer {
		display: flex;
		flex-direction: row;
	}
	.imageHeader {
		position: absolute;
		top: 12px;
		right: 12px;
		display: flex;
		flex-direction: row;
	}
	@media screen and (max-width: 376px) {
		.footerContainer {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			width: 300px;
			margin-right: 6px;
		}
		.footerLink {
			margin-bottom: 6px;
		}
		.seperater {
			display: none;
		}
	}

	.logo {
		border-radius: 50%;
		height: 64px;
		width: 64px;
		box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.16);
	}

	.logoPlanet {
		height: 64px;
		width: 64px;
		background-color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.16);
		margin-left: 12px;
	}

	.logoPlanet > img {
		height: 52px;
		width: 52px;
	}

	.logoPlanet > svg {
		border-radius: 50%;
	}

	.marker {
		height: 30px;
		min-width: 60px;
		padding: 6px 8px;
		background-color: var(--background-color);
		border-radius: 7px;
		box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		color: var(--primary-color);
		font-weight: bold;
		font-size: 18px;
	}

	.marker::after {
		content: '';
		position: absolute;
		left: 36%;
		top: 100%;
		width: 0;
		height: 0;
		border-left: 10px solid transparent;
		border-right: 10px solid transparent;
		border-top: 10px solid var(--background-color);
		clear: both;
	}

	.marker > svg {
		margin-left: 3px;
	}

	a {
		display: flex;
		flex-direction: row;
		text-decoration: none;
	}

	.viewPortrait {
		border-bottom-left-radius: 10px;
		border-bottom-right-radius: 10px;
	}

	.viewLandscape {
		border-top-right-radius: 10px;
		border-bottom-right-radius: 10px;
	}

	.infoIcon {
		margin-left: 4px;
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

	/* .darkLogo {
        border-radius:50%
    } */
</style>
