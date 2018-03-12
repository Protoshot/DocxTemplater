Vue.component('save-button', {
    props: ['icon'],
    template: '<a class="btn-floating btn-large waves-effect waves-light green" @click="save"><i class="material-icons">save</i></a>',
    methods : {
        save : function (){
            //console.log("onClickSaveConfigButton +2")
        }
    }
});

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