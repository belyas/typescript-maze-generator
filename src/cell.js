var Cell = /** @class */ (function () {
    function Cell(type) {
        this.value = type;
        this.row = null;
        this.col = null;
    }
    /**
     * Get cell specific color
     *
     * @return string
     */
    Cell.prototype.getColor = function () {
        var color;
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
    };
    /**
     * Set cell's row|colun
     *
     * @return void
     */
    Cell.prototype.setPosition = function (position) {
        this.row = position.row;
        this.col = position.col;
    };
    return Cell;
}());
;
