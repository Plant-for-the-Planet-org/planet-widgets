<svelte:options tag="tree-tenantleaderboard" immutable={true} />

<script>
    let selectedTab = 'recent';

    function setSelectedTab(tab){
        selectedTab=tab;
    }

    let leaderboardData;
    const fetchProfileData = (async () => {
        const response = await fetch(`${__myapp.env.API_URL}/leaderboard`,{headers: {
        'tenant-key': "ten_I9TW3ncG"}});
        leaderboardData = await response.json();
        return leaderboardData;
    })();
</script>
{#await fetchProfileData}
{:then leaderboardData}

<div class = "leaderboardSection">
<div class = "headerButtons">
  <button class="tabButton" on:click={()=>setSelectedTab('recent')} >most recent</button> 
  <button class="tabButton" on:click={()=>setSelectedTab('highest')} >most trees</button> 
  <button class="tabButton" on:click={()=>setSelectedTab('search')}>search</button>
  <!-- {selectedTab}  -->
</div>

<div class = "row-container">
    {#if (selectedTab === "recent")}
    {#each leaderboardData.mostRecent as item}
    <div class = "row">
        <p class = "user">{item.donorName}</p>
        <p class = "treeCount">{item.treeCount}</p>
</div>
    {/each}
    
    
    {:else if (selectedTab === "highest")}
    {#each leaderboardData.mostDonated as item}
    <div class = "row">

        <p class = "user">{item.donorName}</p>
        <p class = "treeCount">{item.treeCount}</p>
    </div>
    {/each}
        {:else} 
            <input type = "text" placeholder = "Search User" />
        {/if}
    </div>
</div>

{:catch error}
        <p>An error occurred!</p>
    {/await}
<style>
        @import "https://fonts.googleapis.com/css2?family=Raleway:wght@400;700&display=swap";

    .leaderboardSection{
        width: 320px;
        padding: 16px;
        font-family: "Raleway", sans-serif;
    }
.row-container{
    width: 100%;
    height: auto;
}
@media screen and (min-width: 320px){
    .leaderboardSection{
        width: 100%;
        max-width: 528px;
    }
}

.row{
    border-bottom: 1px solid black;
    display: flex;
    justify-content: space-between;
}

.leaderboardSection > .headerButtons{
    display: flex;
    justify-content: center;
    font-family: "Raleway", sans-serif!important;
}
.tabButton{
    font-family: "Raleway", sans-serif!important;
}
</style>
