import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import { themeList, addCss, removeAllCss, getReadTimeByMinute } from './book'
import { saveLocation, getBookmark, getBookShelf, saveBookShelf } from './localStorage'
import { appendAddToShelf, computeId, removeAddFromShelf } from './store'
import { shelf } from '../api/store'
export const publicMixin = {
    computed: {
        ...mapState(['offsetY'])
    },
    methods: {
        ...mapMutations(['set_offsetY']),
        ...mapActions(['setOffsetY'])
    }
}

export const ebookMixin = {
    computed: {
        ...mapState('book', ['currentBook','fileName','menuVisible','settingVisible','defaultFontSize','defaultFontFamily','fontFamilyVisible','defaultTheme','progress','bookAvaliable','section','cover','metadata','navigation','isBookmark']),
        themeList() {
            return themeList(this)
        },
        getSectionName() {
            return this.section ? this.navigation[this.section].label : ''
        }
    },
    methods: {
        ...mapMutations('book', ['set_currentBook','set_fileName','set_menuVisible','set_settingVisible','set_defaultFontSize','set_defaultFontFamily','set_fontFamilyVisible','set_defaultTheme','set_progress','set_bookAvaliable','set_section','set_cover','set_metadata','set_navigation','set_isBookmark']),
        ...mapActions('book',['setCurrentBook','setFileName','setMenuVisible','setSettingVisible','setDefaultFontSize','setDefaultFontFamily','setFontFamilyVisible','setDefaultTheme','setProgress','setBookAvaliable','setSection','setCover','setMetadata','setNavigation','setIsBookmark']),
        initGlobalStyle() {
            removeAllCss()
            //加载内容外的主题样式
            switch (this.defaultTheme) {
                case 'Default':
                    addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_default.css`)
                    break
                case 'Eye':
                    addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_eye.css`)
                    break
                case 'Gold':
                    addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_gold.css`)
                    break
                case 'Night':
                    addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_night.css`)
                    break
                default :
                    addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_default.css`)
            }
        },
        //更新进度百分比，精确缓存电子书内容的定位，判断渲染时页面是否为书签页
        refreshLocation(isSettingProgress) {
            const currentLocation = this.currentBook.rendition.currentLocation()
            if (currentLocation && currentLocation.start && currentLocation.start.cfi) {
                const startCfi = currentLocation.start.cfi
                if (!isSettingProgress) {
                    const progress = this.currentBook.locations.percentageFromCfi(startCfi)
                    this.setProgress(Math.floor(progress * 100))
                }
                this.setSection(currentLocation.start.index)
                saveLocation(this.fileName, startCfi)
                const bookmark = getBookmark(this.fileName)
                if (bookmark) {
                    if (bookmark.some(item => item.cfi === startCfi)) {
                        this.setIsBookmark(true)
                    } else {
                        this.setIsBookmark(false)
                    }
                } else {
                    this.setIsBookmark(false)
                }
            }
        },
        //实现display电子书复用(isSettingProgress判断是否为settingProgress组件传入，如果是则在refreshLocation中不会重复更新porgress)
        display(target, cb, isSettingProgress) {
            if (target) {
                this.currentBook.rendition.display(target).then(() => {
                    this.refreshLocation(isSettingProgress)
                    if (cb) cb()
                })
            } else {
                this.currentBook.rendition.display().then(() => {
                    this.refreshLocation(isSettingProgress)
                    if (cb) cb()
                })
            }
        },
        hiddenTitleAndMenu() {
            this.setMenuVisible(false)
            this.setSettingVisible(-1)
            this.setFontFamilyVisible(false)
        },
        getReadTimeText() {
            return this.$t('book.haveRead').replace('$1', getReadTimeByMinute(this.fileName))
        }
    }
}

export const storeHomeMixin = {
    computed: {
        ...mapState('store',['hotSearchOffsetY','flapCardVisible','isEditMode','shelfList','shelfSelected','shelfTitleVisible','shelfCategory','currentType'])
    },
    methods: {
        ...mapActions('store',['setHotSearchOffsetY','setFlapCardVisible','setIsEditMode','setShelfList','setShelfSelected','setShelfTitleVisible','setShelfCategory','setCurrentType']),
        showBookDetail(book) {
            //路由跳转
            this.$router.push({
                path: '/store/detail',
                query: {
                    fileName: book.fileName,
                    category: book.categoryText
                }
            })
        },
        getCategoryList(title) {
            this.getShelfList().then(() => {
                const categoryList = this.shelfList.filter(book => {
                    return book.type === 2 && book.title === title
                })[0]
                this.setShelfCategory(categoryList)
            })
        },
        //获取图书列表
        getShelfList() {
            //判断图书列表是否进行了缓存，否则每次请求会导致操作后的列表不能保存
            let shelfList = getBookShelf()
            if (!shelfList) {
                //向服务器请求
                shelf().then(response => {
                    if (response.status === 200 && response.data && response.data.bookList) {
                        //增加一个书架的添加框
                        shelfList = appendAddToShelf(response.data.bookList)
                        saveBookShelf(shelfList)
                        return this.setShelfList(shelfList)
                    }
                })
            } else {
                return this.setShelfList(shelfList)
            }
        },
        //将分组中的电子书移出
        moveOutOfGroup(cb) {
            this.setShelfList(this.shelfList.map(book => {
                if (book.type === 2 && book.itemList) {
                  book.itemList = book.itemList.filter(subBook => !subBook.selected)
                }
                return book
              })).then(() => {
                let list = removeAddFromShelf(this.shelfList)
                list = [].concat(list, ...this.shelfSelected)
                list = appendAddToShelf(list)
                list = computeId(list)
                this.setShelfList(list).then(() => {
                  this.simpleToast(this.$t('shelf.moveBookOutSuccess'))
                  if (cb) cb()
                })
              })
        }
    }
}