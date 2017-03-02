'use strict';

class Table {
    /**
     * Display a table
     * @param  {Array} headers
     * @param  {Array} rows
     * @param  {Boolean}
     */
    constructor (headers, rows) {
        if (undefined === headers || undefined === rows) {
            throw new Error("Headers or rows can't be empty");
        }

        this._headers   = headers;
        this._rows      = rows;
        this._output    = "";
        this._colLength  = headers.length;
        this._rowLength  = rows.length;
        this._colsWidth  = [];

        this.getColsWidth();
        this.setHeader();
        this.setBody();
    }

    getColsWidth () {
        var i = 0,
            j = 0,
            str;

        for (; i < this._colLength; i++) {
            for(j = 0 ; j < this._rowLength; j++) {
                str = this._rows[j][i].toString().length;

                if (undefined === this._colsWidth[i]) {
                    this._colsWidth[i] = str;
                    continue;
                }

                if (this._colsWidth[i] < str) {
                    this._colsWidth[i] = str; 
                }
            }

            if (this._colsWidth[i] < this._headers[i].toString().length) {
                this._colsWidth[i] = this._headers[i].toString().length; 
            }
        }
    }

    setHeader () {
        var str;

        for (var i = 0; i < 3; i++ ) {
            this._output += (1 !== i)  ? "+-" : "|";

            for (var j = 0; j < this._colLength; j++){
                if (1 !== i) {
                    if (0 !== j) {
                        this._output += "-";
                    }

                    this._output += '-'.repeat(this._colsWidth[j]) + "-+";
                    continue;
                } else {
                    this._output += ' ';
                }

                this._output += this._headers[j].toString();
                str = this._headers[j].toString();

                if (this._colsWidth[j] > str.length) {
                    this._output += ' '.repeat(this._colsWidth[j]-str.length);
                }

                this._output += (1 !== i)  ? "-+-" : " |";
            }

            this._output += "\n";
        }
    }

    setBody () {
        var str;

        //setup body
        for (var i = 0; i < this._rowLength; i++ ) {
            this._output += "| ";

            for (var j = 0; j < this._colLength; j++){
                this._output += this._rows[i][j];
                str = this._rows[i][j].toString();

                if (this._colsWidth[j] > str.length) {
                    this._output += ' '.repeat(this._colsWidth[j]-str.length);
                }

                if (j < this._colLength-1) {
                    this._output += " | ";
                }
            }

            this._output += " |\n";
        }

        this._output += (this._output.split("\n").shift()) + "\n";
    }

    /**
     * @return {String}
     */
    getOutput () {
        return this._output;
    }
}

module.exports = Table;