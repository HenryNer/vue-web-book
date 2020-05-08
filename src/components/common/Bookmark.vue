<template>
    <div class="bookmark" :style="style" ref="bookmark"></div>
</template>

<script>
    import { px2rem } from '../../utils/utils'

    export default {
        props: {
            width: Number,
            height: Number,
            color: String
        },
        methods: {
            refresh() {
                if (this.height && this.width) {
                    this.$refs.bookmark.style.borderWidth = `${px2rem(this.height - 5)}rem ${px2rem(this.width / 2)}rem ${px2rem(5)}rem ${px2rem(this.width / 2)}rem`
                }
            }
        },
        computed: {
            style() {
                if (this.color) {
                    return {
                        borderColor: `${this.color} ${this.color} transparent ${this.color}!important`
                        }
                } else {
                    return ''
                }
            }
        },
        mounted() {
            this.refresh()
        }
    }
</script>

<style lang="scss">
    @import '../../assets/styles/global';
    .bookmark {
        width: 0;
        height: 0;
        border-style: solid!important;
        border-color: white white transparent white!important;
    }
</style>