// src/main.js
import { createApp } from "vue";
import { createPinia } from 'pinia'
import App from "./App.vue";
import router from "./router";
import "./style.css"; // tailwind & local fonts
import AOS from "aos";
import "aos/dist/aos.css";

if (import.meta.env.PROD) {
  console.log  = () => {};
  console.warn = () => {};
  console.info = () => {};
}

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Global translation helper
import { useLangStore } from "./stores/langStore";
const langStore = useLangStore();
app.config.globalProperties.$t = (key) => langStore.t(key);
app.config.globalProperties.$langStore = langStore;

app.mount("#app")

AOS.init({
  duration: 800,
  once: true,
});