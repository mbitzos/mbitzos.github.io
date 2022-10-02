type Post = {
  key: string; // used for route, should be kebabcased
  title: string; // title of the post
  date?: Date; // creation date of the post, will be auto generated
  mainImage?: PostImage; // main image of the post
  component?: any; // the actual component to render
  tags?: string[];
};
type Style = Record<string, string>;

type PostImage = {
  uri: string; // path to image in @/assets/
  subtitle?: string; // text to display, will be put through v-html
  style?: Style; // the style to apply to the image
};
export { Post, PostImage };
