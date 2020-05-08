<template>
    <div class="ebook-reader">
        <div id="read"></div>
        <div class="ebook-reader-mask" @click="onMaskClick" @touchmove="move" @touchend="moveEnd" @mousedown.left="onMouseEnter" @mousemove.left="onMouseMove" @mouseup.left="onMouseEnd"></div>
    </div>
</template>

<script>
import Epub from 'epubjs'
import { ebookMixin, publicMixin } from '../../utils/mixin'
import { flatten } from '../../utils/book'
import { getFontFamily, saveFontFamily, getFontSize, saveFontSize, getTheme, saveTheme, getLocation } from '../../utils/localStorage'
import { getLocalForage } from '../../utils/localForage'

export default {
    mixins: [ebookMixin, publicMixin],
    methods: {
        /**
         * 1 - 鼠标进入 2 - 鼠标进入后移动  3 - 鼠标从移动状态松手  4 - 鼠标还原
         */
        onMouseEnter(e) {
            this.mouseState = 1
            this.mouseStartTime = e.timeStamp
            e.preventDefault()
            e.stopPropagation()
        },
        onMouseMove(e) {
            if (this.mouseState === 1) {
                this.mouseState = 2
            } else if (this.mouseState === 2) {
                let offsetY = 0
                if (this.firstOffsetY) {
                    offsetY = e.clientY - this.firstOffsetY
                    this.setOffsetY(offsetY)
                } else {
                    this.firstOffsetY = e.clientY
                }
            }
            e.preventDefault()
            e.stopPropagation()
        },
        onMouseEnd(e) {
            if (this.mouseState === 2) {
                this.firstOffsetY = 0
                this.setOffsetY(0)
                this.mouseState = 3
            } else {
                this.mouseState = 4
            }
            //优化防抖
            const time = e.timeStamp - this.mouseStartTime
            if (time < 100) {
                this.mouseState = 4
            }
            e.preventDefault()
            e.stopPropagation()
        },
        move(e) {
            let offsetY = 0
            if (this.firstOffsetY) {
                offsetY = e.changedTouches[0].clientY - this.firstOffsetY
                this.setOffsetY(offsetY)
            } else {
                this.firstOffsetY = e.changedTouches[0].clientY
            }
            e.preventDefault()
            e.stopPropagation()
        },
        moveEnd(e) {
            this.firstOffsetY = 0
            this.setOffsetY(0)
        },
        //这里为了实现书签功能，滑动翻页效果改为点击翻页效果
        onMaskClick(e) {
            if (this.mouseState && (this.mouseState === 2 || this.mouseState === 3)) {
                return
            }
            const offsetX = e.offsetX
            const width = window.innerWidth
            if (offsetX > 0 && offsetX < width * 0.3) {
                this.prevPage()
            } else if (offsetX > 0 && offsetX > width * 0.7) {
                this.nextPage()
            } else {
                this.toggleTitleAndMenu()
            }
        },
        prevPage() {
            if (this.rendition) {
                this.rendition.prev().then(() => {
                    this.refreshLocation()
                })
                this.hiddenTitleAndMenu()
            }
        },
        nextPage() {
            if (this.rendition) {
                this.rendition.next().then(() => {
                    this.refreshLocation()
                })
                this.hiddenTitleAndMenu()
            }
        },
        toggleTitleAndMenu() {
            // if (this.menuVisible) {
                this.setSettingVisible(-1)
            // }
            this.setFontFamilyVisible(false)
            this.setMenuVisible(!this.menuVisible)
        },
        //主题
        initTheme() {
            //缓存内容主题
            let defaultTheme = getTheme(this.fileName)
            if (!defaultTheme) {
                defaultTheme = this.themeList[0].name
                saveTheme(this.fileName, defaultTheme)
            }
                this.setDefaultTheme(defaultTheme)
            //加载内容主题
            this.themeList.forEach(theme => {
                this.rendition.themes.register(theme.name, theme.style)
            })
            this.rendition.themes.select(defaultTheme)
        },
        initFontSize() {
            //缓存字号
            let size = getFontSize(this.fileName)
            //第一次打开缓存默认字号
            if (!size) {
                saveFontSize(this.fileName, this.defaultFontSize)
            } else {
                this.rendition.themes.fontSize(size)
                this.setDefaultFontSize(size)
            }    
        },
        initFontFamily() {
            //缓存字体
            let font = getFontFamily(this.fileName)
            //第一次打开缓存默认字体
            if (!font) {
                saveFontFamily(this.fileName, this.defaultFontFamily)
            } else {
                this.rendition.themes.font(font)
                this.setDefaultFontFamily(font)
            }
        },
        //渲染电子书
        initRendition() {
            this.rendition = this.book.renderTo('read',{
                width: innerWidth,
                height: innerHeight,
                //兼容在微信上正常使用
                method: 'default'
            })
            const location = getLocation(this.fileName)
            this.display(location, () => {
                this.initTheme()
                this.initFontFamily()
                this.initFontSize()
                this.initGlobalStyle()
            })
            /**
             * (加载字体资源)rendition钩子函数hooks下content表示阅读器渲染完后可以获取到资源文件后调用这个方法，contents对象用来管理资源，addStylesheet表示可以手动添加样式文件
             */
            this.rendition.hooks.content.register(contents => {
                Promise.all([
                    contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/cabin.css`),
                    contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/daysOne.css`),
                    contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/montserrat.css`),
                    contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/tangerine.css`)
                ]).then(() => {
                            
                    })
                })
        },
        //电子书的触摸事件
        // initGesture() {
        //     //touchstart与touchend事件实现翻页以及呼出菜单栏功能
        //     this.rendition.on('touchstart', event => {
        //         this.touchStartX = event.changedTouches[0].clientX
        //         this.touchStartTime = event.timeStamp
        //     })
        //     this.rendition.on('touchend', event => {
        //         const offsetX = event.changedTouches[0].clientX - this.touchStartX
        //         const time = event.timeStamp - this.touchStartTime
        //         if (offsetX > 40 && time < 500) {
        //             this.prevPage()
        //         } else if (offsetX < -40 && time < 500) {
        //             this.nextPage()
        //         } else {
        //             this.toggleTitleAndMenu()
        //         }
        //         event.preventDefault()
        //         event.stopPropagation()
        //     })
        // },
        //解析电子书的信息
        parseBook() {
            //获取当前电子书的封面图片url
            this.book.loaded.cover.then(cover => {
                this.book.archive.createUrl(cover).then(url => {
                    this.setCover(url)
                })
            })
            //获取当前电子书的信息
            this.book.loaded.metadata.then(metadata => {
                    this.setMetadata(metadata)
            })
            //通过扁平化树结构后解析出当前图书目录结构并赋予目录等级
            this.book.loaded.navigation.then(nav => {
                const navItem = flatten(nav.toc)
                function find(item, level = 0) {
                    //parent为undefine时为没有父级，可以返回level(level默认从0开始)，否则递归查找此item的父级
                    return !item.parent ? level : find(navItem.filter((parentItem) => parentItem.id === item.parent)[0], ++level)
                }
                navItem.forEach((item) => {
                    item.level = find(item)
                })
                this.setNavigation(navItem)
            })
        },
        //创建电子书的入口
        initEpub(url) {
            //传入url给Epub下载相应的电子书并解析，也可以传入blob对象解析
            this.book = new Epub(url)
            this.setCurrentBook(this.book)
            this.initRendition()
            // this.initGesture()
            this.parseBook()
            //分页计算消耗性能，所以在book解析完后再调用钩子函数来进行分页
            this.book.ready.then(() => {
                //传入的是每页显示的字数来进行分页计算
                return this.book.locations.generate(750 * (window.innerWidth / 375) * (getFontSize(this.fileName) / 16)).then(locations => {
                    this.navigation.forEach(nav => {
                        nav.pagelist = []
                    })
                    //下面带注释的分页算法功能是完善后的，没完善前会有navigation获取的目录名称和通过locations获取的目录名称不一致的问题
                    locations.forEach(item => {
                        const loc = item.match(/\[(.*)\]!/)[1]
                        this.navigation.forEach(nav => {
                            if (nav.href) {
                                //兼容xhtml的文件场景
                                let href = nav.href.match(/\/(.*)\.xhtml$/)
                                //如果没有匹配到，则再使用html正则进行匹配
                                if (!href) {
                                    href = nav.href.match(/^(.*)\.html$/)
                                }
                                if (href) {
                                    //loc只要包含href[1]中的内容，则认为包含在该目录下，优化前为href[1] === loc
                                    if (loc.indexOf(href[1]) >= 0) {
                                        nav.pagelist.push(item)
                                    }
                                }
                            }
                        })
                        let currentPage = 1
                        this.navigation.forEach((nav, index) => {
                            if (index === 0) {
                                nav.page = 1
                            } else {
                                nav.page = currentPage
                            }
                            currentPage += nav.pagelist.length + 1
                        })
                    })
                })
            }).then(locations => {
                this.setBookAvaliable(true)
                //分页完成后再次调用获取准确的progress值
                this.refreshLocation()
            })
        }
    },
    mounted() {
        const books = this.$route.params.fileName.split('|')
        const fileName = books[1]
        //通过索引indexedDB数据库判断是否有缓存这本电子书
        getLocalForage(fileName, (err, blob) => {
            if (!err && blob) {
                this.setFileName(books.join('/')).then(() => {
                    this.initEpub(blob)
                })
            } else {
                this.setFileName(books.join('/')).then(() => {
                    const url = `${process.env.VUE_APP_EPUB_URL}/` + this.fileName + '.epub'
                    this.initEpub(url)
                })
            }
        })
    }
}
</script>

<style lang="scss" scoped>
    @import '../../assets/styles/global';
    .ebook-reader {
        width: 100%;
        height: 100%;
        overflow: hidden;
        .ebook-reader-mask {
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            background: transparent;
        }
    }
</style>
