/*
Name: Aidan Scribner
Email: Aidan_Scribner@student.uml.edu
Student ID: 01808608
*/

var minCol;
var maxCol;
var minRow;
var maxRow;
var count = 0;
var check = 0;

//new validation method for checking if the upper bound is greater than or equal to the lower bound
$.validator.addMethod("ge", 
function(value, element, param) {
    return this.optional(element) || $(param).val() == "" || parseInt(value) >= parseInt($(param).val());
},
"Value is less than lower bound. Enter a higher number.");

/* Gone never to be used again
$.validator.addMethod("le", 
function(value, element, param) {
    return this.optional(element) || $(param).val() == "" || parseInt(value) <= parseInt($(param).val());
},
"Value is greater than upper bound. Enter a lower number.");
*/

$.validator.addMethod("intCheck", 
function(value, element) {
    var regex=/^[-1-9]?[0-9]+$/;
   /* if ((value - parseInt(value)) > 0) {
        return false;
    } */
    return this.optional(element) || value.match(regex) ;
},
"Input not valid. Enter a whole number between -50 and 50.");


$(document).ready(function(){
    
    //validate the form for all of the values
    $('#table_range').validate({
        errorClass: "errors",
        validClass: "valids",
        onclick: true,
        rules: {
            min_col: {
                required: true,
                intCheck: true,
                min: -50,
                max: 50
            },
            max_col: {
                required: true,
                intCheck: true,
                min: -50,
                max: 50,
                ge: "#min_col"
            },
            min_row: {
                required: true,
                intCheck: true,
                min: -50,
                max: 50
            },
            max_row: {
                required: true,
                intCheck: true,
                min: -50,
                max: 50,
                ge: "#min_row"
            }
        }
    }); 

    $('#table_range').submit(function () {
        return false;
    });
    
});

function makeTable() { //table creation function definition
    //check = 0; //if equals 1 then there is invalid input and function returns 
    //Setup Input START
    //multiply all input by 1 to make sure they convert to numbers

    //alert($("#table_range").valid());
    
    minCol = parseInt(document.getElementById('min_col').value);
    maxCol = parseInt(document.getElementById('max_col').value);
    minRow = parseInt(document.getElementById('min_row').value);
    maxRow = parseInt(document.getElementById('max_row').value);
    

    if(!($("#table_range").valid())){
        return;
    } 
    //Setup Input END

    
    const table = document.createElement("table"); //creates table element

    //Column Header SECTION START
    const colHeaderRow = document.createElement("tr"); //This is a row for the headers in the columns

    //This creates a blank space START
    const blankSpace = document.createElement("th"); //new header for blank space

    //blank space "text"
    const blankText = document.createTextNode(" ");
    blankSpace.appendChild(blankText);

    //style blank space
    blankSpace.style.backgroundColor = "white";

    colHeaderRow.appendChild(blankSpace); //add blank
    //Blank Space END

    for(let currentCol = minCol; currentCol <= maxCol; currentCol++){ 
        //This creates the header for each Column
        const colHeader = document.createElement("th"); //new header

        //header text
        const colHeaderText = document.createTextNode(currentCol.toString());
        colHeader.appendChild(colHeaderText);

        //style header
        colHeader.style.border = "2px solid black";
        colHeader.style.backgroundColor = "red";
        colHeaderRow.appendChild(colHeader); //add header
        //Column header END

        colHeaderRow.appendChild(colHeader);
    }

    table.appendChild(colHeaderRow);//Adds column header
    //Column Header SECTION END

    //This for-loop iterates over the rows
    for(let currentRow = minRow; currentRow <= maxRow; currentRow++ ){
        const row = document.createElement("tr"); 

        //This creates the header for each row
        const rowHeader = document.createElement("th"); //new header

        //header text
        const rcnText = document.createTextNode(currentRow.toString());
        rowHeader.appendChild(rcnText);

        //style header
        rowHeader.style.border = "2px solid black";
        rowHeader.style.columnWidth = "40px";
        rowHeader.style.padding = "2px";
        rowHeader.style.backgroundColor = "red";
        row.appendChild(rowHeader); //add header
        //Row header END

        //This for-loop fills in each column
        for(let currentCol = minCol; currentCol <= maxCol; currentCol++){
            const cell = document.createElement("td"); //new cell
            
            const num = currentRow * currentCol; //calculate cell

            //adds text to the cell
            const cellText = document.createTextNode(num.toString()); 
            cell.appendChild(cellText);

            //styles the cells
            cell.style.border = "2px solid black";
            cell.style.columnWidth = "40px";
            cell.style.padding = "2px";
            cell.style.textAlign = "center";

            row.appendChild(cell); //adds the cell to end of the line of cells
        } //Column For-Loop END

        table.appendChild(row); //Adds the row to the table
    }

    const tableElement = document.getElementById('table'); //gets table div

    //table.setAttribute("border", 2); //table border

    //If statement to check whether a table already exists
    if(count > 0){ //replaces current table
        tableElement.replaceChild(table, tableElement.lastChild);
    } else { //creates table if one doesnt exist
        tableElement.appendChild(table);
        count++;
    }
}