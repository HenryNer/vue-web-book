<template>
    <div class="store-shelf">
        <shelf-title :title="shelfCategory.title"></shelf-title>
        <scroll class="store-shelf-scroll-wrapper" :top="0" :bottom="scrollBottom" @onScroll="onScroll" ref="scroll" v-if="ifShowList">
            <shelf-list :top="42" :data="shelfCategory.itemList"></shelf-list>
        </scroll>
        <div class="store-shelf-empty-view" v-else>
            {{$t('shelf.groupNone')}}
        </div>
        <shelf-footer></shelf-footer>
    </div>
</template>

<script>
    import ShelfTitle from '../../components/shelf/ShelfTitle.vue'
    import ShelfList from '../../components/shelf/ShelfList.vue'
    import ShelfFooter from '../../components/shelf/ShelfFooter.vue'
    import Scroll from '../../components/common/Scroll.vue'
    import { storeHomeMixin, publicMixin } from '../../utils/mixin'

    export default {
        mixins: [storeHomeMixin, publicMixin],
        components: {
            ShelfTitle,
            Scroll,
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
                    if (this.ifShowList) {
                        this.$refs.scroll.refresh() 
                    }
                })
            }
        },
        methods: {
            onScroll(offsetY) {
                this.setOffsetY(offsetY)
            }
        },
        computed: {
            ifShowList() {
                return this.shelfCategory.itemList && this.shelfCategory.itemList.length > 0
            }
        },
        mounted() {
            this.getCategoryList(this.$route.query.title)
            this.setCurrentType(2)
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
        .store-shelf-empty-view {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            font-size: px2rem(14);
            color: #333;
            @include center;
        }
    }
</style>
