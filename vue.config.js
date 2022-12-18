module.exports = {
  css: {
    loaderOptions: {
      sass: {
        prependData: '@import "@/assets/main.scss";'
      }
    }
  },
  transpileDependencies: ["vue-meta"],
  chainWebpack: config => {
    config.module
      .rule("xml")
      .test(/\.xml$/)
      .use("xml-loader")
      .loader("xml-loader")
      .end();
  }
};
