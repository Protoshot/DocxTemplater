var emptyTemplate = {
    filePath: '',
    outDir: '',
    libreDir: '',
    tableFields: ["Ключ", "Значение"],
    tableData: [{"Ключ" : "", "Значение": ""}]
};
var template = configService.readConfig() || emptyTemplate;

var store = {
  debug: true,
  template: template,
  convertLibreOfficeCommmand : 'soffice --headless --convert-to pdf:writer_pdf_Export {FILE_PATH} --outdir {OUT_DIR}',
  setTemplateParam (key, newValue) {
    if (this.debug) console.log('устанавливается параметр ', key, newValue)
    this.template[key] = newValue
  },
  getTemplateParam (key) {
    return this.template[key];
  },
}