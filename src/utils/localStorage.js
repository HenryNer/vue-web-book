import Storage from 'web-storage-cache'

const localStorage = new Storage()

export function setLocalStorage(key, value) {
    return localStorage.set(key, value)
}

export function getLocalStorage(key) {
    return localStorage.get(key)
}

export function removeLocalStorage(key) {
    return localStorage.delete(key)
}

export function clearLocalStorage() {
    return localStorage.clear()
}

export function setBookObject(fileName, key, value) {
    let book = getLocalStorage(`${fileName}-info`)
    if (!book) {
        book = {}
    }
    book[key] = value
    setLocalStorage(`${fileName}-info`, book)
}

export function getBookObject(fileName, key) {
    let book = getLocalStorage(`${fileName}-info`)
    if (book) {
        return book[key]
    } else {
        return null
    }
}

export function getFontFamily(fileName) {
    return getBookObject(fileName, 'fontFamily')
}

export function saveFontFamily(fileName, font) {
    setBookObject(fileName, 'fontFamily', font)
}

export function getFontSize(fileName) {
    return getBookObject(fileName, 'fontSize')
}

export function saveFontSize(fileName, size) {
    setBookObject(fileName, 'fontSize', size)
}
//国际化
export function getLocale() {
    return getLocalStorage('locale')
}

export function saveLocale(locale) {
    setLocalStorage('locale', locale)
}

export function getTheme(fileName) {
    return getBookObject(fileName, 'theme')
}

export function saveTheme(fileName, theme) {
    setBookObject(fileName, 'theme', theme)
}
//当前显示的书页内容
export function getLocation(fileName) {
    return getBookObject(fileName, 'location')
}

export function saveLocation(fileName, location) {
    setBookObject(fileName, 'location', location)
}

//获取阅读时间
export function getReadTime(fileName) {
    return getBookObject(fileName, 'readTime')
}

export function saveReadTime(fileName, readTime) {
    return setBookObject(fileName, 'readTime', readTime)
}

//书签数组，里面存放书签对象包含start.cfi以及书签标记的当前页的内容
export function getBookmark(fileName) {
    return getBookObject(fileName, 'bookmark')
}

export function saveBookmark(fileName, bookmark) {
    setBookObject(fileName, 'bookmark', bookmark)
}

export function saveBookShelf(shelf) {
    setLocalStorage('shelf', shelf)
}

export function getBookShelf() {
    return getLocalStorage('shelf')
}
//搜索历史获取和添加
export function getSearchHistory() {
    const result = JSON.parse(getLocalStorage('searchHistory'))
    return result ? result : []
}
export function saveSearchHistory(value) {
    let searchHistory = getSearchHistory()
    if (!searchHistory.length) {
        searchHistory = []
    }
    searchHistory.push(value)
    setLocalStorage('searchHistory', JSON.stringify(searchHistory))
}
export function clearSearchHistory() {
    removeLocalStorage('searchHistory')
}