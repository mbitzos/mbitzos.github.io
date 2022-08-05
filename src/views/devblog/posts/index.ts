import { Post } from "@/types";
import { default as One } from "./_posts/first-post";

// TODO - make this dynamic so I dont have to write an import for every new post
const posts: Array<Post> = [One];
export default posts;
