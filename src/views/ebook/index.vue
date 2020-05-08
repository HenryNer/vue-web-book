<template>
    <div class="ebook" ref="ebook">
        <ebook-reader></ebook-reader>
        <ebook-title></ebook-title>
        <ebook-menu></ebook-menu>
        <ebook-bookmark></ebook-bookmark>
        <ebook-header></ebook-header>
        <ebook-footer></ebook-footer>
    </div>
</template>

<script>
import EbookReader from '../../components/ebook/EbookReader.vue'
import EbookTitle from '../../components/ebook/EbookTitle.vue'
import EbookMenu from '../../components/ebook/EbookMenu.vue'
import EbookBookmark from '../../components/ebook/EbookBookmark.vue'
import EbookHeader from '../../components/ebook/EbookHeader.vue'
import EbookFooter from '../../components/ebook/EbookFooter.vue'
import { ebookMixin, publicMixin } from '../../utils/mixin'
import { getReadTime, saveReadTime } from '../../utils/localStorage'

export default {
    mixins: [ebookMixin, publicMixin],
    components: {
        EbookReader,
        EbookTitle,
        EbookMenu,
        EbookBookmark,
        EbookHeader,
        EbookFooter
    },
    watch: {
        //实现下拉效果
        offsetY(y) {
            if (!this.menuVisible && this.bookAvaliable) {
                if (y > 0) {
                    this.move(y)
                } else if (y === 0) {
                    this.restore()
                }
            }
        }
    },
    methods: {
        move(para) {
            this.$refs.ebook.style.top = para + 'px'
        },
        restore() {
            this.$refs.ebook.style.top = 0
            this.$refs.ebook.style.transition = 'all .2s linear'
            setTimeout(() => {
                this.$refs.ebook.style.transition = ''
                }, 200)
        },
        //对已读时间进行记时
        startLoopReadTime() {
            let readTime = getReadTime(this.fiieName)
            if (!readTime) {
                readTime = 0
            }
            this.task = setInterval(() => {
                readTime++
                if (readTime % 30 === 0) {
                    saveReadTime(this.fileName, readTime)
                }
            }, 1000)
        }
    },
    mounted() {
        this.startLoopReadTime()
    },
    beforeDestroy() {
        if (this.task) {
            clearInterval(this.task)
        }
    }
    }
</script>

<style lang="scss">
    @import '../../assets/styles/global';
    .ebook {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
    }
</style>