import { Post } from "@/types";
import { markRaw } from "vue";
import PostContent from "./second-post.vue";

const post: Post = markRaw({
  title: "this is a second post",
  subtitle: "asdasdsads",
  mainImage: {
    uri: "test.jpg",
    subtitle: "some pic of python image",
    date: "2022-09-29T02:35:24.347Z"
  },
  date: new Date("2022-10-01T23:01:52.939Z"),
  tags: ["code", "test"],
  component: PostContent,
  key: "second-post"
});

export default post;
