Vue.component('settings-button', {
    props: ['icon'],
    template: '<a class="btn-floating btn-large waves-effect waves-light green" @click="settings"><i class="material-icons">settings</i></a>',
    methods : {
        settings : function (){
            //console.log("onClickConfigsConfigButton +2")
        }
    }
});

new Vue({
    el: "#app-toolbar"
})