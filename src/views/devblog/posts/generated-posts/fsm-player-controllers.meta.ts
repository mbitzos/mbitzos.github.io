import { Post } from "@/types";
import { markRaw } from "vue";
import PostContent from "./fsm-player-controllers.vue";

const post: Post = markRaw({
  title: "Using finite state machines to build scalable player controllers",
  description:
    "Explaining how I use the finite state machine design model to write my player controllers to easily add features without sacrificing code quality.",
  tags: ["code", "c#", "unity"],
  mainImage: {
    uri: "posts/fsm-player-controllers/cover.jpg",
    subtitle: "A very basic state machine for a platformer player controller"
  },
  date: new Date("2022-11-15T04:30:45.378Z"),
  ghFolder: "fsm-player-controllers",
  component: PostContent,
  key: "fsm-player-controllers"
});

export default post;
