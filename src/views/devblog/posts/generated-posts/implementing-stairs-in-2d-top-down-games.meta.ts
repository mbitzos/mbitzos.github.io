import { Post } from "@/types";
import { markRaw } from "vue";
import PostContent from "./implementing-stairs-in-2d-top-down-games.vue";

const post: Post = markRaw({
  title: "Implementing satisfying stairs for your 2D top-down game",
  description:
    "Implementing a reusable component for stairs for your 2D top-down games to create satisfying movement within your levels.",
  tags: ["code", "c#", "unity"],
  mainImage: {
    uri: "posts/implementing-stairs-in-2d-top-down-games/cover.png"
  },
  ghFolder: "implementing-stairs-in-2d-top-down-games",
  date: new Date("2023-03-12T03:40:04.471Z"),
  component: PostContent,
  key: "implementing-stairs-in-2d-top-down-games"
});

export default post;
