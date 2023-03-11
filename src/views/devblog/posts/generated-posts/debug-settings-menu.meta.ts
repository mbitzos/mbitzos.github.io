import { Post } from "@/types";
import { markRaw } from "vue";
import PostContent from "./debug-settings-menu.vue";

const post: Post = markRaw({
  title:
    "Creating persistent in-game debug settings for rapid small-team development",
  description:
    "Discussing how I created and utilized a debug tool to modify game settings at run-time to improve the efficiency of my team's development process.",
  tags: ["code", "c#", "unity"],
  mainImage: { uri: "posts/debug-settings-menu/cover.png" },
  ghFolder: "debug-settings-menu",
  date: new Date("2023-01-15T17:59:36.651Z"),
  component: PostContent,
  key: "debug-settings-menu"
});

export default post;
