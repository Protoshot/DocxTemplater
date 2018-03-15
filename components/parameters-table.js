Vue.component('parametersTable', {
    template: '<table class="highlight"> <tfoot><tr class="add-params-row" @click="addParamRow()">Добавить строку параметров</tr><tr class="add-params-row" @click="removeParamRow()">Удалить строку параметров</tr></tfoot> <thead> <tr> <th v-for="field in tableFields"> {{ field }} </th> </tr> </thead> <tbody> <tr v-for="(tableRow, indexRow) in tableData"> <td v-for="fieldName in tableFields" :indexrow="indexRow" :fieldname="fieldName" @keydown.enter.prevent.stop="endEdit" @blur="saveChanges($event, indexRow, fieldName)" @dblclick="onEditCell" contenteditable="true">{{tableRow[fieldName]}}</td></tr> </tbody> </table>',
    methods : {
        onEditCell : function(event){
            event.target.contenteditable = true;
        }, 
        saveChanges : function (event, indexRow, objectKey){
            var param = event.target.innerText;
            if(param) { 
                this.tableData[indexRow][objectKey] = param;
                store.setTemplateParam("tableData", this.tableData);
            }
        },
        addParamRow : function(){
            this.tableData.push({});
        },
        removeParamRow: function(){
            this.tableData.pop();
        },
        endEdit : function(event){
            window.getSelection().removeAllRanges();
        }
    },
    data: function () {
        return {
            tableFields: store.getTemplateParam("tableFields"),
            tableData: store.getTemplateParam("tableData")
        }
    }
});