<template>
  <div class="code-block">
    <slot></slot>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  components: {}
});
</script>
<style lang="scss">
.code-block {
  pre {
    padding: 0;
    margin-top: 1em;
    margin-bottom: 1em;
  }
}
</style>
