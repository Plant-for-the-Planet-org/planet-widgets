<svelte:options tag="tree-popup" immutable={true} />

<script>
    import { writable } from "../../utils/localstorage";
    export let message;
    export let buttontext;
    export let theme = "light";
    const now = new Date();
    let cookiePolicy = localStorage.getItem("hidePlanetCookie");
    if(cookiePolicy){
        cookiePolicy = JSON.parse(cookiePolicy)
        if(now.getTime() > cookiePolicy.expiry){
            localStorage.removeItem('hidePlanetCookie')
            cookiePolicy = null;
        }
    }

    export const hideCookieNotification = writable(cookiePolicy);
    function hideCookieNotice() {
        
        const expiryTime = now.getTime() + 15000; 
        const data ={
            value: true,
            expiry: expiryTime,
        }
        hideCookieNotification.subscribe((value) => {
            localStorage.setItem("hidePlanetCookie", JSON.stringify(data));
        });
        
        cookiePolicy = true;
    }
    
</script>

{#if !cookiePolicy}
    <div
        class="cookiePolicy"
        style="--bg-color: {theme === 'light' ? '#fff' : '#2f3336'};
            --text-color: {theme === 'light'
            ? '#000000'
            : '#fff'};"
    >
        <div class="policyNotice">
            <div class="cookiePolicyLink" />
            {@html message}
        </div>
        <button
            id={"cookieCloseButton"}
            class="primaryButton"
            on:click={hideCookieNotice}
        >
            {buttontext}
        </button>
    </div>
{/if}

<style>
    @import "https://fonts.googleapis.com/css2?family=Raleway:wght@400;700&display=swap";

    .cookiePolicyLink {
        font-weight: 700;
        color: #007a49;
        text-decoration: none;
    }
    .cookiePolicy {
        position: fixed;
        background-color: var(--bg-color);
        color: var(--text-color);
        box-shadow: 0px 3px 6px -3px;
        bottom: 20px;
        left: 20px;
        width: 280px;
        border-radius: 4px;
        padding: 20px;
        z-index: 999999;
        font-family: "Raleway", sans-serif;
    }
    .policyNotice {
        text-align: center;
    }

    .primaryButton {
        color: white;
        font-weight: bold;
        background-image: linear-gradient(97deg, #68b030 4%, #007a49 116%);
        height: 40px;
        padding: 0px;
        text-align: center;
        border: 0px;
        border-radius: 40px;
        min-width: 200px;
        width: 100%;
        margin-top: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition-duration: 0.5s;
        transition-timing-function: cubic-bezier(0.165, 0.84, 0.44, 1);
        text-decoration: none;
    }
    .primaryButton:hover {
        transform: translateY(-7px);
        cursor: pointer;
    }
</style>
