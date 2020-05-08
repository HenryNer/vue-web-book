<template>
    <div class="shelf-search-wrapper" :class="{'search-top': ifInputClick, 'hidden-shadow': ifHiddenShadow}">
        <div class="shelf-search" :class="{'search-top': ifInputClick}">
            <div class="search-wrapper">
                <div class="icon-search-wrapper">
                    <span class="icon-search icon"></span>
                </div>
                <div class="search-input-wrapper">
                    <input class="search-input" type="text" :placeholder="$t('shelf.search')" @click="onSearchClick" v-model="searchText">
                </div>
                <div class="icon-clear-wrapper" v-show="searchText.length > 0" @click="clearSearchText">
                    <span class="icon-close-circle-fill"></span>
                </div>
            </div>
            <div class="icon-locale-wrapper" v-if="!ifInputClick" @click="switchLocale">
                <span class="icon-cn icon" v-if="lang === 'cn'"></span>
                <span class="icon-en icon" v-else></span>
            </div>
            <div class="cancel-btn-wrapper" @click="onCancelClick" v-else>
                <span class="cancel-text">{{$t('shelf.cancel')}}</span>
            </div>
        </div>
        <transition name="hot-search-move">
            <div class="shelf-search-tab-wrapper" v-if="ifInputClick">
                <div class="shelf-search-tab-item" v-for="item in tabs" :key="item.id" @click="onTabClick(item.id)">
                    <span class="shelf-search-tab-text" :class="{'is-selected': selectedTab ===item.id}">{{item.text}}</span>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
    import { saveLocale } from '../../utils/localStorage'
    import { storeHomeMixin, publicMixin } from '../../utils/mixin'
    export default {
        mixins: [storeHomeMixin, publicMixin],
        data() {
            return {
                ifInputClick: false,
                searchText: '',
                selectedTab: 1,
                ifHiddenShadow: true
            }
        },
        watch: {
            offsetY(offsetY) {
                if (offsetY > 0 && this.ifInputClick) {
                    this.ifHiddenShadow = false
                } else {
                    this.ifHiddenShadow = true
                }
            }
        },
        computed: {
            lang() {
                return this.$i18n.locale
            },
            tabs() {
                return [
                    {
                        id: 1,
                        text: this.$t('shelf.default')
                    },
                    {
                        id: 2,
                        text: this.$t('shelf.progress')
                    },
                    {
                        id: 3,
                        text: this.$t('shelf.purchase')
                    }
                ]
            }
        },
        methods: {
            onSearchClick() {
                this.ifInputClick = true
                this.setShelfTitleVisible(false)
            },
            onCancelClick() {
                this.ifInputClick = false
                this.setShelfTitleVisible(true)
            },
            switchLocale() {
                if (this.$i18n.locale === 'en') {
                    this.$i18n.locale = 'cn'
                } else {
                    this.$i18n.locale = 'en'
                }
                saveLocale(this.$i18n.locale)
            },
            clearSearchText() {
                this.searchText = ''
            },
            onTabClick(id) {
                this.selectedTab = id
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import '../../assets/styles/global';
    .shelf-search-wrapper {
        position: relative;
        width: 100%;
        height: px2rem(94);
        font-size: px2rem(16);
        background: white;
        z-index: 1;
        box-shadow: 0 px2rem(2) px2rem(2) 0 rgba(0, 0, 0, .1);
        &.hidden-shadow {
            box-shadow: none;
        }
        &.search-top {
            position: fixed;
            left: 0;
            top: 0;
        }
        .shelf-search {
            position: absolute;
            top: px2rem(42);
            left: 0;
            width: 100%;
            height: px2rem(52);
            display: flex;
            transition: top $transitionTime linear;
            &.search-top {
                top: 0
            }
            .search-wrapper {
                flex: 1;
                display: flex;
                margin: px2rem(8) 0 px2rem(8) px2rem(10);
                border: px2rem(1) solid #ccc;
                border-radius: px2rem(3);
                .icon-search-wrapper {
                    flex: 0 0 px2rem(22);
                    @include right;
                    .icon-search {
                        font-size: px2rem(12);
                    }
                }
                .search-input-wrapper {
                    flex: 1;
                    padding: 0 px2rem(10);
                    box-sizing: border-box;
                    @include center;
                    .search-input {
                        width: 100%;
                        border: none;
                        font-size: px2rem(14);
                        color: #333;
                        &:focus {
                            outline: none;
                        }
                        &::-webkit-input-placeholder {
                            font-size: px2rem(14);
                            color: #ccc;
                        }
                    }
                }
                .icon-clear-wrapper {
                    flex: 0 0 px2rem(24);
                    @include left;
                    .icon-close-circle-fill {
                        font-size: px2rem(14);
                        color: #ccc;
                    }
                }
            }
            .icon-locale-wrapper {
                flex: 0 0 px2rem(55);
                @include center;
                .icon-cn, .icon-en {
                    font-size: px2rem(22);
                    color: #666;
                }
            }
            .cancel-btn-wrapper {
                flex: 0 0 px2rem(55);
                @include center;
                .cancel-text {
                    font-size: px2rem(14);
                    color: $color-blue;
                }
            }
        }
        .shelf-search-tab-wrapper {
            position: absolute;
            top: px2rem(52);
            left: 0;
            // z-index: 105;
            display: flex;
            width: 100%;
            height: px2rem(42);
            .shelf-search-tab-item {
                flex: 1;
                @include center;
                .shelf-search-tab-text {
                    font-size: px2rem(12);
                    color: #999;
                    &.is-selected {
                        color: $color-blue
                    }
                }
            }
        }
    }
</style>