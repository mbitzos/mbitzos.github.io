<template>
  <div class="post-image">
    <img :src="require(`@/assets/${image.uri}`)" :style="image.style || {}" />
    <div class="subtitle is-6" v-if="image.subtitle" v-html="image.subtitle" />
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { PostImage } from "@/types";
export default defineComponent({
  props: {
    image: {
      type: Object as () => PostImage,
      required: true
    }
  }
});
</script>
<style lang="scss">
.post-image {
  width: 100%;
  text-align: center;
  img {
    width: auto;
  }

  .subtitle {
    font-style: italic;
  }
}
</style>
