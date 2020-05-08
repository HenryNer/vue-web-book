<template>
    <div class="flap-card-wrapper" v-show="flapCardVisible">
        <div class="flap-card-bg" :class="{'animation': runFlapCardAnimation}" v-show="runFlapCardAnimation">
            <div class="flap-card" v-for="(item, index) in flapCardList" :key="index" :style="{zIndex: item.zIndex}">
                <div class="flap-card-circle">
                    <div class="flap-card-semi-circle flap-card-semi-circle-left" :style="semiCircleStyle(item, 'left')" ref="left"></div>
                    <div class="flap-card-semi-circle flap-card-semi-circle-right" :style="semiCircleStyle(item, 'right')" ref="right"></div>
                </div>
            </div>
            <div class="point-wrapper">
                <div class="point" :class="{'animation': runPointAnimation}" v-for="item in pointList" :key="item"></div>
            </div>
        </div>
        <div class="book-card" :class="{'animation': runBookCarAnimation}" v-show="runBookCarAnimation">
            <div class="book-card-wrapper">
                <div class="img-wrapper">
                    <img class="img" v-lazy="data ? data.cover : ''">
                </div>
                <div class="content-wrapper">
                    <div class="content-title">{{data ? data.title : ''}}</div>
                    <div class="content-author sub-title-medium">{{data ? data.author : ''}}</div>
                    <div class="content-category">{{categoryText()}}</div>
                </div>
                <div class="read-btn" @click.stop="closeAndShowBookDetail()">{{$t('home.readNow')}}</div>
            </div>
        </div>
        <div class="close-btn-wrapper" @click="close">
            <div class="icon-close"></div>
        </div>     
    </div>
</template>

<script>
    import { storeHomeMixin } from '../../utils/mixin'
    import { flapCardList, categoryText } from '../../utils/store'

    export default {
        mixins: [storeHomeMixin],
        props: {
            data: Object
        },
        data() {
            return {
                flapCardList,
                front: 0,
                back: 1,
                intervalTime: 25,
                runFlapCardAnimation: false,
                pointList: null,
                runPointAnimation: false,
                runBookCarAnimation: false
            }
        },
        watch: {
            flapCardVisible(v) {
                if (v) {
                    this.runAnimation()
                }
            }
        },
        methods: {
            closeAndShowBookDetail() {
                this.showBookDetail(this.data)
                this.close()
            },
            close() {
                this.setFlapCardVisible(false)
                this.stopFlapCardAnimation()
            },
            semiCircleStyle(item, dir) {
                return {
                    backgroundColor: `rgb(${item.r},${item.g},${item.b})`,
                    backgroundSize: item.backgroundSize,
                    backgroundImage: dir === 'left' ? item.imgLeft : item.imgRight
                }
            },
            //实现卡片Y轴角度改变
            rotate(index, type) {
                const item = this.flapCardList[index]
                let dom
                if (type === 'front') {
                    dom = this.$refs.right[index]
                } else {
                    dom = this.$refs.left[index]
                }
                dom.style.transform = `rotateY(${item.rotateDegree}deg)`
                dom.style.backgroundColor = `rgb(${item.r},${item._g},${item.b})`
            },
            //实现卡片翻转
            flapCardRotate() {
                const frontFlapCard = this.flapCardList[this.front]
                const backFlapCard = this.flapCardList[this.back]
                //正面逻辑
                frontFlapCard.rotateDegree += 10
                frontFlapCard._g -= 5
                //反面逻辑，prepare函数会先把反面的左侧移动180度
                if (backFlapCard.rotateDegree < 90) {
                    backFlapCard._g += 5
                }
                backFlapCard.rotateDegree -= 10
                if (frontFlapCard.rotateDegree === 90 && backFlapCard.rotateDegree === 90) {
                    backFlapCard.zIndex += 2
                }
                this.rotate(this.front, 'front')
                this.rotate(this.back, 'back')
                //每组完成后切换下一组
                if (frontFlapCard.rotateDegree === 180 && backFlapCard.rotateDegree === 0) {
                    this.next()
                }
            },
            //切换下组正反面的卡片
            next() {
                const frontFlapCard = this.flapCardList[this.front]
                const backFlapCard = this.flapCardList[this.back] 
                frontFlapCard.rotateDegree = 0
                frontFlapCard._g = frontFlapCard.g
                backFlapCard.rotateDegree = 0
                backFlapCard._g = backFlapCard.g
                this.rotate(this.front, 'front')
                this.rotate(this.back, 'back')
                this.front++
                this.back++
                const len = this.flapCardList.length
                if (this.front >= len) {
                    this.front = 0
                }
                if (this.back >= len) {
                    this.back = 0
                }
                /**
                 * 动态改变zIndex算法
                 * zIndex
                 * 100 -> 96
                 * 99 -> 100
                 * 98 -> 99
                 * 97 -> 98
                 * 96 -> 97
                 * (0 - 1 + 5) % 5 = 4
                 */
                this.flapCardList.forEach((item, index) => {
                    item.zIndex = 100 - ((index - this.front + len) % len)
                })
                //每次进入下一组后先用prepare函数对反面进行操作改变其Y轴角度及bg
                this.prepare()
            },
            prepare() {
                const backFlapCard = this.flapCardList[this.back]
                backFlapCard.rotateDegree = 180
                backFlapCard._g = backFlapCard.g - 5 * 9
                this.rotate(this.back, 'back')
            },
            //每次关闭动画时还原卡片属性
            reset() {
                this.front = 0
                this.back = 1
                this.flapCardList.forEach((item, index) => {
                    item.zIndex = 100 - index
                    item._g = item.g
                    item.rotateDegree = 0
                    this.rotate(index, 'front')
                    this.rotate(index, 'back')
                })
                this.runFlapCardAnimation = false
                this.runPointAnimation = false
                this.runBookCarAnimation = false
                if (this.timeout) {
                    clearTimeout(this.timeout)
                }
                if (this.timeout2) {
                    clearTimeout(this.timeout2)
                }
            },
            //开始卡片翻转动画
            startFlapCardAnimation() {
                this.prepare()
                this.task = setInterval(() => {
                    this.flapCardRotate()
                },this.intervalTime)
            },
            //烟花开始
            startPointAnimation() {
                this.runPointAnimation = true
                setTimeout(() => {
                    this.runPointAnimation = false
                }, 750)
            },
            //结束动画
            stopFlapCardAnimation() {
                if (this.task) {
                    clearInterval(this.task)
                }
                this.reset()
            },
            //动画开始
            runAnimation() {
                this.runFlapCardAnimation = true
                this.timeout = setTimeout(() => {
                    this.startFlapCardAnimation()
                    this.startPointAnimation()
                },300)
                //推荐阅读动画开始
                this.timeout2 = setTimeout(() => {
                    this.stopFlapCardAnimation()
                    this.runBookCarAnimation = true
                },2500)
            },
            //国际化分类名称
            categoryText() {
                if (this.data) {
                    return categoryText(this.data.category, this)
                } else {
                    return ''
                }
            }
        },
        created() {
            this.pointList = []
            for (let i = 0; i < 18; i++) {
                this.pointList.push(`point${i}`)
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import '../../assets/styles/global';
    @import '../../assets/styles/flapCard';
    .flap-card-wrapper {
        @include absCenter;
        z-index: 1000;
        height: 100%;
        width: 100%;
        background: rgba(0, 0, 0, .6);
        @include center;
        .flap-card-bg {
            position: relative;
            width: px2rem(64);
            height: px2rem(64);
            border-radius: px2rem(5);
            background: white;
            transform: scale(0);
            opacity: 0;
            &.animation {
                animation: flap-card-move .3s ease-in 1 forwards;
            }
            @keyframes flap-card-move {
                0% {
                    transform: scale(0);
                    opacity: 0;
                }
                50% {
                    transform: scale(1.2);
                    opacity: 1;
                }
                75% {
                    transform: scale(.9);
                    opacity: 1;
                }
                100% {
                    transform: scale(1);
                    opacity: 1;
                }
            }
            .flap-card {
                @include absCenter;
                width: px2rem(48);
                height: px2rem(48);
                .flap-card-circle {
                    display: flex;
                    width: 100%;
                    height: 100%;
                    .flap-card-semi-circle {
                        flex: 0 0 50%;
                        width: 50%;
                        height: 100%;
                        background-repeat: no-repeat;
                        backface-visibility: hidden;
                    }
                    .flap-card-semi-circle-left {
                        border-radius: px2rem(24) 0 0 px2rem(24);
                        background-position: center right;
                        transform-origin: right;
                    }
                    .flap-card-semi-circle-right {
                        border-radius: 0 px2rem(24) px2rem(24) 0;
                        background-position: center left;
                        transform-origin: left;
                    }
                }
            }
            .point-wrapper {
                @include absCenter;
                z-index: 1500;
                .point {
                    border-radius: 50%;
                    @include absCenter;
                    &.animation {
                        @for $i from 1 to length($moves) {  //for from to length均为scss语法，length求长度
                            &:nth-child(#{$i}) {    //&:nth-child相当于在.point-wrapper上使用
                                @include move($i)
                            }
                        }
                    }
                }
            }
        }
        .book-card {
            position: relative;
            width: 65%;
            max-width: px2rem(400);
            box-sizing: border-box;
            border-radius: px2rem(15);
            background: white;
            &.animation {
                animation: scale .3s ease-in both;
                @keyframes scale {
                    0% {
                        transform: scale(0);
                        opacity: 0;
                    }
                    0% {
                        transform: scale(1);
                        opacity: 1;
                    }
                }
            }
            .book-card-wrapper {
                width: 100%;
                height: 100%;
                margin-bottom: px2rem(30);
                @include columnTop;
                .img-wrapper {
                    width: 100%;
                    margin-top: px2rem(20);
                    @include center;
                    .img {
                        width: px2rem(90);
                        height: px2rem(130);
                    }
                }
                .content-wrapper {
                    padding: 0 px2rem(20);
                    margin-top: px2rem(20);
                    .content-title {
                        color: #333;
                        font-weight: bold;
                        font-size: px2rem(18);
                        line-height: px2rem(20);
                        max-height: px2rem(40);
                        text-align: center;
                        @include ellipsis2(2)
                    }
                    .content-author {
                        margin-top: px2rem(10);
                        text-align: center;
                    }
                    .content-category {
                        color: #999;
                        font-size: px2rem(14);
                        margin-top: px2rem(10);
                        text-align: center;
                    }
                }
                .read-btn {
                    position: absolute;
                    bottom: px2rem(-20);
                    left: 0;
                    z-index: 1100;
                    width: 100%;
                    border-radius: 0 0 px2rem(15) px2rem(15);
                    padding: px2rem(15) 0;
                    text-align: center;
                    color: white;
                    font-size: px2rem(14);
                    background: $color-blue;
                }
            }
        }
        .close-btn-wrapper {
            position: absolute;
            left: 0;
            bottom: px2rem(30);
            width: 100%;
            @include center;
            .icon-close {
                width: px2rem(45);
                height: px2rem(45);
                font-size: px2rem(25);
                border-radius: 50%;
                background: #333;
                color: white;
                @include center;
            }
        }
    }
</style>