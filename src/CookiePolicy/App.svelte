<svelte:options tag="tree-popup" immutable={true} />
<script>
    import enLocale from '../../public/data/locales/en.json';
    import { writable } from '../../utils/localstorage'

    export let show=true;
    export let message;
    export let locale = "en";
    let language = [];
    language["en"] = enLocale;


const cookiePolicy = localStorage.getItem('hidePlanetCookie')
    export const hideCookieNotification = writable(cookiePolicy)
    hideCookieNotification.subscribe(value => {
       localStorage.setItem('hidePlanetCookie', value === true ? true : false)
       
    })


  function hideCookieNotice(){
      show = false
      hideCookieNotification.set
      hideCookieNotification.update
  }

    
</script>
{#if show}
    <div class="cookiePolicy" >
      <div class="policyNotice">
        {message}
        <a class="policyLink" href="https://www.plant-for-the-planet.org/en/footermenu/privacy-policy">
          {language[locale].privacyPolicy}
        </a>
      </div>
      <button
        id={"cookieCloseButton"}
        class="primaryButton"
        on:click={hideCookieNotice}
      >
        {language[locale].acceptClose}
      </button>
    </div>
{/if}
<style>
      @import "https://fonts.googleapis.com/css2?family=Raleway:wght@400;700&display=swap";

   .cookiePolicy {
  position: fixed;
  background-color: white;
  box-shadow: 0px 3px 6px -3px ;
  bottom: 20px;
  left: 20px;
  width: 280px;
  border-radius: 4px;
  padding: 20px;
  z-index: 10;
  font-family: "Raleway", sans-serif;
 
   }
   .policyNotice {
       text-align: center;
  }
  .policyLink {
    font-weight: bold;
    text-decoration: none;
    color: #007a49;
    display: inline;
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