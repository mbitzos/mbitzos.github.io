<template>
  <div id="privacy-modal" v-if="canShow">
    <span class="text">
      This website uses cookies for collecting analytics to help me better
      understand my website's traffic. If you want to read more about your
      privacy please visit
      <router-link to="/devblog/privacy"> this page.</router-link>
    </span>

    <div class="bs">
      <div class="o accept" @click="accept">[ accept cookies ]</div>
      <div class="o reject" @click="reject">[ reject ]</div>
    </div>
    <div @click="hide" id="hide">
      [x]
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import Mixins from "./mixins";
export default defineComponent({
  components: {},
  mixins: [Mixins],
  data() {
    return {
      show: true
    };
  },
  computed: {
    canShow(): boolean {
      return this.show && this.$route.name !== "privacy";
    }
  },
  methods: {
    accept() {
      this.enableGA();
      this.show = false;
    },
    reject() {
      this.disableGA();
      this.show = false;
    },
    hide() {
      this.show = false;
    }
  },
  mounted() {
    // only show if they haven't already answered
    this.show = this.getAgreedState() === null;
  }
});
</script>
<style lang="scss">
#privacy-modal {
  z-index: 1000000;
  width: 50%;
  padding: 20px;
  padding-right: 30px;
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translate(-50%, 0);
  background-color: white;
  border: 1px solid $pink;
  border-bottom: 0;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-content: center;
  align-items: center;

  @media only screen and (max-width: 1200px) {
    width: 100%;
  }

  .text {
    margin-right: 10px;
  }

  .bs {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: stretch;
    flex-shrink: 0;

    .o {
      margin: 0;
      cursor: pointer;
      &:hover {
        font-weight: bold;
      }
    }

    .accept {
      margin-bottom: 5px;
      color: $pink;
    }
    .reject {
      opacity: 0.8;
    }
  }

  #hide {
    position: absolute;
    top: 2px;
    right: 5px;
    cursor: pointer;
    color: $pink;
    font-weight: bold;
    opacity: 0.5;
    &:hover {
      opacity: 1;
    }
  }
}
</style>
