<script>
  import { loadModules,loadCss } from "esri-loader";  

  export let centerText;

  // Function that gets called when the element is created.
  // https://svelte.dev/tutorial/actions
  // https://svelte.school/tutorials/introduction-to-actions
  const createMap = async (domNode) => {
    // Use esri-loader to load the EsriMap and MapView modules
    // // https://github.com/Esri/esri-loader#usage
    const esriLoaderOptions = { css: true };
    const [EsriMap, MapView] = await loadModules(
      ["esri/Map", "esri/views/MapView"],
      esriLoaderOptions
    );

    // loadCss('http://server/path/to/esri/css/main.css');

    // Create the map
    const map = new EsriMap({
      basemap: "streets"
    });

    // Create the mapView from the map
    const view = new MapView({
      container: domNode,
      map: map,
      zoom: 8,
      center: [-90, 38] // longitude, latitude
    });

    // Use the watch functionality of the JavaScript API (view.watch) to call a
    // function every time the extent changes. Every time it does, update the
    // "centerText" variable - Svelte takes care of updating the UI based
    // on this variable assignment
    // (Reactivity!) https://svelte.dev/tutorial/reactive-assignments
    view.watch("center", center => {
      const { latitude, longitude } = center;
      centerText = `Lat: ${latitude.toFixed(2)} | Lon: ${longitude.toFixed(2)}`;
    });
  };
  const coordinates = { lat: 48, lng: 3 };
</script>

<style>
  .view {
    height: 400px;
    width: 400px;
  }
</style>

<!-- use:createMap calls the "createMap" function (defined above) when the  -->
<!-- element is created. -->
<!-- See the "createMap" function def above for more info. -->
<div class="view" use:createMap />

{#if centerText}
  <p>{centerText}</p>
{/if}
