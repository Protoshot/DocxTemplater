Vue.component('fileSelector', {
    props : ["placeholder", "buttonName", "fieldStorageName"],
    template: '<div class="row valign-wrapper"> <div class="col"><a class="waves-effect waves-light btn" @click="clickSelectFile">{{buttonName}}</a></div> <div class="col s8"> <div class="input-field col s12"> <input disabled="" :placeholder="placeholder" id="disabled" type="text" class="validate" :value="filePath"> </div> </div> </div>',
    methods : {
        clickSelectFile : function(){
            var me = this;
            dialog.showOpenDialog({
                properties: ['openFile'],
                filters : [{name: "Шаблон документа", extensions: ['docx']}]
            }, function (files) {
                if (files) me.setPath(files[0])
            })
        },
        setPath : function(path){
            if(path){ 
                this.filePath = path;
                this.setTemplateParam(path);
            }
        },
        getPath : function(){
            return filePath;
        },
        setTemplateParam: function(param){
            store.setTemplateParam(this.fieldStorageName, param);
        }
    },
    data: function () {
        return {
            filePath : store.getTemplateParam(this.fieldStorageName)
        }
    }
});