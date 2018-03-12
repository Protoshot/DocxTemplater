document.addEventListener("DOMContentLoaded", onDOMContentLoaded);
const electron = require('electron')
const ipcRenderer = electron.ipcRenderer;
const selectDirBtn = document.getElementById('select-directory');

var XW = {
	/* worker message */
	msg: 'xlsx',
	/* worker scripts */
	rABS: './xlsxworker2.js',
	norABS: './xlsxworker1.js',
	noxfer: './xlsxworker.js'
};

ipcRenderer.on('selected-template', function (event, path) {
  document.getElementById('selected-template').innerHTML = `${path}`
})

ipcRenderer.on('select-output-folder', function (event, path) {
  document.getElementById('output-name').innerHTML = `${path}` + "\\" ;
})


function onDOMContentLoaded() {
    var selectTemplateBtn = document.getElementById("select-template");
    var runner = document.getElementById("run-process");
    var selectXLSX = document.getElementById("select-xlsx");
    var hiddenInput = document.getElementById("hidden-input-xlsx");
    var selectOutputFolder = document.getElementById('select-output-folder');

    selectOutputFolder.addEventListener("click", function(event) {
        console.log("check");
       ipcRenderer.send('open-folder-dialog');
    });

    hiddenInput.addEventListener("change", handleFile, false);

    selectXLSX.addEventListener("click", function(event) {
       hiddenInput.click();
    });

    selectTemplateBtn.addEventListener("click", function(event) {
       ipcRenderer.send('open-file-dialog')
    });

    runner.addEventListener("click", function(event) {
       templater();
    });
}

function handleFile(e) {
    var rABS = true;
	var f = e.target.files[0];
    document.getElementById('selected-xlsx').innerHTML = f.path;
	{
		var reader = new FileReader();
		var name = f.name;
		reader.onload = function(e) {
			if(typeof console !== 'undefined') console.log("onload", new Date(), rABS);
			var data = e.target.result;
				var wb;
				if(rABS) {
					wb = XLSX.read(data, {type: 'binary'});
				} else {
				var arr = fixdata(data);
					wb = XLSX.read(btoa(arr), {type: 'base64'});
				}
				process_wb(wb);
		};
		if(rABS) reader.readAsBinaryString(f);
		else reader.readAsArrayBuffer(f);
	}
}

function process_wb (wb){
    window.jsonTable = to_json(wb);

    var tabs = initParametersControl(window.jsonTable);
    parametersContol(tabs);
}

function to_json(workbook) {
	var result = {};
	workbook.SheetNames.forEach(function(sheetName) {
		var roa = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
		if(roa.length > 0){
			result[sheetName] = roa;
		}
	});
	return result;
}

var loadFile=function(url,callback, currFile){
        JSZipUtils.getBinaryContent(url,callback, currFile);
}

function templater () {
    var templateField = document.getElementById('selected-template');
    var dataField = document.getElementById('data-input');
    var fileName = document.getElementById('output-name').innerHTML + document.getElementById('file-name').value;

    if (fileName == null || fileName.value == ""){
        fileName = "output";
    }

    if (templateField == null) {
        var msg = "Ошибка инициализации программы, перезапустите программу";
        ipcRenderer.send('error-dialog', msg);
        return;
    }

    var templatePath = templateField.innerHTML;
    if (templatePath == "") {
        var msg = "Не указан шаблон документа";
        ipcRenderer.send('error-dialog', msg);
        return;
    }

    //var data = dataField.value;
    var data = getJsonForReplace();
    if (data == "") {
        var msg = "Не достает входных данных";
        ipcRenderer.send('error-dialog', msg);
        return;
    }
    var json = data;

    for (var item in json) {
        var suffix = '-' + item;

        if (item == 0){
            suffix = "";
        }

        json[item].fileName = fileName + suffix;
        loadFile(templatePath,function(err,content, currFile){
            if (err) { throw e};
            doc=new Docxtemplater(content);
            doc.setData( 
                currFile
            ) //set the templateVariables
            doc.render() //apply them (replace all occurences of {first_name} by Hipp, ...)
            var buf = doc.getZip().generate({type:"nodebuffer"});
            var file = {
                content: buf,
                name: currFile.fileName + ".docx"
            }
            ipcRenderer.send('write-file', file);
        }, json[item]);
    }
}

function infoMsg(msg){
    ipcRenderer.send('error-dialog', msg);
}

function getJsonForReplace() {
    
    var selected = window.selectFieldForJson.index;
    var sheetName = window.selectFieldForJson.sheetName; 
    var sheet = window.jsonTable[sheetName];

    var map = getMapField();
    var array = [];
    for(var item in selected){
        var index = selected[item];
        var record = sheet[index];
        var obj = {};
        for(var i in map){
            var key = map[i].key;
            var val = record[map[i].value];
            obj[key] = val;
        }

        array.push(obj);
    }

    return array;
}