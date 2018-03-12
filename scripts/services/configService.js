var fs = require('fs');
var jsonData = require('../../config/config.json');

var configService = {
  getInitConfig : function(){
    for(var i in jsonData){
      if(jsonData[i].init){
	    return jsonData[i];
      }
    }
    return null;
  },
  
  readConfig : function(){
    return jsonData;
  },
  
  writeConfig : function(template){
    for(var i in jsonData){
      var name = jsonData[i].name;
      if(name == template.name) jsonData[i] = template;
      break;
    }
     
    fs.writeFile('config.json', JSON.stringify(jsonData), (err) => {  
	if (err) throw err;
    });
  
  }
}

module.exports = configService;