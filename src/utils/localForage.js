import localForage from 'localforage'
//基于localforage做一个简单封装
//设置值
export function setLocalForage(key, data, cb, cb2) {
  localForage.setItem(key, data).then((value) => {
    if (cb) cb(value)
  }).catch(function(err) {
    if (cb2) cb2(err)
  })
}
//获取值
export function getLocalForage(key, cb) {
  localForage.getItem(key, (err, value) => {
    cb(err, value)
  })
}
//移除一个值
export function removeLocalForage(key, cb, cb2) {
  localForage.removeItem(key).then(function() {
    if (cb) cb()
  }).catch(function(err) {
    if (cb2) cb2(err)
  })
}
//清空所有值
export function clearLocalForage(cb, cb2) {
  localForage.clear().then(function() {
    if (cb) cb()
  }).catch(function(err) {
    if (cb2) cb2(err)
  })
}
//key的数量
export function lengthLocalForage(cb) {
  localForage.length().then(
    numberOfKeys => {
      if (cb) cb(numberOfKeys)
    }).catch(function(err) {
      if (err) {}
  })
}
//遍历键值对
export function iteratorLocalForage() {
  localForage.iterate(function(value, key, iterationNumber) {
  }).then(function() {
  }).catch(function(err) {
    if (err) {}
  })
}
//判断浏览器是否支持indexedDB数据库
export function support() {
  const indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || null
  if (indexedDB) {
    return true
  } else {
    return false
  }
}
