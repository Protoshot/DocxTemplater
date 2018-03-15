Vue.component('folderSelector', {
    props : ["placeholder", "buttonName", "fieldStorageName"],
    template: '<div class="row valign-wrapper"> <div class="col"><a class="waves-effect waves-light btn" @click="clickSelectFolder">{{buttonName}}</a></div> <div class="col s8"> <div class="input-field col s12"> <input disabled="" :placeholder="placeholder" id="disabled" type="text" class="validate" :value="folderPath"> </div> </div> </div>',
    methods : {
        clickSelectFolder : function(){
            var me = this;
            dialog.showOpenDialog({
                properties: ['openDirectory']
            }, function (dir) {
                if (dir) me.setPath(dir[0])
            })
        },
        setPath : function(path){
            if(path) {
                this.folderPath = path;
                this.setTemplateParam(path);
            }
        },
        getPath : function(){
            return folderPath;
        },
        setTemplateParam: function(param){
            store.setTemplateParam(this.fieldStorageName, param);
        }
    },
    data: function () {
        return {
            folderPath : store.getTemplateParam(this.fieldStorageName)
        }
    }
});