function loadExcelJson(file) {
  // load excel to json data
  return new Promise((resolve, reject) => {
    let data = [];
    let reader = new FileReader();
    reader.onload = async function(e) {
      let obj = e.target.result;
      var workbook = await XLSX.read(obj, { type: "binary" });
      workbook.SheetNames.forEach(function(sheetName) {
        // Here is your object
        let XL_row_object = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { raw: false, defval: "" });
        if (XL_row_object.length > 0) {
          data.push(XL_row_object);
        }
      });
      resolve({ success: true, data: data });
    };
    reader.onerror = reject;
    reader.readAsBinaryString(file);
  });
}
