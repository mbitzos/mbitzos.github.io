<template>
  <div class="post">
    <div class="title is-2">{{ post.title }}</div>
    <div>
      <span class="datestamp">
        {{
          post.date?.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric"
          })
        }}
      </span>
      -
      <span class="taggs">
        <span class="tagg" v-for="tag in post.tags" :key="tag">
          [{{ tag }}]
        </span>
      </span>
    </div>
    <PostImageComponent
      class="main-image"
      :image="post.mainImage"
      v-if="post.mainImage"
    />
    <div class="main-divider" />
    <component class="main-content" :is="post.component" />
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { useMeta } from "vue-meta";
import PostImageComponent from "./image.vue";
import hljs from "highlight.js";
import { Post } from "@/types";
export default defineComponent({
  components: {
    PostImageComponent
  },
  setup(props) {
    useMeta({
      title: props.post.title,
      description: props.post.description
    });
  },
  props: {
    post: {
      type: Object as () => Post,
      required: true
    }
  },
  mounted() {
    hljs.highlightAll();
  }
});
</script>
<style lang="scss">
.post {
  .main-content {
    margin-top: 1em;

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      margin-top: 30px;
      margin-bottom: 10px;
    }

    h2 {
      font-size: 30px;
    }
    h3 {
      font-size: 22px;
    }
    h4 {
      font-size: 20px;
    }
    h5 {
      font-size: 17px;
    }
    h6 {
      font-size: 15px;
    }

    p {
      margin-top: 10px;
    }

    ol,
    ul {
      margin-left: 25px;
    }

    ul {
      list-style: disc;
    }
  }
  .main-image {
    margin-top: 1em;
  }
  .main-divider {
    width: 100%;
    border: 1px solid rgba($pink, 0.2);
    border-bottom: 0;
    margin-top: 1em;
  }
  .title {
    margin-bottom: 5px !important;
  }
  .subtitle {
    font-style: italic;
    margin-bottom: 0.5em !important;
  }

  .datestamp {
    font-weight: bold;
  }

  .taggs {
    .tagg {
      color: gray;
      font-weight: bold;
    }
  }
}
</style>
