type Post = {
  key: string; // used for route, should be kebabcased
  title: string; // title of the post, used for the post, RSS, and SEO
  description: string; // the description of the post, used for SEO and RSS
  date?: Date; // creation date of the post, will be auto generated
  mainImage?: PostImage; // main image of the post
  component?: any; // the actual component to render
  tags?: string[];
  ghFolder?: string; // the link to the github attached for this article, relative to "https://github.com/mbitzos/devblog-code-examples/tree/main/"
};
type Style = Record<string, string>;

type PostImage = {
  uri: string; // path to image in @/assets/
  subtitle?: string; // text to display, will be put through v-html
  style?: Style; // the style to apply to the image
};
export { Post, PostImage };
