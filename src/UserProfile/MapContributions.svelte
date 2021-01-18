<script>
    import mapboxgl from "mapbox-gl";
    import styleJson from "../../public/data/styles/root.json";
    import {fetchTiles} from '../../utils/mapUtils';
    let mapStyle;
    const promise = fetchTiles(
      styleJson,
      "https://basemaps.arcgis.com/arcgis/rest/services/World_Basemap_v2/VectorTileServer"
    );
    promise.then((style) => {
      if (style) {
        mapStyle = style;
      }
    });
  
    // Function that gets called when the element is created.
    // https://svelte.dev/tutorial/actions
    // https://svelte.school/tutorials/introduction-to-actions
    const createMap = async (domNode) => {
      const map = new mapboxgl.Map({
        container: "map",
        style: mapStyle, // stylesheet location
        center: [-74.5, 40], // starting position [lng, lat]
        zoom: 1, // starting zoom
      });
    };

  </script>
  
  <!-- use:createMap calls the "createMap" function (defined above) when the  -->
  <!-- element is created. -->
  <!-- See the "createMap" function def above for more info. -->
  {#if mapStyle}
    <div id="map" class="view" use:createMap />
  {/if}
  
  <style>
    .view {
      height: 400px;
      width: 400px;
    }
  </style>
  