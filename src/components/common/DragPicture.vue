<template>
  <div class="banner-wrapper">
    <div
      :class="{bannerImg: true, stopTransition: index === point || (point === banner.length && index === 0) || (stopLastPicMove && index === banner.length - 1)}"
      :style="{backgroundImage: `url('${item}')`}"
      v-for="(item, index) in banner"
      :key="index"
      ref="imgs"
    ></div>
  </div>
</template>

<script>
import { realPx, px2rem } from '../../utils/utils'

export default {
  props: {
    banner: Array
  },
  data() {
    return {
      point: 1,
      width: null,
      timeLoop: null,
      stopLastPicMove: true
    }
  },
  methods: {
    resizeWidth() {
      this.width = this.$refs.imgs[0].clientWidth
      this.$refs.imgs[this.banner.length - 1].style.left = `-${2 * (this.width + realPx(10))}px`
      this.$refs.imgs[this.banner.length - 2].style.left = `-${this.width + realPx(10)}px`

      this.$refs.imgs[this.banner.length - 1].style.transform = `translate(-${this.width + realPx(10)}px, 0px)`
      this.$refs.imgs[this.banner.length - 2].style.transform = `translate(${this.width + realPx(10)}px, 0px)`
      this.$refs.imgs[this.banner.length - 3].style.transform = `translate(0px, 0px)`
    },
    loop() {
      this.banner.map((item, index) => {
        if (this.point - 1 === index) {
          this.$refs.imgs[index].style.transform = `translate(0px, 0px)`
        } else if ((this.point - 2 < 0 && index === this.banner.length - 1) || (this.point - 2 >= 0 && this.point - 2 === index)) {
          this.$refs.imgs[index].style.transform = `translate(-${this.width + realPx(10)}px, 0px)`
        } else if ((this.point === this.banner.length && index === 0) || (this.point === index)) {
          this.$refs.imgs[index].style.transform = `translate(${this.width + realPx(10)}px, 0px)`
        }
      })
      //防止动画没完成时改变point导致class变化
      setTimeout(() => {
        if (this.point !== this.banner.length) {
        this.point++
      } else {
        this.point = 1
      }
      }, 500)
      this.timeLoop = setTimeout(() => {
        this.loop()
      }, 3000)
    }
  },
  mounted() {
    window.onresize = this.resizeWidth
    //异步才能在mounted中获取到refs
    setTimeout(() => {
      this.resizeWidth()
    }, 100)
    //启动轮播
    new Promise((resolve) => {
      setTimeout(() => {
        this.loop()
        resolve()
      }, 1000)
    }).then(() => {
      //防止轮播开始时不必要的效果
      this.stopLastPicMove = false
    })
  },
  destroyed() {
    if (this.timeLoop) clearTimeout(this.timeLoop)
  }
}
</script>

<style lang="scss" scoped>
@import "../../assets/styles/global";
.banner-wrapper {
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  .bannerImg {
    position: relative;
    display: inline-block;
    width: 100%;
    height: px2rem(150);
    margin-right: px2rem(10);
    background-repeat: no-repeat;
    background-size: 100% 100%;
    transition-duration: .3s;
  }
  .stopTransition {
    transition-duration: 0s;
  }
}
</style>