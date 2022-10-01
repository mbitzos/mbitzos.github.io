<template>
  <div>
    <div class="title is-2">{{ post.title }}</div>
    <div class="subtitle is-5">{{ post.subtitle }}</div>
    <div>
      <span>
        {{
          post.date?.toLocaleDateString("en-US", {
            year: "numeric",
            month: "numeric",
            day: "numeric"
          })
        }}
      </span>
    </div>
    <PostImageComponent :image="post.mainImage" v-if="post.mainImage" />
    <component class="main-content" :is="post.component" />
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import PostImageComponent from "./image.vue";
import { Post } from "@/types";
export default defineComponent({
  components: {
    PostImageComponent
  },
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
  margin-bottom: 0.5em;
}
</style>
