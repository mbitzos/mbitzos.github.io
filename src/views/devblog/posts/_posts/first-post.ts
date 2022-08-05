import { Post } from "@/types";
import { markRaw } from "vue";
import FirstPost from "./first-post.vue";
const post: Post = markRaw({
  key: "first-post",
  title: "This is a big title wow",
  subtitle:
    "a subtitle thats a bit longer but somethng we can continue tot alk about",
  mainImage: "about/python.png",
  date: new Date(),
  component: FirstPost
});

export default post;
