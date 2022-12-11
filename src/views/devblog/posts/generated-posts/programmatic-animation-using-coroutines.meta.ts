import { Post } from "@/types";
import { markRaw } from "vue";
import PostContent from "./programmatic-animation-using-coroutines.vue";

const post: Post = markRaw({
  title: "Creating dynamic animations programmatically with Unity coroutines",
  tags: ["code", "c#", "unity"],
  mainImage: { uri: "posts/programmatic-animation-using-coroutines/cover.png" },
  date: new Date("2022-12-11T02:22:18.484Z"),
  component: PostContent,
  key: "programmatic-animation-using-coroutines"
});

export default post;
