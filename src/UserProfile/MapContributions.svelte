<script>
    import mapboxgl from "mapbox-gl";
    import styleJson from "../../public/data/styles/root.json";
    import { fetchTiles } from "../../utils/mapUtils";

    export let userguid;
    const fetchContributionsData = (async () => {
        const response = await fetch(
            `${__myapp.env.API_URL}/profiles/${userguid}/contributions`
        );
        return await response.json();
    })();

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

        map.on("load", () => {
            fetchContributionsData.then((contributions) => {
                contributions.map((contribution) => {
                    var el = document.createElement("div");
                    var treeCount = document.createTextNode(
                        contribution.properties.treeCount
                    );

                    el.appendChild(treeCount);

                    var svgNS = "http://www.w3.org/2000/svg";
                    var tree = document.createElementNS(svgNS, "svg");

                    //           <svg xmlns="http://www.w3.org/2000/svg" width="10.5" height="12.598" viewBox="0 0 10.5 12.598">
                    //   <path id="tree_1_" data-name="tree (1)" d="M9,15.1V12.235a2.9,2.9,0,0,1-1,.175,3.033,3.033,0,0,1-2.093-5.2,3.055,3.055,0,0,1-.24-1.19,3,3,0,0,1,5.5-1.68h.167a3.7,3.7,0,1,1-1,7.252v3.5Z" transform="translate(-4.75 -2.75)" fill="#68b030" stroke="#fff" stroke-width="0.5"/>
                    // </svg>

                    tree.setAttributeNS(null, "width", 10.5);
                    tree.setAttributeNS(null, "height", 12.598);
                    tree.setAttributeNS(null, "viewBox", "0 0 10.5 12.598");

                    var pathNS = "http://www.w3.org/2000/svg";
                    var path = document.createElementNS(pathNS, "path");
                    path.setAttributeNS(null, "d", "M9,15.1V12.235a2.9,2.9,0,0,1-1,.175,3.033,3.033,0,0,1-2.093-5.2,3.055,3.055,0,0,1-.24-1.19,3,3,0,0,1,5.5-1.68h.167a3.7,3.7,0,1,1-1,7.252v3.5Z");
                    path.setAttributeNS(null, "transform", "translate(-4.75 -2.75)");
                    path.setAttributeNS(null, "fill", "#68b030");
                    path.setAttributeNS(null, "stroke", "#fff");
                    path.setAttributeNS(null, "stroke-width", 0.5);
                    tree.appendChild(path);
                    el.appendChild(tree);

                    el.className = "marker";

                    // make a marker for each feature and add to the map
                    new mapboxgl.Marker(el)
                        .setLngLat(contribution.geometry.coordinates)
                        .addTo(map);
                });
            });
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
        width: 520px;
    }
</style>
