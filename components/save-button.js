Vue.component('save-button', {
    props: ['icon'],
    template: '<a class="btn-floating btn-large waves-effect waves-light green" @click="save"><i class="material-icons">save</i></a>',
    methods : {
        save : function (){
            //console.log("onClickSaveConfigButton +2")
        }
    }
});

new Vue({
    el: "#app-toolbar"
})