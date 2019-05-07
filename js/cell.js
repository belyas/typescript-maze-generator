(function(win){
    // Assign Cell class
    win.Cell = class Cell {
        constructor (type) {
            this.value = type; // wall or a normal way
            this.row = null;
            this.col = null;
        }

        getColor () {
            // TODO switch: for more conditions
            return this.value === 'w' ? '#212121' : (this.value === 'e' ? '#fff' : 'gray');
        }

        setPosition (row, col) {
            this.row = row;
            this.col = col;
        }
    }
})(window);