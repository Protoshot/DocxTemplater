Vue.component('saveButton', {
    template: '<a data-position="bottom" data-delay="50" data-tooltip="Сохранить настройки" class="btn-floating btn-large waves-effect waves-light tooltipped" @click="onClickSave"><i class="material-icons">save</i></a>',
    methods : {
        onClickSave : function (){
            configService.writeConfig(store.template);
            Materialize.toast('Настройки сохранены', 3000)
        }
    }
});