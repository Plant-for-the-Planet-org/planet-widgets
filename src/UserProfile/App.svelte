<script>
  import UserProfileLoader from "../../utils/contentLoaders/UserProfileLoader.svelte";
  import MapContributions from "./MapContributions.svelte";
  import TreeCounter from "./TreeCounter.svelte";

  let userguid = "prf_P0BbQ7CQMjrbDjjYQos232Np";
  const fetchProfileData = (async () => {
    const response = await fetch(`${__myapp.env.API_URL}/profiles/${userguid}`);
    return await response.json();
  })();
</script>

<div class="userprofile">
  {#await fetchProfileData}
    <UserProfileLoader />
  {:then data}
    <TreeCounter {data} />
    <MapContributions {userguid} {data} />
  {:catch error}
    <p>An error occurred!</p>
  {/await}
</div>

<style>
  .userprofile {
    height: 420px;
    width: 940px;
    border-radius: 10px;
    display: flex;
    flex-direction: row;
  }
</style>
