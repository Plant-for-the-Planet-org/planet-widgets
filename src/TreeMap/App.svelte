<svelte:options tag="tree-map" immutable={true} />

<script>
    import UserProfileLoader from "../../utils/contentLoaders/UserProfileLoader.svelte";
    import { getFormattedNumber } from "../../utils/formatNumber";
    import mapboxgl from "mapbox-gl";
    import styleJson from "../../public/data/styles/root.json";
    import { fetchTiles } from "../../utils/mapUtils";
    import getImageUrl from "../../utils/getImageUrl";
    import enLocale from "./../../public/data/locales/en.json";
    import deLocale from "./../../public/data/locales/de.json";

    // Props that can be passed
    export let user;
    export let primarycolor = "#68b030";
    export let circlebgcolor;
    export let theme = "light";
    export let community = "true";
    export let locale = "en";

    let primaryColor = primarycolor;
    let counterBGColor = circlebgcolor
        ? circlebgcolor
        : theme === "light"
        ? "#23519b"
        : "#2f3336";

    let language;

    switch (locale) {
        case "en":
            language = enLocale;
            break;
        case "de":
            language = deLocale;
            break;
        default:
            language = enLocale;
            break;
    }

    let mapStyle;
    let userpofiledata;
    const fetchProfileData = (async () => {
        const response = await fetch(`${__myapp.env.API_URL}/profiles/${user}`);
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

    //Add  to a geojson [There is a bug with type= gift in contribution where treeCount is not a number]
    const contributionCollectionFile = "/contributions.json";

//Todo: Convert the contributions to a Geojson object and load that geojson into the map.

    // const contributionCollection = {
    //   type: "FeatureCollection",
    //   features: fetchContributionsData
    // };


    // Function that gets called when the element is created.
    // https://svelte.dev/tutorial/actions
    // https://svelte.school/tutorials/introduction-to-actions
    const createMap = async (domNode) => {
        const map = new mapboxgl.Map({
            container: domNode,
            style: mapStyle, // stylesheet location
            center: [-28.5, 36.96], // starting position [lng, lat]
            zoom: 1, // starting zoom
            height: "100%",
            width: "100%",
        });

        map.on("load", () => {
          map.addSource('trees',{
            type: 'geojson',
            data: contributionCollectionFile,
            cluster: true,
            clusterMaxZoom: 18,
            clusterRadius: 20,
            clusterProperties: {
            //  "treeSum": ["+", ["get", "treeCount", ["properties"]]],
            "treeSum": ["+", ["get", "treeCount", ["properties"]]],
            }
          });

          map.addLayer({
            id: 'clusters',
            type: 'circle',
            source: 'trees',
            filter: ['has', 'point_count'],
            paint:{
              'circle-color':'#61B030',
              'circle-radius': 20
            },
          });

//This block below is used to add number to the circle.
          map.addLayer({
            id: 'cluster-count',
            type: 'symbol',
            source: 'trees',
            filter: ['has', 'point_count'],
            paint: {
              'text-field': ['get', 'treeSum'],
              'text-size': 13,
            },
          });

          map.addLayer({
            id: 'unclustered-point',
            type: 'circle',
            source: 'trees',
            filter: ['!', ['has', 'point_count']],
            paint: {
              'circle-color': '#fff030',
              'circle-radius': 20,
              'circle-stroke-width': 1,
              'circle-stroke-color': '#fff'
            },
          });
          try{
            map.addLayer({
              id: 'unclustered-point-label',
              type: 'symbol',
              source: 'trees',
              filter: ['!', ['has', 'point_count']],
              layout: {
                'text-field': ["number-format",
                ['get', 'treeSum'],
                {"max-fraction-digits": 1}
              ],
              'text-size': 12
            }
          });
        }
        catch(e) {
          console.log("Error:" ,e);
        };




            fetchContributionsData.then((contributions) => {
                // if (contributions.length > 0) {
                //     contributions.map((contribution) => {
                //         if (contribution.geometry) {
                //             var el = document.createElement("div");
                //             var treeCount = document.createTextNode(
                //                 contribution.properties.treeCount
                //             );
                //
                //             el.appendChild(treeCount);
                //
                //             var svgNS = "http://www.w3.org/2000/svg";
                //             var tree = document.createElementNS(svgNS, "svg");
                //
                //             tree.setAttributeNS(null, "width", 10.5);
                //             tree.setAttributeNS(null, "height", 12.598);
                //             tree.setAttributeNS(
                //                 null,
                //                 "viewBox",
                //                 "0 0 10.5 12.598"
                //             );
                //
                //             var pathNS = "http://www.w3.org/2000/svg";
                //             var path = document.createElementNS(pathNS, "path");
                //             path.setAttributeNS(
                //                 null,
                //                 "d",
                //                 "M9,15.1V12.235a2.9,2.9,0,0,1-1,.175,3.033,3.033,0,0,1-2.093-5.2,3.055,3.055,0,0,1-.24-1.19,3,3,0,0,1,5.5-1.68h.167a3.7,3.7,0,1,1-1,7.252v3.5Z"
                //             );
                //             path.setAttributeNS(
                //                 null,
                //                 "transform",
                //                 "translate(-4.75 -2.75)"
                //             );
                //             path.setAttributeNS(null, "fill", primaryColor);
                //             path.setAttributeNS(null, "stroke", "#fff");
                //             path.setAttributeNS(null, "stroke-width", 0.5);
                //             tree.appendChild(path);
                //             el.appendChild(tree);
                //
                //             el.className = "marker";
                //
                //             // make a marker for each feature and add to the map
                //             new mapboxgl.Marker(el, {
                //                 anchor: "bottom",
                //             })
                //                 .setLngLat(contribution.geometry.coordinates)
                //                 .addTo(map);
                //         }
                //     });
                // }
            });
        });
    };
</script>

<div
    class="treemap"
    style="--primary-color: {primaryColor};--counter-background-color: {counterBGColor}; --background-color: {theme ===
    'light'
        ? '#fff'
        : '#2f3336'}; --link-color: {theme === 'light' ? '#6daff0' : '#fff'}"
>
    {#await fetchProfileData}
        <UserProfileLoader />
    {:then data}
        <div class="treeCounterContainer">
            <div class="mainContainer">
                <div class="treeCounterComponent">
                    <div class="treeCounter">
                        <div class="textContainer">
                            <p
                                class={`treecount ${
                                    theme === "dark" ? "planted" : ""
                                }`}
                            >
                                {community === "true"
                                    ? getFormattedNumber(
                                          data.score.personal +
                                              data.score.received,
                                          locale
                                      )
                                    : getFormattedNumber(
                                          data.score.personal,
                                          locale
                                      )}
                            </p>
                            <p
                                class={`treecountLabel ${
                                    theme === "dark" ? "planted" : ""
                                }`}
                            >
                                {language.treesPlanted}
                            </p>
                        </div>
                        {#if data.score.target != 0}
                            <div class="textContainer">
                                <p class="treecount">
                                    {getFormattedNumber(
                                        data.score.target,
                                        locale
                                    )}
                                </p>
                                <p class="treecountLabel">{language.target}</p>
                            </div>
                        {/if}
                    </div>

                    <svg
                        style={`width:${size * 2}px; height:${
                            size * 2
                        }px;position:absolute;`}
                    >
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
                    target="_blank">{language.plantTrees}</a
                >
            </div>
        </div>
        <div class="mapContainer">
            {#if mapStyle}
                <div id="map" class="view" use:createMap />
                <div class="footer">
                    <a
                        href={`https://www1.plant-for-the-planet.org/t/${data.slug}`}
                        target="_blank"
                        class="footerLink"
                        >{language.viewProfile}
                    </a>
                    <a
                        class="footerLinkBold"
                        href={`https://www1.plant-for-the-planet.org/`}
                        target="_blank"
                        >| {language.poweredBy}
                    </a>
                    {#if community === "true"}
                        <div
                            class="infoIcon"
                            style={`color: ${
                                theme === "dark" ? "#fff" : "#000"
                            }`}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="14"
                                width="14"
                                viewBox="0 0 512 512"
                            >
                                <path
                                    fill={`${
                                        theme === "light" ? "#6daff0" : "#fff"
                                    }`}
                                    d="M256 40c118.621 0 216 96.075 216 216 0 119.291-96.61 216-216 216-119.244 0-216-96.562-216-216 0-119.203 96.602-216 216-216m0-32C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm-36 344h12V232h-12c-6.627 0-12-5.373-12-12v-8c0-6.627 5.373-12 12-12h48c6.627 0 12 5.373 12 12v140h12c6.627 0 12 5.373 12 12v8c0 6.627-5.373 12-12 12h-72c-6.627 0-12-5.373-12-12v-8c0-6.627 5.373-12 12-12zm36-240c-17.673 0-32 14.327-32 32s14.327 32 32 32 32-14.327 32-32-14.327-32-32-32z"
                                />
                            </svg>
                            <p class="infoText ">
                                {getFormattedNumber(
                                    data.score.personal,
                                    locale
                                )}
                                {language.treesPlantedBy}
                                {data.displayName}
                                {community === "true"
                                    ? `${language.and} ${getFormattedNumber(
                                          data.score.received,
                                          locale
                                      )} ${language.treesPlantedByComm}`
                                    : ""}
                            </p>
                        </div>
                    {/if}
                </div>
                <div class="imageHeader">
                    {#if data.image}
                        <a
                            href={`https://www1.plant-for-the-planet.org/t/${data.slug}`}
                            target="_blank"
                        >
                            <img
                                class="logo"
                                src={getImageUrl(
                                    "profile",
                                    "thumb",
                                    data.image
                                )}
                                alt={data.displayName}
                            />
                        </a>
                    {/if}
                    {#if data.hasLogoLicense}
                        <div class="logoPlanet" style={`background-color:${theme === 'dark' ? "#2f3336" : ""}`}>
                            {#if theme === "dark"}
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
    @import "https://widgets.plant-for-the-planet.org/map.css";
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
        width: 100%;
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
        .mapContainer {
            width: 100%;
        }
        .view {
            width: 100%;
        }
    }

    @media screen and (min-width: 940px) {
        .treemap {
            max-width: 940px;
        }
        .treeCounterContainer {
            max-width: 420px;
        }
        .mapContainer {
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
