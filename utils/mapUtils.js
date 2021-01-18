export async function fetchTiles(style, metadataUrl) {
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