import { Post } from "@/types";
import { markRaw } from "vue";
import PostContent from "./test.vue";

const post: Post = markRaw({
  title: "Test title",
  description: "Test desc",
  tags: ["misc"],
  date: new Date("2022-12-13T16:42:08.476Z"),
  component: PostContent,
  key: "test"
});

export default post;
