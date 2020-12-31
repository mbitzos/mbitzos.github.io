<template>
  <router-view id="body" />
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  methods: {
    hello() {
      console.log("hello and welcome to my website.");
      console.log("there isn't much right now but i plan on adding more.");
      console.log("blog and stuff, the fun stuff.");
      console.log("if you wanted to know this was made in vue.");
      console.log("...yes this was overkill but it'll be useful later.");
    }
  },
  created() {
    this.hello();
  }
});
</script>

<style lang="scss">
/** FONTS **/
@font-face {
  font-family: "Akagi";
  src: local("Akagi"), url(./assets/fonts/AkagiPro-Light.ttf) format("truetype");
}
@font-face {
  font-family: "Akagi-Black";
  src: local("Akagi-Black"),
    url(./assets/fonts/AkagiPro-Black.ttf) format("truetype");
}

// Some flex box utilities
.row,
.col {
  display: flex;
}
.row {
  flex-direction: row;
}

.col {
  flex-direction: column;
}
// Some flex box utilities

body,
html,
#app {
  width: 100%;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
#app {
  font-family: Akagi, Helvetica, Arial, sans-serif;
  text-transform: lowercase;
  color: black;
  display: flex;
  flex-direction: row;
  justify-content: center;
  overflow: auto;
}

#body {
  width: 45%;
  height: 100vh;
  padding-top: 50px;
  padding-bottom: 50px;
  box-sizing: border-box;
}

/** Responsive **/
@media only screen and (max-width: 1400px) {
  #body {
    width: 50%;
  }
}
@media only screen and (max-width: 1300px) {
  #body {
    width: 60%;
  }
}
@media only screen and (max-width: 1100px) {
  #body {
    width: 70%;
  }
}
@media only screen and (max-width: 900px) {
  #body {
    width: 80%;
  }
}
@media only screen and (max-width: 800px) {
  #body {
    width: 85%;
  }
}

@media only screen and (max-width: 600px) {
  #body {
    height: 100%;
  }
}
</style>
