<script>
  import MapContributions from './MapContributions.svelte'
  import TreeCounter from './TreeCounter.svelte'

  let userguid = 'prf_sFuRTP4aB8mhAxi3CzyFND8u';
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