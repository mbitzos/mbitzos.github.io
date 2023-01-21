<template>
  <div>
    <div class="title is-2">Your privacy</div>
    <div>
      If you accept the use of cookies it will only be used for sending
      information to Google analytics. If you want to know more about what kind
      of information is collected please read
      <a href="https://marketingplatform.google.com/about/analytics/terms/us/"
        >clause 7 of Google's privacy policy.</a
      >

      <br />
      <br />
      I use Google Analytics to help me understand the traffic of this blog such
      as which blog posts people are viewing as well as how they navigate
      through the website. My plan is to eventually move away from Google
      Analytics but for now this is the easiest and fastest approach. I do not
      have any form of monetization set up currently for this website but this
      information could eventually help me pursue that if I do decide to in the
      future.
      <br />
      <br />
      If you have any questions please don't hesitate to reach out to me via
      email at:
      <a href="emailto:m.bitzos@gmail.com">m.bitzos@gmail.com.</a>
      This entire website is entirely open-sourced so feel free to check out the
      code yourself directly on
      <a href="https://github.com/mbitzos/mbitzos.github.io">my Github.</a>
      <div class="agreed-button">
        <div v-if="agreed">
          You have currently <strong>accepted</strong> the use cookies on this
          website.
          <br />
          <span class="reject cookie-option" @click="disableGA1"
            >[ reject cookies]</span
          >
        </div>
        <div v-else>
          You have currently <strong>not accepted</strong> the use of cookies on
          this website.
          <br />
          <span class="accept cookie-option" @click="enableGA1"
            >[ accept cookies]</span
          >
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import Mixin from "./mixins";

export default defineComponent({
  data(): { agreed: boolean } {
    return {
      agreed: false
    };
  },
  mixins: [Mixin],
  methods: {
    enableGA1() {
      this.enableGA();
      this.refresh();
    },
    disableGA1() {
      this.disableGA();
      this.refresh();
    },
    refresh() {
      this.agreed = this.getAgreedState() === "true";
    }
  },
  mounted() {
    this.refresh();
  }
});
</script>
<style lang="scss">
.agreed-button {
  margin-top: 20px;
}

.cookie-option {
  margin: 0;
  cursor: pointer;
  font-size: 20px;
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
</style>
