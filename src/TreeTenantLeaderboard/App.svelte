<svelte:options tag="tree-tenantleaderboard" immutable={true} />

<script>
    import {getFormattedNumber} from '../../utils/formatNumber';
    export let theme = "light";
    let selectedTab = "recent";
    export let locale = "en";
    export let tenantkey;
    function setSelectedTab(tab) {
        selectedTab = tab;
    }

    let leaderboardData;
    const fetchProfileData = (async () => {
        const response = await fetch(`${__myapp.env.API_URL}/leaderboard`, {
            headers: {
                "tenant-key": tenantkey,
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

        <ul class="row-container">
            {#if selectedTab === "recent"}
                {#each leaderboardData.mostRecent as item}
                    <li class="row">
                        <p class="user">{item.donorName}</p>
                        <p class="treeCount">
                            {getFormattedNumber(item.treeCount, locale)} {" "}Trees</p>
                        </li>
                {/each}
            {:else if selectedTab === "highest"}
                {#each leaderboardData.mostDonated as item}
                    <div class="row">
                        <p class="user">{item.donorName}</p>
                        <p class="treeCount">
                        {getFormattedNumber(item.treeCount, locale)} {" "}Trees</p>
                    </div>
                {/each}
            {/if}
                </ul>
    </div>
{:catch error}
    <p>An error occurred!</p>
{/await}

<style>
    @import "https://fonts.googleapis.com/css2?family=Raleway:wght@400;700&display=swap";

    .leaderboardSection {
        min-width: 580px;
        padding: 16px;
        font-family: "Raleway", sans-serif;
        text-align: center;
        min-height: 682px;
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: var(--background-color);
        color: var(--text-color);
        border-radius: 10px;
    }
    .row-container {
        min-width: 580px ;
        height: auto;
        margin: 0px;
        padding: 0px;
    }
    @media screen and (min-width: 320px) and (max-width: 600px) {
        .leaderboardSection {
            min-width: 280px;
        }

        .row-container {
        min-width: 280px;
        height: auto;
        margin: 0px;
        padding: 8px;
    }
    }

    .row {
        border-bottom: 1px solid #dddbda;
        display: flex;
        justify-content: space-between;
        /* color: #080707; */
    }

    .row > .user {
        display: block;
        font-weight: 600;
        text-align: left;
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
