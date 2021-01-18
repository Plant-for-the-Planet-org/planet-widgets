<script>
    import UserProfileLoader from "./../../utils/contentLoaders/UserProfileLoader.svelte";
    const fetchProfileData = (async () => {
        const response = await fetch(
            `${__myapp.env.API_URL}/profiles/prf_sFuRTP4aB8mhAxi3CzyFND8u`
        );
        return await response.json();
    })();
</script>

<div class="treeCounterContainer">
    {#await fetchProfileData}
        <UserProfileLoader />
    {:then data}
        
        <div class="treeCounterComponent">
            <div class="treeCounter">
                <div class="textContainer">
                    <p class="treecount"> {data.score.personal+data.score.received} </p>
                    <p class="treecountLabel">Trees Planted</p>
                </div>
                <div class="textContainer">
                    <p class="treecount"> {data.score.target} </p>
                    <p class="treecountLabel">Target</p>
                </div>
            </div>
            <div class="progressCounter">
                
            </div>
        </div>
    {:catch error}
        <p>An error occurred!</p>
    {/await}
</div>

<style>
    .treeCounterContainer{
        height: 420px;
        width: 420px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
    .treeCounterComponent{
        height: 300px;
        width: 300px;
        background-image:radial-gradient(white 0%, white 60%, #47A8DC 100%);
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .treeCounter{
        height: 266px;
        width: 266px;
        border-radius: 50%;
        background-color: #23519B;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
    }
    .treecount{
        font-size: 48px;
        font-weight: bold;
        text-align: center;
        color: white;
    }
    .treecountLabel{
        font-size: 13px;
        font-weight: bold;
        text-align: center;
        color: white;
    }
</style>
