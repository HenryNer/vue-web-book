<template>
    <transition name="slide-com">
        <div class="setting-wrapper" v-show="menuVisible && settingVisible == 2">
            <div class="setting-progress">
                <div class="read-time-wrapper">
                    <span class="read-time-text">{{getReadTimeText()}}</span>
                    <span class="icon-forward"></span>
                </div>
                <div class="progress-wrapper">
                    <div class="progress-icon-wrapper" @click="prevSection()">
                        <span class="icon-back"></span>
                    </div>
                    <input class="progress" type="range" max="100" min="0" step="1" :value="progress" :disabled="!bookAvaliable" ref="progress" @change="onProgressChange($event.target.value)" @input="onProgressInput($event.target.value)">
                    <div class="progress-icon-wrapper" @click="nextSection()">
                        <span class="icon-forward"></span>
                    </div>
                    <div class="text-wrapper">
                        <span class="progress-section-text">{{getSectionName}}</span>
                        <span>({{bookAvaliable? progress + '%' : '加载中...'}})</span>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
    import { ebookMixin } from '../../utils/mixin'

    export default {
        mixins: [ebookMixin],
        updated() {
            this.updateProgressBg()
        },
        methods: {
            //放下旋钮时事件
            onProgressChange(progress) {
                    this.displayProgress().then(() => {
                        // this.updateProgressBg()
                        // this.updateSection()
                    })
            },
            //拖动旋钮事件
            onProgressInput(progress) {
                this.setProgress(progress).then(() => {
                    // this.updateProgressBg()
                })
            },
            //返回上一章
            prevSection() {
                if (this.section > 0 && this.bookAvaliable) {
                    this.setSection(this.section - 1).then(() => {
                        this.displaySection()
                    })
                }
            },
            //下一章
            nextSection() {
                //currentBook.spine.length为章节长度，从0开始
                if (this.section < this.currentBook.spine.length - 1 && this.bookAvaliable) {
                    this.setSection(this.section + 1).then(() => {
                        this.displaySection()
                    })
                }
            },
            //切换章节时渲染对应章节第一页
            displaySection() {
                const sectionInfo = this.currentBook.section(this.section)
                        if (sectionInfo && sectionInfo.href) {
                            this.display(sectionInfo.href)
                        }
            },
            //渲染旋钮对应内容
            async displayProgress() {
                const cfi = this.currentBook.locations.cfiFromPercentage(this.progress / 100)
                await this.display(cfi, null, true)
            },
            //渲染进度条
            updateProgressBg() {
                this.$refs.progress.style.backgroundSize = `${this.progress}% 100%`
            },
            //拖动完旋钮后更新章节名称
            updateSection() {
                const currentLocation = this.currentBook.rendition.currentLocation()
                const section = currentLocation.start.index
                this.setSection(section)
            }
        }
    }
</script>

<style lang="scss">
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
        .setting-progress {
            position: relative;
            width: 100%;
            height: 100%;
            .read-time-wrapper {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: px2rem(40);
                font-size: px2rem(12);
                @include center;
            }
            .progress-wrapper {
                width: 100%;
                height: 100%;
                padding: 0 px2rem(15);
                box-sizing: border-box;
                @include center;
                .progress-icon-wrapper {
                    font-size: px2rem(20);
                }
                .progress {
                    width: 100%;
                    -webkit-appearance: none;
                    height: px2rem(2);
                    margin: 0 px2rem(10);
                    &:focus {
                        outline: none;
                    }
                    &::-webkit-slider-thumb {
                        -webkit-appearance: none;
                        height: px2rem(20);
                        width: px2rem(20);
                        border-radius: 50%;
                        background: white;
                        box-shadow: 0 4px 4px 0 rgba(0, 0, 0, .15);
                        border: px2rem(1) solid #ddd;
                    }
                }
                .text-wrapper {
                    position: absolute;
                    left: 0;
                    bottom: px2rem(10);
                    width: 100%;
                    font-size: px2rem(12);
                    @include center;
                    padding: 0 px2rem(15);
                    box-sizing: border-box;
                    .progress-section-text {
                        @include ellipsis;
                    }
                }
            }
        }
    }
</style>