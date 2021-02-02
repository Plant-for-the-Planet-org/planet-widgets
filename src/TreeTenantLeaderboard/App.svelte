<svelte:options tag="tree-tenantleaderboard" immutable={true} />

<script>
    export let theme = "light";
    let selectedTab = "recent";
    export let tenantKey;
    function setSelectedTab(tab) {
        selectedTab = tab;
    }

    let leaderboardData;
    const fetchProfileData = (async () => {
        const response = await fetch(`${__myapp.env.API_URL}/leaderboard`, {
            headers: {
                "tenant-key": "ten_I9TW3ncG",
            },
        });
        leaderboardData = await response.json();
        return leaderboardData;
    })();

    
</script>

{#await fetchProfileData then leaderboardData}
    <div class="leaderboardSection" 
    style = "--background-color: {theme ==='light' ? '#fff'
    : '#2f3336'}; --text-color: {theme === 'light' ? '#2f3336' : '#fff'};">
        <h2 class="leaderboardTitle">Forest Frontrunners</h2>
        <div class="headerButtons">
            <button
                class={`tabButton ${(selectedTab === "recent"
                    ? "tabButtonActive"
                    : "")}`}
                on:click={() => setSelectedTab("recent")}>MOST RECENT</button
            >
            <button
                class={`tabButton ${(selectedTab === "highest"
                    ? "tabButtonActive"
                    : "")}`}
                on:click={() => setSelectedTab("highest")}>MOST TREES</button
            >
        </div>

        <div class="row-container">
            {#if selectedTab === "recent"}
                {#each leaderboardData.mostRecent as item}
                    <div class="row">
                        <p class="user">{item.donorName}</p>
                        <p class="treeCount">{item.treeCount} Trees</p>
                    </div>
                {/each}
            {:else if selectedTab === "highest"}
                {#each leaderboardData.mostDonated as item}
                    <div class="row">
                        <p class="user">{item.donorName}</p>
                        <p class="treeCount">{item.treeCount} Trees</p>
                    </div>
                {/each}
            {/if}
        </div>
    </div>
{:catch error}
    <p>An error occurred!</p>
{/await}

<style>
    @import "https://fonts.googleapis.com/css2?family=Raleway:wght@400;700&display=swap";

    .leaderboardSection {
        width: 320px;
        padding: 16px;
        font-family: "Raleway", sans-serif;
        text-align: center;
        min-height: 682px;
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: var(--background-color);
        color: var(--text-color);
    }

    .leaderboardTitle {
        font-style: normal;
        font-weight: 600;
        font-size: 36px;
        letter-spacing: -0.4px;
        /* color: #080707; */
    }
    .row-container {
        width: 100%;
        height: auto;
    }
    @media screen and (min-width: 320px) {
        .leaderboardSection {
            width: 100%;
            max-width: 528px;
        }
    }

    .row {
        border-bottom: 1px solid #dddbda;
        display: flex;
        justify-content: space-between;
        /* color: #080707; */
    }

    .row > .user {
        font-weight: 600;
    }

    .row > .treeCount {
        /* color: #3e3e3c; */
    }
    .headerButtons {
        align-self: center;
        width: fit-content;
        display: flex;
        justify-content: center;
        font-family: "Raleway", sans-serif !important;
        background-color: #dddbda;
        border-radius: 15px;
        height: 30px;
    }
    .tabButton {
        background-color: transparent;
        border: 0px;
        font-family: "Raleway", sans-serif !important;
        font-size: 10px;
        font-weight: bold;
        padding-left: 12px;
        padding-right: 12px;
    }
    .tabButton:hover,
    .tabButtonActive {
        background-color: white;
        cursor: pointer;
        border-radius: 15px;
        box-shadow: 0 10px 15px -3px rgb(0 0 0 / 10%),
            0 4px 6px -2px rgb(0 0 0 / 5%);
    }
    .tabButton:focus {
        border: 0px;
        outline: 0px;
    }
</style>
