<template>
    <transition name="slide-com">
        <div class="setting-wrapper" v-show="menuVisible && settingVisible == 1">
            <div class="setting-theme">
                <div class="setting-theme-item" v-for="(item, index) in themeList" :key="index" @click="setTheme(item.name)">
                    <div class="preview" :style="{background: item.style.body.background}" :class="{'selected': item.name === defaultTheme}"></div>
                    <div class="text" :class="{'selected': item.name === defaultTheme}">{{item.alias}}</div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
    import { ebookMixin } from '../../utils/mixin'
    import { saveTheme } from '../../utils/localStorage'

    export default {
        mixins: [ebookMixin],
        methods: {
            setTheme(para) {
                this.setDefaultTheme(para)
                this.currentBook.rendition.themes.select(para)
                saveTheme(this.fileName, para)
                this.initGlobalStyle()
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import '../../assets/styles/global';
    .setting-wrapper {
        position: absolute;
        display: flex;
        flex-direction: column;
        bottom: px2rem(48);
        left: 0;
        width: 100%;
        height: px2rem(90);
        // z-index: 1;
        box-shadow: 0 px2rem(-8) px2rem(8) rgba(0, 0, 0, .15);
        // background: white;
        .setting-theme {
            height: 100%;
            display: flex;
            .setting-theme-item {
                flex: 1;
                display: flex;
                flex-direction: column;
                padding: px2rem(5);
                box-sizing: border-box;
                .preview {
                    flex: 1;
                    border: px2rem(1) solid #ccc;
                    box-sizing: border-box;
                    &.selected {
                        box-shadow: 0 px2rem(4) px2rem(6) 0 rgba(0, 0, 0, .1);
                    }
                }
                .text {
                    flex: 0 0 px2rem(20);
                    font-size: px2rem(14);
                    color: #ccc;
                    @include center;
                    &.selected {
                        color: #333;
                    }
                }
            }
        }
    }
</style>