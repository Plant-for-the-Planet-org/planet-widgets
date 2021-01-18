<script>
    import UserProfileLoader from "./../../utils/contentLoaders/UserProfileLoader.svelte";
    const fetchProfileData = (async () => {
        const response = await fetch(
            "https://app.plant-for-the-planet.org/app/profiles/prf_sFuRTP4aB8mhAxi3CzyFND8u"
        );
        return await response.json();
    })();
</script>

<div class="treeCounter">
    {#await fetchProfileData}
        <UserProfileLoader />
    {:then data}
        <p>Data found {console.log(data)}</p>
    {:catch error}
        <p>An error occurred!</p>
    {/await}
</div>

<style>
    .treeCounter{
        height: 420px;
        width: 420px;
    }
</style>
