import "highlight.js/styles/github-dark-dimmed.css";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { createMetaManager } from "vue-meta";
import VueGtag from "vue-gtag";
import PrivacyMixin from "./views/privacy/mixins";

const GA_TOKEN = process.env.GA_TOKEN;
require("@/assets/main.scss");
library.add(fas, far);
createApp(App)
  .use(router)
  .use(
    VueGtag,
    {
      config: {
        id: GA_TOKEN
      },
      enabled: PrivacyMixin.methods.getAgreedState() === "true"
    },
    router
  )
  .use(createMetaManager())
  .component("font-awesome-icon", FontAwesomeIcon)
  .mount("#app");
