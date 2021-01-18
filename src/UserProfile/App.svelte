<script>
  import MapContributions from "./MapContributions.svelte";
  import TreeCounter from "./TreeCounter.svelte";

  let userguid = "prf_P0BbQ7CQMjrbDjjYQos232Np";
</script>

<div class="userprofile">
  <TreeCounter {userguid} />
  <MapContributions {userguid} />
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
