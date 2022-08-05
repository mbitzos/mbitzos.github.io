type Post = {
  key: string; // used for route, should be kebabcased
  title: string; // title of the post
  subtitle: string; // subtitle of the post
  date?: Date; // creation date of the post, will be auto generated
  mainImage: string; // path to main image in @/assests/
  component?: any; // the actual component to render
};

export { Post };
