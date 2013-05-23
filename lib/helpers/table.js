/*
 * Clifier
 * https://github.com/CapMousse/clifier
 *
 * Copyright (c) 2013 Jeremy Barbe
 * Licensed under the WTFPL license.
 */

 'use strict';

module.exports = function(headers, rows){
    if (void(0) === headers || void(0) === rows){
        return; 
    }

    var output = "";
    var colLength = headers.length;
    var rowLength = rows.length;
    var i = 0;
    var j = 0;
    var colsWidth = [];
    var str;

    for (; i < colLength; i++) {
        for(j = 0 ; j < rowLength; j++) {
            str = rows[j][i].toString().length;

            if (void(0) === colsWidth[i]) {
                colsWidth[i] = str;
                continue;
            }

            if (colsWidth[i] < str) {
                colsWidth[i] = str; 
            }
        }

        if (colsWidth[i] < headers[i].toString().length) {
            colsWidth[i] = headers[i].toString().length; 
        }
    }


    //setup header
    for (i = 0; i < 3; i++ ) {
        output += (1 !== i)  ? "+-" : "|";

        for (j = 0; j < colLength; j++){
            if (1 !== i) {
                if (0 !== j) {
                    output += "-";
                }

                output += '-'.repeat(colsWidth[j]) + "-+";
                continue;
            } else {
                output += ' ';
            }

            output += headers[j];
            str = headers[j].toString();

            if (colsWidth[j] > str.length) {
                output += ' '.repeat(colsWidth[j]-str.length);
            }

            output += (1 !== i)  ? "-+-" : " |";
        }

        output += "\n";
    }

    //setup body
    for (i = 0; i < rowLength; i++ ) {
        output += "| ";

        for (j = 0; j < colLength; j++){
            output += rows[i][j];
            str = rows[i][j].toString();

            if (colsWidth[j] > str.length) {
                output += ' '.repeat(colsWidth[j]-str.length);
            }

            if (j < colLength-1) {
                output += " | ";
            }
        }

        output += " |\n";
    }

    output += (output.split("\n").shift()) + "\n";

    console.log(output);
};