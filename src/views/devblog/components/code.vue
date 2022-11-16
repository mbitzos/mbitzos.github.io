<template>
  <div class="code-block" ref="mySlot">
    <FontAwesomeIcon
      icon="fa-regular fa-copy"
      class="copy-icon"
      @click="copy"
    />
    <slot></slot>
  </div>
</template>
<script lang="ts">
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { defineComponent } from "vue";
export default defineComponent({
  components: { FontAwesomeIcon },
  data() {
    return {
      code: ""
    };
  },
  methods: {
    async copy() {
      await navigator.clipboard.writeText(this.code);
    }
  },
  mounted() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.code = (this.$refs.mySlot as any).textContent;
  }
});
</script>
<style lang="scss">
.code-block {
  position: relative;

  .copy-icon {
    cursor: pointer;
    position: absolute;
    top: 10px;
    right: 10px;
    color: white;
    transition: 0.2s;

    &:hover {
      color: $pink;
    }
  }
  pre {
    padding: 0;
    margin-top: 1em;
    margin-bottom: 1em;
  }
}
</style>
