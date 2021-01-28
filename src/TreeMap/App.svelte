<svelte:options tag="tree-map" immutable={true} />

<script>
    import UserProfileLoader from "../../utils/contentLoaders/UserProfileLoader.svelte";
    import { getFormattedNumber } from "../../utils/formatNumber";
    import mapboxgl from "mapbox-gl";
    import styleJson from "../../public/data/styles/root.json";
    import { fetchTiles } from "../../utils/mapUtils";
    import getImageUrl from "../../utils/getImageUrl";
    import enLocale from './../../public/data/locales/en.json';
    import deLocale from './../../public/data/locales/de.json';

    // Props that can be passed
    export let user;
    export let primaryColor = "#68b030";
    export let theme = "light";
    export let circleBGColor;
    export let community = "true";
    export let locale = "en";

    let counterBGColor = circleBGColor ? circleBGColor : theme === 'light' ? "#23519b" : "#2f3336";

    let language;

    switch(locale){
        case "en": language=enLocale; break;
        case "de": language=deLocale; break;
        default: language=enLocale; break;
    }

    let mapStyle;
    let userpofiledata;
    const fetchProfileData = (async () => {
        const response = await fetch(
            `${__myapp.env.API_URL}/profiles/${user}`
        );
        userpofiledata = await response.json();
        fetchTiles(
            styleJson,
            "https://basemaps.arcgis.com/arcgis/rest/services/World_Basemap_v2/VectorTileServer"
        ).then((style) => {
            if (style) {
                mapStyle = style;
            }
        });
        return userpofiledata;
    })();

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
        const map = new mapboxgl.Map({
            container: domNode,
            style: mapStyle, // stylesheet location
            center: [-28.5, 36.96], // starting position [lng, lat]
            zoom: 1, // starting zoom
            height:'100%',
            width:'100%'
        });

        map.on("load", () => {
            fetchContributionsData.then((contributions) => {
                if (contributions.length > 0) {
                    contributions.map((contribution) => {
                        if (contribution.geometry) {
                            var el = document.createElement("div");
                            var treeCount = document.createTextNode(
                                contribution.properties.treeCount
                            );

                            el.appendChild(treeCount);

                            var svgNS = "http://www.w3.org/2000/svg";
                            var tree = document.createElementNS(svgNS, "svg");

                            tree.setAttributeNS(null, "width", 10.5);
                            tree.setAttributeNS(null, "height", 12.598);
                            tree.setAttributeNS(
                                null,
                                "viewBox",
                                "0 0 10.5 12.598"
                            );

                            var pathNS = "http://www.w3.org/2000/svg";
                            var path = document.createElementNS(pathNS, "path");
                            path.setAttributeNS(
                                null,
                                "d",
                                "M9,15.1V12.235a2.9,2.9,0,0,1-1,.175,3.033,3.033,0,0,1-2.093-5.2,3.055,3.055,0,0,1-.24-1.19,3,3,0,0,1,5.5-1.68h.167a3.7,3.7,0,1,1-1,7.252v3.5Z"
                            );
                            path.setAttributeNS(
                                null,
                                "transform",
                                "translate(-4.75 -2.75)"
                            );
                            path.setAttributeNS(null, "fill", primaryColor);
                            path.setAttributeNS(null, "stroke", "#fff");
                            path.setAttributeNS(null, "stroke-width", 0.5);
                            tree.appendChild(path);
                            el.appendChild(tree);

                            el.className = "marker";

                            // make a marker for each feature and add to the map
                            new mapboxgl.Marker(el, {
                                anchor: "bottom",
                            })
                                .setLngLat(contribution.geometry.coordinates)
                                .addTo(map);
                        }
                    });
                }
            });
        });
    };
</script>

<div
    class="treemap"
    style="--primary-color: {primaryColor};--counter-background-color: {counterBGColor}; --background-color: {theme=== "light" ? "#fff" : "#2f3336"}; --link-color: {theme === "light" ? "#6daff0" : "#fff"}"
>
    {#await fetchProfileData}
        <UserProfileLoader />
    {:then data}
        <div class="treeCounterContainer">
            <div class="mainContainer">
                <div class="treeCounterComponent">
                    <div class="treeCounter">
                        <div class="textContainer">
                            <p class={`treecount ${theme === 'dark' ? "planted" : ""}`}>
                                {community === "true"
                                    ? getFormattedNumber(
                                          data.score.personal +
                                              data.score.received, locale
                                      )
                                    : getFormattedNumber(data.score.personal,locale)}
                            </p>
                            <p class={`treecountLabel ${theme === 'dark' ? "planted" : ""}`}>{language.treesPlanted}</p>
                        </div>
                        {#if data.score.target != 0}
                            <div class="textContainer">
                                <p class="treecount">
                                    {getFormattedNumber(data.score.target, locale)}
                                </p>
                                <p class="treecountLabel">{language.target}</p>
                            </div>
                        {/if}
                    </div>

                    <svg
                        style={`width:${size * 2}px; height:${
                            size * 2
                        }px;position:absolute;`}>
                        <circle
                            cx={size}
                            cy={size}
                            r={radius}
                            stroke={primaryColor}
                            stroke-linecap="round"
                            stroke-width="16"
                            transform={`rotate(-90,${size},${size})`}
                            stroke-dasharray={circumference}
                            stroke-dashoffset={circumference *
                                (1 -
                                    (data.score.personal +
                                        data.score.received) /
                                        data.score.target)}
                            fill="transparent"
                        />
                    </svg>
                </div>
                <a
                    href={`${__myapp.env.APP_URL}/s/${data.slug}`}
                    class="primaryButton"
                    on:click
                    target="_blank">{language.plantTrees}</a>
            </div>
        </div>
        <div class="mapContainer">
            {#if mapStyle}
                <div id="map" class="view" use:createMap />
                <div class="footer">
                    <a
                        href={`https://www1.plant-for-the-planet.org/t/${data.slug}`}
                        target="_blank"
                        class="footerLink">{language.viewProfile}
                    </a>
                    <a
                        class="footerLinkBold"
                        href={`https://www1.plant-for-the-planet.org/`}
                        target="_blank">| {language.poweredBy}
                    </a>
                    {#if community === "true"}
                    <div class="infoIcon" style={`color: ${theme === 'dark' ? "#fff" : "#000"}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" height="14" width="14" viewBox="0 0 512 512">
                            <path
                              fill={`${theme === "light" ?"#6daff0" : "#fff"}`}
                              d="M256 40c118.621 0 216 96.075 216 216 0 119.291-96.61 216-216 216-119.244 0-216-96.562-216-216 0-119.203 96.602-216 216-216m0-32C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm-36 344h12V232h-12c-6.627 0-12-5.373-12-12v-8c0-6.627 5.373-12 12-12h48c6.627 0 12 5.373 12 12v140h12c6.627 0 12 5.373 12 12v8c0 6.627-5.373 12-12 12h-72c-6.627 0-12-5.373-12-12v-8c0-6.627 5.373-12 12-12zm36-240c-17.673 0-32 14.327-32 32s14.327 32 32 32 32-14.327 32-32-14.327-32-32-32z"
                            />
                          </svg>
                          <p class="infoText ">

                            {getFormattedNumber(data.score.personal,locale)} {language.treesPlantedBy} {data.displayName}
                            {community === "true"
                                ? `${language.and} ${getFormattedNumber(data.score.received, locale)} ${language.treesPlantedByComm}`
                                : ""}
                          </p>
                    </div>
                    {/if}

                </div>
                <div class="imageHeader">
                    {#if data.image}
                    <a
                        href={`https://www1.plant-for-the-planet.org/t/${data.slug}`}
                        target="_blank">
                        <img
                            class="logo"
                            src={getImageUrl("profile", "thumb", data.image)}
                            alt={data.displayName}
                        />
                    </a>
                    {/if}
                    {#if data.hasLogoLicense}
                        <div class="logoPlanet">
                            {#if theme === "light"}
                            <img
                                src={`${__myapp.env.CDN_URL}/logo/svg/planet.svg`}
                                alt="Powered by Plant-for-the-Planet"
                            />
                            {:else}
                                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" id="Ebene_1" x="0px" y="0px" viewBox="0 0 384.9 387.1" style="enable-background:new 0 0 384.9 387.1;" xml:space="preserve">
                                    <style type="text/css">
                                        .st0{fill:#2F3336;}
                                        .st1{fill:#FFFFFF;}
                                    </style>
                                    <rect class="st0" width="384.9" height="387.1"></rect>
                                    <g id="Ebene_4">
                                        <path class="st1" d="M292.2,307.9L272.3,275l-9.5-43.1l49.7-40.2l-6.3-11l-12.4,16l0.6-12.6l-5.6-0.4l-0.7,15.2l-29.8,27l-4-13.6   l-7.6,0.8l1,15l-14.4-10.6l24.8-20l-6.3-11l-12.4,16l0.6-12.6l-5.6-0.4l-0.7,15.2l-8,7.3l-12.9-9.4l-4.2-10.4l-1.3,0.3l2.2,7.8   l-12.5-8.4L184,208.2l0.5-12.6l-5.6-0.4l-0.7,15.2l-7.6,6.8l-12.5-9.1l-4.3-10.4l-1.3,0.3l1.9,6.9l-16.5-6.7l-4.4,9.8l29.7,15.7   l-14.9,13.5l-4-13.6l-7.6,0.8l1,15l-35.1-25.6l-4.2-10.4l-1.3,0.3l1.9,6.9L82.8,204l-4.4,9.8l57.2,30.4l3.6,29.4l-4.1,35.2   l-8.9,23.7l-10.1,3.8l2.5,9.6l18.3-7.1l14.5-53l20.8,52.1l25.2-9.8l-0.7-15.1l10.2-32.8l20.7,51.9l25.2-9.8l-0.7-13.8l0.1-0.2   l9.1-34.2l20.8,52.1l25.2-9.8l-0.6-13.2L292.2,307.9z M194.6,268.1l-4.1,35.1l-5.9,15.6l-2.2,0.7l-19.9-32.9l-9.5-43.1l18.8-15.2   l19.2,10.2l3.6,29.5L194.6,268.1z M203.9,231.5l-4-13.6l-7.6,0.8l1,15l-14.8-10.8l19.2-15.5l20.7,11L203.9,231.5z M249,262.4   l-4.1,35.1l-0.1,0.2l-5.5,14.5l-2.1,0.6l-19.4-32l-0.1-0.2l-9.4-42.9l18.4-14.8l18.7,9.9l3.6,29.5L249,262.4z M244.7,222.4   l-0.7-10.1l-6.2,5L244.7,222.4z M182.9,222.8l7.3,5.3l-0.7-10.7L182.9,222.8z M198,210.6l-6.8,5.5l10.7-1.1l3.4,11.7l8.5-7.7   L198,210.6z M172.1,231.5l-16.1,13l0.6,2.9l32.3-3.4l-0.5-3.9L172.1,231.5z M227.1,226l-15.7,12.7l0.6,2.9l31.4-3.3l-0.5-3.8   L227.1,226z M194,114c-0.6-5.6-6.3-9.9-12.2-9.2c-2.9,0.3-5.7,1.7-7.6,4c-1.8,2.1-2.7,4.8-2.5,7.6c0.3,3.1,1.8,6,4.2,8.1   c1.9,1.6,4.4,2.5,6.9,2.6c0,0,0.7,0,1.3-0.1c0.6-0.1,1.4-0.2,1.4-0.2C191,125.5,194.6,120.3,194,114z M176.1,65.3l-3,13.2l8.5-0.9   L176.1,65.3z M114.8,77.9c3.6-0.4,7.4-0.8,6.9-5.6c-0.5-5-4-4.7-7.9-4.2l-1.7,0.2l1,9.9L114.8,77.9z M168.9,149.9   c-1.4-0.5-3.4-0.3-5.2-0.1l0,0l-1.7,0.2l1.1,9.9l1.7-0.2c3.6-0.4,7.4-0.8,6.9-5.6C171.3,151.7,170.5,150.4,168.9,149.9z    M340.8,134.2l-0.3-2.7l-0.9-8.7l-0.3-2.7l-2.7,0.3l-25.8,2.7c-4-3.6-11-6-16.4-6.1c1.3-10.7-4.3-30.3-26.5-30.4   c-0.9-8.4-3.9-17.7-9.1-24.1l-0.7-6.5l5.8-0.6l2.7-0.3l-0.3-2.7l-0.9-8.7l-0.3-2.7l-2.7,0.3l-26.6,2.8l-10.3,1.1l-2.7,0.3l0.3,2.7   l0.7,6.4c-2.1,0.8-4.1,1.7-6.1,2.7l-8.9-9.2l-0.9-0.9l-1.3,0.1l-10.3,1.1l-2.7,0.3l0.3,2.7l0.8,7.6c-2.7-0.2-5.4-0.2-8.1,0.2   l-3.8-7.6l-0.8-1.7l-1.9,0.2L169,51.2l-1.8,0.2l-0.5,1.8L163,66.8c-3.9-2.7-9.5-3.7-15.7-3.4l-0.8-7.2l-0.3-2.7l-2.7,0.3l-10.3,1.1   l-2.7,0.3l0.3,2.7l0.4,3.6c-0.8-0.9-1.6-1.7-2.6-2.3c-3.2-2.2-7.4-3-12.5-2.5l-15.7,1.7l-2.7,0.3l0.3,2.7l4.1,39.5l0.1,0.7   c-11.1,6.3-14.6,20.1-11.1,29.9c-9.4,1.5-20.2,8.4-25,17.4l-1.7,0.2l0,0l-23.8,2.5l-2.7,0.3l0.3,2.7l0.9,8.7l0.3,2.7l2.7-0.3   l5.8-0.6l2.9,28.1l0.3,2.7l2.7-0.3l7-0.7c-13.8,17.3,4.1,52.3,37.4,46.2c3.5,9.9,18.3,10.2,35.2,8.7l-0.5-3.8l-58.2-30.9l6.6-14.5   l13.8,5.6l-1.2-4.3l6.3-1.5l4.8,11.8l29.7,21.7l-0.8-11.8l12.4-1.3l3.5,11.7l8.9-8.1l-28.5-15.1l6.5-14.5l13.8,5.6l-1.2-4.3   l6.2-1.5l4.8,11.8l10.1,7.4l5.1-4.6l0.8-16.8l10.9,0.8l-0.3,6.8l9.2-11.9l8.5,5.8l-1-3.5l6.2-1.4l4.9,11.8l10.5,7.7l5.5-5l0.8-16.8   l10.9,0.8l-0.3,6.8l9.7-12.5l9.5,16.5l-15.1,12.2l9.8-1.1l3.5,11.7l25.8-23.3l0.8-16.8l10.9,0.8l-0.3,6.8l9.7-12.4l9.5,16.5   L265.9,233l0.7,3.1c13.9-1.3,28.2-3.6,34.1-16c26.1-1.2,39.5-33.3,25.8-50c-2.1-2.5-3.3-2.8-3.3-2.8l9.6-1l2.7-0.3l-0.3-2.7   l-2.9-28.1l5.8-0.6L340.8,134.2z M207,49.9l21.4,22.3l-2.5-24.3l36.1-3.8l0.9,8.7l-8.5,0.9l3.2,30.8l-10.3,1.1l-3.2-30.8l-7.2,0.7   l3.3,30.8l-10.3,1.1l-21.4-22.4l2.5,24.3l-10.2,1L196.8,51L207,49.9z M220,131.9l-10.3,1.1l-4.1-39.5l15.3-1.6   c4-0.4,7.6,0.2,10.1,1.9c2.8,1.8,4.5,4.9,4.9,8.8c0.5,5.1-1.6,9.4-5.7,11.4l-1.7,0.8l14,14.7l-12.8,1.3l-11.4-14.3L220,131.9z    M143.9,56.5l3.2,30.8l13.6-1.4l8.6-32.1l11.2-1.2l19,38l-10.9,1.2l-3.3-6.6l-14.1,1.5l-2,7.1l-31.4,3.3l-4.1-39.5L143.9,56.5z    M100.8,61l15.7-1.7c4.4-0.5,8,0.2,10.7,2c2.9,1.9,4.6,5.1,5,9.5c0.5,4.5-0.4,8.1-2.5,10.6c-2.1,2.5-5.5,3.8-10,4.3l-5.8,0.6   l1.4,13.1l-10.3,1.1L100.8,61z M96.7,188.4l-1.7-16.2l-14.8,1.6l1.7,16.2L71.7,191l-3.2-30.8l-7.8,0.8l3.2,30.8l-10.2,1l-3.2-30.8   l-8.5,0.9l-0.9-8.7l36.8-3.9l1.6,15.2l14.8-1.6l-1.6-15.2l10.3-1.1l4.1,39.5L96.7,188.4z M111.9,186.8l-4.1-39.5l22.5-2.4l0.8,8.7   l-12.2,1.3l0.7,6.6l11.6-1.2l0.9,8.7l-11.6,1.2l0.7,6.8l12.2-1.3l0.9,8.7L111.9,186.8z M148.9,139.4l-10.2,1.1l-4.1-39.5l22.7-2.4   l0.9,8.7l-12.4,1.3l0.7,6.6l11.2-1.2l0.9,8.7l-11.2,1.2L148.9,139.4z M179.7,163.1c-2.1,2.4-5.4,3.8-10,4.3l-4.5,0.5l-1.3,0.1   l1.4,13.1l-10.3,1.1l-4.1-39.5l15.7-1.7c9.2-1,14.8,3.1,15.7,11.5C182.7,157.1,181.8,160.7,179.7,163.1L179.7,163.1z M161,117.4   c-0.6-5.6,1.3-11.2,5.1-15.3c7.9-8.5,20.9-9.9,30.3-3.2c4.6,3.3,7.6,8.3,8.2,14c1.7,11.5-6.4,22.2-17.9,23.9   c-0.5,0.1-1.1,0.1-1.6,0.2l0,0C172.5,138.2,162.3,130,161,117.4z M277.4,169.4L255.9,147l2.5,24.4l-10.3,1.1l0,0l-9.7,1l-3.3-6.6   l-14.1,1.5l-2,7.2l-10.9,1.1l0,0l-20.5,2.1l-4.1-39.5l10.3-1.1l3.2,30.8l13.6-1.4l8.6-32.1l11.2-1.2l17.3,34.1l-3.7-35.5l10.3-1.1   l21.4,22.3l-2.5-24.3l10.2-1.1l4.2,39.5L277.4,169.4z M329.3,132.7l3.2,30.8l-10.3,1.1l-3.2-30.8l-19.5,2.1l0.7,6.6l11.6-1.3   l0.9,8.7l-11.6,1.2l0.7,6.8l12.2-1.3l0.9,8.7l-22.5,2.4l-4.1-39.5l21.9-2.3l26.6-2.8l0.9,8.7L329.3,132.7z M223.1,160.2l8.5-0.9   l-5.6-12.3L223.1,160.2z M218.1,100.2l-1.4,0.1l1,9.9l1.4-0.2c3.1-0.4,6.7-1.4,6.2-5.6C225,101.1,222.7,99.8,218.1,100.2   L218.1,100.2z"></path>
                                    </g>
                                    </svg>
                            
                            {/if}
                        </div>
                    {/if}
                </div>
            {/if}
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
    @import "https://fonts.googleapis.com/css2?family=Raleway:wght@400;700&display=swap";
    @import "map.css";
    .treemap {
        width: 100%;
        border-radius: 10px;
        display: flex;
        flex-direction: column;
        align-items: center;
        border: 1px solid #d5d5d5;
        vertical-align: baseline;
        font-family: "Raleway", sans-serif;
        text-decoration: none;
        margin: 10px 0px 10px 0px;
        background-color: var(--background-color);
    }

    .mainContainer {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    .treeCounterContainer {
        height: 420px;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border-top-right-radius: 10px;
        border-top-left-radius: 10px;
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
    }
    .treecount {
        font-size: 48px;
        font-weight: bold;
        text-align: center;
        color: white;
        margin: 0px;
    }
    .treecountLabel {
        font-size: 13px;
        font-weight: bold;
        text-align: center;
        color: white;
        margin: 0px;
        margin-top: 6px;
    }
    .planted{
        color: var(--primary-color)
    }
    .primaryButton {
        color: white;
        font-weight: bold;
        background-image: linear-gradient(97deg, #68B030 4%, #007A49 116%);
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
        width:100%;
    }
    .view {
        height: 420px;
        width: 100%;
    }
    .footer {
        display: flex;
        flex-direction: row;
        font-size: 14px;
        position: absolute;
        bottom: 12px;
        right: 12px;
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

    @media screen and (min-width: 640px) {
        .treemap {
            flex-direction: row;
        }
        .treeCounterContainer {
            border-top-right-radius: 0px;
            border-top-left-radius: 10px;
            border-bottom-left-radius: 10px;
        }
        .mapContainer{
            width:100%
        }
        .view {
            width:100%
        }
    }

    @media screen and (min-width: 940px) {
        .treemap {
            max-width: 940px;
        }
        .treeCounterContainer {
            max-width: 420px;
        }
        .mapContainer{
            max-width: 520px;
        }
        .view {
            max-width: 520px;
        }
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
        content: "";
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
        text-decoration: none;
    }

    #map {
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;
    }

    @media screen and (min-width: 940px) {
        #map {
            border-bottom-left-radius: 0px;
            border-top-right-radius: 10px;
            border-bottom-right-radius: 10px;
        }
    }
    .infoIcon{
        margin-left: 4px;
        position: relative;
    }

    .infoText{
        background-color: var(--background-color);
        margin:0px;
        padding:8px;
        position: absolute;
        right: 0px;
        bottom: 20px;
        width:220px;
        border-radius: 4px;
        text-align: center;
    }

    .infoIcon > .infoText {
        display: none;
    }
    .infoIcon:hover{
        cursor:pointer
    }
    .infoIcon:hover > .infoText {
        display: block;
    }

    /* .darkLogo {
        border-radius:50%
    } */
</style>
