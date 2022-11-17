<template>
  <div id="sidebar">
    <div class="title is-6">
      Articles
    </div>
    <ul class="articles">
      <li v-for="article in articles" :key="article.key">
        <div v-if="isSelected(article)">
          {{ article.title }}
        </div>
        <router-link v-else :to="`/devblog/${article.key}`">{{
          article.title
        }}</router-link>
      </li>
    </ul>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import Posts from "../posts/index";
import { Post } from "@/types";
const posts = [...Posts];
posts.reverse();
export default defineComponent({
  data() {
    return {
      articles: posts
    };
  },
  methods: {
    isSelected(post: Post) {
      return post.key == this.$route.name;
    }
  }
});
</script>
<style lang="scss">
#sidebar {
  height: 100%;

  .title {
    text-decoration: underline;
    margin-bottom: 5px;
  }

  .articles {
    margin-left: 20px;
    list-style: circle;
  }
}
</style>
