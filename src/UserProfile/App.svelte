<script>
  import MapContributions from './MapContributions.svelte'
  import TreeCounter from './TreeCounter.svelte'
</script>

<div class="userprofile">
  <TreeCounter/>
  <MapContributions/>
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