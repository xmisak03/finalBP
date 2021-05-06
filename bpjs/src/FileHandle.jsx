import XLSX from "xlsx";

export var header = [];
 
let fileReader;

// get header form csv format
const handleFileReadCsv = (e) => {
    var content = fileReader.result;
    header = content.split('\n').shift();
    if (header.indexOf(",") > -1){
        header = header.split(",").filter(e => e !== "");
    }
    else if (header.indexOf(";") > -1){
        header = header.split(";").filter(e => e !== "");
    }
    else if (header.indexOf('\t') > -1){
        header = header.split('\t').filter(e => e !== "");
    }
    else if (header.indexOf(' ') > -1){
        header = header.split(' ').filter(e => e !== "");
    }
    else {
        header = [header]
    }
    header.shift();
    document.getElementById('coloringSection').style.display='block'
    document.getElementById('coloringSectionPCoA').style.display='block'
};

// get header form json format
const handleFileReadJson = (e) => {
    var content = JSON.parse([fileReader.result]);
    for(var key in content[0]) 
        header.push(key);  
    document.getElementById('coloringSection').style.display='block'
    document.getElementById('coloringSectionPCoA').style.display='block'
};

// get header form biom format
const handleFileReadBiom = (e) => {
    try{
        var metadata
        var content = fileReader.result;
        var obj = JSON.parse(content)
        for (const item in obj.columns){
            metadata = obj.columns[item].metadata;
            for (const meta in metadata) {
                if (header.indexOf(meta) < 0){
                    header.push(meta)
                } 
            }
        }
        for (const item in obj.rows){
            metadata = obj.columns[item].metadata;
            for (const meta in metadata) {
                if (header.indexOf(meta) < 0){
                    header.push(meta)
                } 
            }
        } 
    }
    catch(error){
        alert("WRONG FORMAT BIOM FILE");
    }    
};

// select the appropriate file processing method
export const handleFileChosen = (e, file, pro) => {
    document.getElementById('downloadPCA').style.display='none'
    document.getElementById('downloadPCoA').style.display='none'
    pro.coloring = ''
    header = []
    fileReader = new FileReader();

    if(file === undefined){
        return;
    }
    // get header form excel format
    if (file.name.toString().indexOf(".xlsx") > -1 || file.name.toString().indexOf(".xls") > -1){
        fileReader.onload = function(e) {
            var data = e.target.result;
            var workbook = XLSX.read(data, {
                type: 'binary'
            });
        
            workbook.SheetNames.forEach(function(sheetName) {
                var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                var json_object = JSON.stringify(XL_row_object);
                var element = JSON.parse(json_object);
                header = [];
                for (var key in element[0]) {
                    header.push(key);
                }
            })
            header.shift();
            document.getElementById('coloringSection').style.display='block'
            document.getElementById('coloringSectionPCoA').style.display='block'
            };
        fileReader.readAsBinaryString(file);
    }
    
    else{
        if (file.name.toString().indexOf(".json") > -1){
            fileReader.onloadend = handleFileReadJson;
            fileReader.readAsText(file);
        }
        else if (file.name.toString().indexOf(".csv") > -1 || file.name.toString().indexOf(".data") > -1
                || file.name.toString().indexOf(".txt") > -1 || file.name.toString().indexOf(".tsv") > -1){
            fileReader.onloadend = handleFileReadCsv;
            fileReader.readAsText(file);
        }
        else if (file.name.toString().indexOf(".biom") > -1){
            fileReader.onloadend = handleFileReadBiom;
            fileReader.readAsText(file);
        }
        else{
            alert("WRONG FORMAT OF FILE");
        }
    }
};
