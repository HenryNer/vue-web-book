import Mock from 'mockjs'
import home from './bookHome' //首页数据
import shelf from './bookShelf' //书架数据
import list from './bookList' //图书列表
import flatList from './bookFlatList' //查询数据

//做mock的接口,Mock下的mock方法，第一个参数匹配我们请求的url，第二个参数是请求的方法，第三个参数是请求的数据
Mock.mock(/\/book\/home/, 'get', home)
Mock.mock(/\/book\/shelf/, 'get', shelf)
Mock.mock(/\/book\/list/, 'get', list)
Mock.mock(/\/book\/flap-list/, 'get', flatList)
