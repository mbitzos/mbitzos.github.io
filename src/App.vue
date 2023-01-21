<template>
  <metainfo />
  <router-view />
  <div id="privacy">
    <router-link to="/devblog/privacy">privacy</router-link>
  </div>
  <privacy-modal />
</template>

<script lang="ts">
import { useMeta, useActiveMeta } from "vue-meta";
import { defineComponent } from "vue";
import PrivacyModal from "./views/privacy/privacy-modal.vue";
export default defineComponent({
  components: {
    PrivacyModal
  },
  setup() {
    useMeta({
      description:
        "Welcome to my website where you can get my contact info and follow my game devblog.",
      title: "Michael Bitzos",
      ...useActiveMeta()
    });
  },
  methods: {
    hello() {
      console.log("hello and welcome to my website.");
      console.log(
        "currently working on building my gamedev blog, check it out: michaelbitzos.com/devblog"
      );
      console.log(
        "This was made with Vue3 and TS. I don't know why I did this but here we are."
      );
    }
  },
  created() {
    this.hello();
  }
});
</script>

<style lang="scss">
/** Fonts **/
@font-face {
  font-family: "Akagi";
  src: local("Akagi"), url(./assets/fonts/AkagiPro-Light.ttf) format("truetype");
}

@font-face {
  font-family: "Akagi-Black";
  src: local("Akagi-Black"),
    url(./assets/fonts/AkagiPro-Black.ttf) format("truetype");
}

#privacy {
  position: fixed;
  @media only screen and (max-width: 1200px) {
    position: absolute;
    left: 50%;
    bottom: 5px;
    transform: translate(-50%, 0);
    text-align: center;
  }
  right: 20px;
  bottom: 5px;
  opacity: 0.75;
}
</style>
