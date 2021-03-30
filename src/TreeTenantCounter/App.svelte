<svelte:options tag="tree-tenantcounter" immutable={true} />

<script>
  import UserProfileLoader from "../../utils/contentLoaders/UserProfileLoader.svelte";
  import { localizedAbbreviatedNumber } from "../../utils/formatNumber";
  import enLocale from "./../../public/data/locales/en.json";
  import deLocale from "./../../public/data/locales/de.json";

  // Props that can be passed
  export let primarycolor = "#68b030";
  export let circlebgcolor;
  export let theme = "light";
  export let locale = "en";
  export let goal;
  export let tenantkey;

  goal = Number(goal);
  $: primarycolor = primarycolor;
  $: counterbgcolor = circlebgcolor
    ? circlebgcolor
    : theme === "light"
    ? "#23519b"
    : "#2f3336";

  let language = [];
  language["en"] = enLocale;
  language["de"] = deLocale;

  let userpofiledata;
  const fetchProfileData = (async () => {
    const response = await fetch(`${__myapp.env.API_URL}/tenantScore`, {
      headers: {
        "tenant-key": tenantkey,
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
    --counter-background-color: {counterbgcolor}; 
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
            <p class={`treecount ${theme === "dark" ? "planted" : ""}`}>
              {localizedAbbreviatedNumber(locale, Number(data.total), 1)}
            </p>
            <p class={`treecountLabel ${theme === "dark" ? "planted" : ""}`}>
              {language[locale].treesPlanted}
            </p>
          </div>
          {#if goal !== 0}
            <div class="textContainer">
              <p class="treecount">
                {localizedAbbreviatedNumber(locale, Number(goal), 1)}
              </p>
              <p class="treecountLabel">{language[locale].target}</p>
            </div>
          {/if}
        </div>

        <svg
          style={`width:${size * 2}px; height:${size * 2}px;position:absolute;`}
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
      </div>
    </div>
  {:catch error}
    <p>An error occurred!</p>
  {/await}
</div>

<style>
  @import "https://fonts.googleapis.com/css2?family=Raleway:wght@400;700&display=swap";

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
