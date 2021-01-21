import App from "./App.svelte";

function getUserguid() {
  const scripts = document.getElementsByTagName('script');
  const lastScript = scripts[scripts.length-1];
  const scriptName = lastScript;
  return scriptName.getAttribute('userguid');
}
 
const app = new App({
  target: document.body,
  props: {
		userguid: getUserguid() || 'prf_NYCgTC4KSiJU7B0Fq76D7ieM'
	}
});

export default app;
