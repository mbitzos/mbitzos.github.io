<template>
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
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
</style>
