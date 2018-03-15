const exec = require('child_process').exec;

Vue.component('runButton', {
    template : '<a data-position="bottom" data-delay="50" data-tooltip="Выполнить" class="btn-floating btn-large waves-effect waves-light tooltipped" @click="onDocProcess"><i class="material-icons">play_arrow</i></a>',
    methods : {
        onDocProcess : function (){
           if(!this.validateFields()) return;

           
           var filePath = store.getTemplateParam("filePath")
           var outDir = store.getTemplateParam("outDir");
           var fileName = getFileNameByPath(filePath);

           var data = processParams(store.getTemplateParam("tableData"));
           data.fileName = outDir + fileName;
           loadFile(filePath,function(err,content, currFile){
               if (err) { throw e};
               var doc=new Docxtemplater(content);
               doc.setData( 
                   currFile
               ) //set the templateVariables
               doc.render() //apply them (replace all occurences of {first_name} by Hipp, ...)
               var buf = doc.getZip().generate({type:"nodebuffer"});
               var file = {
                   content: buf,
                   name: currFile.fileName
               }

                writeFile(file);

           }, data);
        },
        errorMessage(text){
            Materialize.toast(text, 3000, 'error-toast')
        },
        validateFields(){
            var isValid = true;
            var errors = []
            if(!store.template.filePath || store.template.filePath == ''){
                isValid = false;
                errors.push("Путь до шаблона");
            }
            if(!store.template.outDir || store.template.outDir == ''){
                isValid = false;
                errors.push("Папка для сохранения");
            }
            if(!store.template.libreDir || store.template.libreDir == ''){
                isValid = false;
                errors.push("Папка Libreoffice");
            }

            if(!isValid){
                errorMessage = 'Не установлены параметры: \n';
                for(var i in errors){
                    errorMessage += errors[i] + '\n';
                }
                this.errorMessage(errorMessage);
            }           

            return isValid;
        }
    }
});

function processParams(tableData){
    var obj = {};
    for(var item in tableData){
        var record = tableData[item];
        
        var key = record["Ключ"];
        var value = record["Значение"];
        obj[key] = value;
    }

    return obj;
}

function loadFile(url,callback, currFile){
        JSZipUtils.getBinaryContent(url,callback, currFile);
}

function writeFile(file){
    var content = file.content;
    var fileName = file.name;
    if (fileName === undefined){
        console.log("You didn't save the file");
        return;
    }
    // fileName is a string that contains the path and filename created in the save file dialog.  
    fs.writeFile(fileName, content, function (err) {
        if(err){
            alert("Не удалось записать файл! Возможно не существует папка или нет прав на запись "+ err.message)
        } else {
            convertToPDF(fileName);
            Materialize.toast("Документ успешно обработан", 3000)
        }
    });
}

function convertToPDF(filePath){
    var fileName = getFileNameByPath(filePath)
    var outDir = filePath.replace(fileName, '');
    var command = store.convertLibreOfficeCommmand.replace('{LIBRE_DIR}', store.getTemplateParam("libreDir")).replace('{FILE_PATH}', filePath).replace('{OUT_DIR}', outDir);

    const { stdout, stderr } = exec(command);
    console.log('stdout:', stdout);
    console.log('stderr:', stderr);
    //exec(command);
}

function getFileNameByPath(filePath){
    var fileName = '';
    if(filePath.lastIndexOf('/') > 0){
        fileName = filePath.substring(filePath.lastIndexOf('/'))
    }
    
    if(filePath.lastIndexOf('\\') > 0){
        fileName = filePath.substring(filePath.lastIndexOf('\\'))
    }

    return fileName;
}