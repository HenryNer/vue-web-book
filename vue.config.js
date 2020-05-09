/*
//第一个参数是全局的app对象，第二个是要模拟的接口的URL，第三个是要传递的数据
function mock(app, url, data) {
  //模拟get请求
  app.get(url, (request, response) => {
    //将data变为json数据
    response.json(data)
  })
}
*/

/*const homeData = require('./src/mock/bookHome')
const shelfData = require('./src/mock/bookShelf')
const listData = require('./src/mock/bookList')
const flatListData = require('./src/mock/bookFlatList')
*/

module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? './' : '',
  //在这里添加自定义的mock接口
  devServer: {
    /*
    before(app) {
      mock(app, '/book/home', homeData)
      mock(app, '/book/shelf', shelfData)
      mock(app, '/book/list', listData)
      mock(app, '/book/flat-list', flatListData)
    }
     */
  },
  configureWebpack: {
    performance: {
      hints: 'warning',
      maxAssetSize: 524288 * 10,
      maxEntrypointSize: 524288 * 10
    }
  }
}
