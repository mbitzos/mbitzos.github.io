import "highlight.js/styles/github-dark-dimmed.css";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

require("@/assets/main.scss");

createApp(App)
  .use(router)
  .mount("#app");
