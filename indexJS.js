/*
Name: Aidan Scribner
Email: Aidan_Scribner@student.uml.edu
Student ID: 01808608
*/

//table ranges
var minCol;
var maxCol;
var minRow;
var maxRow;
var count = 0; //variable for checking if a table already exists

var check = 0; //deprecated

var tabId = "tab"; //base id for a new tab
var tabTable; //table to be stored in a tab

//new validation method for checking if the upper bound is greater than or equal to the lower bound
$.validator.addMethod("ge", 
function(value, element, param) {
    return this.optional(element) || $(param).val() == "" || parseInt(value) >= parseInt($(param).val());
},
"Value is less than lower bound. Enter a higher number.");

//checks the input for non whole numbers
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

    //options for the column slider 
    var colSliderOpt = {
        max: 50,
        min: -50,
        values: [-25,25],
        range: true,
        slide: function() {
            var minMax = $('#colSlider').slider("values");
            $('#min_col').val(minMax[0]);
            $('#max_col').val(minMax[1]);
            makeTable();
        }
    }
    $('#colSlider').slider(colSliderOpt);

    //options for the row slider
    var rowSliderOpt = {
        max: 50,
        min: -50,
        values: [-25,25],
        range: true,
        slide: function() {
            var minMax = $('#rowSlider').slider("values");
            $('#min_row').val(minMax[0]);
            $('#max_row').val(minMax[1]);
            makeTable();
        }
    }
    $('#rowSlider').slider(rowSliderOpt);

    //Sets the inital values to the values of the sliders
    $('#min_col').val($('#colSlider').slider("values")[0]);
    $('#max_col').val($('#colSlider').slider("values")[1]);
    $('#min_row').val($('#rowSlider').slider("values")[0]);
    $('#max_row').val($('#rowSlider').slider("values")[1]);

    //functions to change the sliders when the text input changes
    //min col change
    $('#min_col').change(function() {
        if(($("#table_range").valid())){
            let minVal = $(this).val();
            let maxVal = $('#max_col').val();
            $('#colSlider').slider("option","values", [minVal, maxVal]);
            makeTable();
        }
    });

    //max col change
    $('#max_col').change(function() {
        if(($("#table_range").valid())){
            let minVal = $(this).val();
            let maxVal = $('#max_col').val();
            $('#colSlider').slider("option","values", [minVal, maxVal]);
            makeTable();
        }
    });

    //min row change
    $('#min_row').change(function() {
        if(($("#table_range").valid())){
            let minVal = $(this).val();
            let maxVal = $('#max_row').val();
            $('#rowSlider').slider("option","values", [minVal, maxVal]);
            makeTable();
        }
    });
    
    //max row change
    $('#max_row').change(function() {
        if(($("#table_range").valid())){
            let minVal = $(this).val();
            let maxVal = $('#max_row').val();
            $('#rowSlider').slider("option","values", [minVal, maxVal]);
            makeTable();
        }
    });
    //text changing sliders functions END

    var numTabs = 0; //keeps track of the number of tabs
    $("#tableTabs").tabs(); //creates tabs
    
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

    
    //once the submit button is hit this function is executed
    //it add the current table to the tabs and makes sure the screen doesn't refresh
    $('#table_range').submit(function () {
       // makeTable();
        if(($("#table_range").valid())){
            tabTable = document.getElementById('table').lastChild.cloneNode(true);
            var tabIdHash = "#" + tabId + numTabs;
            $('#tableTabs > ul').append(`<li><a href="${tabIdHash}">(${minCol} to ${maxCol}) by (${minRow} to ${maxRow})</a></li>`);
            $('#tableTabs').append(`<div id=${tabId + numTabs} style="height: 400px" class="col-md-12 overflow-auto mt-2"></div>`);
            $(`${tabIdHash}`).append(tabTable);
            $('#tableTabs').tabs('refresh');
            numTabs += 1;
        }
        return false;
    });
    
    /*
    removes the tabs selected by taking in an array and spliting it using a regex
    then it sorts the array to be in order. Finally removes the items from the back to
    avoid the shift of indices when each element is removed
    */
    $('#removeBtn').click(function(){
        let tabsInput = $('#rmTab').val();
        let tabsArray = tabsInput.split(/[, ]+/);
        tabsArray.sort();
        for(let i = tabsArray.length - 1; i >= 0; i--){
            let tabIndex = parseInt(tabsArray[i]);
            $("#tableTabs").find(`.ui-tabs-nav li:eq(${tabIndex})`).remove();
        }
        $("#tableTabs").tabs("refresh");
    });


    makeTable();
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