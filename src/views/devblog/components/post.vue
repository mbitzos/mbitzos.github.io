<template>
  <div>
    <div class="title is-2">{{ post.title }}</div>
    <div class="subtitle is-5">{{ post.subtitle }}</div>
    <div>
      <span>
        {{
          post.date?.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
          })
        }}
      </span>
    </div>
    <div class="title-card">
      <img :src="require(`@/assets/${post.mainImage}`)" />
    </div>
    <component class="main-content" :is="post.component" />
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { Post } from "@/types";
export default defineComponent({
  props: {
    post: {
      type: Object as () => Post,
      required: true
    }
  }
});
</script>
<style lang="scss">
.subtitle {
  font-style: italic;
}
.title-card {
  width: 100%;

  img {
    width: 100%;
  }
}
</style>
