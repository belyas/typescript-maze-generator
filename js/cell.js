(function (win) {
    // Assign Cell class
    win.Cell = class Cell {
        constructor (type) {
            this.value = type; // wall or a normal way
            this.row = null;
            this.col = null;
        }

        getColor () {
            let color;

            switch (this.value) {
            case 'w':
                color = '#212121';
                break;
            case 'e':
                color = '#fff';
                break;
            case 's':
                color = '#22cc5b';
                break;
            case 'f':
                color = '#e52727';
                break;
            default:
                color = 'gray';
                break;
            }

            return color;
        }

        setPosition ({ r = 0, c = 0 }) {
            this.row = r;
            this.col = c;
        }
    };
})(window);
