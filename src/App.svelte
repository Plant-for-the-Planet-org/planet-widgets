<script>
  import mapboxgl from "mapbox-gl";
  import styleJson from "../public/data/styles/root.json";

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
      zoom: 7, // starting zoom
    });
  };

  async function fetchTiles(style, metadataUrl) {
    try {
      const res = await fetch(metadataUrl);
      const response = res.status === 200 ? await res.json() : null;
      return format(style, response, metadataUrl);
    } catch (e) {
      console.log("Error:", e);
      return null;
    }
  }

  function format(style, metadata, metadataUrl) {
    // ArcGIS Pro published vector services dont prepend tile or tileMap urls with a /
    style.sources.esri = {
      type: "vector",
      scheme: "xyz",
      tilejson: metadata.tilejson || "2.0.0",
      format: (metadata.tileInfo && metadata.tileInfo.format) || "pbf",
      /* mapbox-gl-js does not respect the indexing of esri tiles
because we cache to different zoom levels depending on feature density, in rural areas 404s will still be encountered.
more info: https://github.com/mapbox/mapbox-gl-js/pull/1377
*/
      // index: metadata.tileMap ? style.sources.esri.url + '/' + metadata.tileMap : null,
      maxzoom: 15,
      tiles: [metadataUrl + "/" + metadata.tiles[0]],
      description: metadata.description,
      name: metadata.name,
    };
    return style;
  }
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
