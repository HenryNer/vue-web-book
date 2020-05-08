<template>
    <div class="ebook-bookmark" ref="bookmark">
        <div class="ebook-bookmark-text-wrapper">
            <div class="ebook-bookmark-down-wrapper" ref="iconDown">
                <span class="icon-down"></span>
            </div>
            <div class="ebook-boomark-text">{{text}}</div>
        </div>
        <div class="ebook-bookmark-icon-wrapper">
            <bookmark :color="color" :width="15" :height="35" :style="isFixed ? fixedStyle : {}"></bookmark>
        </div>
    </div>
</template>

<script>
    import Bookmark from '../common/Bookmark.vue'
    import { realPx, px2rem } from '../../utils/utils'
    import { ebookMixin, publicMixin } from '../../utils/mixin'
    import { getBookmark, saveBookmark } from '../../utils/localStorage'

    export default {
        mixins: [ebookMixin, publicMixin],
        components: {
            Bookmark
        },
        data() {
            return {
                text: '',
                color: 'white',
                isFixed: false
            }
        },
        computed: {
            height() {
                return realPx(35) 
            },
            threshold() {
                return realPx(55)
            },
            fixedStyle() {
                return {
                    position: 'fixed',
                    top: '0',
                    right: `${realPx(15)}px`
                }
            }
        },
        watch: {
            offsetY(y) {
                if (!this.bookAvaliable || this.menuVisible || this.settingVisible >= 0) {
                    return
                }
                if (y >= this.height && y < this.threshold) {
                    //状态2
                    this.beforeThreshold(y)
                } else if (y >= this.threshold) {
                    //状态3
                    this.afterThreshold(y)
                } else if (y > 0 && y < this.height) {
                    //状态1
                    this.beforeHeight()
                } else if (y === 0) {
                    //归位
                    this.restore()
                }
            },
            isBookmark(isBookmark) {
                this.isFixed = isBookmark
                if (isBookmark) {
                    this.color = 'blue'
                } else {
                    this.color = 'white'
                }
            }
        },
        methods: {
            addBookmark() {
                this.bookmark = getBookmark(this.fileName)
                if (!this.bookmark) {
                    this.bookmark = []
                }
                const currentLocation = this.currentBook.rendition.currentLocation()
                const cfibase = currentLocation.start.cfi.replace(/!.*$/,'')
                const cfistart = currentLocation.start.cfi.replace(/.*!/,'').replace(/\)/,'')
                const cfiend = currentLocation.end.cfi.replace(/.*!/,'').replace(/\)/,'')
                const cfirange = `${cfibase}!,${cfistart},${cfiend})`
                this.currentBook.getRange(cfirange).then(range => {
                    const text = range.toString().replace(/\s\s/g,'')
                    this.bookmark.push({
                        cfi: currentLocation.start.cfi,
                        text: text
                    })
                    saveBookmark(this.fileName, this.bookmark)
                })
            },
            removeBookmark() {
                const currentLocation = this.currentBook.rendition.currentLocation()
                const cfi = currentLocation.start.cfi
                this.bookmark = getBookmark(this.fileName)
                if (this.bookmark) {
                    saveBookmark(this.fileName, this.bookmark.filter(item => item.cfi !== cfi))
                }
            },
            restore() {
                //书签状态重置,由于界面返回顶层时有一个.2s的过渡动画，所以用延时来重置
                setTimeout(() => {
                    this.$refs.bookmark.style.top = `${-this.height}px`
                    this.$refs.iconDown.style.transform = 'rotate(0deg)'
                }, 200)
                if (this.isFixed) {
                    this.setIsBookmark(true)
                    this.addBookmark()
                } else {
                    this.setIsBookmark(false)
                    this.removeBookmark()
                }
            },
            beforeHeight() {
                //状态1：开始下拉，未超过书签高度
                if (this.isBookmark) {
                    this.text = this.$t('book.pulldownDeleteMark')
                    this.color = 'blue'
                    this.isFixed = true
                } else {
                    this.text = this.$t('book.pulldownAddMark')
                    this.color = 'white'
                    this.isFixed = false
                }
            },
            beforeThreshold(y) {
                //状态2：超过书签高度，未到达临界状态
                this.beforeHeight()
                this.$refs.bookmark.style.top = `${-y}px`
                const iconDown = this.$refs.iconDown
                if (iconDown.style.transform === 'rotate(180deg)') {
                    iconDown.style.transform = 'rotate(0deg)'
                }
            },
            afterThreshold(y) {
                //状态3：超越临界状态
                if (this.isBookmark) {
                    this.text = this.$t('book.releaseDeleteMark')
                    this.color = 'white'
                    this.isFixed = false
                } else {
                    this.text = this.$t('book.releaseAddMark')
                    this.color = 'blue'
                    this.isFixed = true
                }
                this.$refs.bookmark.style.top = `${-y}px`
                const iconDown = this.$refs.iconDown
                if (iconDown.style.transform === '' || iconDown.style.transform === 'rotate(0deg)') {
                    iconDown.style.transform = 'rotate(180deg)'
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import '../../assets/styles/global';
    .ebook-bookmark {
        position: absolute;
        top: px2rem(-35);
        left: 0;
        width: 100%;
        height: px2rem(35);
        .ebook-bookmark-text-wrapper {
            position: absolute;
            right: px2rem(45);
            bottom: 0;
            display: flex;
            .ebook-bookmark-down-wrapper {
                font-size: px2rem(14);
                color: white;
                transition: all .2s linear;
                @include center;
            }
            .ebook-boomark-text {
                font-size: px2rem(14);
                color: white;
            }
        }
        .ebook-bookmark-icon-wrapper {
            position: absolute;
            right: 0;
            bottom: 0;
            margin-right: px2rem(15);
        }
    }
</style>