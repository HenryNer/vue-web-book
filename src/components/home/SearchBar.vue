<template>
    <div>
        <div class="search-bar" :class="{'hidden-title': !titleVisible, 'hidden-shadow': !shadowVisible}">
            <transition name="title-move">
                <div class="search-bar-title-wrapper" v-show="titleVisible">
                    <div class="title-text-wrapper">
                        <span class="title-text title">{{$t('home.title')}}</span>
                    </div>
                    <div class="title-icon-shake-wrapper" @click="showFlapCard">
                        <span class="icon-shake icon"></span>
                    </div>
                </div>
            </transition>
            <div class="title-icon-back-wrapper" :class="{'hidden-title': !titleVisible}" @click="back">
                <span class="icon-back icon"></span>
            </div>
            <div class="search-bar-input-wrapper" :class="{'hidden-title': !titleVisible}">
                <div class="search-bar-blank" :class="{'hidden-title': !titleVisible}"></div>
                <div class="search-bar-input">
                    <span class="icon-search icon" @click="search"></span>
                    <input class="input" type="text" :placeholder="$t('home.hint')" v-model="searchText" @click="showHotSearch" @keyup.13.exact="search">
                </div>
            </div>
        </div>
        <hot-search-list v-show="hotSearchVisible" ref="hotSearch"></hot-search-list>
    </div>
    
</template>

<script>
    import { publicMixin, storeHomeMixin } from '../../utils/mixin'
    import HotSearchList from './HotSearchList.vue'
    import { saveSearchHistory } from '../../utils/localStorage'

    export default {
        mixins: [publicMixin, storeHomeMixin],
        components: {
            HotSearchList
        },
        data() {
            return {
                searchText: '',
                titleVisible: true,
                shadowVisible: false,
                hotSearchVisible: false
            }
        },
        watch: {
            offsetY(offsetY) {
                if (offsetY > 0) {
                    this.hiddenTitle()
                    this.showShadow()
                } else {
                    this.showTitle()
                    this.hiddenShadow()
                }
            },
            hotSearchOffsetY(offsetY) {
                if (offsetY > 0) {
                    this.showShadow()
                } else {
                    this.hiddenShadow()
                }
            }
        },
        methods: {
            search() {
                saveSearchHistory(this.searchText)
                this.$router.push({
                    path: '/store/list',
                    query: {
                        keyword: this.searchText
                    }
                })
            },
            showFlapCard() {
                this.setFlapCardVisible(true)
            },
            back() {
                if (this.offsetY > 0) {
                    this.showShadow()
                } else {
                    this.hiddenShadow()
                }
                if (this.hotSearchVisible) {
                    this.hiddenHotSearch()
                } else {
                    this.$router.push('/store/shelf')
                }
            },
            hiddenHotSearch() {
                this.hotSearchVisible = false
                if (this.offsetY > 0) {
                    this.hiddenTitle()
                    this.showShadow()
                } else {
                    this.showTitle()
                    this.hiddenShadow()
                }
            },
            showHotSearch() {
                this.hotSearchVisible = true
                this.hiddenTitle()
                this.hiddenShadow()
                //hotSearch组件显示以后再进行滚动条归位操作，否则不会生效，因为视图不会立即更新
                this.$nextTick(() => {
                    this.$refs.hotSearch.reset()
                })
            },
            hiddenTitle() {
                this.titleVisible = false
            },
            showTitle() {
                this.titleVisible = true
            },
            hiddenShadow() {
                this.shadowVisible = false
            },
            showShadow() {
                this.shadowVisible = true
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import '../../assets/styles/global';
    .search-bar {
        position: relative; 
        width: 100%;
        height: px2rem(94);
        z-index: 11;
        box-shadow: 0 px2rem(2) px2rem(2) 0 rgba(0, 0, 0, .1);
        &.hidden-title {
            height: px2rem(52);
        }
        &.hidden-shadow {
            box-shadow: none;
        }
        .search-bar-title-wrapper {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: px2rem(42);
            .title-text-wrapper {
                width: 100%;
                height: px2rem(42);
                @include center;
            }
            .title-icon-shake-wrapper {
                position: absolute;
                right: px2rem(15);
                top: 0;
                height: px2rem(42);
                @include center;
            }
        }
        .title-icon-back-wrapper {
            position: absolute;
            left: px2rem(15);
            top: 0;
            height: px2rem(42);
            @include center;
            z-index: 1;
            transition: height $transitionTime $transitionType;
            &.hidden-title {
                height: px2rem(52);
            }
        }
        .search-bar-input-wrapper {
            position: absolute;
            display: flex;
            top: px2rem(42);
            width: 100%;
            height: px2rem(52);
            padding: px2rem(10);
            box-sizing: border-box;
            transition: top $transitionTime $transitionType;
            &.hidden-title {
                top: 0;
            }
            .search-bar-blank {
                flex: 0 0 0;
                width: 0;
                transition: all $transitionTime $transitionType;
                &.hidden-title {
                    flex: 0 0 px2rem(31);
                    width: px2rem(31);
                }
            }
            .search-bar-input {
                flex: 1;
                width: 100%;
                @include left;
                padding: px2rem(5) px2rem(15);
                box-sizing: border-box;
                border-radius: px2rem(20);
                background: #f4f4f4;
                border: px2rem(1) solid #eee;
                .icon-search {
                    color: #999;
                }
                .input {
                    width: 100%;
                    height: px2rem(22);
                    border: none;
                    background: transparent;
                    margin-left: px2rem(10);
                    font-size: px2rem(12);
                    color: #666;
                    &:focus {
                        outline: none;
                    }
                    &::-webkit-input-placeholder {
                        color: #ccc;
                    }
                }
            }
        }
    }
</style>