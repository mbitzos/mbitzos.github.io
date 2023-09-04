import { Post } from "@/types";
import { markRaw } from "vue";
import PostContent from "./demystifying-game-persistence.vue";

const post: Post = markRaw({
  title: "Demystifying game persistence with serialization",
  description:
    "Uncovering the technical mystery of how games remember a player's progress.",
  tags: ["code", "c#", "unity"],
  mainImage: { uri: "posts/demystifying-game-persistence/cover.png" },
  ghFolder: "demystifying-game-persistence",
  date: new Date("2023-09-04T23:12:18.780Z"),
  component: PostContent,
  key: "demystifying-game-persistence"
});

export default post;
