import { Console } from "console";

class CsvGenerator{
    JSONToCSVConvertor = (JSONData: string, ReportTitle: string, ShowLabel: boolean) => {
        //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
        let arrData = JSON.parse(JSONData);
        let CSV = "";

        //This condition will generate the Label/Header
        if (ShowLabel) {
          let row = "";
    
          //This loop will extract the label from 1st index of on array
          for (let index in arrData.items[0]) {
            //Now convert each value to string and comma-separated
            row += index + ",";
          }
    
          row = row.slice(0, -1);
          
          //append Label row with line break
          CSV += row + "\r\n";
        }
    
        //1st loop is to extract each row
        for (let i = 0; i < arrData.items.length; i++) {
          let row = "";
    
          //2nd loop will extract each column and convert it in string comma-separated
          for (let index in arrData.items[i]) {
            row += '"' + arrData.items[i][index] + '",';
          }
    
          row.slice(0, row.length - 1);
    
          //add a line break after each row
          CSV += row + "\r\n";
        }
    
        if (CSV === "") {
          alert("Invalid data");
          return;
        }
    
        //Generate a file name
        let fileName = "";
        //this will remove the blank-spaces from the title and replace it with an underscore
        fileName += ReportTitle.replace(/ /g, "_");
    
        //Initialize file format you want csv or xls
        let uri = "data:text/csv;charset=utf-8," + escape(CSV);
    
        // Now the little tricky part.
        // you can use either>> window.open(uri);
        // but this will not work in some browsers
        // or you will not get the correct file extension
    
        //this trick will generate a temp <a /> tag
        let link = document.createElement("a");
        link.href = uri;
    
        //set the visibility hidden so it will not effect on your web-layout
        link.setAttribute("style", "visibility:hidden");
        link.download = fileName + ".csv";
    
        //this part will append the anchor tag and remove it after automatic click
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
}

const CsvGeneratorInstance = new CsvGenerator();

export default CsvGeneratorInstance;