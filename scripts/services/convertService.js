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