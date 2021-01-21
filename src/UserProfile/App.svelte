<script>
  import UserProfileLoader from "../../utils/contentLoaders/UserProfileLoader.svelte";
  import MapContributions from "./MapContributions.svelte";
  import TreeCounter from "./TreeCounter.svelte";

  export let userguid;
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
      width: 320px;
      border-radius: 10px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  @media screen and (min-width: 940px) {
    .userprofile {
      height: 420px;
      width: 940px;
      flex-direction: row;
    } 
  }
</style>
