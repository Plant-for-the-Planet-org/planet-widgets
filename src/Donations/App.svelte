<svelte:options tag="planet-donations" immutable={true} />

<script>
  import enLocale from "./../../public/data/locales/en.json";
  import csLocale from "./../../public/data/locales/cs.json";
  import deLocale from "./../../public/data/locales/de.json";
  import esLocale from "./../../public/data/locales/es.json";
  import frLocale from "./../../public/data/locales/fr.json";
  import itLocale from "./../../public/data/locales/it.json";
  import ptBRLocale from "./../../public/data/locales/pt-BR.json";
  import { onMount } from "svelte";
  import getTenantConfig from "../../utils/tenantsConfig";

  let w;
  // Props that can be passed
  export let user;
  export let primarycolor = "#68b030";
  export let circlebgcolor;
  export let theme = "light";
  export let locale = "en";
  export let refresh = "none";
  export let tenantkey = "ten_I9TW3ncG";
  export let forestname;
  export let project;

  let language = [];
  language["en"] = enLocale;
  language["cs"] = csLocale;
  language["de"] = deLocale;
  language["es"] = esLocale;
  language["fr"] = frLocale;
  language["it"] = itLocale;
  language["pt-br"] = ptBRLocale;

  let showModal = false;

  const openModal = () => {
    showModal = true;
  };

  const closeModal = () => {
    showModal = false;
  };
</script>

<div class={"planet-donations"}>
  <button on:click={openModal} class="donate-button"> Donate </button>
  {#if showModal}
    <div class="modal" id="planet-donations-modal">
      <div class="modal-content">
        <span on:click={closeModal} class="close">&times;</span>
        <div class="modal-body">
          <iframe
            src="http://localhost:3000/?to=replanting-trees-to-the-burnt-magila-natural-forest-reserve"
            width="100%"
            height="100%"
            frameborder="0"
            scrolling="yes"
            allowtransparency="true"
            allowpaymentrequest="true"
            title="Donate to Plant for the Planet"
          />
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  /* @import "https://api.mapbox.com/mapbox-gl-js/v1.2.0/mapbox-gl.css"; */
  @import "https://fonts.googleapis.com/css2?family=Raleway:wght@400;700&display=swap";
  @import "https://widgets.plant-for-the-planet.org/map.css";

  .planet-donations {
    position: relative;
    width: 100%;
    height: 100%;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .donate-button {
    background-color: #68b030;
    min-width: 75px;
    max-width: 150px;
    padding: 0 4px;
    height: 22px;
    display: flex;
    -moz-box-pack: center;
    justify-content: center;
    -moz-box-align: center;
    align-items: center;
    border-radius: 11px;
    border: none;
    color: #fff;
    /* font-family: "Raleway", sans-serif; */
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 0.3px;
    line-height: 1;
  }

  .modal {
    position: fixed;
    z-index: 1;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(0, 0, 0, 0.4);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .modal-content {
    background-color: transparent;
    border: 1px solid #888;
    width: 100%;
    height: 100%;
    /* max-height: 600px; */
    /* max-width: 1000px; */
    position: relative;
  }

  .close {
    color: #aaaaaa;
    font-size: 28px;
    font-weight: bold;
    position: absolute;
    right: 20px;
    top: 20px;
    cursor: pointer;
  }

  .modal-body {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
  }
</style>
