<template>
    <div class="store-home">
        <search-bar></search-bar>
        <flap-card :data="random"></flap-card>
        <scroll :top="scrollTop" @onScroll="onScroll" ref="scroll">
            <drag-picture class="banner-wrapper" :banner="banner"></drag-picture>
            <guess-you-like :data="guessYouLike"></guess-you-like>
            <recommend :data="recommend" :class="recommend"></recommend>
            <featured :data="featured" :titleText="$t('home.featured')" :class="featured"></featured>
            <div class="category-list-wrapper" v-for="(item, index) in categoryList" :key="index">
                <category-book :data="item"></category-book>
            </div>
            <category class="categories" :data="categories"></category>
        </scroll>
    </div>
</template>

<script>
    import Scroll from '../../components/common/Scroll.vue'
    import SearchBar from '../../components/home/SearchBar.vue'
    import FlapCard from '../../components/home/FlapCard.vue'
    import GuessYouLike from '../../components/home/GuessYouLike.vue'
    import Recommend from '../../components/home/Recommend.vue'
    import Featured from '../../components/home/Featured.vue'
    import CategoryBook from '../../components/home/CategoryBook.vue'
    import Category from '../../components/home/Category.vue'
    import DragPicture from '@/components/common/DragPicture'
    import { publicMixin } from '../../utils/mixin'
    import { home } from '../../api/store'
    
    export default {
        mixins: [publicMixin],
        components: {
            SearchBar,
            Scroll,
            FlapCard,
            GuessYouLike,
            Recommend,
            Featured,
            CategoryBook,
            Category,
            DragPicture
        },
        data() {
            return {
                scrollTop: 94,
                //随机图书
                random: null,
                banner: [],
                guessYouLike: null,
                recommend: null,
                featured: null,
                categoryList: null,
                categories: null
            }
        },
        methods: {
            onScroll(offsetY) {
                this.setOffsetY(offsetY)
                if (offsetY > 0) {
                    this.scrollTop = 52
                } else {
                    this.scrollTop = 94
                }
                this.$refs.scroll.refresh()
            }
        },
        //从mock中请求了展示的资源
        mounted() {
            home().then(response => {
                if (response && response.status === 200) {
                    const data = response.data
                    const randomIndex = Math.floor(Math.random() * data.random.length)
                    this.random = data.random[randomIndex]
                    this.banner = data.banner
                    this.guessYouLike = data.guessYouLike
                    this.recommend = data.recommend
                    this.featured = data.featured
                    this.categoryList = data.categoryList //注意这里的categoryList为二维数组，这个组件中先做一次循环后再传入item给category组件处理一维数组
                    this.categories = data.categories
                }
            })
        }
    }
</script>

<style lang="scss" scoped>
    @import '../../assets/styles/global';
    .store-home {
        width: 100%;
        height: 100%;
        .banner-wrapper {
            padding: px2rem(10);
            box-sizing: border-box;
        }
        .recommend {
            margin-top: px2rem(20);
        }
        .featured {
            margin-top: px2rem(20);
        }
        .category-list-wrapper {
            margin-top: px2rem(20);
        }
        .categories {
            margin-top: px2rem(20);
        }
    }
</style>