<svelte:options tag="tree-tenantcounter" immutable={true} />

<script>
    import UserProfileLoader from "../../utils/contentLoaders/UserProfileLoader.svelte";
    import {  localizedAbbreviatedNumber } from "../../utils/formatNumber";
    import getImageUrl from "../../utils/getImageUrl";
    import enLocale from "./../../public/data/locales/en.json";
    import deLocale from "./../../public/data/locales/de.json";
    
    // Props that can be passed
    export let primaryColor = "#68b030";
    export let circleBGColor;
    export let theme = "light";
    export let locale = "en";
    export let goal;
    export let tenantKey;

    goal = Number(goal);

    let counterBGColor = circleBGColor
        ? circleBGColor
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

    let userpofiledata;
    const fetchProfileData = (async () => {
        const response = await fetch(`${__myapp.env.API_URL}/tenantScore`,{headers: {
        'tenant-key': 'ten_I9TW3ncG'}});
        userpofiledata = await response.json();
        return userpofiledata;
    })();

    let radius = 140;
    let size = 154;
    let circumference = 2 * Math.PI * radius;
</script>

<div
    class="treecounter"
    style="--primary-color: {primaryColor};
    --counter-background-color: {counterBGColor}; 
    --background-color: {theme ===
    'light'
        ? '#fff'
        : '#2f3336'};
    --link-color: {theme === 'light' ? '#6daff0' : '#fff'}"
>
     {#await fetchProfileData}
       <UserProfileLoader />
     {:then data}
        <div class="treeCounterContainer">
            <div class="treeCounterComponent">
                <div class="treeCounter">
                    <div class="textContainer">
                        <p
                            class={`treecount ${
                                theme === "dark" ? "planted" : ""
                            }`}
                        >
                            {localizedAbbreviatedNumber(locale, Number(data.total),1)}
                        </p>
                        <p
                            class={`treecountLabel ${
                                theme === "dark" ? "planted" : ""
                            }`}
                        >
                            {language.treesPlanted}
                        </p>
                    </div>
                    {#if goal !== 0}
                        <div class="textContainer">
                            <p class="treecount">
                                {localizedAbbreviatedNumber(locale, Number(goal),1)}
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
                                (data.total) /
                                   goal)}
                        fill="transparent"
                    />
                </svg>
            </div>
        </div>
    {:catch error}
        <p>An error occurred!</p>
    {/await}
</div>

<style>
    @import "https://fonts.googleapis.com/css2?family=Raleway:wght@400;700&display=swap";

    .treecounter {
        width: 100%;
        max-width: 420px;
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

    .treeCounterContainer {
        min-height: 420px;
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
        margin-bottom: 24px;
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
    .footer {
        display: flex;
        flex-direction: row;
        font-size: 14px;
        margin-bottom: 12px;
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
        .treeCounterContainer {
            border-top-right-radius: 0px;
            border-top-left-radius: 10px;
            border-bottom-left-radius: 10px;
        }
    }

    @media screen and (min-width: 940px) {
        .treeCounterContainer {
            max-width: 420px;
        }
    }

    a {
        text-decoration: none;
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

    .planted {
        color: var(--primary-color);
    }
</style>
