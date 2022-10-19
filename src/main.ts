import "highlight.js/styles/github-dark-dimmed.css";
import "highlight.js/lib/common";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

require("@/assets/main.scss");

createApp(App)
  .use(router)
  .mount("#app");
