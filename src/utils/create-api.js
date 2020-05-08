import CreateAPI from 'vue-create-api'
import Vue from 'vue'
import Toast from '../components/common/Toast.vue'
import Popup from '../components/common/Popup.vue'
import GroupDialog from '../components/shelf/ShelfGroupDialog.vue'
//vue-create-api插件能够让vue组件通过API方式进行调用
Vue.use(CreateAPI)
Vue.createAPI(Toast, true) //需要注册的组件需要先加上name属性，用法: vue.$create+ 这里注册的组件名
Vue.createAPI(Popup, true)
Vue.createAPI(GroupDialog, true)

//更简化写法
Vue.mixin({
    methods: {
        toast(settings) {
            return this.$createToast({
                $props: settings
            })
        },
        popup(settings) {
            return this.$createPopup({
                $props: settings
            })
        },
        //简化toast
        simpleToast(text) {
            const toast = this.toast({
                text: text
            })
            toast.show()
            toast.updateText(text)
        },
        dialog(settings) {
            return this.$createGroupDialog({
                $props: settings
            })
        }
    }
})