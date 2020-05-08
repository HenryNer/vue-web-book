<template>
    <div class="store-shelf">
        <shelf-title :title="$t('shelf.title')"></shelf-title>
        <scroll class="store-shelf-scroll-wrapper" :top="0" :bottom="scrollBottom" @onScroll="onScroll" ref="scroll">
            <shelf-search></shelf-search>
            <shelf-list :data="shelfList"></shelf-list>
        </scroll>
        <shelf-footer></shelf-footer>
    </div>
</template>

<script>
    import ShelfTitle from '../../components/shelf/ShelfTitle.vue'
    import ShelfSearch from '../../components/shelf/ShelfSearch.vue'
    import ShelfList from '../../components/shelf/ShelfList.vue'
    import ShelfFooter from '../../components/shelf/ShelfFooter.vue'
    import Scroll from '../../components/common/Scroll.vue'
    import { storeHomeMixin, publicMixin } from '../../utils/mixin'

    export default {
        mixins: [storeHomeMixin, publicMixin],
        components: {
            ShelfTitle,
            Scroll,
            ShelfSearch,
            ShelfList,
            ShelfFooter
        },
        data() {
            return {
                scrollBottom: 0
            }
        },
        watch: {
            isEditMode(isEditMode) {
                this.scrollBottom = isEditMode ? 48 : 0
                //等页面的响应变化完成后再改变滚动组件位置
                this.$nextTick(() => {
                    this.$refs.scroll.refresh() 
                })
            }
        },
        methods: {
            onScroll(offsetY) {
                this.setOffsetY(offsetY)
            }
        },
        mounted() {
            this.getShelfList()
            this.setShelfCategory([])
            this.setCurrentType(1)
        },
        beforeDestroy() {
            this.setShelfTitleVisible(true)
        }
    }
</script>

<style lang="scss" scoped>
    @import '../../assets/styles/global';
    .store-shelf {
        position: relative;
        width: 100%;
        height: 100%;
        background: white;
        .store-shelf-scroll-wrapper {
            position: absolute;
            top: 0;
            left: 0;
        }
    }
</style>
