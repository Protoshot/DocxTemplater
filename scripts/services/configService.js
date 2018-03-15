var fs = require('fs');
var path = require('path');
var appDir = path.dirname(require.main.filename);
const CONFIG_FILE_PATH = appDir + store.configJsonPath;

var jsonData = null
try {
  jsonData = require(CONFIG_FILE_PATH);
} catch (e) {
  console.log("invalid jsonConfig")
}


var configService = {  
  readConfig : function(){
    return jsonData;
  },
  
  writeConfig : function(config){     
    fs.writeFile(CONFIG_FILE_PATH,  JSON.stringify(config), (err) => {  
    	if (err) throw err;
      console.log("saved config");
    });
  
  }
}

module.exports = configService;